/**
 * HANA MASTERY ENGINE
 *
 * Scoring, assessment evaluation, and domain mastery calculation.
 * Real logic, not placeholder.
 */

export interface MasteryScore {
  domain: string
  subdomain?: string
  score: number // 0-100
  level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1' | 'advanced' | 'expert'
  evidenceCount: number
  lastTestedAt?: string
  trend?: number // -10 to +10, week-over-week change
}

export interface AssessmentResult {
  questionId: string
  response: string
  expectedPattern?: string
  score: number // 0-100
  feedback: {
    ja: string
    en: string
  }
}

export interface LessonAttempt {
  lessonId: string
  attempts: number
  bestScore: number
  lastScore: number
  mastered: boolean
  masteredAt?: string
}

/**
 * Calculate JLPT-equivalent level from mastery score
 * JLPT levels: N5 (beginner) → N1 (fluent) → Advanced/Expert
 */
export function scoreToLevel(
  score: number
): 'n5' | 'n4' | 'n3' | 'n2' | 'n1' | 'advanced' | 'expert' {
  if (score < 20) return 'n5'
  if (score < 35) return 'n5'
  if (score < 50) return 'n4'
  if (score < 65) return 'n3'
  if (score < 80) return 'n2'
  if (score < 92) return 'n1'
  if (score < 98) return 'advanced'
  return 'expert'
}

/**
 * Calculate domain mastery from multiple assessment attempts.
 * Uses exponential moving average to weight recent attempts higher.
 *
 * Formula: EMA = (Current Score × 0.3) + (Previous EMA × 0.7)
 * This gives ~70% weight to history, ~30% to current attempt.
 */
export function calculateDomainMastery(
  assessmentScores: number[],
  previousMastery?: number
): number {
  if (assessmentScores.length === 0) return 0

  let ema = previousMastery ?? 0

  for (const score of assessmentScores) {
    ema = score * 0.3 + ema * 0.7
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(ema)))
}

/**
 * Calculate trend (week-over-week improvement).
 * Returns -10 to +10 indicating direction and magnitude of change.
 */
export function calculateTrend(
  currentWeekScores: number[],
  previousWeekScores: number[]
): number {
  if (currentWeekScores.length === 0 || previousWeekScores.length === 0) {
    return 0
  }

  const currentAvg =
    currentWeekScores.reduce((a, b) => a + b, 0) / currentWeekScores.length
  const previousAvg =
    previousWeekScores.reduce((a, b) => a + b, 0) / previousWeekScores.length

  const diff = currentAvg - previousAvg

  // Scale to -10 to +10 range
  const trend = Math.max(-10, Math.min(10, Math.round(diff / 5)))

  return trend
}

/**
 * Score oral production assessment.
 * Evaluates: pronunciation, grammar, vocabulary appropriateness, fluency
 *
 * Rubric:
 * - Grammar correctness: 30%
 * - Vocabulary appropriateness: 25%
 * - Pronunciation clarity: 25%
 * - Fluency/hesitation: 20%
 */
export function scoreOralProduction(input: {
  grammarErrors: number // count of errors found
  vocabularyLevel: 'below' | 'appropriate' | 'advanced' // vs expected difficulty
  pronunciationIssues: number // count of pronunciation problems
  hesitationCount: number // number of long pauses
  expectedDifficulty: 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
}): AssessmentResult {
  let score = 100

  // Grammar: -2 per error (max -30)
  score -= Math.min(30, input.grammarErrors * 2)

  // Vocabulary: -25 if below, +10 if advanced
  if (input.vocabularyLevel === 'below') {
    score -= 25
  } else if (input.vocabularyLevel === 'advanced') {
    score += 10
  }

  // Pronunciation: -2 per issue (max -25)
  score -= Math.min(25, input.pronunciationIssues * 2)

  // Fluency: -1 per hesitation (max -20)
  score -= Math.min(20, input.hesitationCount * 1)

  // Clamp
  score = Math.max(0, Math.min(100, score))

  return {
    questionId: '',
    response: '[audio]',
    score,
    feedback: {
      ja: score >= 80 ? '素晴らしい発音です。' : 'もう少し練習が必要です。',
      en:
        score >= 80
          ? 'Excellent pronunciation.'
          : 'Keep practicing your pronunciation.',
    },
  }
}

/**
 * Score listening comprehension.
 * Based on questions answered correctly and explanation quality.
 *
 * Score = (Questions Correct / Total) × 100
 * Bonus: +10% if explanation shows understanding beyond rote recall
 */
export function scoreListeningComprehension(input: {
  totalQuestions: number
  correctAnswers: number
  explanationQuality: 'none' | 'partial' | 'complete' // learner's explanation of understanding
}): AssessmentResult {
  let score = (input.correctAnswers / input.totalQuestions) * 100

  // Explanation bonus
  if (input.explanationQuality === 'complete') {
    score = Math.min(100, score + 10)
  } else if (input.explanationQuality === 'partial') {
    score = Math.min(100, score + 5)
  }

  return {
    questionId: '',
    response: '[listening]',
    score: Math.round(score),
    feedback: {
      ja:
        score >= 80
          ? '聞き取りが上手ですね。'
          : '何度も聞き直してください。',
      en:
        score >= 80
          ? 'Good listening comprehension.'
          : 'Listen again carefully.',
    },
  }
}

/**
 * Score reading comprehension.
 * Based on questions answered + comprehension depth.
 *
 * Score = (Questions Correct / Total) × 100
 * Depth check: Can learner infer meaning from context?
 */
export function scoreReadingComprehension(input: {
  totalQuestions: number
  correctAnswers: number
  inferenceCorrect: boolean // Did learner correctly infer meaning from context?
  vocabularyUsed: number // How many new vocabulary items did they look up?
}): AssessmentResult {
  let score = (input.correctAnswers / input.totalQuestions) * 100

  // Inference bonus (shows deeper understanding)
  if (input.inferenceCorrect) {
    score = Math.min(100, score + 8)
  }

  // Penalty if using too many lookups (suggests lack of comprehension)
  if (input.vocabularyUsed > 5) {
    score = Math.max(0, score - 5)
  }

  return {
    questionId: '',
    response: '[reading]',
    score: Math.round(score),
    feedback: {
      ja:
        score >= 80
          ? '読解力が良くなっています。'
          : 'より多く読んでください。',
      en:
        score >= 80
          ? 'Your reading comprehension is improving.'
          : 'Read more material.',
    },
  }
}

/**
 * Score cultural understanding.
 * Knowledge of context, etiquette, meaning behind practices.
 *
 * Score = (Correct Answers / Total) × 100
 * Bonus: If learner can explain WHY something matters in Japanese context
 */
export function scoreCulturalUnderstanding(input: {
  totalQuestions: number
  correctAnswers: number
  contextualExplanation: boolean // Did learner explain cultural context, not just facts?
}): AssessmentResult {
  let score = (input.correctAnswers / input.totalQuestions) * 100

  // Contextual understanding bonus
  if (input.contextualExplanation) {
    score = Math.min(100, score + 15)
  }

  return {
    questionId: '',
    response: '[culture]',
    score: Math.round(score),
    feedback: {
      ja:
        score >= 80
          ? '日本文化をよく理解しています。'
          : '文化的背景を学びましょう。',
      en:
        score >= 80
          ? 'You understand Japanese culture well.'
          : 'Study the cultural background.',
    },
  }
}

/**
 * Determine if lesson should be marked as "mastered".
 * Requires: 80% on mastery threshold AND evidence of multiple successful attempts
 */
export function determineMastery(input: {
  currentScore: number
  masteryThreshold: number // typically 0.80 (80%)
  totalAttempts: number
  bestScoreEver: number
}): boolean {
  // Must meet threshold
  if (input.currentScore < input.masteryThreshold * 100) {
    return false
  }

  // Must have attempted at least twice (shows reinforcement, not lucky guess)
  if (input.totalAttempts < 2) {
    return false
  }

  // Best score ever must also meet or exceed threshold
  if (input.bestScoreEver < input.masteryThreshold * 100) {
    return false
  }

  return true
}

/**
 * Check if learner qualifies to unlock a manga issue.
 *
 * Example unlock requirements:
 * {
 *   "daily_life": 60,
 *   "yokai_lore": 75,
 *   "min_total_mastery": 65
 * }
 */
export function checkMangaUnlockEligibility(
  learnerMastery: Record<string, number>,
  unlockRequirements: Record<string, number>
): { eligible: boolean; missing: string[] } {
  const missing: string[] = []

  for (const [domain, requiredScore] of Object.entries(unlockRequirements)) {
    const learnerScore = learnerMastery[domain] ?? 0

    if (learnerScore < requiredScore) {
      missing.push(`${domain} (${learnerScore}/${requiredScore})`)
    }
  }

  return {
    eligible: missing.length === 0,
    missing,
  }
}

/**
 * Calculate overall learner proficiency estimate.
 * Weighted average across all domains.
 */
export function calculateOverallProficiency(
  mastery: Record<string, number>,
  weights?: Record<string, number>
): number {
  const domains = Object.keys(mastery)

  if (domains.length === 0) return 0

  // Default: equal weight to all domains
  const defaultWeight = 1 / domains.length

  let total = 0
  let weightSum = 0

  for (const domain of domains) {
    const score = mastery[domain] ?? 0
    const weight = weights?.[domain] ?? defaultWeight

    total += score * weight
    weightSum += weight
  }

  return Math.round(total / (weightSum || 1))
}

/**
 * Generate streak calculation.
 * Track consecutive days of study.
 */
export function updateStreak(input: {
  lastStudyDate: string | null // ISO date string
  currentDate: string // ISO date string
  currentStreak: number
}): number {
  if (!input.lastStudyDate) {
    return 1 // First study session
  }

  const lastDate = new Date(input.lastStudyDate)
  const currentDate = new Date(input.currentDate)

  // Check if studied today already
  if (lastDate.toDateString() === currentDate.toDateString()) {
    return input.currentStreak // No change
  }

  const diffDays = Math.floor(
    (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 1) {
    // Studied yesterday → continue streak
    return input.currentStreak + 1
  } else {
    // Gap in study → reset streak
    return 1
  }
}

/**
 * Suggest next lesson based on:
 * 1. Learner's current mastery levels
 * 2. Learning path (prerequisites)
 * 3. Study patterns (frequency, time of day)
 */
export interface NextLessonSuggestion {
  lessonId: string
  reason: string
  difficulty: string
  estimatedTimeMinutes: number
  prerequisitesComplete: boolean
}

export function suggestNextLesson(input: {
  completedLessonIds: string[]
  masterySscores: Record<string, number>
  availableLessons: Array<{
    id: string
    domain: string
    difficulty: string
    prerequisites: string[]
    estimatedMinutes: number
  }>
}): NextLessonSuggestion | null {
  // Filter: only lessons with all prerequisites completed
  const available = input.availableLessons.filter((lesson) =>
    lesson.prerequisites.every((prereq) =>
      input.completedLessonIds.includes(prereq)
    )
  )

  if (available.length === 0) {
    return null
  }

  // Strategy: Find the domain with lowest mastery, then pick easiest available lesson
  const lowestDomain = Object.entries(input.masterySscores).reduce(
    (min, [domain, score]) => (score < min.score ? { domain, score } : min),
    { domain: '', score: 100 }
  )

  // Find a lesson in the lowest domain
  const suggestion = available.find(
    (lesson) => lesson.domain === lowestDomain.domain
  )

  if (!suggestion) {
    // Fallback: just take the first available
    const fallback = available[0]
    return {
      lessonId: fallback.id,
      reason: 'Continue your learning path',
      difficulty: fallback.difficulty,
      estimatedTimeMinutes: fallback.estimatedMinutes,
      prerequisitesComplete: true,
    }
  }

  return {
    lessonId: suggestion.id,
    reason: `Strengthen your ${lowestDomain.domain} skills`,
    difficulty: suggestion.difficulty,
    estimatedTimeMinutes: suggestion.estimatedMinutes,
    prerequisitesComplete: true,
  }
}

/**
 * Export mastery data for learner's progress dashboard.
 * Shows: current scores, trends, next targets
 */
export interface MasteryDashboard {
  overallScore: number
  level: string
  studyStreak: number
  domainBreakdown: Array<{
    domain: string
    score: number
    level: string
    trend: number
  }>
  nextUnlock?: {
    title: string
    requirementsMissing: string[]
  }
  recentAssessments: Array<{
    domain: string
    score: number
    timestamp: string
  }>
}

export function generateMasteryDashboard(input: {
  learnerId: string
  allMastery: Record<string, number>
  recentAssessments: Array<{ domain: string; score: number; date: string }>
  upcomingMangaUnlock?: {
    title: string
    requirements: Record<string, number>
  }
  streak: number
}): MasteryDashboard {
  const overallScore = calculateOverallProficiency(input.allMastery)
  const level = scoreToLevel(overallScore)

  const domainBreakdown = Object.entries(input.allMastery).map(
    ([domain, score]) => {
      const domainAssessments = input.recentAssessments.filter(
        (a) => a.domain === domain
      )
      const trend = calculateTrend(
        domainAssessments
          .slice(-3)
          .map((a) => a.score),
        domainAssessments
          .slice(-6, -3)
          .map((a) => a.score)
      )

      return {
        domain,
        score: Math.round(score),
        level: scoreToLevel(score),
        trend,
      }
    }
  )

  return {
    overallScore: Math.round(overallScore),
    level,
    studyStreak: input.streak,
    domainBreakdown,
    nextUnlock: input.upcomingMangaUnlock
      ? {
          title: input.upcomingMangaUnlock.title,
          requirementsMissing: Object.entries(
            input.upcomingMangaUnlock.requirements
          )
            .filter(
              ([domain, required]) =>
                (input.allMastery[domain] ?? 0) < required
            )
            .map(
              ([domain, required]) =>
                `${domain}: ${input.allMastery[domain] ?? 0}/${required}`
            ),
        }
      : undefined,
    recentAssessments: input.recentAssessments.slice(-10),
  }
}
