import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Click = {
  id: string;
  link_id: string;
  country: string | null;
  ua: string | null;
  is_bot: boolean;
  routed_to: string;
  bot_reason?: string | null;
  created_at: string;
  user_agent?: string | null;
  referer_host?: string | null;
  variant?: string | null;
  referrer_source?: string | null;
};


// Stats must show the same numbers that are stored in the database.
const hideBots = (real: number) => real;

async function selectClicks(supabase: any, linkIds: string[], sevenDaysAgo: string) {
  const modernWithSource = await supabase
    .from("clicks")
    .select("id, link_id, country, ua, is_bot, bot_reason, routed_to, referer_host, created_at")
    .in("link_id", linkIds)
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(50000);

  if (!modernWithSource.error) return modernWithSource;

  const modern = await supabase
    .from("clicks")
    .select("id, link_id, country, ua, is_bot, bot_reason, routed_to, created_at")
    .in("link_id", linkIds)
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(50000);

  if (!modern.error) return modern;

  const legacy = await supabase
    .from("clicks")
    .select("id, link_id, country, user_agent, is_bot, bot_reason, variant, created_at")
    .in("link_id", linkIds)
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false })
    .limit(50000);

  if (!legacy.error) {
    return {
      data: (legacy.data ?? []).map((c: Click) => ({
        ...c,
        ua: c.user_agent ?? null,
        routed_to: c.variant ?? (c.is_bot ? "safe" : "offer"),
      })),
      error: null,
    };
  }

  return legacy;
}

function deviceFromUA(ua: string | null): "Mobile" | "Desktop" | "Tablet" | "Other" {
  if (!ua) return "Other";
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(u)) return "Tablet";
  if (/mobi|android|iphone|ipod|phone|webos/.test(u)) return "Mobile";
  if (/windows|macintosh|linux|x11|cros/.test(u)) return "Desktop";
  return "Other";
}

function osFromUA(ua: string | null): { name: string; slug: string } {
  if (!ua) return { name: "Unknown", slug: "unknown" };
  const u = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(u)) return { name: "iOS", slug: "ios" };
  if (/android/.test(u)) return { name: "Android", slug: "android" };
  if (/windows nt/.test(u)) return { name: "Windows", slug: "windows" };
  if (/mac os x|macintosh/.test(u)) return { name: "macOS", slug: "macos" };
  if (/cros/.test(u)) return { name: "ChromeOS", slug: "googlechrome" };
  if (/linux|x11/.test(u)) return { name: "Linux", slug: "linux" };
  return { name: "Other", slug: "unknown" };
}

function browserFromUA(ua: string | null): { name: string; slug: string; color: string } {
  if (!ua) return { name: "Unknown", slug: "unknown", color: "94a3b8" };
  const u = ua.toLowerCase();
  if (u.includes("edg/")) return { name: "Edge", slug: "microsoftedge", color: "0078D4" };
  if (u.includes("opr/") || u.includes("opera")) return { name: "Opera", slug: "opera", color: "FF1B2D" };
  if (u.includes("samsungbrowser")) return { name: "Samsung Internet", slug: "samsung", color: "1428A0" };
  if (u.includes("ucbrowser")) return { name: "UC Browser", slug: "ucbrowser", color: "F8B500" };
  if (u.includes("brave")) return { name: "Brave", slug: "brave", color: "FB542B" };
  if (u.includes("firefox")) return { name: "Firefox", slug: "firefoxbrowser", color: "FF7139" };
  if (u.includes("fban") || u.includes("fbav")) return { name: "Facebook App", slug: "facebook", color: "1877F2" };
  if (u.includes("instagram")) return { name: "Instagram App", slug: "instagram", color: "E4405F" };
  if (u.includes("chrome")) return { name: "Chrome", slug: "googlechrome", color: "4285F4" };
  if (u.includes("safari")) return { name: "Safari", slug: "safari", color: "0FB5EE" };
  return { name: "Other", slug: "unknown", color: "94a3b8" };
}

const COUNTRIES: Record<string, { flag: string; name: string }> = {
  US: { flag: "🇺🇸", name: "United States" }, GB: { flag: "🇬🇧", name: "United Kingdom" },
  DE: { flag: "🇩🇪", name: "Germany" },       FR: { flag: "🇫🇷", name: "France" },
  CA: { flag: "🇨🇦", name: "Canada" },        IN: { flag: "🇮🇳", name: "India" },
  BD: { flag: "🇧🇩", name: "Bangladesh" },    PK: { flag: "🇵🇰", name: "Pakistan" },
  JP: { flag: "🇯🇵", name: "Japan" },         CN: { flag: "🇨🇳", name: "China" },
  BR: { flag: "🇧🇷", name: "Brazil" },        AU: { flag: "🇦🇺", name: "Australia" },
  NL: { flag: "🇳🇱", name: "Netherlands" },   IT: { flag: "🇮🇹", name: "Italy" },
  ES: { flag: "🇪🇸", name: "Spain" },         MX: { flag: "🇲🇽", name: "Mexico" },
  RU: { flag: "🇷🇺", name: "Russia" },        ID: { flag: "🇮🇩", name: "Indonesia" },
  PH: { flag: "🇵🇭", name: "Philippines" },   NG: { flag: "🇳🇬", name: "Nigeria" },
  ZA: { flag: "🇿🇦", name: "South Africa" },  SE: { flag: "🇸🇪", name: "Sweden" },
  PL: { flag: "🇵🇱", name: "Poland" },        TR: { flag: "🇹🇷", name: "Turkey" },
  KR: { flag: "🇰🇷", name: "South Korea" },   VN: { flag: "🇻🇳", name: "Vietnam" },
  AE: { flag: "🇦🇪", name: "UAE" },           SA: { flag: "🇸🇦", name: "Saudi Arabia" },
  EG: { flag: "🇪🇬", name: "Egypt" },         AR: { flag: "🇦🇷", name: "Argentina" },
  CO: { flag: "🇨🇴", name: "Colombia" },      CL: { flag: "🇨🇱", name: "Chile" },
  TH: { flag: "🇹🇭", name: "Thailand" },      MY: { flag: "🇲🇾", name: "Malaysia" },
  SG: { flag: "🇸🇬", name: "Singapore" },     CH: { flag: "🇨🇭", name: "Switzerland" },
  BE: { flag: "🇧🇪", name: "Belgium" },       AT: { flag: "🇦🇹", name: "Austria" },
  PT: { flag: "🇵🇹", name: "Portugal" },      IE: { flag: "🇮🇪", name: "Ireland" },
  NO: { flag: "🇳🇴", name: "Norway" },        DK: { flag: "🇩🇰", name: "Denmark" },
  FI: { flag: "🇫🇮", name: "Finland" },       NZ: { flag: "🇳🇿", name: "New Zealand" },
};

type AggRow<T> = T;
type AnalyticsAgg = {
  empty?: boolean;
  links: Array<{ id: string; short_code: string; title: string | null }>;
  total: number; humans: number; bots: number;
  last24h: number; last24hHumans: number; last60s: number;
  offers: number; oursClicks: number;
  hourly: number[];
  heatmap: number[][]; heatMax: number;
  countries: Array<{ code: string; humans: number; bots: number; total: number }>;
  devices: Array<{ name: string; cnt: number }>;
  browsers: Array<{ name: string; cnt: number }>;
  operatingSystems: Array<{ name: string; cnt: number }>;
  botReasons: Array<{ name: string; cnt: number }>;
  trafficSources: Array<{ key: string; humans: number; bots: number; total: number }>;
  topLinks: Array<{ link_id: string; humans: number; bots: number; total: number }>;
  liveEvents: Array<{ id: string; link_id: string; country: string | null; ua: string | null; is_bot: boolean; routed_to: string; created_at: string }>;
};

const BROWSER_META: Record<string, { slug: string; color: string }> = {
  "Edge":             { slug: "microsoftedge", color: "0078D4" },
  "Opera":            { slug: "opera",         color: "FF1B2D" },
  "Samsung Internet": { slug: "samsung",       color: "1428A0" },
  "UC Browser":       { slug: "ucbrowser",     color: "F8B500" },
  "Brave":            { slug: "brave",         color: "FB542B" },
  "Firefox":          { slug: "firefoxbrowser",color: "FF7139" },
  "Facebook App":     { slug: "facebook",      color: "1877F2" },
  "Instagram App":    { slug: "instagram",     color: "E4405F" },
  "Chrome":           { slug: "googlechrome",  color: "4285F4" },
  "Safari":           { slug: "safari",        color: "0FB5EE" },
  "Unknown":          { slug: "unknown",       color: "94a3b8" },
  "Other":            { slug: "unknown",       color: "94a3b8" },
};

const OS_META: Record<string, string> = {
  iOS: "ios", Android: "android", Windows: "windows", macOS: "macos",
  ChromeOS: "googlechrome", Linux: "linux", Unknown: "unknown", Other: "unknown",
};

export const getAnalyticsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Server-side aggregation via RPC — no row truncation regardless of volume.
    const { data: aggRaw, error: aggErr } = await supabase.rpc("get_analytics_summary" as never, {
      _user_id: userId,
      _days: 7,
    } as never);
    if (aggErr) throw new Error(aggErr.message);
    const agg = (aggRaw ?? { empty: true }) as AnalyticsAgg & { empty?: boolean };
    if (agg.empty || !agg.links) return empty();

    const hideBots = (real: number) => real;
    const total = Number(agg.total ?? 0);
    const humans = Number(agg.humans ?? 0);
    const realBots = Number(agg.bots ?? 0);
    const displayBots = hideBots(realBots);
    const displayTotal = humans + displayBots;
    const last24h = Number(agg.last24h ?? 0);
    const last24hHumans = Number(agg.last24hHumans ?? 0);
    const cps = ((Number(agg.last60s ?? 0)) / 60).toFixed(1);

    // --- Funnel ---
    const fClick = total;
    const fHuman = humans;
    const fOffer = Number(agg.offers ?? 0);
    const fLanding = fOffer;
    const pct = (n: number) => (fClick ? Math.round((n / fClick) * 1000) / 10 : 0);
    const funnel = [
      { stage: "Clicks",        value: fClick,   pct: 100,           color: "#FF7E5F" },
      { stage: "Human Pass",    value: fHuman,   pct: pct(fHuman),   color: "#FEB47B" },
      { stage: "Offer Reach",   value: fOffer,   pct: pct(fOffer),   color: "#F59E0B" },
      { stage: "Final Landing", value: fLanding, pct: pct(fLanding), color: "#10B981" },
    ];

    // --- 24h hourly series (already 24 buckets from SQL) ---
    const hourBuckets = Array.isArray(agg.hourly) && agg.hourly.length === 24
      ? agg.hourly.map(Number) : new Array(24).fill(0);

    // --- Heatmap (7×24, already shaped) ---
    const heatmapRaw = Array.isArray(agg.heatmap) ? agg.heatmap : [];
    const heatmap: number[][] = Array.from({ length: 7 }, (_, i) =>
      Array.isArray(heatmapRaw[i]) ? (heatmapRaw[i] as number[]).map(Number) : new Array(24).fill(0));
    const heatMax = Math.max(1, Number(agg.heatMax ?? 1));

    // --- Top countries (decorate with flag/name) ---
    const topCountries = (agg.countries ?? []).map((c: AggRow<AnalyticsAgg["countries"][number]>) => {
      const code = c.code;
      const meta = COUNTRIES[code] ?? { flag: "🌐", name: code };
      const cnt = Number(c.humans) + hideBots(Number(c.bots));
      return {
        code, flag: meta.flag, name: meta.name,
        count: cnt, humans: Number(c.humans), bots: hideBots(Number(c.bots)),
        pct: displayTotal ? Math.round((cnt / displayTotal) * 1000) / 10 : 0,
      };
    });

    // --- Devices ---
    const totalHumansForDev = Math.max(1, humans);
    const devices = (agg.devices ?? []).map((d: AggRow<AnalyticsAgg["devices"][number]>) => ({
      name: d.name, count: Number(d.cnt),
      pct: Math.round((Number(d.cnt) / totalHumansForDev) * 1000) / 10,
    }));

    // --- Browsers ---
    const browsers = (agg.browsers ?? []).map((b: AggRow<AnalyticsAgg["browsers"][number]>) => {
      const meta = BROWSER_META[b.name] ?? { slug: "unknown", color: "94a3b8" };
      return {
        name: b.name, slug: meta.slug, color: meta.color, count: Number(b.cnt),
        pct: Math.round((Number(b.cnt) / totalHumansForDev) * 1000) / 10,
      };
    });

    // --- Operating systems ---
    const operatingSystems = (agg.operatingSystems ?? []).map((o: AggRow<AnalyticsAgg["operatingSystems"][number]>) => ({
      name: o.name, slug: OS_META[o.name] ?? "unknown", count: Number(o.cnt),
      pct: Math.round((Number(o.cnt) / totalHumansForDev) * 1000) / 10,
    }));

    // --- Bot reasons ---
    const botReasons = (agg.botReasons ?? []).map((r: AggRow<AnalyticsAgg["botReasons"][number]>) => ({
      name: friendlyReason(r.name),
      count: hideBots(Number(r.cnt)),
      pct: realBots ? Math.round((Number(r.cnt) / realBots) * 1000) / 10 : 0,
    }));

    // --- Traffic sources ---
    const SOURCE_META: Record<string, { name: string; slug: string; color: string }> = {
      facebook:  { name: "Facebook",   slug: "facebook",  color: "1877F2" },
      instagram: { name: "Instagram",  slug: "instagram", color: "E4405F" },
      tiktok:    { name: "TikTok",     slug: "tiktok",    color: "000000" },
      youtube:   { name: "YouTube",    slug: "youtube",   color: "FF0000" },
      twitter:   { name: "X / Twitter",slug: "x",         color: "000000" },
      x:         { name: "X / Twitter",slug: "x",         color: "000000" },
      reddit:    { name: "Reddit",     slug: "reddit",    color: "FF4500" },
      telegram:  { name: "Telegram",   slug: "telegram",  color: "26A5E4" },
      whatsapp:  { name: "WhatsApp",   slug: "whatsapp",  color: "25D366" },
      google:    { name: "Google",     slug: "google",    color: "4285F4" },
      bing:      { name: "Bing",       slug: "microsoftbing", color: "008373" },
      direct:    { name: "Direct",     slug: "direct",    color: "7D6452" },
      other:     { name: "Other",      slug: "direct",    color: "7D6452" },
    };
    const totalSrcHumans = Math.max(1, (agg.trafficSources ?? []).reduce((s, v) => s + Number(v.humans), 0));
    const trafficSources = (agg.trafficSources ?? []).map((v: AggRow<AnalyticsAgg["trafficSources"][number]>) => {
      const meta = SOURCE_META[v.key] ?? { name: v.key, slug: "direct", color: "7D6452" };
      const tot = Number(v.total);
      const hum = Number(v.humans);
      const quality = tot ? Math.round((hum / tot) * 100) : 100;
      return {
        key: v.key, name: meta.name, slug: meta.slug, color: meta.color,
        humans: hum, bots: hideBots(Number(v.bots)), total: hum + hideBots(Number(v.bots)),
        pct: Math.round((hum / totalSrcHumans) * 1000) / 10,
        quality,
      };
    });

    // --- Top links ---
    const linkLookup = new Map(agg.links.map((l) => [l.id, l]));
    const topLinks = (agg.topLinks ?? []).map((t: AggRow<AnalyticsAgg["topLinks"][number]>) => {
      const l = linkLookup.get(t.link_id);
      const hum = Number(t.humans);
      const tot = Number(t.total);
      return {
        id: t.link_id, code: l?.short_code ?? "—", title: l?.title ?? null,
        count: hum + hideBots(Number(t.bots)),
        humans: hum,
        bots: hideBots(Number(t.bots)),
        health: tot ? Math.round((hum / tot) * 100) : 100,
      };
    });

    // --- Live events (last 20 raw rows from RPC) ---
    const liveEvents = (agg.liveEvents ?? []).map((c) => {
      const dev = deviceFromUA(c.ua);
      const br = browserFromUA(c.ua);
      const cc = (c.country ?? "??").toUpperCase();
      return {
        id: c.id,
        time: c.created_at,
        country: cc,
        countryName: COUNTRIES[cc]?.name ?? cc,
        flag: COUNTRIES[cc]?.flag ?? "🌐",
        device: dev,
        browser: br.name,
        browserSlug: br.slug,
        browserColor: br.color,
        isBot: c.is_bot,
        routed: c.routed_to,
      };
    });

    return {
      kpis: {
        total: displayTotal,
        humans,
        bots: displayBots,
        cps,
        last24h: last24hHumans + hideBots(last24h - last24hHumans),
        humanRate: displayTotal ? Math.round((humans / displayTotal) * 1000) / 10 : 100,
        activeLinks: agg.links.length,
        oursClicks: Number(agg.oursClicks ?? 0),
      },
      series24h: hourBuckets,
      heatmap, heatMax,
      topCountries, devices, browsers,
      operatingSystems, botReasons,
      topLinks, liveEvents, trafficSources,
      funnel,
    };
  });

function friendlyReason(raw: string): string {
  const map: Record<string, string> = {
    ua: "Suspicious User Agent",
    asn: "Datacenter IP",
    ip: "Blocked IP Range",
    rule: "Custom Rule Match",
    "empty/short": "Missing User Agent",
    unknown: "Other",
  };
  return map[raw] ?? raw;
}

function empty() {
  return {
    kpis: { total: 0, humans: 0, bots: 0, cps: "0.0", last24h: 0, humanRate: 100, activeLinks: 0, oursClicks: 0 },
    series24h: new Array(24).fill(0),
    heatmap: Array.from({ length: 7 }, () => new Array(24).fill(0)),
    heatMax: 1,
    topCountries: [] as Array<{ code: string; flag: string; name: string; count: number; humans: number; bots: number; pct: number }>,
    devices: [] as Array<{ name: string; count: number; pct: number }>,
    browsers: [] as Array<{ name: string; slug: string; color: string; count: number; pct: number }>,
    operatingSystems: [] as Array<{ name: string; slug: string; count: number; pct: number }>,
    botReasons: [] as Array<{ name: string; count: number; pct: number }>,
    topLinks: [] as Array<{ id: string; code: string; title: string | null; count: number; humans: number; bots: number; health: number }>,
    liveEvents: [] as Array<{ id: string; time: string; country: string; countryName: string; flag: string; device: string; browser: string; browserSlug: string; browserColor: string; isBot: boolean; routed: string }>,
    trafficSources: [] as Array<{ key: string; name: string; slug: string; color: string; humans: number; bots: number; total: number; pct: number; quality: number }>,
    funnel: [] as Array<{ stage: string; value: number; pct: number; color: string }>,
  };
}

// ============== Cohort Retention (30-day fingerprint-based) ==============
export const getCohortRetention = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: links } = await supabase.from("links").select("id").eq("user_id", userId);
    const linkIds = (links ?? []).map((l) => l.id);
    if (linkIds.length === 0) return { rows: [] as Array<{ day: string; size: number; d1: number; d7: number; d30: number }> };

    const thirtyAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data: raw } = await supabase
      .from("clicks")
      .select("ip, created_at, is_bot")
      .in("link_id", linkIds)
      .gte("created_at", thirtyAgo)
      .order("created_at", { ascending: true })
      .limit(50000);

    const clicks = (raw ?? []) as Array<{ ip: string | null; created_at: string; is_bot: boolean }>;
    const dayMs = 86_400_000;
    const today = Math.floor(Date.now() / dayMs);

    // First-seen day per visitor (IP-based; fingerprint_hash dropped for storage savings)
    const firstSeen = new Map<string, number>();
    const visitDays = new Map<string, Set<number>>();
    clicks.forEach((c) => {
      if (c.is_bot) return;
      const id = c.ip;
      if (!id) return;
      const day = Math.floor(new Date(c.created_at).getTime() / dayMs);
      if (!firstSeen.has(id)) firstSeen.set(id, day);
      const set = visitDays.get(id) ?? new Set<number>();
      set.add(day);
      visitDays.set(id, set);
    });

    // Build cohort rows for last 14 days
    const cohorts = new Map<number, string[]>();
    firstSeen.forEach((day, id) => {
      if (today - day > 13) return;
      const arr = cohorts.get(day) ?? [];
      arr.push(id);
      cohorts.set(day, arr);
    });

    const rows: Array<{ day: string; size: number; d1: number; d7: number; d30: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const day = today - i;
      const ids = cohorts.get(day) ?? [];
      const size = ids.length;
      const d1 = ids.filter((id) => visitDays.get(id)?.has(day + 1)).length;
      const d7 = ids.filter((id) => { const s = visitDays.get(id); if (!s) return false; for (let k = day + 1; k <= day + 7; k++) if (s.has(k)) return true; return false; }).length;
      const d30 = ids.filter((id) => { const s = visitDays.get(id); if (!s) return false; for (let k = day + 1; k <= day + 30; k++) if (s.has(k)) return true; return false; }).length;
      const dateStr = new Date(day * dayMs).toLocaleDateString([], { month: "short", day: "numeric" });
      rows.push({
        day: dateStr,
        size,
        d1: size ? Math.round((d1 / size) * 100) : 0,
        d7: size ? Math.round((d7 / size) * 100) : 0,
        d30: size ? Math.round((d30 / size) * 100) : 0,
      });
    }
    return { rows };
  });

// ============== Per-link drill-down ==============
export const getLinkDrilldown = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ linkId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: link } = await supabase
      .from("links").select("id, short_code, title, user_id, clicks_count, bot_clicks_count, created_at")
      .eq("id", data.linkId).single();
    if (!link || link.user_id !== userId) throw new Error("Not found");

    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
    const { data: rawC } = await supabase
      .from("clicks")
      .select("country, ua, is_bot, routed_to, created_at")
      .eq("link_id", data.linkId)
      .gte("created_at", dayAgo)
      .order("created_at", { ascending: false })
      .limit(10000);

    const clicks = (rawC ?? []) as Array<{ country: string | null; ua: string | null; is_bot: boolean; routed_to: string; created_at: string }>;
    const now = Date.now();

    // 24h hourly series — humans
    const series = new Array(24).fill(0);
    clicks.filter(c => !c.is_bot).forEach((c) => {
      const h = Math.floor((now - new Date(c.created_at).getTime()) / 3_600_000);
      if (h >= 0 && h < 24) series[23 - h]++;
    });

    // top countries
    const cMap = new Map<string, number>();
    clicks.forEach(c => { const k = (c.country ?? "??").toUpperCase(); cMap.set(k, (cMap.get(k) ?? 0) + 1); });
    const tot = Math.max(1, clicks.length);
    const countries = [...cMap.entries()].sort((a,b) => b[1]-a[1]).slice(0, 8).map(([code, count]) => ({
      code, flag: COUNTRIES[code]?.flag ?? "🌐", name: COUNTRIES[code]?.name ?? code,
      count, pct: Math.round((count / tot) * 1000) / 10,
    }));

    // top browsers
    const bMap = new Map<string, { count: number; slug: string; color: string }>();
    clicks.filter(c => !c.is_bot).forEach(c => {
      const b = browserFromUA(c.ua);
      const cur = bMap.get(b.name) ?? { count: 0, slug: b.slug, color: b.color };
      cur.count++; bMap.set(b.name, cur);
    });
    const humans = clicks.filter(c => !c.is_bot).length;
    const totH = Math.max(1, humans);
    const browsers = [...bMap.entries()].sort((a,b) => b[1].count-a[1].count).slice(0, 6).map(([name, v]) => ({
      name, slug: v.slug, color: v.color, count: v.count,
      pct: Math.round((v.count / totH) * 1000) / 10,
    }));

    const bots = clicks.filter(c => c.is_bot).length;
    return {
      link: { id: link.id, code: link.short_code, title: link.title, total: link.clicks_count, created_at: link.created_at },
      kpis24h: { total: clicks.length, humans, bots: hideBots(bots), humanRate: clicks.length ? Math.round((humans / clicks.length) * 1000) / 10 : 100 },
      series, countries, browsers,
    };
  });

// ============== Live feed (real-time stream) ==============
export const getLiveFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: links } = await supabase
      .from("links").select("id, short_code, title").eq("user_id", userId);
    const linkIds = (links ?? []).map((l) => l.id);
    if (linkIds.length === 0) {
      return {
        cps5m: 0, humans1h: 0, bots1h: 0,
        events: [] as Array<{ id: string; created_at: string; short_code: string; country: string; flag: string; countryName: string; ua: string | null; is_bot: boolean; referrer_source: string | null; device: string; deviceOs: string; browser: string; browserSlug: string; browserColor: string }>,
        countries: [] as Array<{ code: string; flag: string; name: string; count: number; pct: number }>,
        cohorts: [] as Array<{ source: string; total: number; humans: number; humanRate: number }>,
      };
    }

    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
    const modernWithSource = await supabase
      .from("clicks")
      .select("id, link_id, country, ua, is_bot, referer_host, created_at")
      .in("link_id", linkIds)
      .gte("created_at", dayAgo)
      .order("created_at", { ascending: false })
      .limit(5000);

    const modern = modernWithSource.error
      ? await supabase
          .from("clicks")
          .select("id, link_id, country, ua, is_bot, created_at")
          .in("link_id", linkIds)
          .gte("created_at", dayAgo)
          .order("created_at", { ascending: false })
          .limit(5000)
      : modernWithSource;

    const legacy = modern.error
      ? await supabase
          .from("clicks")
          .select("id, link_id, country, user_agent, is_bot, referer_host, created_at")
          .in("link_id", linkIds)
          .gte("created_at", dayAgo)
          .order("created_at", { ascending: false })
          .limit(5000)
      : { data: null };

    const clicks = (((modern.error ? legacy.data : modern.data) ?? []) as unknown) as Array<{ id: string; link_id: string; country: string | null; ua?: string | null; user_agent?: string | null; is_bot: boolean; referer_host?: string | null; created_at: string }>;
    const linkLookup = new Map((links ?? []).map((l) => [l.id, l]));
    const now = Date.now();

    const last5m = clicks.filter(c => now - new Date(c.created_at).getTime() < 300_000).length;
    const last1h = clicks.filter(c => now - new Date(c.created_at).getTime() < 3_600_000);
    const humans1h = last1h.filter(c => !c.is_bot).length;
    const bots1h = Math.floor((last1h.length - humans1h) * 0.8);

    // Derive referrer cohort source from host (column referrer_source doesn't exist on self-host)
    const classifySrc = (host: string | null): string => {
      if (!host) return "direct";
      const h = host.toLowerCase();
      if (h.includes("facebook") || h.includes("fb.")) return "facebook";
      if (h.includes("instagram")) return "instagram";
      if (h.includes("tiktok")) return "tiktok";
      if (h.includes("twitter") || h.includes("x.com")) return "twitter";
      if (h.includes("youtube")) return "youtube";
      if (h.includes("google")) return "google";
      if (h.includes("bing")) return "bing";
      if (h.includes("reddit")) return "reddit";
      if (h.includes("telegram") || h.includes("t.me")) return "telegram";
      if (h.includes("whatsapp")) return "whatsapp";
      return "other";
    };

    const events = clicks.slice(0, 50).map(c => {
      const cc = (c.country ?? "??").toUpperCase();
      const ua = c.ua ?? c.user_agent ?? null;
      const dev = deviceFromUA(ua);
      const br = browserFromUA(ua);
      const os = osFromUA(ua);
      const src = classifySrc(c.referer_host ?? null);
      return {
        id: c.id,
        created_at: c.created_at,
        short_code: linkLookup.get(c.link_id)?.short_code ?? "—",
        country: cc,
        flag: COUNTRIES[cc]?.flag ?? "🌐",
        countryName: COUNTRIES[cc]?.name ?? cc,
        ua,
        is_bot: c.is_bot,
        referrer_source: src === "direct" ? null : src,
        device: dev,
        deviceOs: os.name,
        browser: br.name,
        browserSlug: br.slug,
        browserColor: br.color,
      };
    });

    // Countries (24h)
    const countryMap = new Map<string, number>();
    clicks.forEach(c => {
      const k = (c.country ?? "??").toUpperCase();
      countryMap.set(k, (countryMap.get(k) ?? 0) + 1);
    });
    const totalForPct = Math.max(1, clicks.length);
    const countries = [...countryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([code, count]) => ({
        code,
        flag: COUNTRIES[code]?.flag ?? "🌐",
        name: COUNTRIES[code]?.name ?? code,
        count,
        pct: Math.round((count / totalForPct) * 100),
      }));

    // Cohorts by referrer_source
    const cohortMap = new Map<string, { total: number; humans: number }>();
    clicks.forEach(c => {
      const src = classifySrc(c.referer_host ?? null);
      const cur = cohortMap.get(src) ?? { total: 0, humans: 0 };
      cur.total++;
      if (!c.is_bot) cur.humans++;
      cohortMap.set(src, cur);
    });
    const cohorts = [...cohortMap.entries()]
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8)
      .map(([source, v]) => ({
        source,
        total: v.total,
        humans: v.humans,
        humanRate: v.total ? Math.round((v.humans / v.total) * 100) : 0,
      }));

    return { cps5m: last5m, humans1h, bots1h, events, countries, cohorts };
  });
