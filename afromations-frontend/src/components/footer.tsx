'use client'

import { useI18n } from '@/lib/i18n'
import { TegakiText } from '@/components/tegaki-text'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer>
      {/* ── About AFROMATIONS ── */}
      <section
        className="border-t border-white/5 bg-(--af-grey)/30 px-5 py-20 sm:px-6 sm:py-28"
        aria-labelledby="about-heading"
      >
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-red) uppercase">
            {t('about.eyebrow')}
          </p>
          <h2
            id="about-heading"
            className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-3xl"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {t('about.heading')}
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-(--af-grey-light)">
            {t('about.intro')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-(--af-grey-light)">
            {t('about.note')}
          </p>

          {/* Principles grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(
              [
                ['about.principle1.title', 'about.principle1.body'],
                ['about.principle2.title', 'about.principle2.body'],
                ['about.principle3.title', 'about.principle3.body'],
              ] as const
            ).map(([titleKey, bodyKey]) => (
              <div
                key={titleKey}
                className="rounded-xl border border-white/5 bg-(--af-grey) p-5"
              >
                <h3 className="mb-2 text-sm font-semibold text-(--af-red)">
                  {t(titleKey)}
                </h3>
                <p className="text-xs leading-relaxed text-(--af-grey-light)">
                  {t(bodyKey)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-(--af-grey-light)">
            {t('about.closing')}
          </p>
        </div>
      </section>

      {/* ── Copyright strip ── */}
      <div className="border-t border-white/5 px-5 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-(--af-red)">
                {t('nav.brand')}
              </span>
              <span className="text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">
                {t('nav.brand.sub')}
              </span>
            </div>
            <p className="mt-1 text-[10px] tracking-wider text-(--af-grey-light)">
              {t('footer.tagline')}
            </p>
            <p className="text-[10px] tracking-wider text-(--af-grey-light)">
              {t('footer.built')}
            </p>
          </div>

          {/* Footer tagline — hand-drawn */}
          <div className="flex flex-col items-center gap-1">
            <TegakiText font="italianno" size={18} color="var(--af-grey-light)" triggerOnView>
              Created with soul, not software.
            </TegakiText>
            <p className="text-[10px] tracking-wider text-(--af-grey-light)">
              {t('footer.copyright').replace('{year}', String(new Date().getFullYear()))}
            </p>
          </div>

          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="/artist-partner-program"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Artist Partner
            </a>
            <a
              href="/provenance"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Provenance
            </a>
            <a
              href="/drops"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Drops
            </a>
            <a
              href="/manga"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Manga
            </a>
            <a
              href="/learn/manga-lessons"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Hana Lessons
            </a>
            <a
              href="/directory"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Directory
            </a>
            <a
              href="/social-purpose"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
            >
              Social Purpose
            </a>
            <a
              href="https://github.com/executiveusa/AFROMATIONS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-(--af-grey-light) transition-colors hover:text-(--af-cream) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--af-red)"
              aria-label="View AFROMATIONS on GitHub"
            >
              {t('footer.github')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
