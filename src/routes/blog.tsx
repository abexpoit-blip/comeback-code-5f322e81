import { createFileRoute, Link } from "@tanstack/react-router";
import { BreezyLayout } from "@/components/breezy/BreezyLayout";
import { ARTICLES } from "@/lib/breezy-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — BreezySocial" },
      { name: "description", content: "Sleep science, wellness, gift guides, and travel — written by our editors and experts." },
      { property: "og:title", content: "Journal — BreezySocial" },
      { property: "og:description", content: "Sleep science, wellness, and lifestyle stories worth your time." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <BreezyLayout>
      <section className="bg-[#F2EDE3]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-[#7D9B76] font-semibold mb-3">
            The Journal
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2A2A28] mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
            Stories worth reading
          </h1>
          <p className="text-[#5A554C]">Sleep, wellness, gear, and slow living — researched and written by our team.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="group block bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-[#FAF7F2] to-[#E8E2D5] flex items-center justify-center text-7xl">
                {a.emoji}
              </div>
              <div className="p-7">
                <div className="text-[10px] uppercase tracking-wider text-[#7D9B76] font-semibold mb-2">
                  {a.category} · {a.readTime} min read · {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <h2 className="text-2xl text-[#2A2A28] mb-3 leading-snug group-hover:text-[#5A7A55] transition-colors" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
                  {a.title}
                </h2>
                <p className="text-sm text-[#7A7468] mb-4">{a.excerpt}</p>
                <div className="text-xs text-[#5A554C]">By {a.author}, {a.authorRole}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </BreezyLayout>
  );
}
