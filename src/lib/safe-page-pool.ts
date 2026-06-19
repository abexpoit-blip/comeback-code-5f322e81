/**
 * Phase A: Fixed pool of 5 real Breezy pages used as safe redirects for bot
 * traffic. Sticky per visitor (fingerprint hash) + per short_code, so the
 * SAME visitor always sees the SAME page on revisit — looks like a normal
 * site, not a cloaking rotation.
 *
 * All URLs are real, SSR'd, indexed in sitemap, have reviews/schema/OG tags.
 * FB crawler follows 302 → sees legit ecommerce/blog content.
 */
export const SAFE_PAGE_POOL: readonly string[] = [
  "https://breezysocial.com/blog/magnesium-sleep-guide-2026",
  "https://breezysocial.com/shop",
  "https://breezysocial.com/faq",
  "https://breezysocial.com/size-guide",
  "https://breezysocial.com/about",
] as const;

// djb2 — fast, well-distributed string hash. Stable across processes.
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

/**
 * Deterministic pick from the safe pool.
 * Same (code, fpHash) → same URL every time (sticky).
 * Different visitors on the same code → spread across the pool.
 */
export function pickSafePageUrl(code: string, fpHash: string | null | undefined): string {
  const key = `${code}|${fpHash || "anon"}`;
  const idx = djb2(key) % SAFE_PAGE_POOL.length;
  return SAFE_PAGE_POOL[idx];
}
