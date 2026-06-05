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
const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
function normalize(d) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}
async function assertAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Admin only.");
}
const getPrimaryShortenerDomain_createServerFn_handler = createServerRpc({
  id: "87126bafbcd309dc27cc5706d57437ace030670bcca11c9f6c75b71d93c73851",
  name: "getPrimaryShortenerDomain",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => getPrimaryShortenerDomain.__executeServer(opts));
const getPrimaryShortenerDomain = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getPrimaryShortenerDomain_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data
  } = await supabase.from("shortener_domains").select("domain").eq("is_primary", true).eq("is_active", true).maybeSingle();
  return {
    domain: data?.domain ?? "sleepox.com"
  };
});
const listShortenerDomains_createServerFn_handler = createServerRpc({
  id: "675f3c6e35cdf9e21799e99049d50a107145929e859f67b3331def446d0e3442",
  name: "listShortenerDomains",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => listShortenerDomains.__executeServer(opts));
const listShortenerDomains = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listShortenerDomains_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data,
    error
  } = await supabase.from("shortener_domains").select("id, domain, dns_target, is_primary, is_active, verified, verified_at, note, created_at").order("is_primary", {
    ascending: false
  }).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    domains: data ?? []
  };
});
const addShortenerDomain_createServerFn_handler = createServerRpc({
  id: "7a5acc626a5a3f98becb442cb561fab68cb2b6e24f8d94b7460dace3576ce691",
  name: "addShortenerDomain",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => addShortenerDomain.__executeServer(opts));
const addShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  domain: z.string().min(3).max(253),
  note: z.string().max(200).optional()
}).parse(d)).handler(addShortenerDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const domain = normalize(data.domain);
  if (!domainRegex.test(domain)) throw new Error("Invalid domain (e.g. trk.example.com)");
  const {
    data: existing
  } = await supabase.from("shortener_domains").select("id").eq("domain", domain).maybeSingle();
  if (existing) throw new Error("Domain already in pool.");
  const {
    data: row,
    error
  } = await supabase.from("shortener_domains").insert({
    domain,
    note: data.note ?? null
  }).select("*").single();
  if (error) throw new Error(error.message);
  return row;
});
const verifyShortenerDomain_createServerFn_handler = createServerRpc({
  id: "a058660ea02ba7cbf12e063486ed515d42da7fbb053c48b5551c124731af3a7a",
  name: "verifyShortenerDomain",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => verifyShortenerDomain.__executeServer(opts));
const verifyShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(verifyShortenerDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: row
  } = await supabase.from("shortener_domains").select("id, domain, dns_target").eq("id", data.id).maybeSingle();
  if (!row) throw new Error("Not found");
  let ok = false;
  let foundIps = [];
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(row.domain)}&type=A`, {
      headers: {
        accept: "application/dns-json"
      }
    });
    const j = await r.json();
    foundIps = (j?.Answer ?? []).map((a) => String(a?.data ?? ""));
    ok = foundIps.includes(row.dns_target);
  } catch {
  }
  if (!ok) {
    return {
      ok: false,
      message: `A record not pointing to ${row.dns_target}. Found: ${foundIps.join(", ") || "none"}`
    };
  }
  await supabase.from("shortener_domains").update({
    verified: true,
    verified_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", row.id);
  return {
    ok: true,
    message: "Domain verified — DNS points to VPS."
  };
});
const setPrimaryShortenerDomain_createServerFn_handler = createServerRpc({
  id: "0c66c49165651b4ffab6e22b0cdae4c0614d52034a7a175f9d39129dd2e095bc",
  name: "setPrimaryShortenerDomain",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => setPrimaryShortenerDomain.__executeServer(opts));
const setPrimaryShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(setPrimaryShortenerDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: row
  } = await supabase.from("shortener_domains").select("id, verified, is_active").eq("id", data.id).maybeSingle();
  if (!row) throw new Error("Not found");
  if (!row.verified) throw new Error("Verify the domain first (DNS A record must point to VPS).");
  if (!row.is_active) throw new Error("Activate the domain first.");
  const {
    error: clearErr
  } = await supabase.from("shortener_domains").update({
    is_primary: false
  }).eq("is_primary", true);
  if (clearErr) throw new Error(clearErr.message);
  const {
    error
  } = await supabase.from("shortener_domains").update({
    is_primary: true
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const toggleShortenerDomainActive_createServerFn_handler = createServerRpc({
  id: "1adc7e4f1eabc87ea6bb2c83d5b28ef7a15be1a77652472108c24d5bfa2d2046",
  name: "toggleShortenerDomainActive",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => toggleShortenerDomainActive.__executeServer(opts));
const toggleShortenerDomainActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(toggleShortenerDomainActive_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabase.from("shortener_domains").update({
    is_active: data.is_active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteShortenerDomain_createServerFn_handler = createServerRpc({
  id: "920f8c9263af78ae515fa3fc38f21082c4c859114bcbefa3150c21d29585ab4b",
  name: "deleteShortenerDomain",
  filename: "src/lib/shortener-domains.functions.ts"
}, (opts) => deleteShortenerDomain.__executeServer(opts));
const deleteShortenerDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(deleteShortenerDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    data: row
  } = await supabase.from("shortener_domains").select("is_primary").eq("id", data.id).maybeSingle();
  if (row?.is_primary) throw new Error("Cannot delete the primary domain. Promote another first.");
  const {
    error
  } = await supabase.from("shortener_domains").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  addShortenerDomain_createServerFn_handler,
  deleteShortenerDomain_createServerFn_handler,
  getPrimaryShortenerDomain_createServerFn_handler,
  listShortenerDomains_createServerFn_handler,
  setPrimaryShortenerDomain_createServerFn_handler,
  toggleShortenerDomainActive_createServerFn_handler,
  verifyShortenerDomain_createServerFn_handler
};
