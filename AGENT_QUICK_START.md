# Agent Quick Start Guide - Hana & DUAL

**Quick Reference for Operating AFROMATIONS**

---

## 🎓 Agent Hana (花) - Education & Community

### What Hana Does
- **Teaches Japanese** through anime (N5→N1)
- **Moderates community** discussions
- **Tracks student progress** in Supabase
- **Analyzes anime trends** (what's popular)
- **Powers the Academy** at `/learn`

### Hana's Daily Tasks
```
Morning:
1. Check forum for new discussions
2. Moderate inappropriate content
3. Respond to student questions

Midday:
1. Analyze trending anime (for curriculum)
2. Update progress dashboards
3. Send encouragement messages

Evening:
1. Generate weekly digest
2. Update achievement badges
3. Plan next week's lessons
```

### Hana's Tools
- **Supabase:** User data, progress, achievements
- **Browser:** Reference anime clips
- **Search:** Find trending anime discussions
- **File:** Lesson materials and curriculum
- **jCodeMunch:** Code lookups (mandatory)

### Hana's Commands (jCodeMunch)
```bash
# Find all lesson pages
jcodemunch search_symbols --glob "**/learn/japanese-by-anime/**"

# Trace progress saving
jcodemunch get_call_hierarchy --symbol "saveLessonProgress" --depth 3

# Find where LessonCard is used
jcodemunch find_references --identifier "LessonCard"

# Check education API endpoints
jcodemunch search_symbols --glob "**/api/education/**" --kind "function"
```

### Hana's Success Metrics
- 5+ lessons completed per student per week
- 75%+ mastery rate (passing grades)
- 50+ active forum discussions per week
- 4.5+/5 student satisfaction

### What to Tell Hana
```
"I want to learn Japanese"
→ Hana assigns you to Academy, tracks progress

"I don't understand this grammar"
→ Hana explains with anime examples

"What should I watch to improve?"
→ Hana recommends anime for your level

"Can I get a certificate?"
→ Hana tracks achievements, generates proof
```

---

## 🎨 Agent DUAL (二) - Creative Operations & Studio

### What DUAL Does
- **Generates anime characters** (Higgsfield-level)
- **Runs the studio** with 200+ models
- **Creates scenes and storyboards**
- **Animates characters** (video/GIF)
- **Powers `/studio`** at all 6 modes

### DUAL's Daily Tasks
```
Morning:
1. Monitor generation queue
2. Check API latency/costs
3. Handle user generation requests

Midday:
1. Refine generation quality
2. Test new models
3. Optimize pipeline speed

Evening:
1. Batch process queued generations
2. Update character gallery
3. Report studio metrics
```

### DUAL's Tools
- **Open-Generative-AI:** 200+ model access (Flux, Kling, Sora, etc.)
- **Blender:** Local + cloud 3D generation
- **Vercel Blob:** Store generated characters & videos
- **Supabase:** User projects, generation history
- **Browser:** Reference anime aesthetics
- **jCodeMunch:** Architecture lookups (mandatory)

### DUAL's Commands (jCodeMunch)
```bash
# Find all studio mode panels
jcodemunch search_symbols --glob "**/studio/**" --kind "class"

# Find AI model registry
jcodemunch search_ast --custom-query "AIModelRegistry" --file-glob "**/studio/**"

# Trace generation flow
jcodemunch get_call_hierarchy --symbol "generateImage" --depth 3

# Find unused studio code
jcodemunch find_dead_code --file-glob "**/studio/**"
```

### DUAL's Success Metrics
- 1,000+ characters generated per week
- < 20 seconds per image generation
- < 90 seconds per video generation
- 4.5+/5 character quality rating
- 99.9% uptime on studio

### What to Tell DUAL
```
"Create an anime girl with blue hair"
→ DUAL generates 3 options, you pick favorite

"I want this character dancing"
→ DUAL animates with Kling video model

"Make this character in 5 different outfits"
→ DUAL batch generates with consistency

"Save my character so I can use it later"
→ DUAL stores in your project library
```

---

## 📊 How They Work Together

### User Journey: "I want to learn Japanese and create characters"

```
1. User visits AFROMATIONS.com
2. Sees two CTAs: "Learn Japanese" & "Create Characters"

Path A: Learn Japanese
   User → "Start Learning"
   ↓
   Hana Academy (~/ learn)
   ↓
   Hana teaches N5 grammar from anime
   ↓
   User completes lesson
   ↓
   Hana saves progress to Supabase
   ↓
   User earns badge "Hiragana Master"

Path B: Create Characters
   User → "Try DUAL Studio"
   ↓
   DUAL Studio (/studio)
   ↓
   DUAL asks: "What character do you want?"
   ↓
   User describes character (text or style selector)
   ↓
   DUAL generates 3 options
   ↓
   User picks favorite
   ↓
   DUAL saves to Vercel Blob + Supabase
   ↓
   User can download/share

Path C: Connect Community
   User shares character on Discord
   ↓
   Other users like + comment
   ↓
   User gets remix suggestions
   ↓
   Creator gets featured in gallery
   ↓
   Can join live studio sessions
```

### Handoff Points
- **Hana → DUAL:** Complex creative requests (generate character for lesson)
- **DUAL → Hana:** "Explain this grammar" in character descriptions
- **Both → Admin:** Payment, billing, technical escalations

---

## 🚀 Starting AFROMATIONS Development

### Prerequisites
```bash
# Install jCodeMunch (mandatory)
pip install jcodemunch-mcp

# Initialize for AFROMATIONS
cd /path/to/AFROMATIONS
jcodemunch init --project-root . --index

# Verify setup
jcodemunch status
```

### First Task (Any Team)
```bash
# 1. Read the mandate
cat JCODEMUNCH_MANDATE.md

# 2. Read your agent's harness
cat hanna-backend/agents/Hana.agent.md      # Education team
cat hanna-backend/agents/Dual.agent.md      # Studio team

# 3. Find what you need with jCodeMunch (not manual file reading)
jcodemunch search_symbols --glob "**/learn/**"
# instead of:
find . -name "*.tsx" | xargs grep "LessonCard"

# 4. Read the next steps
cat NEXT_STEPS.md

# 5. Start shipping
```

---

## 📋 Checklists

### Before Deploying Hana Changes
- [ ] Did I use jCodeMunch to find affected files?
- [ ] Did I test the lesson end-to-end?
- [ ] Does progress save to Supabase correctly?
- [ ] Did I update translation files (en.ts)?
- [ ] Does it work on mobile?
- [ ] Did I add achievement/badge if applicable?

### Before Deploying DUAL Changes
- [ ] Did I use jCodeMunch to find studio components?
- [ ] Did I test generation with 3+ models?
- [ ] Is output saved to Vercel Blob?
- [ ] Does it scale to concurrent users?
- [ ] Is error handling in place?
- [ ] Did I document the new model/feature?

### Weekly Hana Check-in
- [ ] Students passing quizzes? (75%+)
- [ ] Forum engagement > 50 discussions?
- [ ] No complaints about lesson difficulty?
- [ ] Trending anime properly captured?
- [ ] Community healthy (no spam/abuse)?

### Weekly DUAL Check-in
- [ ] Generation times < 20s (image) / 90s (video)?
- [ ] Character quality rated 4.5+/5?
- [ ] Studio uptime > 99.9%?
- [ ] Queue backlog manageable?
- [ ] Any new models to test/add?

---

## 🆘 Troubleshooting

### "My lesson didn't save"
- [ ] Check Supabase connection (env var set?)
- [ ] Use jCodeMunch: `jcodemunch get_call_hierarchy --symbol "saveLessonProgress" --depth 2`
- [ ] Check API logs for 500 errors
- [ ] Retry with manual Supabase query

### "Character generation is slow"
- [ ] Check GPU queue size (queue > 50?)
- [ ] Try different model (Flux might be overloaded)
- [ ] Check Vercel Blob upload speed
- [ ] Scale GPU resources if persistent

### "I can't find where X is implemented"
- [ ] Use jCodeMunch: `jcodemunch find_references --identifier "X"`
- [ ] Never manually grep without jCodeMunch
- [ ] File issue if jCodeMunch can't find it
- [ ] Document the discovery in JCODEMUNCH_LOG.txt

### "I'm burning too many tokens"
- [ ] You forgot jCodeMunch mandate
- [ ] Check JCODEMUNCH_MANDATE.md for commands
- [ ] Ask: "Did I use jcodemunch first?"
- [ ] If not → re-do with jCodeMunch

---

## 📚 Key Files to Remember

| File | Purpose | Ownership |
|------|---------|-----------|
| `Hana.agent.md` | Hana's system prompt & responsibilities | Education team |
| `Dual.agent.md` | DUAL's system prompt & responsibilities | Studio team |
| `JCODEMUNCH_MANDATE.md` | Token savings law (mandatory) | All teams |
| `NEXT_STEPS.md` | Enhancement roadmap to Higgsfield parity | Product |
| `SKILL.md` | Full codebase course (for onboarding) | All teams |
| `/learn/*` | Hana's territory (lessons, progress) | Hana team |
| `/studio/*` | DUAL's territory (generation, creation) | DUAL team |
| `/social-purpose/*` | Community (both agents) | Community team |

---

## 💬 Communication Channels

### Hana → Team
- Forum notifications: student questions/issues
- Weekly digest: trending topics
- Progress alerts: struggling students
- Achievement announcements: milestones

### DUAL → Team
- Generation metrics: speed, quality, uptime
- Model performance: which models used most
- Error reports: failed generations
- User feedback: character quality requests

### Both → Community
- Discord: announcements, support, events
- Email: weekly updates for active users
- Twitter: showcase best creations
- Blog: tutorials, tips, culture insights

---

## ✨ Pro Tips

1. **Always use jCodeMunch first.** Saves 85-97% tokens.
2. **Read the agent harness for your domain.** It has your whole job.
3. **Follow the NEXT_STEPS roadmap.** It's the product direction.
4. **Log jCodeMunch saves.** Weekly totals matter.
5. **Test on mobile.** Most students use phones.
6. **Celebrate wins.** Shipped a new lesson? That's an achievement.

---

**Last Updated:** 2026-05-04  
**Version:** 2.0  
**Status:** Ready to Ship
