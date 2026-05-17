import { z } from 'zod';

// ── Parameter schemas for every browser tool ───────────────────────────────

export const ToolSchemas = {
  'browser.open': z.object({
    url: z.string().url({ message: 'Must be a valid URL' }),
    sessionId: z.string().optional(),
  }),

  'browser.goto': z.object({
    url: z.string().url(),
    sessionId: z.string(),
    waitUntil: z
      .enum(['load', 'domcontentloaded', 'networkidle'])
      .optional()
      .default('domcontentloaded'),
  }),

  'browser.click': z.object({
    selector: z.string().min(1),
    sessionId: z.string(),
  }),

  'browser.type': z.object({
    selector: z.string().min(1),
    text: z.string(),
    sessionId: z.string(),
  }),

  'browser.press': z.object({
    key: z.string().min(1),
    sessionId: z.string(),
  }),

  'browser.screenshot': z.object({
    sessionId: z.string(),
    fullPage: z.boolean().optional().default(false),
    selector: z.string().optional(),
  }),

  'browser.get_dom': z.object({
    sessionId: z.string(),
    selector: z.string().optional(),
  }),

  'browser.get_text': z.object({
    sessionId: z.string(),
    selector: z.string().optional(),
  }),

  'browser.get_console_logs': z.object({
    sessionId: z.string(),
    limit: z.number().int().min(1).max(500).optional().default(50),
  }),

  'browser.get_network_logs': z.object({
    sessionId: z.string(),
    limit: z.number().int().min(1).max(1000).optional().default(100),
  }),

  'browser.wait_for': z.object({
    sessionId: z.string(),
    selector: z.string().optional(),
    timeoutMs: z.number().int().min(100).max(30_000).optional().default(10_000),
  }),

  'browser.evaluate_sandboxed': z.object({
    sessionId: z.string(),
    expression: z.string().min(1).max(4_000),
  }),

  'browser.close': z.object({
    sessionId: z.string(),
  }),

  'browser.reset_session': z.object({
    sessionId: z.string(),
  }),

  'browser.list_sessions': z.object({}),
} as const;

export type ToolName = keyof typeof ToolSchemas;
export type ToolParams<T extends ToolName> = z.infer<(typeof ToolSchemas)[T]>;

// ── Tool metadata (descriptions surfaced to MCP clients) ──────────────────

export const TOOL_DESCRIPTIONS: Record<ToolName, string> = {
  'browser.open':
    'Open Chrome and navigate to a URL in a new isolated browser session. Returns sessionId for subsequent calls.',
  'browser.goto':
    'Navigate an existing session to a new URL. Requires an active sessionId.',
  'browser.click':
    'Click an element matched by CSS selector in the active page.',
  'browser.type':
    'Fill a form field with text. Selector should target an input or textarea.',
  'browser.press':
    'Send a keyboard key press (e.g. Enter, Tab, Escape).',
  'browser.screenshot':
    'Capture a screenshot of the current page or a specific element. Returns local file path.',
  'browser.get_dom':
    'Return the outer HTML of the page or a specific element (truncated at 150k chars).',
  'browser.get_text':
    'Return visible text content of the page or a specific element (truncated at 60k chars).',
  'browser.get_console_logs':
    'Return recent browser console log entries (secrets redacted).',
  'browser.get_network_logs':
    'Return recent network requests/responses (auth headers redacted).',
  'browser.wait_for':
    'Wait for a CSS selector to appear, or for networkidle state.',
  'browser.evaluate_sandboxed':
    'Evaluate a JavaScript expression in the page context. Requires operator approval. Network globals are shadowed.',
  'browser.close':
    'Close and destroy a browser session.',
  'browser.reset_session':
    'Close and reopen a session with the same ID, clearing all state.',
  'browser.list_sessions':
    'List all active browser sessions and their metadata.',
};
