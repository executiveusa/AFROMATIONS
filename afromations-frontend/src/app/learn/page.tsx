import { LessonCard } from '@/components/hana/lesson-card'

export const metadata = {
  title: 'Learn with Agent Hana',
  description: 'Japanese language and culture lessons',
}

// Mock data - in production, fetch from API
const MOCK_LESSONS = [
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
    progress: { score: 75 },
  },
]

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      {/* Page header */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[var(--af-cream)] mb-4"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Learn
        </h1>
        <p className="text-[var(--af-grey-light)] max-w-2xl">
          Master Japanese language and culture through structured lessons. Each lesson builds on the previous one. Start where you are, progress where you need to go.
        </p>
      </div>

      {/* Filter/navigation */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-[var(--af-red)] text-[var(--af-cream)] text-sm font-semibold rounded hover:bg-[var(--af-red-dark)] transition-colors">
            All Lessons
          </button>
          <button className="px-4 py-2 border border-[var(--af-grey-light)]/20 text-[var(--af-grey-light)] text-sm font-semibold rounded hover:border-[var(--af-grey-light)]/50 transition-colors">
            Vocabulary
          </button>
          <button className="px-4 py-2 border border-[var(--af-grey-light)]/20 text-[var(--af-grey-light)] text-sm font-semibold rounded hover:border-[var(--af-grey-light)]/50 transition-colors">
            Grammar
          </button>
          <button className="px-4 py-2 border border-[var(--af-grey-light)]/20 text-[var(--af-grey-light)] text-sm font-semibold rounded hover:border-[var(--af-grey-light)]/50 transition-colors">
            Culture
          </button>
          <button className="px-4 py-2 border border-[var(--af-grey-light)]/20 text-[var(--af-grey-light)] text-sm font-semibold rounded hover:border-[var(--af-grey-light)]/50 transition-colors">
            Difficulty
          </button>
        </div>
      </div>

      {/* Lesson grid */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      </div>

      {/* Stats section */}
      <div className="px-6 sm:px-12 max-w-7xl mx-auto mt-16 grid grid-cols-3 gap-4">
        <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--af-cream)] mb-2">
            12
          </div>
          <p className="text-[var(--af-grey-light)] text-sm">Lessons Completed</p>
        </div>
        <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--af-cream)] mb-2">
            8/10
          </div>
          <p className="text-[var(--af-grey-light)] text-sm">Current Streak</p>
        </div>
        <div className="bg-[var(--af-grey-mid)]/30 border border-[var(--af-grey-mid)] rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-[var(--af-cream)] mb-2">
            42h
          </div>
          <p className="text-[var(--af-grey-light)] text-sm">Total Time</p>
        </div>
      </div>
    </main>
  )
}
