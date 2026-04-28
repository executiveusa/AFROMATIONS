'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'
import { TextEffect } from '@/components/motion/text-effect'
import { InView } from '@/components/motion/in-view'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ闇光影夢二元'

/* ─── DUAL Images ─── */
const DUAL_IMAGES = {
  cover: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_25_37%20AM-fhMW4mJmUIV5lL44XH2ghKMLfnv77m.png',
  panel1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_31_02%20AM-FtXiIchT5dcQd6pGEvQcY1f0jpfzUU.png',
  panel2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_30_56%20AM-ID0ZkdpVYmqsnzqJnx6s11LL8i4YBj.png',
}

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
  const taglineRef = useRef<HTMLDivElement>(null)
  const taglineInView = useInView(taglineRef, { once: true })
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
      {/* ── Cinematic DUAL Background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DUAL_IMAGES.panel2}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ filter: 'brightness(0.35) saturate(1.05) contrast(1.02)' }}
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
        {/* Subtle gold tint overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(212,160,23,0.03)' }} />
      </div>

      {/* ── Ember Canvas ── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        aria-hidden="true"
      />

      {/* ── DUAL silhouette panel — desktop only ── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[2] hidden lg:block"
        style={{ height: '88%', width: '36%' }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DUAL_IMAGES.cover}
          alt=""
          className="h-full w-full object-contain object-bottom"
          style={{
            filter: 'brightness(0.7) drop-shadow(-8px 0 40px rgba(212,160,23,0.3))',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8) 50%, transparent 100%)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* ── Vertical line accents ── */}
      <div className="pointer-events-none absolute inset-y-0 left-12 hidden w-px bg-linear-to-b from-transparent via-(--af-gold)/10 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-12 hidden w-px bg-linear-to-b from-transparent via-(--af-gold)/10 to-transparent sm:block" />

      {/* ── Kanji accent top-left — 二 (DUAL) ── */}
      <div
        className="pointer-events-none absolute left-5 top-20 z-[2] hidden sm:block"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(48px, 6vw, 80px)',
            color: 'rgba(212,160,23,0.18)',
            fontWeight: 900,
            lineHeight: 1,
            display: 'block',
          }}
        >
          二
        </span>
      </div>

      {/* ── Main Content — fully centered ── */}
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">

        {/* ── Affirmations label (top) — centered tegaki ── */}
        <InView
          variants={{
            hidden: { opacity: 0, y: -16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          once
          className="mb-1 flex justify-center"
        >
          <TegakiText
            font="tangerine"
            size={18}
            color="var(--af-gold)"
            className="tracking-[0.5em] uppercase"
          >
            Affirmations
          </TegakiText>
        </InView>

        {/* ── Anime Community — tegaki slides in centered ── */}
        <InView
          variants={{
            hidden: { opacity: 0, x: -48 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          once
          className="mb-5 flex justify-center"
        >
          <TegakiText
            font="tangerine"
            size={20}
            color="var(--af-red)"
            className="tracking-[0.4em] uppercase"
          >
            {t('hero.eyebrow')}
          </TegakiText>
        </InView>

        {/* Primary headline */}
        <h1
          ref={headingRef}
          className="font-bold leading-[0.95] tracking-tight text-(--af-cream)"
          style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2.25rem, 10vw, 6.5rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* "Where Worlds Collide, Stories Ignite" — 20% bigger, centered, scroll-in */}
        <div ref={taglineRef} className="mt-6 flex justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={taglineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="max-w-2xl text-center font-semibold leading-[1.2] text-(--af-cream)"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(1.32rem, 4.2vw, 3rem)',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {t('hero.subtitle')}
          </motion.h2>
        </div>

        {/* Description — centered */}
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          delay={0.35}
          className="mx-auto mt-5 max-w-lg px-2 text-center text-sm leading-relaxed text-(--af-grey-light) sm:px-0"
        >
          {t('hero.description')}
        </TextEffect>

        {/* CTA row — equal size buttons, fully centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4 sm:px-0"
        >
          <a
            href="#blog"
            className="af-btn-primary inline-flex h-12 w-full items-center justify-center rounded-full px-8 text-xs font-semibold tracking-wider sm:w-auto sm:min-w-[220px]"
            aria-label={t('hero.cta.trends')}
          >
            {t('hero.cta.trends')}
          </a>
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="af-btn-secondary inline-flex h-12 w-full items-center justify-center rounded-full border px-8 text-xs font-semibold tracking-wider sm:w-auto sm:min-w-[220px]"
            aria-label="Join the AFROMATIONS Discord community"
          >
            {t('hero.cta.discord')}
          </a>
        </motion.div>

        {/* "Powered by Agent Hana" — centered below buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-5 flex justify-center"
        >
          <p
            className="text-center text-[10px] tracking-[0.35em] uppercase"
            style={{ color: 'var(--af-grey-light)', opacity: 0.7 }}
          >
            Powered by Agent{' '}
            <span style={{ color: 'var(--af-red)' }}>Hana</span>
            {' '}花
          </p>
        </motion.div>

        {/* Hand-drawn tagline — centered tegaki */}
        <div className="mt-5 flex justify-center">
          <TegakiText
            font="italianno"
            size={26}
            color="var(--af-cream)"
            style={{ opacity: 0.75 }}
            triggerOnView
          >
            {t('hero.tagline')}
          </TegakiText>
        </div>

        {/* Footnote — centered */}
        <p
          className="mx-auto mt-3 max-w-md px-2 text-center text-xs leading-relaxed text-(--af-grey-light) sm:px-0"
          style={{ opacity: 0.7 }}
        >
          {t('hero.footnote')}
        </p>

        {/* Scroll indicator — centered */}
        <div className="mt-12 flex flex-col items-center gap-2 text-(--af-grey-light)">
          <span className="text-[10px] tracking-[0.35em] uppercase">{t('hero.scroll')}</span>
          <div className="h-8 w-px bg-linear-to-b from-(--af-grey-light) to-transparent" />
        </div>
      </div>
    </section>
  )
}
