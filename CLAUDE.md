# AFROMATIONS — Claude Code Customizer

## Project Identity

AFROMATIONS is a **21+ artist infrastructure platform**.

It helps serious artists turn original characters into protected, monetizable creative IP through private AI studio agents, production workflows, artist landing pages, provenance tracking, auctions, commissions, licensing, and build-in-public systems.

This is **not** a generic AI image app.  
This is **not** a kids-first learning app.  
This is **not** a nonprofit.  
This is **not** a self-serve gimmick.

AFROMATIONS is a **for-profit artist infrastructure company** with a social-purpose commitment.

---

## Core Architecture

| Layer | Purpose |
|-------|---------|
| **AFROMATIONS** | Head product architecture |
| **Hana** | PI agent and platform manager |
| **Dual** | In-house demo character and public proof-of-work IP |
| **AfroScribble** | Creative tool: stencils, coloring pages, printables, asset packs |
| **Paperclip** | Operations / control-plane layer |
| **Absurd** | Durable workflow engine |
| **Pi** | Coding / build harness |
| **Provenance Vault** | Authorship / IP evidence layer |
| **Artist Directory** | Future network / community graph |
| **Drops / Auctions** | Monetization pathway |

---

## Naming Rules

Public name is **Hana**.  
Legacy code may contain **Hanna** — do not break existing routes or imports by blindly renaming.  
New public-facing UI and docs use **Hana**.  
Legacy aliases may remain as compatibility paths.

---

## Target User

21+ serious artists and creative professionals:
- Anime artists, character designers, manga creators
- Tattoo artists, muralists, animators, illustrators
- Musicians needing visual IP
- Creators with original characters
- Studios and collectors

---

## Core Offer

**Primary offer:** Hana Artist Partner Program  
**Primary promise:** "Turn your characters into an AI-powered creative business."  
**Primary CTA:** "Apply for Invite"  
**Secondary CTA:** "Watch Hana Build Dual"

---

## Business Model

1. Invite-only artist application + waitlist
2. 24-hour character demo
3. Paid Hana artist agent install
4. Monthly agent management fee
5. Artist landing pages
6. Character asset packs
7. Auction / drop commissions
8. Licensing commissions
9. Provenance / IP workflow support

---

## UI Truth Rule

Every page, CTA, nav item, and feature claim must connect to:
1. Implemented functionality, OR
2. A real waitlist / application path, OR
3. A placeholder labeled "Coming soon", "Invite-only", or "Prototype", OR
4. A documented roadmap item

**No fake product claims. No promised features that don't exist.**

---

## Legal / IP Copy Rules

Required disclaimer on all IP/legal pages:
> "Educational information only. This is not legal advice. Work with a licensed attorney for legal decisions."

Do NOT say:
- Guaranteed copyright
- Blockchain trademark
- Automatic legal protection
- AI-generated work is always protected
- AfroMations is a law firm

Correct framing:
- Blockchain can timestamp evidence
- Copyright and trademark require legal process
- Human authorship matters
- Contracts and records matter
- Artists need provenance trails

---

## 21+ Rule

Public platform language: "AfroMations is currently invite-only for 21+ artists and creative professionals."

Do not lead with youth, school, or kids.

---

## Build Priorities

1. Waitlist / application flow
2. Hana Artist Partner Program page
3. Dual public demo / build-in-public page
4. Provenance Vault placeholder + schema
5. IP / legal blog structure
6. Drops / auction placeholder
7. Directory placeholder
8. AfroScribble tool integration docs
9. Paperclip / Absurd / Pi architecture docs
10. UI copy audit
11. Build / lint verification

---

## Engineering Rules

**Before editing:**
- Inspect existing structure and framework versions
- Find Hana / Hanna routes and avoid breaking them
- Produce a short plan

**When editing:**
- Preserve working code
- Make small, safe changes
- Use compatibility aliases, not blind renames
- No secrets in code
- Keep backend and UI aligned — no fake UI promises

**After editing:**
- Run lint if available
- Run typecheck if available
- Run build if available
- List changed files and unresolved issues

---

## Required Routes

**Frontend pages:**
- `/` — Homepage
- `/hana` — Hana agent
- `/dual` — Dual build-in-public
- `/artist-partner-program` — Program details
- `/apply` — Application form (21+, invite-only)
- `/waitlist` — Redirect to `/apply`
- `/studio` — AI creative tools
- `/provenance` — Provenance Vault placeholder
- `/drops` — Auction / drop placeholder
- `/directory` — Artist directory placeholder
- `/artists` — Artist discovery placeholder
- `/services` — Service listing placeholder
- `/commissions` — Commission requests
- `/blog` — IP / legal education blog

**Backend API:**
- `POST /api/waitlist` — Collect waitlist signups
- `POST /api/artist-application` — Full partner application

**AfroScribble (future, document only):**
- `POST /api/hana/tools/afroscribble/create`
- `POST /api/hana/tools/afroscribble/stencil`
- `POST /api/hana/tools/afroscribble/coloring-book`
- `GET /api/hana/tools/afroscribble/jobs/:id`
- `GET /api/hana/tools/afroscribble/exports/:id`

---

## Copy System

**Preferred headlines:**
- "Turn your characters into an AI-powered creative business."
- "Private AI studio agents for serious artists."
- "Hana helps artists turn original characters into protected, monetizable IP."

**Preferred CTAs:**
- "Apply for Invite"
- "Watch Hana Build Dual"
- "Request a 24-Hour Character Demo"
- "Join the Artist Partner Waitlist"
- "Explore the Provenance Vault"
- "Read the Artist IP Journal"
- "Preview AfroScribble Workflow"

**Avoid:**
- "Sign up for school"
- "Free AI art"
- "Kids program"
- "NFT marketplace"
- "Instant legal protection"
- "Blockchain trademark"

---

## Final Report Format

At the end of every major task, report:
1. What was found
2. What changed
3. Routes added / updated
4. UI copy updated
5. Backend / API work done
6. Tests / build commands run
7. Errors or warnings
8. Next recommended task
9. Risks
10. Files changed
