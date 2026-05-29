import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { sendMail, OUTREACH_TEMPLATES, isAgentMailConfigured } from '../lib/mail/agent-mail-client'
import { supabaseQuery } from '../lib/supabase'
import { checkRateLimit } from '../lib/guardrails'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  AGENTMAIL_API_URL: string
  AGENTMAIL_API_KEY: string
}

export const hanaMailRoutes = new Hono<{ Bindings: Bindings }>()

const sendSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  category: z.enum(['sponsor', 'artist', 'teacher', 'school', 'report', 'approval', 'general']).default('general'),
  metadata: z.record(z.unknown()).optional(),
})

const outreachSchema = z.object({
  type: z.enum(['sponsor', 'artist', 'approval']),
  name: z.string().min(1),
  email: z.string().email().optional(),
  subject_override: z.string().optional(),
})

// ─── POST /mail/send ─────────────────────────────────────────────────────────

hanaMailRoutes.post('/mail/send', zValidator('json', sendSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const result = await sendMail(env, {
    to: body.to,
    subject: body.subject,
    body: body.body,
    category: body.category,
    metadata: body.metadata,
  })

  return c.json({
    success: result.success,
    provider: result.provider,
    messageId: result.messageId,
    draftId: result.draftId,
    note: result.provider === 'internal_draft'
      ? 'AgentMail not configured — email stored as draft in admin dashboard.'
      : undefined,
    error: result.error,
  })
})

// ─── GET /mail/inbox ─────────────────────────────────────────────────────────

hanaMailRoutes.get('/mail/inbox', async (c) => {
  try {
    const drafts = await supabaseQuery(c, 'hana_mail_drafts', {
      select: 'id,to_address,subject,category,status,created_at',
      order: 'created_at.desc',
      limit: 50,
    })
    return c.json({ drafts, total: drafts.length, note: 'Showing internal draft queue' })
  } catch {
    return c.json({ drafts: [], total: 0, note: 'Connect Supabase to view mail drafts' })
  }
})

// ─── POST /mail/draft-outreach ────────────────────────────────────────────────

hanaMailRoutes.post('/mail/draft-outreach', zValidator('json', outreachSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const { type, name, email } = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  let draft = type === 'sponsor'
    ? OUTREACH_TEMPLATES.sponsorInquiry(name, name)
    : type === 'artist'
    ? OUTREACH_TEMPLATES.artistCollaboration(name)
    : OUTREACH_TEMPLATES.approvalRequest(name, email ?? 'admin@afromations.studio')

  if (email) draft = { ...draft, to: email }

  const result = await sendMail(env, draft)

  return c.json({
    success: result.success,
    template: type,
    recipient: name,
    provider: result.provider,
    draftId: result.draftId,
    configured: isAgentMailConfigured(env),
  })
})
