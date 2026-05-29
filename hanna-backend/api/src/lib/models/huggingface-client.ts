/**
 * Hugging Face Inference Client
 * Routes generation tasks to configured HuggingFace models.
 * Degrades safely when HUGGINGFACE_API_KEY is not set.
 */

export interface HFTextResult {
  success: boolean
  text?: string
  model: string
  error?: string
}

export interface HFImageResult {
  success: boolean
  imageData?: string  // base64
  model: string
  error?: string
}

const HF_INFERENCE_BASE = 'https://api-inference.huggingface.co/models'

function getKey(env: Record<string, string | undefined>): string | null {
  return env.HUGGINGFACE_API_KEY ?? null
}

/**
 * Text generation via HuggingFace Inference API.
 */
export async function generateText(
  env: Record<string, string | undefined>,
  prompt: string,
  opts: {
    modelOverride?: string
    maxTokens?: number
    temperature?: number
  } = {}
): Promise<HFTextResult> {
  const key = getKey(env)
  if (!key) {
    return {
      success: false,
      model: 'none',
      error: 'HUGGINGFACE_API_KEY not configured. Text generation unavailable.',
    }
  }

  const model = opts.modelOverride ?? env.HANA_TEXT_MODEL ?? 'mistralai/Mistral-7B-Instruct-v0.2'

  try {
    const res = await fetch(`${HF_INFERENCE_BASE}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: opts.maxTokens ?? 512,
          temperature: opts.temperature ?? 0.7,
          return_full_text: false,
        },
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!res.ok) {
      const err = await res.text()
      return { success: false, model, error: `HF API error ${res.status}: ${err.slice(0, 200)}` }
    }

    const data = await res.json() as { generated_text?: string }[] | { generated_text?: string }
    const text = Array.isArray(data)
      ? data[0]?.generated_text
      : (data as { generated_text?: string }).generated_text

    return { success: true, text: text?.trim(), model }
  } catch (err) {
    return {
      success: false,
      model,
      error: err instanceof Error ? err.message : 'HF text generation failed',
    }
  }
}

/**
 * Image generation via HuggingFace Inference API.
 * Returns base64-encoded PNG.
 */
export async function generateImage(
  env: Record<string, string | undefined>,
  prompt: string,
  opts: { modelOverride?: string } = {}
): Promise<HFImageResult> {
  const key = getKey(env)
  if (!key) {
    return {
      success: false,
      model: 'none',
      error: 'HUGGINGFACE_API_KEY not configured.',
    }
  }

  const model =
    opts.modelOverride ?? env.HANA_IMAGE_MODEL ?? 'black-forest-labs/FLUX.1-schnell'

  try {
    const res = await fetch(`${HF_INFERENCE_BASE}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
      signal: AbortSignal.timeout(60000),
    })

    if (!res.ok) {
      const err = await res.text()
      return { success: false, model, error: `HF image API error ${res.status}: ${err.slice(0, 200)}` }
    }

    const buffer = await res.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    return { success: true, imageData: base64, model }
  } catch (err) {
    return {
      success: false,
      model,
      error: err instanceof Error ? err.message : 'HF image generation failed',
    }
  }
}

export function isHuggingFaceConfigured(env: Record<string, string | undefined>): boolean {
  return Boolean(env.HUGGINGFACE_API_KEY)
}
