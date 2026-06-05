import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { B as BrandLogo } from "./brand-logo-D3iIBbhr.js";
const FEATURES = [{
  title: "Branded Short Links",
  desc: "Turn long URLs into clean, memorable links you actually want to share."
}, {
  title: "Edge-Fast Redirects",
  desc: "Global edge network delivers every click in under 30ms — zero loss, zero lag."
}, {
  title: "Geo Routing",
  desc: "Send visitors to different destinations based on country. Match offers automatically."
}, {
  title: "Device Targeting",
  desc: "Route mobile, desktop, or tablet traffic separately. One link, infinite paths."
}, {
  title: "Real-Time Analytics",
  desc: "Live click counts, country breakdown, device split, referrer data. Pure numbers."
}, {
  title: "Link Health Score",
  desc: "0–100 score per link. Spot underperforming campaigns before they cost you."
}];
const PLANS = [{
  name: "Free",
  price: "$0",
  period: "forever",
  features: ["10,000 clicks / month", "1 active link", "Real-time analytics"],
  cta: "Start free"
}, {
  name: "Monthly Pro",
  price: "$5",
  period: "per month",
  features: ["1,000,000 clicks / month", "50 active links", "Geo + device routing", "Link health score"],
  cta: "Go Pro",
  highlight: true
}, {
  name: "Lifetime Unlimited",
  price: "$50",
  period: "one-time",
  features: ["Unlimited clicks", "Unlimited links", "Lifetime access", "Priority support"],
  cta: "Get lifetime"
}];
function HomePage() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#FFF9F5] text-[#4A3728] relative overflow-hidden", style: {
    fontFamily: "'Outfit', system-ui, sans-serif"
  }, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7E5F]/15 blur-[120px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-[#FEB47B]/20 blur-[100px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#FFEDD5]/40 blur-[80px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("nav", { className: "sticky top-6 z-50 max-w-5xl mx-auto px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/40 backdrop-blur-2xl border border-white/40 rounded-full px-6 sm:px-8 py-3 flex items-center justify-between shadow-xl shadow-orange-900/5", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Sleepox home", children: /* @__PURE__ */ jsx(BrandLogo, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-8 font-medium text-[#7D6452] text-sm", children: [
        /* @__PURE__ */ jsx("a", { href: "#features", className: "hover:text-[#FF7E5F] transition-colors", children: "Features" }),
        /* @__PURE__ */ jsx("a", { href: "#pricing", className: "hover:text-[#FF7E5F] transition-colors", children: "Pricing" }),
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "hover:text-[#FF7E5F] transition-colors", children: "Sign in" })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/signup", className: "bg-[#2D1B0D] text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#FF7E5F] transition-all", children: "Get Started" })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative max-w-7xl mx-auto px-6 pt-20 pb-20 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-10 bg-white/60 backdrop-blur-md border border-white/60 shadow-sm", children: [
        /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
          /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7E5F] opacity-75" }),
          /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-[#FF7E5F]" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[#FF7E5F] uppercase tracking-wider", children: "v2.0 Analytics Live" })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#2D1B0D] mb-8 tracking-tight leading-[1.05]", children: [
        "Shorten the link,",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]", style: {
          backgroundSize: "200% auto"
        }, children: "expand the reach." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-[#7D6452] max-w-2xl mx-auto mb-12 leading-relaxed", children: "The next-generation URL management platform. Branded short links, geo + device routing, and deep audience insights — under 30ms, anywhere on Earth." }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto relative group mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col sm:flex-row p-2 bg-white rounded-2xl shadow-xl shadow-orange-900/5 gap-2", children: [
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Paste your long URL here...", className: "flex-1 px-5 py-4 outline-none text-base sm:text-lg text-[#2D1B0D] placeholder-[#A38D7D] bg-transparent" }),
          /* @__PURE__ */ jsx(Link, { to: "/signup", className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white px-7 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform whitespace-nowrap text-center", children: "Create Link" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-6 text-sm font-medium text-[#A38D7D]", children: [
        /* @__PURE__ */ jsx("span", { children: "✓ No credit card" }),
        /* @__PURE__ */ jsx("span", { children: "✓ 10K clicks free" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "relative max-w-4xl mx-auto px-6 mb-24", children: /* @__PURE__ */ jsx("div", { className: "rounded-[2rem] shadow-xl bg-[#2D1B0D]/5 backdrop-blur-xl border border-white/40 py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [{
      v: "30ms",
      l: "Edge Redirect"
    }, {
      v: "99.9%",
      l: "Uptime SLA"
    }, {
      v: "5M+",
      l: "Clicks / day"
    }, {
      v: "Instant",
      l: "Activation"
    }].map((s) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-[#2D1B0D]", children: s.v }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-[#FF7E5F] font-bold mt-1", children: s.l })
    ] }, s.l)) }) }),
    /* @__PURE__ */ jsxs("section", { id: "features", className: "relative max-w-7xl mx-auto px-6 py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-extrabold text-[#2D1B0D] mb-4 tracking-tight", children: "Everything your links need." }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-[#7D6452]", children: "A complete toolkit for short links, routing rules, and analytics." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: FEATURES.map((f, i) => /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-[2rem] shadow-xl shadow-orange-900/5 hover:-translate-y-2 transition-transform duration-500 group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/50 backdrop-blur-2xl border border-white/60 p-8 h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20 text-white font-bold group-hover:scale-110 transition-transform", children: String(i + 1).padStart(2, "0") }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#2D1B0D] mb-2", children: f.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7D6452] leading-relaxed", children: f.desc })
      ] }) }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "pricing", className: "relative max-w-7xl mx-auto px-6 py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-extrabold text-[#2D1B0D] mb-4 tracking-tight", children: "Simple pricing." }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-[#7D6452]", children: "Pay with crypto via Plisio. Upgrade or stay free forever." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 lg:grid-cols-3 items-stretch", children: PLANS.map((p) => /* @__PURE__ */ jsxs("div", { className: p.highlight ? "relative bg-white p-10 rounded-[2.5rem] border-4 border-[#FF7E5F] shadow-2xl shadow-orange-900/10 flex flex-col lg:scale-105" : "relative bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/60 shadow-lg shadow-orange-900/5 flex flex-col", children: [
        p.highlight && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF7E5F] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg", children: "Recommended" }),
        /* @__PURE__ */ jsx("h3", { className: `text-sm font-bold uppercase tracking-widest mb-2 ${p.highlight ? "text-[#FF7E5F]" : "text-[#7D6452]"}`, children: p.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xl font-extrabold text-[#2D1B0D]", children: p.price }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#A38D7D]", children: [
            "/ ",
            p.period
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-10 flex-1", children: p.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-[#4A3728]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#FF7E5F] font-bold", children: "✓" }),
          " ",
          f
        ] }, f)) }),
        /* @__PURE__ */ jsx(Link, { to: "/signup", className: p.highlight ? "w-full py-4 rounded-2xl bg-[#FF7E5F] text-white font-bold text-center shadow-lg shadow-orange-500/30 hover:bg-[#E66D50] transition-colors" : "w-full py-4 rounded-2xl border-2 border-[#FFEDD5] text-[#2D1B0D] font-bold text-center hover:bg-[#FFF9F5] transition-colors", children: p.cta })
      ] }, p.name)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "relative max-w-5xl mx-auto px-6 pb-24", children: /* @__PURE__ */ jsxs("div", { className: "relative bg-[#2D1B0D] rounded-[3rem] p-12 sm:p-16 overflow-hidden shadow-2xl shadow-orange-900/20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF7E5F]/40 to-transparent blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-extrabold text-white mb-6", children: "Ready to ship smarter links?" }),
        /* @__PURE__ */ jsx("p", { className: "text-orange-100/60 text-lg mb-10 max-w-xl", children: "Free plan, no credit card. Be live in under a minute." }),
        /* @__PURE__ */ jsx(Link, { to: "/signup", className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform", children: "Create free account" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "relative max-w-7xl mx-auto px-6 py-12 text-center text-[#A38D7D] text-xs font-medium tracking-widest uppercase", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Sleepox · Smart links & analytics"
    ] })
  ] });
}
export {
  HomePage as component
};
