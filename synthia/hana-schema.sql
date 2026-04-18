-- ============================================================
-- HANA Learning OS — Complete Schema
-- Agent Hana: Japanese Language + Culture Companion
-- Persistent Wiki, Graph Memory, Mastery Engine, Manga Unlocks
-- ============================================================

-- Extension: pgvector for semantic memory (if not already enabled)
create extension if not exists "pgvector" with schema extensions;

-- ============================================================
-- STOCK 1: Hana Learners — 21+ verified, consent-gated
-- ============================================================
create table if not exists hana_learners (
  id                uuid primary key default uuid_generate_v4(),
  email             text not null unique,
  display_name      text,
  birth_date        date,  -- required for 21+ verification
  age_verified      boolean not null default false,
  age_verified_at   timestamptz,
  native_language   text default 'en',
  daily_goal_minutes integer default 15,
  timezone          text default 'UTC',
  subscription_tier text default 'free',  -- free | premium | scholar
  joined_at         timestamptz not null default now(),
  last_active_at    timestamptz,
  status            text not null default 'active',
  -- status: active | paused | archived | banned
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists hana_learners_email_idx on hana_learners (email);
create index if not exists hana_learners_status_idx on hana_learners (status);
create index if not exists hana_learners_verified_idx on hana_learners (age_verified);

-- ============================================================
-- STOCK 2: Hana Consent Log — explicit consent records
-- ============================================================
create table if not exists hana_consent_log (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  consent_type      text not null,
  -- consent_type: age_verification | voice_input | memory_retention | vision_assessment | terms_of_service
  granted           boolean not null,
  version           text,  -- version of ToS/policy consented to
  ip_address        text,
  user_agent        text,
  notes             text,
  created_at        timestamptz not null default now()
);

create index if not exists hana_consent_learner_idx on hana_consent_log (learner_id);
create index if not exists hana_consent_type_idx on hana_consent_log (consent_type);

-- ============================================================
-- STOCK 3: Hana Wiki Entries — Japanese culture/language reference
-- ============================================================
create table if not exists hana_wiki_entries (
  id                uuid primary key default uuid_generate_v4(),
  category          text not null,
  -- category: kanji | vocab | grammar | culture | folklore | mythology | yokai | kami | yurei | mononoke | tsukumogami | hyakki_yagyo | shichifukujin | festival | food | place | household_kami
  japanese          text not null,
  reading           text,  -- furigana/romaji
  english           text not null,
  notes             text,
  etymology         text,  -- origin and meaning history
  source            text,  -- where this comes from (anime, manga, historical text, folklore)
  difficulty        text default 'intermediate',
  -- difficulty: n5 (beginner) | n4 | n3 | n2 | n1 | advanced | myth (mythological/cultural)
  tags              text[] default '{}',
  related_ids       uuid[] default '{}',  -- related wiki entries
  media_url         text,  -- image or audio
  source_citation   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists hana_wiki_category_idx on hana_wiki_entries (category);
create index if not exists hana_wiki_difficulty_idx on hana_wiki_entries (difficulty);
create index if not exists hana_wiki_text_idx on hana_wiki_entries using gin(to_tsvector('english', coalesce(japanese,'') || ' ' || coalesce(english,'')));

-- ============================================================
-- STOCK 4: Hana Lessons — curriculum content
-- ============================================================
create table if not exists hana_lessons (
  id                uuid primary key default uuid_generate_v4(),
  title_ja          text not null,
  title_en          text not null,
  lesson_type       text not null,
  -- lesson_type: vocabulary | grammar | culture | folklore | conversation | listening | speaking | reading | writing
  difficulty        text not null default 'n5',
  -- difficulty: n5 | n4 | n3 | n2 | n1 | advanced
  domain            text not null,
  -- domain: daily_life | folklore | mythology | anime_culture | food_culture | street_etiquette | professional | seasonal | household_kami | yokai_lore
  content           jsonb not null,  -- { sentences: [{ja, en, audio_url}], vocab: [{word, reading, meaning}], grammar_points: [...] }
  learning_objectives text[] default '{}',
  prerequisites     uuid[] default '{}',  -- lesson_ids that should be done first
  estimated_duration_minutes integer default 15,
  mastery_threshold numeric(4,2) default 0.80,  -- 80% required to pass
  cover_image_url   text,
  status            text default 'published',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists hana_lessons_type_idx on hana_lessons (lesson_type);
create index if not exists hana_lessons_domain_idx on hana_lessons (domain);
create index if not exists hana_lessons_difficulty_idx on hana_lessons (difficulty);

-- ============================================================
-- STOCK 5: Hana Sessions — learning activity tracking
-- ============================================================
create table if not exists hana_sessions (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  lesson_id         uuid references hana_lessons(id) on delete set null,
  session_type      text not null,
  -- session_type: lesson | assessment | conversation | manga_reading | wiki_browse
  domain            text,
  started_at        timestamptz not null default now(),
  ended_at          timestamptz,
  duration_seconds  integer,
  lesson_count      integer default 1,
  words_reviewed    integer default 0,
  score             numeric(4,2),
  notes             text,
  metadata          jsonb default '{}'::jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists hana_sessions_learner_idx on hana_sessions (learner_id);
create index if not exists hana_sessions_lesson_idx on hana_sessions (lesson_id);

-- ============================================================
-- STOCK 6: Hana Progress — learner progress per lesson
-- ============================================================
create table if not exists hana_progress (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  lesson_id         uuid not null references hana_lessons(id) on delete cascade,
  attempts          integer default 1,
  last_score        numeric(4,2),
  best_score        numeric(4,2),
  mastered          boolean default false,
  mastered_at       timestamptz,
  last_attempted_at timestamptz default now(),
  streak_days       integer default 0,
  metadata          jsonb default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(learner_id, lesson_id)
);

create index if not exists hana_progress_learner_idx on hana_progress (learner_id);
create index if not exists hana_progress_mastered_idx on hana_progress (mastered);

-- ============================================================
-- STOCK 7: Hana Mastery — domain-level mastery tracking
-- ============================================================
create table if not exists hana_mastery (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  domain            text not null,
  -- domain: daily_life | folklore | mythology | anime_culture | food_culture | street_etiquette | professional | seasonal | household_kami | yokai_lore | overall
  subdomain         text,  -- optional breakdown within domain
  score             numeric(5,2) not null default 0 check (score >= 0 and score <= 100),
  level             text,  -- n5 | n4 | n3 | n2 | n1 | advanced | expert
  evidence_count    integer default 0,  -- number of assessments contributing to this score
  last_tested_at    timestamptz,
  last_improved_at  timestamptz,
  trend             numeric(4,2),  -- score improvement over last 30 days (can be negative)
  metadata          jsonb default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(learner_id, domain, subdomain)
);

create index if not exists hana_mastery_learner_idx on hana_mastery (learner_id);
create index if not exists hana_mastery_domain_idx on hana_mastery (domain);
create index if not exists hana_mastery_score_idx on hana_mastery (score);

-- ============================================================
-- STOCK 8: Hana Assessments — tests and comprehension checks
-- ============================================================
create table if not exists hana_assessments (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  lesson_id         uuid references hana_lessons(id) on delete set null,
  assessment_type   text not null,
  -- assessment_type: oral_production | listening_comprehension | reading_comprehension | writing | cultural_understanding | vocab_recall | grammar_application
  questions         jsonb not null,  -- [{id, type, prompt_ja, prompt_en, expected_answer_pattern, points}]
  learner_answers   jsonb,  -- [{question_id, response_text, audio_url, timestamp}]
  scores            jsonb,  -- [{question_id, score, feedback_ja, feedback_en}]
  overall_score     numeric(4,2),
  passed            boolean,
  duration_seconds  integer,
  completed_at      timestamptz,
  graded_at         timestamptz,
  grader_notes      text,
  created_at        timestamptz not null default now()
);

create index if not exists hana_assessments_learner_idx on hana_assessments (learner_id);
create index if not exists hana_assessments_type_idx on hana_assessments (assessment_type);
create index if not exists hana_assessments_passed_idx on hana_assessments (passed);

-- ============================================================
-- STOCK 9: Hana Manga Issues — locked story content
-- ============================================================
create table if not exists hana_manga_issues (
  id                uuid primary key default uuid_generate_v4(),
  issue_number      integer not null,
  series_name       text default 'Agent Hana Chronicles',
  title_ja          text not null,
  title_en          text not null,
  synopsis_ja       text not null,
  synopsis_en       text not null,
  cover_image_url   text,
  panel_count       integer,
  pages_total       integer,
  read_direction    text default 'rtl',  -- rtl (right-to-left) or ltr
  unlock_requirements jsonb not null,
  -- {domain: score_threshold, ...} e.g. {"yokai_lore": 75, "daily_life": 60}
  status            text default 'available',
  -- status: draft | available | limited | locked_permanently | archived
  era               text,  -- 2056_futuristic | present_day | historical_echo | mythological_time
  publication_date  date,
  content_warnings  text[] default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists hana_manga_issue_idx on hana_manga_issues (issue_number);
create index if not exists hana_manga_status_idx on hana_manga_issues (status);

-- ============================================================
-- STOCK 10: Hana Unlocks — which issues each learner has unlocked
-- ============================================================
create table if not exists hana_unlocks (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  issue_id          uuid not null references hana_manga_issues(id) on delete cascade,
  unlocked_at       timestamptz not null default now(),
  unlock_trigger    text,  -- mastery_achieved | bonus | admin_grant | seasonal_event
  mastery_snapshot  jsonb,  -- snapshot of learner's mastery scores at unlock time
  read_at           timestamptz,
  completed_at      timestamptz,
  metadata          jsonb default '{}'::jsonb,
  unique(learner_id, issue_id)
);

create index if not exists hana_unlocks_learner_idx on hana_unlocks (learner_id);
create index if not exists hana_unlocks_issue_idx on hana_unlocks (issue_id);
create index if not exists hana_unlocks_read_idx on hana_unlocks (read_at);

-- ============================================================
-- STOCK 11: Hana Memory Graph — semantic knowledge graph
-- ============================================================
create table if not exists hana_memory_graph (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  node_type         text not null,
  -- node_type: concept | word | kanji | grammar_point | cultural_reference | character | location | event
  label_ja          text not null,
  label_en          text not null,
  description       text,
  embedding         vector(1536),  -- for semantic search
  strength          numeric(3,2) default 0.5 check (strength >= 0 and strength <= 1),
  -- strength increases with reinforcement (repeated interaction, successful recall)
  last_reinforced_at timestamptz default now(),
  recall_count      integer default 0,
  error_count       integer default 0,
  metadata          jsonb default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists hana_memory_nodes_learner_idx on hana_memory_graph (learner_id);
create index if not exists hana_memory_nodes_type_idx on hana_memory_graph (node_type);

-- ============================================================
-- STOCK 12: Hana Memory Edges — connections between concepts
-- ============================================================
create table if not exists hana_memory_edges (
  id                uuid primary key default uuid_generate_v4(),
  learner_id        uuid not null references hana_learners(id) on delete cascade,
  source_node_id    uuid not null references hana_memory_graph(id) on delete cascade,
  target_node_id    uuid not null references hana_memory_graph(id) on delete cascade,
  relationship      text not null,
  -- relationship: synonym | antonym | causes | is_caused_by | related_to | example_of | instance_of | prerequisite_for | appears_in | describes
  weight            numeric(3,2) default 0.5 check (weight >= 0 and weight <= 1),
  -- weight: strength of association
  reinforcement_count integer default 0,
  last_used_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique(source_node_id, target_node_id, relationship)
);

create index if not exists hana_memory_edges_learner_idx on hana_memory_edges (learner_id);
create index if not exists hana_memory_edges_source_idx on hana_memory_edges (source_node_id);
create index if not exists hana_memory_edges_target_idx on hana_memory_edges (target_node_id);

-- ============================================================
-- FLOWS: Update triggers
-- ============================================================
create or replace function update_hana_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger hana_learners_updated_at before update on hana_learners for each row execute function update_hana_updated_at();
create or replace trigger hana_lessons_updated_at before update on hana_lessons for each row execute function update_hana_updated_at();
create or replace trigger hana_progress_updated_at before update on hana_progress for each row execute function update_hana_updated_at();
create or replace trigger hana_mastery_updated_at before update on hana_mastery for each row execute function update_hana_updated_at();
create or replace trigger hana_wiki_updated_at before update on hana_wiki_entries for each row execute function update_hana_updated_at();
create or replace trigger hana_manga_updated_at before update on hana_manga_issues for each row execute function update_hana_updated_at();
create or replace trigger hana_memory_graph_updated_at before update on hana_memory_graph for each row execute function update_hana_updated_at();
create or replace trigger hana_memory_edges_updated_at before update on hana_memory_edges for each row execute function update_hana_updated_at();

-- ============================================================
-- FEEDBACK LOOP: Update last_active_at on learner when they take any action
-- ============================================================
create or replace function hana_touch_learner_activity()
returns trigger as $$
begin
  update hana_learners set last_active_at = now() where id = new.learner_id;
  return new;
end;
$$ language plpgsql;

create or replace trigger hana_session_touch_activity after insert on hana_sessions for each row execute function hana_touch_learner_activity();
create or replace trigger hana_progress_touch_activity after update on hana_progress for each row execute function hana_touch_learner_activity();
create or replace trigger hana_assessment_touch_activity after insert on hana_assessments for each row execute function hana_touch_learner_activity();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table hana_learners enable row level security;
alter table hana_consent_log enable row level security;
alter table hana_wiki_entries enable row level security;
alter table hana_lessons enable row level security;
alter table hana_sessions enable row level security;
alter table hana_progress enable row level security;
alter table hana_mastery enable row level security;
alter table hana_assessments enable row level security;
alter table hana_manga_issues enable row level security;
alter table hana_unlocks enable row level security;
alter table hana_memory_graph enable row level security;
alter table hana_memory_edges enable row level security;

-- Service role bypass (agents use service role key)
create policy "service_role_all" on hana_learners for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_consent_log for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_wiki_entries for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_lessons for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_sessions for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_progress for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_mastery for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_assessments for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_manga_issues for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_unlocks for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_memory_graph for all using (auth.role() = 'service_role');
create policy "service_role_all" on hana_memory_edges for all using (auth.role() = 'service_role');

-- Public read for wiki entries
create policy "public_read_wiki" on hana_wiki_entries for select using (true);
create policy "public_read_lessons" on hana_lessons for select using (true);
create policy "public_read_manga" on hana_manga_issues for select using (status != 'draft');
