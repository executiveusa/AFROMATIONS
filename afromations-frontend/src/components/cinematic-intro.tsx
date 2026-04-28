'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ─── Katakana + kanji charset ─── */
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

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

/* ─── Phase definitions
  0 — hidden (session already seen)
  1 — black screen → battle image fades in
  2 — kanji stamp + red flash
  3 — character panel slides in
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
    if (typeof window !== 'undefined' && sessionStorage.getItem('af-intro-v2')) {
      setDone(true)
    }
  }, [])

  /* Phase timeline */
  useEffect(() => {
    if (done) return
    const t = [
      setTimeout(() => setPhase(1), 200),   // battle bg fades in
      setTimeout(() => setPhase(2), 1100),  // kanji stamp
      setTimeout(() => setPhase(3), 2000),  // character panel slides
      setTimeout(() => setPhase(4), 3000),  // manga cover slam
      setTimeout(() => setPhase(5), 4000),  // title scramble
      setTimeout(() => setSubVisible(true), 4800),
      setTimeout(() => setPhase(6), 5600),  // dissolve
      setTimeout(() => {
        setDone(true)
        sessionStorage.setItem('af-intro-v2', '1')
      }, 6600),
    ]
    return () => t.forEach(clearTimeout)
  }, [done])

  /* Title scramble */
  useEffect(() => {
    if (phase < 5) return
    const target = 'AFROMATIONS'
    let frame = 0
    const total = 20
    const iv = setInterval(() => {
      setTitleText(scramble(target, frame, total))
      frame++
      if (frame > total) {
        setTitleText(target)
        clearInterval(iv)
      }
    }, 50)
    return () => clearInterval(iv)
  }, [phase])

  /* Ember canvas — active from phase 2 */
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
    const maxEmbers = isMobile ? 40 : 90
    const COLORS = ['rgba(245,200,80,', 'rgba(220,80,30,', 'rgba(255,140,60,']

    function emit() {
      const cx = canvas!.width * (0.35 + Math.random() * 0.3)
      const cy = canvas!.height * (0.4 + Math.random() * 0.25)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
      const speed = 0.6 + Math.random() * 2.8
      embersRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 0,
        maxLife: 40 + Math.random() * 60,
        size: 0.6 + Math.random() * 2.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      if (embersRef.current.length > maxEmbers) embersRef.current.shift()
    }

    function loop() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < (isMobile ? 2 : 4); i++) emit()
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.018
        e.vx *= 0.995
        e.life++
        const alpha = Math.pow(1 - e.life / e.maxLife, 1.4)
        if (alpha <= 0) return false
        // glow halo
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size + 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `${e.color}${(alpha * 0.25).toFixed(3)})`
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
    sessionStorage.setItem('af-intro-v2', '1')
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      <motion.div
        key="hana-intro"
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#000]"
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        onClick={skip}
        role="presentation"
        aria-hidden="true"
      >

        {/* ── 1: Battle Background ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{
            opacity: phase >= 1 && phase < 6 ? 1 : 0,
            scale: phase >= 1 ? 1 : 1.08,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5d47160a-6b1b-46e3-b4d4-73eece0f9bd5-aP54HFYy97hSyAwi01hC4C5mvAgjl5.png"
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.55) saturate(1.2)' }}
          />
          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.88) 100%)',
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
          />
          {/* Top fade */}
          <div
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
          />
        </motion.div>

        {/* ── Ember Canvas ── */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: phase >= 6 ? 0 : 1,
            transition: 'opacity 1s',
          }}
        />

        {/* ── 2: Kanji Stamp — 前 (Zen = Forward/Before) ── */}
        <AnimatePresence>
          {phase >= 2 && phase < 4 && (
            <motion.div
              className="pointer-events-none absolute z-20 select-none"
              style={{ top: '8%', left: '5%' }}
              initial={{ opacity: 0, scale: 2.5, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  fontFamily: 'serif',
                  fontSize: 'clamp(72px, 14vw, 140px)',
                  color: 'rgba(196,30,30,0.85)',
                  fontWeight: 900,
                  lineHeight: 1,
                  display: 'block',
                  textShadow: '0 0 60px rgba(196,30,30,0.4)',
                }}
              >
                前
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Red flash on kanji stamp ── */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.18, 0] }}
              transition={{ duration: 0.5 }}
              style={{ background: 'rgba(196,30,30,1)' }}
            />
          )}
        </AnimatePresence>

        {/* ── 3: Character Panel slides in from right ── */}
        <AnimatePresence>
          {phase >= 3 && phase < 5 && (
            <motion.div
              className="pointer-events-none absolute bottom-0 right-0 z-20 flex items-end"
              style={{ height: '92%', maxWidth: '50vw' }}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2ac394a7-27d0-4d7b-ad58-0a0232d83168-xjZaGgeN2SVNi451pGipd6BnB6OYJ5.png"
                alt=""
                className="h-full w-full object-contain object-bottom"
                style={{
                  filter: 'drop-shadow(-8px 0 40px rgba(196,30,30,0.5))',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, transparent 100%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4: Manga Cover slam in ── */}
        <AnimatePresence>
          {phase >= 4 && phase < 6 && (
            <motion.div
              className="pointer-events-none absolute z-20 overflow-hidden rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.9)]"
              style={{
                width: 'clamp(160px, 28vw, 320px)',
                right: '5%',
                top: '50%',
                translateY: '-50%',
              }}
              initial={{ scale: 1.4, opacity: 0, rotate: 6 }}
              animate={{
                scale: phase >= 6 ? 0.8 : 1,
                opacity: phase >= 6 ? 0 : 1,
                rotate: phase >= 6 ? -4 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2026%2C%202026%2C%2010_25_32%20AM-H9nWCiJQUtMgQw9D4TJ7rO63m8ICtA.png"
                alt=""
                className="w-full"
              />
              {/* Glint sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 5: Title scramble + subtitle ── */}
        <AnimatePresence>
          {phase >= 5 && phase < 6 && (
            <motion.div
              className="absolute z-30 text-center"
              style={{ bottom: 'clamp(14%, 18vw, 22%)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
            >
              {/* ONNA-BUGEISHA eyebrow */}
              <p
                className="mb-2 tracking-[0.45em] text-[#c41e1e] uppercase"
                style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(9px, 1.5vw, 12px)' }}
              >
                ONNA-BUGEISHA · WARRIORS OF LIGHT
              </p>

              <h1
                className="font-black tracking-[0.08em] text-[#f5f0e8]"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 'clamp(2rem, 8vw, 5.5rem)',
                  textShadow: '0 0 60px rgba(196,30,30,0.35)',
                }}
              >
                {titleText}
              </h1>

              {subVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 flex items-center justify-center gap-3"
                >
                  <div className="h-px w-8 bg-[#c41e1e]/50" />
                  <span
                    className="tracking-[0.4em] text-[#f5f0e8]/60 uppercase"
                    style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(9px, 1.2vw, 11px)' }}
                  >
                    Studios
                  </span>
                  <div className="h-px w-8 bg-[#c41e1e]/50" />
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
              transition={{ duration: 1, ease: 'easeIn' }}
            />
          )}
        </AnimatePresence>

        {/* ── Skip hint ── */}
        <motion.p
          className="absolute bottom-5 z-50 text-[10px] tracking-[0.35em] text-white/20 uppercase sm:bottom-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
