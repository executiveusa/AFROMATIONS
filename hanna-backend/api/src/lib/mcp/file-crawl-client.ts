/**
 * File Crawl MCP Client
 * Ingests local documents and files for knowledge extraction.
 * Degrades safely when FILE_CRAWL_MCP_URL is not set.
 */

export interface FileCrawlConfig {
  mcpUrl: string
  apiKey: string
}

export interface FileCrawlResult {
  success: boolean
  path: string
  content?: string
  mimeType?: string
  provider: 'file-crawl' | 'unavailable'
  error?: string
}

export interface FileCrawlListResult {
  success: boolean
  files: { path: string; size: number; mimeType: string; modifiedAt: string }[]
  provider: 'file-crawl' | 'unavailable'
  error?: string
}

function getConfig(env: Record<string, string | undefined>): FileCrawlConfig | null {
  const mcpUrl = env.FILE_CRAWL_MCP_URL
  const apiKey = env.FILE_CRAWL_API_KEY
  if (!mcpUrl || !apiKey) return null
  return { mcpUrl, apiKey }
}

/**
 * Read a single file from the File Crawl MCP.
 */
export async function readFile(
  env: Record<string, string | undefined>,
  filePath: string
): Promise<FileCrawlResult> {
  const config = getConfig(env)
  if (!config) {
    return {
      success: false,
      path: filePath,
      provider: 'unavailable',
      error: 'FILE_CRAWL_MCP_URL + FILE_CRAWL_API_KEY not configured. File ingestion skipped.',
    }
  }

  try {
    const res = await fetch(`${config.mcpUrl}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: filePath }),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const err = await res.text()
      return {
        success: false,
        path: filePath,
        provider: 'file-crawl',
        error: `File Crawl read failed ${res.status}: ${err}`,
      }
    }

    const data = await res.json() as { content: string; mimeType?: string }
    return {
      success: true,
      path: filePath,
      content: data.content,
      mimeType: data.mimeType ?? 'text/plain',
      provider: 'file-crawl',
    }
  } catch (err) {
    return {
      success: false,
      path: filePath,
      provider: 'file-crawl',
      error: err instanceof Error ? err.message : 'File Crawl request failed',
    }
  }
}

/**
 * List files in a directory via File Crawl MCP.
 */
export async function listFiles(
  env: Record<string, string | undefined>,
  dirPath: string,
  pattern?: string
): Promise<FileCrawlListResult> {
  const config = getConfig(env)
  if (!config) {
    return {
      success: false,
      files: [],
      provider: 'unavailable',
      error: 'FILE_CRAWL_MCP_URL + FILE_CRAWL_API_KEY not configured.',
    }
  }

  try {
    const res = await fetch(`${config.mcpUrl}/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: dirPath, pattern }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return {
        success: false,
        files: [],
        provider: 'file-crawl',
        error: `File Crawl list failed ${res.status}`,
      }
    }

    const data = await res.json() as {
      files: { path: string; size: number; mimeType: string; modifiedAt: string }[]
    }

    return { success: true, files: data.files, provider: 'file-crawl' }
  } catch (err) {
    return {
      success: false,
      files: [],
      provider: 'file-crawl',
      error: err instanceof Error ? err.message : 'File Crawl list failed',
    }
  }
}

/**
 * Batch-read multiple files and return their concatenated content.
 */
export async function batchReadFiles(
  env: Record<string, string | undefined>,
  filePaths: string[]
): Promise<{ content: string; errors: string[] }> {
  const results = await Promise.allSettled(filePaths.map((p) => readFile(env, p)))

  const content: string[] = []
  const errors: string[] = []

  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === 'fulfilled' && r.value.success) {
      content.push(`--- File: ${filePaths[i]} ---\n${r.value.content ?? ''}`)
    } else {
      const err = r.status === 'rejected' ? r.reason : r.value.error
      errors.push(`${filePaths[i]}: ${err}`)
    }
  }

  return { content: content.join('\n\n'), errors }
}

export function isFileCrawlConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.FILE_CRAWL_MCP_URL && env.FILE_CRAWL_API_KEY)
}
