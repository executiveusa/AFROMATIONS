import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Provenance — AFROMATIONS Blog',
  description: 'Educational articles on creative provenance, authorship documentation, file hashing, and building an evidence trail for your original work.',
}

const ARTICLES = [
  {
    title: 'What Is Creative Provenance and Why Should Artists Care?',
    excerpt: 'Provenance isn\'t just for fine art auctions. For independent creators, a solid evidence trail can mean the difference between winning and losing an infringement dispute.',
    status: 'coming_soon',
  },
  {
    title: 'File Hashing for Artists: SHA-256 Without the Jargon',
    excerpt: 'What file hashes actually are, how they work, and why timestamping your file fingerprints creates a tamper-evident creation record.',
    status: 'coming_soon',
  },
  {
    title: 'How Blockchain Timestamps Work — and What They Can\'t Do',
    excerpt: 'A clear breakdown of what blockchain timestamp services provide and what they don\'t — because the fine print matters.',
    status: 'coming_soon',
  },
]

export default function ProvenanceBlogPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Provenance</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · Not legal advice</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Provenance</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Education on building authorship evidence trails, file documentation, and why provenance is creative infrastructure — not optional.
        </p>
        <p className="text-xs text-(--af-grey-light)/60 mb-12 p-3 rounded-lg border border-white/5 bg-white/5">
          Nothing here is legal advice. Consult a licensed attorney for legal decisions about your creative work.
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
          <div className="text-lg font-semibold mb-3">Apply for Provenance Vault access</div>
          <p className="text-(--af-grey-light) text-sm mb-6">The Vault tracks your authorship evidence automatically — file hashes, process notes, AI assistance records.</p>
          <Link href="/provenance" className="af-btn-secondary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mr-3">
            Learn More
          </Link>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
