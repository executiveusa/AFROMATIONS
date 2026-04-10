'use client'

import { API_URL } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface TrendTopic {
  topic: string
  volume: number
  rising: boolean
}

export function BlogPreview() {
  const [trends, setTrends] = useState<TrendTopic[]>([])

  useEffect(() => {
    fetch(`${API_URL}/trends`)
      .then((r) => r.json())
      .then((d) => setTrends(d.trends ?? []))
      .catch(() => {
        /* API not deployed yet — use fallback */
        setTrends([
          { topic: 'One Piece Gear 6', volume: 95, rising: true },
          { topic: 'Solo Leveling Season 3', volume: 88, rising: true },
          { topic: 'Chainsaw Man Part 3', volume: 82, rising: false },
        ])
      })
  }, [])

  return (
    <section id="blog" className="border-t border-white/5 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-[var(--af-red)] uppercase">
          Trending Now
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-[var(--af-cream)] sm:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Anime Pulse
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--af-grey-light)]">
          Real-time anime trends monitored by Agent Hanna. Articles auto-generated
          and curated for the community.
        </p>

        {/* Trend items */}
        <div className="mt-12 space-y-4">
          {trends.map((t, i) => (
            <div
              key={t.topic}
              className="group flex items-center justify-between border-b border-white/5 py-4 transition-colors hover:border-[var(--af-red)]/20"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs tabular-nums text-[var(--af-grey-light)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-[var(--af-cream)] group-hover:text-[var(--af-red)] transition-colors">
                  {t.topic}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs tabular-nums text-[var(--af-grey-light)]">
                  {t.volume}
                </span>
                <span
                  className={`text-[10px] ${t.rising ? 'text-emerald-500' : 'text-[var(--af-grey-light)]'}`}
                >
                  {t.rising ? '↑' : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {trends.length === 0 && (
          <p className="mt-12 text-sm text-[var(--af-grey-light)]">
            Deploy Hanna API to see live anime trends here.
          </p>
        )}
      </div>
    </section>
  )
}
