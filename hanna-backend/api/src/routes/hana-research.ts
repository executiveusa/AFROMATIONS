import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery, supabasePatch } from '../lib/supabase'
import { crawlYouTubeChannel, NOBLE_GOOSE_CHANNEL_URL } from '../lib/research/youtube-channel-crawler'
import { normalizeSource } from '../lib/research/source-normalizer'
import { extractConcepts, generateChannelSummary } from '../lib/research/concept-extractor'
import { checkRateLimit } from '../lib/guardrails'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GEMINI_API_KEY: string
  FIRECRAWL_API_KEY: string
  BRIGHT_DATA_MCP_URL: string
  BRIGHT_DATA_API_KEY: string
  YOUTUBE_DATA_API_KEY: string
  TRANSCRIPT_PROVIDER_API_KEY: string
}

export const hanaResearchRoutes = new Hono<{ Bindings: Bindings }>()

// ─── Schemas ────────────────────────────────────────────────────────────────

const sourceSchema = z.object({
  source_type: z.string().min(1),
  source_name: z.string().min(1),
  source_url: z.string().url(),
  platform: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

const crawlSchema = z.object({
  channel_url: z.string().url(),
  limit: z.number().min(1).max(50).default(25),
  fetch_transcripts: z.boolean().default(false),
  source_id: z.string().uuid().optional(),
})

const nobleGooseSchema = z.object({
  limit: z.number().min(1).max(50).default(25),
  fetch_transcripts: z.boolean().default(false),
})

// ─── POST /research/sources ──────────────────────────────────────────────────

hanaResearchRoutes.post('/research/sources', zValidator('json', sourceSchema), async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const body = c.req.valid('json')
  const normalized = normalizeSource(body.source_url)

  try {
    const row = await supabaseInsert(c, 'hana_research_sources', {
      source_type: body.source_type,
      source_name: body.source_name,
      source_url: normalized.normalizedUrl,
      platform: body.platform ?? normalized.platform,
      status: 'active',
      metadata: {
        ...(body.metadata ?? {}),
        channelHandle: normalized.channelHandle,
        originalUrl: body.source_url,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return c.json({ success: true, source: row[0] ?? row }, 201)
  } catch (err) {
    return c.json({ error: 'Failed to create source', detail: String(err) }, 500)
  }
})

// ─── GET /research/sources ───────────────────────────────────────────────────

hanaResearchRoutes.get('/research/sources', async (c) => {
  try {
    const sources = await supabaseQuery(c, 'hana_research_sources', {
      select: 'id,source_type,source_name,source_url,platform,status,last_crawled_at,created_at',
      order: 'created_at.desc',
      limit: 50,
    })
    return c.json({ sources, total: sources.length })
  } catch {
    return c.json({ sources: [], total: 0 })
  }
})

// ─── POST /research/crawl-youtube-channel ────────────────────────────────────

hanaResearchRoutes.post(
  '/research/crawl-youtube-channel',
  zValidator('json', crawlSchema),
  async (c) => {
    const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
    if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

    const { channel_url, limit, fetch_transcripts, source_id } = c.req.valid('json')
    const env = c.env as unknown as Record<string, string | undefined>

    const result = await crawlYouTubeChannel(env, channel_url, {
      limit,
      fetchTranscripts: fetch_transcripts,
    })

    // Persist videos to DB
    const stored: string[] = []
    for (const video of result.videos) {
      try {
        const row = await supabaseInsert(c, 'hana_video_research', {
          source_id: source_id ?? null,
          platform: 'youtube',
          channel_name: result.channelName ?? null,
          channel_url: result.channelUrl,
          video_id: video.videoId,
          video_url: video.url,
          title: video.title,
          description: video.description ?? null,
          published_at: video.publishedAt ?? null,
          view_count: video.viewCount ?? null,
          hashtags: video.hashtags,
          transcript_available: video.transcriptAvailable,
          transcript_excerpt: video.transcriptExcerpt ?? null,
          transcript_hash: video.transcriptHash ?? null,
          raw_metadata: video.rawMetadata,
          crawl_status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        stored.push((row[0] ?? row)?.id ?? video.videoId)
      } catch {
        // Skip duplicate/failed rows — continue
      }
    }

    // Update source last_crawled_at
    if (source_id) {
      try {
        await supabasePatch(
          c,
          'hana_research_sources',
          { last_crawled_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: source_id }
        )
      } catch { /* ignore */ }
    }

    return c.json({
      success: true,
      channelUrl: result.channelUrl,
      channelName: result.channelName,
      videosFound: result.videoCount,
      videosStored: stored.length,
      provider: result.provider,
      crawledAt: result.crawledAt,
      error: result.error,
    })
  }
)

// ─── GET /research/videos ────────────────────────────────────────────────────

hanaResearchRoutes.get('/research/videos', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 100)
  try {
    const videos = await supabaseQuery(c, 'hana_video_research', {
      select: 'id,video_id,title,channel_name,video_url,published_at,crawl_status,transcript_available,created_at',
      order: 'created_at.desc',
      limit,
    })
    return c.json({ videos, total: videos.length })
  } catch {
    return c.json({ videos: [], total: 0 })
  }
})

// ─── GET /research/videos/:id ────────────────────────────────────────────────

hanaResearchRoutes.get('/research/videos/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const rows = await supabaseQuery(c, 'hana_video_research', {
      eq: { id },
      limit: 1,
    })
    if (!rows.length) return c.json({ error: 'Video not found' }, 404)
    return c.json(rows[0])
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /research/videos/:id/extract-concepts ──────────────────────────────

hanaResearchRoutes.post('/research/videos/:id/extract-concepts', async (c) => {
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

  const id = c.req.param('id')
  const env = c.env as unknown as Record<string, string | undefined>

  try {
    const rows = await supabaseQuery(c, 'hana_video_research', { eq: { id }, limit: 1 })
    if (!rows.length) return c.json({ error: 'Video not found' }, 404)

    const video = rows[0] as {
      video_id: string; title: string; video_url: string; channel_name: string
      description?: string; transcript_excerpt?: string; hashtags?: string[]
    }

    const result = await extractConcepts(env, {
      videoId: video.video_id,
      title: video.title,
      url: video.video_url,
      channelName: video.channel_name ?? 'Unknown',
      description: video.description,
      transcriptExcerpt: video.transcript_excerpt,
      hashtags: video.hashtags,
    })

    // Store extracted concepts
    const storedConcepts: string[] = []
    for (const concept of result.concepts) {
      try {
        const row = await supabaseInsert(c, 'hana_extracted_concepts', {
          video_research_id: id,
          concept_type: concept.conceptType,
          title: concept.title,
          summary: concept.summary,
          tools: concept.tools,
          workflow_steps: concept.workflowSteps,
          risks: concept.risks,
          opportunities: concept.opportunities,
          source_citation: concept.sourceCitation,
          confidence: concept.confidence,
          created_at: new Date().toISOString(),
        })
        storedConcepts.push((row[0] ?? row)?.id ?? concept.title)
      } catch { /* skip */ }
    }

    // Mark video as processed
    await supabasePatch(
      c, 'hana_video_research',
      { crawl_status: 'concepts_extracted', updated_at: new Date().toISOString() },
      { id }
    )

    return c.json({
      success: true,
      videoId: id,
      conceptsExtracted: result.concepts.length,
      conceptsStored: storedConcepts.length,
      model: result.modelUsed,
      error: result.error,
    })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})

// ─── POST /research/noblegoose/latest ───────────────────────────────────────

hanaResearchRoutes.post(
  '/research/noblegoose/latest',
  zValidator('json', nobleGooseSchema),
  async (c) => {
    const ip = c.req.header('cf-connecting-ip') ?? 'unknown'
    if (!checkRateLimit(ip)) return c.json({ error: 'Rate limited' }, 429)

    const { limit, fetch_transcripts } = c.req.valid('json')
    const env = c.env as unknown as Record<string, string | undefined>

    // Ensure Noble Goose source exists
    let sourceId: string | undefined
    try {
      const existing = await supabaseQuery(c, 'hana_research_sources', {
        eq: { source_url: NOBLE_GOOSE_CHANNEL_URL + '/videos' },
        limit: 1,
      })
      if (existing.length > 0) {
        sourceId = existing[0].id
      } else {
        const row = await supabaseInsert(c, 'hana_research_sources', {
          source_type: 'youtube_channel',
          source_name: 'Noble Goose Anime',
          source_url: NOBLE_GOOSE_CHANNEL_URL + '/videos',
          platform: 'youtube',
          status: 'active',
          metadata: {
            channelHandle: 'noblegooseanime',
            originalUrl: 'https://youtube.com/@noblegooseanime',
            addedBy: 'hana-harness',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        sourceId = (row[0] ?? row)?.id
      }
    } catch { /* proceed without source tracking */ }

    const result = await crawlYouTubeChannel(env, NOBLE_GOOSE_CHANNEL_URL, {
      limit,
      fetchTranscripts: fetch_transcripts,
    })

    const stored: string[] = []
    for (const video of result.videos) {
      try {
        const row = await supabaseInsert(c, 'hana_video_research', {
          source_id: sourceId ?? null,
          platform: 'youtube',
          channel_name: 'Noble Goose Anime',
          channel_url: NOBLE_GOOSE_CHANNEL_URL,
          video_id: video.videoId,
          video_url: video.url,
          title: video.title,
          description: video.description ?? null,
          hashtags: video.hashtags,
          transcript_available: video.transcriptAvailable,
          transcript_excerpt: video.transcriptExcerpt ?? null,
          raw_metadata: { ...video.rawMetadata, source: 'noble-goose-crawl' },
          crawl_status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        stored.push((row[0] ?? row)?.id ?? video.videoId)
      } catch { /* skip duplicates */ }
    }

    return c.json({
      success: true,
      channel: 'Noble Goose Anime',
      channelUrl: NOBLE_GOOSE_CHANNEL_URL,
      videosFound: result.videoCount,
      videosStored: stored.length,
      provider: result.provider,
      crawledAt: result.crawledAt,
      nextStep: 'POST /api/hana/research/videos/:id/extract-concepts for each video',
      error: result.error,
    })
  }
)

// ─── GET /research/noblegoose/summary ────────────────────────────────────────

hanaResearchRoutes.get('/research/noblegoose/summary', async (c) => {
  const env = c.env as unknown as Record<string, string | undefined>

  try {
    const concepts = await supabaseQuery(c, 'hana_extracted_concepts', {
      select: 'concept_type,title,summary,tools,source_citation',
      order: 'created_at.desc',
      limit: 100,
    })

    if (!concepts.length) {
      return c.json({
        summary: null,
        conceptCount: 0,
        message: 'No concepts extracted yet. Run POST /api/hana/research/noblegoose/latest first.',
      })
    }

    const summary = await generateChannelSummary(env, 'Noble Goose Anime', concepts as Parameters<typeof generateChannelSummary>[2])

    return c.json({
      channelName: 'Noble Goose Anime',
      conceptCount: concepts.length,
      summary,
      topTools: [...new Set((concepts as { tools?: string[] }[]).flatMap((c) => c.tools ?? []))].slice(0, 10),
      conceptTypes: concepts.reduce((acc: Record<string, number>, c: { concept_type: string }) => {
        acc[c.concept_type] = (acc[c.concept_type] ?? 0) + 1
        return acc
      }, {}),
    })
  } catch (err) {
    return c.json({ error: String(err) }, 500)
  }
})
