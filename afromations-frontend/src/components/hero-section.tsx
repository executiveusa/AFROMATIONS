'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

const DUAL_COVER =
  'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

// Temporary source. Replace this URL with the user's final 12–15 second edit when ready.
// The website timing and AFROMATIONS reveal are already wired for the final cut.
const DUAL_HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_33irX78ICVwRYWpFZ5l6a5vZbf5/95370aaf-e6ea-4605-b2b2-6b6c08fc3344.mp4'

const DUAL_HERO_HAS_VIDEO = Boolean(DUAL_HERO_VIDEO_URL)
const BRAND_REVEAL_DELAY_MS = 11500
const BRAND_RESOLVE_DELAY_MS = 12000
const COPY_REVEAL_DELAY_MS = 13000

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

function scramble(el: HTMLElement, final: string) {
  let frame = 0
  const totalFrames = 22

  const interval = window.setInterval(() => {
    const progress = frame / totalFrames
    const output = final
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index / Math.max(final.length - 1, 1) < progress) return char
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join('')

    el.textContent = output
    frame += 1

    if (frame > totalFrames) {
      window.clearInterval(interval)
      el.textContent = final
    }
  }, 42)

  return () => window.clearInterval(interval)
}

export function HeroSection() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const [brandVisible, setBrandVisible] = useState(false)
  const [copyVisible, setCopyVisible] = useState(false)

  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      el.textContent = 'AFROMATIONS'
      setBrandVisible(true)
      setCopyVisible(true)
      return
    }

    let stopScramble: (() => void) | undefined

    const revealTimer = window.setTimeout(() => {
      el.textContent = '闇光影夢刀剣侍忍花二元'
      setBrandVisible(true)
    }, BRAND_REVEAL_DELAY_MS)

    const resolveTimer = window.setTimeout(() => {
      stopScramble = scramble(el, 'AFROMATIONS')
    }, BRAND_RESOLVE_DELAY_MS)

    const copyTimer = window.setTimeout(() => {
      setCopyVisible(true)
    }, COPY_REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(resolveTimer)
      window.clearTimeout(copyTimer)
      stopScramble?.()
    }
  }, [])

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/8"
      aria-labelledby="home-hero-title"
    >
      <div className="absolute inset-0 -z-30 bg-(--af-black)" />

      <motion.div
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 -z-20"
        aria-hidden="true"
      >
        {DUAL_HERO_HAS_VIDEO ? (
          <video
            className="h-full w-full object-cover object-center"
            src={DUAL_HERO_VIDEO_URL}
            poster={DUAL_COVER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={DUAL_COVER}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
        )}
      </motion.div>

      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,.10)_0%,rgba(5,5,5,.18)_40%,rgba(5,5,5,.88)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="w-full max-w-5xl">
          <div className="min-h-[7rem] sm:min-h-[10rem]">
            <motion.h1
              ref={wordmarkRef}
              id="home-hero-title"
              initial={false}
              animate={{ opacity: brandVisible ? 1 : 0, y: brandVisible ? 0 : 14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-extrabold leading-none tracking-[-0.055em] text-(--af-cream) sm:text-6xl lg:text-[5.5rem]"
              style={{ fontFamily: 'Sora, sans-serif' }}
              aria-live="polite"
            >
              AFROMATIONS
            </motion.h1>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: copyVisible ? 1 : 0, y: copyVisible ? 0 : 12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden={!copyVisible}
          >
            <p
              className="mt-3 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.035em] text-(--af-cream) sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Original Worlds. Real Artists. Community Impact.
            </p>

            <a
              href="#work"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-(--af-cream) px-7 text-sm font-semibold text-(--af-black) transition-opacity hover:opacity-85"
            >
              Explore
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
