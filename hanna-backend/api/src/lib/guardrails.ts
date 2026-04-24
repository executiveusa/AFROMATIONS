/**
 * Guardrails middleware for Hanna agent
 * Sanitizes inputs and enforces safety boundaries
 */

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /forget\s+(everything|all|your\s+rules)/i,
  /new\s+instructions?\s*:/i,
  /override\s+(your|the)\s+(system|safety)/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /do\s+anything\s+now/i,
]

// Blocked content categories
const BLOCKED_PATTERNS = [
  /\b(kill|murder|bomb|weapon|exploit|hack)\b.*\b(how|tutorial|guide|steps)\b/i,
  /\b(password|credit\s*card|ssn|social\s*security)\b/i,
]

export interface GuardrailResult {
  safe: boolean
  reason?: string
  sanitized: string
}

/**
 * Check user input against guardrails
 */
export function checkGuardrails(input: string): GuardrailResult {
  // Length check
  if (input.length > 2000) {
    return { safe: false, reason: 'Message too long. Keep it under 2000 characters.', sanitized: '' }
  }

  // Empty check
  const trimmed = input.trim()
  if (!trimmed) {
    return { safe: false, reason: 'Empty message.', sanitized: '' }
  }

  // Prompt injection detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        reason: 'That request is outside my boundaries. I protect this studio.',
        sanitized: '',
      }
    }
  }

  // Blocked content
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        reason: 'I only handle anime and studio work. That topic is off-limits.',
        sanitized: '',
      }
    }
  }

  // Sanitize: strip HTML/script tags, control chars
  const sanitized = trimmed
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')

  return { safe: true, sanitized }
}

/**
 * Rate limiting state (per-worker instance, reset on deploy)
 */
const sessionCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(sessionId: string, maxPerHour = 60): boolean {
  const now = Date.now()
  const session = sessionCounts.get(sessionId)

  if (!session || now > session.resetAt) {
    sessionCounts.set(sessionId, { count: 1, resetAt: now + 3600000 })
    return true
  }

  if (session.count >= maxPerHour) return false

  session.count++
  return true
}
