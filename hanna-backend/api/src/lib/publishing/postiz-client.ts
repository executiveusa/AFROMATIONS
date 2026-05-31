/**
 * Postiz Social Media Client
 * Queues and publishes posts via Postiz API.
 * All live publishing requires approval unless HANA_AUTOPUBLISH_ENABLED=true.
 * Dry-run mode stores payloads without sending.
 */

export interface PostizConfig {
  apiUrl: string
  apiKey: string
}

export interface PostizPost {
  platform: string
  content: string
  scheduledFor?: string
  mediaUrls?: string[]
  metadata?: Record<string, unknown>
}

export interface PostizResult {
  success: boolean
  jobId?: string
  platform: string
  dryRun: boolean
  error?: string
  payload?: unknown
}

function getConfig(env: Record<string, string | undefined>): PostizConfig | null {
  const apiUrl = env.POSTIZ_API_URL
  const apiKey = env.POSTIZ_API_KEY
  if (!apiUrl || !apiKey) return null
  return { apiUrl, apiKey }
}

export function isDryRun(env: Record<string, string | undefined>): boolean {
  return env.HANA_DRY_RUN_PUBLISHING !== 'false'
}

export function isApprovalMode(env: Record<string, string | undefined>): boolean {
  return env.HANA_PUBLISHING_APPROVAL_MODE !== 'false'
}

export function isAutopublishEnabled(env: Record<string, string | undefined>): boolean {
  return env.HANA_AUTOPUBLISH_ENABLED === 'true'
}

/**
 * Test connectivity to Postiz API.
 */
export async function testConnection(
  env: Record<string, string | undefined>
): Promise<{ connected: boolean; error?: string }> {
  const config = getConfig(env)
  if (!config) {
    return { connected: false, error: 'POSTIZ_API_URL + POSTIZ_API_KEY not configured' }
  }

  try {
    const res = await fetch(`${config.apiUrl}/api/v1/ping`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      signal: AbortSignal.timeout(8000),
    })
    return { connected: res.ok }
  } catch (err) {
    return {
      connected: false,
      error: err instanceof Error ? err.message : 'Connection failed',
    }
  }
}

/**
 * Queue a single post to Postiz.
 * In dry-run mode: returns the payload without sending.
 * In approval mode: only sends if approvalStatus === 'approved'.
 */
export async function queuePost(
  env: Record<string, string | undefined>,
  post: PostizPost,
  opts: { approvalStatus?: string } = {}
): Promise<PostizResult> {
  const dryRun = isDryRun(env)
  const approvalMode = isApprovalMode(env)
  const autopublish = isAutopublishEnabled(env)

  const payload = {
    platform: post.platform,
    content: post.content,
    scheduledFor: post.scheduledFor,
    mediaUrls: post.mediaUrls ?? [],
    metadata: post.metadata ?? {},
  }

  // Dry-run: store payload only
  if (dryRun) {
    return {
      success: true,
      platform: post.platform,
      dryRun: true,
      payload,
    }
  }

  // Approval gate
  if (!autopublish && approvalMode && opts.approvalStatus !== 'approved') {
    return {
      success: false,
      platform: post.platform,
      dryRun: false,
      error: `Publishing blocked: approval required. Current status: ${opts.approvalStatus ?? 'pending'}. Set HANA_AUTOPUBLISH_ENABLED=true to bypass.`,
      payload,
    }
  }

  const config = getConfig(env)
  if (!config) {
    return {
      success: false,
      platform: post.platform,
      dryRun: false,
      error: 'POSTIZ_API_URL + POSTIZ_API_KEY not configured',
      payload,
    }
  }

  try {
    const res = await fetch(`${config.apiUrl}/api/v1/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const err = await res.text()
      return {
        success: false,
        platform: post.platform,
        dryRun: false,
        error: `Postiz API error ${res.status}: ${err.slice(0, 200)}`,
        payload,
      }
    }

    const data = await res.json() as { id?: string; jobId?: string }
    return {
      success: true,
      jobId: data.id ?? data.jobId,
      platform: post.platform,
      dryRun: false,
    }
  } catch (err) {
    return {
      success: false,
      platform: post.platform,
      dryRun: false,
      error: err instanceof Error ? err.message : 'Postiz request failed',
      payload,
    }
  }
}

export function isPostizConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.POSTIZ_API_URL && env.POSTIZ_API_KEY)
}
