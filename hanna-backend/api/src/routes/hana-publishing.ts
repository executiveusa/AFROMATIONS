import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery, supabasePatch } from '../lib/supabase'
import { testConnection, queuePost, isPostizConfigured, isDryRun, isApprovalMode } from '../lib/publishing/postiz-client'
import { checkPublishingPolicy } from '../lib/qa/publishing-policy'
import { checkRateLimit } from '../lib/guardrails'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  POSTIZ_API_URL: string
  POSTIZ_API_KEY: string
  HANA_PUBLISHING_APPROVAL_MODE: string
  HANA_DRY_RUN_PUBLISHING: string
  HANA_AUTOPUBLISH_ENABLED: string
}

export const hanaPublishingRoutes = new Hono<{ Bindings: Bindings }>()

// ─── Schemas ─────────────────────────────────────────────────────────────────

const queueSchema = z.object({
  generated_content_id: z.string().uuid(),
  platform: z.enum(['twitter', 'instagram', 'tiktok', 'youtube_community', 'linkedin', 'threads']),
  post_text: z.string().min(1).max(5000),
  media_assets: z.array(z.string()).optional(),
  scheduled_for: z.string().datetime().optional(),
})

// ─── POST /publishing/postiz/connect-test ────────────────────────────────────

hanaPublishingRoutes.post('/publishing/postiz/connect-test', async (c) => {
  const env = c.env as unknown as Record<string, string | undefined>
  const result = await testConnection(env)
  return c.json({
    configured: isPostizConfigured(env),
    ...result,
    dryRun: isDryRun(env),
    approvalMode: isApprovalMode(env),
  })
})

// ─── POST /publishing/social-queue ───────────────────────────────────────────

hanaPublishingRoutes.post('/publishing/social-queue', zValidator('json', queueSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const { buildSocialPostPack, formatForPlatform } = await import('../lib/publishing/platform-formatters')
  const formatted = formatForPlatform(body.platform as Parameters<typeof formatForPlatform>[0], body.post_text)

  try {
    const row = await supabaseInsert(c, 'hana_social_queue', {
      generated_content_id: body.generated_content_id,
      platform: body.platform,
      post_text: formatted.text,
      media_assets: body.media_assets ?? [],
      scheduled_for: body.scheduled_for ?? null,
      postiz_payload: {
        platform: body.platform,
        content: formatted.text,
        scheduledFor: body.scheduled_for,
        hashtags: formatted.hashtags,
      },
      approval_status: 'pending',
      publish_status: 'queued',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, queueEntry: row[0] ?? row }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── GET /publishing/social-queue ────────────────────────────────────────────

hanaPublishingRoutes.get('/publishing/social-queue', async (c) => {
  const platform = c.req.query('platform')
  const status = c.req.query('status')
  try {
    const params: Parameters<typeof supabaseQuery>[2] = {
      select: 'id,platform,post_text,approval_status,publish_status,scheduled_for,postiz_job_id,created_at',
      order: 'created_at.desc',
      limit: 50,
    }
    if (platform) params.eq = { platform }
    if (status) params.eq = { ...(params.eq ?? {}), approval_status: status }
    const queue = await supabaseQuery(c, 'hana_social_queue', params)
    return c.json({ queue, total: queue.length })
  } catch {
    return c.json({ queue: [], total: 0 })
  }
})

// ─── POST /publishing/social-queue/:id/approve ───────────────────────────────

hanaPublishingRoutes.post('/publishing/social-queue/:id/approve', async (c) => {
  const id = c.req.param('id')
  try {
    await supabasePatch(c, 'hana_social_queue', {
      approval_status: 'approved',
      updated_at: new Date().toISOString(),
    }, { id })
    return c.json({ success: true, id, approval_status: 'approved' })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /publishing/social-queue/:id/reject ────────────────────────────────

hanaPublishingRoutes.post('/publishing/social-queue/:id/reject', async (c) => {
  const id = c.req.param('id')
  try {
    await supabasePatch(c, 'hana_social_queue', {
      approval_status: 'rejected',
      publish_status: 'cancelled',
      updated_at: new Date().toISOString(),
    }, { id })
    return c.json({ success: true, id, approval_status: 'rejected' })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /publishing/social-queue/:id/publish ───────────────────────────────

hanaPublishingRoutes.post('/publishing/social-queue/:id/publish', async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const id = c.req.param('id')
  const env = c.env as unknown as Record<string, string | undefined>

  try {
    const rows = await supabaseQuery(c, 'hana_social_queue', { eq: { id }, limit: 1 })
    if (!rows.length) return c.json({ error: 'Queue entry not found' }, 404)

    const entry = rows[0] as {
      platform: string; post_text: string; approval_status: string
      postiz_payload: Record<string, unknown>; scheduled_for?: string
    }

    const policy = checkPublishingPolicy(env, {
      action: 'post_social',
      approvalStatus: entry.approval_status,
      platform: entry.platform,
    })

    if (!policy.allowed) {
      return c.json({ allowed: false, reason: policy.reason, riskLevel: policy.riskLevel })
    }

    const postResult = await queuePost(env, {
      platform: entry.platform,
      content: entry.post_text,
      scheduledFor: entry.scheduled_for,
    }, { approvalStatus: entry.approval_status })

    await supabasePatch(c, 'hana_social_queue', {
      publish_status: postResult.success ? 'published' : 'error',
      postiz_job_id: postResult.jobId ?? null,
      error: postResult.error ?? null,
      updated_at: new Date().toISOString(),
    }, { id })

    return c.json({ success: postResult.success, dryRun: postResult.dryRun, jobId: postResult.jobId, error: postResult.error })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /publishing/social-queue/publish-approved ──────────────────────────

hanaPublishingRoutes.post('/publishing/social-queue/publish-approved', async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const env = c.env as unknown as Record<string, string | undefined>

  try {
    const approved = await supabaseQuery(c, 'hana_social_queue', {
      eq: { approval_status: 'approved', publish_status: 'queued' },
      limit: 20,
    })

    const results: { id: string; platform: string; success: boolean; jobId?: string; error?: string }[] = []

    for (const entry of approved as { id: string; platform: string; post_text: string; scheduled_for?: string }[]) {
      const policy = checkPublishingPolicy(env, {
        action: 'post_social',
        approvalStatus: 'approved',
        platform: entry.platform,
      })

      if (!policy.allowed) {
        results.push({ id: entry.id, platform: entry.platform, success: false, error: policy.reason })
        continue
      }

      const postResult = await queuePost(env, {
        platform: entry.platform,
        content: entry.post_text,
        scheduledFor: entry.scheduled_for,
      }, { approvalStatus: 'approved' })

      await supabasePatch(c, 'hana_social_queue', {
        publish_status: postResult.success ? 'published' : 'error',
        postiz_job_id: postResult.jobId ?? null,
        error: postResult.error ?? null,
        updated_at: new Date().toISOString(),
      }, { id: entry.id })

      results.push({
        id: entry.id,
        platform: entry.platform,
        success: postResult.success,
        jobId: postResult.jobId,
        error: postResult.error,
      })
    }

    return c.json({
      processed: results.length,
      succeeded: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})
