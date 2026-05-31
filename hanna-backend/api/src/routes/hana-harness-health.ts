import { Hono } from 'hono'
import { isBrightDataConfigured } from '../lib/mcp/bright-data-client'
import { isFileCrawlConfigured } from '../lib/mcp/file-crawl-client'
import { isPostizConfigured, isDryRun, isApprovalMode, isAutopublishEnabled } from '../lib/publishing/postiz-client'
import { isHuggingFaceConfigured } from '../lib/models/huggingface-client'
import { isAgentMailConfigured } from '../lib/mail/agent-mail-client'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  GEMINI_API_KEY: string
  FIRECRAWL_API_KEY: string
  BRIGHT_DATA_MCP_URL: string
  BRIGHT_DATA_API_KEY: string
  FILE_CRAWL_MCP_URL: string
  FILE_CRAWL_API_KEY: string
  YOUTUBE_DATA_API_KEY: string
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
}

export const hanaHarnessHealthRoutes = new Hono<{ Bindings: Bindings }>()

hanaHarnessHealthRoutes.get('/harness/health', (c) => {
  const env = c.env as unknown as Record<string, string | undefined>

  const integrations = {
    bright_data_mcp: {
      configured: isBrightDataConfigured(env),
      note: isBrightDataConfigured(env)
        ? 'Ready'
        : 'Set BRIGHT_DATA_MCP_URL + BRIGHT_DATA_API_KEY. Firecrawl used as fallback.',
    },
    file_crawl_mcp: {
      configured: isFileCrawlConfigured(env),
      note: isFileCrawlConfigured(env)
        ? 'Ready'
        : 'Set FILE_CRAWL_MCP_URL + FILE_CRAWL_API_KEY. Local file ingestion disabled.',
    },
    youtube_api: {
      configured: Boolean(env.YOUTUBE_DATA_API_KEY),
      note: env.YOUTUBE_DATA_API_KEY
        ? 'YouTube Data API v3 enabled'
        : 'Set YOUTUBE_DATA_API_KEY. Page scraping used as fallback.',
    },
    gemini: {
      configured: Boolean(env.GEMINI_API_KEY),
      note: env.GEMINI_API_KEY ? 'Primary AI model ready' : 'Set GEMINI_API_KEY for AI generation.',
    },
    hugging_face: {
      configured: isHuggingFaceConfigured(env),
      model_text: env.HANA_TEXT_MODEL ?? 'default: mistralai/Mistral-7B-Instruct-v0.2',
      model_image: env.HANA_IMAGE_MODEL ?? 'default: black-forest-labs/FLUX.1-schnell',
      note: isHuggingFaceConfigured(env)
        ? 'HuggingFace fallback ready'
        : 'Set HUGGINGFACE_API_KEY. Falls back to Gemini only.',
    },
    postiz: {
      configured: isPostizConfigured(env),
      note: isPostizConfigured(env)
        ? 'Social publishing ready'
        : 'Set POSTIZ_API_URL + POSTIZ_API_KEY. Posts queued internally.',
    },
    agentmail: {
      configured: isAgentMailConfigured(env),
      note: isAgentMailConfigured(env)
        ? 'AgentMail ready'
        : 'Set AGENTMAIL_API_URL + AGENTMAIL_API_KEY. Emails stored as drafts.',
    },
    supabase: {
      configured: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY),
      url: env.SUPABASE_URL ?? 'not set',
      note: env.SUPABASE_URL ? 'Database ready' : 'Set SUPABASE_URL + SUPABASE_SERVICE_KEY.',
    },
    firecrawl: {
      configured: Boolean(env.FIRECRAWL_API_KEY),
      note: env.FIRECRAWL_API_KEY
        ? 'Firecrawl scraping ready (Bright Data fallback)'
        : 'Set FIRECRAWL_API_KEY for web scraping.',
    },
  }

  const policy = {
    approval_mode: isApprovalMode(env),
    dry_run_publishing: isDryRun(env),
    autopublish_enabled: isAutopublishEnabled(env),
    payout_auto_execution: false,
    note: 'Payout auto-execution is permanently disabled. Human approval always required for money movement.',
  }

  const configuredCount = Object.values(integrations).filter((i) => i.configured).length
  const totalCount = Object.keys(integrations).length
  const readiness = Math.round((configuredCount / totalCount) * 100)

  return c.json({
    status: 'operational',
    system: 'HANA ANIME HARNESS',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    readiness: `${readiness}% (${configuredCount}/${totalCount} integrations configured)`,
    integrations,
    policy,
    routes: {
      research: '/api/hana/research/*',
      content: '/api/hana/content/*',
      publishing: '/api/hana/publishing/*',
      cron: '/api/hana/cron/*',
      mail: '/api/hana/mail/*',
      wallet: '/api/hana/wallet/*',
      health: '/api/hana/harness/health',
    },
  })
})
