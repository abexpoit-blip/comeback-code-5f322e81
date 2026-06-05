import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type LinkRow = {
  id: string;
  user_id: string;
  short_code: string;
  title: string | null;
  clicks_count: number | null;
  bot_clicks_count: number | null;
  created_at: string;
  adsterra_url?: string | null;
  safe_url?: string | null;
  is_active?: boolean | null;
  destination_url?: string | null;
  adsterra_direct_link?: string | null;
  status?: string | null;
  prelanding_template?: string | null;
};

export type DashboardLink = ReturnType<typeof normalizeLink>;

function normalizeLink(row: LinkRow) {
  return {
    ...row,
    adsterra_url: row.adsterra_url ?? row.adsterra_direct_link ?? row.destination_url ?? "",
    safe_url: row.safe_url ?? (row.adsterra_direct_link ? row.destination_url : "https://sleepox.com/") ?? "https://sleepox.com/",
    is_active: row.is_active ?? row.status === "active",
  };
}

async function selectLinks(supabase: any): Promise<{ data: DashboardLink[] | null; error: { message: string } | null }> {
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return { data: null, error: { message: error.message } };
  return { data: (data ?? []).map((row: LinkRow) => normalizeLink(row)), error: null };
}

async function getProfileQuota(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("plan_slug, link_limit, links_used")
    .eq("id", userId)
    .single();
  if (error) return null;
  const plan = String(data?.plan_slug ?? "").toLowerCase();
  if (plan === "lifetime" || plan === "unlimited") {
    return { limit: null, used: data?.links_used ?? 0 };
  }
  return { limit: data?.link_limit ?? null, used: data?.links_used ?? 0 };
}

function randomCode(len = 6) {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const listMyLinks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await selectLinks(context.supabase);
    if (error) throw new Error(error.message);
    return data;
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [linksRes, profileRes, statsRes] = await Promise.all([
      selectLinks(context.supabase),
      context.supabase.from("profiles").select("*").eq("id", context.userId).single(),
      context.supabase.rpc("get_dashboard_stats" as never, { _user_id: context.userId } as never),
    ]);
    if (linksRes.error) throw new Error(linksRes.error.message);
    if (profileRes.error) throw new Error(profileRes.error.message);

    const links = linksRes.data ?? [];
    type DashStats = {
      clicksByDay: Record<string, number>;
      countryStats: Record<string, number>;
      mobilePct: number;
      uniqueVisitors: number;
      perLinkDaily: Record<string, number[]>;
    };
    const stats = (statsRes.data as DashStats | null) ?? {
      clicksByDay: {}, countryStats: {}, mobilePct: 0, uniqueVisitors: 0, perLinkDaily: {},
    };

    const perLinkDaily: Record<string, number[]> = {};
    for (const l of links) {
      const arr = stats.perLinkDaily?.[l.id];
      perLinkDaily[l.id] = Array.isArray(arr) && arr.length === 7
        ? arr.map(Number) : new Array(7).fill(0);
    }

    const clicksByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const k = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      clicksByDay[k] = Number(stats.clicksByDay?.[k] ?? 0);
    }

    return {
      links,
      profile: profileRes.data,
      stats: {
        clicksByDay,
        countryStats: stats.countryStats ?? {},
        mobilePct: Number(stats.mobilePct ?? 0),
        uniqueVisitors: Number(stats.uniqueVisitors ?? 0),
        perLinkDaily,
      },
    };
  });

export const createLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      title: z.string().max(200).optional(),
      adsterra_url: z.string().url(),
      safe_url: z.string().url().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const profile = await getProfileQuota(context.supabase, context.userId);
    if (profile && profile.limit !== null && profile.used >= profile.limit) {
      throw new Error(`Link limit reached (${profile.used}/${profile.limit}). Please upgrade.`);
    }

    let code = randomCode();
    for (let i = 0; i < 5; i++) {
      const { data: exists } = await context.supabase
        .from("links").select("id").eq("short_code", code).maybeSingle();
      if (!exists) break;
      code = randomCode();
    }

    const { data: linkData, error } = await context.supabase
      .from("links")
      .insert({
        user_id: context.userId,
        short_code: code,
        title: data.title ?? null,
        destination_url: data.safe_url ?? "https://sleepox.com/",
        adsterra_url: data.adsterra_url,
        safe_url: data.safe_url ?? "https://sleepox.com/",
        status: "active",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return normalizeLink(linkData as LinkRow);
  });

export const deleteLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: link, error: lookupError } = await context.supabase
      .from("links")
      .select("id")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    if (!link) throw new Error("Link not found");

    const { error } = await context.supabase.from("links").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("links")
      .update({ 
        is_active: data.is_active,
        status: data.is_active ? "active" : "paused"
      })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const TEMPLATE_VALUES = [
  "verify", "reward", "countdown", "article",
  "article_health", "article_news", "article_finance", "article_lifestyle",
  "article_tech", "article_celebrity", "article_business", "article_travel",
] as const;

export const updateLinkTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      prelanding_template: z.enum(TEMPLATE_VALUES),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("links")
      .update({ prelanding_template: data.prelanding_template })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });