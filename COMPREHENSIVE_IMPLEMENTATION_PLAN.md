# HANA Backend + Frontend Integration Plan
**Date:** 2026-05-29  
**Status:** Ready to Execute  
**Scope:** Phase 2-3 Implementation, Testing, and Frontend Integration

---

## 📊 Current State Assessment

### ✅ What's Complete
- **Phase 1 Code:** NIM client, auth routes, affirmations CRUD (merged to main)
- **Database Schema:** 14 tables with migrations ready in `hanna-backend/api/migrations/`
- **Documentation:** 4 comprehensive guides (Phase 2, Phase 3, progress tracking, session summary)
- **Frontend:** Already has store, academy, social purpose, donation pages live
- **Master Plan:** Strategic overview, implementation log, agent decision checklist

### ⏳ What's Blocked
- **Database Deployment:** Migrations exist but not run in Supabase yet
- **Phase 1 Testing:** Routes built but untested against live database
- **Phase 3 Implementation:** Fully spec'd but not coded (stats, notifications, chat)
- **Frontend Auth Integration:** Backend auth exists, frontend doesn't use it yet
- **Copy/Content:** Other agents have updated copy - need to sync

### ⚠️ Risk Areas
- **Multi-agent coordination:** Multiple agents working on copy (need to sync)
- **Database state unknown:** Don't know if migrations are deployed
- **API secrets:** Cloudflare secrets may or may not be set
- **NIM integration:** Haven't tested if NIM free tier is accessible

---

## 🎯 Implementation Plan

### Phase A: Verification & Setup (2 hours)

**A1. Verify Supabase Database Status** (15 min)
```bash
# Check if tables exist
SUPABASE_URL="YOUR_URL" \
SUPABASE_KEY="YOUR_KEY" \
curl -X GET "$SUPABASE_URL/rest/v1/hana_users?limit=1" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY"

# Expected: 200 OK (tables exist) or 404 (need deployment)
```
**Outcome:** Know if migrations are deployed

**A2. Deploy Phase 2 Database if Needed** (30 min)
- If no tables: Run both migration files in Supabase SQL Editor
- If tables exist: Verify schema matches `001_*.sql` and `002_*.sql`
- Verify indexes exist: `SELECT * FROM pg_stat_user_indexes;`

**A3. Verify API Secrets** (15 min)
```bash
cd hanna-backend/api
npx wrangler secret list 2>/dev/null || echo "No secrets set"
```
**Expected:** SUPABASE_URL, SUPABASE_SERVICE_KEY set

**A4. Test NIM Accessibility** (15 min)
```bash
curl -X POST http://31.220.58.212:8082/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonshotai/kimi-k2-thinking",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```
**Expected:** 200 OK with token count

---

### Phase B: Phase 1 Testing (3 hours)

**B1. Build & Run Backend**
```bash
cd hanna-backend/api
npm install
npm run dev
# Runs on http://localhost:8787
```

**B2. Test Auth Endpoints** (30 min)
```bash
# Test 1: Register
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123","displayName":"Test"}'
# Expected: 201 with tokens

# Test 2: Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure123"}'
# Expected: 200 with tokens

# Test 3: Check auth status
curl http://localhost:8787/api/auth/status
# Expected: 200 with NIM status
```

**B3. Test Affirmations Endpoints** (45 min)
```bash
TOKEN="<from-login-response>"

# Test: Generate affirmations
curl -X POST http://localhost:8787/api/affirmations/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "health",
    "context": "Starting new fitness routine, feeling uncertain",
    "mood": "anxious",
    "count": 3
  }'
# Expected: 200 with 3 affirmations from NIM

# Test: List affirmations
curl "http://localhost:8787/api/affirmations?limit=10" \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 with list of user's affirmations

# Test: Like affirmation
curl -X POST "http://localhost:8787/api/affirmations/<id>/like" \
  -H "Authorization: Bearer $TOKEN"
# Expected: 201 (liked)
```

**B4. Verify Database Writes** (45 min)
In Supabase SQL Editor:
```sql
-- Check user created
SELECT id, email, display_name FROM hana_users WHERE email='test@example.com';

-- Check affirmations generated
SELECT id, content, category, is_generated FROM hana_affirmations 
WHERE user_id = '<user-id-from-above>' LIMIT 10;

-- Check likes recorded
SELECT affirmation_id, user_id FROM hana_affirmation_likes 
WHERE user_id = '<user-id>';
```

**Success Criteria:**
- ✅ All endpoints return 200/201 status
- ✅ NIM generates real affirmations
- ✅ Data persists in Supabase
- ✅ Auth tokens work correctly

---

### Phase C: Phase 3 Implementation (5 hours)

**C1. Stats API** (2 hours)
- Implement: GET /api/dashboard/stats, /progress, /recent-sessions, /favorites
- Update: hana_user_stats on every session completion
- Test: Verify stats calculation accuracy

**C2. Notifications API** (1.5 hours)
- Implement: GET /notifications, PATCH /read, /read-all, DELETE
- Create: Notification generation on achievements
- Test: Verify auto-generation triggers

**C3. HANA Chat API** (1.5 hours)
- Implement: POST /hana-chat/message (with user context)
- Implement: GET /history, DELETE /history
- Test: Verify personalization works

Files to create:
- `hanna-backend/api/src/routes/stats.ts` (new)
- `hanna-backend/api/src/routes/notifications.ts` (new)
- `hanna-backend/api/src/routes/hana-chat.ts` (new)
- Update: `hanna-backend/api/src/index.ts` (wire up routes)

---

### Phase D: Frontend Integration (4 hours)

**D1. Create Auth Context** (1 hour)
```typescript
// afromations-frontend/src/lib/auth-context.tsx
- Login hook
- Logout hook
- Get current token
- Refresh token logic
```

**D2. Build Dashboard Pages** (2 hours)
```
afromations-frontend/src/app/dashboard/
├── page.tsx (main dashboard)
├── affirmations/
│   ├── page.tsx (library)
│   └── generate/page.tsx (generator)
├── sessions/
│   └── page.tsx (history)
└── settings/
    └── page.tsx (user prefs)
```

**D3. Integrate Chat Widget** (1 hour)
- Floating chat component
- WebSocket or polling to /api/hana-chat/message
- Display user's affirmation context

---

### Phase E: Testing & Cleanup (4 hours)

**E1. End-to-End Testing** (2 hours)
- User signup → login → generate affirmations → view stats → chat with HANA
- Verify all data flows correctly
- Test on mobile

**E2. Code Review & Cleanup** (1 hour)
- Remove any debug logging
- Fix type errors
- Verify error handling

**E3. Performance Testing** (1 hour)
- Load test NIM (40 req/min limit)
- Database query performance
- Frontend load times

---

## 📋 Detailed Task List

### Pre-Phase A: Sync Copy Changes
- [ ] Check what other models changed in copy
- [ ] Review frontend copy files for changes
- [ ] Merge copy updates if needed

### Phase A: Verification
- [ ] A1 - Check Supabase table status
- [ ] A2 - Deploy migrations if needed (else verify schema)
- [ ] A3 - Verify Cloudflare secrets set
- [ ] A4 - Test NIM free tier accessibility

### Phase B: Phase 1 Testing
- [ ] B1 - Build and run backend locally
- [ ] B2 - Test all auth endpoints (register, login, refresh, status)
- [ ] B3 - Test all affirmations endpoints (CRUD, generate, like)
- [ ] B4 - Verify database writes via Supabase SQL

### Phase C: Phase 3 Implementation
- [ ] C1 - Implement stats routes (4 endpoints)
- [ ] C2 - Implement notifications routes (4 endpoints)
- [ ] C3 - Implement HANA chat routes (3 endpoints)
- [ ] Wire up all routes in index.ts
- [ ] Test each endpoint set

### Phase D: Frontend Integration
- [ ] D1 - Create auth context and hooks
- [ ] D2 - Build dashboard pages (stats, affirmations, sessions, settings)
- [ ] D3 - Build floating chat widget
- [ ] D4 - Connect all frontend pages to backend APIs

### Phase E: Testing & Cleanup
- [ ] E1 - End-to-end user flow testing
- [ ] E2 - Code review and cleanup
- [ ] E3 - Performance testing under load

---

## ⚙️ Environment & Secrets Needed

### Cloudflare (wrangler secret put)
```
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_KEY=[service-role-key]
NIM_BASE_URL=http://31.220.58.212:8082
NIM_MODEL=moonshotai/kimi-k2-thinking
NIM_RATE_LIMIT=40
```

### Supabase
- Project must be created
- Tables must be migrated (001 then 002)
- RLS policies should be enabled

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8787  # or deployed URL
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 📊 Success Metrics

### Phase A: Verification
- ✅ Database tables exist or deployed successfully
- ✅ API secrets configured in Cloudflare
- ✅ NIM free tier is accessible

### Phase B: Phase 1 Testing
- ✅ All 14 Phase 1 endpoints tested
- ✅ Auth tokens work correctly
- ✅ NIM generates affirmations
- ✅ Data persists in Supabase

### Phase C: Phase 3 Implementation
- ✅ Stats API returns user metrics
- ✅ Notifications auto-generate on achievements
- ✅ HANA chat responds with user context

### Phase D: Frontend Integration
- ✅ Dashboard pages display real data
- ✅ Auth flow works end-to-end
- ✅ Chat widget displays messages

### Phase E: Testing & Cleanup
- ✅ Full user journey tested on mobile
- ✅ Performance acceptable (< 200ms latency)
- ✅ Code is clean and production-ready

---

## ⚡ Parallel Work Opportunities

**Can be done in parallel:**
- Phase B testing (B1-B4) - independent
- Phase C implementation (C1-C3) - independent
- Copy syncing - independent

**Must be sequential:**
- Phase A → Phase B (need working database first)
- Phase B → Phase C (need working Phase 1 first)
- Phase C → Phase D (need working APIs first)

---

## 🚨 Known Unknowns

1. **Database state:** Are migrations deployed to Supabase? (A1 will verify)
2. **API secrets:** Which secrets are set? (A3 will verify)
3. **NIM access:** Is the free tier endpoint accessible? (A4 will verify)
4. **Copy changes:** What exactly did other models change? (Need to review)
5. **Frontend APIs:** Are frontend API routes already wired to backend? (B4 will show)

---

## 📈 Timeline Estimate

- Phase A: 2 hours
- Phase B: 3 hours
- Phase C: 5 hours
- Phase D: 4 hours
- Phase E: 4 hours
- **Total: ~18 hours of development**

**With parallel work: ~12-14 hours real time**

---

## 🎬 Next Steps

1. Run Phase A verification to understand actual state
2. Deploy Phase 2 if needed
3. Start Phase B testing immediately
4. Implement Phase C while testing Phase B
5. Build frontend integration in Phase D
6. Final testing and cleanup in Phase E

**Ready to start Phase A?**
