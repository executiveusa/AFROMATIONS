# Hana Current Architecture

**Status:** Active (as of May 2026)

## Layer Map

```
AFROMATIONS (head product)
│
├── Hana (PI agent / platform manager)
│   ├── hanna-backend/api/         — Hono Workers API
│   ├── hanna-backend/agents/      — Agent profiles
│   ├── hanna-backend/skills/      — Skill library
│   ├── hanna-backend/harnesses/   — Decision harnesses
│   └── hanna-backend/open-harness-adapter/  — TS contract layer
│
├── Dual (in-house demo character)
│   └── afromations-frontend/src/app/dual/
│
├── AfroScribble (creative tool — future)
│   └── Documented in AFROSCRIBBLE_TOOL_INTEGRATION.md
│
├── Paperclip (control plane)
├── Absurd (durable workflows)
└── Pi (coding harness)
```

## Backend Routes (live)

| Prefix | Area |
|--------|------|
| `/api/hanna` | Legacy Hanna studio routes |
| `/api/hana` | New Hana Learning OS + Harness routes |
| `/api/auth` | Auth (register, login, refresh) |
| `/api/affirmations` | Affirmations (NIM-powered) |
| `/api/blog` | Blog posts |
| `/api/trends` | Anime trends |
| `/api/gallery` | Gallery assets |
| `/api/waitlist` | Artist waitlist (new) |
| `/api/artist-application` | Full partner application (new) |
| `/api/hana/research/*` | Noble Goose research pipeline |
| `/api/hana/content/*` | Content generation |
| `/api/hana/publishing/*` | Social queue |
| `/api/hana/wallet/*` | Revenue ledger |
| `/api/hana/harness/health` | Integration health |

## Frontend Routes (live)

| Route | Status | Purpose |
|-------|--------|---------|
| `/` | Live | Homepage |
| `/hana` | Live | Hana agent page |
| `/dual` | Live | Dual character page |
| `/studio` | Live | AI creative tools |
| `/learn` | Live | Hana Academy |
| `/blog` | Live | Blog |
| `/store` | Live | Store |
| `/social-purpose` | Live | Mission page |
| `/artist-partner-program` | New | Partner program details |
| `/apply` | New | Application form |
| `/provenance` | New (placeholder) | Provenance Vault |
| `/drops` | New (placeholder) | Auction drops |
| `/directory` | New (placeholder) | Artist directory |
| `/artists` | New (placeholder) | Artist discovery |

## Database (Supabase)

Key tables for the artist platform:
- `hana_research_sources` — YouTube channel sources
- `hana_video_research` — Video metadata
- `hana_extracted_concepts` — AI-extracted concepts
- `hana_generated_content` — Generated blog/social/script content
- `hana_social_queue` — Social publishing queue
- `hana_wallet_ledger` — Revenue and payout tracking
- `hana_memory_nodes` / `hana_memory_edges` — Knowledge graph
- `hana_users` — Auth users
- `hana_affirmations` — User affirmations
- `af_waitlist` — Artist waitlist (new)
- `af_artist_applications` — Partner applications (new)

## Cloudflare Workers Config

- Approval mode: `HANA_PUBLISHING_APPROVAL_MODE=true`
- Dry-run: `HANA_DRY_RUN_PUBLISHING=true`
- Autopublish: `HANA_AUTOPUBLISH_ENABLED=false`
