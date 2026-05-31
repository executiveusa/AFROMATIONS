'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface Video { id: string; video_id: string; title: string; channel_name: string; crawl_status: string; transcript_available: boolean; created_at: string }

export default function ResearchPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [crawling, setCrawling] = useState(false)
  const [status, setStatus] = useState('')

  const loadVideos = () => {
    fetch(`${API_URL}/hana/research/videos?limit=50`)
      .then((r) => r.json())
      .then((d) => setVideos(d.videos ?? []))
      .catch(() => null)
  }

  useEffect(() => { loadVideos() }, [])

  const crawlNobleGoose = async () => {
    setCrawling(true)
    setStatus('Crawling Noble Goose Anime (25 videos)...')
    try {
      const res = await fetch(`${API_URL}/hana/research/noblegoose/latest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 25 }),
      })
      const d = await res.json()
      setStatus(`✅ Found ${d.videosFound ?? 0} videos, stored ${d.videosStored ?? 0} new. Provider: ${d.provider ?? 'unknown'}`)
      loadVideos()
    } catch (err) {
      setStatus(`❌ Crawl failed: ${String(err)}`)
    } finally {
      setCrawling(false)
    }
  }

  const extractConcepts = async (videoId: string) => {
    setStatus(`Extracting concepts for ${videoId}...`)
    try {
      const res = await fetch(`${API_URL}/hana/research/videos/${videoId}/extract-concepts`, { method: 'POST' })
      const d = await res.json()
      setStatus(`✅ Extracted ${d.conceptsExtracted ?? 0} concepts from video`)
      loadVideos()
    } catch (err) {
      setStatus(`❌ Extraction failed: ${String(err)}`)
    }
  }

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Research</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Research Dashboard</h1>

        <div className="flex gap-3 mb-6">
          <button
            onClick={crawlNobleGoose}
            disabled={crawling}
            className="rounded px-4 py-2 bg-(--af-red) text-(--af-cream) text-sm font-semibold disabled:opacity-50 hover:opacity-90"
          >
            {crawling ? 'Crawling...' : '🎌 Crawl Noble Goose (25 videos)'}
          </button>
        </div>

        {status && (
          <div className="mb-6 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm">
            {status}
          </div>
        )}

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Title</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Channel</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-(--af-grey-light)">No videos yet. Click "Crawl Noble Goose" to start.</td></tr>
              )}
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 max-w-xs truncate">{v.title}</td>
                  <td className="px-4 py-3 text-(--af-grey-light)">{v.channel_name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] ${v.crawl_status === 'concepts_extracted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {v.crawl_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {v.crawl_status !== 'concepts_extracted' && (
                      <button
                        onClick={() => extractConcepts(v.id)}
                        className="text-[10px] text-(--af-red) hover:underline"
                      >
                        Extract concepts
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
