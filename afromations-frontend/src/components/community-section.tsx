'use client'

import { useI18n } from '@/lib/i18n'

export function CommunitySection() {
  const { t } = useI18n()

  return (
    <section id="community" className="border-t border-white/5 px-5 py-20 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
          {t('community.eyebrow')}
        </p>
        <h2
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl md:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('community.title')}
        </h2>
        <p className="mx-auto mt-3 max-w-md px-2 text-[13px] leading-relaxed text-(--af-grey-light) sm:mt-4 sm:max-w-lg sm:px-0 sm:text-sm">
          {t('community.description')}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-(--af-red) px-6 text-xs font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark) sm:h-10 sm:w-auto"
          >
            {t('community.discord')}
          </a>
          <a
            href="https://twitter.com/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/10 px-6 text-xs font-semibold tracking-wider text-(--af-cream) transition-colors hover:border-white/20 sm:h-10 sm:w-auto"
          >
            {t('community.twitter')}
          </a>
        </div>
      </div>
    </section>
  )
}
