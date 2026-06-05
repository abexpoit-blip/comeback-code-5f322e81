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
async function getSupabaseAdmin() {
  const mod = await import("./client.server-DIykjMM_.js");
  return mod.supabaseAdmin;
}
async function assertAdmin(userId) {
  const supabaseAdmin = await getSupabaseAdmin();
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Admin only");
  return supabaseAdmin;
}
const listActiveBroadcasts_createServerFn_handler = createServerRpc({
  id: "a7a24c46a80d2424e0647d513c6d94429d1af96678d05dea6973b6631153a0af",
  name: "listActiveBroadcasts",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => listActiveBroadcasts.__executeServer(opts));
const listActiveBroadcasts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listActiveBroadcasts_createServerFn_handler, async ({
  context
}) => {
  const supabaseAdmin = await getSupabaseAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("broadcasts").select("id,title,body,icon,tone,is_active,created_at,expires_at").eq("is_active", true).order("created_at", {
    ascending: false
  }).limit(30);
  if (error) throw new Error(error.message);
  const items = (rows ?? []).filter((b) => !b.expires_at || b.expires_at > now);
  const ids = (items ?? []).map((b) => b.id);
  let readSet = /* @__PURE__ */ new Set();
  if (ids.length) {
    const {
      data: reads
    } = await supabaseAdmin.from("broadcast_reads").select("broadcast_id").eq("user_id", context.userId).in("broadcast_id", ids);
    readSet = new Set((reads ?? []).map((r) => r.broadcast_id));
  }
  const list = (items ?? []).map((b) => ({
    ...b,
    is_read: readSet.has(b.id)
  }));
  return {
    items: list,
    unread_count: list.filter((b) => !b.is_read).length
  };
});
const markBroadcastRead_createServerFn_handler = createServerRpc({
  id: "e8206784df06d687144686f3c096fb642bc8f03dc61db390ec6b936eba7283ad",
  name: "markBroadcastRead",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => markBroadcastRead.__executeServer(opts));
const markBroadcastRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  broadcast_id: z.string().uuid()
}).parse(d)).handler(markBroadcastRead_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await getSupabaseAdmin();
  await supabaseAdmin.from("broadcast_reads").upsert({
    broadcast_id: data.broadcast_id,
    user_id: context.userId
  }, {
    onConflict: "broadcast_id,user_id",
    ignoreDuplicates: true
  });
  return {
    ok: true
  };
});
const markAllBroadcastsRead_createServerFn_handler = createServerRpc({
  id: "f016c98b2e817b989ed022d0201e783a8e5be614784a801b60e1a421f7528d47",
  name: "markAllBroadcastsRead",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => markAllBroadcastsRead.__executeServer(opts));
const markAllBroadcastsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(markAllBroadcastsRead_createServerFn_handler, async ({
  context
}) => {
  const supabaseAdmin = await getSupabaseAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: rows
  } = await supabaseAdmin.from("broadcasts").select("id,expires_at").eq("is_active", true);
  const items = (rows ?? []).filter((b) => !b.expires_at || b.expires_at > now);
  const ids = (items ?? []).map((b) => b.id);
  if (!ids.length) return {
    ok: true
  };
  const readRows = ids.map((id) => ({
    broadcast_id: id,
    user_id: context.userId
  }));
  await supabaseAdmin.from("broadcast_reads").upsert(readRows, {
    onConflict: "broadcast_id,user_id",
    ignoreDuplicates: true
  });
  return {
    ok: true
  };
});
const adminListBroadcasts_createServerFn_handler = createServerRpc({
  id: "04e872fb0d01ba1b3e863172879ed5bde0335b90ed47f192a2945b590b8f71ac",
  name: "adminListBroadcasts",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => adminListBroadcasts.__executeServer(opts));
const adminListBroadcasts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListBroadcasts_createServerFn_handler, async ({
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("broadcasts").select("*").order("created_at", {
    ascending: false
  }).limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminCreateBroadcast_createServerFn_handler = createServerRpc({
  id: "5f6eccfa87bb74e880ef5c7b6be6f2c8b580ab981c8d09f4c4528e4c4c437621",
  name: "adminCreateBroadcast",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => adminCreateBroadcast.__executeServer(opts));
const adminCreateBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(2e3),
  icon: z.string().trim().min(1).max(64).default("sparkles"),
  tone: z.enum(["info", "success", "warning", "premium"]).default("premium"),
  expires_at: z.string().datetime().nullable().optional()
}).parse(d)).handler(adminCreateBroadcast_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    data: row,
    error
  } = await supabaseAdmin.from("broadcasts").insert({
    title: data.title,
    body: data.body,
    icon: data.icon,
    tone: data.tone,
    expires_at: data.expires_at ?? null,
    created_by: context.userId,
    is_active: true
  }).select("*").single();
  if (error) throw new Error(error.message);
  return row;
});
const adminToggleBroadcast_createServerFn_handler = createServerRpc({
  id: "1448d5673a2cf8b026dbbfdb5c8375af6b36194158e063a558d3b3c15042688f",
  name: "adminToggleBroadcast",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => adminToggleBroadcast.__executeServer(opts));
const adminToggleBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(adminToggleBroadcast_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("broadcasts").update({
    is_active: data.is_active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteBroadcast_createServerFn_handler = createServerRpc({
  id: "cd4a556407e6a4aeeae66831a19a9b2ef423e0fa43b0b03e9e06b72b0678b013",
  name: "adminDeleteBroadcast",
  filename: "src/lib/broadcasts.functions.ts"
}, (opts) => adminDeleteBroadcast.__executeServer(opts));
const adminDeleteBroadcast = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminDeleteBroadcast_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("broadcasts").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminCreateBroadcast_createServerFn_handler,
  adminDeleteBroadcast_createServerFn_handler,
  adminListBroadcasts_createServerFn_handler,
  adminToggleBroadcast_createServerFn_handler,
  listActiveBroadcasts_createServerFn_handler,
  markAllBroadcastsRead_createServerFn_handler,
  markBroadcastRead_createServerFn_handler
};
