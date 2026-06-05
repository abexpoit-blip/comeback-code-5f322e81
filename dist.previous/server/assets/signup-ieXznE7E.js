import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Send, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { s as supabase } from "./client-B6X92QMo.js";
import { B as BrandLogo } from "./brand-logo-D3iIBbhr.js";
import "@supabase/supabase-js";
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
function SignupPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const tg = telegram.trim().replace(/^@/, "");
    const {
      error
    } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName.trim(),
          telegram: tg
        }
      }
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    const {
      error: signInErr
    } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });
    setLoading(false);
    if (signInErr) {
      toast.success("Account created! Please check your email to confirm (or contact admin).");
      navigate({
        to: "/login"
      });
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
    /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center px-5 py-12 sm:px-8 z-10 order-2 lg:order-1", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:hidden mb-8 flex justify-center", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(BrandLogo, {}) }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 bg-gradient-to-tr from-[#FF7E5F]/30 via-[#FEB47B]/20 to-transparent blur-2xl rounded-[2.5rem] pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-[2rem] border border-white/80 bg-white/60 backdrop-blur-2xl p-8 sm:p-10 shadow-xl shadow-orange-900/10", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7E5F]/10 border border-[#FF7E5F]/30 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest mb-4", children: "Create account" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2D1B0D]", children: "Start free in 60s." }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#7D6452]", children: "No credit card. 10,000 free clicks every month." }),
          /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
            /* @__PURE__ */ jsx(FormField, { label: "Full name", icon: /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "text", required: true, value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Jane Doe", className: inputCls }) }),
            /* @__PURE__ */ jsx(FormField, { label: "Email", icon: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: inputCls }) }),
            /* @__PURE__ */ jsx(FormField, { label: "Telegram (optional)", icon: /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "text", value: telegram, onChange: (e) => setTelegram(e.target.value), placeholder: "@username", className: inputCls }) }),
            /* @__PURE__ */ jsx(FormField, { label: "Password", icon: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }), children: /* @__PURE__ */ jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Min 6 characters", className: inputCls, minLength: 6 }) }),
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "w-full mt-2 bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] hover:from-[#E66D50] hover:to-[#FF9F6B] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-orange-500/30 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50", children: loading ? "Creating account…" : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Create account ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-[#7D6452]", children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-bold text-[#FF7E5F] hover:text-[#E66D50]", children: "Sign in" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden lg:flex flex-col justify-between p-12 z-10 order-1 lg:order-2", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Sleepox home", children: /* @__PURE__ */ jsx(BrandLogo, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#FF7E5F] animate-pulse" }),
          " 2,418 joined this month"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-5xl xl:text-6xl font-extrabold leading-[1.05] text-[#2D1B0D] tracking-tight", children: [
          "Built for the",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]", children: "serious affiliates." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(KpiTile, { label: "Avg clicks / user", value: "184k", delta: "+22%" }),
          /* @__PURE__ */ jsx(KpiTile, { label: "Bot block rate", value: "98.2%", delta: "↑ 5-layer" }),
          /* @__PURE__ */ jsx(KpiTile, { label: "Activation", value: "< 60s", delta: "No KYC" }),
          /* @__PURE__ */ jsx(KpiTile, { label: "Lifetime price", value: "$50", delta: "One-time" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm p-5 space-y-3", children: ["Free 10K clicks / month, no credit card", "Crypto checkout via Plisio · USDT, BTC, LTC", "Geo + device routing on every plan", "Telegram support — 24h response"].map((t) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-[#4A3728]", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#FF7E5F] shrink-0" }),
          /* @__PURE__ */ jsx("span", { children: t })
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#A38D7D] tracking-widest uppercase", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Sleepox · Smart links"
      ] })
    ] })
  ] });
}
const inputCls = "w-full bg-white/70 border border-[#FFEDD5] rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF7E5F] focus:bg-white transition-all text-[#2D1B0D] placeholder:text-[#A38D7D]";
function FormField({
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
function KpiTile({
  label,
  value,
  delta
}) {
  return /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-[#A38D7D] mb-1", children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold text-[#2D1B0D]", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#FF7E5F] mt-1 font-bold uppercase tracking-wider", children: delta })
  ] });
}
export {
  SignupPage as component
};
