#!/usr/bin/env node
/**
 * Hermes Browser CLI
 *
 * Usage:
 *   hermes browser start
 *   hermes browser status
 *   hermes browser open <url>
 *   hermes browser screenshot [--session <id>]
 *   hermes browser logs [--session <id>] [--type console|network]
 *   hermes browser reset [--session <id>]
 *   hermes browser stop [--session <id>]
 *   hermes browser health
 *
 * Run via:
 *   npx tsx src/cli/hermes.ts browser start
 *   npm run dev -- browser start
 */

import { Command } from 'commander';
import { handleHanaRequest } from '../tools/hana-adapter.js';
import { runHealthCheck } from '../health/check.js';
import { listSessions } from '../browser/session-manager.js';

const DEFAULT_SESSION = 'hermes-cli';

function out(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function fail(msg: string, code = 1) {
  console.error(`[hermes] ${msg}`);
  process.exit(code);
}

// ── Root program ────────────────────────────────────────────────────────────

const program = new Command('hermes')
  .description('Hermes — Hana agent infrastructure CLI')
  .version('1.0.0');

// ── hermes browser ─────────────────────────────────────────────────────────

const browser = program
  .command('browser')
  .description('Browser control commands');

// hermes browser start
browser
  .command('start')
  .description('Open Chrome and start a new browser session')
  .requiredOption('-u, --url <url>', 'URL to open', 'about:blank')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .action(async (opts) => {
    const result = await handleHanaRequest({
      tool: 'browser.open',
      params: { url: opts.url },
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
  });

// hermes browser status
browser
  .command('status')
  .description('List all active browser sessions')
  .action(() => {
    out({ sessions: listSessions() });
  });

// hermes browser open <url>
browser
  .command('open <url>')
  .description('Navigate an existing session to a URL')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .action(async (url: string, opts) => {
    const result = await handleHanaRequest({
      tool: 'browser.open',
      params: { url },
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
  });

// hermes browser screenshot
browser
  .command('screenshot')
  .description('Take a screenshot of the current page')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .option('--full-page', 'Capture full scrollable page', false)
  .action(async (opts) => {
    const result = await handleHanaRequest({
      tool: 'browser.screenshot',
      params: { fullPage: opts.fullPage },
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
    else console.error(`[hermes] Screenshot saved: ${(result.data as { path: string })?.path}`);
  });

// hermes browser logs
browser
  .command('logs')
  .description('Show browser console or network logs')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .option('-t, --type <type>', 'Log type: console | network', 'console')
  .option('-n, --limit <n>', 'Number of entries', '50')
  .action(async (opts) => {
    const tool =
      opts.type === 'network' ? 'browser.get_network_logs' : 'browser.get_console_logs';
    const result = await handleHanaRequest({
      tool,
      params: { limit: parseInt(opts.limit, 10) },
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
  });

// hermes browser reset
browser
  .command('reset')
  .description('Reset a browser session (close + reopen)')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .action(async (opts) => {
    const result = await handleHanaRequest({
      tool: 'browser.reset_session',
      params: {},
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
  });

// hermes browser stop
browser
  .command('stop')
  .description('Close a browser session')
  .option('-s, --session <id>', 'Session ID', DEFAULT_SESSION)
  .action(async (opts) => {
    const result = await handleHanaRequest({
      tool: 'browser.close',
      params: {},
      actor: 'hermes-cli',
      sessionId: opts.session,
    });
    out(result);
    if (!result.success) fail(result.error ?? 'Failed');
  });

// hermes browser health
browser
  .command('health')
  .description('Run a health check (Chrome, sessions, config)')
  .action(async () => {
    const report = await runHealthCheck();
    out(report);
    if (report.status === 'down') process.exit(1);
  });

// ── Parse ───────────────────────────────────────────────────────────────────

program.parseAsync(process.argv).catch((err) => {
  console.error('[hermes]', err);
  process.exit(1);
});
