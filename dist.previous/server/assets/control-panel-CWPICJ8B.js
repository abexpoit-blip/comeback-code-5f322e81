import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-DJC6aB8i.js";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { X, ShieldCheck, Users, Link2, MousePointerClick, DollarSign, Zap, Target, Bot, Calendar, TrendingUp, Globe, Search, Ban, RotateCcw, Eye, KeyRound, Trash2, CreditCard, Package, Plus, Settings2, Sparkles, Star, RefreshCw, Check, LifeBuoy, PowerOff, Power, CheckCircle2, Send, Megaphone, Gift, Crown, Rocket, Trophy, Info, AlertTriangle, Clock } from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { c as cn, B as Button } from "./button-DjOZMqFS.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { s as supabase } from "./client-B6X92QMo.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-V_HzM7yr.js";
import { c as createServerFn } from "./server-BTtYLKd6.js";
import { a as getAppSettings, u as updateAppSettings, s as startImpersonation } from "./impersonation-BRkgjWkx.js";
import { b as listShortenerDomains, c as addShortenerDomain, v as verifyShortenerDomain, s as setPrimaryShortenerDomain, t as toggleShortenerDomainActive, d as deleteShortenerDomain, e as adminListBroadcasts, f as adminCreateBroadcast, h as adminToggleBroadcast, i as adminDeleteBroadcast } from "./broadcasts.functions-B5ydsR63.js";
import { g as getSupportStatus, t as toggleSupport, a as adminListTickets, b as adminReplyTicket, d as adminCloseTicket, e as adminDeleteTicket } from "./support.functions-DgNvoRAk.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
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
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-11 items-center justify-start gap-1 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 p-1 shadow-sm overflow-x-auto",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7A5C45] transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7E5F] data-[state=active]:to-[#FEB47B] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn("mt-6 focus-visible:outline-none", className),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f"));
const adminClicksTimeseries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e9d1f9e0f31baff21269163071f2773125249b173b93b6f8e082b2bce42ebe50"));
const adminTopCountries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d6a8b931287a0f523773d181d0cdfe81f38362ddfcda3bfa170df7cd2f5df4af"));
const adminTopUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0e90fd33773a8111e321610afa0606cc9a87489f3f60e05f00c5709ad8108c33"));
const adminRevenueTimeseries = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4f72212c03dfc54e46237b80651dc0f9cf9f5e97732364103f0eb83f7c880e8d"));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
const adminBanUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_banned: z.boolean()
}).parse(d)).handler(createSsrRpc("3bba96bfc803ffdceb8e317d49ead43f2463bee72ef9463446d363dc12f76f2a"));
const adminBulkBan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  is_banned: z.boolean()
}).parse(d)).handler(createSsrRpc("429be1996cdbaebc10b8a9ffd00e479d3f75da799e8cfbdf703cce1c208cf72e"));
const adminResetUserQuota = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500)
}).parse(d)).handler(createSsrRpc("ba26241d9710067ed0bb27d85639b89098faca09409c040f0a1c693a434ff0c5"));
const adminBulkSetPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  package_slug: z.string().min(1).max(64)
}).parse(d)).handler(createSsrRpc("961c1f6e571cb978c4db99692216cfc4db73f80d629ff4309caa54253d55af80"));
const adminUserDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("d1d8fc22649bbd4178512d2170e1f2caac12739f826880397ec7b7ce92c4fee3"));
const adminSetUserPlan = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  user_id: z.string().uuid(),
  package_slug: z.string().min(1).max(64)
}).parse(d)).handler(createSsrRpc("96c99aa3dd88135d60c64c1eea70683648bac8e4e78316f2766bb02e6477ec27"));
const adminListPackages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("dc901b8e1718d3ea16d5ca66ca961b0afc97b83e5384a842ab3c033287b034f4"));
const adminListAllPackages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("25b3f53200b03f55d2bc6f18dd57ce0575af2c8da2f57e383777ad20e4dfe210"));
const adminUpsertPackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/),
  name: z.string().min(1).max(120),
  price_usd: z.number().min(0).max(1e5),
  click_quota: z.number().int().min(0).nullable(),
  link_limit: z.number().int().min(0).nullable(),
  sort_order: z.number().int().min(0).max(1e3),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("6238adf314c6d3432e0d656a8ed2d8f7bda874a68c1f9113dde280e2603b4218"));
const adminDeletePackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("2c2a938ec2a02f0c00614f175abc71712df5999ec6d433b933525cd1326edaee"));
const adminListUpgradeRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b430aad9702f8ebb3ff04f9a78cc5b8b50e903ae182c317c416cdbcbdafef8bc"));
const adminDecideUpgradeRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  decision: z.enum(["approve", "reject"])
}).parse(d)).handler(createSsrRpc("3625bd41ba7f34cc9fe752b318a4dfc04dfa48f2701dc591a7b2a1f28e82f5c4"));
const adminListLinks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e112ef2416d567fbe50f313cfdf590c06f337e88ce804ed92247ce3f777fc7bd"));
const adminToggleLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("981ab2fa3d1b0f6619cb79089ec9f96c38faa81f558218fc094c10e30b8c0026"));
const adminUpdateLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  adsterra_url: z.string().url().max(2e3).optional(),
  safe_url: z.string().url().max(2e3).optional(),
  title: z.string().max(255).optional()
}).parse(d)).handler(createSsrRpc("b7b62abb0b82435caf96153c195b1f1e0e3fdaee1e2667dd77ae91896c9cdfda"));
const adminDeleteLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("0e2ae9c383624dcbe1ae741661a947cb4075e1a8a78320f022291534efe342d1"));
const adminListBotRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a96fd93bbab79358adbd0906bf7cbb8c1a1a88da99576de2bba6544e8da2a972"));
const adminUpsertBotRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  rule_type: z.string().min(1).max(64),
  pattern: z.string().min(1).max(500),
  action: z.string().min(1).max(32),
  label: z.string().max(255).optional().nullable(),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("c3bb474c8b7e194e4823f8d59c6b8a487fe138d56c8bb972d7885f14f5f327ae"));
const adminDeleteBotRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("566f91f009deabf06e642bea2a5406c142e9dbca0a75297ceb4a121d4557dee7"));
const adminListCloakingRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("883ab95eedaca3158ce3e9fc0f78869464d8885348b6d8eb345e256ffb2ede47"));
const adminUpsertCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid().optional(),
  rule_type: z.string().min(1).max(64),
  pattern: z.string().min(1).max(500),
  action: z.string().min(1).max(32),
  label: z.string().max(255).optional().nullable(),
  priority: z.number().int().min(0).max(1e4),
  is_active: z.boolean()
}).parse(d)).handler(createSsrRpc("cf47486e50d09b6eb698162f320b2c507b803f00a66684606eaadfc016bcf848"));
const adminDeleteCloakingRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("43e35d72c5dc104b971ca6cdf1702f552cf26fc1446f39f160db37fff45a1d44"));
const adminListCountryTiers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b3ee4ed27d9fd8e1fdf02b36d3a774948cc09d7aa1b59761449fb0b5c4b3c45f"));
const adminUpsertCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  country_code: z.string().length(2).regex(/^[A-Z]{2}$/),
  country_name: z.string().max(100).optional().nullable(),
  tier: z.number().int().min(1).max(5)
}).parse(d)).handler(createSsrRpc("bbc029988a8868301d1e0e68f6c868fc4afcc02d0e160627aefed8cfc1e22cb4"));
const adminDeleteCountryTier = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  country_code: z.string().length(2)
}).parse(d)).handler(createSsrRpc("2f67e13384324c1918e5d31cee1eeca586ba376d18d3c999fb720a34dbe305f0"));
const adminImpersonate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  user_id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("79b1c111fd3073261e14960d349d9c53ec566bd1eec83b4619e6b1d0073ede5c"));
const adminListErrors = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  source: z.string().max(64).optional(),
  onlyOpen: z.boolean().optional(),
  limit: z.number().int().min(1).max(1e3).optional()
}).parse(d)).handler(createSsrRpc("2f306b1478ea5a15274fa85998ed14690019ed2fc09656989ff9d871a11aaeb3"));
const adminErrorStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7f07e71321e92ab64d294a23548f879488b2602ad6b63d3b8949ef0f05921bf4"));
const adminResolveError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.number().int().positive(),
  resolved: z.boolean()
}).parse(d)).handler(createSsrRpc("868a5b0f443153927c2b530a5ead388de588b9ee39f33ace7ddbb9b9177bf69f"));
const adminDeleteError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.number().int().positive()
}).parse(d)).handler(createSsrRpc("6f6b8913ddd29a34150f0e275ae9d425c8bdf3255c7eca9ea2136352ec40effa"));
const adminClearResolvedErrors = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b2a238bc0e0421a51e92d6859fe220111f01d17d8fb65be62287f8f900d01e69"));
const font = {
  fontFamily: "'Outfit', system-ui, sans-serif"
};
const PIE_COLORS = ["#FF7E5F", "#FEB47B", "#FFD4BB", "#7A5C45", "#FFEDD5", "#2D1B0D", "#4A3728", "#A8907A"];
function AdminPage() {
  const navigate = useNavigate();
  const [adminChecked, setAdminChecked] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: sessionData
      } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        navigate({
          to: "/sx-vault-9k2m7x"
        });
        return;
      }
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!mounted) return;
      if (!data) {
        navigate({
          to: "/dashboard"
        });
        return;
      }
      setAdminChecked(true);
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);
  if (!adminChecked) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FFF9F5] text-[#7A5C45] text-sm", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-[#FFF9F5] text-[#4A3728] overflow-hidden", style: font, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-[-20%] left-[-10%] w-[55%] h-[55%] bg-[#FF7E5F]/15 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#FEB47B]/20 blur-[160px] rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-5 sm:p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "overview", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "w-full justify-start", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "overview", children: "Overview" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "users", children: "Users" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "links", children: "Links" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "revenue", children: "Revenue" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "packages", children: "Packages" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "rules", children: "Bot/Cloak" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "geo", children: "Geo Tiers" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "traffic", children: "Traffic" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "domains", children: "Domains" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "support", children: "Support" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "broadcasts", children: "Broadcasts" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "errors", children: "Errors" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "overview", children: /* @__PURE__ */ jsx(OverviewTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "users", children: /* @__PURE__ */ jsx(UsersTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "links", children: /* @__PURE__ */ jsx(LinksTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "revenue", children: /* @__PURE__ */ jsx(RevenueTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "packages", children: /* @__PURE__ */ jsx(PackagesTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "rules", children: /* @__PURE__ */ jsx(RulesTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "geo", children: /* @__PURE__ */ jsx(GeoTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "traffic", children: /* @__PURE__ */ jsx(TrafficTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "domains", children: /* @__PURE__ */ jsx(DomainsTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "support", children: /* @__PURE__ */ jsx(SupportTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "broadcasts", children: /* @__PURE__ */ jsx(BroadcastsTab, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "errors", children: /* @__PURE__ */ jsx(ErrorsTab, {}) })
      ] })
    ] })
  ] });
}
function Header() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[#FF7E5F] text-[10px] font-bold uppercase tracking-widest shadow-sm", children: [
      /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }),
      " Admin · Live"
    ] }),
    /* @__PURE__ */ jsxs("h1", { className: "mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2D1B0D]", children: [
      "Control",
      " ",
      /* @__PURE__ */ jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FF7E5F]", children: "Panel" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#7A5C45]", children: "Full system control · users, links, revenue, rules & analytics." })
  ] });
}
function OverviewTab() {
  const statsFn = useServerFn(adminStats);
  const tsFn = useServerFn(adminClicksTimeseries);
  const ctyFn = useServerFn(adminTopCountries);
  const topUsersFn = useServerFn(adminTopUsers);
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsFn()
  });
  const ts = useQuery({
    queryKey: ["admin-ts"],
    queryFn: () => tsFn()
  });
  const cty = useQuery({
    queryKey: ["admin-cty"],
    queryFn: () => ctyFn()
  });
  const top = useQuery({
    queryKey: ["admin-top-users"],
    queryFn: () => topUsersFn()
  });
  const s = stats.data;
  const botPct = s && s.clicks ? (s.bots / s.clicks * 100).toFixed(1) : "0";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(Kpi, { icon: Users, label: "Users", value: s?.users ?? "…", sub: `${s?.banned_users ?? 0} banned` }),
      /* @__PURE__ */ jsx(Kpi, { icon: Link2, label: "Links", value: s?.links ?? "…", sub: `${s?.active_links ?? 0} active` }),
      /* @__PURE__ */ jsx(Kpi, { icon: MousePointerClick, label: "Total clicks", value: (s?.clicks ?? 0).toLocaleString(), sub: `${botPct}% bots` }),
      /* @__PURE__ */ jsx(Kpi, { icon: DollarSign, label: "MRR (30d)", value: `$${(s?.mrr_30d ?? 0).toFixed(2)}`, sub: `$${(s?.total_revenue ?? 0).toFixed(2)} all-time`, accent: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(Kpi, { icon: Zap, label: "Ours rotations", value: (s?.ours ?? 0).toLocaleString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: Target, label: "Offer clicks", value: (s?.offer ?? 0).toLocaleString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: Bot, label: "Bots blocked", value: (s?.bots ?? 0).toLocaleString() }),
      /* @__PURE__ */ jsx(Kpi, { icon: Calendar, label: "Today ours/total", value: `${(s?.today_ours ?? 0).toLocaleString()} / ${(s?.today_total ?? 0).toLocaleString()}`, accent: true })
    ] }),
    /* @__PURE__ */ jsx(Panel, { icon: TrendingUp, title: "Clicks · last 14 days", subtitle: "Daily breakdown of routing & bot traffic", children: /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(LineChart, { data: ts.data ?? [], children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#FFD4BB" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: {
        fontSize: 10,
        fill: "#7A5C45"
      } }),
      /* @__PURE__ */ jsx(YAxis, { tick: {
        fontSize: 10,
        fill: "#7A5C45"
      } }),
      /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
        background: "#fff",
        border: "1px solid #FFD4BB",
        borderRadius: 12
      } }),
      /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
        fontSize: 11
      } }),
      /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "total", stroke: "#FF7E5F", strokeWidth: 2 }),
      /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "ours", stroke: "#FEB47B", strokeWidth: 2 }),
      /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "offer", stroke: "#2D1B0D", strokeWidth: 2 }),
      /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "bots", stroke: "#A8907A", strokeWidth: 2, strokeDasharray: "4 4" })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(Panel, { icon: Globe, title: "Top countries · 7d", children: /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(BarChart, { data: cty.data ?? [], layout: "vertical", children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#FFD4BB" }),
        /* @__PURE__ */ jsx(XAxis, { type: "number", tick: {
          fontSize: 10,
          fill: "#7A5C45"
        } }),
        /* @__PURE__ */ jsx(YAxis, { dataKey: "country", type: "category", tick: {
          fontSize: 10,
          fill: "#7A5C45"
        }, width: 50 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          background: "#fff",
          border: "1px solid #FFD4BB",
          borderRadius: 12
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#FF7E5F", radius: [0, 8, 8, 0] })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(Panel, { icon: Users, title: "Top users · by clicks", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        (top.data ?? []).map((u, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-white/60 border border-[#FFE4D0]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white text-xs font-bold flex items-center justify-center", children: i + 1 }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#2D1B0D]", children: u.email }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase font-bold text-[#7A5C45]", children: u.plan_slug })
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[#FF7E5F]", children: (u.clicks_used ?? 0).toLocaleString() })
        ] }, u.id)),
        !top.data?.length && /* @__PURE__ */ jsx("div", { className: "text-sm text-[#A8907A] p-4 text-center", children: "No data yet." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Panel, { icon: Bot, title: "Bot vs Human · all-time", children: /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(PieChart, { children: [
      /* @__PURE__ */ jsx(Pie, { data: [{
        name: "Human (ours)",
        value: s?.ours ?? 0
      }, {
        name: "Human (offer)",
        value: s?.offer ?? 0
      }, {
        name: "Bots",
        value: s?.bots ?? 0
      }], cx: "50%", cy: "50%", outerRadius: 90, dataKey: "value", label: true, children: PIE_COLORS.slice(0, 3).map((c, i) => /* @__PURE__ */ jsx(Cell, { fill: c }, i)) }),
      /* @__PURE__ */ jsx(Tooltip, {}),
      /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
        fontSize: 11
      } })
    ] }) }) }) })
  ] });
}
function UsersTab() {
  const qc = useQueryClient();
  const usersFn = useServerFn(adminListUsers);
  const packagesFn = useServerFn(adminListPackages);
  const banFn = useServerFn(adminBanUser);
  const planFn = useServerFn(adminSetUserPlan);
  const bulkBanFn = useServerFn(adminBulkBan);
  const bulkPlanFn = useServerFn(adminBulkSetPlan);
  const resetFn = useServerFn(adminResetUserQuota);
  const detailFn = useServerFn(adminUserDetail);
  const impersonateFn = useServerFn(adminImpersonate);
  const navigate = useNavigate();
  const [imperBusyId, setImperBusyId] = useState(null);
  const handleImpersonate = async (u) => {
    if (!confirm(`Sign in as ${u.email ?? u.id}?

Your admin session is saved and can be restored from the orange banner.`)) return;
    setImperBusyId(u.id);
    try {
      const r = await impersonateFn({
        data: {
          user_id: u.id
        }
      });
      await startImpersonation({
        hashed_token: r.hashed_token,
        target: r.target
      });
      toast.success(`Now signed in as ${r.target.email}`);
      navigate({
        to: "/dashboard"
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setImperBusyId(null);
    }
  };
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => usersFn()
  });
  const packages = useQuery({
    queryKey: ["admin-packages"],
    queryFn: () => packagesFn()
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
  const [bulkPlan, setBulkPlan] = useState("");
  const [detailId, setDetailId] = useState(null);
  const detail = useQuery({
    queryKey: ["admin-user-detail", detailId],
    queryFn: () => detailFn({
      data: {
        id: detailId
      }
    }),
    enabled: !!detailId
  });
  const filtered = useMemo(() => {
    const list = users.data ?? [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((u) => (u.email ?? "").toLowerCase().includes(q) || u.id.includes(q) || u.plan_slug.includes(q));
  }, [users.data, search]);
  const invalidate = () => {
    qc.invalidateQueries({
      queryKey: ["admin-users"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-stats"]
    });
  };
  const banMut = useMutation({
    mutationFn: (v) => banFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Updated");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const planMut = useMutation({
    mutationFn: (v) => planFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Plan updated");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const bulkBanMut = useMutation({
    mutationFn: (v) => bulkBanFn({
      data: v
    }),
    onSuccess: (r) => {
      toast.success(`Updated ${r.updated} users`);
      setSelected(/* @__PURE__ */ new Set());
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const bulkPlanMut = useMutation({
    mutationFn: (v) => bulkPlanFn({
      data: v
    }),
    onSuccess: (r) => {
      toast.success(`${r.updated} users moved`);
      setSelected(/* @__PURE__ */ new Set());
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const resetMut = useMutation({
    mutationFn: (v) => resetFn({
      data: v
    }),
    onSuccess: (r) => {
      toast.success(`Quota reset for ${r.updated}`);
      setSelected(/* @__PURE__ */ new Set());
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(filtered.map((u) => u.id)));
  };
  const toggleOne = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setSelected(n);
  };
  return /* @__PURE__ */ jsxs(Panel, { icon: Users, title: "Users", subtitle: "Search · bulk ban · reset quota · plan switch · per-user detail", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8907A]" }),
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by email, plan, id…", className: `${inputCls} pl-10` })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#7A5C45]", children: [
        selected.size,
        " selected"
      ] })
    ] }),
    selected.size > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#FF7E5F]/10 to-[#FEB47B]/10 border border-[#FFD4BB] flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => bulkBanMut.mutate({
        ids: [...selected],
        is_banned: true
      }), className: "border-[#FFD4BB]", children: [
        /* @__PURE__ */ jsx(Ban, { className: "w-3 h-3 mr-1" }),
        "Ban"
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => bulkBanMut.mutate({
        ids: [...selected],
        is_banned: false
      }), className: "border-[#FFD4BB]", children: "Unban" }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
        if (confirm(`Reset quota for ${selected.size} users?`)) resetMut.mutate({
          ids: [...selected]
        });
      }, className: "border-[#FFD4BB]", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3 mr-1" }),
        "Reset quota"
      ] }),
      /* @__PURE__ */ jsxs("select", { value: bulkPlan, onChange: (e) => setBulkPlan(e.target.value), className: "bg-white/80 border border-[#FFD4BB] rounded-lg px-2 py-1 text-xs", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Move to plan…" }),
        packages.data?.map((p) => /* @__PURE__ */ jsx("option", { value: p.slug, children: p.name }, p.slug))
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "sm", disabled: !bulkPlan, onClick: () => {
        bulkPlanMut.mutate({
          ids: [...selected],
          package_slug: bulkPlan
        });
        setBulkPlan("");
      }, className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: "Apply" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
        /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selected.size > 0 && selected.size === filtered.length, onChange: toggleAll }) }),
        /* @__PURE__ */ jsx(Th, { children: "Email" }),
        /* @__PURE__ */ jsx(Th, { children: "Plan" }),
        /* @__PURE__ */ jsx(Th, { children: "Change" }),
        /* @__PURE__ */ jsx(Th, { children: "Links" }),
        /* @__PURE__ */ jsx(Th, { children: "Clicks" }),
        /* @__PURE__ */ jsx(Th, { children: "Ours" }),
        /* @__PURE__ */ jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsx(Th, {})
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.map((u) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60 hover:bg-white/40", children: [
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: selected.has(u.id), onChange: () => toggleOne(u.id) }) }),
        /* @__PURE__ */ jsx(Td, { className: "font-medium text-[#2D1B0D]", children: u.email }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Pill, { children: u.plan_slug }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs("select", { value: u.plan_slug, onChange: (e) => {
          if (e.target.value !== u.plan_slug && confirm(`Change ${u.email} to ${e.target.value}?`)) planMut.mutate({
            user_id: u.id,
            package_slug: e.target.value
          });
        }, className: "bg-white/80 border border-[#FFD4BB] rounded-lg px-2 py-1 text-xs", children: [
          packages.data?.map((p) => /* @__PURE__ */ jsx("option", { value: p.slug, children: p.name }, p.slug)),
          !packages.data?.some((p) => p.slug === u.plan_slug) && /* @__PURE__ */ jsx("option", { value: u.plan_slug, children: u.plan_slug })
        ] }) }),
        /* @__PURE__ */ jsxs(Td, { className: "text-[#7A5C45]", children: [
          u.links_used,
          " / ",
          u.link_limit == null ? "∞" : u.link_limit
        ] }),
        /* @__PURE__ */ jsxs(Td, { className: "text-[#7A5C45]", children: [
          u.clicks_used.toLocaleString(),
          u.click_quota ? ` / ${u.click_quota.toLocaleString()}` : " / ∞"
        ] }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx("span", { className: "inline-flex px-2 py-0.5 rounded-md bg-gradient-to-r from-[#FF7E5F]/15 to-[#FEB47B]/15 text-[#FF7E5F] text-xs font-bold", children: (u.ours_clicks ?? 0).toLocaleString() }) }),
        /* @__PURE__ */ jsx(Td, { children: u.is_banned ? /* @__PURE__ */ jsx("span", { className: "text-rose-600 font-semibold", children: "Banned" }) : /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-semibold", children: "Active" }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setDetailId(u.id), className: "border-[#FFD4BB]", title: "View details", children: /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", disabled: imperBusyId === u.id, onClick: () => handleImpersonate(u), className: "border-amber-400 text-amber-700 hover:bg-amber-50", title: "Sign in as this user", children: /* @__PURE__ */ jsx(KeyRound, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => banMut.mutate({
            id: u.id,
            is_banned: !u.is_banned
          }), className: "border-[#FFD4BB]", children: u.is_banned ? "Unban" : "Ban" })
        ] }) })
      ] }, u.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!detailId, onOpenChange: (o) => !o && setDetailId(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl max-h-[85vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: detail.data?.profile?.email ?? "User detail" }) }),
      detail.isLoading && /* @__PURE__ */ jsx("div", { className: "text-sm text-[#7A5C45]", children: "Loading…" }),
      detail.data && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 text-sm", children: [
          /* @__PURE__ */ jsx(Stat, { label: "Plan", value: detail.data.profile?.plan_slug ?? "—" }),
          /* @__PURE__ */ jsx(Stat, { label: "Links", value: `${detail.data.profile?.links_used ?? 0} / ${detail.data.profile?.link_limit == null ? "∞" : detail.data.profile.link_limit}` }),
          /* @__PURE__ */ jsx(Stat, { label: "Clicks", value: (detail.data.profile?.clicks_used ?? 0).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-44", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(LineChart, { data: detail.data.trend, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#FFD4BB" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 10
          } }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "clicks", stroke: "#FF7E5F" }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "bots", stroke: "#A8907A", strokeDasharray: "4 4" })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold uppercase tracking-widest text-[#7A5C45] mb-2", children: [
            "Links (",
            detail.data.links.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: detail.data.links.map((l) => /* @__PURE__ */ jsxs("div", { className: "text-xs flex justify-between p-2 rounded bg-white/60 border border-[#FFE4D0]", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: l.short_code }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#7A5C45]", children: [
              l.clicks_count,
              " clicks · ",
              l.bot_clicks_count,
              " bots"
            ] })
          ] }, l.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold uppercase tracking-widest text-[#7A5C45] mb-2", children: [
            "Payments (",
            detail.data.payments.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: detail.data.payments.map((p) => /* @__PURE__ */ jsxs("div", { className: "text-xs flex justify-between p-2 rounded bg-white/60 border border-[#FFE4D0]", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              new Date(p.created_at).toLocaleDateString(),
              " · ",
              p.package_slug
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
              "$",
              Number(p.amount).toFixed(2),
              " · ",
              p.status
            ] })
          ] }, p.id)) })
        ] })
      ] })
    ] }) })
  ] });
}
function LinksTab() {
  const qc = useQueryClient();
  const linksFn = useServerFn(adminListLinks);
  const toggleFn = useServerFn(adminToggleLink);
  const updateFn = useServerFn(adminUpdateLink);
  const delFn = useServerFn(adminDeleteLink);
  const links = useQuery({
    queryKey: ["admin-links"],
    queryFn: () => linksFn()
  });
  const [search, setSearch] = useState("");
  const inv = () => qc.invalidateQueries({
    queryKey: ["admin-links"]
  });
  const toggleMut = useMutation({
    mutationFn: (v) => toggleFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Toggled");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  const updateMut = useMutation({
    mutationFn: (v) => updateFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Updated");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (v) => delFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Deleted");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  const filtered = useMemo(() => {
    const l = links.data ?? [];
    if (!search) return l;
    const q = search.toLowerCase();
    return l.filter((x) => x.short_code.toLowerCase().includes(q) || (x.title ?? "").toLowerCase().includes(q) || (x.owner_email ?? "").toLowerCase().includes(q));
  }, [links.data, search]);
  return /* @__PURE__ */ jsxs(Panel, { icon: Link2, title: "All links", subtitle: "Force disable, edit destination, view click/bot stats", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 relative max-w-md", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8907A]" }),
      /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search short code, title, owner…", className: `${inputCls} pl-10` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
        /* @__PURE__ */ jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsx(Th, { children: "Owner" }),
        /* @__PURE__ */ jsx(Th, { children: "Title" }),
        /* @__PURE__ */ jsx(Th, { children: "Destination" }),
        /* @__PURE__ */ jsx(Th, { children: "Clicks" }),
        /* @__PURE__ */ jsx(Th, { children: "Bots" }),
        /* @__PURE__ */ jsx(Th, { children: "Status" }),
        /* @__PURE__ */ jsx(Th, {})
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.map((l) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60", children: [
        /* @__PURE__ */ jsx(Td, { className: "font-mono text-xs", children: l.short_code }),
        /* @__PURE__ */ jsx(Td, { className: "text-xs text-[#7A5C45]", children: l.owner_email }),
        /* @__PURE__ */ jsx(Td, { children: l.title || /* @__PURE__ */ jsx("span", { className: "text-[#A8907A]", children: "—" }) }),
        /* @__PURE__ */ jsx(Td, { className: "max-w-[280px] truncate text-xs", children: /* @__PURE__ */ jsx("a", { href: l.adsterra_url, target: "_blank", rel: "noreferrer", className: "text-[#FF7E5F] hover:underline", children: l.adsterra_url }) }),
        /* @__PURE__ */ jsx(Td, { children: l.clicks_count.toLocaleString() }),
        /* @__PURE__ */ jsx(Td, { className: "text-[#A8907A]", children: l.bot_clicks_count.toLocaleString() }),
        /* @__PURE__ */ jsx(Td, { children: l.is_active ? /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-semibold", children: "Active" }) : /* @__PURE__ */ jsx("span", { className: "text-rose-600 font-semibold", children: "Disabled" }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleMut.mutate({
            id: l.id,
            is_active: !l.is_active
          }), className: "border-[#FFD4BB]", children: l.is_active ? "Disable" : "Enable" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            const url = prompt("New destination URL:", l.adsterra_url);
            if (url) updateMut.mutate({
              id: l.id,
              adsterra_url: url
            });
          }, className: "border-[#FFD4BB]", children: "Edit" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            if (confirm(`Delete link "${l.short_code}"?`)) delMut.mutate({
              id: l.id
            });
          }, className: "border-rose-300 text-rose-600", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
        ] }) })
      ] }, l.id)) })
    ] }) })
  ] });
}
function RevenueTab() {
  const qc = useQueryClient();
  const upgradesFn = useServerFn(adminListUpgradeRequests);
  const decideFn = useServerFn(adminDecideUpgradeRequest);
  const revTsFn = useServerFn(adminRevenueTimeseries);
  const upgrades = useQuery({
    queryKey: ["admin-upgrades"],
    queryFn: () => upgradesFn()
  });
  const revTs = useQuery({
    queryKey: ["admin-rev-ts"],
    queryFn: () => revTsFn()
  });
  const decideMut = useMutation({
    mutationFn: (v) => decideFn({
      data: v
    }),
    onSuccess: (_, v) => {
      toast.success(v.decision === "approve" ? "Approved" : "Rejected");
      qc.invalidateQueries({
        queryKey: ["admin-upgrades"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-stats"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-rev-ts"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const exportCsv = () => {
    const rows = upgrades.data ?? [];
    const csv = ["created_at,email,package,amount,status,invoice_id"].concat(rows.map((r) => `${r.created_at},${r.email},${r.package_slug},${r.amount},${r.status},${r.plisio_invoice_id ?? ""}`)).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Panel, { icon: DollarSign, title: "Revenue · last 30 days", children: /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(BarChart, { data: revTs.data ?? [], children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#FFD4BB" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: {
        fontSize: 10
      } }),
      /* @__PURE__ */ jsx(YAxis, { tick: {
        fontSize: 10
      } }),
      /* @__PURE__ */ jsx(Tooltip, {}),
      /* @__PURE__ */ jsx(Bar, { dataKey: "revenue", fill: "#FF7E5F", radius: [8, 8, 0, 0] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxs(Panel, { icon: CreditCard, title: "Upgrade requests", subtitle: "Approve, reject, export to CSV", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(Button, { size: "sm", onClick: exportCsv, className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: "Export CSV" }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
          /* @__PURE__ */ jsx(Th, { children: "When" }),
          /* @__PURE__ */ jsx(Th, { children: "User" }),
          /* @__PURE__ */ jsx(Th, { children: "Package" }),
          /* @__PURE__ */ jsx(Th, { children: "Amount" }),
          /* @__PURE__ */ jsx(Th, { children: "Invoice" }),
          /* @__PURE__ */ jsx(Th, { children: "Status" }),
          /* @__PURE__ */ jsx(Th, {})
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: upgrades.data?.length ? upgrades.data.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60", children: [
          /* @__PURE__ */ jsx(Td, { className: "whitespace-nowrap text-[#7A5C45] text-xs", children: new Date(r.created_at).toLocaleString() }),
          /* @__PURE__ */ jsx(Td, { children: r.email || r.user_id.slice(0, 8) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Pill, { children: r.package_slug }) }),
          /* @__PURE__ */ jsxs(Td, { className: "font-semibold", children: [
            "$",
            Number(r.amount).toFixed(2)
          ] }),
          /* @__PURE__ */ jsx(Td, { children: r.plisio_invoice_url ? /* @__PURE__ */ jsx("a", { href: r.plisio_invoice_url, target: "_blank", rel: "noreferrer", className: "text-[#FF7E5F] font-semibold hover:underline", children: "View" }) : /* @__PURE__ */ jsx("span", { className: "text-[#A8907A]", children: "—" }) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(StatusPill, { status: r.status }) }),
          /* @__PURE__ */ jsx(Td, { children: r.status === "pending" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => decideMut.mutate({
              id: r.id,
              decision: "approve"
            }), className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: "Approve" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => decideMut.mutate({
              id: r.id,
              decision: "reject"
            }), className: "border-[#FFD4BB]", children: "Reject" })
          ] }) })
        ] }, r.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-8 text-center text-[#A8907A]", children: "No upgrade requests yet." }) }) })
      ] }) })
    ] })
  ] });
}
const emptyPkg = {
  slug: "",
  name: "",
  price_usd: 0,
  click_quota: null,
  link_limit: null,
  sort_order: 99,
  is_active: true
};
function PackagesTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListAllPackages);
  const upFn = useServerFn(adminUpsertPackage);
  const delFn = useServerFn(adminDeletePackage);
  const list = useQuery({
    queryKey: ["admin-pkgs-all"],
    queryFn: () => listFn()
  });
  const [edit, setEdit] = useState(null);
  const inv = () => {
    qc.invalidateQueries({
      queryKey: ["admin-pkgs-all"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-packages"]
    });
  };
  const upMut = useMutation({
    mutationFn: (v) => upFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Saved");
      inv();
      setEdit(null);
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (v) => delFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Deleted");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxs(Panel, { icon: Package, title: "Packages", subtitle: "Create, edit, delete pricing tiers", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs(Button, { onClick: () => setEdit(emptyPkg), className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
      "New package"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-3", children: list.data?.map((p) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-2xl border ${p.is_active ? "bg-white/70 border-[#FFD4BB]" : "bg-white/30 border-[#A8907A]/40"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-mono uppercase tracking-widest text-[#7A5C45]", children: p.slug }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-[#2D1B0D]", children: p.name })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-2xl font-extrabold text-[#FF7E5F]", children: [
          "$",
          Number(p.price_usd).toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-[#7A5C45]", children: [
        p.click_quota?.toLocaleString() ?? "∞",
        " clicks · ",
        p.link_limit ?? "∞",
        " links"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setEdit({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price_usd: Number(p.price_usd),
          click_quota: p.click_quota,
          link_limit: p.link_limit,
          sort_order: p.sort_order,
          is_active: p.is_active
        }), className: "border-[#FFD4BB]", children: "Edit" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
          if (confirm(`Delete ${p.name}?`)) delMut.mutate({
            id: p.id
          });
        }, className: "border-rose-300 text-rose-600", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
      ] })
    ] }, p.id)) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!edit, onOpenChange: (o) => !o && setEdit(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: edit?.id ? "Edit package" : "New package" }) }),
      edit && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "Slug (lowercase, no spaces)", children: /* @__PURE__ */ jsx("input", { value: edit.slug, onChange: (e) => setEdit({
          ...edit,
          slug: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "Name", children: /* @__PURE__ */ jsx("input", { value: edit.name, onChange: (e) => setEdit({
          ...edit,
          name: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(Field, { label: "Price USD", children: /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", value: edit.price_usd, onChange: (e) => setEdit({
            ...edit,
            price_usd: Number(e.target.value)
          }), className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "Sort order", children: /* @__PURE__ */ jsx("input", { type: "number", value: edit.sort_order, onChange: (e) => setEdit({
            ...edit,
            sort_order: Number(e.target.value)
          }), className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "Click quota (blank = ∞)", children: /* @__PURE__ */ jsx("input", { type: "number", value: edit.click_quota ?? "", onChange: (e) => setEdit({
            ...edit,
            click_quota: e.target.value === "" ? null : Number(e.target.value)
          }), className: inputCls }) }),
          /* @__PURE__ */ jsx(Field, { label: "Link limit (blank = ∞)", children: /* @__PURE__ */ jsx("input", { type: "number", value: edit.link_limit ?? "", onChange: (e) => setEdit({
            ...edit,
            link_limit: e.target.value === "" ? null : Number(e.target.value)
          }), className: inputCls }) })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: edit.is_active, onChange: (e) => setEdit({
            ...edit,
            is_active: e.target.checked
          }) }),
          " Active"
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => upMut.mutate(edit), disabled: upMut.isPending, className: "w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: upMut.isPending ? "Saving…" : "Save" })
      ] })
    ] }) })
  ] });
}
function RulesTab() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(RuleSection, { title: "Bot rules", icon: Bot, listFnRef: adminListBotRules, upFnRef: adminUpsertBotRule, delFnRef: adminDeleteBotRule, keyName: "bot-rules", showPriority: false }),
    /* @__PURE__ */ jsx(RuleSection, { title: "Cloaking rules", icon: ShieldCheck, listFnRef: adminListCloakingRules, upFnRef: adminUpsertCloakingRule, delFnRef: adminDeleteCloakingRule, keyName: "cloak-rules", showPriority: true })
  ] });
}
function RuleSection({
  title,
  icon,
  listFnRef,
  upFnRef,
  delFnRef,
  keyName,
  showPriority
}) {
  const qc = useQueryClient();
  const listFn = useServerFn(listFnRef);
  const upFn = useServerFn(upFnRef);
  const delFn = useServerFn(delFnRef);
  const list = useQuery({
    queryKey: [keyName],
    queryFn: () => listFn()
  });
  const [edit, setEdit] = useState(null);
  const inv = () => qc.invalidateQueries({
    queryKey: [keyName]
  });
  const upMut = useMutation({
    mutationFn: (v) => upFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Saved");
      inv();
      setEdit(null);
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (v) => delFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Deleted");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxs(Panel, { icon, title, children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs(Button, { onClick: () => setEdit({
      rule_type: "ua",
      pattern: "",
      action: "safe",
      label: "",
      is_active: true,
      priority: showPriority ? 100 : void 0
    }), className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
      "New rule"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
        /* @__PURE__ */ jsx(Th, { children: "Type" }),
        /* @__PURE__ */ jsx(Th, { children: "Pattern" }),
        /* @__PURE__ */ jsx(Th, { children: "Action" }),
        /* @__PURE__ */ jsx(Th, { children: "Label" }),
        showPriority && /* @__PURE__ */ jsx(Th, { children: "Pri" }),
        /* @__PURE__ */ jsx(Th, { children: "Active" }),
        /* @__PURE__ */ jsx(Th, {})
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: list.data?.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60", children: [
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Pill, { children: r.rule_type }) }),
        /* @__PURE__ */ jsx(Td, { className: "font-mono text-xs max-w-[280px] truncate", children: r.pattern }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Pill, { children: r.action }) }),
        /* @__PURE__ */ jsx(Td, { className: "text-[#7A5C45] text-xs", children: r.label ?? "—" }),
        showPriority && /* @__PURE__ */ jsx(Td, { children: r.priority }),
        /* @__PURE__ */ jsx(Td, { children: r.is_active ? /* @__PURE__ */ jsx("span", { className: "text-emerald-600 font-semibold", children: "Yes" }) : /* @__PURE__ */ jsx("span", { className: "text-rose-600 font-semibold", children: "No" }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setEdit({
            id: r.id,
            rule_type: r.rule_type,
            pattern: r.pattern,
            action: r.action,
            label: r.label ?? "",
            is_active: r.is_active,
            priority: r.priority
          }), className: "border-[#FFD4BB]", children: "Edit" }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            if (confirm("Delete?")) delMut.mutate({
              id: r.id
            });
          }, className: "border-rose-300 text-rose-600", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
        ] }) })
      ] }, r.id)) })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!edit, onOpenChange: (o) => !o && setEdit(null), children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: edit?.id ? "Edit rule" : "New rule" }) }),
      edit && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Field, { label: "Type (ua, ip, asn, header…)", children: /* @__PURE__ */ jsx("input", { value: edit.rule_type, onChange: (e) => setEdit({
          ...edit,
          rule_type: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "Pattern (regex or substring)", children: /* @__PURE__ */ jsx("input", { value: edit.pattern, onChange: (e) => setEdit({
          ...edit,
          pattern: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "Action (safe, block, allow…)", children: /* @__PURE__ */ jsx("input", { value: edit.action, onChange: (e) => setEdit({
          ...edit,
          action: e.target.value
        }), className: inputCls }) }),
        /* @__PURE__ */ jsx(Field, { label: "Label (optional)", children: /* @__PURE__ */ jsx("input", { value: edit.label, onChange: (e) => setEdit({
          ...edit,
          label: e.target.value
        }), className: inputCls }) }),
        showPriority && /* @__PURE__ */ jsx(Field, { label: "Priority (lower = earlier)", children: /* @__PURE__ */ jsx("input", { type: "number", value: edit.priority ?? 100, onChange: (e) => setEdit({
          ...edit,
          priority: Number(e.target.value)
        }), className: inputCls }) }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: edit.is_active, onChange: (e) => setEdit({
            ...edit,
            is_active: e.target.checked
          }) }),
          " Active"
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => upMut.mutate(edit), disabled: upMut.isPending, className: "w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: upMut.isPending ? "Saving…" : "Save" })
      ] })
    ] }) })
  ] });
}
function GeoTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCountryTiers);
  const upFn = useServerFn(adminUpsertCountryTier);
  const delFn = useServerFn(adminDeleteCountryTier);
  const list = useQuery({
    queryKey: ["geo-tiers"],
    queryFn: () => listFn()
  });
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState(1);
  const inv = () => qc.invalidateQueries({
    queryKey: ["geo-tiers"]
  });
  const upMut = useMutation({
    mutationFn: (v) => upFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Saved");
      inv();
      setCode("");
      setName("");
    },
    onError: (e) => toast.error(e.message)
  });
  const delMut = useMutation({
    mutationFn: (v) => delFn({
      data: v
    }),
    onSuccess: () => {
      toast.success("Deleted");
      inv();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxs(Panel, { icon: Globe, title: "Country tiers", subtitle: "Tier 1 = highest payout, Tier 5 = lowest", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 grid grid-cols-1 md:grid-cols-5 gap-2", children: [
      /* @__PURE__ */ jsx("input", { placeholder: "CC (2 letters)", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), maxLength: 2, className: inputCls }),
      /* @__PURE__ */ jsx("input", { placeholder: "Country name", value: name, onChange: (e) => setName(e.target.value), className: `${inputCls} md:col-span-2` }),
      /* @__PURE__ */ jsx("select", { value: tier, onChange: (e) => setTier(Number(e.target.value)), className: inputCls, children: [1, 2, 3, 4, 5].map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
        "Tier ",
        t
      ] }, t)) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => upMut.mutate({
        country_code: code,
        country_name: name || null,
        tier
      }), disabled: code.length !== 2, className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: "Add / Update" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: [
        /* @__PURE__ */ jsx(Th, { children: "Code" }),
        /* @__PURE__ */ jsx(Th, { children: "Name" }),
        /* @__PURE__ */ jsx(Th, { children: "Tier" }),
        /* @__PURE__ */ jsx(Th, {})
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: list.data?.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-[#FFE4D0]/60", children: [
        /* @__PURE__ */ jsx(Td, { className: "font-mono font-bold", children: r.country_code }),
        /* @__PURE__ */ jsx(Td, { children: r.country_name ?? "—" }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Pill, { children: [
          "Tier ",
          r.tier
        ] }) }),
        /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
          if (confirm(`Remove ${r.country_code}?`)) delMut.mutate({
            country_code: r.country_code
          });
        }, className: "border-rose-300 text-rose-600", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) }) })
      ] }, r.country_code)) })
    ] }) })
  ] });
}
function TrafficTab() {
  const qc = useQueryClient();
  const settingsFn = useServerFn(getAppSettings);
  const updateSettingsFn = useServerFn(updateAppSettings);
  const settings = useQuery({
    queryKey: ["app-settings"],
    queryFn: () => settingsFn()
  });
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [ourUrl, setOurUrl] = useState("");
  const [threshold, setThreshold] = useState(5e3);
  const [count, setCount] = useState(50);
  const [dailyOn, setDailyOn] = useState(true);
  useEffect(() => {
    if (settings.data) {
      setFallbackUrl(settings.data.fallback_url);
      setOurUrl(settings.data.our_adsterra_url);
      setThreshold(settings.data.injection_threshold);
      setCount(settings.data.injection_count);
      setDailyOn(settings.data.daily_redirect_enabled);
    }
  }, [settings.data]);
  const saveMut = useMutation({
    mutationFn: () => updateSettingsFn({
      data: {
        fallback_url: fallbackUrl,
        our_adsterra_url: ourUrl,
        injection_threshold: Number(threshold),
        injection_count: Number(count),
        daily_redirect_enabled: dailyOn
      }
    }),
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({
        queryKey: ["app-settings"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxs(Panel, { icon: Settings2, title: "Traffic & Monetization", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { label: "Fallback / Daily redirect URL", children: /* @__PURE__ */ jsx("input", { value: fallbackUrl, onChange: (e) => setFallbackUrl(e.target.value), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Our Adsterra Direct URL", children: /* @__PURE__ */ jsx("input", { value: ourUrl, onChange: (e) => setOurUrl(e.target.value), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Injection threshold", children: /* @__PURE__ */ jsx("input", { type: "number", min: 100, value: threshold, onChange: (e) => setThreshold(Number(e.target.value)), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Injection count", children: /* @__PURE__ */ jsx("input", { type: "number", min: 1, value: count, onChange: (e) => setCount(Number(e.target.value)), className: inputCls }) }),
      /* @__PURE__ */ jsxs("label", { className: "sm:col-span-2 flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: dailyOn, onChange: (e) => setDailyOn(e.target.checked), className: "w-4 h-4 accent-[#FF7E5F]" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Daily auto-redirect on first dashboard login" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(Button, { onClick: () => saveMut.mutate(), disabled: saveMut.isPending, className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white border-0", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 mr-1.5" }),
      saveMut.isPending ? "Saving…" : "Save settings"
    ] }) })
  ] });
}
const inputCls = "w-full bg-white/70 border border-[#FFD4BB] rounded-xl px-4 py-2.5 text-sm text-[#2D1B0D] placeholder:text-[#A8907A] focus:outline-none focus:border-[#FF7E5F] focus:bg-white/90 transition-all";
function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxs("div", { className: `relative rounded-2xl p-5 border backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(255,126,95,0.25)] ${accent ? "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] border-white/40 text-white" : "bg-white/70 border-white/80 text-[#2D1B0D]"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `text-[10px] font-bold uppercase tracking-widest ${accent ? "text-white/80" : "text-[#7A5C45]"}`, children: label }),
      /* @__PURE__ */ jsx(Icon, { className: `w-4 h-4 ${accent ? "text-white/90" : "text-[#FF7E5F]"}` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-3xl font-extrabold tracking-tight", children: value }),
    sub && /* @__PURE__ */ jsx("div", { className: `mt-1 text-[10px] ${accent ? "text-white/80" : "text-[#A8907A]"}`, children: sub })
  ] });
}
function Panel({
  icon: Icon,
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.35)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(255,126,95,0.6)]", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-white" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold text-[#2D1B0D] tracking-tight", children: title })
    ] }),
    subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7A5C45] mb-6 ml-12", children: subtitle }),
    children
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A5C45] mb-2 block", children: label }),
    children
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-white/60 border border-[#FFE4D0]", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-widest text-[#7A5C45]", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 font-bold text-[#2D1B0D]", children: value })
  ] });
}
function Th({
  children
}) {
  return /* @__PURE__ */ jsx("th", { className: "px-3 py-3", children });
}
function Td({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsx("td", { className: `px-3 py-3 ${className}`, children });
}
function Pill({
  children
}) {
  return /* @__PURE__ */ jsx("span", { className: "inline-flex px-2 py-0.5 rounded-md bg-[#FFEDD5] text-[#FF7E5F] text-xs font-semibold", children });
}
function StatusPill({
  status
}) {
  const map = {
    paid: "bg-emerald-100 text-emerald-700",
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${map[status] ?? "bg-[#FFEDD5] text-[#7A5C45]"}`, children: status });
}
function DomainsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(listShortenerDomains);
  const addFn = useServerFn(addShortenerDomain);
  const verifyFn = useServerFn(verifyShortenerDomain);
  const primaryFn = useServerFn(setPrimaryShortenerDomain);
  const toggleFn = useServerFn(toggleShortenerDomainActive);
  const delFn = useServerFn(deleteShortenerDomain);
  const q = useQuery({
    queryKey: ["sd-list"],
    queryFn: () => listFn(),
    staleTime: 15e3
  });
  const [domain, setDomain] = useState("");
  const [note, setNote] = useState("");
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["sd-list"]
  });
  const add = useMutation({
    mutationFn: () => addFn({
      data: {
        domain,
        note: note || void 0
      }
    }),
    onSuccess: () => {
      setDomain("");
      setNote("");
      toast.success("Domain added — now verify DNS");
      invalidate();
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const verify = useMutation({
    mutationFn: (id) => verifyFn({
      data: {
        id
      }
    }),
    onSuccess: (r) => {
      r.ok ? toast.success(r.message) : toast.error(r.message);
      invalidate();
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const setPrimary = useMutation({
    mutationFn: (id) => primaryFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Primary domain switched. All new short URLs use this domain.");
      invalidate();
      qc.invalidateQueries({
        queryKey: ["primary-shortener-domain"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const toggleActive = useMutation({
    mutationFn: (v) => toggleFn({
      data: v
    }),
    onSuccess: () => invalidate(),
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const del = useMutation({
    mutationFn: (id) => delFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const domains = q.data?.domains ?? [];
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl border border-white/80 bg-white/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(255,126,95,0.35)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-[#FF7E5F]" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#2D1B0D]", children: "Shortener Domain Pool" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#7A5C45] mb-5", children: [
      "Add backup domains that point to your VPS (A record → ",
      /* @__PURE__ */ jsx("span", { className: "font-mono", children: "185.158.133.1" }),
      "). If the current primary gets blocked, verify a new one and click ",
      /* @__PURE__ */ jsx("strong", { children: "Set Primary" }),
      " — every short URL instantly uses the new domain. Old short URLs on still-resolving domains keep working too."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-[1fr_1fr_auto] gap-3 mb-6 p-4 rounded-2xl bg-white/60 border border-white/80", children: [
      /* @__PURE__ */ jsx("input", { value: domain, onChange: (e) => setDomain(e.target.value), placeholder: "e.g. trk.example.com", className: "px-4 py-2.5 rounded-xl bg-white border border-[#FFE4D2] text-sm font-mono outline-none focus:border-[#FF7E5F]" }),
      /* @__PURE__ */ jsx("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Note (optional)", className: "px-4 py-2.5 rounded-xl bg-white border border-[#FFE4D2] text-sm outline-none focus:border-[#FF7E5F]" }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => domain.trim() && add.mutate(), disabled: add.isPending, className: "bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1" }),
        " Add Domain"
      ] })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7A5C45]", children: "Loading…" }) : domains.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-[#7A5C45]", children: "No domains in pool yet." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-2xl border border-[#FFE4D2] bg-white/70", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-[#FFF3E8] text-[#7A5C45]", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3", children: "Domain" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3", children: "DNS Target" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3", children: "Note" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-3", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-[#FFEDD5]", children: domains.map((d) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-[#FFF9F5]", children: [
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-mono font-semibold text-[#2D1B0D]", children: [
          d.domain,
          d.is_primary && /* @__PURE__ */ jsxs("span", { className: "ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3 h-3" }),
            "Primary"
          ] })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs text-[#7A5C45]", children: d.dns_target }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
          d.verified ? /* @__PURE__ */ jsx(Pill, { children: "Verified" }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-amber-600 font-semibold", children: "Pending DNS" }),
          !d.is_active && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-rose-600 font-semibold", children: "Inactive" })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-[#7A5C45]", children: d.note ?? "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5 flex-wrap", children: [
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => verify.mutate(d.id), disabled: verify.isPending, children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
            " Verify"
          ] }),
          !d.is_primary && d.verified && d.is_active && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => {
            if (confirm(`Switch primary to ${d.domain}? All new short URLs will use it.`)) setPrimary.mutate(d.id);
          }, className: "bg-emerald-600 hover:bg-emerald-700 text-white", children: [
            /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 mr-1" }),
            " Set Primary"
          ] }),
          !d.is_primary && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => toggleActive.mutate({
            id: d.id,
            is_active: !d.is_active
          }), children: d.is_active ? "Disable" : "Enable" }),
          !d.is_primary && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            if (confirm(`Delete ${d.domain}?`)) del.mutate(d.id);
          }, className: "border-rose-300 text-rose-600", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
        ] }) })
      ] }, d.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Setup steps for a new domain:" }),
      /* @__PURE__ */ jsxs("ol", { className: "list-decimal pl-5 space-y-0.5", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          "At your registrar, add an ",
          /* @__PURE__ */ jsx("strong", { children: "A record" }),
          ": ",
          /* @__PURE__ */ jsx("span", { className: "font-mono", children: "@ → 185.158.133.1" }),
          " (and optionally ",
          /* @__PURE__ */ jsx("span", { className: "font-mono", children: "www → 185.158.133.1" }),
          ")."
        ] }),
        /* @__PURE__ */ jsx("li", { children: "On the VPS, add the domain to Nginx/Caddy config and issue an SSL cert." }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Click ",
          /* @__PURE__ */ jsx("strong", { children: "Verify" }),
          " — DNS check via Cloudflare DoH."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          "Click ",
          /* @__PURE__ */ jsx("strong", { children: "Set Primary" }),
          " when ready. All short links auto-switch."
        ] })
      ] })
    ] })
  ] });
}
function SupportTab() {
  const qc = useQueryClient();
  const statusFn = useServerFn(getSupportStatus);
  const toggleFn = useServerFn(toggleSupport);
  const listFn = useServerFn(adminListTickets);
  const replyFn = useServerFn(adminReplyTicket);
  const closeFn = useServerFn(adminCloseTicket);
  const delFn = useServerFn(adminDeleteTicket);
  const [filter, setFilter] = useState("open");
  const [replyMap, setReplyMap] = useState({});
  const statusQ = useQuery({
    queryKey: ["support-status-admin"],
    queryFn: () => statusFn(),
    staleTime: 3e4
  });
  const ticketsQ = useQuery({
    queryKey: ["admin-tickets", filter],
    queryFn: () => listFn({
      data: {
        status: filter,
        limit: 200
      }
    }),
    staleTime: 15e3
  });
  const toggleMut = useMutation({
    mutationFn: (enabled2) => toggleFn({
      data: {
        enabled: enabled2
      }
    }),
    onSuccess: (r) => {
      toast.success(r.enabled ? "Support enabled" : "Support disabled");
      qc.invalidateQueries({
        queryKey: ["support-status-admin"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const replyMut = useMutation({
    mutationFn: (d) => replyFn({
      data: d
    }),
    onSuccess: (_r, vars) => {
      toast.success("Reply sent");
      setReplyMap((m) => ({
        ...m,
        [vars.ticket_id]: ""
      }));
      qc.invalidateQueries({
        queryKey: ["admin-tickets"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const closeMut = useMutation({
    mutationFn: (id) => closeFn({
      data: {
        ticket_id: id
      }
    }),
    onSuccess: () => {
      toast.success("Closed");
      qc.invalidateQueries({
        queryKey: ["admin-tickets"]
      });
    }
  });
  const delMut = useMutation({
    mutationFn: (id) => delFn({
      data: {
        ticket_id: id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-tickets"]
      });
    }
  });
  const enabled = statusQ.data?.enabled !== false;
  const tickets = ticketsQ.data ?? [];
  return /* @__PURE__ */ jsxs("section", { className: "mt-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white/80 border border-[#FFEDD5] p-5 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center ${enabled ? "bg-gradient-to-br from-emerald-400 to-emerald-600" : "bg-gradient-to-br from-gray-400 to-gray-600"} shadow-md`, children: /* @__PURE__ */ jsx(LifeBuoy, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-extrabold text-[#2D1B0D]", children: "Support System" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#A38D7D]", children: enabled ? "Users can send messages" : "New tickets are disabled" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => toggleMut.mutate(!enabled), disabled: toggleMut.isPending, className: `px-4 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 transition-all ${enabled ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"}`, children: enabled ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(PowerOff, { className: "w-3.5 h-3.5" }),
        " Disable"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Power, { className: "w-3.5 h-3.5" }),
        " Enable"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-1 bg-[#FFEDD5]/60 p-1 rounded-xl w-fit", children: ["all", "open", "replied", "closed"].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: `px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${filter === s ? "bg-[#FF7E5F] text-white shadow-sm" : "text-[#A38D7D] hover:text-[#7D6452]"}`, children: s }, s)) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      ticketsQ.isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-[#A38D7D] p-6 text-center", children: "Loading…" }),
      !ticketsQ.isLoading && tickets.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-[#A38D7D] p-10 text-center bg-white/60 border border-[#FFEDD5] rounded-2xl", children: "No tickets" }),
      tickets.map((t) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#FFEDD5] shadow-sm p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: `text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full ${t.status === "open" ? "bg-amber-100 text-amber-700" : t.status === "replied" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`, children: t.status }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#A38D7D]", children: new Date(t.created_at).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-sm text-[#2D1B0D]", children: t.subject }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-[#A38D7D] mt-0.5", children: [
              "From: ",
              t.user_email ?? t.user_name ?? t.user_id
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
            t.status !== "closed" && /* @__PURE__ */ jsx("button", { onClick: () => closeMut.mutate(t.id), className: "w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              if (confirm("Delete?")) delMut.mutate(t.id);
            }, className: "w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[#FFF9F5] border border-[#FFEDD5] p-3 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-[#A38D7D] uppercase mb-1", children: "User message" }),
          /* @__PURE__ */ jsx("div", { className: "text-[12.5px] whitespace-pre-wrap leading-relaxed", children: t.message })
        ] }),
        t.admin_reply && /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-emerald-50/60 border border-emerald-200 p-3 mb-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-emerald-700 uppercase mb-1", children: "Previous reply" }),
          /* @__PURE__ */ jsx("div", { className: "text-[12.5px] whitespace-pre-wrap leading-relaxed", children: t.admin_reply })
        ] }),
        t.status !== "closed" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("textarea", { value: replyMap[t.id] ?? "", onChange: (e) => setReplyMap((m) => ({
            ...m,
            [t.id]: e.target.value
          })), placeholder: "Type your reply…", rows: 2, className: "flex-1 bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50 resize-none" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            const r = (replyMap[t.id] ?? "").trim();
            if (!r) return toast.error("Reply empty");
            replyMut.mutate({
              ticket_id: t.id,
              reply: r
            });
          }, disabled: replyMut.isPending, className: "px-4 rounded-xl bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold text-xs shadow-md hover:shadow-lg inline-flex items-center gap-1.5 disabled:opacity-50", children: [
            /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }),
            " Send"
          ] })
        ] })
      ] }, t.id))
    ] })
  ] });
}
const BROADCAST_ICONS = [{
  id: "sparkles",
  Icon: Sparkles
}, {
  id: "megaphone",
  Icon: Megaphone
}, {
  id: "gift",
  Icon: Gift
}, {
  id: "crown",
  Icon: Crown
}, {
  id: "rocket",
  Icon: Rocket
}, {
  id: "trophy",
  Icon: Trophy
}, {
  id: "star",
  Icon: Star
}, {
  id: "zap",
  Icon: Zap
}, {
  id: "info",
  Icon: Info
}, {
  id: "warning",
  Icon: AlertTriangle
}];
const BROADCAST_TONES = [{
  id: "premium",
  label: "Premium",
  cls: "from-[#FF7E5F] to-[#FEB47B]"
}, {
  id: "info",
  label: "Info",
  cls: "from-blue-500 to-blue-600"
}, {
  id: "success",
  label: "Success",
  cls: "from-emerald-500 to-emerald-600"
}, {
  id: "warning",
  label: "Warning",
  cls: "from-amber-500 to-orange-600"
}];
function BroadcastsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListBroadcasts);
  const createFn = useServerFn(adminCreateBroadcast);
  const toggleFn = useServerFn(adminToggleBroadcast);
  const delFn = useServerFn(adminDeleteBroadcast);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [icon, setIcon] = useState("sparkles");
  const [tone, setTone] = useState("premium");
  const listQ = useQuery({
    queryKey: ["admin-broadcasts"],
    queryFn: () => listFn(),
    staleTime: 3e4
  });
  const createMut = useMutation({
    mutationFn: (d) => createFn({
      data: d
    }),
    onSuccess: () => {
      toast.success("Broadcast sent to all users");
      setTitle("");
      setBody("");
      qc.invalidateQueries({
        queryKey: ["admin-broadcasts"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const toggleMut = useMutation({
    mutationFn: (d) => toggleFn({
      data: d
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["admin-broadcasts"]
    })
  });
  const delMut = useMutation({
    mutationFn: (id) => delFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-broadcasts"]
      });
    }
  });
  const items = listQ.data ?? [];
  const PreviewIcon = BROADCAST_ICONS.find((i) => i.id === icon)?.Icon ?? Sparkles;
  const previewTone = BROADCAST_TONES.find((t) => t.id === tone) ?? BROADCAST_TONES[0];
  return /* @__PURE__ */ jsxs("section", { className: "mt-6 grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#FFEDD5] shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-gradient-to-r from-[#FFF9F5] to-[#FFEDD5]/40 border-b border-[#FFEDD5] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Megaphone, { className: "w-4 h-4 text-[#FF7E5F]" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-extrabold", children: "Send Broadcast" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-[#7D6452] uppercase", children: "Title" }),
            /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 200, className: "mt-1 w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-bold text-[#7D6452] uppercase", children: [
              "Message (",
              body.length,
              "/2000)"
            ] }),
            /* @__PURE__ */ jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value.slice(0, 2e3)), rows: 4, className: "mt-1 w-full bg-[#FFF9F5] border border-[#FFEDD5] rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#FF7E5F]/50 resize-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-[#7D6452] uppercase", children: "Icon" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 grid grid-cols-5 gap-1.5", children: BROADCAST_ICONS.map(({
              id,
              Icon
            }) => /* @__PURE__ */ jsx("button", { onClick: () => setIcon(id), className: `aspect-square rounded-lg flex items-center justify-center transition-all ${icon === id ? "bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] text-white shadow-md" : "bg-[#FFF9F5] border border-[#FFEDD5] text-[#7D6452] hover:border-[#FF7E5F]/40"}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }) }, id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-[#7D6452] uppercase", children: "Tone" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 grid grid-cols-2 gap-1.5", children: BROADCAST_TONES.map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setTone(t.id), className: `py-2 rounded-lg text-[11px] font-bold transition-all ${tone === t.id ? `bg-gradient-to-r ${t.cls} text-white shadow-md` : "bg-[#FFF9F5] border border-[#FFEDD5] text-[#7D6452]"}`, children: t.label }, t.id)) })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            if (!title.trim() || !body.trim()) return toast.error("Title + message required");
            createMut.mutate({
              title: title.trim(),
              body: body.trim(),
              icon,
              tone
            });
          }, disabled: createMut.isPending, className: "w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50", children: [
            /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
            " ",
            createMut.isPending ? "Sending…" : "Broadcast to all users"
          ] })
        ] })
      ] }),
      (title || body) && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-white border border-[#FFEDD5] p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-[#A38D7D] uppercase mb-3", children: "Live preview" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${previewTone.cls} flex items-center justify-center shadow-md`, children: /* @__PURE__ */ jsx(PreviewIcon, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[13px] font-extrabold text-[#2D1B0D]", children: title || "Title…" }),
            /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-[#7D6452] mt-1", children: body || "Your message…" }),
            tone === "premium" && /* @__PURE__ */ jsx("span", { className: `inline-block mt-2 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r ${previewTone.cls} text-white uppercase`, children: "✨ Premium" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-3", children: [
      listQ.isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-[#A38D7D] p-6 text-center", children: "Loading…" }),
      !listQ.isLoading && items.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-[#A38D7D] p-10 text-center bg-white/60 border border-[#FFEDD5] rounded-2xl", children: "No broadcasts yet" }),
      items.map((b) => {
        const Icon = BROADCAST_ICONS.find((i) => i.id === b.icon)?.Icon ?? Sparkles;
        const t = BROADCAST_TONES.find((x) => x.id === b.tone) ?? BROADCAST_TONES[0];
        return /* @__PURE__ */ jsx("div", { className: `rounded-2xl bg-white border ${b.is_active ? "border-[#FFEDD5]" : "border-gray-200 opacity-60"} shadow-sm p-4`, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${t.cls} flex items-center justify-center shadow-md shrink-0`, children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-sm", children: b.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => toggleMut.mutate({
                  id: b.id,
                  is_active: !b.is_active
                }), className: `px-2 py-1 rounded-lg text-[10px] font-bold ${b.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`, children: b.is_active ? "Active" : "Inactive" }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Delete?")) delMut.mutate(b.id);
                }, className: "w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-[#7D6452] mt-1 whitespace-pre-wrap", children: b.body }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-[#A38D7D] mt-2", children: new Date(b.created_at).toLocaleString() })
          ] })
        ] }) }, b.id);
      })
    ] })
  ] });
}
function ErrorsTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListErrors);
  const statsFn = useServerFn(adminErrorStats);
  const resolveFn = useServerFn(adminResolveError);
  const deleteFn = useServerFn(adminDeleteError);
  const clearFn = useServerFn(adminClearResolvedErrors);
  const [source, setSource] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const stats = useQuery({
    queryKey: ["adminErrorStats"],
    queryFn: () => statsFn(),
    refetchInterval: 3e4
  });
  const rows = useQuery({
    queryKey: ["adminListErrors", source, onlyOpen],
    queryFn: () => listFn({
      data: {
        source: source || void 0,
        onlyOpen,
        limit: 300
      }
    }),
    refetchInterval: 15e3
  });
  const resolveM = useMutation({
    mutationFn: (v) => resolveFn({
      data: v
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["adminListErrors"]
      });
      qc.invalidateQueries({
        queryKey: ["adminErrorStats"]
      });
    }
  });
  const deleteM = useMutation({
    mutationFn: (id) => deleteFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["adminListErrors"]
      });
      qc.invalidateQueries({
        queryKey: ["adminErrorStats"]
      });
      toast.success("Deleted");
    }
  });
  const clearM = useMutation({
    mutationFn: () => clearFn(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["adminListErrors"]
      });
      qc.invalidateQueries({
        queryKey: ["adminErrorStats"]
      });
      toast.success("Cleared resolved");
    }
  });
  const sources = Object.keys(stats.data?.bySource ?? {}).sort();
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx(StatBox, { label: "Total", value: stats.data?.total ?? 0, icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(StatBox, { label: "Last 24h", value: stats.data?.last24h ?? 0, icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(StatBox, { label: "Open", value: stats.data?.open ?? 0, icon: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(StatBox, { label: "Sources", value: sources.length, icon: /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl p-3", children: [
      /* @__PURE__ */ jsxs("select", { value: source, onChange: (e) => setSource(e.target.value), className: "text-sm bg-white border border-[#FF7E5F]/30 rounded-lg px-3 py-1.5", children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "All sources" }),
        sources.map((s) => /* @__PURE__ */ jsxs("option", { value: s, children: [
          s,
          " (",
          stats.data?.bySource?.[s] ?? 0,
          ")"
        ] }, s))
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: onlyOpen, onChange: (e) => setOnlyOpen(e.target.checked) }),
        "Only unresolved"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => rows.refetch(), children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-1" }),
        " Refresh"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "destructive", onClick: () => {
        if (confirm("Delete all resolved errors?")) clearM.mutate();
      }, children: [
        /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
        " Clear resolved"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-[#4A3728]/60", children: "Auto-refresh 15s • cap 10k rows" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl overflow-hidden", children: rows.isLoading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-[#4A3728]/60", children: "Loading…" }) : (rows.data?.rows.length ?? 0) === 0 ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-[#4A3728]/60", children: "No errors 🎉" }) : /* @__PURE__ */ jsx("ul", { className: "divide-y divide-[#FF7E5F]/15", children: rows.data?.rows.map((r) => {
      const isOpen = expanded === r.id;
      return /* @__PURE__ */ jsxs("li", { className: "p-3 hover:bg-[#FFF9F5]/60", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.level === "error" ? "bg-red-100 text-red-700" : r.level === "warn" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`, children: r.level }),
          /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded text-[10px] bg-[#FF7E5F]/15 text-[#FF7E5F] font-semibold", children: r.source }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: r.message }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#4A3728]/60", children: [
              new Date(r.created_at).toLocaleString(),
              r.link_id ? ` • link:${r.link_id.slice(0, 8)}` : "",
              r.resolved ? " • ✅ resolved" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setExpanded(isOpen ? null : r.id), children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => resolveM.mutate({
            id: r.id,
            resolved: !r.resolved
          }), title: r.resolved ? "Mark unresolved" : "Mark resolved", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            if (confirm("Delete this error?")) deleteM.mutate(r.id);
          }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-red-500" }) })
        ] }),
        isOpen && /* @__PURE__ */ jsxs("div", { className: "mt-2 ml-2 space-y-2 text-xs", children: [
          r.context && /* @__PURE__ */ jsx("pre", { className: "bg-black/5 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all", children: r.context }),
          r.stack && /* @__PURE__ */ jsx("pre", { className: "bg-black/5 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-64", children: r.stack })
        ] })
      ] }, r.id);
    }) }) })
  ] });
}
function StatBox({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/60 backdrop-blur border border-[#FF7E5F]/20 rounded-2xl p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#4A3728]/70 text-xs", children: [
      icon,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mt-1", children: value.toLocaleString() })
  ] });
}
export {
  AdminPage as component
};
