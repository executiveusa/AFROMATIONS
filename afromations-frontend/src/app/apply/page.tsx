import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ApplicationForm } from './form'

export const metadata: Metadata = {
  title: 'Work With Us',
  description:
    'Apply as an artist or bring AFROMATIONS a project. Share the goal, people involved, schedule, and budget so we can scope the right collaboration.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />

      <section className="px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">
            Work with AFROMATIONS
          </p>
          <h1
            className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-.05em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            Start with the work. Build the right relationship from there.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-(--af-grey-light)">
            Choose the path that fits: join the artist network or bring us a project. Tell us what you want to make,
            who it is for, your timeline, and the budget range you are working with. We review submissions personally.
          </p>
        </div>
      </section>

      <section className="border-y border-white/8 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto grid max-w-4xl gap-px overflow-hidden border border-white/8 bg-white/8 sm:grid-cols-2">
          <article className="bg-(--af-black) p-6 sm:p-8">
            <p className="text-[10px] font-semibold tracking-[.2em] text-(--af-gold) uppercase">Artist path</p>
            <h2 className="mt-4 text-xl font-semibold text-(--af-cream)">I’m an Artist</h2>
            <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">
              Share your portfolio, discipline, location, interests, and the kind of paid work you want to be
              considered for.
            </p>
          </article>

          <article className="bg-(--af-black) p-6 sm:p-8">
            <p className="text-[10px] font-semibold tracking-[.2em] text-(--af-gold) uppercase">Project path</p>
            <h2 className="mt-4 text-xl font-semibold text-(--af-cream)">I Have a Project</h2>
            <p className="mt-4 text-sm leading-7 text-(--af-grey-light)">
              Share the goal, audience, deliverables, schedule, collaborators, and budget so the scope starts
              grounded.
            </p>
          </article>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-4xl border border-white/10 bg-white/[.02] p-5 sm:p-8 lg:p-10">
          <ApplicationForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
