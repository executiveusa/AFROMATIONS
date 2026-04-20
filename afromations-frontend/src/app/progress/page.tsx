'use client'

import { InnerLayout } from '@/components/inner-layout'
import { MasteryRing, MasteryGrid } from '@/components/hana/mastery-ring'

const MASTERY = [
  { domain: 'vocabulary', score: 72, level: 'n3', trend: 5 },
  { domain: 'grammar', score: 68, level: 'n4', trend: -2 },
  { domain: 'culture', score: 85, level: 'n2', trend: 8 },
  { domain: 'listening', score: 55, level: 'n4', trend: 3 },
  { domain: 'speaking', score: 42, level: 'n5', trend: -1 },
  { domain: 'folklore', score: 78, level: 'n3', trend: 6 },
]

export default function ProgressPage() {
  const overallScore = Math.round(
    MASTERY.reduce((sum, m) => sum + m.score, 0) / MASTERY.length
  )

  return (
    <InnerLayout>
      <main className="min-h-screen bg-(--af-black) pt-24 pb-16">
        {/* Header */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto mb-12">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Mastery Tracker
          </p>
          <h1
            data-reveal
            data-delay="1"
            className="text-4xl sm:text-5xl font-bold text-(--af-cream) mb-4"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Your Progress
          </h1>
          <p data-reveal data-delay="2" className="text-(--af-grey-light) text-sm">
            Track your mastery across all domains. Progress is measured in depth, not speed.
          </p>
        </section>

        <div className="divider" />

        {/* Overall stats — clean inline */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <div data-reveal className="flex flex-wrap gap-12 justify-center">
            {[
              { value: String(overallScore), label: 'Overall Score' },
              { value: '24', label: 'Lessons Done' },
              { value: '47h 23m', label: 'Study Time' },
              { value: '8', label: 'Day Streak', accent: true },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-bold mb-1 ${stat.accent ? 'text-green-400' : 'text-(--af-cream)'}`}>
                  {stat.value}
                </p>
                <p className="text-(--af-grey-light) text-xs tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Mastery by domain */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Domains
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-2xl font-bold text-(--af-cream) mb-8"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Mastery by Domain
          </h2>
          <MasteryGrid mastery={MASTERY} size="md" />
        </section>

        <div className="divider" />

        {/* Recent activity */}
        <section className="px-6 sm:px-12 max-w-7xl mx-auto py-16">
          <p data-reveal className="text-[11px] tracking-[0.2em] uppercase text-(--af-red) mb-3">
            Activity
          </p>
          <h2
            data-reveal
            data-delay="1"
            className="text-2xl font-bold text-(--af-cream) mb-6"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Recent Activity
          </h2>

          <div className="space-y-2">
            {[
              { title: 'Culture Lesson: Shrine Etiquette', status: 'Mastered', statusColor: 'text-green-400', time: '2 hours ago' },
              { title: 'Listening Assessment: Daily Conversation', status: '78%', statusColor: 'text-yellow-400', time: '1 day ago' },
              { title: 'Vocabulary: Folklore Terms (50 words)', status: 'Mastered', statusColor: 'text-green-400', time: '2 days ago' },
              { title: 'Wiki Explored: Kami Concepts', status: '5 entries', statusColor: 'text-(--af-grey-light)', time: '3 days ago' },
            ].map((item, i) => (
              <div
                key={i}
                data-reveal
                data-delay={String(Math.min(i + 1, 4))}
                className="border border-white/5 rounded-sm p-4 bg-(--af-grey) transition-colors hover:bg-(--af-grey-mid)"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-(--af-cream) text-sm">{item.title}</h3>
                  <span className={`text-xs font-semibold ${item.statusColor}`}>{item.status}</span>
                </div>
                <p className="text-(--af-grey-light) text-xs">{item.time}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </InnerLayout>
  )
}
