'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface CronJob {
  id?: string
  job_key: string
  name: string
  schedule: string
  description: string
  enabled: boolean
  last_run_at?: string
  last_status?: string
}

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([])
  const [status, setStatus] = useState('')
  const [running, setRunning] = useState<string | null>(null)

  const loadJobs = () => {
    fetch(`${API_URL}/hana/cron`)
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => null)
  }

  useEffect(() => { loadJobs() }, [])

  const runNow = async (key: string) => {
    setRunning(key)
    setStatus(`Running ${key}...`)
    try {
      const res = await fetch(`${API_URL}/hana/cron/run/${key}`, { method: 'POST' })
      const d = await res.json()
      setStatus(d.error ? `❌ ${d.error}` : `✅ ${key} completed`)
      loadJobs()
    } catch (err) {
      setStatus(`❌ Failed: ${String(err)}`)
    } finally {
      setRunning(null)
    }
  }

  const toggle = async (key: string, enabled: boolean) => {
    setStatus(`${enabled ? 'Disabling' : 'Enabling'} ${key}...`)
    try {
      await fetch(`${API_URL}/hana/cron/toggle/${key}`, { method: 'POST' })
      setStatus(`✅ ${key} ${enabled ? 'disabled' : 'enabled'}`)
      loadJobs()
    } catch (err) {
      setStatus(`❌ Failed: ${String(err)}`)
    }
  }

  const lastRunDisplay = (job: CronJob) => {
    if (!job.last_run_at) return <span className="text-(--af-grey-light)">Never</span>
    const d = new Date(job.last_run_at)
    return (
      <span className="text-(--af-grey-light)">
        {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Cron Jobs</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Cron Jobs</h1>
          <span className="text-[10px] text-(--af-grey-light)">{jobs.length} jobs registered</span>
        </div>

        {status && (
          <div className="mb-6 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm">{status}</div>
        )}

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Job</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase hidden md:table-cell">Schedule</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase hidden lg:table-cell">Last Run</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-(--af-grey-light)">No cron jobs found.</td></tr>
              )}
              {jobs.map((job) => (
                <tr key={job.job_key} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-medium text-xs">{job.name}</div>
                    <div className="text-[10px] text-(--af-grey-light) mt-0.5 truncate max-w-xs">{job.description}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <code className="text-[10px] bg-white/10 rounded px-1.5 py-0.5 text-(--af-grey-light)">{job.schedule}</code>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[10px]">
                    {lastRunDisplay(job)}
                    {job.last_status && (
                      <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] ${
                        job.last_status === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                        job.last_status === 'error' ? 'bg-red-500/20 text-red-300' :
                        'bg-white/10 text-(--af-grey-light)'
                      }`}>{job.last_status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] ${job.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-(--af-grey-light)'}`}>
                      {job.enabled ? 'enabled' : 'disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => runNow(job.job_key)}
                        disabled={running === job.job_key}
                        className="text-[10px] text-(--af-red) hover:underline disabled:opacity-50"
                      >
                        {running === job.job_key ? 'Running...' : 'Run now'}
                      </button>
                      <span className="text-(--af-grey-light)">·</span>
                      <button
                        onClick={() => toggle(job.job_key, job.enabled)}
                        className="text-[10px] text-(--af-grey-light) hover:text-(--af-cream)"
                      >
                        {job.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-(--af-grey-light)">
          Cron jobs run on Cloudflare Workers scheduled triggers. &quot;Run now&quot; triggers the job handler immediately via API.
        </div>
      </div>
    </main>
  )
}
