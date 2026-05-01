'use client'

import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'

const MODULES = [
  {
    number: 1,
    title: 'Sound & Rhythm',
    description: 'Hiragana, pronunciation, listening patterns, and anime dialogue cadence.',
    lessons: 4,
  },
  {
    number: 2,
    title: 'Everyday Phrases',
    description: 'Greetings, classroom language, emotional reactions, and social context.',
    lessons: 5,
  },
  {
    number: 3,
    title: 'Particles & Meaning',
    description: 'wa, ga, no, ni, de, o, e, to, mo taught through short anime-style examples.',
    lessons: 6,
  },
  {
    number: 4,
    title: 'Honorifics & Respect',
    description: 'san, sama, kun, chan, senpai, sensei, and when not to use them.',
    lessons: 4,
  },
  {
    number: 5,
    title: 'Culture in the Scene',
    description: 'Food, festivals, school life, family roles, shrines, folklore, and historical context.',
    lessons: 5,
  },
  {
    number: 6,
    title: 'Creative Translation',
    description: 'Why subtitles are not word-for-word, and how meaning changes across cultures.',
    lessons: 4,
  },
  {
    number: 7,
    title: 'Artist AI Lab',
    description: 'Use AI to create study cards, scene breakdowns, pronunciation drills, and visual prompts.',
    lessons: 3,
  },
]

const SEED_LESSONS = [
  {
    slug: 'hiragana-energy',
    title: 'Hiragana Energy',
    module: 1,
    href: '/learn/japanese-by-anime/hiragana-energy',
  },
  {
    slug: 'wa-vs-ga',
    title: 'WA vs GA: The Particle Question',
    module: 3,
    href: '/learn/japanese-by-anime/wa-vs-ga',
  },
  {
    slug: 'honorifics',
    title: 'Honorifics: Reading the Room',
    module: 4,
    href: '/learn/japanese-by-anime/honorifics',
  },
]

export default function JapaneseBYAnimeCoursePage() {
  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto mb-12">
          <div data-reveal>
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
              Featured Course
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Japanese by Anime
            </h1>
            <p className="text-(--af-grey-light) text-lg leading-relaxed max-w-3xl mb-6">
              Learn Japanese through authentic anime dialogue, cultural moments, and real storytelling. From hiragana to advanced grammar, discover why anime is the perfect classroom for language immersion.
            </p>
            <Link href="/learn/japanese-by-anime/hiragana-energy">
              <button className="h-11 rounded-sm bg-(--af-red) px-8 text-sm font-semibold tracking-wider text-(--af-cream) transition-colors hover:bg-(--af-red-dark)">
                Start Learning
              </button>
            </Link>
          </div>
        </section>

        <div className="divider my-12" />

        {/* Course Overview */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
            Course Structure
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-3xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Seven Modules to Fluency
          </h2>

          <div className="space-y-4">
            {MODULES.map((module, i) => (
              <div
                key={module.number}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-white/10 rounded-sm p-6 hover:bg-(--af-grey) transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3
                      className="text-lg font-bold text-(--af-cream)"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      Module {module.number}: {module.title}
                    </h3>
                    <p className="text-(--af-grey-light) text-sm mt-2">
                      {module.description}
                    </p>
                  </div>
                  <span className="text-(--af-red) text-sm font-semibold whitespace-nowrap ml-4">
                    {module.lessons} lessons
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider my-12" />

        {/* Start Learning */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-4">
            Explore Lessons
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-3xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Featured Lessons
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {SEED_LESSONS.map((lesson, i) => (
              <Link key={lesson.slug} href={lesson.href}>
                <div
                  data-reveal
                  data-delay={String(i + 1)}
                  className="border border-white/10 rounded-sm p-6 hover:bg-(--af-grey) transition-colors cursor-pointer h-full"
                >
                  <p className="text-(--af-red) text-xs mb-2 uppercase tracking-wider font-semibold">
                    Module {lesson.module}
                  </p>
                  <h3
                    className="text-lg font-bold text-(--af-cream) mb-3"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {lesson.title}
                  </h3>
                  <p className="text-(--af-grey-light) text-sm">
                    Start Lesson →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="divider my-12" />

        {/* Philosophy */}
        <section className="px-6 sm:px-12 max-w-5xl mx-auto">
          <div data-reveal className="border border-white/10 rounded-sm p-8">
            <p className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
              Our Approach
            </p>
            <h3
              className="text-2xl font-bold text-(--af-cream) mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Why Anime is the Perfect Classroom
            </h3>

            <div className="space-y-4 text-(--af-grey-light) text-sm leading-relaxed">
              <p>
                <strong className="text-(--af-cream)">Anime is real language.</strong> Native
                speakers, natural dialogue, emotion, and context. Not textbook sentences. Real
                communication.
              </p>
              <p>
                <strong className="text-(--af-cream)">Culture embedded in every scene.</strong>{' '}
                Japanese customs, social rules, humor, and values shine through. You learn language
                and culture together.
              </p>
              <p>
                <strong className="text-(--af-cream)">Spaced repetition through storytelling.</strong>{' '}
                You hear words and patterns repeatedly across scenes, building deep memory without
                boring drills.
              </p>
              <p>
                <strong className="text-(--af-cream)">Immersive, not isolating.</strong> Connect
                with other learners, discuss scenes, share interpretations, and build a community
                passionate about anime and Japanese.
              </p>
            </div>
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
