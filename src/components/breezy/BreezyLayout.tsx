import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/breezy-data";

/**
 * Shared header + footer for the BreezySocial gadget storefront.
 * Used on every breezysocial.com page (home, shop, blog, policies).
 * Wellness/editorial vibe — warm sand + sage palette, Instrument Serif headings.
 */
export function BreezyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#2A2A28]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <BreezyHeader />
      <main>{children}</main>
      <BreezyFooter />
    </div>
  );
}

export function BreezyHeader() {
  return (
    <header className="border-b border-[#E8E2D5] bg-[#FAF7F2]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7D9B76] to-[#5A7A55] flex items-center justify-center text-white text-sm">
            ◐
          </span>
          <span
            className="text-xl tracking-tight text-[#2A2A28]"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            {SITE.name}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#5A554C]">
          <Link to="/shop" className="hover:text-[#5A7A55] transition-colors">Shop</Link>
          <Link to="/blog" className="hover:text-[#5A7A55] transition-colors">Journal</Link>
          <Link to="/about" className="hover:text-[#5A7A55] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#5A7A55] transition-colors">Contact</Link>
        </nav>
        <Link
          to="/shop"
          className="bg-[#2A2A28] text-[#FAF7F2] px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase hover:bg-[#5A7A55] transition-colors"
        >
          Shop now
        </Link>
      </div>
    </header>
  );
}

export function BreezyFooter() {
  return (
    <footer className="border-t border-[#E8E2D5] bg-[#F2EDE3] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7D9B76] to-[#5A7A55] flex items-center justify-center text-white text-xs">◐</span>
            <span style={{ fontFamily: "'Instrument Serif', serif" }} className="text-lg">
              {SITE.name}
            </span>
          </div>
          <p className="text-sm text-[#7A7468] leading-relaxed">{SITE.tagline}</p>
          <p className="text-xs text-[#9A9488] mt-4">Est. {SITE.founded}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#5A554C] mb-4 font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-[#7A7468]">
            <li><Link to="/shop" className="hover:text-[#5A7A55]">All products</Link></li>
            <li><Link to="/shop" className="hover:text-[#5A7A55]">Sleep & wellness</Link></li>
            <li><Link to="/shop" className="hover:text-[#5A7A55]">Smart home</Link></li>
            <li><Link to="/shop" className="hover:text-[#5A7A55]">Travel</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#5A554C] mb-4 font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-[#7A7468]">
            <li><Link to="/about" className="hover:text-[#5A7A55]">About us</Link></li>
            <li><Link to="/blog" className="hover:text-[#5A7A55]">Journal</Link></li>
            <li><Link to="/contact" className="hover:text-[#5A7A55]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#5A554C] mb-4 font-semibold">Policies</h4>
          <ul className="space-y-2 text-sm text-[#7A7468]">
            <li><Link to="/shipping" className="hover:text-[#5A7A55]">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-[#5A7A55]">Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-[#5A7A55]">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-[#5A7A55]">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E8E2D5]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-2 items-center justify-between text-xs text-[#9A9488]">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.address}</p>
        </div>
      </div>
    </footer>
  );
}

export function TrustBar() {
  const items = [
    { icon: "🚚", text: "Free shipping over $50" },
    { icon: "↩️", text: "30-day easy returns" },
    { icon: "🔒", text: "Secure SSL checkout" },
    { icon: "⭐", text: "10,000+ happy customers" },
  ];
  return (
    <div className="bg-[#5A7A55] text-[#F2EDE3]">
      <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm text-center">
        {items.map((i) => (
          <div key={i.text} className="flex items-center justify-center gap-2">
            <span>{i.icon}</span>
            <span>{i.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
