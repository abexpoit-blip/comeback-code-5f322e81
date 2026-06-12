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
    title: "Simple Morning Stretches That Help You Start the Day Feeling Good",
    description: "A gentle stretching sequence many people enjoy in the morning to feel more comfortable and ready for the day.",
    category: "Wellness",
    author: "Sarah Mitchell",
    heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=75",
    intro: "A short stretching routine after waking up is something many people find enjoyable. It does not require equipment, gym membership, or any special skill — just a few minutes of quiet movement.",
    paragraphs: [
      "Stretching in the morning has been part of daily life across many cultures for a long time. From traditional yoga in India to qigong in China, gentle morning movement is a familiar idea around the world.",
      "A typical sequence might include a slow neck roll, a seated forward fold, a gentle side stretch, and a few deep breaths. The whole thing can take five to ten minutes and works just as well next to your bed as on a yoga mat.",
      "Many people pair their stretches with a glass of water and a few minutes of quiet time before checking their phone. Others enjoy doing the routine with their partner, a child, or a pet nearby.",
      "Below is a simple sequence you can try at your own pace. Move slowly, breathe deeply, and stop anything that feels uncomfortable.",
    ],
    highlights: ["Takes 5 to 10 minutes", "No equipment needed", "Can be done at home", "Easy to adjust to your pace"],
    related: RELATED_POOL.slice(0, 3),
  },
  article_news: {
    title: "Community Library Adds Weekend Reading Programs for Families",
    description: "Local libraries continue to expand free weekend activities for readers of all ages, including story hours and book clubs.",
    category: "Community",
    author: "Michael Reynolds",
    heroImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75",
    intro: "Public libraries in many cities have been quietly expanding their weekend programming for families, offering story hours, craft sessions, and casual book clubs that anyone can join.",
    paragraphs: [
      "Weekend reading programs have grown in popularity as more families look for low-cost activities they can do together. Most libraries publish their schedules online and welcome walk-in visitors.",
      "Story hours are typically aimed at younger children, with librarians reading picture books and leading simple craft activities. Older children often enjoy themed book clubs that read one short novel together over a few weeks.",
      "Adult reading circles are also common. These groups usually meet once or twice a month, choose a book by vote, and discuss it over coffee. New members are almost always welcome.",
      "If you are curious about what your local library offers, the easiest first step is to drop by and ask at the front desk, or browse their events calendar online.",
    ],
    highlights: ["Free to attend", "Programs for all ages", "Walk-ins welcome at most branches", "Schedules posted online"],
    related: RELATED_POOL.slice(1, 4),
  },
  article_finance: {
    title: "A Simple Way to Organize Your Monthly Household Budget",
    description: "A clear, no-frills approach to writing down what you earn and what you spend each month, used by many families.",
    category: "Personal Budgeting",
    author: "Emma Carter",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75",
    intro: "Keeping track of household spending does not require an app, a spreadsheet, or any financial background. Many families use a simple notebook system that takes only a few minutes a week.",
    paragraphs: [
      "The idea is straightforward: write down what comes in and what goes out, in clear categories. Over a few months, patterns start to appear, and small adjustments become easier to make.",
      "Common categories include rent or mortgage, utilities, groceries, transportation, and a small amount for entertainment. Some people add a separate line for unexpected expenses like repairs.",
      "Reviewing the notebook once a week, perhaps on a Sunday evening, is enough for most households. The point is awareness, not perfection.",
      "Below is a sample layout you can copy into your own notebook to get started this weekend.",
    ],
    highlights: ["Pen and paper is enough", "Takes a few minutes per week", "Easy for the whole family to follow", "No apps required"],
    related: RELATED_POOL.slice(0, 3),
  },
  article_lifestyle: {
    title: "A Calm Evening Routine That Many People Find Relaxing",
    description: "Simple end-of-day habits that help you wind down before bed, drawn from common practices around the world.",
    category: "Lifestyle",
    author: "Jessica Tan",
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=75",
    intro: "The last hour of the day shapes how relaxed you feel before sleep. A short, calm routine — done at your own pace — can make evenings feel a little more peaceful.",
    paragraphs: [
      "Many people enjoy a quiet evening that includes tidying up a small space, preparing tomorrow's clothes, and dimming the lights about an hour before bed.",
      "Some add a cup of caffeine-free tea, a few pages of a book, or quiet music. Others prefer silence, journaling, or a short walk around the block.",
      "The exact ingredients matter less than the consistency. Doing roughly the same calm things each night helps the evening feel familiar and unhurried.",
      "Below are a few simple ideas to mix and match into a routine that fits your home and schedule.",
    ],
    highlights: ["Works in any home", "No cost involved", "Easy to adjust", "Suits most schedules"],
    related: RELATED_POOL.slice(1, 4),
  },
  article_tech: {
    title: "Beginner-Friendly Apps for Keeping Notes and To-Do Lists",
    description: "A look at a few popular free note-taking apps and how everyday people use them to stay organized.",
    category: "Technology",
    author: "David Park",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=75",
    intro: "Note-taking apps have become a normal part of daily life — for shopping lists, recipes, work notes, or simply remembering ideas. There are now plenty of beginner-friendly options that cost nothing to try.",
    paragraphs: [
      "Most modern note apps work on both phones and computers and keep your notes in sync. That means a list you start on your phone in the kitchen is ready on your laptop later.",
      "Common features include simple folders, checklists, and the ability to add photos. Most apps have a generous free tier that is enough for everyday use at home.",
      "If you are new to digital notes, the easiest starting point is a single notebook for everything — groceries, ideas, reminders — and then split it later as you find what works for you.",
      "Below is a short overview of a few well-known free apps and the kinds of people who tend to enjoy each one.",
    ],
    highlights: ["Free options available", "Works on phone and computer", "Beginner-friendly", "Useful for daily lists"],
    related: RELATED_POOL.slice(0, 3),
  },
  article_celebrity: {
    title: "Why Cozy Book Recommendations Are Trending This Season",
    description: "Readers are sharing their favorite comfort reads online, sparking new interest in older novels and short story collections.",
    category: "Books & Reading",
    author: "Sophia Bennett",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=75",
    intro: "Cozy reading lists have been popping up everywhere online this season — from short story collections to gentle novels readers describe as a warm cup of tea in book form.",
    paragraphs: [
      "Book communities on social platforms have leaned into the idea of comfort reading: stories with kind characters, low-stakes plots, and a strong sense of place. Many of the most-shared titles are older books rediscovered by new readers.",
      "Public libraries report a quiet uptick in requests for these gentle reads, and a number of independent bookshops have started displaying them on dedicated tables near the entrance.",
      "Popular themes include small-town life, food and cooking, gardening, and friendship across generations. Many of the books are short enough to finish in a weekend.",
      "Below are a few categories worth exploring if you are looking for your next quiet read.",
    ],
    highlights: ["Easy to borrow from libraries", "Short and gentle reads", "Great for weekends", "Wide range of styles"],
    related: RELATED_POOL.slice(1, 4),
  },
  article_business: {
    title: "Time-Management Habits Many Remote Workers Find Helpful",
    description: "Simple daily habits that many people who work from home use to stay focused and end the day on time.",
    category: "Work & Career",
    author: "Marcus Lee",
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=75",
    intro: "Working from home gives a lot of flexibility, but it can also make the day feel a little blurry. A few simple habits help many remote workers separate work from rest.",
    paragraphs: [
      "Starting the day with a short walk, even a few minutes around the block, acts as a kind of commute. It signals that the workday is beginning and helps you settle in when you sit down at your desk.",
      "Time blocking is another common habit. Many people sketch out their day in rough blocks — focused work in the morning, meetings in the afternoon, a clear stop time — without trying to plan every minute.",
      "Taking a real lunch break, away from the desk, helps the afternoon feel less heavy. Closing the laptop at a regular time each evening helps the boundary between work and home stay clear.",
      "Below is a small sample of routines that real remote workers describe as part of a good day.",
    ],
    highlights: ["Works in any home setup", "No special tools needed", "Easy to adjust over time", "Helps end the day on time"],
    related: RELATED_POOL.slice(0, 3),
  },
  article_travel: {
    title: "A Beginner's Guide to Planning a Relaxed Weekend Trip",
    description: "Practical, no-stress tips for putting together a short weekend trip close to home, without overpacking the schedule.",
    category: "Travel",
    author: "Olivia Brooks",
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75",
    intro: "A short weekend trip does not have to involve flights, complicated planning, or a long packing list. Some of the most enjoyable trips happen within a couple of hours of home.",
    paragraphs: [
      "A relaxed weekend often works best with one main destination and a couple of soft ideas — a cafe, a park, a small museum — rather than a packed schedule.",
      "Picking a place you can reach in two or three hours keeps travel time short and leaves more of the weekend for the actual trip. Trains, buses, and short drives all work well.",
      "Packing light is part of the relaxation. A small bag with a change of clothes, a book, a refillable water bottle, and a basic toiletry kit covers most short trips.",
      "Below is a simple checklist you can adapt for your own weekend, whether you are travelling solo, with a partner, or with family.",
    ],
    highlights: ["Close-to-home destinations", "Easy packing list", "Flexible schedule", "Works for solo or family trips"],
    related: RELATED_POOL.slice(1, 4),
  },
};

// ---------- OG variants (per template, picked deterministically by short_code) ----------
// 3 variants per template × 8 templates = 24 unique FB previews. Same short_code
// always picks the same variant (FB cache friendly + ad reviewer + first share match).
type OgVariant = { title: string; description: string; heroImage: string };

const VARIANTS: Record<string, OgVariant[]> = {
  article_health: [
    { title: "Simple Morning Stretches That Help You Start the Day Feeling Good",
      description: "A gentle stretching sequence many people enjoy in the morning to feel a little more comfortable.",
      heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=75" },
    { title: "A Short Stretching Routine You Can Do Next to Your Bed",
      description: "Five to ten minutes of gentle movement, no equipment needed, suitable for most home settings.",
      heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=75" },
    { title: "Calm Morning Habits Many People Around the World Enjoy",
      description: "Looking at simple morning routines from different cultures and how everyday people adapt them at home.",
      heroImage: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_news: [
    { title: "Community Library Adds Weekend Reading Programs for Families",
      description: "Local libraries continue to expand free weekend activities for readers of all ages.",
      heroImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=75" },
    { title: "Free Weekend Story Hours and Book Clubs at Your Local Library",
      description: "An overview of family-friendly library programming and how to find a schedule near you.",
      heroImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=75" },
    { title: "How Reading Circles Bring Neighbors Together on Weekends",
      description: "A friendly look at adult and family reading groups in public libraries across many cities.",
      heroImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_finance: [
    { title: "A Simple Way to Organize Your Monthly Household Budget",
      description: "A clear, no-frills approach to writing down what you earn and what you spend each month.",
      heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=75" },
    { title: "Pen-and-Paper Budgeting: A Calm Way to Track Spending",
      description: "Many families use a simple notebook to keep an eye on monthly spending without any apps.",
      heroImage: "https://images.unsplash.com/photo-1579621970590-9d624316904b?auto=format&fit=crop&w=1200&q=75" },
    { title: "A Sunday Evening Habit That Helps With Household Planning",
      description: "A few quiet minutes once a week is often enough to keep household spending notes up to date.",
      heroImage: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_lifestyle: [
    { title: "A Calm Evening Routine That Many People Find Relaxing",
      description: "Simple end-of-day habits that help you wind down before bed, drawn from common everyday practices.",
      heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=75" },
    { title: "Small Bedtime Habits That Make Evenings Feel Peaceful",
      description: "A short collection of low-key habits — tea, a book, dim lights — that many people enjoy at night.",
      heroImage: "https://images.unsplash.com/photo-1455642305367-68834a9c4cee?auto=format&fit=crop&w=1200&q=75" },
    { title: "A Gentle End-of-Day Routine You Can Adjust to Your Schedule",
      description: "Mix-and-match ideas for a quiet hour before bed that fits any home and any lifestyle.",
      heroImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_tech: [
    { title: "Beginner-Friendly Apps for Keeping Notes and To-Do Lists",
      description: "A look at a few popular free note-taking apps and how everyday people use them at home.",
      heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=75" },
    { title: "Simple Ways to Keep Shopping Lists and Reminders on Your Phone",
      description: "An overview of common note apps that work on both phone and computer, with no learning curve.",
      heroImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=75" },
    { title: "A Friendly Guide to Free Note Apps for Everyday Life",
      description: "Picking a beginner-friendly app for groceries, recipes, and small reminders around the home.",
      heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_celebrity: [
    { title: "Why Cozy Book Recommendations Are Trending This Season",
      description: "Readers are sharing their favorite comfort reads online, sparking new interest in gentle novels.",
      heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=75" },
    { title: "Comfort Reading Lists That Book Clubs Are Talking About",
      description: "A look at the kinds of warm, low-stakes stories people are recommending to each other this season.",
      heroImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=75" },
    { title: "Short, Gentle Novels Worth Borrowing From the Library",
      description: "A friendly roundup of cozy book categories you can find on the shelves at your local library.",
      heroImage: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_business: [
    { title: "Time-Management Habits Many Remote Workers Find Helpful",
      description: "Simple daily habits that many work-from-home professionals use to stay focused without overworking.",
      heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=75" },
    { title: "Small Daily Routines That Make Working From Home Easier",
      description: "A look at the morning walks, time blocks, and stop-time habits remote workers commonly use.",
      heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=75" },
    { title: "How Remote Workers Keep Work and Home Life Separate",
      description: "Friendly ideas for starting the day, taking lunch breaks, and signing off on time at home.",
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=75" },
  ],
  article_travel: [
    { title: "A Beginner's Guide to Planning a Relaxed Weekend Trip",
      description: "Practical, no-stress tips for putting together a short weekend trip close to home.",
      heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75" },
    { title: "Short Weekend Getaways You Can Plan in One Evening",
      description: "Simple ideas for a relaxed weekend within a couple of hours of home, with a light packing list.",
      heroImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=75" },
    { title: "Friendly Tips for a Calm, Easy-Going Weekend Trip",
      description: "Pick one destination, pack light, leave room in the schedule — a calm guide to short trips.",
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
  if (template in ARTICLES) return articleHtml(ARTICLES[template], template, code, token, mode);
  // Generic "article" or legacy templates → default to health (best safe content)
  return articleHtml(ARTICLES.article_health, "article_health", code, token, mode);
}

export function pickArticleTemplate(template: PrelandingTemplate): PrelandingTemplate {
  if (template in ARTICLES) return template;
  return "article_health";
}
