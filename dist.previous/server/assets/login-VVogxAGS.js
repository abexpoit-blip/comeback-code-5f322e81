import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Zap, BarChart3, Mail, Lock, ArrowRight } from "lucide-react";
import { s as supabase } from "./client-B6X92QMo.js";
import { B as BrandLogo } from "./brand-logo-D3iIBbhr.js";
import "@supabase/supabase-js";
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    router.preloadRoute({
      to: "/dashboard"
    }).catch(() => {
    });
  }, [router]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error || !data.session) {
      setLoading(false);
      toast.error(error?.message ?? "Login failed");
      return;
    }
    await router.invalidate();
    navigate({
      to: "/dashboard",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen w-full bg-[#FFF9F5] text-[#4A3728] overflow-hidden grid lg:grid-cols-2", style: font, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/20 blur-[140px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-[-15%] right-[-10%] w-[50%] h-[55%] bg-[#FEB47B]/25 blur-[140px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-[30%] left-[30%] w-[35%] h-[35%] bg-[#FFEDD5]/50 blur-[120px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden lg:flex flex-col justify-between p-12 z-10", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Sleepox home", children: /* @__PURE__ */ jsx(BrandLogo, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#FF7E5F] animate-pulse" }),
          " Live now"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-5xl xl:text-6xl font-extrabold leading-[1.05] text-[#2D1B0D] tracking-tight", children: [
          "Operate at the",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]", children: "edge of every click." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: [{
          v: "30ms",
          l: "Edge redirect"
        }, {
          v: "99.9%",
          l: "Uptime SLA"
        }, {
          v: "5M+",
          l: "Daily clicks"
        }].map((s) => /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold text-[#2D1B0D]", children: s.v }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[10px] text-[#FF7E5F] uppercase tracking-widest font-bold", children: s.l })
        ] }, s.l)) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm p-5 space-y-3", children: [{
          Icon: ShieldCheck,
          t: "5-layer bot filter on every redirect"
        }, {
          Icon: Zap,
          t: "Global edge — sub 30ms everywhere"
        }, {
          Icon: BarChart3,
          t: "Real-time analytics & geo routing"
        }].map(({
          Icon,
          t
        }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-[#4A3728]", children: [
          /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow shadow-orange-500/30", children: /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 text-white" }) }),
          /* @__PURE__ */ jsx("span", { children: t })
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#A38D7D] tracking-widest uppercase", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Sleepox · Smart links"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center px-5 py-12 sm:px-8 z-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden mb-8 flex justify-center", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(BrandLogo, {}) }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 bg-gradient-to-tr from-[#FF7E5F]/30 via-[#FEB47B]/20 to-transparent blur-2xl rounded-[2.5rem] pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-[2rem] border border-white/80 bg-white/60 backdrop-blur-2xl p-8 sm:p-10 shadow-xl shadow-orange-900/10", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7E5F]/10 border border-[#FF7E5F]/30 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest mb-4", children: "Sign in" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2D1B0D]", children: "Welcome back." }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#7D6452]", children: "Pick up where you left off. Your dashboard is live." }),
          /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-8 space-y-5", children: [
            /* @__PURE__ */ jsx(Field, { label: "Email", icon: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: inputCls }) }),
            /* @__PURE__ */ jsx(Field, { label: "Password", icon: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: inputCls }) }),
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "w-full mt-2 bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] hover:from-[#E66D50] hover:to-[#FF9F6B] text-white py-3.5 rounded-2xl font-bold text-sm tracking-tight transition-all shadow-lg shadow-orange-500/30 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50", children: loading ? "Signing in…" : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Sign in ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-7 text-center text-sm text-[#7D6452]", children: [
            "New here?",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/signup", className: "font-bold text-[#FF7E5F] hover:text-[#E66D50]", children: "Create an account" })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
const inputCls = "w-full bg-white/70 border border-[#FFEDD5] rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF7E5F] focus:bg-white transition-all text-[#2D1B0D] placeholder:text-[#A38D7D]";
function Field({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-[#A38D7D] mb-2 block", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A38D7D]", children: icon }),
      children
    ] })
  ] });
}
export {
  LoginPage as component
};
