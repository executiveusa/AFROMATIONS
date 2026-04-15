'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ─── Katakana charset for text scramble ─── */
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'

/* ─── SVG Gear Generator ─── */
function makeGearPath(teeth: number, outerR: number): string {
  const innerR = outerR * 0.8
  const seg = (2 * Math.PI) / teeth
  const tw = seg * 0.28

  const pts: string[] = []
  for (let i = 0; i < teeth; i++) {
    const a = i * seg
    pts.push(`${(outerR * Math.cos(a - tw)).toFixed(1)},${(outerR * Math.sin(a - tw)).toFixed(1)}`)
    pts.push(`${(outerR * Math.cos(a + tw)).toFixed(1)},${(outerR * Math.sin(a + tw)).toFixed(1)}`)
    const va = a + seg / 2
    pts.push(`${(innerR * Math.cos(va - tw)).toFixed(1)},${(innerR * Math.sin(va - tw)).toFixed(1)}`)
    pts.push(`${(innerR * Math.cos(va + tw)).toFixed(1)},${(innerR * Math.sin(va + tw)).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

function GearSVG({
  size,
  teeth,
  className,
  style,
}: {
  size: number
  teeth: number
  className?: string
  style?: React.CSSProperties
}) {
  const r = size / 2 - 2
  const holeR = r * 0.3
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={makeGearPath(teeth, r)} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="0" cy="0" r={holeR} fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/* ─── Spark Particle Interface ─── */
interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

/* ─── Main Cinematic Intro ─── */
export function CinematicIntro() {
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)
  const [scrambleText, setScrambleText] = useState('')
  const [studiosVisible, setStudiosVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const rafRef = useRef<number>(0)

  /* Check session — only play once per visit */
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('af-intro')) {
      setDone(true)
    }
  }, [])

  /* Phase timeline orchestrator */
  useEffect(() => {
    if (done) return
    const timers = [
      setTimeout(() => setPhase(1), 300),     // gears + steam appear
      setTimeout(() => setPhase(2), 1000),    // logo reveals
      setTimeout(() => setPhase(3), 2500),    // sparks + energy pulse
      setTimeout(() => setPhase(4), 3500),    // text scramble
      setTimeout(() => setStudiosVisible(true), 4300),
      setTimeout(() => setPhase(5), 5200),    // dissolve
      setTimeout(() => {
        setDone(true)
        sessionStorage.setItem('af-intro', '1')
      }, 6200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [done])

  /* Text scramble for "AFROMATIONS" */
  useEffect(() => {
    if (phase < 4) return
    const target = 'AFROMATIONS'
    let frame = 0
    const total = 22
    const iv = setInterval(() => {
      setScrambleText(
        target
          .split('')
          .map((ch, i) => {
            if (i < Math.floor((frame / total) * target.length)) return ch
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      frame++
      if (frame > total) {
        setScrambleText(target)
        clearInterval(iv)
      }
    }, 45)
    return () => clearInterval(iv)
  }, [phase])

  /* Canvas spark particles */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase < 3 || done) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const isMobile = window.innerWidth < 768
    const maxSparks = isMobile ? 35 : 70

    function emit() {
      const cx = canvas!.width / 2
      const cy = canvas!.height / 2 - 20
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3.5
      sparksRef.current.push({
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 0,
        maxLife: 35 + Math.random() * 45,
        size: 0.8 + Math.random() * 2.2,
      })
      if (sparksRef.current.length > maxSparks) sparksRef.current.shift()
    }

    function loop() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < (isMobile ? 2 : 3); i++) emit()

      sparksRef.current = sparksRef.current.filter((s) => {
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.025
        s.life++
        const alpha = 1 - s.life / s.maxLife
        if (alpha <= 0) return false

        // Golden ember glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size + 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 160, 23, ${alpha * 0.3})`
        ctx.fill()
        // Core spark
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 200, 80, ${alpha})`
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

  /* Tap / click to skip */
  const skip = useCallback(() => {
    setDone(true)
    sessionStorage.setItem('af-intro', '1')
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro"
        className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        onClick={skip}
      >
        {/* ── Steam Wisps ── */}
        {phase >= 1 && (
          <div className="pointer-events-none absolute inset-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="intro-steam"
                style={{
                  left: `${12 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* ── Rotating Gears ── */}
        {phase >= 1 && (
          <>
            <GearSVG
              size={180}
              teeth={12}
              className="intro-gear-cw"
              style={{
                position: 'absolute',
                top: '8%',
                right: '3%',
                color: 'rgba(100, 120, 140, 0.12)',
              }}
            />
            <GearSVG
              size={140}
              teeth={8}
              className="intro-gear-ccw"
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '2%',
                color: 'rgba(100, 120, 140, 0.12)',
              }}
            />
            <GearSVG
              size={100}
              teeth={10}
              className="intro-gear-cw-slow"
              style={{
                position: 'absolute',
                top: '55%',
                right: '10%',
                color: 'rgba(100, 120, 140, 0.08)',
              }}
            />
            <GearSVG
              size={70}
              teeth={6}
              className="intro-gear-ccw"
              style={{
                position: 'absolute',
                top: '20%',
                left: '8%',
                color: 'rgba(100, 120, 140, 0.08)',
              }}
            />
          </>
        )}

        {/* ── Spark Canvas ── */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: phase >= 5 ? 0 : 1, transition: 'opacity 0.8s' }}
        />

        {/* ── Red Glow Behind Logo ── */}
        {phase >= 2 && (
          <motion.div
            className="absolute z-0"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.3, 1],
              opacity: [0, 0.2, 0.1],
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          >
            <div
              className="h-62.5 w-62.5 rounded-full sm:h-90 sm:w-90"
              style={{
                background: 'radial-gradient(circle, rgba(196,30,30,0.5) 0%, rgba(196,30,30,0.1) 40%, transparent 70%)',
              }}
            />
          </motion.div>
        )}

        {/* ── Logo Reveal ── */}
        {phase >= 2 && (
          <motion.div
            className="relative z-20"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: phase >= 5 ? 1.3 : 1,
              opacity: phase >= 5 ? 0 : 1,
            }}
            transition={{
              scale: { duration: phase >= 5 ? 0.6 : 1.2, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: phase >= 5 ? 0.5 : 0.8, ease: 'easeOut' },
            }}
          >
            {/* Screen shake on sparks phase */}
            <motion.div
              animate={
                phase === 3
                  ? {
                      x: [0, -2, 3, -1, 2, -1, 0],
                      y: [0, 1, -2, 3, -1, 2, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <div className="relative overflow-hidden rounded-full border-2 border-white/10 shadow-2xl"
                style={{
                  width: 'clamp(160px, 45vw, 260px)',
                  height: 'clamp(160px, 45vw, 260px)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="AFROMATIONS Studios"
                  className="h-full w-full scale-[1.15] object-cover"
                  style={{
                    objectPosition: '50% 42%',
                    filter: `drop-shadow(0 0 30px rgba(196, 30, 30, 0.5))`,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Energy Pulse Flash ── */}
        {phase === 3 && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(212,160,23,0.3) 0%, transparent 55%)',
            }}
          />
        )}

        {/* ── Text Scramble Reveal ── */}
        {phase >= 4 && (
          <motion.div
            className="absolute z-20 text-center"
            style={{ bottom: 'clamp(18%, 22vw, 26%)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: phase >= 5 ? 0 : 1,
              y: 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-2xl font-bold tracking-[0.12em] text-[#f5f0e8] sm:text-4xl md:text-5xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {scrambleText}
            </h1>
            {studiosVisible && (
              <motion.p
                className="mt-1 text-[10px] font-medium tracking-[0.5em] text-[#c41e1e] uppercase sm:text-xs sm:mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Studios
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── Smoke Dissolve ── */}
        {phase >= 5 && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 0%, transparent 15%, rgba(10,10,10,0.6) 40%, #0a0a0a 65%)',
              }}
            />
            {/* Smoke particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={`smoke-${i}`}
                className="pointer-events-none absolute z-30 rounded-full"
                style={{
                  width: `${60 + i * 30}px`,
                  height: `${60 + i * 30}px`,
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 3) * 15}%`,
                  background: `radial-gradient(circle, rgba(80,80,80,0.15) 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5], y: -40 }}
                transition={{ duration: 1.5, delay: i * 0.12 }}
              />
            ))}
          </>
        )}

        {/* ── Skip Hint ── */}
        <motion.p
          className="absolute bottom-5 z-50 text-[10px] tracking-[0.3em] text-white/25 uppercase sm:bottom-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5 }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
