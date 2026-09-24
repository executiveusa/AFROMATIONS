import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Shop — AFROMATIONS',
  description: 'Future AFROMATIONS physical releases, books, prints, soundtracks, and limited editions.',
}

export default function StorePage(){
  return(
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Shop</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            Physical releases when the work is ready.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            Prints, books, manga, apparel, soundtracks, and limited editions will appear here only when there is real inventory or a clearly defined release.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="border border-dashed border-white/15 p-10 text-center sm:p-16">
            <p className="text-[10px] font-semibold tracking-[.22em] text-(--af-gold) uppercase">No fake inventory</p>
            <h2 className="mt-5 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>The shop opens with the first real drop.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-(--af-grey-light)">Until then, follow the work and development stories instead of browsing placeholder products.</p>
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
