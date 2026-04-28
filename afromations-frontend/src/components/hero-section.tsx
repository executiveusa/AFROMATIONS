'use client'

import { useEffect, useRef } from 'react'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

function scramble(el: HTMLElement, final: string) {
  let frame = 0
  const total = 14
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
  }, 38)
}

/* ─── Subtle floating ember effect on hero ─── */
function useEmberCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }
    let particles: Particle[] = []
    let raf: number

    function emit() {
      const w = canvas!.width
      const h = canvas!.height
      particles.push({
        x: w * 0.3 + Math.random() * w * 0.4,
        y: h * 0.5 + Math.random() * h * 0.3,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.3 + Math.random() * 0.7),
        life: 0,
        maxLife: 80 + Math.random() * 120,
        size: 0.5 + Math.random() * 1.8,
      })
      if (particles.length > 60) particles.shift()
    }

    function loop() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      emit()
      particles = particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.004
        p.life++
        const a = Math.pow(1 - p.life / p.maxLife, 1.6)
        if (a <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,160,23,${(a * 0.2).toFixed(3)})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,200,80,${a.toFixed(3)})`
        ctx.fill()
        return true
      })
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [canvasRef])
}

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useI18n()

  useEmberCanvas(canvasRef)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const final = el.textContent ?? ''
    const timer = setTimeout(() => scramble(el, final), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pt-14 sm:px-6"
      aria-label="Hero"
    >
      {/* ── Cinematic Battle Background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5d47160a-6b1b-46e3-b4d4-73eece0f9bd5-aP54HFYy97hSyAwi01hC4C5mvAgjl5.png"
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ filter: 'brightness(0.32) saturate(1.1)' }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 15%, rgba(10,10,10,0.6) 55%, rgba(10,10,10,0.95) 100%)',
          }}
        />
        {/* Bottom scrim */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)' }}
        />
        {/* Top scrim */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 100%)' }}
        />
        {/* Subtle red tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(196,30,30,0.04)' }}
        />
      </div>

      {/* ── Ember Canvas ── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden="true"
      />

      {/* ── Hana silhouette panel — desktop only ── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[2] hidden lg:block"
        style={{ height: '90%', width: '38%' }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2ac394a7-27d0-4d7b-ad58-0a0232d83168-xjZaGgeN2SVNi451pGipd6BnB6OYJ5.png"
          alt=""
          className="h-full w-full object-contain object-bottom"
          style={{
            filter: 'brightness(0.75) drop-shadow(-6px 0 32px rgba(196,30,30,0.35))',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 55%, transparent 100%)',
            opacity: 0.65,
          }}
        />
      </div>

      {/* ── Vertical line accents ── */}
      <div className="pointer-events-none absolute inset-y-0 left-12 hidden w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-12 hidden w-px bg-linear-to-b from-transparent via-(--af-red)/10 to-transparent sm:block" />

      {/* ── Kanji accent top-left ── */}
      <div
        className="pointer-events-none absolute left-5 top-20 z-[2] hidden sm:block"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(48px, 6vw, 80px)',
            color: 'rgba(196,30,30,0.18)',
            fontWeight: 900,
            lineHeight: 1,
            display: 'block',
          }}
        >
          花
        </span>
      </div>

      {/* ── Main Content ── */}
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

        {/* Primary headline */}
        <h1
          ref={headingRef}
          className="font-bold leading-[0.95] tracking-tight text-(--af-cream)"
          style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2.25rem, 10vw, 6.5rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
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

        {/* CTA row */}
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

        {/* Footnote */}
        <p
          className="mx-auto mt-3 max-w-sm px-2 text-xs leading-relaxed text-(--af-grey-light) sm:px-0"
          style={{ opacity: 0.75 }}
        >
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
