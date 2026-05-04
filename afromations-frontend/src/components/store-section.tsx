'use client'

import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'
import { InView } from '@/components/motion/in-view'
import Link from 'next/link'

const STORE_ITEMS = [
  { id: 1, name: 'Limited Edition Anime Print #1', price: '$29', image: '画' },
  { id: 2, name: 'Collector\'s Character Sheet Set', price: '$49', image: '文' },
  { id: 3, name: 'AFROMATIONS Studio Hoodie', price: '$59', image: '衣' },
  { id: 4, name: 'Hana & DUAL Enamel Pin Set', price: '$19', image: '針' },
  { id: 5, name: 'Anime Scene Storyboard Pack', price: '$39', image: '本' },
  { id: 6, name: 'Creator Starter Bundle', price: '$99', image: '箱' },
]

export function StoreSection() {
  const { t } = useI18n()

  return (
    <section className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32 bg-(--af-grey)/30">
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
            {t('store.eyebrow')}
          </TegakiText>
        </InView>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-(--af-cream) mb-4 max-w-3xl" style={{ fontFamily: 'Sora, sans-serif' }}>
          {t('store.heading')}
        </h2>

        <p className="text-lg text-(--af-grey-light) leading-relaxed max-w-2xl mb-12">
          {t('store.description')}
        </p>

        {/* Store grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STORE_ITEMS.map((item, i) => (
            <InView
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              once
              className="group rounded-lg border border-white/10 bg-(--af-grey) overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="aspect-square bg-linear-to-br from-(--af-grey) to-(--af-black) flex items-center justify-center border-b border-white/5 group-hover:from-(--af-red)/10 transition-colors">
                <span className="text-6xl opacity-30">{item.image}</span>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-(--af-cream) mb-2 line-clamp-2">
                  {item.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-(--af-red)">
                    {item.price}
                  </span>
                  <button className="text-xs px-3 py-1 rounded border border-(--af-red) text-(--af-red) hover:bg-(--af-red) hover:text-(--af-cream) transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </InView>
          ))}
        </div>

        {/* CTA Button */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          once
          className="flex gap-4"
        >
          <Link
            href="/store"
            className="inline-flex h-12 items-center rounded-sm border border-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-red) transition-all hover:bg-(--af-red) hover:text-(--af-cream)"
          >
            {t('store.cta')}
          </Link>
          <a
            href="/social-purpose"
            className="inline-flex h-12 items-center rounded-sm border border-white/20 px-8 text-sm font-semibold tracking-wider text-(--af-grey-light) transition-all hover:border-white/40 hover:text-(--af-cream)"
          >
            Learn Mission
          </a>
        </InView>
      </div>
    </section>
  )
}
