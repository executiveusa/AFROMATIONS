'use client'

import { InnerLayout } from '@/components/inner-layout'
import { LessonCard } from '@/components/hana/lesson-card'
import { useI18n } from '@/lib/i18n'

const LESSONS = [
  {
    id: '1',
    titleJa: '基本的な挨拶',
    titleEn: 'Basic Greetings',
    type: 'vocabulary',
    difficulty: 'n5',
    domain: 'daily_life',
    durationMinutes: 15,
    progress: { mastered: false },
  },
  {
    id: '2',
    titleJa: 'は、が、を',
    titleEn: 'Particle Fundamentals',
    type: 'grammar',
    difficulty: 'n5',
    domain: 'grammar',
    durationMinutes: 20,
    progress: { mastered: true },
  },
  {
    id: '3',
    titleJa: '神社の世界',
    titleEn: 'The World of Shrines',
    type: 'culture',
    difficulty: 'n4',
    domain: 'culture',
    durationMinutes: 25,
    progress: { mastered: false },
  },
  {
    id: '4',
    titleJa: 'リスニング基礎',
    titleEn: 'Listening Basics',
    type: 'listening',
    difficulty: 'n4',
    domain: 'daily_life',
    durationMinutes: 15,
    progress: { score: 75, mastered: false },
  },
]

export default function LearnPage() {
  const { t } = useI18n()

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Page header */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            {t('education.eyebrow')}
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {t('education.title')}
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm">
            {t('education.description')}
          </p>
        </section>

        {/* Lesson grid */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LESSONS.map((lesson) => (
              <LessonCard key={lesson.id} {...lesson} />
            ))}
          </div>
        </section>

        <div className="divider my-16" />

        {/* Stats — clean horizontal row, no KPI dashboard */}
        <section data-reveal className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-12 justify-center">
            {[
              { value: '12', label: 'Lessons Completed' },
              { value: '8/10', label: 'Current Streak' },
              { value: '42h', label: 'Total Time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-(--af-cream) mb-1">{stat.value}</p>
                <p className="text-(--af-grey-light) text-xs tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
