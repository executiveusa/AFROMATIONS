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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-14">
      {/* Red radial accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--af-red) opacity-[0.04] blur-[120px]" />
      </div>

      {/* Vertical line accents */}
      <div className="pointer-events-none absolute inset-y-0 left-12 w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-12 w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent" />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Eyebrow — hand-drawn with Tegaki (use-case #1) */}
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

        {/* Main heading — kanji-scramble keeps running, Tegaki draws subtitle below (use-case #2) */}
        <h1
          ref={headingRef}
          className="text-5xl font-bold leading-[1.1] tracking-tight text-(--af-cream) sm:text-7xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('hero.title')}
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          {t('hero.description')}
        </p>

        {/* Hand-drawn sub-tagline — use-case #2 */}
        <div className="mt-4 flex justify-center">
          <TegakiText
            font="italianno"
            size={26}
            color="var(--af-cream)"
            style={{ opacity: 0.7 }}
          >
            {t('hero.tagline')}
          </TegakiText>
        </div>

        {/* CTA row */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#hanna"
            className="inline-flex h-10 items-center rounded-md bg-(--af-red) px-6 text-xs font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark)"
          >
            {t('hero.cta.hanna')}
          </a>
          <a
            href="#gallery"
            className="inline-flex h-10 items-center rounded-md border border-white/10 px-6 text-xs font-semibold tracking-wider text-(--af-cream) transition-colors hover:border-white/20"
          >
            {t('hero.cta.gallery')}
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-(--af-grey-light)">
          <span className="text-[10px] tracking-[0.3em] uppercase">{t('hero.scroll')}</span>
          <div className="h-8 w-px bg-linear-to-b from-(--af-grey-light) to-transparent" />
        </div>
      </div>
    </section>
  )
}
