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

function packageQuota(pkg: { slug?: string | null; click_quota?: number | null; link_limit?: number | null }) {
  const slug = String(pkg.slug ?? "").toLowerCase();
  if (slug === "lifetime" || slug === "unlimited") return { click_quota: null, link_limit: null };
  if (slug === "monthly" || slug === "pro_monthly") return { click_quota: 1_000_000, link_limit: 50 };
  if (slug === "free" || slug === "starter") return { click_quota: 10_000, link_limit: 1 };
  return { click_quota: pkg.click_quota ?? null, link_limit: pkg.link_limit ?? null };
}

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

        // 1. LOG THE EVENT IMMEDIATELY
        await supabaseAdmin.from("plisio_event_logs").insert({
          txn_id: txnId,
          order_number: orderNumber,
          status: status,
          raw_body: body,
        });

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
          // EMERGENCY RECOVERY: Order missing from DB but exists in Plisio
          console.warn("[plisio] recovery: order missing from DB, fetching from Plisio", { txnId });
          const opData = await fetchPlisioOperation(txnId!, apiKey);
          if (opData && opData.order_number) {
            // Check if user ID was passed in custom fields or if we can extract it
            // For now, if order_number is a UUID, we check if it matches a user's ID directly as a fallback
            // but usually order_number IS the upgrade_request ID. 
            // If it's still missing, we log it as processed_at = null for manual review.
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
              const quota = packageQuota(pkg);
              await supabaseAdmin
                .from("profiles")
                .update({
                  plan_slug: pkg.slug,
                  click_quota: quota.click_quota,
                  link_limit: quota.link_limit,
                  clicks_used: 0,
                  clicks_period_start: new Date().toISOString(),
                })
                .eq("id", userId);
              
              await supabaseAdmin.from("plisio_event_logs")
                .update({ processed_at: new Date().toISOString() })
                .eq("txn_id", txnId);
            }
          }
        }

        return new Response("ok");
      },
    },
  },
});
