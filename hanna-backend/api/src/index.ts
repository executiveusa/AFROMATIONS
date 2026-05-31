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
import { authRoutes } from './routes/auth'
import { affirmationsRoutes } from './routes/affirmations'
// Hana Anime Harness routes
import { hanaResearchRoutes } from './routes/hana-research'
import { hanaContentRoutes } from './routes/hana-content'
import { hanaPublishingRoutes } from './routes/hana-publishing'
import { hanaCronRoutes } from './routes/hana-cron'
import { hanaMailRoutes } from './routes/hana-mail'
import { hanaWalletRoutes } from './routes/hana-wallet'
import { hanaHarnessHealthRoutes } from './routes/hana-harness-health'
import { artistApplicationRoutes } from './routes/artist-application'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GOOGLE_TRENDS_API_KEY: string
  GEMINI_API_KEY: string
  FIRECRAWL_API_KEY: string
  STUDIO_NAME: string
  AGENT_NAME: string
  // NVIDIA NIM
  NIM_BASE_URL?: string
  NIM_MODEL?: string
  NIM_API_KEY?: string
  NIM_RATE_LIMIT?: string
  // Hana Anime Harness
  BRIGHT_DATA_MCP_URL: string
  BRIGHT_DATA_API_KEY: string
  FILE_CRAWL_MCP_URL: string
  FILE_CRAWL_API_KEY: string
  YOUTUBE_DATA_API_KEY: string
  TRANSCRIPT_PROVIDER_API_KEY: string
  HUGGINGFACE_API_KEY: string
  POSTIZ_API_URL: string
  POSTIZ_API_KEY: string
  AGENTMAIL_API_URL: string
  AGENTMAIL_API_KEY: string
  HANA_PUBLISHING_APPROVAL_MODE: string
  HANA_DRY_RUN_PUBLISHING: string
  HANA_AUTOPUBLISH_ENABLED: string
  HANA_TEXT_MODEL: string
  HANA_IMAGE_MODEL: string
  HANA_AUDIO_MODEL: string
  HANA_VIDEO_MODEL: string
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

// Routes — Authentication and Affirmations (HANA Dashboard)
app.route('/api/auth', authRoutes)
app.route('/api/affirmations', affirmationsRoutes)

// Routes — Hana Anime Harness
app.route('/api/hana', hanaResearchRoutes)
app.route('/api/hana', hanaContentRoutes)
app.route('/api/hana', hanaPublishingRoutes)
app.route('/api/hana', hanaCronRoutes)
app.route('/api/hana', hanaMailRoutes)
app.route('/api/hana', hanaWalletRoutes)
app.route('/api/hana', hanaHarnessHealthRoutes)

// Routes — Artist Partner Platform
app.route('/api', artistApplicationRoutes)

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
