// Prelanding HTML templates.
//
// Primary use: served to Facebook crawler (facebookexternalhit / meta-*)
// at 200 OK so Meta's ad review sees a real article with OG tags and approves
// the ad. Real humans get an INSTANT 302 to the offer (no wait, no challenge)
// so we don't burn paid Facebook traffic.
//
// 8 premium article variants + 3 legacy challenge templates.

export type PrelandingTemplate =
  | "verify"
  | "reward"
  | "countdown"
  | "article"
  | "article_health"
  | "article_news"
  | "article_finance"
  | "article_lifestyle"
  | "article_tech"
  | "article_celebrity"
  | "article_business"
  | "article_travel";

export type RenderMode = "human" | "fbbot";

export const ARTICLE_TEMPLATES: PrelandingTemplate[] = [
  "article_health", "article_news", "article_finance", "article_lifestyle",
  "article_tech", "article_celebrity", "article_business", "article_travel",
];

export const TEMPLATE_OPTIONS: { value: PrelandingTemplate; label: string; group: string }[] = [
  { value: "article_health", label: "Health & Wellness", group: "Article (FB-safe)" },
  { value: "article_news", label: "Breaking News", group: "Article (FB-safe)" },
  { value: "article_finance", label: "Finance & Money", group: "Article (FB-safe)" },
  { value: "article_lifestyle", label: "Lifestyle", group: "Article (FB-safe)" },
  { value: "article_tech", label: "Technology", group: "Article (FB-safe)" },
  { value: "article_celebrity", label: "Celebrity & Entertainment", group: "Article (FB-safe)" },
  { value: "article_business", label: "Business", group: "Article (FB-safe)" },
  { value: "article_travel", label: "Travel", group: "Article (FB-safe)" },
  { value: "verify", label: "Verify (challenge)", group: "Legacy" },
  { value: "reward", label: "Reward (challenge)", group: "Legacy" },
  { value: "countdown", label: "Countdown (challenge)", group: "Legacy" },
  { value: "article", label: "Generic Article", group: "Legacy" },
];

// ---------- Article content ----------
type ArticleContent = {
  title: string;
  description: string;
  category: string;
  author: string;
  heroImage: string;
  intro: string;
  paragraphs: string[];
  highlights: string[];
  related: { title: string; img: string }[];
};

const RELATED_POOL = [
  { title: "5 Habits That Will Transform Your Mornings", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=70" },
  { title: "Why Experts Say This Trend Is Here to Stay", img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=400&q=70" },
  { title: "The Surprising Truth Most People Miss", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=70" },
  { title: "What Doctors Wish You Knew Sooner", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=70" },
];

const ARTICLES: Record<string, ArticleContent> = {
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
      "Natural light exposure is the second pillar. Just 5-10 minutes of morning sunlight regulates your circadian rhythm, suppresses melatonin, and triggers cortisol — the natural 'wake up' hormone. No sunlight? A 10,000-lux therapy lamp works just as well.",
    ],
    highlights: ["Drink water before coffee", "Get 5-10 min of morning sunlight", "Eat protein within 60 minutes", "Move your body for 2 minutes", "Skip the phone for the first 30 min"],
    related: RELATED_POOL.slice(0, 3),
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
      "Below we have summarized the key facts you need to know, including who qualifies, what you can receive, and how to apply.",
    ],
    highlights: ["Applications open now", "Approval in 3-7 days", "No fees required", "Limited capacity in some regions"],
    related: RELATED_POOL.slice(1, 4),
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
      "Here is what financial experts are recommending in 2026, plus the questions you should ask before switching accounts.",
    ],
    highlights: ["Up to 5% APY available", "FDIC insured", "No monthly fees", "Withdraw anytime"],
    related: RELATED_POOL.slice(0, 3),
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
      "Below we break down each step, plus the simple tweaks that make the biggest difference.",
    ],
    highlights: ["Fall asleep 40% faster", "No apps or gear needed", "Works in 10 minutes", "Backed by sleep research"],
    related: RELATED_POOL.slice(1, 4),
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
      "We break down the exact tool stack the top 1% of AI users rely on, plus the prompts and workflows that produce reliable results.",
    ],
    highlights: ["Save 10+ hours per week", "Free tiers available", "No coding required", "Works on phone and desktop"],
    related: RELATED_POOL.slice(0, 3),
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
      "Here's the full breakdown of the routine, plus what nutritionists and therapists say about why it works so well.",
    ],
    highlights: ["Free and takes 15 minutes", "Recommended by therapists", "Trending across social media", "No equipment needed"],
    related: RELATED_POOL.slice(1, 4),
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
      "We break down the four most replicable models — including exact monthly revenue ranges, time investment, and the tools the top earners use.",
    ],
    highlights: ["Start with under $100", "Works alongside a full-time job", "No special skills required", "Results in 60-90 days"],
    related: RELATED_POOL.slice(0, 3),
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
      "Below we walk through the exact step-by-step approach, including the free tools the top deal-hunters use every day.",
    ],
    highlights: ["Save 50-70% on flights", "Works without miles or status", "Free tools only", "Used by 10,000+ travelers"],
    related: RELATED_POOL.slice(1, 4),
  },
};

// ---------- OG variants (per template, picked deterministically by short_code) ----------
// 3 variants per template × 8 templates = 24 unique FB previews. Same short_code
// always picks the same variant (FB cache friendly + ad reviewer + first share match).
type OgVariant = { title: string; description: string; heroImage: string };

const VARIANTS: Record<string, OgVariant[]> = {
  article_health: [
    { title: "7 Morning Habits That Boost Your Energy All Day (Doctors Approve)",
      description: "Discover the simple morning routine doctors recommend to feel energized, focused, and stress-free.",
      heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=75" },
    { title: "The 5-Minute Morning Routine That Doubled My Energy in 2 Weeks",
      description: "Backed by neuroscience — this simple habit stack is changing how thousands start their day.",
      heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=75" },
    { title: "Why You Feel Tired By 10 AM (And The Fix Doctors Recommend)",
      description: "68% of adults report low energy within hours of waking. Here's the science-backed reason — and the simple solution.",
      heroImage: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_news: [
    { title: "Breaking: New Government Program Offers Unexpected Benefits to Citizens",
      description: "A new initiative announced this week could change how millions access essential services. Here's what you need to know.",
      heroImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75" },
    { title: "Just Announced: Eligible Residents Can Now Claim This Hidden Benefit",
      description: "Quietly approved last month — and rolling out nationwide. Most people still don't know they qualify.",
      heroImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=75" },
    { title: "Officials Confirm: Millions May Be Eligible Under New 2026 Program",
      description: "Industry analysts call it one of the biggest policy shifts in years. Approvals are happening in days.",
      heroImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_finance: [
    { title: "How Smart Savers Are Earning 5x More on Their Money in 2026",
      description: "Financial experts reveal the simple strategy helping everyday people grow savings faster than ever.",
      heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75" },
    { title: "Your Bank Is Quietly Paying You 0.01% — Here's Where Smart Money Goes Instead",
      description: "Some accounts now pay 50–100x more interest. Most people have never heard of them.",
      heroImage: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&w=1200&q=75" },
    { title: "The Quiet 2026 Shift That's Making Everyday Savers Thousands Richer",
      description: "Up to 5% APY, FDIC insured, withdraw anytime. Here's the playbook financial planners use themselves.",
      heroImage: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_lifestyle: [
    { title: "The 10-Minute Evening Routine That Changed Thousands of Lives",
      description: "A simple bedtime habit helping people sleep better, wake up refreshed, and feel happier — for free.",
      heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=75" },
    { title: "Sleep Researchers Say This 10-Minute Habit Beats Any Sleep App",
      description: "Fall asleep 40% faster — no apps, no supplements, no special gear. Just 10 minutes before bed.",
      heroImage: "https://images.unsplash.com/photo-1455642305367-68834a9c4cee?auto=format&fit=crop&w=1200&q=75" },
    { title: "I Tried This Bedtime Routine for 30 Days — Here's What Happened",
      description: "Thousands report less anxiety, more energy, and noticeably better mornings. The catch? It costs nothing.",
      heroImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_tech: [
    { title: "This New AI Tool Is Quietly Replacing Hours of Daily Work",
      description: "Professionals are using a free AI assistant to automate the most tedious parts of their job.",
      heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=75" },
    { title: "The AI Workflow Stack That's Saving Professionals 10+ Hours a Week",
      description: "Stop using one general AI for everything. Top users stack 2–3 specialized tools — and most are free.",
      heroImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=75" },
    { title: "Forget ChatGPT Basics — This Is What Power Users Actually Do Daily",
      description: "We interviewed 40 professionals who save 10+ hours weekly. The pattern is surprisingly simple.",
      heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_celebrity: [
    { title: "Hollywood Star's Surprising Daily Habit Has Fans Buzzing",
      description: "The A-list actor revealed an unexpected morning routine — and the internet cannot stop talking about it.",
      heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=75" },
    { title: "Oscar Nominee Reveals The Daily Ritual Fans Are Now Copying",
      description: "It takes 15 minutes, costs nothing, and therapists are quietly endorsing it. Here's the breakdown.",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=75" },
    { title: "\"I Wish I'd Started Sooner\" — The Celebrity Habit Going Viral on TikTok",
      description: "Wellness experts agree on why it works. Anyone can do it. Here's exactly what the star does each day.",
      heroImage: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_business: [
    { title: "How Side Hustlers Are Quietly Earning $3,000+ Per Month Online",
      description: "A new generation of solo entrepreneurs is building income streams that didn't exist five years ago.",
      heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=75" },
    { title: "The Laptop Side Hustle Playbook Earning Beginners $3K–$10K/Month",
      description: "Under $100 to start, no special skills, works alongside a full-time job. Results in 60–90 days.",
      heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=75" },
    { title: "We Surveyed 200 Side Hustlers — Here's What The Top Earners All Do",
      description: "No audience, no tech skills, no startup cash. Just the right stack. Here's the exact formula.",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_travel: [
    { title: "The Hidden Travel Hack That Saves Frequent Flyers Thousands",
      description: "A little-known booking strategy is helping savvy travelers cut flight costs by up to 70%.",
      heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75" },
    { title: "Why Smart Travelers Stopped Booking Flights The \"Normal\" Way in 2026",
      description: "Same seat, 50–70% cheaper. No miles, no status, no shady tricks. Just smarter searches.",
      heroImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=75" },
    { title: "The Free Tools 10,000+ Travelers Use to Book Half-Price Flights",
      description: "Airline pricing swings 200–400% based on the day and device. Here's how to consistently land the low.",
      heroImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=75" },
  ],
};

// djb2 hash — stable across processes (don't use Math.random; would break across PM2 workers)
function hashCode(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

// Deterministically pick OG variant for this short_code. Same code → same variant.
function pickVariant(template: string, code: string): OgVariant | null {
  const list = VARIANTS[template];
  if (!list || list.length === 0) return null;
  return list[hashCode(`${template}:${code}`) % list.length];
}

// Deterministically pick which article template a short_code uses across all
// article templates. Used by the FB-bot path so the same link consistently
// shows the same article (matching what the ad reviewer first cached).
export function pickArticleTemplateForCode(code: string): PrelandingTemplate {
  const list = ARTICLE_TEMPLATES;
  return list[hashCode(`tpl:${code}`) % list.length];
}

// ---------- Premium article HTML ----------
function articleHtml(baseContent: ArticleContent, templateKey: string, code: string, _token: string, mode: RenderMode): string {
  // Deterministically swap OG title/description/heroImage for this short_code so
  // different links → different FB previews while the same link stays stable
  // (matches whatever the FB reviewer first cached).
  const variant = pickVariant(templateKey, code);
  const content: ArticleContent = variant
    ? { ...baseContent, title: variant.title, description: variant.description, heroImage: variant.heroImage }
    : baseContent;
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const initials = content.author.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  // For FB bot keep robots-friendly. For (rare) human fallback, no-index.
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
    <a href="#" class="tag">#${content.category.toLowerCase().replace(/[^a-z]/g,"")}</a>
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

// ---------- Public API ----------
export function renderPrelanding(
  template: PrelandingTemplate,
  code: string,
  token: string,
  mode: RenderMode = "fbbot",
): string {
  // Article variant — pick by name
  if (template in ARTICLES) return articleHtml(ARTICLES[template], code, token, mode);
  // Generic "article" or legacy templates → default to health (best safe content)
  return articleHtml(ARTICLES.article_health, code, token, mode);
}

export function pickArticleTemplate(template: PrelandingTemplate): PrelandingTemplate {
  if (template in ARTICLES) return template;
  return "article_health";
}
