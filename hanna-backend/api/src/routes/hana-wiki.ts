import { Hono } from 'hono'
import { supabaseQuery } from '../lib/supabase'

export const hanaWikiRoutes = new Hono()

// ============================================================
// GET /api/hana/wiki — List wiki entries (filtered by category, difficulty)
// ============================================================
hanaWikiRoutes.get('/wiki', async (c) => {
  try {
    const category = c.req.query('category') // filter by category
    const difficulty = c.req.query('difficulty') // filter by difficulty
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 30

    // In production: add eq filters for category and difficulty

    const result = await supabaseQuery(c, 'hana_wiki_entries', {
      select:
        'id,category,japanese,reading,english,difficulty,tags,media_url,source',
      limit,
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch wiki entries' }, 500)
    }

    return c.json({
      count: result.length,
      entries: result.map((entry) => ({
        id: entry.id,
        category: entry.category,
        japanese: entry.japanese,
        reading: entry.reading,
        english: entry.english,
        difficulty: entry.difficulty,
        tags: entry.tags,
        mediaUrl: entry.media_url,
        source: entry.source,
      })),
    })
  } catch (error) {
    console.error('List wiki entries error:', error)
    return c.json({ error: 'Failed to fetch wiki entries' }, 500)
  }
})

// ============================================================
// GET /api/hana/wiki/:id — Get specific wiki entry
// ============================================================
hanaWikiRoutes.get('/wiki/:id', async (c) => {
  try {
    const entryId = c.req.param('id')

    const result = await supabaseQuery(c, 'hana_wiki_entries', {
      select:
        'id,category,japanese,reading,english,notes,etymology,difficulty,tags,related_ids,media_url,source_citation',
      eq: { id: entryId },
      limit: 1,
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Wiki entry not found' }, 404)
    }

    const entry = result[0]

    // Fetch related entries if available
    const relatedIds = entry.related_ids || []
    let relatedEntries = []

    if (relatedIds.length > 0) {
      // In production: fetch entries where id IN (relatedIds)
      relatedEntries = []
    }

    return c.json({
      id: entry.id,
      category: entry.category,
      japanese: entry.japanese,
      reading: entry.reading,
      english: entry.english,
      notes: entry.notes,
      etymology: entry.etymology,
      difficulty: entry.difficulty,
      tags: entry.tags,
      mediaUrl: entry.media_url,
      sourceCitation: entry.source_citation,
      relatedEntries,
    })
  } catch (error) {
    console.error('Get wiki entry error:', error)
    return c.json({ error: 'Failed to fetch wiki entry' }, 500)
  }
})

// ============================================================
// GET /api/hana/wiki/search — Search wiki by keyword
// ============================================================
hanaWikiRoutes.get('/wiki/search', async (c) => {
  try {
    const q = c.req.query('q') // search query
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20

    if (!q || q.trim().length === 0) {
      return c.json({ error: 'Search query required' }, 400)
    }

    // In production: use full-text search
    // e.g., to_tsvector('english', japanese || ' ' || english) @@ plainto_tsquery($1)

    const result = await supabaseQuery(c, 'hana_wiki_entries', {
      select: 'id,japanese,english,reading,category,difficulty',
      limit,
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Search failed' }, 500)
    }

    // Filter by search term (basic client-side for now)
    const filtered = result.filter(
      (entry) =>
        entry.japanese.includes(q) ||
        entry.english.toLowerCase().includes(q.toLowerCase()) ||
        entry.reading?.includes(q)
    )

    return c.json({
      query: q,
      count: filtered.length,
      results: filtered.map((entry) => ({
        id: entry.id,
        japanese: entry.japanese,
        english: entry.english,
        reading: entry.reading,
        category: entry.category,
        difficulty: entry.difficulty,
      })),
    })
  } catch (error) {
    console.error('Wiki search error:', error)
    return c.json({ error: 'Failed to search wiki' }, 500)
  }
})

// ============================================================
// GET /api/hana/wiki/category/:category — Get entries by category
// ============================================================
hanaWikiRoutes.get('/wiki/category/:category', async (c) => {
  try {
    const category = c.req.param('category')
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 30

    // Valid categories: kanji, vocab, grammar, culture, folklore, mythology, yokai, kami, yurei, mononoke, tsukumogami, hyakki_yagyo, shichifukujin, festival, food, place, household_kami

    const validCategories = [
      'kanji',
      'vocab',
      'grammar',
      'culture',
      'folklore',
      'mythology',
      'yokai',
      'kami',
      'yurei',
      'mononoke',
      'tsukumogami',
      'hyakki_yagyo',
      'shichifukujin',
      'festival',
      'food',
      'place',
      'household_kami',
    ]

    if (!validCategories.includes(category)) {
      return c.json(
        {
          error: `Invalid category. Valid categories: ${validCategories.join(', ')}`,
        },
        400
      )
    }

    // In production: use eq filter
    const result = await supabaseQuery(c, 'hana_wiki_entries', {
      select: 'id,category,japanese,reading,english,difficulty,tags,media_url',
      limit,
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch category entries' }, 500)
    }

    // Filter by category (client-side for now)
    const filtered = result.filter((entry) => entry.category === category)

    return c.json({
      category,
      count: filtered.length,
      entries: filtered.map((entry) => ({
        id: entry.id,
        japanese: entry.japanese,
        reading: entry.reading,
        english: entry.english,
        difficulty: entry.difficulty,
        tags: entry.tags,
        mediaUrl: entry.media_url,
      })),
    })
  } catch (error) {
    console.error('Get category entries error:', error)
    return c.json({ error: 'Failed to fetch category entries' }, 500)
  }
})

// ============================================================
// GET /api/hana/wiki/random — Get random wiki entry (for daily learning)
// ============================================================
hanaWikiRoutes.get('/wiki/random', async (c) => {
  try {
    const difficulty = c.req.query('difficulty') // optional filter

    const result = await supabaseQuery(c, 'hana_wiki_entries', {
      select:
        'id,category,japanese,reading,english,notes,etymology,difficulty,media_url',
      limit: 100, // Fetch more, pick random from result set
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'No wiki entries available' }, 500)
    }

    // Filter by difficulty if specified
    let filtered = result
    if (difficulty) {
      filtered = result.filter((entry) => entry.difficulty === difficulty)
    }

    if (filtered.length === 0) {
      filtered = result
    }

    // Pick random
    const random = filtered[Math.floor(Math.random() * filtered.length)]

    return c.json({
      id: random.id,
      category: random.category,
      japanese: random.japanese,
      reading: random.reading,
      english: random.english,
      notes: random.notes,
      etymology: random.etymology,
      difficulty: random.difficulty,
      mediaUrl: random.media_url,
      message: 'Your daily word to explore',
    })
  } catch (error) {
    console.error('Get random entry error:', error)
    return c.json({ error: 'Failed to fetch random wiki entry' }, 500)
  }
})
