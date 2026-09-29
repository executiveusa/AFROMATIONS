import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'DUAL — AFROMATIONS',
  description: 'DUAL is the flagship original AFROMATIONS IP, a cinematic anime world under active development.',
}

const DUAL_COVER = 'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

const disciplines = [
  ['World', 'A rain-soaked future Seattle shaped by identity, memory, pressure, and contradiction.'],
  ['Character', 'DUAL is the visual and narrative anchor for the first AFROMATIONS original world.'],
  ['Manga', 'The story is being developed alongside page studies, canon notes, and visual storytelling tests.'],
  ['Motion', 'Action studies establish movement, atmosphere, camera language, and environmental behavior.'],
  ['Sound', 'Music and sound are part of the world from the beginning, not a finishing layer.'],
  ['Editions', 'Future books, prints, soundtrack releases, and physical objects belong here when they are real.'],
]

export default function DualPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />

      <section className="relative isolate min-h-[88svh] overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DUAL_COVER} alt="" className="h-full w-full object-cover object-[62%_center] sm:object-center" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.82)_38%,rgba(5,5,5,.25)_75%),linear-gradient(0deg,#0a0a0a_0%,transparent_52%)]" />
        <div className="mx-auto flex min-h-[70svh] max-w-7xl items-end lg:items-center">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-(--af-gold) uppercase">Flagship original IP</p>
            <h1 className="mt-5 text-7xl font-extrabold leading-[.86] tracking-[-.07em] sm:text-9xl lg:text-[10rem]" style={{ fontFamily: 'Sora, sans-serif' }}>
              DUAL
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
              A cinematic anime world being developed across story, manga, motion, sound, and physical media.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/manga" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Manga build</Link>
              <Link href="/stories" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold">Development stories</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map(([title, body]) => (
            <article key={title} className="min-h-56 bg-(--af-black) p-7">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Visual development</SectionLabel>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
            <MediaSlot label="Wide production still / environment study" className="min-h-[420px]" />
            <div className="grid gap-4">
              <MediaSlot label="Character close-up / canon study" className="min-h-[200px]" />
              <MediaSlot label="Action frame / motion test" className="min-h-[200px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel>Sound + media</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>The world should sound as specific as it looks.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              This space is reserved for soundtrack material, sound design studies, motion tests, and approved release media.
            </p>
          </div>
          <MediaSlot label="Audio player / soundtrack art / motion reel" className="min-h-[320px]" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Credits</SectionLabel>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
            The record stays attached to the work.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
            Approved artist credits, source material, production roles, and release contributors will live here as the project moves from development into finished editions.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
