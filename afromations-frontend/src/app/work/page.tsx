import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Work — AFROMATIONS',
  description: 'Original worlds, studio systems, artist collaborations, and community projects from AFROMATIONS.',
}

const projects = [
  {
    title: 'DUAL',
    kicker: 'Original World',
    body: 'The flagship AFROMATIONS IP, developed across story, manga, motion, sound, and physical editions.',
    href: '/dual',
    media: 'DUAL key art / motion still',
  },
  {
    title: 'Hana',
    kicker: 'Studio Intelligence',
    body: 'The studio intelligence supporting research, continuity, production planning, organization, and publishing.',
    href: '/hana',
    media: 'Hana portrait / live interface',
  },
  {
    title: 'Artist Collaborations',
    kicker: 'Human Work',
    body: 'Credited creative work from artists connected to AFROMATIONS projects and commissions.',
    href: '/artists',
    media: 'Artist collaboration photography / artwork',
  },
  {
    title: 'Community Projects',
    kicker: 'Social Purpose',
    body: 'Documented creative work tied to neighborhoods, artists, youth, and community partners.',
    href: '/community',
    media: 'Community project photo / short film still',
  },
]

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Work"
        title="Original worlds, real collaborations, visible proof."
        body="This is the public index for AFROMATIONS projects. Every finished case study should show the work, the people involved, and the output."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              key={project.title}
              href={project.href}
              className="group overflow-hidden border border-white/8 bg-white/[.012] transition-colors hover:border-white/20 hover:bg-white/[.025]"
            >
              <MediaSlot label={project.media} className="min-h-[300px] sm:min-h-[380px]" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-(--af-gold) uppercase">{project.kicker}</span>
                  <span className="text-xs text-white/25">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h2 className="mt-8 text-3xl font-bold tracking-[-.04em] sm:text-4xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {project.title}
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-(--af-grey-light)">{project.body}</p>
                <span className="mt-8 inline-flex text-xs font-semibold tracking-[0.16em] text-(--af-cream) uppercase">View project →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Proof standard</SectionLabel>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
            Work gets promoted only when there is something real to show.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-3">
            {[
              ['People', 'Names, credits, collaborators, and roles stay visible.'],
              ['Process', 'Development, source material, and decisions are documented when useful.'],
              ['Output', 'Finished media, releases, or project proof replace abstract claims.'],
            ].map(([title, body]) => (
              <article key={title} className="min-h-52 bg-(--af-black) p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
