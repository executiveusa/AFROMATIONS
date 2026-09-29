import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MediaSlot, PageIntro, SectionLabel } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Stories — AFROMATIONS',
  description: 'Artist interviews, behind-the-scenes work, DUAL development, and studio field notes from AFROMATIONS.',
}

const categories = ['Artists','DUAL','Studio','Community','Process','Field Notes']

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Stories"
        title="The people, process, and worlds behind the work."
        body="Artist interviews, behind-the-scenes production, DUAL development, studio process, and community field notes live here."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <MediaSlot label="Featured story — full-width image / video still" className="min-h-[430px]" />
          <div className="flex flex-col justify-end border border-white/8 p-7">
            <SectionLabel>Featured</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em]" style={{fontFamily:'Sora, sans-serif'}}>Featured story headline</h2>
            <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">Dek, contributor credits, location, and publication date.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category} className="border border-white/10 px-4 py-2 text-xs text-(--af-grey-light)">{category}</span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Artist interview','Behind the scenes','DUAL development','Studio field note','Community project','Process journal'].map((title)=>(
              <article key={title} className="overflow-hidden border border-white/8 bg-white/[.012]">
                <MediaSlot label={`${title} media`} className="aspect-[16/10]" />
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Headline, short description, date, credits.</p>
                </div>
              </article>
            ))}
          </div>

          <Link href="/blog" className="mt-10 inline-flex text-sm font-semibold text-(--af-cream)">View existing journal archive →</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
