'use client'

import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'
import { InView } from '@/components/motion/in-view'

export function SocialPurposeSection() {
  const { t } = useI18n()

  const impacts = [
    t('spc.impact1'),
    t('spc.impact2'),
    t('spc.impact3'),
  ]

  return (
    <section className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <InView
          variants={{
            hidden: { opacity: 0, x: -48 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          once
          className="mb-3"
        >
          <TegakiText
            font="tangerine"
            size={20}
            color="var(--af-red)"
            className="tracking-[0.4em] uppercase"
          >
            {t('spc.eyebrow')}
          </TegakiText>
        </InView>

        {/* Main heading */}
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-(--af-cream) mb-6 max-w-3xl" style={{ fontFamily: 'Sora, sans-serif' }}>
          {t('spc.heading')}
        </h2>

        <p className="text-lg text-(--af-grey-light) leading-relaxed max-w-2xl mb-12">
          {t('spc.description')}
        </p>

        {/* Impact metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {impacts.map((impact, i) => (
            <InView
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              once
              className="rounded-lg border border-white/10 bg-(--af-grey)/50 p-6"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl font-bold text-(--af-red)">0{i + 1}</span>
                <p className="text-sm leading-relaxed text-(--af-grey-light)">
                  {impact}
                </p>
              </div>
            </InView>
          ))}
        </div>

        {/* CTA */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          once
        >
          <a
            href="/social-purpose"
            className="inline-flex h-12 items-center rounded-sm border border-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-red) transition-all hover:bg-(--af-red) hover:text-(--af-cream)"
          >
            {t('spc.cta')}
          </a>
        </InView>
      </div>
    </section>
  )
}
