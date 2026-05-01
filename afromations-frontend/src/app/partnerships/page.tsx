'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ImpactIntakeForm } from '@/components/impact-intake-form'
import { InView } from '@/components/motion/in-view'

export default function PartnershipsPage() {
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
              Work Together
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Partner With AFROMATIONS
            </h1>
            <p className="text-lg text-(--af-grey-light) leading-relaxed mb-6">
              We work with schools, nonprofits, businesses, government agencies, and community organizations to align on shared goals: cleaner neighborhoods, paid opportunities for artists, youth education, and sustainable social impact.
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
                Schools & Education
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Curriculum partnerships, field trips, artist residencies, and youth apprenticeships integrated with school programs.
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
                Nonprofits & Community
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Co-designed programs where our expertise in art, cleanup, and youth training amplifies their mission.
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
                Businesses & Property
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Cleanup, commissioned murals, public art partnerships, and community goodwill initiatives.
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
                Government & Agencies
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Contracts for cleanup, community engagement, and youth programs in partnership with city initiatives.
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
              formType="community_partner"
              title="Let&apos;s Build Together"
              description="Tell us about your organization and partnership interests."
              fields={{
                name: true,
                email: true,
                phone: true,
                organization: true,
                role: true,
                neighborhood: false,
                projectType: true,
                budgetRange: false,
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
