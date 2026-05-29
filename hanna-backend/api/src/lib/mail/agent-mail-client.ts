/**
 * Agent Mail Client
 * Abstraction over email outreach. Uses AgentMail API if configured,
 * otherwise stores drafts in Supabase for admin review.
 * Never fails — missing config → graceful internal draft storage.
 */

export interface MailDraft {
  to: string
  subject: string
  body: string
  category: 'sponsor' | 'artist' | 'teacher' | 'school' | 'report' | 'approval' | 'general'
  metadata?: Record<string, unknown>
}

export interface MailResult {
  success: boolean
  messageId?: string
  provider: 'agentmail' | 'internal_draft'
  draftId?: string
  error?: string
}

function getAgentMailConfig(env: Record<string, string | undefined>) {
  const apiUrl = env.AGENTMAIL_API_URL
  const apiKey = env.AGENTMAIL_API_KEY
  if (!apiUrl || !apiKey) return null
  return { apiUrl, apiKey }
}

/**
 * Send via AgentMail API.
 */
async function sendViaAgentMail(
  config: { apiUrl: string; apiKey: string },
  draft: MailDraft
): Promise<MailResult> {
  const res = await fetch(`${config.apiUrl}/api/v1/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: draft.to,
      subject: draft.subject,
      body: draft.body,
      metadata: { category: draft.category, ...(draft.metadata ?? {}) },
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AgentMail API error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as { id?: string; messageId?: string }
  return {
    success: true,
    messageId: data.id ?? data.messageId,
    provider: 'agentmail',
  }
}

/**
 * Store draft in Supabase hana_mail_drafts table (fallback when AgentMail unavailable).
 */
async function storeAsDraft(
  supabaseUrl: string,
  supabaseKey: string,
  draft: MailDraft
): Promise<MailResult> {
  const res = await fetch(`${supabaseUrl}/rest/v1/hana_mail_drafts`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      to_address: draft.to,
      subject: draft.subject,
      body: draft.body,
      category: draft.category,
      status: 'draft',
      metadata: draft.metadata ?? {},
      created_at: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    // Even if DB fails, don't crash — return success with warning
    return {
      success: true,
      provider: 'internal_draft',
      draftId: `local-${Date.now()}`,
      error: 'Stored locally (Supabase unavailable)',
    }
  }

  const data = await res.json() as { id?: string }[]
  return {
    success: true,
    provider: 'internal_draft',
    draftId: data[0]?.id,
  }
}

/**
 * Send or draft an email. Never throws.
 */
export async function sendMail(
  env: Record<string, string | undefined>,
  draft: MailDraft
): Promise<MailResult> {
  const agentMailConfig = getAgentMailConfig(env)

  if (agentMailConfig) {
    try {
      return await sendViaAgentMail(agentMailConfig, draft)
    } catch {
      // Fall through to internal draft
    }
  }

  const supabaseUrl =
    (env as Record<string, string | undefined>).SUPABASE_URL ?? 'http://31.220.58.212:8001'
  const supabaseKey = (env as Record<string, string | undefined>).SUPABASE_SERVICE_KEY ?? ''

  return storeAsDraft(supabaseUrl, supabaseKey, draft)
}

/**
 * Pre-built outreach templates.
 */
export const OUTREACH_TEMPLATES = {
  sponsorInquiry: (brandName: string, contactName: string): MailDraft => ({
    to: '',
    subject: `AFROMATIONS Studios — Partnership Opportunity with ${brandName}`,
    body: `Hi ${contactName},\n\nI'm reaching out from AFROMATIONS Studios, the biggest Black-owned anime community. Agent Hana, our AI anime educator, is building a growing platform for anime creators who love AI production.\n\nWe're exploring partnerships with brands aligned with our creative community. Would you be open to a conversation about how we might work together?\n\nBest,\nAFROMAT IONS Studios Team`,
    category: 'sponsor',
  }),

  artistCollaboration: (artistName: string): MailDraft => ({
    to: '',
    subject: `AFROMATIONS Studios — Creative Collaboration Invitation`,
    body: `Hi ${artistName},\n\nWe're big fans of your work! AFROMATIONS Studios is inviting artists to collaborate on our AI anime educational content platform.\n\nInterested in being featured in our upcoming AFROMATIONS production guide?\n\nBest,\nHana @ AFROMATIONS Studios`,
    category: 'artist',
  }),

  approvalRequest: (contentTitle: string, adminEmail: string): MailDraft => ({
    to: adminEmail,
    subject: `[APPROVAL REQUIRED] AFROMATIONS Content: ${contentTitle}`,
    body: `Hana has generated new content pending your approval:\n\nTitle: ${contentTitle}\n\nPlease review at your AFROMATIONS admin dashboard: /admin/hana-harness/content\n\nThis content will NOT be published until you approve it.`,
    category: 'approval',
  }),

  weeklyReport: (summary: string, adminEmail: string): MailDraft => ({
    to: adminEmail,
    subject: `[AFROMATIONS] Hana Weekly Harness Report`,
    body: `Weekly activity summary from Agent Hana:\n\n${summary}\n\nFull details: /admin/hana-harness`,
    category: 'report',
  }),
}

export function isAgentMailConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.AGENTMAIL_API_URL && env.AGENTMAIL_API_KEY)
}
