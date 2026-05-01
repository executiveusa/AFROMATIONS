'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ImpactIntakeForm } from '@/components/impact-intake-form'
import { InView } from '@/components/motion/in-view'

export default function DonatePage() {
  return (
    <main>
      <Navbar />

      <section className="min-h-screen bg-background px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
            className="mb-12"
          >
            <div className="text-(--af-red) text-sm uppercase tracking-widest font-bold mb-4">
              Support Community Work
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Sponsor AFROMATIONS
            </h1>
            <p className="text-lg text-(--af-grey-light) leading-relaxed mb-6">
              Your sponsorship funds cleanup crews, artist stipends, youth apprenticeships, school workshops, and open-source tools. Every dollar goes directly to Seattle neighborhoods and creative practitioners.
            </p>
          </InView>

          <div className="bg-(--af-grey) border border-(--af-red) border-opacity-30 rounded-lg p-6 mb-12">
            <p className="text-sm text-(--af-grey-light) leading-relaxed">
              <strong>Important:</strong> AFROMATIONS social purpose work is mission-driven, but unless explicitly stated through a qualified nonprofit partner, contributions may not be tax-deductible. Sponsorships support community projects, supplies, artist stipends, and program operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
              once
              className="border-l-2 border-(--af-red) pl-6"
            >
              <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                Cleanup Projects
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Fund graffiti removal and public space restoration in neighborhoods that need it most.
              </p>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              once
              className="border-l-2 border-(--af-red) pl-6"
            >
              <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                Artist Stipends
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Support creatives through paid mural commissions and apprenticeship wages.
              </p>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              once
              className="border-l-2 border-(--af-red) pl-6"
            >
              <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                Youth Programs
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Fund workshops, learning opportunities, and internships for Seattle youth.
              </p>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
              once
              className="border-l-2 border-(--af-red) pl-6"
            >
              <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                Technology & Tools
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Support Agent Hana development, education platforms, and open-source tools.
              </p>
            </InView>
          </div>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.5 }}
            once
            className="bg-(--af-grey) border border-(--af-red) border-opacity-30 rounded-lg p-8"
          >
            <ImpactIntakeForm
              formType="sponsor"
              title="Become a Sponsor"
              description="Tell us about your sponsorship goals and interests."
              fields={{
                name: true,
                email: true,
                phone: true,
                organization: true,
                role: false,
                neighborhood: false,
                projectType: true,
                budgetRange: true,
                timeline: true,
                message: true,
              }}
            />
          </InView>
        </div>
      </section>

      <Footer />
    </main>
  )
}
