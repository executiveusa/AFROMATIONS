/**
 * DevTools client helpers — thin wrappers over Playwright's CDP access.
 * All page evaluation is routed through here so sandboxing/audit is centralized.
 */

import type { Page } from 'playwright';
import { auditLogger } from '../audit/logger.js';

// ── DOM inspection ─────────────────────────────────────────────────────────

export async function getOuterHTML(page: Page, selector?: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = sel
      ? document.querySelector(sel)
      : document.documentElement;
    return el?.outerHTML?.slice(0, 150_000) ?? '';
  }, selector ?? null);
}

export async function getTextContent(page: Page, selector?: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = sel ? document.querySelector(sel) : document.body;
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60_000);
  }, selector ?? null);
}

export async function getTitle(page: Page): Promise<string> {
  return page.title();
}

export async function getPageMeta(
  page: Page,
): Promise<{ title: string; url: string; description: string }> {
  return page.evaluate(() => ({
    title: document.title,
    url: location.href,
    description:
      (document.querySelector('meta[name="description"]') as HTMLMetaElement)
        ?.content ?? '',
  }));
}

// ── Sandboxed JS evaluation ────────────────────────────────────────────────
// Runs JS inside the page's renderer process but shadows fetch/XHR/WebSocket
// to prevent exfiltration. This is basic sandboxing — the policy layer is
// the real security boundary (operator must approve evaluate_sandboxed calls).

export async function evaluateSandboxed(
  page: Page,
  expression: string,
  sessionId: string,
): Promise<unknown> {
  auditLogger.info({ sessionId, expressionLen: expression.length }, 'Evaluating sandboxed JS');

  const result = await page.evaluate((expr) => {
    // Shadow network globals so evaluated code can't exfiltrate data
    /* eslint-disable no-unused-vars */
    const fetch = undefined;
    const XMLHttpRequest = undefined;
    const WebSocket = undefined;
    const EventSource = undefined;
    /* eslint-enable no-unused-vars */
    // eslint-disable-next-line no-eval
    return eval(expr);
  }, expression);

  return result;
}

// ── CDP-level helpers ──────────────────────────────────────────────────────

export async function getPerformanceMetrics(
  page: Page,
): Promise<Record<string, number>> {
  const cdp = await page.context().newCDPSession(page);
  const { metrics } = await cdp.send('Performance.getMetrics');
  await cdp.detach();
  return Object.fromEntries(metrics.map((m: { name: string; value: number }) => [m.name, m.value]));
}

export async function clearBrowsingData(page: Page): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.clearBrowserCache');
  await cdp.send('Network.clearBrowserCookies');
  await cdp.detach();
}
