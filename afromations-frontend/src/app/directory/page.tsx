import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artist Directory — AFROMATIONS',
  description:
    'Directory for 21+ artists, collaborators, studios, collectors, and creative service providers. Opening soon.',
}

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Directory</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Opening soon</div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Artist Directory</h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-12 leading-relaxed">
          Directory opening soon for 21+ artists, collaborators, studios, collectors, and creative service providers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {[
            { label: 'Artists', desc: 'Original character creators, anime artists, illustrators, character designers' },
            { label: 'Collaborators', desc: 'Writers, musicians, animators, voice artists looking to collaborate' },
            { label: 'Studios', desc: 'Independent studios and creative agencies with capacity' },
            { label: 'Collectors', desc: 'Character art collectors and brand sponsors seeking original IP' },
            { label: 'Service providers', desc: 'Animation, audio production, merch, legal, and creative services' },
            { label: 'Educators', desc: 'Workshops, mentorship, courses for serious 21+ creative professionals' },
          ].map((cat) => (
            <div key={cat.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="font-semibold text-sm mb-2">{cat.label}</div>
              <div className="text-xs text-(--af-grey-light) leading-relaxed">{cat.desc}</div>
              <div className="mt-3 text-[10px] text-(--af-grey-light)/50">Coming soon</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-(--af-red)/20 bg-(--af-red)/5 p-8 text-center">
          <div className="text-xl font-semibold mb-3">Apply to be listed</div>
          <p className="text-(--af-grey-light) text-sm mb-6">
            Directory listings are invite-only and curated. Apply through the Artist Partner Program to be considered.
          </p>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
