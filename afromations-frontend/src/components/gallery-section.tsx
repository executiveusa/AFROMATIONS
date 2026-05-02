'use client'

import { useRef, useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

// Placeholder categories for upcoming AI-generated gallery
const GALLERY_CATEGORIES = [
  { title: 'Character Art', description: 'DUAL universe characters rendered in cinematic anime style' },
  { title: 'Scene Design', description: 'Seattle 2056 environments and atmospheric landscapes' },
  { title: 'Spirit Art', description: 'O.W.P.I.L spirit entities and symbolic imagery' },
  { title: 'Cinematic', description: 'Key frames and storyboard moments from DUAL' },
  { title: 'Concept Art', description: 'Early designs and visual development' },
  { title: 'Community', description: 'Art created by the AFROMATIONS community' },
]

export function GallerySection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="gallery"
      ref={ref}
      className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <div className="mb-3">
          <TegakiText
            font="tangerine"
            size={18}
            color="var(--af-red)"
            triggerOnView
            className="tracking-[0.4em] uppercase"
          >
            {t('gallery.eyebrow')}
          </TegakiText>
        </div>

        {/* Section title */}
        <TegakiText
          font="italianno"
          size={48}
          color="var(--af-cream)"
          triggerOnView
          className="leading-tight"
        >
          {t('gallery.title')}
        </TegakiText>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-(--af-grey-light)">
          {t('gallery.description')}
        </p>

        {/* Coming Soon Grid */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {GALLERY_CATEGORIES.map((cat, i) => (
            <figure
              key={cat.title}
              className={`
                group relative overflow-hidden rounded-sm border border-white/10 bg-(--af-grey)
                transition-all duration-500 aspect-video flex items-center justify-center
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
              `}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-center p-6">
                <span className="mb-2 block text-[10px] font-medium tracking-[0.35em] text-(--af-red) uppercase">
                  {cat.title}
                </span>
                <p className="text-sm text-(--af-grey-light)">
                  {cat.description}
                </p>
                <span className="mt-4 inline-block text-xs text-(--af-grey-light) opacity-60">
                  Coming Soon
                </span>
              </div>
            </figure>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-(--af-grey-light) mb-4">
            Gallery artwork will be generated using DUAL Studio AI tools.
          </p>
          <a
            href="/studio"
            className="inline-flex h-10 items-center rounded-sm border border-(--af-red) px-6 text-sm font-semibold tracking-wider text-(--af-red) transition-colors hover:bg-(--af-red) hover:text-(--af-cream)"
          >
            Open DUAL Studio
          </a>
        </div>
      </div>
    </section>
  )
}
