/**
 * Concept Extractor
 * Uses Gemini to extract AI anime production concepts from video metadata.
 * Works with title + description (+ optional transcript excerpt).
 * Produces structured concept records — never raw copies of source content.
 */

export interface ExtractedConcept {
  conceptType:
    | 'tool'
    | 'workflow'
    | 'technique'
    | 'prompt_formula'
    | 'production_lesson'
    | 'content_angle'
    | 'ai_model'
    | 'general'
  title: string
  summary: string
  tools: string[]
  workflowSteps: string[]
  risks: string[]
  opportunities: string[]
  sourceCitation: {
    videoId: string
    videoTitle: string
    videoUrl: string
    channel: string
    note: string
  }
  confidence: number
}

export interface ExtractionResult {
  videoId: string
  videoTitle: string
  concepts: ExtractedConcept[]
  extractedAt: string
  modelUsed: string
  error?: string
}

const EXTRACTION_PROMPT = `You are Hana (花), an AI anime production researcher for AFROMATIONS Studios.

Your task: analyze the video metadata below and extract structured educational concepts for the AFROMATIONS knowledge base.

CRITICAL RULES:
- Extract CONCEPTS and TECHNIQUES, not the creator's specific scripts, thumbnails, or exact phrasing
- Summarize ideas in YOUR OWN WORDS from the AFROMATIONS/Hana perspective
- Never reproduce substantial text that belongs to the creator
- Focus on what would help an anime creator learn and build their own workflow
- Always cite the source video for attribution

Return a JSON array of concept objects. Each concept must have:
- conceptType: one of [tool, workflow, technique, prompt_formula, production_lesson, content_angle, ai_model, general]
- title: concise concept name (under 80 chars)
- summary: Hana's original educational summary (2-4 sentences, your own words)
- tools: array of AI/software tool names mentioned
- workflowSteps: array of workflow steps if applicable
- risks: potential challenges or gotchas
- opportunities: creative opportunities this concept enables
- confidence: 0.0–1.0 based on how clearly the concept was conveyed

Return ONLY valid JSON array. No markdown code fences. No commentary.`

export async function extractConcepts(
  env: Record<string, string | undefined>,
  video: {
    videoId: string
    title: string
    url: string
    channelName: string
    description?: string
    transcriptExcerpt?: string
    hashtags?: string[]
  }
): Promise<ExtractionResult> {
  const geminiKey = env.GEMINI_API_KEY
  const extractedAt = new Date().toISOString()

  if (!geminiKey) {
    return {
      videoId: video.videoId,
      videoTitle: video.title,
      concepts: [],
      extractedAt,
      modelUsed: 'none',
      error: 'GEMINI_API_KEY not configured — concept extraction unavailable',
    }
  }

  const inputContent = [
    `VIDEO TITLE: ${video.title}`,
    `VIDEO URL: ${video.url}`,
    `CHANNEL: ${video.channelName}`,
    video.description
      ? `DESCRIPTION (first 1000 chars):\n${video.description.slice(0, 1000)}`
      : 'DESCRIPTION: Not available',
    video.transcriptExcerpt
      ? `TRANSCRIPT EXCERPT (first 500 chars, for context only — do not reproduce):\n${video.transcriptExcerpt.slice(0, 500)}`
      : 'TRANSCRIPT: Not available — extract from title/description only',
    video.hashtags?.length
      ? `HASHTAGS: ${video.hashtags.join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${EXTRACTION_PROMPT}\n\n---\nVIDEO METADATA TO ANALYZE:\n${inputContent}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      return {
        videoId: video.videoId,
        videoTitle: video.title,
        concepts: [],
        extractedAt,
        modelUsed: 'gemini-2.0-flash',
        error: `Gemini API error ${res.status}: ${err.slice(0, 200)}`,
      }
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '[]'

    let concepts: ExtractedConcept[] = []
    try {
      const parsed = JSON.parse(rawText)
      const arr = Array.isArray(parsed) ? parsed : [parsed]

      concepts = arr.map((c: Record<string, unknown>) => ({
        conceptType: (c.conceptType as ExtractedConcept['conceptType']) ?? 'general',
        title: String(c.title ?? '').slice(0, 80),
        summary: String(c.summary ?? ''),
        tools: Array.isArray(c.tools) ? c.tools.map(String) : [],
        workflowSteps: Array.isArray(c.workflowSteps) ? c.workflowSteps.map(String) : [],
        risks: Array.isArray(c.risks) ? c.risks.map(String) : [],
        opportunities: Array.isArray(c.opportunities) ? c.opportunities.map(String) : [],
        sourceCitation: {
          videoId: video.videoId,
          videoTitle: video.title,
          videoUrl: video.url,
          channel: video.channelName,
          note: 'Concept extracted and reframed by Agent Hana for AFROMATIONS educational use. Original creator retains all rights to their specific content.',
        },
        confidence: typeof c.confidence === 'number' ? Math.min(1, Math.max(0, c.confidence)) : 0.75,
      }))
    } catch {
      return {
        videoId: video.videoId,
        videoTitle: video.title,
        concepts: [],
        extractedAt,
        modelUsed: 'gemini-2.0-flash',
        error: 'Failed to parse concept extraction response as JSON',
      }
    }

    return {
      videoId: video.videoId,
      videoTitle: video.title,
      concepts,
      extractedAt,
      modelUsed: 'gemini-2.0-flash',
    }
  } catch (err) {
    return {
      videoId: video.videoId,
      videoTitle: video.title,
      concepts: [],
      extractedAt,
      modelUsed: 'gemini-2.0-flash',
      error: err instanceof Error ? err.message : 'Concept extraction failed',
    }
  }
}

/**
 * Generate a channel intelligence summary from multiple video concepts.
 */
export async function generateChannelSummary(
  env: Record<string, string | undefined>,
  channelName: string,
  concepts: ExtractedConcept[]
): Promise<string | null> {
  const geminiKey = env.GEMINI_API_KEY
  if (!geminiKey || concepts.length === 0) return null

  const toolList = [...new Set(concepts.flatMap((c) => c.tools))].slice(0, 20)
  const conceptTitles = concepts.map((c) => `- [${c.conceptType}] ${c.title}`).join('\n')

  const prompt = `You are Hana (花), AI anime educator at AFROMATIONS Studios.

Write a brief channel intelligence summary (3-5 paragraphs) about what ${channelName} teaches about AI anime production, based on these extracted concept categories:

${conceptTitles}

Tools frequently discussed: ${toolList.join(', ')}

Write from AFROMATIONS's perspective. This is an internal research summary, not a public-facing piece. Be analytical and educational. Under 400 words.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.4 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!res.ok) return null

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
  } catch {
    return null
  }
}
