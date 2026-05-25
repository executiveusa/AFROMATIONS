# CLAUDE TOKEN SAVER — Detailed Guide
## For AFROMATIONS Backend & Frontend Development

**Status:** Active for all Claude Code sessions  
**Scope:** NVIDIA NIM integration + HANA backend + Token cost control  
**Audience:** All AI agents and human developers  

---

## Quick Start (5 minutes)

### Step 1: Verify Dependencies
```bash
cd /home/user/AFROMATIONS
which jcodemunch || echo "MISSING: npm install -g @jgravelle/jcodemunch-mcp"
which rtk || echo "MISSING: cargo install rtk"
```

### Step 2: Load Token Guard Defaults
```bash
source ops/.env.token-saver
echo "✓ Daily budget: \$$TOKEN_BUDGET_DAILY"
echo "✓ Task budget: \$$TOKEN_BUDGET_TASK"
echo "✓ Compression floor: $COMPRESSION_FLOOR"
```

### Step 3: Start RTK Session Tracking
```bash
rtk gain --reset
```

### Step 4: Confirm Protocol Active
```bash
# This repo now has mandatory token compression:
cat .claude/token-saver.rules | head -20
```

You're ready to code with cost controls.

---

## Real-World Examples

### Example 1: Explore the NIM Integration

**WRONG (expensive):**
```bash
# This sends the entire directory tree into context
find hanna-backend -name "*.ts" -type f | xargs cat
```

**CORRECT (95% compression):**
```bash
# Get architecture overview
jcodemunch get_repo_map | grep -i nim

# Find all NIM-related symbols
jcodemunch search_symbols "NimClient\|NIM_"

# Get just the NIM client implementation
jcodemunch get_symbol_source "hanna-backend/lib/nim-client.ts:NimClient"
```

**Cost savings:** ~15 tokens vs 5000 tokens = 99.7% savings

---

### Example 2: Fix a Bug in Dashboard Auth

**WRONG (expensive):**
```bash
# Shows entire git history uncompressed
git diff main..HEAD
```

**CORRECT (70% compression):**
```bash
# RTK automatically compresses git output
git diff main..HEAD | head -100

# Or use jcodemunch to find changed symbols only
jcodemunch get_changed_symbols --since main
```

**Cost savings:** ~200 tokens vs 600 tokens = 66% savings

---

### Example 3: Search for Token Saver References

**WRONG (sends whole files):**
```bash
grep -r "TOKEN_BUDGET" . | cat
```

**CORRECT (structured search):**
```bash
jcodemunch search_in_files "TOKEN_BUDGET" --limit 10
```

**Cost savings:** ~50 tokens vs 300 tokens = 83% savings

---

## Cost Budget Breakdown

### Daily Budget: $50 USD

| Activity | Cost | Allocation |
|----------|------|-----------|
| 10 tasks × $10 max each | $40 | Core work (Backend + Frontend) |
| Code reviews + QA | $5 | Testing, verification |
| Emergency overages | $5 | Buffer for unexpected needs |
| **TOTAL** | **$50** | Hard stop — no work after |

### Task Budget: $10 USD

**What this means:**
- ~20,000 input tokens (GPT-5.5: $0.0005/token)
- ~5,000 output tokens (GPT-5.5: $0.0015/token)
- Total: ~$0.015 per task on average with compression active

**If a single task approaches $10:**
- STOP
- Estimate remaining cost
- Ask user for approval
- Do not proceed without explicit override

---

## Compression Floor: 65%

**Definition:** Every interaction with jcodemunch or RTK must achieve at least 65% compression.

**If compression < 65%:**
1. Reject the current approach
2. Re-plan the query with smaller scope
3. Use more targeted symbol search
4. Break large operations into chunks

**Example:**
```bash
# First attempt: grep for all references to "affirmations"
# Output: 500 lines, compression 0% (raw output)
# Decision: REJECT

# Second attempt: Search for AffirmationCard component only
jcodemunch search_symbols "AffirmationCard"
# Output: 5 matches, compression 99%
# Decision: ACCEPT ✓
```

---

## Session Logging

Every session automatically logs to: `ops/reports/session-[session-id].json`

### Sample Log Entry:
```json
{
  "session_id": "cse_01GjArz2sTk5Pj582uTtcT4M",
  "started_at": "2026-05-25T14:30:00Z",
  "ended_at": "2026-05-25T14:45:00Z",
  "duration_seconds": 900,
  "task_description": "Integrate NVIDIA NIM client for affirmations generation",
  "model_used": "claude-opus",
  "input_tokens": 12500,
  "output_tokens": 3200,
  "estimated_cost": 0.185,
  "jcodemunch_searches": 4,
  "jcodemunch_compression_pct": 95.2,
  "rtk_commands": 7,
  "rtk_compression_pct": 78.4,
  "cost_guard_status": "OK",
  "issues": [],
  "next_steps": [
    "Wire NIM routes into Hana backend",
    "Create auth endpoints",
    "Build dashboard UI"
  ]
}
```

---

## Weekly Cost Review

Every Friday, run:
```bash
# Aggregate all sessions from this week
find ops/reports -name "session-*.json" -newermt "1 week ago" | xargs cat | \
  jq -s '{
    sessions: length,
    total_cost: map(.estimated_cost) | add,
    total_input_tokens: map(.input_tokens) | add,
    total_output_tokens: map(.output_tokens) | add,
    avg_compression_pct: (map(.jcodemunch_compression_pct) | add / length)
  }'
```

**Expected:** Cost < $50, Compression > 75%

---

## Troubleshooting

### Problem: jcodemunch returns "symbol not found"
**Solution:** Use broader search first
```bash
jcodemunch search_symbols "nim" --fuzzy
```

### Problem: RTK compression < 65%
**Solution:** Break operation into smaller pieces
```bash
# ✗ Don't do this:
git log --all --stat

# ✓ Do this:
git log -10 --oneline
```

### Problem: Task cost approaching $10
**Solution:** Stop and estimate remaining work
```bash
# Check current cost before proceeding
echo "Input so far: ${input_tokens}, est. cost: $(echo "$input_tokens * 0.0005" | bc)"
```

### Problem: Daily budget exceeded $50
**Solution:** Stop all work
```bash
# This is a hard circuit breaker
# No more work until tomorrow
echo "Daily budget exceeded. Stopping work."
```

---

## Integration with NVIDIA NIM

The token saver protocol helps us use NIM efficiently:

1. **NIM Rate Limit:** 40 req/min
2. **Token compression:** Reduces unnecessary API calls
3. **Caching:** Saves identical requests
4. **Budget control:** Ensures free tier is never exceeded

Example:
```bash
# Each NIM request costs tokens to construct
# With compression, we save 80% on prompt engineering

# ✗ Without compression (20 requests, 20 calls to NIM)
for i in {1..20}; do curl -X POST nim-api.local/chat -d "$prompt"; done

# ✓ With compression (dedupe, cache, smart routing)
# Only 4 unique requests → 4 calls to NIM
# Cost saved: 80% × 40/min rate limit = massive throughput gain
```

---

## Integration with Supabase

Token compression also helps database operations:

1. **No unnecessary queries:** Use jcodemunch to find symbol dependencies
2. **Schema efficiency:** Understand schema before writing migrations
3. **Cost tracking:** Log to Supabase only what's needed

---

## Final Checklist (Before Every Session)

```markdown
# Session Start Checklist

## Prerequisites
- [ ] I have read `.claude/token-saver.rules`
- [ ] I understand daily budget ($50) and task budget ($10)
- [ ] jcodemunch is installed (`which jcodemunch`)
- [ ] RTK is installed (`which rtk`)
- [ ] I am inside the /home/user/AFROMATIONS directory

## Session Initialization
- [ ] I have sourced `ops/.env.token-saver`
- [ ] I have run `rtk gain --reset` to start tracking
- [ ] I understand compression floor = 65% minimum
- [ ] I will use jcodemunch for all codebase exploration
- [ ] I will let RTK compress all CLI output automatically

## Model Selection
- [ ] Is this a frontier reasoning task? NO → Use GPT-4o or Haiku
- [ ] Is this a production pattern? NO → Use GPT-4o
- [ ] Do I genuinely need GPT-5.5? NO → Use cheaper model
- [ ] Will this task exceed $10? Ask before proceeding

## Ready to Start?
- [ ] All boxes above are checked
- [ ] I understand the cost guards
- [ ] I am ready to code with mandatory compression

**STATUS: READY ✓** → Proceed
**STATUS: BLOCKED ✗** → Fix prerequisites above
```

---

## Questions?

- **How does jcodemunch work?** → `jcodemunch --help`
- **How does RTK work?** → `rtk --help`
- **Where are logs?** → `ls -la ops/reports/`
- **What's my daily cost so far?** → `ls ops/reports/session-*.json | wc -l` (count = approx cost)
- **How long until budget resets?** → Midnight UTC each day

---

**Last Updated:** 2026-05-25  
**Version:** 1.0  
**Status:** ACTIVE AND MANDATORY  
**Questions Answered By:** CLAUDE TOKEN SAVER v1.0
