'use client'

import { useRef, useEffect } from 'react'

interface KineticMarqueeProps {
  items: string[]
  speed?: number
  reverse?: boolean
  className?: string
}

export function KineticMarquee({ items, speed = 30, reverse = false, className }: KineticMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const direction = reverse ? 1 : -1
    let lastTime = 0

    function tick(time: number) {
      if (!track) return
      const delta = lastTime ? (time - lastTime) / 1000 : 0
      lastTime = time
      posRef.current += direction * speed * delta
      const halfWidth = track.scrollWidth / 2
      if (Math.abs(posRef.current) >= halfWidth) {
        posRef.current = posRef.current % halfWidth
      }
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, reverse])

  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex shrink-0 items-center px-6 sm:px-10">
            <span
              className="text-4xl font-bold tracking-tight text-(--af-cream) opacity-[0.06] sm:text-6xl md:text-7xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {item}
            </span>
            <span className="mx-6 inline-block h-2 w-2 rounded-full bg-(--af-red) opacity-20 sm:mx-10" />
          </span>
        ))}
      </div>
    </div>
  )
}
