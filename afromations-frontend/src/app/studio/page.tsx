import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hana Character Launch Agent — AFROMATIONS',
  description:
    'A $1,495 done-for-you private anime studio agent installation for creators with original characters. Includes consistent media, merchandise concepts, animation tests, content planning, voice control, and provenance records.',
}

const DELIVERABLES = [
  ['Private Hana installation', 'Creator-specific soul, canon, brand rules, approvals, memory, and operating files.'],
  ['Character consistency system', 'Reference organization and a reusable visual workflow for one primary original character.'],
  ['15 campaign assets', 'Website, social, poster, launch, expression, pose, and scene variations.'],
  ['5 merchandise concepts', 'Production-ready direction, transparent exports, placement notes, and initial mockups.'],
  ['3 animation tests', 'Short motion proofs for vertical and landscape campaigns.'],
  ['Voice and Telegram control', 'Request work, review status, approve output, and stop publishing from a phone.'],
  ['30-day content engine', 'Content ideas, production-ready posts, short-video scripts, hooks, and schedule.'],
  ['Provenance Starter Vault', 'Source record, human contribution log, AI disclosure, file fingerprints, and certificate structure.'],
]

const BONUSES = [
  'Faceless YouTube starter system',
  'Character business blueprint',
  'One paid human finish pass',
  'One public artwork verification page',
  'One optional blockchain evidence anchor',
  '45-day founding client tune-up',
]

const NOT_INCLUDED = [
  'Unlimited content or generations',
  'Physical samples and Printify order costs',
  'Advertising spend and platform fees',
  'Government copyright or trademark registration',
  'Legal advice or ownership guarantees',
  'Publishing without explicit owner approval',
]

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-5 py-4 sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Hana Character Launch Agent</span>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="studio-title">
        <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_top_right,rgba(196,30,30,.18),transparent_62%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.72fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.34em] text-(--af-red) uppercase">Three founding installations</p>
            <h1 id="studio-title" className="mt-5 max-w-5xl text-4xl font-extrabold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
              Turn one original character into an AI-powered anime studio.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-(--af-grey-light)">
              AFROMATIONS installs a private Hana agent that creates consistent media, merchandise concepts,
              animations, launch content, and provenance records around your original character.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-(--af-grey-light)">
              <span>Done for you</span><span aria-hidden="true">◆</span>
              <span>One original character</span><span aria-hidden="true">◆</span>
              <span>Two creative revision rounds</span><span aria-hidden="true">◆</span>
              <span>14-business-day target after intake approval</span>
            </div>
          </div>

          <aside className="border border-(--af-red)/40 bg-(--af-black) p-1">
            <div className="border border-white/10 p-7 sm:p-9">
              <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Founding price</div>
              <div className="mt-5 text-6xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>$1,495</div>
              <div className="mt-2 text-sm text-(--af-grey-light)">Pay in full</div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="text-xl font-semibold">3 payments of $550</div>
                <div className="mt-1 text-xs text-(--af-grey-light)">$1,650 total on the payment plan</div>
              </div>
              <div className="mt-5 text-sm text-(--af-grey-light)">Optional maintenance: $249/month. Cancel anytime.</div>
              <Link href="/apply?path=hana" className="af-btn-primary mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold">
                Apply for a Founding Installation
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="deliverables-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">The complete installation</p>
          <h2 id="deliverables-title" className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            The agent, the production system, and the first launch package.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map(([title, body], index) => (
              <article key={title} className="bg-(--af-black) p-6">
                <div className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-(--af-grey)/35 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="bonuses-title">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">Founding bonuses</p>
            <h2 id="bonuses-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              Enough leverage to launch instead of leaving with another unfinished system.
            </h2>
            <div className="mt-8 border-t border-white/10">
              {BONUSES.map((bonus, index) => (
                <div key={bonus} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5">
                  <span className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-(--af-grey-light)">{bonus}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-grey-light) uppercase">Scope boundaries</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              Clear limits protect the customer and the studio.
            </h2>
            <div className="mt-8 border-t border-white/10">
              {NOT_INCLUDED.map((item, index) => (
                <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5">
                  <span className="text-xs font-bold text-(--af-grey-light)">—</span>
                  <span className="text-sm text-(--af-grey-light)">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl border border-(--af-red)/30 bg-(--af-red)/5 p-7 text-center sm:p-12">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-(--af-red) uppercase">Launch-ready guarantee</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            The package is measured against a written acceptance checklist.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-(--af-grey-light)">
            After complete intake and brief approval, we target delivery within 14 business days. Two creative revision rounds are included.
            Technical defects do not use those rounds. If the package fails its agreed acceptance checklist, we continue correcting it without additional labor fees.
          </p>
          <Link href="/apply?path=hana" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold">
            Apply for One of Three Founding Installs
          </Link>
        </div>
      </section>
    </main>
  )
}
