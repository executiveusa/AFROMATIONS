'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ImpactIntakeForm } from '@/components/impact-intake-form'
import { InView } from '@/components/motion/in-view'

export default function GraffitiCleanupPage() {
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
              Community Restoration
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Request Graffiti Cleanup
            </h1>
            <p className="text-lg text-(--af-grey-light) leading-relaxed mb-6">
              Damaged walls and spaces harm communities. We coordinate professional crews to remove graffiti responsibly, with care for the space and respect for the community. Services are available at sliding scale based on your budget.
            </p>
          </InView>

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
                Property Restoration
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Remove graffiti from building facades, fences, and infrastructure to restore neighborhood appearance.
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
                Mural Prevention
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                After cleanup, we can commission protective murals that deter future damage and beautify spaces.
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
                Youth Engagement
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Cleanup projects that include youth apprenticeships create jobs and change narratives.
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
                Community Coordination
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                We work with neighborhoods to make cleanup part of broader community improvement efforts.
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
              formType="graffiti_cleanup"
              title="Request Cleanup Service"
              description="Tell us about the affected area and your needs."
              fields={{
                name: true,
                email: true,
                phone: true,
                organization: true,
                role: false,
                neighborhood: true,
                projectType: false,
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
