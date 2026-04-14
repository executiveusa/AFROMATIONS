import { MangaGallery } from '@/components/hana/manga-unlock'

export const metadata = {
  title: 'Agent Hana Manga',
  description: 'Unlock manga issues as you progress',
}

// Mock data
const MOCK_MANGA_ISSUES = [
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
  const totalIssues = MOCK_MANGA_ISSUES.length
  const unlockedCount = MOCK_MANGA_ISSUES.filter((m) => m.unlocked).length
  const readCount = Math.floor(unlockedCount * 0.75) // Mock: some read

  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      {/* Page header */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[var(--af-cream)] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Agent Hana Chronicles
        </h1>
        <p className="text-[var(--af-grey-light)] max-w-2xl mb-6">
          The Learning Blade — A manga series that tells the story of learning Japanese language and culture through the eyes of your guide, Agent Hana.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-2xl font-bold text-[var(--af-red)]">
              {unlockedCount}/{totalIssues}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Issues Unlocked</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--af-cream)]">
              {readCount}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Issues Read</p>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-indigo-900/20 to-[var(--af-red)]/10 border border-[var(--af-red)]/20 rounded-lg p-6">
          <h2 className="font-semibold text-[var(--af-cream)] mb-2">
            📖 About This Series
          </h2>
          <p className="text-[var(--af-grey-light)] text-sm leading-relaxed">
            "The Learning Blade" is not just a story. It's a record of what happens when a learner meets an AI guide who refuses to simplify Japanese culture. As your mastery grows, new story issues unlock. Read about Hana's doubts, the learner's breakthroughs, and the deep truth that culture cannot be rushed.
          </p>
        </div>
      </div>

      {/* Unlock info */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6">
          <h3 className="font-semibold text-[var(--af-cream)] mb-3">
            How to Unlock Issues
          </h3>
          <ul className="text-[var(--af-grey-light)] text-sm space-y-2">
            <li>
              ✓ Each issue requires mastery in specific domains (vocabulary, grammar, culture, etc.)
            </li>
            <li>
              ✓ Reach the required mastery score to unlock the next chapter
            </li>
            <li>
              ✓ Issues unlock automatically when requirements are met
            </li>
            <li>
              ✓ Return to <span className="font-mono">/progress</span> to see your current mastery scores
            </li>
          </ul>
        </div>
      </div>

      {/* Manga gallery */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto">
        <h2
          className="text-2xl font-bold text-[var(--af-cream)] mb-8"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          All Issues
        </h2>

        <MangaGallery issues={MOCK_MANGA_ISSUES} />
      </div>

      {/* Reading progress tip */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mt-16 text-center">
        <p className="text-[var(--af-grey-light)] text-sm max-w-2xl mx-auto">
          💡 Read right-to-left like traditional manga. Each issue teaches you something about Japanese language and culture through story.
        </p>
      </div>
    </main>
  )
}
