#!/usr/bin/env bun
/**
 * Crawl the 5 safe pages and verify:
 *  - HTTP 200 (follows redirects)
 *  - <link rel="canonical"> present and on breezysocial.com
 *  - OpenGraph: og:title, og:description, og:url, og:image
 *  - Twitter: twitter:card, twitter:title, twitter:description
 *  - Page listed in sitemap.xml
 *
 * Usage:
 *   bun scripts/verify-safe-pages.ts
 *   bun scripts/verify-safe-pages.ts --origin https://breezysocial.com
 *
 * Exits 0 on full pass, 1 on any failure (CI-friendly).
 */
import { SAFE_PAGE_POOL } from "../src/lib/safe-page-pool";

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1] ?? "");
}
const ORIGIN = args.get("origin") || "https://breezysocial.com";
const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;

type Check = { name: string; ok: boolean; detail?: string };
type Report = { url: string; status: number | null; checks: Check[]; pass: boolean };

function extractMeta(html: string, attr: "property" | "name", key: string): string | null {
  const re = new RegExp(
    `<meta[^>]+${attr}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const m = re.exec(html);
  if (m) return m[1];
  // Try reversed attribute order
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*${attr}=["']${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
    "i",
  );
  const m2 = re2.exec(html);
  return m2 ? m2[1] : null;
}

function extractCanonical(html: string): string | null {
  const m = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html);
  return m ? m[1] : null;
}

async function fetchSitemapUrls(): Promise<Set<string>> {
  try {
    const r = await fetch(SITEMAP_URL);
    if (!r.ok) return new Set();
    const xml = await r.text();
    const urls = new Set<string>();
    const re = /<loc>([^<]+)<\/loc>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) urls.add(m[1].trim());
    return urls;
  } catch {
    return new Set();
  }
}

async function checkPage(url: string, sitemapUrls: Set<string>): Promise<Report> {
  const checks: Check[] = [];
  let status: number | null = null;
  let html = "";
  try {
    const r = await fetch(url, { redirect: "follow", headers: { "user-agent": "BreezySocial-Verify/1.0" } });
    status = r.status;
    html = await r.text();
    checks.push({ name: "HTTP 200", ok: r.ok, detail: `status ${r.status}` });
  } catch (e) {
    checks.push({ name: "HTTP 200", ok: false, detail: `fetch failed: ${(e as Error).message}` });
    return { url, status, checks, pass: false };
  }

  const canonical = extractCanonical(html);
  checks.push({
    name: "canonical present",
    ok: !!canonical && /breezysocial\.com/.test(canonical),
    detail: canonical || "missing",
  });

  for (const k of ["og:title", "og:description", "og:url", "og:image"] as const) {
    const v = extractMeta(html, "property", k);
    checks.push({ name: k, ok: !!v, detail: v ? v.slice(0, 80) : "missing" });
  }
  for (const k of ["twitter:card", "twitter:title", "twitter:description"] as const) {
    const v = extractMeta(html, "name", k);
    checks.push({ name: k, ok: !!v, detail: v ? v.slice(0, 80) : "missing" });
  }

  const inSitemap = sitemapUrls.has(url) || sitemapUrls.has(url.replace(/\/$/, ""));
  checks.push({ name: "in sitemap.xml", ok: inSitemap, detail: inSitemap ? "yes" : `not in ${SITEMAP_URL}` });

  return { url, status, checks, pass: checks.every((c) => c.ok) };
}

async function main() {
  console.log(`\nVerifying ${SAFE_PAGE_POOL.length} safe pages against ${ORIGIN}\n`);
  const sitemapUrls = await fetchSitemapUrls();
  console.log(`sitemap loaded: ${sitemapUrls.size} urls\n`);

  const reports: Report[] = [];
  for (const url of SAFE_PAGE_POOL) {
    const target = url.replace("https://breezysocial.com", ORIGIN);
    reports.push(await checkPage(target, sitemapUrls));
  }

  let failed = 0;
  for (const r of reports) {
    const mark = r.pass ? "PASS" : "FAIL";
    console.log(`[${mark}] ${r.url}  (HTTP ${r.status ?? "?"})`);
    for (const c of r.checks) {
      const m = c.ok ? "  ok  " : " FAIL ";
      console.log(`   [${m}] ${c.name.padEnd(22)} ${c.detail ?? ""}`);
    }
    if (!r.pass) failed++;
    console.log("");
  }

  console.log(`Summary: ${reports.length - failed}/${reports.length} passed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("verify-safe-pages crashed:", e);
  process.exit(2);
});
