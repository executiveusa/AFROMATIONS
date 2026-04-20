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

const typeLabels: Record<string, string> = {
  vocabulary: 'Vocab',
  grammar: 'Grammar',
  culture: 'Culture',
  folklore: 'Folklore',
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
  conversation: 'Conversation',
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
  const typeLabel = typeLabels[type] || type
  const isComplete = progress?.mastered ?? false

  return (
    <Link href={`/learn/${id}`}>
      <div className="group cursor-pointer border border-white/5 rounded-sm overflow-hidden bg-(--af-grey) hover:border-(--af-red)/50 transition-colors h-full">
        {/* Cover image or placeholder */}
        <div className="aspect-video bg-(--af-grey-mid) relative overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={titleEn}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm tracking-wider uppercase text-(--af-grey-light)">
                {typeLabel}
              </span>
            </div>
          )}

          {isComplete && (
            <div className="absolute top-2 right-2 bg-green-500/80 text-white rounded-sm w-6 h-6 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="text-lg font-semibold text-(--af-cream) leading-tight">
            {titleJa}
          </div>
          <div className="text-sm text-(--af-grey-light)">
            {titleEn}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-sm border ${difficultyClass}`}>
              {difficulty.toUpperCase()}
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-sm border border-white/10 text-(--af-grey-light)">
              {typeLabel}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-(--af-grey-light)">
              {durationMinutes} min
            </span>
            {progress && (
              <span className="text-xs text-(--af-grey-light)">
                {progress.score ? `${Math.round(progress.score)}%` : 'Not started'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
