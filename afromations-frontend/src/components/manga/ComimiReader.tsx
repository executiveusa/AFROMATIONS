'use client'

import { useEffect, useRef, useState } from 'react'
import type { MangaManifest } from '@/lib/manga/types'

interface ComimiReaderProps {
  manifest?: MangaManifest
  manifestUrl?: string
  chapterId?: string
  learnerId?: string
  locale?: string
  className?: string
}

export function ComimiReader({
  manifest: manifestProp,
  manifestUrl,
  chapterId,
  learnerId,
  locale = 'en',
  className = '',
}: ComimiReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let destroyed = false
    let unsubscribePageChange: (() => void) | undefined

    async function init() {
      try {
        let manifest = manifestProp

        if (!manifest && manifestUrl) {
          const res = await fetch(manifestUrl)
          if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
          manifest = await res.json()
        }

        if (!manifest) throw new Error('No manifest provided')
        if (!containerRef.current) return

        const { createMangaViewer } = await import('@yui540/comimi')

        if (destroyed) return

        const pages = manifest.manga.pages.map((p) => {
          if (p.type === 'html' && p.html) {
            return { id: p.id, type: 'html' as const, html: p.html, label: p.label }
          }
          return {
            id: p.id,
            type: 'image' as const,
            src: p.src ?? '',
            thumbnailSrc: p.thumbnailSrc,
            alt: p.alt,
            label: p.label,
          }
        })

        viewerRef.current = createMangaViewer(containerRef.current, {
          manga: {
            id: manifest.manga.id,
            title: manifest.manga.title,
            author: manifest.manga.author,
            pages,
          },
          settings: {
            layoutMode: manifest.settings.layoutMode ?? 'inline',
            readingDirection: manifest.settings.readingDirection ?? 'rtl',
            hasCover: manifest.settings.hasCover ?? true,
            pageTurnMode: manifest.settings.pageTurnMode ?? 'single',
            backgroundColor: manifest.settings.backgroundColor ?? 'black',
            theme: 'dark',
          },
          locale,
        })

        if (viewerRef.current?.on) {
          unsubscribePageChange = viewerRef.current.on(
            'pageChange',
            async ({ pageIndex }: { pageIndex: number }) => {
              if (!learnerId || !chapterId) return
              try {
                await fetch('/api/hana/manga/progress', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    learnerId,
                    chapterId,
                    currentPageIndex: pageIndex,
                    completed: pageIndex >= pages.length - 1,
                  }),
                })
              } catch {
                // Progress persistence is best-effort and must not break reading.
              }
            }
          )
        }

        if (!destroyed) setLoading(false)
      } catch (err) {
        if (!destroyed) {
          setError(err instanceof Error ? err.message : 'Failed to load reader')
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      destroyed = true
      unsubscribePageChange?.()
      if (viewerRef.current?.destroy) {
        viewerRef.current.destroy()
      }
      viewerRef.current = null
    }
  }, [manifestProp, manifestUrl, chapterId, learnerId, locale])

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-black text-white/60 ${className}`}>
        <div className="text-center p-8">
          <p className="text-lg mb-2">Could not load reader</p>
          <p className="text-sm opacity-60">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white/40 text-sm tracking-widest uppercase animate-pulse">
            Loading...
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full min-h-[600px]" />
    </div>
  )
}
