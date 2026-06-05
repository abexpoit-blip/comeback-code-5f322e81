import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { Sparkles, Bitcoin, Zap, ShieldCheck, Infinity, Bot, BarChart3, Globe2, Gauge, Layers, Cpu, Lock, Headphones, TrendingUp, Crown, Link2, MousePointerClick, Star, Rocket, Check, Wallet } from "lucide-react";
import { s as supabase } from "./client-B6X92QMo.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import { toast } from "sonner";
import "react";
import "@tanstack/react-router";
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
const createInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  package_slug: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/)
}).parse(d)).handler(createSsrRpc("610029ca7d9b6bceabdd6889b6f13177b782af71484aa1cb6ff2caf36df0895e"));
const getMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6b55f242e5fa3501a76b0b01777d42d75f2340733740a9ab869f7911326c4616"));
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
const PLAN_META = {
  free: {
    icon: Rocket,
    tagline: "Get started",
    blurb: "Perfect for testing the platform & personal links.",
    ctaLabel: "Current plan",
    features: [{
      icon: Link2,
      text: "1 smart link"
    }, {
      icon: MousePointerClick,
      text: "10,000 clicks / month"
    }, {
      icon: Zap,
      text: "Edge-fast redirects (~30 ms)"
    }, {
      icon: ShieldCheck,
      text: "Bot Shield ML filter"
    }, {
      icon: BarChart3,
      text: "Real-time click analytics"
    }, {
      icon: Globe2,
      text: "Geo + device intel"
    }],
    overflowNote: "After 10,000 clicks → traffic auto-routes to our Adsterra Direct link."
  },
  monthly: {
    icon: Sparkles,
    tagline: "For active campaigns",
    blurb: "The sweet spot for growing affiliates & marketers.",
    badge: "MOST POPULAR",
    badgeIcon: Star,
    highlight: true,
    ctaLabel: "Pay with crypto",
    features: [{
      icon: Link2,
      text: "50 smart links"
    }, {
      icon: MousePointerClick,
      text: "1,000,000 clicks / month"
    }, {
      icon: Zap,
      text: "Edge-fast redirects (~30 ms)"
    }, {
      icon: ShieldCheck,
      text: "Advanced Bot Shield ML"
    }, {
      icon: Bot,
      text: "Bot traffic auto-filtering"
    }, {
      icon: BarChart3,
      text: "Real-time analytics + history"
    }, {
      icon: Globe2,
      text: "Geo + device + ISP routing"
    }, {
      icon: Gauge,
      text: "Priority redirect lane"
    }, {
      icon: Layers,
      text: "Custom pre-landers"
    }, {
      icon: Cpu,
      text: "Smart traffic rotation engine"
    }],
    overflowNote: "After 1,000,000 clicks → overflow routes to our Adsterra Direct link."
  },
  lifetime: {
    icon: Crown,
    tagline: "Pay once. Use forever.",
    blurb: "Maximum scale — built for serious operators.",
    badge: "BEST VALUE",
    badgeIcon: Crown,
    ctaLabel: "Unlock lifetime",
    features: [{
      icon: Infinity,
      text: "Unlimited smart links"
    }, {
      icon: Infinity,
      text: "Unlimited monthly clicks"
    }, {
      icon: Zap,
      text: "Edge-fast redirects (~30 ms)"
    }, {
      icon: ShieldCheck,
      text: "Elite Bot Shield ML"
    }, {
      icon: Bot,
      text: "AI bot/scraper auto-filter"
    }, {
      icon: BarChart3,
      text: "Real-time analytics + full history"
    }, {
      icon: Globe2,
      text: "Geo + device + ISP + carrier routing"
    }, {
      icon: Gauge,
      text: "Highest priority redirect lane"
    }, {
      icon: Layers,
      text: "Unlimited custom pre-landers"
    }, {
      icon: Cpu,
      text: "Smart traffic rotation engine"
    }, {
      icon: Lock,
      text: "Cloaking + safe-page system"
    }, {
      icon: Headphones,
      text: "Priority 24/7 support"
    }, {
      icon: TrendingUp,
      text: "Early access to new features"
    }],
    overflowNote: "No overflow — you have unlimited clicks, forever."
  }
};
const SYSTEM_FEATURES = [{
  icon: ShieldCheck,
  title: "Bot Shield ML",
  desc: "Machine-learning engine that filters scrapers, crawlers & fake clicks in real time."
}, {
  icon: Zap,
  title: "Edge Redirects",
  desc: "30 ms global redirects deployed to 280+ edge locations worldwide."
}, {
  icon: Cpu,
  title: "Smart Rotation",
  desc: "Auto-rotate traffic between offers based on quota, geo & device fingerprint."
}, {
  icon: Globe2,
  title: "Geo Intelligence",
  desc: "Country, region, device, ISP & carrier-aware routing on every click."
}, {
  icon: BarChart3,
  title: "Live Analytics",
  desc: "Real-time click stream with bot vs human breakdown and 7-day retention."
}, {
  icon: Lock,
  title: "Safe-Page Cloaking",
  desc: "Show clean pages to bots & reviewers, money pages to real humans."
}];
function UpgradePage() {
  const buy = useServerFn(createInvoice);
  const orders = useServerFn(getMyOrders);
  const {
    data: packages
  } = useQuery({
    queryKey: ["packages-up"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("packages").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: myProfile
  } = useQuery({
    queryKey: ["my-profile-plan"],
    queryFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) return null;
      const {
        data,
        error
      } = await supabase.from("profiles").select("plan_slug").eq("id", u.user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const rawPlan = (myProfile?.plan_slug || "free").toLowerCase();
  const currentPlan = rawPlan === "pro_monthly" ? "monthly" : rawPlan === "unlimited" ? "lifetime" : rawPlan;
  const {
    data: ordersList
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orders()
  });
  const buyMut = useMutation({
    mutationFn: (slug) => buy({
      data: {
        package_slug: slug
      }
    }),
    onSuccess: (r) => {
      window.location.href = r.invoice_url;
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-[#FFF9F5] text-[#4A3728] overflow-hidden", style: font, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-[-20%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/15 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#FEB47B]/20 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-[40%] left-[35%] w-[35%] h-[35%] bg-[#FFEDD5]/40 blur-[140px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 space-y-20", children: [
      /* @__PURE__ */ jsxs("header", { className: "text-center max-w-3xl mx-auto space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
          " Premium plans · Crypto checkout"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2D1B0D] leading-[1.05]", children: [
          "Scale your traffic",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]", children: "at the edge of every click." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[#7A5C45] text-lg max-w-xl mx-auto", children: "Edge redirects, ML bot shield, geo routing & smart rotation — built for serious operators running real volume." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#7A5C45]", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Bitcoin, { className: "w-3.5 h-3.5 text-[#FF7E5F]" }),
            " BTC · USDT · LTC"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-[#FF7E5F]" }),
            " Instant activation"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-[#FF7E5F]" }),
            " No card required"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "grid gap-6 lg:grid-cols-3", children: packages?.map((p, idx) => {
        const slugKey = (p.slug || "").toLowerCase();
        const nameKey = (p.name || "").toLowerCase();
        const metaBySlug = PLAN_META[slugKey];
        const metaByName = nameKey.includes("life") ? PLAN_META.lifetime : nameKey.includes("month") || nameKey.includes("pro") ? PLAN_META.monthly : nameKey.includes("free") ? PLAN_META.free : void 0;
        const metaByOrder = [PLAN_META.free, PLAN_META.monthly, PLAN_META.lifetime][idx];
        const meta = metaBySlug ?? metaByName ?? metaByOrder ?? PLAN_META.free;
        const Icon = meta.icon;
        const BadgeIcon = meta.badgeIcon;
        const price = Number(p.price_usd ?? 0) || 0;
        const isFree = price === 0;
        const cardSlug = slugKey || (nameKey.includes("life") ? "lifetime" : nameKey.includes("month") || nameKey.includes("pro") ? "monthly" : "free");
        const isCurrent = cardSlug === currentPlan;
        const highlight = meta.highlight;
        const clickQuota = p.click_quota == null ? null : Number(p.click_quota);
        const linkLimit = p.link_limit == null ? null : Number(p.link_limit);
        const formatClicks = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1)}K` : n.toLocaleString();
        return /* @__PURE__ */ jsxs("div", { className: `relative rounded-3xl p-7 sm:p-8 backdrop-blur-xl transition-all hover:-translate-y-1 ${highlight ? "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white border border-white/30 shadow-[0_30px_80px_-20px_rgba(255,126,95,0.55)] lg:scale-[1.04] lg:my-[-8px]" : "bg-white/70 border border-white/80 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.3)]"} ${isCurrent ? "ring-2 ring-[#22C55E] ring-offset-2 ring-offset-[#FFF9F5]" : ""}`, children: [
          isCurrent && /* @__PURE__ */ jsxs("div", { className: "absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow-md bg-[#22C55E] text-white", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
            " Current plan"
          ] }),
          meta.badge && !isCurrent && /* @__PURE__ */ jsxs("div", { className: `absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow-md ${highlight ? "bg-white text-[#FF7E5F]" : "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white"}`, children: [
            BadgeIcon && /* @__PURE__ */ jsx(BadgeIcon, { className: "w-3 h-3" }),
            meta.badge
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `w-11 h-11 rounded-2xl flex items-center justify-center ${highlight ? "bg-white/20 backdrop-blur" : "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]"}`, children: /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${highlight ? "text-white" : "text-white"}` }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: `text-[10px] font-bold uppercase tracking-widest ${highlight ? "text-white/80" : "text-[#7A5C45]"}`, children: meta.tagline }),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-extrabold ${highlight ? "text-white" : "text-[#2D1B0D]"}`, children: p.name })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `mt-3 text-sm ${highlight ? "text-white/85" : "text-[#7A5C45]"}`, children: meta.blurb }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: `text-6xl font-extrabold tracking-tight ${highlight ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B]"}`, children: [
              "$",
              price.toFixed(price % 1 === 0 ? 0 : 2)
            ] }),
            /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${highlight ? "text-white/80" : "text-[#7A5C45]"}`, children: slugKey === "lifetime" || nameKey.includes("life") ? "/ lifetime" : slugKey === "monthly" || nameKey.includes("month") ? "/ month" : isFree ? "/ forever" : "" })
          ] }),
          !isFree && price > 0 && /* @__PURE__ */ jsxs("p", { className: `mt-1 text-[11px] font-medium ${highlight ? "text-white/70" : "text-[#A8907A]"}`, children: [
            "+ 2% network fee → pay ",
            /* @__PURE__ */ jsxs("strong", { children: [
              "$",
              (price * 1.02).toFixed(2)
            ] }),
            " in crypto · invoice expires in 30 min"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `mt-6 grid grid-cols-2 gap-3 rounded-2xl p-4 ${highlight ? "bg-white/15 backdrop-blur" : "bg-[#FFEDD5]/60"}`, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: `text-[10px] font-bold uppercase tracking-widest ${highlight ? "text-white/70" : "text-[#7A5C45]"}`, children: "Smart links" }),
              /* @__PURE__ */ jsx("div", { className: `mt-1 text-xl font-extrabold flex items-center gap-1 ${highlight ? "text-white" : "text-[#2D1B0D]"}`, children: linkLimit === null ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Infinity, { className: "w-5 h-5" }),
                " Unlimited"
              ] }) : linkLimit.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: `text-[10px] font-bold uppercase tracking-widest ${highlight ? "text-white/70" : "text-[#7A5C45]"}`, children: "Clicks / month" }),
              /* @__PURE__ */ jsx("div", { className: `mt-1 text-xl font-extrabold flex items-center gap-1 ${highlight ? "text-white" : "text-[#2D1B0D]"}`, children: clickQuota === null ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Infinity, { className: "w-5 h-5" }),
                " Unlimited"
              ] }) : formatClicks(clickQuota) }),
              clickQuota !== null && clickQuota >= 1e3 && /* @__PURE__ */ jsxs("div", { className: `text-[10px] mt-0.5 ${highlight ? "text-white/70" : "text-[#A8907A]"}`, children: [
                "(",
                clickQuota.toLocaleString(),
                " clicks)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-2.5", children: meta.features.map((f, i) => {
            const FIcon = f.icon;
            return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: `mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${highlight ? "bg-white/20" : "bg-[#FFEDD5]"}`, children: /* @__PURE__ */ jsx(FIcon, { className: `w-3 h-3 ${highlight ? "text-white" : "text-[#FF7E5F]"}` }) }),
              /* @__PURE__ */ jsx("span", { className: highlight ? "text-white/95" : "text-[#4A3728]", children: f.text })
            ] }, i);
          }) }),
          /* @__PURE__ */ jsx("button", { disabled: isFree || isCurrent || buyMut.isPending, onClick: () => buyMut.mutate(p.slug), className: `mt-7 w-full rounded-2xl py-3.5 text-sm font-bold transition-all ${isCurrent ? "bg-[#22C55E] text-white cursor-not-allowed" : isFree ? highlight ? "bg-white/20 text-white/70 cursor-not-allowed" : "bg-[#FFEDD5] text-[#A8907A] cursor-not-allowed" : highlight ? "bg-white text-[#FF7E5F] hover:bg-white/95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]" : "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white hover:opacity-95 shadow-[0_10px_30px_-10px_rgba(255,126,95,0.5)]"}`, children: isCurrent ? "✓ Your current plan" : buyMut.isPending && buyMut.variables === p.slug ? "Creating invoice…" : meta.ctaLabel })
        ] }, p.id);
      }) }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm", children: [
            /* @__PURE__ */ jsx(Cpu, { className: "w-3 h-3" }),
            " What you get on every plan"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2D1B0D]", children: "Every system. Every plan." }),
          /* @__PURE__ */ jsx("p", { className: "text-[#7A5C45]", children: "The infrastructure runs the same for everyone — paid plans just unlock more capacity." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: SYSTEM_FEATURES.map((f) => {
          const Icon = f.icon;
          return /* @__PURE__ */ jsxs("div", { className: "group relative rounded-2xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 shadow-[0_10px_40px_-20px_rgba(255,126,95,0.25)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(255,126,95,0.4)] transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]", children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-white" }) }),
            /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-bold text-[#2D1B0D]", children: f.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-[#7A5C45] leading-relaxed", children: f.desc })
          ] }, f.title);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B0D] via-[#4A2818] to-[#2D1B0D] text-white p-8 sm:p-12 shadow-[0_30px_80px_-20px_rgba(45,27,13,0.5)]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-[-30%] right-[-10%] w-[60%] h-[120%] bg-[#FF7E5F]/30 blur-[120px] rounded-full pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-30%] left-[-10%] w-[40%] h-[100%] bg-[#FEB47B]/20 blur-[100px] rounded-full pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative grid md:grid-cols-[1fr_auto] gap-6 items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#FEB47B] text-[10px] font-bold uppercase tracking-widest", children: [
              /* @__PURE__ */ jsx(Crown, { className: "w-3 h-3" }),
              " Smart Pick"
            ] }),
            /* @__PURE__ */ jsxs("h3", { className: "mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight", children: [
              "Lifetime pays for itself in ",
              /* @__PURE__ */ jsx("span", { className: "text-[#FEB47B]", children: "10 months" }),
              "."
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-white/70 max-w-xl", children: "Unlimited links, unlimited clicks, priority support & every future feature — for one flat payment." })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => buyMut.mutate("lifetime"), disabled: buyMut.isPending, className: "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white px-7 py-4 font-bold shadow-[0_15px_40px_-10px_rgba(255,126,95,0.6)] hover:opacity-95", children: [
            /* @__PURE__ */ jsx(Crown, { className: "w-4 h-4" }),
            " Get Lifetime"
          ] })
        ] })
      ] }),
      ordersList && ordersList.length > 0 && /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.3)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]", children: /* @__PURE__ */ jsx(Wallet, { className: "w-4 h-4 text-white" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold text-[#2D1B0D] tracking-tight", children: "Order history" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
            /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children: "Package" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children: "Amount" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children: "Invoice" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: ordersList.map((o) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60", children: [
            /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-[#7A5C45]", children: new Date(o.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsx("span", { className: "inline-flex px-2 py-0.5 rounded-md bg-[#FFEDD5] text-[#FF7E5F] text-xs font-semibold", children: o.package_slug }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 font-semibold", children: [
              "$",
              Number(o.amount).toFixed(2)
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${o.status === "completed" || o.status === "paid" ? "bg-emerald-100 text-emerald-700" : o.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`, children: [
              (o.status === "completed" || o.status === "paid") && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }),
              o.status
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: o.plisio_invoice_url && o.status === "pending" ? /* @__PURE__ */ jsx("a", { href: o.plisio_invoice_url, target: "_blank", rel: "noreferrer", className: "text-[#FF7E5F] font-semibold hover:underline", children: "Open" }) : /* @__PURE__ */ jsx("span", { className: "text-[#A8907A]", children: "—" }) })
          ] }, o.id)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  UpgradePage as component
};
