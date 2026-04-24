import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { hannaRoutes } from './routes/hanna'
import { hanaLearnerRoutes } from './routes/hana-learner'
import { hanaLessonRoutes } from './routes/hana-lesson'
import { hanaAssessRoutes } from './routes/hana-assess'
import { hanaWikiRoutes } from './routes/hana-wiki'
import { hanaMangaRoutes } from './routes/hana-manga'
import { hanaAdminRoutes } from './routes/hana-admin'
import { dashboardRoutes } from './routes/dashboard'
import { blogRoutes } from './routes/blog'
import { trendsRoutes } from './routes/trends'
import { galleryRoutes } from './routes/gallery'
import { handleScheduled } from './scheduled'
import { hanaScrapeRoutes } from './routes/hana-scrape'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GOOGLE_TRENDS_API_KEY: string
  GEMINI_API_KEY: string
  FIRECRAWL_API_KEY: string
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

// Routes — Hanna (original studio routes)
app.route('/api/hanna', hannaRoutes)

// Routes — Hana Learning OS (new comprehensive system)
app.route('/api/hana', hanaLearnerRoutes)
app.route('/api/hana', hanaLessonRoutes)
app.route('/api/hana', hanaAssessRoutes)
app.route('/api/hana', hanaWikiRoutes)
app.route('/api/hana', hanaMangaRoutes)
app.route('/api/hana', hanaAdminRoutes)

// Routes — Hana Web Skills (scrape, search, youtube transcript, research)
app.route('/api/hana', hanaScrapeRoutes)

// Routes — Blog, Trends, Gallery
app.route('/api/blog', blogRoutes)
app.route('/api/trends', trendsRoutes)
app.route('/api/gallery', galleryRoutes)

// Dashboard — Admin control panel
app.route('/dashboard', dashboardRoutes)

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
