import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BreezyLayout } from "@/components/breezy/BreezyLayout";
import { ProductCard } from "@/components/breezy/ProductCard";
import { getArticle, getProduct, SITE } from "@/lib/breezy-data";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Article not found — BreezySocial" }] };
    return {
      meta: [
        { title: `${a.title} — BreezySocial` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "article:author", content: a.author },
        { property: "article:published_time", content: a.date },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            author: { "@type": "Person", name: a.author, jobTitle: a.authorRole },
            publisher: { "@type": "Organization", name: SITE.name, url: "https://breezysocial.com" },
            datePublished: a.date,
            mainEntityOfPage: `https://breezysocial.com/blog/${params.slug}`,
          }),
        },
      ],
    };
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <BreezyLayout>
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>Article not found</h1>
        <Link to="/blog" className="text-[#5A7A55] hover:underline">← Back to journal</Link>
      </div>
    </BreezyLayout>
  ),
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const related = a.relatedProducts.map(getProduct).filter(Boolean);

  return (
    <BreezyLayout>
      <article className="max-w-3xl mx-auto px-6 py-16">
        <nav className="text-xs text-[#9A9488] mb-6">
          <Link to="/" className="hover:text-[#5A7A55]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-[#5A7A55]">Journal</Link>
        </nav>
        <div className="text-xs uppercase tracking-[0.2em] text-[#7D9B76] font-semibold mb-3">
          {a.category} · {a.readTime} min read
        </div>
        <h1 className="text-4xl md:text-5xl text-[#2A2A28] mb-6 leading-tight" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
          {a.title}
        </h1>
        <div className="flex items-center gap-3 mb-10 text-sm text-[#7A7468] border-b border-[#E8E2D5] pb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7D9B76] to-[#5A7A55] flex items-center justify-center text-white text-sm font-semibold">
            {a.author.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <div className="text-[#2A2A28] font-medium">{a.author}</div>
            <div className="text-xs">{a.authorRole} · {new Date(a.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
          </div>
        </div>
        <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#F2EDE3] to-[#E8E2D5] flex items-center justify-center text-[8rem] mb-10">
          {a.emoji}
        </div>
        <div className="prose prose-lg max-w-none text-[#3A3A38] leading-relaxed">
          <p className="text-xl text-[#5A554C] italic mb-8">{a.excerpt}</p>
          {a.body ? (
            a.body.split("\n\n").map((para: string, i: number) => <p key={i} className="mb-5">{para}</p>)
          ) : (
            <p className="text-[#9A9488]">Full article content is being prepared and will be published shortly.</p>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-[#E8E2D5] pt-12">
            <h2 className="text-2xl mb-6" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              Products mentioned in this article
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (p ? <ProductCard key={p.slug} product={p} /> : null))}
            </div>
          </section>
        )}
      </article>
    </BreezyLayout>
  );
}
