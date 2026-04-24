# End-to-End Application Testing

## Pre-flight Check

### 1. Platform Check
agent-browser requires Linux, WSL, or macOS. Check the platform:
```
uname -s
```
- `Linux` or `Darwin` → proceed
- Anything else → stop: "agent-browser only supports Linux, WSL, and macOS."

### 2. Frontend Check
Verify the application has a browser-accessible frontend. Check for:
- A `package.json` with a dev/start script serving a UI
- Frontend framework files (pages/, app/, src/components/, index.html, etc.)

### 3. agent-browser Installation
```bash
agent-browser --version
# If not found:
npm install -g agent-browser
agent-browser install --with-deps
```

## Phase 1: Parallel Research

Launch three sub-agents simultaneously:

### Sub-agent 1: Application Structure & User Journeys
Research:
1. How to start the application — exact install + dev server commands
2. Authentication/login — test account creation or login flow
3. Every user-facing route/page
4. Every user journey — complete flows with steps, interactions, expected outcomes
5. Key UI components — forms, modals, dropdowns, toggles

### Sub-agent 2: Database Schema & Data Flows
Research:
1. Database type and connection (from .env.example, NOT .env)
2. Full schema — tables, columns, types, relationships
3. Data flows per user action
4. Validation queries for each data flow

### Sub-agent 3: Bug Hunting
Analyze for:
1. Logic errors
2. UI/UX issues
3. Data integrity risks
4. Security concerns

## Phase 2: Start the Application
1. Install dependencies
2. Start dev server in background
3. `agent-browser open <url>`
4. `agent-browser screenshot e2e-screenshots/00-initial-load.png`

## Phase 3: Create Task List
Create a task for each user journey with steps, expected outcomes, and DB checks.

## Phase 4: User Journey Testing

### 4a. Browser Testing
```
agent-browser open <url>
agent-browser snapshot -i           # Get interactive refs
agent-browser click @eN
agent-browser fill @eN "text"
agent-browser select @eN "option"
agent-browser press Enter
agent-browser screenshot <path>
agent-browser screenshot --annotate
agent-browser set viewport W H
agent-browser wait --load networkidle
agent-browser console
agent-browser errors
agent-browser get text @eN
agent-browser get url
agent-browser close
```

Re-snapshot after navigation or DOM changes. For each step:
1. Snapshot to get refs
2. Perform interaction
3. Wait for settle
4. Screenshot to `e2e-screenshots/<journey>/<step>.png`
5. Analyze screenshot for visual correctness
6. Check console/errors periodically

### 4b. Database Validation
After data-modifying interactions:
- Query DB to verify records (psql, sqlite3, or ad-hoc script)
- Verify values match UI input
- Check relationships, no orphans/duplicates

### 4c. Issue Handling
1. Document: expected vs actual, screenshot, DB query results
2. Fix the code directly
3. Re-run failing step to verify
4. Screenshot confirming fix

### 4d. Responsive Testing
Test key pages at:
- Mobile: `agent-browser set viewport 375 812`
- Tablet: `agent-browser set viewport 768 1024`
- Desktop: `agent-browser set viewport 1440 900`

## Phase 5: Cleanup
1. Stop dev server
2. `agent-browser close`

## Phase 6: Report

### Text Summary
```
## E2E Testing Complete
**Journeys Tested:** [count]
**Screenshots Captured:** [count]
**Issues Found:** [count] ([count] fixed, [count] remaining)

### Issues Fixed During Testing
- [Description] — [file:line]

### Remaining Issues
- [Description] — [severity] — [file:line]

### Screenshots
All saved to: `e2e-screenshots/`
```

### Markdown Export
If requested, write full report to `e2e-test-report.md` with per-journey breakdowns.
