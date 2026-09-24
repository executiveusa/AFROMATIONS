import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Artists — AFROMATIONS',
  description: 'The AFROMATIONS artist network: real creators, real work, real places, and future paid creative opportunities.',
}

export default function ArtistsPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Artists</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            Real names. Real work. Real places.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            AFROMATIONS is building a visible artist network around credited creative work, collaboration, and future paid opportunities.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1,2,3].map((n)=>(
              <article key={n} className="border border-white/8 bg-white/[.015]">
                <div className="aspect-[4/5] border-b border-dashed border-white/12" />
                <div className="p-5">
                  <p className="text-[10px] font-semibold tracking-[.18em] text-white/30 uppercase">Verified artist slot {String(n).padStart(2,'0')}</p>
                  <h2 className="mt-4 text-xl font-semibold">Profile pending real media + approval</h2>
                  <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Name · City · Discipline · Project</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Join the network</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            Build your creative world into something sustainable.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
            The artist pathway is being built around portfolio support, production, publishing, commissions, merchandise, licensing preparation, and practical operations.
          </p>
          <Link href="/apply?path=artist" className="af-btn-primary mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Apply as an Artist</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
