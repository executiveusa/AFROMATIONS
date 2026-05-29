/**
 * Bright Data MCP Client
 * Wraps Bright Data's scraping API. Falls back to Firecrawl if unconfigured.
 * All env vars are optional — missing config returns a structured error, never crashes.
 */

export interface BrightDataConfig {
  mcpUrl: string
  apiKey: string
}

export interface ScrapeResult {
  success: boolean
  url: string
  markdown?: string
  html?: string
  metadata?: Record<string, unknown>
  provider: 'bright-data' | 'firecrawl' | 'unavailable'
  error?: string
}

export interface ChannelVideoMeta {
  videoId: string
  url: string
  title: string
  description?: string
  publishedAt?: string
  duration?: string
  viewCount?: number
  hashtags: string[]
  thumbnailUrl?: string
}

function getBrightDataConfig(env: Record<string, string | undefined>): BrightDataConfig | null {
  const mcpUrl = env.BRIGHT_DATA_MCP_URL
  const apiKey = env.BRIGHT_DATA_API_KEY
  if (!mcpUrl || !apiKey) return null
  return { mcpUrl, apiKey }
}

async function scrapeViaBrightData(
  config: BrightDataConfig,
  url: string,
  opts: { timeout?: number } = {}
): Promise<ScrapeResult> {
  const endpoint = `${config.mcpUrl}/scrape`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, timeout: opts.timeout ?? 20000 }),
    signal: AbortSignal.timeout(opts.timeout ?? 25000),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Bright Data scrape failed ${res.status}: ${err}`)
  }

  const data = await res.json() as {
    markdown?: string
    html?: string
    metadata?: Record<string, unknown>
  }

  return {
    success: true,
    url,
    markdown: data.markdown,
    html: data.html,
    metadata: data.metadata,
    provider: 'bright-data',
  }
}

async function scrapeViaFirecrawl(
  firecrawlKey: string,
  url: string,
  opts: { timeout?: number } = {}
): Promise<ScrapeResult> {
  const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${firecrawlKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: false,
      timeout: opts.timeout ?? 20000,
    }),
    signal: AbortSignal.timeout(opts.timeout ?? 25000),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firecrawl scrape failed ${res.status}: ${err}`)
  }

  const data = await res.json() as {
    success: boolean
    data: { markdown?: string; html?: string; metadata?: Record<string, unknown> }
  }

  return {
    success: data.success,
    url,
    markdown: data.data.markdown,
    html: data.data.html,
    metadata: data.data.metadata,
    provider: 'firecrawl',
  }
}

/**
 * Scrape a URL using Bright Data (primary) or Firecrawl (fallback).
 * Returns structured error if neither is configured.
 */
export async function scrapeUrl(
  env: Record<string, string | undefined>,
  url: string,
  opts: { timeout?: number } = {}
): Promise<ScrapeResult> {
  const bdConfig = getBrightDataConfig(env)

  if (bdConfig) {
    try {
      return await scrapeViaBrightData(bdConfig, url, opts)
    } catch (err) {
      // Fall through to Firecrawl
    }
  }

  const firecrawlKey = env.FIRECRAWL_API_KEY
  if (firecrawlKey) {
    return scrapeViaFirecrawl(firecrawlKey, url, opts)
  }

  return {
    success: false,
    url,
    provider: 'unavailable',
    error:
      'No scraping provider configured. Set BRIGHT_DATA_MCP_URL + BRIGHT_DATA_API_KEY or FIRECRAWL_API_KEY.',
  }
}

/**
 * Scrape a YouTube channel page to extract video metadata.
 * Returns up to `limit` videos (default 25).
 */
export async function scrapeYouTubeChannel(
  env: Record<string, string | undefined>,
  channelUrl: string,
  limit = 25
): Promise<{ videos: ChannelVideoMeta[]; error?: string; provider: string }> {
  const result = await scrapeUrl(env, channelUrl, { timeout: 30000 })

  if (!result.success || !result.markdown) {
    return {
      videos: [],
      error: result.error ?? 'Failed to scrape channel page',
      provider: result.provider,
    }
  }

  const videos = parseChannelMarkdown(result.markdown, limit)

  return { videos, provider: result.provider }
}

/**
 * Parse YouTube channel markdown page into video metadata.
 * Extracts video IDs, titles, and basic metadata from scraped content.
 */
function parseChannelMarkdown(markdown: string, limit: number): ChannelVideoMeta[] {
  const videos: ChannelVideoMeta[] = []

  // Match YouTube video URLs: watch?v=XXXXXXXXXXX
  const videoUrlRegex = /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/g
  const titleRegex = /\[([^\]]{5,120})\]\(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]{11}[^)]*\)/g

  const seenIds = new Set<string>()

  // Extract title + videoId pairs from markdown links
  let match: RegExpExecArray | null
  while ((match = titleRegex.exec(markdown)) !== null && videos.length < limit) {
    const title = match[1].trim()
    const urlMatch = match[0].match(/v=([\w-]{11})/)
    if (!urlMatch) continue

    const videoId = urlMatch[1]
    if (seenIds.has(videoId)) continue
    seenIds.add(videoId)

    // Extract hashtags from nearby text
    const startIdx = Math.max(0, match.index - 200)
    const endIdx = Math.min(markdown.length, match.index + 500)
    const context = markdown.slice(startIdx, endIdx)
    const hashtags = (context.match(/#\w+/g) ?? []).map((h) => h.toLowerCase())

    videos.push({
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title,
      hashtags: [...new Set(hashtags)],
    })
  }

  // If titleRegex found nothing, fall back to bare video URL extraction
  if (videos.length === 0) {
    while ((match = videoUrlRegex.exec(markdown)) !== null && videos.length < limit) {
      const videoId = match[1]
      if (seenIds.has(videoId)) continue
      seenIds.add(videoId)

      videos.push({
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: `Video ${videoId}`,
        hashtags: [],
      })
    }
  }

  return videos
}

export function isBrightDataConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.BRIGHT_DATA_MCP_URL && env.BRIGHT_DATA_API_KEY)
}
