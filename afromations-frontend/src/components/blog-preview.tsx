'use client'

import { API_URL } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { useEffect, useState } from 'react'

interface TrendTopic {
  topic: string
  volume: number
  rising: boolean
  summary?: string
}

const STATIC_TRENDS: TrendTopic[] = [
  {
    topic: 'One Piece Gear 6',
    volume: 95,
    rising: true,
    summary:
      'When Luffy unlocked this form, animators had to completely rethink how to animate his movements. We break down what changed and why Toei\'s new approach matters.',
  },
  {
    topic: 'Solo Leveling Season 3',
    volume: 88,
    rising: true,
    summary:
      'The anime added 4 new scenes that don\'t exist in the source. Here\'s why the director made those calls and how they changed the emotional arc.',
  },
  {
    topic: 'Chainsaw Man Part 3',
    volume: 82,
    rising: false,
    summary:
      "Denji's character arc in this season reflects something deeper about agency and identity. We explore what the anime is saying that manga readers missed.",
  },
]

const HEADLINE_MAP: Record<string, string> = {
  'One Piece Gear 6': 'One Piece Gear 6: Why the fight choreography changed everything',
  'Solo Leveling Season 3': 'Solo Leveling Season 3: What the anime does differently from the manhwa',
  'Chainsaw Man Part 3': "Chainsaw Man Part 3: The cultural moment nobody's talking about",
}

export function BlogPreview() {
  const [trends, setTrends] = useState<TrendTopic[]>([])
  const { t } = useI18n()

  useEffect(() => {
    fetch(`${API_URL}/trends`)
      .then((r) => r.json())
      .then((d) => {
        const apiTrends: TrendTopic[] = d.trends ?? []
        setTrends(
          apiTrends.map((tr) => ({
            ...tr,
            summary: STATIC_TRENDS.find((s) => s.topic === tr.topic)?.summary,
          }))
        )
      })
      .catch(() => setTrends(STATIC_TRENDS))
  }, [])

  return (
    <section
      id="blog"
      className="border-t border-white/5 px-4 py-16 sm:px-6 sm:py-32 md:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('blog.eyebrow')}
        </p>
        <h2
          id="blog-heading"
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('blog.title')}
        </h2>
        <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-(--af-grey-light) sm:mt-4 sm:text-sm">
          {t('blog.description')}
        </p>

        {/* Trend articles */}
        {trends.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:mt-12">
            {trends.map((item) => {
              const headline = HEADLINE_MAP[item.topic] ?? item.topic
              return (
                <article
                  key={item.topic}
                  className="group flex gap-4 rounded-xl border border-white/5 bg-(--af-grey) p-5 transition-all duration-150 hover:border-(--af-red)/20 hover:translate-x-1 sm:gap-6 sm:p-6"
                >
                  {/* Arrow indicator */}
                  <span
                    className="mt-0.5 shrink-0 text-lg text-(--af-red) transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold leading-snug text-(--af-cream) transition-colors group-hover:text-(--af-red) sm:text-base">
                      {headline}
                    </h3>
                    {item.summary && (
                      <p className="mt-2 text-[13px] leading-relaxed text-(--af-grey-light) sm:text-sm">
                        {item.summary}
                      </p>
                    )}
                    <a
                      href="/blog"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-(--af-red) transition-all hover:gap-2.5"
                      aria-label={`Read full analysis of ${headline}`}
                    >
                      Read full analysis →
                    </a>
                  </div>

                  {/* Volume indicator */}
                  <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                    <span className="text-xs tabular-nums text-(--af-grey-light)">{item.volume}</span>
                    <span className={`text-[10px] ${item.rising ? 'text-emerald-500' : 'text-(--af-grey-light)'}`}>
                      {item.rising ? '↑' : '—'}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {trends.length === 0 && (
          <p className="mt-12 text-sm text-(--af-grey-light)">{t('blog.empty')}</p>
        )}

        {trends.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row">
            <a
              href="/blog"
              className="af-btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-xs font-semibold tracking-wider sm:h-10"
            >
              {t('blog.cta.read')}
            </a>
            <button className="af-btn-secondary inline-flex h-11 items-center justify-center rounded-full border px-6 text-xs font-semibold tracking-wider sm:h-10">
              {t('blog.cta.subscribe')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
