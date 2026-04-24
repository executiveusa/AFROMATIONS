import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { checkGuardrails, checkRateLimit } from '../lib/guardrails'

type Bindings = {
  FIRECRAWL_API_KEY: string
  GEMINI_API_KEY: string
  STUDIO_NAME: string
  AGENT_NAME: string
}

const FIRECRAWL_BASE = 'https://api.firecrawl.dev/v1'

// ─── Schemas ─────────────────────────────────────────────────────────────────

const scrapeSchema = z.object({
  url: z.string().url(),
  formats: z.array(z.enum(['markdown', 'html', 'screenshot', 'links'])).default(['markdown']),
  onlyMainContent: z.boolean().default(true),
  timeout: z.number().min(1000).max(30000).default(15000),
})

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().min(1).max(10).default(5),
  scrapeOptions: z.object({
    formats: z.array(z.enum(['markdown'])).default(['markdown']),
  }).optional(),
})

const youtubeSchema = z.object({
  url: z.string().url().refine(
    (u) => u.includes('youtube.com') || u.includes('youtu.be'),
    { message: 'Must be a YouTube URL' }
  ),
})

const researchSchema = z.object({
  query: z.string().min(1).max(500),
  depth: z.enum(['quick', 'deep']).default('quick'),
  summarize: z.boolean().default(true),
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function firecrawlScrape(
  apiKey: string,
  url: string,
  opts: { formats?: string[]; onlyMainContent?: boolean; timeout?: number } = {}
) {
  const res = await fetch(`${FIRECRAWL_BASE}/scrape`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: opts.formats ?? ['markdown'],
      onlyMainContent: opts.onlyMainContent ?? true,
      timeout: opts.timeout ?? 15000,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firecrawl scrape failed ${res.status}: ${err}`)
  }
  return res.json() as Promise<{
    success: boolean
    data: { markdown?: string; html?: string; links?: string[]; metadata?: Record<string, unknown> }
  }>
}

async function firecrawlSearch(
  apiKey: string,
  query: string,
  opts: { limit?: number; scrapeOptions?: { formats: string[] } } = {}
) {
  const res = await fetch(`${FIRECRAWL_BASE}/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      limit: opts.limit ?? 5,
      scrapeOptions: opts.scrapeOptions,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firecrawl search failed ${res.status}: ${err}`)
  }
  return res.json() as Promise<{
    success: boolean
    data: { url: string; title: string; description: string; markdown?: string }[]
  }>
}

async function geminiSummarize(apiKey: string, content: string, prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${prompt}\n\n---\n${content}` }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.4 },
      }),
    }
  )
  if (!res.ok) return null
  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export const hanaScrapeRoutes = new Hono<{ Bindings: Bindings }>()

/**
 * POST /scrape
 * Scrape any URL and return its markdown content.
 */
hanaScrapeRoutes.post('/scrape', zValidator('json', scrapeSchema), async (c) => {
  const { url, formats, onlyMainContent, timeout } = c.req.valid('json')

  const clientIp = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(clientIp)) {
    return c.json({ error: 'Rate limited. Slow down.' }, 429)
  }

  const apiKey = c.env?.FIRECRAWL_API_KEY
  if (!apiKey) {
    return c.json({ error: 'FIRECRAWL_API_KEY not configured. Set it via wrangler secret put FIRECRAWL_API_KEY' }, 503)
  }

  try {
    const result = await firecrawlScrape(apiKey, url, { formats, onlyMainContent, timeout })
    return c.json({
      skill: 'web-scrape',
      url,
      success: result.success,
      content: result.data,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 502)
  }
})

/**
 * POST /search
 * Search the web and return results with optional page content.
 */
hanaScrapeRoutes.post('/search', zValidator('json', searchSchema), async (c) => {
  const body = c.req.valid('json')

  const clientIp = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(clientIp)) {
    return c.json({ error: 'Rate limited. Slow down.' }, 429)
  }

  const guard = checkGuardrails(body.query)
  if (!guard.safe) {
    return c.json({ error: guard.reason }, 400)
  }

  const apiKey = c.env?.FIRECRAWL_API_KEY
  if (!apiKey) {
    return c.json({ error: 'FIRECRAWL_API_KEY not configured.' }, 503)
  }

  try {
    const result = await firecrawlSearch(apiKey, guard.sanitized, {
      limit: body.limit,
      scrapeOptions: body.scrapeOptions,
    })
    return c.json({
      skill: 'web-search',
      query: guard.sanitized,
      count: result.data.length,
      results: result.data,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 502)
  }
})

/**
 * POST /youtube
 * Get the transcript and metadata from a YouTube video.
 */
hanaScrapeRoutes.post('/youtube', zValidator('json', youtubeSchema), async (c) => {
  const { url } = c.req.valid('json')

  const clientIp = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(clientIp)) {
    return c.json({ error: 'Rate limited. Slow down.' }, 429)
  }

  const apiKey = c.env?.FIRECRAWL_API_KEY
  if (!apiKey) {
    return c.json({ error: 'FIRECRAWL_API_KEY not configured.' }, 503)
  }

  try {
    // Firecrawl scrapes YouTube pages including transcripts in markdown
    const result = await firecrawlScrape(apiKey, url, {
      formats: ['markdown'],
      onlyMainContent: false, // include transcript sections
      timeout: 20000,
    })

    const raw = result.data.markdown ?? ''
    const meta = result.data.metadata ?? {}

    // Extract transcript block — YouTube markdown has "Transcript" section
    const transcriptMatch = raw.match(/(?:##?\s*Transcript[\s\S]*?)(?=##|$)/i)
    const transcript = transcriptMatch ? transcriptMatch[0].trim() : null

    return c.json({
      skill: 'youtube-transcript',
      url,
      title: (meta.title as string) ?? null,
      description: (meta.description as string) ?? null,
      transcript,
      fullContent: transcript ? undefined : raw, // fall back to full markdown if no transcript block
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 502)
  }
})

/**
 * POST /research
 * Compound skill: search → scrape top results → summarize with Gemini.
 * depth=quick: search only (no per-page scrape)
 * depth=deep: search + scrape top 3 pages
 */
hanaScrapeRoutes.post('/research', zValidator('json', researchSchema), async (c) => {
  const { query, depth, summarize } = c.req.valid('json')

  const clientIp = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(clientIp)) {
    return c.json({ error: 'Rate limited. Slow down.' }, 429)
  }

  const guard = checkGuardrails(query)
  if (!guard.safe) {
    return c.json({ error: guard.reason }, 400)
  }

  const firecrawlKey = c.env?.FIRECRAWL_API_KEY
  if (!firecrawlKey) {
    return c.json({ error: 'FIRECRAWL_API_KEY not configured.' }, 503)
  }

  try {
    // Step 1: search
    const searchResult = await firecrawlSearch(firecrawlKey, guard.sanitized, {
      limit: depth === 'deep' ? 5 : 5,
      scrapeOptions: depth === 'quick' ? { formats: ['markdown'] } : undefined,
    })

    // Step 2: for deep mode, scrape top 3 pages fully
    let deepContent: { url: string; markdown: string }[] = []
    if (depth === 'deep') {
      const top3 = searchResult.data.slice(0, 3)
      deepContent = (
        await Promise.allSettled(
          top3.map(async (r) => {
            const scraped = await firecrawlScrape(firecrawlKey, r.url, {
              formats: ['markdown'],
              timeout: 15000,
            })
            return { url: r.url, markdown: scraped.data.markdown ?? '' }
          })
        )
      )
        .filter((r): r is PromiseFulfilledResult<{ url: string; markdown: string }> => r.status === 'fulfilled')
        .map((r) => r.value)
    }

    // Step 3: optional Gemini summary
    let summary: string | null = null
    if (summarize && c.env?.GEMINI_API_KEY) {
      const contentForSummary =
        depth === 'deep' && deepContent.length > 0
          ? deepContent.map((d) => `## ${d.url}\n${d.markdown.slice(0, 2000)}`).join('\n\n')
          : searchResult.data
              .map((r) => `## ${r.title}\n${r.url}\n${r.description}\n${r.markdown?.slice(0, 800) ?? ''}`)
              .join('\n\n')

      summary = await geminiSummarize(
        c.env.GEMINI_API_KEY,
        contentForSummary,
        `You are Hanna (花), research agent for AFROMATIONS Studios. Summarize these web research results for the query: "${guard.sanitized}". Be concise, factual, and anime/creative-industry aware. Under 300 words.`
      )
    }

    return c.json({
      skill: 'web-research',
      query: guard.sanitized,
      depth,
      searchResults: searchResult.data.map(({ url, title, description }) => ({ url, title, description })),
      deepContent: depth === 'deep' ? deepContent.map(({ url, markdown }) => ({ url, preview: markdown.slice(0, 500) })) : undefined,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 502)
  }
})
