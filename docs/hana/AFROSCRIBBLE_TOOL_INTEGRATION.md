# AfroScribble Tool Integration

## What AfroScribble Is

AfroScribble is a **creative production tool** inside AFROMATIONS. It is not a separate product or company layer.

**Positioning:**
> "AfroScribble turns character art into coloring pages, stencil layers, printable asset packs, and production-ready visual derivatives."

## Role in the Stack

```
AFROMATIONS
└── Hana (agent)
    └── AfroScribble (tool)
        ├── Image → Stencil
        ├── Image → Coloring book pages
        ├── Image → Printable packs
        └── Image → Production derivatives
```

AfroScribble is a **Hana Studio tool**, not a standalone agent.

## Current Status

AfroScribble is **not yet implemented** as API routes. The following are roadmap routes to build:

```
POST /api/hana/tools/afroscribble/create
POST /api/hana/tools/afroscribble/stencil
POST /api/hana/tools/afroscribble/coloring-book
GET  /api/hana/tools/afroscribble/jobs/:id
GET  /api/hana/tools/afroscribble/exports/:id
```

## Frontend Positioning (Current)

UI CTA until routes are live:
- "Preview AfroScribble Workflow" (links to waitlist)
- "Join Invite List for AfroScribble" (links to `/apply`)

Do NOT build a full AfroScribble UI before the backend routes exist.

## Planned Workflow

1. Artist uploads character art (PNG/JPG/SVG)
2. Hana runs AfroScribble job via internal API
3. Job produces: stencil layer, coloring-page PDF, printable asset pack
4. Output stored in R2 / Supabase
5. Artist downloads from artist landing page or admin dashboard

## Integration with Provenance Vault

AfroScribble-generated assets should write a `ProvenanceRecord` entry with:
- `sourceFiles`: original character art hash
- `finalFiles`: generated derivative hashes
- `aiToolsUsed`: ["AfroScribble"]
- `humanContributionNotes`: "Artist-uploaded original character"

## Build Priority

AfroScribble is **not the first build priority**. Build after:
1. Waitlist + application flow ✓
2. Artist Partner Program page ✓
3. Dual public demo ✓
4. Provenance Vault schema ✓
5. **Then: AfroScribble backend routes**
