'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

const ARTWORKS = [
  {
    src: '/gallery/duo.png',
    title: 'DUO',
    tag: 'Character Art',
    aspect: 'aspect-square',
  },
  {
    src: '/gallery/night-city.png',
    title: "Night City — Duel's Inner Struggle",
    tag: 'Scene',
    aspect: 'aspect-video',
  },
  {
    src: '/gallery/main-character.jpg',
    title: 'Main Character',
    tag: 'Character Design',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/gallery/rain-reflection.png',
    title: "Duel's Fractured Reflection",
    tag: 'Cinematic',
    aspect: 'aspect-video',
  },
  {
    src: '/gallery/bird-spirit.jpg',
    title: 'Bird Spirit',
    tag: 'Spirit Art',
    aspect: 'aspect-square',
  },
  {
    src: '/gallery/koi-spirit.jpg',
    title: 'Koi Spirit',
    tag: 'Spirit Art',
    aspect: 'aspect-square',
  },
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
        {/* Eyebrow — drawn when section scrolls into view (use-case #5) */}
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

        {/* Section title — Italianno hand-drawn on scroll (use-case #5) */}
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

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {ARTWORKS.map((art, i) => (
            <figure
              key={art.src}
              className={`
                group relative overflow-hidden rounded-sm border border-white/5
                transition-all duration-500
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                ${art.aspect}
              `}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Image
                src={art.src}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay — artwork title drawn on hover (use-case #6) */}
              <figcaption className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="mb-1 text-[9px] font-medium tracking-[0.35em] text-(--af-red) uppercase">
                  {art.tag}
                </span>
                <TegakiText font="caveat" size={18} color="var(--af-cream)">
                  {art.title}
                </TegakiText>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
