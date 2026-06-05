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
const getAppSettings_createServerFn_handler = createServerRpc({
  id: "838f2ceee278914bec7fbf3251251e6d0a1d7d00acfb990c9108a082a40b3e8e",
  name: "getAppSettings",
  filename: "src/lib/app-settings.functions.ts"
}, (opts) => getAppSettings.__executeServer(opts));
const getAppSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAppSettings_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("app_settings").select("*").eq("id", true).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});
const updateAppSettings_createServerFn_handler = createServerRpc({
  id: "d1362deff3d396bfcdfb8e972cd5bce32a5ae6b6153da6bd4fa9f46a17972103",
  name: "updateAppSettings",
  filename: "src/lib/app-settings.functions.ts"
}, (opts) => updateAppSettings.__executeServer(opts));
const updateAppSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  fallback_url: z.string().url(),
  our_adsterra_url: z.string().url(),
  injection_threshold: z.number().int().min(100).max(1e6),
  injection_count: z.number().int().min(1).max(1e4),
  daily_redirect_enabled: z.boolean()
}).parse(d)).handler(updateAppSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Admin only");
  const {
    error
  } = await context.supabase.from("app_settings").update(data).eq("id", true);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const consumeDailyRedirect_createServerFn_handler = createServerRpc({
  id: "a7f658afcf8531c0755b81850e2d5d8f52e9d70a1b734a8953647f110d3c2dd3",
  name: "consumeDailyRedirect",
  filename: "src/lib/app-settings.functions.ts"
}, (opts) => consumeDailyRedirect.__executeServer(opts));
const consumeDailyRedirect = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(consumeDailyRedirect_createServerFn_handler, async ({
  context
}) => {
  const {
    data: settings
  } = await context.supabase.from("app_settings").select("fallback_url, daily_redirect_enabled").eq("id", true).maybeSingle();
  if (!settings || !settings.daily_redirect_enabled) return {
    url: null
  };
  const {
    data: profile
  } = await context.supabase.from("profiles").select("last_daily_redirect_at").eq("id", context.userId).single();
  const last = profile?.last_daily_redirect_at ? new Date(profile.last_daily_redirect_at) : null;
  const now = /* @__PURE__ */ new Date();
  const sameUTCDay = !!last && last.getUTCFullYear() === now.getUTCFullYear() && last.getUTCMonth() === now.getUTCMonth() && last.getUTCDate() === now.getUTCDate();
  if (sameUTCDay) return {
    url: null
  };
  await context.supabase.from("profiles").update({
    last_daily_redirect_at: now.toISOString()
  }).eq("id", context.userId);
  return {
    url: settings.fallback_url
  };
});
export {
  consumeDailyRedirect_createServerFn_handler,
  getAppSettings_createServerFn_handler,
  updateAppSettings_createServerFn_handler
};
