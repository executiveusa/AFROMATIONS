'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface QueueEntry {
  id: string
  platform: string
  post_text: string
  approval_status: string
  publish_status: string
  scheduled_for?: string
  postiz_job_id?: string
  created_at: string
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'text-sky-400',
  instagram: 'text-pink-400',
  linkedin: 'text-blue-400',
  tiktok: 'text-violet-400',
  threads: 'text-emerald-400',
  youtube_community: 'text-red-400',
}

export default function SocialQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [postizConnected, setPostizConnected] = useState<boolean | null>(null)
  const [dryRun, setDryRun] = useState(true)
  const [status, setStatus] = useState('')

  const loadQueue = () => {
    fetch(`${API_URL}/hana/publishing/social-queue`)
      .then((r) => r.json())
      .then((d) => setQueue(d.queue ?? []))
  }

  const testPostiz = () => {
    fetch(`${API_URL}/hana/publishing/postiz/connect-test`, { method: 'POST' })
      .then((r) => r.json())
      .then((d) => {
        setPostizConnected(d.connected)
        setDryRun(d.dryRun)
      })
  }

  useEffect(() => {
    loadQueue()
    testPostiz()
  }, [])

  const approve = async (id: string) => {
    await fetch(`${API_URL}/hana/publishing/social-queue/${id}/approve`, { method: 'POST' })
    setStatus('✅ Post approved')
    loadQueue()
  }

  const reject = async (id: string) => {
    await fetch(`${API_URL}/hana/publishing/social-queue/${id}/reject`, { method: 'POST' })
    setStatus('❌ Post rejected')
    loadQueue()
  }

  const publishApproved = async () => {
    setStatus('Publishing all approved posts...')
    const res = await fetch(`${API_URL}/hana/publishing/social-queue/publish-approved`, { method: 'POST' })
    const d = await res.json()
    setStatus(`✅ Published ${d.succeeded}/${d.processed} posts`)
    loadQueue()
  }

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Social Queue</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Social Queue</h1>
          <div className="flex items-center gap-3">
            {dryRun && <span className="rounded px-2 py-1 bg-yellow-500/20 text-yellow-300 text-[10px]">DRY-RUN</span>}
            {postizConnected !== null && (
              <span className={`rounded px-2 py-1 text-[10px] ${postizConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                Postiz {postizConnected ? '● Connected' : '○ Not connected'}
              </span>
            )}
            <button
              onClick={publishApproved}
              className="rounded px-4 py-2 bg-(--af-red) text-(--af-cream) text-sm font-semibold hover:opacity-90"
            >
              Publish Approved
            </button>
          </div>
        </div>

        {status && <div className="mb-4 text-sm text-(--af-grey-light)">{status}</div>}

        <div className="space-y-3">
          {queue.length === 0 && (
            <div className="text-center py-12 text-(--af-grey-light) text-sm">
              Queue is empty. Generate social content from the Content dashboard.
            </div>
          )}
          {queue.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase ${PLATFORM_COLORS[entry.platform] ?? 'text-(--af-grey-light)'}`}>
                      {entry.platform}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] ${
                      entry.approval_status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      entry.approval_status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>{entry.approval_status}</span>
                    <span className="rounded px-2 py-0.5 text-[10px] bg-white/10 text-(--af-grey-light)">{entry.publish_status}</span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3">{entry.post_text}</p>
                </div>
                {entry.approval_status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => approve(entry.id)} className="rounded px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/30">Approve</button>
                    <button onClick={() => reject(entry.id)} className="rounded px-3 py-1 bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
