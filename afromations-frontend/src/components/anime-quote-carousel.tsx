'use client'

/**
 * AnimeQuoteCarousel
 *
 * Rotating handwritten quotes from the DUAL universe.
 * Each quote draws itself stroke by stroke using Tegaki (use-case #15).
 * Season label drawn with Tangerine (use-case #16).
 */

import { useEffect, useState } from 'react'
import { TegakiText, TegakiQuote } from '@/components/tegaki-text'
import { useI18n } from '@/lib/i18n'

const DUAL_QUOTES = [
  {
    quote: "The fracture isn't weakness — it's where the light enters.",
    speaker: 'I\'RAH, Episode 1',
  },
  {
    quote: "Two souls forged from the same silence. One chose fire, one chose water.",
    speaker: 'Narrator, DUAL Prologue',
  },
  {
    quote: "Your ancestors didn't survive so you could shrink.",
    speaker: 'DUAL, Episode 3',
  },
  {
    quote: "Spirit doesn't speak in words. It speaks in wounds that heal wrong.",
    speaker: "The Elder, DUAL Universe Lore",
  },
  {
    quote: "Every brushstroke is a decision to continue.",
    speaker: 'AFROMATIONS Studios',
  },
]

export function AnimeQuoteCarousel() {
  const [index, setIndex] = useState(0)
  const [key, setKey] = useState(0) // force re-mount for re-animation

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % DUO_QUOTES.length
        setKey(k => k + 1)
        return next
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const current = DUAL_QUOTES[index]

  return (
    <section className="border-t border-white/5 px-4 py-16 sm:px-6 sm:py-28 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        {/* Season label — hand-drawn (use-case #16) */}
        <div className="mb-10 flex justify-center">
          <TegakiText font="tangerine" size={20} color="var(--af-red)" triggerOnView>
            DUAL — Season 1 · 2026
          </TegakiText>
        </div>

        {/* Rotating quote — each entry re-animates (use-case #15) */}
        <div key={key} className="min-h-30 flex flex-col items-center justify-center">
          <TegakiQuote
            quote={current.quote}
            attribution={current.speaker}
            font="italianno"
            size={32}
            className="max-w-2xl"
          />
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {DUAL_QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setKey(k => k + 1) }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-(--af-red)' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
