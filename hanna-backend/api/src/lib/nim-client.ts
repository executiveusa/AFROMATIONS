import type { Context } from 'hono'

interface NimConfig {
  baseUrl: string
  model: string
  apiKey?: string
  rateLimit: number // requests per minute
}

interface NimMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface NimChatRequest {
  model: string
  messages: NimMessage[]
  max_tokens?: number
  temperature?: number
}

interface NimChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

let requestCount = 0
let lastResetTime = Date.now()

function getConfig(c: Context): NimConfig {
  return {
    baseUrl: (c.env as Record<string, string>).NIM_BASE_URL ?? 'http://31.220.58.212:8082',
    model: (c.env as Record<string, string>).NIM_MODEL ?? 'moonshotai/kimi-k2-thinking',
    apiKey: (c.env as Record<string, string>).NIM_API_KEY,
    rateLimit: parseInt((c.env as Record<string, string>).NIM_RATE_LIMIT ?? '40', 10),
  }
}

async function checkRateLimit(config: NimConfig): Promise<boolean> {
  const now = Date.now()
  const minutesPassed = (now - lastResetTime) / 60000

  if (minutesPassed >= 1) {
    requestCount = 0
    lastResetTime = now
  }

  if (requestCount >= config.rateLimit) {
    return false
  }

  requestCount++
  return true
}

export async function nimChat(
  c: Context,
  messages: NimMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<NimChatResponse> {
  const config = getConfig(c)

  const allowed = await checkRateLimit(config)
  if (!allowed) {
    throw new Error(
      `NIM rate limit exceeded (${config.rateLimit} req/min). Please try again in a moment.`
    )
  }

  const payload: NimChatRequest = {
    model: config.model,
    messages,
    max_tokens: options?.maxTokens ?? 1024,
    temperature: options?.temperature ?? 0.7,
  }

  const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`NIM API error: ${res.status} ${res.statusText}. ${error}`)
  }

  return res.json() as Promise<NimChatResponse>
}

export async function generateAffirmation(
  c: Context,
  category: string,
  userContext: string,
  mood?: string
): Promise<string> {
  const systemPrompt = `You are HANA, an affirmation companion. Generate a personalized, empowering affirmation based on the user's context and mood. The affirmation should be:
- 1-2 sentences max
- Positive and actionable
- Specific to their category (${category})
- Encouraging without being preachy
- Authentic and personal`

  const userPrompt = `Category: ${category}
${mood ? `Current mood: ${mood}` : ''}
User context: ${userContext}

Generate one affirmation for this person.`

  const response = await nimChat(c, [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  const affirmation = response.choices[0]?.message?.content ?? ''
  return affirmation.trim()
}

export async function generateMultipleAffirmations(
  c: Context,
  category: string,
  userContext: string,
  count: number = 3,
  mood?: string
): Promise<string[]> {
  const systemPrompt = `You are HANA, an affirmation companion. Generate ${count} personalized, empowering affirmations based on the user's context and mood. Each affirmation should be:
- 1-2 sentences max
- Positive and actionable
- Specific to their category (${category})
- Encouraging without being preachy
- Authentic and personal
- Different from the others (varied themes)`

  const userPrompt = `Category: ${category}
${mood ? `Current mood: ${mood}` : ''}
User context: ${userContext}

Generate ${count} affirmations for this person. Return them as a numbered list (1. affirmation... 2. affirmation... etc).`

  const response = await nimChat(c, [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  const text = response.choices[0]?.message?.content ?? ''
  const affirmations = text
    .split('\n')
    .filter((line) => line.match(/^\d+\.\s/))
    .map((line) => line.replace(/^\d+\.\s/, '').trim())
    .filter((a) => a.length > 0)

  return affirmations.slice(0, count)
}

export function getNimStatus(c: Context) {
  const config = getConfig(c)
  const now = Date.now()
  const minutesPassed = (now - lastResetTime) / 60000

  if (minutesPassed >= 1) {
    requestCount = 0
    lastResetTime = now
  }

  return {
    status: 'operational',
    model: config.model,
    requestsThisMinute: requestCount,
    rateLimit: config.rateLimit,
    available: requestCount < config.rateLimit,
  }
}
