import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

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
      <PageIntro
        eyebrow="Community"
        title="Creative work should leave something behind."
        body="AFROMATIONS connects original media work with artists, neighborhoods, youth, and community-facing creative projects. The standard is visible work, not vague impact language."
      />

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
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Project proof</SectionLabel>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MediaSlot label="Community project 01 — photography / short film / credits" className="min-h-[320px]" />
            <MediaSlot label="Community project 02 — process / participants / outcome" className="min-h-[320px]" />
            <MediaSlot label="Community project 03 — partner / place / finished work" className="min-h-[320px]" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <SectionLabel>Opportunities</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>
              Put real openings here when they exist.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              Paid calls for artists, youth opportunities, commissions, volunteer needs, and community partners should be listed with requirements, dates, contact paths, and compensation where applicable.
            </p>
          </div>
          <div className="border border-dashed border-white/15 p-8 text-sm leading-7 text-white/35">
            ACTIVE OPPORTUNITY SLOT<br/><br/>
            Role / project<br/>
            Who it is for<br/>
            Compensation<br/>
            Deadline<br/>
            Apply link
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
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
