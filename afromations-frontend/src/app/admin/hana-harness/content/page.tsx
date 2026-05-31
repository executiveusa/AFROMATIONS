'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface Brief {
  id: string
  title: string
  content_type: string
  status: string
  target_platforms: string[]
  created_at: string
}

interface GeneratedContent {
  id: string
  content_type: string
  title: string
  qa_score?: number
  qa_passed?: boolean
  approval_status: string
  created_at: string
}

const CONTENT_TYPES = ['blog_post', 'youtube_script', 'shorts_script', 'social_pack']

export default function ContentPage() {
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [generated, setGenerated] = useState<GeneratedContent[]>([])
  const [status, setStatus] = useState('')
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'briefs' | 'generated'>('generated')

  const [genForm, setGenForm] = useState({
    type: 'blog_post',
    topic: '',
    platform: 'youtube',
  })

  const loadData = () => {
    fetch(`${API_URL}/hana/content/briefs`)
      .then((r) => r.json())
      .then((d) => setBriefs(d.briefs ?? []))
      .catch(() => null)

    fetch(`${API_URL}/hana/content/generated`)
      .then((r) => r.json())
      .then((d) => setGenerated(d.content ?? []))
      .catch(() => null)
  }

  useEffect(() => { loadData() }, [])

  const generate = async () => {
    if (!genForm.topic.trim()) { setStatus('Enter a topic first'); return }
    setGenerating(true)
    setStatus(`Generating ${genForm.type}...`)
    try {
      const endpointMap: Record<string, string> = {
        blog_post: 'generate-blog',
        youtube_script: 'generate-youtube-script',
        shorts_script: 'generate-shorts-pack',
        social_pack: 'generate-social-pack',
      }
      const endpoint = endpointMap[genForm.type] ?? 'generate-blog'
      const res = await fetch(`${API_URL}/hana/content/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genForm.topic, platforms: [genForm.platform] }),
      })
      const d = await res.json()
      if (d.error) {
        setStatus(`❌ ${d.error}`)
      } else {
        setStatus(`✅ Generated: "${d.title ?? genForm.type}" — QA score: ${d.qaScore ?? 'n/a'}`)
        setActiveTab('generated')
        loadData()
      }
    } catch (err) {
      setStatus(`❌ Failed: ${String(err)}`)
    } finally {
      setGenerating(false)
    }
  }

  const runOriginalityCheck = async (id: string) => {
    setStatus(`Running originality check...`)
    try {
      const res = await fetch(`${API_URL}/hana/content/${id}/originality-check`, { method: 'POST' })
      const d = await res.json()
      setStatus(`✅ Originality score: ${d.score ?? 'n/a'} (${d.grade ?? ''})`)
      loadData()
    } catch (err) {
      setStatus(`❌ Check failed: ${String(err)}`)
    }
  }

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Content</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Content Dashboard</h1>

        {/* Generator Panel */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-5 mb-8">
          <div className="text-xs font-semibold tracking-widest text-(--af-grey-light) uppercase mb-4">Generate Content</div>
          <div className="flex flex-wrap gap-3">
            <select
              value={genForm.type}
              onChange={(e) => setGenForm({ ...genForm, type: e.target.value })}
              className="rounded px-3 py-2 bg-white/10 text-(--af-cream) text-sm border border-white/10 focus:outline-none"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-neutral-900">{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Topic or concept..."
              value={genForm.topic}
              onChange={(e) => setGenForm({ ...genForm, topic: e.target.value })}
              className="flex-1 min-w-[200px] rounded px-3 py-2 bg-white/10 text-(--af-cream) text-sm border border-white/10 placeholder:text-(--af-grey-light) focus:outline-none"
            />
            <button
              onClick={generate}
              disabled={generating}
              className="rounded px-4 py-2 bg-(--af-red) text-(--af-cream) text-sm font-semibold disabled:opacity-50 hover:opacity-90 shrink-0"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-6 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm">{status}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-white/10">
          {(['generated', 'briefs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm capitalize transition-colors ${activeTab === tab ? 'text-(--af-cream) border-b-2 border-(--af-red)' : 'text-(--af-grey-light) hover:text-(--af-cream)'}`}
            >
              {tab === 'generated' ? `Generated (${generated.length})` : `Briefs (${briefs.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'generated' && (
          <div className="space-y-3">
            {generated.length === 0 && (
              <div className="text-center py-12 text-(--af-grey-light) text-sm">
                No content yet. Use the generator above.
              </div>
            )}
            {generated.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase text-(--af-grey-light)">{item.content_type}</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] ${
                        item.approval_status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                        item.approval_status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>{item.approval_status}</span>
                      {item.qa_score !== undefined && (
                        <span className={`rounded px-2 py-0.5 text-[10px] ${item.qa_passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          QA {item.qa_score}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-[10px] text-(--af-grey-light) mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => runOriginalityCheck(item.id)}
                    className="text-[10px] text-(--af-red) hover:underline shrink-0"
                  >
                    Check originality
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'briefs' && (
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {briefs.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-(--af-grey-light)">No briefs yet.</td></tr>
                )}
                {briefs.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 max-w-xs truncate">{b.title}</td>
                    <td className="px-4 py-3 text-(--af-grey-light) text-[10px]">{b.content_type}</td>
                    <td className="px-4 py-3">
                      <span className="rounded px-2 py-0.5 text-[10px] bg-white/10 text-(--af-grey-light)">{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
