import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Licensing — AFROMATIONS Blog',
  description: 'Educational articles on character licensing, brand deals, royalties, and how independent artists can license original characters to brands and media.',
}

const ARTICLES = [
  {
    title: 'Character Licensing 101: What It Is and How It Works',
    excerpt: 'The basics of character licensing — exclusive vs. non-exclusive, royalty structures, territory, and what to negotiate before you sign anything.',
    status: 'coming_soon',
  },
  {
    title: 'Brand Deals for Independent Creators: What to Know',
    excerpt: 'How brand sponsorships and character licensing deals differ, and what protections artists should have in place before engaging.',
    status: 'coming_soon',
  },
  {
    title: 'Licensing Your Original Character Without Losing It',
    excerpt: 'How to structure a licensing deal so the brand gets what they need while you retain ownership of your character long-term.',
    status: 'coming_soon',
  },
]

export default function LicensingBlogPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Licensing</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · Not legal advice</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Licensing</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Education on character licensing, brand deals, royalties, and how to structure agreements that protect you while enabling commercial partnerships.
        </p>
        <p className="text-xs text-(--af-grey-light)/60 mb-12 p-3 rounded-lg border border-white/5 bg-white/5">
          Nothing here is legal advice. Consult a licensed attorney before entering any licensing agreement.
        </p>

        <div className="space-y-6">
          {ARTICLES.map((a) => (
            <div key={a.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-base font-semibold">{a.title}</h2>
                <span className="shrink-0 text-[10px] rounded px-2 py-0.5 bg-white/10 text-(--af-grey-light)">Coming soon</span>
              </div>
              <p className="text-sm text-(--af-grey-light) leading-relaxed">{a.excerpt}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-(--af-red)/20 bg-(--af-red)/5 p-8 text-center">
          <div className="text-lg font-semibold mb-3">AFROMATIONS facilitates licensing for partner artists</div>
          <p className="text-(--af-grey-light) text-sm mb-6">Partner artists get drop and licensing support from the AFROMATIONS team. Apply to be considered.</p>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
