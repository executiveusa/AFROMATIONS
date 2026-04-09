# SYNTHIA™ 3.0 — Backend Rules & Operational Logic
# Afromation Studios × Kupuri Media
# Governs all agents operating in this codebase

## ACTIVATION
Any agent reading this file is now operating under SYNTHIA™ 3.0 protocol.
SYNTHIA™ context loaded. Meadows systems thinking active. UDEC quality gates armed.

---

## 1. SUPABASE CONNECTION

### Primary (Self-Hosted VPS)
```
SUPABASE_URL=http://31.220.58.212:8001
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNzc2NjczLCJleHAiOjE5MzA0NTY2NzN9.rl1mc-GgpG6nQArbEfFAKOcMvzL7rrgzPFT-LlCiCy4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzI3NzY2NzMsImV4cCI6MTkzMDQ1NjY3M30.ns9wbGi2xeS2zbZ1foj6fj4NSa4JxSmJKAedmlShF3w
DATABASE_URL=postgresql://postgres:072090156d28a9df6502d94083e47990@31.220.58.212:5434/postgres
```
- REST operations: use service role key for agents, anon key for client-side reads
- Direct DB: psql on port 5434, pooler on port 6544
- Studio: http://31.220.58.212:3001

### Rule: Never use cloud Supabase projects for new work
Both cloud projects (kbphngxqozmpfrbdzgca, sbbuxnyvflczfzvsglpe) are paused.
All writes go to self-hosted only.

---

## 2. DATABASE SCHEMA (SYNTHIA 3.0)

Tables deployed via `synthia/schema.sql`. Apply via Studio SQL editor before first run.

| Table | Purpose |
|-------|---------|
| synthia_projects | Top-level project registry (AFROMATIONS = row 1) |
| synthia_udec_audits | UDEC 14-axis frontend quality scores per audit run |
| synthia_arch_scores | 12-axis Meadows architecture scores per system |
| synthia_migrations | Track WP→Next/Astro migration work |
| synthia_patterns | Anti-pattern → fix library (8 seeded, grows with each engagement) |
| synthia_beads | ZTE bead tasks (agent work items with evidence) |
| synthia_circuit_events | Log of all circuit breaker firings |
| afromations_content | Brand content: affirmations, grants, hero copy |
| synthia_memory | Agent context memory persisted across sessions |

### Adding new tables
- All tables need RLS: `ALTER TABLE t ENABLE ROW LEVEL SECURITY;`
- Always add service role bypass: `CREATE POLICY "service_role bypass" ON t TO service_role USING (true) WITH CHECK (true);`
- Always add `updated_at TIMESTAMPTZ DEFAULT now()` and matching trigger

---

## 3. QUALITY GATES

### UDEC Floor
- Minimum score: **8.5 / 10.0** across all 14 axes
- If any axis < 7.0 → IMMEDIATE HALT, do not ship
- Score everything before shipping, record results in `synthia_udec_audits`
- Axes: USI, DEN, EST, BRD, EVO, CON, AMB, SCA, WHI, DEL, VAR, SPD, VIS, AIR

### Architecture Score Floor
- Minimum: **8.5 / 10.0** across all 12 Meadows axes
- FBK (feedback) or RSL (resilience) below 7.0 → redesign before any deployment
- Axes: STK, FLW, FBK, DLY, LVR, RSL, VIS, AGT, BLR, LRN, SEC, DOC
- Record in `synthia_arch_scores`

### Auto-Iterate Protocol
1. Score current state
2. If score < 8.5, identify the lowest-scoring axis
3. Generate a targeted fix for that axis
4. Re-score
5. Repeat until 8.5+ or circuit breaker trips (3 failed iterations)

---

## 4. CIRCUIT BREAKERS

All circuit breakers are non-negotiable. Hard stops.

| Trigger | Action |
|---------|--------|
| Estimated API cost > $10 for single task | Warn user, await approval |
| Daily API cost accumulation > $50 | HALT all AI calls, log to synthia_circuit_events |
| Blast radius > 3 services | Reject design, decompose into staged deploys |
| 3 consecutive auto-fix failures on same issue | Escalate to human, do not retry |
| Sensitive data (PII, credentials) detected in output | Redact and log, never persist |
| Quality score fails after 3 auto-iterate cycles | Surface to human for manual review |

Log every firing to `synthia_circuit_events` with: created_at, event_type, trigger_value, blast_services, resolved, resolution_notes.

---

## 5. ANTI-PATTERN BLACKLIST

Reject, flag, and replace anytime detected:

```
barrel_exports        — No index.ts re-exporting from multiple modules
god_class             — No class/handler owning 3+ unrelated domains
swarm_no_memory       — No multi-agent system without persistent state DB
polling_loop          — No setTimeout loops; use webhooks or pg LISTEN/NOTIFY
hardcoded_secret      — No credentials in source; only env vars
monolithic_deploy     — Each service must be independently deployable
implicit_any          — TypeScript: no `any`, use unknown + type guards
prop_drilling_3plus   — State shared 3+ levels deep → context or DB
n_plus_1_query        — All list endpoints must use joins, not loop queries
missing_rls           — Every Supabase table needs RLS before shipping
```

---

## 6. COMMIT FORMAT (ZTE + SYNTHIA™)

```
[SYNTHIA][BEAD-{id}] {type}: {what changed} | LP{n} {leverage point} | {why it improves score}
```

**Types:** arch | feat | fix | feedback | circuit | refactor | docs | perf | security

**Leverage Points (use highest applicable):**
- LP1 Power to change paradigm (system redesign)
- LP2 Goal of the system (objective shift)
- LP3 Rules of the system (constraints changed)
- LP4 Information flow (who has access to what data)
- LP5 Rules (physical structure wired differently)
- LP6 Feedback gain (loop strength changed)
- LP7 Info/feedback (new feedback loop added)
- LP8 Delays (latency removed or added to loop)
- LP9 Material structure (service decomposition)
- LP10 Stock sizes (capacity changed)
- LP11 Flow rates (throughput changed)
- LP12 Parameter (tuning, minor adjustments)

**Examples:**
```
[SYNTHIA][BEAD-001] arch: decompose monolith auth handler into auth/session/permissions services | LP9 material structure | reduces god class to 3 focused services, FBK axis 4.2→8.7
[SYNTHIA][BEAD-002] feat: add cost guard trigger to synthia_circuit_events | LP6 feedback gain | daily cost circuit now fires before $50 threshold, BLR axis 6.0→9.1
[SYNTHIA][BEAD-003] fix: replace polling loop in content sync with pg LISTEN/NOTIFY | LP8 delays | removes 5s polling latency, eliminates 2,880 unnecessary DB queries/day
```

---

## 7. AGENT MEMORY RULES

Agents MUST persist context across sessions using `synthia_memory`:

```sql
-- Write: save context at end of session
INSERT INTO synthia_memory (project_id, agent_name, memory_key, memory_value, memory_type, ttl_hours)
VALUES ('{project_uuid}', 'synthia-3.0', 'session_context', '{json}', 'session', 24);

-- Read: load context at start of session
SELECT memory_value FROM synthia_memory
WHERE project_id = '{project_uuid}' AND agent_name = 'synthia-3.0'
  AND memory_key = 'session_context'
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC LIMIT 1;
```

Memory types:
- `session` — cleared after TTL (default 24h)
- `working` — active task context, short TTL (2h)
- `long_term` — pattern knowledge, no expiry
- `pattern` — links to synthia_patterns table

---

## 8. BEAD (TASK) WORKFLOW

Every agent task is a BEAD. No unbounded tasks.

```
STATUS: planned → in_progress → blocked → review → done
```

1. Before starting any task: create a bead in `synthia_beads`
2. Status must be updated as work progresses
3. Evidence is required before marking `done`:
   - Either: `evidence_url` (deployed URL, PR link)
   - Or: `completion_snapshot` (JSON proof of completion)
4. Blocked beads must have `blocker_description` and `resolution_notes`
5. UDEC score at completion must be recorded in `udec_score_at_completion`

---

## 9. CONTENT STANDARDS (AFROMATIONS BRAND)

### Copy Rules
- No fluff: every sentence earns its place
- Use P.A.S.S.™: Problem → Amplify → Solution → System
- Banned words: innovative, seamless, robust, leverage, synergy, utilize, revolutionize, transforming, elevating, comprehensive, cutting-edge, state-of-the-art
- Affirmations must be positive, present-tense, first-person: "I am..." not "You should..."

### Content Table Usage
When publishing or updating AFROMATIONS content:
```sql
-- Insert new affirmation
INSERT INTO afromations_content (content_type, title, body_copy, author, tags, status)
VALUES ('affirmation', 'Title', 'I am...', 'SYNTHIA', ARRAY['positivity', 'strength'], 'published');

-- Query for scheduled publish
SELECT * FROM afromations_content
WHERE status = 'scheduled' AND scheduled_for <= NOW();
```

---

## 10. RESILIENCE REQUIREMENTS

Before any system is considered production-ready:
- [ ] Database: daily backup configured in Coolify or via pg_dump cron on VPS
- [ ] API: rate limiting enabled in Kong (not yet configured — TODO)
- [ ] Auth: row-level security enabled on all tables
- [ ] Secrets: master.env not committed to git; .gitignore verified
- [ ] Monitoring: Supabase logs checked weekly; alerts for auth failures
- [ ] Recovery: documented runbook for VPS restart + Docker compose up
- [ ] Coolify: new API token generated and tested (current tokens EXPIRED)

RSL axis < 7.0 = DO NOT SHIP until these checkboxes are addressed.

---

## 11. ENVIRONMENT VARIABLES

All secrets sourced from environment. Never written in code.
Local dev: `.env` at repo root (gitignored)
Production: set in Coolify environment variables UI

Required variables for SYNTHIA 3.0 backend:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
DATABASE_URL
ANTHROPIC_API_KEY
OPENAI_API_KEY (optional fallback)
COOLIFY_API_TOKEN (regenerate at http://31.220.58.212:8000/settings/api)
NOTION_TOKEN (if using Notion integration)
```

---

## 12. DEPLOYMENT PIPELINE

All deployments via Coolify at http://31.220.58.212:8000

1. Push to main branch → Coolify webhook fires
2. Coolify builds Docker image
3. Runs health check
4. Swaps container (zero-downtime)
5. If health check fails → automatic rollback

Before setting up Coolify pipeline:
- Regenerate API token (current tokens all return 401)
- Confirm project + service IDs in Coolify UI
- Set all env vars in Coolify → Environment Variables panel
- Never expose port 5434 to public internet (PostgreSQL only on internal network)
