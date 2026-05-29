import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert, supabasePatch, supabaseDelete } from '../lib/supabase'
import { generateAffirmation, generateMultipleAffirmations } from '../lib/nim-client'

const categories = ['health', 'career', 'relationships', 'confidence', 'creativity'] as const

const createAffirmationSchema = z.object({
  content: z.string().min(5).max(500),
  category: z.enum(categories),
  isGenerated: z.boolean().optional(),
})

const generateAffirmationSchema = z.object({
  category: z.enum(categories),
  context: z.string().min(5).max(200),
  mood: z.string().optional(),
  count: z.number().int().min(1).max(5).optional(),
})

const createSessionSchema = z.object({
  affirmationIds: z.array(z.string()),
  duration: z.number().int().min(1), // seconds
  mood: z.string().optional(),
  notes: z.string().optional(),
})

export const affirmationsRoutes = new Hono()

// Middleware: Extract user ID from auth header
function extractUserId(c: any) {
  const auth = c.req.header('Authorization')
  if (!auth) return null

  try {
    const token = auth.replace('Bearer ', '')
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.split('.')[0]
  } catch {
    return null
  }
}

// ============================================================
// GET /api/affirmations — List user's affirmations
// ============================================================
affirmationsRoutes.get('/', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const limit = parseInt(c.req.query('limit') || '20', 10)
    const category = c.req.query('category')

    let query: any = {
      select: '*',
      eq: { user_id: userId },
      limit: Math.min(limit, 100),
      order: 'created_at.desc',
    }

    if (category && categories.includes(category as any)) {
      query.eq.category = category
    }

    const affirmations = await supabaseQuery(c, 'hana_affirmations', query)

    return c.json({
      affirmations: Array.isArray(affirmations) ? affirmations : [],
      count: Array.isArray(affirmations) ? affirmations.length : 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch affirmations'
    console.error('Fetch affirmations error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/affirmations/:id — Get single affirmation
// ============================================================
affirmationsRoutes.get('/:id', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const affirmations = await supabaseQuery(c, 'hana_affirmations', {
      select: '*',
      eq: { id: c.param('id'), user_id: userId },
      limit: 1,
    })

    if (!Array.isArray(affirmations) || affirmations.length === 0) {
      return c.json({ error: 'Affirmation not found' }, 404)
    }

    return c.json(affirmations[0])
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch affirmation'
    console.error('Fetch affirmation error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/affirmations — Create affirmation
// ============================================================
affirmationsRoutes.post('/', zValidator('json', createAffirmationSchema), async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = c.req.valid('json')

    const result = await supabaseInsert(c, 'hana_affirmations', {
      user_id: userId,
      content: body.content,
      category: body.category,
      is_generated: body.isGenerated ?? false,
      created_at: new Date().toISOString(),
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Failed to create affirmation' }, 500)
    }

    return c.json(result[0], 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create affirmation'
    console.error('Create affirmation error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/affirmations/generate — Generate affirmations with NIM
// ============================================================
affirmationsRoutes.post('/generate', zValidator('json', generateAffirmationSchema), async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = c.req.valid('json')
    const count = body.count || 1

    let affirmations: string[] = []

    if (count === 1) {
      const affirmation = await generateAffirmation(c, body.category, body.context, body.mood)
      affirmations = [affirmation]
    } else {
      affirmations = await generateMultipleAffirmations(
        c,
        body.category,
        body.context,
        count,
        body.mood
      )
    }

    // Save generated affirmations to database
    const saved = await Promise.all(
      affirmations.map((content) =>
        supabaseInsert(c, 'hana_affirmations', {
          user_id: userId,
          content,
          category: body.category,
          is_generated: true,
          created_at: new Date().toISOString(),
        })
      )
    )

    const results = saved.filter((r) => Array.isArray(r) && r.length > 0).map((r) => r[0])

    return c.json({
      affirmations: results,
      count: results.length,
      category: body.category,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate affirmations'
    console.error('Generate affirmations error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// PATCH /api/affirmations/:id — Update affirmation
// ============================================================
affirmationsRoutes.patch('/:id', zValidator('json', createAffirmationSchema.partial()), async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = c.req.valid('json')

    const result = await supabasePatch(
      c,
      'hana_affirmations',
      {
        content: body.content,
        category: body.category,
      },
      { id: c.param('id'), user_id: userId }
    )

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Affirmation not found' }, 404)
    }

    return c.json(result[0])
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update affirmation'
    console.error('Update affirmation error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// DELETE /api/affirmations/:id — Delete affirmation
// ============================================================
affirmationsRoutes.delete('/:id', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await supabaseDelete(c, 'hana_affirmations', {
      id: c.param('id'),
      user_id: userId,
    })

    return c.json({ message: 'Affirmation deleted' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete affirmation'
    console.error('Delete affirmation error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/affirmations/:id/likes — Get like count
// ============================================================
affirmationsRoutes.get('/:id/likes', async (c) => {
  try {
    const affirmationId = c.param('id')

    const likes = await supabaseQuery(c, 'hana_affirmation_likes', {
      select: 'count(*)',
      eq: { affirmation_id: affirmationId },
    })

    const count = Array.isArray(likes) && likes.length > 0 ? likes[0].count : 0

    return c.json({ affirmationId, likes: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get like count'
    console.error('Get likes error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/affirmations/:id/like — Like affirmation
// ============================================================
affirmationsRoutes.post('/:id/like', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const affirmationId = c.param('id')

    // Check if already liked
    const existing = await supabaseQuery(c, 'hana_affirmation_likes', {
      select: 'id',
      eq: { affirmation_id: affirmationId, user_id: userId },
      limit: 1,
    })

    if (Array.isArray(existing) && existing.length > 0) {
      return c.json({ message: 'Already liked' }, 200)
    }

    await supabaseInsert(c, 'hana_affirmation_likes', {
      affirmation_id: affirmationId,
      user_id: userId,
      created_at: new Date().toISOString(),
    })

    return c.json({ message: 'Liked' }, 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to like affirmation'
    console.error('Like affirmation error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/affirmations/sessions — Create affirmation session
// ============================================================
affirmationsRoutes.post('/sessions', zValidator('json', createSessionSchema), async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = c.req.valid('json')

    const result = await supabaseInsert(c, 'hana_affirmation_sessions', {
      user_id: userId,
      affirmation_ids: JSON.stringify(body.affirmationIds),
      duration: body.duration,
      mood_before: body.mood,
      created_at: new Date().toISOString(),
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Failed to create session' }, 500)
    }

    return c.json(result[0], 201)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create session'
    console.error('Create session error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/affirmations/sessions — List user's sessions
// ============================================================
affirmationsRoutes.get('/sessions', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const limit = parseInt(c.req.query('limit') || '20', 10)

    const sessions = await supabaseQuery(c, 'hana_affirmation_sessions', {
      select: '*',
      eq: { user_id: userId },
      limit: Math.min(limit, 100),
      order: 'created_at.desc',
    })

    return c.json({
      sessions: Array.isArray(sessions) ? sessions : [],
      count: Array.isArray(sessions) ? sessions.length : 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch sessions'
    console.error('Fetch sessions error:', message)
    return c.json({ error: message }, 500)
  }
})
