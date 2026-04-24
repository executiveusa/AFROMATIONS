# AFROMATIONS STUDIOS — ENHANCED BUILDER AGENT PROMPT V2.0

**Repository:** https://github.com/executiveusa/AFROMATIONS.git
**Local Path:** E:\ACTIVE PROJECTS-PIPELINE\ACTIVE PROJECTS-PIPELINE\AFROMATIONS
**Mission:** Build production-ready anime creation platform for Tyshawn (age 25)

---

## CRITICAL ARCHITECTURE

**CORE STACK:**
1. **Hermes Agent** (NousResearch/hermes-agent) - Hanna's AI brain (autonomous, persistent memory, self-improving)
2. **Synthia Gateway** (executiveusa/synthia-gateway) - BYOK LLM proxy (OpenAI/Anthropic/Groq)
3. **Hermes WebUI** (nesquena/hermes-webui) - 4-quadrant dashboard (Chat, Create, Learn, Gallery)
4. **OpenMontage** (calesthio/OpenMontage) - Agentic video production system
5. **Browser Harness** (browser-use/browser-harness) - CDP web automation
6. **Next.js 15 + React 19** - Public-facing frontend
7. **Cloudflare Workers** - API backend
8. **Supabase** (31.220.58.212) - Database (two separate instances)

**APPLICATIONS:**
1. `Hermes WebUI` - Private 4-quadrant dashboard (Chat, Create, Learn, Gallery) — replaces tyshawn-dashboard
2. `afromations-frontend/` - Public site

**TWO SEPARATE HANNAS (both powered by Hermes Agent):**
1. **Private Hanna** - Tyshawn's personal tutor via Hermes WebUI (supabase_private:5434)
2. **Public Hanna** - Community assistant via afromations-frontend (supabase_public:5433)

---

## YOUR FIRST 5 ACTIONS (Execute in Order)

### Action 1: Repository Scaffold Audit
```bash
cd "E:\ACTIVE PROJECTS-PIPELINE\ACTIVE PROJECTS-PIPELINE\AFROMATIONS"
dir /S /B > repo_structure.txt
findstr /S /I /C:"TODO" /C:"STUB" *.ts *.tsx *.js *.jsx *.py > stubs_found.txt
git status > git_status.txt
git remote -v > git_remotes.txt
git branch -a > git_branches.txt
```

**REPORT:** Total files, directories, stubbed code, git status, remote URL

### Action 2: Install OpenMontage
```bash
cd vendors
git clone https://github.com/calesthio/OpenMontage.git openmontage
cd openmontage
pip install -r requirements.txt --break-system-packages
python -m openmontage.test
```

**REPORT:** Version, FFmpeg detected, test results

### Action 3: Install All Skills
```bash
cd vendors
git clone https://github.com/michaelshimeles/ralphy.git
git clone https://github.com/jgravelle/jcodemunch-mcp.git
git clone https://github.com/knowsuchagency/mcp2cli.git
git clone https://github.com/vercel/chatbot.git vercel-chatbot
git clone https://github.com/modelcontextprotocol/ext-apps.git mcp-ext-apps
git clone https://github.com/supabase-community/supabase-mcp.git
```

**REPORT:** Successfully cloned, failed clones, total size

### Action 4: Environment Variables Check
**Frontend:** ZERO secrets allowed
**Backend Required:**
- SUPABASE_URL=http://31.220.58.212:5434 (Private)
- PUBLIC_SUPABASE_URL=http://31.220.58.212:5433 (Public)
- GEMINI_API_KEY
- REPLICATE_API_KEY (Stable Diffusion)
- GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET
- INCEPTION_LABS_API_KEY (Mercury-2 voice)

**REPORT:** Which vars are missing

### Action 5: Create Folder Structure
```bash
mkdir tyshawn-dashboard database scripts docs
mkdir hanna-backend\tools\openmontage-mcp
mkdir database\migrations database\seeds\lessons\month1 database\seeds\lessons\month2 database\seeds\lessons\month3
```

---

## COMPLETE FOLDER ORGANIZATION

```
E:\ACTIVE PROJECTS-PIPELINE\ACTIVE PROJECTS-PIPELINE\AFROMATIONS\
├── tyshawn-dashboard/          <- NEW! Phase 1 (Weeks 1-4)
│   ├── src/app/
│   │   ├── page.tsx            <- Dashboard (4 quadrants)
│   │   ├── chat/               <- Private Hanna
│   │   ├── create/             <- Character creation
│   │   ├── learn/              <- Japanese lessons
│   │   └── gallery/            <- Personal projects
│   ├── package.json
│   └── vercel.json
│
├── afromations-frontend/       <- PUBLIC SITE (Phase 2)
│   ├── src/app/
│   │   ├── page.tsx            <- Landing
│   │   ├── gallery/            <- Public gallery
│   │   └── blog/               <- Stub
│   └── vercel.json
│
├── hanna-backend/
│   ├── api/src/
│   │   ├── routes/
│   │   │   ├── private-hanna.ts
│   │   │   ├── public-hanna.ts
│   │   │   ├── lessons.ts
│   │   │   ├── projects.ts
│   │   │   └── video.ts        <- OpenMontage
│   │   └── lib/
│   │       ├── pi-agent.ts
│   │       ├── openmontage.ts
│   │       └── supabase.ts
│   ├── tools/
│   │   └── openmontage-mcp/    <- NEW!
│   └── .mcp.json
│
├── database/
│   ├── migrations/
│   │   ├── 001_private_schema.sql
│   │   └── 002_public_schema.sql
│   └── seeds/lessons/
│       ├── month1/             <- Days 1-30 JSON
│       ├── month2/             <- Days 31-60 JSON
│       └── month3/             <- Days 61-90 JSON
│
└── vendors/
    ├── openmontage/            <- CORE ENGINE
    ├── ralphy/
    ├── jcodemunch-mcp/
    └── vercel-chatbot/
```

---

## JAPANESE CURRICULUM (90 Days)

**Structure:**
- **Month 1-2 (Days 1-60):** Culture/manners ONLY (no language)
- **Month 3 (Days 61-90):** Basic Japanese via One Piece scenes

**Every Lesson Must Have:**
1. One Piece episode + timestamp
2. Black/Japanese cultural bridge
3. Stereotype addressed + reality
4. Assessment questions
5. Spaced repetition config

**Example Lesson JSON:**
```json
{
  "day": 1,
  "month": 1,
  "title_en": "The Art of Bowing",
  "category": "manners",
  "one_piece_scene": {
    "episode": 45,
    "timestamp_start": "3:22",
    "context": "Luffy meets Ace"
  },
  "black_japanese_bridge": {
    "japanese_concept": "Bowing as respect ritual",
    "black_parallel": "Dap handshakes",
    "stereotype_addressed": "Japanese overly formal vs Black disrespectful",
    "reality": "Both have deep respect traditions"
  }
}
```

**YOU MUST GENERATE ALL 90 LESSONS**
Save to: `database/seeds/lessons/month{X}/day{XX}.json`

---

## TWO SEPARATE HANNA INSTANCES

**CRITICAL RULE:** ZERO data crossover between Public and Private

**Private Hanna (Tyshawn):**
- Database: supabase_private (port 5434)
- Hermes Agent with full memory
- No rate limits
- Access to all projects, lessons, personal data

**Public Hanna (Community):**
- Database: supabase_public (port 5433)
- Hermes Agent with NO memory
- Rate limit: 5 msgs/day (free), unlimited (premium)
- NO access to personal data

**Implementation:**
```typescript
// private-hanna.ts — Hermes Agent with full memory
const privateHanna = new HermesAgent({
  gateway: { url: "http://synthia-gateway:3000/v1" },
  database: { host: "31.220.58.212", port: 5434 },
  memory: { enabled: true, userId: "tyshawn" }
});

// public-hanna.ts — Hermes Agent, no memory, rate limited
const publicHanna = new HermesAgent({
  gateway: { url: "http://synthia-gateway:3000/v1" },
  database: { host: "31.220.58.212", port: 5433 },
  memory: { enabled: false },
  rateLimits: { free: { messagesPerDay: 5 } }
});
```

---

## SUPABASE SCHEMAS

### Private Database (5434)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  google_id TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'lifetime'
);

CREATE TABLE hana_lessons (
  day_number INTEGER UNIQUE CHECK (day_number BETWEEN 1 AND 90),
  content_md TEXT,
  one_piece_scenes JSONB,
  black_japanese_bridge JSONB
);

CREATE TABLE hana_progress (
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES hana_lessons(id),
  review_due_date TIMESTAMPTZ,
  ease_factor REAL DEFAULT 2.5  -- Anki algorithm
);

CREATE TABLE hana_projects (
  user_id UUID,
  project_type TEXT CHECK (project_type IN ('character', 'scene', 'video')),
  openmontage_config JSONB
);
```

### Public Database (5433)
```sql
CREATE TABLE public_users (
  id UUID PRIMARY KEY,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'premium', 'lifetime')),
  free_messages_today INTEGER DEFAULT 5
);

CREATE TABLE public_gallery (
  creator_id UUID,
  asset_url TEXT,
  is_featured BOOLEAN
);
```

---

## OPENMONTAGE MCP SERVER

Create: `hanna-backend/tools/openmontage-mcp/server.py`

```python
import sys, json
from openmontage import Montage, Clip

class OpenMontageMCP:
    def create_scene(self, scene_id, fps=24):
        montage = Montage(fps=fps)
        self.active_montages[scene_id] = montage
        return {"status": "created"}

    def add_frame(self, scene_id, image_path, duration):
        montage = self.active_montages[scene_id]
        montage.add_clip(Clip(image_path, duration=duration))
        return {"status": "frame_added"}

    def render_scene(self, scene_id, output_path):
        montage = self.active_montages[scene_id]
        montage.render(output=output_path)
        return {"status": "rendered", "output": output_path}

# MCP server loop
for line in sys.stdin:
    request = json.loads(line)
    # handle request...
```

Update `.mcp.json`:
```json
{
  "mcpServers": {
    "openmontage": {
      "command": "python",
      "args": ["tools/openmontage-mcp/server.py"]
    }
  }
}
```

---

## DEPLOYMENT (Phase 1)

```bash
# Deploy Tyshawn Dashboard
cd tyshawn-dashboard
vercel --prod
# -> https://tyshawn.afromations.com

# Deploy Backend
cd hanna-backend/api
wrangler publish
# -> https://api.afromations.com
```

**Verify:**
- [ ] Google OAuth works
- [ ] Private Hanna chat functional
- [ ] Lessons load
- [ ] Character creation (Stable Diffusion) works
- [ ] OpenMontage video rendering works
- [ ] Gallery displays projects

---

## DESIGN REQUIREMENTS

**Steve Krug Principles:**
- Don't make me think (self-evident labels)
- Max 7 choices per screen
- One primary action per page
- Breadcrumbs everywhere
- Inline validation

**UDEC Score:** >= 8.5/10 on all pages

**Cinematic Components** (from vendors/):
- Text scramble (katakana)
- Cursor reactive
- Particle buttons
- Mesh gradients

**NO FRONTEND SECRETS** - EVER

---

## FINAL REPORT FORMAT

```markdown
# Build Report - Phase 1

## Completed
- Scaffold: X files, X dirs
- Dependencies: All installed
- OpenMontage: v X.X, FFmpeg detected
- Skills: XX/XX cloned
- Database: Private / Public
- Deployment: https://tyshawn.afromations.com

## Issues
[List blockers]

## Metrics
- Build time: XX min
- UDEC score: X.X/10
```

---

## CRITICAL REMINDERS

1. **OpenMontage = CORE** - All video goes through it
2. **PI Agent for Hanna** - NOT Hermes
3. **Two separate Hannas** - NEVER mix data
4. **Steve Krug design** - Don't make users think
5. **90 lessons required** - Full curriculum
6. **No frontend secrets** - EVER
7. **Social purpose first** - Washington SPC + 501(c)(3)
8. **High-tier pricing** - $50-100/month
9. **Tyshawn is 25** - Adult entrepreneur
10. **Ship fast** - MVP in 6 weeks

---

## SKILLS REPOSITORIES

The following repos should be cloned into `vendors/` and their skills installed into `.claude/skills/`:

| Repo | Purpose |
|------|---------|
| michaelshimeles/ralphy | Build/test automation (Ralphy Loop) |
| jgravelle/jcodemunch-mcp | Token compression for large codebases |
| knowsuchagency/mcp2cli | MCP-to-CLI bridge |
| supabase-community/supabase-mcp | Supabase MCP integration |
| modelcontextprotocol/ext-apps | MCP extension apps |
| executiveusa/pauli-Uncodixfy | Frontend design enforcement |
| executiveusa/pauli-taste-skill | Design taste enforcement |
| executiveusa/pauli-impeccable-design- | Impeccable design skill |
| executiveusa/pauli-blog | Blog content skill |
| executiveusa/paulsuperpowers | Paul's superpowers skill |
| executiveusa/cinematic-site-components | Cinematic UI components |
| mattpocock/skills | Matt Pocock's skill library |
| garrytan/gbrain | Knowledge management |
| paperclipai/paperclip | AI assistant patterns |
| KurtGokhan/tegaki | Handwriting animation |
| coleam00/link-in-bio-page-builder | E2E test skill reference |
| calesthio/OpenMontage | Video/animation engine |

---

**BUILDER AGENT**: Begin with Action 1 (Scaffold Audit) and report back. I (the architect) will guide you through each phase.

**STATUS:** Ready for execution
**NEXT ACTION:** Run Action 1 and provide Scaffold Audit Report
