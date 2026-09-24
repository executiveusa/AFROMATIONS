import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Hana — AFROMATIONS',
  description: 'Hana is the studio intelligence behind AFROMATIONS, supporting research, continuity, planning, asset organization, and publishing.',
}

const capabilities = [
  ['Research','Organizes references, project context, and creative research so decisions stay traceable.'],
  ['Production','Turns approved goals into practical production plans, checklists, and handoffs.'],
  ['Continuity','Tracks characters, worlds, visual rules, and project decisions across long-running work.'],
  ['Organization','Keeps files, assets, notes, and project knowledge structured around the work.'],
  ['Publishing','Supports stories, pages, launch materials, and release preparation without replacing human approval.'],
]

export default function HanaPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div className="flex min-h-[420px] items-center justify-center border border-dashed border-white/15 bg-white/[.02] p-8 text-center text-xs tracking-[.16em] text-white/30 uppercase">
            Hana visual / live interface slot
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-red) uppercase">Hana</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
              The studio intelligence behind AFROMATIONS.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light) sm:text-lg">
              Hana helps the studio research, organize, plan, preserve continuity, and publish. She stays behind the work instead of becoming the brand itself.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-5">
            {capabilities.map(([title,body])=>(
              <article key={title} className="min-h-64 bg-(--af-black) p-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-5 text-sm leading-7 text-(--af-grey-light)">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">Public surface</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-.04em] sm:text-5xl" style={{fontFamily:'Sora, sans-serif'}}>Useful on the surface. Complex backstage.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-(--af-grey-light)">
              The public experience focuses on what Hana helps the studio accomplish. Internal orchestration, infrastructure, approvals, and system plumbing remain backstage.
            </p>
          </div>
          <div className="border border-white/8 p-7 sm:p-9">
            <h3 className="text-xl font-semibold">Human approval remains the gate.</h3>
            <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">
              Publishing, spending, licensing, merchandise decisions, training data, and deployment remain subject to explicit studio approval.
            </p>
            <Link href="/studio" className="mt-7 inline-flex text-sm font-semibold text-(--af-cream)">See the studio →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
