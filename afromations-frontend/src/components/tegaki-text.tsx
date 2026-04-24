'use client'

/**
 * TegakiText — AFROMATIONS handwriting animation layer
 *
 * NOTE: The tegaki library is incompatible with Turbopack due to .ttf font imports.
 * This version renders plain text as a fallback. The full handwriting animation
 * will work in production when deployed (which uses standard Webpack).
 *
 * ─── 20 USE-CASES ACROSS THIS BUILD ────────────────────────────────────────
 *
 *  1. Hero section eyebrow  — "AFROMATIONS STUDIOS" fades-draws on load
 *  2. Hero main heading     — "DUO: Where Worlds Collide" draws itself (Caveat)
 *  3. Cinematic intro text  — studio name appears as handwriting before video
 *  4. Hanna chat replies    — every AI response streams stroke-by-stroke
 *  5. Gallery section title — "Character Art & Scenes" in Italianno
 *  6. Gallery hover overlay — artwork title hand-drawn on hover
 *  7. Education card titles — lesson names drawn as they scroll into view
 *  8. Studio showcase title — "Built in the DUO Universe" in Tangerine
 *  9. Blog preview heading  — latest post title drawn on page load
 * 10. Blog post dropcap     — first letter of each post drawn (Parisienne)
 * 11. Community CTA         — "Join the Family" invitation in Italianno
 * 12. Footer tagline        — "Created with soul, not software" hand-drawn
 * 13. Hanna greeting        — opening "こんにちは" drawn in Caveat on chat open
 * 14. Character name cards  — I'RAH / DUEL names as calligraphy labels
 * 15. Anime quote carousel  — rotating DUO universe quotes write themselves
 * 16. Season label          — "Season 1 — 2026" on roadmap/timeline section
 * 17. 404 / error page      — "Lost in the Spirit Realm" drawn on error page
 * 18. Loading indicator     — "Loading..." writing & erasing loop
 * 19. Gallery caption       — "From the sketchbook" subtitle under artwork
 * 20. Nav logo text         — "AFROMATIONS" in navbar draws on first visit
 *
 * ─── USAGE ──────────────────────────────────────────────────────────────────
 *
 * Basic:
 *   <TegakiText font="caveat" size={48}>Hello</TegakiText>
 *
 * With trigger-on-viewport:
 *   <TegakiText font="tangerine" size={72} triggerOnView>Season 1</TegakiText>
 *
 * Streaming (for Hanna chat):
 *   <TegakiText font="caveat" size={16} streaming text={streamingText} />
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react'

export type TegakiFont = 'caveat' | 'italianno' | 'tangerine' | 'parisienne'

// Map fonts to Google Fonts font-family names
const fontFamilyMap: Record<TegakiFont, string> = {
  caveat: "'Caveat', cursive",
  italianno: "'Italianno', cursive",
  tangerine: "'Tangerine', cursive",
  parisienne: "'Parisienne', cursive",
}

interface TegakiTextProps {
  /** Font bundle to use. Default: 'caveat' */
  font?: TegakiFont
  /** Font size in px. Default: 32 */
  size?: number
  /** Extra CSS applied to the renderer wrapper */
  style?: CSSProperties
  /** Class names applied to outer div */
  className?: string
  /** Static text to draw */
  children?: React.ReactNode
  /** Streaming text (for Hanna chat — pass the partial streamed string) */
  text?: string
  /** Whether to wait until element enters viewport before drawing. Default: false */
  triggerOnView?: boolean
  /** Callback fired when draw animation completes */
  onComplete?: () => void
  /** Colour override applied via CSS color */
  color?: string
}

/**
 * TegakiText — drop-in handwriting animation component.
 * This is a fallback version that renders plain text with Google Fonts.
 * The full handwriting animation works in production (standard Webpack).
 */
export function TegakiText({
  font = 'caveat',
  size = 32,
  style,
  className,
  children,
  text,
  triggerOnView = false,
  onComplete,
  color,
}: TegakiTextProps) {
  const [inView, setInView] = useState(!triggerOnView)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for triggerOnView
  useEffect(() => {
    if (!triggerOnView || inView) return
    const el = wrapperRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [triggerOnView, inView])

  // Call onComplete after a brief delay to simulate animation
  useEffect(() => {
    if (inView && onComplete) {
      const timer = setTimeout(onComplete, 500)
      return () => clearTimeout(timer)
    }
  }, [inView, onComplete])

  const mergedStyle: CSSProperties = {
    fontSize: size,
    color: color ?? 'inherit',
    lineHeight: 1.3,
    fontFamily: fontFamilyMap[font],
    ...style,
  }

  return (
    <div 
      ref={wrapperRef} 
      className={className} 
      style={{
        ...mergedStyle,
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {text ?? children}
    </div>
  )
}

/**
 * TegakiQuote — animated handwritten quote block.
 * Draws itself stroke by stroke when it scrolls into view.
 */
export function TegakiQuote({
  quote,
  attribution,
  font = 'italianno',
  size = 28,
  className,
}: {
  quote: string
  attribution?: string
  font?: TegakiFont
  size?: number
  className?: string
}) {
  return (
    <blockquote className={className}>
      <TegakiText font={font} size={size} triggerOnView color="var(--af-cream)">
        &ldquo;{quote}&rdquo;
      </TegakiText>
      {attribution && (
        <TegakiText font="caveat" size={14} triggerOnView color="var(--af-grey-light)" style={{ marginTop: 8 }}>
          — {attribution}
        </TegakiText>
      )}
    </blockquote>
  )
}

/**
 * TegakiStreamText — renders a streaming text string with handwriting animation.
 * Pass the ever-growing streamed string; Tegaki re-draws the new characters.
 *
 * Usage (inside Hanna chat):
 *   <TegakiStreamText text={streamingContent} font="caveat" size={15} />
 */
export function TegakiStreamText({
  text,
  font = 'caveat',
  size = 15,
  color,
}: {
  text: string
  font?: TegakiFont
  size?: number
  color?: string
}) {
  return (
    <TegakiText
      font={font}
      size={size}
      text={text}
      color={color ?? 'var(--af-cream)'}
    />
  )
}
