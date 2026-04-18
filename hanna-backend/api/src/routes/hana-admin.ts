import { Hono } from 'hono'
import { supabaseQuery } from '../lib/supabase'

export const hanaAdminRoutes = new Hono()

// Admin routes should be protected by authentication in production
// For now, these are accessible; in production, add auth middleware

// ============================================================
// GET /api/hana/admin/learners — List all learners (paginated)
// ============================================================
hanaAdminRoutes.get('/admin/learners', async (c) => {
  try {
    const page = c.req.query('page') ? parseInt(c.req.query('page')!) : 1
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50
    const offset = (page - 1) * limit

    const result = await supabaseQuery(c, 'hana_learners', {
      select: 'id,email,display_name,age_verified,subscription_tier,status,joined_at,last_active_at',
      limit: limit + 1, // Fetch one extra to determine if there are more pages
      order: 'joined_at', // Most recent first
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch learners' }, 500)
    }

    // Check if there are more results
    const hasMore = result.length > limit
    const learners = result.slice(0, limit)

    return c.json({
      page,
      limit,
      count: learners.length,
      hasMore,
      learners: learners.map((learner) => ({
        id: learner.id,
        email: learner.email,
        displayName: learner.display_name,
        ageVerified: learner.age_verified,
        subscriptionTier: learner.subscription_tier,
        status: learner.status,
        joinedAt: learner.joined_at,
        lastActiveAt: learner.last_active_at,
      })),
    })
  } catch (error) {
    console.error('List learners error:', error)
    return c.json({ error: 'Failed to fetch learners list' }, 500)
  }
})

// ============================================================
// GET /api/hana/admin/learner/:id — Get detailed learner info
// ============================================================
hanaAdminRoutes.get('/admin/learner/:id', async (c) => {
  try {
    const learnerId = c.req.param('id')

    // Fetch learner profile
    const learnerResult = await supabaseQuery(c, 'hana_learners', {
      select: '*',
      eq: { id: learnerId },
      limit: 1,
    })

    if (!Array.isArray(learnerResult) || learnerResult.length === 0) {
      return c.json({ error: 'Learner not found' }, 404)
    }

    const learner = learnerResult[0]

    // Fetch learner's mastery scores
    const masteryResult = await supabaseQuery(c, 'hana_mastery', {
      select: 'domain,subdomain,score,level,evidence_count,last_tested_at',
      eq: { learner_id: learnerId },
    })

    const mastery = Array.isArray(masteryResult) ? masteryResult : []

    // Fetch recent sessions
    const sessionsResult = await supabaseQuery(c, 'hana_sessions', {
      select: 'id,session_type,domain,started_at,ended_at,score',
      eq: { learner_id: learnerId },
      limit: 20,
    })

    const recentSessions = Array.isArray(sessionsResult) ? sessionsResult : []

    // Fetch assessments
    const assessmentsResult = await supabaseQuery(c, 'hana_assessments', {
      select: 'id,assessment_type,overall_score,passed,completed_at',
      eq: { learner_id: learnerId },
      limit: 10,
    })

    const recentAssessments = Array.isArray(assessmentsResult)
      ? assessmentsResult
      : []

    // Fetch unlocked manga issues
    const unlocksResult = await supabaseQuery(c, 'hana_unlocks', {
      select: 'issue_id,unlocked_at,read_at',
      eq: { learner_id: learnerId },
    })

    const unlockedCount = Array.isArray(unlocksResult) ? unlocksResult.length : 0

    return c.json({
      id: learner.id,
      email: learner.email,
      displayName: learner.display_name,
      ageVerified: learner.age_verified,
      subscriptionTier: learner.subscription_tier,
      status: learner.status,
      joinedAt: learner.joined_at,
      lastActiveAt: learner.last_active_at,
      timezone: learner.timezone,
      dailyGoalMinutes: learner.daily_goal_minutes,
      mastery: mastery.map((m) => ({
        domain: m.domain,
        subdomain: m.subdomain,
        score: m.score,
        level: m.level,
        evidenceCount: m.evidence_count,
        lastTestedAt: m.last_tested_at,
      })),
      recentSessions: recentSessions.map((s) => ({
        id: s.id,
        type: s.session_type,
        domain: s.domain,
        startedAt: s.started_at,
        endedAt: s.ended_at,
        score: s.score,
      })),
      recentAssessments: recentAssessments.map((a) => ({
        id: a.id,
        type: a.assessment_type,
        score: a.overall_score,
        passed: a.passed,
        completedAt: a.completed_at,
      })),
      unlockedMangaCount: unlockedCount,
      totalStudyTime: calculateStudyTime(recentSessions),
    })
  } catch (error) {
    console.error('Get learner details error:', error)
    return c.json({ error: 'Failed to fetch learner details' }, 500)
  }
})

// ============================================================
// GET /api/hana/admin/metrics — System-wide metrics
// ============================================================
hanaAdminRoutes.get('/admin/metrics', async (c) => {
  try {
    // Fetch learner counts by status
    const learnersResult = await supabaseQuery(c, 'hana_learners', {
      select: 'id,status,joined_at',
    })

    const learners = Array.isArray(learnersResult) ? learnersResult : []

    // Count by status
    const statusCounts = {
      active: 0,
      paused: 0,
      archived: 0,
      banned: 0,
    }

    for (const learner of learners) {
      const status = learner.status as keyof typeof statusCounts
      if (status in statusCounts) {
        statusCounts[status]++
      }
    }

    // Count by subscription tier
    const tierResult = await supabaseQuery(c, 'hana_learners', {
      select: 'subscription_tier',
    })

    const subscriptionTierCounts = {
      free: 0,
      premium: 0,
      scholar: 0,
    }

    if (Array.isArray(tierResult)) {
      for (const row of tierResult) {
        const tier = row.subscription_tier as keyof typeof subscriptionTierCounts
        if (tier in subscriptionTierCounts) {
          subscriptionTierCounts[tier]++
        }
      }
    }

    // Fetch total sessions
    const sessionsResult = await supabaseQuery(c, 'hana_sessions', {
      select: 'id,completed_at',
    })

    const sessions = Array.isArray(sessionsResult) ? sessionsResult : []
    const sessionsThisMonth = sessions.filter((s) => {
      if (!s.completed_at) return false
      const sessionDate = new Date(s.completed_at)
      const now = new Date()
      return (
        sessionDate.getMonth() === now.getMonth() &&
        sessionDate.getFullYear() === now.getFullYear()
      )
    }).length

    // Fetch total assessments
    const assessmentsResult = await supabaseQuery(c, 'hana_assessments', {
      select: 'id,passed',
    })

    const assessments = Array.isArray(assessmentsResult)
      ? assessmentsResult
      : []
    const passRate =
      assessments.length > 0
        ? (
            (assessments.filter((a) => a.passed).length / assessments.length) *
            100
          ).toFixed(1)
        : '0'

    return c.json({
      timestamp: new Date().toISOString(),
      learners: {
        total: learners.length,
        byStatus: statusCounts,
        bySubscription: subscriptionTierCounts,
      },
      sessions: {
        total: sessions.length,
        thisMonth: sessionsThisMonth,
      },
      assessments: {
        total: assessments.length,
        passRate: parseFloat(passRate as string),
      },
      growth: {
        newLearnersThisMonth: learners.filter(
          (l) => isThisMonth(new Date(l.joined_at))
        ).length,
      },
    })
  } catch (error) {
    console.error('Get metrics error:', error)
    return c.json({ error: 'Failed to fetch system metrics' }, 500)
  }
})

// ============================================================
// GET /api/hana/admin/mastery — Mastery distribution across learners
// ============================================================
hanaAdminRoutes.get('/admin/mastery', async (c) => {
  try {
    const domain = c.req.query('domain') // optional filter

    const masteryResult = await supabaseQuery(c, 'hana_mastery', {
      select: 'domain,score,level',
    })

    if (!Array.isArray(masteryResult)) {
      return c.json({ error: 'Failed to fetch mastery data' }, 500)
    }

    // Filter by domain if specified
    let filtered = masteryResult
    if (domain) {
      filtered = masteryResult.filter((m) => m.domain === domain)
    }

    // Calculate statistics per domain
    const domains = new Map<
      string,
      {
        scores: number[]
        levels: Record<string, number>
      }
    >()

    for (const m of filtered) {
      if (!domains.has(m.domain)) {
        domains.set(m.domain, {
          scores: [],
          levels: { n5: 0, n4: 0, n3: 0, n2: 0, n1: 0, advanced: 0, expert: 0 },
        })
      }

      const stats = domains.get(m.domain)!
      stats.scores.push(m.score)
      const level = m.level as keyof typeof stats.levels
      if (level in stats.levels) {
        stats.levels[level]++
      }
    }

    // Calculate per-domain statistics
    const domainStats = Array.from(domains.entries()).map(([domain, stats]) => {
      const avg =
        stats.scores.length > 0
          ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
          : 0
      const sorted = [...stats.scores].sort((a, b) => a - b)
      const median =
        sorted.length > 0
          ? sorted[Math.floor(sorted.length / 2)]
          : 0

      return {
        domain,
        count: stats.scores.length,
        average: Math.round(avg),
        median,
        min: Math.min(...stats.scores),
        max: Math.max(...stats.scores),
        levelDistribution: stats.levels,
      }
    })

    return c.json({
      timestamp: new Date().toISOString(),
      domainStats,
    })
  } catch (error) {
    console.error('Get mastery stats error:', error)
    return c.json({ error: 'Failed to fetch mastery statistics' }, 500)
  }
})

// ============================================================
// Helper functions
// ============================================================

function calculateStudyTime(sessions: Array<{ ended_at: string | null }>) {
  let totalSeconds = 0
  for (const session of sessions) {
    if (session.ended_at) {
      // Would need duration_seconds field in actual implementation
      totalSeconds += 1800 // dummy: assume 30min per session
    }
  }
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function isThisMonth(date: Date): boolean {
  const now = new Date()
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}
