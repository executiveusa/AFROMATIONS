# Repo Harvest Map (Phase 0)

## Primary Repo Inputs
- `afromations-frontend/`: migrate into `apps/web` (preserve git history where possible).
- `hanna-backend/api/`: harvest Hono route patterns into `services/hana-core`.
- `synthia/schema.sql`: source for DB schema direction and memory entities.
- `AFROMATIONS/Website`, `free manga`, `ANIMATION & 3D`: archive/reference sources into `assets` + `content` workflows.

## Supporting Repos (status in this workspace)
- **Present now:** `vendors/blog`, `vendors/cinematic-site-components`, `vendors/claudeclaw`.
- **Expected but not yet found in current tree:** `pi-mono`, `flywheel_connectors`, `OmniVoice`, `pauli-graphify`, `caveman`, `rtk`, `agentic_coding_flywheel_setup`.

## Harvest Rules
1. No blind copy into runtime paths.
2. Extract patterns/interfaces, not identity.
3. Keep provenance notes for each adopted module.
4. Keep capability boundaries for connectors.
5. Keep voice engine behind adapter interface.

## Near-Term Harvest Actions
- Create backend contracts first (`hana-core`, `assessment-engine`, `voice-gateway`).
- Add curriculum and canon packages as content-first truth.
- Add wiki maintenance policy docs before ingestion jobs.
