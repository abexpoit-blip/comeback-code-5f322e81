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
  US: "en", GB: "en", CA: "en", AU: "en", NZ: "en", IE: "en",
  PH: "en", IN: "en", PK: "en", NG: "en", ZA: "en", KE: "en", GH: "en",
  ID: "id",
  TH: "th",
  BD: "bn",
  VN: "vi",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  MA: "ar", EG: "ar", SA: "ar", AE: "ar", DZ: "ar", TN: "ar", IQ: "ar",
};

// ------- In-memory pool cache (refreshed every CACHE_TTL) -------
type Pool = {
  byCategoryLang: Map<string, WikiUrl[]>;
  byCategory: Map<string, WikiUrl[]>;
  byLang: Map<string, WikiUrl[]>;
  all: WikiUrl[];
  lastFetch: number;
  loading: Promise<void> | null;
};

const pool: Pool = {
  byCategoryLang: new Map(),
  byCategory: new Map(),
  byLang: new Map(),
  all: [],
  lastFetch: 0,
  loading: null,
};
const CACHE_TTL = 5 * 60 * 1000;

async function refreshPool(): Promise<void> {
  const now = Date.now();
  if (now - pool.lastFetch < CACHE_TTL && pool.all.length > 0) return;
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
      const m3 = new Map<string, WikiUrl[]>();
      for (const r of rows) {
        const k1 = `${r.category}|${r.language}`;
        if (!m1.has(k1)) m1.set(k1, []);
        m1.get(k1)!.push(r);
        if (!m2.has(r.category)) m2.set(r.category, []);
        m2.get(r.category)!.push(r);
        if (!m3.has(r.language)) m3.set(r.language, []);
        m3.get(r.language)!.push(r);
      }
      pool.byCategoryLang = m1;
      pool.byCategory = m2;
      pool.byLang = m3;
      pool.all = rows;
      pool.lastFetch = now;
    } finally {
      pool.loading = null;
    }
  })();
  return pool.loading;
}

function pickRandom<T>(arr: T[]): T | null {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Smart Wikipedia URL picker with full fallback chain:
 *   1. exact category + user language
 *   2. category + English
 *   3. any language of same category
 *   4. user language, any category   (no-category links)
 *   5. English, any category
 *   6. ANY active wiki URL           (last resort)
 * Returns null ONLY when the pool is empty.
 */
export async function pickWikipediaSafeUrl(
  category: string | null | undefined,
  country: string | null | undefined,
): Promise<string | null> {
  await refreshPool();
  const lang = country ? COUNTRY_TO_WIKI_LANG[country.toUpperCase()] || "en" : "en";
  const cat = category ? String(category).toLowerCase().trim() : "";

  if (cat) {
    const exact = pickRandom(pool.byCategoryLang.get(`${cat}|${lang}`) || []);
    if (exact) return exact.url;
    if (lang !== "en") {
      const en = pickRandom(pool.byCategoryLang.get(`${cat}|en`) || []);
      if (en) return en.url;
    }
    const anyLang = pickRandom(pool.byCategory.get(cat) || []);
    if (anyLang) return anyLang.url;
  }

  // No category OR category had no matches → language pool → anything.
  const langHit = pickRandom(pool.byLang.get(lang) || []);
  if (langHit) return langHit.url;
  if (lang !== "en") {
    const enHit = pickRandom(pool.byLang.get("en") || []);
    if (enHit) return enHit.url;
  }
  const any = pickRandom(pool.all);
  return any ? any.url : null;
}

export async function listWikipediaCategories(): Promise<string[]> {
  await refreshPool();
  return Array.from(pool.byCategory.keys()).sort();
}
