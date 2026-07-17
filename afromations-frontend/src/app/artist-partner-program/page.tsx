import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Founding Tattoo Artist Circle — AFROMATIONS',
  description:
    'Join the AFROMATIONS founding tattoo artist circle. Keep ownership of your art while we connect it to paid character, merchandise, media, and licensing opportunities.',
}

const BENEFITS = [
  {
    title: 'We market the artist, not only the image',
    body: 'Every campaign can point back to your name, studio, portfolio, booking link, and future commissions.',
  },
  {
    title: 'Written rights before production',
    body: 'You see exactly what is being licensed, for which products, for how long, and whether the use is exclusive.',
  },
  {
    title: 'Paid human finish work',
    body: 'When a mockup moves forward, the originating artist or another agreed human artist can be paid to prepare the final commercial art.',
  },
  {
    title: 'Certificate and provenance record',
    body: 'Approved works receive contributor records, license notes, file fingerprints, timestamps, and a public verification reference when applicable.',
  },
  {
    title: 'Local relationships first',
    body: 'We are beginning with a small Seattle and Puget Sound circle so partnerships are personal, reviewable, and useful to the artist.',
  },
  {
    title: 'Future opportunities compound',
    body: 'A strong collaboration can lead to new commissions, drops, character projects, licensing conversations, and recurring campaign work.',
  },
]

const COVENANT = [
  'No fee to join the founding artist roster.',
  'Your pre-existing art remains yours unless you knowingly sign a separate transfer.',
  'No model training on your work without explicit written permission.',
  'No voice, likeness, or style cloning hidden inside a general consent form.',
  'Project compensation or revenue share is agreed before commercial use.',
  'Qualifying AFROMATIONS-owned collaborative drops pay the artist at least 40% of net profit.',
  'No artist is asked to work only for exposure.',
  'Every human contributor receives a visible role and credit record.',
  'AI-assisted stages are disclosed in the production record.',
  'You receive the approved files and the agreement that governs their use.',
]

const FIT = [
  'Tattoo artists with original flash or character work',
  'Anime and manga illustrators',
  'Black and independent artists building a recognizable world',
  'Artists interested in merchandise, media, or licensing',
  'Studios open to local collaborations and public promotion',
  'Artists who care about ownership, attribution, and transparent terms',
]

export default function ArtistPartnerProgramPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-5 py-4 sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Founding Tattoo Artist Circle</span>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="artist-program-title">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(196,30,30,.16),transparent_62%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.34em] text-(--af-red) uppercase">
            Seattle + Puget Sound // founding roster
          </p>
          <h1
            id="artist-program-title"
            className="mt-5 max-w-5xl text-4xl font-extrabold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            Keep your art. Grow your name. Let us build the market around it.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-(--af-grey-light)">
            AFROMATIONS connects tattoo artists and anime creators to character projects, merchandise,
            campaigns, and licensing opportunities. We handle the production system and promotion while
            artists keep control of the work they created.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/apply?path=artist" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-semibold">
              Apply to Join the Founding Circle
            </Link>
            <Link href="/provenance" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-8 text-sm font-semibold">
              Review the Artist Protection System
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-(--af-grey-light)">
            <span>No roster fee</span>
            <span aria-hidden="true">◆</span>
            <span>Written project terms</span>
            <span aria-hidden="true">◆</span>
            <span>40% minimum net-profit floor on qualifying AFROMATIONS-owned drops</span>
            <span aria-hidden="true">◆</span>
            <span>21+ founding program</span>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="how-it-works-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">How it works</p>
              <h2 id="how-it-works-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                Small circle. Real agreements. Useful opportunities.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-(--af-grey-light)">
                We do not need thousands of artists to start. We need a small roster whose work is distinct,
                whose terms are respected, and whose collaborations can become public proof that the model works.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              {BENEFITS.map((item, index) => (
                <article key={item.title} className="bg-(--af-black) p-6 sm:p-7">
                  <div className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-(--af-grey)/35 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="two-paths-title">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">Two ways to work with AFROMATIONS</p>
          <h2 id="two-paths-title" className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            Join as an artist—or hire Hana to build your own character business.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="border border-(--af-gold)/30 bg-[#15120d] p-7 sm:p-9">
              <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Artist roster</div>
              <h3 className="mt-4 text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Founding Tattoo Artist Circle</h3>
              <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
                Submit your portfolio. When your work fits a project, we present written terms and a paid collaboration or revenue-share option before anything is used commercially.
              </p>
              <div className="mt-6 text-4xl font-bold">$0</div>
              <div className="text-xs text-(--af-grey-light)">to join the roster</div>
              <Link href="/apply?path=artist" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">
                Apply as an Artist
              </Link>
            </article>

            <article className="border border-(--af-red)/35 bg-(--af-black) p-7 sm:p-9">
              <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Done-for-you installation</div>
              <h3 className="mt-4 text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Hana Character Launch Agent</h3>
              <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
                Give Hana one original character. We install the private studio agent, consistency system, campaign assets, merchandise concepts, animation tests, and provenance workflow.
              </p>
              <div className="mt-6 text-4xl font-bold">$1,495</div>
              <div className="text-xs text-(--af-grey-light)">or 3 payments of $550</div>
              <Link href="/apply?path=hana" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">
                Apply for a Hana Installation
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="covenant-title">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">The artist covenant</p>
            <h2 id="covenant-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              Nobody should have to surrender their future to get help marketing their art.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-(--af-grey-light)">
              These are operating rules, not decorative values. The project agreement controls each collaboration,
              but the default posture is artist ownership, informed permission, visible credit, and understandable terms.
            </p>
          </div>
          <div className="border-t border-white/10">
            {COVENANT.map((item, index) => (
              <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5">
                <span className="text-xs font-bold text-(--af-red)">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-relaxed text-(--af-grey-light)">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="fit-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase">Who should apply</p>
              <h2 id="fit-title" className="mt-4 text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                Artists with a real point of view.
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {FIT.map((item) => (
                  <div key={item} className="flex gap-3 border-t border-white/10 py-3 text-sm text-(--af-grey-light)">
                    <span className="text-(--af-red)">◆</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <aside className="border border-(--af-red)/30 bg-(--af-red)/5 p-7 sm:p-9">
              <div className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Founding application</div>
              <h3 className="mt-4 text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Show us the work you want the future to remember.</h3>
              <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
                We review every application personally. Portfolio quality, originality, professionalism, and fit matter more than follower count.
              </p>
              <Link href="/apply?path=artist" className="af-btn-primary mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold">
                Start the Artist Application
              </Link>
            </aside>
          </div>
          <p className="mt-12 text-xs leading-relaxed text-(--af-grey-light)">
            Educational information only. This is not legal advice. Work with a licensed attorney for legal decisions.
          </p>
        </div>
      </section>
    </main>
  )
}
