# AFROMATIONS / Agent Hana — Context Scan (Phase 0)

## Step 0 Inventory Snapshot
- Existing frontend shell: `afromations-frontend/` (Next.js app shell).
- Existing backend prototype: `hanna-backend/api/` (Hono + Cloudflare Workers routes).
- Existing memory/schema direction: `synthia/schema.sql`.
- Existing persona files: `hanna-backend/CLAUDE.md`, `SOUL.md`, `USER.md`.
- Existing creative/media archives: `AFROMATIONS/Website`, `ANIMATION & 3D`, `free manga`.
- Existing vendor-area repos already present: `vendors/blog`, `vendors/cinematic-site-components`, `vendors/claudeclaw`.

## Problem → Amplify → Solution → System (P.A.S.S.)
- **Problem:** The repo is currently a mixed archive with runtime code, assets, and references interleaved.
- **Amplify:** Mixed boundaries increase integration risk, obscure ownership, and slow release confidence.
- **Solution:** Introduce explicit product architecture boundaries (`apps`, `services`, `packages`, `content`, `docs`, `vendors`, `assets`) while preserving provenance.
- **System:** Phase 0 codifies architecture + canon + curriculum + assessment + manga unlock in docs before runtime mutation.

## Bounded Contexts
1. **Hana Product Runtime**
   - Frontend app UX flows (consent, onboarding, lesson, dashboard, unlocks).
   - Backend lessoning, mastery, learner profile, adaptive schedule.
2. **Hana IP Canon**
   - Character bible, visual bible, manga issue scripts, unlock dependencies.
3. **Hana Studio OS**
   - Persistent wiki, graph memory, ingestion logs, operator visibility.
4. **External/Supporting Contexts (kept separate)**
   - Yappyverse / Poly Effect ecosystem.
   - Hermes/Second-Brain broader control plane.

## Meadows Map (initial)
- **Stocks:** learner trust, lesson graph quality, canon consistency, memory/wiki corpus, mastery records.
- **Flows:** lesson completions, oral tests, retention checks, wiki updates, unlock events.
- **Balancing loops:** mastery gates, consent gates, integrity review, admin audit logs.
- **Reinforcing loops:** adaptive routine learning, misconception tracking, targeted review.
- **Leverage points:**
  - LP4 (information flow): wiki + graph + misconception logs.
  - LP6 (feedback gain): strict unlock thresholds and retention checks.
  - LP8 (feedback loops): adaptive scheduler coupled to real routine.
  - LP9 (structure): separate services for lessoning, voice, assessment.

## Quality Floor Commitments
- Audience lock: 21+ adults.
- Consent lock: explicit consent for voice/memory/vision assessment features.
- Cultural lock: Japanese-first framing with nuanced category distinctions.
- Product lock: not generic chatbot behavior; mastery-first progression.
