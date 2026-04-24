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
      className={`group relative border rounded-sm overflow-hidden transition-colors ${
        unlocked
          ? 'border-(--af-red)/50 bg-(--af-grey) hover:border-(--af-red)/80'
          : 'border-white/5 bg-(--af-grey-mid)/20 opacity-75'
      }`}
    >
      {/* Cover image or placeholder */}
      <div className="aspect-2/3 bg-(--af-grey-mid) relative overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={titleEn}
            className={`w-full h-full object-cover ${!unlocked ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-(--af-grey-light)">
              Issue {issueNumber}
            </span>
          </div>
        )}

        {/* Overlay for locked state */}
        {!unlocked && isBrushingLock && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-3">
            <span className="text-sm font-bold text-(--af-cream)">Locked</span>

            {/* Progress bar */}
            <div className="w-full max-w-[80%] h-1 bg-black/50 rounded-sm overflow-hidden">
              <div
                className="h-full bg-(--af-red) transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <span className="text-xs text-(--af-grey-light)">
              {progressPercentage}% unlocked
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-(--af-red) tracking-wider uppercase">
            Issue {issueNumber}
          </span>
          {unlocked && (
            <span className="text-xs font-semibold text-green-400">Unlocked</span>
          )}
        </div>

        <div className="text-sm font-semibold text-(--af-cream) leading-tight">
          {titleJa}
        </div>

        <div className="text-xs text-(--af-grey-light)">
          {titleEn}
        </div>

        {!unlocked && requirements.length > 0 && (
          <div className="pt-2 border-t border-white/5 space-y-1">
            <p className="text-xs font-semibold text-(--af-grey-light) uppercase tracking-wider">
              Requirements
            </p>
            <div className="space-y-1">
              {requirements.map((req) => (
                <div
                  key={req.domain}
                  className={`text-xs flex items-center justify-between ${
                    req.current >= req.required
                      ? 'text-green-400'
                      : 'text-(--af-grey-light)'
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
          <div className="absolute inset-0 bg-(--af-red)/0 hover:bg-(--af-red)/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-sm font-semibold text-(--af-cream)">
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
