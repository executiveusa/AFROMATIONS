import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artist Contracts — AFROMATIONS Blog',
  description: 'Educational articles on commission contracts, licensing agreements, work-for-hire, and the basics of protecting yourself in creative deals.',
}

const ARTICLES = [
  {
    title: 'Commission Contracts: What to Include and What to Watch Out For',
    excerpt: 'The key clauses every independent artist should understand before accepting a commission — payment terms, rights, kill fees, and revisions.',
    status: 'coming_soon',
  },
  {
    title: 'Work-for-Hire vs. License: Which Should You Offer?',
    excerpt: 'The difference between transferring copyright outright and licensing your work — and which is usually better for independent creators.',
    status: 'coming_soon',
  },
  {
    title: 'Platform Terms That Affect Your IP: A Reading Guide',
    excerpt: 'How to read the fine print in social media TOS, AI tool agreements, and marketplace contracts before they catch you off-guard.',
    status: 'coming_soon',
  },
]

export default function ArtistContractsPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Artist Contracts</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · Not legal advice</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Artist Contracts</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Education on commission contracts, licensing agreements, work-for-hire, and protecting yourself in creative business deals.
        </p>
        <p className="text-xs text-(--af-grey-light)/60 mb-12 p-3 rounded-lg border border-white/5 bg-white/5">
          Nothing here is legal advice. Consult a licensed attorney before signing or enforcing any agreement.
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
          <div className="text-lg font-semibold mb-3">Want Hana to help you manage your creative business?</div>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
