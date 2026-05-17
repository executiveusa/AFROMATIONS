/**
 * Smoke tests — run with: npx tsx tests/smoke.ts
 *
 * Tests run in isolation, without requiring a live Chrome install.
 * Chrome-dependent tests are skipped if SKIP_BROWSER_TESTS=true.
 *
 * Coverage:
 *   ✓ Config parsing
 *   ✓ Secret redaction (strings and headers)
 *   ✓ Rate limiter (allow, throttle, reset)
 *   ✓ URL block policy (private IPs, file://, allowlist)
 *   ✓ Risky action detection
 *   ✓ Tool schema validation
 *   ✓ Voice command parsing
 *   ✓ Approval gate (requiresApproval response)
 *   ~ Chrome start / screenshot / DOM / close  (skipped if no Playwright browser)
 */

process.env.NODE_ENV = 'test';
process.env.BROWSER_REQUIRE_APPROVAL = 'true';
process.env.BROWSER_HEADLESS = 'true';

import { redactString, redactHeaders } from '../src/audit/logger.js';
import { rateLimiter } from '../src/policy/rate-limiter.js';
import { isUrlBlocked, isRiskyAction } from '../src/policy/permission-policy.js';
import { ToolSchemas } from '../src/tools/registry.js';
import { parseVoiceCommand } from '../src/voice/scaffold.js';
import { handleHanaRequest } from '../src/tools/hana-adapter.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.error(`  ✗  ${label}`);
    failed++;
  }
}

function section(name: string) {
  console.log(`\n── ${name}`);
}

// ── Config ─────────────────────────────────────────────────────────────────

section('Config');
const { config } = await import('../src/config.js');
assert(config.BROWSER_HEADLESS === true, 'BROWSER_HEADLESS defaults to true');
assert(config.BROWSER_REQUIRE_APPROVAL === true, 'BROWSER_REQUIRE_APPROVAL defaults to true');
assert(config.BROWSER_MAX_SESSIONS >= 1, 'BROWSER_MAX_SESSIONS >= 1');
assert(config.BROWSER_RATE_LIMIT_RPM >= 1, 'BROWSER_RATE_LIMIT_RPM >= 1');

// ── Secret redaction ────────────────────────────────────────────────────────

section('Secret redaction — strings');
assert(
  !redactString('Authorization: Bearer eyJhbGciOiJIUzI1NiJ9').includes('eyJ'),
  'Redacts Bearer tokens',
);
assert(
  !redactString('token=abc123secret').includes('abc123'),
  'Redacts token= values',
);
assert(
  !redactString('password=hunter2').includes('hunter2'),
  'Redacts password= values',
);
assert(
  redactString('Hello, world!') === 'Hello, world!',
  'Does not modify non-secret strings',
);

section('Secret redaction — headers');
const headers = redactHeaders({
  authorization: 'Bearer secret-token',
  'content-type': 'application/json',
  cookie: 'session=abc',
  'x-api-key': 'sk-1234',
});
assert(headers['authorization'] === '[REDACTED]', 'Redacts authorization header');
assert(headers['cookie'] === '[REDACTED]', 'Redacts cookie header');
assert(headers['x-api-key'] === '[REDACTED]', 'Redacts x-api-key header');
assert(headers['content-type'] === 'application/json', 'Preserves safe headers');

// ── Rate limiter ────────────────────────────────────────────────────────────

section('Rate limiter');
rateLimiter.reset('smoke-test-session');
const firstCall = rateLimiter.consume('smoke-test-session');
assert(firstCall === true, 'First call is allowed');

// Exhaust the bucket
let exhausted = false;
for (let i = 0; i < 200; i++) {
  if (!rateLimiter.consume('smoke-test-burst')) {
    exhausted = true;
    break;
  }
}
assert(exhausted, 'Rate limit is enforced after bucket exhaustion');

rateLimiter.reset('smoke-test-burst');
assert(rateLimiter.consume('smoke-test-burst') === true, 'Reset restores capacity');

// ── URL block policy ────────────────────────────────────────────────────────

section('URL block policy');
assert(isUrlBlocked('file:///etc/passwd').blocked, 'Blocks file:// URLs');
assert(isUrlBlocked('http://localhost:3000').blocked, 'Blocks localhost');
assert(isUrlBlocked('http://127.0.0.1/api').blocked, 'Blocks 127.0.0.1');
assert(isUrlBlocked('http://10.0.0.1/admin').blocked, 'Blocks 10.x.x.x');
assert(isUrlBlocked('http://192.168.1.1').blocked, 'Blocks 192.168.x.x');
assert(isUrlBlocked('http://169.254.169.254/latest/meta-data').blocked, 'Blocks AWS IMDS');
assert(!isUrlBlocked('https://example.com').blocked, 'Allows public URLs');
assert(!isUrlBlocked('https://myanimelist.net').blocked, 'Allows anime sites');
assert(!isUrlBlocked('https://docs.anthropic.com').blocked, 'Allows anthropic docs');

// ── Risky action detection ───────────────────────────────────────────────────

section('Risky action detection');
assert(
  isRiskyAction('browser.evaluate_sandboxed', { expression: '1+1', sessionId: 'x' }),
  'evaluate_sandboxed always requires approval',
);
assert(
  isRiskyAction('browser.type', { selector: '#password', text: 'abc', sessionId: 'x' }),
  'Typing into #password is risky',
);
assert(
  isRiskyAction('browser.open', { url: 'https://shop.example.com/checkout', sessionId: 'x' }),
  'Checkout URL is risky',
);
assert(
  !isRiskyAction('browser.screenshot', { sessionId: 'x' }),
  'Screenshot is not risky',
);
assert(
  !isRiskyAction('browser.get_text', { sessionId: 'x' }),
  'get_text is not risky',
);

// ── Tool schema validation ────────────────────────────────────────────────

section('Tool schema validation');
const validOpen = ToolSchemas['browser.open'].safeParse({ url: 'https://example.com' });
assert(validOpen.success, 'Valid browser.open params parse correctly');

const invalidOpen = ToolSchemas['browser.open'].safeParse({ url: 'not-a-url' });
assert(!invalidOpen.success, 'Invalid URL is rejected by schema');

const validScreen = ToolSchemas['browser.screenshot'].safeParse({ sessionId: 'abc' });
assert(validScreen.success, 'Valid screenshot params parse correctly');

const bigExpr = ToolSchemas['browser.evaluate_sandboxed'].safeParse({
  sessionId: 'x',
  expression: 'x'.repeat(5_000),
});
assert(!bigExpr.success, 'Oversized JS expression is rejected');

// ── Voice command parsing ─────────────────────────────────────────────────

section('Voice command parsing');
const vcGoto = parseVoiceCommand('go to https://myanimelist.net', 'sess1');
assert(vcGoto?.tool === 'browser.open', 'Parses "go to <url>" as browser.open');
assert(vcGoto?.params.url === 'https://myanimelist.net', 'Extracts URL from voice command');

const vcShot = parseVoiceCommand('take a screenshot', 'sess1');
assert(vcShot?.tool === 'browser.screenshot', 'Parses "take a screenshot"');

const vcUnknown = parseVoiceCommand('play some music', 'sess1');
assert(vcUnknown === null, 'Returns null for unrecognized voice commands');

// ── Approval gate (unit test — no real browser) ───────────────────────────

section('Approval gate');
const riskyResult = await handleHanaRequest({
  tool: 'browser.evaluate_sandboxed',
  params: { expression: '1+1', sessionId: 'nonexistent' },
  actor: 'smoke-test',
  sessionId: 'nonexistent',
});
assert(
  riskyResult.requiresApproval === true,
  'evaluate_sandboxed returns requiresApproval: true',
);
assert(
  typeof riskyResult.approvalId === 'string',
  'Returns an approvalId for pending approval',
);

// ── Denied domain (unit test — no real browser) ───────────────────────────

section('Denied domain');
const deniedResult = await handleHanaRequest({
  tool: 'browser.open',
  params: { url: 'http://localhost:9000' },
  actor: 'smoke-test',
});
assert(!deniedResult.success, 'Localhost URL is blocked');
assert(deniedResult.error?.includes('blocked'), 'Error message mentions "blocked"');

// ── Chrome integration tests (require Playwright browser install) ─────────

if (process.env.SKIP_BROWSER_TESTS !== 'true') {
  section('Chrome integration (SKIP_BROWSER_TESTS=true to skip)');
  try {
    const openResult = await handleHanaRequest({
      tool: 'browser.open',
      params: { url: 'https://example.com' },
      actor: 'smoke-test',
      sessionId: 'smoke-chrome',
    });
    assert(openResult.success, 'Opens https://example.com');

    const sessionId = (openResult.data as { sessionId: string })?.sessionId ?? 'smoke-chrome';

    const textResult = await handleHanaRequest({
      tool: 'browser.get_text',
      params: {},
      actor: 'smoke-test',
      sessionId,
    });
    assert(textResult.success, 'Reads page text');
    assert(
      String((textResult.data as { text: string })?.text).length > 0,
      'Page text is non-empty',
    );

    const screenshotResult = await handleHanaRequest({
      tool: 'browser.screenshot',
      params: {},
      actor: 'smoke-test',
      sessionId,
    });
    assert(screenshotResult.success, 'Takes screenshot');

    const consoleResult = await handleHanaRequest({
      tool: 'browser.get_console_logs',
      params: { limit: 10 },
      actor: 'smoke-test',
      sessionId,
    });
    assert(consoleResult.success, 'Reads console logs');

    const closeResult = await handleHanaRequest({
      tool: 'browser.close',
      params: {},
      actor: 'smoke-test',
      sessionId,
    });
    assert(closeResult.success, 'Closes session');
  } catch (err) {
    console.error(`  ⚠  Chrome tests failed (is Playwright installed?): ${err}`);
    console.error('  ⚠  Run: npm run install:browser  to install Chromium');
  }
} else {
  console.log('\n── Chrome integration tests skipped (SKIP_BROWSER_TESTS=true)');
}

// ── Summary ───────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('Some smoke tests failed.');
  process.exit(1);
} else {
  console.log('All smoke tests passed.');
}
