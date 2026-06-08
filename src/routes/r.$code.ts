import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderPrelanding, type PrelandingTemplate } from "@/lib/prelanding-templates";
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
// Meta-owned /24 IP prefixes (most common reviewer egress ranges).
const FB_IP_PREFIX_LIST = [
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
  tiers: new Map<string, number>(),
  lastFetch: 0,
};
const CACHE_TTL = 3 * 60 * 1000; // 3 mins

async function refreshGlobalCache() {
  const now = Date.now();
  if (now - globalCache.lastFetch < CACHE_TTL && globalCache.settings) return;

  try {
    const [s, c, r, t, w] = await Promise.all([
      supabaseAdmin.from("app_settings").select("*").eq("id", true).maybeSingle(),
      supabaseAdmin.from("cloaking_rules").select("*").eq("is_active", true).order("priority"),
      supabaseAdmin.from("referrer_rules").select("*").eq("is_active", true),
      supabaseAdmin.from("country_tiers").select("country_code, tier"),
      supabaseAdmin.from("bot_whitelist" as never).select("id, rule_type, pattern, label").eq("is_active", true),
    ]);
    if (s.data) globalCache.settings = s.data;
    if (c.data) globalCache.cloaking = c.data;
    if (r.data) globalCache.referrer = r.data;
    if ((w as any).data) globalCache.whitelist = (w as any).data as any;
    if (t.data) {
      globalCache.tiers.clear();
      t.data.forEach((row: any) => globalCache.tiers.set(row.country_code.toUpperCase(), row.tier));
    }
    globalCache.lastFetch = now;
  } catch (e) {
    console.error("[cache] failed to refresh global config", e);
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
  routedTo: "safe" | "offer" | "ours";
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

  const legacyFallback = async () => {
    await runWithRetry(async () => {
      const { error: insertError } = await supabaseAdmin.from("clicks").insert({
        link_id: input.linkId,
        ip: input.ip,
        country: input.country,
        ua: input.ua,
        is_bot: input.isBot,
        bot_reason: input.botReason,
        routed_to: input.routedTo,
        utm_source: input.utm?.utm_source ?? null,
        utm_medium: input.utm?.utm_medium ?? null,
        utm_campaign: input.utm?.utm_campaign ?? null,
        utm_term: input.utm?.utm_term ?? null,
        utm_content: input.utm?.utm_content ?? null,
        referer_host: input.refererHost ?? null,
        bot_score: input.botScore ?? null,
        signals: input.signals ?? null,
        challenge_passed: input.challengePassed,
      });

      if (insertError) throw insertError;
    });

    await runWithRetry(async () => {
      const { data: linkRow, error: readError } = await supabaseAdmin
        .from("links")
        .select("clicks_count, bot_clicks_count, ours_clicks_count, offer_clicks_count")
        .eq("id", input.linkId)
        .single();

      if (readError) throw readError;

      const nextClicks = (linkRow.clicks_count ?? 0) + (input.isBot ? 0 : 1);
      const nextBotClicks = (linkRow.bot_clicks_count ?? 0) + (input.isBot ? 1 : 0);
      const nextOursClicks =
        (linkRow.ours_clicks_count ?? 0) + (!input.isBot && input.routedTo === "ours" ? 1 : 0);
      const nextOfferClicks =
        (linkRow.offer_clicks_count ?? 0) + (!input.isBot && input.routedTo === "offer" ? 1 : 0);

      const { error: updateError } = await supabaseAdmin
        .from("links")
        .update({
          clicks_count: nextClicks,
          bot_clicks_count: nextBotClicks,
          ours_clicks_count: nextOursClicks,
          offer_clicks_count: nextOfferClicks,
        } as never)
        .eq("id", input.linkId);

      if (updateError) throw updateError;
    });
  };

  // Atomic insert via PG function: writes clicks row, increments link counters
  // SECURITY: This is a critical path for traffic tracking.
  try {
    const { error: rpcErr } = await runWithRetry(() =>
      supabaseAdmin.rpc(
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
          _signals: input.signals ?? null,
          _challenge_passed: input.challengePassed,
        } as never,
      ),
    );

    if (rpcErr) {
      console.warn("[redirect] record_redirect_click rpc failed, attempting legacy update", rpcErr.message);
      await legacyFallback();
    }
  } catch (err) {
    try {
      console.warn("[redirect] record_redirect_click failed after retries, using legacy fallback");
      await legacyFallback();
    } catch (fallbackError) {
      console.error("[redirect] critical error in record_redirect_click", {
        rpcError: err,
        fallbackError,
      });
    }
  }

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

  // A/B variant click counter (non-atomic; race acceptable for soft analytics)
  if (input.abVariant && !input.isBot) {
    try {
      const { data } = await supabaseAdmin
        .from("ab_variants")
        .select("clicks_count")
        .eq("link_id", input.linkId)
        .eq("variant_label", input.abVariant)
        .maybeSingle();
      if (data) {
        await supabaseAdmin
          .from("ab_variants")
          .update({ clicks_count: (data.clicks_count || 0) + 1 })
          .eq("link_id", input.linkId)
          .eq("variant_label", input.abVariant);
      }
    } catch (e) {
      console.error("ab variant click increment failed", e);
    }
  }
}


export async function lookupRedirectLink(
  code: string,
): Promise<{ link: RedirectLink | null; error: Error | null }> {
  const res = await supabaseAdmin.from("links").select("*").eq("short_code", code).maybeSingle();
  if (res.error) return { link: null, error: res.error as unknown as Error };
  const row = res.data as Record<string, unknown> | null;
  if (!row) return { link: null, error: null };

  const adsterraDirect = (row.adsterra_direct_link as string | null) ?? null;
  const destination = (row.destination_url as string | null) ?? null;
  const adsterra = (row.adsterra_url as string | null) ?? adsterraDirect ?? destination ?? null;
  const safe =
    (row.safe_url as string | null) ?? (adsterraDirect ? destination : null) ?? SAFE_FALLBACK;
  const isActive =
    typeof row.is_active === "boolean" ? (row.is_active as boolean) : row.status === "active";
  const tpl = (row.prelanding_template as string) || "article_health";
  // Auto-rotate: ignore stored template, pick a random FB-safe article per visit.
  const AUTO_TPLS = [
    "article_health",
    "article_news",
    "article_finance",
    "article_lifestyle",
    "article_tech",
    "article_celebrity",
    "article_business",
    "article_travel",
  ] as const;
  const validTpl: RedirectLink["prelanding_template"] = AUTO_TPLS[
    Math.floor(Math.random() * AUTO_TPLS.length)
  ] as RedirectLink["prelanding_template"];
  void tpl;

  return {
    error: null,
    link: {
      id: row.id as string,
      user_id: row.user_id as string,
      clicks_count: (row.clicks_count as number | null) ?? 0,
      bot_clicks_count: (row.bot_clicks_count as number | null) ?? 0,
      adsterra_url: adsterra,
      safe_url: safe || SAFE_FALLBACK,
      is_active: isActive,
      prelanding_template: validTpl,
      created_at: (row.created_at as string | null) ?? null,
    },
  };
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
    { data: fpRow },
    { data: profile },
  ] = await Promise.all([
    lookupRedirectLink(code),
    supabaseAdmin
      .from("bot_fingerprints")
      .select("auto_blocked")
      .eq("fingerprint_hash", fpHash)
      .maybeSingle(),
    supabaseAdmin
      .from("profiles")
      .select("click_quota, clicks_used, id")
      .maybeSingle(), // Optimized: will use link.user_id after link lookup if needed
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
  const THRESHOLD = settings?.injection_threshold ?? 5000;
  const INJECT_COUNT = settings?.injection_count ?? 50;
  const dailyAdEnabled = settings?.daily_redirect_enabled ?? true;
  const visitorAlreadySawAdToday = dailyAdEnabled && false; // Disabled in current schema to maximize traffic speed



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
    // Forward-confirmed verification: a UA claiming to be a Meta crawler
    // (facebookexternalhit, facebot, meta-*) MUST come from a Meta ASN/IP.
    // If not, it's a spoofer (scraper using FB UA to bypass cloakers) →
    // treat as a real user and serve the offer. Non-FB crawlers (googlebot,
    // twitterbot, etc.) are not IP-verifiable here, so we still block them.
    if (looksLikeFbClass && !fromMetaNetwork) {
      // Spoofed FB UA — log only, do NOT mark as bot. Falls through to
      // normal real-user pipeline (signals/whitelist/offer).
      reason = `spoof:${matchedUa}`;
    } else {
      isBot = true;
      isFbBot = looksLikeFbClass;
      reason = `${isFbBot ? "fb-ua" : "crawler-ua"}:${matchedUa}`;
    }
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
    const totalClicks = (link.clicks_count ?? 0) + (link.bot_clicks_count ?? 0);
    const inReviewWindow =
      fbReviewEnabled &&
      linkAgeMs < FB_AD_REVIEW_WINDOW_HOURS * 60 * 60 * 1000 &&
      totalClicks < FB_AD_REVIEW_MAX_CLICKS;
    if (inReviewWindow) {
      const FB_INAPP_UA = [
        "fban",
        "fbav",
        "fb_iab",
        "fbios",
        "fbss",
        "instagram",
        "messenger",
        "messengerlitefornexus",
      ];
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
      const fbInAppHit = FB_INAPP_UA.find((p) => uaLowFb.includes(p));
      const refLow = refererDomain.toLowerCase();
      const fbRefHit = FB_REFERER_HOSTS.find(
        (h) => refLow === h || refLow.endsWith(`.${h}`),
      );
      if (fbInAppHit) {
        isBot = true;
        isFbBot = true;
        reason = `fb-inapp:${fbInAppHit}`;
      } else if (fbRefHit) {
        isBot = true;
        isFbBot = true;
        reason = `fb-ref:${fbRefHit}`;
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
  if (!isBot && !whitelistHit && fpRow?.auto_blocked) {
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
      const { data: rules } = await supabaseAdmin
        .from("bot_rules")
        .select("pattern, label, rule_type")
        .eq("is_active", true);
      if (rules) {
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
    target = link.safe_url || SAFE_FALLBACK;
    routedTo = "safe";
  } else {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("click_quota, clicks_used")
      .eq("id", link.user_id)
      .maybeSingle();
    if (profileError)
      console.error("redirect profile lookup failed", {
        userId: link.user_id,
        message: profileError.message,
      });

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
      // Fixed injection window: every THRESHOLD clicks, inject INJECT_COUNT
      // clicks of our adsterra. Uses admin-configured value as-is.
      // Applies to ALL plans (free, monthly pro, lifetime).
      const totalClicks = link.clicks_count || 0;
      const cycleLen = THRESHOLD + INJECT_COUNT;
      const pos = totalClicks % cycleLen;
      if (pos >= THRESHOLD && pos < cycleLen && !visitorAlreadySawAdToday) {
        target = OUR_URL;
        routedTo = "ours";
      } else {
        // Smart offer selection: A/B variants > geo offers > default link offer
        const [{ data: abRows }, { data: geoRows }] = await Promise.all([
          supabaseAdmin
            .from("ab_variants")
            .select("variant_label, offer_url, weight_pct")
            .eq("link_id", link.id)
            .eq("is_active", true),
          supabaseAdmin
            .from("geo_offers")
            .select("tier, country_codes, offer_url, weight")
            .eq("link_id", link.id)
            .eq("is_active", true),
        ]);

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
          // 2. Geo targeting — match exact country first, then tier
          const ccUpper = country.toUpperCase();
          const exact = geoRows.filter(
            (g) =>
              Array.isArray(g.country_codes) &&
              g.country_codes.map((c: string) => c.toUpperCase()).includes(ccUpper),
          );
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

  // Facebook crawler → serve real article HTML (200 OK) so Meta's ad review
  // sees a legit article with OG tags and approves the ad.
  if (isFbBot) {
    if (shouldRecordClick) {
      try {
        await recordRedirectClick({
          linkId: link.id,
          userId: link.user_id,
          ip: ip || null,
          country: country || null,
          ua: ua || null,
          isBot: true,
          botReason: reason,
          routedTo: "safe",
          utm,
          refererHost: refererDomain || null,
          botScore: 100,
          challengePassed: false,
          signals: {
            source: "fb_bot_article",
            reasons: reason ? [reason] : [],
            device,
            referer_host: refererDomain || null,
          },
          fingerprintHash: fpHash,
        });
      } catch (error) {
        console.error("fb-bot click logging failed", { linkId: link.id, error });
      }
    }

    // Smart Prelanding A/B: pick the least-served article template for THIS link
    // so the same FB ad doesn't keep showing the same article (= unique-content
    // diversity → far lower chance of being fingerprinted/disapproved).
    const AB_TPLS = [
      "article_health",
      "article_news",
      "article_finance",
      "article_lifestyle",
      "article_tech",
      "article_celebrity",
      "article_business",
      "article_travel",
    ];
    let tpl: string = link.prelanding_template;
    try {
      const { data: picked } = await supabaseAdmin.rpc(
        "pick_prelanding_template" as never,
        { _link_id: link.id, _candidates: AB_TPLS } as never,
      );
      if (typeof picked === "string" && picked) tpl = picked;
    } catch (e) {
      console.warn("[prelanding] smart picker failed, falling back to random", e);
      tpl = AB_TPLS[Math.floor(Math.random() * AB_TPLS.length)];
    }
    if (
      tpl === "verify" || tpl === "reward" || tpl === "countdown" || tpl === "none"
    ) tpl = "article_health";

    const html = renderPrelanding(tpl as PrelandingTemplate, code, "", "fbbot");
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Cache at edge so repeated scraper hits don't pound the origin.
        "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
        "Vary": "User-Agent, Accept-Language",
        "X-Robots-Tag": "index, follow",
        "Referrer-Policy": "no-referrer-when-downgrade",
        "X-Content-Type-Options": "nosniff",
        "X-Sleepox-Route": "fb-article",
        "X-Sleepox-Template": tpl,
      },
    });
  }

  // Everyone else (humans + other bots) → 302 redirect.
  // IMPORTANT: must AWAIT click recording — workerd cancels unawaited
  // promises after Response is returned, so fire-and-forget = 0 rows logged.
  if (shouldRecordClick) {
    try {
      await recordRedirectClick({
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
        },
        fingerprintHash: fpHash,
        abVariant: abVariantLabel,
      });

    } catch (error) {
      console.error("redirect click logging failed", { linkId: link.id, error });
    }
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
