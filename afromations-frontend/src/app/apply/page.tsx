import type { Metadata } from 'next'
import Link from 'next/link'
import { ApplicationForm } from './form'

export const metadata: Metadata = {
  title: 'Work With Us — AFROMATIONS',
  description:
    'Apply as an artist or bring AFROMATIONS a project. Share the goal, people involved, schedule, and budget so we can scope the right collaboration.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-5 py-4 sm:px-8" aria-label="Breadcrumb">
        <div className="mx-auto flex max-w-4xl items-center gap-3 text-xs">
          <Link href="/" className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</Link>
          <span className="text-(--af-grey-light)">/</span>
          <span>Work With Us</span>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">Work with AFROMATIONS</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-.045em] sm:text-6xl" style={{ fontFamily: 'Sora, sans-serif' }}>
          Start with the work. Build the right relationship from there.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-(--af-grey-light)">
          Choose the path that fits: join the artist network or bring us a project. Tell us what you want to make, who it is for, your timeline, and the budget range you are working with. We review submissions personally.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="border border-white/10 p-5">
            <p className="text-sm font-semibold text-(--af-cream)">I’m an Artist</p>
            <p className="mt-2 text-sm leading-6 text-(--af-grey-light)">Portfolio, discipline, location, interests, and the kind of work you want to be considered for.</p>
          </div>
          <div className="border border-white/10 p-5">
            <p className="text-sm font-semibold text-(--af-cream)">I Have a Project</p>
            <p className="mt-2 text-sm leading-6 text-(--af-grey-light)">Goal, audience, deliverables, schedule, collaborators, and budget so the scope starts grounded.</p>
          </div>
        </div>

        <div className="mt-10 border border-white/10 bg-white/[.025] p-5 sm:p-8">
          <ApplicationForm />
        </div>
      </div>
    </main>
  )
}
