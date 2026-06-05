import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Globe2, Bot, MapPin, Plus, AlertTriangle, ToggleRight, ToggleLeft, Trash2 } from "lucide-react";
import { s as supabase } from "./client-B6X92QMo.js";
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
import "@tanstack/react-router/ssr/server";
const listCloakingRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("429a892ce3afcdb74269241f68462ccb5c71abac5ef0f92fdf29c632780098fe"));
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
}).parse).handler(createSsrRpc("686ccbae4aa9bb20e0ea6c9665df77b4b4e2543bf637024825b76f12da0c7c7b"));
const deleteCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid()
}).parse).handler(createSsrRpc("b818bae25070c1caab5b6148743dccaf350c6697de0a1cfea4e644ae8dafea27"));
const listReferrerRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("bb932350566fb237b4471865f428594c56c9b2f3d3dd80a487605a1bbbcf89f8"));
const upsertReferrerRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid().optional(),
  pattern: z.string().min(1).max(200),
  label: z.string().max(100).nullable().optional(),
  trust_score: z.number().int().min(0).max(100),
  action: z.enum(["allow", "suspect", "block"]),
  is_active: z.boolean().default(true)
}).parse).handler(createSsrRpc("b583455f5cff3566369da96706471e961fcfdfb1c9ae508f32ce8ddb1cc59cf4"));
const deleteReferrerRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  id: z.string().uuid()
}).parse).handler(createSsrRpc("3be1e45c0f87224fa53a4c55d61188ea18fce368cdda1d5711196fd65386b877"));
const listBotFingerprints = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ead8ba5bbc17c957db5b7b7ea4241cd9ecb9d3417e366e3197efe235a16c9801"));
const toggleFingerprintBlock = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  hash: z.string().min(1),
  block: z.boolean()
}).parse).handler(createSsrRpc("8f677e90db99fc42aab7d9bc95d7cab1646c568d4e969e3254a2bc670cbe2610"));
const listCountryTiers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3c49897021118c3ed98c969c589c9aaed8556494877a40d3962d664ecd84a54f"));
const upsertCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(z.object({
  country_code: z.string().min(2).max(3),
  tier: z.number().int().min(1).max(3),
  country_name: z.string().max(100).optional()
}).parse).handler(createSsrRpc("efa9146476424c85a56da9b1af291e395fb192690477cdf7e3da9d6752715515"));
const fld = "w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl px-3 py-2.5 text-sm text-[#2D1B0D] placeholder:text-[#A38D7D] focus:outline-none focus:border-[#FF7E5F]/50 focus:bg-white";
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function SmartFilterPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("cloaking");
  const [adminChecked, setAdminChecked] = useState(false);
  useEffect(() => {
    (async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate({
          to: "/login"
        });
        return;
      }
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!data) {
        navigate({
          to: "/dashboard"
        });
        return;
      }
      setAdminChecked(true);
    })();
  }, []);
  if (!adminChecked) {
    return /* @__PURE__ */ jsx("div", { className: "p-10 text-sm text-[#7D6452]", style: font, children: "Verifying admin access…" });
  }
  const tabs = [{
    k: "cloaking",
    label: "Cloaking",
    icon: Shield
  }, {
    k: "referrer",
    label: "Referrer",
    icon: Globe2
  }, {
    k: "blacklist",
    label: "Blacklist",
    icon: Bot
  }, {
    k: "tiers",
    label: "Country Tiers",
    icon: MapPin
  }];
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-10 max-w-[1400px] mx-auto", style: font, children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm mb-3", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
        " Admin · Bot defence"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-extrabold text-[#2D1B0D]", children: "Smart Filter" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7D6452] mt-2 max-w-2xl", children: "Cloaking rules, referrer trust, auto-blacklist & country-tier routing — all the layers that decide who sees offer vs safe page." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-6 border-b border-[#FFEDD5] overflow-x-auto", children: tabs.map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.k), className: `flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${tab === t.k ? "text-[#FF7E5F] border-[#FF7E5F]" : "text-[#7D6452] hover:text-[#2D1B0D] border-transparent"}`, children: [
      /* @__PURE__ */ jsx(t.icon, { className: "w-4 h-4" }),
      " ",
      t.label
    ] }, t.k)) }),
    /* @__PURE__ */ jsxs("div", { children: [
      tab === "cloaking" && /* @__PURE__ */ jsx(CloakingTab, {}),
      tab === "referrer" && /* @__PURE__ */ jsx(ReferrerTab, {}),
      tab === "blacklist" && /* @__PURE__ */ jsx(BlacklistTab, {}),
      tab === "tiers" && /* @__PURE__ */ jsx(CountryTiersTab, {})
    ] })
  ] });
}
function CloakingTab() {
  const qc = useQueryClient();
  const list = useServerFn(listCloakingRules);
  const upsert = useServerFn(upsertCloakingRule);
  const del = useServerFn(deleteCloakingRule);
  const q = useQuery({
    queryKey: ["cloak-rules"],
    queryFn: () => list()
  });
  const [ruleType, setRuleType] = useState("ua");
  const [pattern, setPattern] = useState("");
  const [label, setLabel] = useState("");
  const [action, setAction] = useState("safe");
  const [priority, setPriority] = useState("100");
  const addMut = useMutation({
    mutationFn: () => upsert({
      data: {
        rule_type: ruleType,
        pattern,
        label: label || null,
        action,
        priority: Number(priority) || 100,
        is_active: true
      }
    }),
    onSuccess: () => {
      toast.success("Rule added");
      setPattern("");
      setLabel("");
      qc.invalidateQueries({
        queryKey: ["cloak-rules"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (id) => del({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({
        queryKey: ["cloak-rules"]
      });
    }
  });
  const toggleMut = useMutation({
    mutationFn: (r) => upsert({
      data: {
        ...r,
        is_active: !r.is_active
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["cloak-rules"]
    })
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      addMut.mutate();
    }, className: "rounded-2xl border border-[#FFEDD5] bg-white p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D] mb-3", children: "Add cloaking rule" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-2", children: [
        /* @__PURE__ */ jsxs("select", { className: fld + " md:col-span-1", value: ruleType, onChange: (e) => setRuleType(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "ua", children: "UA pattern" }),
          /* @__PURE__ */ jsx("option", { value: "ip", children: "IP / CIDR" }),
          /* @__PURE__ */ jsx("option", { value: "asn", children: "ASN" }),
          /* @__PURE__ */ jsx("option", { value: "country", children: "Country" })
        ] }),
        /* @__PURE__ */ jsx("input", { className: fld + " md:col-span-2", required: true, placeholder: ruleType === "ua" ? "facebookexternalhit" : ruleType === "country" ? "US" : "AS15169", value: pattern, onChange: (e) => setPattern(e.target.value) }),
        /* @__PURE__ */ jsx("input", { className: fld + " md:col-span-2", placeholder: "Label (e.g. Facebook reviewer)", value: label, onChange: (e) => setLabel(e.target.value) }),
        /* @__PURE__ */ jsxs("select", { className: fld, value: action, onChange: (e) => setAction(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "safe", children: "→ safe page" }),
          /* @__PURE__ */ jsx("option", { value: "block", children: "block 403" }),
          /* @__PURE__ */ jsx("option", { value: "offer", children: "→ offer page" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-[#7D6452]", children: "Priority" }),
        /* @__PURE__ */ jsx("input", { className: fld + " w-24", type: "number", value: priority, onChange: (e) => setPriority(e.target.value) }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: addMut.isPending, className: "ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-md disabled:opacity-50", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          " ",
          addMut.isPending ? "Adding…" : "Add rule"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(RulesTable, { loading: q.isLoading, rows: q.data ?? [], empty: "No cloaking rules — seeded defaults will apply.", cols: [{
      h: "Type",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFEDD5] text-[#FF7E5F]", children: r.rule_type })
    }, {
      h: "Pattern",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: r.pattern })
    }, {
      h: "Label",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[#7D6452]", children: r.label ?? "—" })
    }, {
      h: "Action",
      render: (r) => /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded ${r.action === "block" ? "bg-rose-100 text-rose-700" : r.action === "safe" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`, children: r.action })
    }, {
      h: "Prio",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[#A38D7D]", children: r.priority })
    }], onToggle: (r) => toggleMut.mutate(r), onDelete: (id) => delMut.mutate(id) })
  ] });
}
function ReferrerTab() {
  const qc = useQueryClient();
  const list = useServerFn(listReferrerRules);
  const upsert = useServerFn(upsertReferrerRule);
  const del = useServerFn(deleteReferrerRule);
  const q = useQuery({
    queryKey: ["ref-rules"],
    queryFn: () => list()
  });
  const [pattern, setPattern] = useState("");
  const [label, setLabel] = useState("");
  const [trust, setTrust] = useState("70");
  const [action, setAction] = useState("allow");
  const addMut = useMutation({
    mutationFn: () => upsert({
      data: {
        pattern,
        label: label || null,
        trust_score: Number(trust),
        action,
        is_active: true
      }
    }),
    onSuccess: () => {
      toast.success("Added");
      setPattern("");
      setLabel("");
      qc.invalidateQueries({
        queryKey: ["ref-rules"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (id) => del({
      data: {
        id
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["ref-rules"]
    })
  });
  const toggleMut = useMutation({
    mutationFn: (r) => upsert({
      data: {
        ...r,
        is_active: !r.is_active
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["ref-rules"]
    })
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      addMut.mutate();
    }, className: "rounded-2xl border border-[#FFEDD5] bg-white p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D] mb-3", children: "Add referrer rule" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-5 gap-2", children: [
        /* @__PURE__ */ jsx("input", { className: fld + " md:col-span-2", required: true, placeholder: "facebook.com", value: pattern, onChange: (e) => setPattern(e.target.value) }),
        /* @__PURE__ */ jsx("input", { className: fld + " md:col-span-2", placeholder: "Label (Facebook social)", value: label, onChange: (e) => setLabel(e.target.value) }),
        /* @__PURE__ */ jsxs("select", { className: fld, value: action, onChange: (e) => setAction(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "allow", children: "allow" }),
          /* @__PURE__ */ jsx("option", { value: "suspect", children: "suspect" }),
          /* @__PURE__ */ jsx("option", { value: "block", children: "block" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-3", children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs text-[#7D6452]", children: "Trust score (0-100)" }),
        /* @__PURE__ */ jsx("input", { className: fld + " w-24", type: "number", min: 0, max: 100, value: trust, onChange: (e) => setTrust(e.target.value) }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: addMut.isPending, className: "ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-md disabled:opacity-50", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          " Add"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(RulesTable, { loading: q.isLoading, rows: q.data ?? [], empty: "No referrer rules — seeded defaults apply.", cols: [{
      h: "Pattern",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: r.pattern })
    }, {
      h: "Label",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs text-[#7D6452]", children: r.label ?? "—" })
    }, {
      h: "Trust",
      render: (r) => /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#2D1B0D]", children: r.trust_score })
    }, {
      h: "Action",
      render: (r) => /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded ${r.action === "block" ? "bg-rose-100 text-rose-700" : r.action === "suspect" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`, children: r.action })
    }], onToggle: (r) => toggleMut.mutate(r), onDelete: (id) => delMut.mutate(id) })
  ] });
}
function BlacklistTab() {
  const qc = useQueryClient();
  const list = useServerFn(listBotFingerprints);
  const toggle = useServerFn(toggleFingerprintBlock);
  const q = useQuery({
    queryKey: ["bot-fp"],
    queryFn: () => list(),
    refetchInterval: 1e4
  });
  const tMut = useMutation({
    mutationFn: (v) => toggle({
      data: v
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["bot-fp"]
    })
  });
  const fps = q.data ?? [];
  const blocked = fps.filter((f) => f.auto_blocked).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Tracked fingerprints", value: fps.length.toLocaleString(), icon: Bot }),
      /* @__PURE__ */ jsx(Stat, { label: "Auto-blocked", value: blocked.toLocaleString(), icon: AlertTriangle, tone: "rose" }),
      /* @__PURE__ */ jsx(Stat, { label: "Last 24h hits", value: fps.reduce((s, f) => s + f.hit_count, 0).toLocaleString(), icon: Shield })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 border-b border-[#FFEDD5]", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D]", children: "Bot fingerprints (auto-learned)" }) }),
      q.isLoading && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-[#A38D7D]", children: "Loading…" }),
      !q.isLoading && fps.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-[#7D6452]", children: "No fingerprints tracked yet. They'll appear as traffic flows." }),
      fps.length > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left min-w-[800px] text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-[10px] uppercase tracking-[0.18em] text-[#A38D7D] border-b border-[#FFEDD5]", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Hash" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Hits" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Bot %" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Sample IP" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Country" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Last seen" }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: "Block" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#FFEDD5]", children: fps.map((f) => {
          const botPct = f.hit_count ? Math.round(f.bot_hits / f.hit_count * 100) : 0;
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[#FFF9F5]", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-2 font-mono text-[11px] text-[#2D1B0D]", children: [
              f.fingerprint_hash.slice(0, 14),
              "…"
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2 tabular-nums", children: f.hit_count }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsxs("span", { className: `text-xs font-bold ${botPct > 70 ? "text-rose-600" : botPct > 30 ? "text-amber-600" : "text-emerald-600"}`, children: [
              botPct,
              "%"
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2 font-mono text-[11px] text-[#7D6452]", children: f.sample_ip ?? "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2 text-xs", children: f.sample_country ?? "—" }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2 text-[11px] text-[#A38D7D]", children: new Date(f.last_seen).toLocaleString() }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsx("button", { onClick: () => tMut.mutate({
              hash: f.fingerprint_hash,
              block: !f.auto_blocked
            }), children: f.auto_blocked ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-5 h-5 text-rose-600" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-5 h-5 text-[#7D6452]" }) }) })
          ] }, f.fingerprint_hash);
        }) })
      ] }) })
    ] })
  ] });
}
function CountryTiersTab() {
  const qc = useQueryClient();
  const list = useServerFn(listCountryTiers);
  const upsert = useServerFn(upsertCountryTier);
  const q = useQuery({
    queryKey: ["country-tiers"],
    queryFn: () => list()
  });
  const [code, setCode] = useState("");
  const [tier, setTier] = useState("1");
  const [name, setName] = useState("");
  const addMut = useMutation({
    mutationFn: () => upsert({
      data: {
        country_code: code,
        tier: Number(tier),
        country_name: name || void 0
      }
    }),
    onSuccess: () => {
      toast.success("Saved");
      setCode("");
      setName("");
      qc.invalidateQueries({
        queryKey: ["country-tiers"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const rows = q.data ?? [];
  const grouped = {
    1: rows.filter((r) => r.tier === 1),
    2: rows.filter((r) => r.tier === 2),
    3: rows.filter((r) => r.tier === 3)
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      addMut.mutate();
    }, className: "rounded-2xl border border-[#FFEDD5] bg-white p-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D] mb-3", children: "Add / update country tier" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [
        /* @__PURE__ */ jsx("input", { className: fld + " uppercase", required: true, maxLength: 3, placeholder: "US", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()) }),
        /* @__PURE__ */ jsxs("select", { className: fld, value: tier, onChange: (e) => setTier(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "1", children: "Tier 1 (highest)" }),
          /* @__PURE__ */ jsx("option", { value: "2", children: "Tier 2 (mid)" }),
          /* @__PURE__ */ jsx("option", { value: "3", children: "Tier 3 (lowest)" })
        ] }),
        /* @__PURE__ */ jsx("input", { className: fld + " md:col-span-2", placeholder: "United States", value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: addMut.isPending, className: "mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-md disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
        " Save"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [1, 2, 3].map((t) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-[#2D1B0D]", children: [
          "Tier ",
          t
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-[#A38D7D]", children: [
          grouped[t].length,
          " countries"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 max-h-[400px] overflow-y-auto", children: [
        grouped[t].length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A38D7D]", children: "None." }),
        grouped[t].map((r) => /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFEDD5]/60 text-[11px] font-mono text-[#2D1B0D]", title: r.country_name ?? "", children: r.country_code }, r.country_code))
      ] })
    ] }, t)) })
  ] });
}
function Stat({
  label,
  value,
  icon: Icon,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${tone === "rose" ? "bg-rose-100 text-rose-600" : "bg-[#FFEDD5] text-[#FF7E5F]"}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[#A38D7D]", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-extrabold text-[#2D1B0D] tabular-nums", children: value })
    ] })
  ] });
}
function RulesTable({
  loading,
  rows,
  empty,
  cols,
  onToggle,
  onDelete
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white overflow-hidden", children: [
    loading && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-[#A38D7D]", children: "Loading…" }),
    !loading && rows.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-[#7D6452]", children: empty }),
    rows.length > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left min-w-[700px] text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "text-[10px] uppercase tracking-[0.18em] text-[#A38D7D] border-b border-[#FFEDD5]", children: /* @__PURE__ */ jsxs("tr", { children: [
        cols.map((c) => /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold", children: c.h }, c.h)),
        /* @__PURE__ */ jsx("th", { className: "px-5 py-2 font-bold text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#FFEDD5]", children: rows.map((r) => /* @__PURE__ */ jsxs("tr", { className: !r.is_active ? "opacity-50 hover:bg-[#FFF9F5]" : "hover:bg-[#FFF9F5]", children: [
        cols.map((c) => /* @__PURE__ */ jsx("td", { className: "px-5 py-2.5", children: c.render(r) }, c.h)),
        /* @__PURE__ */ jsxs("td", { className: "px-5 py-2.5 text-right", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => onToggle(r), className: "p-1 text-[#7D6452] hover:text-[#FF7E5F]", title: "Toggle", children: r.is_active ? /* @__PURE__ */ jsx(ToggleRight, { className: "w-5 h-5 text-emerald-600" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            if (confirm("Delete this rule?")) onDelete(r.id);
          }, className: "p-1 text-[#7D6452] hover:text-rose-500", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }, r.id)) })
    ] }) })
  ] });
}
export {
  SmartFilterPage as component
};
