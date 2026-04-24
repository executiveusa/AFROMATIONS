'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

function scramble(el: HTMLElement, final: string) {
  let frame = 0
  const total = 18
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
  }, 40)
}

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const final = el.textContent ?? ''
    const timer = setTimeout(() => scramble(el, final), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-14"
      aria-label="Hero"
    >
      {/* Red radial accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--af-red) opacity-[0.04] blur-[120px]" />
      </div>

      {/* Vertical line accents */}
      <div className="pointer-events-none absolute inset-y-0 left-12 w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-12 w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent" />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Eyebrow */}
        <div className="mb-6 flex justify-center">
          <TegakiText
            font="tangerine"
            size={22}
            color="var(--af-red)"
            className="tracking-[0.4em] uppercase"
          >
            {t('hero.eyebrow')}
          </TegakiText>
        </div>

        {/* Primary headline — AFROMATIONS with scramble reveal */}
        <h1
          ref={headingRef}
          className="font-bold leading-[0.95] tracking-tight text-(--af-cream)"
          style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(3.5rem, 10vw, 6.5rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle — community value prop */}
        <h2
          className="mx-auto mt-6 max-w-2xl font-semibold leading-[1.2] text-(--af-cream)"
          style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)' }}
        >
          {t('hero.subtitle')}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          {t('hero.description')}
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#blog"
            className="af-btn-primary inline-flex h-11 items-center rounded-full px-6 text-xs font-semibold tracking-wider"
            aria-label={t('hero.cta.trends')}
          >
            {t('hero.cta.trends')}
          </a>
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="af-btn-secondary inline-flex h-11 items-center rounded-full border px-6 text-xs font-semibold tracking-wider"
            aria-label="Join the AFROMATIONS Discord community"
          >
            {t('hero.cta.discord')}
          </a>
        </div>

        {/* Hand-drawn tagline */}
        <div className="mt-6 flex justify-center">
          <TegakiText
            font="italianno"
            size={26}
            color="var(--af-cream)"
            style={{ opacity: 0.7 }}
          >
            {t('hero.tagline')}
          </TegakiText>
        </div>

        {/* Footnote — Hanna callout */}
        <p className="mt-4 text-xs leading-relaxed text-(--af-grey-light)" style={{ opacity: 0.75 }}>
          {t('hero.footnote')}
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-(--af-grey-light)">
          <span className="text-[10px] tracking-[0.3em] uppercase">{t('hero.scroll')}</span>
          <div className="h-8 w-px bg-linear-to-b from-(--af-grey-light) to-transparent" />
        </div>
      </div>
    </section>
  )
}
