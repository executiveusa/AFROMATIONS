'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ImpactIntakeForm } from '@/components/impact-intake-form'
import { InView } from '@/components/motion/in-view'

export default function CommissionPage() {
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
              Hire Our Artists
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Commission a Mural
            </h1>
            <p className="text-lg text-(--af-grey-light) leading-relaxed mb-6">
              Need to transform a wall or space? We work with schools, nonprofits, businesses, and property owners to create stunning public art while supporting Seattle artists with fair compensation and creative freedom.
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
                School Murals
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Transform hallways, playgrounds, and cafeterias with artwork that reflects your community.
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
                Community Art
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Commission art that celebrates neighborhood culture, history, and vision for the future.
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
                Business Branding
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Custom murals that make your space memorable and aligned with your brand values.
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
                Youth Collaborations
              </h3>
              <p className="text-(--af-grey-light) text-sm">
                Mentored mural projects where young artists work alongside professionals on paid commissions.
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
              formType="mural_commission"
              title="Request a Mural Commission"
              description="Tell us about your space, vision, and timeline."
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
