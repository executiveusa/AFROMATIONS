'use client'

import { InnerLayout } from '@/components/inner-layout'
import { MangaGallery } from '@/components/hana/manga-unlock'

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

export default function MangaPage() {
  const totalIssues = MANGA_ISSUES.length
  const unlockedCount = MANGA_ISSUES.filter((m) => m.unlocked).length

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            The Learning Blade
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Agent Hana Chronicles
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) max-w-2xl text-sm mb-8">
            A manga series that tells the story of learning Japanese language and culture through
            the eyes of your guide, Agent Hana.
          </p>

          {/* Inline stats — no KPI cards */}
          <div data-reveal data-delay="3" className="flex gap-8 text-sm">
            <div>
              <span className="font-bold text-(--af-red)">{unlockedCount}/{totalIssues}</span>
              <span className="text-(--af-grey-light) ml-2">Issues Unlocked</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* About */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <div data-reveal className="border border-white/10 rounded-sm p-6">
            <h2 className="font-semibold text-(--af-cream) mb-2 text-sm">About This Series</h2>
            <p className="text-(--af-grey-light) text-sm leading-relaxed">
              &ldquo;The Learning Blade&rdquo; is not just a story. It&apos;s a record of what
              happens when a learner meets an AI guide who refuses to simplify Japanese culture. As
              your mastery grows, new story issues unlock.
            </p>
          </div>
        </section>

        {/* How to Unlock */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <div data-reveal className="border border-white/5 rounded-sm p-6 bg-(--af-grey)">
            <h3 className="font-semibold text-(--af-cream) mb-3 text-sm">How to Unlock Issues</h3>
            <ul className="text-(--af-grey-light) text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) text-xs mt-0.5">—</span>
                Each issue requires mastery in specific domains (vocabulary, grammar, culture, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) text-xs mt-0.5">—</span>
                Reach the required mastery score to unlock the next chapter
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) text-xs mt-0.5">—</span>
                Issues unlock automatically when requirements are met
              </li>
              <li className="flex items-start gap-2">
                <span className="text-(--af-red) text-xs mt-0.5">—</span>
                Return to <a href="/progress" className="text-(--af-red) hover:underline">/progress</a> to see your mastery scores
              </li>
            </ul>
          </div>
        </section>

        {/* Gallery */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Collection
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-2xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            All Issues
          </h2>

          <MangaGallery issues={MANGA_ISSUES} />
        </section>

        {/* Tip */}
        <section data-reveal className="px-6 sm:px-12 max-w-7xl mx-auto mt-16 text-center">
          <p className="text-(--af-grey-light) text-xs max-w-md mx-auto">
            Read right-to-left like traditional manga. Each issue teaches you something about
            Japanese language and culture through story.
          </p>
        </section>
      </main>
    </InnerLayout>
  )
}
