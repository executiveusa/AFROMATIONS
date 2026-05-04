# AFROMATIONS: Interactive Codebase Course

## What is AFROMATIONS?

AFROMATIONS is a multi-agent creative platform built for the anime community—powered by two AI agents, Hana and DUAL, who work together to teach Japanese language through anime, enable AI-powered creative production, and build community infrastructure around art and storytelling.

**The product:** A web platform where you can:
- Learn Japanese from anime (with real dialogue from shows you love)
- Generate images, videos, and 3D models using 200+ AI models
- Join community projects (murals, character collaborations, fan art)
- Access educational resources on anime production and cultural context
- Take courses that adapt to your learning level

**The mission:** Democratize creative tools and cultural knowledge for non-technical creators while building a community around anime as both art form and learning medium.

---

## The Architecture

AFROMATIONS is built on **Next.js 15 with the App Router**, styled with **Tailwind CSS 4**, and connected to **Supabase** for authentication and data persistence.

### The Two Agents

**Agent Hana (花 — Flower)**
- **Role:** Teacher and guide for education tier
- **Responsibilities:** 
  - Japanese language curriculum (JLPT N5–N1 via anime)
  - Lesson progression and memory-based learning
  - Community art planning and workshops
  - Content moderation and quality assurance
- **Owns:** `/hana`, `/learn/**`, education API routes
- **Powers:** Hana Academy (interactive course platform)

**Agent DUAL**
- **Role:** Operational pilot for creative production
- **Responsibilities:**
  - AI Studio orchestration (200+ generative models)
  - Blender control (local + cloud GPU)
  - Workflow automation and production pipelines
  - Community commission and impact intake processing
- **Owns:** `/dual`, `/studio`, `/social-purpose/**`, Blender bridges, impact API routes

### Data Flow: What Happens When You Use It

#### Scenario 1: Learning Japanese Through Anime

```
User visits /learn/japanese-by-anime/hiragana-energy
        ↓
Page loads lesson content (pre-rendered static HTML)
        ↓
Hana's lesson engine detects: user hasn't completed this lesson yet
        ↓
Page hydrates with progress tracker (calls /api/education/progress)
        ↓
User clicks "Mark as Complete"
        ↓
Frontend sends POST to /api/education/progress with:
  { userId, lessonSlug, timeSpent, quizScore }
        ↓
API validates user session (Supabase auth)
        ↓
API writes to "lesson_progress" table in Supabase
        ↓
Frontend receives confirmation, updates UI badge to "✓"
```

**Key files:**
- `/app/learn/japanese-by-anime/hiragana-energy/page.tsx` — Lesson page (Hana content)
- `/lib/education.ts` — Progress tracking utilities
- `/app/api/education/progress/route.ts` — Progress API handler
- Supabase table: `lesson_progress(user_id, lesson_slug, completed_at, time_spent_seconds, quiz_score)`

---

#### Scenario 2: Generating a Character Image in DUAL Studio

```
User visits /studio
        ↓
Studio loads with 6 mode cards (Image, Video, Lip Sync, Cinema, Blender, Workflow)
        ↓
User selects "Image Studio" → sees 50+ model options
        ↓
User enters prompt: "anime girl with blue eyes in cyberpunk Tokyo, neon lights"
        ↓
Frontend sends POST to /api/studio/generate with:
  { modelId: 'flux-pro', prompt, params { steps: 28, cfg: 7.5 } }
        ↓
API validates model availability (checks Open-Generative-AI service)
        ↓
API calls AI service backend (via open-generative-ai SDK)
        ↓
GPU processes for 5-10 seconds, returns image URL
        ↓
Frontend receives URL, displays result with metadata (model, time, seed)
        ↓
User clicks "Refine" or "Export as…"
```

**Key files:**
- `/app/studio/page.tsx` — Studio UI with 6 mode cards
- `/components/studio-image-panel.tsx` — Image generation interface
- `/api/studio/generate/route.ts` — Generation API (bridges to Open-Generative-AI)
- `/lib/studio-models.ts` — Model config for 200+ models
- Blender bridge: `/api/studio/blender/route.ts` — Controls local Blender or cloud GPU

---

#### Scenario 3: Submitting a Volunteer Application

```
User visits /volunteer
        ↓
Form auto-loads (volunteer options: mentor, facilitator, translator)
        ↓
User fills form: name, email, experience level, availability
        ↓
User submits
        ↓
Frontend validates client-side, then POSTs to /api/impact/intake with:
  { type: 'volunteer', formData, userId (if authed) }
        ↓
API validates and sanitizes input
        ↓
API writes to "impact_intake" table in Supabase (with status: 'pending')
        ↓
API sends email to admin via Resend (configured in env)
        ↓
Frontend shows confirmation: "Thanks! We'll review your application in 3 days."
        ↓
Admin receives email, reviews in /admin/impact (not yet built)
        ↓
Hana later reaches out via email or in-app notification (planned)
```

**Key files:**
- `/app/volunteer/page.tsx` — Volunteer form page
- `/components/impact-intake-form.tsx` — Reusable form component (used for volunteer, donate, commission, partnerships, graffiti-cleanup)
- `/app/api/impact/intake/route.ts` — Form submission API
- Supabase table: `impact_intake(id, type, form_data, status, created_at, reviewed_at)`

---

## The Tech Stack Explained

### Frontend Layer (`/app/**/*.tsx`)

**Next.js 15 App Router** — Page-based routing using `/app` directory. Each feature (Hana, DUAL, Social Purpose) gets its own folder.

```
app/
  /                          → Homepage (Hana + DUAL feature cards)
  /hana/page.tsx            → Hana intro page
  /learn/page.tsx           → Academy hub
  /learn/japanese-by-anime/ → Course landing + lesson pages
  /dual/page.tsx            → DUAL intro page
  /studio/page.tsx          → DUAL AI Studio (200+ models)
  /social-purpose/page.tsx  → SPC landing page
  /volunteer/page.tsx       → Volunteer intake form
  /donate/page.tsx          → Donation form
  /commission/page.tsx      → Mural commission form
  /api/education/**         → Education backend
  /api/studio/**            → DUAL Studio backend
  /api/impact/**            → SPC backend
```

**Components** (`/components/**`) — Reusable UI elements:
- `dual-avatar.tsx` — SVG avatar of Agent DUAL (golden eyes, blindfold, dreadlocks)
- `hana-feature.tsx` — Hana's homepage card
- `dual-feature.tsx` — DUAL's homepage card (now with cinematic image)
- `impact-intake-form.tsx` — Form for volunteer/donate/commission submissions
- `studio-image-panel.tsx` — Image generation UI in DUAL Studio
- `lesson-card.tsx` — Individual lesson card in Academy
- `gallery-section.tsx` — (Deprecated; was hand-drawn art — now shows "Coming Soon" placeholders)

**Design System** (`/lib/translations/en.ts`, `/app/globals.css`):
- **Colors:** Dark (#1a1a1a), Cream (#faf7f2), Red accent (#d94f30)
- **Fonts:** Sora for display, DM Sans for body, JetBrains Mono for code
- **Spacing:** Tailwind v4 with custom tokens (--af-red, --af-cream, --af-black, --af-grey)

### State Management

**No Redux or Zustand.** Instead:
- **Server-side rendering (RSC)** for most pages (faster, better SEO)
- **SWR** for client-side data fetching that needs to sync across components
- **Supabase client library** for real-time subscriptions (when needed for lesson progress)
- **React hooks** (useState, useEffect) for local UI state

Example: When Hana's lesson page loads, it checks `localStorage` for cached progress, then calls `/api/education/stats` via SWR to fetch real data. If offline, it falls back to cache.

### Backend APIs

**API Routes** (`/app/api/**/*.ts`):

1. **Education APIs** (Hana owns):
   - `POST /api/education/progress` — Save lesson completion, quiz score, time spent
   - `GET /api/education/stats` — Fetch user's progress dashboard (lessons completed, total time, current streak)
   - `GET /api/education/lessons/[slug]` — Fetch lesson content (metadata, quiz questions, references)

2. **Studio APIs** (DUAL owns):
   - `POST /api/studio/generate` — Submit generation job (image/video/lip-sync)
   - `GET /api/studio/models` — List available models (50+ image, 60+ video, 9+ lip-sync)
   - `POST /api/studio/blender/control` — Send command to local Blender (py script execution)
   - `POST /api/studio/blender/cloud` — Queue Blender job on RunPod/Vast.ai GPU

3. **Impact APIs** (DUAL owns):
   - `POST /api/impact/intake` — Submit volunteer/donation/commission form
   - `GET /api/impact/intake?type=volunteer` — Fetch intake submissions (admin use)
   - `PATCH /api/impact/intake/[id]` — Update status (admin reviewing application)

**No database ORM.** APIs use raw SQL via Supabase's `supabase.from().insert().select()` syntax.

### Database (Supabase PostgreSQL)

**Core tables:**

```sql
-- Users (managed by Supabase Auth)
auth.users (id, email, created_at)
public.profiles (id, username, avatar_url, bio, created_at)

-- Education
public.lessons (
  id, slug, title, module, difficulty, type, content_html, 
  quiz_questions JSONB, references JSONB, created_at
)
public.lesson_progress (
  id, user_id, lesson_slug, completed_at, 
  time_spent_seconds, quiz_score, created_at
)

-- Impact intake
public.impact_intake (
  id, type, form_data JSONB, status, notes, reviewed_by, 
  reviewed_at, created_at
)

-- AI Studio (metadata only; images/videos stored in Vercel Blob)
public.studio_generations (
  id, user_id, type, model, prompt, result_url, 
  metadata JSONB, created_at
)
```

Row-level security (RLS) ensures:
- Users can only see their own lesson progress
- Users can only see their own generations
- Admins can see all impact intake submissions

### External Services

1. **Open-Generative-AI** (DUAL Studio engine)
   - 50+ image models (Flux, Midjourney, DALL-E, etc.)
   - 60+ video models (Kling, Sora, Veo, Runway, etc.)
   - 9+ lip-sync models
   - Custom workflows (chaining multiple models)
   - API: POST requests with prompt + model ID, receive result URL

2. **Blender (Local or Cloud)**
   - **Local:** Runs on user's machine (localhost:5000), communicates via WebSocket
   - **Cloud:** RunPod or Vast.ai GPU rental for heavy renders
   - **Bridge:** `/app/api/studio/blender/route.ts` translates AI requests to Blender Python API
   - Example: "Create a 3D character with anime shaders" → Blender script → model file → download

3. **Supabase (Database + Auth)**
   - PostgreSQL database for lessons, progress, impact intake
   - Supabase Auth for login/signup (email + password or OAuth)
   - Row-level security for data isolation
   - Real-time subscriptions for progress updates (future)

4. **Vercel Blob** (File storage)
   - Store generated images/videos from DUAL Studio
   - Private blobs (only authenticated users see their own files)
   - Edge CDN for fast downloads

5. **Resend** (Email notifications — future)
   - Send confirmation emails when forms submitted
   - Send admin alerts for new impact intake applications
   - Send lesson progress emails (weekly digests, achievement badges)

---

## How to Steer AI Agents Building This

### Hana: Education Tasks
- **New lesson:** "Add a lesson on honorifics in Japanese. Follow the pattern in `/app/learn/japanese-by-anime/wa-vs-ga/page.tsx`. Use real anime dialogue examples."
- **Course expansion:** "Create a new course module on AI for Visual Artists. Follow the structure of Japanese-by-Anime but teach AI tools (Photoshop plugins, Midjourney, ComfyUI)."
- **Progress tracking bug:** "Users are seeing stale progress. Check `/lib/education.ts` — the SWR cache might not be invalidating. Try adding `revalidate: 0` to the API response."

### DUAL: Production Tasks
- **New studio mode:** "Add a Poetry-to-Video mode using Kling. Copy `/components/studio-image-panel.tsx` as the template, swap out the image generation logic for video."
- **Blender integration:** "Connect the studio to a local Blender instance. Write a `/api/studio/blender/local/route.ts` that sends Python scripts to `localhost:5000`."
- **Performance:** "The generate endpoint is slow. Cache model metadata in Redis (Upstash). Before calling Open-Generative-AI, check if model is available in cache."

### Both Agents: Feature Ideas
- **User profiles:** "Create `/app/profile/[username]/page.tsx`. Show their lessons completed, generated artwork, community contributions. Use Hana's progress data + DUAL's generations."
- **Search:** "Add a search bar to the navbar. Query both lessons (Hana's data) and generated art (DUAL's data). Use fuzzy matching (fuse.js)."
- **Mobile app:** "We're seeing 60% mobile traffic. Optimize the Studio UI for mobile. Switch from side-by-side panels to tabs in `/components/studio-tabs.tsx`."

---

## Debugging Patterns

### "The lesson isn't saving progress"
1. Check browser console for network errors: is `/api/education/progress` returning 200?
2. Check Supabase RLS policies: does the `lesson_progress` table allow INSERT for authenticated users?
3. Check the API: `console.log("[v0] user.id =", user.id)` in `/app/api/education/progress/route.ts`. Is it null?
4. Check auth: is the user actually logged in? Check `localStorage` for `sb-auth-token`.

### "DUAL Studio generation is stuck"
1. Is Open-Generative-AI service running? Check `/api/studio/generate` response — what error?
2. Is the model ID valid? Check `/lib/studio-models.ts` for typos.
3. GPU queue backlog? The service might be overloaded. Add a 15-second timeout and show "Try again in a few seconds" message.

### "Forms aren't submitting"
1. Check `/api/impact/intake` handler: is it receiving the POST?
2. Check Supabase: can you INSERT into `impact_intake` table directly? `supabase.from('impact_intake').insert([...])`.
3. Check network: is CORS blocking the request? (shouldn't be — we're on same origin.)
4. Check form validation: `console.log("[v0] formData =", formData)` before POST.

---

## Next Steps

### Currently Implemented
- ✅ Homepage with Hana + DUAL feature cards
- ✅ Hana Academy with 7-module Japanese-by-Anime course
- ✅ 3 seed lessons (Hiragana Energy, WA vs GA, Honorifics)
- ✅ DUAL Studio with 6 modes (Image, Video, Lip Sync, Cinema, Blender, Workflow)
- ✅ Social Purpose pages (Volunteer, Donate, Commission, Partnerships, Graffiti Cleanup)
- ✅ Impact intake form + API
- ✅ Supabase schema for lessons + progress + impact intake

### To Build Next
- [ ] **User profiles** — `/app/profile/[username]` showing lesson progress + generated art
- [ ] **Admin dashboard** — `/admin/impact` to review and approve applications
- [ ] **Community gallery** — User-generated and AI-generated artwork showcase
- [ ] **Real-time lessons** — Live workshops taught by Hana (calendar + Zoom integration)
- [ ] **Blender cloud bridge** — Full RunPod + Vast.ai GPU rental & control
- [ ] **AI-powered recommendations** — "You finished Japanese 101, try this anime next"
- [ ] **Export + download** — Users can download their progress as PDF, generated images as high-res
- [ ] **Mobile app** — React Native version with offline lesson access
- [ ] **Community moderation** — Hana's AI flags inappropriate content in galleries + forums
- [ ] **Monetization** — Premium courses, commission marketplace, merch store integration (Printify)

---

## Glossary

**RSC (React Server Components):** Pages that render on the server, send HTML to browser (faster, better SEO, can query database securely).

**SWR (Stale-While-Revalidate):** Client-side data fetching hook that caches results and auto-refreshes in background.

**RLS (Row-Level Security):** Database rules that prevent users from seeing data they shouldn't (e.g., other users' progress).

**API Route:** Next.js route that runs server-side (inside `/app/api`) and returns JSON.

**Supabase client:** JavaScript library that connects to Supabase database. Use `supabase.from('table').select()` to query, `.insert()` to add rows, `.update()` to modify.

**Blob URL:** File stored on Vercel's edge CDN. Generated images/videos are saved to Vercel Blob, then referenced by URL.

**Open-Generative-AI:** Open-source generative AI service (200+ models). DUAL calls it via HTTP API when user clicks "Generate" in Studio.

**Blender bridge:** API that translates AI requests into Blender Python commands. Runs either locally (on user machine) or in cloud GPU (RunPod/Vast.ai).

---

---

## Integrating jCodeMunch for Token-Efficient Code Navigation

**Why jCodeMunch matters for AFROMATIONS:**

This codebase has 50+ files across education, studio, and impact tiers. Traditional file-reading burns tokens on imports, comments, and boilerplate. jCodeMunch cuts that by 95%+ using **structured symbol indexing**.

### Installation (1 command)

```bash
pip install jcodemunch-mcp
jcodemunch-mcp init --claude-md global --hooks --index
```

This auto-detects Claude Code, indexes the AFROMATIONS repo, and installs agent hooks so you stop brute-reading files.

### High-Value jCodeMunch Queries for AFROMATIONS

| Query | Token Savings | Use Case |
|-------|---------------|----------|
| `search_symbols --pattern "page" --glob "**/learn/**"` | 95% | Find all lesson pages without opening every file |
| `get_call_hierarchy --symbol "saveProgress" --depth 3` | 90% | Trace education API flow (save → validate → Supabase) |
| `find_references --identifier "TegakiText"` | 85% | Find all animation text components |
| `find_dead_code --file-glob "**/api/**"` | 88% | Detect unused API endpoints |
| `get_changed_symbols --since "main"` | 92% | Map git commits to exact symbols changed |
| `search_ast --category "security"` | 87% | Find hardcoded secrets or unsafe patterns |
| `winnow_symbols --kind "function" --complexity "10+"` | 89% | Find complex functions worth refactoring |
| `plan_refactoring --symbol "ImpactIntakeForm" --operation "extract"` | 91% | Get edit-ready instructions for component extraction |

### Example: "Where does Hana's progress tracking happen?"

**Without jCodeMunch (expensive):**
```
Open /app/learn/japanese-by-anime/hiragana-energy/page.tsx (200 lines scanned)
Open /lib/education.ts (150 lines scanned)
Open /app/api/education/progress/route.ts (100 lines scanned)
Total: ~450 lines, ~3,000 tokens burned
```

**With jCodeMunch (cheap):**
```bash
jcodemunch get_call_hierarchy --symbol "saveLessonProgress" --depth 2
# Returns exact flow: saveLessonProgress → POST /api/education/progress → Supabase insert
# ~150 tokens, 95% savings
```

### jCodeMunch Commands Reference for AFROMATIONS

```bash
# 1. Find all lesson routes quickly
jcodemunch search_symbols --glob "**/learn/japanese-by-anime/**" --kind "file"

# 2. Check if an old API endpoint is still used
jcodemunch find_references --identifier "POST /api/education/stats"

# 3. Understand the impact intake flow
jcodemunch get_call_hierarchy --symbol "submitIntake" --depth 4

# 4. Find components using DualAvatar
jcodemunch find_references --identifier "DualAvatar" --format compact

# 5. Detect unused lesson files
jcodemunch find_dead_code --file-glob "**/learn/**"

# 6. Find all API routes touching Supabase
jcodemunch search_ast --custom-query "call:*supabase*" --file-glob "**/api/**"

# 7. Rank symbols by importance (PageRank)
jcodemunch get_symbol_importance --file-glob "**/api/**" --sort "importance"

# 8. Plan a refactoring (e.g., extract form logic)
jcodemunch plan_refactoring --symbol "ImpactIntakeForm" --operation "extract" --scope "useForm"

# 9. Audit AGENT.md or CLAUDE.md for stale references
jcodemunch audit_agent_config --path "SKILL.md"

# 10. Get PR risk score before merging
jcodemunch get_pr_risk_profile --branch "feature/new-lesson" --composite-score
```

---

## Best Practices: Extending AFROMATIONS

### When Adding a New Lesson (for Hana)

1. **Copy the pattern:** Use `/learn/japanese-by-anime/wa-vs-ga/page.tsx` as template
2. **Follow naming:** `[kebab-case-lesson-slug]/page.tsx`
3. **Include metadata:** Module number, difficulty (N5/N4/N3/N2/N1), type (grammar/vocab/culture)
4. **Add progress tracking:** `useLessonProgress()` hook at top
5. **Link navigation:** Previous lesson ← → Next lesson

**Example scaffolding:**
```tsx
// /learn/japanese-by-anime/nani-vs-donna/page.tsx
'use client'
import { useLessonProgress } from '@/lib/education'

export default function NaniVsDonnaPage() {
  const { saveProgress } = useLessonProgress()
  // Content here
}
```

### When Adding a New Studio Mode (for DUAL)

1. **Create panel component:** `/components/studio-[mode]-panel.tsx`
2. **Add model config:** Update `/lib/studio-models.ts` with new models
3. **Create API bridge:** `/app/api/studio/[mode]/route.ts`
4. **Connect UI:** Add card to `/app/studio/page.tsx`

**Checklist:**
- [ ] Panel accepts user input (prompt, parameters)
- [ ] API validates input, calls external service
- [ ] Results saved to Vercel Blob
- [ ] Error handling with user-friendly messages
- [ ] Mobile-responsive design

### When Adding Community Features

1. **Create intake form:** Copy `/components/impact-intake-form.tsx`
2. **Create page:** `/app/[feature]/page.tsx` (e.g., `/app/workshop/page.tsx`)
3. **Add API route:** `/app/api/impact/[feature]/route.ts`
4. **Update schema:** Add table to Supabase migration script

---

## Codebase Architecture (Bird's-Eye View)

```
afromations-frontend/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── page.tsx                  # Homepage (Hana + DUAL cards)
│   │   ├── /hana                     # Hana character page
│   │   ├── /learn                    # Academy hub + lessons (Hana owns)
│   │   ├── /dual                     # DUAL character page
│   │   ├── /studio                   # AI Studio (DUAL owns)
│   │   ├── /social-purpose           # SPC landing
│   │   ├── /volunteer, /donate, etc. # Impact pages (DUAL owns)
│   │   └── /api/                     # Backend routes
│   │       ├── /education/           # Hana's APIs (progress, stats)
│   │       ├── /studio/              # DUAL's APIs (generate, models, blender)
│   │       └── /impact/              # Community APIs (intake, review)
│   │
│   ├── components/                   # Reusable UI
│   │   ├── dual-avatar.tsx           # DUAL SVG character
│   │   ├── hana-avatar.tsx           # Hana SVG character
│   │   ├── dual-feature.tsx          # DUAL card (homepage)
│   │   ├── hanna-feature.tsx         # Hana card (homepage)
│   │   ├── impact-intake-form.tsx    # Reusable form
│   │   ├── studio-*-panel.tsx        # Studio mode panels
│   │   ├── lesson-card.tsx           # Lesson grid card
│   │   ├── inner-layout.tsx          # Page wrapper
│   │   └── tegaki-text.tsx           # Hand-drawn animation text
│   │
│   ├── lib/                          # Utilities & hooks
│   │   ├── education.ts              # Hana's progress utilities
│   │   ├── studio-models.ts          # DUAL's AI model registry
│   │   ├── i18n.ts                   # Translation hook (useI18n)
│   │   ├── use-user.ts               # Auth hook (useUser)
│   │   ├── use-lesson-progress.ts    # Progress hook (useLessonProgress)
│   │   └── translations/en.ts        # English copy
│   │
│   └── globals.css                   # Design tokens, Tailwind config
│
├── public/                           # Static assets
│   └── (gallery images deleted)      # Was hand-drawn art
│
├── scripts/
│   ├── education-schema.sql          # Supabase migration
│   └── impact-schema.sql             # Impact intake tables
│
├── master-plan/                      # Strategic docs
│   ├── STRATEGIC-OVERVIEW.md         # Vision & mission
│   ├── DUAL-AGENT.md                 # DUAL responsibilities
│   ├── IMPLEMENTATION-LOG.md         # What was built when
│   └── ROUTE-MAP.md                  # URL structure
│
├── EDUCATION_BACKEND.md              # Education API docs
├── SKILL.md                          # This course (codebase-to-course)
└── package.json                      # Dependencies

hanna-backend/                        # Separate Python backend (future)
└── api/src/
    ├── routes/                       # FastAPI routes
    │   ├── hana-lesson.ts            # Lesson fetch
    │   ├── education-progress.ts     # Progress API
    │   └── ai-orchestration.ts       # DUAL Studio backend
    └── lib/
        ├── supabase.ts               # DB client
        └── models.ts                 # Pydantic models
```

---

## Performance & Scaling Notes

### Current Bottlenecks (and fixes)

| Issue | Why | Fix |
|-------|-----|-----|
| Lesson pages slow on first load | Static HTML not pre-rendered | Use `generateStaticParams()` in page.tsx |
| DUAL Studio generation blocks UI | Waiting for Open-Generative-AI response | Move to job queue (Upstash + workflow SDK) |
| SWR cache stale for progress | No invalidation trigger | Add Supabase real-time subscription |
| Gallery section slow | Was loading 6 images upfront | Now showing static "Coming Soon" cards |

### Recommended Optimizations

1. **Cache model metadata** — DUAL Studio lists 200+ models on every visit. Store in Upstash Redis (1-hour TTL).
2. **Queue long tasks** — Generation jobs should be async. Use Vercel Workflow SDK to queue and track progress.
3. **Stream lesson content** — Large lesson HTML pages could use React Server Components' built-in streaming.
4. **Compress Supabase queries** — Add indexes on `user_id` and `lesson_slug` in `lesson_progress` table.

---

## Integration Checklist for New Teams

If you're taking over AFROMATIONS, complete this in order:

- [ ] **Setup Supabase:** Create project, run `/scripts/education-schema.sql`
- [ ] **Setup auth:** Configure Supabase Auth in `.env.local`, connect to Sign In button
- [ ] **Setup Vercel Blob:** Add `BLOB_READ_WRITE_TOKEN` for file storage
- [ ] **Test Hana Academy:** Load `/learn` and try completing a lesson. Check Supabase `lesson_progress` table
- [ ] **Test DUAL Studio:** Load `/studio` and try image generation. Verify Open-Generative-AI API key works
- [ ] **Test impact forms:** Submit `/volunteer` form, verify data in Supabase `impact_intake` table
- [ ] **Install jCodeMunch:** `pip install jcodemunch-mcp && jcodemunch-mcp init` for token-efficient code navigation
- [ ] **Deploy:** Push to Vercel, set env vars on Vercel Dashboard, monitor logs
- [ ] **Monitor performance:** Check build times, API latency, Supabase query costs
- [ ] **Plan next feature:** Use this SKILL.md + jCodeMunch to understand how to extend

---

**This course was created using the Codebase-to-Course skill + jCodeMunch token efficiency best practices.**

**Last Updated:** 2026-05-04  
**Agents:** Hana (education), DUAL (operations), v0 (course generation)  
**Status:** Production ready with strategic expansion roadmap
