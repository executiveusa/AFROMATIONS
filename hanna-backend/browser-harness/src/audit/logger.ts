import pino from 'pino';
import { config } from '../config.js';

// ── Secret redaction patterns ──────────────────────────────────────────────

const REDACT_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-secret',
]);

const REDACT_VALUE_PATTERNS: RegExp[] = [
  /\bBearer\s+[\w\-\.]+/gi,
  /\btoken[=:]\s*["']?[\w\-\.]+["']?/gi,
  /\bpassword[=:]\s*["']?[^\s"'&]+["']?/gi,
  /\bsecret[=:]\s*["']?[^\s"'&]+["']?/gi,
  /\bapi[_-]?key[=:]\s*["']?[\w\-]+["']?/gi,
  /\baccess_token[=:]\s*["']?[\w\-\.]+["']?/gi,
];

export function redactString(s: string): string {
  let out = s;
  for (const pattern of REDACT_VALUE_PATTERNS) {
    out = out.replace(pattern, '[REDACTED]');
  }
  return out;
}

export function redactHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    out[k] = REDACT_HEADER_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : v;
  }
  return out;
}

// ── Logger instance ────────────────────────────────────────────────────────

export const logger = pino({
  level: config.NODE_ENV === 'test' ? 'silent' : 'info',
  base: { service: 'browser-harness' },
  redact: {
    paths: [
      '*.authorization',
      '*.cookie',
      '*.password',
      '*.secret',
      '*.token',
      '*.apiKey',
      '*.api_key',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const auditLogger = logger.child({ component: 'audit' });
