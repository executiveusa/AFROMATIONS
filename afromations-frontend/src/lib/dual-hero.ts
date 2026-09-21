/**
 * DUAL homepage hero media wiring.
 *
 * The video URL is intentionally environment-driven so production can keep the
 * current poster until an approved hero master exists. Set
 * NEXT_PUBLIC_DUAL_HERO_VIDEO_URL on a preview deployment first.
 */

export const DUAL_HERO_POSTER_URL =
  'https://raw.githubusercontent.com/executiveusa/AFROMATIONS/main/AFROMATIONS/Website/DUO/DUO.png'

export const DUAL_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_DUAL_HERO_VIDEO_URL?.trim() || ''

export const DUAL_HERO_HAS_VIDEO = Boolean(DUAL_HERO_VIDEO_URL)
