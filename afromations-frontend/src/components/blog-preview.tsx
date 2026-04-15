'use client'

import { API_URL } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { useEffect, useState } from 'react'

interface TrendTopic {
  topic: string
  volume: number
  rising: boolean
}

export function BlogPreview() {
  const [trends, setTrends] = useState<TrendTopic[]>([])
  const { t } = useI18n()

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
    <section id="blog" className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('blog.eyebrow')}
        </p>
        <h2
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('blog.title')}
        </h2>
        <p className="mt-3 max-w-md text-[13px] leading-relaxed text-(--af-grey-light) sm:mt-4 sm:max-w-lg sm:text-sm">
          {t('blog.description')}
        </p>

        {/* Trend items */}
        <div className="mt-8 space-y-3 sm:mt-12 sm:space-y-4">
          {trends.map((item, i) => (
            <div
              key={item.topic}
              className="group flex items-center justify-between border-b border-white/5 py-4 transition-colors hover:border-(--af-red)/20"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs tabular-nums text-(--af-grey-light)">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-(--af-cream) group-hover:text-(--af-red) transition-colors">
                  {item.topic}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs tabular-nums text-(--af-grey-light)">
                  {item.volume}
                </span>
                <span
                  className={`text-[10px] ${item.rising ? 'text-emerald-500' : 'text-(--af-grey-light)'}`}
                >
                  {item.rising ? '↑' : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {trends.length === 0 && (
          <p className="mt-12 text-sm text-(--af-grey-light)">
            {t('blog.empty')}
          </p>
        )}

        {trends.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <a
              href="/blog"
              className="inline-flex h-10 items-center rounded-md border border-white/10 px-6 text-xs font-semibold tracking-wider text-(--af-cream) transition-colors hover:border-white/20"
            >
              View All Articles →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
