import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

// No longer used, pulling directly from package row


export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    
    // Use UTC midnight for Today stats to be accurate
    const now = new Date();
    const todayISO = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
    
    const [
      { count: users },
      { count: links },
      { data: globalClicks },
      { count: pending },
      { count: bannedUsers },
      { count: activeLinks },
      { count: todayTotal },
      { count: todayOurs },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("links").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("links").select("clicks_count, ours_clicks_count, offer_clicks_count, bot_clicks_count"),
      supabaseAdmin.from("upgrade_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
      supabaseAdmin.from("links").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
      supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("routed_to", "ours").gte("created_at", todayISO),
    ]);

    const globalClicksData = globalClicks ?? [];
    
    // Aggregating human clicks from the links table summary
    const humansTotalFromLinks = globalClicksData.reduce((s, l: any) => s + (Number(l.clicks_count) || 0), 0);
    const oursTotalFromLinks = globalClicksData.reduce((s, l: any) => s + (Number(l.ours_clicks_count) || 0), 0);
    const botsTotalFromLinks = globalClicksData.reduce((s, l: any) => s + (Number(l.bot_clicks_count) || 0), 0);
    const offerTotalFromLinks = globalClicksData.reduce((s, l: any) => s + (Number(l.offer_clicks_count) || 0), 0);

    // EMERGENCY FALLBACK: If link summary is 0 but we know there are clicks, query the clicks table directly
    // This solves the issue if the linking columns like 'ours_clicks_count' haven't updated yet.
    let humansTotal = humansTotalFromLinks;
    let oursTotal = oursTotalFromLinks;
    let botsTotal = botsTotalFromLinks;
    let offerTotal = offerTotalFromLinks;

    if (humansTotal === 0) {
      const { count: absoluteTotal } = await supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("is_bot", false);
      const { count: absoluteOurs } = await supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("is_bot", false).eq("routed_to", "ours");
      const { count: absoluteBots } = await supabaseAdmin.from("clicks").select("*", { count: "exact", head: true }).eq("is_bot", true);
      
      if ((absoluteTotal ?? 0) > 0) {
        humansTotal = absoluteTotal ?? 0;
        oursTotal = absoluteOurs ?? 0;
        botsTotal = absoluteBots ?? 0;
        offerTotal = (absoluteTotal ?? 0) - (absoluteOurs ?? 0);
      }
    }

    const monthISO = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data: paidRows } = await supabaseAdmin
      .from("upgrade_requests")
      .select("amount")
      .or("status.eq.paid,status.eq.completed,status.eq.success,status.eq.finished")
      .gte("created_at", monthISO);
    const mrr = (paidRows ?? []).reduce((s, r: any) => s + Number(r.amount || 0), 0);
    const { data: allPaid } = await supabaseAdmin
      .from("upgrade_requests")
      .select("amount")
      .or("status.eq.paid,status.eq.completed,status.eq.success,status.eq.finished");

    const totalRevenue = (allPaid ?? []).reduce((s, r: any) => s + Number(r.amount || 0), 0);

    return {
      users: users ?? 0,
      links: links ?? 0,
      active_links: activeLinks ?? 0,
      clicks: humansTotal,
      pending: pending ?? 0,
      ours: oursTotal,
      offer: offerTotal,
      bots: botsTotal,
      today_total: todayTotal ?? 0,
      today_ours: todayOurs ?? 0,
      banned_users: bannedUsers ?? 0,
      mrr_30d: mrr,
      total_revenue: totalRevenue,
    };
  });

export const adminClicksTimeseries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const days = 14;
    const fromISO = new Date(Date.now() - days * 86_400_000).toISOString();
    const { data } = await supabaseAdmin
      .from("clicks").select("created_at, routed_to, is_bot").gte("created_at", fromISO).limit(200000);
    const buckets: Record<string, { date: string; total: number; ours: number; offer: number; bots: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
      buckets[d] = { date: d, total: 0, ours: 0, offer: 0, bots: 0 };
    }
    (data ?? []).forEach((c: any) => {
      const d = (c.created_at as string).slice(0, 10);
      if (!buckets[d]) return;
      buckets[d].total++;
      if (c.is_bot) buckets[d].bots++;
      if (c.routed_to === "ours") buckets[d].ours++;
      if (c.routed_to === "offer") buckets[d].offer++;
    });
    return Object.values(buckets);
  });

export const adminTopCountries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const fromISO = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data } = await supabaseAdmin
      .from("clicks").select("country").gte("created_at", fromISO).limit(100000);
    const counts: Record<string, number> = {};
    (data ?? []).forEach((c: any) => {
      const k = c.country || "??";
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  });

export const adminTopUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("profiles").select("id, email, clicks_used, plan_slug").order("clicks_used", { ascending: false }).limit(10);
    return data ?? [];
  });

export const adminRevenueTimeseries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const fromISO = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data } = await supabaseAdmin
      .from("upgrade_requests").select("created_at, amount, status").gte("created_at", fromISO).eq("status", "paid");
    const buckets: Record<string, { date: string; revenue: number; count: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
      buckets[d] = { date: d, revenue: 0, count: 0 };
    }
    (data ?? []).forEach((r: any) => {
      const d = (r.created_at as string).slice(0, 10);
      if (!buckets[d]) return;
      buckets[d].revenue += Number(r.amount || 0);
      buckets[d].count++;
    });
    return Object.values(buckets);
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("profiles").select("*").order("created_at", { ascending: false }).limit(1000);
    if (error) throw new Error(error.message);
    const oursByUser: Record<string, number> = {};
    const { data: linkRows } = await supabaseAdmin.from("links").select("user_id, ours_clicks_count");
    (linkRows ?? []).forEach((l: any) => {
      oursByUser[l.user_id] = (oursByUser[l.user_id] ?? 0) + (l.ours_clicks_count ?? 0);
    });
    return (data ?? []).map((u: any) => ({ ...u, ours_clicks: oursByUser[u.id] ?? 0 }));
  });

export const adminBanUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), is_banned: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("profiles").update({ is_banned: data.is_banned } as any).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminBulkBan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ ids: z.array(z.string().uuid()).min(1).max(500), is_banned: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("profiles").update({ is_banned: data.is_banned } as any).in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true, updated: data.ids.length };
  });

export const adminResetUserQuota = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ ids: z.array(z.string().uuid()).min(1).max(500) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ clicks_used: 0, clicks_period_start: new Date().toISOString() } as any)
      .in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true, updated: data.ids.length };
  });

export const adminBulkSetPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ ids: z.array(z.string().uuid()).min(1).max(500), package_slug: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: pkg } = await supabaseAdmin
      .from("packages").select("*").eq("slug", data.package_slug).maybeSingle();
    if (!pkg) throw new Error("Package not found");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan_slug: pkg.slug,
        click_quota: pkg.click_quota,
        link_limit: pkg.link_limit,
        clicks_used: 0,
        clicks_period_start: new Date().toISOString(),
      } as any)
      .in("id", data.ids);

    if (error) throw new Error(error.message);
    return { ok: true, updated: data.ids.length };
  });

export const adminUserDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const [{ data: profile }, { data: links }, { data: payments }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", data.id).maybeSingle(),
      supabaseAdmin.from("links").select("*").eq("user_id", data.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("upgrade_requests").select("*").eq("user_id", data.id).order("created_at", { ascending: false }).limit(50),
    ]);
    const linkIds = (links ?? []).map((l: any) => l.id);
    const trend: { date: string; clicks: number; bots: number }[] = [];
    if (linkIds.length) {
      const fromISO = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const { data: cl } = await supabaseAdmin
        .from("clicks").select("created_at, is_bot").in("link_id", linkIds).gte("created_at", fromISO).limit(50000);
      const buckets: Record<string, { date: string; clicks: number; bots: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
        buckets[d] = { date: d, clicks: 0, bots: 0 };
      }
      (cl ?? []).forEach((c: any) => {
        const d = (c.created_at as string).slice(0, 10);
        if (!buckets[d]) return;
        buckets[d].clicks++;
        if (c.is_bot) buckets[d].bots++;
      });
      trend.push(...Object.values(buckets));
    }
    return { profile, links: links ?? [], payments: payments ?? [], trend };
  });

export const adminSetUserPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ user_id: z.string().uuid(), package_slug: z.string().min(1).max(64) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: pkg } = await supabaseAdmin
      .from("packages").select("*").eq("slug", data.package_slug).maybeSingle();
    if (!pkg) throw new Error("Package not found");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan_slug: pkg.slug,
        click_quota: pkg.click_quota,
        link_limit: pkg.link_limit,
        clicks_used: 0,
        clicks_period_start: new Date().toISOString(),
      } as any)
      .eq("id", data.user_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("packages").select("*").eq("is_active", true).order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const adminListAllPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("packages").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertPackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({
    id: z.string().uuid().optional(),
    slug: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/),
    name: z.string().min(1).max(120),
    price_usd: z.number().min(0).max(100000),
    click_quota: z.number().int().min(0).nullable(),
    link_limit: z.number().int().min(0).nullable(),
    sort_order: z.number().int().min(0).max(1000),
    is_active: z.boolean(),
  }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload: any = {
      slug: data.slug,
      name: data.name,
      price_usd: data.price_usd,
      price_monthly: data.price_usd,
      click_quota: data.click_quota,
      link_limit: data.link_limit,
      sort_order: data.sort_order,
      is_active: data.is_active,
    };

    if (data.id) {
      const { error } = await supabaseAdmin.from("packages").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("packages").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeletePackage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("packages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUpgradeRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    
    // Auto-expire very old pending requests (> 24 hours) to keep list clean
    // Removed the aggressive 35-min expiry which was hiding active orders
    const expiryCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from("upgrade_requests")
      .update({ status: "expired" } as any)
      .eq("status", "pending")
      .lt("created_at", expiryCutoff);

    const { data, error } = await supabaseAdmin
      .from("upgrade_requests")
      .select("id, user_id, package_slug, amount, status, plisio_invoice_id, plisio_invoice_url, created_at")
      .order("created_at", { ascending: false })

      .limit(500);
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((data ?? []).map((r: any) => r.user_id)));
    let emailMap: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: profs } = await supabaseAdmin
        .from("profiles").select("id, email").in("id", ids);
      emailMap = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p.email ?? ""]));
    }
    return (data ?? []).map((r: any) => ({ ...r, email: emailMap[r.user_id] ?? "" }));
  });


export const adminDecideUpgradeRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), decision: z.enum(["approve", "reject"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: req, error: rErr } = await supabaseAdmin
      .from("upgrade_requests").select("*").eq("id", data.id).maybeSingle();
    if (rErr || !req) throw new Error("Request not found");
    if (req.status !== "pending") throw new Error(`Request already ${req.status}`);

    if (data.decision === "reject") {
      const { error } = await supabaseAdmin.from("upgrade_requests").update({ status: "rejected" } as any).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const { data: pkg } = await supabaseAdmin.from("packages").select("*").eq("slug", req.package_slug).maybeSingle();
    if (!pkg) throw new Error("Package not found");

    const { error: uErr } = await supabaseAdmin
      .from("upgrade_requests").update({ status: "paid" } as any).eq("id", data.id);
    if (uErr) throw new Error(uErr.message);

    const { error: pErr } = await supabaseAdmin
      .from("profiles")
      .update({
        plan_slug: pkg.slug,
        click_quota: pkg.click_quota,
        link_limit: pkg.link_limit,
        clicks_used: 0,
        clicks_period_start: new Date().toISOString(),
      } as any)
      .eq("id", req.user_id);

    if (pErr) throw new Error(pErr.message);

    return { ok: true };
  });

export const adminListLinks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, email");
    const emailMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.email]));
    
    const { data, error } = await supabaseAdmin
      .from("links")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    
    return (data ?? []).map((l: any) => ({
      ...l,
      owner_email: emailMap[l.user_id] ?? "unknown"
    }));
  });

export const adminToggleLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("links")
      .update({ is_active: data.is_active, status: data.is_active ? "active" : "paused" } as any)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), title: z.string().nullable(), adsterra_url: z.string(), safe_url: z.string() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("links")
      .update({ title: data.title, adsterra_url: data.adsterra_url, safe_url: data.safe_url } as any)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("links").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListBotRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("bot_rules").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertBotRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid().optional(), rule_type: z.string(), pattern: z.string(), label: z.string().nullable(), is_active: z.boolean() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("bot_rules").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("bot_rules").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteBotRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("bot_rules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCloakingRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("cloaking_rules").select("*").order("priority");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertCloakingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid().optional(), rule_type: z.string(), pattern: z.string(), label: z.string().nullable(), action: z.string(), priority: z.number(), is_active: z.boolean() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("cloaking_rules").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("cloaking_rules").insert(data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteCloakingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("cloaking_rules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCountryTiers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("country_tiers").select("*").order("tier");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertCountryTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ country_code: z.string(), tier: z.number(), country_name: z.string().nullable() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("country_tiers").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteCountryTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ country_code: z.string() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("country_tiers").delete().eq("country_code", data.country_code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminImpersonate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ user_id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { data: target } = await supabaseAdmin.from("profiles").select("*").eq("id", data.user_id).single();
    if (!target) throw new Error("Target user not found");

    // Generate a secure one-time magic link token for the target user
    const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: target.email!,
    });

    if (error) throw new Error(error.message);

    return { 
      hashed_token: linkData.properties.hashed_token, 
      target: { 
        id: target.id, 
        email: target.email || "unknown", 
        full_name: target.full_name 
      } 
    };
  });

export const adminListErrors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("error_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const adminErrorStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("error_logs").select("source, level, is_resolved, created_at");
    if (error) throw new Error(error.message);
    
    const now = Date.now();
    const last24h = (data ?? []).filter(e => now - new Date(e.created_at).getTime() < 86400000);
    const bySource: Record<string, number> = {};
    (data ?? []).forEach(e => bySource[e.source] = (bySource[e.source] || 0) + 1);
    
    return {
      total: data?.length || 0,
      open: data?.filter(e => !e.is_resolved).length || 0,
      last24h: last24h.length,
      bySource
    };
  });

export const adminResolveError = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid(), is_resolved: z.boolean() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("error_logs").update({ is_resolved: data.is_resolved } as any).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteError = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("error_logs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminClearResolvedErrors = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("error_logs").delete().eq("is_resolved", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetInactiveUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.rpc("admin_get_inactive_users" as never);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminRunMaintenance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.rpc("maintenance_purge_old_clicks" as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ ids: z.array(z.string().uuid()) }).parse)
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("profiles").delete().in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true };
  });