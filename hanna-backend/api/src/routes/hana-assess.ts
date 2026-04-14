import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert } from '../lib/supabase'
import {
  scoreOralProduction,
  scoreListeningComprehension,
  scoreReadingComprehension,
  scoreCulturalUnderstanding,
  determineMastery,
  calculateDomainMastery,
} from '../lib/hana-mastery'

const submitOralSchema = z.object({
  learnerId: z.string().uuid(),
  questionId: z.string(),
  audioUrl: z.string().url(),
  transcription: z.string(),
  expectedDifficulty: z.enum(['n5', 'n4', 'n3', 'n2', 'n1']),
})

const submitListeningSchema = z.object({
  learnerId: z.string().uuid(),
  lessonId: z.string().uuid(),
  totalQuestions: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  explanationQuality: z.enum(['none', 'partial', 'complete']),
})

const submitReadingSchema = z.object({
  learnerId: z.string().uuid(),
  lessonId: z.string().uuid(),
  totalQuestions: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  inferenceCorrect: z.boolean(),
  vocabularyLookupsCount: z.number().int().min(0),
})

const submitCultureSchema = z.object({
  learnerId: z.string().uuid(),
  lessonId: z.string().uuid(),
  totalQuestions: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  contextualExplanation: z.boolean(),
})

export const hanaAssessRoutes = new Hono()

// ============================================================
// POST /api/hana/assess/oral — Submit oral production response
// ============================================================
hanaAssessRoutes.post('/assess/oral', zValidator('json', submitOralSchema), async (c) => {
  try {
    const body = c.req.valid('json')

    // Evaluate oral production
    // In production: use AI/ML to analyze audio + transcription
    const assessment = scoreOralProduction({
      grammarErrors: 0, // Would be detected by AI
      vocabularyLevel: 'appropriate',
      pronunciationIssues: 0, // Would be detected by AI
      hesitationCount: 0, // Would be counted from audio analysis
      expectedDifficulty: body.expectedDifficulty,
    })

    // Record assessment
    await supabaseInsert(c, 'hana_assessments', {
      learner_id: body.learnerId,
      assessment_type: 'oral_production',
      questions: JSON.stringify([{ id: body.questionId, expected_difficulty: body.expectedDifficulty }]),
      learner_answers: JSON.stringify([{ question_id: body.questionId, response_text: body.transcription, audio_url: body.audioUrl }]),
      scores: JSON.stringify([{ question_id: body.questionId, score: assessment.score, feedback_ja: assessment.feedback.ja, feedback_en: assessment.feedback.en }]),
      overall_score: assessment.score,
      passed: assessment.score >= 80,
      completed_at: new Date().toISOString(),
    })

    // Update learner's speaking domain mastery
    // In production: aggregate multiple assessments

    return c.json({
      score: assessment.score,
      passed: assessment.score >= 80,
      feedback: assessment.feedback,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Submit oral error:', error)
    return c.json({ error: 'Failed to process oral assessment' }, 500)
  }
})

// ============================================================
// POST /api/hana/assess/listening — Submit listening comprehension
// ============================================================
hanaAssessRoutes.post(
  '/assess/listening',
  zValidator('json', submitListeningSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      // Score listening
      const assessment = scoreListeningComprehension({
        totalQuestions: body.totalQuestions,
        correctAnswers: body.correctAnswers,
        explanationQuality: body.explanationQuality,
      })

      // Record assessment
      await supabaseInsert(c, 'hana_assessments', {
        learner_id: body.learnerId,
        lesson_id: body.lessonId,
        assessment_type: 'listening_comprehension',
        questions: JSON.stringify({
          total: body.totalQuestions,
          type: 'listening',
        }),
        learner_answers: JSON.stringify({
          correctAnswers: body.correctAnswers,
          explanationQuality: body.explanationQuality,
        }),
        overall_score: assessment.score,
        passed: assessment.score >= 80,
        completed_at: new Date().toISOString(),
      })

      return c.json({
        score: assessment.score,
        passed: assessment.score >= 80,
        feedback: assessment.feedback,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Submit listening error:', error)
      return c.json({ error: 'Failed to process listening assessment' }, 500)
    }
  }
)

// ============================================================
// POST /api/hana/assess/reading — Submit reading comprehension
// ============================================================
hanaAssessRoutes.post(
  '/assess/reading',
  zValidator('json', submitReadingSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      // Score reading
      const assessment = scoreReadingComprehension({
        totalQuestions: body.totalQuestions,
        correctAnswers: body.correctAnswers,
        inferenceCorrect: body.inferenceCorrect,
        vocabularyUsed: body.vocabularyLookupsCount,
      })

      // Record assessment
      await supabaseInsert(c, 'hana_assessments', {
        learner_id: body.learnerId,
        lesson_id: body.lessonId,
        assessment_type: 'reading_comprehension',
        questions: JSON.stringify({
          total: body.totalQuestions,
          type: 'reading',
        }),
        learner_answers: JSON.stringify({
          correctAnswers: body.correctAnswers,
          inferenceCorrect: body.inferenceCorrect,
          vocabularyLookupsCount: body.vocabularyLookupsCount,
        }),
        overall_score: assessment.score,
        passed: assessment.score >= 80,
        completed_at: new Date().toISOString(),
      })

      return c.json({
        score: assessment.score,
        passed: assessment.score >= 80,
        feedback: assessment.feedback,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Submit reading error:', error)
      return c.json({ error: 'Failed to process reading assessment' }, 500)
    }
  }
)

// ============================================================
// POST /api/hana/assess/culture — Submit cultural understanding test
// ============================================================
hanaAssessRoutes.post(
  '/assess/culture',
  zValidator('json', submitCultureSchema),
  async (c) => {
    try {
      const body = c.req.valid('json')

      // Score cultural understanding
      const assessment = scoreCulturalUnderstanding({
        totalQuestions: body.totalQuestions,
        correctAnswers: body.correctAnswers,
        contextualExplanation: body.contextualExplanation,
      })

      // Record assessment
      await supabaseInsert(c, 'hana_assessments', {
        learner_id: body.learnerId,
        lesson_id: body.lessonId,
        assessment_type: 'cultural_understanding',
        questions: JSON.stringify({
          total: body.totalQuestions,
          type: 'culture',
        }),
        learner_answers: JSON.stringify({
          correctAnswers: body.correctAnswers,
          contextualExplanation: body.contextualExplanation,
        }),
        overall_score: assessment.score,
        passed: assessment.score >= 80,
        completed_at: new Date().toISOString(),
      })

      // Update mastery in culture domain
      // In production: aggregate all culture assessments

      return c.json({
        score: assessment.score,
        passed: assessment.score >= 80,
        feedback: assessment.feedback,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Submit culture error:', error)
      return c.json({ error: 'Failed to process cultural assessment' }, 500)
    }
  }
)

// ============================================================
// GET /api/hana/assess/:learnerId/history — Get assessment history
// ============================================================
hanaAssessRoutes.get('/assess/:learnerId/history', async (c) => {
  try {
    const learnerId = c.req.param('learnerId')
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20

    const result = await supabaseQuery(c, 'hana_assessments', {
      select: 'id,assessment_type,overall_score,passed,completed_at',
      eq: { learner_id: learnerId },
      limit,
      order: 'completed_at',
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch assessment history' }, 500)
    }

    return c.json({
      learnerId,
      assessmentCount: result.length,
      assessments: result.map((a) => ({
        id: a.id,
        type: a.assessment_type,
        score: a.overall_score,
        passed: a.passed,
        completedAt: a.completed_at,
      })),
    })
  } catch (error) {
    console.error('Get assessment history error:', error)
    return c.json({ error: 'Failed to fetch assessment history' }, 500)
  }
})

// ============================================================
// POST /api/hana/assess/score — Helper endpoint for scoring
// ============================================================
hanaAssessRoutes.post('/assess/score', async (c) => {
  try {
    const body = await c.req.json()

    // This would be called by the AI grading service
    // Returns: standardized score and feedback

    return c.json({
      message: 'Scoring service ready',
      types: ['oral', 'listening', 'reading', 'culture'],
    })
  } catch (error) {
    console.error('Scoring error:', error)
    return c.json({ error: 'Failed to process scoring request' }, 500)
  }
})
