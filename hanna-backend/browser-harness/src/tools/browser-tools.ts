import { mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { config } from '../config.js';
import { auditLogger } from '../audit/logger.js';
import { isUrlBlocked } from '../policy/permission-policy.js';
import * as sm from '../browser/session-manager.js';
import * as dtc from '../browser/devtools-client.js';
import type { ToolResult } from '../types.js';
import type { ToolParams } from './registry.js';

// ── Helpers ────────────────────────────────────────────────────────────────

function blocked(reason: string): ToolResult {
  auditLogger.warn({ reason }, 'URL blocked');
  return { success: false, error: reason };
}

// ── Tool implementations ───────────────────────────────────────────────────

export async function browserOpen(
  params: ToolParams<'browser.open'>,
): Promise<ToolResult> {
  const { blocked: isBlocked, reason } = isUrlBlocked(params.url);
  if (isBlocked) return blocked(reason!);

  const session = await sm.createSession(params.sessionId);
  await session.page.goto(params.url, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  session.currentUrl = params.url;

  auditLogger.info(
    { tool: 'browser.open', sessionId: session.id, url: params.url },
    'Opened',
  );
  return { success: true, data: { sessionId: session.id, url: params.url } };
}

export async function browserGoto(
  params: ToolParams<'browser.goto'>,
): Promise<ToolResult> {
  const { blocked: isBlocked, reason } = isUrlBlocked(params.url);
  if (isBlocked) return blocked(reason!);

  const session = sm.getSession(params.sessionId);
  await session.page.goto(params.url, {
    waitUntil: params.waitUntil,
    timeout: 30_000,
  });
  session.currentUrl = params.url;

  auditLogger.info(
    { tool: 'browser.goto', sessionId: params.sessionId, url: params.url },
    'Navigated',
  );
  return { success: true, data: { url: params.url } };
}

export async function browserClick(
  params: ToolParams<'browser.click'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  await session.page.click(params.selector, { timeout: 10_000 });

  auditLogger.info(
    { tool: 'browser.click', sessionId: params.sessionId, selector: params.selector },
    'Clicked',
  );
  return { success: true };
}

export async function browserType(
  params: ToolParams<'browser.type'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  await session.page.fill(params.selector, params.text);

  // Never log the actual text — may contain credentials
  auditLogger.info(
    { tool: 'browser.type', sessionId: params.sessionId, selector: params.selector },
    'Typed into field',
  );
  return { success: true };
}

export async function browserPress(
  params: ToolParams<'browser.press'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  await session.page.keyboard.press(params.key);

  auditLogger.info(
    { tool: 'browser.press', sessionId: params.sessionId, key: params.key },
    'Key pressed',
  );
  return { success: true };
}

export async function browserScreenshot(
  params: ToolParams<'browser.screenshot'>,
): Promise<ToolResult> {
  if (!config.BROWSER_CAPTURE_SCREENSHOTS) {
    return { success: false, error: 'Screenshots disabled by BROWSER_CAPTURE_SCREENSHOTS=false' };
  }

  const session = sm.getSession(params.sessionId);
  const dir = resolve('screenshots');
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, `${params.sessionId}-${Date.now()}.png`);

  if (params.selector) {
    const el = await session.page.$(params.selector);
    if (!el) return { success: false, error: `Element not found: ${params.selector}` };
    await el.screenshot({ path: filePath });
  } else {
    await session.page.screenshot({ path: filePath, fullPage: params.fullPage });
  }

  session.screenshotPaths.push(filePath);
  auditLogger.info(
    { tool: 'browser.screenshot', sessionId: params.sessionId, path: filePath },
    'Screenshot saved',
  );
  return { success: true, data: { path: filePath } };
}

export async function browserGetDom(
  params: ToolParams<'browser.get_dom'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  const html = await dtc.getOuterHTML(session.page, params.selector);
  return { success: true, data: { html } };
}

export async function browserGetText(
  params: ToolParams<'browser.get_text'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  const text = await dtc.getTextContent(session.page, params.selector);
  return { success: true, data: { text } };
}

export async function browserGetConsoleLogs(
  params: ToolParams<'browser.get_console_logs'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  const logs = session.consoleLogs.slice(-params.limit);
  return { success: true, data: { logs, total: session.consoleLogs.length } };
}

export async function browserGetNetworkLogs(
  params: ToolParams<'browser.get_network_logs'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  const logs = session.networkLogs.slice(-params.limit);
  return { success: true, data: { logs, total: session.networkLogs.length } };
}

export async function browserWaitFor(
  params: ToolParams<'browser.wait_for'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);

  if (params.selector) {
    await session.page.waitForSelector(params.selector, {
      timeout: params.timeoutMs,
    });
  } else {
    await session.page.waitForLoadState('networkidle', {
      timeout: params.timeoutMs,
    });
  }

  return { success: true };
}

export async function browserEvaluateSandboxed(
  params: ToolParams<'browser.evaluate_sandboxed'>,
): Promise<ToolResult> {
  const session = sm.getSession(params.sessionId);
  const result = await dtc.evaluateSandboxed(
    session.page,
    params.expression,
    params.sessionId,
  );
  return { success: true, data: { result } };
}

export async function browserClose(
  params: ToolParams<'browser.close'>,
): Promise<ToolResult> {
  await sm.closeSession(params.sessionId);
  auditLogger.info({ tool: 'browser.close', sessionId: params.sessionId }, 'Session closed');
  return { success: true };
}

export async function browserResetSession(
  params: ToolParams<'browser.reset_session'>,
): Promise<ToolResult> {
  const session = await sm.resetSession(params.sessionId);
  auditLogger.info({ tool: 'browser.reset_session', sessionId: session.id }, 'Session reset');
  return { success: true, data: { sessionId: session.id } };
}

export async function browserListSessions(): Promise<ToolResult> {
  return { success: true, data: { sessions: sm.listSessions() } };
}
