# AGENTS.md PATCH — Add HANA to KUPURI roster

## 1. Add to the mandatory skills block (after SYNTHIA v3.0 block):

> **HANA Blender Agent** (2026-03-15): All 3D/animation asset requests route to HANA.
> Agent definition: `apps/control-room/agents/hana.md`
> MCP tools: `tools/blender-mcp/blender-tools.json`
> CLI access: `mcp2cli --mcp-stdio "python apps/control-room/src/lib/blender-mcp/server.py" --list`
> Install: `uvx mcp2cli` + `pip install mcp blenderless`
> HANA delivers .glb, .fbx, .png, .mp4, .gif — never descriptions, always files.

## 2. Add to Agent Roster table:

| `hana` | HANA | Directora de Arte 3D & Anime — Blender bpy + anime pipeline | Claude |

## 3. Add to Tool Permissions table:

| hana | ❌ | ❌ | ❌ | ✅ | ✅ | draft only |

## 4. Add API endpoint:

| `POST /api/hana` | Chat with HANA / request 3D asset |
| `POST /api/hana/avatar` | Generate anime avatar |
| `POST /api/hana/render` | Render scene/animation |
| `POST /api/hana/export` | Export GLB for web |
| `GET  /api/hana/gallery` | List produced assets |

## 5. Add Cron entry to vercel.json:

{ "path": "/api/hana/weekly-asset", "schedule": "0 14 * * 1" }
