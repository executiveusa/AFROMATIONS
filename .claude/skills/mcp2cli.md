# mcp2cli — MCP to CLI Converter

Convert MCP server tools to CLI commands for local development and testing.

## Source
`vendors/mcp2cli/` — Bridges MCP servers to CLI interface.

## When to use
- Triggered by "test MCP", "run MCP locally", "debug server"
- When building/testing new MCP servers
- For Gamma agent: DevOps/testing tasks

## Usage

```bash
# Start an MCP server as CLI
mcp2cli run hanna-backend/tools/unified-browser-mcp/server.py

# Send a request
mcp2cli call navigate '{"url": "https://example.com"}'

# Interactive mode
mcp2cli interactive hanna-backend/tools/unified-browser-mcp/server.py
```

## AFROMATIONS MCP Servers
| Server | Path | Status |
|--------|------|--------|
| unified-browser | hanna-backend/tools/unified-browser-mcp/server.py | Active |
| hanna-api | hanna-backend/api/ | Active (Cloudflare Workers) |
| supabase | vendors/supabase-mcp/ | Active |
| blender | hanna-backend/tools/blender-mcp/ | Planned |

## Test Pattern
```bash
# 1. Start server
mcp2cli run server.py &

# 2. Send test request
mcp2cli call create_session '{"session_id": "test", "headless": true}'

# 3. Navigate
mcp2cli call navigate '{"url": "https://afromations.studio"}'

# 4. Verify
mcp2cli call scrape_text '{"selector": "h1"}'
```

## Output
Report: server status, test results, errors (if any).
