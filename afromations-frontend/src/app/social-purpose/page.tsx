'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { InView } from '@/components/motion/in-view'
import { motion } from 'framer-motion'
import Link from 'next/link'

const SERVICES = [
  {
    title: 'Graffiti Cleanup',
    description: 'We coordinate crews, artists, and community partners to remove graffiti responsibly and restore public-facing spaces.',
    href: '/graffiti-cleanup',
  },
  {
    title: 'Community Murals',
    description: 'We help property owners, schools, nonprofits, and neighborhoods turn blank or damaged walls into commissioned art.',
    href: '/commission',
  },
  {
    title: 'Paid Artist Opportunities',
    description: 'Artists should not have to work for exposure. We build paid projects, apprenticeships, and repeatable creative contracts.',
    href: '/volunteer',
  },
  {
    title: 'School & Youth Programs',
    description: 'We create workshops where students learn mural planning, storytelling, cultural research, teamwork, and AI-assisted design.',
    href: '/volunteer',
  },
  {
    title: 'AI Education',
    description: 'Agent Hana helps artists learn practical AI workflows, Japanese language through anime, visual storytelling, and creative business skills.',
    href: '/learn',
  },
  {
    title: 'Community Impact Reporting',
    description: 'As a social purpose company, we track what matters: walls cleaned, murals created, artists paid, youth trained, and community dollars reinvested.',
    href: '/social-purpose',
  },
]

const IMPACT_CARDS = [
  {
    title: 'Service Revenue',
    description: 'Businesses, property owners, schools, and agencies pay for cleanup, mural, and training services.',
  },
  {
    title: 'Artist Payments',
    description: 'Project budgets include compensation for artists, crew leads, educators, and apprentices.',
  },
  {
    title: 'Community Sponsorships',
    description: 'Sponsors help fund discounted work for schools, nonprofits, and neighborhoods.',
  },
  {
    title: 'Reinvestment',
    description: 'A portion of profit supports community art, youth training, open-source tools, and future projects.',
  },
]

export default function SocialPurposePage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-background px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
          >
            <div className="text-(--af-red) text-sm uppercase tracking-widest font-bold mb-4">
              Building Community Impact
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-(--af-cream) mb-6">
              Art, Cleanup, and AI for a Better Seattle
            </h1>
            <p className="text-lg md:text-xl text-(--af-grey-light) max-w-2xl mx-auto leading-relaxed mb-8">
              AFROMATIONS is building a Seattle social purpose company that turns graffiti cleanup, community murals, and artist education into paid creative opportunities.
            </p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            once
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/volunteer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-primary px-6 py-3 font-semibold"
              >
                Volunteer
              </motion.button>
            </Link>
            <Link href="/donate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Sponsor Community Work
              </motion.button>
            </Link>
            <Link href="/commission">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Commission a Mural
              </motion.button>
            </Link>
            <Link href="/graffiti-cleanup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Request Cleanup
              </motion.button>
            </Link>
          </InView>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-(--af-grey) border-t border-(--af-red) border-opacity-30 px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              What We Do
            </h2>
            <p className="text-lg text-(--af-grey-light) max-w-2xl mx-auto">
              We partner with schools, neighborhoods, businesses, artists, and community groups to clean damaged spaces, commission public art, train local creatives, and teach practical AI skills through Agent Hana.
            </p>
          </InView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <InView
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                once
              >
                <Link href={service.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredService(service.title)}
                    onHoverEnd={() => setHoveredService(null)}
                    className="bg-background border border-(--af-red) border-opacity-30 hover:border-opacity-100 rounded-lg p-6 cursor-pointer transition-all h-full"
                  >
                    <h3 className="text-xl font-bold text-(--af-cream) mb-3">
                      {service.title}
                    </h3>
                    <p className="text-(--af-grey-light) leading-relaxed">
                      {service.description}
                    </p>
                    {hoveredService === service.title && (
                      <div className="text-(--af-red) text-sm font-semibold mt-4">
                        Learn more →
                      </div>
                    )}
                  </motion.div>
                </Link>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Social Purpose Section */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-6">
              Why a Social Purpose Company?
            </h2>
            <p className="text-lg text-(--af-grey-light) leading-relaxed">
              We are not positioning this as a traditional nonprofit. A social purpose company lets us earn revenue, pay artists, sell services, build software, and still keep the mission locked into the business. The goal is sustainable impact: clean spaces, paid artists, stronger neighborhoods, and tools that help creatives build long-term income.
            </p>
          </InView>

          {/* Key Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Mission-Driven Business',
                body: 'We profit sustainably while keeping social impact locked into every decision.',
              },
              {
                title: 'Artist-First Compensation',
                body: 'Every project includes direct payment to creatives, not "exposure" or charity.',
              },
              {
                title: 'Community Ownership',
                body: 'Reinvestment happens in the neighborhoods we serve, not extracted profits.',
              },
              {
                title: 'Transparency & Accountability',
                body: 'We report on walls cleaned, artists paid, youth trained, and impact delivered.',
              },
            ].map((item, i) => (
              <InView
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                once
              >
                <div className="border-l-2 border-(--af-red) pl-6">
                  <h3 className="text-lg font-bold text-(--af-cream) mb-2">
                    {item.title}
                  </h3>
                  <p className="text-(--af-grey-light)">
                    {item.body}
                  </p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* How Money Flows Section */}
      <section className="bg-(--af-grey) border-t border-(--af-red) border-opacity-30 px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              How the Model Works
            </h2>
          </InView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT_CARDS.map((card, i) => (
              <InView
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                once
              >
                <div className="bg-background border border-(--af-red) border-opacity-30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-(--af-cream) mb-3">
                    {card.title}
                  </h3>
                  <p className="text-(--af-grey-light) text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Us Section */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            once
          >
            <h2 className="text-4xl md:text-5xl font-black text-(--af-cream) mb-4">
              Work With Us
            </h2>
            <p className="text-lg text-(--af-grey-light) max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you need graffiti removed, want to commission a mural, sponsor a youth project, volunteer for a cleanup, or teach with us, this is the entry point.
            </p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            once
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/volunteer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-primary px-6 py-3 font-semibold"
              >
                Volunteer
              </motion.button>
            </Link>
            <Link href="/donate">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Donate / Sponsor
              </motion.button>
            </Link>
            <Link href="/commission">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Commission a Mural
              </motion.button>
            </Link>
            <Link href="/graffiti-cleanup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Request Cleanup
              </motion.button>
            </Link>
            <Link href="/partnerships">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="af-btn-secondary px-6 py-3 font-semibold"
              >
                Partner With Us
              </motion.button>
            </Link>
          </InView>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-(--af-grey) border-t border-(--af-red) border-opacity-30 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-(--af-grey-light) leading-relaxed">
            AFROMATIONS social purpose work is mission-driven, but unless explicitly stated through a qualified nonprofit partner, contributions may not be tax-deductible. Sponsorships support community projects, supplies, artist stipends, and program operations.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
