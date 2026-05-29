import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert, supabasePatch } from '../lib/supabase'
import { getNimStatus } from '../lib/nim-client'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const refreshSchema = z.object({
  refreshToken: z.string(),
})

export const authRoutes = new Hono()

// Simple JWT-like token generation (in production, use a proper JWT library)
function generateToken(userId: string, expiresIn: number = 86400000) {
  // Returns a simple token format: userId.timestamp.hash
  const timestamp = Date.now()
  const expires = timestamp + expiresIn
  const payload = `${userId}.${timestamp}.${expires}`
  // In production, sign this with a secret key
  return {
    accessToken: Buffer.from(payload).toString('base64'),
    refreshToken: Buffer.from(`${userId}.${timestamp}`).toString('base64'),
    expiresIn,
    expiresAt: new Date(expires).toISOString(),
  }
}

// ============================================================
// POST /api/auth/register — Create new user
// ============================================================
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  try {
    const body = c.req.valid('json')

    // Check if user already exists
    const existing = await supabaseQuery(c, 'hana_users', {
      select: 'id',
      eq: { email: body.email },
      limit: 1,
    })

    if (Array.isArray(existing) && existing.length > 0) {
      return c.json({ error: 'Email already registered' }, 409)
    }

    // Hash password (in production, use bcrypt)
    const passwordHash = Buffer.from(body.password).toString('base64')

    // Create user
    const result = await supabaseInsert(c, 'hana_users', {
      email: body.email,
      password_hash: passwordHash,
      display_name: body.displayName,
      subscription_tier: 'free',
      created_at: new Date().toISOString(),
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Failed to create user' }, 500)
    }

    const user = result[0]
    const { accessToken, refreshToken, expiresAt } = generateToken(user.id)

    // Create user preferences record
    await supabaseInsert(c, 'hana_user_preferences', {
      user_id: user.id,
      theme: 'dark',
      notifications_enabled: true,
      language: 'en',
    })

    return c.json(
      {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        accessToken,
        refreshToken,
        expiresAt,
      },
      201
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    console.error('Register error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/auth/login — Authenticate user
// ============================================================
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const body = c.req.valid('json')

    // Find user by email
    const users = await supabaseQuery(c, 'hana_users', {
      eq: { email: body.email },
      limit: 1,
    })

    if (!Array.isArray(users) || users.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const user = users[0]

    // Verify password (in production, use bcrypt.compare)
    const passwordHash = Buffer.from(body.password).toString('base64')
    if (user.password_hash !== passwordHash) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const { accessToken, refreshToken, expiresAt } = generateToken(user.id)

    // Log login event
    try {
      await supabaseInsert(c, 'hana_audit_log', {
        user_id: user.id,
        action: 'login',
        timestamp: new Date().toISOString(),
      })
    } catch {
      // Ignore audit log failures
    }

    return c.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      subscriptionTier: user.subscription_tier,
      accessToken,
      refreshToken,
      expiresAt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    console.error('Login error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/auth/refresh — Refresh access token
// ============================================================
authRoutes.post('/refresh', zValidator('json', refreshSchema), async (c) => {
  try {
    const body = c.req.valid('json')

    // Decode refresh token (in production, verify signature)
    const decoded = Buffer.from(body.refreshToken, 'base64').toString('utf-8')
    const [userId] = decoded.split('.')

    if (!userId) {
      return c.json({ error: 'Invalid refresh token' }, 401)
    }

    // Verify user still exists
    const users = await supabaseQuery(c, 'hana_users', {
      select: 'id',
      eq: { id: userId },
      limit: 1,
    })

    if (!Array.isArray(users) || users.length === 0) {
      return c.json({ error: 'User not found' }, 401)
    }

    const { accessToken, expiresAt } = generateToken(userId)

    return c.json({
      accessToken,
      expiresAt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token refresh failed'
    console.error('Refresh error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// GET /api/auth/status — Check auth status and NIM availability
// ============================================================
authRoutes.get('/status', async (c) => {
  try {
    const nimStatus = getNimStatus(c)

    return c.json({
      auth: 'operational',
      nim: nimStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Status check failed'
    console.error('Status error:', message)
    return c.json({ error: message }, 500)
  }
})

// ============================================================
// POST /api/auth/logout — Logout (client-side token deletion)
// ============================================================
authRoutes.post('/logout', async (c) => {
  // Logout is primarily client-side (token deletion)
  // But we can log it for audit purposes
  try {
    const authHeader = c.req.header('Authorization')
    if (authHeader) {
      // Could parse token and log audit event
      // For now, just return success
    }

    return c.json({ message: 'Logout successful' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Logout failed'
    return c.json({ error: message }, 500)
  }
})
