import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI & Copyright — AFROMATIONS Blog',
  description: 'Educational articles on AI-generated art, copyright law, authorship, and what artists need to know about AI tools and their rights.',
}

const ARTICLES = [
  {
    title: 'What AI-Assisted Art Means for Your Copyright: A Plain-Language Guide',
    excerpt: 'Understanding the difference between AI-generated, AI-assisted, and human-authored works — and why it matters for your registrations.',
    status: 'coming_soon',
  },
  {
    title: 'The Copyright Office\'s Current Position on AI Art',
    excerpt: 'A breakdown of the U.S. Copyright Office guidance on AI-generated content, what\'s registrable, and what isn\'t.',
    status: 'coming_soon',
  },
  {
    title: 'How to Document Human Authorship When Using AI Tools',
    excerpt: 'Practical steps for keeping records that support a copyright claim when your workflow includes AI assistance.',
    status: 'coming_soon',
  },
]

export default function AIcopyrightPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <Link href="/blog" className="text-(--af-grey-light) hover:text-(--af-cream)">Blog</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>AI &amp; Copyright</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Educational · Not legal advice</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>AI &amp; Copyright</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-2 leading-relaxed">
          Plain-language education on AI-generated art, copyright law, authorship documentation, and what artists need to know.
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
          <div className="text-lg font-semibold mb-3">Want early access to guides and resources?</div>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
