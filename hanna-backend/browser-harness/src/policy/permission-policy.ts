import { config } from '../config.js';
import { auditLogger } from '../audit/logger.js';

// ── Always-blocked URL patterns ────────────────────────────────────────────
// Private IPs, metadata services, file system — never accessible by default.

const BLOCKED_URL_PATTERNS: RegExp[] = [
  /^file:\/\//,
  /^https?:\/\/localhost(?::\d+)?/,
  /^https?:\/\/127\.\d+\.\d+\.\d+/,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/10\.\d+\.\d+\.\d+/,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/,
  /^https?:\/\/192\.168\.\d+\.\d+/,
  /^https?:\/\/169\.254\.\d+\.\d+/, // link-local / AWS metadata
  /^https?:\/\/100\.64\.\d+\.\d+/,  // CGNAT
  /169\.254\.169\.254/,              // AWS IMDS (any form)
  /metadata\.google\.internal/,
  /metadata\.azure\.com/,
];

// ── Risky URL heuristics ───────────────────────────────────────────────────

const RISKY_URL_PATTERNS: RegExp[] = [
  /checkout/i,
  /payment|pay\//i,
  /purchase|buy\//i,
  /delete.*account|account.*delete/i,
  /\/admin\b/,
  /\/settings\b/,
  /signin|sign-in|login|log-in/i,
  /\/upload\b/i,
];

// ── Selector/text heuristics for risky interactions ────────────────────────

const CREDENTIAL_SELECTOR_KEYWORDS = [
  'password', 'passwd', 'secret', 'token', 'auth',
  'credential', 'pin', 'cvv', 'card-number', 'ssn',
];

const SUBMIT_KEYWORDS = [
  'submit', 'checkout', 'buy', 'pay', 'confirm', 'place order',
  'delete', 'remove', 'publish', 'post', 'send', 'sign in', 'login',
];

// ── Public API ─────────────────────────────────────────────────────────────

export function isUrlBlocked(url: string): { blocked: boolean; reason?: string } {
  for (const pattern of BLOCKED_URL_PATTERNS) {
    if (pattern.test(url)) {
      return { blocked: true, reason: `Private/internal URL blocked` };
    }
  }

  const blockedOrigins =
    config.BROWSER_BLOCKED_ORIGINS?.split(',').filter(Boolean) ?? [];
  for (const origin of blockedOrigins) {
    if (url.includes(origin.trim())) {
      return { blocked: true, reason: `Origin blocked by operator config: ${origin.trim()}` };
    }
  }

  const allowedOrigins =
    config.BROWSER_ALLOWED_ORIGINS?.split(',').filter(Boolean) ?? [];
  if (allowedOrigins.length > 0) {
    const allowed = allowedOrigins.some((o) => url.includes(o.trim()));
    if (!allowed) {
      return { blocked: true, reason: `Origin not in operator allowlist` };
    }
  }

  return { blocked: false };
}

export function isRiskyUrl(url: string): boolean {
  return RISKY_URL_PATTERNS.some((p) => p.test(url));
}

export function isRiskyAction(
  tool: string,
  params: Record<string, unknown>,
): boolean {
  if (!config.BROWSER_REQUIRE_APPROVAL) return false;

  // JS evaluation always requires approval
  if (tool === 'browser.evaluate_sandboxed') return true;

  // Typing into a credential field
  if (tool === 'browser.type') {
    const selector = String(params.selector ?? '').toLowerCase();
    if (CREDENTIAL_SELECTOR_KEYWORDS.some((k) => selector.includes(k))) return true;
  }

  // Clicking a submit/destructive button
  if (tool === 'browser.click') {
    const selector = String(params.selector ?? '').toLowerCase();
    if (SUBMIT_KEYWORDS.some((k) => selector.includes(k))) return true;
  }

  // Navigating to a risky page
  if (tool === 'browser.open' || tool === 'browser.goto') {
    const url = String(params.url ?? '');
    if (isRiskyUrl(url)) return true;
  }

  return false;
}

export function logPolicyDecision(
  tool: string,
  sessionId: string,
  decision: 'allowed' | 'blocked' | 'approval_required',
  reason?: string,
): void {
  auditLogger.info({ tool, sessionId, decision, reason }, 'Policy decision');
}
