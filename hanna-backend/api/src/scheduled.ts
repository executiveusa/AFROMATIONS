/**
 * Scheduled handler for Hanna cron jobs
 * - Google Trends scan (every 2 days)
 * - Daily brief for Tyshawn (every day at 8am UTC)
 */

import { supabaseInsert, supabaseQuery } from './lib/supabase'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GOOGLE_TRENDS_API_KEY: string
  GEMINI_API_KEY: string
  STUDIO_NAME: string
  AGENT_NAME: string
}

// Anime-related search terms for trends monitoring
const ANIME_KEYWORDS = [
  'anime',
  'manga',
  'one piece',
  'jujutsu kaisen',
  'demon slayer',
  'chainsaw man',
  'my hero academia',
  'dragon ball',
  'naruto',
  'attack on titan',
  'black anime creators',
  'anime merchandise',
  'anime studio',
  'anime cosplay',
  'anime convention',
]

/**
 * Fetch Google Trends data via SerpAPI
 */
async function scanGoogleTrends(env: Env): Promise<{ keyword: string; interest: number }[]> {
  const results: { keyword: string; interest: number }[] = []

  if (!env.GOOGLE_TRENDS_API_KEY) {
    console.log('[Trends] No API key set, using mock data')
    return ANIME_KEYWORDS.slice(0, 5).map((kw) => ({
      keyword: kw,
      interest: Math.floor(Math.random() * 100),
    }))
  }

  // Batch: pick 5 random keywords per scan to stay within rate limits
  const shuffled = ANIME_KEYWORDS.sort(() => 0.5 - Math.random()).slice(0, 5)

  for (const keyword of shuffled) {
    try {
      const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&date=now%207-d&api_key=${env.GOOGLE_TRENDS_API_KEY}`
      const resp = await fetch(url)
      if (resp.ok) {
        const data = (await resp.json()) as { interest_over_time?: { timeline_data?: { values?: { value?: string }[] }[] } }
        const timeline = data.interest_over_time?.timeline_data ?? []
        const latest = timeline[timeline.length - 1]
        const value = parseInt(latest?.values?.[0]?.value ?? '0', 10)
        results.push({ keyword, interest: value })
      }
    } catch (e) {
      console.error(`[Trends] Failed to fetch ${keyword}:`, e)
    }
  }

  return results
}

/**
 * Store trends data in Supabase
 */
async function storeTrends(env: Env, trends: { keyword: string; interest: number }[]) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    console.log('[Trends] No Supabase config, skipping storage')
    return
  }

  for (const t of trends) {
    await supabaseInsert(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, 'anime_trends', {
      keyword: t.keyword,
      interest_score: t.interest,
      scanned_at: new Date().toISOString(),
      source: 'google_trends',
    })
  }
}

/**
 * Generate daily brief for Tyshawn
 */
async function generateDailyBrief(env: Env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    console.log('[Brief] No Supabase config, skipping')
    return
  }

  // Get latest trends from the last 3 days
  const trends = await supabaseQuery(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    'anime_trends',
    'keyword,interest_score,scanned_at',
    'order=scanned_at.desc&limit=10'
  )

  const trendsList = (trends ?? []) as { keyword: string; interest_score: number }[]
  const topTrends = trendsList
    .sort((a, b) => b.interest_score - a.interest_score)
    .slice(0, 5)
    .map((t) => `${t.keyword} (${t.interest_score}/100)`)
    .join(', ')

  const brief = {
    type: 'daily_brief',
    recipient: 'tyshawn',
    date: new Date().toISOString().split('T')[0],
    summary: {
      top_trends: topTrends || 'No trends data yet. Deploy Google Trends API key.',
      studio_status: 'operational',
      agent_status: 'Hanna online',
      recommendations: [
        'Check trending anime topics for content ideas',
        'Review any pending blog drafts',
        'Studio pipeline: ready for new character concepts',
      ],
    },
    generated_at: new Date().toISOString(),
    generated_by: 'Agent Hanna 花',
  }

  await supabaseInsert(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, 'daily_briefs', brief)
  console.log(`[Brief] Daily brief generated for ${brief.date}`)
}

/**
 * Main scheduled handler — called by Cloudflare Workers cron triggers
 */
export async function handleScheduled(event: ScheduledEvent, env: Env) {
  const hour = new Date(event.scheduledTime).getUTCHours()

  // Daily brief runs at 8am UTC
  if (hour === 8) {
    console.log('[Cron] Running daily brief generation')
    await generateDailyBrief(env)
  }

  // Trends scan runs every ~48 hours (via cron expression)
  // But we also run it if triggered at non-8am hours
  if (hour !== 8) {
    console.log('[Cron] Running Google Trends scan')
    const trends = await scanGoogleTrends(env)
    await storeTrends(env, trends)
    console.log(`[Cron] Stored ${trends.length} trend data points`)
  }
}
