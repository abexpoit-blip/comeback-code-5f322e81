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
const getSupportStatus_createServerFn_handler = createServerRpc({
  id: "4232df71ecb46ace539231cd45c37cb0e19c0e6e446eae681af43cbbd88b9289",
  name: "getSupportStatus",
  filename: "src/lib/support.functions.ts"
}, (opts) => getSupportStatus.__executeServer(opts));
const getSupportStatus = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getSupportStatus_createServerFn_handler, async () => {
  const supabaseAdmin = await getSupabaseAdmin();
  const {
    data
  } = await supabaseAdmin.from("app_settings").select("support_enabled").eq("id", true).maybeSingle();
  return {
    enabled: data?.support_enabled !== false
  };
});
const toggleSupport_createServerFn_handler = createServerRpc({
  id: "60f71deb45e0653765a6811c7c1a3529c1101d76a901ed484be4f73850c2cb25",
  name: "toggleSupport",
  filename: "src/lib/support.functions.ts"
}, (opts) => toggleSupport.__executeServer(opts));
const toggleSupport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  enabled: z.boolean()
}).parse(d)).handler(toggleSupport_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("app_settings").update({
    support_enabled: data.enabled
  }).eq("id", true);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    enabled: data.enabled
  };
});
const createSupportTicket_createServerFn_handler = createServerRpc({
  id: "42b7e30546b5a7c03d1813ff23502b3d12d813b160186ef0bd9c4bac61108f25",
  name: "createSupportTicket",
  filename: "src/lib/support.functions.ts"
}, (opts) => createSupportTicket.__executeServer(opts));
const createSupportTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(4e3)
}).parse(d)).handler(createSupportTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await getSupabaseAdmin();
  const {
    data: settings
  } = await supabaseAdmin.from("app_settings").select("support_enabled").eq("id", true).maybeSingle();
  if (settings?.support_enabled === false) {
    throw new Error("Support is currently disabled by admin");
  }
  const {
    count: openCount
  } = await supabaseAdmin.from("support_tickets").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", context.userId).neq("status", "closed");
  if ((openCount ?? 0) >= 5) {
    throw new Error("You already have 5 open tickets. Please wait for replies.");
  }
  const {
    data: row,
    error
  } = await supabaseAdmin.from("support_tickets").insert({
    user_id: context.userId,
    subject: data.subject,
    message: data.message,
    status: "open"
  }).select("*").single();
  if (error) throw new Error(error.message);
  return row;
});
const listMyTickets_createServerFn_handler = createServerRpc({
  id: "fc61c87057e42ff737d09bcfb7757cc796eae0cea9ebee443116a9fcdf1ff026",
  name: "listMyTickets",
  filename: "src/lib/support.functions.ts"
}, (opts) => listMyTickets.__executeServer(opts));
const listMyTickets = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyTickets_createServerFn_handler, async ({
  context
}) => {
  const supabaseAdmin = await getSupabaseAdmin();
  const {
    data,
    error
  } = await supabaseAdmin.from("support_tickets").select("*").eq("user_id", context.userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminListTickets_createServerFn_handler = createServerRpc({
  id: "e1a55e5c6b99a0b0eb865c8e192cf8cc606999b4745cddbcbe8f7be5ad4d1653",
  name: "adminListTickets",
  filename: "src/lib/support.functions.ts"
}, (opts) => adminListTickets.__executeServer(opts));
const adminListTickets = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  status: z.enum(["all", "open", "replied", "closed"]).default("all"),
  limit: z.number().int().min(1).max(200).default(100)
}).partial().parse(d ?? {})).handler(adminListTickets_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  let q = supabaseAdmin.from("support_tickets").select("*").order("created_at", {
    ascending: false
  }).limit(data?.limit ?? 100);
  if (data?.status && data.status !== "all") q = q.eq("status", data.status);
  const {
    data: tickets,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const userIds = Array.from(new Set((tickets ?? []).map((t) => t.user_id)));
  let profileMap = {};
  if (userIds.length) {
    const {
      data: profs
    } = await supabaseAdmin.from("profiles").select("id,email,full_name").in("id", userIds);
    (profs ?? []).forEach((p) => {
      profileMap[p.id] = {
        email: p.email,
        full_name: p.full_name
      };
    });
  }
  return (tickets ?? []).map((t) => ({
    ...t,
    user_email: profileMap[t.user_id]?.email ?? null,
    user_name: profileMap[t.user_id]?.full_name ?? null
  }));
});
const adminReplyTicket_createServerFn_handler = createServerRpc({
  id: "0915f3d798cdd971c6853d37be243476661e93e2223a3dd942d93a41800d2aea",
  name: "adminReplyTicket",
  filename: "src/lib/support.functions.ts"
}, (opts) => adminReplyTicket.__executeServer(opts));
const adminReplyTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid(),
  reply: z.string().trim().min(1).max(4e3)
}).parse(d)).handler(adminReplyTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("support_tickets").update({
    admin_reply: data.reply,
    status: "replied",
    replied_at: (/* @__PURE__ */ new Date()).toISOString(),
    replied_by: context.userId
  }).eq("id", data.ticket_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminCloseTicket_createServerFn_handler = createServerRpc({
  id: "acbaed78f6c68877955a629d7c4e5d50cb08a43069712ca87cf3f699e24ffb82",
  name: "adminCloseTicket",
  filename: "src/lib/support.functions.ts"
}, (opts) => adminCloseTicket.__executeServer(opts));
const adminCloseTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid()
}).parse(d)).handler(adminCloseTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("support_tickets").update({
    status: "closed"
  }).eq("id", data.ticket_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteTicket_createServerFn_handler = createServerRpc({
  id: "277c4fd6385e870fb41a79493b7bcc699df07ca1b5b69d6fe557c120fead684e",
  name: "adminDeleteTicket",
  filename: "src/lib/support.functions.ts"
}, (opts) => adminDeleteTicket.__executeServer(opts));
const adminDeleteTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ticket_id: z.string().uuid()
}).parse(d)).handler(adminDeleteTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("support_tickets").delete().eq("id", data.ticket_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminCloseTicket_createServerFn_handler,
  adminDeleteTicket_createServerFn_handler,
  adminListTickets_createServerFn_handler,
  adminReplyTicket_createServerFn_handler,
  createSupportTicket_createServerFn_handler,
  getSupportStatus_createServerFn_handler,
  listMyTickets_createServerFn_handler,
  toggleSupport_createServerFn_handler
};
