import { c as createSsrRpc } from "./createSsrRpc-DJC6aB8i.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import { s as supabase } from "./client-B6X92QMo.js";
const getAppSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("838f2ceee278914bec7fbf3251251e6d0a1d7d00acfb990c9108a082a40b3e8e"));
const updateAppSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  fallback_url: z.string().url(),
  our_adsterra_url: z.string().url(),
  injection_threshold: z.number().int().min(100).max(1e6),
  injection_count: z.number().int().min(1).max(1e4),
  daily_redirect_enabled: z.boolean()
}).parse(d)).handler(createSsrRpc("d1362deff3d396bfcdfb8e972cd5bce32a5ae6b6153da6bd4fa9f46a17972103"));
const consumeDailyRedirect = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a7f658afcf8531c0755b81850e2d5d8f52e9d70a1b734a8953647f110d3c2dd3"));
const ADMIN_KEY = "__sleepox_admin_session__";
const FLAG_KEY = "__sleepox_impersonating__";
function getImpersonationFlag() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FLAG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function startImpersonation(args) {
  const { data: sess } = await supabase.auth.getSession();
  const adminSession = sess.session;
  if (!adminSession?.access_token || !adminSession?.refresh_token) {
    throw new Error("No active admin session to preserve");
  }
  const adminEmail = adminSession.user?.email ?? null;
  localStorage.setItem(
    ADMIN_KEY,
    JSON.stringify({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
      email: adminEmail
    })
  );
  const { error } = await supabase.auth.verifyOtp({
    token_hash: args.hashed_token,
    type: "magiclink"
  });
  if (error) {
    localStorage.removeItem(ADMIN_KEY);
    throw new Error(error.message);
  }
  const flag = {
    admin_email: adminEmail,
    target_id: args.target.id,
    target_email: args.target.email,
    target_name: args.target.full_name,
    started_at: Date.now()
  };
  localStorage.setItem(FLAG_KEY, JSON.stringify(flag));
}
async function exitImpersonation() {
  const raw = typeof window !== "undefined" ? localStorage.getItem(ADMIN_KEY) : null;
  if (!raw) {
    localStorage.removeItem(FLAG_KEY);
    return { restored: false };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(FLAG_KEY);
    return { restored: false };
  }
  const { error } = await supabase.auth.setSession({
    access_token: parsed.access_token,
    refresh_token: parsed.refresh_token
  });
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(FLAG_KEY);
  if (error) throw new Error(error.message);
  return { restored: true };
}
export {
  getAppSettings as a,
  consumeDailyRedirect as c,
  exitImpersonation as e,
  getImpersonationFlag as g,
  startImpersonation as s,
  updateAppSettings as u
};
