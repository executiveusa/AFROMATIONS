import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ApplicationForm } from './form'
import { PageIntro } from '@/components/site-primitives'

export const metadata: Metadata = {
  title: 'Work With Us — AFROMATIONS',
  description: 'Apply as an artist or bring AFROMATIONS a project.',
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <PageIntro
        eyebrow="Work With Us"
        title="Start with the work."
        body="Choose the path that fits: join the artist network or bring us a project. Tell us what you want to make, who it is for, your timeline, and the budget range you are working with."
      />

      <section className="border-y border-white/8 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-white/10 p-6">
              <p className="text-sm font-semibold text-(--af-cream)">I’m an Artist</p>
              <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Portfolio, discipline, location, interests, availability, and the work you want to be considered for.</p>
            </div>
            <div className="border border-white/10 p-6">
              <p className="text-sm font-semibold text-(--af-cream)">I Have a Project</p>
              <p className="mt-3 text-sm leading-6 text-(--af-grey-light)">Goal, audience, deliverables, schedule, collaborators, and budget so the scope starts grounded.</p>
            </div>
          </div>

          <div className="mt-8 border border-white/10 bg-white/[.025] p-5 sm:p-8">
            <ApplicationForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
