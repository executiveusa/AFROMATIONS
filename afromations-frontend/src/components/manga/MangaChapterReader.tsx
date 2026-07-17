'use client'

import { useEffect, useState } from 'react'
import { ComimiReader } from './ComimiReader'
import type { MangaManifest } from '@/lib/manga/types'

interface ChapterMeta {
  id: string
  title: string
  readingDirection: 'rtl' | 'ltr'
  pageTurnMode: 'single' | 'spread'
}

interface MangaChapterReaderProps {
  seriesSlug: string
  chapterSlug: string
  chapterMeta?: ChapterMeta
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')

export function MangaChapterReader({ seriesSlug, chapterSlug, chapterMeta }: MangaChapterReaderProps) {
  const [manifest, setManifest] = useState<MangaManifest | null>(null)
  const [chapterId, setChapterId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadChapter() {
      try {
        if (!BACKEND_URL) {
          throw new Error('The manga reader API is not configured for this deployment yet.')
        }

        const chRes = await fetch(
          `${BACKEND_URL}/api/hana/manga/series/${encodeURIComponent(seriesSlug)}/chapters/${encodeURIComponent(chapterSlug)}`,
          { signal: controller.signal }
        )
        if (!chRes.ok) {
          const err = await chRes.json().catch(() => ({}))
          throw new Error((err as { error?: string }).error ?? `HTTP ${chRes.status}`)
        }
        const chData = (await chRes.json()) as { chapter: { id: string } }
        const id = chData.chapter.id
        setChapterId(id)

        const mRes = await fetch(`${BACKEND_URL}/api/hana/manga/chapters/${encodeURIComponent(id)}/manifest`, {
          signal: controller.signal,
        })
        if (!mRes.ok) {
          const err = await mRes.json().catch(() => ({}))
          throw new Error((err as { error?: string }).error ?? `HTTP ${mRes.status}`)
        }
        const mData = (await mRes.json()) as MangaManifest
        setManifest(mData)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load chapter')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadChapter()
    return () => controller.abort()
  }, [seriesSlug, chapterSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-black">
        <p className="text-white/30 text-sm tracking-widest uppercase animate-pulse">Loading chapter...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-black px-6">
        <div className="text-center max-w-md">
          <p className="text-white/60 text-lg mb-2">{chapterMeta?.title ?? 'Chapter'}</p>
          <p className="text-white/30 text-sm mb-6">{error}</p>
          {chapterMeta && (
            <div className="border border-white/10 rounded-sm p-6 text-left">
              <p className="text-white/20 text-xs mb-2">Chapter Preview</p>
              <p className="text-white/50 text-sm">
                This chapter is in production. Check back soon or{' '}
                <a href="/apply" className="text-red-400 hover:underline">
                  apply for early access
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!manifest) return null

  return (
    <ComimiReader
      manifest={manifest}
      chapterId={chapterId ?? undefined}
      className="max-w-4xl mx-auto"
    />
  )
}
