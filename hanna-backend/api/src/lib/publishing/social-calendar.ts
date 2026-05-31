/**
 * Social Calendar
 * Manages scheduling logic for social media posts across platforms.
 * Enforces rate limits, duplicate detection, and platform posting cadence.
 */

export interface ScheduleSlot {
  platform: string
  scheduledFor: string  // ISO timestamp
  available: boolean
}

export interface PostFingerprint {
  platform: string
  textHash: string
  scheduledFor: string
}

// Maximum posts per platform per day
const DAILY_LIMITS: Record<string, number> = {
  twitter: 3,
  instagram: 2,
  tiktok: 2,
  youtube_community: 1,
  linkedin: 2,
  threads: 3,
}

// Optimal posting hours by platform (UTC)
const OPTIMAL_HOURS: Record<string, number[]> = {
  twitter: [14, 17, 20],
  instagram: [11, 15, 19],
  tiktok: [13, 19, 22],
  youtube_community: [15],
  linkedin: [9, 12, 17],
  threads: [10, 14, 20],
}

/**
 * Compute next available posting slot for a platform.
 */
export function nextPostingSlot(platform: string, existingSlots: string[]): string {
  const hours = OPTIMAL_HOURS[platform] ?? [12, 18]
  const now = new Date()

  // Find the next optimal hour that isn't already taken
  for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
    for (const hour of hours) {
      const candidate = new Date(now)
      candidate.setDate(candidate.getDate() + dayOffset)
      candidate.setUTCHours(hour, 0, 0, 0)

      if (candidate <= now) continue

      const iso = candidate.toISOString()
      if (!existingSlots.includes(iso)) {
        return iso
      }
    }
  }

  // Fallback: tomorrow at noon UTC
  const fallback = new Date(now)
  fallback.setDate(fallback.getDate() + 1)
  fallback.setUTCHours(12, 0, 0, 0)
  return fallback.toISOString()
}

/**
 * Check if posting to a platform would exceed daily rate limit.
 */
export function wouldExceedDailyLimit(
  platform: string,
  existingTodayCount: number
): boolean {
  const limit = DAILY_LIMITS[platform] ?? 2
  return existingTodayCount >= limit
}

/**
 * Compute a short fingerprint of post text for duplicate detection.
 */
export async function computePostFingerprint(text: string): Promise<string> {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim()
  const data = new TextEncoder().encode(normalized)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12)
}

/**
 * Generate a weekly posting calendar spread across platforms.
 */
export function generateWeeklyCalendar(
  platforms: string[],
  startDate: Date = new Date()
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = []

  for (let day = 0; day < 7; day++) {
    for (const platform of platforms) {
      const hours = OPTIMAL_HOURS[platform] ?? [12]
      const primaryHour = hours[day % hours.length]

      const slotDate = new Date(startDate)
      slotDate.setDate(slotDate.getDate() + day)
      slotDate.setUTCHours(primaryHour, 0, 0, 0)

      slots.push({
        platform,
        scheduledFor: slotDate.toISOString(),
        available: true,
      })
    }
  }

  return slots.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
}
