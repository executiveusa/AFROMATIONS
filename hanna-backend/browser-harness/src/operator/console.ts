/**
 * Operator Console — HTTP API for Tyshawn only.
 *
 * Authentication: Bearer token via OPERATOR_API_KEY env var.
 * All endpoints require operator role. Never expose to public users.
 *
 * Endpoints:
 *   GET  /sessions                     — list active sessions
 *   GET  /sessions/:id/screenshots     — list screenshot paths
 *   GET  /sessions/:id/logs/console    — console logs
 *   GET  /sessions/:id/logs/network    — network logs (headers redacted)
 *   GET  /sessions/:id/approvals       — pending approvals
 *   POST /sessions/:id/approve/:aid    — approve a pending action
 *   POST /sessions/:id/deny/:aid       — deny a pending action
 *   POST /sessions/:id/reset           — reset a session
 *   DELETE /sessions/:id               — kill a session
 *   PUT  /policy/allowed-origins       — update allowed origins at runtime
 */

import http from 'http';
import { config } from '../config.js';
import { logger } from '../audit/logger.js';
import * as sm from '../browser/session-manager.js';
import { recordOperatorApproval } from '../tools/hana-adapter.js';

// ── Auth ───────────────────────────────────────────────────────────────────

function isAuthorized(req: http.IncomingMessage): boolean {
  const auth = req.headers['authorization'] ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  return !!config.OPERATOR_API_KEY && token === config.OPERATOR_API_KEY;
}

// ── JSON helpers ───────────────────────────────────────────────────────────

function send(res: http.ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json),
  });
  res.end(json);
}

async function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

// ── Router ─────────────────────────────────────────────────────────────────

async function handle(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  if (!isAuthorized(req)) {
    send(res, 401, { error: 'Unauthorized — operator API key required' });
    return;
  }

  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://localhost:${config.OPERATOR_PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);

  // GET /sessions
  if (method === 'GET' && parts[0] === 'sessions' && parts.length === 1) {
    send(res, 200, { sessions: sm.listSessions() });
    return;
  }

  const sessionId = parts[1];

  // GET /sessions/:id/screenshots
  if (method === 'GET' && parts[2] === 'screenshots') {
    try {
      const session = sm.getSession(sessionId);
      send(res, 200, { paths: session.screenshotPaths });
    } catch (e) {
      send(res, 404, { error: String(e) });
    }
    return;
  }

  // GET /sessions/:id/logs/console
  if (method === 'GET' && parts[2] === 'logs' && parts[3] === 'console') {
    try {
      const session = sm.getSession(sessionId);
      send(res, 200, { logs: session.consoleLogs });
    } catch (e) {
      send(res, 404, { error: String(e) });
    }
    return;
  }

  // GET /sessions/:id/logs/network
  if (method === 'GET' && parts[2] === 'logs' && parts[3] === 'network') {
    try {
      const session = sm.getSession(sessionId);
      send(res, 200, { logs: session.networkLogs });
    } catch (e) {
      send(res, 404, { error: String(e) });
    }
    return;
  }

  // GET /sessions/:id/approvals
  if (method === 'GET' && parts[2] === 'approvals') {
    try {
      const session = sm.getSession(sessionId);
      const approvals = Array.from(session.pendingApprovals.values()).map(
        (a) => ({
          id: a.id,
          tool: a.tool,
          reason: a.reason,
          requestedAt: a.requestedAt,
        }),
      );
      send(res, 200, { approvals });
    } catch (e) {
      send(res, 404, { error: String(e) });
    }
    return;
  }

  const approvalId = parts[3];

  // POST /sessions/:id/approve/:aid
  if (method === 'POST' && parts[2] === 'approve' && approvalId) {
    // Register as pre-approved for the hana-adapter retry path
    recordOperatorApproval(approvalId);
    sm.resolveApproval(sessionId, approvalId, true);
    send(res, 200, { approved: true, approvalId });
    return;
  }

  // POST /sessions/:id/deny/:aid
  if (method === 'POST' && parts[2] === 'deny' && approvalId) {
    sm.resolveApproval(sessionId, approvalId, false);
    send(res, 200, { denied: true, approvalId });
    return;
  }

  // POST /sessions/:id/reset
  if (method === 'POST' && parts[2] === 'reset') {
    try {
      await sm.resetSession(sessionId);
      send(res, 200, { reset: true, sessionId });
    } catch (e) {
      send(res, 500, { error: String(e) });
    }
    return;
  }

  // DELETE /sessions/:id
  if (method === 'DELETE' && parts[0] === 'sessions' && sessionId) {
    await sm.closeSession(sessionId);
    send(res, 200, { closed: true, sessionId });
    return;
  }

  send(res, 404, { error: 'Not found' });
}

// ── Start server ───────────────────────────────────────────────────────────

export function startOperatorConsole(): void {
  const server = http.createServer((req, res) => {
    handle(req, res).catch((err) => {
      send(res, 500, { error: String(err) });
    });
  });

  server.listen(config.OPERATOR_PORT, '127.0.0.1', () => {
    logger.info(
      { port: config.OPERATOR_PORT },
      'Operator console listening on 127.0.0.1 (localhost only)',
    );
  });
}

// Run directly: tsx src/operator/console.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!config.OPERATOR_API_KEY) {
    console.error(
      '[operator] OPERATOR_API_KEY is not set — server will reject all requests',
    );
  }
  startOperatorConsole();
}
