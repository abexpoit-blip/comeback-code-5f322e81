import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Bell, Sparkles, Trophy, Star, Rocket, Zap, Crown, CheckCircle2, Info, AlertTriangle, Gift, Megaphone, Search, LifeBuoy, Plus, ArrowRight, Filter, RefreshCw, Copy, Pause, Play, Trash2, ChevronRight, Smartphone, TrendingUp } from "lucide-react";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import { l as listActiveBroadcasts, m as markBroadcastRead, a as markAllBroadcastsRead, g as getPrimaryShortenerDomain } from "./broadcasts.functions-B5ydsR63.js";
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
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d92329a3920cdf27b95b7cdd8aad02e139123df62ceb742f8f8e8acfe52088c7"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("44d979f29b3090e2a0d4d5aebf18305dbf03f2b37a638449350f6fa601ee257f"));
const getDashboardData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6a23396487d12637aec30b2c5bc38775e6a4e107ee1378e0e7da2dfea39445c4"));
const createLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  title: z.string().max(200).optional(),
  adsterra_url: z.string().url(),
  safe_url: z.string().url().optional()
}).parse(d)).handler(createSsrRpc("da1ead2589edcd03e14bb7e21f054c2a6a483664cebe9882e25cdfa88bf78c07"));
const deleteLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("6021030f0f52bde86b3a053c6b16c05f0977afd13e86af1e3a8bd8e3c1ad4d75"));
const toggleLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("095595cb077a7d492cff96d4e7ec4bf67e6f183f2efdbbaeeb057b114ece087b"));
const TEMPLATE_VALUES = ["verify", "reward", "countdown", "article", "article_health", "article_news", "article_finance", "article_lifestyle", "article_tech", "article_celebrity", "article_business", "article_travel"];
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  prelanding_template: z.enum(TEMPLATE_VALUES)
}).parse(d)).handler(createSsrRpc("dd4dbb6d223536d6f6795a2cc71cf7d09feaca554621ea796c74d5c952e25c7e"));
const ICON_MAP = {
  sparkles: Sparkles,
  megaphone: Megaphone,
  gift: Gift,
  warning: AlertTriangle,
  info: Info,
  check: CheckCircle2,
  crown: Crown,
  zap: Zap,
  rocket: Rocket,
  star: Star,
  trophy: Trophy
};
function getIcon(name) {
  return ICON_MAP[name] ?? Sparkles;
}
const TONE_STYLES = {
  premium: {
    ring: "from-[#FF7E5F] via-[#FEB47B] to-[#FFD4BB]",
    iconBg: "from-[#FF7E5F] to-[#FEB47B]",
    glow: "shadow-[0_8px_30px_-8px_rgba(255,126,95,0.45)]",
    badge: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white"
  },
  info: {
    ring: "from-blue-400 via-blue-500 to-blue-600",
    iconBg: "from-blue-500 to-blue-600",
    glow: "shadow-[0_8px_30px_-8px_rgba(59,130,246,0.45)]",
    badge: "bg-blue-500 text-white"
  },
  success: {
    ring: "from-emerald-400 via-emerald-500 to-emerald-600",
    iconBg: "from-emerald-500 to-emerald-600",
    glow: "shadow-[0_8px_30px_-8px_rgba(16,185,129,0.45)]",
    badge: "bg-emerald-500 text-white"
  },
  warning: {
    ring: "from-amber-400 via-orange-500 to-red-500",
    iconBg: "from-amber-500 to-orange-600",
    glow: "shadow-[0_8px_30px_-8px_rgba(245,158,11,0.45)]",
    badge: "bg-amber-500 text-white"
  }
};
function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1e3);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function BroadcastBell() {
  const list = useServerFn(listActiveBroadcasts);
  const mark = useServerFn(markBroadcastRead);
  const markAll = useServerFn(markAllBroadcastsRead);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const q = useQuery({
    queryKey: ["broadcasts"],
    queryFn: () => list(),
    staleTime: 6e4,
    refetchInterval: 9e4
  });
  const markMut = useMutation({
    mutationFn: (id) => mark({ data: { broadcast_id: id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadcasts"] })
  });
  const markAllMut = useMutation({
    mutationFn: () => markAll(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broadcasts"] })
  });
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const items = q.data?.items ?? [];
  const unread = q.data?.unread_count ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        className: "relative w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] flex items-center justify-center text-[#7D6452] hover:text-[#FF7E5F] hover:border-[#FF7E5F]/40 transition-all",
        "aria-label": `Notifications${unread ? `, ${unread} unread` : ""}`,
        children: [
          /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
          unread > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(255,126,95,0.9)]", children: unread > 9 ? "9+" : unread }),
            /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-xl ring-2 ring-[#FF7E5F]/30 animate-pulse pointer-events-none" })
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-12 z-50 w-[380px] max-h-[520px] rounded-2xl bg-white border border-[#FFEDD5] shadow-2xl shadow-orange-900/15 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative px-5 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFEDD5]/40 border-b border-[#FFEDD5] flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-md shadow-orange-500/30", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-extrabold text-[#2D1B0D]", children: "Notifications" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#A38D7D]", children: unread > 0 ? `${unread} new` : "All caught up" })
          ] })
        ] }),
        unread > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => markAllMut.mutate(),
            className: "text-[11px] font-bold text-[#FF7E5F] hover:text-[#E66D50] transition-colors",
            children: "Mark all read"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "overflow-y-auto max-h-[440px]", children: [
        q.isLoading && /* @__PURE__ */ jsx("div", { className: "px-5 py-10 text-center text-xs text-[#A38D7D]", children: "Loading…" }),
        !q.isLoading && items.length === 0 && /* @__PURE__ */ jsxs("div", { className: "px-5 py-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-[#FFF9F5] border border-[#FFEDD5] flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(Bell, { className: "w-6 h-6 text-[#A38D7D]" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-[#2D1B0D]", children: "No notices yet" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#A38D7D] mt-1", children: "We'll notify you of important updates here." })
        ] }),
        items.map((b) => {
          const Icon = getIcon(b.icon);
          const tone = TONE_STYLES[b.tone] ?? TONE_STYLES.premium;
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => !b.is_read && markMut.mutate(b.id),
              className: `w-full text-left px-4 py-3.5 border-b border-[#FFEDD5]/70 last:border-0 hover:bg-[#FFF9F5]/70 transition-colors ${!b.is_read ? "bg-gradient-to-r from-[#FFF9F5] to-transparent" : ""}`,
              children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
                  /* @__PURE__ */ jsx("div", { className: `absolute inset-0 rounded-xl bg-gradient-to-br ${tone.ring} blur-sm opacity-50` }),
                  /* @__PURE__ */ jsx("div", { className: `relative w-10 h-10 rounded-xl bg-gradient-to-br ${tone.iconBg} flex items-center justify-center ${tone.glow}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-white" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[13px] font-extrabold text-[#2D1B0D] leading-snug", children: b.title }),
                    !b.is_read && /* @__PURE__ */ jsx("span", { className: "shrink-0 mt-1 w-2 h-2 rounded-full bg-[#FF7E5F] shadow-[0_0_6px_rgba(255,126,95,0.9)]" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-[#7D6452] mt-1 leading-relaxed line-clamp-3", children: b.body }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                    b.tone === "premium" && /* @__PURE__ */ jsx("span", { className: `text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${tone.badge} shadow-sm tracking-wide uppercase`, children: "✨ Premium" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#A38D7D] font-medium", children: timeAgo(b.created_at) })
                  ] })
                ] })
              ] })
            },
            b.id
          );
        })
      ] })
    ] })
  ] });
}
const display = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function fmtCompact(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return n.toLocaleString();
}
function DashboardPage() {
  const qc = useQueryClient();
  const dash = useServerFn(getDashboardData);
  const create = useServerFn(createLink);
  const remove = useServerFn(deleteLink);
  const toggle = useServerFn(toggleLink);
  const dashQ = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dash(),
    staleTime: 1e4,
    gcTime: 5 * 6e4,
    refetchInterval: 15e3,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
  const [adsterra, setAdsterra] = useState("");
  const [safe, setSafe] = useState("");
  const [title, setTitle] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("7D");
  const createMut = useMutation({
    mutationFn: (vars) => create({
      data: vars
    }),
    onSuccess: () => {
      toast.success("Link created");
      setAdsterra("");
      setSafe("");
      setTitle("");
      setShowCreate(false);
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (id) => remove({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
    }
  });
  const togMut = useMutation({
    mutationFn: (v) => toggle({
      data: v
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["dashboard"]
    })
  });
  const onSubmit = (e) => {
    e.preventDefault();
    createMut.mutate({
      title: title || void 0,
      adsterra_url: adsterra,
      safe_url: safe || void 0
    });
  };
  const primaryFn = useServerFn(getPrimaryShortenerDomain);
  const primaryQ = useQuery({
    queryKey: ["primary-shortener-domain"],
    queryFn: () => primaryFn(),
    staleTime: 5 * 6e4,
    gcTime: 30 * 6e4,
    refetchOnWindowFocus: false
  });
  const primaryDomain = primaryQ.data?.domain ?? "sleepox.com";
  const origin = typeof window !== "undefined" ? `${window.location.protocol}//${primaryDomain}` : `https://${primaryDomain}`;
  const links = dashQ.data?.links ?? [];
  const profile = dashQ.data?.profile;
  const stats = dashQ.data?.stats;
  const totalClicks = links.reduce((s, l) => s + (l.clicks_count || 0), 0);
  const botBlocked = links.reduce((s, l) => s + (l.bot_clicks_count || 0), 0);
  const allTraffic = totalClicks + botBlocked;
  const activeLinks = links.filter((l) => l.is_active).length;
  const uniqueVisitors = stats?.uniqueVisitors ?? 0;
  const botPct = allTraffic > 0 ? botBlocked / allTraffic * 100 : 0;
  const clickQuota = profile?.click_quota ?? null;
  const clicksUsed = Number(profile?.clicks_used ?? 0);
  const quotaPct = clickQuota ? Math.min(100, Math.round(clicksUsed / clickQuota * 100)) : 0;
  const quotaLabel = clickQuota ? `${fmtCompact(clicksUsed)} / ${fmtCompact(clickQuota)}` : "Unlimited";
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => (l.title ?? "").toLowerCase().includes(q) || l.short_code.toLowerCase().includes(q) || (l.adsterra_url ?? "").toLowerCase().includes(q));
  }, [links, search]);
  const chartData = useMemo(() => {
    const byDay = stats?.clicksByDay ?? {};
    const keys = Object.keys(byDay).sort();
    const slice = range === "7D" ? keys.slice(-7) : keys.slice(-30);
    const vals = slice.map((k) => byDay[k] ?? 0);
    const max = Math.max(1, ...vals);
    return vals.map((v) => v / max);
  }, [stats, range]);
  const regionRows = useMemo(() => {
    const cs = stats?.countryStats ?? {};
    const entries = Object.entries(cs).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, n]) => s + n, 0);
    if (total === 0) return [];
    const palette = ["#BFDBFE", "#FECACA", "#BBF7D0", "#FED7AA"];
    const top = entries.slice(0, 3);
    const otherCount = entries.slice(3).reduce((s, [, n]) => s + n, 0);
    const rows = top.map(([name, n], i) => ({
      name,
      pct: Math.round(n / total * 100),
      color: palette[i]
    }));
    if (otherCount > 0) rows.push({
      name: "Other",
      pct: Math.round(otherCount / total * 100),
      color: palette[3]
    });
    return rows;
  }, [stats]);
  const mobilePct = stats?.mobilePct ?? 0;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full text-[#2D1B0D]", style: display, children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-sm shadow-orange-900/5 px-5 py-3 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-orange-500/30", children: "S" }),
        /* @__PURE__ */ jsx("span", { className: "font-extrabold text-[17px] text-[#2D1B0D] tracking-tight", children: "sleepox" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 relative max-w-xl", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A38D7D]" }),
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search links...", className: "w-full bg-[#FFF9F5]/70 border border-[#FFEDD5] rounded-xl py-2.5 pl-11 pr-4 text-sm placeholder:text-[#A38D7D] focus:outline-none focus:border-[#FF7E5F]/50 focus:bg-white transition-all" })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/support", className: "hidden sm:inline-flex h-10 px-3 items-center gap-1.5 rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] text-[#7D6452] hover:text-[#FF7E5F] hover:border-[#FF7E5F]/40 transition-all text-[12px] font-bold", children: [
        /* @__PURE__ */ jsx(LifeBuoy, { className: "w-3.5 h-3.5" }),
        "Support"
      ] }),
      /* @__PURE__ */ jsx(BroadcastBell, {}),
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] shadow-md shadow-orange-500/30" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsx(KpiCard, { label: "HUMAN CLICKS", value: fmtCompact(totalClicks), sub: `${fmtCompact(allTraffic)} total incl. bots`, tone: "muted" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "ACTIVE LINKS", value: String(activeLinks), sub: `${links.length} total`, tone: "muted" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "UNIQUE VISITORS", value: fmtCompact(uniqueVisitors), sub: "Last 30 days, humans only", tone: "muted" }),
      /* @__PURE__ */ jsx(KpiCard, { label: "BOT BLOCKED", value: `${botPct.toFixed(1)}%`, sub: `${fmtCompact(botBlocked)} attempts`, tone: "muted" }),
      /* @__PURE__ */ jsx(QuotaCard, { pct: quotaPct, label: quotaLabel })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs(Panel, { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4 flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-lg font-bold text-[#2D1B0D]", style: display, children: [
                "Clicks over ",
                range === "7D" ? "7 days" : "30 days"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A38D7D] mt-0.5", children: "Tracking real-time traffic volume" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-[#FFEDD5]/60 p-1 rounded-xl", children: ["7D", "30D"].map((r) => /* @__PURE__ */ jsx("button", { onClick: () => setRange(r), className: `px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${range === r ? "bg-[#FF7E5F] text-white shadow-sm" : "text-[#A38D7D] hover:text-[#7D6452]"}`, children: r }, r)) })
          ] }),
          /* @__PURE__ */ jsx(AreaChart, { data: chartData })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setShowCreate((v) => !v), className: "w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] p-5 flex items-center gap-4 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-40 h-40 bg-white/15 blur-3xl rounded-full pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-white font-bold text-[15px]", style: display, children: "Create new smart link" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/85 text-xs mt-0.5", children: "Setup advanced redirection & cloaking" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "hidden sm:flex items-center gap-1.5 bg-white text-[#FF7E5F] px-4 py-2 rounded-lg font-bold text-xs group-hover:scale-105 transition-transform", children: [
            "Quick Start ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
          ] })
        ] }),
        showCreate && /* @__PURE__ */ jsxs(Panel, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#2D1B0D] mb-1", style: display, children: "Create Smart Link" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[#7D6452] mb-5", children: "Wrap your Adsterra link with bot-shield & cloak page." }),
          /* @__PURE__ */ jsxs("form", { onSubmit, className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(Field, { label: "Title (optional)", full: true, children: /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "My ad campaign", className: fieldCls }) }),
            /* @__PURE__ */ jsx(Field, { label: "Adsterra Direct Link *", children: /* @__PURE__ */ jsx("input", { type: "url", required: true, value: adsterra, onChange: (e) => setAdsterra(e.target.value), placeholder: "https://...", className: fieldCls }) }),
            /* @__PURE__ */ jsx(Field, { label: "Safe URL (for reviewers)", children: /* @__PURE__ */ jsx("input", { type: "url", value: safe, onChange: (e) => setSafe(e.target.value), placeholder: "https://sleepox.com/", className: fieldCls }) }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 flex gap-3 pt-1", children: [
              /* @__PURE__ */ jsx("button", { type: "submit", disabled: createMut.isPending, className: "px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50", children: createMut.isPending ? "Creating…" : "Create Link" }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowCreate(false), className: "px-6 py-3 rounded-xl text-sm font-semibold text-[#7D6452] hover:text-[#2D1B0D] border border-[#FFEDD5] hover:bg-white/60", children: "Cancel" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Panel, { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 flex justify-between items-center flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-[#2D1B0D]", style: display, children: "Recent Campaigns" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#A38D7D] mt-0.5", children: [
                "Showing ",
                filtered.length,
                " of ",
                links.length
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("button", { className: "w-9 h-9 rounded-lg border border-[#FFEDD5] text-[#A38D7D] hover:text-[#FF7E5F] hover:border-[#FF7E5F]/40 flex items-center justify-center transition-all", children: /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => qc.invalidateQueries({
                queryKey: ["dashboard"]
              }), className: "w-9 h-9 rounded-lg border border-[#FFEDD5] text-[#A38D7D] hover:text-[#FF7E5F] hover:border-[#FF7E5F]/40 flex items-center justify-center transition-all", children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }) })
            ] })
          ] }),
          dashQ.isLoading && /* @__PURE__ */ jsx("div", { className: "py-16 text-center text-sm text-[#A38D7D]", children: "Loading links…" }),
          !dashQ.isLoading && filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-16 text-center text-sm text-[#7D6452]", children: search ? "No links match." : "No links yet — click Create new smart link above." }),
          filtered.length > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left min-w-[720px]", children: [
            /* @__PURE__ */ jsx("thead", { className: "text-[10px] uppercase tracking-[0.18em] text-[#A38D7D] border-y border-[#FFEDD5]", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-bold", children: "Campaign" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-bold", children: "Trend" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-bold", children: "Clicks" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-bold", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "px-5 py-3 font-bold text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#FFEDD5]", children: filtered.map((l) => {
              const shortUrl = `${origin}/r/${l.short_code}`;
              const spark = stats?.perLinkDaily?.[l.id] ?? [];
              const sparkUp = spark.length >= 2 ? spark[spark.length - 1] >= spark[0] : true;
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[#FFF9F5] transition-colors", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#2D1B0D] truncate max-w-[220px]", style: display, children: l.title || l.short_code }),
                  /* @__PURE__ */ jsxs("button", { onClick: () => {
                    navigator.clipboard.writeText(shortUrl);
                    toast.success("Copied");
                  }, className: "text-[11px] text-[#FF7E5F] hover:text-[#E66D50] flex items-center gap-1 mt-0.5 font-mono", children: [
                    "/r/",
                    l.short_code,
                    " ",
                    /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx(MiniSpark, { up: sparkUp }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-[#2D1B0D] tabular-nums", style: display, children: (l.clicks_count || 0).toLocaleString() }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("button", { onClick: () => togMut.mutate({
                  id: l.id,
                  is_active: !l.is_active
                }), className: l.is_active ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700" : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700", children: l.is_active ? "ACTIVE" : "PAUSED" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => togMut.mutate({
                    id: l.id,
                    is_active: !l.is_active
                  }), className: "text-[#7D6452] hover:text-[#FF7E5F] p-1.5 rounded-lg hover:bg-[#FFEDD5]/60", children: l.is_active ? /* @__PURE__ */ jsx(Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Play, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Delete this link?")) delMut.mutate(l.id);
                  }, className: "text-[#7D6452] hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-[#A38D7D]" })
                ] }) })
              ] }, l.id);
            }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(Panel, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-[#2D1B0D]", style: display, children: "Account Quota" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#7D6452]", children: "Redirects used" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#2D1B0D] tabular-nums", children: quotaLabel })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 h-2 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-[0_0_8px_rgba(255,126,95,0.5)]", style: {
            width: `${quotaPct}%`
          } }) }),
          /* @__PURE__ */ jsx(Link, { to: "/upgrade", className: "mt-5 w-full block text-center py-3 rounded-xl border-2 border-[#FF7E5F] text-[#FF7E5F] font-bold text-sm hover:bg-gradient-to-r hover:from-[#FF7E5F] hover:to-[#FEB47B] hover:text-white hover:border-transparent transition-all", children: "Upgrade to Pro" })
        ] }),
        /* @__PURE__ */ jsxs(Panel, { className: "p-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-[#2D1B0D]", style: display, children: "Traffic by Region" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: regionRows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A38D7D]", children: "No traffic yet." }) : regionRows.map((r) => /* @__PURE__ */ jsx(RegionRow, { color: r.color, name: r.name, pct: r.pct }, r.name)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t border-[#FFEDD5] flex flex-col items-center", children: [
            /* @__PURE__ */ jsx(MobileGauge, { pct: mobilePct }),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-[10px] uppercase tracking-[0.18em] font-bold text-[#A38D7D] flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Smartphone, { className: "w-3 h-3" }),
              " Mobile Traffic"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function Panel({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-sm shadow-orange-900/5 " + className, children });
}
function KpiCard({
  label,
  value,
  sub,
  tone
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl p-4 shadow-sm shadow-orange-900/5 hover:-translate-y-0.5 hover:shadow-md transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-[#A38D7D]", children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl lg:text-3xl font-extrabold text-[#2D1B0D] mt-2 tabular-nums", style: display, children: value }),
    /* @__PURE__ */ jsxs("div", { className: `text-[11px] font-bold mt-1 flex items-center gap-1 ${tone === "up" ? "text-emerald-600" : "text-[#FF7E5F]"}`, children: [
      tone === "up" && /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }),
      sub
    ] })
  ] });
}
function QuotaCard({
  pct,
  label
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl p-4 shadow-sm shadow-orange-900/5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-[#A38D7D]", children: "QUOTA" }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-[#FF7E5F] tabular-nums", children: label })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 h-2 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] shadow-[0_0_8px_rgba(255,126,95,0.5)] transition-all", style: {
      width: `${pct}%`
    } }) }),
    /* @__PURE__ */ jsxs(Link, { to: "/upgrade", className: "mt-4 text-[11px] font-bold text-[#FF7E5F] hover:text-[#E66D50] flex items-center gap-1", children: [
      "Upgrade plan ",
      /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })
    ] })
  ] });
}
function AreaChart({
  data
}) {
  const w = 800, h = 260;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * w;
    const y = h - v / max * (h - 30) - 15;
    return [x, y];
  });
  const path = "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
  const area = path + ` L${w},${h} L0,${h} Z`;
  return /* @__PURE__ */ jsxs("svg", { viewBox: `0 0 ${w} ${h}`, className: "w-full", style: {
    height: 260
  }, preserveAspectRatio: "none", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "dashArea", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FF7E5F", stopOpacity: "0.4" }),
      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FEB47B", stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ jsx("path", { d: area, fill: "url(#dashArea)" }),
    /* @__PURE__ */ jsx("path", { d: path, fill: "none", stroke: "#FF7E5F", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: {
      filter: "drop-shadow(0 2px 6px rgba(255,126,95,0.4))"
    } })
  ] });
}
function MiniSpark({
  up
}) {
  const w = 80, h = 28;
  const pts = up ? [[0, 20], [15, 18], [30, 14], [45, 16], [60, 10], [80, 6]] : [[0, 10], [15, 14], [30, 12], [45, 18], [60, 16], [80, 22]];
  const path = "M" + pts.map(([x, y]) => `${x},${y}`).join(" L");
  return /* @__PURE__ */ jsx("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, children: /* @__PURE__ */ jsx("path", { d: path, fill: "none", stroke: up ? "#10B981" : "#FF7E5F", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function RegionRow({
  color,
  name,
  pct
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm shrink-0", style: {
      background: color
    } }),
    /* @__PURE__ */ jsx("span", { className: "text-sm text-[#2D1B0D] flex-1", children: name }),
    /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-[#2D1B0D] tabular-nums", children: [
      pct,
      "%"
    ] })
  ] });
}
function MobileGauge({
  pct
}) {
  const size = 120, stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - pct / 100 * c;
  return /* @__PURE__ */ jsxs("div", { className: "relative", style: {
    width: size,
    height: size
  }, children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
      /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "#FFEDD5", strokeWidth: stroke }),
      /* @__PURE__ */ jsx("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "url(#mg)", strokeWidth: stroke, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: offset, style: {
        filter: "drop-shadow(0 0 6px rgba(255,126,95,0.5))"
      } }),
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "mg", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FF7E5F" }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FEB47B" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#A38D7D] font-semibold", children: "Mobile" }),
      /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-[#2D1B0D] tabular-nums", style: display, children: [
        pct,
        "%"
      ] })
    ] })
  ] });
}
const fieldCls = "w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl px-4 py-3 text-sm text-[#2D1B0D] placeholder:text-[#A38D7D] focus:outline-none focus:border-[#FF7E5F]/50 focus:bg-white transition-all";
function Field({
  label,
  full = false,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: `block ${full ? "sm:col-span-2" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-[0.16em] text-[#A38D7D] mb-1.5 block", children: label }),
    children
  ] });
}
export {
  DashboardPage as component
};
