import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState, useMemo, useEffect } from "react";
import { Activity, Download, ShieldCheck, Zap, AlertTriangle, ShieldAlert, TrendingDown, Users, X, Globe2, Smartphone, Tablet, Monitor, HelpCircle } from "lucide-react";
import { geoEqualEarth, geoPath, geoGraticule, geoCentroid } from "d3-geo";
import { a as getAnalyticsData, b as getCohortRetention, c as getLinkDrilldown } from "./analytics.functions-BFTh9uHO.js";
import "@tanstack/react-router";
import "./server-BTtYLKd6.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "./auth-middleware-V_HzM7yr.js";
import "@supabase/supabase-js";
import "./createMiddleware-BvN2ghIY.js";
const display = {
  fontFamily: "'Space Grotesk', sans-serif"
};
function AnalyticsPage() {
  const fn = useServerFn(getAnalyticsData);
  const cohortFn = useServerFn(getCohortRetention);
  const [drilldownId, setDrilldownId] = useState(null);
  const q = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fn(),
    refetchInterval: 15e3,
    staleTime: 1e4,
    gcTime: 5 * 6e4,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1
  });
  const cohortQ = useQuery({
    queryKey: ["cohort-retention"],
    queryFn: () => cohortFn(),
    staleTime: 5 * 6e4,
    gcTime: 10 * 6e4,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
  const d = q.data;
  const maxSeries = useMemo(() => Math.max(1, ...d?.series24h ?? [1]), [d]);
  const sparkPath = useMemo(() => {
    if (!d) return "";
    const pts = d.series24h.map((v, i) => {
      const x = i / 23 * 1e3;
      const y = 100 - v / maxSeries * 90;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${pts.join(" L ")}`;
  }, [d, maxSeries]);
  if (q.isError) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-3 text-center p-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[#5D4538] text-sm", children: "Couldn't load analytics." }),
      /* @__PURE__ */ jsx("p", { className: "text-[#7D6452] text-xs max-w-md", children: q.error?.message ?? "Unknown error" }),
      /* @__PURE__ */ jsx("button", { onClick: () => q.refetch(), className: "mt-2 px-4 py-2 rounded-xl bg-[#FF7E5F]/15 border border-[#FF7E5F]/40 text-[#FF7E5F] text-xs font-bold hover:bg-[#FF7E5F]/25 transition", children: "Retry" })
    ] });
  }
  if (q.isLoading || !d) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center text-[#7D6452]", children: [
      /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 animate-pulse mr-2" }),
      " Loading analytics…"
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-[#FF7E5F]/80 font-bold mb-2", children: "Real-time Command" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-bold text-[#2D1B0D] tracking-tight", style: display, children: "Advanced Analytics" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#7D6452] text-sm mt-1", children: "Live performance signals across all your smart links — last 7 days." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 border border-white/80 backdrop-blur-md", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-emerald-600 font-bold tracking-wider uppercase", children: "Live" })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform", children: [
          /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
          " Export CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SundayResetBanner, {}),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-8 p-8 rounded-3xl bg-white/80 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.08)] relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-72 h-72 bg-[#FF7E5F]/10 blur-[100px] rounded-full" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold", children: "Live Traffic" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-6xl lg:text-7xl font-bold text-[#2D1B0D] tracking-tighter", style: display, children: d.kpis.cps }),
              /* @__PURE__ */ jsx("p", { className: "text-[#7D6452] text-xs uppercase tracking-[0.25em] mt-2 font-bold", children: "Clicks per second" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[280px] h-24 relative", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 1000 100", preserveAspectRatio: "none", className: "w-full h-full", children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "aGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FF7E5F", stopOpacity: "0.5" }),
                /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FF7E5F", stopOpacity: "0" })
              ] }) }),
              /* @__PURE__ */ jsx("path", { d: `${sparkPath} L 1000,100 L 0,100 Z`, fill: "url(#aGrad)" }),
              /* @__PURE__ */ jsx("path", { d: sparkPath, fill: "none", stroke: "#FF7E5F", strokeWidth: "2.5", strokeLinecap: "round" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/80", children: [
            /* @__PURE__ */ jsx(Stat, { label: "Last 24h", value: d.kpis.last24h.toLocaleString() }),
            /* @__PURE__ */ jsx(Stat, { label: "Total (7d)", value: d.kpis.total.toLocaleString() }),
            /* @__PURE__ */ jsx(Stat, { label: "Human rate", value: `${d.kpis.humanRate}%`, accent: "emerald" }),
            /* @__PURE__ */ jsx(Stat, { label: "Sent to ads", value: (d.kpis.oursClicks ?? 0).toLocaleString(), accent: "sky" }),
            /* @__PURE__ */ jsx(Stat, { label: "Active links", value: d.kpis.activeLinks.toString() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-12 lg:col-span-4 grid grid-cols-1 gap-6", children: [
        /* @__PURE__ */ jsx(MiniCard, { icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" }), label: "Bot detection", value: d.kpis.total ? `${(d.kpis.bots / d.kpis.total * 100).toFixed(2)}%` : "0%", sub: `${d.kpis.bots.toLocaleString()} bots blocked`, tone: "amber" }),
        /* @__PURE__ */ jsx(MiniCard, { icon: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" }), label: "Humans served", value: d.kpis.humans.toLocaleString(), sub: `${d.kpis.humanRate}% of total traffic`, tone: "sky" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-7", title: "World Map", right: /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#7D6452] uppercase tracking-widest", children: "Click intensity by country" }), children: /* @__PURE__ */ jsx(WorldMap, { topCountries: d.topCountries }) }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-5", title: "Top Countries", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        d.topCountries.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No clicks yet" }),
        d.topCountries.map((c) => /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Flag, { code: c.code }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#2D1B0D] font-medium truncate", children: c.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#7D6452] uppercase tracking-wider font-mono", children: c.code })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-mono text-[#2D1B0D]", children: c.count.toLocaleString() }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-mono text-[#FF7E5F]", children: [
                c.pct,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] rounded-full shadow-[0_0_6px_rgba(255,126,95,0.4)]", style: {
            width: `${Math.max(c.pct, 2)}%`
          } }) })
        ] }, c.code))
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-8", title: "Click Velocity (7d × 24h, UTC)", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        d.heatmap.map((row, di) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 text-[9px] text-[#8B7563] font-mono", children: dayLabel(6 - di) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 grid grid-cols-24 gap-[3px]", children: row.map((v, hi) => {
            const intensity = v / d.heatMax;
            return /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-[2px]", style: {
              backgroundColor: v === 0 ? "rgba(45,27,13,0.05)" : `rgba(255, 126, 95, ${0.18 + intensity * 0.82})`,
              boxShadow: intensity > 0.7 ? "0 0 6px rgba(255,126,95,0.5)" : void 0
            }, title: `${v} clicks @ ${hi}:00` }, hi);
          }) })
        ] }, di)),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between pl-10 pt-2 text-[9px] text-[#8B7563] font-mono", children: [
          /* @__PURE__ */ jsx("span", { children: "00" }),
          /* @__PURE__ */ jsx("span", { children: "06" }),
          /* @__PURE__ */ jsx("span", { children: "12" }),
          /* @__PURE__ */ jsx("span", { children: "18" }),
          /* @__PURE__ */ jsx("span", { children: "23" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-4", title: "Live Event Stream", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-h-[420px] overflow-y-auto pr-1", children: [
        d.liveEvents.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "Waiting for events…" }),
        d.liveEvents.map((e, i) => {
          const color = e.isBot ? "border-amber-500/50 text-amber-600" : e.routed === "safe" ? "border-[#6366F1]/50 text-[#6366F1]" : "border-emerald-500/50 text-emerald-600";
          return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 text-xs border-l-2 ${color} pl-2 py-2 bg-white/60 rounded-r-md`, style: {
            opacity: 1 - i * 0.03
          }, children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] text-[#7D6452] w-14 shrink-0", children: new Date(e.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            }) }),
            /* @__PURE__ */ jsx(Flag, { code: e.country, small: true }),
            /* @__PURE__ */ jsx(DeviceIcon, { name: e.device }),
            /* @__PURE__ */ jsx(BrowserIcon, { slug: e.browserSlug, color: e.browserColor, title: e.browser }),
            /* @__PURE__ */ jsx("span", { className: "text-[#3D2818] truncate flex-1 text-[11px]", children: e.isBot ? "🛡 Bot blocked" : e.routed === "safe" ? "↪ Safe redirect" : "✓ Offer click" })
          ] }, e.id);
        })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-12 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "col-span-12 md:col-span-6 xl:col-span-4", title: "Devices", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Donut, { data: d.devices.map((dv, i) => ({
          value: dv.count,
          color: ["#FF7E5F", "#FEB47B", "#F59E0B", "#A38D7D"][i % 4]
        })), centerLabel: d.devices[0]?.name ?? "—", centerValue: `${d.devices[0]?.pct ?? 0}%` }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          d.devices.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No device data" }),
          d.devices.map((dv, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-[#3D2818]", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full", style: {
                backgroundColor: ["#FF7E5F", "#FEB47B", "#F59E0B", "#A38D7D"][i % 4]
              } }),
              /* @__PURE__ */ jsx(DeviceIcon, { name: dv.name }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: dv.name })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-[#7D6452]", children: [
              dv.count.toLocaleString(),
              " · ",
              dv.pct,
              "%"
            ] })
          ] }, dv.name))
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 md:col-span-6 xl:col-span-4", title: "Browsers", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        d.browsers.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No browser data" }),
        d.browsers.map((b) => /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(BrowserIcon, { slug: b.slug, color: b.color, title: b.name, large: true }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-[#2D1B0D] font-medium", children: b.name }) }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-[#7D6452]", children: [
              b.count.toLocaleString(),
              " · ",
              b.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full", style: {
            width: `${Math.max(b.pct, 2)}%`,
            background: `linear-gradient(90deg, #${b.color}, #${b.color}88)`
          } }) })
        ] }, b.name))
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-4", title: "Operating Systems", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        d.operatingSystems.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No OS data" }),
        d.operatingSystems.map((o) => /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(BrowserIcon, { slug: o.slug, color: "94a3b8", title: o.name, large: true }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-[#2D1B0D] font-medium", children: o.name }) }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-[#7D6452]", children: [
              o.count.toLocaleString(),
              " · ",
              o.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-slate-300 to-slate-500 rounded-full", style: {
            width: `${Math.max(o.pct, 2)}%`
          } }) })
        ] }, o.name))
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-12 gap-6 pb-10", children: [
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-5", title: "Bot Detection Breakdown", right: /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-amber-600/80 uppercase tracking-widest flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "w-3 h-3" }),
        " Protected"
      ] }), children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        d.botReasons.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No bot traffic detected — clean!" }),
        d.botReasons.map((r) => /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-500 shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#3D2818] font-medium flex-1", children: r.name }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-amber-600", children: r.count.toLocaleString() }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-[#7D6452] w-12 text-right", children: [
              r.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full", style: {
            width: `${Math.max(r.pct, 2)}%`
          } }) })
        ] }, r.name))
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "col-span-12 xl:col-span-7", title: "Top Performing Links", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        d.topLinks.length === 0 && /* @__PURE__ */ jsx(Empty, { label: "No link data yet" }),
        d.topLinks.map((l, i) => /* @__PURE__ */ jsxs("button", { onClick: () => setDrilldownId(l.id), className: "w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#FFEDD5] hover:border-[#FF7E5F]/60 hover:bg-white/90 hover:shadow-md transition-all", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center text-white text-xs font-bold shrink-0", children: i + 1 }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-[#2D1B0D] truncate font-mono", children: [
              "/",
              l.code
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wider text-[#7D6452] truncate", children: l.title ?? "Untitled link" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-emerald-600 font-mono", children: [
              l.humans.toLocaleString(),
              " ✓"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-600 font-mono", children: [
              l.bots.toLocaleString(),
              " 🛡"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0 min-w-[58px]", children: [
            /* @__PURE__ */ jsxs("p", { className: `text-sm font-bold font-mono ${l.health >= 70 ? "text-emerald-600" : l.health >= 40 ? "text-amber-600" : "text-rose-600"}`, children: [
              l.health,
              "%"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-wider text-[#7D6452]", children: "Drill →" })
          ] })
        ] }, l.id))
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-12 gap-6 pb-10", children: /* @__PURE__ */ jsx(Card, { className: "col-span-12", title: "Traffic Sources", right: /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#7D6452] uppercase tracking-widest", children: "Quality = human / total" }), children: d.trafficSources.length === 0 ? /* @__PURE__ */ jsx(Empty, { label: "No traffic yet — share a link to see sources" }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3", children: d.trafficSources.map((s) => /* @__PURE__ */ jsxs("div", { className: "group p-4 rounded-2xl bg-white/70 border border-[#FFEDD5] hover:border-[#FF7E5F]/40 hover:-translate-y-0.5 transition-all", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-white border border-[#FFEDD5] flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx(BrowserIcon, { slug: s.slug, color: s.color, title: s.name, large: true }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#2D1B0D] truncate", children: s.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] uppercase tracking-wider text-[#7D6452]", children: [
            s.pct,
            "% share"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${s.quality >= 80 ? "bg-emerald-500/15 text-emerald-700" : s.quality >= 50 ? "bg-amber-500/15 text-amber-700" : "bg-rose-500/15 text-rose-700"}`, children: [
          s.quality,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px] font-mono text-[#5D4538]", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-emerald-600", children: "✓" }),
          " ",
          s.humans.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-amber-600", children: "🛡" }),
          " ",
          s.bots.toLocaleString()
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[#2D1B0D] font-bold", children: s.total.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-1.5 mt-2 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B]", style: {
        width: `${Math.max(s.pct, 2)}%`
      } }) })
    ] }, s.key)) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-12 gap-6 pb-2", children: /* @__PURE__ */ jsx(Card, { className: "col-span-12", title: "Conversion Funnel", right: /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#7D6452] uppercase tracking-widest flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3" }),
      " Click → Landing"
    ] }), children: /* @__PURE__ */ jsx(Funnel, { stages: d.funnel }) }) }),
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-12 gap-6 pb-10", children: /* @__PURE__ */ jsx(Card, { className: "col-span-12", title: "Cohort Retention", right: /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#7D6452] uppercase tracking-widest flex items-center gap-1", children: [
      /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
      " Returning visitors by first-seen day"
    ] }), children: /* @__PURE__ */ jsx(CohortGrid, { loading: cohortQ.isLoading, rows: cohortQ.data?.rows ?? [] }) }) }),
    drilldownId && /* @__PURE__ */ jsx(DrilldownModal, { linkId: drilldownId, onClose: () => setDrilldownId(null) })
  ] });
}
function Card({
  title,
  right,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxs("div", { className: `p-6 rounded-3xl bg-white/80 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.08)] ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D] tracking-wide", style: display, children: title }),
      right
    ] }),
    children
  ] });
}
function Stat({
  label,
  value,
  accent
}) {
  const color = accent === "emerald" ? "text-emerald-600" : accent === "sky" ? "text-[#FF7E5F]" : "text-[#2D1B0D]";
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-[#8B7563] font-bold mb-1", children: label }),
    /* @__PURE__ */ jsx("p", { className: `text-xl font-bold font-mono ${color}`, children: value })
  ] });
}
function MiniCard({
  icon,
  label,
  value,
  sub,
  tone
}) {
  const toneClasses = tone === "amber" ? "from-amber-500/20 to-orange-500/10 text-amber-600 border-amber-400/40" : "from-[#FF7E5F]/15 to-[#FEB47B]/10 text-[#FF7E5F] border-[#FF7E5F]/30";
  return /* @__PURE__ */ jsxs("div", { className: "p-6 rounded-3xl bg-white/80 border border-white/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(255,126,95,0.08)]", children: [
    /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${toneClasses} border text-[10px] uppercase tracking-[0.2em] font-bold mb-4`, children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-[#2D1B0D] font-mono", style: display, children: value }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[#7D6452] mt-1", children: sub })
  ] });
}
function Empty({
  label
}) {
  return /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8B7563] italic", children: label });
}
function dayLabel(daysAgo) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yest";
  const d = new Date(Date.now() - daysAgo * 864e5);
  return d.toLocaleDateString([], {
    weekday: "short"
  });
}
function Donut({
  data,
  centerLabel,
  centerValue
}) {
  const total = Math.max(1, data.reduce((s, x) => s + x.value, 0));
  const R = 56;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return /* @__PURE__ */ jsxs("div", { className: "relative w-36 h-36", children: [
    /* @__PURE__ */ jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 140 140", children: [
      /* @__PURE__ */ jsx("circle", { cx: "70", cy: "70", r: R, fill: "none", stroke: "rgba(45,27,13,0.08)", strokeWidth: "14" }),
      data.map((d, i) => {
        const len = d.value / total * C;
        const seg = /* @__PURE__ */ jsx("circle", { cx: "70", cy: "70", r: R, fill: "none", stroke: d.color, strokeWidth: "14", strokeDasharray: `${len} ${C - len}`, strokeDashoffset: -offset, strokeLinecap: "butt" }, i);
        offset += len;
        return seg;
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-[#2D1B0D]", children: centerValue }),
      /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-widest text-[#7D6452] font-bold", children: centerLabel })
    ] })
  ] });
}
function Flag({
  code,
  small = false
}) {
  const lower = code.toLowerCase();
  const size = small ? "w-5 h-3.5" : "w-7 h-5";
  if (!code || code === "??" || code.length !== 2) {
    return /* @__PURE__ */ jsx("span", { className: `${size} inline-flex items-center justify-center bg-white/70 rounded-[2px] text-[#7D6452] text-[8px]`, children: "?" });
  }
  return /* @__PURE__ */ jsx("img", { src: `https://flagcdn.com/w40/${lower}.png`, srcSet: `https://flagcdn.com/w80/${lower}.png 2x`, alt: code, className: `${size} object-cover rounded-[2px] shadow-sm shrink-0`, loading: "lazy" });
}
function DeviceIcon({
  name,
  os,
  large = false
}) {
  const size = large ? "w-5 h-5" : "w-3.5 h-3.5";
  const o = (os ?? "").toLowerCase();
  if (o.includes("android")) return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/android/3DDC84", alt: "Android", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("ios") || o.includes("ipad") || o.includes("iphone")) return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/apple/000000", alt: "iOS", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("mac")) return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/apple/000000", alt: "macOS", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("windows")) return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/windows11/0078D4", alt: "Windows", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("linux")) return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/linux/000000", alt: "Linux", className: `${size} shrink-0`, loading: "lazy" });
  const n = name.toLowerCase();
  const cls = `${size} text-[#7D6452] shrink-0`;
  if (n === "mobile") return /* @__PURE__ */ jsx(Smartphone, { className: cls });
  if (n === "tablet") return /* @__PURE__ */ jsx(Tablet, { className: cls });
  if (n === "desktop") return /* @__PURE__ */ jsx(Monitor, { className: cls });
  return /* @__PURE__ */ jsx(HelpCircle, { className: cls });
}
function BrowserIcon({
  slug,
  color,
  title,
  large = false
}) {
  const size = large ? "w-6 h-6" : "w-4 h-4";
  if (!slug || slug === "unknown") {
    return /* @__PURE__ */ jsx("span", { className: `${size} inline-flex items-center justify-center bg-white/70 rounded text-[#7D6452] text-[10px] shrink-0`, title, children: "?" });
  }
  return /* @__PURE__ */ jsx("img", { src: `https://cdn.simpleicons.org/${slug}/${color}`, alt: title, title, className: `${size} shrink-0`, loading: "lazy", onError: (e) => {
    e.currentTarget.style.display = "none";
  } });
}
function Funnel({
  stages
}) {
  if (!stages.length || stages[0].value === 0) return /* @__PURE__ */ jsx(Empty, { label: "No traffic yet to build a funnel" });
  const max = stages[0].value || 1;
  return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: stages.map((s, i) => {
    const widthPct = Math.max(8, s.value / max * 100);
    const dropoff = i > 0 ? stages[i - 1].value - s.value : 0;
    const dropPct = i > 0 && stages[i - 1].value ? Math.round(dropoff / stages[i - 1].value * 1e3) / 10 : 0;
    return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center text-[10px] font-bold", style: {
            borderColor: s.color,
            color: s.color
          }, children: i + 1 }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[#2D1B0D] text-sm", style: display, children: s.stage })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-mono", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#2D1B0D] font-bold", children: s.value.toLocaleString() }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#7D6452]", children: [
            s.pct,
            "%"
          ] }),
          i > 0 && dropoff > 0 && /* @__PURE__ */ jsxs("span", { className: "text-rose-600 text-[10px]", children: [
            "▼ ",
            dropPct,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative h-9 rounded-xl bg-[#FFF5EE] overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 rounded-xl flex items-center justify-end pr-3 text-white text-xs font-bold shadow-md transition-all", style: {
        width: `${widthPct}%`,
        background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`
      }, children: widthPct > 18 && /* @__PURE__ */ jsxs("span", { className: "opacity-90", children: [
        s.pct,
        "%"
      ] }) }) })
    ] }, s.stage);
  }) });
}
function CohortGrid({
  rows,
  loading
}) {
  if (loading) return /* @__PURE__ */ jsx("p", { className: "text-xs text-[#7D6452]", children: "Loading cohorts…" });
  if (!rows.length || rows.every((r) => r.size === 0)) return /* @__PURE__ */ jsx(Empty, { label: "Not enough returning visitors yet — needs at least a few days of traffic" });
  const cell = (pct) => {
    if (pct === 0) return "rgba(45,27,13,0.04)";
    const a = 0.15 + pct / 100 * 0.7;
    return `rgba(255,126,95,${a})`;
  };
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] uppercase tracking-widest text-[#7D6452]", children: [
      /* @__PURE__ */ jsx("th", { className: "py-2 pr-3 font-bold", children: "First seen" }),
      /* @__PURE__ */ jsx("th", { className: "py-2 pr-3 font-bold", children: "Cohort size" }),
      /* @__PURE__ */ jsx("th", { className: "py-2 px-2 font-bold text-center", children: "Day 1" }),
      /* @__PURE__ */ jsx("th", { className: "py-2 px-2 font-bold text-center", children: "Day 7" }),
      /* @__PURE__ */ jsx("th", { className: "py-2 px-2 font-bold text-center", children: "Day 30" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFEDD5]", children: [
      /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-[#3D2818]", children: r.day }),
      /* @__PURE__ */ jsx("td", { className: "py-2 pr-3 font-mono text-[#2D1B0D] font-bold", children: r.size.toLocaleString() }),
      [r.d1, r.d7, r.d30].map((v, i) => /* @__PURE__ */ jsx("td", { className: "py-1 px-2", children: /* @__PURE__ */ jsx("div", { className: "rounded-md text-center font-mono font-bold text-[11px] py-1.5 text-[#2D1B0D]", style: {
        backgroundColor: cell(v)
      }, children: r.size ? `${v}%` : "—" }) }, i))
    ] }, r.day)) })
  ] }) });
}
const WORLD_GEOJSON = "/world.geojson";
const ISO2_TO_ID = {
  US: "USA",
  GB: "GBR",
  DE: "DEU",
  FR: "FRA",
  CA: "CAN",
  IN: "IND",
  BD: "BGD",
  PK: "PAK",
  JP: "JPN",
  CN: "CHN",
  BR: "BRA",
  AU: "AUS",
  NL: "NLD",
  IT: "ITA",
  ES: "ESP",
  MX: "MEX",
  RU: "RUS",
  ID: "IDN",
  PH: "PHL",
  NG: "NGA",
  ZA: "ZAF",
  SE: "SWE",
  PL: "POL",
  TR: "TUR",
  KR: "KOR",
  VN: "VNM",
  AE: "ARE",
  SA: "SAU",
  EG: "EGY",
  AR: "ARG",
  CO: "COL",
  CL: "CHL",
  TH: "THA",
  MY: "MYS",
  SG: "SGP",
  CH: "CHE",
  BE: "BEL",
  AT: "AUT",
  PT: "PRT",
  IE: "IRL",
  NO: "NOR",
  DK: "DNK",
  FI: "FIN",
  NZ: "NZL"
};
function WorldMap({
  topCountries
}) {
  const mapQ = useQuery({
    queryKey: ["world-geojson"],
    queryFn: async () => {
      const res = await fetch(WORLD_GEOJSON);
      if (!res.ok) throw new Error("Map failed to load");
      return await res.json();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1
  });
  const max = Math.max(1, ...topCountries.map((c) => c.count));
  const lookup = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    topCountries.forEach((c) => {
      const id = ISO2_TO_ID[c.code];
      if (id) m.set(id, {
        name: c.name,
        count: c.count,
        pct: c.pct,
        code: c.code
      });
    });
    return m;
  }, [topCountries]);
  const mapData = useMemo(() => {
    if (!mapQ.data) return null;
    const projection = geoEqualEarth().fitExtent([[22, 18], [938, 398]], mapQ.data);
    const path = geoPath(projection);
    const graticule = geoGraticule().step([20, 20]);
    return {
      projection,
      path,
      graticule: path(graticule()),
      sphere: path({
        type: "Sphere"
      })
    };
  }, [mapQ.data]);
  const colorFor = (count) => {
    if (!count) return "#DE9B72";
    const t = Math.min(1, Math.pow(count / max, 0.5));
    const r = Math.round(255 - t * 125);
    const g = Math.round(185 - t * 145);
    const b = Math.round(95 - t * 75);
    return `rgb(${r},${g},${b})`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative h-[420px] rounded-2xl overflow-hidden border border-[#FFD9BE]\n      bg-[radial-gradient(ellipse_at_top_left,_#FFFBF7_0%,_#FFE4CC_55%,_#FFC093_100%)]\n      shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_30px_-12px_rgba(255,126,95,0.28)]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.32] pointer-events-none", style: {
      backgroundImage: "radial-gradient(circle, rgba(130,40,20,0.16) 1px, transparent 1px)",
      backgroundSize: "18px 18px"
    } }),
    !mapData || !mapQ.data ? /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center text-[#7D6452] text-xs font-bold uppercase tracking-[0.18em]", children: "Loading map…" }) : /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 960 420", className: "relative z-10 h-full w-full", role: "img", "aria-label": "World map showing clicks by country", children: [
      /* @__PURE__ */ jsxs("defs", { children: [
        /* @__PURE__ */ jsxs("filter", { id: "mapGlow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
          /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "2.2", result: "blur" }),
          /* @__PURE__ */ jsxs("feMerge", { children: [
            /* @__PURE__ */ jsx("feMergeNode", { in: "blur" }),
            /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("radialGradient", { id: "dotGlow", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#D92312", stopOpacity: "1" }),
          /* @__PURE__ */ jsx("stop", { offset: "60%", stopColor: "#FF6E3D", stopOpacity: "0.58" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FF6E3D", stopOpacity: "0" })
        ] })
      ] }),
      mapData.sphere && /* @__PURE__ */ jsx("path", { d: mapData.sphere, fill: "transparent", stroke: "rgba(130,40,20,0.22)", strokeWidth: 0.7 }),
      mapData.graticule && /* @__PURE__ */ jsx("path", { d: mapData.graticule, fill: "none", stroke: "rgba(130,40,20,0.16)", strokeWidth: 0.45 }),
      mapQ.data.features.map((feature) => {
        const id = String(feature.id ?? "");
        const hit = lookup.get(id);
        const isActive = !!hit;
        const d = mapData.path(feature);
        if (!d) return null;
        return /* @__PURE__ */ jsx("path", { d, fill: colorFor(hit?.count ?? 0), stroke: isActive ? "#FFFDFB" : "#8E4E2D", strokeWidth: isActive ? 1.1 : 0.55, className: "transition-colors duration-200 hover:fill-[#D92312]", children: /* @__PURE__ */ jsx("title", { children: hit ? `${hit.name} (${hit.code}) — ${hit.count.toLocaleString()} clicks · ${hit.pct}%` : feature.properties?.name }) }, id || feature.properties?.name);
      }),
      mapQ.data.features.filter((feature) => lookup.has(String(feature.id ?? ""))).map((feature) => {
        const hit = lookup.get(String(feature.id ?? ""));
        const projected = mapData.projection(geoCentroid(feature));
        if (!projected) return null;
        const [cx, cy] = projected;
        const r = 3.5 + Math.min(1, hit.count / max) * 8;
        return /* @__PURE__ */ jsxs("g", { transform: `translate(${cx},${cy})`, children: [
          /* @__PURE__ */ jsx("circle", { r: r * 2.2, fill: "url(#dotGlow)", filter: "url(#mapGlow)" }),
          /* @__PURE__ */ jsx("circle", { r, fill: "#D92312", stroke: "#FFFDFB", strokeWidth: 1.6 })
        ] }, `m-${String(feature.id)}`);
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-4 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full\n        bg-white/95 backdrop-blur border border-[#FFE4D2] shadow-[0_4px_12px_-4px_rgba(255,126,95,0.3)]", children: [
      /* @__PURE__ */ jsx(Globe2, { className: "w-3.5 h-3.5 text-[#D92312]" }),
      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-[#2D1B0D] uppercase tracking-[0.18em]", children: [
        topCountries.length,
        " countries"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "ml-1.5 flex items-center gap-[3px]", children: [0.18, 0.4, 0.65, 0.9, 1].map((t, i) => /* @__PURE__ */ jsx("span", { className: "w-3 h-2 rounded-[2px]", style: {
        background: colorFor(Math.round(max * t))
      } }, i)) }),
      /* @__PURE__ */ jsx("span", { className: "text-[9px] text-[#7D6452] font-mono uppercase tracking-wider", children: "low → high" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-4 z-20 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur\n        border border-[#FFE4D2] shadow-sm flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#D92312] animate-pulse" }),
      /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-[#2D1B0D] tracking-wider", children: [
        topCountries.reduce((s, c) => s + c.count, 0).toLocaleString(),
        " CLICKS"
      ] })
    ] })
  ] });
}
function DrilldownModal({
  linkId,
  onClose
}) {
  const fn = useServerFn(getLinkDrilldown);
  const q = useQuery({
    queryKey: ["drilldown", linkId],
    queryFn: () => fn({
      data: {
        linkId
      }
    }),
    staleTime: 3e4
  });
  const d = q.data;
  const maxS = Math.max(1, ...d?.series ?? [1]);
  const path = useMemo(() => {
    if (!d) return "";
    const pts = d.series.map((v, i) => {
      const x = i / 23 * 1e3;
      const y = 100 - v / maxS * 90;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M ${pts.join(" L ")}`;
  }, [d, maxS]);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B0D]/40 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), className: "w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#FFFBF7] to-[#FFF1E6] border border-white shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[#FFEDD5] bg-white/85 backdrop-blur-xl rounded-t-3xl", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.3em] text-[#FF7E5F] font-bold", children: "Link Drill-down · Last 24h" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[#2D1B0D] font-mono mt-1", style: display, children: q.isLoading ? "Loading…" : d ? `/${d.link.code}` : "—" }),
        d?.link.title && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#7D6452] mt-0.5", children: d.link.title })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "w-9 h-9 rounded-full bg-white border border-[#FFEDD5] flex items-center justify-center hover:bg-[#FF7E5F]/10 hover:border-[#FF7E5F]/40 transition", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-[#5D4538]" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
      q.isError && /* @__PURE__ */ jsxs("p", { className: "text-rose-600 text-sm", children: [
        "Couldn't load: ",
        q.error.message
      ] }),
      !d && !q.isError && /* @__PURE__ */ jsx("p", { className: "text-[#7D6452] text-sm", children: "Loading data…" }),
      d && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsx(KPIBox, { label: "Clicks 24h", value: d.kpis24h.total.toLocaleString() }),
          /* @__PURE__ */ jsx(KPIBox, { label: "Humans", value: d.kpis24h.humans.toLocaleString(), accent: "emerald" }),
          /* @__PURE__ */ jsx(KPIBox, { label: "Bots blocked", value: d.kpis24h.bots.toLocaleString(), accent: "amber" }),
          /* @__PURE__ */ jsx(KPIBox, { label: "Human rate", value: `${d.kpis24h.humanRate}%`, accent: "orange" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-white/85 border border-[#FFEDD5]", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest text-[#7D6452] font-bold mb-3", children: "24h Click Velocity (humans, hourly)" }),
          /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 1000 100", preserveAspectRatio: "none", className: "w-full h-24", children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "dGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FF7E5F", stopOpacity: "0.55" }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#FF7E5F", stopOpacity: "0" })
            ] }) }),
            /* @__PURE__ */ jsx("path", { d: `${path} L 1000,100 L 0,100 Z`, fill: "url(#dGrad)" }),
            /* @__PURE__ */ jsx("path", { d: path, fill: "none", stroke: "#FF7E5F", strokeWidth: "2.5", strokeLinecap: "round" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-1 text-[9px] text-[#8B7563] font-mono", children: [
            /* @__PURE__ */ jsx("span", { children: "-24h" }),
            /* @__PURE__ */ jsx("span", { children: "-18h" }),
            /* @__PURE__ */ jsx("span", { children: "-12h" }),
            /* @__PURE__ */ jsx("span", { children: "-6h" }),
            /* @__PURE__ */ jsx("span", { children: "now" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-white/85 border border-[#FFEDD5]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest text-[#7D6452] font-bold mb-3", children: "Top Countries (24h)" }),
            d.countries.length === 0 ? /* @__PURE__ */ jsx(Empty, { label: "No data" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: d.countries.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Flag, { code: c.code }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-[#3D2818] truncate flex-1", children: c.name }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-[#2D1B0D] font-bold", children: c.count }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-[#FF7E5F] w-12 text-right", children: [
                c.pct,
                "%"
              ] })
            ] }, c.code)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-white/85 border border-[#FFEDD5]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-widest text-[#7D6452] font-bold mb-3", children: "Top Browsers (24h)" }),
            d.browsers.length === 0 ? /* @__PURE__ */ jsx(Empty, { label: "No data" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: d.browsers.map((b) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx(BrowserIcon, { slug: b.slug, color: b.color, title: b.name, large: true }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-[#3D2818] flex-1", children: b.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono text-[#7D6452]", children: [
                  b.count,
                  " · ",
                  b.pct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-[#FFEDD5] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full", style: {
                width: `${Math.max(b.pct, 2)}%`,
                background: `linear-gradient(90deg, #${b.color}, #${b.color}aa)`
              } }) })
            ] }, b.name)) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function KPIBox({
  label,
  value,
  accent
}) {
  const color = accent === "emerald" ? "text-emerald-600" : accent === "amber" ? "text-amber-600" : accent === "orange" ? "text-[#FF7E5F]" : "text-[#2D1B0D]";
  return /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-white/85 border border-[#FFEDD5]", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-[#7D6452] font-bold mb-1", children: label }),
    /* @__PURE__ */ jsx("p", { className: `text-2xl font-bold font-mono ${color}`, children: value })
  ] });
}
function SundayResetBanner() {
  const [countdown, setCountdown] = useState(getNextSundayCountdown());
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setCountdown(getNextSundayCountdown()), 6e4);
    return () => clearInterval(t);
  }, [dismissed]);
  if (dismissed) return null;
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-amber-300/60 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 lg:p-7 shadow-[0_10px_40px_rgba(251,146,60,0.18)]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 w-72 h-72 bg-amber-300/30 blur-[100px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 w-64 h-64 bg-rose-300/25 blur-[90px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col lg:flex-row lg:items-center gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-amber-400/40 blur-xl rounded-2xl animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/40", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-7 h-7 text-white", strokeWidth: 2.5 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1.5", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold tracking-[0.15em] uppercase shadow-md", children: [
              /* @__PURE__ */ jsx(Zap, { className: "w-3 h-3", fill: "currentColor" }),
              " Premium Notice"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 border border-amber-200 text-[10px] font-bold text-amber-700 tracking-wider uppercase", children: "Weekly Maintenance" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg lg:text-xl font-bold text-[#2D1B0D] tracking-tight", style: display, children: "Every Sunday 00:00 UTC — raw click data resets" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#5D4538] mt-1.5 leading-relaxed", children: [
            "To keep your dashboard ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#2D1B0D]", children: "blazing fast" }),
            " at billions of clicks scale, detailed per-click logs older than 7 days are automatically purged.",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-700", children: "Your totals, bot stats, country breakdown & daily charts are kept forever ✓" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 lg:border-l lg:border-amber-300/50 lg:pl-5 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-amber-700 font-bold mb-1", children: "Next reset in" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold font-mono text-[#2D1B0D] tabular-nums", children: countdown })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDismissed(true), className: "w-8 h-8 rounded-full bg-white/60 hover:bg-white/90 border border-amber-200 flex items-center justify-center text-amber-700 transition", "aria-label": "Dismiss", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] })
    ] })
  ] });
}
function getNextSundayCountdown() {
  const now = /* @__PURE__ */ new Date();
  const next = new Date(now);
  const daysUntilSun = (7 - now.getUTCDay()) % 7 || 7;
  next.setUTCDate(now.getUTCDate() + daysUntilSun);
  next.setUTCHours(0, 0, 0, 0);
  const ms = next.getTime() - now.getTime();
  const d = Math.floor(ms / 864e5);
  const h = Math.floor(ms % 864e5 / 36e5);
  const m = Math.floor(ms % 36e5 / 6e4);
  return `${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m`;
}
export {
  AnalyticsPage as component
};
