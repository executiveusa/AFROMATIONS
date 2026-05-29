-- HANA Dashboard: Affirmation Library & Sharing Schema
-- Phase 2: Community and Discovery Features

-- ============================================================
-- hana_shared_affirmations — Publicly shared affirmations
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_shared_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affirmation_id UUID NOT NULL REFERENCES hana_affirmations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_token VARCHAR(255) UNIQUE, -- for shareable links
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(affirmation_id, user_id)
);

CREATE INDEX idx_hana_shared_affirmations_affirmation_id ON hana_shared_affirmations(affirmation_id);
CREATE INDEX idx_hana_shared_affirmations_user_id ON hana_shared_affirmations(user_id);
CREATE INDEX idx_hana_shared_affirmations_is_public ON hana_shared_affirmations(is_public);
CREATE INDEX idx_hana_shared_affirmations_share_token ON hana_shared_affirmations(share_token);

-- ============================================================
-- hana_affirmation_library — Community affirmation library
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_affirmation_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- health, career, relationships, confidence, creativity
  description TEXT,
  author_id UUID REFERENCES hana_users(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  use_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_affirmation_library_category ON hana_affirmation_library(category);
CREATE INDEX idx_hana_affirmation_library_is_featured ON hana_affirmation_library(is_featured);
CREATE INDEX idx_hana_affirmation_library_like_count ON hana_affirmation_library(like_count DESC);
CREATE INDEX idx_hana_affirmation_library_created_at ON hana_affirmation_library(created_at DESC);

-- ============================================================
-- hana_library_likes — Community library likes
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_library_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  library_id UUID NOT NULL REFERENCES hana_affirmation_library(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(library_id, user_id)
);

CREATE INDEX idx_hana_library_likes_library_id ON hana_library_likes(library_id);
CREATE INDEX idx_hana_library_likes_user_id ON hana_library_likes(user_id);

-- ============================================================
-- hana_user_stats — User engagement statistics
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES hana_users(id) ON DELETE CASCADE,
  affirmations_created INTEGER NOT NULL DEFAULT 0,
  affirmations_saved INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  total_session_time INTEGER NOT NULL DEFAULT 0, -- seconds
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_session_date DATE,
  mood_improvement_score NUMERIC(5, 2), -- 0.0-10.0
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_user_stats_user_id ON hana_user_stats(user_id);
CREATE INDEX idx_hana_user_stats_streak_days ON hana_user_stats(streak_days DESC);

-- ============================================================
-- hana_notifications — In-app notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- session_reminder, affirmation_shared, achievement_unlocked, etc
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- context-specific data
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_notifications_user_id ON hana_notifications(user_id);
CREATE INDEX idx_hana_notifications_is_read ON hana_notifications(user_id, is_read);
CREATE INDEX idx_hana_notifications_created_at ON hana_notifications(user_id, created_at DESC);

-- ============================================================
-- hana_user_achievements — Badges and milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  achievement_slug VARCHAR(100) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  icon_url TEXT,
  description TEXT,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_slug)
);

CREATE INDEX idx_hana_user_achievements_user_id ON hana_user_achievements(user_id);
CREATE INDEX idx_hana_user_achievements_slug ON hana_user_achievements(achievement_slug);

-- ============================================================
-- hana_feedback — User feedback and suggestions
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES hana_users(id) ON DELETE SET NULL,
  type VARCHAR(100) NOT NULL, -- bug, feature_request, general_feedback
  category VARCHAR(100),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER, -- 1-5 stars
  status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, acknowledged, in_progress, resolved
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_feedback_user_id ON hana_feedback(user_id);
CREATE INDEX idx_hana_feedback_type ON hana_feedback(type);
CREATE INDEX idx_hana_feedback_status ON hana_feedback(status);
CREATE INDEX idx_hana_feedback_created_at ON hana_feedback(created_at DESC);

-- ============================================================
-- Post-migration checks
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'hana_%'
ORDER BY table_name;
