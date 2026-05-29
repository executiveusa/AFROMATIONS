/**
 * Originality Check
 * Standalone scoring for content originality — used by routes and QA.
 */

export interface OriginalityReport {
  score: number          // 0-100 (100 = fully original)
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  summary: string
  flags: string[]
  safe: boolean
}

const COPY_PHRASES = [
  'here is the full',
  'full transcript',
  'copy of the script',
  'verbatim from',
  'word for word',
  'copied from',
  'taken directly from',
]

const ORIGINALITY_MARKERS = [
  'afromations',
  'hana',
  'in our studio',
  'our approach',
  'at afromations',
  'we recommend',
  'hana suggests',
  'from our production',
]

/**
 * Compute a basic originality score for a piece of content.
 * Does not require external AI — pure heuristic scoring.
 */
export function computeOriginalityScore(
  content: string,
  sourceTexts: string[] = []
): OriginalityReport {
  const lower = content.toLowerCase()
  const flags: string[] = []

  // Check for verbatim copy signals
  const copyPhraseHits = COPY_PHRASES.filter((p) => lower.includes(p))
  if (copyPhraseHits.length > 0) {
    flags.push(`Verbatim copy phrases detected: ${copyPhraseHits.join(', ')}`)
  }

  // Check for AFROMATIONS originality markers
  const originalityHits = ORIGINALITY_MARKERS.filter((m) => lower.includes(m)).length
  const originalityBonus = Math.min(20, originalityHits * 5)

  // N-gram similarity against source texts
  let maxSimilarity = 0
  if (sourceTexts.length > 0) {
    maxSimilarity = Math.max(...sourceTexts.map((s) => ngramOverlap(content, s, 5)))
    if (maxSimilarity > 0.5) {
      flags.push(`High n-gram overlap with source (${Math.round(maxSimilarity * 100)}%)`)
    }
  }

  // Base score from similarity
  const similarityPenalty = Math.round(maxSimilarity * 60)
  const copyPhrasePenalty = copyPhraseHits.length * 15
  const baseScore = 100 - similarityPenalty - copyPhrasePenalty + originalityBonus

  const score = Math.max(0, Math.min(100, baseScore))

  let grade: OriginalityReport['grade']
  if (score >= 85) grade = 'A'
  else if (score >= 70) grade = 'B'
  else if (score >= 55) grade = 'C'
  else if (score >= 40) grade = 'D'
  else grade = 'F'

  const safe = score >= 55 && copyPhraseHits.length === 0

  const summary =
    safe
      ? `Content appears original (score: ${score}/100). Suitable for AFROMATIONS publishing.`
      : `Content needs revision (score: ${score}/100). ${flags.join('. ')}`

  return { score, grade, summary, flags, safe }
}

function ngramOverlap(textA: string, textB: string, n: number): number {
  const tokenize = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)

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
  for (const g of setA) if (setB.has(g)) intersection++
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}
