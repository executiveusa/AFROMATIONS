/**
 * Platform Formatters
 * Formats generated content for each social media platform's constraints.
 */

export type Platform =
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'youtube_community'
  | 'linkedin'
  | 'threads'

export interface PlatformPost {
  platform: Platform
  text: string
  hashtags: string[]
  characterCount: number
  withinLimit: boolean
  warnings: string[]
}

export interface SocialPostPack {
  posts: PlatformPost[]
  sourceContentId?: string
  generatedAt: string
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  instagram: 2200,
  tiktok: 2200,
  youtube_community: 5000,
  linkedin: 3000,
  threads: 500,
}

const PLATFORM_HASHTAG_MAX: Record<Platform, number> = {
  twitter: 2,
  instagram: 30,
  tiktok: 10,
  youtube_community: 5,
  linkedin: 5,
  threads: 5,
}

function trimToLimit(text: string, limit: number): string {
  if (text.length <= limit) return text
  return text.slice(0, limit - 3) + '...'
}

function countChars(text: string, hashtags: string[]): number {
  const hashtagStr = hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')
  return (text + (hashtagStr ? ' ' + hashtagStr : '')).length
}

/**
 * Format a post for a specific platform.
 */
export function formatForPlatform(
  platform: Platform,
  rawText: string,
  hashtags: string[] = []
): PlatformPost {
  const limit = PLATFORM_LIMITS[platform]
  const maxHashtags = PLATFORM_HASHTAG_MAX[platform]

  const trimmedHashtags = hashtags.slice(0, maxHashtags).map((h) =>
    h.startsWith('#') ? h : `#${h}`
  )

  const totalChars = countChars(rawText, trimmedHashtags)
  const warnings: string[] = []

  let text = rawText
  if (totalChars > limit) {
    const available = limit - trimmedHashtags.join(' ').length - (trimmedHashtags.length > 0 ? 1 : 0)
    text = trimToLimit(rawText, Math.max(available, 40))
    warnings.push(`Text trimmed to fit ${platform} limit (${limit} chars)`)
  }

  if (hashtags.length > maxHashtags) {
    warnings.push(`Hashtags trimmed from ${hashtags.length} to ${maxHashtags} (${platform} limit)`)
  }

  const finalCount = countChars(text, trimmedHashtags)

  return {
    platform,
    text,
    hashtags: trimmedHashtags,
    characterCount: finalCount,
    withinLimit: finalCount <= limit,
    warnings,
  }
}

/**
 * Build a full social post pack from a content piece.
 */
export function buildSocialPostPack(
  content: {
    title: string
    excerpt: string
    body?: string
    tags?: string[]
    url?: string
  },
  platforms: Platform[] = ['twitter', 'instagram', 'linkedin'],
  sourceContentId?: string
): SocialPostPack {
  const { title, excerpt, tags = [], url } = content

  const baseHashtags = [
    ...tags.slice(0, 8).map((t) => `#${t.replace(/\s+/g, '')}`),
    '#AFROMATIONS',
    '#AnimeAI',
    '#HanaTeaches',
  ]

  const posts: PlatformPost[] = platforms.map((platform) => {
    let text: string

    switch (platform) {
      case 'twitter':
        text = `${title}\n\n${excerpt.slice(0, 160)}${url ? `\n\n🔗 ${url}` : ''}`
        break
      case 'instagram':
        text = `✨ ${title}\n\n${excerpt}\n\n📚 Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide.\n\n${url ? `Link in bio → ${url}` : ''}`
        break
      case 'tiktok':
        text = `${title} 🎌\n\n${excerpt.slice(0, 200)}`
        break
      case 'youtube_community':
        text = `🎌 NEW from Hana's Studio Lab:\n\n${title}\n\n${excerpt}\n\n${url ? `Read more: ${url}` : ''}`
        break
      case 'linkedin':
        text = `AI Anime Production Insight from AFROMATIONS:\n\n${title}\n\n${excerpt}\n\n${content.body ? content.body.slice(0, 600) : ''}\n\n${url ? `Full guide: ${url}` : ''}`
        break
      case 'threads':
        text = `${title}\n\n${excerpt.slice(0, 300)}`
        break
      default:
        text = `${title}\n\n${excerpt}`
    }

    return formatForPlatform(platform, text, baseHashtags)
  })

  return {
    posts,
    sourceContentId,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Generate hashtag recommendations for anime content.
 */
export function recommendHashtags(
  contentType: string,
  topics: string[] = []
): string[] {
  const base = ['#AFROMATIONS', '#AIAnime', '#AnimeAI', '#HanaTeaches']

  const byType: Record<string, string[]> = {
    tutorial: ['#AnimeProduction', '#AITutorial', '#HowTo', '#AnimeCreator'],
    blog: ['#AnimeBlog', '#AIAnimeTools', '#AnimeStudio'],
    script: ['#AnimeScript', '#YouTubeAnime', '#AnimeCreator'],
    social: ['#BlackAnime', '#AnimeArt', '#Afrofuturism'],
    lesson: ['#LearnAnime', '#AnimeEducation', '#AIAnimation'],
    tool_review: ['#AITools', '#AnimeTools', '#CreatorTips'],
  }

  const topicTags = topics
    .slice(0, 5)
    .map((t) => `#${t.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`)
    .filter((t) => t.length > 2)

  return [...new Set([...base, ...(byType[contentType] ?? []), ...topicTags])].slice(0, 15)
}
