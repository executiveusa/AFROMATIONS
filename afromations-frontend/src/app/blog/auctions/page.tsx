import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auctions — AFROMATIONS Blog',
  description: 'Educational articles on character auctions, drops, invite-only collector markets, and how independent artists can participate in structured character sales.',
}

const ARTICLES = [
  {
    title: 'Character Auctions for Independent Artists: How They Work',
    excerpt: 'What a character drop auction is, how bidding works, and what artists need to have in place before their first drop — provenance, terms, and pricing strategy.',
    status: 'coming_soon',
  },
  {
    title: 'The Case for Invite-Only Drops',
    excerpt: 'Why invite-only character drops create better outcomes for artists than open marketplace listings — and the tradeoffs of each approach.',
    status: 'coming_soon',
  },
  {
    title: 'Setting a Reserve Price for Your Original Character',
    excerpt: 'How to think about pricing original character art in auctions — and what factors experienced collectors consider when bidding.',
    status: 'coming_soon',
  },
]

export default function AuctionsBlogPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Auctions</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · No live bidding yet</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Auctions</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Education on character drops, invite-only auctions, pricing strategy, and what to prepare before your first drop goes live.
        </p>
        <p className="text-xs text-(--af-grey-light)/60 mb-12 p-3 rounded-lg border border-white/5 bg-white/5">
          AFROMATIONS does not yet have live auction infrastructure. No real bidding or payments are processed through this platform. Educational content only.
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
          <div className="text-lg font-semibold mb-3">Get considered for a future drop</div>
          <p className="text-(--af-grey-light) text-sm mb-6">Partner artists get early access to drop and auction opportunities when the system is live.</p>
          <Link href="/drops" className="af-btn-secondary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mr-3">
            See Planned Drops
          </Link>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
