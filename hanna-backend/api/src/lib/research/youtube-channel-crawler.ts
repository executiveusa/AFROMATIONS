/**
 * YouTube Channel Crawler
 * Fetches the latest videos from a YouTube channel.
 * Uses YouTube Data API if available, falls back to page scraping via Bright Data / Firecrawl.
 * Never downloads or stores video content — metadata and public descriptions only.
 */

import { scrapeUrl, scrapeYouTubeChannel } from '../mcp/bright-data-client'
import { normalizeYouTubeChannelUrl, extractYouTubeVideoId, extractHashtags } from './source-normalizer'

export interface VideoMetadata {
  videoId: string
  url: string
  title: string
  description?: string
  publishedAt?: string
  durationSeconds?: number
  viewCount?: number
  hashtags: string[]
  transcriptAvailable: boolean
  transcriptExcerpt?: string
  transcriptHash?: string
  rawMetadata: Record<string, unknown>
}

export interface CrawlResult {
  channelUrl: string
  channelName?: string
  videoCount: number
  videos: VideoMetadata[]
  provider: string
  crawledAt: string
  error?: string
}

/**
 * Crawl via YouTube Data API (v3) if key is available.
 */
async function crawlViaYouTubeApi(
  apiKey: string,
  channelHandle: string,
  limit: number
): Promise<VideoMetadata[]> {
  // Resolve handle → channel ID
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelHandle)}&type=channel&maxResults=1&key=${apiKey}`,
    { signal: AbortSignal.timeout(10000) }
  )

  if (!searchRes.ok) throw new Error(`YouTube API channel search failed: ${searchRes.status}`)

  const searchData = await searchRes.json() as {
    items?: { id: { channelId: string }; snippet: { title: string } }[]
  }

  const channelId = searchData.items?.[0]?.id?.channelId
  if (!channelId) throw new Error('Channel not found via YouTube API')

  // Fetch latest videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${limit}&key=${apiKey}`,
    { signal: AbortSignal.timeout(10000) }
  )

  if (!videosRes.ok) throw new Error(`YouTube API videos fetch failed: ${videosRes.status}`)

  const videosData = await videosRes.json() as {
    items?: {
      id: { videoId: string }
      snippet: {
        title: string
        description: string
        publishedAt: string
        thumbnails: Record<string, { url: string }>
      }
    }[]
  }

  return (videosData.items ?? []).map((item) => ({
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    hashtags: extractHashtags(item.snippet.description ?? ''),
    transcriptAvailable: false,
    rawMetadata: { source: 'youtube-api', snippet: item.snippet },
  }))
}

/**
 * Attempt to fetch a video's transcript via Firecrawl scrape (metadata/description only if transcript unavailable).
 */
async function fetchVideoTranscriptExcerpt(
  env: Record<string, string | undefined>,
  videoUrl: string
): Promise<{ available: boolean; excerpt?: string; hash?: string }> {
  const firecrawlKey = env.FIRECRAWL_API_KEY
  if (!firecrawlKey) return { available: false }

  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: videoUrl,
        formats: ['markdown'],
        onlyMainContent: false,
        timeout: 20000,
      }),
      signal: AbortSignal.timeout(25000),
    })

    if (!res.ok) return { available: false }

    const data = await res.json() as {
      success: boolean
      data: { markdown?: string }
    }

    const raw = data.data.markdown ?? ''
    const transcriptMatch = raw.match(/(?:##?\s*Transcript[\s\S]*?)(?=##|$)/i)

    if (!transcriptMatch) return { available: false }

    const excerpt = transcriptMatch[0].trim().slice(0, 500)
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(excerpt))
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16)

    return { available: true, excerpt, hash }
  } catch {
    return { available: false }
  }
}

/**
 * Main crawl function.
 * Priority: YouTube Data API → Bright Data/Firecrawl page scrape
 */
export async function crawlYouTubeChannel(
  env: Record<string, string | undefined>,
  channelUrl: string,
  options: {
    limit?: number
    fetchTranscripts?: boolean
  } = {}
): Promise<CrawlResult> {
  const limit = options.limit ?? 25
  const fetchTranscripts = options.fetchTranscripts ?? false
  const crawledAt = new Date().toISOString()

  const normalizedUrl = normalizeYouTubeChannelUrl(channelUrl)
  const handleMatch = channelUrl.match(/@([\w-]+)/)
  const channelHandle = handleMatch ? handleMatch[1] : undefined

  // Try YouTube Data API first
  const ytApiKey = env.YOUTUBE_DATA_API_KEY
  if (ytApiKey && channelHandle) {
    try {
      const videos = await crawlViaYouTubeApi(ytApiKey, channelHandle, limit)

      if (fetchTranscripts) {
        for (const video of videos) {
          const transcript = await fetchVideoTranscriptExcerpt(env, video.url)
          video.transcriptAvailable = transcript.available
          video.transcriptExcerpt = transcript.excerpt
          video.transcriptHash = transcript.hash
        }
      }

      return {
        channelUrl: normalizedUrl,
        channelName: channelHandle,
        videoCount: videos.length,
        videos,
        provider: 'youtube-api',
        crawledAt,
      }
    } catch (err) {
      // Fall through to scrape
    }
  }

  // Fall back to page scraping
  const { videos: scrapedMeta, error, provider } = await scrapeYouTubeChannel(
    env,
    normalizedUrl,
    limit
  )

  if (error && scrapedMeta.length === 0) {
    return {
      channelUrl: normalizedUrl,
      videoCount: 0,
      videos: [],
      provider,
      crawledAt,
      error,
    }
  }

  const videos: VideoMetadata[] = scrapedMeta.map((v) => ({
    videoId: v.videoId,
    url: v.url,
    title: v.title,
    description: v.description,
    publishedAt: v.publishedAt,
    hashtags: v.hashtags,
    viewCount: v.viewCount,
    transcriptAvailable: false,
    rawMetadata: { source: 'page-scrape', provider },
  }))

  if (fetchTranscripts) {
    for (const video of videos.slice(0, 5)) {
      const transcript = await fetchVideoTranscriptExcerpt(env, video.url)
      video.transcriptAvailable = transcript.available
      video.transcriptExcerpt = transcript.excerpt
      video.transcriptHash = transcript.hash
    }
  }

  return {
    channelUrl: normalizedUrl,
    channelName: channelHandle,
    videoCount: videos.length,
    videos,
    provider,
    crawledAt,
  }
}

export const NOBLE_GOOSE_CHANNEL_URL = 'https://www.youtube.com/@noblegooseanime'
