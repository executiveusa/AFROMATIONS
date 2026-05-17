import { type Browser, type Page, type BrowserContext } from 'playwright';
import { randomUUID } from 'crypto';
import { launchChrome } from './chrome-launcher.js';
import { auditLogger, redactString, redactHeaders } from '../audit/logger.js';
import { config } from '../config.js';
import type {
  ConsoleEntry,
  NetworkEntry,
  PendingApproval,
  SessionSummary,
} from '../types.js';

export interface BrowserSession {
  id: string;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  createdAt: number;
  lastActivityAt: number;
  currentUrl: string;
  consoleLogs: ConsoleEntry[];
  networkLogs: NetworkEntry[];
  screenshotPaths: string[];
  pendingApprovals: Map<string, PendingApproval>;
}

const sessions = new Map<string, BrowserSession>();
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

// ── Session lifecycle ──────────────────────────────────────────────────────

export async function createSession(sessionId?: string): Promise<BrowserSession> {
  if (sessions.size >= config.BROWSER_MAX_SESSIONS) {
    throw new Error(
      `Max concurrent sessions reached (${config.BROWSER_MAX_SESSIONS}). Close an existing session first.`,
    );
  }

  const id = sessionId ?? randomUUID();

  if (sessions.has(id)) {
    return sessions.get(id)!;
  }

  const browser = await launchChrome();

  // Each context is fully isolated: no cookies, storage, or credentials shared
  const context = await browser.newContext({
    acceptDownloads: false, // block all downloads by default
    storageState: undefined, // no persisted auth/cookies
  });

  // Block file:// scheme at the context level
  await context.route('file://**', (route) => {
    auditLogger.warn(
      { sessionId: id, url: route.request().url() },
      'file:// access blocked',
    );
    route.abort('blockedbyclient');
  });

  const page = await context.newPage();

  const session: BrowserSession = {
    id,
    browser,
    context,
    page,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    currentUrl: 'about:blank',
    consoleLogs: [],
    networkLogs: [],
    screenshotPaths: [],
    pendingApprovals: new Map(),
  };

  // Capture console logs (redacted)
  page.on('console', (msg) => {
    session.consoleLogs.push({
      type: msg.type(),
      text: redactString(msg.text()),
      timestamp: Date.now(),
    });
    if (session.consoleLogs.length > 500) session.consoleLogs.shift();
  });

  // Capture network logs (headers redacted)
  if (config.BROWSER_CAPTURE_NETWORK) {
    page.on('request', (req) => {
      session.networkLogs.push({
        url: req.url(),
        method: req.method(),
        requestHeaders: redactHeaders(req.headers()),
        timestamp: Date.now(),
      });
      if (session.networkLogs.length > 1_000) session.networkLogs.shift();
    });

    page.on('response', (res) => {
      // Attach status + response headers to the matching request entry
      const entry = [...session.networkLogs]
        .reverse()
        .find((e) => e.url === res.url() && !e.status);
      if (entry) {
        entry.status = res.status();
        entry.responseHeaders = redactHeaders(res.headers());
      }
    });
  }

  sessions.set(id, session);
  auditLogger.info({ sessionId: id }, 'Session created');

  startCleanupTimer();
  return session;
}

export function getSession(id: string): BrowserSession {
  const session = sessions.get(id);
  if (!session) throw new Error(`Session not found: ${id}`);
  session.lastActivityAt = Date.now();
  return session;
}

export async function closeSession(id: string): Promise<void> {
  const session = sessions.get(id);
  if (!session) return;

  try {
    await session.browser.close();
  } catch {}

  sessions.delete(id);
  auditLogger.info({ sessionId: id }, 'Session closed');
}

export async function resetSession(id: string): Promise<BrowserSession> {
  await closeSession(id);
  return createSession(id);
}

export function listSessions(): SessionSummary[] {
  return Array.from(sessions.values()).map((s) => ({
    id: s.id,
    createdAt: s.createdAt,
    lastActivityAt: s.lastActivityAt,
    currentUrl: s.currentUrl,
    consoleLogCount: s.consoleLogs.length,
    networkLogCount: s.networkLogs.length,
    screenshotCount: s.screenshotPaths.length,
    pendingApprovalCount: s.pendingApprovals.size,
  }));
}

export function hasSession(id: string): boolean {
  return sessions.has(id);
}

// ── Approval queue ─────────────────────────────────────────────────────────

export function registerApproval(
  sessionId: string,
  approvalId: string,
  approval: PendingApproval,
): void {
  const session = getSession(sessionId);
  session.pendingApprovals.set(approvalId, approval);
}

export function resolveApproval(
  sessionId: string,
  approvalId: string,
  approved: boolean,
): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  const approval = session.pendingApprovals.get(approvalId);
  if (!approval) return false;

  approval.resolve(approved);
  session.pendingApprovals.delete(approvalId);
  auditLogger.info({ sessionId, approvalId, approved }, 'Approval resolved');
  return true;
}

// ── Timeout cleanup ────────────────────────────────────────────────────────

function startCleanupTimer(): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(async () => {
    const now = Date.now();
    for (const [id, session] of sessions) {
      if (now - session.lastActivityAt > config.BROWSER_SESSION_TIMEOUT_MS) {
        auditLogger.info({ sessionId: id }, 'Session timed out');
        await closeSession(id);
      }
    }
  }, 60_000);

  // Don't hold the process open just for cleanup
  if (typeof cleanupInterval === 'object' && cleanupInterval?.unref) {
    cleanupInterval.unref();
  }
}
