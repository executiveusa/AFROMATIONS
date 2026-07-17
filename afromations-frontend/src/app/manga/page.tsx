'use client'

import { InnerLayout } from '@/components/inner-layout'
import { MangaGallery } from '@/components/hana/manga-unlock'
import Link from 'next/link'

const MANGA_ISSUES = [
  {
    id: '1',
    issueNumber: 1,
    titleJa: '最初のレッスン',
    titleEn: 'The First Lesson',
    unlocked: true,
    requirements: [],
  },
  {
    id: '2',
    issueNumber: 2,
    titleJa: '粒子の舞',
    titleEn: 'The Particle Dance',
    unlocked: true,
    requirements: [],
  },
  {
    id: '3',
    issueNumber: 3,
    titleJa: '神の居場所',
    titleEn: 'Where Gods Live',
    unlocked: true,
    requirements: [],
  },
  {
    id: '4',
    issueNumber: 4,
    titleJa: '学習の牙',
    titleEn: 'When Learning Bites Back',
    unlocked: true,
    requirements: [],
  },
  {
    id: '5',
    issueNumber: 5,
    titleJa: '京都の呼び声',
    titleEn: 'Kyoto Calling',
    unlocked: false,
    requirements: [
      { domain: 'vocabulary', required: 60, current: 72 },
      { domain: 'culture', required: 70, current: 85 },
    ],
  },
  {
    id: '6',
    issueNumber: 6,
    titleJa: '社殿での過ち',
    titleEn: 'The Shrine Mistake',
    unlocked: false,
    requirements: [
      { domain: 'culture', required: 75, current: 85 },
      { domain: 'listening', required: 65, current: 55 },
    ],
  },
]

const SERIES = [
  {
    slug: 'dual',
    title: 'DUAL',
    subtitle: 'Seattle 2056',
    description: 'A cinematic anime story from AFROMATIONS. Two characters, one city, infinite futures.',
    badge: 'Reading Now',
    direction: 'RTL',
    chapter: { slug: 'chapter-1-knock-at-the-door', title: 'Chapter 1: Knock at the Door' },
  },
  {
    slug: 'hana-warriors-of-light',
    title: 'Hana: Warriors of Light',
    subtitle: 'A Mythic Saga',
    description: 'A mythic onna-bugeisha inspired AFROMATIONS manga series led by Agent Hana.',
    badge: 'Coming Soon',
    direction: 'RTL',
    chapter: null,
  },
  {
    slug: 'owpil',
    title: 'O.W.P.I.L',
    subtitle: 'One Without Purpose Is Lost',
    description: 'A documentary comic project exploring creative identity and artistic purpose.',
    badge: 'Preview',
    direction: 'LTR',
    chapter: { slug: 'fall-2026-preview', title: 'Fall 2026 Preview' },
  },
  {
    slug: 'hana-academy',
    title: 'Hana Academy',
    subtitle: 'Learn Through Manga',
    description: 'Hana teaches anime production and Japanese through manga panels.',
    badge: 'Invite Only',
    direction: 'LTR',
    chapter: null,
  },
]

export default function MangaPage() {
  const totalIssues = MANGA_ISSUES.length
  const unlockedCount = MANGA_ISSUES.filter((m) => m.unlocked).length

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            AFROMATIONS Manga
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Manga & Comics
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm mb-4">
            Original stories, lesson chapters, and documentary comics from AFROMATIONS. Powered by
            Hana — built in public.
          </p>
        </section>

        <div className="divider" />

        {/* Series Grid */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Series
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-2xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            All Series
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERIES.map((s, i) => (
              <div
                key={s.slug}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-white/10 rounded-sm p-6 flex flex-col gap-3 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-(--af-red)">
                    {s.badge}
                  </span>
                  <span className="text-[10px] text-white/30">{s.direction}</span>
                </div>
                <h3 className="text-(--af-cream) font-bold text-lg leading-tight">{s.title}</h3>
                <p className="text-white/40 text-xs">{s.subtitle}</p>
                <p className="text-(--af-grey-light) text-xs leading-relaxed flex-1">
                  {s.description}
                </p>
                {s.chapter ? (
                  <Link
                    href={`/manga/${s.slug}/${s.chapter.slug}`}
                    className="text-[11px] tracking-[0.15em] uppercase text-(--af-red) hover:underline mt-2"
                  >
                    Read {s.chapter.title} →
                  </Link>
                ) : (
                  <Link
                    href={`/manga/${s.slug}`}
                    className="text-[11px] tracking-[0.15em] uppercase text-white/30 mt-2"
                  >
                    View Series →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Hana Chronicles (Learning Issues — existing system) */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            The Learning Blade
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-2xl font-bold text-(--af-cream) mb-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Agent Hana Chronicles
          </h2>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm mb-4">
            A manga series that tells the story of learning Japanese language and culture through
            the eyes of your guide, Agent Hana. Issues unlock as your mastery grows.
          </p>
          <div data-reveal data-delay="3" className="flex gap-8 text-sm mb-8">
            <div>
              <span className="font-bold text-(--af-red)">{unlockedCount}/{totalIssues}</span>
              <span className="text-(--af-grey-light) ml-2">Issues Unlocked</span>
            </div>
          </div>

          <MangaGallery issues={MANGA_ISSUES} />
        </section>

        <section data-reveal className="px-6 sm:px-12 max-w-7xl mx-auto mt-8 text-center">
          <p className="text-(--af-grey-light) text-xs max-w-md mx-auto">
            Read right-to-left like traditional manga. Each issue teaches you something about
            Japanese language and culture through story.
          </p>
        </section>
      </main>
    </InnerLayout>
  )
}
