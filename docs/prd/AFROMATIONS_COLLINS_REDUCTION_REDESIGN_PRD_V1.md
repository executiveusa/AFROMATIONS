# AFROMATIONS Collins Reduction Redesign PRD v1

**Status:** PROPOSED — approval required before implementation  
**Branch:** `feat/afromations-control-plane-audit-2026-09-16`  
**Live baseline:** `https://afromations.vercel.app/`

## Product lock

AFROMATIONS is the parent studio.

Public spine:

> **Original Worlds. Real Artists. Community Impact.**

Public category: Seattle-based social-purpose art and animation studio.

Hana, DUAL, AfroScribble, manga, tools, merchandise, and future agents are products/IP/programs under AFROMATIONS.

**Technology rule:** AI is infrastructure, not the company category. Use “AI” only when it explains a real capability, primarily on Hana or Studio product surfaces.

## Art of Reduction

Every public section must orient, prove, connect, convert, or recover.

Public hierarchy:

`STUDIO → WORK → REAL ARTISTS → COMMUNITY IMPACT → HANA → STORIES → SHOP → ACTION`

Remove repeated technical language, framework names, model names, agent plumbing, roadmap detail, and duplicate CTAs from the main landing page.

## Proposed homepage wireframe

### 01 — Hero
Full-bleed DUAL cinematic video loop from approved canon art.

**AFROMATIONS**

**Original Worlds. Real Artists. Community Impact.**

Seattle-based art and animation studio building original IP, collaborating with artists around the world, and connecting creative talent to real community work.

Primary CTA: **Explore the Work**  
Secondary CTA: **Work With AFROMATIONS**

No “powered by AI” line in the hero.

### 02 — Selected Work
Large editorial panels, not SaaS cards:
- DUAL — Seattle 2056
- Agent Hana
- AfroScribble
- Manga / selected studio work

### 03 — Real Artists
Use verified interview footage, artist portraits, artwork, names, locations, disciplines, and short credited quotes.

### 04 — Community Impact
For clients/community:
- Request graffiti cleanup
- Commission a mural
- Find / hire an artist
- Propose a community project

For artists:
- Join artist network
- Add disciplines / portfolio
- Opt into paid opportunities

### 05 — Agent Hana
Hana is a product of AFROMATIONS.

**Agent Hana — The studio intelligence behind AFROMATIONS.**

Simple workflow:
`Tyshawn speaks → Instinct receives intent → Hana organizes the mission → specialist tools/agents execute → consequential actions return for approval`

### 06 — AFROMATIONS Stories
Artist profiles, interview films, mural stories, original IP development, anime/manga process, Seattle/Northwest creative culture.

### 07 — Shop
DUAL / Hana / studio drops. No fake inventory. Printify comes later.

### 08 — Final action
**I’M AN ARTIST**  
**I HAVE A PROJECT**

## Proposed navigation

Desktop:
Work · Artists · Community · Stories · Studio · Shop · **Work With Us**

Mobile:
logo · language if retained · hamburger · full-screen menu · 44px+ targets.

Demote roadmap-heavy Provenance and Drops from primary navigation until they contain live proof.

## Copy reduction

Reduce repeated phrases such as:
- “AI Guide Through Anime”
- “personal AI education agent”
- “AI-powered creative workspace”
- “AI-powered creative business”
- “AI-powered by Agent Hana”
- “AI article generation”
- repeated “Powered by Agent Hana”

Direction:

**Before:** Your AI Guide Through Anime  
**After:** The studio intelligence behind AFROMATIONS.

**Before:** Hana is your personal AI education agent for anime culture and production.  
**After:** Hana helps organize research, creative production, publishing, and studio work.

**Before:** AI-powered creative workspace for anime storytelling.  
**After:** A creative workspace for character, image, and story development.

**Before:** Turn your characters into an AI-powered creative business.  
**After:** Turn original characters into a working creative business.

**Before:** Real open-source tools. AI-powered by Agent Hana.  
**After:** Real creative tools, organized through Hana.

Remove “Powered by Agent Hana” from the company copyright line.

## DUAL hero video — approval required before generation

Do not spend credits until the owner approves the PRD and selects the exact DUAL reference image.

Creative rules:
- DUAL in Seattle 2056
- cinematic anime, not photoreal
- preserve DUAL identity exactly
- restrained rain / smoke / neon / city movement
- slow push or lateral drift
- no dialogue, fight choreography, logos, or baked text
- darker text-safe region
- 16:9
- 6–8 seconds
- silent
- 1080p minimum
- poster frame + reduced-motion fallback

Higgsfield candidate: **Seedance 2.5** first; it supports reference-driven video, 16:9, 1080p, and 4–30 seconds. MiniMax H3 is the higher-resolution alternative if identity consistency tests better.

Generate one candidate at a time and stop for owner approval.

## Approval-gated implementation

### Gate 0 — Baseline lock
No design edits.
- verify Vercel production deployment + commit
- capture 320 / 375 / 390 / 430 / 768 / 1024 / 1440
- resolve browser-audit mobile-nav discrepancy
- capture hero, Hana, DUAL, Studio, Community, footer
- record rollback

### Gate 1 — Copy reduction only
No layout redesign.
- reduce AI-first wording
- apply three-pillar positioning
- update metadata / OG copy
- preserve routes/functionality
- deploy preview only
- before/after browser comparison

### Gate 2 — Homepage structure
- reorder to approved wireframe
- put real proof above placeholders
- establish Work / Artists / Community / Stories
- use current approved assets as temporary placeholders
- mobile-first verification

### Gate 3 — DUAL hero video
- owner selects reference
- estimate Higgsfield cost
- generate one candidate
- review character consistency
- owner approves
- web optimize
- add poster/reduced-motion fallback
- verify performance

### Gate 4 — Real artist proof
- ingest approved interview footage/images
- create 3–6 verified artist stories
- correct credits and permissions

### Gate 5 — Community impact
- artist signup
- mural request
- graffiti cleanup request
- community project intake
- privacy / confirmation / backend review queue

### Gate 6 — Hana product page
- repair `/hana`
- present Hana as AFROMATIONS product/operator
- demonstrate one real workflow
- keep technical architecture behind details

### Gate 7 — DUAL product/IP page
- repair layout/layering
- approved canon art only
- world/story/product structure
- real merchandise only

### Gate 8 — Stories
Convert generic blog into AFROMATIONS Stories.

### Gate 9 — Commerce
Printify integration, approved mockups, margin review, human approval before public products.

### Gate 10 — Collins Gauntlet
Two-second test, Collins, Art of Reduction, mobile matrix, accessibility, evidence, wiring, performance, SEO, rollback. Release only with 0 P0 and 0 P1.

## Browser-agent ZIP baseline

Treat these as observed evidence, with re-verification required:
- `/hana` was nearly blank
- `/dual` had a layering problem
- Work and Community lacked visible proof
- Studio had the strongest live product proof
- mission copy was one of the strongest current brand surfaces
- mobile-nav failure was reported at 390px

**Discrepancy:** current production HTML now contains a mobile hamburger and full-screen mobile menu, so that P0 must be rerun visually before changing nav code.

## Definition of done

- a stranger understands AFROMATIONS in ~2 seconds
- hero does not lead with AI terminology
- real work and real people precede roadmap concepts
- Hana is clearly a product/studio intelligence
- DUAL is clearly original AFROMATIONS IP
- artists can join
- clients/community partners can request real work
- CTAs work
- mobile is intentionally composed
- claims are provable
- production is verified
- rollback is documented

## Next decision

Do not change production yet.

Owner approves or edits:
1. three-pillar positioning,
2. homepage wireframe,
3. copy-reduction direction,
4. approval-gated sequence,
5. DUAL hero-video direction.

Then begin Gate 0 and Gate 1.
