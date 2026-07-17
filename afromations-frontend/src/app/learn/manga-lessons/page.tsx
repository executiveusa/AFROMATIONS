import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'

const LESSON_CHAPTERS = [
  {
    slug: 'lesson-01-greeting-scene',
    title: 'Lesson 1: The Greeting Scene',
    topic: 'Japanese greetings and first-meeting etiquette',
    level: 'Beginner',
    status: 'coming-soon',
  },
  {
    slug: 'lesson-02-market-day',
    title: 'Lesson 2: Market Day',
    topic: 'Numbers, shopping vocabulary, and polite requests',
    level: 'Beginner',
    status: 'coming-soon',
  },
  {
    slug: 'lesson-03-anime-production-basics',
    title: 'Lesson 3: Anime Production Basics',
    topic: 'Storyboarding, keyframes, and production pipeline',
    level: 'Intermediate',
    status: 'coming-soon',
  },
]

export default function MangaLessonsPage() {
  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <Link
            href="/learn"
            className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline mb-6 inline-block"
          >
            ← Back to Learn
          </Link>
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Hana Academy
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Manga Lessons
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm mb-4">
            Hana teaches anime production, Japanese language, and creative workflows through
            manga-style chapters. Each lesson is a story — each page is a teaching moment.
          </p>
          <p data-reveal data-delay="3" className="text-white/30 text-xs">
            Invite-only · 21+ creators · Apply below for access
          </p>
        </section>

        <div className="divider" />

        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <h2
            data-reveal
            className="text-2xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Lesson Chapters
          </h2>

          <div className="flex flex-col gap-4">
            {LESSON_CHAPTERS.map((lesson, i) => (
              <div
                key={lesson.slug}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-white/10 rounded-sm p-6 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-(--af-cream) font-semibold">{lesson.title}</h3>
                    <span className="text-[9px] tracking-[0.15em] uppercase text-white/30 border border-white/20 px-2 py-0.5 rounded-sm">
                      {lesson.level}
                    </span>
                  </div>
                  <p className="text-(--af-grey-light) text-sm">{lesson.topic}</p>
                </div>
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/20 whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>

          <div data-reveal className="border border-white/5 rounded-sm p-6 bg-(--af-grey) mt-8">
            <p className="text-(--af-grey-light) text-sm mb-4">
              Hana Manga Lessons are currently in development. Apply for early access to the Hana
              Artist Partner Program to be first in line.
            </p>
            <Link
              href="/apply"
              className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline"
            >
              Apply for Invite →
            </Link>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
