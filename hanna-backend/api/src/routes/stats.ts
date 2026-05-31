import { Hono } from 'hono'
import { supabaseQuery, supabasePatch } from '../lib/supabase'
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

export const statsRoutes = new Hono()

// ============================================================
// GET /api/dashboard/stats — Get overall user statistics
// ============================================================
statsRoutes.get('/stats', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const stats = (await supabaseQuery(c, 'hana_user_stats', {
      select: '*',
      eq: { user_id: userId },
      limit: 1,
    })) as any[]

    if (!Array.isArray(stats) || stats.length === 0) {
      const defaultStats = {
        user_id: userId,
        affirmations_created: 0,
        affirmations_saved: 0,
        sessions_completed: 0,
        total_session_time: 0,
        streak_days: 0,
        last_session_date: null,
        created_at: new Date().toISOString(),
      }
      return c.json(defaultStats)
    }

    const userStats = stats[0]
    return c.json({
      affirmationsCreated: userStats.affirmations_created || 0,
      affirmationsSaved: userStats.affirmations_saved || 0,
      sessionsCompleted: userStats.sessions_completed || 0,
      totalSessionTime: userStats.total_session_time || 0,
      streakDays: userStats.streak_days || 0,
      lastSessionDate: userStats.last_session_date,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch stats'
    console.error('Get stats error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/dashboard/progress — Get 30-day mood trends
// ============================================================
statsRoutes.get('/progress', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const sessions = (await supabaseQuery(c, 'hana_affirmation_sessions', {
      select: 'mood,created_at',
      eq: { user_id: userId },
      limit: 100,
      order: 'created_at.desc',
    })) as any[]

    const affirmations = (await supabaseQuery(c, 'hana_affirmations', {
      select: 'category',
      eq: { user_id: userId },
      limit: 100,
    })) as any[]

    const moods: Record<string, number> = {}
    const categories: Record<string, number> = {}

    if (Array.isArray(sessions)) {
      for (const session of sessions) {
        if (session.mood) {
          moods[session.mood] = (moods[session.mood] || 0) + 1
        }
      }
    }

    if (Array.isArray(affirmations)) {
      for (const aff of affirmations) {
        if (aff.category) {
          categories[aff.category] = (categories[aff.category] || 0) + 1
        }
      }
    }

    return c.json({
      moods: Object.entries(moods).map(([mood, count]) => ({
        mood,
        count,
      })),
      categoryBreakdown: categories,
      sessionCount: Array.isArray(sessions) ? sessions.length : 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch progress'
    console.error('Get progress error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/dashboard/recent-sessions — Get last 10 sessions
// ============================================================
statsRoutes.get('/recent-sessions', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const sessions = (await supabaseQuery(c, 'hana_affirmation_sessions', {
      select: '*',
      eq: { user_id: userId },
      limit: 10,
      order: 'created_at.desc',
    })) as any[]

    if (!Array.isArray(sessions)) {
      return c.json({ sessions: [] })
    }

    return c.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        duration: s.duration_seconds || 0,
        moodBefore: s.mood || null,
        moodAfter: s.mood_after || null,
        date: s.created_at,
        affirmationIds: s.affirmation_ids || [],
      })),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch sessions'
    console.error('Get sessions error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/dashboard/favorites — Get liked affirmations
// ============================================================
statsRoutes.get('/favorites', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const likes = (await supabaseQuery(c, 'hana_affirmation_likes', {
      select: 'affirmation_id',
      eq: { user_id: userId },
      limit: 50,
    })) as any[]

    if (!Array.isArray(likes) || likes.length === 0) {
      return c.json({ favorites: [] })
    }

    const affirmationIds = likes.map((l) => l.affirmation_id)
    const favorites: any[] = []

    for (const id of affirmationIds) {
      const aff = (await supabaseQuery(c, 'hana_affirmations', {
        select: '*',
        eq: { id },
        limit: 1,
      })) as any[]

      if (Array.isArray(aff) && aff.length > 0) {
        favorites.push({
          id: aff[0].id,
          content: aff[0].content,
          category: aff[0].category,
          createdAt: aff[0].created_at,
        })
      }
    }

    return c.json({ favorites })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch favorites'
    console.error('Get favorites error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// PATCH /api/dashboard/settings — Update user preferences
// ============================================================
statsRoutes.patch('/settings', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const { theme, language, notificationsEnabled, emailNotifications } = body

    const updates: Record<string, any> = {}
    if (theme !== undefined) updates.theme = theme
    if (language !== undefined) updates.language = language
    if (notificationsEnabled !== undefined) updates.notifications_enabled = notificationsEnabled
    if (emailNotifications !== undefined) updates.email_notifications = emailNotifications

    await supabasePatch(c, 'hana_user_preferences', updates, {
      user_id: userId,
    })

    return c.json({
      message: 'Settings updated',
      settings: {
        theme,
        language,
        notificationsEnabled,
        emailNotifications,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update settings'
    console.error('Update settings error:', message)
    return c.json({ error: message }, 500)
  }
})
