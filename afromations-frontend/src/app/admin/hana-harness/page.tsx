'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/utils'

interface HarnessHealth {
  status: string
  readiness: string
  integrations: Record<string, { configured: boolean; note: string }>
  policy: { approval_mode: boolean; dry_run_publishing: boolean; autopublish_enabled: boolean }
}

const SECTIONS = [
  { href: '/admin/hana-harness/research', label: '🔬 Research', desc: 'Crawl YouTube channels, extract concepts' },
  { href: '/admin/hana-harness/content', label: '✍️ Content', desc: 'Generate blogs, scripts, social packs' },
  { href: '/admin/hana-harness/social-queue', label: '📱 Social Queue', desc: 'Approve and publish social posts' },
  { href: '/admin/hana-harness/cron', label: '⏰ Cron Jobs', desc: 'Manage scheduled tasks' },
  { href: '/admin/hana-harness/health', label: '🩺 Health', desc: 'Integration status and config' },
  { href: '/admin/hana-harness/wallet', label: '💰 Wallet', desc: 'Revenue tracking and payout requests' },
]

export default function HanaHarnessPage() {
  const [health, setHealth] = useState<HarnessHealth | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/hana/harness/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => null)
  }, [])

  const configuredCount = health
    ? Object.values(health.integrations).filter((i) => i.configured).length
    : 0

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-xs text-(--af-red) font-bold tracking-widest">AFROMATIONS</Link>
        <span className="text-(--af-grey-light) text-xs">/</span>
        <span className="text-xs text-(--af-cream)">Hana Harness</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-2 text-[10px] tracking-[0.4em] text-(--af-red) uppercase">Admin</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
          Hana Anime Harness
        </h1>
        <p className="mt-2 text-sm text-(--af-grey-light)">
          AFROMATIONS AI studio operator — research, generate, and distribute anime content.
        </p>

        {health && (
          <div className="mt-6 flex items-center gap-6 rounded-lg border border-white/10 bg-white/5 px-6 py-4">
            <div>
              <div className="text-[10px] tracking-wider text-(--af-grey-light) uppercase">Status</div>
              <div className="mt-1 text-sm font-semibold text-emerald-400">{health.status}</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-(--af-grey-light) uppercase">Readiness</div>
              <div className="mt-1 text-sm font-semibold">{health.readiness}</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-(--af-grey-light) uppercase">Mode</div>
              <div className="mt-1 text-xs">
                {health.policy.dry_run_publishing && (
                  <span className="mr-2 rounded px-2 py-0.5 bg-yellow-500/20 text-yellow-300">DRY-RUN</span>
                )}
                {health.policy.approval_mode && (
                  <span className="rounded px-2 py-0.5 bg-blue-500/20 text-blue-300">APPROVAL MODE</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:border-(--af-red)/40 hover:bg-white/10"
            >
              <div className="text-lg font-semibold group-hover:text-(--af-red) transition-colors">{s.label}</div>
              <div className="mt-2 text-sm text-(--af-grey-light)">{s.desc}</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-xs text-(--af-grey-light) border-t border-white/5 pt-6">
          ⚠️ Publishing requires approval. Money movement requires human authorization. Dry-run mode active by default.
        </div>
      </div>
    </main>
  )
}
