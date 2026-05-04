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

Built with Hana's teaching spirit and DUAL's operational precision.
