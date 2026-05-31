import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hana Artist Partner Program — AFROMATIONS',
  description:
    'Private AI studio agents for 21+ serious artists. Turn your original characters into a protected, monetizable creative business.',
}

const WHAT_HANA_DOES = [
  {
    title: 'Research your niche',
    desc: 'Hana studies your market, competitors, and audience so you do not have to.',
  },
  {
    title: 'Generate content at scale',
    desc: 'Blog posts, YouTube scripts, social packs, and reels — all in your voice, all original.',
  },
  {
    title: 'Manage your publishing queue',
    desc: 'You approve. Hana schedules. Nothing goes live without your sign-off.',
  },
  {
    title: 'Track provenance and authorship',
    desc: 'Every file hashed. Every AI tool documented. Human contribution noted.',
  },
  {
    title: 'Build your artist landing page',
    desc: 'Your characters deserve a professional home. Hana builds and maintains it.',
  },
  {
    title: 'Coordinate drops and commissions',
    desc: 'Hana prepares drop pages, provenance records, and commission workflows for you.',
  },
]

const PACKAGES = [
  {
    name: '24-Hour Character Demo',
    badge: 'Free / Invite-only',
    items: [
      'One original character evaluated',
      'Hana generates sample content pack',
      'Provenance trail started',
      'Full report delivered in 24 hours',
      'No commitment required',
    ],
    cta: 'Request a Demo',
    href: '/apply?type=demo',
    highlight: false,
  },
  {
    name: 'Partner Install',
    badge: 'Paid — Apply to unlock pricing',
    items: [
      'Full Hana agent installed for your studio',
      'Artist landing page built and deployed',
      'Research pipeline configured',
      'Publishing queue live (approval-gated)',
      'Provenance Vault initialized',
      'Monthly maintenance and content cadence',
    ],
    cta: 'Apply for Invite',
    href: '/apply?type=partner',
    highlight: true,
  },
  {
    name: 'Drop / Auction Support',
    badge: 'Add-on — Partner artists only',
    items: [
      'Character drop page prepared',
      'Provenance record for each drop',
      'Auction coordination support',
      'Commission agreement templates',
      'Licensing opportunity preparation',
    ],
    cta: 'Ask about drops',
    href: '/apply?type=drops',
    highlight: false,
  },
]

export default function ArtistPartnerProgramPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4 text-xs">
        <Link href="/" className="font-bold tracking-widest text-(--af-red)">AFROMATIONS</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Artist Partner Program</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-4 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Invite-only · 21+</div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
          Turn your characters into<br className="hidden sm:block" /> an AI-powered creative business.
        </h1>
        <p className="text-lg text-(--af-grey-light) max-w-2xl mb-8">
          Hana installs a private AI studio agent for serious 21+ artists. She manages your research, content, publishing queue, provenance records, and artist landing page — while you stay focused on creating.
        </p>
        <div className="flex flex-wrap gap-4 mb-16">
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
          <Link href="/dual" className="af-btn-secondary inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold">
            Watch Hana Build Dual →
          </Link>
        </div>

        {/* What Hana does */}
        <div className="mb-16">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-4">What Hana manages for you</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_HANA_DOES.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold mb-2">{item.title}</div>
                <div className="text-sm text-(--af-grey-light) leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-16">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-6">How to work with Hana</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  pkg.highlight
                    ? 'border-(--af-red)/40 bg-white/8'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {pkg.highlight && (
                  <div className="text-[10px] text-(--af-red) tracking-widest uppercase mb-3">Most popular</div>
                )}
                <div className="text-lg font-semibold mb-1">{pkg.name}</div>
                <div className="text-[10px] text-(--af-grey-light) mb-4">{pkg.badge}</div>
                <ul className="flex-1 space-y-2 mb-6">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-(--af-grey-light)">
                      <span className="text-(--af-red) shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.href}
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 ${
                    pkg.highlight
                      ? 'bg-(--af-red) text-(--af-cream)'
                      : 'border border-white/20 text-(--af-cream)'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Who this is for */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 mb-16">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-4">Who this is for</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              'Anime artists', 'Character designers', 'Manga creators',
              'Tattoo artists', 'Muralists', 'Animators',
              'Illustrators', 'Musicians with visual IP', 'Creators with original characters',
            ].map((type) => (
              <div key={type} className="text-sm text-(--af-grey-light) flex gap-2">
                <span className="text-(--af-red)">◆</span>{type}
              </div>
            ))}
          </div>
          <p className="text-sm text-(--af-grey-light)">
            AfroMations is currently invite-only for <strong className="text-(--af-cream)">21+ artists and creative professionals</strong>. We review applications personally and move slowly on purpose.
          </p>
        </div>

        {/* The first story */}
        <div className="mb-16 max-w-2xl">
          <div className="text-[10px] tracking-[0.4em] text-(--af-grey-light) uppercase mb-4">The first public story</div>
          <p className="text-base text-(--af-grey-light) leading-relaxed">
            Dual is being built in public by Hana. Watch what Hana can do with one original character — research, content, provenance, landing page, and drops. Apply if you want your art to move, sell, and become a protected creative business.
          </p>
          <div className="mt-4">
            <Link href="/dual" className="text-sm text-(--af-red) hover:underline">
              Follow the Dual build log →
            </Link>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="rounded-xl border border-(--af-red)/20 bg-(--af-red)/5 p-8 text-center">
          <div className="text-2xl font-bold mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Ready to apply?</div>
          <p className="text-(--af-grey-light) mb-6">Applications take 5 minutes. We review personally and follow up within a few days.</p>
          <Link href="/apply" className="af-btn-primary inline-flex items-center px-8 py-3 rounded-full text-sm font-semibold">
            Apply for Invite
          </Link>
        </div>
      </div>
    </main>
  )
}
