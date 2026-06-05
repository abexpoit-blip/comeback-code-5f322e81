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
function normalizeLink(row) {
  return {
    ...row,
    adsterra_url: row.adsterra_url ?? row.adsterra_direct_link ?? row.destination_url ?? "",
    safe_url: row.safe_url ?? (row.adsterra_direct_link ? row.destination_url : "https://sleepox.com/") ?? "https://sleepox.com/",
    is_active: row.is_active ?? row.status === "active"
  };
}
async function selectLinks(supabase) {
  const legacy = await supabase.from("links").select("id, user_id, short_code, title, destination_url, adsterra_direct_link, status, clicks_count, bot_clicks_count, created_at, updated_at, prelanding_template").order("created_at", {
    ascending: false
  });
  if (!legacy.error) return {
    data: (legacy.data ?? []).map((row) => normalizeLink(row)),
    error: null
  };
  const modern = await supabase.from("links").select("*").order("created_at", {
    ascending: false
  });
  return modern.error ? legacy : {
    data: (modern.data ?? []).map((row) => normalizeLink(row)),
    error: null
  };
}
async function getProfileQuota(supabase, userId) {
  const modern = await supabase.from("profiles").select("plan_slug, link_limit, links_used").eq("id", userId).single();
  if (modern.error) return null;
  const plan = String(modern.data?.plan_slug ?? "").toLowerCase();
  if (plan === "lifetime" || plan === "unlimited") {
    return {
      limit: null,
      used: modern.data?.links_used ?? 0
    };
  }
  return {
    limit: modern.data?.link_limit ?? null,
    used: modern.data?.links_used ?? 0
  };
}
function randomCode(len = 6) {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
const listMyLinks_createServerFn_handler = createServerRpc({
  id: "d92329a3920cdf27b95b7cdd8aad02e139123df62ceb742f8f8e8acfe52088c7",
  name: "listMyLinks",
  filename: "src/lib/links.functions.ts"
}, (opts) => listMyLinks.__executeServer(opts));
const listMyLinks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyLinks_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await selectLinks(context.supabase);
  if (error) throw new Error(error.message);
  return data;
});
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "44d979f29b3090e2a0d4d5aebf18305dbf03f2b37a638449350f6fa601ee257f",
  name: "getMyProfile",
  filename: "src/lib/links.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("profiles").select("*").eq("id", context.userId).single();
  if (error) throw new Error(error.message);
  return data;
});
const getDashboardData_createServerFn_handler = createServerRpc({
  id: "6a23396487d12637aec30b2c5bc38775e6a4e107ee1378e0e7da2dfea39445c4",
  name: "getDashboardData",
  filename: "src/lib/links.functions.ts"
}, (opts) => getDashboardData.__executeServer(opts));
const getDashboardData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDashboardData_createServerFn_handler, async ({
  context
}) => {
  const [linksRes, profileRes, statsRes] = await Promise.all([selectLinks(context.supabase), context.supabase.from("profiles").select("*").eq("id", context.userId).single(), context.supabase.rpc("get_dashboard_stats", {
    _user_id: context.userId
  })]);
  if (linksRes.error) throw new Error(linksRes.error.message);
  if (profileRes.error) throw new Error(profileRes.error.message);
  const links = linksRes.data ?? [];
  const stats = statsRes.data ?? {
    clicksByDay: {},
    countryStats: {},
    mobilePct: 0,
    uniqueVisitors: 0,
    perLinkDaily: {}
  };
  const perLinkDaily = {};
  for (const l of links) {
    const arr = stats.perLinkDaily?.[l.id];
    perLinkDaily[l.id] = Array.isArray(arr) && arr.length === 7 ? arr.map(Number) : new Array(7).fill(0);
  }
  const clicksByDay = {};
  for (let i = 29; i >= 0; i--) {
    const k = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
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
      perLinkDaily
    }
  };
});
const createLink_createServerFn_handler = createServerRpc({
  id: "da1ead2589edcd03e14bb7e21f054c2a6a483664cebe9882e25cdfa88bf78c07",
  name: "createLink",
  filename: "src/lib/links.functions.ts"
}, (opts) => createLink.__executeServer(opts));
const createLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  title: z.string().max(200).optional(),
  adsterra_url: z.string().url(),
  safe_url: z.string().url().optional()
}).parse(d)).handler(createLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const profile = await getProfileQuota(context.supabase, context.userId);
  if (profile && profile.limit !== null && profile.used >= profile.limit) {
    throw new Error(`Link limit reached (${profile.used}/${profile.limit}). Please upgrade.`);
  }
  let code = randomCode();
  for (let i = 0; i < 5; i++) {
    const {
      data: exists
    } = await context.supabase.from("links").select("id").eq("short_code", code).maybeSingle();
    if (!exists) break;
    code = randomCode();
  }
  const createdLegacy = await context.supabase.from("links").insert({
    user_id: context.userId,
    short_code: code,
    title: data.title ?? null,
    destination_url: data.safe_url ?? "https://sleepox.com/",
    adsterra_direct_link: data.adsterra_url,
    status: "active"
  }).select().single();
  let link = createdLegacy.data ? normalizeLink(createdLegacy.data) : null;
  let error = createdLegacy.error;
  if (error) {
    const modern = await context.supabase.from("links").insert({
      user_id: context.userId,
      short_code: code,
      title: data.title ?? null,
      adsterra_url: data.adsterra_url,
      safe_url: data.safe_url ?? "https://sleepox.com/"
    }).select().single();
    link = modern.data ? normalizeLink(modern.data) : null;
    error = modern.error;
  }
  if (error) throw new Error(error.message);
  return link;
});
const deleteLink_createServerFn_handler = createServerRpc({
  id: "6021030f0f52bde86b3a053c6b16c05f0977afd13e86af1e3a8bd8e3c1ad4d75",
  name: "deleteLink",
  filename: "src/lib/links.functions.ts"
}, (opts) => deleteLink.__executeServer(opts));
const deleteLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(deleteLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: link,
    error: lookupError
  } = await context.supabase.from("links").select("id").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  if (!link) throw new Error("Link not found");
  const {
    error
  } = await context.supabase.from("links").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const toggleLink_createServerFn_handler = createServerRpc({
  id: "095595cb077a7d492cff96d4e7ec4bf67e6f183f2efdbbaeeb057b114ece087b",
  name: "toggleLink",
  filename: "src/lib/links.functions.ts"
}, (opts) => toggleLink.__executeServer(opts));
const toggleLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(toggleLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const legacy = await context.supabase.from("links").update({
    status: data.is_active ? "active" : "paused"
  }).eq("id", data.id).eq("user_id", context.userId);
  const {
    error
  } = legacy.error ? await context.supabase.from("links").update({
    is_active: data.is_active
  }).eq("id", data.id).eq("user_id", context.userId) : legacy;
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const TEMPLATE_VALUES = ["verify", "reward", "countdown", "article", "article_health", "article_news", "article_finance", "article_lifestyle", "article_tech", "article_celebrity", "article_business", "article_travel"];
const updateLinkTemplate_createServerFn_handler = createServerRpc({
  id: "dd4dbb6d223536d6f6795a2cc71cf7d09feaca554621ea796c74d5c952e25c7e",
  name: "updateLinkTemplate",
  filename: "src/lib/links.functions.ts"
}, (opts) => updateLinkTemplate.__executeServer(opts));
const updateLinkTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  prelanding_template: z.enum(TEMPLATE_VALUES)
}).parse(d)).handler(updateLinkTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("links").update({
    prelanding_template: data.prelanding_template
  }).eq("id", data.id).eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createLink_createServerFn_handler,
  deleteLink_createServerFn_handler,
  getDashboardData_createServerFn_handler,
  getMyProfile_createServerFn_handler,
  listMyLinks_createServerFn_handler,
  toggleLink_createServerFn_handler,
  updateLinkTemplate_createServerFn_handler
};
