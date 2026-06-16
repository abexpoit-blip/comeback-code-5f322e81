import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { fetchIpv4 } from "@/lib/fetch-ipv4";

/**
 * Plisio callback verification (form-encoded HMAC).
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
    const res = await fetchIpv4(`https://api.plisio.net/api/v1/operations/${encodeURIComponent(txnId)}?api_key=${encodeURIComponent(apiKey)}`);
    const json = await res.json() as {
      status?: string;
      data?: {
        status?: string;
        order_number?: string;
        source_amount?: string;
        source_currency?: string;
      };
    };
    if (json.status === "success" && json.data) return json.data;
  } catch (e) {
    console.error("[plisio] fetch operation failed", e);
  }
  return null;
}

// C5 FIX: Single UPDATE instead of two — eliminates the race window where
// plan_slug was applied but quota fields still held old values.
async function applyPackageToProfile(
  userId: string,
  pkg: { slug: string; click_quota: number | null; link_limit: number | null },
) {
  const now = new Date();
  const resetAt = now.toISOString();
  const isLifetime = pkg.slug === "lifetime" || pkg.slug === "unlimited";
  const expiresAt = isLifetime
    ? null
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan_slug: pkg.slug,
      click_quota: pkg.click_quota,
      link_limit: pkg.link_limit,
      clicks_used: 0,
      clicks_period_start: resetAt,
      plan_started_at: resetAt,
      plan_expires_at: expiresAt,
    } as any)
    .eq("id", userId);
  if (error) throw error;
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
            for (const k of Object.keys(j)) {
              body[k] = typeof j[k] === "string" ? j[k] : JSON.stringify(j[k]);
            }
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

        // C4 FIX: VERIFY FIRST, log only after verification succeeds.
        // Previously raw_body was logged before any signature check, letting
        // anyone spam plisio_event_logs.
        let verified = false;

        if (!isJson) {
          // Form-encoded path: HMAC verify with shared secret.
          verified = verifyFormHash(body, apiKey);
        }

        // For JSON payloads (or when form-hash fails), confirm against Plisio
        // API. CRITICAL: also confirm the operation's order_number matches the
        // order_number in the callback body — otherwise an attacker could
        // submit any known-completed txn_id paired with THEIR own pending
        // order_number and trick us into marking it paid.
        if (!verified && txnId) {
          const op = await fetchPlisioOperation(txnId, apiKey);
          if (op) {
            const opOrder = op.order_number;
            if (orderNumber && opOrder && opOrder === orderNumber) {
              if (op.status) status = op.status;
              verified = true;
            } else {
              console.warn(
                "[plisio] order_number mismatch — callback claims",
                orderNumber,
                "but Plisio op has",
                opOrder,
              );
            }
          }
        }

        if (!verified) {
          return new Response("invalid signature", { status: 401 });
        }

        // Now safe to log the verified event.
        // L4 FIX: capture the inserted row id so the later processed_at update
        // targets *this* log row, not every prior pending/completed row that
        // happens to share the same txn_id.
        let logRowId: string | null = null;
        try {
          const { data: inserted } = await supabaseAdmin
            .from("plisio_event_logs")
            .insert({
              txn_id: txnId,
              order_number: orderNumber,
              status: status,
              raw_body: body,
            })
            .select("id")
            .single();
          logRowId = (inserted as any)?.id ?? null;
        } catch (logErr) {
          console.error("[plisio] logging failed", logErr);
        }


        // H6 FIX: "mismatch" means user paid less than invoiced amount.
        // Do NOT auto-grant full package — that's revenue loss. Mark order as
        // 'underpaid' so admin can manually review and decide.
        const internalStatus =
          status === "completed" || status === "success" || status === "finished"
            ? "paid"
          : status === "mismatch"
            ? "underpaid"
          : status === "expired" || status === "cancelled" || status === "error"
            ? "expired"
          : status;

        // FIND ORDER (with recovery from previous logs)
        let userId = "";
        let packageSlug = "";

        let req: any = null;
        try {
          const { data } = await supabaseAdmin
            .from("upgrade_requests")
            .select("id, user_id, package_slug, status")
            .eq("id", orderNumber)
            .maybeSingle();
          req = data;
        } catch (e) {
          console.error("[plisio] upgrade_requests query failed", e);
        }

        if (!req) {
          console.warn("[plisio] recovery: order missing from DB", { txnId, orderNumber });
          let previousLog: any = null;
          try {
            const { data } = await supabaseAdmin
              .from("plisio_event_logs")
              .select("order_number")
              .eq("txn_id", txnId)
              .not("order_number", "is", null)
              .maybeSingle();
            previousLog = data;
          } catch (_e) {}

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
        } else {
          userId = req.user_id;
          packageSlug = req.package_slug;
        }

        // UPDATE ORDER AND APPLY PACKAGE
        if (req) {
          await supabaseAdmin
            .from("upgrade_requests")
            .update({ status: internalStatus })
            .eq("id", req.id);

          if (internalStatus === "paid" && req.status !== "paid") {
            const { data: pkg } = await supabaseAdmin
              .from("packages")
              .select("slug, click_quota, link_limit")
              .eq("slug", packageSlug)
              .single();
            if (pkg) {
              await applyPackageToProfile(userId, pkg);
              if (logRowId) {
                try {
                  await supabaseAdmin
                    .from("plisio_event_logs")
                    .update({ processed_at: new Date().toISOString() })
                    .eq("id", logRowId);
                } catch (_e) {}
              }
            }
          }
        }

        return new Response("ok");
      },
    },
  },
});
