'use client'

import Link from 'next/link'

interface UnlockRequirement {
  domain: string
  required: number
  current: number
}

interface MangaUnlockProps {
  id: string
  issueNumber: number
  titleJa: string
  titleEn: string
  coverImageUrl?: string
  unlocked: boolean
  requirements?: UnlockRequirement[]
}

export function MangaUnlock({
  id,
  issueNumber,
  titleJa,
  titleEn,
  coverImageUrl,
  unlocked,
  requirements = [],
}: MangaUnlockProps) {
  const progressPercentage =
    requirements.length > 0
      ? Math.round(
          (requirements.filter((r) => r.current >= r.required).length /
            requirements.length) *
            100
        )
      : 0

  const isBrushingLock = !unlocked && requirements.length > 0

  return (
    <div
      className={`group relative border rounded-lg overflow-hidden transition-all ${
        unlocked
          ? 'border-[var(--af-red)]/50 bg-[var(--af-grey)]/30 hover:border-[var(--af-red)]/80'
          : 'border-[var(--af-grey-mid)] bg-[var(--af-grey-mid)]/20 opacity-75'
      }`}
    >
      {/* Cover image or placeholder */}
      <div className="aspect-[2/3] bg-gradient-to-br from-indigo-900/30 to-black relative overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={titleEn}
            className={`w-full h-full object-cover transition-all ${
              unlocked ? 'group-hover:scale-105' : 'grayscale'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-4">
            <div className="text-4xl">📖</div>
            <div className="text-xs font-semibold text-[var(--af-grey-light)]">
              Issue {issueNumber}
            </div>
          </div>
        )}

        {/* Overlay for locked state */}
        {!unlocked && isBrushingLock && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-3">
            <div className="text-3xl">🔒</div>
            <div className="text-xs font-semibold text-[var(--af-cream)] text-center">
              Locked
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[80%] h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--af-red)] transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="text-xs text-[var(--af-grey-light)]">
              {progressPercentage}% unlocked
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Issue number and status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--af-red)] tracking-wider uppercase">
            Issue {issueNumber}
          </span>
          {unlocked && (
            <span className="text-xs font-semibold text-green-400">✓ Unlocked</span>
          )}
        </div>

        {/* Japanese title */}
        <div className="text-sm font-semibold text-[var(--af-cream)] leading-tight">
          {titleJa}
        </div>

        {/* English title */}
        <div className="text-xs text-[var(--af-grey-light)]">
          {titleEn}
        </div>

        {/* Requirements (if locked) */}
        {!unlocked && requirements.length > 0 && (
          <div className="pt-2 border-t border-[var(--af-grey-mid)] space-y-1">
            <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider">
              Unlock Requirements:
            </p>
            <div className="space-y-1">
              {requirements.map((req) => (
                <div
                  key={req.domain}
                  className={`text-xs flex items-center justify-between ${
                    req.current >= req.required
                      ? 'text-green-400'
                      : 'text-[var(--af-grey-light)]'
                  }`}
                >
                  <span className="capitalize">{req.domain.replace(/_/g, ' ')}</span>
                  <span className="font-mono">
                    {req.current}/{req.required}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive layer */}
      {unlocked ? (
        <Link href={`/manga/${id}`}>
          <div className="absolute inset-0 bg-[var(--af-red)]/0 hover:bg-[var(--af-red)]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-sm font-semibold text-[var(--af-cream)]">
              Read Issue
            </span>
          </div>
        </Link>
      ) : (
        <div className="absolute inset-0 bg-black/0 cursor-not-allowed" />
      )}
    </div>
  )
}

interface MangaGalleryProps {
  issues: MangaUnlockProps[]
}

export function MangaGallery({ issues }: MangaGalleryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {issues.map((issue) => (
        <MangaUnlock key={issue.id} {...issue} />
      ))}
    </div>
  )
}
