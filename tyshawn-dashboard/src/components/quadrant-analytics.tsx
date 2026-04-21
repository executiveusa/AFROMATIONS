const STATS = [
  { label: 'Hours Studied', value: '47', unit: 'hrs', icon: '⏱️', change: '+3h this week' },
  { label: 'Words Learned', value: '312', unit: 'words', icon: '🈶', change: '+18 this week' },
  { label: 'Lessons Done', value: '24', unit: 'total', icon: '✅', change: '2 this week' },
  { label: 'Characters Made', value: '7', unit: 'total', icon: '🧍', change: '+1 this week' },
]

const ACTIVITY = [
  { day: 'Mon', hours: 0.5 },
  { day: 'Tue', hours: 1.0 },
  { day: 'Wed', hours: 0.25 },
  { day: 'Thu', hours: 1.5 },
  { day: 'Fri', hours: 0.75 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 0.5 },
]

const MAX_HOURS = Math.max(...ACTIVITY.map((a) => a.hours))

export function AnalyticsQuadrant() {
  return (
    <section className="bg-[var(--af-black)] p-6 flex flex-col gap-5 min-h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-xl">
          📊
        </div>
        <div>
          <h2
            className="text-lg font-bold text-[var(--af-cream)]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Your Progress
          </h2>
          <p className="text-xs text-[var(--af-grey-light)]">
            This week's numbers
          </p>
        </div>
        <a
          href="/progress"
          className="ml-auto text-xs font-semibold text-amber-400 hover:text-amber-300"
        >
          See all →
        </a>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--af-grey)] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{s.icon}</span>
              <span className="text-xs text-[var(--af-grey-light)]">{s.unit}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--af-cream)] mb-0.5">
              {s.value}
            </div>
            <div className="text-xs text-[var(--af-grey-light)]">{s.label}</div>
            <div className="text-xs text-amber-400 mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart (simple) */}
      <div>
        <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider mb-3">
          Study Time This Week
        </p>
        <div className="flex items-end gap-1.5 h-16">
          {ACTIVITY.map((a) => (
            <div key={a.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-amber-500/80 rounded-sm transition-all"
                style={{ height: `${(a.hours / MAX_HOURS) * 100}%`, minHeight: '4px' }}
              />
              <span className="text-[10px] text-[var(--af-grey-light)]">{a.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-2 mt-auto">
        <a
          href="/progress"
          className="btn-large flex-1 flex items-center justify-center gap-2 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--af-cream)] transition-colors"
        >
          Full Report
        </a>
        <a
          href="/progress/mastery"
          className="btn-large flex-1 flex items-center justify-center gap-2 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--af-cream)] transition-colors"
        >
          Mastery Map
        </a>
      </div>
    </section>
  )
}
