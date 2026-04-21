# jCodeMunch MCP — Token Optimization

Compress and optimize context before sending to LLM to reduce token usage.

## Source
`vendors/jcodemunch-mcp/` — MCP server for token compression and context management.

## When to use
- Triggered by "optimize tokens", "compress context", "token budget"
- Before large code generation tasks
- When hitting context limits

## Core Capabilities
- Strip comments, whitespace from code context before sending
- Summarize file contents rather than sending raw files
- Prioritize relevant sections of large files
- Track token budget across a session

## Usage Pattern

```
Before starting a task:
1. Estimate total context needed
2. If >50k tokens: use jcodemunch to compress before sending
3. Send only: function signatures + docstrings + key data structures
4. Full bodies only when needed for direct editing
```

## MCP Server
Runs at: `vendors/jcodemunch-mcp/`
Start: `npx jcodemunch-mcp` (check vendors/jcodemunch-mcp/README.md for current command)

## Token Budget Rules (AFROMATIONS)
- Daily budget: $50 max (SYNTHIA circuit breaker)
- Per task: $10 max before warning
- Prefer: multiple small tasks > one large context dump

## Output
Report estimated token count before/after compression.
