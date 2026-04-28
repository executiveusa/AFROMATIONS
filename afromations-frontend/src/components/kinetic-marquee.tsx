'use client'

import { useRef, useEffect } from 'react'
import { prepareWithSegments, measureNaturalWidth } from '@chenglou/pretext'

interface KineticMarqueeProps {
  items: string[]
  speed?: number
  reverse?: boolean
  className?: string
}

// Per-item spacing: padding (px-6/px-10 each side) + separator margins (mx-6/mx-10 each side) + dot width (8px)
// mobile: 24+24 + 24+24 + 8 = 104px | sm+: 40+40 + 40+40 + 8 = 168px
const ITEM_SPACING_MOBILE = 104
const ITEM_SPACING_SM = 168

// Measure the total natural width of one copy of all items using pretext.
// Called once after fonts load and again whenever the viewport breakpoint changes.
// prepareWithSegments uses canvas measureText (no DOM layout read).
async function computeHalfWidth(items: string[], isSm: boolean, isMd: boolean): Promise<number> {
  await document.fonts.ready

  const fontSize = isMd ? 72 : isSm ? 60 : 36  // md:text-7xl / sm:text-6xl / text-4xl
  const font = `700 ${fontSize}px Sora`
  const letterSpacing = -0.025 * fontSize        // tracking-tight = -0.025em
  const spacing = isSm ? ITEM_SPACING_SM : ITEM_SPACING_MOBILE

  let total = 0
  for (const item of items) {
    const prepared = prepareWithSegments(item, font, { letterSpacing })
    total += measureNaturalWidth(prepared) + spacing
  }
  return total
}

export function KineticMarquee({ items, speed = 30, reverse = false, className }: KineticMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const posRef = useRef(0)
  // Stores the pretext-measured half-width; avoids any DOM read inside the rAF loop
  const halfWidthRef = useRef<number>(0)

  // Measure once on mount; re-measure when viewport crosses sm/md breakpoints
  useEffect(() => {
    let cancelled = false

    function measure() {
      const isSm = window.matchMedia('(min-width: 640px)').matches
      const isMd = window.matchMedia('(min-width: 768px)').matches
      computeHalfWidth(items, isSm, isMd).then((w) => {
        if (!cancelled) halfWidthRef.current = w
      })
    }

    measure()

    // Re-measure at breakpoint boundaries only, not on every pixel of resize
    const smQuery = window.matchMedia('(min-width: 640px)')
    const mdQuery = window.matchMedia('(min-width: 768px)')
    smQuery.addEventListener('change', measure)
    mdQuery.addEventListener('change', measure)

    return () => {
      cancelled = true
      smQuery.removeEventListener('change', measure)
      mdQuery.removeEventListener('change', measure)
    }
  }, [items])

  // Animation loop — reads halfWidthRef, never touches the DOM layout
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

      // Pretext measurement lands asynchronously; fall back to scrollWidth until it arrives
      const halfWidth = halfWidthRef.current || track.scrollWidth / 2
      if (Math.abs(posRef.current) >= halfWidth) {
        posRef.current = posRef.current % halfWidth
      }
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, reverse])

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
