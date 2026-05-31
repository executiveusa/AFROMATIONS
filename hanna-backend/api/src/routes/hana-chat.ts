import { Hono } from 'hono'
import { supabaseQuery, supabaseInsert, supabaseDelete } from '../lib/supabase'
import { generateAffirmation } from '../lib/nim-client'
import type { Context } from 'hono'

function extractUserId(c: Context): string | null {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split('.')
    return userId
  } catch {
    return null
  }
}

export const hanaChatRoutes = new Hono()

// ============================================================
// POST /api/hana-chat/message — Send message to HANA agent
// ============================================================
hanaChatRoutes.post('/message', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400)
    }

    // Get user's recent affirmations and mood history
    const affirmations = (await supabaseQuery(c, 'hana_affirmations', {
      select: 'category,content',
      eq: { user_id: userId },
      limit: 10,
      order: 'created_at.desc',
    })) as any[]

    const stats = (await supabaseQuery(c, 'hana_user_stats', {
      select: '*',
      eq: { user_id: userId },
      limit: 1,
    })) as any[]

    // Build context
    const categories = Array.isArray(affirmations)
      ? affirmations
          .map((a) => a.category)
          .filter((c, i, arr) => arr.indexOf(c) === i)
          .slice(0, 5)
      : []

    const streakDays = Array.isArray(stats) && stats.length > 0 ? stats[0].streak_days || 0 : 0
    const affirmationCount = Array.isArray(affirmations) ? affirmations.length : 0

    const context = `
User Context:
- Has created ${affirmationCount} affirmations
- Focus categories: ${categories.join(', ') || 'none yet'}
- Current practice streak: ${streakDays} days
- This is message ${Math.floor(Math.random() * 100) + 1} in their HANA journey

Respond as HANA, a supportive affirmation coach. Personalize your response based on their journey.
`

    // Call NIM to generate response
    const hanaResponse = await generateAffirmation(c, 'general', context, 'reflective')

    if (!hanaResponse) {
      return c.json({ error: 'Failed to generate response' }, 500)
    }

    // Save conversation
    try {
      await supabaseInsert(c, 'hana_chat_messages', {
        user_id: userId,
        role: 'user',
        content: message,
        context: JSON.stringify({
          affirmationCount,
          categories,
          streakDays,
        }),
        created_at: new Date().toISOString(),
      })

      await supabaseInsert(c, 'hana_chat_messages', {
        user_id: userId,
        role: 'assistant',
        content: hanaResponse,
        context: JSON.stringify({
          affirmationCount,
          categories,
          streakDays,
        }),
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Save chat error:', err)
    }

    return c.json({
      message: hanaResponse,
      context: {
        affirmationCount,
        categories,
        streakDays,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process message'
    console.error('HANA chat error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/hana-chat/history — Get conversation history
// ============================================================
hanaChatRoutes.get('/history', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : 20
    const offset = c.req.query('offset') ? parseInt(c.req.query('offset') as string) : 0

    const messages = (await supabaseQuery(c, 'hana_chat_messages', {
      select: '*',
      eq: { user_id: userId },
      limit: limit,
      order: 'created_at.desc',
    })) as any[]

    if (!Array.isArray(messages)) {
      return c.json({ messages: [], count: 0 })
    }

    return c.json({
      messages: messages.reverse(),
      count: messages.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch history'
    console.error('Get chat history error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// DELETE /api/hana-chat/history — Clear conversation history
// ============================================================
hanaChatRoutes.delete('/history', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await supabaseDelete(c, 'hana_chat_messages', { user_id: userId })

    return c.json({ message: 'Chat history cleared' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to clear history'
    console.error('Delete chat history error:', message)
    return c.json({ error: message }, 500)
  }
})
