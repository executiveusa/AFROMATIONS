import { Hono } from 'hono'
import { supabaseQuery, supabaseDelete, supabasePatch, supabaseInsert } from '../lib/supabase'
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

export const notificationsRoutes = new Hono()

// ============================================================
// GET /api/notifications — Get unread notifications
// ============================================================
notificationsRoutes.get('/', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : 20
    const offset = c.req.query('offset') ? parseInt(c.req.query('offset') as string) : 0

    const notifications = (await supabaseQuery(c, 'hana_notifications', {
      select: '*',
      eq: { user_id: userId, is_read: 'false' },
      limit: limit,
      order: 'created_at.desc',
    })) as any[]

    const total = (await supabaseQuery(c, 'hana_notifications', {
      select: 'count(*)',
      eq: { user_id: userId },
    })) as any[]

    const unreadCount = (await supabaseQuery(c, 'hana_notifications', {
      select: 'count(*)',
      eq: { user_id: userId, is_read: 'false' },
    })) as any[]

    return c.json({
      notifications: Array.isArray(notifications) ? notifications : [],
      count: Array.isArray(total) && total.length > 0 ? total[0].count : 0,
      unreadCount: Array.isArray(unreadCount) && unreadCount.length > 0 ? unreadCount[0].count : 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
    console.error('Get notifications error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// PATCH /api/notifications/:id/read — Mark as read
// ============================================================
notificationsRoutes.patch('/:id/read', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notificationId = (c as any).param('id')

    await supabasePatch(
      c,
      'hana_notifications',
      { is_read: true, read_at: new Date().toISOString() },
      { id: notificationId, user_id: userId }
    )

    return c.json({ message: 'Notification marked as read' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mark as read'
    console.error('Mark notification read error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// PATCH /api/notifications/read-all — Mark all as read
// ============================================================
notificationsRoutes.patch('/read-all', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await supabasePatch(
      c,
      'hana_notifications',
      { is_read: true, read_at: new Date().toISOString() },
      { user_id: userId }
    )

    return c.json({ message: 'All notifications marked as read' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mark all as read'
    console.error('Mark all notifications read error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// DELETE /api/notifications/:id — Delete a notification
// ============================================================
notificationsRoutes.delete('/:id', async (c) => {
  try {
    const userId = extractUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const notificationId = (c as any).param('id')

    await supabaseDelete(c, 'hana_notifications', {
      id: notificationId,
      user_id: userId,
    })

    return c.json({ message: 'Notification deleted' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete notification'
    console.error('Delete notification error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// Helper: Create achievement notification
// ============================================================
export async function createAchievementNotification(
  c: Context,
  userId: string,
  title: string,
  message: string,
  achievementSlug: string
) {
  try {
    await supabaseInsert(c, 'hana_notifications', {
      user_id: userId,
      type: 'achievement_unlocked',
      title,
      message,
      data: JSON.stringify({ achievementSlug }),
      is_read: false,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Create notification error:', err)
  }
}

// ============================================================
// Helper: Create streak warning notification
// ============================================================
export async function createStreakWarningNotification(c: Context, userId: string, streakDays: number) {
  try {
    await supabaseInsert(c, 'hana_notifications', {
      user_id: userId,
      type: 'streak_warning',
      title: `🔥 Streak at Risk!`,
      message: `Your ${streakDays}-day streak ends today if you don't practice`,
      data: JSON.stringify({ streakDays }),
      is_read: false,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Create streak warning error:', err)
  }
}
