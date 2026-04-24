# Graph Architecture (Phase 0)

## Core Graph Domains

### 1) Curriculum Graph
- **Node types:** `lesson`, `vocab`, `phrase`, `assessment_prompt`, `misconception`, `routine_scene`.
- **Edges:**
  - `lesson_prerequisite(lesson -> lesson)`
  - `teaches(lesson -> vocab|phrase)`
  - `tests(assessment_prompt -> lesson)`
  - `targets_scene(lesson -> routine_scene)`
  - `common_misread(lesson -> misconception)`

### 2) Canon/Story Graph
- **Node types:** `character`, `arc`, `issue`, `scene`, `motif`, `location`, `timeline_event`.
- **Edges:**
  - `depends_on(scene -> lesson)` for unlock gating
  - `belongs_to(scene -> issue|arc)`
  - `occurs_in(scene -> location)`
  - `foreshadows(scene -> scene)`

### 3) Learner Mastery Graph
- **Node types:** `learner`, `mastery_state`, `weak_spot`, `session`, `consent_artifact`.
- **Edges:**
  - `has_mastery(learner -> lesson)`
  - `struggles_with(learner -> misconception|vocab)`
  - `completed(learner -> session)`
  - `granted(learner -> consent_artifact)`

## Unlock Rule (v1)
- Story scene unlock requires:
  1. lesson mastery threshold met
  2. prerequisite lesson retention still passing
  3. no unresolved integrity hold flags for examiner mode assessments

## Storage Binding (v1)
- Primary memory substrate: self-hosted Supabase/Postgres/pgvector (`second_brain`) via environment credentials only.
- Graph can be modeled as relational tables + edge tables first; dedicated graph DB is optional future path.
