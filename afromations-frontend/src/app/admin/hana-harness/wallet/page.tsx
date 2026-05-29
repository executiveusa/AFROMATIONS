'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/utils'

interface LedgerEntry {
  id: string
  entry_type: string
  amount_cents: number
  currency: string
  description: string
  source: string
  status: string
  created_at: string
}

interface LedgerSummary {
  total_revenue_cents: number
  total_payouts_cents: number
  pending_payouts_cents: number
  net_balance_cents: number
  currency: string
}

const ENTRY_TYPE_COLORS: Record<string, string> = {
  revenue: 'text-emerald-400',
  payout: 'text-red-400',
  ad_spend: 'text-yellow-400',
  refund: 'text-blue-400',
}

function cents(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n / 100)
}

export default function WalletPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [summary, setSummary] = useState<LedgerSummary | null>(null)
  const [status, setStatus] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [payoutForm, setPayoutForm] = useState({ amount_cents: '', description: '', destination: '' })
  const [showPayoutForm, setShowPayoutForm] = useState(false)

  const loadLedger = () => {
    fetch(`${API_URL}/hana/wallet/ledger`)
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? [])
        setSummary(d.summary ?? null)
      })
      .catch(() => null)
  }

  useEffect(() => { loadLedger() }, [])

  const requestPayout = async () => {
    const amount = parseInt(payoutForm.amount_cents)
    if (!amount || amount <= 0) { setStatus('Enter a valid amount'); return }
    if (!payoutForm.description.trim()) { setStatus('Enter a description'); return }

    setRequesting(true)
    setStatus('Submitting payout request...')
    try {
      const res = await fetch(`${API_URL}/hana/wallet/request-payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: amount,
          description: payoutForm.description,
          destination: payoutForm.destination || undefined,
        }),
      })
      const d = await res.json()
      if (d.error) {
        setStatus(`❌ ${d.error}`)
      } else {
        setStatus(`✅ Payout request submitted — status: ${d.status}. Requires human approval.`)
        setShowPayoutForm(false)
        setPayoutForm({ amount_cents: '', description: '', destination: '' })
        loadLedger()
      }
    } catch (err) {
      setStatus(`❌ Failed: ${String(err)}`)
    } finally {
      setRequesting(false)
    }
  }

  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center gap-2 text-xs">
        <Link href="/admin/hana-harness" className="text-(--af-red)">Harness</Link>
        <span className="text-(--af-grey-light)">/</span>
        <span>Wallet</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Wallet</h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] rounded px-2 py-1 bg-yellow-500/20 text-yellow-300">Payouts require approval</span>
            <button
              onClick={() => setShowPayoutForm(!showPayoutForm)}
              className="rounded px-4 py-2 bg-(--af-red) text-(--af-cream) text-sm font-semibold hover:opacity-90"
            >
              Request Payout
            </button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Revenue', value: cents(summary.total_revenue_cents, summary.currency), color: 'text-emerald-400' },
              { label: 'Payouts', value: cents(summary.total_payouts_cents, summary.currency), color: 'text-red-400' },
              { label: 'Pending', value: cents(summary.pending_payouts_cents, summary.currency), color: 'text-yellow-400' },
              { label: 'Net Balance', value: cents(summary.net_balance_cents, summary.currency), color: 'text-(--af-cream)' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
                <div className="text-[10px] tracking-wider text-(--af-grey-light) uppercase mb-1">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Payout form */}
        {showPayoutForm && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-5 mb-6">
            <div className="text-xs font-semibold tracking-widest text-(--af-grey-light) uppercase mb-4">New Payout Request</div>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Amount (cents, e.g. 5000 = $50.00)"
                value={payoutForm.amount_cents}
                onChange={(e) => setPayoutForm({ ...payoutForm, amount_cents: e.target.value })}
                className="w-full rounded px-3 py-2 bg-white/10 text-(--af-cream) text-sm border border-white/10 placeholder:text-(--af-grey-light) focus:outline-none"
              />
              <input
                type="text"
                placeholder="Description"
                value={payoutForm.description}
                onChange={(e) => setPayoutForm({ ...payoutForm, description: e.target.value })}
                className="w-full rounded px-3 py-2 bg-white/10 text-(--af-cream) text-sm border border-white/10 placeholder:text-(--af-grey-light) focus:outline-none"
              />
              <input
                type="text"
                placeholder="Destination (optional — bank, PayPal, etc.)"
                value={payoutForm.destination}
                onChange={(e) => setPayoutForm({ ...payoutForm, destination: e.target.value })}
                className="w-full rounded px-3 py-2 bg-white/10 text-(--af-cream) text-sm border border-white/10 placeholder:text-(--af-grey-light) focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={requestPayout}
                  disabled={requesting}
                  className="rounded px-4 py-2 bg-(--af-red) text-(--af-cream) text-sm font-semibold disabled:opacity-50 hover:opacity-90"
                >
                  {requesting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => setShowPayoutForm(false)}
                  className="rounded px-4 py-2 border border-white/10 text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {status && (
          <div className="mb-6 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm">{status}</div>
        )}

        {/* Ledger */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Description</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Type</th>
                <th className="px-4 py-3 text-right text-[10px] tracking-wider text-(--af-grey-light) uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] tracking-wider text-(--af-grey-light) uppercase hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-(--af-grey-light)">No ledger entries yet.</td></tr>
              )}
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="text-sm truncate max-w-xs">{e.description}</div>
                    <div className="text-[10px] text-(--af-grey-light)">{e.source}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase ${ENTRY_TYPE_COLORS[e.entry_type] ?? 'text-(--af-grey-light)'}`}>
                      {e.entry_type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-sm ${ENTRY_TYPE_COLORS[e.entry_type] ?? 'text-(--af-cream)'}`}>
                    {e.entry_type === 'revenue' ? '+' : '-'}{cents(e.amount_cents, e.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] ${
                      e.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      e.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-300' :
                      e.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-white/10 text-(--af-grey-light)'
                    }`}>{e.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-(--af-grey-light) hidden md:table-cell">
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-(--af-grey-light)">
          ⚠️ All payout requests require explicit human authorization before funds move. This is enforced at the API level.
        </div>
      </div>
    </main>
  )
}
