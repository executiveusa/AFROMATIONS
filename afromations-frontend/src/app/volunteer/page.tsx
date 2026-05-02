'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ImpactIntakeForm } from '@/components/impact-intake-form'
import { InView } from '@/components/motion/in-view'

export default function VolunteerPage() {
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
              Join Us
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Volunteer With AFROMATIONS
            </h1>
            <p className="text-lg text-(--af-grey-light) leading-relaxed mb-6">
              We need people who care. Crew members. Organizers. Artists. Educators. Whether you have a few hours or want to build a career in community art, there&apos;s a place for you here.
            </p>
          </InView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
              once
            >
              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                  Cleanup Crew
                </h3>
                <p className="text-(--af-grey-light)">
                  Help remove graffiti responsibly and restore public spaces. No experience needed.
                </p>
              </div>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              once
            >
              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                  Artist Apprentice
                </h3>
                <p className="text-(--af-grey-light)">
                  Learn mural painting, design, and community art practice. Paid opportunities available.
                </p>
              </div>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              once
            >
              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                  Community Organizer
                </h3>
                <p className="text-(--af-grey-light)">
                  Connect neighborhoods, coordinate projects, build partnerships with schools and nonprofits.
                </p>
              </div>
            </InView>

            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
              once
            >
              <div className="border-l-2 border-(--af-red) pl-6">
                <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                  Teacher / Instructor
                </h3>
                <p className="text-(--af-grey-light)">
                  Lead workshops on art, Japanese language, AI tools, or community practice.
                </p>
              </div>
            </InView>
          </div>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.5 }}
            once
            className="bg-(--af-grey) border border-(--af-red) border-opacity-30 rounded-lg p-8 mb-12"
          >
            <ImpactIntakeForm
              formType="volunteer"
              title="Tell Us About Your Interests"
              description="Help us match you with the right projects and roles."
              fields={{
                name: true,
                email: true,
                phone: true,
                organization: false,
                role: true,
                neighborhood: true,
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
