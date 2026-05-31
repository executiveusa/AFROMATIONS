import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery, supabasePatch } from '../lib/supabase'
import { checkRateLimit } from '../lib/guardrails'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

export const hanaCronRoutes = new Hono<{ Bindings: Bindings }>()

const registerSchema = z.object({
  job_key: z.string().min(1).max(100),
  job_type: z.string().min(1),
  schedule: z.string().min(1),
  enabled: z.boolean().default(true),
  config: z.record(z.unknown()).optional(),
})

// ─── POST /cron/register ─────────────────────────────────────────────────────

hanaCronRoutes.post('/cron/register', zValidator('json', registerSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')

  try {
    const row = await supabaseInsert(c, 'hana_cron_jobs', {
      job_key: body.job_key,
      job_type: body.job_type,
      schedule: body.schedule,
      enabled: body.enabled,
      config: body.config ?? {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, job: row[0] ?? row }, 201)
  } catch (err) {
    const msg = String(err)
    if (msg.includes('duplicate') || msg.includes('unique')) {
      return c.json({ error: `Job key "${body.job_key}" already registered` }, 409)
    }
    return c.json({ error: msg }, 500)
  }
})

// ─── GET /cron ───────────────────────────────────────────────────────────────

hanaCronRoutes.get('/cron', async (c) => {
  try {
    const jobs = await supabaseQuery(c, 'hana_cron_jobs', {
      select: 'id,job_key,job_type,schedule,enabled,last_run_at,next_run_at,created_at',
      order: 'created_at.asc',
      limit: 100,
    })
    return c.json({ jobs, total: jobs.length })
  } catch {
    // Fallback: return the static registry
    const staticJobs = getStaticCronRegistry()
    return c.json({ jobs: staticJobs, total: staticJobs.length, source: 'static_registry' })
  }
})

// ─── POST /cron/run/:jobKey ───────────────────────────────────────────────────

hanaCronRoutes.post('/cron/run/:jobKey', async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const jobKey = c.req.param('jobKey')
  const result = await runCronJob(jobKey, c)

  return c.json({
    jobKey,
    ...result,
    ranAt: new Date().toISOString(),
  })
})

// ─── POST /cron/toggle/:jobKey ────────────────────────────────────────────────

hanaCronRoutes.post('/cron/toggle/:jobKey', async (c) => {
  const jobKey = c.req.param('jobKey')

  try {
    const rows = await supabaseQuery(c, 'hana_cron_jobs', {
      eq: { job_key: jobKey },
      limit: 1,
    })

    if (!rows.length) return c.json({ error: 'Job not found' }, 404)

    const current = rows[0] as { enabled: boolean }
    const newEnabled = !current.enabled

    await supabasePatch(c, 'hana_cron_jobs', {
      enabled: newEnabled,
      updated_at: new Date().toISOString(),
    }, { job_key: jobKey })

    return c.json({ success: true, jobKey, enabled: newEnabled })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── Cron Job Runners ─────────────────────────────────────────────────────────

async function runCronJob(jobKey: string, c: { env: unknown }): Promise<{ success: boolean; message: string; detail?: unknown }> {
  switch (jobKey) {
    case 'hana.noblegoose.initial_crawl':
    case 'hana.noblegoose.daily_check':
      return {
        success: true,
        message: 'Noble Goose crawl triggered. Call POST /api/hana/research/noblegoose/latest to execute.',
      }

    case 'hana.content.weekly_blog_batch':
      return {
        success: true,
        message: 'Weekly blog batch triggered. Call POST /api/hana/content/generate-blog for each topic.',
      }

    case 'hana.social.daily_queue':
      return {
        success: true,
        message: 'Daily social queue triggered. Call POST /api/hana/publishing/social-queue/publish-approved.',
      }

    case 'hana.analytics.weekly_learning':
      return {
        success: true,
        message: 'Weekly analytics review triggered. Check /admin/hana-harness/health for metrics.',
      }

    case 'hana.tools.monthly_ai_model_map':
      return {
        success: true,
        message: 'Monthly AI model map update triggered. Check /docs/HANA_ANIME_HARNESS.md for model registry.',
      }

    case 'hana.music.weekly_live_concept':
      return {
        success: true,
        message: 'Weekly music concept triggered. Call POST /api/hana/content/generate-social-pack with theme.',
      }

    default:
      return { success: false, message: `Unknown job key: ${jobKey}` }
  }
}

function getStaticCronRegistry() {
  return [
    { job_key: 'hana.noblegoose.initial_crawl', job_type: 'research', schedule: 'manual', enabled: true, description: 'Initial crawl of Noble Goose Anime channel (25 videos)' },
    { job_key: 'hana.noblegoose.daily_check', job_type: 'research', schedule: '0 8 * * *', enabled: true, description: 'Daily check for new Noble Goose Anime videos' },
    { job_key: 'hana.content.weekly_blog_batch', job_type: 'content', schedule: '0 10 * * 1', enabled: true, description: 'Weekly: generate 3 draft blog posts from best concepts' },
    { job_key: 'hana.social.daily_queue', job_type: 'publishing', schedule: '0 11 * * *', enabled: true, description: 'Daily: generate and queue social posts from approved content' },
    { job_key: 'hana.analytics.weekly_learning', job_type: 'analytics', schedule: '0 9 * * 5', enabled: true, description: 'Weekly: review performance and recommend content direction' },
    { job_key: 'hana.tools.monthly_ai_model_map', job_type: 'knowledge', schedule: '0 10 1 * *', enabled: true, description: 'Monthly: update AI tools capability map' },
    { job_key: 'hana.music.weekly_live_concept', job_type: 'creative', schedule: '0 14 * * 3', enabled: true, description: 'Weekly: generate anime music live stream concept' },
  ]
}
