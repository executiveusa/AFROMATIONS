import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

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
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Studio</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            A creative workspace for character, image, story, and sound.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            AFROMATIONS develops original worlds and supports artist-led projects across visual media, manga, motion, music, and publishing.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map(([title,body])=>(
            <article key={title} className="min-h-60 bg-(--af-black) p-7">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">How we work</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>Technology belongs behind the craft.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              The studio uses software and AI-assisted systems where they help research, organization, iteration, and production. The public work is judged by authorship, craft, clarity, and the people credited for making it.
            </p>
          </div>
          <div className="border border-white/8 p-7 sm:p-9">
            <h3 className="text-xl font-semibold">Have a project?</h3>
            <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">Start with the outcome, the people involved, the schedule, and the budget. We scope from there.</p>
            <Link href="/apply?path=project" className="af-btn-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Work With Us</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
