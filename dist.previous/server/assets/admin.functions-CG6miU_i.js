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
async function assertAdmin(userId) {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}
function packageQuota(pkg) {
  const slug = String(pkg.slug ?? "").toLowerCase();
  if (slug === "lifetime" || slug === "unlimited") return {
    click_quota: null,
    link_limit: null
  };
  if (slug === "monthly" || slug === "pro_monthly") return {
    click_quota: 1e6,
    link_limit: 50
  };
  if (slug === "free") return {
    click_quota: 1e4,
    link_limit: 1
  };
  return {
    click_quota: pkg.click_quota ?? null,
    link_limit: pkg.link_limit ?? null
  };
}
const adminStats_createServerFn_handler = createServerRpc({
  id: "fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f",
  name: "adminStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminStats.__executeServer(opts));
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const todayISO = new Date(Date.now() - 864e5).toISOString();
  const [{
    count: users
  }, {
    count: links
  }, {
    count: clicks
  }, {
    count: pending
  }, {
    count: ours
  }, {
    count: offer
  }, {
    count: bots
  }, {
    count: todayTotal
  }, {
    count: todayOurs
  }, {
    count: bannedUsers
  }, {
    count: activeLinks
  }] = await Promise.all([supabaseAdmin.from("profiles").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("links").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("upgrade_requests").select("*", {
    count: "exact",
    head: true
  }).eq("status", "pending"), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }).eq("routed_to", "ours"), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }).eq("routed_to", "offer"), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }).eq("is_bot", true), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }).gte("created_at", todayISO), supabaseAdmin.from("clicks").select("*", {
    count: "exact",
    head: true
  }).eq("routed_to", "ours").gte("created_at", todayISO), supabaseAdmin.from("profiles").select("*", {
    count: "exact",
    head: true
  }).eq("is_banned", true), supabaseAdmin.from("links").select("*", {
    count: "exact",
    head: true
  }).eq("is_active", true)]);
  const monthISO = new Date(Date.now() - 30 * 864e5).toISOString();
  const {
    data: paidRows
  } = await supabaseAdmin.from("upgrade_requests").select("amount").eq("status", "paid").gte("created_at", monthISO);
  const mrr = (paidRows ?? []).reduce((s, r) => s + Number(r.amount || 0), 0);
  const {
    data: allPaid
  } = await supabaseAdmin.from("upgrade_requests").select("amount").eq("status", "paid");
  const totalRevenue = (allPaid ?? []).reduce((s, r) => s + Number(r.amount || 0), 0);
  return {
    users: users ?? 0,
    links: links ?? 0,
    active_links: activeLinks ?? 0,
    clicks: clicks ?? 0,
    pending: pending ?? 0,
    ours: ours ?? 0,
    offer: offer ?? 0,
    bots: bots ?? 0,
    today_total: todayTotal ?? 0,
    today_ours: todayOurs ?? 0,
    banned_users: bannedUsers ?? 0,
    mrr_30d: mrr,
    total_revenue: totalRevenue
  };
});
const adminClicksTimeseries_createServerFn_handler = createServerRpc({
  id: "e9d1f9e0f31baff21269163071f2773125249b173b93b6f8e082b2bce42ebe50",
  name: "adminClicksTimeseries",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminClicksTimeseries.__executeServer(opts));
const adminClicksTimeseries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminClicksTimeseries_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const days = 14;
  const fromISO = new Date(Date.now() - days * 864e5).toISOString();
  const {
    data
  } = await supabaseAdmin.from("clicks").select("created_at, routed_to, is_bot").gte("created_at", fromISO).limit(2e5);
  const buckets = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    buckets[d] = {
      date: d,
      total: 0,
      ours: 0,
      offer: 0,
      bots: 0
    };
  }
  (data ?? []).forEach((c) => {
    const d = c.created_at.slice(0, 10);
    if (!buckets[d]) return;
    buckets[d].total++;
    if (c.is_bot) buckets[d].bots++;
    if (c.routed_to === "ours") buckets[d].ours++;
    if (c.routed_to === "offer") buckets[d].offer++;
  });
  return Object.values(buckets);
});
const adminTopCountries_createServerFn_handler = createServerRpc({
  id: "d6a8b931287a0f523773d181d0cdfe81f38362ddfcda3bfa170df7cd2f5df4af",
  name: "adminTopCountries",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminTopCountries.__executeServer(opts));
const adminTopCountries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminTopCountries_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const fromISO = new Date(Date.now() - 7 * 864e5).toISOString();
  const {
    data
  } = await supabaseAdmin.from("clicks").select("country").gte("created_at", fromISO).limit(1e5);
  const counts = {};
  (data ?? []).forEach((c) => {
    const k = c.country || "??";
    counts[k] = (counts[k] || 0) + 1;
  });
  return Object.entries(counts).map(([country, count]) => ({
    country,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 12);
});
const adminTopUsers_createServerFn_handler = createServerRpc({
  id: "0e90fd33773a8111e321610afa0606cc9a87489f3f60e05f00c5709ad8108c33",
  name: "adminTopUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminTopUsers.__executeServer(opts));
const adminTopUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminTopUsers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data
  } = await supabaseAdmin.from("profiles").select("id, email, clicks_used, plan_slug").order("clicks_used", {
    ascending: false
  }).limit(10);
  return data ?? [];
});
const adminRevenueTimeseries_createServerFn_handler = createServerRpc({
  id: "4f72212c03dfc54e46237b80651dc0f9cf9f5e97732364103f0eb83f7c880e8d",
  name: "adminRevenueTimeseries",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminRevenueTimeseries.__executeServer(opts));
const adminRevenueTimeseries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminRevenueTimeseries_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const fromISO = new Date(Date.now() - 30 * 864e5).toISOString();
  const {
    data
  } = await supabaseAdmin.from("upgrade_requests").select("created_at, amount, status").gte("created_at", fromISO).eq("status", "paid");
  const buckets = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
    buckets[d] = {
      date: d,
      revenue: 0,
      count: 0
    };
  }
  (data ?? []).forEach((r) => {
    const d = r.created_at.slice(0, 10);
    if (!buckets[d]) return;
    buckets[d].revenue += Number(r.amount || 0);
    buckets[d].count++;
  });
  return Object.values(buckets);
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
  name: "adminListUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListUsers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("profiles").select("*").order("created_at", {
    ascending: false
  }).limit(1e3);
  if (error) throw new Error(error.message);
  const oursByUser = {};
  const {
    data: linkRows
  } = await supabaseAdmin.from("links").select("id, user_id");
  const linkToUser = {};
  (linkRows ?? []).forEach((l) => {
    linkToUser[l.id] = l.user_id;
  });
  const {
    data: oursRows
  } = await supabaseAdmin.from("clicks").select("link_id").eq("routed_to", "ours").limit(2e5);
  (oursRows ?? []).forEach((r) => {
    const uid = linkToUser[r.link_id];
    if (uid) oursByUser[uid] = (oursByUser[uid] ?? 0) + 1;
  });
  return (data ?? []).map((u) => ({
    ...u,
    ours_clicks: oursByUser[u.id] ?? 0
  }));
});
const adminBanUser_createServerFn_handler = createServerRpc({
  id: "3bba96bfc803ffdceb8e317d49ead43f2463bee72ef9463446d363dc12f76f2a",
  name: "adminBanUser",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminBanUser.__executeServer(opts));
const adminBanUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_banned: z.boolean()
}).parse(d)).handler(adminBanUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    is_banned: data.is_banned
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminBulkBan_createServerFn_handler = createServerRpc({
  id: "429be1996cdbaebc10b8a9ffd00e479d3f75da799e8cfbdf703cce1c208cf72e",
  name: "adminBulkBan",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminBulkBan.__executeServer(opts));
const adminBulkBan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  is_banned: z.boolean()
}).parse(d)).handler(adminBulkBan_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    is_banned: data.is_banned
  }).in("id", data.ids);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    updated: data.ids.length
  };
});
const adminResetUserQuota_createServerFn_handler = createServerRpc({
  id: "ba26241d9710067ed0bb27d85639b89098faca09409c040f0a1c693a434ff0c5",
  name: "adminResetUserQuota",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminResetUserQuota.__executeServer(opts));
const adminResetUserQuota = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500)
}).parse(d)).handler(adminResetUserQuota_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    clicks_used: 0,
    clicks_period_start: (/* @__PURE__ */ new Date()).toISOString()
  }).in("id", data.ids);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    updated: data.ids.length
  };
});
const adminBulkSetPlan_createServerFn_handler = createServerRpc({
  id: "961c1f6e571cb978c4db99692216cfc4db73f80d629ff4309caa54253d55af80",
  name: "adminBulkSetPlan",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminBulkSetPlan.__executeServer(opts));
const adminBulkSetPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  package_slug: z.string().min(1).max(64)
}).parse(d)).handler(adminBulkSetPlan_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: pkg
  } = await supabaseAdmin.from("packages").select("*").eq("slug", data.package_slug).maybeSingle();
  if (!pkg) throw new Error("Package not found");
  const quota = packageQuota(pkg);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    plan_slug: pkg.slug,
    click_quota: quota.click_quota,
    link_limit: quota.link_limit,
    clicks_used: 0,
    clicks_period_start: (/* @__PURE__ */ new Date()).toISOString()
  }).in("id", data.ids);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    updated: data.ids.length
  };
});
const adminUserDetail_createServerFn_handler = createServerRpc({
  id: "d1d8fc22649bbd4178512d2170e1f2caac12739f826880397ec7b7ce92c4fee3",
  name: "adminUserDetail",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUserDetail.__executeServer(opts));
const adminUserDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminUserDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const [{
    data: profile
  }, {
    data: links
  }, {
    data: payments
  }] = await Promise.all([supabaseAdmin.from("profiles").select("*").eq("id", data.id).maybeSingle(), supabaseAdmin.from("links").select("*").eq("user_id", data.id).order("created_at", {
    ascending: false
  }), supabaseAdmin.from("upgrade_requests").select("*").eq("user_id", data.id).order("created_at", {
    ascending: false
  }).limit(50)]);
  const linkIds = (links ?? []).map((l) => l.id);
  const trend = [];
  if (linkIds.length) {
    const fromISO = new Date(Date.now() - 7 * 864e5).toISOString();
    const {
      data: cl
    } = await supabaseAdmin.from("clicks").select("created_at, is_bot").in("link_id", linkIds).gte("created_at", fromISO).limit(5e4);
    const buckets = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      buckets[d] = {
        date: d,
        clicks: 0,
        bots: 0
      };
    }
    (cl ?? []).forEach((c) => {
      const d = c.created_at.slice(0, 10);
      if (!buckets[d]) return;
      buckets[d].clicks++;
      if (c.is_bot) buckets[d].bots++;
    });
    trend.push(...Object.values(buckets));
  }
  return {
    profile,
    links: links ?? [],
    payments: payments ?? [],
    trend
  };
});
const adminSetUserPlan_createServerFn_handler = createServerRpc({
  id: "96c99aa3dd88135d60c64c1eea70683648bac8e4e78316f2766bb02e6477ec27",
  name: "adminSetUserPlan",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetUserPlan.__executeServer(opts));
const adminSetUserPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  user_id: z.string().uuid(),
  package_slug: z.string().min(1).max(64)
}).parse(d)).handler(adminSetUserPlan_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: pkg
  } = await supabaseAdmin.from("packages").select("*").eq("slug", data.package_slug).maybeSingle();
  if (!pkg) throw new Error("Package not found");
  const quota = packageQuota(pkg);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    plan_slug: pkg.slug,
    click_quota: quota.click_quota,
    link_limit: quota.link_limit,
    clicks_used: 0,
    clicks_period_start: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.user_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListPackages_createServerFn_handler = createServerRpc({
  id: "dc901b8e1718d3ea16d5ca66ca961b0afc97b83e5384a842ab3c033287b034f4",
  name: "adminListPackages",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListPackages.__executeServer(opts));
const adminListPackages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListPackages_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("packages").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});
const adminListAllPackages_createServerFn_handler = createServerRpc({
  id: "25b3f53200b03f55d2bc6f18dd57ce0575af2c8da2f57e383777ad20e4dfe210",
  name: "adminListAllPackages",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListAllPackages.__executeServer(opts));
const adminListAllPackages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListAllPackages_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("packages").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertPackage_createServerFn_handler = createServerRpc({
  id: "6238adf314c6d3432e0d656a8ed2d8f7bda874a68c1f9113dde280e2603b4218",
  name: "adminUpsertPackage",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertPackage.__executeServer(opts));
const adminUpsertPackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/),
  name: z.string().min(1).max(120),
  price_usd: z.number().min(0).max(1e5),
  click_quota: z.number().int().min(0).nullable(),
  link_limit: z.number().int().min(0).nullable(),
  sort_order: z.number().int().min(0).max(1e3),
  is_active: z.boolean()
}).parse(d)).handler(adminUpsertPackage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const quota = packageQuota(data);
  const payload = {
    slug: data.slug,
    name: data.name,
    price_usd: data.price_usd,
    click_quota: quota.click_quota,
    link_limit: quota.link_limit,
    sort_order: data.sort_order,
    is_active: data.is_active
  };
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("packages").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("packages").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminDeletePackage_createServerFn_handler = createServerRpc({
  id: "2c2a938ec2a02f0c00614f175abc71712df5999ec6d433b933525cd1326edaee",
  name: "adminDeletePackage",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeletePackage.__executeServer(opts));
const adminDeletePackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminDeletePackage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("packages").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListUpgradeRequests_createServerFn_handler = createServerRpc({
  id: "b430aad9702f8ebb3ff04f9a78cc5b8b50e903ae182c317c416cdbcbdafef8bc",
  name: "adminListUpgradeRequests",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUpgradeRequests.__executeServer(opts));
const adminListUpgradeRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListUpgradeRequests_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("upgrade_requests").select("id, user_id, package_slug, amount, status, plisio_invoice_id, plisio_invoice_url, created_at, updated_at").order("created_at", {
    ascending: false
  }).limit(500);
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((data ?? []).map((r) => r.user_id)));
  let emailMap = {};
  if (ids.length > 0) {
    const {
      data: profs
    } = await supabaseAdmin.from("profiles").select("id, email").in("id", ids);
    emailMap = Object.fromEntries((profs ?? []).map((p) => [p.id, p.email ?? ""]));
  }
  return (data ?? []).map((r) => ({
    ...r,
    email: emailMap[r.user_id] ?? ""
  }));
});
const adminDecideUpgradeRequest_createServerFn_handler = createServerRpc({
  id: "3625bd41ba7f34cc9fe752b318a4dfc04dfa48f2701dc591a7b2a1f28e82f5c4",
  name: "adminDecideUpgradeRequest",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDecideUpgradeRequest.__executeServer(opts));
const adminDecideUpgradeRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  decision: z.enum(["approve", "reject"])
}).parse(d)).handler(adminDecideUpgradeRequest_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: req,
    error: rErr
  } = await supabaseAdmin.from("upgrade_requests").select("*").eq("id", data.id).maybeSingle();
  if (rErr || !req) throw new Error("Request not found");
  if (req.status !== "pending") throw new Error(`Request already ${req.status}`);
  if (data.decision === "reject") {
    const {
      error
    } = await supabaseAdmin.from("upgrade_requests").update({
      status: "rejected",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return {
      ok: true
    };
  }
  const {
    data: pkg
  } = await supabaseAdmin.from("packages").select("*").eq("slug", req.package_slug).maybeSingle();
  if (!pkg) throw new Error("Package not found");
  const quota = packageQuota(pkg);
  const {
    error: pErr
  } = await supabaseAdmin.from("profiles").update({
    plan_slug: pkg.slug,
    click_quota: quota.click_quota,
    link_limit: quota.link_limit,
    clicks_used: 0,
    clicks_period_start: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", req.user_id);
  if (pErr) throw new Error(pErr.message);
  const {
    error: uErr
  } = await supabaseAdmin.from("upgrade_requests").update({
    status: "paid",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (uErr) throw new Error(uErr.message);
  return {
    ok: true
  };
});
const adminListLinks_createServerFn_handler = createServerRpc({
  id: "e112ef2416d567fbe50f313cfdf590c06f337e88ce804ed92247ce3f777fc7bd",
  name: "adminListLinks",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListLinks.__executeServer(opts));
const adminListLinks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListLinks_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("links").select("*").order("created_at", {
    ascending: false
  }).limit(500);
  if (error) throw new Error(error.message);
  const uids = Array.from(new Set((data ?? []).map((l) => l.user_id)));
  let emailMap = {};
  if (uids.length) {
    const {
      data: profs
    } = await supabaseAdmin.from("profiles").select("id, email").in("id", uids);
    emailMap = Object.fromEntries((profs ?? []).map((p) => [p.id, p.email ?? ""]));
  }
  return (data ?? []).map((l) => ({
    ...l,
    owner_email: emailMap[l.user_id] ?? ""
  }));
});
const adminToggleLink_createServerFn_handler = createServerRpc({
  id: "981ab2fa3d1b0f6619cb79089ec9f96c38faa81f558218fc094c10e30b8c0026",
  name: "adminToggleLink",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminToggleLink.__executeServer(opts));
const adminToggleLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(adminToggleLink_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("links").update({
    is_active: data.is_active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminUpdateLink_createServerFn_handler = createServerRpc({
  id: "b7b62abb0b82435caf96153c195b1f1e0e3fdaee1e2667dd77ae91896c9cdfda",
  name: "adminUpdateLink",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateLink.__executeServer(opts));
const adminUpdateLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  adsterra_url: z.string().url().max(2e3).optional(),
  safe_url: z.string().url().max(2e3).optional(),
  title: z.string().max(255).optional()
}).parse(d)).handler(adminUpdateLink_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const patch = {};
  if (data.adsterra_url !== void 0) patch.adsterra_url = data.adsterra_url;
  if (data.safe_url !== void 0) patch.safe_url = data.safe_url;
  if (data.title !== void 0) patch.title = data.title;
  if (!Object.keys(patch).length) return {
    ok: true
  };
  const {
    error
  } = await supabaseAdmin.from("links").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteLink_createServerFn_handler = createServerRpc({
  id: "0e2ae9c383624dcbe1ae741661a947cb4075e1a8a78320f022291534efe342d1",
  name: "adminDeleteLink",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteLink.__executeServer(opts));
const adminDeleteLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminDeleteLink_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("links").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListBotRules_createServerFn_handler = createServerRpc({
  id: "a96fd93bbab79358adbd0906bf7cbb8c1a1a88da99576de2bba6544e8da2a972",
  name: "adminListBotRules",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListBotRules.__executeServer(opts));
const adminListBotRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListBotRules_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("bot_rules").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertBotRule_createServerFn_handler = createServerRpc({
  id: "c3bb474c8b7e194e4823f8d59c6b8a487fe138d56c8bb972d7885f14f5f327ae",
  name: "adminUpsertBotRule",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertBotRule.__executeServer(opts));
const adminUpsertBotRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  rule_type: z.string().min(1).max(64),
  pattern: z.string().min(1).max(500),
  action: z.string().min(1).max(32),
  label: z.string().max(255).optional().nullable(),
  is_active: z.boolean()
}).parse(d)).handler(adminUpsertBotRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const payload = {
    rule_type: data.rule_type,
    pattern: data.pattern,
    action: data.action,
    label: data.label ?? null,
    is_active: data.is_active
  };
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("bot_rules").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("bot_rules").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminDeleteBotRule_createServerFn_handler = createServerRpc({
  id: "566f91f009deabf06e642bea2a5406c142e9dbca0a75297ceb4a121d4557dee7",
  name: "adminDeleteBotRule",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteBotRule.__executeServer(opts));
const adminDeleteBotRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminDeleteBotRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("bot_rules").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListCloakingRules_createServerFn_handler = createServerRpc({
  id: "883ab95eedaca3158ce3e9fc0f78869464d8885348b6d8eb345e256ffb2ede47",
  name: "adminListCloakingRules",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListCloakingRules.__executeServer(opts));
const adminListCloakingRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListCloakingRules_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("cloaking_rules").select("*").order("priority");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertCloakingRule_createServerFn_handler = createServerRpc({
  id: "cf47486e50d09b6eb698162f320b2c507b803f00a66684606eaadfc016bcf848",
  name: "adminUpsertCloakingRule",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertCloakingRule.__executeServer(opts));
const adminUpsertCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  rule_type: z.string().min(1).max(64),
  pattern: z.string().min(1).max(500),
  action: z.string().min(1).max(32),
  label: z.string().max(255).optional().nullable(),
  priority: z.number().int().min(0).max(1e4),
  is_active: z.boolean()
}).parse(d)).handler(adminUpsertCloakingRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const payload = {
    rule_type: data.rule_type,
    pattern: data.pattern,
    action: data.action,
    label: data.label ?? null,
    priority: data.priority,
    is_active: data.is_active
  };
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("cloaking_rules").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("cloaking_rules").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminDeleteCloakingRule_createServerFn_handler = createServerRpc({
  id: "43e35d72c5dc104b971ca6cdf1702f552cf26fc1446f39f160db37fff45a1d44",
  name: "adminDeleteCloakingRule",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteCloakingRule.__executeServer(opts));
const adminDeleteCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(adminDeleteCloakingRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("cloaking_rules").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminListCountryTiers_createServerFn_handler = createServerRpc({
  id: "b3ee4ed27d9fd8e1fdf02b36d3a774948cc09d7aa1b59761449fb0b5c4b3c45f",
  name: "adminListCountryTiers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListCountryTiers.__executeServer(opts));
const adminListCountryTiers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListCountryTiers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("country_tiers").select("*").order("tier").order("country_code");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertCountryTier_createServerFn_handler = createServerRpc({
  id: "bbc029988a8868301d1e0e68f6c868fc4afcc02d0e160627aefed8cfc1e22cb4",
  name: "adminUpsertCountryTier",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertCountryTier.__executeServer(opts));
const adminUpsertCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  country_code: z.string().length(2).regex(/^[A-Z]{2}$/),
  country_name: z.string().max(100).optional().nullable(),
  tier: z.number().int().min(1).max(5)
}).parse(d)).handler(adminUpsertCountryTier_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("country_tiers").upsert({
    country_code: data.country_code,
    country_name: data.country_name ?? null,
    tier: data.tier,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "country_code"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteCountryTier_createServerFn_handler = createServerRpc({
  id: "2f67e13384324c1918e5d31cee1eeca586ba376d18d3c999fb720a34dbe305f0",
  name: "adminDeleteCountryTier",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteCountryTier.__executeServer(opts));
const adminDeleteCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  country_code: z.string().length(2)
}).parse(d)).handler(adminDeleteCountryTier_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("country_tiers").delete().eq("country_code", data.country_code);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminImpersonate_createServerFn_handler = createServerRpc({
  id: "79b1c111fd3073261e14960d349d9c53ec566bd1eec83b4619e6b1d0073ede5c",
  name: "adminImpersonate",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminImpersonate.__executeServer(opts));
const adminImpersonate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  user_id: z.string().uuid()
}).parse(d)).handler(adminImpersonate_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  if (data.user_id === context.userId) throw new Error("You are already signed in as this user");
  const {
    data: prof,
    error: pErr
  } = await supabaseAdmin.from("profiles").select("id, email, full_name").eq("id", data.user_id).maybeSingle();
  if (pErr) throw new Error(pErr.message);
  if (!prof?.email) throw new Error("Target user has no email");
  const {
    data: link,
    error: lErr
  } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: prof.email
  });
  if (lErr) throw new Error(lErr.message);
  const hashed_token = link?.properties?.hashed_token;
  if (!hashed_token) throw new Error("Failed to generate impersonation token");
  return {
    hashed_token,
    target: {
      id: prof.id,
      email: prof.email,
      full_name: prof.full_name
    }
  };
});
const errFrom = () => supabaseAdmin.from("error_logs");
const adminListErrors_createServerFn_handler = createServerRpc({
  id: "2f306b1478ea5a15274fa85998ed14690019ed2fc09656989ff9d871a11aaeb3",
  name: "adminListErrors",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListErrors.__executeServer(opts));
const adminListErrors = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  source: z.string().max(64).optional(),
  onlyOpen: z.boolean().optional(),
  limit: z.number().int().min(1).max(1e3).optional()
}).parse(d)).handler(adminListErrors_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const limit = Math.min(Math.max(data?.limit ?? 200, 1), 1e3);
  let q = errFrom().select("*").order("created_at", {
    ascending: false
  }).limit(limit);
  if (data?.source) {
    q = errFrom().select("*").eq("source", data.source).order("created_at", {
      ascending: false
    }).limit(limit);
  }
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const list = (rows ?? []).map((r) => ({
    ...r,
    context: r.context ? JSON.stringify(r.context) : null
  }));
  const filtered = data?.onlyOpen ? list.filter((r) => !r.resolved) : list;
  return {
    rows: filtered
  };
});
const adminErrorStats_createServerFn_handler = createServerRpc({
  id: "7f07e71321e92ab64d294a23548f879488b2602ad6b63d3b8949ef0f05921bf4",
  name: "adminErrorStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminErrorStats.__executeServer(opts));
const adminErrorStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminErrorStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const sinceISO = new Date(Date.now() - 24 * 3600 * 1e3).toISOString();
  const {
    data: rows
  } = await errFrom().select("source, level, resolved, created_at").order("created_at", {
    ascending: false
  }).limit(1e3);
  const list = rows ?? [];
  const last24h = list.filter((r) => r.created_at >= sinceISO).length;
  const open = list.filter((r) => !r.resolved).length;
  const bySource = {};
  for (const r of list) bySource[r.source] = (bySource[r.source] || 0) + 1;
  return {
    total: list.length,
    last24h,
    open,
    bySource
  };
});
const adminResolveError_createServerFn_handler = createServerRpc({
  id: "868a5b0f443153927c2b530a5ead388de588b9ee39f33ace7ddbb9b9177bf69f",
  name: "adminResolveError",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminResolveError.__executeServer(opts));
const adminResolveError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.number().int().positive(),
  resolved: z.boolean()
}).parse(d)).handler(adminResolveError_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await errFrom().update({
    resolved: data.resolved
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteError_createServerFn_handler = createServerRpc({
  id: "6f6b8913ddd29a34150f0e275ae9d425c8bdf3255c7eca9ea2136352ec40effa",
  name: "adminDeleteError",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteError.__executeServer(opts));
const adminDeleteError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.number().int().positive()
}).parse(d)).handler(adminDeleteError_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await errFrom().delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminClearResolvedErrors_createServerFn_handler = createServerRpc({
  id: "b2a238bc0e0421a51e92d6859fe220111f01d17d8fb65be62287f8f900d01e69",
  name: "adminClearResolvedErrors",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminClearResolvedErrors.__executeServer(opts));
const adminClearResolvedErrors = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(adminClearResolvedErrors_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await errFrom().delete().eq("resolved", true);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminBanUser_createServerFn_handler,
  adminBulkBan_createServerFn_handler,
  adminBulkSetPlan_createServerFn_handler,
  adminClearResolvedErrors_createServerFn_handler,
  adminClicksTimeseries_createServerFn_handler,
  adminDecideUpgradeRequest_createServerFn_handler,
  adminDeleteBotRule_createServerFn_handler,
  adminDeleteCloakingRule_createServerFn_handler,
  adminDeleteCountryTier_createServerFn_handler,
  adminDeleteError_createServerFn_handler,
  adminDeleteLink_createServerFn_handler,
  adminDeletePackage_createServerFn_handler,
  adminErrorStats_createServerFn_handler,
  adminImpersonate_createServerFn_handler,
  adminListAllPackages_createServerFn_handler,
  adminListBotRules_createServerFn_handler,
  adminListCloakingRules_createServerFn_handler,
  adminListCountryTiers_createServerFn_handler,
  adminListErrors_createServerFn_handler,
  adminListLinks_createServerFn_handler,
  adminListPackages_createServerFn_handler,
  adminListUpgradeRequests_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminResetUserQuota_createServerFn_handler,
  adminResolveError_createServerFn_handler,
  adminRevenueTimeseries_createServerFn_handler,
  adminSetUserPlan_createServerFn_handler,
  adminStats_createServerFn_handler,
  adminToggleLink_createServerFn_handler,
  adminTopCountries_createServerFn_handler,
  adminTopUsers_createServerFn_handler,
  adminUpdateLink_createServerFn_handler,
  adminUpsertBotRule_createServerFn_handler,
  adminUpsertCloakingRule_createServerFn_handler,
  adminUpsertCountryTier_createServerFn_handler,
  adminUpsertPackage_createServerFn_handler,
  adminUserDetail_createServerFn_handler
};
