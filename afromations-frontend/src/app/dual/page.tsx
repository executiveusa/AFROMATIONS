import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dual — Seattle 2056 | AFROMATIONS',
  description:
    'Enter Dual’s world in Seattle 2056. Follow the original AFROMATIONS character as Hana turns one story into manga, motion, merchandise, and an artist-owned creative business.',
}

const DUAL_COVER =
  'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

const CHAPTERS = [
  {
    label: 'Chapter 1',
    title: 'Knock at the Door',
    status: 'In development',
    body: 'A storm over Seattle. A stranger at the door. A warning that fractures everything Dual thought he knew about himself.',
  },
  {
    label: 'World file',
    title: 'Seattle 2056',
    status: 'Canon building',
    body: 'A rain-soaked future where memory, identity, spirit, technology, and power are never as separate as they appear.',
  },
  {
    label: 'Proof-of-work',
    title: 'Watch Hana Build Dual',
    status: 'Public process',
    body: 'Dual is the first full AFROMATIONS case: story, visual canon, motion tests, merchandise, content, licensing records, and provenance evidence.',
  },
]

export default function DualPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-black/50 px-5 py-4 backdrop-blur-sm sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Dual</span>
        </div>
      </nav>

      <section className="relative isolate min-h-[92svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-12" aria-labelledby="dual-title">
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DUAL_COVER} alt="" className="h-full w-full object-cover object-[60%_center] sm:object-center" />
        </div>
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,5,.98) 0%, rgba(5,5,5,.88) 36%, rgba(5,5,5,.28) 70%, rgba(5,5,5,.58) 100%), linear-gradient(0deg, #0a0a0a 0%, transparent 52%)',
          }}
          aria-hidden="true"
        />

        <div className="mx-auto flex min-h-[72svh] max-w-7xl items-end lg:items-center">
          <div className="max-w-3xl pb-8 lg:pb-0">
            <p className="text-[10px] font-semibold tracking-[0.34em] text-(--af-gold) uppercase">Seattle 2056 // Original AFROMATIONS story</p>
            <h1 id="dual-title" className="mt-5 text-6xl font-extrabold leading-[.86] tracking-[-.07em] sm:text-8xl lg:text-[9rem]" style={{ fontFamily: 'Sora, sans-serif' }}>
              DUAL
            </h1>
            <h2 className="mt-5 text-2xl font-bold sm:text-4xl" style={{ fontFamily: 'Sora, sans-serif' }}>Chapter 1: Knock at the Door</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-(--af-grey-light) sm:text-lg">
              Dual is not a software feature. He is Tyshawn&apos;s original character and the center of a living anime world.
              AFROMATIONS is building the story in public while proving how one protected character can become media,
              merchandise, opportunity, and a creator-owned business.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/manga" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold">
                Read the Manga Build
              </Link>
              <Link href="/artist-partner-program" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold">
                Artists: Work with AFROMATIONS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="dual-proof-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">The first public proof</p>
          <h2 id="dual-proof-title" className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            One character. One world. Every part of the business recorded from the beginning.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
            {CHAPTERS.map((item) => (
              <article key={item.title} className="bg-(--af-black) p-7 sm:p-9">
                <div className="flex items-center justify-between gap-3 text-[10px] font-semibold tracking-[0.22em] uppercase">
                  <span className="text-(--af-red)">{item.label}</span>
                  <span className="text-(--af-grey-light)">{item.status}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-(--af-grey)/35 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="dual-system-title">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.86fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">Built with artists, not extracted from them</p>
            <h2 id="dual-system-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              Dual becomes the standard AFROMATIONS asks every future project to meet.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
              Canon files, source art, human contribution, AI-assisted stages, approvals, licenses, merchandise uses,
              and finished outputs are organized into a transparent production record.
            </p>
          </div>
          <div className="border border-(--af-gold)/30 bg-[#15120d] p-7 sm:p-9">
            <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Build your own world</div>
            <h3 className="mt-4 text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Hana Character Launch Agent</h3>
            <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
              The same repeatable studio system built around Dual can be installed around another creator&apos;s original character.
            </p>
            <div className="mt-6 text-4xl font-bold">$1,495</div>
            <div className="text-xs text-(--af-grey-light)">or 3 payments of $550</div>
            <Link href="/apply?path=hana" className="af-btn-primary mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold">
              Apply for a Founding Installation
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
