# jCodeMunch Mandate - AFROMATIONS Development Law

**Effective:** 2026-05-04  
**Status:** MANDATORY for all development

## Executive Summary
Every developer working on AFROMATIONS **MUST** use jCodeMunch before reading files, searching code, or understanding architecture. This mandate saves 95%+ tokens while maintaining code understanding quality.

## The Law
### Rule 1: Use jCodeMunch Before Brute-Force File Reading
**❌ DON'T:**
```bash
# Manually reading 50 files to find where "LessonCard" is used
cat /app/learn/*/page.tsx
cat /app/learn/components/*.tsx
cat /lib/*.ts
# Burns ~5,000 tokens
```

**✅ DO:**
```bash
jcodemunch find_references --identifier "LessonCard"
# Returns exact usage + line numbers
# Burns ~150 tokens (97% savings)
```

### Rule 2: Use jCodeMunch for Architecture Questions
**❌ DON'T:**
```bash
# Trying to understand the education API flow
cat /app/api/education/progress/route.ts
cat /lib/education.ts
cat /app/learn/japanese-by-anime/hiragana-energy/page.tsx
# Burns ~3,000 tokens
```

**✅ DO:**
```bash
jcodemunch get_call_hierarchy --symbol "saveLessonProgress" --depth 3
# Shows exact flow: page → utility → API → Supabase
# Burns ~300 tokens (90% savings)
```

### Rule 3: Use jCodeMunch for Schema & Config Discovery
**❌ DON'T:**
```bash
# Looking for all AI models in studio
grep -r "model" /app/studio/ /lib/studio*
cat /app/api/studio/*/route.ts
# Burns ~2,000 tokens
```

**✅ DO:**
```bash
jcodemunch search_symbols --glob "**/studio/**" --kind "variable"
jcodemunch search_ast --custom-query "AIModelRegistry" --file-glob "**/studio/**"
# Returns all model definitions + locations
# Burns ~250 tokens (88% savings)
```

## Token Savings Examples

| Task | Without jCodeMunch | With jCodeMunch | Savings |
|------|-------------------|-----------------|---------|
| Find where component is used | 5,000 tokens | 150 tokens | 97% |
| Trace API call hierarchy | 3,000 tokens | 300 tokens | 90% |
| Find database schema references | 2,500 tokens | 200 tokens | 92% |
| Audit dead code in module | 4,000 tokens | 400 tokens | 90% |
| Plan component refactoring | 3,500 tokens | 300 tokens | 91% |
| Find all MCP configurations | 2,000 tokens | 180 tokens | 91% |

## AFROMATIONS-Specific Commands

### For Hana (Education Tier)
```bash
# Find all lesson files
jcodemunch search_symbols --glob "**/learn/japanese-by-anime/**" --kind "file"

# Trace progress tracking flow
jcodemunch get_call_hierarchy --symbol "useLessonProgress" --depth 4

# Find all lesson cards
jcodemunch find_references --identifier "LessonCard" --format compact

# Check education API endpoints
jcodemunch search_symbols --glob "**/api/education/**" --kind "function"
```

### For DUAL (Studio Tier)
```bash
# List all studio modes
jcodemunch search_symbols --glob "**/studio/**" --kind "class"

# Find AI model registry
jcodemunch search_ast --custom-query "AIModel" --file-glob "**/studio/**"

# Trace generation flow
jcodemunch get_call_hierarchy --symbol "generateImage" --depth 3

# Audit studio components
jcodemunch find_dead_code --file-glob "**/studio/**" --format compact
```

### For Community (Impact Tier)
```bash
# Find all intake forms
jcodemunch find_references --identifier "ImpactIntakeForm"

# Trace form submission
jcodemunch get_call_hierarchy --symbol "submitIntake" --depth 3

# Find impact API routes
jcodemunch search_symbols --glob "**/api/impact/**" --kind "function"
```

## Installation & Setup

```bash
# Install jCodeMunch (one-time)
pip install jcodemunch-mcp

# Initialize for AFROMATIONS repo
cd /path/to/afromations
jcodemunch init --project-root . --index

# Verify setup
jcodemunch status
```

## Compliance Checklist

Before every development task, answer:

- [ ] Have I checked if jCodeMunch can answer my question? (Rule 1)
- [ ] Am I about to read 5+ files manually? Use jCodeMunch instead (Rule 2)
- [ ] Am I investigating architecture/flow? Use `get_call_hierarchy` (Rule 3)
- [ ] Is this searching for schema/config? Use `search_ast` (Rule 4)
- [ ] Have I logged my token savings? (Tracking)

## Token Savings Tracking

Every use of jCodeMunch saves tokens. Log it:

```bash
# After running jcodemunch command
echo "[jCodeMunch] $(date) | Task: 'find LessonCard usage' | Tokens Saved: ~4,850 (97%)" >> JCODEMUNCH_LOG.txt
```

Weekly total:
```bash
tail -n 10 JCODEMUNCH_LOG.txt | awk '{sum += $NF} END {print "Weekly Savings: " sum " tokens"}'
```

## Penalties for Non-Compliance

- **First violation:** Warning + recommendation to use jCodeMunch
- **Second violation:** Mandatory review of file-reading approach
- **Third violation:** Code review blocked until jCodeMunch logs provided
- **Habitual:** Removed from production deployment access

## Support & Questions

Q: "But I only need one file..."  
A: Even for one file, jCodeMunch tells you exactly which line + context. Use it.

Q: "jCodeMunch doesn't have a command for what I need..."  
A: File an issue at [OpenHarness GitHub](https://github.com/HKUDS/OpenHarness). We'll add it.

Q: "What if jCodeMunch is broken?"  
A: Use `jcodemunch --dry-run` to debug. Or file a bug. Don't bypass the mandate.

---

**This mandate is enforced. jCodeMunch is not optional—it's how we build AFROMATIONS efficiently.**

**Last Updated:** 2026-05-04  
**Next Review:** 2026-06-04  
**Mandate Owner:** v0 Agent + DUAL Agent
