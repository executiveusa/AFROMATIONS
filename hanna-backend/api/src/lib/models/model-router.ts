/**
 * Model Router
 * Routes content generation tasks to the appropriate AI model.
 * Primary: Gemini (already integrated). Secondary: HuggingFace.
 */

import { buildPrompt, type TaskPreset } from './anime-generation-presets'
import { generateText as hfGenerateText } from './huggingface-client'

export interface GenerationResult {
  success: boolean
  content?: string
  task: TaskPreset
  model: string
  error?: string
  generatedAt: string
}

/**
 * Generate content via Gemini (primary model).
 */
async function generateViaGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string | null> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
      signal: AbortSignal.timeout(45000),
    }
  )

  if (!res.ok) return null

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
}

/**
 * Route a generation task to the best available model.
 * Priority: Gemini → HuggingFace → error
 */
export async function generateContent(
  env: Record<string, string | undefined>,
  task: TaskPreset,
  vars: Record<string, string>
): Promise<GenerationResult> {
  const { systemPrompt, userPrompt, maxTokens, temperature } = buildPrompt(task, vars)
  const generatedAt = new Date().toISOString()

  // Try Gemini first
  const geminiKey = env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const content = await generateViaGemini(
        geminiKey,
        systemPrompt,
        userPrompt,
        maxTokens,
        temperature
      )
      if (content) {
        return { success: true, content, task, model: 'gemini-2.0-flash', generatedAt }
      }
    } catch {
      // Fall through to HuggingFace
    }
  }

  // Fall back to HuggingFace
  const hfResult = await hfGenerateText(env, `${systemPrompt}\n\n${userPrompt}`, {
    maxTokens,
    temperature,
  })

  if (hfResult.success && hfResult.text) {
    return {
      success: true,
      content: hfResult.text,
      task,
      model: hfResult.model,
      generatedAt,
    }
  }

  return {
    success: false,
    task,
    model: 'none',
    generatedAt,
    error: 'No AI model available. Set GEMINI_API_KEY or HUGGINGFACE_API_KEY.',
  }
}
