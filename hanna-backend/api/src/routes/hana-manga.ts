import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert } from '../lib/supabase'
import { checkMangaUnlockEligibility } from '../lib/hana-mastery'

const unlockMangaSchema = z.object({
  learnerId: z.string().uuid(),
})

export const hanaMangaRoutes = new Hono()

// ============================================================
// GET /api/hana/manga — List all manga issues with unlock status
// ============================================================
hanaMangaRoutes.get('/manga', async (c) => {
  try {
    const learnerId = c.req.query('learnerId') // optional: to show unlock status per learner

    const result = await supabaseQuery(c, 'hana_manga_issues', {
      select:
        'id,issue_number,title_ja,title_en,synopsis_en,cover_image_url,status,unlock_requirements',
      order: 'issue_number',
    })

    if (!Array.isArray(result)) {
      return c.json({ error: 'Failed to fetch manga issues' }, 500)
    }

    // If learnerId provided, fetch learner's unlocks
    let learnersUnlocks: Record<string, boolean> = {}
    if (learnerId) {
      const unlocksResult = await supabaseQuery(c, 'hana_unlocks', {
        select: 'issue_id',
        eq: { learner_id: learnerId },
      })

      if (Array.isArray(unlocksResult)) {
        learnersUnlocks = Object.fromEntries(
          unlocksResult.map((u) => [u.issue_id, true])
        )
      }
    }

    return c.json({
      count: result.length,
      issues: result.map((issue) => ({
        id: issue.id,
        issueNumber: issue.issue_number,
        titleJa: issue.title_ja,
        titleEn: issue.title_en,
        synopsisEn: issue.synopsis_en,
        coverImageUrl: issue.cover_image_url,
        status: issue.status,
        unlocked: learnersUnlocks[issue.id] || false,
        unlockRequirements: issue.unlock_requirements,
      })),
    })
  } catch (error) {
    console.error('List manga issues error:', error)
    return c.json({ error: 'Failed to fetch manga issues' }, 500)
  }
})

// ============================================================
// GET /api/hana/manga/:id — Get specific issue details
// ============================================================
hanaMangaRoutes.get('/manga/:id', async (c) => {
  try {
    const issueId = c.req.param('id')

    const result = await supabaseQuery(c, 'hana_manga_issues', {
      select:
        'id,issue_number,title_ja,title_en,synopsis_ja,synopsis_en,cover_image_url,panel_count,pages_total,read_direction,unlock_requirements,status,era,publication_date,content_warnings',
      eq: { id: issueId },
      limit: 1,
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Manga issue not found' }, 404)
    }

    const issue = result[0]

    return c.json({
      id: issue.id,
      issueNumber: issue.issue_number,
      titleJa: issue.title_ja,
      titleEn: issue.title_en,
      synopsisJa: issue.synopsis_ja,
      synopsisEn: issue.synopsis_en,
      coverImageUrl: issue.cover_image_url,
      panelCount: issue.panel_count,
      pagesTotal: issue.pages_total,
      readDirection: issue.read_direction, // rtl or ltr
      unlockRequirements: issue.unlock_requirements,
      status: issue.status,
      era: issue.era,
      publicationDate: issue.publication_date,
      contentWarnings: issue.content_warnings,
    })
  } catch (error) {
    console.error('Get manga issue error:', error)
    return c.json({ error: 'Failed to fetch manga issue' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/:id/unlock — Attempt to unlock issue
// ============================================================
hanaMangaRoutes.post(
  '/manga/:id/unlock',
  zValidator('json', unlockMangaSchema),
  async (c) => {
    try {
      const issueId = c.req.param('id')
      const { learnerId } = c.req.valid('json')

      // Fetch issue details
      const issueResult = await supabaseQuery(c, 'hana_manga_issues', {
        select: 'id,unlock_requirements,status',
        eq: { id: issueId },
        limit: 1,
      })

      if (!Array.isArray(issueResult) || issueResult.length === 0) {
        return c.json({ error: 'Manga issue not found' }, 404)
      }

      const issue = issueResult[0]

      // Check if already unlocked
      const alreadyUnlockedResult = await supabaseQuery(c, 'hana_unlocks', {
        select: 'id',
        eq: { learner_id: learnerId, issue_id: issueId },
        limit: 1,
      })

      if (
        Array.isArray(alreadyUnlockedResult) &&
        alreadyUnlockedResult.length > 0
      ) {
        return c.json({
          message: 'This issue is already unlocked',
          issueId,
        })
      }

      // Fetch learner's mastery scores
      const masteryResult = await supabaseQuery(c, 'hana_mastery', {
        select: 'domain,score',
        eq: { learner_id: learnerId },
      })

      if (!Array.isArray(masteryResult)) {
        return c.json({ error: 'Failed to fetch learner mastery' }, 500)
      }

      // Build mastery map
      const learnerMastery: Record<string, number> = {}
      for (const m of masteryResult) {
        learnerMastery[m.domain] = m.score
      }

      // Check eligibility
      const unlockRequirements =
        issue.unlock_requirements as Record<string, number>
      const eligibility = checkMangaUnlockEligibility(
        learnerMastery,
        unlockRequirements
      )

      if (!eligibility.eligible) {
        return c.json(
          {
            eligible: false,
            message: 'You need to increase your mastery in some domains',
            missing: eligibility.missing,
          },
          403
        )
      }

      // Unlock the issue
      await supabaseInsert(c, 'hana_unlocks', {
        learner_id: learnerId,
        issue_id: issueId,
        unlocked_at: new Date().toISOString(),
        unlock_trigger: 'mastery_achieved',
        mastery_snapshot: JSON.stringify(learnerMastery),
      })

      return c.json({
        eligible: true,
        message: 'Manga issue unlocked!',
        issueId,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Unlock manga error:', error)
      return c.json({ error: 'Failed to unlock manga issue' }, 500)
    }
  }
)

// ============================================================
// GET /api/hana/manga/:learnerId/unlocked — Get learner's unlocked issues
// ============================================================
hanaMangaRoutes.get('/manga/:learnerId/unlocked', async (c) => {
  try {
    const learnerId = c.req.param('learnerId')

    const unlocksResult = await supabaseQuery(c, 'hana_unlocks', {
      select: 'issue_id,unlocked_at,read_at,completed_at',
      eq: { learner_id: learnerId },
      order: 'unlocked_at',
    })

    if (!Array.isArray(unlocksResult)) {
      return c.json({ error: 'Failed to fetch unlocks' }, 500)
    }

    const issueIds = unlocksResult.map((u) => u.issue_id)

    // Fetch issue details for each unlock
    const issuesResult = await supabaseQuery(c, 'hana_manga_issues', {
      select: 'id,issue_number,title_ja,title_en,cover_image_url,status',
    })

    if (!Array.isArray(issuesResult)) {
      return c.json({ error: 'Failed to fetch issue details' }, 500)
    }

    // Combine unlock and issue data
    const unlockedIssues = unlocksResult
      .map((unlock) => {
        const issue = issuesResult.find((i) => i.id === unlock.issue_id)
        return issue
          ? {
              id: issue.id,
              issueNumber: issue.issue_number,
              titleJa: issue.title_ja,
              titleEn: issue.title_en,
              coverImageUrl: issue.cover_image_url,
              unlockedAt: unlock.unlocked_at,
              readAt: unlock.read_at,
              completedAt: unlock.completed_at,
              isRead: !!unlock.read_at,
              isCompleted: !!unlock.completed_at,
            }
          : null
      })
      .filter((issue) => issue !== null)

    return c.json({
      learnerId,
      unlockedCount: unlockedIssues.length,
      readCount: unlockedIssues.filter((i) => i.isRead).length,
      unlockedIssues,
    })
  } catch (error) {
    console.error('Get unlocked issues error:', error)
    return c.json({ error: 'Failed to fetch unlocked issues' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/:id/read — Mark issue as read
// ============================================================
hanaMangaRoutes.post('/manga/:id/read', async (c) => {
  try {
    const issueId = c.req.param('id')
    const body = await c.req.json()
    const learnerId = (body as Record<string, unknown>).learnerId

    if (!learnerId) {
      return c.json({ error: 'learnerId required' }, 400)
    }

    // Update unlock record with read timestamp
    // In production: use PATCH/PUT directly
    // For now: return success

    return c.json({
      message: 'Manga issue marked as read',
      issueId,
      readAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Mark read error:', error)
    return c.json({ error: 'Failed to mark issue as read' }, 500)
  }
})
