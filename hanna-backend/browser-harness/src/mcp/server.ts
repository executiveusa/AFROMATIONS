#!/usr/bin/env node
/**
 * Hana Browser Harness — MCP Server
 *
 * Exposes all browser tools to MCP clients (Claude, Hermes, etc.)
 * via stdio transport. Every tool call flows through hana-adapter.ts
 * which enforces rate limits, URL policies, and approval gates.
 *
 * Usage:
 *   tsx src/mcp/server.ts
 *   # or via npm run mcp
 *
 * Register in .mcp.json:
 *   "hana-browser": {
 *     "command": "npx",
 *     "args": ["tsx", "hanna-backend/browser-harness/src/mcp/server.ts"],
 *     "env": { "BROWSER_HEADLESS": "true", ... }
 *   }
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { handleHanaRequest } from '../tools/hana-adapter.js';
import { TOOL_DESCRIPTIONS } from '../tools/registry.js';
import { logger } from '../audit/logger.js';
import type { ToolName } from '../tools/registry.js';

const server = new McpServer({
  name: 'hana-browser-harness',
  version: '1.0.0',
});

// ── Helper: wraps each tool registration with policy-enforced adapter ───────

function reg(
  name: string,
  description: string,
  shape: Record<string, z.ZodTypeAny>,
  toolName: ToolName,
): void {
  server.registerTool(
    name,
    { description, inputSchema: shape },
    async (args) => {
      const result = await handleHanaRequest({
        tool: toolName,
        params: args as Record<string, unknown>,
        actor: 'mcp-client',
      });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        isError: result.success ? undefined : true,
      };
    },
  );
}

// ── Register all tools ──────────────────────────────────────────────────────

reg(
  'browser_open',
  TOOL_DESCRIPTIONS['browser.open'],
  {
    url: z.string().url().describe('URL to navigate to'),
    sessionId: z.string().optional().describe('Optional session ID to reuse'),
  },
  'browser.open',
);

reg(
  'browser_goto',
  TOOL_DESCRIPTIONS['browser.goto'],
  {
    url: z.string().url().describe('URL to navigate to'),
    sessionId: z.string().describe('Active session ID'),
    waitUntil: z
      .enum(['load', 'domcontentloaded', 'networkidle'])
      .optional()
      .describe('Wait condition'),
  },
  'browser.goto',
);

reg(
  'browser_click',
  TOOL_DESCRIPTIONS['browser.click'],
  {
    selector: z.string().describe('CSS selector of element to click'),
    sessionId: z.string().describe('Active session ID'),
  },
  'browser.click',
);

reg(
  'browser_type',
  TOOL_DESCRIPTIONS['browser.type'],
  {
    selector: z.string().describe('CSS selector of input/textarea'),
    text: z.string().describe('Text to type'),
    sessionId: z.string().describe('Active session ID'),
  },
  'browser.type',
);

reg(
  'browser_press',
  TOOL_DESCRIPTIONS['browser.press'],
  {
    key: z.string().describe('Key to press (e.g. Enter, Tab, Escape)'),
    sessionId: z.string().describe('Active session ID'),
  },
  'browser.press',
);

reg(
  'browser_screenshot',
  TOOL_DESCRIPTIONS['browser.screenshot'],
  {
    sessionId: z.string().describe('Active session ID'),
    fullPage: z.boolean().optional().describe('Capture full scrollable page'),
    selector: z.string().optional().describe('Capture a specific element'),
  },
  'browser.screenshot',
);

reg(
  'browser_get_dom',
  TOOL_DESCRIPTIONS['browser.get_dom'],
  {
    sessionId: z.string().describe('Active session ID'),
    selector: z.string().optional().describe('CSS selector to scope DOM extraction'),
  },
  'browser.get_dom',
);

reg(
  'browser_get_text',
  TOOL_DESCRIPTIONS['browser.get_text'],
  {
    sessionId: z.string().describe('Active session ID'),
    selector: z.string().optional().describe('CSS selector to scope text extraction'),
  },
  'browser.get_text',
);

reg(
  'browser_get_console_logs',
  TOOL_DESCRIPTIONS['browser.get_console_logs'],
  {
    sessionId: z.string().describe('Active session ID'),
    limit: z.number().optional().describe('Max entries to return (default 50)'),
  },
  'browser.get_console_logs',
);

reg(
  'browser_get_network_logs',
  TOOL_DESCRIPTIONS['browser.get_network_logs'],
  {
    sessionId: z.string().describe('Active session ID'),
    limit: z.number().optional().describe('Max entries to return (default 100)'),
  },
  'browser.get_network_logs',
);

reg(
  'browser_wait_for',
  TOOL_DESCRIPTIONS['browser.wait_for'],
  {
    sessionId: z.string().describe('Active session ID'),
    selector: z.string().optional().describe('CSS selector to wait for'),
    timeoutMs: z.number().optional().describe('Timeout in ms (default 10000)'),
  },
  'browser.wait_for',
);

reg(
  'browser_evaluate_sandboxed',
  TOOL_DESCRIPTIONS['browser.evaluate_sandboxed'],
  {
    sessionId: z.string().describe('Active session ID'),
    expression: z
      .string()
      .describe('JavaScript expression to evaluate (requires operator approval)'),
  },
  'browser.evaluate_sandboxed',
);

reg(
  'browser_close',
  TOOL_DESCRIPTIONS['browser.close'],
  { sessionId: z.string().describe('Session ID to close') },
  'browser.close',
);

reg(
  'browser_reset_session',
  TOOL_DESCRIPTIONS['browser.reset_session'],
  { sessionId: z.string().describe('Session ID to reset') },
  'browser.reset_session',
);

reg(
  'browser_list_sessions',
  TOOL_DESCRIPTIONS['browser.list_sessions'],
  {},
  'browser.list_sessions',
);

// ── Start ───────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('Hana browser harness MCP server started (stdio)');
}

main().catch((err) => {
  logger.error({ err }, 'MCP server crashed');
  process.exit(1);
});
