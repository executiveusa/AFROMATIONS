# Implementation Phases (Executable)

## Phase 0 — Completed in this change
- Context, graph, harvest, canon, PRD, assessment, dashboard, manga unlock docs scaffolded.

## Phase 1 — Repo surgery
- Gradually migrate runtime code into `/apps`, `/services`, `/packages`.
- Preserve provenance and legacy aliases (`hanna` -> `hana` compatibility).

## Phase 2 — Canon + curriculum hard lock
- Expand module-level vocab/phrases/prompts/mastery thresholds.
- Add glossary and misconception pages into `content/wiki`.

## Phase 3 — Backend scaffold
- Stand up `services/hana-core`, scheduler, learner profile, wiki writes, mastery engine.
- Introduce first migration set aligned to `synthia/schema.sql`.

## Phase 4 — Frontend scaffold
- Consent gate, onboarding, lesson, conversation, dashboard, admin surfaces.

## Phase 5 — Voice + examiner integrations
- Add voice adapter interface and baseline provider implementation.
- Add oral/listening tasks and integrity consent paths.

## Phase 6 — Story unlock live wiring
- Bind story pages and issue beats to mastery + retention evidence.
