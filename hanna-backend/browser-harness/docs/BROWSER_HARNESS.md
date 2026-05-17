# Hana Browser Harness

> Production-ready browser-control harness for the Hana agent.
> Built on Playwright + Chrome DevTools Protocol (CDP) with full policy enforcement.

---

## Architecture

```
Hana request
  │
  ▼
hana-adapter.ts          ← Policy-enforced entry point (always use this)
  ├─ Rate limiter         ← Token bucket per session (BROWSER_RATE_LIMIT_RPM)
  ├─ Schema validation    ← Zod schemas for all 15 tools
  ├─ URL block policy     ← Private IPs, file://, metadata endpoints, custom deny list
  ├─ Risky action gate    ← Approval required for evaluate, checkout, credential fields
  └─ Tool dispatch
       │
       ▼
browser-tools.ts         ← Tool implementations
  │
  ▼
session-manager.ts       ← Playwright browser + isolated BrowserContext
  ├─ Console log capture  ← Redacted
  ├─ Network log capture  ← Auth headers redacted
  ├─ file:// route block  ← Context-level
  └─ Timeout cleanup      ← BROWSER_SESSION_TIMEOUT_MS
  │
  ▼
devtools-client.ts       ← CDP helpers (DOM, text, sandboxed eval, metrics)
  │
  ▼
audit/logger.ts          ← Pino structured logs, secret redaction
```

---

## Setup

### 1. Install dependencies

```bash
cd hanna-backend/browser-harness
npm install
```

### 2. Install Chromium (Playwright browser)

```bash
npm run install:browser
# or: npx playwright install chromium
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run smoke tests

```bash
npm run test:smoke
# To skip Chrome integration tests:
SKIP_BROWSER_TESTS=true npm run test:smoke
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BROWSER_HEADLESS` | `true` | Run Chrome in headless mode |
| `BROWSER_DEBUG_PORT` | `9222` | CDP debug port |
| `BROWSER_PROFILE_DIR` | `.browser-profile` | Isolated profile directory |
| `BROWSER_ALLOWED_ORIGINS` | *(empty)* | Comma-separated allowlist. Empty = allow all public URLs |
| `BROWSER_BLOCKED_ORIGINS` | *(empty)* | Comma-separated custom denylist |
| `BROWSER_REQUIRE_APPROVAL` | `true` | Require operator approval for risky actions |
| `BROWSER_CAPTURE_SCREENSHOTS` | `true` | Enable screenshot capture |
| `BROWSER_CAPTURE_NETWORK` | `true` | Capture network logs |
| `BROWSER_RATE_LIMIT_RPM` | `60` | Max tool calls per minute per session |
| `BROWSER_SESSION_TIMEOUT_MS` | `300000` | Session auto-close after idle (5 min) |
| `BROWSER_MAX_SESSIONS` | `3` | Max concurrent browser sessions |
| `AUDIT_LOG_DIR` | `./audit-logs` | Audit log output directory |
| `OPERATOR_PORT` | `7700` | Operator console HTTP port |
| `OPERATOR_API_KEY` | *(required)* | Bearer token for operator console |

---

## CLI Commands

Start the Hermes CLI with `npx tsx src/cli/hermes.ts` or `npm run dev`.

```bash
# Start Chrome and open a URL
hermes browser start --url https://myanimelist.net --session research

# Navigate an existing session
hermes browser open https://anilist.co --session research

# Take a screenshot
hermes browser screenshot --session research

# Get page text
hermes browser logs --session research --type console

# Get network logs
hermes browser logs --session research --type network

# List active sessions
hermes browser status

# Reset session (close + reopen)
hermes browser reset --session research

# Kill a session
hermes browser stop --session research

# Health check
hermes browser health
```

---

## MCP Server

Register in `hanna-backend/.mcp.json`:

```json
{
  "hana-browser": {
    "command": "npx",
    "args": ["tsx", "hanna-backend/browser-harness/src/mcp/server.ts"],
    "env": {
      "BROWSER_HEADLESS": "true",
      "BROWSER_REQUIRE_APPROVAL": "true",
      "OPERATOR_API_KEY": "${OPERATOR_API_KEY}"
    },
    "timeout": 60000
  }
}
```

Start manually:

```bash
npm run mcp
```

### Available MCP Tools

| Tool | Description |
|---|---|
| `browser_open` | Open Chrome and navigate to a URL |
| `browser_goto` | Navigate an existing session |
| `browser_click` | Click an element by CSS selector |
| `browser_type` | Type text into a form field |
| `browser_press` | Send a keyboard key press |
| `browser_screenshot` | Capture screenshot (returns file path) |
| `browser_get_dom` | Return page outer HTML |
| `browser_get_text` | Return visible page text |
| `browser_get_console_logs` | Return browser console logs |
| `browser_get_network_logs` | Return network requests/responses |
| `browser_wait_for` | Wait for a selector or networkidle |
| `browser_evaluate_sandboxed` | Run JS in page (requires approval) |
| `browser_close` | Close a session |
| `browser_reset_session` | Close and reopen a session |
| `browser_list_sessions` | List all active sessions |

---

## Security Policy

### Always-blocked URLs

Private/internal addresses are blocked regardless of config:

- `file://` — filesystem access
- `localhost`, `127.x.x.x`, `0.0.0.0`
- Private IPv4 ranges: `10.x`, `172.16–31.x`, `192.168.x`
- Link-local: `169.254.x.x` (AWS IMDS endpoint lives here)
- AWS: `169.254.169.254`
- GCP: `metadata.google.internal`
- Azure: `metadata.azure.com`

### Custom origin lists

```env
# Allow only these origins (empty = allow all public):
BROWSER_ALLOWED_ORIGINS=myanimelist.net,anilist.co,jisho.org

# Always block these (in addition to the built-in list):
BROWSER_BLOCKED_ORIGINS=internal.afromations.studio,admin.example.com
```

### Actions requiring operator approval

When `BROWSER_REQUIRE_APPROVAL=true`:

- `browser.evaluate_sandboxed` — always
- `browser.type` into fields with selector matching: `password`, `secret`, `token`, `pin`, `cvv`, `card`
- `browser.click` on buttons matching: `submit`, `checkout`, `buy`, `pay`, `confirm`, `delete`, `publish`, `send`
- `browser.open` / `browser.goto` to URLs matching: `checkout`, `payment`, `purchase`, `delete.*account`, `/admin`, `/settings`, `signin`/`login`, `/upload`

### Secret redaction

The following are **never** written to logs:

- `Authorization` / `Cookie` / `Set-Cookie` / `x-api-key` headers → `[REDACTED]`
- Bearer tokens, `token=`, `password=`, `secret=`, `api_key=` patterns in strings
- Typed text (never logged — may contain credentials)

### Browser isolation

- Each session uses a fresh Playwright `BrowserContext` — no cookie/storage sharing
- `acceptDownloads: false` by default
- `file://` routing blocked at context level
- No password manager, autofill, sync, signin, or extensions

---

## Approval Flow

```
Hana calls browser.evaluate_sandboxed
  │
  ▼
hana-adapter detects risky action
  ├─ Returns: { success: false, requiresApproval: true, approvalId: "uuid" }
  │
  ▼
Hana tells user: "This action requires operator approval. approvalId: <uuid>"
  │
  ▼
Tyshawn calls: POST /sessions/{id}/approve/{approvalId}
  (via operator console on localhost:7700)
  │
  ▼
Hana retries: handleHanaRequest({ ..., approvalId: "uuid" })
  │
  ▼
Adapter finds pre-approved ID → executes tool
```

---

## Operator Console

The operator console runs on `127.0.0.1:7700` (localhost only).
All requests require `Authorization: Bearer <OPERATOR_API_KEY>`.

```bash
# Start the operator console
npm run operator

# List sessions
curl -H "Authorization: Bearer $OPERATOR_API_KEY" http://localhost:7700/sessions

# View pending approvals for a session
curl -H "Authorization: Bearer $OPERATOR_API_KEY" \
  http://localhost:7700/sessions/my-session/approvals

# Approve an action
curl -X POST -H "Authorization: Bearer $OPERATOR_API_KEY" \
  http://localhost:7700/sessions/my-session/approve/the-approval-uuid

# Kill a session
curl -X DELETE -H "Authorization: Bearer $OPERATOR_API_KEY" \
  http://localhost:7700/sessions/my-session
```

---

## How Hana Calls the Browser Harness

Hana's tool contract: **never call browser-tools.ts directly.**
Always go through `hana-adapter.handleHanaRequest()`.

```typescript
import { handleHanaRequest } from '@afromations/browser-harness';

// Hana opens a research session
const result = await handleHanaRequest({
  tool: 'browser.open',
  params: { url: 'https://myanimelist.net/anime/1535' },
  actor: 'hana',
  sessionId: 'research',
});

if (result.requiresApproval) {
  // Hana tells the user: approval needed, here's the approvalId
  return `This action needs operator approval. ID: ${result.approvalId}`;
}

if (!result.success) {
  return `Browser action failed: ${result.error}`;
}

// Hana reads the page
const text = await handleHanaRequest({
  tool: 'browser.get_text',
  params: {},
  actor: 'hana',
  sessionId: 'research',
});
```

### Hana system prompt additions

Add this to Hana's system prompt when browser tools are enabled:

```
You have access to browser_* tools via the hana-browser MCP server.
Before using any browser tool:
  1. Tell the user what you are about to do and why.
  2. If a tool returns requiresApproval: true, explain to the user and
     share the approvalId so the operator can approve it.
  3. After navigation, summarize what you found.
  4. Never attempt to access localhost, admin pages, or payment flows
     without explicit operator approval.
  5. Never type passwords or credentials without operator approval.
```

---

## Voice Input

Voice commands are parsed by `src/voice/scaffold.ts` and converted to Hana tool requests.

```typescript
import { parseVoiceCommand, voiceCommandToHanaRequest } from '@afromations/browser-harness';

// From your transcription service:
const transcript = 'go to https://myanimelist.net';
const parsed = parseVoiceCommand(transcript, sessionId);

if (parsed) {
  const req = voiceCommandToHanaRequest(parsed, 'voice');
  const result = await handleHanaRequest(req);
}
```

Supported voice commands:

| Voice input | Maps to |
|---|---|
| "go to / open / navigate to https://..." | `browser.open` |
| "click <selector>" | `browser.click` |
| "type 'text' into <selector>" | `browser.type` |
| "take a screenshot" | `browser.screenshot` |
| "read the page text" | `browser.get_text` |
| "show the logs" | `browser.get_console_logs` |
| "close the browser" | `browser.close` |
| "reset the session" | `browser.reset_session` |

---

## RBAC Roles

Defined in `src/types.ts`. Not yet enforced at middleware level — placeholder for future auth integration.

| Role | Access |
|---|---|
| `user` | No browser access |
| `creator` | Read-only browser tools (get_text, screenshot) |
| `client` | Read-only browser tools |
| `operator` | Full browser access + operator console |
| `admin` | Full access + config changes |

---

## Extending for Hana Studio

When Hana Studio's image/animation generation workflows are ready:

1. Add tools to `src/tools/registry.ts`: `studio.capture_canvas`, `studio.inject_asset`
2. Implement in `src/tools/browser-tools.ts`
3. Register in `src/mcp/server.ts` via `mcpTool()`
4. Add allowlist entry: `BROWSER_ALLOWED_ORIGINS=studio.afromations.studio`
5. The approval policy already covers file uploads — no changes needed

---

## Production Checklist

- [ ] `OPERATOR_API_KEY` is set to a strong random value
- [ ] `BROWSER_REQUIRE_APPROVAL=true` in production
- [ ] `BROWSER_HEADLESS=true` in production
- [ ] `BROWSER_ALLOWED_ORIGINS` is configured to the minimum needed set
- [ ] Operator console is NOT exposed to the public internet
- [ ] `npm run test:smoke` passes
- [ ] `hermes browser health` returns `status: ok`
- [ ] Audit logs are being written and rotated
- [ ] Screenshots directory is not publicly accessible
- [ ] `.browser-profile/` is in `.gitignore`
- [ ] No secrets in `hanna-backend/.mcp.json` (use env var references)

---

## Known Limitations

1. **Approval flow is async / advisory** — the current implementation returns `requiresApproval: true` immediately and does not block Hana waiting for operator response. Hana must re-send the request with the `approvalId` after operator approval.

2. **No persistent sessions** — sessions live in memory. Restart = all sessions lost. Add Redis/Supabase persistence for production multi-instance deployments.

3. **Sandboxed eval is basic** — shadowing `fetch`/`XHR`/`WebSocket` as local `undefined` doesn't prevent all exfiltration channels. Use `BROWSER_REQUIRE_APPROVAL=true` and operator approval for all eval calls.

4. **Voice scaffold is a stub** — `ElevenLabsAdapter` and `WebSpeechApiAdapter` throw until implemented. Wire up when `ELEVENLABS_API_KEY` is available.

5. **No screenshot serving** — screenshots are saved to the local filesystem. Serve via a static file server or upload to Supabase Storage for remote access.

6. **RBAC is placeholder** — roles are defined but not enforced at the HTTP middleware level. Add proper auth middleware before exposing the operator console beyond localhost.
