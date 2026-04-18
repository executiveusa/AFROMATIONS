import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert } from '../lib/supabase'
import { suggestNextLesson } from '../lib/hana-mastery'

const startLessonSchema = z.object({
  learnerId: z.string().uuid(),
})

const completeLessonSchema = z.object({
  learnerId: z.string().uuid(),
  score: z.number().min(0).max(100),
  durationSeconds: z.number().int().min(1),
})

export const hanaLessonRoutes = new Hono()

// ============================================================
// GET /api/hana/lesson — List lessons (filtered by domain, difficulty)
// ============================================================
hanaLessonRoutes.get('/lesson', async (c) => {
  try {
    const domain = c.req.query('domain') // optional filter
    const difficulty = c.req.query('difficulty') // optional filter
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20

    let query = supabaseQuery(c, 'hana_lessons', {
      select: 'id,title_ja,title_en,lesson_type,difficulty,domain,estimated_duration_minutes,cover_image_url',
      limit,
    })

    // In production, add filters:
    // if (domain) query = query.eq({ domain })
    // if (difficulty) query = query.eq({ difficulty })

    const result = await query

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch lessons' }, 500)
    }

    return c.json({
      count: result.length,
      lessons: result.map((lesson) => ({
        id: lesson.id,
        titleJa: lesson.title_ja,
        titleEn: lesson.title_en,
        type: lesson.lesson_type,
        difficulty: lesson.difficulty,
        domain: lesson.domain,
        durationMinutes: lesson.estimated_duration_minutes,
        coverImageUrl: lesson.cover_image_url,
      })),
    })
  } catch (error) {
    console.error('List lessons error:', error)
    return c.json({ error: 'Failed to fetch lessons' }, 500)
  }
})

// ============================================================
// GET /api/hana/lesson/:id — Get specific lesson
// ============================================================
hanaLessonRoutes.get('/lesson/:id', async (c) => {
  try {
    const lessonId = c.req.param('id')

    const result = await supabaseQuery(c, 'hana_lessons', {
      eq: { id: lessonId },
      limit: 1,
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Lesson not found' }, 404)
    }

    const lesson = result[0]

    return c.json({
      id: lesson.id,
      titleJa: lesson.title_ja,
      titleEn: lesson.title_en,
      type: lesson.lesson_type,
      difficulty: lesson.difficulty,
      domain: lesson.domain,
      content: lesson.content, // { sentences, vocab, grammar_points }
      learningObjectives: lesson.learning_objectives,
      prerequisites: lesson.prerequisites,
      durationMinutes: lesson.estimated_duration_minutes,
      masteryThreshold: lesson.mastery_threshold,
      coverImageUrl: lesson.cover_image_url,
    })
  } catch (error) {
    console.error('Get lesson error:', error)
    return c.json({ error: 'Failed to fetch lesson' }, 500)
  }
})

// ============================================================
// GET /api/hana/lesson/next/:learnerId — Get recommended next lesson
// ============================================================
hanaLessonRoutes.get('/lesson/next/:learnerId', async (c) => {
  try {
    const learnerId = c.req.param('learnerId')

    // Fetch learner's mastery scores
    const masteryResult = await supabaseQuery(c, 'hana_mastery', {
      select: 'domain,score',
      eq: { learner_id: learnerId },
    })

    if (!Array.isArray(masteryResult)) {
      return c.json({ error: 'Failed to fetch learner mastery' }, 500)
    }

    // Build mastery map
    const masteryScores: Record<string, number> = {}
    for (const m of masteryResult) {
      masteryScores[m.domain] = m.score
    }

    // Fetch completed lessons
    const progressResult = await supabaseQuery(c, 'hana_progress', {
      select: 'lesson_id,mastered',
      eq: { learner_id: learnerId, mastered: true },
    })

    if (!Array.isArray(progressResult)) {
      return c.json({ error: 'Failed to fetch progress' }, 500)
    }

    const completedLessonIds = progressResult.map((p) => p.lesson_id)

    // Fetch available lessons
    const lessonsResult = await supabaseQuery(c, 'hana_lessons', {
      select: 'id,domain,difficulty,prerequisites,estimated_duration_minutes',
    })

    if (!Array.isArray(lessonsResult)) {
      return c.json({ error: 'Failed to fetch lessons' }, 500)
    }

    // Use mastery engine to suggest
    const suggestion = suggestNextLesson({
      completedLessonIds,
      masterySscores: masteryScores,
      availableLessons: lessonsResult.map((l) => ({
        id: l.id,
        domain: l.domain,
        difficulty: l.difficulty,
        prerequisites: l.prerequisites || [],
        estimatedMinutes: l.estimated_duration_minutes,
      })),
    })

    if (!suggestion) {
      return c.json(
        {
          message: 'Congratulations! You have completed all available lessons.',
          learnerId,
        },
        200
      )
    }

    // Fetch the suggested lesson details
    const suggestedLessonResult = await supabaseQuery(c, 'hana_lessons', {
      select: 'id,title_ja,title_en,lesson_type,difficulty,domain',
      eq: { id: suggestion.lessonId },
      limit: 1,
    })

    if (!Array.isArray(suggestedLessonResult) || suggestedLessonResult.length === 0) {
      return c.json({ error: 'Suggested lesson not found' }, 500)
    }

    const suggestedLesson = suggestedLessonResult[0]

    return c.json({
      lessonId: suggestion.lessonId,
      titleJa: suggestedLesson.title_ja,
      titleEn: suggestedLesson.title_en,
      type: suggestedLesson.lesson_type,
      difficulty: suggestedLesson.difficulty,
      domain: suggestedLesson.domain,
      reason: suggestion.reason,
      estimatedTimeMinutes: suggestion.estimatedTimeMinutes,
    })
  } catch (error) {
    console.error('Get next lesson error:', error)
    return c.json({ error: 'Failed to determine next lesson' }, 500)
  }
})

// ============================================================
// POST /api/hana/lesson/:id/start — Start a lesson session
// ============================================================
hanaLessonRoutes.post(
  '/lesson/:id/start',
  zValidator('json', startLessonSchema),
  async (c) => {
    try {
      const lessonId = c.req.param('id')
      const { learnerId } = c.req.valid('json')

      // Create session
      await supabaseInsert(c, 'hana_sessions', {
        learner_id: learnerId,
        lesson_id: lessonId,
        session_type: 'lesson',
        started_at: new Date().toISOString(),
      })

      return c.json({
        message: 'Lesson session started',
        lessonId,
        learnerId,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Start lesson error:', error)
      return c.json({ error: 'Failed to start lesson session' }, 500)
    }
  }
)

// ============================================================
// POST /api/hana/lesson/:id/complete — Complete lesson and record progress
// ============================================================
hanaLessonRoutes.post(
  '/lesson/:id/complete',
  zValidator('json', completeLessonSchema),
  async (c) => {
    try {
      const lessonId = c.req.param('id')
      const { learnerId, score, durationSeconds } = c.req.valid('json')

      // Fetch lesson details for mastery threshold
      const lessonResult = await supabaseQuery(c, 'hana_lessons', {
        select: 'id,domain,mastery_threshold',
        eq: { id: lessonId },
        limit: 1,
      })

      if (!Array.isArray(lessonResult) || lessonResult.length === 0) {
        return c.json({ error: 'Lesson not found' }, 404)
      }

      const lesson = lessonResult[0]

      // Check if mastered
      const mastered = score >= lesson.mastery_threshold * 100

      // Record or update progress
      // In production: use UPSERT
      await supabaseInsert(c, 'hana_progress', {
        learner_id: learnerId,
        lesson_id: lessonId,
        last_score: score,
        best_score: score, // In production, compare with existing best_score
        mastered,
        mastered_at: mastered ? new Date().toISOString() : null,
        last_attempted_at: new Date().toISOString(),
      })

      // End session
      await supabaseInsert(c, 'hana_sessions', {
        learner_id: learnerId,
        lesson_id: lessonId,
        session_type: 'lesson',
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        score,
      })

      return c.json({
        message: 'Lesson completed',
        score,
        mastered,
        domain: lesson.domain,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Complete lesson error:', error)
      return c.json({ error: 'Failed to complete lesson' }, 500)
    }
  }
)
