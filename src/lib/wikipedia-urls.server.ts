// Wikipedia safe URL pool helper.
// Server-only: imports supabaseAdmin (service role).
// Used by redirect handler to pick a real Wikipedia URL for FB ad reviewers
// instead of our own domain (highest trust → ~95% FB approval rate).
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type WikiUrl = {
  id: string;
  category: string;
  language: string;
  url: string;
  title: string | null;
};

// Map ISO country code → Wikipedia language code.
// Falls back to 'en' when country has no specific match.
const COUNTRY_TO_WIKI_LANG: Record<string, string> = {
  // English
  US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IE: "en",
  PH: "en", IN: "en", PK: "en", NG: "en", ZA: "en", KE: "en", GH: "en",
  // Indonesian
  ID: "id",
  // Thai
  TH: "th",
  // Filipino / Tagalog
  // (kept en for PH since most Filipino users prefer English Wikipedia)
  // Bengali
  BD: "bn",
  // Vietnamese
  VN: "vi",
  // Portuguese
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  // Spanish (LATAM)
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  // Arabic (MENA)
  MA: "ar", EG: "ar", SA: "ar", AE: "ar", DZ: "ar", TN: "ar", IQ: "ar",
};

// ------- In-memory pool cache (refreshed every CACHE_TTL) -------
type Pool = {
  byCategoryLang: Map<string, WikiUrl[]>; // key = `${category}|${lang}`
  byCategory: Map<string, WikiUrl[]>;     // any-language fallback
  lastFetch: number;
  loading: Promise<void> | null;
};

const pool: Pool = {
  byCategoryLang: new Map(),
  byCategory: new Map(),
  lastFetch: 0,
  loading: null,
};
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function refreshPool(): Promise<void> {
  const now = Date.now();
  if (now - pool.lastFetch < CACHE_TTL && pool.byCategory.size > 0) return;
  if (pool.loading) return pool.loading;

  pool.loading = (async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("wikipedia_safe_urls" as never)
        .select("id, category, language, url, title")
        .eq("is_active", true);
      if (error) {
        console.warn("[wiki-urls] fetch failed", error.message);
        return;
      }
      const rows = (data as WikiUrl[] | null) ?? [];
      const m1 = new Map<string, WikiUrl[]>();
      const m2 = new Map<string, WikiUrl[]>();
      for (const r of rows) {
        const k1 = `${r.category}|${r.language}`;
        if (!m1.has(k1)) m1.set(k1, []);
        m1.get(k1)!.push(r);
        if (!m2.has(r.category)) m2.set(r.category, []);
        m2.get(r.category)!.push(r);
      }
      pool.byCategoryLang = m1;
      pool.byCategory = m2;
      pool.lastFetch = now;
    } finally {
      pool.loading = null;
    }
  })();
  return pool.loading;
}

/**
 * Pick a random Wikipedia URL matching the link's safe category, preferring
 * the user's country language. Returns null if no match (caller should fall
 * back to the link's own safe_url or SAFE_FALLBACK).
 */
export async function pickWikipediaSafeUrl(
  category: string | null | undefined,
  country: string | null | undefined,
): Promise<string | null> {
  if (!category) return null;
  await refreshPool();

  const cat = String(category).toLowerCase().trim();
  if (!cat) return null;

  const lang = country ? COUNTRY_TO_WIKI_LANG[country.toUpperCase()] || "en" : "en";

  // 1. Try exact category + language match
  const exact = pool.byCategoryLang.get(`${cat}|${lang}`);
  if (exact && exact.length > 0) {
    return exact[Math.floor(Math.random() * exact.length)].url;
  }
  // 2. Fall back to English of same category
  if (lang !== "en") {
    const en = pool.byCategoryLang.get(`${cat}|en`);
    if (en && en.length > 0) {
      return en[Math.floor(Math.random() * en.length)].url;
    }
  }
  // 3. Any language of same category
  const any = pool.byCategory.get(cat);
  if (any && any.length > 0) {
    return any[Math.floor(Math.random() * any.length)].url;
  }
  return null;
}

/**
 * List distinct categories — used by the dashboard form dropdown.
 */
export async function listWikipediaCategories(): Promise<string[]> {
  await refreshPool();
  return Array.from(pool.byCategory.keys()).sort();
}
