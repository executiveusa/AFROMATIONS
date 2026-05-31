# Phase 2: Database Setup & Supabase Deployment

**Status:** Ready to Deploy  
**Depends On:** Phase 1 (Backend routes) ✅  
**Date:** 2026-05-29

---

## Overview

Phase 2 sets up the Supabase PostgreSQL database with complete schema for user management, affirmations, chat, and community features. Once deployed, the Phase 1 backend routes will work end-to-end.

---

## Files Created

### 1. Database Migrations

**`hanna-backend/api/migrations/001_init_hana_users.sql`**
- Core tables: users, preferences, audit_log
- Affirmations: affirmations, likes, sessions
- Chat: chat_messages
- 8 optimized indexes for performance

**`hanna-backend/api/migrations/002_hana_library_and_sharing.sql`**
- Community: shared_affirmations, library, library_likes
- Engagement: user_stats, notifications, achievements
- Feedback: feedback table
- 6 optimized indexes

---

## Database Tables (14 total)

### Core Tables
- **hana_users** — Account, profile, subscription tier
- **hana_user_preferences** — Settings, theme, notifications
- **hana_audit_log** — Login/activity tracking

### Affirmations
- **hana_affirmations** — User's affirmation library (manual + generated)
- **hana_affirmation_likes** — Favorites/likes tracking
- **hana_affirmation_sessions** — Practice sessions with duration/mood
- **hana_chat_messages** — HANA agent conversation history

### Community
- **hana_shared_affirmations** — Public sharing with view/like counters
- **hana_affirmation_library** — Featured/trending library
- **hana_library_likes** — Community engagement

### Engagement
- **hana_user_stats** — Streak, completion count, mood trends
- **hana_notifications** — In-app alerts
- **hana_user_achievements** — Badges/milestones
- **hana_feedback** — User suggestions and bug reports

---

## Deployment Steps

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select the AFROMATIONS project
3. Navigate to **SQL Editor**

### Step 2: Create Tables (Order Matters)

**First, run Migration 001:**
```sql
-- Copy entire contents of hanna-backend/api/migrations/001_init_hana_users.sql
-- Paste into SQL Editor and Execute
```

**Verify the tables created:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'hana_%'
ORDER BY table_name;
```

Expected output: 7 tables (users, preferences, audit_log, affirmations, likes, sessions, chat_messages)

**Then, run Migration 002:**
```sql
-- Copy entire contents of hanna-backend/api/migrations/002_hana_library_and_sharing.sql
-- Paste into SQL Editor and Execute
```

**Verify all tables:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'hana_%'
ORDER BY table_name;
```

Expected output: 14 tables

### Step 3: Enable RLS (Row-Level Security)

This is important for data isolation:

```sql
-- Enable RLS on all user-scoped tables
ALTER TABLE hana_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_affirmation_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_affirmation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_shared_affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hana_user_achievements ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS)
-- hana_affirmation_library
-- hana_library_likes
-- hana_audit_log (server-only)
-- hana_feedback
```

### Step 4: Create RLS Policies

(Supabase will auto-create basic policies, but you should define explicit ones)

```sql
-- Users can only access their own data
CREATE POLICY "users_select_self" ON hana_users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "users_update_self" ON hana_users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Similar policies for other tables (see Best Practices below)
```

### Step 5: Verify Schema

Run in SQL Editor:
```sql
-- Check all tables exist
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'hana_%';

-- Should return: 14

-- Check sample row structure
\d hana_users
\d hana_affirmations
\d hana_chat_messages
```

---

## Configuration: Environment Variables

### Supabase Credentials

Add to `.env.local` (Cloudflare Workers):

```env
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_SERVICE_KEY=[service-role-key-from-supabase]
```

### Get These Values:

1. **SUPABASE_URL:**
   - Supabase Dashboard → Project Settings → API
   - Copy the "URL" value

2. **SUPABASE_SERVICE_KEY:**
   - Supabase Dashboard → Project Settings → API
   - Under "Project API keys", copy "Service role" (not "anon key")

### Store in Cloudflare:

```bash
# Using wrangler CLI (from hanna-backend/api):
wrangler secret put SUPABASE_URL
# Paste URL and press Ctrl+D

wrangler secret put SUPABASE_SERVICE_KEY
# Paste service key and press Ctrl+D
```

---

## Testing: Manual Database Queries

After schema is deployed, test the backend routes:

### 1. Register User

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "secure123password",
    "displayName": "Test User"
  }'
```

Expected response:
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "displayName": "Test User",
  "accessToken": "base64-token",
  "refreshToken": "base64-refresh",
  "expiresAt": "2026-05-30T14:00:00Z"
}
```

### 2. Check User in Database

In Supabase SQL Editor:
```sql
SELECT id, email, display_name, subscription_tier
FROM hana_users
WHERE email = 'test@example.com';
```

### 3. Login

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "secure123password"
  }'
```

### 4. Generate Affirmation

```bash
curl -X POST http://localhost:8787/api/affirmations/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [accessToken-from-login]" \
  -d '{
    "category": "health",
    "context": "Starting a new fitness routine, feeling uncertain",
    "mood": "anxious",
    "count": 3
  }'
```

---

## Best Practices: Row-Level Security

After tables are created, implement RLS policies to protect user data:

```sql
-- Affirmations: Users can only see/edit their own
CREATE POLICY "affirmations_user_isolation" ON hana_affirmations
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "affirmations_insert_own" ON hana_affirmations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Public library: Everyone can read, only backend inserts
CREATE POLICY "library_public_read" ON hana_affirmation_library
  FOR SELECT USING (true); -- public

-- Shared affirmations: Can read if public OR creator
CREATE POLICY "shared_public_or_creator" ON hana_shared_affirmations
  FOR SELECT USING (
    is_public = true 
    OR auth.uid()::text = user_id::text
  );
```

---

## Troubleshooting

### Problem: "Relation does not exist" when calling backend

**Cause:** Tables haven't been created yet  
**Fix:** Run both migration files in SQL Editor

### Problem: Auth failing with "Table not found"

**Cause:** `hana_users` table not created  
**Fix:** Verify migration 001 ran successfully

### Problem: Slow queries on affirmations

**Cause:** Indexes not created  
**Fix:** Check that all `CREATE INDEX` statements executed

### Problem: Can't find SUPABASE_SERVICE_KEY

**Cause:** Using anon key instead of service role key  
**Fix:** In Supabase Dashboard → Project Settings → API, use "Service role" key, not "anon"

---

## Next Steps After Phase 2

1. **Phase 3 Backend Routes:** Stats, notifications, HANA chat
2. **Phase 3 Frontend:** Auth flows, dashboard pages, components
3. **Phase 4 Deployment:** Test on Vercel + Cloudflare Workers
4. **Phase 5 Launch:** Public beta, monitoring, feedback collection

---

## Files Reference

- **Migrations:** `hanna-backend/api/migrations/001_*.sql`, `002_*.sql`
- **Backend Routes:** `hanna-backend/api/src/routes/auth.ts`, `affirmations.ts`
- **NIM Client:** `hanna-backend/api/src/lib/nim-client.ts`
- **Dashboard Spec:** `HANA_DASHBOARD_SPECIFICATION.md`

---

## Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

**Status:** ✅ Ready for Deployment  
**Estimated Time:** 15 minutes (manual Supabase setup)  
**Next Phase:** Phase 3 (Backend stats/notifications/chat routes)
