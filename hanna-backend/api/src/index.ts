import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { hannaRoutes } from './routes/hanna'
import { blogRoutes } from './routes/blog'
import { trendsRoutes } from './routes/trends'
import { galleryRoutes } from './routes/gallery'
import { handleScheduled } from './scheduled'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GOOGLE_TRENDS_API_KEY: string
  GEMINI_API_KEY: string
  STUDIO_NAME: string
  AGENT_NAME: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [
      'https://afromations.pages.dev',
      'https://afromations.vercel.app',
      'https://afromations.studio',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
)

// Health check
app.get('/api/health', (c) =>
  c.json({
    status: 'operational',
    agent: c.env.AGENT_NAME,
    studio: c.env.STUDIO_NAME,
    timestamp: new Date().toISOString(),
  })
)

// Routes
app.route('/api/hanna', hannaRoutes)
app.route('/api/blog', blogRoutes)
app.route('/api/trends', trendsRoutes)
app.route('/api/gallery', galleryRoutes)

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err.message)
  return c.json({ error: 'Internal server error' }, 500)
})

export default {
  fetch: app.fetch,
  scheduled: handleScheduled,
}
