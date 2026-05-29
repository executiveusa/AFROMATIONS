# AFROMATIONS Backend Implementation Plan
## HANA Agent + NVIDIA NIM + Token Saver Protocol + Operator Dashboard

**Scope:** Backend integration for affirmations engine, free LLM inference, token cost management, and admin dashboard  
**Timeline:** Phase 1 (core) → Phase 2 (dashboard) → Phase 3 (polish)  
**Status:** Planning → Implementation → Testing → Deployment

---

## PHASE 1: Foundation Layer

### 1.1 Token Saver Protocol (Repo-Local)

**Goal:** Embed token-saving rules into the repo so every agent auto-activates them.

#### Files to Create:

**A. `.claude/token-saver.rules` (auto-loaded by Claude Code)**
```
Location: /home/user/AFROMATIONS/.claude/token-saver.rules
Purpose: Global token saver rules for all agents in this repo
Auto-activation: Claude Code reads .claude/ on session start
```

**B. `ops/CLAUDE-TOKEN-SAVER.md` (explicit agent instructions)**
```
Location: /home/user/AFROMATIONS/ops/CLAUDE-TOKEN-SAVER.md
Content:
  - Token saver protocol mandatory checklist
  - jcodemunch symbol search examples
  - RTK compression filters
  - Cost guard thresholds
  - Daily budget reporting
```

**C. `ops/reports/` (cost tracking directory)**
```
Location: /home/user/AFROMATIONS/ops/reports/
Structure:
  ├── daily-cost-YYYY-MM-DD.json    ← Daily totals
  ├── session-[id].json             ← Per-session logs
  ├── monthly-summary.json          ← Monthly aggregate
  └── README.md                      ← Cost reporting guide
```

**D. `.env.token-saver` (cost guard defaults)**
```
TOKEN_BUDGET_DAILY=50
TOKEN_BUDGET_TASK=10
COMPRESSION_FLOOR=0.65
JCODEMUNCH_REQUIRED=true
RTK_REQUIRED=true
```

#### Implementation Steps:

1. Create `.claude/token-saver.rules` with embedded jcodemunch + RTK commands
2. Create `ops/CLAUDE-TOKEN-SAVER.md` with explicit checklist
3. Create `ops/reports/README.md` explaining cost tracking
4. Add `.env.token-saver` to source control (no secrets, just defaults)
5. Create `ops/reports/.gitkeep` for cost logs
6. Update `CLAUDE.md` in both frontend and backend to reference token saver protocol

---

### 1.2 NVIDIA NIM Backend Integration

**Goal:** Wire NVIDIA NIM proxy into the existing Hana backend for free inference.

#### Files to Create/Modify:

**A. `hanna-backend/lib/nim-client.ts` (new)**
```typescript
- NIM client initialization using OpenAI SDK
- Base URL: http://31.220.58.212:8082
- API Key: dummy (proxy doesn't validate)
- Model: moonshotai/kimi-k2-thinking
- Rate limit: 40 req/min with backoff logic
- Error handling: 429 (rate limit) → 2s wait + retry
```

**B. `hanna-backend/lib/nim-cache.ts` (new - optional)**
```typescript
- In-memory cache for NIM responses (30min TTL)
- Reduces requests to free proxy
- Key: hash(prompt + model + params)
- Value: { response, timestamp, tokens_used }
```

**C. `hanna-backend/routes/nim-chat.ts` (new)**
```typescript
- POST /api/hana/nim/chat
- POST /api/hana/nim/affirmations
- POST /api/hana/nim/story
- Each route uses NIM client with rate limiting
```

**D. `hanna-backend/api/src/index.ts` (modify)**
```typescript
- Add NIM_BASE_URL, NIM_API_KEY, NIM_MODEL to Bindings
- Import and route nimChatRoutes
- Add NIM health check endpoint
```

**E. `.env.example` (add NIM variables)**
```
NVIDIA_NIM_BASE_URL=http://31.220.58.212:8082
NVIDIA_NIM_API_KEY=dummy
NVIDIA_NIM_MODEL=moonshotai/kimi-k2-thinking
NVIDIA_NIM_RATE_LIMIT=40
```

#### Implementation Steps:

1. Create `hanna-backend/lib/nim-client.ts` with OpenAI SDK wrapper
2. Create `hanna-backend/lib/nim-cache.ts` for response caching
3. Create `hanna-backend/routes/nim-chat.ts` with rate-limited endpoints
4. Update `hanna-backend/api/src/index.ts` to mount NIM routes
5. Add NIM environment variables to `.env.example`
6. Test NIM endpoint with curl before dashboard integration

---

## PHASE 2: HANA Operator Dashboard Backend

### 2.1 Dashboard Authentication & User Management

**Goal:** Users can log in, manage affirmations, track progress.

#### Files to Create:

**A. `hanna-backend/lib/auth.ts` (new)**
```typescript
- JWT token generation (HS256, 24hr expiry)
- Supabase auth integration (already available)
- User session management
- Token refresh logic
```

**B. `hanna-backend/routes/auth.ts` (new)**
```typescript
- POST /api/auth/register → Create user account
- POST /api/auth/login → Return JWT token
- POST /api/auth/logout → Invalidate session
- POST /api/auth/refresh → Refresh token
- GET /api/auth/me → Get current user
```

**C. `hanna-backend/db/schema.sql` (new or extend)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE affirmations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  category VARCHAR,
  generated_by VARCHAR, -- 'hana' | 'user' | 'nim'
  created_at TIMESTAMP,
  used_count INT DEFAULT 0,
  last_used TIMESTAMP
);

CREATE TABLE affirmation_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  affirmations_count INT,
  duration_seconds INT,
  mood_before VARCHAR,
  mood_after VARCHAR,
  notes TEXT,
  created_at TIMESTAMP
);
```

### 2.2 Affirmations Engine

**Goal:** Generate and serve personalized affirmations via NIM.

#### Files to Create:

**A. `hanna-backend/routes/affirmations.ts` (new)**
```typescript
- GET /api/hana/affirmations → Get user's affirmations
- POST /api/hana/affirmations/generate → Generate new ones via NIM
- POST /api/hana/affirmations/save → Save affirmation
- DELETE /api/hana/affirmations/:id → Delete affirmation
- POST /api/hana/affirmations/session → Log affirmation session
```

**B. `hanna-backend/lib/affirmations-generator.ts` (new)**
```typescript
- generateAffirmations(userProfile, count=5) → Uses NIM to create custom affirmations
- SystemPrompt: "You are HANA, a supportive affirmation coach..."
- Categories: health, career, relationships, confidence, creativity
- Output: Structured JSON with affirmations array
```

### 2.3 Dashboard API Routes

**Goal:** Backend endpoints for the operator dashboard UI.

#### Files to Create:

**A. `hanna-backend/routes/dashboard-api.ts` (new)**
```typescript
- GET /api/dashboard/stats → User stats (affirmations used, sessions, etc)
- GET /api/dashboard/history → Recent affirmation sessions
- GET /api/dashboard/settings → User preferences
- PUT /api/dashboard/settings → Update preferences
- GET /api/dashboard/recommended → AI-recommended affirmations for today
```

**B. `hanna-backend/routes/hana-chat.ts` (modify/extend)**
```typescript
- POST /api/hana/chat → Chat with HANA agent via NIM
- HANA personality: Supportive, wise, personalized coaching
- Context: Use user's affirmation history for personalization
- Rate limiting: 40 req/min shared with NIM pool
```

---

## PHASE 3: Dashboard Frontend

### 3.1 Operator Dashboard UI

**Goal:** Create a React dashboard where users manage affirmations and chat with HANA.

#### Files to Create:

**A. `afromations-frontend/src/app/dashboard/page.tsx` (new)**
```tsx
- Protected route (requires login)
- Layout: Sidebar + Main content area
- Sections:
  1. Welcome card with HANA agent
  2. Quick affirmations feed
  3. Affirmations library (search, filter, create)
  4. Session history/stats
  5. Settings panel
```

**B. `afromations-frontend/src/components/hana-dashboard/` (new directory)**
```
- HanaChat.tsx → Chat interface with HANA
- AffirmationsGenerator.tsx → Generate new affirmations
- AffirmationCard.tsx → Display single affirmation
- SessionTracker.tsx → Log affirmation sessions
- StatsPanel.tsx → Show user stats/progress
- SettingsPanel.tsx → User preferences
```

**C. `afromations-frontend/src/lib/dashboard-client.ts` (new)**
```typescript
- API client for all dashboard routes
- useAuth() hook
- useAffirmations() hook
- useHanaChat() hook
- Handles JWT token management
```

---

## Implementation Order (Priority)

### Sprint 1: Token Saver + NIM Core (Week 1)
- [ ] Create `.claude/token-saver.rules`
- [ ] Create `ops/CLAUDE-TOKEN-SAVER.md`
- [ ] Create NIM client (`hanna-backend/lib/nim-client.ts`)
- [ ] Create NIM routes (`hanna-backend/routes/nim-chat.ts`)
- [ ] Test NIM proxy with curl
- [ ] Deploy NIM integration to backend

### Sprint 2: Authentication & Database (Week 2)
- [ ] Create auth routes (`hanna-backend/routes/auth.ts`)
- [ ] Create database schema
- [ ] Create affirmations routes (CRUD)
- [ ] Wire Supabase auth
- [ ] Test login/registration flow

### Sprint 3: Dashboard Backend (Week 3)
- [ ] Create affirmations generator using NIM
- [ ] Create dashboard stats endpoints
- [ ] Create HANA chat route (personalized)
- [ ] Implement rate limiting across all NIM routes
- [ ] Test backend endpoints

### Sprint 4: Dashboard Frontend (Week 4)
- [ ] Create dashboard page shell
- [ ] Build affirmations feed UI
- [ ] Build HANA chat UI
- [ ] Build session tracker UI
- [ ] Build settings panel
- [ ] Add authentication/login flow
- [ ] Deploy frontend

---

## Environment Variables (Master List)

```bash
# Token Saver (repo-local)
TOKEN_BUDGET_DAILY=50
TOKEN_BUDGET_TASK=10
COMPRESSION_FLOOR=0.65

# NVIDIA NIM
NVIDIA_NIM_BASE_URL=http://31.220.58.212:8082
NVIDIA_NIM_API_KEY=dummy
NVIDIA_NIM_MODEL=moonshotai/kimi-k2-thinking
NVIDIA_NIM_RATE_LIMIT=40

# Supabase (existing)
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# JWT/Auth
JWT_SECRET=...
JWT_EXPIRY_HOURS=24

# Dashboard
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787 (dev) or https://api.afromations.studio (prod)
NEXT_PUBLIC_DASHBOARD_ENABLED=true
```

---

## File Structure Summary

```
AFROMATIONS/
├── .claude/
│   └── token-saver.rules          ← Auto-loaded by Claude Code
├── ops/
│   ├── CLAUDE-TOKEN-SAVER.md      ← Explicit agent instructions
│   ├── reports/                   ← Cost tracking logs
│   │   ├── daily-cost-YYYY-MM-DD.json
│   │   ├── session-[id].json
│   │   └── README.md
│   └── .env.token-saver           ← Cost guard defaults
├── hanna-backend/
│   ├── api/src/
│   │   ├── index.ts               ← Mount all routes
│   │   ├── routes/
│   │   │   ├── nim-chat.ts        ← NIM endpoints
│   │   │   ├── auth.ts            ← Auth endpoints
│   │   │   ├── affirmations.ts    ← Affirmations CRUD
│   │   │   ├── dashboard-api.ts   ← Dashboard stats
│   │   │   └── hana-chat.ts       ← HANA agent chat
│   │   └── lib/
│   │       ├── nim-client.ts      ← NIM wrapper
│   │       ├── nim-cache.ts       ← Response cache
│   │       ├── auth.ts            ← JWT logic
│   │       └── affirmations-generator.ts
│   ├── db/
│   │   └── schema.sql             ← Database schema
│   └── CLAUDE.md                  ← Updated with NIM/Token saver
└── afromations-frontend/
    └── src/
        ├── app/
        │   └── dashboard/
        │       └── page.tsx        ← Dashboard main page
        ├── components/
        │   └── hana-dashboard/
        │       ├── HanaChat.tsx
        │       ├── AffirmationsGenerator.tsx
        │       ├── AffirmationCard.tsx
        │       ├── SessionTracker.tsx
        │       ├── StatsPanel.tsx
        │       └── SettingsPanel.tsx
        └── lib/
            └── dashboard-client.ts ← API client
```

---

## Key Metrics & Success Criteria

### Token Saver Protocol Success
- ✓ Every agent session logs token usage to `ops/reports/session-[id].json`
- ✓ jcodemunch compression > 80% on codebase searches
- ✓ RTK compression > 70% on CLI output
- ✓ Daily cost stays under $50
- ✓ Task cost stays under $10

### NVIDIA NIM Success
- ✓ All affirmation generation via NIM (free)
- ✓ Cache hit rate > 40% on common affirmations
- ✓ Rate limit: 40 req/min maintained
- ✓ Response time < 2 seconds (average)

### Dashboard Success
- ✓ Users can register, login, log out
- ✓ Generate 5-10 personalized affirmations in < 3 seconds
- ✓ Save/delete/manage affirmations
- ✓ Chat with HANA about affirmations
- ✓ Track sessions and mood changes
- ✓ Mobile responsive (320px+)

---

## Next Steps

1. **NOW:** Create token saver protocol files (.claude/token-saver.rules, ops/CLAUDE-TOKEN-SAVER.md)
2. **NEXT:** Create NIM client and integration tests
3. **THEN:** Build auth system and database schema
4. **FINALLY:** Build dashboard UI and wire it all together

---

## Questions Before Implementation

1. **Supabase:** Do we use the existing Supabase project or create a new one for affirmations?
2. **JWT Secret:** Where should we store JWT_SECRET? (.env, Supabase, Cloudflare KV?)
3. **Database:** PostgreSQL (Supabase) or SQLite (D1)? Existing setup?
4. **Rate Limiting:** Should we use Cloudflare Rate Limiting + Workers or in-app logic?
5. **Caching:** Redis vs in-memory vs Cloudflare Cache? (for NIM responses)
6. **Deployment:** Cloudflare Workers for backend, Vercel for frontend? (Current setup?)
7. **Dashboard Privacy:** Is this operator-only (admin) or user-facing?

Ready to start implementation. Which phase should we begin with?
