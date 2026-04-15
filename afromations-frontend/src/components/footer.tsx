'use client'

import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-white/5 px-5 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-(--af-red)">
            {t('nav.brand')}
          </span>
          <span className="text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">
            {t('nav.brand.sub')}
          </span>
        </div>

        {/* Footer tagline — hand-drawn (use-case #12) */}
        <div className="flex flex-col items-center gap-1">
          <TegakiText font="italianno" size={18} color="var(--af-grey-light)" triggerOnView>
            Created with soul, not software.
          </TegakiText>
          <p className="text-[10px] tracking-wider text-(--af-grey-light)">
            {t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/executiveusa/AFROMATIONS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
          >
            {t('footer.github')}
          </a>
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
          >
            {t('footer.discord')}
          </a>
        </div>
      </div>
    </footer>
  )
}
