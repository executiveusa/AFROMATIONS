'use client'

import { useI18n } from '@/lib/i18n'

interface Lesson {
  titleKey: string
  descKey: string
  tagKey: string
  durationKey?: string
  available: boolean
}

const LESSONS: Lesson[] = [
  { titleKey: 'education.lesson1.title', descKey: 'education.lesson1.description', tagKey: 'education.lesson1.tag', durationKey: 'education.lesson1.duration', available: true },
  { titleKey: 'education.lesson2.title', descKey: 'education.lesson2.description', tagKey: 'education.lesson2.tag', available: false },
  { titleKey: 'education.lesson3.title', descKey: 'education.lesson3.description', tagKey: 'education.lesson3.tag', available: false },
  { titleKey: 'education.lesson4.title', descKey: 'education.lesson4.description', tagKey: 'education.lesson4.tag', available: false },
  { titleKey: 'education.lesson5.title', descKey: 'education.lesson5.description', tagKey: 'education.lesson5.tag', available: false },
]

export function EducationSection() {
  const { t } = useI18n()

  return (
    <section
      id="education"
      className="relative border-t border-white/5 bg-(--af-black) py-20 sm:py-28"
      aria-labelledby="education-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-gold) uppercase">
          {t('education.eyebrow')}
        </p>
        <h2
          id="education-heading"
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('education.title')}
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          {t('education.description')}
        </p>

        {/* Lesson cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((lesson, i) => {
            const isAvailable = lesson.available

            return (
              <article
                key={i}
                className={`
                  relative rounded-2xl border border-white/5 bg-(--af-grey) p-6
                  transition-all duration-300
                  ${isAvailable
                    ? 'hover:-translate-y-1 hover:border-(--af-red)/30 hover:bg-(--af-grey-mid)'
                    : 'opacity-50'}
                `}
                aria-label={`${t(lesson.titleKey)}${!isAvailable ? ' — Coming Soon' : ''}`}
              >
                {/* Lesson number */}
                <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-(--af-red)" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Title */}
                <h3 className="text-base font-semibold leading-snug text-(--af-cream) sm:text-lg">
                  {t(lesson.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-(--af-grey-light)">
                  {t(lesson.descKey)}
                </p>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-(--af-red)/20 px-3 py-0.5 text-[10px] font-medium tracking-wide text-(--af-red)">
                    {t(lesson.tagKey)}
                  </span>
                  {lesson.durationKey && isAvailable && (
                    <span className="rounded-full border border-white/10 px-3 py-0.5 text-[10px] text-(--af-grey-light)">
                      {t(lesson.durationKey)}
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="rounded-full border border-white/10 px-3 py-0.5 text-[10px] text-(--af-grey-light)">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* CTA */}
                {isAvailable && (
                  <div className="mt-5">
                    <button
                      className="af-btn-primary inline-flex h-9 items-center rounded-lg px-5 text-xs font-semibold tracking-wider"
                      aria-label={`Start lesson: ${t(lesson.titleKey)}`}
                    >
                      {t('education.start')}
                    </button>
                  </div>
                )}

                {/* Bottom accent line on available cards */}
                {isAvailable && (
                  <div className="absolute bottom-0 left-0 h-px w-0 rounded-b-2xl bg-(--af-red) transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                )}
              </article>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs leading-relaxed text-(--af-grey-light)">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-(--af-gold)" aria-hidden="true" />
          {t('education.footer')}
        </p>
      </div>
    </section>
  )
}
