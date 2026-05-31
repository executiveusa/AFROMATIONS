import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery } from '../lib/supabase'
import { validateWalletOperation } from '../lib/qa/publishing-policy'
import { checkRateLimit } from '../lib/guardrails'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

export const hanaWalletRoutes = new Hono<{ Bindings: Bindings }>()

const recordSchema = z.object({
  ledger_type: z.enum(['revenue', 'sponsorship', 'donation', 'merch', 'payout', 'refund', 'adjustment']),
  amount: z.number(),
  currency: z.string().default('USD'),
  source: z.string().optional(),
  description: z.string().optional(),
  external_reference: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

const payoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  destination: z.string().min(1),
  reason: z.string().min(1),
  reference: z.string().optional(),
})

// ─── GET /wallet/ledger ───────────────────────────────────────────────────────

hanaWalletRoutes.get('/wallet/ledger', async (c) => {
  try {
    const entries = await supabaseQuery(c, 'hana_wallet_ledger', {
      select: 'id,ledger_type,amount,currency,source,description,status,created_at',
      order: 'created_at.desc',
      limit: 100,
    })

    const revenue = (entries as { ledger_type: string; amount: number }[])
      .filter((e) => ['revenue', 'sponsorship', 'donation', 'merch'].includes(e.ledger_type))
      .reduce((sum, e) => sum + e.amount, 0)

    const pending = (entries as { status: string; amount: number; ledger_type: string }[])
      .filter((e) => (e.status === 'pending' || e.status === 'pending_approval') && e.ledger_type === 'payout')
      .reduce((sum, e) => sum + e.amount, 0)

    return c.json({
      entries,
      total: entries.length,
      summary: {
        totalRevenue: revenue,
        pendingPayouts: pending,
        currency: 'USD',
        note: 'Hana can track revenue and sponsorship activity, but external money movement requires approval.',
      },
    })
  } catch {
    return c.json({ entries: [], total: 0, summary: { note: 'Connect Supabase to view ledger' } })
  }
})

// ─── POST /wallet/record ──────────────────────────────────────────────────────

hanaWalletRoutes.post('/wallet/record', zValidator('json', recordSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')
  const policy = validateWalletOperation(body.ledger_type, body.amount)

  try {
    const row = await supabaseInsert(c, 'hana_wallet_ledger', {
      ledger_type: body.ledger_type,
      amount: body.amount,
      currency: body.currency,
      source: body.source ?? null,
      description: body.description ?? null,
      status: policy.requiresApproval ? 'pending_approval' : 'recorded',
      external_reference: body.external_reference ?? null,
      metadata: body.metadata ?? {},
      created_at: new Date().toISOString(),
    })

    return c.json({
      success: true,
      entry: row[0] ?? row,
      policy: {
        allowed: policy.allowed,
        requiresApproval: policy.requiresApproval,
        note: policy.reason,
      },
    }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /wallet/request-payout ──────────────────────────────────────────────

hanaWalletRoutes.post('/wallet/request-payout', zValidator('json', payoutSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')

  // Payout requests ALWAYS require human approval — non-negotiable
  try {
    const row = await supabaseInsert(c, 'hana_wallet_ledger', {
      ledger_type: 'payout',
      amount: body.amount,
      currency: body.currency,
      source: body.destination,
      description: body.reason,
      status: 'pending_approval',
      external_reference: body.reference ?? null,
      metadata: {
        destination: body.destination,
        reason: body.reason,
        requestedAt: new Date().toISOString(),
        safetyNote: 'This payout is PENDING and will not execute until explicitly approved by a human operator.',
      },
      created_at: new Date().toISOString(),
    })

    return c.json({
      success: true,
      status: 'pending_approval',
      entry: row[0] ?? row,
      message: 'Payout request recorded as PENDING. No funds will move until a human operator approves this request in the admin dashboard.',
      approvalUrl: '/admin/hana-harness/wallet',
    }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})
