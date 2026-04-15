'use client'

import { useRef, useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

export function HannaFeature() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const { t } = useI18n()

  const stats = [
    { label: t('hanna.stat.resolution'), value: t('hanna.stat.resolution.value') },
    { label: t('hanna.stat.shader'), value: t('hanna.stat.shader.value') },
    { label: t('hanna.stat.version'), value: t('hanna.stat.version.value') },
    { label: t('hanna.stat.pipeline'), value: t('hanna.stat.pipeline.value') },
  ]

  const abilities = [
    t('hanna.ability.characters'),
    t('hanna.ability.avatar'),
    t('hanna.ability.trends'),
    t('hanna.ability.blog'),
    t('hanna.ability.digest'),
    t('hanna.ability.export'),
  ]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="hanna"
      ref={sectionRef}
      className="relative border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('hanna.eyebrow')}
        </p>

        <div className="grid gap-10 md:gap-16 md:grid-cols-2">
          {/* Left — Character placeholder */}
          <div className="relative flex items-center justify-center">
            <div
              className={`
                relative h-90 w-full overflow-hidden rounded-sm border border-white/5 bg-(--af-grey)
                sm:h-120
                transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              {/* Hanna silhouette placeholder — replace with actual 3D render */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="mb-4 text-6xl">花</div>
                <p className="text-xs tracking-wider text-(--af-grey-light)">
                  {t('hanna.placeholder')}
                </p>
                <p className="mt-1 text-[10px] text-(--af-grey-light)">
                  {t('hanna.character')}
                </p>
              </div>

              {/* Red corner accent */}
              <div className="absolute right-0 top-0 h-16 w-px bg-(--af-red)" />
              <div className="absolute right-0 top-0 h-px w-16 bg-(--af-red)" />
            </div>
          </div>

          {/* Right — Info */}
          <div
            className={`
              flex flex-col justify-center
              transition-all duration-700 delay-200
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <h2
              className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {t('hanna.title')}
            </h2>
            <p className="mt-1 text-sm text-(--af-red)">
              {t('hanna.subtitle')}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-(--af-grey-light)">
              {t('hanna.description')}
            </p>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-white/10 pl-4">
                  <p className="text-[10px] tracking-wider text-(--af-grey-light) uppercase">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--af-cream)">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] tracking-wider text-(--af-grey-light) uppercase">
                {t('hanna.capabilities')}
              </p>
              <ul className="space-y-2">
                {abilities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 text-sm text-(--af-cream)"
                  >
                    <span className="inline-block h-1 w-1 rounded-full bg-(--af-red)" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
