'use client'

import { useEffect, useRef } from 'react'

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
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--af-red)] opacity-[0.04] blur-[120px]" />
      </div>

      {/* Vertical line accents */}
      <div className="pointer-events-none absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-[var(--af-red)]/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-[var(--af-red)]/10 to-transparent" />

      <div className="relative z-10 max-w-3xl text-center">
        {/* Eyebrow */}
        <p className="mb-6 text-[10px] font-medium tracking-[0.4em] text-[var(--af-red)] uppercase">
          Black-owned anime studio
        </p>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="text-5xl font-bold leading-[1.1] tracking-tight text-[var(--af-cream)] sm:text-7xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          AFROMATIONS
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[var(--af-grey-light)]">
          Where black culture meets anime craft. 3D characters, original
          stories, and a community built for creators who refuse to fit the
          mold.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#hanna"
            className="inline-flex h-10 items-center rounded-md bg-[var(--af-red)] px-6 text-xs font-semibold tracking-wider text-[var(--af-cream)] transition-colors hover:bg-[var(--af-red-dark)]"
          >
            Meet Agent Hanna
          </a>
          <a
            href="#gallery"
            className="inline-flex h-10 items-center rounded-md border border-white/10 px-6 text-xs font-semibold tracking-wider text-[var(--af-cream)] transition-colors hover:border-white/20"
          >
            View Gallery
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-[var(--af-grey-light)]">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[var(--af-grey-light)] to-transparent" />
        </div>
      </div>
    </section>
  )
}
