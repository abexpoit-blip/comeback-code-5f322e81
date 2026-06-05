import { c as createServerRpc } from "./createServerRpc-Bw0UcUeN.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import "@supabase/supabase-js";
import "./createMiddleware-BvN2ghIY.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const hideBots = (real) => real;
function deviceFromUA(ua) {
  if (!ua) return "Other";
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(u)) return "Tablet";
  if (/mobi|android|iphone|ipod|phone|webos/.test(u)) return "Mobile";
  if (/windows|macintosh|linux|x11|cros/.test(u)) return "Desktop";
  return "Other";
}
function osFromUA(ua) {
  if (!ua) return {
    name: "Unknown",
    slug: "unknown"
  };
  const u = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(u)) return {
    name: "iOS",
    slug: "ios"
  };
  if (/android/.test(u)) return {
    name: "Android",
    slug: "android"
  };
  if (/windows nt/.test(u)) return {
    name: "Windows",
    slug: "windows"
  };
  if (/mac os x|macintosh/.test(u)) return {
    name: "macOS",
    slug: "macos"
  };
  if (/cros/.test(u)) return {
    name: "ChromeOS",
    slug: "googlechrome"
  };
  if (/linux|x11/.test(u)) return {
    name: "Linux",
    slug: "linux"
  };
  return {
    name: "Other",
    slug: "unknown"
  };
}
function browserFromUA(ua) {
  if (!ua) return {
    name: "Unknown",
    slug: "unknown",
    color: "94a3b8"
  };
  const u = ua.toLowerCase();
  if (u.includes("edg/")) return {
    name: "Edge",
    slug: "microsoftedge",
    color: "0078D4"
  };
  if (u.includes("opr/") || u.includes("opera")) return {
    name: "Opera",
    slug: "opera",
    color: "FF1B2D"
  };
  if (u.includes("samsungbrowser")) return {
    name: "Samsung Internet",
    slug: "samsung",
    color: "1428A0"
  };
  if (u.includes("ucbrowser")) return {
    name: "UC Browser",
    slug: "ucbrowser",
    color: "F8B500"
  };
  if (u.includes("brave")) return {
    name: "Brave",
    slug: "brave",
    color: "FB542B"
  };
  if (u.includes("firefox")) return {
    name: "Firefox",
    slug: "firefoxbrowser",
    color: "FF7139"
  };
  if (u.includes("fban") || u.includes("fbav")) return {
    name: "Facebook App",
    slug: "facebook",
    color: "1877F2"
  };
  if (u.includes("instagram")) return {
    name: "Instagram App",
    slug: "instagram",
    color: "E4405F"
  };
  if (u.includes("chrome")) return {
    name: "Chrome",
    slug: "googlechrome",
    color: "4285F4"
  };
  if (u.includes("safari")) return {
    name: "Safari",
    slug: "safari",
    color: "0FB5EE"
  };
  return {
    name: "Other",
    slug: "unknown",
    color: "94a3b8"
  };
}
const COUNTRIES = {
  US: {
    flag: "🇺🇸",
    name: "United States"
  },
  GB: {
    flag: "🇬🇧",
    name: "United Kingdom"
  },
  DE: {
    flag: "🇩🇪",
    name: "Germany"
  },
  FR: {
    flag: "🇫🇷",
    name: "France"
  },
  CA: {
    flag: "🇨🇦",
    name: "Canada"
  },
  IN: {
    flag: "🇮🇳",
    name: "India"
  },
  BD: {
    flag: "🇧🇩",
    name: "Bangladesh"
  },
  PK: {
    flag: "🇵🇰",
    name: "Pakistan"
  },
  JP: {
    flag: "🇯🇵",
    name: "Japan"
  },
  CN: {
    flag: "🇨🇳",
    name: "China"
  },
  BR: {
    flag: "🇧🇷",
    name: "Brazil"
  },
  AU: {
    flag: "🇦🇺",
    name: "Australia"
  },
  NL: {
    flag: "🇳🇱",
    name: "Netherlands"
  },
  IT: {
    flag: "🇮🇹",
    name: "Italy"
  },
  ES: {
    flag: "🇪🇸",
    name: "Spain"
  },
  MX: {
    flag: "🇲🇽",
    name: "Mexico"
  },
  RU: {
    flag: "🇷🇺",
    name: "Russia"
  },
  ID: {
    flag: "🇮🇩",
    name: "Indonesia"
  },
  PH: {
    flag: "🇵🇭",
    name: "Philippines"
  },
  NG: {
    flag: "🇳🇬",
    name: "Nigeria"
  },
  ZA: {
    flag: "🇿🇦",
    name: "South Africa"
  },
  SE: {
    flag: "🇸🇪",
    name: "Sweden"
  },
  PL: {
    flag: "🇵🇱",
    name: "Poland"
  },
  TR: {
    flag: "🇹🇷",
    name: "Turkey"
  },
  KR: {
    flag: "🇰🇷",
    name: "South Korea"
  },
  VN: {
    flag: "🇻🇳",
    name: "Vietnam"
  },
  AE: {
    flag: "🇦🇪",
    name: "UAE"
  },
  SA: {
    flag: "🇸🇦",
    name: "Saudi Arabia"
  },
  EG: {
    flag: "🇪🇬",
    name: "Egypt"
  },
  AR: {
    flag: "🇦🇷",
    name: "Argentina"
  },
  CO: {
    flag: "🇨🇴",
    name: "Colombia"
  },
  CL: {
    flag: "🇨🇱",
    name: "Chile"
  },
  TH: {
    flag: "🇹🇭",
    name: "Thailand"
  },
  MY: {
    flag: "🇲🇾",
    name: "Malaysia"
  },
  SG: {
    flag: "🇸🇬",
    name: "Singapore"
  },
  CH: {
    flag: "🇨🇭",
    name: "Switzerland"
  },
  BE: {
    flag: "🇧🇪",
    name: "Belgium"
  },
  AT: {
    flag: "🇦🇹",
    name: "Austria"
  },
  PT: {
    flag: "🇵🇹",
    name: "Portugal"
  },
  IE: {
    flag: "🇮🇪",
    name: "Ireland"
  },
  NO: {
    flag: "🇳🇴",
    name: "Norway"
  },
  DK: {
    flag: "🇩🇰",
    name: "Denmark"
  },
  FI: {
    flag: "🇫🇮",
    name: "Finland"
  },
  NZ: {
    flag: "🇳🇿",
    name: "New Zealand"
  }
};
const BROWSER_META = {
  "Edge": {
    slug: "microsoftedge",
    color: "0078D4"
  },
  "Opera": {
    slug: "opera",
    color: "FF1B2D"
  },
  "Samsung Internet": {
    slug: "samsung",
    color: "1428A0"
  },
  "UC Browser": {
    slug: "ucbrowser",
    color: "F8B500"
  },
  "Brave": {
    slug: "brave",
    color: "FB542B"
  },
  "Firefox": {
    slug: "firefoxbrowser",
    color: "FF7139"
  },
  "Facebook App": {
    slug: "facebook",
    color: "1877F2"
  },
  "Instagram App": {
    slug: "instagram",
    color: "E4405F"
  },
  "Chrome": {
    slug: "googlechrome",
    color: "4285F4"
  },
  "Safari": {
    slug: "safari",
    color: "0FB5EE"
  },
  "Unknown": {
    slug: "unknown",
    color: "94a3b8"
  },
  "Other": {
    slug: "unknown",
    color: "94a3b8"
  }
};
const OS_META = {
  iOS: "ios",
  Android: "android",
  Windows: "windows",
  macOS: "macos",
  ChromeOS: "googlechrome",
  Linux: "linux",
  Unknown: "unknown",
  Other: "unknown"
};
const getAnalyticsData_createServerFn_handler = createServerRpc({
  id: "d91dfdd74db1fc0d1565dac60a8b653133fd25dd464f569abbfc658bab0298fe",
  name: "getAnalyticsData",
  filename: "src/lib/analytics.functions.ts"
}, (opts) => getAnalyticsData.__executeServer(opts));
const getAnalyticsData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAnalyticsData_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: aggRaw,
    error: aggErr
  } = await supabase.rpc("get_analytics_summary", {
    _user_id: userId,
    _days: 7
  });
  if (aggErr) throw new Error(aggErr.message);
  const agg = aggRaw ?? {
    empty: true
  };
  if (agg.empty || !agg.links) return empty();
  const hideBots2 = (real) => real;
  const total = Number(agg.total ?? 0);
  const humans = Number(agg.humans ?? 0);
  const realBots = Number(agg.bots ?? 0);
  const displayBots = hideBots2(realBots);
  const displayTotal = humans + displayBots;
  const last24h = Number(agg.last24h ?? 0);
  const last24hHumans = Number(agg.last24hHumans ?? 0);
  const cps = (Number(agg.last60s ?? 0) / 60).toFixed(1);
  const fClick = total;
  const fHuman = humans;
  const fOffer = Number(agg.offers ?? 0);
  const fLanding = fOffer;
  const pct = (n) => fClick ? Math.round(n / fClick * 1e3) / 10 : 0;
  const funnel = [{
    stage: "Clicks",
    value: fClick,
    pct: 100,
    color: "#FF7E5F"
  }, {
    stage: "Human Pass",
    value: fHuman,
    pct: pct(fHuman),
    color: "#FEB47B"
  }, {
    stage: "Offer Reach",
    value: fOffer,
    pct: pct(fOffer),
    color: "#F59E0B"
  }, {
    stage: "Final Landing",
    value: fLanding,
    pct: pct(fLanding),
    color: "#10B981"
  }];
  const hourBuckets = Array.isArray(agg.hourly) && agg.hourly.length === 24 ? agg.hourly.map(Number) : new Array(24).fill(0);
  const heatmapRaw = Array.isArray(agg.heatmap) ? agg.heatmap : [];
  const heatmap = Array.from({
    length: 7
  }, (_, i) => Array.isArray(heatmapRaw[i]) ? heatmapRaw[i].map(Number) : new Array(24).fill(0));
  const heatMax = Math.max(1, Number(agg.heatMax ?? 1));
  const topCountries = (agg.countries ?? []).map((c) => {
    const code = c.code;
    const meta = COUNTRIES[code] ?? {
      flag: "🌐",
      name: code
    };
    const cnt = Number(c.humans) + hideBots2(Number(c.bots));
    return {
      code,
      flag: meta.flag,
      name: meta.name,
      count: cnt,
      humans: Number(c.humans),
      bots: hideBots2(Number(c.bots)),
      pct: displayTotal ? Math.round(cnt / displayTotal * 1e3) / 10 : 0
    };
  });
  const totalHumansForDev = Math.max(1, humans);
  const devices = (agg.devices ?? []).map((d) => ({
    name: d.name,
    count: Number(d.cnt),
    pct: Math.round(Number(d.cnt) / totalHumansForDev * 1e3) / 10
  }));
  const browsers = (agg.browsers ?? []).map((b) => {
    const meta = BROWSER_META[b.name] ?? {
      slug: "unknown",
      color: "94a3b8"
    };
    return {
      name: b.name,
      slug: meta.slug,
      color: meta.color,
      count: Number(b.cnt),
      pct: Math.round(Number(b.cnt) / totalHumansForDev * 1e3) / 10
    };
  });
  const operatingSystems = (agg.operatingSystems ?? []).map((o) => ({
    name: o.name,
    slug: OS_META[o.name] ?? "unknown",
    count: Number(o.cnt),
    pct: Math.round(Number(o.cnt) / totalHumansForDev * 1e3) / 10
  }));
  const botReasons = (agg.botReasons ?? []).map((r) => ({
    name: friendlyReason(r.name),
    count: hideBots2(Number(r.cnt)),
    pct: realBots ? Math.round(Number(r.cnt) / realBots * 1e3) / 10 : 0
  }));
  const SOURCE_META = {
    facebook: {
      name: "Facebook",
      slug: "facebook",
      color: "1877F2"
    },
    instagram: {
      name: "Instagram",
      slug: "instagram",
      color: "E4405F"
    },
    tiktok: {
      name: "TikTok",
      slug: "tiktok",
      color: "000000"
    },
    youtube: {
      name: "YouTube",
      slug: "youtube",
      color: "FF0000"
    },
    twitter: {
      name: "X / Twitter",
      slug: "x",
      color: "000000"
    },
    x: {
      name: "X / Twitter",
      slug: "x",
      color: "000000"
    },
    reddit: {
      name: "Reddit",
      slug: "reddit",
      color: "FF4500"
    },
    telegram: {
      name: "Telegram",
      slug: "telegram",
      color: "26A5E4"
    },
    whatsapp: {
      name: "WhatsApp",
      slug: "whatsapp",
      color: "25D366"
    },
    google: {
      name: "Google",
      slug: "google",
      color: "4285F4"
    },
    bing: {
      name: "Bing",
      slug: "microsoftbing",
      color: "008373"
    },
    direct: {
      name: "Direct",
      slug: "direct",
      color: "7D6452"
    },
    other: {
      name: "Other",
      slug: "direct",
      color: "7D6452"
    }
  };
  const totalSrcHumans = Math.max(1, (agg.trafficSources ?? []).reduce((s, v) => s + Number(v.humans), 0));
  const trafficSources = (agg.trafficSources ?? []).map((v) => {
    const meta = SOURCE_META[v.key] ?? {
      name: v.key,
      slug: "direct",
      color: "7D6452"
    };
    const tot = Number(v.total);
    const hum = Number(v.humans);
    const quality = tot ? Math.round(hum / tot * 100) : 100;
    return {
      key: v.key,
      name: meta.name,
      slug: meta.slug,
      color: meta.color,
      humans: hum,
      bots: hideBots2(Number(v.bots)),
      total: hum + hideBots2(Number(v.bots)),
      pct: Math.round(hum / totalSrcHumans * 1e3) / 10,
      quality
    };
  });
  const linkLookup = new Map(agg.links.map((l) => [l.id, l]));
  const topLinks = (agg.topLinks ?? []).map((t) => {
    const l = linkLookup.get(t.link_id);
    const hum = Number(t.humans);
    const tot = Number(t.total);
    return {
      id: t.link_id,
      code: l?.short_code ?? "—",
      title: l?.title ?? null,
      count: hum + hideBots2(Number(t.bots)),
      humans: hum,
      bots: hideBots2(Number(t.bots)),
      health: tot ? Math.round(hum / tot * 100) : 100
    };
  });
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
      routed: c.routed_to
    };
  });
  return {
    kpis: {
      total: displayTotal,
      humans,
      bots: displayBots,
      cps,
      last24h: last24hHumans + hideBots2(last24h - last24hHumans),
      humanRate: displayTotal ? Math.round(humans / displayTotal * 1e3) / 10 : 100,
      activeLinks: agg.links.length,
      oursClicks: Number(agg.oursClicks ?? 0)
    },
    series24h: hourBuckets,
    heatmap,
    heatMax,
    topCountries,
    devices,
    browsers,
    operatingSystems,
    botReasons,
    topLinks,
    liveEvents,
    trafficSources,
    funnel
  };
});
function friendlyReason(raw) {
  const map = {
    ua: "Suspicious User Agent",
    asn: "Datacenter IP",
    ip: "Blocked IP Range",
    rule: "Custom Rule Match",
    "empty/short": "Missing User Agent",
    unknown: "Other"
  };
  return map[raw] ?? raw;
}
function empty() {
  return {
    kpis: {
      total: 0,
      humans: 0,
      bots: 0,
      cps: "0.0",
      last24h: 0,
      humanRate: 100,
      activeLinks: 0,
      oursClicks: 0
    },
    series24h: new Array(24).fill(0),
    heatmap: Array.from({
      length: 7
    }, () => new Array(24).fill(0)),
    heatMax: 1,
    topCountries: [],
    devices: [],
    browsers: [],
    operatingSystems: [],
    botReasons: [],
    topLinks: [],
    liveEvents: [],
    trafficSources: [],
    funnel: []
  };
}
const getCohortRetention_createServerFn_handler = createServerRpc({
  id: "5075a7024ebc8397988f2bd71e539d61981dcba2b1db7fec21131e0a42a1e496",
  name: "getCohortRetention",
  filename: "src/lib/analytics.functions.ts"
}, (opts) => getCohortRetention.__executeServer(opts));
const getCohortRetention = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getCohortRetention_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: links
  } = await supabase.from("links").select("id").eq("user_id", userId);
  const linkIds = (links ?? []).map((l) => l.id);
  if (linkIds.length === 0) return {
    rows: []
  };
  const thirtyAgo = new Date(Date.now() - 30 * 864e5).toISOString();
  const {
    data: raw
  } = await supabase.from("clicks").select("ip, created_at, is_bot").in("link_id", linkIds).gte("created_at", thirtyAgo).order("created_at", {
    ascending: true
  }).limit(5e4);
  const clicks = raw ?? [];
  const dayMs = 864e5;
  const today = Math.floor(Date.now() / dayMs);
  const firstSeen = /* @__PURE__ */ new Map();
  const visitDays = /* @__PURE__ */ new Map();
  clicks.forEach((c) => {
    if (c.is_bot) return;
    const id = c.ip;
    if (!id) return;
    const day = Math.floor(new Date(c.created_at).getTime() / dayMs);
    if (!firstSeen.has(id)) firstSeen.set(id, day);
    const set = visitDays.get(id) ?? /* @__PURE__ */ new Set();
    set.add(day);
    visitDays.set(id, set);
  });
  const cohorts = /* @__PURE__ */ new Map();
  firstSeen.forEach((day, id) => {
    if (today - day > 13) return;
    const arr = cohorts.get(day) ?? [];
    arr.push(id);
    cohorts.set(day, arr);
  });
  const rows = [];
  for (let i = 13; i >= 0; i--) {
    const day = today - i;
    const ids = cohorts.get(day) ?? [];
    const size = ids.length;
    const d1 = ids.filter((id) => visitDays.get(id)?.has(day + 1)).length;
    const d7 = ids.filter((id) => {
      const s = visitDays.get(id);
      if (!s) return false;
      for (let k = day + 1; k <= day + 7; k++) if (s.has(k)) return true;
      return false;
    }).length;
    const d30 = ids.filter((id) => {
      const s = visitDays.get(id);
      if (!s) return false;
      for (let k = day + 1; k <= day + 30; k++) if (s.has(k)) return true;
      return false;
    }).length;
    const dateStr = new Date(day * dayMs).toLocaleDateString([], {
      month: "short",
      day: "numeric"
    });
    rows.push({
      day: dateStr,
      size,
      d1: size ? Math.round(d1 / size * 100) : 0,
      d7: size ? Math.round(d7 / size * 100) : 0,
      d30: size ? Math.round(d30 / size * 100) : 0
    });
  }
  return {
    rows
  };
});
const getLinkDrilldown_createServerFn_handler = createServerRpc({
  id: "ececc0c31830af1c42822bd58ec388ba09a755e000f68f0879bf287140f6ceb4",
  name: "getLinkDrilldown",
  filename: "src/lib/analytics.functions.ts"
}, (opts) => getLinkDrilldown.__executeServer(opts));
const getLinkDrilldown = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => z.object({
  linkId: z.string().uuid()
}).parse(input)).handler(getLinkDrilldown_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: link
  } = await supabase.from("links").select("id, short_code, title, user_id, clicks_count, bot_clicks_count, created_at").eq("id", data.linkId).single();
  if (!link || link.user_id !== userId) throw new Error("Not found");
  const dayAgo = new Date(Date.now() - 864e5).toISOString();
  const {
    data: rawC
  } = await supabase.from("clicks").select("country, ua, is_bot, routed_to, created_at").eq("link_id", data.linkId).gte("created_at", dayAgo).order("created_at", {
    ascending: false
  }).limit(1e4);
  const clicks = rawC ?? [];
  const now = Date.now();
  const series = new Array(24).fill(0);
  clicks.filter((c) => !c.is_bot).forEach((c) => {
    const h = Math.floor((now - new Date(c.created_at).getTime()) / 36e5);
    if (h >= 0 && h < 24) series[23 - h]++;
  });
  const cMap = /* @__PURE__ */ new Map();
  clicks.forEach((c) => {
    const k = (c.country ?? "??").toUpperCase();
    cMap.set(k, (cMap.get(k) ?? 0) + 1);
  });
  const tot = Math.max(1, clicks.length);
  const countries = [...cMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([code, count]) => ({
    code,
    flag: COUNTRIES[code]?.flag ?? "🌐",
    name: COUNTRIES[code]?.name ?? code,
    count,
    pct: Math.round(count / tot * 1e3) / 10
  }));
  const bMap = /* @__PURE__ */ new Map();
  clicks.filter((c) => !c.is_bot).forEach((c) => {
    const b = browserFromUA(c.ua);
    const cur = bMap.get(b.name) ?? {
      count: 0,
      slug: b.slug,
      color: b.color
    };
    cur.count++;
    bMap.set(b.name, cur);
  });
  const humans = clicks.filter((c) => !c.is_bot).length;
  const totH = Math.max(1, humans);
  const browsers = [...bMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 6).map(([name, v]) => ({
    name,
    slug: v.slug,
    color: v.color,
    count: v.count,
    pct: Math.round(v.count / totH * 1e3) / 10
  }));
  const bots = clicks.filter((c) => c.is_bot).length;
  return {
    link: {
      id: link.id,
      code: link.short_code,
      title: link.title,
      total: link.clicks_count,
      created_at: link.created_at
    },
    kpis24h: {
      total: clicks.length,
      humans,
      bots: hideBots(bots),
      humanRate: clicks.length ? Math.round(humans / clicks.length * 1e3) / 10 : 100
    },
    series,
    countries,
    browsers
  };
});
const getLiveFeed_createServerFn_handler = createServerRpc({
  id: "ebfe3b6be396b23758b2dee9f7bf72e509a2996f4a6521fa7f0b9149d1278264",
  name: "getLiveFeed",
  filename: "src/lib/analytics.functions.ts"
}, (opts) => getLiveFeed.__executeServer(opts));
const getLiveFeed = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getLiveFeed_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: links
  } = await supabase.from("links").select("id, short_code, title").eq("user_id", userId);
  const linkIds = (links ?? []).map((l) => l.id);
  if (linkIds.length === 0) {
    return {
      cps5m: 0,
      humans1h: 0,
      bots1h: 0,
      events: [],
      countries: [],
      cohorts: []
    };
  }
  const dayAgo = new Date(Date.now() - 864e5).toISOString();
  const modernWithSource = await supabase.from("clicks").select("id, link_id, country, ua, is_bot, referer_host, created_at").in("link_id", linkIds).gte("created_at", dayAgo).order("created_at", {
    ascending: false
  }).limit(5e3);
  const modern = modernWithSource.error ? await supabase.from("clicks").select("id, link_id, country, ua, is_bot, created_at").in("link_id", linkIds).gte("created_at", dayAgo).order("created_at", {
    ascending: false
  }).limit(5e3) : modernWithSource;
  const legacy = modern.error ? await supabase.from("clicks").select("id, link_id, country, user_agent, is_bot, referer_host, created_at").in("link_id", linkIds).gte("created_at", dayAgo).order("created_at", {
    ascending: false
  }).limit(5e3) : {
    data: null
  };
  const clicks = (modern.error ? legacy.data : modern.data) ?? [];
  const linkLookup = new Map((links ?? []).map((l) => [l.id, l]));
  const now = Date.now();
  const last5m = clicks.filter((c) => now - new Date(c.created_at).getTime() < 3e5).length;
  const last1h = clicks.filter((c) => now - new Date(c.created_at).getTime() < 36e5);
  const humans1h = last1h.filter((c) => !c.is_bot).length;
  const bots1h = Math.floor((last1h.length - humans1h) * 0.8);
  const classifySrc = (host) => {
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
  const events = clicks.slice(0, 50).map((c) => {
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
      browserColor: br.color
    };
  });
  const countryMap = /* @__PURE__ */ new Map();
  clicks.forEach((c) => {
    const k = (c.country ?? "??").toUpperCase();
    countryMap.set(k, (countryMap.get(k) ?? 0) + 1);
  });
  const totalForPct = Math.max(1, clicks.length);
  const countries = [...countryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([code, count]) => ({
    code,
    flag: COUNTRIES[code]?.flag ?? "🌐",
    name: COUNTRIES[code]?.name ?? code,
    count,
    pct: Math.round(count / totalForPct * 100)
  }));
  const cohortMap = /* @__PURE__ */ new Map();
  clicks.forEach((c) => {
    const src = classifySrc(c.referer_host ?? null);
    const cur = cohortMap.get(src) ?? {
      total: 0,
      humans: 0
    };
    cur.total++;
    if (!c.is_bot) cur.humans++;
    cohortMap.set(src, cur);
  });
  const cohorts = [...cohortMap.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 8).map(([source, v]) => ({
    source,
    total: v.total,
    humans: v.humans,
    humanRate: v.total ? Math.round(v.humans / v.total * 100) : 0
  }));
  return {
    cps5m: last5m,
    humans1h,
    bots1h,
    events,
    countries,
    cohorts
  };
});
export {
  getAnalyticsData_createServerFn_handler,
  getCohortRetention_createServerFn_handler,
  getLinkDrilldown_createServerFn_handler,
  getLiveFeed_createServerFn_handler
};
