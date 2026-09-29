import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Shop — AFROMATIONS',
  description: 'AFROMATIONS physical releases, books, prints, soundtracks, and limited editions.',
}

export default function StorePage(){
  return(
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Shop"
        title="Physical releases when the work is ready."
        body="Prints, books, manga, apparel, soundtracks, and limited editions appear here only when there is real inventory or a clearly defined release."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Reserved release categories</SectionLabel>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Books + Manga','Prints + Art','Music + Sound','Limited Objects'].map((title)=>(
              <article key={title} className="overflow-hidden border border-white/8 bg-white/[.012]">
                <MediaSlot label={`${title} product photography`} className="aspect-square" />
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Reserved until real inventory exists.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="border border-dashed border-white/15 p-10 text-center sm:p-16">
            <p className="text-[10px] font-semibold tracking-[.22em] text-(--af-gold) uppercase">No fake inventory</p>
            <h2 className="mt-5 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>The first live product should be something people can actually buy.</h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/work" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Explore the Work</Link>
              <Link href="/stories" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold">Read Stories</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
