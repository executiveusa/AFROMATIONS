# AFROMATIONS Studios — Skills & API Registry

This document maps workspace folders to named skills and API capabilities.

## Skills Map

### 3D Pipeline
| Skill | Source | Description |
|-------|--------|-------------|
| `blender-avatar` | `hanna-backend/tools/blender-mcp/` | Anime avatar creation via Blender bpy |
| `kupuri-shader` | `hanna-backend/tools/blender-mcp/` | Toon shader, Freestyle outlines |
| `scene-render` | `hanna-backend/tools/blender-mcp/` | Eevee/Cycles render pipeline |
| `glb-export` | `hanna-backend/tools/blender-mcp/` | Web-optimized GLB export |

### Content Engine
| Skill | Source | Description |
|-------|--------|-------------|
| `anime-trends` | `hanna-backend/api/src/routes/trends.ts` | Google Trends monitoring for anime topics |
| `blog-generate` | `hanna-backend/api/src/routes/blog.ts` | AI article generation from trends |
| `community-digest` | `hanna-backend/cron-registry.json` | Weekly community digest scheduling |

### Frontend Components
| Skill | Source | Description |
|-------|--------|-------------|
| `cinematic-animations` | `vendors/cinematic-site-components/` | 30 vanilla JS animation modules (GSAP) |
| `text-scramble` | `vendors/cinematic-site-components/02-text-scramble/` | Katakana text scramble effect |
| `cursor-reactive` | `vendors/cinematic-site-components/03-cursor-reactive/` | Magnetic cursor interactions |
| `zoom-parallax` | `vendors/cinematic-site-components/06-zoom-parallax/` | Parallax scroll zoom |
| `particle-button` | `vendors/cinematic-site-components/14-particle-button/` | Disintegration button effect |
| `mesh-gradient` | `vendors/cinematic-site-components/18-mesh-gradient/` | Animated mesh gradient backgrounds |
| `kinetic-marquee` | `vendors/cinematic-site-components/21-kinetic-marquee/` | Kinetic text marquee scroll |
| `glitch-effect` | `vendors/cinematic-site-components/15-glitch-effect/` | Anime glitch transition |

### Reference Codebases
| Skill | Source | Description |
|-------|--------|-------------|
| `blog-platform` | `vendors/blog/` | Next.js 16 + React 19 bilingual blog (MDX, i18n) |
| `captcha-anime` | `anime-captcha/` | SvelteKit anime captcha component |
| `annict-tracker` | `annict/` | Ruby on Rails anime tracking platform |
| `manga-reader` | `free manga/` | Next.js manga reader with Shadcn UI |

### Infrastructure
| Skill | Source | Description |
|-------|--------|-------------|
| `synthia-backend` | `synthia/` | Supabase schema, UDEC audits, circuit breakers |
| `agent-orchestration` | `hanna-backend/` | Multi-agent workspace (Alpha/Beta/Gamma teams) |
| `n8n-workflows` | `n8n-workflows/` | Automation workflows (StoryToolkitAI) |

## API Endpoints

### Hanna API (Cloudflare Workers)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/hanna/chat` | Agent Hanna chat |
| POST | `/hanna/avatar` | Generate anime avatar |
| POST | `/hanna/render` | Render 3D scene |
| POST | `/hanna/export` | Export asset |
| POST | `/blog/generate` | Generate article from trend |
| GET | `/blog/posts` | List blog posts |
| GET | `/blog/posts/:slug` | Get single post |
| GET | `/trends` | Current anime trends |
| GET | `/trends/topics` | Curated article topics |
| POST | `/trends/scan` | Trigger trend scan |
| GET | `/gallery` | List gallery assets |
| GET | `/gallery/:id` | Get single asset |

## Folder Organization

```
AFROMATIONS/
├── afromations-frontend/    ← Next.js landing page (Cloudflare Pages / Vercel)
├── hanna-backend/           ← Agent Hanna API + orchestration (Cloudflare Workers)
│   ├── api/                 ← Hono API server
│   ├── shared/memory/       ← Agent conversation logs
│   └── .mcp.json            ← MCP server connections
├── vendors/                 ← Cloned reference repos
│   ├── claudeclaw/          ← Agent Hermes template (rebranded → Hanna)
│   ├── cinematic-site-components/  ← 30 animation modules
│   └── blog/                ← Next.js blog base
├── synthia/                 ← SYNTHIA 3.0 backend schemas
├── anime-captcha/           ← SvelteKit captcha component
├── annict/                  ← Ruby anime tracker reference
├── free manga/              ← Next.js manga reader reference
├── n8n-workflows/           ← Automation workflows
├── AFROMATIONS/Website/     ← Existing assets (logos, audio, videos, DUO images)
└── ANIMATION & 3D/          ← Character Creator 4, Reallusion templates
```
