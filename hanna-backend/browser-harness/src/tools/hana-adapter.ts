/**
 * Hana Browser Adapter
 * ─────────────────────────────────────────────────────────────────────────
 * Every browser action Hana takes MUST flow through this adapter.
 * The pipeline is:
 *
 *   Hana request
 *     → rate limit check
 *     → URL block check
 *     → policy / approval check
 *     → browser tool execution
 *     → audit log
 *     → result returned to Hana
 *
 * Hana should NEVER call browser-tools.ts directly.
 */

import { randomUUID } from 'crypto';
import { auditLogger } from '../audit/logger.js';
import { rateLimiter } from '../policy/rate-limiter.js';
import {
  isUrlBlocked,
  isRiskyAction,
  logPolicyDecision,
} from '../policy/permission-policy.js';
import * as sm from '../browser/session-manager.js';
import * as bt from './browser-tools.js';
import { ToolSchemas, type ToolName } from './registry.js';
import type { ToolResult } from '../types.js';

// ── Request / response types ───────────────────────────────────────────────

export interface HanaToolRequest {
  tool: ToolName;
  params: Record<string, unknown>;
  actor: string;       // e.g. "hana", "operator", "test"
  sessionId?: string;
  approvalId?: string; // pre-approved by operator
}

// Set of operator-pre-approved action IDs (in-memory; operator API writes here)
const preApprovedActions = new Set<string>();

export function recordOperatorApproval(approvalId: string): void {
  preApprovedActions.add(approvalId);
}

export function revokeOperatorApproval(approvalId: string): void {
  preApprovedActions.delete(approvalId);
}

// ── Tool dispatch map ──────────────────────────────────────────────────────

type DispatchFn = (params: Record<string, unknown>) => Promise<ToolResult>;

const DISPATCH: Record<ToolName, DispatchFn> = {
  'browser.open': (p) => bt.browserOpen(p as Parameters<typeof bt.browserOpen>[0]),
  'browser.goto': (p) => bt.browserGoto(p as Parameters<typeof bt.browserGoto>[0]),
  'browser.click': (p) => bt.browserClick(p as Parameters<typeof bt.browserClick>[0]),
  'browser.type': (p) => bt.browserType(p as Parameters<typeof bt.browserType>[0]),
  'browser.press': (p) => bt.browserPress(p as Parameters<typeof bt.browserPress>[0]),
  'browser.screenshot': (p) => bt.browserScreenshot(p as Parameters<typeof bt.browserScreenshot>[0]),
  'browser.get_dom': (p) => bt.browserGetDom(p as Parameters<typeof bt.browserGetDom>[0]),
  'browser.get_text': (p) => bt.browserGetText(p as Parameters<typeof bt.browserGetText>[0]),
  'browser.get_console_logs': (p) => bt.browserGetConsoleLogs(p as Parameters<typeof bt.browserGetConsoleLogs>[0]),
  'browser.get_network_logs': (p) => bt.browserGetNetworkLogs(p as Parameters<typeof bt.browserGetNetworkLogs>[0]),
  'browser.wait_for': (p) => bt.browserWaitFor(p as Parameters<typeof bt.browserWaitFor>[0]),
  'browser.evaluate_sandboxed': (p) => bt.browserEvaluateSandboxed(p as Parameters<typeof bt.browserEvaluateSandboxed>[0]),
  'browser.close': (p) => bt.browserClose(p as Parameters<typeof bt.browserClose>[0]),
  'browser.reset_session': (p) => bt.browserResetSession(p as Parameters<typeof bt.browserResetSession>[0]),
  'browser.list_sessions': () => bt.browserListSessions(),
};

// ── Main entry point ───────────────────────────────────────────────────────

export async function handleHanaRequest(
  req: HanaToolRequest,
): Promise<ToolResult> {
  const { tool, params, actor } = req;
  const sessionId = req.sessionId ?? 'default';

  // ── 1. Rate limit ────────────────────────────────────────────────────────
  if (!rateLimiter.consume(sessionId)) {
    auditLogger.warn({ tool, sessionId, actor }, 'Rate limit exceeded');
    return {
      success: false,
      error: 'Rate limit exceeded. Please wait before retrying.',
    };
  }

  // ── 2. Validate params against schema ────────────────────────────────────
  const schema = ToolSchemas[tool];
  const parsed = schema.safeParse({ ...params, sessionId });
  if (!parsed.success) {
    return {
      success: false,
      error: `Invalid params for ${tool}: ${parsed.error.message}`,
    };
  }

  const validParams = parsed.data as Record<string, unknown>;

  // ── 3. URL block check ───────────────────────────────────────────────────
  if (tool === 'browser.open' || tool === 'browser.goto') {
    const url = String(validParams.url ?? '');
    const { blocked, reason } = isUrlBlocked(url);
    if (blocked) {
      logPolicyDecision(tool, sessionId, 'blocked', reason);
      return { success: false, error: `URL blocked: ${reason}` };
    }
  }

  // ── 4. Risky action / approval gate ─────────────────────────────────────
  if (isRiskyAction(tool, validParams)) {
    // Check if operator pre-approved this specific action
    if (req.approvalId && preApprovedActions.has(req.approvalId)) {
      preApprovedActions.delete(req.approvalId); // one-time use
      logPolicyDecision(tool, sessionId, 'allowed', 'operator pre-approved');
    } else {
      const approvalId = randomUUID();
      logPolicyDecision(tool, sessionId, 'approval_required');
      auditLogger.info(
        { tool, sessionId, actor, approvalId },
        'Operator approval required',
      );

      // If there's an active session, register a pending approval entry
      // so the operator console can show it
      if (sm.hasSession(sessionId)) {
        sm.registerApproval(sessionId, approvalId, {
          id: approvalId,
          tool,
          params: validParams,
          reason: `Risky action: ${tool}`,
          requestedAt: Date.now(),
          resolve: () => {},  // operator resolves via HTTP
        });
      }

      return {
        success: false,
        requiresApproval: true,
        approvalId,
        message: `"${tool}" requires operator approval. Share approvalId "${approvalId}" with the operator, then retry with approvalId in the request.`,
      };
    }
  }

  // ── 5. Execute ───────────────────────────────────────────────────────────
  const dispatchFn = DISPATCH[tool];
  if (!dispatchFn) {
    return { success: false, error: `Unknown tool: ${tool}` };
  }

  const start = Date.now();
  try {
    const result = await dispatchFn(validParams);
    const durationMs = Date.now() - start;

    auditLogger.info(
      { tool, sessionId, actor, durationMs, success: result.success },
      'Tool executed',
    );

    return result;
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    auditLogger.error({ tool, sessionId, actor, error }, 'Tool error');
    return { success: false, error };
  }
}
