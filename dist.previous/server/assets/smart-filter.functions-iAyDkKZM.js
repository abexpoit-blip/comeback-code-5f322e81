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
async function requireAdmin(userId) {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: admin only");
}
const listCloakingRules_createServerFn_handler = createServerRpc({
  id: "429a892ce3afcdb74269241f68462ccb5c71abac5ef0f92fdf29c632780098fe",
  name: "listCloakingRules",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => listCloakingRules.__executeServer(opts));
const listCloakingRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCloakingRules_createServerFn_handler, async ({
  context
}) => {
  await requireAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("cloaking_rules").select("*").order("priority", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const upsertCloakingRule_createServerFn_handler = createServerRpc({
  id: "686ccbae4aa9bb20e0ea6c9665df77b4b4e2543bf637024825b76f12da0c7c7b",
  name: "upsertCloakingRule",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => upsertCloakingRule.__executeServer(opts));
const upsertCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid().optional(),
  rule_type: z.enum(["ua", "ip", "asn", "country"]),
  pattern: z.string().min(1).max(200),
  label: z.string().max(100).nullable().optional(),
  action: z.enum(["safe", "block", "offer"]),
  priority: z.number().int().min(0).max(1e4).default(100),
  is_active: z.boolean().default(true)
}).parse).handler(upsertCloakingRule_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const row = {
    ...data
  };
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("cloaking_rules").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("cloaking_rules").insert(row);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteCloakingRule_createServerFn_handler = createServerRpc({
  id: "b818bae25070c1caab5b6148743dccaf350c6697de0a1cfea4e644ae8dafea27",
  name: "deleteCloakingRule",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => deleteCloakingRule.__executeServer(opts));
const deleteCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid()
}).parse).handler(deleteCloakingRule_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("cloaking_rules").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listReferrerRules_createServerFn_handler = createServerRpc({
  id: "bb932350566fb237b4471865f428594c56c9b2f3d3dd80a487605a1bbbcf89f8",
  name: "listReferrerRules",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => listReferrerRules.__executeServer(opts));
const listReferrerRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listReferrerRules_createServerFn_handler, async ({
  context
}) => {
  await requireAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("referrer_rules").select("*").order("trust_score", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const upsertReferrerRule_createServerFn_handler = createServerRpc({
  id: "b583455f5cff3566369da96706471e961fcfdfb1c9ae508f32ce8ddb1cc59cf4",
  name: "upsertReferrerRule",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => upsertReferrerRule.__executeServer(opts));
const upsertReferrerRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid().optional(),
  pattern: z.string().min(1).max(200),
  label: z.string().max(100).nullable().optional(),
  trust_score: z.number().int().min(0).max(100),
  action: z.enum(["allow", "suspect", "block"]),
  is_active: z.boolean().default(true)
}).parse).handler(upsertReferrerRule_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const row = {
    ...data
  };
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("referrer_rules").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("referrer_rules").insert(row);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const deleteReferrerRule_createServerFn_handler = createServerRpc({
  id: "3be1e45c0f87224fa53a4c55d61188ea18fce368cdda1d5711196fd65386b877",
  name: "deleteReferrerRule",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => deleteReferrerRule.__executeServer(opts));
const deleteReferrerRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid()
}).parse).handler(deleteReferrerRule_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("referrer_rules").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listBotFingerprints_createServerFn_handler = createServerRpc({
  id: "ead8ba5bbc17c957db5b7b7ea4241cd9ecb9d3417e366e3197efe235a16c9801",
  name: "listBotFingerprints",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => listBotFingerprints.__executeServer(opts));
const listBotFingerprints = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listBotFingerprints_createServerFn_handler, async ({
  context
}) => {
  await requireAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("bot_fingerprints").select("*").order("last_seen", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const toggleFingerprintBlock_createServerFn_handler = createServerRpc({
  id: "8f677e90db99fc42aab7d9bc95d7cab1646c568d4e969e3254a2bc670cbe2610",
  name: "toggleFingerprintBlock",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => toggleFingerprintBlock.__executeServer(opts));
const toggleFingerprintBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  hash: z.string().min(1),
  block: z.boolean()
}).parse).handler(toggleFingerprintBlock_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("bot_fingerprints").update({
    auto_blocked: data.block
  }).eq("fingerprint_hash", data.hash);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listCountryTiers_createServerFn_handler = createServerRpc({
  id: "3c49897021118c3ed98c969c589c9aaed8556494877a40d3962d664ecd84a54f",
  name: "listCountryTiers",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => listCountryTiers.__executeServer(opts));
const listCountryTiers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCountryTiers_createServerFn_handler, async ({
  context
}) => {
  await requireAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("country_tiers").select("*").order("tier").order("country_code");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const upsertCountryTier_createServerFn_handler = createServerRpc({
  id: "efa9146476424c85a56da9b1af291e395fb192690477cdf7e3da9d6752715515",
  name: "upsertCountryTier",
  filename: "src/lib/smart-filter.functions.ts"
}, (opts) => upsertCountryTier.__executeServer(opts));
const upsertCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  country_code: z.string().min(2).max(3),
  tier: z.number().int().min(1).max(3),
  country_name: z.string().max(100).optional()
}).parse).handler(upsertCountryTier_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("country_tiers").upsert({
    ...data,
    country_code: data.country_code.toUpperCase()
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  deleteCloakingRule_createServerFn_handler,
  deleteReferrerRule_createServerFn_handler,
  listBotFingerprints_createServerFn_handler,
  listCloakingRules_createServerFn_handler,
  listCountryTiers_createServerFn_handler,
  listReferrerRules_createServerFn_handler,
  toggleFingerprintBlock_createServerFn_handler,
  upsertCloakingRule_createServerFn_handler,
  upsertCountryTier_createServerFn_handler,
  upsertReferrerRule_createServerFn_handler
};
