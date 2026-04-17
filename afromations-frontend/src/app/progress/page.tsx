import { MasteryRing, MasteryGrid } from '@/components/hana/mastery-ring'

export const metadata = {
  title: 'Your Progress',
  description: 'Track your Japanese language mastery',
}

// Mock data
const MOCK_MASTERY = [
  {
    domain: 'vocabulary',
    score: 72,
    level: 'n3',
    trend: 5,
  },
  {
    domain: 'grammar',
    score: 68,
    level: 'n4',
    trend: -2,
  },
  {
    domain: 'culture',
    score: 85,
    level: 'n2',
    trend: 8,
  },
  {
    domain: 'listening',
    score: 55,
    level: 'n4',
    trend: 3,
  },
  {
    domain: 'speaking',
    score: 42,
    level: 'n5',
    trend: -1,
  },
  {
    domain: 'folklore',
    score: 78,
    level: 'n3',
    trend: 6,
  },
]

export default function ProgressPage() {
  const overallScore = Math.round(
    MOCK_MASTERY.reduce((sum, m) => sum + m.score, 0) / MOCK_MASTERY.length
  )
  const completedLessons = 24
  const totalStudyTime = '47h 23m'
  const currentStreak = 8

  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      {/* Page header */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[var(--af-cream)] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Your Progress
        </h1>
        <p className="text-[var(--af-grey-light)]">
          Track your mastery across all domains. Progress is measured in depth, not speed.
        </p>
      </div>

      {/* Overall stats */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[var(--af-cream)] mb-1">
              {overallScore}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Overall Score</p>
          </div>

          <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[var(--af-cream)] mb-1">
              {completedLessons}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Lessons Done</p>
          </div>

          <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[var(--af-cream)] mb-1">
              {totalStudyTime}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Study Time</p>
          </div>

          <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-1">
              {currentStreak}
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Mastery by domain */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <h2
          className="text-2xl font-bold text-[var(--af-cream)] mb-8"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Mastery by Domain
        </h2>

        <MasteryGrid mastery={MOCK_MASTERY} size="md" />
      </div>

      {/* Recent activity */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto">
        <h2
          className="text-2xl font-bold text-[var(--af-cream)] mb-6"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Recent Activity
        </h2>

        <div className="space-y-3">
          <div className="border border-[var(--af-grey-mid)] rounded-lg p-4 bg-[var(--af-grey)]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[var(--af-cream)]">
                Culture Lesson: Shrine Etiquette
              </h3>
              <span className="text-xs text-green-400 font-semibold">
                ✓ Mastered
              </span>
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Completed 2 hours ago</p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-4 bg-[var(--af-grey)]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[var(--af-cream)]">
                Listening Assessment: Daily Conversation
              </h3>
              <span className="text-xs text-yellow-400 font-semibold">
                78%
              </span>
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Completed 1 day ago</p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-4 bg-[var(--af-grey)]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[var(--af-cream)]">
                Vocabulary: Folklore Terms (50 words)
              </h3>
              <span className="text-xs text-green-400 font-semibold">
                ✓ Mastered
              </span>
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Completed 2 days ago</p>
          </div>

          <div className="border border-[var(--af-grey-mid)] rounded-lg p-4 bg-[var(--af-grey)]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[var(--af-cream)]">
                Wiki Explored: Kami Concepts
              </h3>
              <span className="text-xs text-[var(--af-grey-light)] font-semibold">
                5 entries
              </span>
            </div>
            <p className="text-[var(--af-grey-light)] text-sm">Completed 3 days ago</p>
          </div>
        </div>
      </div>
    </main>
  )
}
