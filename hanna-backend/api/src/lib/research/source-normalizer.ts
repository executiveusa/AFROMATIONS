/**
 * Source Normalizer
 * Normalizes and validates research source URLs, channel handles, and video IDs.
 */

export interface NormalizedSource {
  platform: 'youtube' | 'twitter' | 'instagram' | 'tiktok' | 'web' | 'unknown'
  originalUrl: string
  normalizedUrl: string
  channelHandle?: string
  channelId?: string
  videoId?: string
  isChannel: boolean
  isVideo: boolean
}

export function normalizeYouTubeChannelUrl(input: string): string {
  // Remove tracking params (e.g., ?si=...)
  const url = new URL(input.startsWith('http') ? input : `https://${input}`)
  const path = url.pathname.replace(/\/$/, '')

  // @handle format → canonical
  if (path.startsWith('/@')) {
    return `https://www.youtube.com${path}/videos`
  }

  // /channel/UCxxx format
  if (path.startsWith('/channel/')) {
    return `https://www.youtube.com${path}/videos`
  }

  // /user/xxx format
  if (path.startsWith('/user/')) {
    return `https://www.youtube.com${path}/videos`
  }

  // /c/CustomName format
  if (path.startsWith('/c/')) {
    return `https://www.youtube.com${path}/videos`
  }

  return `https://www.youtube.com${path}`
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:v=|\/watch\?v=)([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/v\/([\w-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function extractYouTubeChannelHandle(url: string): string | null {
  const match = url.match(/@([\w-]+)/)
  return match ? match[1] : null
}

export function normalizeSource(input: string): NormalizedSource {
  let platform: NormalizedSource['platform'] = 'unknown'
  let normalizedUrl = input
  let channelHandle: string | undefined
  let videoId: string | undefined
  let isChannel = false
  let isVideo = false

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`)
    const hostname = url.hostname.replace(/^www\./, '')

    if (hostname === 'youtube.com' || hostname === 'youtu.be') {
      platform = 'youtube'
      videoId = extractYouTubeVideoId(input) ?? undefined
      channelHandle = extractYouTubeChannelHandle(input) ?? undefined
      isVideo = Boolean(videoId)
      isChannel = !isVideo && (
        url.pathname.startsWith('/@') ||
        url.pathname.startsWith('/channel/') ||
        url.pathname.startsWith('/c/') ||
        url.pathname.startsWith('/user/')
      )

      if (isChannel) {
        normalizedUrl = normalizeYouTubeChannelUrl(input)
      } else if (isVideo) {
        normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`
      }
    } else if (hostname === 'twitter.com' || hostname === 'x.com') {
      platform = 'twitter'
      normalizedUrl = input.replace('twitter.com', 'x.com')
    } else if (hostname === 'instagram.com') {
      platform = 'instagram'
    } else if (hostname === 'tiktok.com') {
      platform = 'tiktok'
    } else {
      platform = 'web'
    }
  } catch {
    // Invalid URL — return as-is
  }

  return {
    platform,
    originalUrl: input,
    normalizedUrl,
    channelHandle,
    videoId,
    isChannel,
    isVideo,
  }
}

/**
 * Extract hashtags from text (e.g., descriptions, markdown).
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\wÀ-ɏ一-鿿]+/g) ?? []
  return [...new Set(matches.map((h) => h.toLowerCase()))]
}

/**
 * Extract duration in seconds from YouTube duration string (e.g., "12:34" or "1:23:45").
 */
export function parseDurationToSeconds(duration: string): number | null {
  const parts = duration.split(':').map(Number)
  if (parts.some(isNaN)) return null

  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]

  return null
}

/**
 * Compute a short SHA-256 fingerprint for deduplication.
 */
export async function fingerprint(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
}
