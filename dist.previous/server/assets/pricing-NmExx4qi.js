import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-B6X92QMo.js";
import "@supabase/supabase-js";
const SIZE = {
  sm: { text: "text-sm", dot: "w-5 h-5", mark: "w-2 h-2", pad: "px-2.5 py-1" },
  md: { text: "text-lg", dot: "w-7 h-7", mark: "w-2.5 h-2.5", pad: "px-3 py-1.5" },
  lg: { text: "text-2xl", dot: "w-9 h-9", mark: "w-3 h-3", pad: "px-4 py-2" },
  xl: { text: "text-4xl sm:text-5xl", dot: "w-12 h-12", mark: "w-4 h-4", pad: "px-5 py-2.5" }
};
function Wordmark({ className = "", size = "md", chip = false }) {
  const s = SIZE[size];
  const inner = /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-2.5 font-extrabold tracking-[0.14em] uppercase ${s.text} ${className}`, children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": true,
        className: `relative ${s.dot} rounded-[0.6em] p-[1.5px] bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#6366F1] shadow-[0_0_18px_-2px_rgba(56,189,248,0.55)]`,
        children: /* @__PURE__ */ jsxs("span", { className: "block w-full h-full rounded-[0.5em] bg-[#050B1F]/85 backdrop-blur-md border border-white/10 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" }),
          /* @__PURE__ */ jsx("span", { className: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${s.mark} rounded-full bg-gradient-to-br from-[#7DD3FC] to-[#6366F1] shadow-[0_0_8px_rgba(56,189,248,0.9)]` })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-baseline", children: [
      /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#6366F1] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(56,189,248,0.35)]", children: "sleep" }),
      /* @__PURE__ */ jsx("span", { className: "text-white/95", children: "ox" })
    ] })
  ] });
  if (!chip) return inner;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_-12px_rgba(56,189,248,0.4)] ${s.pad}`,
      children: inner
    }
  );
}
const PLAN_META = {
  free: {
    blurb: "Best for testing the platform and personal links.",
    features: ["Edge-fast redirects (30ms)", "Real-time analytics", "Traffic quality filter", "Email support"]
  },
  monthly: {
    blurb: "Recommended for growing campaigns and active marketers.",
    features: ["Everything in Free", "Geo + device routing", "Priority redirect lane", "Link health score", "1,000,000 clicks / month"],
    highlight: true,
    badge: "⭐ RECOMMENDED"
  },
  lifetime: {
    blurb: "Best long-term value. Pay once, use forever.",
    features: ["Everything in Pro", "Unlimited clicks", "Unlimited links", "No recurring fees", "Priority support", "Early access to new features"],
    badge: "💎 BEST VALUE"
  }
};
function PricingPage() {
  const {
    data: packages,
    isLoading
  } = useQuery({
    queryKey: ["packages-public"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("packages").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-mesh text-foreground", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border/30 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Sleepox home", children: /* @__PURE__ */ jsx(Wordmark, { size: "md" }) }),
      /* @__PURE__ */ jsxs("nav", { className: "flex gap-4 text-sm", children: [
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "hover:underline", children: "Login" }),
        /* @__PURE__ */ jsx(Link, { to: "/signup", className: "rounded-md bg-sky-gradient px-3 py-1.5 text-primary-foreground hover:opacity-90", children: "Sign up" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-6 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold sm:text-5xl", children: "Pick the plan that fits." }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: "Pay with crypto. Upgrade, downgrade, or cancel anytime." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 grid gap-6 lg:grid-cols-3", children: [
        isLoading && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }),
        packages?.map((p) => {
          const meta = PLAN_META[p.slug] ?? {
            blurb: "",
            features: []
          };
          return /* @__PURE__ */ jsxs("div", { className: `relative rounded-2xl p-8 ${meta.highlight ? "glass-panel sky-glow border border-sky scale-[1.02]" : "glass-card"}`, children: [
            meta.badge && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-gradient px-3 py-1 text-xs font-bold text-primary-foreground whitespace-nowrap", children: meta.badge }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: p.name }),
            meta.blurb && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: meta.blurb }),
            /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-5xl font-bold text-gradient-sky", children: [
                "$",
                Number(p.price_usd).toFixed(0)
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: p.slug === "lifetime" ? "/ lifetime" : p.slug === "monthly" ? "/ month" : "/ forever" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-1 text-sm", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: p.click_quota ? `${p.click_quota.toLocaleString()} clicks / mo` : "Unlimited clicks" }),
              /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: p.link_limit === null ? "Unlimited links" : `${p.link_limit} link${p.link_limit > 1 ? "s" : ""}` })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-2 text-sm", children: meta.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-success", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: f })
            ] }, f)) }),
            /* @__PURE__ */ jsxs(Link, { to: "/signup", className: `mt-8 block rounded-xl py-3 text-center text-sm font-semibold ${meta.highlight ? "bg-sky-gradient text-primary-foreground sky-glow" : "border border-sky hover:bg-secondary"}`, children: [
              "Get ",
              p.name
            ] })
          ] }, p.id);
        })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-10 text-center text-sm text-muted-foreground", children: [
        "💡 Smart pick: ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "Lifetime Unlimited" }),
        " pays for itself in 10 months vs Monthly Pro."
      ] })
    ] })
  ] });
}
export {
  PricingPage as component
};
