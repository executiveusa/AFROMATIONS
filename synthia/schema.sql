-- ============================================================
-- SYNTHIA™ 3.0 Backend Schema
-- Kupuri Media™ × Akash Engine
-- Self-hosted Supabase: 31.220.58.212:5434
-- Target DB: second_brain (or postgres public schema)
-- Apply via: Supabase Studio SQL editor at http://31.220.58.212:3001
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ============================================================
-- STOCK 1: Projects — every client/site being designed or migrated
-- ============================================================
create table if not exists synthia_projects (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text unique not null,
  url             text,
  project_type    text not null default 'wordpress_migration',
  -- project_type: wordpress_migration | new_build | redesign | afromations | agent_system
  status          text not null default 'active',
  -- status: active | paused | completed | archived
  owner_id        uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  metadata        jsonb not null default '{}'::jsonb
);

create index if not exists synthia_projects_slug_idx on synthia_projects (slug);
create index if not exists synthia_projects_status_idx on synthia_projects (status);

-- ============================================================
-- STOCK 2: UDEC Audit Scores — 14-axis frontend quality scores
-- ============================================================
create table if not exists synthia_udec_audits (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references synthia_projects(id) on delete cascade,
  audited_url     text not null,
  overall_score   numeric(4,2) not null check (overall_score >= 0 and overall_score <= 10),
  passes_floor    boolean generated always as (overall_score >= 8.5) stored,
  -- 14 UDEC axes
  axis_acc        numeric(4,2),  -- Authentic Copy & Clarity
  axis_brn        numeric(4,2),  -- Brand Integrity
  axis_cmp        numeric(4,2),  -- Component Discipline
  axis_clr        numeric(4,2),  -- Color Harmony
  axis_typ        numeric(4,2),  -- Typography
  axis_spc        numeric(4,2),  -- Spacing & Rhythm
  axis_mtn        numeric(4,2),  -- Motion & Feedback
  axis_rsp        numeric(4,2),  -- Responsive Behavior
  axis_acc2       numeric(4,2),  -- Accessibility
  axis_prf        numeric(4,2),  -- Performance Perception
  axis_trst       numeric(4,2),  -- Trust Signals
  axis_frm        numeric(4,2),  -- Form Usability
  axis_nav        numeric(4,2),  -- Navigation Logic
  axis_cta        numeric(4,2),  -- CTA Effectiveness
  violations      jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  agent_notes     text,
  iteration       integer not null default 1,
  created_at      timestamptz not null default now()
);

create index if not exists synthia_udec_project_idx on synthia_udec_audits (project_id);
create index if not exists synthia_udec_score_idx on synthia_udec_audits (overall_score);

-- ============================================================
-- STOCK 3: Systems Architecture Scores — 12-axis Meadows scoring
-- ============================================================
create table if not exists synthia_arch_scores (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references synthia_projects(id) on delete cascade,
  system_name     text not null,
  description     text,
  overall_score   numeric(4,2) not null check (overall_score >= 0 and overall_score <= 10),
  passes_floor    boolean generated always as (overall_score >= 8.5) stored,
  -- 12 Meadows axes
  stk             numeric(4,2),  -- Stock Integrity (10%)
  flw             numeric(4,2),  -- Flow Balance (8%)
  fbk             numeric(4,2),  -- Feedback Completeness (12%)
  dly             numeric(4,2),  -- Delay Awareness (8%)
  lvr             numeric(4,2),  -- Leverage Alignment (10%)
  rsl             numeric(4,2),  -- Resilience Design (10%)
  vis             numeric(4,2),  -- Information Visibility (8%)
  agt             numeric(4,2),  -- Agent Scope Discipline (10%)
  blr             numeric(4,2),  -- Blast Radius Control (8%)
  lrn             numeric(4,2),  -- Learning Compound (8%)
  sec             numeric(4,2),  -- Secret Safety (4%)
  doc             numeric(4,2),  -- Documentation Sufficiency (4%)
  stocks          jsonb not null default '[]'::jsonb,
  flows           jsonb not null default '[]'::jsonb,
  feedback_loops  jsonb not null default '[]'::jsonb,
  leverage_points jsonb not null default '[]'::jsonb,
  anti_patterns   jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists synthia_arch_project_idx on synthia_arch_scores (project_id);

-- ============================================================
-- STOCK 4: Migrations — WordPress to Astro/Next.js pipeline state
-- ============================================================
create table if not exists synthia_migrations (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references synthia_projects(id) on delete cascade,
  source_url      text not null,
  source_type     text not null default 'wordpress',
  target_type     text not null default 'astro',
  -- target_type: astro | nextjs | svelte | html
  status          text not null default 'queued',
  -- status: queued | scanning | auditing | rewriting | building | deploying | complete | failed
  pre_score       numeric(4,2),
  post_score      numeric(4,2),
  preview_url     text,
  api_cost_usd    numeric(8,4),
  duration_sec    integer,
  pass_count      jsonb not null default '{}'::jsonb,   -- {step: count}
  error_log       jsonb not null default '[]'::jsonb,
  output_spec     jsonb,                                  -- spec file for Claude Code
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists synthia_migrations_project_idx on synthia_migrations (project_id);
create index if not exists synthia_migrations_status_idx on synthia_migrations (status);

-- ============================================================
-- STOCK 5: Patterns — learned patterns from migrations (reinforcing loop)
-- ============================================================
create table if not exists synthia_patterns (
  id              uuid primary key default uuid_generate_v4(),
  pattern_type    text not null,
  -- pattern_type: violation | fix | copy_rewrite | component | layout | architecture
  category        text not null,
  -- e.g. 'glassmorphism', 'pill_overload', 'god_class', 'hero_section_dashboard'
  title           text not null,
  description     text not null,
  before_example  text,
  after_example   text,
  udec_axes       jsonb not null default '[]'::jsonb,   -- which UDEC axes it affects
  arch_axes       jsonb not null default '[]'::jsonb,   -- which Meadows axes it affects
  occurrence_count integer not null default 1,
  score_impact    numeric(4,2) not null default 0,      -- avg score improvement from fix
  project_sources jsonb not null default '[]'::jsonb,   -- project_ids that contributed this pattern
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists synthia_patterns_type_idx on synthia_patterns (pattern_type);
create index if not exists synthia_patterns_category_idx on synthia_patterns (category);
create index if not exists synthia_patterns_text_idx on synthia_patterns using gin(to_tsvector('english', title || ' ' || description));

-- ============================================================
-- STOCK 6: Agent Beads — task tracking (ZTE/Beads protocol)
-- ============================================================
create table if not exists synthia_beads (
  id              uuid primary key default uuid_generate_v4(),
  bead_id         text unique not null,    -- e.g. SYN-LANE-ARCH-001
  project_id      uuid references synthia_projects(id),
  title           text not null,
  description     text,
  status          text not null default 'not_started',
  -- status: not_started | in_progress | completed | blocked | cancelled
  bead_type       text not null default 'task',
  -- bead_type: arch | feat | fix | feedback | circuit | refactor | docs | perf | security
  meadows_leverage_point integer,  -- 1-12, from most to least powerful
  parent_bead_id  text references synthia_beads(bead_id),
  parallel_group  integer,
  assigned_agent  text,
  api_cost_usd    numeric(8,4),
  score_before    numeric(4,2),
  score_after     numeric(4,2),
  completion_json jsonb,           -- machine-readable handoff for zero-context agents
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists synthia_beads_project_idx on synthia_beads (project_id);
create index if not exists synthia_beads_status_idx on synthia_beads (status);

-- ============================================================
-- STOCK 7: Circuit Breaker Log — blast radius and cost guard events
-- ============================================================
create table if not exists synthia_circuit_events (
  id              uuid primary key default uuid_generate_v4(),
  event_type      text not null,
  -- event_type: blast_radius | cost_guard | iteration_limit | quality_floor | secret_leak
  severity        text not null default 'warning',
  -- severity: info | warning | halt | critical
  project_id      uuid references synthia_projects(id),
  bead_id         text references synthia_beads(bead_id),
  triggered_by    text,
  context         jsonb not null default '{}'::jsonb,
  resolved        boolean not null default false,
  resolved_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists synthia_circuit_severity_idx on synthia_circuit_events (severity);
create index if not exists synthia_circuit_resolved_idx on synthia_circuit_events (resolved);

-- ============================================================
-- STOCK 8: AFROMATIONS-specific — brand & content entities
-- ============================================================
create table if not exists afromations_content (
  id              uuid primary key default uuid_generate_v4(),
  content_type    text not null,
  -- content_type: affirmation | story | character | campaign | animation_brief | grant
  title           text not null,
  body            text,
  metadata        jsonb not null default '{}'::jsonb,
  tags            text[] not null default '{}',
  status          text not null default 'draft',
  -- status: draft | review | approved | published | archived
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists afromations_content_type_idx on afromations_content (content_type);
create index if not exists afromations_content_tags_idx on afromations_content using gin(tags);
create index if not exists afromations_content_text_idx on afromations_content using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,'')));

-- ============================================================
-- STOCK 9: Agent Memory — persistent context across sessions
-- ============================================================
create table if not exists synthia_memory (
  id              uuid primary key default uuid_generate_v4(),
  scope           text not null default 'global',
  -- scope: global | project | session | agent
  scope_id        text,    -- project slug, session id, or agent name
  memory_type     text not null,
  -- memory_type: fact | decision | pattern | preference | instruction
  key             text not null,
  value           text not null,
  embedding       vector(1536),  -- for semantic search (requires pgvector extension)
  source          text,
  confidence      numeric(3,2) not null default 1.0 check (confidence >= 0 and confidence <= 1),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  expires_at      timestamptz,
  unique(scope, scope_id, key)
);

create index if not exists synthia_memory_scope_idx on synthia_memory (scope, scope_id);
create index if not exists synthia_memory_key_idx on synthia_memory (key);
create index if not exists synthia_memory_text_idx on synthia_memory using gin(to_tsvector('english', key || ' ' || value));

-- ============================================================
-- FLOWS: Updated_at triggers
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger synthia_projects_updated_at
  before update on synthia_projects
  for each row execute function update_updated_at_column();

create or replace trigger synthia_patterns_updated_at
  before update on synthia_patterns
  for each row execute function update_updated_at_column();

create or replace trigger synthia_beads_updated_at
  before update on synthia_beads
  for each row execute function update_updated_at_column();

create or replace trigger afromations_content_updated_at
  before update on afromations_content
  for each row execute function update_updated_at_column();

create or replace trigger synthia_memory_updated_at
  before update on synthia_memory
  for each row execute function update_updated_at_column();

-- ============================================================
-- FEEDBACK LOOP: Quality gate — log when score drops below 8.5
-- ============================================================
create or replace function synthia_quality_gate()
returns trigger as $$
begin
  if new.overall_score < 8.5 then
    insert into synthia_circuit_events (
      event_type, severity, project_id, context
    ) values (
      'quality_floor',
      case when new.overall_score < 7.0 then 'halt' else 'warning' end,
      new.project_id,
      jsonb_build_object(
        'score', new.overall_score,
        'table', tg_table_name,
        'record_id', new.id
      )
    );
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger synthia_udec_quality_gate
  after insert or update on synthia_udec_audits
  for each row execute function synthia_quality_gate();

create or replace trigger synthia_arch_quality_gate
  after insert or update on synthia_arch_scores
  for each row execute function synthia_quality_gate();

-- ============================================================
-- LEARNING LOOP: Increment pattern occurrence when referenced
-- ============================================================
create or replace function synthia_update_pattern_count()
returns trigger as $$
begin
  if jsonb_array_length(new.violations) > 0 then
    -- update pattern occurrence counts for known patterns
    update synthia_patterns
    set occurrence_count = occurrence_count + 1,
        updated_at = now()
    where category = any(
      select jsonb_array_elements_text(new.violations -> category)
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- CIRCUIT BREAKER: Cost guard — halt if daily API spend > $50
-- ============================================================
create or replace function synthia_cost_guard()
returns trigger as $$
declare
  daily_total numeric;
begin
  if new.api_cost_usd is not null and new.api_cost_usd > 10 then
    insert into synthia_circuit_events (event_type, severity, context)
    values (
      'cost_guard', 'warning',
      jsonb_build_object('bead_cost', new.api_cost_usd, 'bead_id', new.bead_id)
    );
  end if;
  
  select coalesce(sum(api_cost_usd), 0)
  into daily_total
  from synthia_beads
  where created_at >= date_trunc('day', now())
    and api_cost_usd is not null;
    
  if daily_total > 50 then
    insert into synthia_circuit_events (event_type, severity, context)
    values (
      'cost_guard', 'halt',
      jsonb_build_object('daily_total', daily_total, 'threshold', 50)
    );
  end if;
  
  return new;
end;
$$ language plpgsql;

create or replace trigger synthia_bead_cost_guard
  after insert or update on synthia_beads
  for each row execute function synthia_cost_guard();

-- ============================================================
-- SEED: AFROMATIONS project
-- ============================================================
insert into synthia_projects (name, slug, url, project_type, status, metadata)
values (
  'Afromation Studios',
  'afromations',
  'https://afromation-studios.vercel.app',
  'afromations',
  'active',
  '{"description": "Afro-positive affirmation content studio — animation, web, brand", "tags": ["animation", "brand", "web", "afroculture"]}'::jsonb
) on conflict (slug) do nothing;

-- SEED: Core SYNTHIA patterns (known anti-patterns to detect)
insert into synthia_patterns (pattern_type, category, title, description, udec_axes, score_impact)
values
  ('violation', 'glassmorphism', 'Glassmorphism overuse', 'backdrop-filter + translucent cards creating visual noise instead of clarity', '["clr","cmp","brn"]', -2.5),
  ('violation', 'pill_overload', 'Pill badge saturation', 'More than 3 pill-shaped tagged elements per viewport creating visual confusion', '["cmp","spc"]', -1.5),
  ('violation', 'gradient_abuse', 'Gradient abuse', 'Decorative gradients used on more than 2 elements per section with no purpose', '["clr","brn"]', -2.0),
  ('violation', 'hero_in_dashboard', 'Hero section inside dashboard', 'Marketing-style hero with large illustration inside an authenticated app shell', '["cmp","nav"]', -3.0),
  ('violation', 'god_class', 'God class agent handler', 'Single service handler with 3+ unrelated domains accumulating over time', '[]', -3.5),
  ('violation', 'polling_loop', 'Polling loop instead of webhook', 'Fixed-interval polling where webhook subscription is available', '[]', -2.0),
  ('fix', 'glassmorphism', 'Replace glass with solid surface', 'Use solid background with subtle border and shadow instead of backdrop-filter', '["clr","cmp","brn"]', 2.5),
  ('fix', 'god_class', 'Decompose into domain services', 'Split into single-responsibility handlers composed via dependency injection', '[]', 3.5)
on conflict do nothing;

-- ============================================================
-- Row Level Security (enable but allow service role full access)
-- ============================================================
alter table synthia_projects enable row level security;
alter table synthia_udec_audits enable row level security;
alter table synthia_arch_scores enable row level security;
alter table synthia_migrations enable row level security;
alter table synthia_patterns enable row level security;
alter table synthia_beads enable row level security;
alter table synthia_circuit_events enable row level security;
alter table afromations_content enable row level security;
alter table synthia_memory enable row level security;

-- Service role bypass (Synthia agents use service role key)
create policy "service_role_all" on synthia_projects for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_udec_audits for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_arch_scores for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_migrations for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_patterns for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_beads for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_circuit_events for all using (auth.role() = 'service_role');
create policy "service_role_all" on afromations_content for all using (auth.role() = 'service_role');
create policy "service_role_all" on synthia_memory for all using (auth.role() = 'service_role');
