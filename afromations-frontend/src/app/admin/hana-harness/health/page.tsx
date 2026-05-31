'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface Integration {
  configured: boolean
  note: string
}

interface HarnessHealth {
  status: string
  readiness: string
  readinessPercent: number
  integrations: Record<string, Integration>
  policy: {
    approval_mode: boolean
    dry_run_publishing: boolean
    autopublish_enabled: boolean
  }
  db: {
    connected: boolean
    tables: string[]
  }
}

const INTEGRATION_LABELS: Record<string, string> = {
  gemini: 'Gemini AI',
  huggingface: 'HuggingFace',
  postiz: 'Postiz',
  firecrawl: 'Firecrawl',
  bright_data: 'Bright Data',
  agentmail: 'AgentMail',
  youtube_data: 'YouTube Data API',
}

export default function HealthPage() {
  const [health, setHealth] = useState<HarnessHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshed, setRefreshed] = useState<Date | null>(null)

  const load = () => {
    setLoading(true)
    fetch(`${API_URL}/hana/harness/health`)
      .then((r) => r.json())
      .then((d) => {
        setHealth(d)
        setRefreshed(new Date())
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const IntegrationRow = ({ key: k, name, data }: { key: string; name: string; data: Integration }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-[10px] text-(--af-grey-light) mt-0.5">{data.note}</div>
      </div>
      <span className={`rounded px-2 py-0.5 text-[10px] shrink-0 ${data.configured ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
        {data.configured ? '● Configured' : '○ Not set'}
      </span>
    </div>
  )

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Health</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>System Health</h1>
          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-(--af-red) hover:underline disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {refreshed && (
          <div className="text-[10px] text-(--af-grey-light) mb-6">
            Last checked: {refreshed.toLocaleTimeString()}
          </div>
        )}

        {health && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: health.status, color: health.status === 'ok' ? 'text-emerald-400' : 'text-red-400' },
                { label: 'Readiness', value: health.readiness, color: 'text-(--af-cream)' },
                { label: 'DB', value: health.db?.connected ? 'Connected' : 'Disconnected', color: health.db?.connected ? 'text-emerald-400' : 'text-red-400' },
                { label: 'Integrations', value: `${Object.values(health.integrations).filter(i => i.configured).length}/${Object.keys(health.integrations).length}`, color: 'text-(--af-cream)' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[10px] tracking-wider text-(--af-grey-light) uppercase mb-1">{stat.label}</div>
                  <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Policy */}
            <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
              <div className="text-xs font-semibold tracking-widest text-(--af-grey-light) uppercase mb-4">Publishing Policy</div>
              <div className="space-y-2">
                {[
                  { label: 'Approval Mode', active: health.policy.approval_mode, desc: 'All posts require human approval before publishing' },
                  { label: 'Dry-Run Publishing', active: health.policy.dry_run_publishing, desc: 'Posts are queued but not sent to social platforms' },
                  { label: 'Autopublish', active: health.policy.autopublish_enabled, desc: 'Auto-publish approved posts (disabled by default)' },
                ].map((p) => (
                  <div key={p.label} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm">{p.label}</span>
                      <span className="ml-2 text-[10px] text-(--af-grey-light)">{p.desc}</span>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[10px] ${p.active ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-(--af-grey-light)'}`}>
                      {p.active ? 'ON' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
              <div className="text-xs font-semibold tracking-widest text-(--af-grey-light) uppercase mb-4">Integrations</div>
              {Object.entries(health.integrations).map(([key, data]) => (
                <IntegrationRow key={key} name={INTEGRATION_LABELS[key] ?? key} data={data} />
              ))}
            </div>

            {/* DB Tables */}
            {health.db?.tables && health.db.tables.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
                <div className="text-xs font-semibold tracking-widest text-(--af-grey-light) uppercase mb-4">
                  Database Tables ({health.db.tables.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {health.db.tables.map((t) => (
                    <span key={t} className="rounded px-2 py-0.5 text-[10px] bg-white/10 text-(--af-grey-light)">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!health && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-6 py-8 text-center">
            <div className="text-red-300 text-sm">Could not reach harness health endpoint.</div>
            <div className="text-[10px] text-(--af-grey-light) mt-2">Check that the API is running and NEXT_PUBLIC_API_URL is set correctly.</div>
          </div>
        )}
      </div>
    </main>
  )
}
