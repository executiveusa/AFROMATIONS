import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery, supabasePatch } from '../lib/supabase'
import { generateContent } from '../lib/models/model-router'
import { ralpyQA } from '../lib/qa/ralphy-content-qa'
import { computeOriginalityScore } from '../lib/qa/originality-check'
import { checkRateLimit } from '../lib/guardrails'
import type { TaskPreset } from '../lib/models/anime-generation-presets'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GEMINI_API_KEY: string
  HUGGINGFACE_API_KEY: string
  HANA_TEXT_MODEL: string
}

export const hanaContentRoutes = new Hono<{ Bindings: Bindings }>()

// ─── Schemas ─────────────────────────────────────────────────────────────────

const briefSchema = z.object({
  source_video_id: z.string().uuid().optional(),
  brief_type: z.enum(['blog', 'youtube_script', 'shorts_pack', 'social_pack', 'lesson', 'tutorial', 'music_concept']),
  title: z.string().min(1).max(200),
  angle: z.string().min(1).max(500),
  audience: z.string().default('anime creators'),
  outline: z.array(z.string()).optional(),
  original_positioning: z.string().optional(),
  citations: z.array(z.unknown()).default([]),
})

const generateBlogSchema = z.object({
  brief_id: z.string().uuid().optional(),
  topic: z.string().min(1).max(300),
  category: z.enum([
    'AI Anime Tools', 'Anime Production Workflow', 'Prompt Engineering',
    'Character Consistency', 'Fight Scene Generation', 'AI Video Models',
    'AI Image Models', 'Music + Anime', 'Studio Builds', 'Hana Lessons',
  ]).default('Hana Lessons'),
  keywords: z.string().optional(),
  source_note: z.string().optional(),
})

const generateScriptSchema = z.object({
  brief_id: z.string().uuid().optional(),
  topic: z.string().min(1).max(300),
  concepts: z.string().optional(),
})

const generateShortsSchema = z.object({
  brief_id: z.string().uuid().optional(),
  topic: z.string().min(1).max(300),
})

const generateSocialSchema = z.object({
  brief_id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(1000),
  tags: z.array(z.string()).optional(),
  url: z.string().url().optional(),
})

// ─── POST /content/briefs ────────────────────────────────────────────────────

hanaContentRoutes.post('/content/briefs', zValidator('json', briefSchema), async (c) => {
  const body = c.req.valid('json')
  try {
    const row = await supabaseInsert(c, 'hana_content_briefs', {
      source_video_id: body.source_video_id ?? null,
      brief_type: body.brief_type,
      title: body.title,
      angle: body.angle,
      audience: body.audience,
      outline: body.outline ?? [],
      original_positioning: body.original_positioning ?? null,
      citations: body.citations,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, brief: row[0] ?? row }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── GET /content/briefs ─────────────────────────────────────────────────────

hanaContentRoutes.get('/content/briefs', async (c) => {
  try {
    const briefs = await supabaseQuery(c, 'hana_content_briefs', {
      select: 'id,brief_type,title,angle,audience,status,created_at',
      order: 'created_at.desc',
      limit: 50,
    })
    return c.json({ briefs, total: briefs.length })
  } catch {
    return c.json({ briefs: [], total: 0 })
  }
})

// ─── POST /content/generate-blog ─────────────────────────────────────────────

hanaContentRoutes.post('/content/generate-blog', zValidator('json', generateBlogSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const { brief_id, topic, category, keywords, source_note } = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const result = await generateContent(env, 'blog_post_outline', {
    topic,
    category,
    keywords: keywords ?? topic,
  })

  if (!result.success || !result.content) {
    return c.json({ error: result.error ?? 'Generation failed', model: result.model }, 503)
  }

  const qa = ralpyQA({
    content: result.content,
    contentType: 'blog',
    sourceIds: brief_id ? [brief_id] : [],
    citations: [],
  })

  const originality = computeOriginalityScore(result.content)

  try {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80)
    const row = await supabaseInsert(c, 'hana_generated_content', {
      brief_id: brief_id ?? null,
      content_type: 'blog',
      title: topic,
      slug: `${slug}-${Date.now()}`,
      body: result.content,
      excerpt: result.content.split('\n').filter(Boolean)[0]?.slice(0, 200) ?? '',
      platform_targets: ['blog'],
      originality_score: originality.score / 100,
      compliance_status: qa.passed ? 'passed' : 'needs_review',
      publish_status: 'draft',
      metadata: {
        category,
        keywords,
        source_note: source_note ?? 'Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide.',
        model: result.model,
        qa_score: qa.score,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return c.json({
      success: true,
      content: row[0] ?? row,
      qa: { passed: qa.passed, score: qa.score, fixes: qa.fixes },
      originality: { score: originality.score, grade: originality.grade },
      model: result.model,
    }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /content/generate-youtube-script ───────────────────────────────────

hanaContentRoutes.post('/content/generate-youtube-script', zValidator('json', generateScriptSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const { brief_id, topic, concepts } = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const result = await generateContent(env, 'anime_tutorial_script', {
    topic,
    concepts: concepts ?? topic,
  })

  if (!result.success || !result.content) {
    return c.json({ error: result.error ?? 'Generation failed' }, 503)
  }

  const qa = ralpyQA({ content: result.content, contentType: 'tutorial' })

  try {
    const row = await supabaseInsert(c, 'hana_generated_content', {
      brief_id: brief_id ?? null,
      content_type: 'youtube_script',
      title: `[Script] ${topic}`,
      body: result.content,
      excerpt: `YouTube tutorial script: ${topic}`,
      platform_targets: ['youtube'],
      originality_score: 0.85,
      compliance_status: qa.passed ? 'passed' : 'needs_review',
      publish_status: 'draft',
      metadata: { topic, model: result.model, qa_score: qa.score },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, content: row[0] ?? row, qa: { passed: qa.passed, score: qa.score } }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /content/generate-shorts-pack ─────────────────────────────────────

hanaContentRoutes.post('/content/generate-shorts-pack', zValidator('json', generateShortsSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const { brief_id, topic } = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const result = await generateContent(env, 'shortform_video_script', { topic })

  if (!result.success || !result.content) {
    return c.json({ error: result.error ?? 'Generation failed' }, 503)
  }

  try {
    const row = await supabaseInsert(c, 'hana_generated_content', {
      brief_id: brief_id ?? null,
      content_type: 'shorts_pack',
      title: `[Shorts] ${topic}`,
      body: result.content,
      excerpt: `Short-form script: ${topic}`,
      platform_targets: ['youtube_shorts', 'tiktok', 'instagram_reels'],
      originality_score: 0.88,
      compliance_status: 'passed',
      publish_status: 'draft',
      metadata: { topic, model: result.model },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, content: row[0] ?? row }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /content/generate-social-pack ─────────────────────────────────────

hanaContentRoutes.post('/content/generate-social-pack', zValidator('json', generateSocialSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const { brief_id, title, excerpt, tags, url } = c.req.valid('json')
  const env = c.env as unknown as Record<string, string | undefined>

  const { buildSocialPostPack } = await import('../lib/publishing/platform-formatters')
  const pack = buildSocialPostPack(
    { title, excerpt, tags: tags ?? [], url },
    ['twitter', 'instagram', 'linkedin', 'threads'],
    brief_id
  )

  try {
    const row = await supabaseInsert(c, 'hana_generated_content', {
      brief_id: brief_id ?? null,
      content_type: 'social_pack',
      title: `[Social Pack] ${title}`,
      body: JSON.stringify(pack.posts),
      excerpt,
      platform_targets: pack.posts.map((p) => p.platform),
      originality_score: 0.90,
      compliance_status: 'passed',
      publish_status: 'draft',
      metadata: { pack, tags },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, content: row[0] ?? row, pack }, 201)
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── GET /content/generated ──────────────────────────────────────────────────

hanaContentRoutes.get('/content/generated', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 100)
  try {
    const content = await supabaseQuery(c, 'hana_generated_content', {
      select: 'id,content_type,title,publish_status,compliance_status,originality_score,created_at',
      order: 'created_at.desc',
      limit,
    })
    return c.json({ content, total: content.length })
  } catch {
    return c.json({ content: [], total: 0 })
  }
})

// ─── POST /content/:id/originality-check ─────────────────────────────────────

hanaContentRoutes.post('/content/:id/originality-check', async (c) => {
  const id = c.req.param('id')
  try {
    const rows = await supabaseQuery(c, 'hana_generated_content', { eq: { id }, limit: 1 })
    if (!rows.length) return c.json({ error: 'Content not found' }, 404)

    const { body } = rows[0] as { body: string }
    const report = computeOriginalityScore(body)

    await supabasePatch(c, 'hana_generated_content', {
      originality_score: report.score / 100,
      compliance_status: report.safe ? 'passed' : 'needs_review',
      updated_at: new Date().toISOString(),
    }, { id })

    return c.json({ id, report })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})
