'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

// Drop an MP4 file into /public and set this path to enable the hero video.
// Leave as null to show the default gradient background.
const HERO_VIDEO_SRC: string | null = null
// e.g. const HERO_VIDEO_SRC = '/videos/hero.mp4'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

function scramble(el: HTMLElement, final: string) {
  let frame = 0
  const total = 12
  const interval = setInterval(() => {
    el.textContent = final
      .split('')
      .map((ch, i) => {
        if (i < Math.floor((frame / total) * final.length)) return ch
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join('')
    frame++
    if (frame > total) {
      el.textContent = final
      clearInterval(interval)
    }
  }, 22)
}

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const final = el.textContent ?? ''
    const timer = setTimeout(() => scramble(el, final), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pt-14 sm:px-6"
      aria-label="Hero"
    >
      {/* ── Background: video when available, gradient fallback ── */}
      {HERO_VIDEO_SRC ? (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
          {/* Dark overlay so text stays readable over the video */}
          <div className="absolute inset-0 bg-(--af-black)/60" aria-hidden="true" />
        </>
      ) : (
        /* Red radial accent — contained, no overflow risk */
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[min(600px,120vw)] w-[min(600px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--af-red) opacity-[0.04] blur-[120px]" />
        </div>
      )}

      {/* Vertical line accents — hidden on small screens */}
      <div className="pointer-events-none absolute inset-y-0 left-12 hidden w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-12 hidden w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent sm:block" />

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Eyebrow */}
        <div className="mb-5 flex justify-center">
          <TegakiText
            font="tangerine"
            size={20}
            color="var(--af-red)"
            className="tracking-[0.4em] uppercase"
          >
            {t('hero.eyebrow')}
          </TegakiText>
        </div>

        {/* Primary headline — fluid size that never overflows on iPhone SE (320px) */}
        <h1
          ref={headingRef}
          className="font-bold leading-[0.95] tracking-tight text-(--af-cream)"
          style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2.25rem, 10vw, 6.5rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle — balanced wrapping, readable on all phones */}
        <h2
          className="mx-auto mt-5 max-w-2xl font-semibold leading-[1.25] text-(--af-cream)"
          style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(1.1rem, 3.5vw, 2.5rem)',
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          {t('hero.subtitle')}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-lg px-2 text-sm leading-relaxed text-(--af-grey-light) sm:px-0">
          {t('hero.description')}
        </p>

        {/* CTA row — stacked on mobile, side-by-side on sm+ */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 px-4 sm:flex-row sm:items-center sm:px-0">
          <a
            href="#blog"
            className="af-btn-primary inline-flex h-12 items-center justify-center rounded-full px-7 text-xs font-semibold tracking-wider sm:h-11"
            aria-label={t('hero.cta.trends')}
          >
            {t('hero.cta.trends')}
          </a>
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="af-btn-secondary inline-flex h-12 items-center justify-center rounded-full border px-7 text-xs font-semibold tracking-wider sm:h-11"
            aria-label="Join the AFROMATIONS Discord community"
          >
            {t('hero.cta.discord')}
          </a>
        </div>

        {/* Hand-drawn tagline */}
        <div className="mt-5 flex justify-center">
          <TegakiText
            font="italianno"
            size={24}
            color="var(--af-cream)"
            style={{ opacity: 0.7 }}
          >
            {t('hero.tagline')}
          </TegakiText>
        </div>

        {/* Footnote — Hanna callout */}
        <p className="mx-auto mt-3 max-w-sm px-2 text-xs leading-relaxed text-(--af-grey-light) sm:px-0" style={{ opacity: 0.75 }}>
          {t('hero.footnote')}
        </p>

        {/* Scroll indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 text-(--af-grey-light)">
          <span className="text-[10px] tracking-[0.3em] uppercase">{t('hero.scroll')}</span>
          <div className="h-8 w-px bg-linear-to-b from-(--af-grey-light) to-transparent" />
        </div>
      </div>
    </section>
  )
}
