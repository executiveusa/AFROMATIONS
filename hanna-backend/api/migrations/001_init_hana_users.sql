-- HANA Dashboard: Users & Authentication Schema
-- Phase 2: Database Foundation

-- ============================================================
-- hana_users — User accounts and profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free', -- free, pro, premium
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, deleted
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_hana_users_email ON hana_users(email);
CREATE INDEX idx_hana_users_status ON hana_users(status);
CREATE INDEX idx_hana_users_created_at ON hana_users(created_at DESC);

-- ============================================================
-- hana_user_preferences — User settings and customizations
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES hana_users(id) ON DELETE CASCADE,
  theme VARCHAR(50) NOT NULL DEFAULT 'dark', -- dark, light
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  daily_reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  daily_reminder_time TIME,
  timezone VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_user_preferences_user_id ON hana_user_preferences(user_id);

-- ============================================================
-- hana_audit_log — Login and activity tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, register, password_change, etc
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_audit_log_user_id ON hana_audit_log(user_id);
CREATE INDEX idx_hana_audit_log_action ON hana_audit_log(action);
CREATE INDEX idx_hana_audit_log_timestamp ON hana_audit_log(timestamp DESC);

-- ============================================================
-- hana_affirmations — Affirmation library
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- health, career, relationships, confidence, creativity
  is_generated BOOLEAN NOT NULL DEFAULT false,
  source VARCHAR(50), -- manual, nim_generated, shared
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_affirmations_user_id ON hana_affirmations(user_id);
CREATE INDEX idx_hana_affirmations_category ON hana_affirmations(user_id, category);
CREATE INDEX idx_hana_affirmations_created_at ON hana_affirmations(user_id, created_at DESC);
CREATE INDEX idx_hana_affirmations_is_generated ON hana_affirmations(is_generated);

-- ============================================================
-- hana_affirmation_likes — Affirmation favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_affirmation_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affirmation_id UUID NOT NULL REFERENCES hana_affirmations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(affirmation_id, user_id)
);

CREATE INDEX idx_hana_affirmation_likes_affirmation_id ON hana_affirmation_likes(affirmation_id);
CREATE INDEX idx_hana_affirmation_likes_user_id ON hana_affirmation_likes(user_id);

-- ============================================================
-- hana_affirmation_sessions — User affirmation practice sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_affirmation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  affirmation_ids TEXT NOT NULL, -- JSON array of UUIDs
  duration INTEGER NOT NULL, -- seconds
  mood_before VARCHAR(100),
  mood_after VARCHAR(100),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_affirmation_sessions_user_id ON hana_affirmation_sessions(user_id);
CREATE INDEX idx_hana_affirmation_sessions_created_at ON hana_affirmation_sessions(user_id, created_at DESC);

-- ============================================================
-- hana_chat_messages — HANA chat conversation history
-- ============================================================
CREATE TABLE IF NOT EXISTS hana_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES hana_users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  context JSONB, -- {category?, affirmation_id?, mood?, ...}
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hana_chat_messages_user_id ON hana_chat_messages(user_id);
CREATE INDEX idx_hana_chat_messages_created_at ON hana_chat_messages(user_id, created_at DESC);
CREATE INDEX idx_hana_chat_messages_role ON hana_chat_messages(role);

-- ============================================================
-- Post-migration checks
-- ============================================================
-- Verify all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'hana_%'
ORDER BY table_name;
