import { InnerLayout } from '@/components/inner-layout'
import Link from 'next/link'
import { MangaChapterReader } from '@/components/manga/MangaChapterReader'

// Fallback manifest for SSR-safe static render before API loads
const STATIC_CHAPTERS: Record<string, Record<string, {
  id: string
  title: string
  readingDirection: 'rtl' | 'ltr'
  pageTurnMode: 'single' | 'spread'
}>> = {
  dual: {
    'chapter-1-knock-at-the-door': {
      id: 'dual-chapter-1',
      title: 'DUAL: Chapter 1 — Knock at the Door',
      readingDirection: 'rtl',
      pageTurnMode: 'single',
    },
  },
  'hana-warriors-of-light': {
    'volume-1-warrior-scholar': {
      id: 'hana-vol-1',
      title: 'Hana: Warriors of Light — Volume 1: Warrior Scholar',
      readingDirection: 'rtl',
      pageTurnMode: 'single',
    },
  },
  owpil: {
    'fall-2026-preview': {
      id: 'owpil-preview',
      title: 'O.W.P.I.L — Fall 2026 Preview',
      readingDirection: 'ltr',
      pageTurnMode: 'single',
    },
  },
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ seriesSlug: string; chapterSlug: string }>
}) {
  const { seriesSlug, chapterSlug } = await params
  const chapterMeta = STATIC_CHAPTERS[seriesSlug]?.[chapterSlug]

  return (
    <InnerLayout>
      <main className="min-h-screen bg-black pt-20 pb-16">
        {/* Nav bar */}
        <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-6 flex items-center gap-4">
          <Link
            href={`/manga/${seriesSlug}`}
            className="text-[11px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70"
          >
            ← Series
          </Link>
          {chapterMeta && (
            <>
              <span className="text-white/20">/</span>
              <span className="text-[11px] text-white/40">{chapterMeta.title}</span>
            </>
          )}
        </div>

        {/* Reader */}
        <MangaChapterReader
          seriesSlug={seriesSlug}
          chapterSlug={chapterSlug}
          chapterMeta={chapterMeta}
        />

        {/* Footer note */}
        <div className="px-6 sm:px-12 max-w-7xl mx-auto mt-8 text-center">
          <p className="text-white/20 text-xs">
            AFROMATIONS original content. All rights reserved.{' '}
            <Link href="/manga" className="hover:text-white/40">
              Back to Manga
            </Link>
          </p>
        </div>
      </main>
    </InnerLayout>
  )
}
