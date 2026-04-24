# Hanna MCP Tools

Model Context Protocol (MCP) servers that give Agent Hanna access to creative production tools.

## Architecture

```
┌─────────────────────────────────────────────┐
│           Hermes Agent (Hanna)              │
│         (vendors/hermes-agent)              │
└─────────────┬───────────────────────────────┘
              │ JSON-RPC 2.0 (stdio)
              ▼
┌─────────────────────────────────────────────┐
│              MCP Servers                     │
├──────────────┬──────────────┬───────────────┤
│ openmontage  │ manga-creator│   blender     │
│ (video prod) │ (RTL manga)  │ (3D/avatars)  │
├──────────────┼──────────────┼───────────────┤
│ char-creator │   browser    │   supabase    │
│ (CC4/Reallu) │ (CDP autom.) │ (database)    │
└──────────────┴──────────────┴───────────────┘
```

## Servers

| Server | Port | Tools | Description |
|--------|------|-------|-------------|
| openmontage-mcp | stdio | 5 | Video production via OpenMontage engine |
| manga-creator-mcp | stdio | 6 | Japanese RTL manga page generation |
| blender-mcp | stdio | 5 | Anime avatars, Kupuri shaders, 3D rendering |
| character-creator-mcp | stdio | 5 | Reallusion CC4 template management |
| browser-mcp | stdio | 6 | Chrome DevTools Protocol automation |
| supabase-mcp | stdio | - | Database operations (external package) |

## Running

Each server is launched by Hermes Agent via stdio transport:

```bash
# Example: run openmontage server
python tools/openmontage-mcp/server.py

# Example: run manga server
python tools/manga-creator-mcp/server.py
```

## Protocol

All servers implement MCP (Model Context Protocol) version `2024-11-05`:
- Transport: stdio (stdin/stdout)
- Format: JSON-RPC 2.0
- Methods: `initialize`, `tools/list`, `tools/call`

## Configuration

Server connections are registered in `../.mcp.json`. Environment variables are documented in `../../.env.example`.

## Persona

The `hermes-config/persona.yaml` file configures Hermes Agent to act as Hanna (花), including personality, guardrails, memory settings, and youth protection rules.
