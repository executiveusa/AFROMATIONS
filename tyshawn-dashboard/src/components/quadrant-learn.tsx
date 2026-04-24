'use client'

const DOMAINS = [
  { label: 'Words', score: 72, color: 'bg-emerald-500' },
  { label: 'Grammar', score: 68, color: 'bg-cyan-500' },
  { label: 'Culture', score: 85, color: 'bg-purple-500' },
  { label: 'Listening', score: 55, color: 'bg-yellow-500' },
]

export function LearnQuadrant() {
  const streak = 8

  return (
    <section className="bg-[var(--af-black)] p-6 flex flex-col gap-5 min-h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xl">
          🗡️
        </div>
        <div>
          <h2
            className="text-lg font-bold text-[var(--af-cream)]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Learn Japanese
          </h2>
          <p className="text-xs text-[var(--af-grey-light)]">
            With Agent Hana
          </p>
        </div>

        {/* Streak badge */}
        <div className="ml-auto flex items-center gap-1.5 bg-orange-500/20 rounded-full px-3 py-1">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold text-orange-400">{streak} days</span>
        </div>
      </div>

      {/* Primary action */}
      <a
        href="/learn/next"
        className="btn-large flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 py-4 transition-colors"
      >
        <span className="text-3xl">📖</span>
        <div>
          <div className="font-bold text-base">Continue My Lesson</div>
          <div className="text-emerald-200 text-sm">Culture: Shrine Etiquette</div>
        </div>
        <span className="ml-auto text-2xl text-emerald-300">→</span>
      </a>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href="/learn/vocab"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">🈶</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">Practice Words</span>
        </a>
        <a
          href="/learn/speak"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">🎤</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">Speak Out Loud</span>
        </a>
        <a
          href="/manga"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">📚</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">Read Manga</span>
        </a>
      </div>

      {/* Domain progress bars */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider">
          Your Skills
        </p>
        {DOMAINS.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-[var(--af-grey-light)] w-16 shrink-0">
              {d.label}
            </span>
            <div className="flex-1 h-2 bg-[var(--af-grey-mid)] rounded-full overflow-hidden">
              <div
                className={`h-full ${d.color} rounded-full transition-all`}
                style={{ width: `${d.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--af-cream)] w-8 text-right">
              {d.score}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
