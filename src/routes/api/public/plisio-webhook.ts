import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Plisio callback verification.
 */
function verifyFormHash(body: Record<string, string>, apiKey: string): boolean {
  const verifyHash = body.verify_hash;
  if (!verifyHash) return false;
  const clone = { ...body };
  delete clone.verify_hash;
  const ordered = Object.keys(clone).sort().map((k) => clone[k]).join(":");
  const expected = createHash("md5").update(`${ordered}:${apiKey}`).digest("hex");
  return expected === verifyHash;
}

async function fetchPlisioOperation(txnId: string, apiKey: string) {
  try {
    const res = await fetch(`https://api.plisio.net/api/v1/operations/${encodeURIComponent(txnId)}?api_key=${encodeURIComponent(apiKey)}`);
    const json = await res.json() as { status?: string; data?: { status?: string; order_number?: string; source_amount?: string; source_currency?: string } };
    if (json.status === "success" && json.data) return json.data;
  } catch (e) {
    console.error("[plisio] fetch operation failed", e);
  }
  return null;
}

// Replaced by database-driven quota lookup in processing block


export const Route = createFileRoute("/api/public/plisio-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.PLISIO_API_KEY;
        if (!apiKey) {
          console.error("[plisio] PLISIO_API_KEY missing");
          return new Response("not configured", { status: 500 });
        }

        const rawText = await request.text();
        const body: Record<string, string> = {};
        let isJson = false;

        if (rawText.trim().startsWith("{")) {
          isJson = true;
          try {
            const j = JSON.parse(rawText);
            for (const k of Object.keys(j)) body[k] = typeof j[k] === "string" ? j[k] : JSON.stringify(j[k]);
          } catch (e) {
            console.error("[plisio] JSON parse failed", e);
            return new Response("bad json", { status: 400 });
          }
        } else {
          const params = new URLSearchParams(rawText);
          params.forEach((v, k) => { body[k] = v; });
        }

        const txnId = body.txn_id || body.id;
        const orderNumber = body.order_number;
        let status = body.status;

        // 1. LOG THE EVENT IMMEDIATELY (wrapped in try-catch to prevent schema issues from blocking processing)
        try {
          await supabaseAdmin.from("plisio_event_logs").insert({
            txn_id: txnId,
            order_number: orderNumber,
            status: status,
            raw_body: body,
          });
        } catch (logErr) {
          console.error("[plisio] logging failed", logErr);
        }


        // 2. VERIFY
        let verified = false;
        if (!isJson) {
          verified = verifyFormHash(body, apiKey);
        }

        if (!verified && txnId) {
          const op = await fetchPlisioOperation(txnId, apiKey);
          if (op) {
            if (op.status) status = op.status;
            verified = true;
          }
        }

        if (!verified) return new Response("invalid signature", { status: 401 });

        // Normalize internal status
        const internalStatus =
          status === "completed" || status === "mismatch" || status === "finished" || status === "success" ? "paid" :
          status === "expired" || status === "cancelled" || status === "error" ? "expired" :
          status;

        // 3. FIND OR CREATE MISSING ORDER
        let userId = "";
        let packageSlug = "";

        let { data: req } = await supabaseAdmin
          .from("upgrade_requests")
          .select("id, user_id, package_slug, status")
          .eq("id", orderNumber)
          .maybeSingle();

        if (req) {
          userId = req.user_id;
          packageSlug = req.package_slug;
        } else {
          // EMERGENCY RECOVERY: Order missing from DB but exists in Plisio callback
          console.warn("[plisio] recovery: order missing from DB, checking callback data", { txnId, orderNumber });
          
          // If Plisio didn't give us an orderNumber (uuid), we might have trouble, 
          // but we can look in our own logs for previous events with this txnId
          let previousLog = null;
          try {
            const { data } = await supabaseAdmin
              .from("plisio_event_logs")
              .select("order_number")
              .eq("txn_id", txnId)
              .not("order_number", "is", null)
              .maybeSingle();
            previousLog = data;
          } catch (e) {}


          
          const recoveryId = orderNumber || previousLog?.order_number;
          
          if (recoveryId) {
             const { data: recoveredReq } = await supabaseAdmin
              .from("upgrade_requests")
              .select("id, user_id, package_slug, status")
              .eq("id", recoveryId)
              .maybeSingle();
              
            if (recoveredReq) {
              req = recoveredReq;
              userId = req.user_id;
              packageSlug = req.package_slug;
              console.log("[plisio] recovered order for user", userId);
            }
          }
        }

        // 4. UPDATE ORDER AND APPLY PACKAGE
        if (req) {
          await supabaseAdmin
            .from("upgrade_requests")
            .update({ status: internalStatus, updated_at: new Date().toISOString() })
            .eq("id", req.id);

          if (internalStatus === "paid" && req.status !== "paid") {
            const { data: pkg } = await supabaseAdmin
              .from("packages").select("slug, click_quota, link_limit")
              .eq("slug", packageSlug).single();
            if (pkg) {
              await supabaseAdmin
                .from("profiles")
                .update({
                  plan_slug: pkg.slug,
                  click_quota: pkg.click_quota,
                  link_limit: pkg.link_limit,
                  clicks_used: 0,
                  clicks_period_start: new Date().toISOString(),
                })
                .eq("id", userId);

              
              try {
                await supabaseAdmin.from("plisio_event_logs")
                  .update({ processed_at: new Date().toISOString() })
                  .eq("txn_id", txnId);
              } catch (e) {}

            }
          }
        }

        return new Response("ok");
      },
    },
  },
});
