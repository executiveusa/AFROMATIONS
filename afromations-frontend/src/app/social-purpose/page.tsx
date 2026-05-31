'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

const PILLARS = [
  {
    title: 'Artist Infrastructure',
    description: 'Hana manages research, content, publishing, and provenance for independent creators — so artists spend time creating, not administering.',
  },
  {
    title: 'Owned IP',
    description: 'Every character built through AFROMATIONS stays owned by the artist. We build tools that document, protect, and monetize your creative work.',
  },
  {
    title: 'Provenance by Default',
    description: 'Every project generates an authorship trail: file hashes, process notes, AI assistance records, and public proof. Because proof of originality is infrastructure.',
  },
  {
    title: 'Paid Creative Work',
    description: 'We operate for profit — so artists can be paid. Infrastructure, drops, licensing, and auction support are services artists pay for because they generate real returns.',
  },
  {
    title: 'Underrepresented Creators',
    description: 'Our social-purpose commitment is to build tools and access for creators who have been locked out of the infrastructure that larger studios take for granted.',
  },
  {
    title: 'Transparency',
    description: 'We report on what we build, what artists earn, and how the platform operates. No opaque contracts. No hidden clauses. No fake promises.',
  },
]

const MODEL_CARDS = [
  {
    title: 'Artist Partner Program',
    description: 'Artists pay for infrastructure — Hana installs, provenance vaults, drop support, and landing pages — because infrastructure that generates income is worth paying for.',
  },
  {
    title: 'Drop & Auction Fees',
    description: 'When a character drop or commission auction goes live, AFROMATIONS takes a platform fee. Artist keeps the majority. Splits are defined in writing before any drop.',
  },
  {
    title: 'Character Licensing',
    description: 'When a brand, game, or media project licenses an original character, the artist earns licensing revenue. AFROMATIONS earns a brokerage fee for facilitation.',
  },
  {
    title: 'Social-Purpose Commitment',
    description: 'A portion of platform revenue funds access for underrepresented creators — reduced-cost or subsidized infrastructure access for qualified applicants.',
  },
]

export default function SocialPurposePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-(--af-black) px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-(--af-red) text-[10px] uppercase tracking-[0.4em] font-bold mb-4">
            21+ · For-Profit · Social Purpose
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-(--af-cream) mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
            Artist-Owned Creative Infrastructure
          </h1>
          <p className="text-lg md:text-xl text-(--af-grey-light) max-w-2xl mx-auto leading-relaxed mb-10">
            AFROMATIONS is building artist-owned creative infrastructure for underrepresented and independent creators. We operate as a for-profit artist infrastructure company with a social-purpose commitment built into our charter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply" className="af-btn-primary px-6 py-3 rounded-full text-sm font-semibold">
              Apply for Invite
            </Link>
            <Link href="/artist-partner-program" className="af-btn-secondary px-6 py-3 rounded-full text-sm font-semibold">
              Artist Partner Program
            </Link>
          </div>
        </div>
      </section>

      {/* What we are */}
      <section className="bg-(--af-grey)/30 border-t border-white/5 px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">What AFROMATIONS Is</div>
          <h2 className="text-3xl md:text-4xl font-black text-(--af-cream) mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
            This is not a kids app.<br />This is not a nonprofit.<br />This is not a generic AI art tool.
          </h2>
          <div className="space-y-4 text-(--af-grey-light) leading-relaxed">
            <p>
              AFROMATIONS is an artist infrastructure company. We build the back-office that independent creators — anime artists, character designers, illustrators — have never had access to before.
            </p>
            <p>
              Hana is our primary PI agent. She manages research, content, publishing, provenance records, and creative operations for partner artists. She doesn&apos;t own your IP. You do.
            </p>
            <p>
              We are for-profit because sustainability requires revenue. We are social-purpose because our commitment to underrepresented creators is written into how we operate — not added as an afterthought.
            </p>
          </div>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Platform Pillars</div>
          <h2 className="text-3xl font-black text-(--af-cream) mb-12" style={{ fontFamily: 'Sora, sans-serif' }}>
            What We Build For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-base font-bold text-(--af-cream) mb-3">{pillar.title}</h3>
                <p className="text-(--af-grey-light) text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business model */}
      <section className="bg-(--af-grey)/30 border-t border-white/5 px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Business Model</div>
          <h2 className="text-3xl font-black text-(--af-cream) mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            How the Money Works
          </h2>
          <p className="text-(--af-grey-light) mb-12 max-w-2xl">
            Pricing is private and discussed after application review. The model below describes how revenue is structured — not pricing specifics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODEL_CARDS.map((card) => (
              <div
                key={card.title}
                className="border-l-2 border-(--af-red) pl-6"
              >
                <h3 className="text-base font-bold text-(--af-cream) mb-2">{card.title}</h3>
                <p className="text-(--af-grey-light) text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section className="border-t border-white/5 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-(--af-grey-light) leading-relaxed">
            AFROMATIONS operates as a for-profit social purpose company. Unless explicitly stated through a qualified nonprofit partner, contributions and fees are not tax-deductible.
            Nothing on this site constitutes legal advice. IP, provenance, copyright, and licensing questions require a licensed attorney.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
