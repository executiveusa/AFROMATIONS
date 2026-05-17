import net from 'net';
import { isChromeAvailable } from '../browser/chrome-launcher.js';
import { listSessions } from '../browser/session-manager.js';
import { config } from '../config.js';
import { logger } from '../audit/logger.js';

export interface HealthReport {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  checks: {
    chrome: 'ok' | 'fail';
    chromeDebugPort: 'open' | 'closed' | 'skipped';
    sessions: { active: number; max: number };
    config: { headless: boolean; requireApproval: boolean };
  };
  errors: string[];
}

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = net.createConnection({ port, host: '127.0.0.1' });
    sock.once('connect', () => { sock.destroy(); resolve(true); });
    sock.once('error', () => resolve(false));
    setTimeout(() => { sock.destroy(); resolve(false); }, 1_000);
  });
}

export async function runHealthCheck(): Promise<HealthReport> {
  const errors: string[] = [];

  // Chrome availability
  let chromeOk = false;
  try {
    chromeOk = await isChromeAvailable();
  } catch (e) {
    errors.push(`Chrome check failed: ${e}`);
  }

  // CDP debug port (optional — only if BROWSER_DEBUG_PORT is configured)
  let debugPortStatus: HealthReport['checks']['chromeDebugPort'] = 'skipped';
  if (config.BROWSER_DEBUG_PORT) {
    const open = await checkPort(config.BROWSER_DEBUG_PORT);
    debugPortStatus = open ? 'open' : 'closed';
  }

  const sessions = listSessions();
  const report: HealthReport = {
    status: chromeOk ? 'ok' : 'down',
    timestamp: new Date().toISOString(),
    checks: {
      chrome: chromeOk ? 'ok' : 'fail',
      chromeDebugPort: debugPortStatus,
      sessions: { active: sessions.length, max: config.BROWSER_MAX_SESSIONS },
      config: {
        headless: config.BROWSER_HEADLESS,
        requireApproval: config.BROWSER_REQUIRE_APPROVAL,
      },
    },
    errors,
  };

  if (errors.length > 0) report.status = 'degraded';

  logger.info({ health: report.status }, 'Health check complete');
  return report;
}
