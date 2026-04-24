'use client'

import { useRef, useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

export function StudioShowcase() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="studio"
      ref={ref}
      className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32"
      aria-labelledby="studio-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('studio.eyebrow')}
        </p>
        <h2
          id="studio-heading"
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('studio.title')}
        </h2>

        {/* Asymmetric grid */}
        <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-3">

          {/* Featured card — spans 2 columns */}
          <article
            className={`
              af-card md:col-span-2
              transition-all duration-600
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="af-card-inner">
              <span className="mb-3 inline-block text-[10px] font-medium tracking-[0.3em] text-(--af-red) uppercase">
                {t('studio.trends.tag')}
              </span>
              <h3 className="text-xl font-bold text-(--af-cream) sm:text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                {t('studio.trends.title')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">
                {t('studio.trends.description')}
              </p>
              <div className="af-problem-block mt-4">
                <strong className="text-xs text-(--af-cream)">Problem solved: </strong>
                <span className="text-xs text-(--af-grey-light)">{t('studio.trends.problem')}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#blog"
                  className="af-btn-primary inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold tracking-wider"
                >
                  {t('studio.trends.cta.browse')}
                </a>
                <button className="af-btn-secondary inline-flex h-9 items-center rounded-full border px-5 text-xs font-semibold tracking-wider">
                  {t('studio.trends.cta.subscribe')}
                </button>
              </div>
            </div>
          </article>

          {/* Secondary card — 1 column */}
          <article
            className={`
              af-card
              transition-all duration-600
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '120ms' }}
          >
            <div className="af-card-inner">
              <span className="mb-3 inline-block text-[10px] font-medium tracking-[0.3em] text-(--af-red) uppercase">
                {t('studio.learn.tag')}
              </span>
              <h3 className="text-xl font-bold text-(--af-cream)" style={{ fontFamily: 'Sora, sans-serif' }}>
                {t('studio.learn.title')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">
                {t('studio.learn.description')}
              </p>
              <div className="af-problem-block mt-4">
                <strong className="text-xs text-(--af-cream)">Problem solved: </strong>
                <span className="text-xs text-(--af-grey-light)">{t('studio.learn.problem')}</span>
              </div>
              <div className="mt-5">
                <a
                  href="#education"
                  className="af-btn-primary inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold tracking-wider"
                >
                  {t('studio.learn.cta.explore')}
                </a>
              </div>
            </div>
          </article>

          {/* Full-width community card */}
          <article
            className={`
              af-card md:col-span-3
              transition-all duration-600
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '240ms' }}
          >
            <div className="af-card-inner md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <span className="mb-3 inline-block text-[10px] font-medium tracking-[0.3em] text-(--af-red) uppercase">
                  {t('studio.community.tag')}
                </span>
                <h3 className="text-xl font-bold text-(--af-cream) sm:text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {t('studio.community.title')}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
                  {t('studio.community.description')}
                </p>
              </div>
              <div className="mt-5 flex shrink-0 flex-wrap gap-3 md:mt-0">
                <a
                  href="https://discord.gg/afromations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="af-btn-primary inline-flex h-9 items-center rounded-full px-5 text-xs font-semibold tracking-wider"
                  aria-label="Join the AFROMATIONS Discord community"
                >
                  {t('studio.community.cta.discord')}
                </a>
                <button className="af-btn-secondary inline-flex h-9 items-center rounded-full border px-5 text-xs font-semibold tracking-wider">
                  {t('studio.community.cta.discuss')}
                </button>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  )
}
