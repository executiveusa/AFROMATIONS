'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ─── Katakana + kanji charset for scramble ─── */
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ闇光影夢刀剣侍忍二元'

/* ─── Ember Particle ─── */
interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

/* ─── DUAL Images ─── */
const DUAL_IMAGES = {
  cover: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_25_37%20AM-fhMW4mJmUIV5lL44XH2ghKMLfnv77m.png',
  manga1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_53_07%20AM-c90xwOhR9LyobrtvRs9gFtb158FrNY.png',
  panel1: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_31_02%20AM-FtXiIchT5dcQd6pGEvQcY1f0jpfzUU.png',
  panel2: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_30_56%20AM-ID0ZkdpVYmqsnzqJnx6s11LL8i4YBj.png',
  knockKnock: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2028%2C%202026%2C%2002_26_37%20AM-IlGAQ3eME88gOTq3AoXkD3oxal5X3w.png',
}

/* ─── Phase definitions
  0 — hidden (session already seen)
  1 — black screen → city skyline fades in with rain
  2 — kanji stamp 二 (DUAL) + gold flash
  3 — DUAL character panel slides in
  4 — manga cover slam
  5 — title scramble
  6 — dissolve out
─── */

function scramble(target: string, frame: number, total: number): string {
  return target
    .split('')
    .map((ch, i) => {
      if (i < Math.floor((frame / total) * target.length)) return ch
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join('')
}

export function CinematicIntro() {
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)
  const [titleText, setTitleText] = useState('')
  const [subVisible, setSubVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const embersRef = useRef<Ember[]>([])
  const rafRef = useRef<number>(0)

  /* Check session */
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('af-intro-dual')) {
      setDone(true)
    }
  }, [])

  /* Phase timeline — slower pacing for cinematic feel */
  useEffect(() => {
    if (done) return
    const t = [
      setTimeout(() => setPhase(1), 300),   // city bg fades in
      setTimeout(() => setPhase(2), 1400),  // kanji stamp
      setTimeout(() => setPhase(3), 2500),  // DUAL panel slides
      setTimeout(() => setPhase(4), 3800),  // manga cover slam
      setTimeout(() => setPhase(5), 5000),  // title scramble
      setTimeout(() => setSubVisible(true), 5900),
      setTimeout(() => setPhase(6), 6800),  // dissolve
      setTimeout(() => {
        setDone(true)
        sessionStorage.setItem('af-intro-dual', '1')
      }, 8000),
    ]
    return () => t.forEach(clearTimeout)
  }, [done])

  /* Title scramble — DUAL */
  useEffect(() => {
    if (phase < 5) return
    const target = 'DUAL'
    let frame = 0
    const total = 16
    const iv = setInterval(() => {
      setTitleText(scramble(target, frame, total))
      frame++
      if (frame > total) {
        setTitleText(target)
        clearInterval(iv)
      }
    }, 55)
    return () => clearInterval(iv)
  }, [phase])

  /* Ember canvas — active from phase 2 (city lights / rain particles) */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase < 2 || done) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const isMobile = window.innerWidth < 768
    const maxEmbers = isMobile ? 35 : 70
    const COLORS = ['rgba(255,200,100,', 'rgba(220,180,80,', 'rgba(255,160,60,']

    function emit() {
      const cx = canvas!.width * (0.2 + Math.random() * 0.6)
      const cy = canvas!.height * (0.3 + Math.random() * 0.4)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8
      const speed = 0.4 + Math.random() * 1.8
      embersRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        life: 0,
        maxLife: 50 + Math.random() * 70,
        size: 0.4 + Math.random() * 1.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      if (embersRef.current.length > maxEmbers) embersRef.current.shift()
    }

    function loop() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < (isMobile ? 1 : 3); i++) emit()
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.012
        e.vx *= 0.995
        e.life++
        const alpha = Math.pow(1 - e.life / e.maxLife, 1.5)
        if (alpha <= 0) return false
        // glow halo
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size + 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `${e.color}${(alpha * 0.2).toFixed(3)})`
        ctx.fill()
        // core
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fillStyle = `${e.color}${alpha.toFixed(3)})`
        ctx.fill()
        return true
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phase, done])

  const skip = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setDone(true)
    sessionStorage.setItem('af-intro-dual', '1')
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      <motion.div
        key="dual-intro"
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#000]"
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={skip}
        role="presentation"
        aria-hidden="true"
      >

        {/* ── 1: Seattle 2056 City Background ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{
            opacity: phase >= 1 && phase < 6 ? 1 : 0,
            scale: phase >= 1 ? 1 : 1.06,
          }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DUAL_IMAGES.panel1}
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.5) saturate(1.1) contrast(1.05)' }}
          />
          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 15%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.85) 100%)',
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
          />
          {/* Top fade */}
          <div
            className="absolute inset-x-0 top-0 h-28"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)' }}
          />
        </motion.div>

        {/* ── Ember Canvas ── */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: phase >= 6 ? 0 : 1,
            transition: 'opacity 1.2s',
          }}
        />

        {/* ── 2: Kanji Stamp — 二 (NI = Two / Dual) ── */}
        <AnimatePresence>
          {phase >= 2 && phase < 4 && (
            <motion.div
              className="pointer-events-none absolute z-20 select-none"
              style={{ top: '10%', left: '6%' }}
              initial={{ opacity: 0, scale: 2.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  fontFamily: 'serif',
                  fontSize: 'clamp(80px, 16vw, 160px)',
                  color: 'rgba(212,160,23,0.9)',
                  fontWeight: 900,
                  lineHeight: 1,
                  display: 'block',
                  textShadow: '0 0 80px rgba(212,160,23,0.5)',
                }}
              >
                二
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Gold flash on kanji stamp ── */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 0.55 }}
              style={{ background: 'rgba(212,160,23,1)' }}
            />
          )}
        </AnimatePresence>

        {/* ── 3: DUAL character panel slides in from right ── */}
        <AnimatePresence>
          {phase >= 3 && phase < 5 && (
            <motion.div
              className="pointer-events-none absolute bottom-0 right-0 z-20 flex items-end"
              style={{ height: '90%', maxWidth: '55vw' }}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DUAL_IMAGES.knockKnock}
                alt=""
                className="h-full w-full object-contain object-bottom"
                style={{
                  filter: 'drop-shadow(-10px 0 50px rgba(212,160,23,0.4))',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 55%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 55%, transparent 100%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4: Manga Cover slam in ── */}
        <AnimatePresence>
          {phase >= 4 && phase < 6 && (
            <motion.div
              className="pointer-events-none absolute z-20 overflow-hidden rounded-sm shadow-[0_0_100px_rgba(0,0,0,0.95)]"
              style={{
                width: 'clamp(180px, 32vw, 380px)',
                right: '4%',
                top: '50%',
                translateY: '-50%',
              }}
              initial={{ scale: 1.5, opacity: 0, rotate: 8 }}
              animate={{
                scale: phase >= 6 ? 0.75 : 1,
                opacity: phase >= 6 ? 0 : 1,
                rotate: phase >= 6 ? -5 : 0,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DUAL_IMAGES.cover}
                alt=""
                className="w-full"
              />
              {/* Glint sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.8, delay: 0.25, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 5: Title scramble + subtitle ── */}
        <AnimatePresence>
          {phase >= 5 && phase < 6 && (
            <motion.div
              className="absolute z-30 text-center"
              style={{ bottom: 'clamp(12%, 16vw, 20%)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              {/* SEATTLE 2056 eyebrow */}
              <p
                className="mb-2 tracking-[0.5em] uppercase"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(10px, 1.6vw, 13px)',
                  color: 'var(--af-gold, #d4a017)',
                }}
              >
                SEATTLE 2056 · CHAPTER 1
              </p>

              <h1
                className="font-black tracking-[0.12em]"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(3rem, 12vw, 8rem)',
                  color: 'var(--af-cream, #f5f0e8)',
                  textShadow: '0 0 80px rgba(212,160,23,0.4)',
                }}
              >
                {titleText}
              </h1>

              {subVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="mt-3 flex items-center justify-center gap-4"
                >
                  <div className="h-px w-10 bg-[#d4a017]/50" />
                  <span
                    className="tracking-[0.45em] uppercase"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 'clamp(10px, 1.3vw, 12px)',
                      color: 'rgba(245,240,232,0.6)',
                    }}
                  >
                    Knock at the Door
                  </span>
                  <div className="h-px w-10 bg-[#d4a017]/50" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dissolve overlay ── */}
        <AnimatePresence>
          {phase >= 6 && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-40 bg-[#0a0a0a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeIn' }}
            />
          )}
        </AnimatePresence>

        {/* ── Skip hint ── */}
        <motion.p
          className="absolute bottom-6 z-50 text-[10px] tracking-[0.4em] uppercase sm:bottom-10"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5 }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
