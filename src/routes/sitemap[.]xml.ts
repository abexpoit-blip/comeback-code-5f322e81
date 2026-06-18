// Dynamic sitemap.xml — lists every active short link as a clean URL
// (https://{host}/{code}, no /r/ prefix) so search engines index the
// prelanding pages users actually share. The list rebuilds on every
// request, so newly-created codes appear automatically — no manual
// regen needed.
//
// Host-aware: sleepox.com/sitemap.xml lists sleepox.com URLs,
// breezysocial.com/sitemap.xml lists breezysocial.com URLs. This matches
// Google's "same host" rule (a sitemap can only list URLs on the same
// host it's served from).
import { createFileRoute } from "@tanstack/react-router";

// Public marketing routes (indexable). Internal/auth routes stay
// excluded via robots.txt.
const STATIC_PATHS: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/login", changefreq: "yearly", priority: "0.3" },
  { path: "/signup", changefreq: "yearly", priority: "0.3" },
];

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Build the public origin from forwarded headers so the
        // sitemap reflects the host the crawler actually hit (not the
        // upstream localhost behind nginx).
        const fwdHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "sleepox.com";
        const fwdProto = (request.headers.get("x-forwarded-proto") || "https").split(",")[0].trim();
        const origin = `${fwdProto}://${fwdHost.split(",")[0].trim()}`;

        // Pull every active short code. Admin client is fine here —
        // we only project the public `short_code` + timestamp columns,
        // never PII or destination URLs.
        let codes: Array<{ short_code: string; updated_at: string | null; created_at: string | null }> = [];
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("links")
            .select("short_code, updated_at, created_at")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(50000); // sitemap.xml hard cap is 50k URLs
          codes = (data || []) as typeof codes;
        } catch (e) {
          // Sitemap must never 500 — degrade to static-only.
          console.error("sitemap: links query failed", e);
        }

        const urls: string[] = [];

        for (const s of STATIC_PATHS) {
          urls.push(
            [
              "  <url>",
              `    <loc>${xmlEscape(origin + s.path)}</loc>`,
              `    <changefreq>${s.changefreq}</changefreq>`,
              `    <priority>${s.priority}</priority>`,
              "  </url>",
            ].join("\n"),
          );
        }

        for (const row of codes) {
          const lastmod = (row.updated_at || row.created_at || "").slice(0, 10);
          urls.push(
            [
              "  <url>",
              `    <loc>${xmlEscape(`${origin}/${row.short_code}`)}</loc>`,
              lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
              "    <changefreq>weekly</changefreq>",
              "    <priority>0.6</priority>",
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
          );
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            // 15-min edge cache — new codes show up within 15 min,
            // Google re-fetches roughly daily anyway.
            "cache-control": "public, max-age=900, s-maxage=900",
            "x-sleepox-route": "sitemap",
          },
        });
      },
    },
  },
});
