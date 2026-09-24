import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Work — AFROMATIONS',
  description: 'Original worlds, studio systems, artist collaborations, and community projects from AFROMATIONS.',
}

const projects = [
  {
    title: 'DUAL',
    kicker: 'Original World',
    body: 'The flagship AFROMATIONS IP: a rain-soaked future Seattle story being developed across manga, motion, sound, and physical editions.',
    href: '/dual',
  },
  {
    title: 'Hana',
    kicker: 'Studio Intelligence',
    body: 'The operating intelligence behind AFROMATIONS — built to support research, continuity, planning, asset organization, and publishing.',
    href: '/hana',
  },
  {
    title: 'Artist Collaborations',
    kicker: 'Human Work',
    body: 'A growing record of real artists, real places, and commissioned or collaborative creative work.',
    href: '/artists',
  },
  {
    title: 'Community Projects',
    kicker: 'Social Purpose',
    body: 'Creative projects built around neighborhoods, artists, youth, and documented community outcomes.',
    href: '/community',
  },
]

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Work</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            Original worlds, real collaborations, visible proof.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            AFROMATIONS is a Seattle-based art and animation studio building original IP while creating pathways for artists and community projects.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-white/8 bg-white/8 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link key={project.title} href={project.href} className="group min-h-[360px] bg-(--af-black) p-7 transition-colors hover:bg-white/[.025] sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <span className="text-[10px] font-semibold tracking-[0.2em] text-(--af-gold) uppercase">{project.kicker}</span>
                <span className="text-xs text-white/30">{String(index + 1).padStart(2,'0')}</span>
              </div>
              <div className="mt-24">
                <h2 className="text-3xl font-bold tracking-[-.04em] sm:text-4xl" style={{fontFamily:'Sora, sans-serif'}}>{project.title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-(--af-grey-light)">{project.body}</p>
                <span className="mt-8 inline-flex text-xs font-semibold tracking-[0.16em] text-(--af-cream) uppercase">View project →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Proof rule</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            If we say artists, we show artists. If we say community, we show the work.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
            This site is being built around documented projects, credited contributors, and real outputs. Empty claims do not get promoted to finished case studies.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
