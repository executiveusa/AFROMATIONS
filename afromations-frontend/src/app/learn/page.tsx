'use client'

import { InnerLayout } from '@/components/inner-layout'
import { LessonCard } from '@/components/hana/lesson-card'
import { useI18n } from '@/lib/i18n'
import Link from 'next/link'

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

const FEATURED_COURSES = [
  {
    id: 'japanese-by-anime',
    title: 'Japanese by Anime',
    description: 'Learn Japanese through anime scenes, real cultural context, and guided practice.',
    level: 'Beginner → Advanced',
    modules: 7,
    href: '/learn/japanese-by-anime',
    featured: true,
  },
  {
    id: 'ai-for-artists',
    title: 'AI for Visual Artists',
    description: 'Creative workflows, visual storytelling, and building sustainable income.',
    level: 'Intermediate',
    modules: 5,
    href: '#',
    featured: false,
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
            Hana Academy
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Learn with Agent Hana
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm">
            Structured courses in Japanese language, anime culture, creative AI tools, and community art practice. Progress at your own pace with real feedback and a learning community.
          </p>
        </section>

        <div className="divider my-12" />

        {/* Featured Course */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
            Start Here
          </p>
          <div
            data-reveal
            data-delay="1"
            className="border border-white/10 rounded-sm p-8 hover:bg-(--af-grey) transition-colors"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2
                  className="text-2xl font-bold text-(--af-cream) mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Japanese by Anime
                </h2>
                <p className="text-(--af-grey-light) text-sm mb-4 leading-relaxed">
                  Our flagship course. Learn Japanese through authentic anime dialogue, cultural moments, and real storytelling. From hiragana to honorifics, discover why anime is the perfect classroom.
                </p>
                <div className="flex gap-4 text-xs text-(--af-grey-light)">
                  <span>
                    <strong className="text-(--af-cream)">Level:</strong> Beginner → Advanced
                  </span>
                  <span>
                    <strong className="text-(--af-cream)">Modules:</strong> 7
                  </span>
                  <span>
                    <strong className="text-(--af-cream)">Duration:</strong> 12-16 weeks
                  </span>
                </div>
              </div>
              <div className="lg:flex lg:flex-col lg:justify-end">
                <Link href="/learn/japanese-by-anime">
                  <button className="w-full h-11 rounded-sm bg-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark)">
                    Start Course
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="divider my-12" />

        {/* Lesson grid */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
            Latest Lessons
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LESSONS.map((lesson) => (
              <LessonCard key={lesson.id} {...lesson} />
            ))}
          </div>
        </section>

        <div className="divider my-12" />

        {/* Coming Soon Courses */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
            Coming Soon
          </p>
          <div className="grid lg:grid-cols-2 gap-6">
            {FEATURED_COURSES.filter(c => !c.featured).map((course, i) => (
              <div
                key={course.id}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-white/10 rounded-sm p-6 opacity-60"
              >
                <h3
                  className="text-lg font-bold text-(--af-cream) mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {course.title}
                </h3>
                <p className="text-(--af-grey-light) text-sm mb-3">
                  {course.description}
                </p>
                <div className="flex gap-4 text-xs text-(--af-grey-light) mb-4">
                  <span>
                    <strong className="text-(--af-cream)">Level:</strong> {course.level}
                  </span>
                  <span>
                    <strong className="text-(--af-cream)">Modules:</strong> {course.modules}
                  </span>
                </div>
                <button disabled className="w-full h-10 rounded-sm bg-(--af-grey) text-sm font-semibold tracking-wider text-(--af-grey-light) cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="divider my-12" />

        {/* Stats */}
        <section data-reveal className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-12 justify-center">
            {[
              { value: '12', label: 'Lessons Available' },
              { value: '7', label: 'Course Modules' },
              { value: '∞', label: 'Community Members' },
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
