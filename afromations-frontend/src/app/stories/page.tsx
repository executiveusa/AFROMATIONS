import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Stories — AFROMATIONS',
  description: 'Artist interviews, behind-the-scenes work, DUAL development, and studio field notes from AFROMATIONS.',
}

const categories = [
  ['Artists','Interviews and profiles from the people making the work.'],
  ['DUAL','Worldbuilding, visual development, manga, sound, and production notes.'],
  ['Studio','Process, experiments, tools, and production decisions.'],
  ['Community','Field notes and documentation from community-facing work.'],
]

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Stories</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            The people, process, and worlds behind the work.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
            AFROMATIONS uses publishing as proof: artist interviews, field notes, behind-the-scenes production, and the ongoing development of DUAL.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2">
          {categories.map(([title,body],i) => (
            <article key={title} className="min-h-64 bg-(--af-black) p-7 sm:p-9">
              <div className="text-xs text-white/30">{String(i+1).padStart(2,'0')}</div>
              <h2 className="mt-14 text-2xl font-bold sm:text-3xl" style={{fontFamily:'Sora, sans-serif'}}>{title}</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-(--af-grey-light)">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Publishing queue</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Artist interview','Behind the scenes','DUAL development'].map((title)=>(
              <article key={title} className="border border-white/8 bg-white/[.015]">
                <div className="aspect-[16/10] border-b border-dashed border-white/12 bg-white/[.015]" />
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Reserved for a real story once the media and credits are cleared.</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/blog" className="mt-8 inline-flex text-sm font-semibold text-(--af-cream)">View the existing journal archive →</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
