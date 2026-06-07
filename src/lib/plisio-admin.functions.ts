import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const adminListPlisioLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    
    // We try to fetch from plisio_event_logs, but if the table is missing or 
    // there are schema cache issues, we return an empty array instead of 
    // crashing the whole tab list.
    try {
      const { data: logs, error } = await supabaseAdmin
        .from("plisio_event_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
        
      if (error) {
        console.error("[plisio-admin] query error:", error.message);
        return [];
      }

      const typedLogs = (logs || []) as any[];

      // Fetch user emails for the logs that have an order_number
      const orderIds = Array.from(new Set(typedLogs
        .map(l => l.order_number)
        .filter((id): id is string => !!id && id.length > 20)));

      if (orderIds.length > 0) {
        const { data: requests } = await supabaseAdmin
          .from("upgrade_requests")
          .select("id, user_id")
          .in("id", orderIds);
        
        const userIds = Array.from(new Set((requests ?? []).map(r => r.user_id)));
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .in("id", userIds);
            
          const emailMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.email]));
          const orderToUserMap = Object.fromEntries((requests ?? []).map(r => [r.id, r.user_id]));

          return typedLogs.map(l => ({
            ...l,
            user_email: l.order_number ? emailMap[orderToUserMap[l.order_number] || ""] : "Unknown"
          }));
        }
      }

      return typedLogs;
    } catch (e: any) {
      console.error("[plisio-admin] fatal log fetch error:", e.message);
      return [];
    }
  });

/**
 * Manually re-verify a single upgrade_request against the Plisio API and, if
 * Plisio reports the invoice as completed, mark it paid + upgrade the user's
 * package. Recovery path for orders where the webhook never fired.
 */
export const adminReverifyOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => d as { order_id: string })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.PLISIO_API_KEY;
    if (!apiKey) throw new Error("Plisio API key not configured");

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("upgrade_requests")
      .select("id, user_id, package_slug, status, plisio_invoice_id")
      .eq("id", data.order_id)
      .maybeSingle();
    if (reqErr || !req) throw new Error("Order not found");
    if (!req.plisio_invoice_id) throw new Error("No Plisio invoice id stored");

    const res = await fetch(
      `https://api.plisio.net/api/v1/operations/${encodeURIComponent(req.plisio_invoice_id)}?api_key=${encodeURIComponent(apiKey)}`,
    );
    const json: any = await res.json().catch(() => null);
    if (!json || json.status !== "success" || !json.data) {
      throw new Error(`Plisio lookup failed: ${json?.data?.message || json?.message || `HTTP ${res.status}`}`);
    }

    const plisioStatus = json.data.status as string;
    const isPaid = ["completed", "success", "finished", "mismatch"].includes(plisioStatus);
    const isFailed = ["expired", "cancelled", "error"].includes(plisioStatus);

    if (isPaid && req.status !== "paid") {
      const { data: pkg } = await supabaseAdmin
        .from("packages")
        .select("slug, click_quota, link_limit")
        .eq("slug", req.package_slug).single();
      if (pkg) {
        await supabaseAdmin.from("profiles").update({
          plan_slug: pkg.slug,
          click_quota: pkg.click_quota,
          link_limit: pkg.link_limit,
          clicks_used: 0,
          clicks_period_start: new Date().toISOString(),
        }).eq("id", req.user_id);
      }
      await supabaseAdmin.from("upgrade_requests")
        .update({ status: "paid" } as any).eq("id", req.id);
      return { ok: true, action: "upgraded", plisio_status: plisioStatus };
    }
    if (isFailed && req.status !== "expired") {
      await supabaseAdmin.from("upgrade_requests")
        .update({ status: "expired" } as any).eq("id", req.id);
      return { ok: true, action: "marked_expired", plisio_status: plisioStatus };
    }
    return { ok: true, action: "no_change", plisio_status: plisioStatus, db_status: req.status };
  });

/**
 * Bulk re-verify recent non-paid orders against Plisio and recover any that
 * are actually completed. Use after deploying the prod DB fix.
 */
export const adminBulkReverify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const apiKey = process.env.PLISIO_API_KEY;
    if (!apiKey) throw new Error("Plisio API key not configured");

    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: orders } = await supabaseAdmin
      .from("upgrade_requests")
      .select("id, user_id, package_slug, status, plisio_invoice_id")
      .gte("created_at", since)
      .in("status", ["expired", "pending", "new"])
      .not("plisio_invoice_id", "is", null)
      .limit(100);

    let recovered = 0, checked = 0;
    const details: any[] = [];

    for (const req of orders ?? []) {
      checked++;
      try {
        const res = await fetch(
          `https://api.plisio.net/api/v1/operations/${encodeURIComponent(req.plisio_invoice_id!)}?api_key=${encodeURIComponent(apiKey)}`,
        );
        const json: any = await res.json().catch(() => null);
        if (json?.status !== "success" || !json.data) continue;
        const plisioStatus = json.data.status as string;
        if (!["completed", "success", "finished", "mismatch"].includes(plisioStatus)) continue;

        const { data: pkg } = await supabaseAdmin.from("packages")
          .select("slug, click_quota, link_limit").eq("slug", req.package_slug).single();
        if (pkg) {
          await supabaseAdmin.from("profiles").update({
            plan_slug: pkg.slug,
            click_quota: pkg.click_quota,
            link_limit: pkg.link_limit,
            clicks_used: 0,
            clicks_period_start: new Date().toISOString(),
          }).eq("id", req.user_id);
        }
        await supabaseAdmin.from("upgrade_requests")
          .update({ status: "paid" } as any).eq("id", req.id);
        recovered++;
        details.push({ order: req.id, user: req.user_id, slug: req.package_slug, plisio_status: plisioStatus });
      } catch (e: any) {
        console.error("[bulk-reverify] error", req.id, e?.message);
      }
    }
    return { checked, recovered, details };
  });




