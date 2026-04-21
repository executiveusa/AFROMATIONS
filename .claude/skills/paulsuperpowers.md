# Paulsuperpowers — Advanced Agent Utilities

Advanced utilities for Claude Code agents: context management, parallel execution, deep research.

## Source
`git@github.com:executiveusa/paulsuperpowers.git`
Status: SSH-only repo. Clone manually:

```bash
git clone git@github.com:executiveusa/paulsuperpowers.git vendors/paulsuperpowers
cp vendors/paulsuperpowers/SKILL.md .claude/skills/paulsuperpowers.md
```

## Interim Capabilities (until repo is cloned)

### Parallel Execution
When facing a multi-part task, split and run in parallel:
```
Task: "Audit the entire codebase"
Split:
  - Agent 1: frontend analysis
  - Agent 2: backend analysis
  - Agent 3: database analysis
Run simultaneously → merge results
```

### Deep Research Mode
For complex questions (Japanese culture, folklore, mythology):
1. Check internal wiki first (hana_wiki_entries)
2. If not found: use browser-use skill to research
3. Synthesize 3+ sources before answering
4. Save findings to gbrain memory

### Context Compression
When working on large codebases:
1. Read only files directly relevant to task
2. Use grep/glob instead of reading directory trees
3. Build mental model from function signatures, not full implementations

### Memory Persistence
At end of each significant session:
1. Write decision log to shared/memory/
2. Update wiki if new cultural knowledge gained
3. Mark completed beads in synthia_beads

## When to use
For any complex, multi-step task that needs coordination.
