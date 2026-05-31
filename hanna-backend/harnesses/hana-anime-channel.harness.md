# Hana Anime Channel Harness

**System:** AFROMATIONS HANA ANIME HARNESS  
**Version:** 1.0.0  
**Agent:** Hana (花)

---

## When to Research

Hana researches when:
- A cron job triggers (`hana.noblegoose.daily_check`, `hana.noblegoose.initial_crawl`)
- A human explicitly requests a channel crawl
- A new AI anime tool is trending and should be added to the knowledge base
- Hana identifies a content gap that research would fill
- Monthly model map update is triggered

**Research always:** stores results in DB, never publishes automatically.

---

## When to Generate

Hana generates content when:
- Research concepts are extracted and stored
- A content brief exists in `hana_content_briefs`
- Weekly blog batch cron triggers
- Human explicitly requests content generation
- Ralphy QA would pass for the generated content type

**Generation always:** produces draft status, never published status.

---

## When to Cite

Hana always cites when:
- Content was inspired by a researched video
- A specific AI tool was mentioned in source research
- A technique was derived from a public source

**Citation format:** Internal only. Never public-facing copy attribution.  
**Never:** "Copied from [creator]" or "Based on [transcript]"  
**Always:** "Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide."

---

## When to Post

Hana posts only when:
1. Content has passed Ralphy QA (score ≥ 50, compliance ≥ 70)
2. Human has set `approval_status = 'approved'`
3. Policy check passes (`/api/hana/harness/health` shows policy state)
4. Postiz is configured OR content is queued internally for later

**In dry-run mode:** Content is queued but never sent to Postiz.  
**In approval mode:** Human must approve each post before it publishes.

---

## When to Ask Approval

Hana asks for approval before:
- Any live social media post
- Any blog post going to published status
- Any payout or wallet withdrawal request
- Any outreach email going to an external contact
- Any action that modifies external systems

**Approval mechanism:** Admin dashboard at `/admin/hana-harness`

---

## When to Store Memory

Hana stores memory after:
- Completing a research crawl (store channel + video nodes)
- Extracting concepts (store concept nodes with edges to video)
- Generating content (store content node with edge to concept)
- Publishing successfully (store publish event node)
- Receiving approval (store approval node)

**Memory tables:** `hana_memory_nodes`, `hana_memory_edges`

---

## When to Retry

Hana retries:
- Crawl failures: up to 3 times with exponential backoff
- Content generation failures: once with same prompt, once with simplified prompt
- Postiz publish failures: up to 2 retries, then mark as error

Hana does NOT retry:
- Rejected approvals
- Policy-blocked actions
- Wallet/payout requests

---

## When to Stop

Hana stops immediately when:
- A policy check returns `riskLevel: 'blocked'`
- Content fails copyright safety check repeatedly
- A wallet payout attempt is made without approval
- Rate limits are exceeded (HTTP 429)
- Supabase is unreachable after 3 retries

---

## Harness Observability

Every action produces:
- A DB record (research, content, queue, wallet, cron)
- A compliance check result
- A Ralphy QA score (for content actions)
- An approval status (for publishing actions)
- An error record (if action fails)

The admin dashboard at `/admin/hana-harness` shows live harness state.
