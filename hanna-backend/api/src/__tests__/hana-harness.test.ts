import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// Transformative content filter
// ---------------------------------------------------------------------------
import { filterContent } from '../lib/research/transformative-content-filter'

describe('filterContent', () => {
  it('passes clearly original content', () => {
    const result = filterContent({
      generatedText: 'This is an entirely original AFROMATIONS tutorial about AI anime production pipelines for Black creators.',
      sourceTexts: ['Noble Goose made a video about something completely different.'],
      contentType: 'blog',
    })
    expect(result.safe).toBe(true)
  })

  it('blocks near-verbatim copies', () => {
    const source = 'In this video I will show you exactly how I generated these AI anime fight scenes using Kling and ComfyUI step by step in detail.'
    const result = filterContent({
      generatedText: source,
      sourceTexts: [source],
      contentType: 'blog',
    })
    expect(result.safe).toBe(false)
  })

  it('blocks verbatim copy signals regardless of source', () => {
    const result = filterContent({
      generatedText: 'Here is the full script copied from Noble Goose exactly word for word.',
      sourceTexts: [],
      contentType: 'blog',
    })
    expect(result.safe).toBe(false)
    expect(result.reason).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Platform formatters
// ---------------------------------------------------------------------------
import { formatForPlatform } from '../lib/publishing/platform-formatters'

describe('formatForPlatform', () => {
  const longText = 'A'.repeat(400)

  it('truncates twitter posts to 280 chars', () => {
    const result = formatForPlatform('twitter', longText)
    expect(result.text.length).toBeLessThanOrEqual(280)
    expect(result.withinLimit).toBe(true)
  })

  it('passes short text through unchanged', () => {
    const text = 'Short post!'
    const result = formatForPlatform('instagram', text)
    expect(result.text).toBe(text)
    expect(result.withinLimit).toBe(true)
  })

  it('appends hashtags when provided', () => {
    const result = formatForPlatform('instagram', 'Hello world', ['#anime', '#ai'])
    expect(result.hashtags).toContain('#anime')
    expect(result.hashtags).toContain('#ai')
  })

  it('returns correct platform on post object', () => {
    const result = formatForPlatform('threads', 'Hello world')
    expect(result.platform).toBe('threads')
  })
})

// ---------------------------------------------------------------------------
// Originality check
// ---------------------------------------------------------------------------
import { computeOriginalityScore } from '../lib/qa/originality-check'

describe('computeOriginalityScore', () => {
  it('gives high score to fully original content', () => {
    const result = computeOriginalityScore(
      'AFROMATIONS teaches AI anime production from a Black creative perspective, bridging culture and technology in ways never seen before.',
      ['Noble Goose made an unrelated video about drawing techniques.'],
    )
    expect(result.score).toBeGreaterThan(70)
  })

  it('gives low score to near-duplicate content', () => {
    const source = 'How I made this AI anime fight scene using Kling AI and ComfyUI in five simple steps for beginners'
    const result = computeOriginalityScore(source, [source])
    expect(result.score).toBeLessThan(40)
  })
})

// ---------------------------------------------------------------------------
// Publishing policy
// ---------------------------------------------------------------------------
import { checkPublishingPolicy } from '../lib/qa/publishing-policy'

describe('checkPublishingPolicy', () => {
  const baseEnv = {
    HANA_PUBLISHING_APPROVAL_MODE: 'true',
    HANA_DRY_RUN_PUBLISHING: 'true',
    HANA_AUTOPUBLISH_ENABLED: 'false',
  }

  it('blocks post_social in dry-run mode', () => {
    const result = checkPublishingPolicy(baseEnv, { action: 'post_social' })
    expect(result.allowed).toBe(false)
  })

  it('blocks post_social when not approved in approval mode (no dry-run)', () => {
    const env = { HANA_PUBLISHING_APPROVAL_MODE: 'true', HANA_DRY_RUN_PUBLISHING: 'false', HANA_AUTOPUBLISH_ENABLED: 'false' }
    const result = checkPublishingPolicy(env, { action: 'post_social', approvalStatus: 'pending' })
    expect(result.allowed).toBe(false)
    expect(result.requiresApproval).toBe(true)
  })

  it('allows post_social when approved', () => {
    const env = { HANA_PUBLISHING_APPROVAL_MODE: 'true', HANA_DRY_RUN_PUBLISHING: 'false', HANA_AUTOPUBLISH_ENABLED: 'false' }
    const result = checkPublishingPolicy(env, { action: 'post_social', approvalStatus: 'approved' })
    expect(result.allowed).toBe(true)
  })

  it('always blocks payout_request regardless of settings', () => {
    const permissiveEnv = {
      HANA_PUBLISHING_APPROVAL_MODE: 'false',
      HANA_DRY_RUN_PUBLISHING: 'false',
      HANA_AUTOPUBLISH_ENABLED: 'true',
    }
    const result = checkPublishingPolicy(permissiveEnv, { action: 'payout_request' })
    expect(result.allowed).toBe(false)
    expect(result.requiresApproval).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Ralphy QA
// ---------------------------------------------------------------------------
import { ralpyQA } from '../lib/qa/ralphy-content-qa'

describe('ralpyQA', () => {
  it('passes high-quality original content', () => {
    const result = ralpyQA({
      content: `AFROMATIONS presents: How to Build AI Anime Fight Scenes for Your Channel

In this tutorial, we explore the production workflow behind AI-generated anime fight sequences. This guide focuses on the Black creative perspective and how these tools democratize animation production.

Key takeaways:
- Understanding frame generation vs. motion generation
- Building a consistent art style across scenes
- Publishing responsibly with attribution

Source note: Agent Hana studied publicly available AI anime production workflows. Concepts are transformatively applied.`,
      contentType: 'blog_post',
      citations: [{ url: 'https://www.youtube.com/@noblegooseanime', title: 'Noble Goose Anime' }],
    })
    expect(result.passed).toBe(true)
    expect(result.score.overall).toBeGreaterThanOrEqual(50)
    expect(result.score.compliance).toBeGreaterThanOrEqual(70)
    expect(result.blockers).toHaveLength(0)
  })

  it('returns a QAResult with required fields', () => {
    const result = ralpyQA({
      content: 'Short anime content for AFROMATIONS studio.',
      contentType: 'social',
    })
    expect(result).toHaveProperty('passed')
    expect(result).toHaveProperty('score')
    expect(result).toHaveProperty('evidence')
    expect(result).toHaveProperty('fixes')
    expect(result).toHaveProperty('blockers')
    expect(result).toHaveProperty('ralphydAt')
  })
})

// ---------------------------------------------------------------------------
// Social calendar
// ---------------------------------------------------------------------------
import { wouldExceedDailyLimit, generateWeeklyCalendar } from '../lib/publishing/social-calendar'

describe('socialCalendar', () => {
  it('returns false when under daily limit', () => {
    expect(wouldExceedDailyLimit('twitter', 2)).toBe(false)
  })

  it('returns true when at or over daily limit', () => {
    expect(wouldExceedDailyLimit('twitter', 3)).toBe(true)
  })

  it('generates slots for each platform over 7 days', () => {
    const slots = generateWeeklyCalendar(['twitter', 'instagram'], new Date('2025-01-20'))
    expect(slots.length).toBe(14) // 2 platforms * 7 days
    slots.forEach((slot) => {
      expect(slot).toHaveProperty('platform')
      expect(slot).toHaveProperty('scheduledFor')
      expect(slot).toHaveProperty('available')
    })
  })
})
