'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'

const TAG_COLORS: Record<string, string> = {
  Business: 'text-(--af-gold) border-(--af-gold)/20',
  Art: 'text-(--af-coral) border-(--af-coral)/20',
  Entrepreneurship: 'text-emerald-500 border-emerald-500/20',
  Production: 'text-(--af-teal) border-(--af-teal)/20',
  Storytelling: 'text-purple-400 border-purple-400/20',
  Marketing: 'text-sky-400 border-sky-400/20',
}

export function EducationSection() {
  const { t } = useI18n()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const lessons = [
    { title: t('education.lesson1.title'), description: t('education.lesson1.description'), tag: t('education.lesson1.tag') },
    { title: t('education.lesson2.title'), description: t('education.lesson2.description'), tag: t('education.lesson2.tag') },
    { title: t('education.lesson3.title'), description: t('education.lesson3.description'), tag: t('education.lesson3.tag') },
    { title: t('education.lesson4.title'), description: t('education.lesson4.description'), tag: t('education.lesson4.tag') },
    { title: t('education.lesson5.title'), description: t('education.lesson5.description'), tag: t('education.lesson5.tag') },
    { title: t('education.lesson6.title'), description: t('education.lesson6.description'), tag: t('education.lesson6.tag') },
  ]

  return (
    <section id="education" className="relative border-t border-white/5 bg-(--af-black) py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-(--af-gold) uppercase">
          {t('education.eyebrow')}
        </p>
        <h2
          className="text-2xl font-bold tracking-tight text-(--af-cream) sm:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {t('education.title')}
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-(--af-grey-light)">
          {t('education.description')}
        </p>

        {/* Lesson list */}
        <div className="mt-12 space-y-0">
          {lessons.map((lesson, i) => {
            const isOpen = expandedId === i
            // Find tag color by English key (tag values differ by locale but color mapping uses English)
            const tagKey = ['Business', 'Art', 'Entrepreneurship', 'Production', 'Storytelling', 'Marketing'][i]
            const tagColor = TAG_COLORS[tagKey] ?? 'text-(--af-grey-light) border-white/10'

            return (
              <button
                key={i}
                onClick={() => setExpandedId(isOpen ? null : i)}
                className="group flex w-full flex-col border-b border-white/5 py-5 text-left transition-colors hover:border-(--af-red)/20"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs tabular-nums text-(--af-grey-light)">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'rounded border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase',
                      tagColor
                    )}
                  >
                    {lesson.tag}
                  </span>
                  <h3 className="flex-1 text-sm font-semibold text-(--af-cream) transition-colors group-hover:text-(--af-red) sm:text-base">
                    {lesson.title}
                  </h3>
                  <span className="text-[10px] tracking-wider text-(--af-grey-light)">
                    {t('education.progress')}
                  </span>
                  <span
                    className={cn(
                      'text-(--af-grey-light) transition-transform',
                      isOpen && 'rotate-45'
                    )}
                  >
                    +
                  </span>
                </div>

                {isOpen && (
                  <p className="mt-3 pl-10 text-sm leading-relaxed text-(--af-grey-light)">
                    {lesson.description}
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {/* Coming soon */}
        <p className="mt-8 text-[10px] tracking-wider text-(--af-grey-light)">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-(--af-gold)" />
          {t('education.coming_soon')}
        </p>
      </div>
    </section>
  )
}
