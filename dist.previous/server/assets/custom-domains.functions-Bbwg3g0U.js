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
const PAID_PLANS = /* @__PURE__ */ new Set(["starter", "pro", "business", "enterprise", "premium", "monthly", "lifetime", "unlimited"]);
const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
function normalize(d) {
  return d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}
async function assertPaid(supabase, userId) {
  const {
    data: profile
  } = await supabase.from("profiles").select("plan_slug").eq("id", userId).maybeSingle();
  const slug = (profile?.plan_slug ?? "free").toLowerCase();
  if (!PAID_PLANS.has(slug)) {
    throw new Error("Custom domains are available on paid plans. Upgrade to add a domain.");
  }
}
const listCustomDomains_createServerFn_handler = createServerRpc({
  id: "97f77b17ad7cf2ea7548d5f8a98b6bb3feb57085522b172b3b8daff60ac9017a",
  name: "listCustomDomains",
  filename: "src/lib/custom-domains.functions.ts"
}, (opts) => listCustomDomains.__executeServer(opts));
const listCustomDomains = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCustomDomains_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("plan_slug").eq("id", userId).maybeSingle();
  const slug = (profile?.plan_slug ?? "free").toLowerCase();
  const isPaid = PAID_PLANS.has(slug);
  const {
    data,
    error
  } = await supabase.from("custom_domains").select("id, domain, verification_token, verified, verified_at, created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    domains: data ?? [],
    isPaid,
    planSlug: slug
  };
});
const addCustomDomain_createServerFn_handler = createServerRpc({
  id: "e7589b16b723e1e56a17039009a41da916ef39341d3d6dcf84ccf302baeacb6d",
  name: "addCustomDomain",
  filename: "src/lib/custom-domains.functions.ts"
}, (opts) => addCustomDomain.__executeServer(opts));
const addCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  domain: z.string().min(3).max(253)
}).parse(data)).handler(addCustomDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertPaid(supabase, userId);
  const domain = normalize(data.domain);
  if (!domainRegex.test(domain)) throw new Error("Invalid domain format (e.g. links.yoursite.com)");
  const {
    data: existing
  } = await supabase.from("custom_domains").select("id").eq("domain", domain).maybeSingle();
  if (existing) throw new Error("This domain is already registered.");
  const tokenBytes = new Uint8Array(16);
  crypto.getRandomValues(tokenBytes);
  const verification_token = Array.from(tokenBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const {
    data: inserted,
    error
  } = await supabase.from("custom_domains").insert({
    user_id: userId,
    domain,
    verification_token
  }).select("id, domain, verification_token, verified, created_at").single();
  if (error) throw new Error(`Could not save domain: ${error.message}`);
  return inserted;
});
const verifyCustomDomain_createServerFn_handler = createServerRpc({
  id: "36ce9ea947ca1461e16afeef4233a775a41ef56f3623c89caef3ce56d0b6c85c",
  name: "verifyCustomDomain",
  filename: "src/lib/custom-domains.functions.ts"
}, (opts) => verifyCustomDomain.__executeServer(opts));
const verifyCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  id: z.string().uuid()
}).parse(data)).handler(verifyCustomDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: row
  } = await supabase.from("custom_domains").select("id, domain, verification_token, verified").eq("id", data.id).eq("user_id", userId).maybeSingle();
  if (!row) throw new Error("Domain not found.");
  const txtName = `_sleepox-verify.${row.domain}`;
  const cnameName = row.domain;
  let txtOk = false;
  let cnameOk = false;
  let cnameTarget = "";
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(txtName)}&type=TXT`, {
      headers: {
        accept: "application/dns-json"
      }
    });
    const j = await r.json();
    const answers = j?.Answer ?? [];
    txtOk = answers.some((a) => String(a?.data ?? "").replace(/^"|"$/g, "").includes(row.verification_token));
  } catch {
  }
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cnameName)}&type=CNAME`, {
      headers: {
        accept: "application/dns-json"
      }
    });
    const j = await r.json();
    const answers = j?.Answer ?? [];
    const match = answers.find((a) => String(a?.data ?? "").toLowerCase().includes("sleepox.com"));
    cnameOk = !!match;
    cnameTarget = match?.data ?? "";
  } catch {
  }
  if (!txtOk) {
    return {
      ok: false,
      message: `TXT record not found. Add a TXT record at ${txtName} with value: ${row.verification_token}`,
      txtOk,
      cnameOk,
      cnameTarget
    };
  }
  if (!cnameOk) {
    return {
      ok: false,
      message: `CNAME record not pointing to sleepox.com. Add a CNAME at ${row.domain} → sleepox.com`,
      txtOk,
      cnameOk,
      cnameTarget
    };
  }
  await supabase.from("custom_domains").update({
    verified: true,
    verified_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", row.id);
  return {
    ok: true,
    message: "Domain verified successfully!",
    txtOk,
    cnameOk,
    cnameTarget
  };
});
const deleteCustomDomain_createServerFn_handler = createServerRpc({
  id: "2e532c20c177a32bf49dba1d988d1f7cf98a283132625522d12e743cc12f8734",
  name: "deleteCustomDomain",
  filename: "src/lib/custom-domains.functions.ts"
}, (opts) => deleteCustomDomain.__executeServer(opts));
const deleteCustomDomain = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({
  id: z.string().uuid()
}).parse(data)).handler(deleteCustomDomain_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("custom_domains").delete().eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  addCustomDomain_createServerFn_handler,
  deleteCustomDomain_createServerFn_handler,
  listCustomDomains_createServerFn_handler,
  verifyCustomDomain_createServerFn_handler
};
