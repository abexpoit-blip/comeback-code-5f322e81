import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState, useEffect } from "react";
import { Smartphone, Tablet, Monitor, HelpCircle, Activity, RefreshCw, Zap, User, Bot, Globe2, MapPin } from "lucide-react";
import { g as getLiveFeed } from "./analytics.functions-BFTh9uHO.js";
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
function Flag({
  code,
  small = false,
  large = false
}) {
  const lower = (code ?? "").toLowerCase();
  const size = large ? "w-9 h-6" : small ? "w-5 h-3.5" : "w-7 h-5";
  if (!code || code === "??" || code.length !== 2) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `${size} inline-flex items-center justify-center bg-white/70 rounded-[3px] text-[#7D6452] text-[8px] ring-1 ring-black/5 shrink-0`,
        "aria-label": "Unknown country",
        children: "?"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: `https://flagcdn.com/w40/${lower}.png`,
      srcSet: `https://flagcdn.com/w80/${lower}.png 2x, https://flagcdn.com/w160/${lower}.png 3x`,
      alt: code,
      className: `${size} object-cover rounded-[3px] ring-1 ring-black/10 shadow-sm shrink-0`,
      loading: "lazy"
    }
  );
}
function DeviceIcon({
  name,
  os,
  large = false
}) {
  const size = large ? "w-5 h-5" : "w-3.5 h-3.5";
  const o = (os ?? "").toLowerCase();
  if (o.includes("android"))
    return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/android/3DDC84", alt: "Android", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("ios") || o.includes("ipad") || o.includes("iphone"))
    return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/apple/000000", alt: "iOS", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("mac"))
    return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/apple/000000", alt: "macOS", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("windows"))
    return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/windows11/0078D4", alt: "Windows", className: `${size} shrink-0`, loading: "lazy" });
  if (o.includes("linux"))
    return /* @__PURE__ */ jsx("img", { src: "https://cdn.simpleicons.org/linux/000000", alt: "Linux", className: `${size} shrink-0`, loading: "lazy" });
  const n = (name ?? "").toLowerCase();
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
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `${size} inline-flex items-center justify-center bg-white/70 rounded text-[#7D6452] text-[10px] shrink-0`,
        title,
        children: "?"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: `https://cdn.simpleicons.org/${slug}/${color}`,
      alt: title,
      title,
      className: `${size} shrink-0`,
      loading: "lazy",
      onError: (e) => {
        e.currentTarget.style.display = "none";
      }
    }
  );
}
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function LiveFeedPage() {
  const feed = useServerFn(getLiveFeed);
  const [paused, setPaused] = useState(false);
  const q = useQuery({
    queryKey: ["live-feed"],
    queryFn: () => feed(),
    refetchInterval: paused ? false : 3e3,
    refetchOnWindowFocus: false
  });
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, []);
  const data = q.data;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-10 max-w-[1400px] mx-auto", style: font, children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8 flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 text-emerald-600 text-[10px] font-bold uppercase tracking-widest shadow-sm mb-3", children: [
          /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${paused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}` }),
          paused ? "Paused" : "Streaming · 3s"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl lg:text-4xl font-extrabold text-[#2D1B0D]", children: "Live Click Feed" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7D6452] mt-2 max-w-2xl", children: "Real-time stream of every click hitting your links — country, device, browser & verdict." })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setPaused((p) => !p), className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white border border-[#FFEDD5] text-[#2D1B0D] hover:bg-[#FFEDD5]/40 shadow-sm", children: paused ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }),
        " Resume"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
        " Pause"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-4 gap-3 mb-6", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Clicks / 5 min", value: data?.cps5m?.toLocaleString() ?? "0", icon: Zap, tone: "orange" }),
      /* @__PURE__ */ jsx(Stat, { label: "Humans (1h)", value: data?.humans1h?.toLocaleString() ?? "0", icon: User, tone: "green" }),
      /* @__PURE__ */ jsx(Stat, { label: "Bots (1h)", value: data?.bots1h?.toLocaleString() ?? "0", icon: Bot, tone: "rose" }),
      /* @__PURE__ */ jsx(Stat, { label: "Unique countries", value: (data?.countries?.length ?? 0).toLocaleString(), icon: Globe2, tone: "blue" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-2xl border border-[#FFEDD5] bg-white overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-3 border-b border-[#FFEDD5] flex items-center justify-between bg-gradient-to-r from-[#FFF9F5] to-white", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[#2D1B0D]", children: "Last 50 clicks" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-[#A38D7D]", children: [
            data?.events?.length ?? 0,
            " events"
          ] })
        ] }),
        q.isLoading && /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-sm text-[#A38D7D]", children: "Loading…" }),
        !q.isLoading && (data?.events?.length ?? 0) === 0 && /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-sm text-[#7D6452]", children: "No clicks yet — share a link to see them appear live." }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[#FFEDD5] max-h-[640px] overflow-y-auto", children: data?.events?.map((e) => {
          const age = Math.floor((now - new Date(e.created_at).getTime()) / 1e3);
          const ageStr = age < 60 ? `${age}s` : age < 3600 ? `${Math.floor(age / 60)}m` : `${Math.floor(age / 3600)}h`;
          return /* @__PURE__ */ jsxs("li", { className: "px-5 py-3 flex items-center gap-3 hover:bg-[#FFF9F5] transition-colors", children: [
            /* @__PURE__ */ jsx(Flag, { code: e.country, large: true }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[#2D1B0D]", children: e.countryName }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#A38D7D]", children: "·" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#7D6452] font-mono", children: [
                  "/r/",
                  e.short_code
                ] }),
                e.referrer_source && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#A38D7D]", children: "·" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-[#FFEDD5] text-[#FF7E5F] font-bold uppercase tracking-wider", children: e.referrer_source })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFF5EE] ring-1 ring-[#FFEDD5]", children: [
                  /* @__PURE__ */ jsx(DeviceIcon, { name: e.device, os: e.deviceOs }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[#7D6452]", children: e.deviceOs || e.device })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FFF5EE] ring-1 ring-[#FFEDD5]", children: [
                  /* @__PURE__ */ jsx(BrowserIcon, { slug: e.browserSlug, color: e.browserColor, title: e.browser }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[#7D6452]", children: e.browser })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${e.is_bot ? "bg-rose-100 text-rose-700 ring-1 ring-rose-200" : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"}`, children: [
                e.is_bot ? /* @__PURE__ */ jsx(Bot, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
                e.is_bot ? "BOT" : "HUMAN"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-[#A38D7D] mt-1 tabular-nums", children: [
                ageStr,
                " ago"
              ] })
            ] })
          ] }, e.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-[#2D1B0D] mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-[#FF7E5F]" }),
            " Top countries (24h)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: data?.countries?.length ? data.countries.slice(0, 10).map((c) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-[#2D1B0D] font-semibold", children: [
                /* @__PURE__ */ jsx(Flag, { code: c.code, small: true }),
                /* @__PURE__ */ jsx("span", { children: c.name })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-bold tabular-nums text-[#2D1B0D]", children: c.count })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-[#FFEDD5] overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B]", style: {
              width: `${c.pct}%`
            } }) })
          ] }, c.code)) : /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A38D7D]", children: "No data yet." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#FFEDD5] bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-[#2D1B0D] mb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Globe2, { className: "w-4 h-4 text-[#FF7E5F]" }),
            " Cohort by source (24h)"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#A38D7D] mb-3", children: "Which referrer brings the cleanest traffic?" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: data?.cohorts?.length ? data.cohorts.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-[#2D1B0D] capitalize truncate", children: c.source }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-[#A38D7D]", children: [
                c.total.toLocaleString(),
                " clicks"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxs("span", { className: `text-xs font-extrabold tabular-nums ${c.humanRate >= 80 ? "text-emerald-600" : c.humanRate >= 50 ? "text-amber-600" : "text-rose-600"}`, children: [
                c.humanRate,
                "%"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#A38D7D]", children: "human rate" })
            ] })
          ] }, c.source)) : /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A38D7D]", children: "No cohorts yet." }) })
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value,
  icon: Icon,
  tone
}) {
  const cfg = {
    orange: {
      grad: "from-[#FF7E5F] to-[#FEB47B]",
      ring: "ring-[#FFEDD5]",
      glow: "shadow-[0_8px_24px_-8px_rgba(255,126,95,0.55)]"
    },
    green: {
      grad: "from-emerald-500 to-emerald-300",
      ring: "ring-emerald-100",
      glow: "shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)]"
    },
    rose: {
      grad: "from-rose-500 to-rose-300",
      ring: "ring-rose-100",
      glow: "shadow-[0_8px_24px_-8px_rgba(244,63,94,0.55)]"
    },
    blue: {
      grad: "from-sky-500 to-sky-300",
      ring: "ring-sky-100",
      glow: "shadow-[0_8px_24px_-8px_rgba(14,165,233,0.55)]"
    }
  }[tone];
  return /* @__PURE__ */ jsxs("div", { className: `relative rounded-2xl border border-[#FFEDD5] bg-white p-4 flex items-center gap-3 ring-1 ${cfg.ring} shadow-sm hover:shadow-md transition-shadow`, children: [
    /* @__PURE__ */ jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${cfg.grad} ${cfg.glow}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-white drop-shadow-sm" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[#A38D7D]", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-extrabold text-[#2D1B0D] tabular-nums", children: value })
    ] })
  ] });
}
export {
  LiveFeedPage as component
};
