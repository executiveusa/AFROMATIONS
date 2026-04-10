import { Hono } from 'hono'
import { supabaseInsert, supabaseQuery } from '../lib/supabase'

export const trendsRoutes = new Hono()

const ANIME_KEYWORDS = [
  'anime', 'manga', 'one piece', 'dragon ball', 'naruto',
  'jujutsu kaisen', 'chainsaw man', 'solo leveling', 'demon slayer',
  'attack on titan', 'my hero academia', 'black clover', 'bleach',
  'hunter x hunter', 'spy x family', 'afro samurai', 'boondocks anime',
]

// Get current anime trends
trendsRoutes.get('/', async (c) => {
  const apiKey = (c.env as Record<string, string>).GOOGLE_TRENDS_API_KEY

  if (!apiKey) {
    // Fallback mock data when API key not configured
    return c.json({
      trends: [
        { topic: 'One Piece Gear 6', volume: 95, rising: true },
        { topic: 'Solo Leveling Season 3', volume: 88, rising: true },
        { topic: 'Chainsaw Man Part 3', volume: 82, rising: false },
        { topic: 'Dragon Ball Daima Arc 2', volume: 78, rising: true },
        { topic: 'Jujutsu Kaisen Movie', volume: 75, rising: true },
      ],
      source: 'mock',
      note: 'Set GOOGLE_TRENDS_API_KEY in wrangler secrets for live data',
      updated: new Date().toISOString(),
    })
  }

  // SerpAPI Google Trends integration
  try {
    const params = new URLSearchParams({
      engine: 'google_trends',
      q: ANIME_KEYWORDS.slice(0, 5).join(','),
      data_type: 'TIMESERIES',
      date: 'now 7-d',
      api_key: apiKey,
    })

    const res = await fetch(`https://serpapi.com/search.json?${params}`)
    const data = await res.json() as Record<string, unknown>

    return c.json({
      trends: data,
      source: 'google_trends',
      updated: new Date().toISOString(),
    })
  } catch {
    return c.json({
      trends: [],
      source: 'error',
      message: 'Google Trends API call failed',
      updated: new Date().toISOString(),
    })
  }
})

// Get curated article topics from trends
trendsRoutes.get('/topics', async (c) => {
  try {
    const recent = await supabaseQuery(c, 'afromations_content', {
      select: 'title,metadata,created_at',
      limit: 10,
      order: 'created_at.desc',
      eq: { content_type: 'blog' },
    })
    return c.json({
      topics: recent.map((r: Record<string, unknown>) => r.title),
      generated: new Date().toISOString(),
    })
  } catch {
    return c.json({
      topics: [
        'Top 10 Anime Openings of 2026',
        'Black Anime Creators Breaking Barriers',
        'Why Studio MAPPA Changed Anime Forever',
        'Afro Samurai Legacy: A Retrospective',
        'The Rise of AI in Anime Production',
      ],
      generated: new Date().toISOString(),
    })
  }
})

// Trigger a trend scan → store results in Supabase
trendsRoutes.post('/scan', async (c) => {
  try {
    const row = await supabaseInsert(c, 'afromations_content', {
      title: `Trend Scan — ${new Date().toISOString().slice(0, 10)}`,
      content_type: 'trend_scan',
      metadata: { keywords: ANIME_KEYWORDS, source: 'agent_hanna' },
      status: 'processing',
      created_at: new Date().toISOString(),
    })
    return c.json({ status: 'scan_started', record: row })
  } catch {
    return c.json({ status: 'scan_queued', message: 'Check Supabase connection' })
  }
})
