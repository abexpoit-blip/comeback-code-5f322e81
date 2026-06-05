import { c as createServerRpc } from "./createServerRpc-Bw0UcUeN.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { supabaseAdmin } from "./client.server-DIykjMM_.js";
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
const createInvoice_createServerFn_handler = createServerRpc({
  id: "610029ca7d9b6bceabdd6889b6f13177b782af71484aa1cb6ff2caf36df0895e",
  name: "createInvoice",
  filename: "src/lib/billing.functions.ts"
}, (opts) => createInvoice.__executeServer(opts));
const createInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  package_slug: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/)
}).parse(d)).handler(createInvoice_createServerFn_handler, async ({
  data,
  context
}) => {
  const apiKey = process.env.PLISIO_API_KEY;
  if (!apiKey) throw new Error("Plisio API key not configured");
  const {
    data: pkg,
    error: pkgErr
  } = await supabaseAdmin.from("packages").select("slug, name, price_usd").eq("slug", data.package_slug).eq("is_active", true).single();
  if (pkgErr || !pkg) throw new Error("Package not found");
  if (Number(pkg.price_usd) <= 0) throw new Error("This package does not require payment");
  const chargeAmount = (Number(pkg.price_usd) * 1.02).toFixed(2);
  const {
    data: req,
    error: reqErr
  } = await supabaseAdmin.from("upgrade_requests").insert({
    user_id: context.userId,
    package_slug: pkg.slug,
    amount: Number(chargeAmount),
    status: "pending"
  }).select().single();
  if (reqErr || !req) throw new Error("Failed to create order");
  const origin = "https://sleepox.com";
  const params = new URLSearchParams({
    api_key: apiKey,
    order_number: req.id,
    order_name: `${pkg.name} — Sleepox`,
    source_amount: chargeAmount,
    source_currency: "USD",
    callback_url: `${origin}/api/public/plisio-webhook?json=true`,
    success_callback_url: `${origin}/upgrade?status=success`,
    fail_callback_url: `${origin}/upgrade?status=fail`,
    email: ""
  });
  console.log("[plisio] requesting invoice for order", req.id, "amount", chargeAmount);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2e4);
  let res;
  let raw = "";
  try {
    res = await fetch(`https://api.plisio.net/api/v1/invoices/new?${params}`, {
      signal: ctrl.signal
    });
    raw = await res.text();
  } catch (e) {
    clearTimeout(timer);
    console.error("[plisio] fetch failed:", e?.message || e);
    throw new Error(`Plisio request failed: ${e?.message || "network error"}`);
  }
  clearTimeout(timer);
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = null;
  }
  console.log("[plisio] http", res.status, "body", raw.slice(0, 500));
  if (!json || json.status !== "success" || !json.data?.invoice_url) {
    const msg = json?.data?.message || json?.message || json?.data?.name || `HTTP ${res.status}: ${raw.slice(0, 200)}`;
    throw new Error(`Plisio error: ${msg}`);
  }
  await supabaseAdmin.from("upgrade_requests").update({
    plisio_invoice_id: json.data.txn_id || null,
    plisio_invoice_url: json.data.invoice_url
  }).eq("id", req.id);
  return {
    invoice_url: json.data.invoice_url
  };
});
const getMyOrders_createServerFn_handler = createServerRpc({
  id: "6b55f242e5fa3501a76b0b01777d42d75f2340733740a9ab869f7911326c4616",
  name: "getMyOrders",
  filename: "src/lib/billing.functions.ts"
}, (opts) => getMyOrders.__executeServer(opts));
const getMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyOrders_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("upgrade_requests").select("*").order("created_at", {
    ascending: false
  }).limit(20);
  if (error) throw new Error(error.message);
  return data;
});
export {
  createInvoice_createServerFn_handler,
  getMyOrders_createServerFn_handler
};
