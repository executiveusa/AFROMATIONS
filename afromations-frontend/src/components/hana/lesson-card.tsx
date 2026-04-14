'use client'

import Link from 'next/link'
import { JapaneseText } from './japanese-text'

interface LessonCardProps {
  id: string
  titleJa: string
  titleEn: string
  type: string
  difficulty: string
  domain: string
  durationMinutes: number
  coverImageUrl?: string
  progress?: {
    score?: number
    mastered: boolean
  }
}

const difficultyColors: Record<string, string> = {
  n5: 'bg-blue-900/30 text-blue-300 border-blue-500/30',
  n4: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/30',
  n3: 'bg-green-900/30 text-green-300 border-green-500/30',
  n2: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
  n1: 'bg-orange-900/30 text-orange-300 border-orange-500/30',
  advanced: 'bg-red-900/30 text-red-300 border-red-500/30',
}

const typeEmojis: Record<string, string> = {
  vocabulary: '📚',
  grammar: '⚙️',
  culture: '🌸',
  folklore: '👻',
  listening: '👂',
  speaking: '🗣️',
  reading: '📖',
  writing: '✍️',
  conversation: '💬',
}

export function LessonCard({
  id,
  titleJa,
  titleEn,
  type,
  difficulty,
  domain,
  durationMinutes,
  coverImageUrl,
  progress,
}: LessonCardProps) {
  const difficultyClass = difficultyColors[difficulty] || difficultyColors.n5
  const emoji = typeEmojis[type] || '📝'
  const isComplete = progress?.mastered ?? false

  return (
    <Link href={`/learn/${id}`}>
      <div className="group cursor-pointer border border-[var(--af-grey-mid)] rounded-lg overflow-hidden bg-[var(--af-grey)]/50 hover:border-[var(--af-red)]/50 hover:bg-[var(--af-grey)] transition-all h-full">
        {/* Cover image or placeholder */}
        <div className="aspect-video bg-gradient-to-br from-[var(--af-red)]/10 to-[var(--af-grey-mid)] relative overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
              {emoji}
            </div>
          )}

          {/* Mastery badge */}
          {isComplete && (
            <div className="absolute top-2 right-2 bg-green-500/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              ✓
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Japanese title */}
          <div className="text-lg font-semibold text-[var(--af-cream)] leading-tight">
            {titleJa}
          </div>

          {/* English title */}
          <div className="text-sm text-[var(--af-grey-light)]">
            {titleEn}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {/* Difficulty */}
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border ${difficultyClass}`}
            >
              {difficulty.toUpperCase()}
            </span>

            {/* Type */}
            <span className="text-xs font-semibold px-2 py-1 rounded border border-[var(--af-grey-light)]/20 text-[var(--af-grey-light)] bg-black/20">
              {emoji} {type}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--af-grey-mid)]">
            <span className="text-xs text-[var(--af-grey-light)]">
              {durationMinutes} min
            </span>

            {progress && (
              <span className="text-xs text-[var(--af-grey-light)]">
                {progress.score ? `${Math.round(progress.score)}%` : 'Not started'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
