# Cost Tracking & Reports — AFROMATIONS

## Overview

This directory contains detailed cost logs for all Claude Code sessions using NVIDIA NIM and the Token Saver Protocol.

**Location:** `/home/user/AFROMATIONS/ops/reports/`  
**Safe to commit?** YES (contains only aggregated, non-sensitive data)  
**Retention:** 90 days (auto-archived after)  

---

## File Structure

### Session Logs
```
session-[session-id].json
```

**Example filename:** `session-cse_01GjArz2sTk5Pj582uTtcT4M.json`

**Contents:**
```json
{
  "session_id": "cse_01GjArz2sTk5Pj582uTtcT4M",
  "date": "2026-05-25",
  "time_start": "2026-05-25T14:30:00Z",
  "time_end": "2026-05-25T14:45:00Z",
  "duration_seconds": 900,
  "task": "Integrate NVIDIA NIM backend",
  
  "model": "claude-opus",
  "input_tokens": 12500,
  "output_tokens": 3200,
  "cost_usd": 0.185,
  
  "jcodemunch_enabled": true,
  "jcodemunch_searches": 4,
  "jcodemunch_compression_pct": 95.2,
  
  "rtk_enabled": true,
  "rtk_commands": 7,
  "rtk_compression_pct": 78.4,
  
  "cost_guards": {
    "daily_budget": 50,
    "daily_spent": 0.185,
    "daily_remaining": 49.815,
    "task_budget": 10,
    "task_spent": 0.185,
    "triggered": false
  },
  
  "status": "success",
  "files_modified": [
    "afromations-frontend/src/components/studio/html-in-canvas-beta.tsx",
    "afromations-frontend/src/app/studio/page.tsx"
  ],
  "commits": 1,
  "next_steps": [
    "Create NIM client",
    "Implement auth",
    "Build dashboard"
  ]
}
```

### Daily Summary
```
daily-cost-YYYY-MM-DD.json
```

**Example filename:** `daily-cost-2026-05-25.json`

**Contents:**
```json
{
  "date": "2026-05-25",
  "sessions": 3,
  "total_cost_usd": 0.542,
  "total_input_tokens": 35000,
  "total_output_tokens": 8900,
  "avg_compression_pct": 81.3,
  "jcodemunch_hit_rate": 0.87,
  "rtk_compression_avg": 74.2,
  "budget_remaining": 49.458,
  "status": "OK"
}
```

### Monthly Summary
```
monthly-summary-YYYY-MM.json
```

**Example filename:** `monthly-summary-2026-05.json`

**Contents:**
```json
{
  "month": "2026-05",
  "days_active": 15,
  "total_sessions": 47,
  "total_cost_usd": 14.850,
  "avg_daily_cost": 0.99,
  "daily_budget_limit": 50,
  "days_exceeded_budget": 0,
  "total_input_tokens": 425000,
  "total_output_tokens": 98000,
  "avg_compression_pct": 82.1,
  "jcodemunch_searches": 156,
  "rtk_commands": 234,
  "cost_trend": "stable",
  "notes": "All sessions stayed under daily budget. NIM integration reduced inference costs by 90% vs GPT-5.5."
}
```

---

## How Logging Works

### Automatic (System)
- Every Claude Code session auto-generates `session-[id].json`
- Daily summaries generated at 23:59 UTC
- Monthly summaries generated on the last day of each month

### Manual (Optional)
```bash
# Generate ad-hoc report
rtk report --since 2026-05-01 --until 2026-05-31 > ops/reports/manual-report.json

# View today's cost
cat ops/reports/daily-cost-$(date +%Y-%m-%d).json | jq '.total_cost_usd'

# Count sessions this week
find ops/reports -name "session-*.json" -newermt "1 week ago" | wc -l
```

---

## Cost Analysis

### Expected Daily Costs (with Token Saver Protocol)

| Activity | Sessions | Avg Cost/Session | Daily Total |
|----------|----------|------------------|-------------|
| Backend development | 2 | $0.15 | $0.30 |
| Frontend development | 2 | $0.12 | $0.24 |
| Code review + QA | 1 | $0.08 | $0.08 |
| NIM inference (free tier) | 5 | $0.00 | $0.00 |
| **TOTAL** | **10** | **$0.35** | **$0.62** |

**Budget:** $50/day  
**Typical spend:** ~$1-5/day  
**Savings vs. naive approach:** 85-95%  

---

## Budget Guards (Hard Stops)

### Daily Limit: $50
```bash
# If daily cost > $50:
# → All work STOPS
# → Log to daily-cost-*.json with "EXCEEDED" status
# → Wait for calendar day reset (midnight UTC)
```

### Task Limit: $10
```bash
# If single task cost > $10:
# → HALT before executing
# → Request explicit user approval
# → Log override if granted
```

### Compression Floor: 65%
```bash
# If compression < 65% on jcodemunch/RTK:
# → Return error: "Compression floor not met"
# → Re-plan with tighter scope
# → Reject loose queries
```

---

## Interpreting Reports

### What to look for (healthy):
- ✓ `cost_trend: "stable"` or `"declining"`
- ✓ `triggered: false` for all cost guards
- ✓ `jcodemunch_compression_pct > 80`
- ✓ `rtk_compression_pct > 70`
- ✓ `total_cost_usd < $50` per day
- ✓ `days_exceeded_budget: 0` in monthly summary

### What to address (concerning):
- ✗ `cost_trend: "rising"` → Tasks getting more expensive
- ✗ `triggered: true` → Cost guard was hit
- ✗ `compression_pct < 65` → Token saver not effective
- ✗ `total_cost_usd > $50` daily → Budget exceeded
- ✗ Multiple `days_exceeded_budget` in month → Systematic overspend

---

## Sample Query (Find Expensive Sessions)

```bash
# Find all sessions costing > $1.00
jq -s '.[] | select(.cost_usd > 1.0) | {session_id, task, cost_usd}' \
  ops/reports/session-*.json | sort -k3 -rn | head -10
```

---

## Quarterly Audit

Every 3 months, run:

```bash
#!/bin/bash
# Q2 2026 Cost Audit

QUARTER_DIR="ops/reports/quarterly-audit-Q2-2026.json"

cat > "$QUARTER_DIR" << 'EOF'
{
  "quarter": "Q2 2026",
  "months": ["2026-04", "2026-05", "2026-06"],
  "summary": {
    "total_cost": (total from all monthly-summary files),
    "total_sessions": (sum of all sessions),
    "avg_daily_cost": (total cost / days),
    "cost_per_session": (total cost / total sessions),
    "compression_trend": "stable/improving/degrading"
  },
  "budget_compliance": {
    "days_exceeded_daily_budget": 0,
    "times_exceeded_task_budget": 0,
    "times_compression_floor_hit": 0,
    "overall_status": "COMPLIANT"
  },
  "efficiency_gains": {
    "jcodemunch_searches": (total count),
    "rtk_commands": (total count),
    "tokens_saved_vs_naive": "~95%",
    "estimated_cost_without_protocol": "calculate from tokens"
  }
}
EOF

echo "Quarterly audit saved to: $QUARTER_DIR"
```

---

## Integration with NVIDIA NIM

NIM is **free** (40 req/min rate limit), so:
- NIM inference cost in reports: $0.00
- Savings shown in "tokens_saved_vs_naive"
- Compression helps avoid hitting rate limit

---

## Compliance Checklist

Every Friday:
- [ ] Review `daily-cost-*.json` for week
- [ ] Confirm no budget overages (`total_cost < $350`)
- [ ] Check compression floor (`compression_pct > 65`)
- [ ] Verify jcodemunch usage (searches > 0)
- [ ] Note any anomalies for the team

---

## Questions

**Where do I view live costs?**  
Check `daily-cost-$(date +%Y-%m-%d).json`

**How do I know if I'm overspending?**  
If daily total > $50, you are. Stop work.

**Can I reset my daily budget mid-day?**  
No. Daily budget is per calendar day (UTC). Reset at midnight.

**Are these logs private?**  
They're safe to commit. No API keys or secrets included. Just token counts and costs.

**How long are logs kept?**  
90 days, then archived to `quarterly-audit-*.json` files.

---

**Last Updated:** 2026-05-25  
**Maintained By:** Token Saver Protocol v1.0  
**Questions?** See `ops/CLAUDE-TOKEN-SAVER.md`
