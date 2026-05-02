import { useCallback, useState } from 'react'

export interface LessonProgress {
  id: string
  user_id: string
  lesson_slug: string
  lesson_title: string
  module_number?: number
  quiz_score?: number
  completed: boolean
  time_spent_seconds: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface CourseStats {
  userId: string
  totalCompletedLessons: number
  moduleStats: Record<number, number>
  lastUpdated: string
}

export interface LessonProgressPayload {
  userId: string
  lessonSlug: string
  lessonTitle: string
  module: number
  quizScore?: number
  completed: boolean
  timeSpentSeconds?: number
}

/**
 * Save lesson progress to Supabase via API route
 */
export async function saveLessonProgress(
  payload: LessonProgressPayload
): Promise<{ success: boolean; progress?: LessonProgress }> {
  try {
    const response = await fetch('/api/education/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] Save progress error:', error)
      return { success: false }
    }

    const data = await response.json()
    return { success: true, progress: data.progress }
  } catch (error) {
    console.error('[v0] Save progress failed:', error)
    return { success: false }
  }
}

/**
 * Fetch user's lesson progress history
 */
export async function fetchLessonProgress(
  userId: string
): Promise<{ progress: LessonProgress[] }> {
  try {
    const response = await fetch(`/api/education/progress?userId=${userId}`)

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] Fetch progress error:', error)
      return { progress: [] }
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Fetch progress failed:', error)
    return { progress: [] }
  }
}

/**
 * Fetch user's course statistics
 */
export async function fetchCourseStats(userId: string): Promise<CourseStats | null> {
  try {
    const response = await fetch(`/api/education/stats?userId=${userId}`)

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] Fetch stats error:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('[v0] Fetch stats failed:', error)
    return null
  }
}

/**
 * Hook for managing lesson progress with loading and error states
 */
export function useLessonProgress() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveProgress = useCallback(async (payload: LessonProgressPayload) => {
    setLoading(true)
    setError(null)

    try {
      const result = await saveLessonProgress(payload)

      if (!result.success) {
        setError('Failed to save progress')
        return false
      }

      console.log('[v0] Progress saved successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { saveProgress, loading, error }
}

/**
 * Hook for fetching user's learning statistics
 */
export function useCourseStats(userId: string) {
  const [stats, setStats] = useState<CourseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchCourseStats(userId)

      if (result) {
        setStats(result)
      } else {
        setError('Failed to fetch stats')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [userId])

  return { stats, loading, error, fetchStats }
}

/**
 * Calculate progress percentage for a module
 */
export function calculateModuleProgress(
  progress: LessonProgress[],
  moduleNumber: number,
  totalLessonsInModule: number
): number {
  if (totalLessonsInModule === 0) return 0

  const completedInModule = progress.filter(
    (p) => p.module_number === moduleNumber && p.completed
  ).length

  return Math.round((completedInModule / totalLessonsInModule) * 100)
}

/**
 * Get average quiz score for a module
 */
export function getModuleAverageScore(
  progress: LessonProgress[],
  moduleNumber: number
): number {
  const lessonsInModule = progress.filter((p) => p.module_number === moduleNumber)
  if (lessonsInModule.length === 0) return 0

  const scores = lessonsInModule
    .filter((p) => p.quiz_score !== undefined)
    .map((p) => p.quiz_score as number)

  if (scores.length === 0) return 0

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
