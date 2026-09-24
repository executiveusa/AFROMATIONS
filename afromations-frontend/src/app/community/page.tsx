import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Community — AFROMATIONS',
  description: 'AFROMATIONS community projects, artist opportunities, and creative collaboration pathways.',
}

const paths = [
  ['Find an Artist','A path for organizations and collaborators looking for creative talent.'],
  ['Bring Us a Project','Mural, animation, event, neighborhood, youth, or cultural storytelling project.'],
  ['Community Projects','A record of documented work, process, partners, and outcomes.'],
  ['Join the Network','A pathway for artists who want to be considered for future paid creative work.'],
]

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Community</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            Creative work should leave something behind.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            AFROMATIONS connects original media work with artists, neighborhoods, youth, and community-facing creative projects. The standard is visible work, not vague impact language.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map(([title,body]) => (
              <article key={title} className="min-h-72 bg-(--af-black) p-6 sm:p-7">
                <h2 className="text-xl font-semibold tracking-[-.02em]">{title}</h2>
                <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Documentation first</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>Proof belongs beside the promise.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              Photos, interviews, contributor credits, deliverables, and project notes will live here as each community project is cleared for publication.
            </p>
          </div>
          <div className="border border-dashed border-white/15 p-8 text-sm text-white/35">
            COMMUNITY PROJECT PROOF SLOT<br/><br/>Replace with real photography, interviews, or project documentation.
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>Bring us something worth building.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/apply?path=project" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">I Have a Project</Link>
            <Link href="/apply?path=artist" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold">I’m an Artist</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
