import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Artists — AFROMATIONS',
  description: 'The AFROMATIONS artist network: real creators, real work, real places, and future paid creative opportunities.',
}

export default function ArtistsPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Artists"
        title="Real names. Real work. Real places."
        body="AFROMATIONS is building a visible artist network around credited creative work, collaboration, and future paid opportunities."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <article key={n} className="overflow-hidden border border-white/8 bg-white/[.012]">
                <MediaSlot label={`Verified artist portrait / artwork — slot ${String(n).padStart(2, '0')}`} className="aspect-[4/5]" />
                <div className="p-5">
                  <p className="text-[10px] font-semibold tracking-[.18em] text-white/30 uppercase">Profile placeholder</p>
                  <h2 className="mt-4 text-xl font-semibold">Artist Name</h2>
                  <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">City · Discipline · AFROMATIONS project</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <SectionLabel>Artist stories</SectionLabel>
            <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
              The artist page should show more than a portrait.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              Interviews, process images, location, discipline, and project context can turn each profile into a real record of the person and the work.
            </p>
          </div>
          <MediaSlot label="Featured artist interview / studio visit / short documentary" className="min-h-[340px]" />
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Join the network</SectionLabel>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}>
            Build your creative world into something sustainable.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
            The artist pathway can support portfolio presentation, production, publishing, commissions, merchandise, licensing preparation, and practical operations.
          </p>
          <Link href="/apply?path=artist" className="af-btn-primary mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Apply as an Artist</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
