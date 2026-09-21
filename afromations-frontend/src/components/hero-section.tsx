'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

const DUAL_COVER =
  'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

// Drop the approved hero video URL here when the final file is available.
const DUAL_HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_33irX78ICVwRYWpFZ5l6a5vZbf5/95370aaf-e6ea-4605-b2b2-6b6c08fc3344.mp4'
const DUAL_HERO_HAS_VIDEO = Boolean(DUAL_HERO_VIDEO_URL)

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

function scramble(el: HTMLElement, final: string) {
  let frame = 0
  const totalFrames = 18

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
  }, 40)

  return () => window.clearInterval(interval)
}

export function HeroSection() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return

    const final = 'AFROMATIONS'
    el.textContent = '闇光影夢刀剣侍忍花二元'
    const timer = window.setTimeout(() => {
      const stop = scramble(el, final)
      ;(el as HTMLElement & { __stopScramble?: () => void }).__stopScramble = stop
    }, 600)

    return () => {
      window.clearTimeout(timer)
      ;(el as HTMLElement & { __stopScramble?: () => void }).__stopScramble?.()
    }
  }, [])

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/8"
      aria-labelledby="home-hero-title"
    >
      <div className="absolute inset-0 -z-30 bg-(--af-black)" />

      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 -z-20"
        aria-hidden="true"
      >
        {DUAL_HERO_HAS_VIDEO ? (
          <video
            className="h-full w-full object-cover"
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
            className="h-full w-full object-cover"
            loading="eager"
          />
        )}
      </motion.div>

      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,.18)_0%,rgba(5,5,5,.28)_42%,rgba(5,5,5,.92)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-14 pt-24 sm:px-8 sm:pb-20 lg:px-12">
        <div className="max-w-4xl">
          <motion.h1
            ref={wordmarkRef}
            id="home-hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="text-4xl font-extrabold tracking-[-0.055em] text-(--af-cream) sm:text-6xl lg:text-[5.5rem]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            AFROMATIONS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
            className="mt-5 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-(--af-cream) sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Original Worlds. Real Artists. Community Impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-8"
          >
            <a
              href="#work"
              className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
            >
              Explore
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
