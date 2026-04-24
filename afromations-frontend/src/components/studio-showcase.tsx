'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useI18n } from '@/lib/i18n'

export function StudioShowcase() {
  const ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useI18n()

  /* Spotlight border — tracks cursor across the grid */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cards = gridRef.current?.querySelectorAll<HTMLDivElement>('.spot-card')
    cards?.forEach((card) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    })
  }, [])

  const showcaseItems = [
    {
      title: t('studio.pipeline.title'),
      description: t('studio.pipeline.description'),
      tag: t('studio.pipeline.tag'),
    },
    {
      title: t('studio.content.title'),
      description: t('studio.content.description'),
      tag: t('studio.content.tag'),
    },
    {
      title: t('studio.community.title'),
      description: t('studio.community.description'),
      tag: t('studio.community.tag'),
    },
  ]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="studio"
      ref={ref}
      className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('studio.eyebrow')}
        </p>
        <h2
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('studio.title')}
        </h2>

        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="mt-8 grid gap-px overflow-hidden rounded-sm border border-white/5 bg-white/5 sm:mt-12 md:grid-cols-3"
        >
          {showcaseItems.map((item, i) => (
            <div
              key={item.tag}
              className={`
                spot-card group relative overflow-hidden bg-(--af-grey) p-6 sm:p-8
                transition-all duration-500
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
              `}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Tag */}
              <span className="inline-block text-[10px] tracking-wider text-(--af-red) uppercase">
                {item.tag}
              </span>

              <h3 className="mt-4 text-lg font-semibold text-(--af-cream)">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">
                {item.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-(--af-red) transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
