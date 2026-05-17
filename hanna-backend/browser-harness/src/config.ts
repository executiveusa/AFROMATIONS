import { z } from 'zod';

const bool = (def: string) =>
  z.string().optional().default(def).transform((v) => v !== 'false' && v !== '0');

const ConfigSchema = z.object({
  BROWSER_HEADLESS: bool('true'),
  BROWSER_DEBUG_PORT: z.coerce.number().int().positive().default(9222),
  BROWSER_PROFILE_DIR: z.string().default('.browser-profile'),
  BROWSER_ALLOWED_ORIGINS: z.string().optional(),
  BROWSER_BLOCKED_ORIGINS: z.string().optional(),
  BROWSER_REQUIRE_APPROVAL: bool('true'),
  BROWSER_CAPTURE_SCREENSHOTS: bool('true'),
  BROWSER_CAPTURE_NETWORK: bool('true'),
  BROWSER_RATE_LIMIT_RPM: z.coerce.number().int().min(1).default(60),
  BROWSER_SESSION_TIMEOUT_MS: z.coerce.number().int().positive().default(300_000),
  BROWSER_MAX_SESSIONS: z.coerce.number().int().min(1).default(3),
  AUDIT_LOG_DIR: z.string().default('./audit-logs'),
  OPERATOR_PORT: z.coerce.number().int().positive().default(7700),
  OPERATOR_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Config = z.infer<typeof ConfigSchema>;

function load(): Config {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error('[browser-harness] Config error:', result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const config: Config = load();
