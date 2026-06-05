import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, useRouterState, Link, Outlet } from "@tanstack/react-router";
import { u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import { useState, useEffect, useRef } from "react";
import { ShieldAlert, Loader2, LogOut, X, LayoutDashboard, BarChart3, Activity, Globe, Crown, ShieldCheck, Shield, Menu } from "lucide-react";
import { s as supabase } from "./client-B6X92QMo.js";
import { g as getImpersonationFlag, e as exitImpersonation, c as consumeDailyRedirect } from "./impersonation-BRkgjWkx.js";
import { B as BrandLogo } from "./brand-logo-D3iIBbhr.js";
import { toast } from "sonner";
import "./server-BTtYLKd6.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "@supabase/supabase-js";
import "zod";
import "./auth-middleware-V_HzM7yr.js";
import "./createMiddleware-BvN2ghIY.js";
function ImpersonationBanner() {
  const [flag, setFlag] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setFlag(getImpersonationFlag());
    const onStorage = () => setFlag(getImpersonationFlag());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  if (!flag) return null;
  const handleExit = async () => {
    setBusy(true);
    try {
      await exitImpersonation();
      setFlag(null);
      toast.success("Exited — back to admin");
      navigate({ to: "/control-panel" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-[60] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[1600px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(ShieldAlert, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest opacity-90", children: "Admin Impersonation" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold truncate", children: [
          "Signed in as ",
          /* @__PURE__ */ jsx("span", { className: "underline decoration-white/50", children: flag.target_email }),
          flag.admin_email && /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline opacity-80 font-normal", children: [
            " · admin: ",
            flag.admin_email
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleExit,
        disabled: busy,
        className: "inline-flex items-center gap-2 rounded-xl bg-white text-rose-600 px-3.5 py-2 text-sm font-bold hover:bg-white/95 disabled:opacity-60 shadow-md",
        children: [
          busy ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
          "Exit & return to admin"
        ]
      }
    )
  ] }) });
}
const navMgmt = [{
  to: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  to: "/analytics",
  label: "Analytics",
  icon: BarChart3
}, {
  to: "/live",
  label: "Live Feed",
  icon: Activity
}, {
  to: "/domains",
  label: "Domains",
  icon: Globe
}];
function AuthenticatedLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const authCheckedRef = useRef(false);
  const dailyFn = useServerFn(consumeDailyRedirect);
  useEffect(() => {
    let mounted = true;
    const finishInitialAuthCheck = (u) => {
      if (!mounted) return;
      setUser(u);
      authCheckedRef.current = true;
      setAuthChecked(true);
      if (!u) navigate({
        to: "/login"
      });
    };
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (event === "SIGNED_OUT") navigate({
        to: "/login"
      });
      if (authCheckedRef.current && !u && event !== "INITIAL_SESSION") navigate({
        to: "/login"
      });
    });
    supabase.auth.getSession().then(({
      data
    }) => {
      finishInitialAuthCheck(data.session?.user ?? null);
    }).catch(() => {
      finishInitialAuthCheck(null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user]);
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await dailyFn();
        if (res?.url) window.open(res.url, "_blank", "noopener,noreferrer");
      } catch {
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  const logout = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/login"
    });
  };
  if (!authChecked || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FFF9F5] text-[#7A5C45] text-sm", children: "Loading…" });
  }
  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();
  const SidebarContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-12", children: [
      /* @__PURE__ */ jsx(Link, { to: "/dashboard", "aria-label": "Sleepox dashboard", children: /* @__PURE__ */ jsx(BrandLogo, {}) }),
      /* @__PURE__ */ jsx("button", { className: "lg:hidden p-2 text-[#7D6452] hover:text-[#2D1B0D]", onClick: () => setMenuOpen(false), "aria-label": "Close menu", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-[#A38D7D] font-bold mb-3 ml-3", children: "Management" }),
        navMgmt.map((item) => {
          const active = pathname === item.to;
          return /* @__PURE__ */ jsxs(Link, { to: item.to, className: active ? "flex items-center gap-3 px-4 py-2.5 text-[#FF7E5F] bg-gradient-to-r from-[#FF7E5F]/15 to-transparent rounded-2xl border border-[#FF7E5F]/25 shadow-sm font-semibold transition-all" : "flex items-center gap-3 px-4 py-2.5 text-[#7D6452] hover:text-[#2D1B0D] hover:bg-white/40 rounded-2xl transition-all font-medium", children: [
            /* @__PURE__ */ jsx(item.icon, { className: "w-4 h-4" }),
            item.label
          ] }, item.label);
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[0.2em] text-[#A38D7D] font-bold mb-3 ml-3", children: "Account" }),
        /* @__PURE__ */ jsxs(Link, { to: "/upgrade", className: pathname === "/upgrade" ? "flex items-center gap-3 px-4 py-2.5 text-white font-semibold bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] rounded-2xl shadow-lg shadow-orange-500/30" : "flex items-center gap-3 px-4 py-2.5 text-[#FF7E5F] font-semibold bg-[#FF7E5F]/10 rounded-2xl border border-[#FF7E5F]/20 hover:bg-[#FF7E5F]/15 transition-all", children: [
          /* @__PURE__ */ jsx(Crown, { className: "w-4 h-4" }),
          "Upgrade Pro"
        ] }),
        isAdmin && /* @__PURE__ */ jsxs(Link, { to: "/control-panel", className: pathname === "/control-panel" ? "flex items-center gap-3 px-4 py-2.5 text-[#FF7E5F] bg-[#FF7E5F]/10 rounded-2xl border border-[#FF7E5F]/25 font-semibold" : "flex items-center gap-3 px-4 py-2.5 text-[#7D6452] hover:text-[#2D1B0D] hover:bg-white/40 rounded-2xl transition-all font-medium", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }),
          "Control Panel"
        ] }),
        isAdmin && /* @__PURE__ */ jsxs(Link, { to: "/smart-filter", className: pathname === "/smart-filter" ? "flex items-center gap-3 px-4 py-2.5 text-[#FF7E5F] bg-[#FF7E5F]/10 rounded-2xl border border-[#FF7E5F]/25 font-semibold" : "flex items-center gap-3 px-4 py-2.5 text-[#7D6452] hover:text-[#2D1B0D] hover:bg-white/40 rounded-2xl transition-all font-medium", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
          "Smart Filter"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: logout, className: "w-full flex items-center gap-3 px-4 py-2.5 text-[#7D6452] hover:text-[#2D1B0D] hover:bg-white/40 rounded-2xl transition-all font-medium", children: [
          /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
          "Logout"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-auto pt-6 border-t border-[#FFEDD5]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-white/60 p-3 rounded-2xl border border-white/80 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center text-white text-xs font-bold shadow-md", children: initials }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#2D1B0D] truncate", children: user.email }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#FF7E5F] uppercase tracking-wider font-bold", children: isAdmin ? "Admin" : "Premium Tier" })
      ] })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full flex bg-[#FFF9F5] text-[#4A3728] overflow-hidden relative", style: {
    fontFamily: "'Outfit', system-ui, sans-serif"
  }, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/15 blur-[140px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-[10%] right-[-15%] w-[50%] h-[55%] bg-[#FEB47B]/20 blur-[140px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-[#FFEDD5]/40 blur-[130px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 py-4 backdrop-blur-2xl bg-white/70 border-b border-white/60", children: [
      /* @__PURE__ */ jsx(Link, { to: "/dashboard", "aria-label": "Sleepox dashboard", children: /* @__PURE__ */ jsx(BrandLogo, {}) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setMenuOpen(true), className: "p-2 rounded-xl bg-white/60 border border-white/80 text-[#2D1B0D]", "aria-label": "Open menu", children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" }) })
    ] }),
    menuOpen && /* @__PURE__ */ jsx("div", { className: "lg:hidden fixed inset-0 z-40 bg-[#2D1B0D]/40 backdrop-blur-sm", onClick: () => setMenuOpen(false) }),
    /* @__PURE__ */ jsx("aside", { className: "fixed lg:static inset-y-0 left-0 z-50 w-72 border-r border-white/60 flex flex-col p-7 backdrop-blur-3xl bg-white/70 lg:bg-white/40 shrink-0 transition-transform duration-300 " + (menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"), children: SidebarContent }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto z-10 pt-16 lg:pt-0", children: [
      /* @__PURE__ */ jsx(ImpersonationBanner, {}),
      /* @__PURE__ */ jsx(Outlet, {})
    ] })
  ] });
}
export {
  AuthenticatedLayout as component
};
