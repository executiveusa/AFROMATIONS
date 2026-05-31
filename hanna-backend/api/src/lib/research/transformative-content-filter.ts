/**
 * Transformative Content Filter
 * Ensures generated content is transformative and copyright-safe.
 * Blocks direct copying, checks similarity thresholds, enforces citation rules.
 */

export interface FilterResult {
  safe: boolean
  reason?: string
  similarity?: number
  recommendations?: string[]
}

export interface ContentCheckInput {
  generatedText: string
  sourceTexts?: string[]  // original texts to compare against
  contentType: 'blog' | 'social' | 'script' | 'lesson' | 'summary' | 'research'
}

// Phrases that indicate verbatim copying — must not appear in published content
const VERBATIM_COPY_SIGNALS = [
  'copied from',
  'transcript copy',
  'exact quote from',
  'as stated word for word',
  "here is their full",
  'based on the exact transcript',
  'here is the full script',
]

// Minimum originality requirements per content type
const MIN_ORIGINALITY: Record<ContentCheckInput['contentType'], number> = {
  blog: 0.75,
  social: 0.80,
  script: 0.70,
  lesson: 0.70,
  summary: 0.60,  // summaries inherently rely on source material
  research: 0.50, // internal research notes can have lower threshold
}

/**
 * Check if content contains verbatim copy signals.
 */
function hasVerbatimCopySignals(text: string): boolean {
  const lower = text.toLowerCase()
  return VERBATIM_COPY_SIGNALS.some((signal) => lower.includes(signal))
}

/**
 * Compute a simple n-gram overlap similarity between two texts.
 * Returns 0–1 where 1 is identical.
 */
function ngramSimilarity(textA: string, textB: string, n = 4): number {
  if (!textA || !textB) return 0

  const tokenize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)

  const wordsA = tokenize(textA)
  const wordsB = tokenize(textB)

  if (wordsA.length < n || wordsB.length < n) return 0

  const ngrams = (words: string[]) => {
    const s = new Set<string>()
    for (let i = 0; i <= words.length - n; i++) {
      s.add(words.slice(i, i + n).join(' '))
    }
    return s
  }

  const setA = ngrams(wordsA)
  const setB = ngrams(wordsB)

  let intersection = 0
  for (const gram of setA) {
    if (setB.has(gram)) intersection++
  }

  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

/**
 * Check if content is too similar to any source text.
 */
function checkSimilarity(generated: string, sources: string[]): number {
  if (sources.length === 0) return 0
  return Math.max(...sources.map((s) => ngramSimilarity(generated, s)))
}

/**
 * Primary filter: check content for copyright safety and originality.
 */
export function filterContent(input: ContentCheckInput): FilterResult {
  const { generatedText, sourceTexts = [], contentType } = input

  // Block verbatim copy signals
  if (hasVerbatimCopySignals(generatedText)) {
    return {
      safe: false,
      reason: 'Content contains verbatim copy signals. Rewrite from an original perspective.',
      recommendations: [
        'Rewrite in Hana\'s own educational voice',
        'Summarize concepts rather than copying text',
        'Add AFROMATIONS\'s unique perspective and examples',
      ],
    }
  }

  // Check similarity against source texts
  const similarity = checkSimilarity(generatedText, sourceTexts)
  const minOriginality = MIN_ORIGINALITY[contentType]
  const originality = 1 - similarity

  if (originality < minOriginality) {
    return {
      safe: false,
      similarity,
      reason: `Content is too similar to source material (${Math.round(similarity * 100)}% overlap). Minimum originality for ${contentType}: ${Math.round(minOriginality * 100)}%.`,
      recommendations: [
        'Add original examples specific to AFROMATIONS workflow',
        'Reframe from Hana\'s teaching perspective',
        'Include unique AFROMATIONS production tips',
        'Change structure/angle significantly',
      ],
    }
  }

  // Check minimum content length
  const wordCount = generatedText.split(/\s+/).filter(Boolean).length
  if (contentType === 'blog' && wordCount < 150) {
    return {
      safe: false,
      similarity,
      reason: `Blog post too short (${wordCount} words). Minimum: 150 words.`,
      recommendations: ['Expand with more detail, examples, and AFROMATIONS context'],
    }
  }

  if (contentType === 'social' && wordCount > 280) {
    // Not a block, just a recommendation
    return {
      safe: true,
      similarity,
      recommendations: [`Social post is ${wordCount} words — consider trimming for platform limits`],
    }
  }

  return { safe: true, similarity }
}

/**
 * Validate that a content brief has proper citation structure.
 */
export function validateCitations(citations: unknown[]): {
  valid: boolean
  missing: string[]
} {
  if (!Array.isArray(citations) || citations.length === 0) {
    return {
      valid: false,
      missing: ['At least one source citation is required'],
    }
  }

  const missing: string[] = []
  for (let i = 0; i < citations.length; i++) {
    const c = citations[i] as Record<string, unknown>
    if (!c.videoId && !c.url) missing.push(`Citation ${i + 1}: missing videoId or url`)
    if (!c.channel && !c.channelName) missing.push(`Citation ${i + 1}: missing channel name`)
  }

  return { valid: missing.length === 0, missing }
}

/**
 * Check whether a publishing policy allows this content to be published.
 */
export function canPublish(opts: {
  approvalMode: boolean
  autopublishEnabled: boolean
  approvalStatus: string
  contentType: string
}): { allowed: boolean; reason: string } {
  const { approvalMode, autopublishEnabled, approvalStatus, contentType } = opts

  if (autopublishEnabled) {
    return { allowed: true, reason: 'Autopublish enabled' }
  }

  if (approvalMode && approvalStatus !== 'approved') {
    return {
      allowed: false,
      reason: `Publishing requires approval (HANA_PUBLISHING_APPROVAL_MODE=true). Current status: ${approvalStatus}`,
    }
  }

  return { allowed: true, reason: `${contentType} cleared for publishing` }
}
