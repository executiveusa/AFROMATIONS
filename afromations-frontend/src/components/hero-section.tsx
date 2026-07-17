'use client'

import { motion } from 'motion/react'

const DUAL_COVER =
  'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

export function HeroSection() {
  return (
    <section
      className="relative isolate min-h-[92svh] overflow-hidden border-b border-white/5 px-5 pb-16 pt-28 sm:px-8 lg:px-12"
      aria-labelledby="home-hero-title"
    >
      <div className="absolute inset-0 -z-30 bg-(--af-black)" />
      <motion.div
        initial={{ opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 -z-20"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DUAL_COVER}
          alt=""
          className="h-full w-full object-cover object-[62%_center] sm:object-center"
          loading="eager"
        />
      </motion.div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,5,5,.98) 0%, rgba(5,5,5,.88) 34%, rgba(5,5,5,.35) 68%, rgba(5,5,5,.62) 100%), linear-gradient(0deg, #0a0a0a 0%, transparent 45%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[72svh] max-w-7xl items-end gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
        <div className="max-w-3xl pb-8 lg:pb-0">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 text-[10px] font-semibold tracking-[0.32em] text-(--af-gold) uppercase sm:text-xs"
          >
            Seattle 2056 // Built by artists. Owned by artists.
          </motion.p>

          <motion.h1
            id="home-hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl text-4xl font-extrabold leading-[.96] tracking-[-.055em] text-(--af-cream) sm:text-6xl lg:text-[5.8rem]"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            Every world starts with one original character.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-(--af-grey-light) sm:text-xl"
          >
            Enter Dual&apos;s story. Then watch Hana turn the same character into manga,
            motion, merchandise, and an artist-owned creative business—with every human
            creator credited, paid, and in control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="/dual"
              className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-wide"
            >
              Enter Dual&apos;s World
            </a>
            <a
              href="/artist-partner-program"
              className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold tracking-wide"
            >
              Tattoo Artists: Join the Founding Circle
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[11px] tracking-wide text-(--af-grey-light)"
          >
            <span>AI-assisted</span>
            <span aria-hidden="true">◆</span>
            <span>Human-finished</span>
            <span aria-hidden="true">◆</span>
            <span>Creator-owned</span>
            <span aria-hidden="true">◆</span>
            <span>Proven from first sketch to final drop</span>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="hidden self-end pb-8 lg:block"
          aria-label="AFROMATIONS artist promise"
        >
          <div className="ml-auto max-w-sm border border-(--af-gold)/30 bg-black/70 p-1 backdrop-blur-sm">
            <div className="border border-white/10 px-6 py-6">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-(--af-gold) uppercase">
                The AFROMATIONS promise
              </p>
              <p className="mt-4 text-2xl font-bold leading-tight text-(--af-cream)" style={{ fontFamily: 'Sora, sans-serif' }}>
                AI drafts. Artists author. We prove the process.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
                No hidden training rights. No silent ownership grabs. Every collaboration gets
                written terms, contributor credit, payment records, and a verifiable certificate.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
