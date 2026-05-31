import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drops — AFROMATIONS',
  description:
    'Invite-only character drops and auctions. Early drops feature Dual and selected partner artists.',
}

const UPCOMING_DROPS = [
  {
    title: 'Dual Demo Drop',
    type: 'Character drop',
    desc: 'The first public drop featuring Dual, the AFROMATIONS in-house demo character. Built by Hana, in public.',
    status: 'Coming soon',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  {
    title: 'Artist Commission Auction',
    type: 'Invite-only auction',
    desc: 'Vetted partner artists open commission slots. Buyers bid for priority access.',
    status: 'Planning',
    badge: 'bg-white/10 text-(--af-grey-light)',
  },
  {
    title: 'Character Sponsorship Drop',
    type: 'Brand sponsorship',
    desc: 'A brand sponsors an original character or story arc. Artist retains ownership.',
    status: 'Planning',
    badge: 'bg-white/10 text-(--af-grey-light)',
  },
  {
    title: 'Licensing Opportunity',
    type: 'Character licensing',
    desc: 'An original character is made available for licensing to brands, games, or media.',
    status: 'Roadmap',
    badge: 'bg-white/10 text-(--af-grey-light)',
  },
]

export default function DropsPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Drops</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Invite-only drops · Coming soon</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Character Drops</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-12 leading-relaxed">
          Invite-only drops and character auctions are coming soon. Early drops will feature Dual and selected partner artists. No live bidding yet — real auction infrastructure requires payment, fraud, and payout systems to be production-ready first.
        </p>

        {/* Drop cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {UPCOMING_DROPS.map((drop) => (
            <div key={drop.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="text-xs text-(--af-grey-light)">{drop.type}</div>
                <span className={`rounded px-2 py-0.5 text-[10px] ${drop.badge}`}>{drop.status}</span>
              </div>
              <div className="text-lg font-semibold mb-2">{drop.title}</div>
              <p className="text-sm text-(--af-grey-light) leading-relaxed">{drop.desc}</p>
            </div>
          ))}
        </div>

        {/* How drops work */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 mb-16">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-6">How drops will work</div>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Provenance first', desc: 'Every drop starts with a Provenance Vault record — file hashes, authorship notes, AI tools used.' },
              { step: '02', title: 'Drop page prepared', desc: 'Hana builds the drop page with character info, creator notes, and licensing terms.' },
              { step: '03', title: 'Invite-only access', desc: 'Partner artists and vetted collectors get early access. No open marketplace yet.' },
              { step: '04', title: 'Human approval at every step', desc: 'No drops go live without the artist and the AFROMATIONS team signing off.' },
            ].map((step) => (
              <div key={step.step} className="flex gap-6">
                <div className="text-2xl font-bold text-(--af-red) shrink-0">{step.step}</div>
                <div>
                  <div className="font-semibold text-sm mb-1">{step.title}</div>
                  <div className="text-sm text-(--af-grey-light)">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="text-lg font-semibold mb-3">Apply to be considered for a future drop</div>
          <p className="text-(--af-grey-light) text-sm mb-6">
            Partner artists get early access to drops and auction opportunities.
          </p>
          <Link href="/apply?type=drops" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
