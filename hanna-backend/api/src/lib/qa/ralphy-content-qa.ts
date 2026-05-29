/**
 * Ralphy Content QA
 * The quality assurance loop for all AFROMATIONS content.
 * SCAN → CLASSIFY → EVIDENCE → FIX → SCORE → PASS/FAIL
 */

import { filterContent } from '../research/transformative-content-filter'

export type ContentClass =
  | 'research'
  | 'blog'
  | 'social'
  | 'tutorial'
  | 'music_live'
  | 'monetization'
  | 'external_publishing'

export interface QAEvidence {
  sourceIds: string[]
  generatedContentId?: string
  citations: unknown[]
  originalityScore: number
  complianceNotes: string[]
}

export interface QAScore {
  originality: number       // 0-100
  usefulness: number        // 0-100
  brandFit: number          // 0-100
  productionQuality: number // 0-100
  compliance: number        // 0-100
  monetizationClarity: number // 0-100
  overall: number           // weighted average
}

export interface QAResult {
  passed: boolean
  contentClass: ContentClass
  score: QAScore
  evidence: QAEvidence
  fixes: string[]
  blockers: string[]
  recommendations: string[]
  ralphydAt: string
}

/**
 * Classify content type for appropriate QA rules.
 */
export function classifyContent(
  contentType: string,
  publishTarget?: string
): ContentClass {
  const type = contentType.toLowerCase()

  if (type.includes('blog') || type.includes('article')) return 'blog'
  if (type.includes('social') || type.includes('post')) return 'social'
  if (type.includes('tutorial') || type.includes('lesson') || type.includes('script')) return 'tutorial'
  if (type.includes('music') || type.includes('live') || type.includes('stream')) return 'music_live'
  if (type.includes('sponsor') || type.includes('wallet') || type.includes('revenue')) return 'monetization'
  if (publishTarget && publishTarget !== 'internal') return 'external_publishing'
  if (type.includes('research') || type.includes('concept') || type.includes('summary')) return 'research'

  return 'research'
}

/**
 * Score content across all QA dimensions.
 */
function scoreContent(
  content: string,
  contentClass: ContentClass,
  evidence: QAEvidence
): QAScore {
  // Originality from the transformative filter
  const originality = Math.round(evidence.originalityScore * 100)

  // Usefulness: based on content length and structured sections
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const hasStructure = /#{1,3}\s|^\d+\.|^[-*]\s/m.test(content)
  const usefulness = Math.min(
    100,
    Math.round((wordCount / 200) * 50 + (hasStructure ? 30 : 0) + 20)
  )

  // Brand fit: check for AFROMATIONS voice markers
  const brandMarkers = ['afromations', 'hana', 'anime', 'studio', 'creator']
  const lowerContent = content.toLowerCase()
  const brandHits = brandMarkers.filter((m) => lowerContent.includes(m)).length
  const brandFit = Math.min(100, brandHits * 20)

  // Production quality: check for proper structure
  const qualitySignals = [
    content.length > 200,
    !content.includes('[placeholder]'),
    !content.includes('TODO'),
    evidence.citations.length > 0,
    wordCount > 50,
  ]
  const productionQuality = Math.round((qualitySignals.filter(Boolean).length / qualitySignals.length) * 100)

  // Compliance: no legal/policy violations
  const riskWords = ['copied from', 'full transcript', 'exact script', 'auto-withdraw', 'auto-spend']
  const hasRiskWords = riskWords.some((w) => lowerContent.includes(w))
  const compliance = hasRiskWords ? 0 : evidence.complianceNotes.length === 0 ? 100 : 70

  // Monetization clarity: only relevant for monetization content
  const monetizationClarity =
    contentClass === 'monetization'
      ? lowerContent.includes('approval') ? 100 : 40
      : 100

  // Weighted overall score
  const overall = Math.round(
    originality * 0.30 +
    usefulness * 0.20 +
    brandFit * 0.15 +
    productionQuality * 0.20 +
    compliance * 0.10 +
    monetizationClarity * 0.05
  )

  return {
    originality,
    usefulness,
    brandFit,
    productionQuality,
    compliance,
    monetizationClarity,
    overall,
  }
}

/**
 * Run the full Ralphy QA loop on content.
 */
export function ralpyQA(input: {
  content: string
  contentType: string
  publishTarget?: string
  sourceTexts?: string[]
  citations?: unknown[]
  sourceIds?: string[]
  generatedContentId?: string
}): QAResult {
  const {
    content,
    contentType,
    publishTarget,
    sourceTexts = [],
    citations = [],
    sourceIds = [],
    generatedContentId,
  } = input

  const ralphydAt = new Date().toISOString()
  const fixes: string[] = []
  const blockers: string[] = []
  const recommendations: string[] = []

  // STEP 1: CLASSIFY
  const contentClass = classifyContent(contentType, publishTarget)

  // STEP 2: FILTER (copyright/originality check)
  const filterResult = filterContent({
    generatedText: content,
    sourceTexts,
    contentType: contentClass === 'blog' ? 'blog' :
      contentClass === 'social' ? 'social' :
      contentClass === 'tutorial' ? 'script' :
      'research',
  })

  const originalityScore = filterResult.similarity !== undefined
    ? 1 - filterResult.similarity
    : 0.85

  const complianceNotes: string[] = []
  if (!filterResult.safe) {
    blockers.push(filterResult.reason ?? 'Content failed originality check')
    if (filterResult.recommendations) fixes.push(...filterResult.recommendations)
  }

  // STEP 3: EVIDENCE
  const evidence: QAEvidence = {
    sourceIds,
    generatedContentId,
    citations,
    originalityScore,
    complianceNotes,
  }

  // STEP 4: FIX CHECKS
  const wordCount = content.split(/\s+/).filter(Boolean).length

  if (contentClass === 'blog' && wordCount < 150) {
    blockers.push(`Blog too short (${wordCount} words, minimum 150)`)
    fixes.push('Expand with AFROMATIONS-specific examples and production context')
  }

  if (contentClass === 'social' && wordCount > 300) {
    recommendations.push('Social post may be too long for some platforms — consider trimming')
  }

  if (citations.length === 0 && contentClass !== 'social') {
    recommendations.push('Add source citations for transparency and attribution')
  }

  if (content.includes('[') && content.includes(']')) {
    fixes.push('Fill in placeholder values marked with [brackets]')
  }

  // STEP 5: SCORE
  const score = scoreContent(content, contentClass, evidence)

  // Fail if score is too low or blockers exist
  const passed = blockers.length === 0 && score.overall >= 50 && score.compliance >= 70

  if (!passed && blockers.length === 0) {
    blockers.push(`Overall QA score too low (${score.overall}/100, minimum 50)`)
  }

  if (score.originality < 60) {
    fixes.push('Increase content originality — add more unique AFROMATIONS perspective')
  }

  return {
    passed,
    contentClass,
    score,
    evidence,
    fixes,
    blockers,
    recommendations,
    ralphydAt,
  }
}
