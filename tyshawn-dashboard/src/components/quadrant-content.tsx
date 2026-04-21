const RECENT_POSTS = [
  { title: 'The Real Meaning of Yōkai', status: 'published', date: 'Today' },
  { title: 'Shrine Etiquette: A Real Guide', status: 'published', date: 'Wed' },
  { title: 'One Piece and Japanese Folklore', status: 'draft', date: 'In progress' },
]

const TRENDING = [
  { topic: 'Demon Slayer Season 4', score: 94 },
  { topic: 'Jujutsu Kaisen Chapter 265', score: 88 },
  { topic: 'Black Clover Return', score: 76 },
]

export function ContentQuadrant() {
  return (
    <section className="bg-[var(--af-black)] p-6 flex flex-col gap-5 min-h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xl">
          ✍️
        </div>
        <div>
          <h2
            className="text-lg font-bold text-[var(--af-cream)]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Content Studio
          </h2>
          <p className="text-xs text-[var(--af-grey-light)]">
            Blog, trends, community
          </p>
        </div>
      </div>

      {/* Primary action */}
      <a
        href="/content/new"
        className="btn-large flex items-center gap-4 bg-[var(--af-red)] hover:bg-[var(--af-red-dark)] text-white rounded-xl px-5 py-4 transition-colors"
      >
        <span className="text-3xl">✨</span>
        <div>
          <div className="font-bold text-base">Write a Blog Post</div>
          <div className="text-red-200 text-sm">Hanna will help you</div>
        </div>
        <span className="ml-auto text-2xl text-red-300">→</span>
      </a>

      {/* Secondary actions */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href="/content/trends"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">🔥</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">What's Hot</span>
        </a>
        <a
          href="/content/schedule"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">📅</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">Schedule</span>
        </a>
        <a
          href="/content/community"
          className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
        >
          <span className="text-2xl">👥</span>
          <span className="text-xs font-semibold text-[var(--af-cream)]">Community</span>
        </a>
      </div>

      {/* Trending topics */}
      <div>
        <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider mb-2">
          Trending Now
        </p>
        <div className="space-y-1.5">
          {TRENDING.map((t, i) => (
            <div
              key={t.topic}
              className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-[var(--af-grey)]/50"
            >
              <span className="text-xs font-bold text-[var(--af-red)] w-4">
                #{i + 1}
              </span>
              <span className="text-sm text-[var(--af-cream)] flex-1 truncate">
                {t.topic}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-[var(--af-grey-mid)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--af-red)] rounded-full"
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      <div>
        <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider mb-2">
          Recent Posts
        </p>
        <div className="space-y-1">
          {RECENT_POSTS.map((p) => (
            <div key={p.title} className="flex items-center gap-3 py-1.5">
              <span
                className={`text-xs font-semibold shrink-0 ${
                  p.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                {p.status === 'published' ? '✓' : '○'}
              </span>
              <span className="text-sm text-[var(--af-cream)] flex-1 truncate">
                {p.title}
              </span>
              <span className="text-xs text-[var(--af-grey-light)] shrink-0">{p.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
