import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClientProvider, useQueryClient, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, HeadContent, Scripts, useRouter, Link, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster as Toaster$1 } from "sonner";
import { s as supabase } from "./client-B6X92QMo.js";
import { supabaseAdmin } from "./client.server-DIykjMM_.js";
import { createHash } from "crypto";
import "@supabase/supabase-js";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-Ckj2uZYg.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Page not found." }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90", children: "Back home" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          router.invalidate();
          reset();
        },
        className: "mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        children: "Try again"
      }
    )
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sleepox — Smart Link Cloaking for Facebook Ads" },
      { name: "description", content: "Bot-filtered redirect links for Facebook Ads to monetization offers." }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" }
    ]
  }),
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  shellComponent: RootDocument,
  component: RootComponent
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(AuthSync, {}),
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}
const $$splitComponentImporter$d = () => import("./sx-vault-9k2m7x-8fHCa6BB.js");
const Route$f = createFileRoute("/sx-vault-9k2m7x")({
  head: () => ({
    meta: [{
      title: "Secure Console"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./signup-ieXznE7E.js");
const Route$e = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Create account — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./pricing-NmExx4qi.js");
const Route$d = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing — Sleepox"
    }, {
      name: "description",
      content: "Free forever, $5 monthly Pro, or $50 lifetime unlimited. Pay with crypto."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./login-VVogxAGS.js");
const Route$c = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./_authenticated-BXWcT0_3.js");
const Route$b = createFileRoute("/_authenticated")({
  head: () => ({
    links: [{
      rel: "preconnect",
      href: "https://fonts.googleapis.com"
    }, {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
    }]
  }),
  // Auth check is client-only — SSR has no localStorage so getSession() would
  // always be null and bounce users to /login on every hard refresh.
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-Ch9Trgs2.js");
const Route$a = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Sleepox — Smart Link Manager & Real-Time Analytics"
    }, {
      name: "description",
      content: "Branded short links, edge-fast redirects, geo & device routing, real-time analytics. Free forever plan. $50 lifetime unlimited."
    }, {
      property: "og:title",
      content: "Sleepox — Smart Link Manager"
    }, {
      property: "og:description",
      content: "Shorten, route, and measure every link with sub-30ms edge redirects and live analytics."
    }],
    links: [{
      rel: "preconnect",
      href: "https://fonts.googleapis.com"
    }, {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    }, {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const RELATED_POOL = [
  { title: "5 Habits That Will Transform Your Mornings", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=70" },
  { title: "Why Experts Say This Trend Is Here to Stay", img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=400&q=70" },
  { title: "The Surprising Truth Most People Miss", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=70" },
  { title: "What Doctors Wish You Knew Sooner", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=70" }
];
const ARTICLES = {
  article_health: {
    title: "7 Morning Habits That Boost Your Energy All Day (Doctors Approve)",
    description: "Discover the simple morning routine doctors recommend to feel energized, focused, and stress-free from dawn to dusk.",
    category: "Health & Wellness",
    author: "Dr. Sarah Mitchell",
    heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=75",
    intro: "Feeling drained by 10 AM? You are not alone. According to a 2024 wellness study, 68% of adults report low energy within hours of waking up. The good news: small morning shifts can change everything.",
    paragraphs: [
      "Most people start their day reactively — alarm, phone, coffee, stress. But neuroscientists have found that the first 30 minutes after waking shape your hormones, mood, and focus for the entire day.",
      "We spoke with leading wellness doctors and nutritionists to identify the habits that truly make a difference. The results are surprisingly simple, free, and backed by science.",
      "Hydration is the first and most overlooked step. After 7-8 hours without water, your body wakes up mildly dehydrated, which directly impacts cognition and energy. A 16 oz glass of room-temperature water within 5 minutes of waking can boost alertness by up to 30%.",
      "Natural light exposure is the second pillar. Just 5-10 minutes of morning sunlight regulates your circadian rhythm, suppresses melatonin, and triggers cortisol — the natural 'wake up' hormone. No sunlight? A 10,000-lux therapy lamp works just as well."
    ],
    highlights: ["Drink water before coffee", "Get 5-10 min of morning sunlight", "Eat protein within 60 minutes", "Move your body for 2 minutes", "Skip the phone for the first 30 min"],
    related: RELATED_POOL.slice(0, 3)
  },
  article_news: {
    title: "Breaking: New Government Program Offers Unexpected Benefits to Citizens",
    description: "A new initiative announced this week could change how millions of people access essential services. Here is what you need to know.",
    category: "Breaking News",
    author: "Michael Reynolds",
    heroImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75",
    intro: "In a surprise announcement this week, officials confirmed that a new public program will roll out nationwide. Eligible residents may qualify for benefits they were previously unaware of.",
    paragraphs: [
      "The program, which was quietly approved last month, is now being rolled out in phases. Early reports suggest the application process is straightforward and that approvals are happening within days.",
      "Industry analysts are calling it one of the most significant policy shifts in years. 'This will affect a much larger group than originally anticipated,' said one expert briefed on the rollout.",
      "Public response has been overwhelmingly positive on social media, with thousands sharing their experiences. Officials urge interested citizens to check eligibility soon, as some categories have limited capacity.",
      "Below we have summarized the key facts you need to know, including who qualifies, what you can receive, and how to apply."
    ],
    highlights: ["Applications open now", "Approval in 3-7 days", "No fees required", "Limited capacity in some regions"],
    related: RELATED_POOL.slice(1, 4)
  },
  article_finance: {
    title: "How Smart Savers Are Earning 5x More on Their Money in 2026",
    description: "Financial experts reveal the simple strategy that is helping everyday people grow their savings faster than ever before.",
    category: "Personal Finance",
    author: "Emma Carter, CFP",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75",
    intro: "If your money is sitting in a regular savings account, you may be losing value to inflation every single month. But a quiet shift in 2026 is changing the game for smart savers.",
    paragraphs: [
      "For decades, traditional savings accounts have paid almost nothing — sometimes as little as 0.01% APY. With inflation hovering around 3%, that means your money loses purchasing power every year.",
      "But a new wave of high-yield options has emerged, with some accounts now offering rates 50-100x higher than the national average. The catch? Most people have never heard of them.",
      "Financial planners say the strategy is simple: keep your spending money in a regular checking account, but move your savings, emergency fund, and short-term goals into a high-yield account. The interest compounds monthly and you can withdraw anytime.",
      "Here is what financial experts are recommending in 2026, plus the questions you should ask before switching accounts."
    ],
    highlights: ["Up to 5% APY available", "FDIC insured", "No monthly fees", "Withdraw anytime"],
    related: RELATED_POOL.slice(0, 3)
  },
  article_lifestyle: {
    title: "The 10-Minute Evening Routine That Changed Thousands of Lives",
    description: "A simple bedtime habit is helping people sleep better, wake up refreshed, and feel happier — and it costs nothing.",
    category: "Lifestyle",
    author: "Jessica Tan",
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=75",
    intro: "What if 10 minutes before bed could transform how you feel for the entire next day? Thousands of people are discovering that a small evening shift is one of the highest-ROI habits of their lives.",
    paragraphs: [
      "Sleep researchers have known for years that the way you end your day matters more than how you start it. Yet most of us end the day with screens, stress, and stimulation.",
      "The 10-minute routine combines three simple practices: a brain dump (writing down tomorrow's tasks), 4-7-8 breathing, and a complete digital sunset.",
      "Early adopters report falling asleep 40% faster, waking up with more energy, and feeling noticeably less anxious during the day. The best part: it requires no apps, supplements, or special equipment.",
      "Below we break down each step, plus the simple tweaks that make the biggest difference."
    ],
    highlights: ["Fall asleep 40% faster", "No apps or gear needed", "Works in 10 minutes", "Backed by sleep research"],
    related: RELATED_POOL.slice(1, 4)
  },
  article_tech: {
    title: "This New AI Tool Is Quietly Replacing Hours of Daily Work",
    description: "Professionals are using a free AI assistant to automate the most tedious parts of their job — here's how it works.",
    category: "Technology",
    author: "David Park",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=75",
    intro: "While most people are still asking ChatGPT for recipes, a small group of professionals has quietly built workflows that save them 10+ hours every week. The tools are free, easy, and surprisingly powerful.",
    paragraphs: [
      "Over the past 18 months, AI has gone from novelty to necessity. But the gap between casual users and power users is enormous. Power users aren't smarter — they just know which tools to combine.",
      "We interviewed 40 professionals who report saving at least 10 hours weekly using AI. The most common pattern: stacking 2-3 specialized tools rather than relying on one general-purpose assistant.",
      "Email triage, meeting notes, research summaries, code review, content drafts — every category now has an AI tool that does it 5-10x faster than manual work. And most have generous free tiers.",
      "We break down the exact tool stack the top 1% of AI users rely on, plus the prompts and workflows that produce reliable results."
    ],
    highlights: ["Save 10+ hours per week", "Free tiers available", "No coding required", "Works on phone and desktop"],
    related: RELATED_POOL.slice(0, 3)
  },
  article_celebrity: {
    title: "Hollywood Star's Surprising Daily Habit Has Fans Buzzing",
    description: "The A-list actor revealed an unexpected morning routine in a recent interview — and the internet cannot stop talking about it.",
    category: "Entertainment",
    author: "Sophia Bennett",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=75",
    intro: "When the Oscar-nominated star sat down for a candid podcast interview last week, fans expected the usual press-tour talking points. Instead, they got a glimpse into a daily ritual that has left millions curious.",
    paragraphs: [
      "It started with a simple question from the host: 'What's the one thing you do every day that you wish you'd started sooner?' The answer caught everyone off guard.",
      "Within hours, clips of the interview were trending across TikTok, Instagram, and X. Fans flooded the comments asking for more details, and lifestyle blogs began breaking down every part of the routine.",
      "What's interesting isn't the celebrity status — it's that the habit itself is something anyone can adopt, costs nothing, and takes less than 15 minutes a day. Experts in wellness and psychology have weighed in, mostly agreeing.",
      "Here's the full breakdown of the routine, plus what nutritionists and therapists say about why it works so well."
    ],
    highlights: ["Free and takes 15 minutes", "Recommended by therapists", "Trending across social media", "No equipment needed"],
    related: RELATED_POOL.slice(1, 4)
  },
  article_business: {
    title: "How Side Hustlers Are Quietly Earning $3,000+ Per Month Online",
    description: "A new generation of solo entrepreneurs is building income streams that didn't exist five years ago — here's the playbook.",
    category: "Business & Career",
    author: "Marcus Lee",
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=75",
    intro: "Forget the old advice about side hustles being 'extra cash.' Today's top side hustlers are building $3,000-$10,000/month income streams from their laptop, often in under 90 days.",
    paragraphs: [
      "The shift began during the pandemic but has accelerated dramatically in 2025-2026. Tools that once required teams of engineers — AI assistants, no-code builders, automation platforms — are now available to anyone with a phone and a few free hours per week.",
      "We surveyed 200 part-time entrepreneurs earning consistent income. The patterns were clear: most started with zero audience, no technical skills, and less than $100 in startup cost.",
      "The winning formula isn't a single hustle — it's a stack. A simple offer, one traffic channel, and a way to deliver value without trading hours for dollars. The math compounds quickly when set up right.",
      "We break down the four most replicable models — including exact monthly revenue ranges, time investment, and the tools the top earners use."
    ],
    highlights: ["Start with under $100", "Works alongside a full-time job", "No special skills required", "Results in 60-90 days"],
    related: RELATED_POOL.slice(0, 3)
  },
  article_travel: {
    title: "The Hidden Travel Hack That Saves Frequent Flyers Thousands",
    description: "A little-known booking strategy is helping savvy travelers cut their flight costs by up to 70% — without any miles or status.",
    category: "Travel",
    author: "Olivia Brooks",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75",
    intro: "Most travelers think there are only two ways to fly cheap: book early or rack up miles. But a third option — quietly used by deal-hunters for years — is now going mainstream.",
    paragraphs: [
      "Airline pricing is more dynamic than ever. The same seat can swing 200-400% in price based on the day, the device you book from, and even your browser history. Most people pay way more than they need to.",
      "Frequent flyers have started using a small set of tools and timing tricks to consistently book international flights for 50-70% less than the displayed price. The savings often beat what you'd get with miles or elite status.",
      "What's surprising: none of this involves shady hacks or risky bookings. It's just smarter use of search engines, mistake fares, and routing options most travelers never think to try.",
      "Below we walk through the exact step-by-step approach, including the free tools the top deal-hunters use every day."
    ],
    highlights: ["Save 50-70% on flights", "Works without miles or status", "Free tools only", "Used by 10,000+ travelers"],
    related: RELATED_POOL.slice(1, 4)
  }
};
function articleHtml(content, _code, _token, mode) {
  const today = /* @__PURE__ */ new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const initials = content.author.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const robots = mode === "human" ? `<meta name="robots" content="noindex,nofollow">` : "";
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${content.title}</title>
<meta name="description" content="${content.description}">
${robots}
<meta property="og:type" content="article">
<meta property="og:title" content="${content.title}">
<meta property="og:description" content="${content.description}">
<meta property="og:image" content="${content.heroImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="DailyInsight">
<meta property="article:published_time" content="${today.toISOString()}">
<meta property="article:author" content="${content.author}">
<meta property="article:section" content="${content.category}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${content.title}">
<meta name="twitter:description" content="${content.description}">
<meta name="twitter:image" content="${content.heroImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Source Sans 3',-apple-system,sans-serif;background:#f7f7f8;color:#1a1a1a;line-height:1.65;font-size:17px}
  .topbar{background:#0a0a0a;color:#fff;font-size:.75rem;padding:6px 0;text-align:center;letter-spacing:.5px}
  .nav{background:#fff;border-bottom:1px solid #ececec;padding:18px 24px;position:sticky;top:0;z-index:10;box-shadow:0 1px 0 rgba(0,0,0,.02)}
  .nav-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:24px}
  .logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.6rem;color:#b91c1c;letter-spacing:-1px;line-height:1}
  .logo span{color:#0a0a0a;font-weight:700}
  .nav-links{display:flex;gap:22px;flex-wrap:wrap}
  .nav-links a{color:#444;text-decoration:none;font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
  .nav-links a:hover{color:#b91c1c}
  .layout{max-width:1100px;margin:0 auto;padding:32px 24px 80px;display:grid;grid-template-columns:1fr 300px;gap:48px}
  article{background:#fff;padding:48px 56px;border-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,.04)}
  .crumbs{font-size:.78rem;color:#888;margin-bottom:14px;letter-spacing:.5px}
  .crumbs a{color:#888;text-decoration:none}
  .cat-pill{display:inline-block;font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:1.8px;color:#fff;background:#b91c1c;padding:5px 12px;border-radius:2px;margin-bottom:18px}
  h1{font-family:'Playfair Display',Georgia,serif;font-size:2.6rem;line-height:1.18;font-weight:800;margin-bottom:18px;color:#0a0a0a;letter-spacing:-.5px}
  .deck{font-size:1.18rem;color:#555;font-weight:400;line-height:1.55;margin-bottom:26px;font-family:'Source Sans 3',sans-serif}
  .byline{display:flex;align-items:center;gap:14px;padding:18px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;margin-bottom:28px}
  .avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#b91c1c,#7c2d12);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.95rem;flex-shrink:0}
  .byline-text{font-size:.88rem;color:#555;line-height:1.4}
  .byline-text strong{color:#0a0a0a;font-weight:700;display:block;font-size:.95rem}
  .share-row{margin-left:auto;display:flex;gap:8px}
  .share-btn{width:32px;height:32px;border-radius:50%;background:#f3f3f3;display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;color:#666;text-decoration:none}
  .hero{width:100%;height:auto;border-radius:4px;margin:0 0 12px;display:block}
  .hero-cap{font-size:.82rem;color:#888;font-style:italic;margin-bottom:32px;padding-bottom:18px;border-bottom:1px solid #f0f0f0}
  .intro{font-size:1.22rem;line-height:1.6;color:#222;margin-bottom:26px;font-weight:400}
  .intro::first-letter{font-family:'Playfair Display',serif;font-size:3.6rem;float:left;line-height:.9;padding:6px 12px 0 0;color:#b91c1c;font-weight:800}
  p{margin-bottom:22px;font-size:1.08rem;color:#222;line-height:1.7}
  .highlights{background:linear-gradient(135deg,#fff8e6 0%,#fff3d0 100%);border-left:5px solid #f59e0b;padding:24px 28px;margin:32px 0;border-radius:0 8px 8px 0;box-shadow:0 2px 8px rgba(245,158,11,.08)}
  .highlights h3{font-size:.85rem;text-transform:uppercase;letter-spacing:1.5px;color:#92400e;margin-bottom:14px;font-weight:800}
  .highlights ul{list-style:none;padding:0}
  .highlights li{padding:8px 0 8px 30px;position:relative;font-size:1rem;color:#3a2a06;font-weight:500}
  .highlights li:before{content:'✓';position:absolute;left:0;color:#15803d;font-weight:900;font-size:1.1rem}
  .ad-slot{background:#fafafa;border:1px solid #ececec;text-align:center;padding:20px;margin:28px 0;border-radius:4px;color:#aaa;font-size:.7rem;letter-spacing:1px;text-transform:uppercase}
  .ad-slot small{display:block;margin-bottom:8px;color:#bbb}
  .ad-slot-inner{height:90px;display:flex;align-items:center;justify-content:center;background:#fff;border:1px dashed #e0e0e0;color:#bbb;border-radius:2px}
  .tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px;padding-top:24px;border-top:1px solid #eee}
  .tag{font-size:.8rem;color:#666;background:#f3f3f3;padding:6px 12px;border-radius:20px;text-decoration:none}
  aside{position:relative}
  .side-card{background:#fff;border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 2px 12px rgba(0,0,0,.04)}
  .side-card h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;margin-bottom:16px;color:#0a0a0a;padding-bottom:10px;border-bottom:3px solid #b91c1c}
  .related-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0}
  .related-item:last-child{border-bottom:0}
  .related-item img{width:72px;height:72px;object-fit:cover;border-radius:3px;flex-shrink:0}
  .related-item h4{font-size:.9rem;font-weight:600;line-height:1.35;color:#0a0a0a;font-family:'Source Sans 3',sans-serif}
  .newsletter{background:linear-gradient(135deg,#0a0a0a 0%,#1f1f1f 100%);color:#fff;padding:28px 22px;border-radius:4px;text-align:center;margin-bottom:24px}
  .newsletter h3{font-family:'Playfair Display',serif;font-size:1.25rem;margin-bottom:8px;color:#fff;border:0;padding:0}
  .newsletter p{color:#bbb;font-size:.88rem;margin-bottom:14px}
  .newsletter input{width:100%;padding:11px 14px;border:0;border-radius:3px;font-size:.9rem;margin-bottom:8px;font-family:inherit}
  .newsletter button{width:100%;padding:11px;background:#b91c1c;color:#fff;border:0;border-radius:3px;font-weight:700;font-size:.9rem;cursor:pointer;text-transform:uppercase;letter-spacing:1px}
  footer{background:#0a0a0a;color:#999;padding:36px 24px;text-align:center;font-size:.82rem;line-height:1.7}
  footer strong{color:#fff;display:block;font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:8px}
  footer a{color:#bbb;text-decoration:none;margin:0 8px}
  @media (max-width:900px){
    .layout{grid-template-columns:1fr;gap:24px;padding:20px 16px 50px}
    article{padding:28px 22px}
    h1{font-size:1.85rem}
    .deck{font-size:1.05rem}
    aside{order:2}
    .nav-links{display:none}
  }
</style>
</head><body>
<div class="topbar">📰 Trusted reporting since 2014  ·  Updated daily  ·  Subscribe for free</div>
<nav class="nav"><div class="nav-inner">
  <div class="logo">Daily<span>Insight</span></div>
  <div class="nav-links">
    <a href="#">News</a><a href="#">Health</a><a href="#">Money</a>
    <a href="#">Tech</a><a href="#">Lifestyle</a><a href="#">Travel</a>
  </div>
</div></nav>

<div class="layout">
<article>
  <div class="crumbs"><a href="#">Home</a> › <a href="#">${content.category}</a> › Article</div>
  <span class="cat-pill">${content.category}</span>
  <h1>${content.title}</h1>
  <p class="deck">${content.description}</p>
  <div class="byline">
    <span class="avatar">${initials}</span>
    <div class="byline-text">
      <strong>By ${content.author}</strong>
      ${dateStr} · 5 min read
    </div>
    <div class="share-row">
      <a href="#" class="share-btn" aria-label="Share on Facebook">f</a>
      <a href="#" class="share-btn" aria-label="Share on Twitter">𝕏</a>
      <a href="#" class="share-btn" aria-label="Share via link">🔗</a>
    </div>
  </div>
  <img class="hero" src="${content.heroImage}" alt="${content.title}" loading="eager" width="1200" height="630">
  <p class="hero-cap">Photo: Editorial / DailyInsight</p>
  <p class="intro">${content.intro}</p>
  ${content.paragraphs.slice(0, 2).map((p) => `<p>${p}</p>`).join("\n  ")}
  <div class="ad-slot"><small>Advertisement</small><div class="ad-slot-inner">Sponsored content</div></div>
  ${content.paragraphs.slice(2).map((p) => `<p>${p}</p>`).join("\n  ")}
  <div class="highlights">
    <h3>★ Key Takeaways</h3>
    <ul>${content.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
  </div>
  <p>The full breakdown — including expert quotes, downloadable checklist, and the step-by-step guide — is available in the complete report below. Readers who acted on these tips early are already seeing measurable results.</p>
  <div class="tags">
    <a href="#" class="tag">#${content.category.toLowerCase().replace(/[^a-z]/g, "")}</a>
    <a href="#" class="tag">#trending</a>
    <a href="#" class="tag">#2026</a>
    <a href="#" class="tag">#expert-tips</a>
  </div>
</article>

<aside>
  <div class="newsletter">
    <h3>Get the Daily Brief</h3>
    <p>The 5 stories everyone is talking about. Free.</p>
    <input type="email" placeholder="your@email.com">
    <button type="button">Subscribe Free</button>
  </div>
  <div class="side-card">
    <h3>Trending Now</h3>
    ${content.related.map((r) => `<div class="related-item"><img src="${r.img}" alt=""><h4>${r.title}</h4></div>`).join("")}
  </div>
  <div class="ad-slot" style="margin:0"><small>Advertisement</small><div class="ad-slot-inner" style="height:250px">Sponsored</div></div>
</aside>
</div>

<footer>
  <strong>DailyInsight</strong>
  © ${today.getFullYear()} DailyInsight Media · Trusted journalism since 2014<br>
  <a href="#">About</a> · <a href="#">Editorial Standards</a> · <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Contact</a>
</footer>
</body></html>`;
}
function renderPrelanding(template, code, token, mode = "fbbot") {
  if (template in ARTICLES) return articleHtml(ARTICLES[template], code, token, mode);
  return articleHtml(ARTICLES.article_health, code, token, mode);
}
function quickHash(input) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) + h + input.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
function fingerprint(input) {
  const ipBucket = input.ip.includes(".") ? input.ip.split(".").slice(0, 3).join(".") : input.ip.split(":").slice(0, 4).join(":");
  const raw = [
    ipBucket,
    input.ua.slice(0, 120),
    input.acceptLanguage.slice(0, 40),
    input.acceptEncoding.slice(0, 40),
    input.secChUa.slice(0, 80)
  ].join("|");
  return quickHash(raw);
}
function classifyReferrer(refererHost) {
  if (!refererHost) return "direct";
  const h = refererHost.toLowerCase();
  if (/(^|\.)facebook\.com$|(^|\.)fb\.com$|(^|\.)fb\.me$/.test(h)) return "facebook";
  if (/(^|\.)instagram\.com$/.test(h)) return "instagram";
  if (/(^|\.)t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/.test(h)) return "twitter";
  if (/(^|\.)t\.me$|(^|\.)telegram\.org$/.test(h)) return "telegram";
  if (/(^|\.)whatsapp\.com$|(^|\.)wa\.me$/.test(h)) return "whatsapp";
  if (/(^|\.)tiktok\.com$/.test(h)) return "tiktok";
  if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(h)) return "youtube";
  if (/(^|\.)reddit\.com$/.test(h)) return "reddit";
  if (/(^|\.)google\./.test(h)) return "google";
  if (/(^|\.)bing\.com$/.test(h)) return "bing";
  if (/(^|\.)yahoo\.com$/.test(h)) return "yahoo";
  if (/(^|\.)duckduckgo\.com$/.test(h)) return "duckduckgo";
  return "other";
}
function analyzeSignals(input) {
  const reasons = [];
  let score = 0;
  const uaLow = input.ua.toLowerCase();
  const isHeadless = /headlesschrome|phantomjs|selenium|puppeteer|playwright|nightmare|electron/.test(uaLow);
  if (isHeadless) {
    score += 80;
    reasons.push("headless-ua");
  }
  if (!input.ua || input.ua.length < 20) {
    score += 40;
    reasons.push("empty/short-ua");
  }
  if (!input.accept) {
    score += 25;
    reasons.push("no-accept");
  }
  if (!input.acceptLanguage) {
    score += 25;
    reasons.push("no-accept-language");
  }
  if (!input.acceptEncoding) {
    score += 15;
    reasons.push("no-accept-encoding");
  }
  const claimsChrome = /chrome|edg\//i.test(uaLow);
  const claimsMobileSafari = /iphone|ipad/i.test(uaLow) && /safari/i.test(uaLow);
  if (claimsChrome && !input.secChUa) {
    score += 20;
    reasons.push("chrome-no-sec-ch-ua");
  }
  if (claimsMobileSafari && input.secChUa) {
    score += 30;
    reasons.push("ios-with-sec-ch-ua");
  }
  if (!input.acceptLanguage && input.asn) {
    score += 10;
  }
  const isDirectHit = !input.referer;
  return { score: Math.min(score, 100), reasons, isHeadless, isDirectHit };
}
function matchCloaking(input, rules) {
  const uaLow = input.ua.toLowerCase();
  for (const r of rules) {
    const p = (r.pattern || "").toLowerCase();
    if (!p) continue;
    if (r.rule_type === "ua" && uaLow.includes(p)) return { rule: r, matchKey: `ua:${p}` };
    if (r.rule_type === "asn" && input.asn && input.asn === p)
      return { rule: r, matchKey: `asn:${p}` };
    if (r.rule_type === "ip" && input.ip && input.ip.startsWith(p))
      return { rule: r, matchKey: `ip:${p}` };
    if (r.rule_type === "country" && input.country && input.country.toUpperCase() === p.toUpperCase())
      return { rule: r, matchKey: `country:${p}` };
  }
  return null;
}
function matchReferrer(refererHost, rules) {
  if (!refererHost) return null;
  const h = refererHost.toLowerCase();
  for (const r of rules) {
    const p = (r.pattern || "").toLowerCase();
    if (!p) continue;
    if (h === p || h.endsWith("." + p) || h.includes(p)) return r;
  }
  return null;
}
function weightedPick(items) {
  if (items.length === 0) return null;
  const totals = items.map((i) => Math.max(1, i.weight_pct ?? i.weight ?? 1));
  const sum = totals.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < items.length; i++) {
    r -= totals[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
async function logServerError(source, err, context = {}, level = "error") {
  try {
    const e = err;
    const message = (e?.message || String(err) || "unknown error").slice(0, 2e3);
    const stack = (e?.stack || "").slice(0, 8e3) || null;
    const linkId = context.linkId ?? null;
    const userId = context.userId ?? null;
    await supabaseAdmin.from("error_logs").insert({
      source,
      level,
      message,
      stack,
      context,
      link_id: linkId,
      user_id: userId
    });
  } catch (logErr) {
    console.error("[error-log] failed to record", logErr);
  }
}
const SAFE_FALLBACK = "https://sleepox.com/";
const BOT_BLOCK_THRESHOLD = 3;
const BOT_ASNS = /* @__PURE__ */ new Set(["32934", "15169", "8075", "13335", "16509", "14618", "396982"]);
function detectDevice(ua) {
  const u = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(u)) return "tablet";
  if (/mobile|iphone|android|phone|webos|opera mini/.test(u)) return "mobile";
  return "desktop";
}
const countryCache = /* @__PURE__ */ new Map();
const COUNTRY_TTL_MS = 24 * 60 * 60 * 1e3;
const COUNTRY_CACHE_MAX = 5e4;
function subnetKey(ip) {
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":");
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : ip;
}
async function lookupCountryByIp(ip) {
  const key = subnetKey(ip);
  const now = Date.now();
  const hit = countryCache.get(key);
  if (hit && hit.exp > now) return hit.c;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const r = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" }
    });
    clearTimeout(t);
    if (r.ok) {
      const j = await r.json();
      const c = (j.country || "").toUpperCase();
      if (countryCache.size >= COUNTRY_CACHE_MAX) {
        const firstKey = countryCache.keys().next().value;
        if (firstKey) countryCache.delete(firstKey);
      }
      countryCache.set(key, { c, exp: now + COUNTRY_TTL_MS });
      return c;
    }
  } catch (e) {
    console.warn("[redirect] country lookup failed", e?.message);
  }
  countryCache.set(key, { c: "", exp: now + 5 * 60 * 1e3 });
  return "";
}
function sanitizeRedirectTarget(target) {
  try {
    if (!target) return SAFE_FALLBACK;
    const parsed = new URL(target);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return SAFE_FALLBACK;
    return parsed.toString();
  } catch {
    return SAFE_FALLBACK;
  }
}
function redirectTo(target, route, reason) {
  const headers = new Headers({
    Location: sanitizeRedirectTarget(target),
    "Cache-Control": "no-store",
    "X-Sleepox-Route": route
  });
  if (reason)
    headers.set("X-Sleepox-Reason", reason.replace(/[^a-zA-Z0-9:._ -]/g, "").slice(0, 80));
  return new Response(null, { status: 302, headers });
}
async function recordRedirectClick(input) {
  const { error: rpcErr } = await supabaseAdmin.rpc(
    "record_redirect_click",
    {
      _link_id: input.linkId,
      _user_id: input.userId,
      _ip: input.ip,
      _country: input.country,
      _ua: input.ua,
      _is_bot: input.isBot,
      _bot_reason: input.botReason,
      _routed_to: input.routedTo,
      _utm_source: input.utm?.utm_source ?? null,
      _utm_medium: input.utm?.utm_medium ?? null,
      _utm_campaign: input.utm?.utm_campaign ?? null,
      _utm_term: input.utm?.utm_term ?? null,
      _utm_content: input.utm?.utm_content ?? null,
      _referer_host: input.refererHost ?? null,
      _bot_score: input.botScore ?? null,
      _signals: input.signals ?? null,
      _challenge_passed: input.challengePassed
    }
  );
  if (rpcErr) {
    console.error("record_redirect_click rpc failed", {
      linkId: input.linkId,
      message: rpcErr.message,
      code: rpcErr.code
    });
  }
  if (input.fingerprintHash) {
    await supabaseAdmin.rpc(
      "record_bot_fingerprint",
      {
        _hash: input.fingerprintHash,
        _is_bot: input.isBot,
        _ip: input.ip,
        _ua: input.ua,
        _country: input.country,
        _block_threshold: BOT_BLOCK_THRESHOLD
      }
    );
  }
  if (input.abVariant && !input.isBot) {
    try {
      const { data } = await supabaseAdmin.from("ab_variants").select("clicks_count").eq("link_id", input.linkId).eq("variant_label", input.abVariant).maybeSingle();
      if (data) {
        await supabaseAdmin.from("ab_variants").update({ clicks_count: (data.clicks_count || 0) + 1 }).eq("link_id", input.linkId).eq("variant_label", input.abVariant);
      }
    } catch (e) {
      console.error("ab variant click increment failed", e);
    }
  }
}
async function lookupRedirectLink(code) {
  const res = await supabaseAdmin.from("links").select("*").eq("short_code", code).maybeSingle();
  if (res.error) return { link: null, error: res.error };
  const row = res.data;
  if (!row) return { link: null, error: null };
  const adsterraDirect = row.adsterra_direct_link ?? null;
  const destination = row.destination_url ?? null;
  const adsterra = row.adsterra_url ?? adsterraDirect ?? destination ?? null;
  const safe = row.safe_url ?? (adsterraDirect ? destination : null) ?? SAFE_FALLBACK;
  const isActive = typeof row.is_active === "boolean" ? row.is_active : row.status === "active";
  row.prelanding_template || "article_health";
  const AUTO_TPLS = [
    "article_health",
    "article_news",
    "article_finance",
    "article_lifestyle",
    "article_tech",
    "article_celebrity",
    "article_business",
    "article_travel"
  ];
  const validTpl = AUTO_TPLS[Math.floor(Math.random() * AUTO_TPLS.length)];
  return {
    error: null,
    link: {
      id: row.id,
      user_id: row.user_id,
      clicks_count: row.clicks_count ?? 0,
      adsterra_url: adsterra,
      safe_url: safe || SAFE_FALLBACK,
      is_active: isActive,
      prelanding_template: validTpl
    }
  };
}
async function safeHandle(request, code, record) {
  try {
    return await handleRedirect(request, code, record);
  } catch (err) {
    await logServerError("redirect", err, {
      code,
      url: request.url,
      ua: request.headers.get("user-agent") || "",
      ip: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || ""
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: SAFE_FALLBACK,
        "Cache-Control": "no-store",
        "X-Sleepox-Route": "fallback",
        "X-Sleepox-Reason": "handler-crash"
      }
    });
  }
}
const Route$9 = createFileRoute("/r/$code")({
  server: {
    handlers: {
      HEAD: async ({ request, params }) => safeHandle(request, params.code, false),
      GET: async ({ request, params }) => safeHandle(request, params.code, true)
    }
  }
});
async function handleRedirect(request, code, shouldRecordClick = true) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const asn = request.headers.get("cf-asn") || "";
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "";
  let country = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || request.headers.get("x-country-code") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  if (!country && ip && ip !== "127.0.0.1" && !ip.startsWith("::1")) {
    country = await lookupCountryByIp(ip);
  }
  if (!country && acceptLanguage) {
    const m = acceptLanguage.match(/[a-z]{2}-([A-Z]{2})/);
    if (m) country = m[1];
  }
  country = (country || "").toUpperCase();
  const accept = request.headers.get("accept") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";
  const secChUa = request.headers.get("sec-ch-ua") || "";
  request.headers.get("cf-ja3") || request.headers.get("x-ja3-hash") || "";
  const detectInput = {
    ua,
    ip,
    asn,
    country,
    referer,
    acceptLanguage,
    accept,
    acceptEncoding,
    secChUa
  };
  const fpHash = fingerprint(detectInput);
  const refererDomain = (() => {
    try {
      return referer ? new URL(referer).hostname : "";
    } catch {
      return "";
    }
  })();
  const referrerSource = classifyReferrer(refererDomain);
  const [
    { link, error: linkError },
    { data: settings, error: settingsError },
    { data: cloakingRulesRaw },
    { data: referrerRulesRaw },
    { data: tierRow },
    { data: fpRow },
    { data: recentAdRow }
  ] = await Promise.all([
    lookupRedirectLink(code),
    supabaseAdmin.from("app_settings").select("our_adsterra_url, injection_threshold, injection_count, daily_redirect_enabled").eq("id", true).maybeSingle(),
    supabaseAdmin.from("cloaking_rules").select("rule_type, pattern, action, label, priority").eq("is_active", true).order("priority", { ascending: true }),
    supabaseAdmin.from("referrer_rules").select("pattern, trust_score, action, label").eq("is_active", true),
    country ? supabaseAdmin.from("country_tiers").select("tier").eq("country_code", country.toUpperCase()).maybeSingle() : Promise.resolve({ data: null }),
    supabaseAdmin.from("bot_fingerprints").select("auto_blocked").eq("fingerprint_hash", fpHash).maybeSingle(),
    // Daily 1-ad-per-visitor check disabled: fingerprint_hash no longer stored on clicks
    Promise.resolve({ data: null })
  ]);
  if (linkError) console.error("redirect link lookup failed", { code, message: linkError.message });
  if (settingsError)
    console.error("redirect settings lookup failed", { message: settingsError.message });
  if (!link || !link.is_active) {
    return redirectTo(SAFE_FALLBACK, "fallback", !link ? "link-not-found" : "link-inactive");
  }
  const OUR_URL = settings?.our_adsterra_url || SAFE_FALLBACK;
  const THRESHOLD = settings?.injection_threshold ?? 5e3;
  const INJECT_COUNT = settings?.injection_count ?? 50;
  const dailyAdEnabled = settings?.daily_redirect_enabled ?? true;
  const visitorAlreadySawAdToday = dailyAdEnabled && !!recentAdRow;
  const countryTier = tierRow?.tier ?? 3;
  const cloakingRules = cloakingRulesRaw || [];
  const referrerRules = referrerRulesRaw || [];
  let isBot = false;
  let isFbBot = false;
  let reason = null;
  const uaLowFb = ua.toLowerCase();
  const FB_UA_PATTERNS = [
    "facebookexternalhit",
    "facebot",
    "meta-externalagent",
    "meta-externalfetcher",
    "facebookcatalog",
    "whatsapp",
    "twitterbot",
    "linkedinbot",
    "telegrambot",
    "discordbot",
    "slackbot",
    "slack-imgproxy",
    "pinterestbot",
    "redditbot",
    "skypeuripreview",
    "snapchat",
    "tiktokbot",
    "vkshare",
    "googlebot",
    "bingbot",
    "adsbot-google",
    "google-adwords",
    "google-inspectiontool"
  ];
  const FB_ASNS_HC = /* @__PURE__ */ new Set(["32934", "63293"]);
  const FB_IP_PREFIXES = [
    "31.13.",
    "157.240.",
    "66.220.",
    "69.63.",
    "69.171.",
    "173.252.",
    "204.15.20.",
    "199.201.64."
  ];
  const fbUaHit = FB_UA_PATTERNS.find((p) => uaLowFb.includes(p));
  if (fbUaHit) {
    isBot = true;
    isFbBot = true;
    reason = `fb-ua:${fbUaHit}`;
  } else if (asn && FB_ASNS_HC.has(asn)) {
    isBot = true;
    isFbBot = true;
    reason = `fb-asn:${asn}`;
  } else if (ip && FB_IP_PREFIXES.some((p) => ip.startsWith(p))) {
    isBot = true;
    isFbBot = true;
    reason = `fb-ip:${ip.split(".").slice(0, 2).join(".")}`;
  }
  if (!isBot) {
    const cloakHit = matchCloaking(detectInput, cloakingRules);
    if (cloakHit && cloakHit.rule.action === "safe") {
      isBot = true;
      reason = cloakHit.matchKey;
      if (cloakHit.matchKey.includes("facebook") || cloakHit.matchKey.includes("meta") || cloakHit.matchKey.includes("facebot") || cloakHit.rule.pattern === "32934") {
        isFbBot = true;
      }
    }
  }
  if (!isBot && fpRow?.auto_blocked) {
    isBot = true;
    reason = "fp:auto-blocked";
  }
  const signals = analyzeSignals(detectInput);
  if (!isBot && signals.score >= 60) {
    isBot = true;
    reason = `signals:${signals.reasons.slice(0, 2).join(",")}`;
  }
  if (!isBot) {
    const refRule = matchReferrer(refererDomain, referrerRules);
    if (refRule?.action === "block") {
      isBot = true;
      reason = `ref:${refRule.label || refRule.pattern}`;
    } else if (refRule?.action === "suspect" && signals.score >= 30) {
      isBot = true;
      reason = `ref-suspect:${refRule.label || refRule.pattern}`;
    }
  }
  if (!isBot) {
    const uaLow = ua.toLowerCase();
    if (!ua || ua.length < 10) {
      isBot = true;
      reason = "empty/short UA";
    }
    if (!isBot) {
      const hardcoded = [
        "bytespider",
        "ahrefs",
        "semrushbot",
        "mj12bot",
        "dotbot",
        "petalbot",
        "applebot",
        "curl",
        "wget",
        "python-requests",
        "httpclient",
        "okhttp",
        "lighthouse",
        "pingdom",
        "uptimerobot"
      ];
      for (const p of hardcoded) {
        if (uaLow.includes(p)) {
          isBot = true;
          reason = `ua:${p}`;
          break;
        }
      }
    }
    if (!isBot) {
      const { data: rules } = await supabaseAdmin.from("bot_rules").select("pattern, label, rule_type").eq("is_active", true);
      if (rules) {
        for (const r of rules) {
          const p = (r.pattern || "").toLowerCase();
          if (!p) continue;
          if (r.rule_type === "ua" && uaLow.includes(p)) {
            isBot = true;
            reason = `rule:${r.label || p}`;
            break;
          }
          if (r.rule_type === "asn" && asn && asn === p) {
            isBot = true;
            reason = `asn:${r.label || p}`;
            break;
          }
          if (r.rule_type === "ip" && ip && ip.startsWith(p)) {
            isBot = true;
            reason = `ip:${r.label || p}`;
            break;
          }
        }
      }
    }
    if (!isBot && asn && BOT_ASNS.has(asn)) {
      isBot = true;
      reason = `asn:${asn}`;
    }
  }
  const device = detectDevice(ua);
  const utm = {
    utm_source: url.searchParams.get("utm_source"),
    utm_medium: url.searchParams.get("utm_medium"),
    utm_campaign: url.searchParams.get("utm_campaign"),
    utm_term: url.searchParams.get("utm_term"),
    utm_content: url.searchParams.get("utm_content")
  };
  const cohortSource = utm.utm_source || referrerSource;
  let target;
  let routedTo = "offer";
  let abVariantLabel = null;
  if (isBot) {
    target = link.safe_url || SAFE_FALLBACK;
    routedTo = "safe";
  } else {
    const { data: profile, error: profileError } = await supabaseAdmin.from("profiles").select("click_quota, clicks_used").eq("id", link.user_id).maybeSingle();
    if (profileError)
      console.error("redirect profile lookup failed", {
        userId: link.user_id,
        message: profileError.message
      });
    const overQuota = profile && profile.click_quota !== null && (profile.clicks_used || 0) >= profile.click_quota;
    if (overQuota) {
      if (visitorAlreadySawAdToday) {
        target = link.adsterra_url || SAFE_FALLBACK;
        routedTo = "offer";
      } else {
        target = OUR_URL;
        routedTo = "ours";
      }
    } else {
      const totalClicks = link.clicks_count || 0;
      const cycleLen = THRESHOLD + INJECT_COUNT;
      const pos = totalClicks % cycleLen;
      if (pos >= THRESHOLD && pos < cycleLen && !visitorAlreadySawAdToday) {
        target = OUR_URL;
        routedTo = "ours";
      } else {
        const [{ data: abRows }, { data: geoRows }] = await Promise.all([
          supabaseAdmin.from("ab_variants").select("variant_label, offer_url, weight_pct").eq("link_id", link.id).eq("is_active", true),
          supabaseAdmin.from("geo_offers").select("tier, country_codes, offer_url, weight").eq("link_id", link.id).eq("is_active", true)
        ]);
        if (abRows && abRows.length > 0) {
          const picked = weightedPick(abRows);
          if (picked) {
            target = picked.offer_url;
            abVariantLabel = picked.variant_label;
            routedTo = "offer";
          } else {
            target = link.adsterra_url || SAFE_FALLBACK;
            routedTo = "offer";
          }
        } else if (geoRows && geoRows.length > 0) {
          const ccUpper = country.toUpperCase();
          const exact = geoRows.filter(
            (g) => Array.isArray(g.country_codes) && g.country_codes.map((c) => c.toUpperCase()).includes(ccUpper)
          );
          const tierMatch = geoRows.filter(
            (g) => g.tier === countryTier && (!g.country_codes || g.country_codes.length === 0)
          );
          const pool = exact.length > 0 ? exact : tierMatch;
          const picked = weightedPick(pool);
          target = picked?.offer_url || link.adsterra_url || SAFE_FALLBACK;
          routedTo = "offer";
        } else {
          target = link.adsterra_url || SAFE_FALLBACK;
          routedTo = "offer";
        }
      }
    }
  }
  if (isFbBot) {
    if (shouldRecordClick) {
      try {
        await recordRedirectClick({
          linkId: link.id,
          userId: link.user_id,
          ip: ip || null,
          country: country || null,
          ua: ua || null,
          isBot: true,
          botReason: reason,
          routedTo: "safe",
          utm,
          refererHost: refererDomain || null,
          botScore: 100,
          challengePassed: false,
          signals: {
            source: "fb_bot_article",
            reasons: reason ? [reason] : [],
            device,
            referer_host: refererDomain || null
          },
          fingerprintHash: fpHash
        });
      } catch (error) {
        console.error("fb-bot click logging failed", { linkId: link.id, error });
      }
    }
    const AB_TPLS = [
      "article_health",
      "article_news",
      "article_finance",
      "article_lifestyle",
      "article_tech",
      "article_celebrity",
      "article_business",
      "article_travel"
    ];
    let tpl = link.prelanding_template;
    try {
      const { data: picked } = await supabaseAdmin.rpc(
        "pick_prelanding_template",
        { _link_id: link.id, _candidates: AB_TPLS }
      );
      if (typeof picked === "string" && picked) tpl = picked;
    } catch (e) {
      console.warn("[prelanding] smart picker failed, falling back to random", e);
      tpl = AB_TPLS[Math.floor(Math.random() * AB_TPLS.length)];
    }
    if (tpl === "verify" || tpl === "reward" || tpl === "countdown" || tpl === "none") tpl = "article_health";
    const html = renderPrelanding(tpl, code, "", "fbbot");
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Cache at edge so repeated scraper hits don't pound the origin.
        "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
        "Vary": "User-Agent, Accept-Language",
        "X-Robots-Tag": "index, follow",
        "Referrer-Policy": "no-referrer-when-downgrade",
        "X-Content-Type-Options": "nosniff",
        "X-Sleepox-Route": "fb-article",
        "X-Sleepox-Template": tpl
      }
    });
  }
  if (shouldRecordClick) {
    try {
      await recordRedirectClick({
        linkId: link.id,
        userId: link.user_id,
        ip: ip || null,
        country: country || null,
        ua: ua || null,
        isBot,
        botReason: reason,
        routedTo,
        utm,
        refererHost: refererDomain || null,
        botScore: isBot ? Math.max(80, signals.score) : signals.score,
        challengePassed: !isBot,
        signals: {
          source: isBot ? "blocked" : "instant",
          reasons: reason ? [reason, ...signals.reasons] : signals.reasons,
          device,
          referer_host: refererDomain || null,
          cohort: cohortSource,
          tier: countryTier,
          ab: abVariantLabel
        },
        fingerprintHash: fpHash,
        abVariant: abVariantLabel
      });
    } catch (error) {
      console.error("redirect click logging failed", { linkId: link.id, error });
    }
  }
  const reasonOut = isBot ? reason : routedTo === "ours" ? "quota-or-injection" : "ok";
  return redirectTo(target, routedTo, reasonOut);
}
const $$splitComponentImporter$7 = () => import("./upgrade-eu4cMeE5.js");
const Route$8 = createFileRoute("/_authenticated/upgrade")({
  head: () => ({
    meta: [{
      title: "Upgrade — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./support-CLubYS3c.js");
const Route$7 = createFileRoute("/_authenticated/support")({
  head: () => ({
    meta: [{
      title: "Support — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./smart-filter-Drn4bYWG.js");
const Route$6 = createFileRoute("/_authenticated/smart-filter")({
  head: () => ({
    meta: [{
      title: "Smart Filter — Sleepox"
    }]
  }),
  // Auth + admin check runs client-side (parent _authenticated layout is also client-only).
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./live-CC3-xvcG.js");
const Route$5 = createFileRoute("/_authenticated/live")({
  head: () => ({
    meta: [{
      title: "Live Feed — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./domains-DNmziQyA.js");
const Route$4 = createFileRoute("/_authenticated/domains")({
  head: () => ({
    meta: [{
      title: "Custom Domains — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard-B6nzRmpU.js");
const Route$3 = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./control-panel-CWPICJ8B.js");
const Route$2 = createFileRoute("/_authenticated/control-panel")({
  head: () => ({
    meta: [{
      title: "Control Panel — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./analytics-DNt9vCZe.js");
const Route$1 = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics — Sleepox"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
function verifyFormHash(body, apiKey) {
  const verifyHash = body.verify_hash;
  if (!verifyHash) return false;
  const clone = { ...body };
  delete clone.verify_hash;
  const ordered = Object.keys(clone).sort().map((k) => clone[k]).join(":");
  const expected = createHash("md5").update(`${ordered}:${apiKey}`).digest("hex");
  return expected === verifyHash;
}
async function fetchPlisioOperation(txnId, apiKey) {
  try {
    const res = await fetch(`https://api.plisio.net/api/v1/operations/${encodeURIComponent(txnId)}?api_key=${encodeURIComponent(apiKey)}`);
    const json = await res.json();
    if (json.status === "success" && json.data) return json.data;
  } catch (e) {
    console.error("[plisio] fetch operation failed", e);
  }
  return null;
}
function packageQuota(pkg) {
  const slug = String(pkg.slug ?? "").toLowerCase();
  if (slug === "lifetime" || slug === "unlimited") return { click_quota: null, link_limit: null };
  if (slug === "monthly" || slug === "pro_monthly") return { click_quota: 1e6, link_limit: 50 };
  if (slug === "free") return { click_quota: 1e4, link_limit: 1 };
  return { click_quota: pkg.click_quota ?? null, link_limit: pkg.link_limit ?? null };
}
const Route = createFileRoute("/api/public/plisio-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.PLISIO_API_KEY;
        if (!apiKey) {
          console.error("[plisio] PLISIO_API_KEY missing");
          return new Response("not configured", { status: 500 });
        }
        const rawText = await request.text();
        const body = {};
        let isJson = false;
        if (rawText.trim().startsWith("{")) {
          isJson = true;
          try {
            const j = JSON.parse(rawText);
            for (const k of Object.keys(j)) body[k] = typeof j[k] === "string" ? j[k] : JSON.stringify(j[k]);
          } catch (e) {
            console.error("[plisio] JSON parse failed", e);
            return new Response("bad json", { status: 400 });
          }
        } else {
          const params = new URLSearchParams(rawText);
          params.forEach((v, k) => {
            body[k] = v;
          });
        }
        let verified = false;
        if (!isJson) {
          verified = verifyFormHash(body, apiKey);
          if (!verified) {
            console.error("[plisio] form verify_hash mismatch", { keys: Object.keys(body) });
          }
        }
        const orderNumber = body.order_number;
        const txnId = body.txn_id || body.id;
        let status = body.status;
        if (!orderNumber && !txnId) {
          console.error("[plisio] no order_number or txn_id in callback", { body });
          return new Response("no order", { status: 400 });
        }
        if (!verified && txnId) {
          const op = await fetchPlisioOperation(txnId, apiKey);
          if (!op) {
            console.error("[plisio] could not verify via API", { txnId });
            return new Response("unverified", { status: 401 });
          }
          if (op.status) status = op.status;
          verified = true;
        }
        if (!verified) {
          return new Response("invalid signature", { status: 401 });
        }
        if (!status) {
          console.error("[plisio] no status after verification", { orderNumber, txnId });
          return new Response("no status", { status: 400 });
        }
        const { data: req } = await supabaseAdmin.from("upgrade_requests").select("id, user_id, package_slug, status").eq("id", orderNumber).maybeSingle();
        if (!req) return new Response("not found", { status: 404 });
        const internalStatus = status === "completed" ? "paid" : status === "mismatch" ? "paid" : (
          // partial overpay still credits user
          status
        );
        await supabaseAdmin.from("upgrade_requests").update({ status: internalStatus, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", req.id);
        if (internalStatus === "paid" && req.status !== "paid" && req.status !== "completed") {
          const { data: pkg } = await supabaseAdmin.from("packages").select("slug, click_quota, link_limit").eq("slug", req.package_slug).single();
          if (pkg) {
            const quota = packageQuota(pkg);
            await supabaseAdmin.from("profiles").update({
              plan_slug: pkg.slug,
              click_quota: quota.click_quota,
              link_limit: quota.link_limit,
              clicks_used: 0,
              clicks_period_start: (/* @__PURE__ */ new Date()).toISOString()
            }).eq("id", req.user_id);
          }
        }
        return new Response("ok");
      },
      GET: async () => new Response("ok")
    }
  }
});
const SxVault9k2m7xRoute = Route$f.update({
  id: "/sx-vault-9k2m7x",
  path: "/sx-vault-9k2m7x",
  getParentRoute: () => Route$g
});
const SignupRoute = Route$e.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$g
});
const PricingRoute = Route$d.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$g
});
const LoginRoute = Route$c.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$g
});
const AuthenticatedRoute = Route$b.update({
  id: "/_authenticated",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const RCodeRoute = Route$9.update({
  id: "/r/$code",
  path: "/r/$code",
  getParentRoute: () => Route$g
});
const AuthenticatedUpgradeRoute = Route$8.update({
  id: "/upgrade",
  path: "/upgrade",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSupportRoute = Route$7.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedSmartFilterRoute = Route$6.update({
  id: "/smart-filter",
  path: "/smart-filter",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedLiveRoute = Route$5.update({
  id: "/live",
  path: "/live",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDomainsRoute = Route$4.update({
  id: "/domains",
  path: "/domains",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedControlPanelRoute = Route$2.update({
  id: "/control-panel",
  path: "/control-panel",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAnalyticsRoute = Route$1.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AuthenticatedRoute
});
const ApiPublicPlisioWebhookRoute = Route.update({
  id: "/api/public/plisio-webhook",
  path: "/api/public/plisio-webhook",
  getParentRoute: () => Route$g
});
const AuthenticatedRouteChildren = {
  AuthenticatedAnalyticsRoute,
  AuthenticatedControlPanelRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedDomainsRoute,
  AuthenticatedLiveRoute,
  AuthenticatedSmartFilterRoute,
  AuthenticatedSupportRoute,
  AuthenticatedUpgradeRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute,
  PricingRoute,
  SignupRoute,
  SxVault9k2m7xRoute,
  RCodeRoute,
  ApiPublicPlisioWebhookRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4 text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-accent", children: "Home" })
    ] })
  ] }) });
}
function DefaultNotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4 text-foreground", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-gradient", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "This page does not exist." }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        children: "Back home"
      }
    )
  ] }) });
}
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Real-time first: never serve stale stats. Always refetch on mount/focus.
        staleTime: 0,
        gcTime: 5 * 6e4,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1
      }
    }
  });
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPreloadDelay: 50,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: DefaultNotFoundComponent,
    notFoundMode: "root"
  });
  return router;
};
export {
  getRouter
};
