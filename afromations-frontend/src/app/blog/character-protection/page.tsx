import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character Protection — AFROMATIONS Blog',
  description: 'Educational articles on protecting original anime and illustration characters through copyright, trademark, and provenance documentation.',
}

const ARTICLES = [
  {
    title: 'Original Character vs. Fan Art: What\'s Protectable?',
    excerpt: 'Understanding which elements of your original character can be protected and which are at risk when you draw in an anime style.',
    status: 'coming_soon',
  },
  {
    title: 'Provenance as Protection: Why an Evidence Trail Matters',
    excerpt: 'How timestamped creation records, file hashes, and process notes support your position in infringement disputes.',
    status: 'coming_soon',
  },
  {
    title: 'When Someone Steals Your Character: First Steps',
    excerpt: 'What to do — and what not to do — when your original character is stolen, sold, or used without permission.',
    status: 'coming_soon',
  },
]

export default function CharacterProtectionPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Character Protection</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · Not legal advice</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Character Protection</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Education on protecting your original characters — through documentation, provenance, and understanding what copyright actually covers.
        </p>
        <p className="text-xs text-(--af-grey-light)/60 mb-12 p-3 rounded-lg border border-white/5 bg-white/5">
          Nothing here is legal advice. Consult a licensed attorney for decisions about your work.
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
          <p className="text-(--af-grey-light) text-sm mb-6">The Vault tracks your authorship so you have evidence when you need it.</p>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
