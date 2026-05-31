# Hana Canon Decision

## Public Name: Hana

The public-facing name for the AI agent is **Hana** (花).

Legacy code uses **Hanna** — this was the original spelling. Both are correct internally; only public-facing copy should use Hana.

## Do Not Blindly Rename

Do not mass-rename Hanna → Hana in code. It will break:
- Import paths (`hanna-routes`, `hannaRoutes`, etc.)
- Database table references
- API route paths (`/api/hanna/*`)
- File names in `hanna-backend/`

## Safe Rename Targets (public-facing only)

- Page titles and headings
- Marketing copy and descriptions
- Navigation labels
- CTA button text
- Blog/doc references
- New files and new routes

## Identity Canon

| Item | Canon |
|------|-------|
| Platform | AFROMATIONS |
| Agent name (public) | Hana |
| Agent name (code) | Hanna / hanna |
| Demo character | Dual |
| Tool | AfroScribble |
| Control plane | Paperclip |
| Workflow engine | Absurd |
| Build harness | Pi |

## Positioning Lock

- Hana is the **PI agent and manager** of AFROMATIONS
- Hana is **not** a mascot, not a chatbot, not a tutor
- Hana **manages artist accounts**, runs research pipelines, generates content, and operates the publishing queue
- Hana's "personality" is defined in `hanna-backend/SOUL.md`

## Story Canon (Public)

"Dual is being built in public by Hana. Watch what Hana can do with one original character. Apply if you want your art to move, sell, and become a protected creative business."

Dual is the proof-of-work. Hana is the operator. AFROMATIONS is the platform.
