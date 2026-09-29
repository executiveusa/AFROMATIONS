import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Studio — AFROMATIONS',
  description: 'AFROMATIONS is a creative workspace for character, image, story, sound, manga, motion, and artist collaboration.',
}

const disciplines = [
  ['Animation','Motion tests, sequences, visual development, and cinematic storytelling.'],
  ['Illustration','Character art, key art, posters, concept work, and campaign imagery.'],
  ['Worldbuilding','Canon, locations, visual rules, narrative systems, and continuity.'],
  ['Music + Sound','Soundtrack development, instrumentals, sound design, and release support.'],
  ['Manga','Page development, visual storytelling, lettering, and publication preparation.'],
  ['Creative Operations','Research, organization, production planning, handoffs, and publishing support.'],
]

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Studio"
        title="A creative workspace for character, image, story, and sound."
        body="AFROMATIONS develops original worlds and supports artist-led projects across visual media, manga, motion, music, and publishing."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <MediaSlot label="Studio reel / workspace / process montage" className="min-h-[420px]" />
          <div className="mt-4 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
            {disciplines.map(([title,body])=>(
              <article key={title} className="min-h-60 bg-(--af-black) p-7">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Project flow</SectionLabel>
          <div className="mt-8 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-4">
            {[
              ['01','Brief','Goal, audience, people, timeline, budget.'],
              ['02','Direction','Visual world, scope, references, production plan.'],
              ['03','Production','Build, review, approvals, handoffs.'],
              ['04','Release','Delivery, publishing, credits, next phase.'],
            ].map(([n,title,body])=>(
              <article key={n} className="min-h-56 bg-(--af-black) p-6">
                <p className="text-xs text-white/25">{n}</p>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>Technology belongs behind the craft.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              Software and AI-assisted systems can support research, organization, iteration, and production. The public work is judged by authorship, craft, clarity, and the people credited for making it.
            </p>
          </div>
          <div className="border border-white/8 p-7 sm:p-9">
            <h3 className="text-xl font-semibold">Have a project?</h3>
            <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">Start with the outcome, the people involved, the schedule, and the budget.</p>
            <Link href="/apply?path=project" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Work With Us</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
