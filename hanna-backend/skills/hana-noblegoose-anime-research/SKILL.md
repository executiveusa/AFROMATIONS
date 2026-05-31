# Skill: hana-noblegoose-anime-research

**Agent:** Hana (花)  
**Studio:** AFROMATIONS Studios  
**Version:** 1.0.0

---

## Purpose

Teach Hana how to research Noble Goose Anime's public YouTube channel, extract AI anime production concepts, and transform that research into **original AFROMATIONS educational content**.

This skill does NOT copy Noble Goose content. It uses public metadata as research input to create transformative teaching assets from the AFROMATIONS perspective.

---

## Source Channel

- **Channel:** Noble Goose Anime  
- **URL:** https://www.youtube.com/@noblegooseanime  
- **Default crawl count:** 25 latest videos  
- **Platform:** YouTube (public)

---

## What Hana Extracts (Copyright-Safe)

From each video's **public metadata only**:

| Field | Source | Notes |
|-------|--------|-------|
| Title | Public | Full |
| Video ID | Public | For deduplication |
| URL | Public | Full |
| Publish date | Public | Full |
| Duration | Public if available | |
| View count | Public if available | |
| Description | Public | First 1000 chars |
| Hashtags | Public | Extracted from description |
| Transcript | Public (via Firecrawl) | Excerpt only, for concept analysis |

**Never extracted:**
- Creator's full script
- Thumbnails (no copying)
- Audio or video content
- Private or paid content

---

## What Hana Generates (Original AFROMATIONS Assets)

For each researched video, Hana creates 10 original derived assets:

1. **Internal Research Note** — structured analysis of the video topic
2. **Technique Summary** — concise explanation of the production technique
3. **Hana Lesson Outline** — structured lesson from AFROMATIONS perspective
4. **Blog Post Draft** — original article for AFROMATIONS blog
5. **YouTube Episode Script Idea** — Hana's take on a similar topic
6. **Short-Form Clip Script** — 60-90 second social video script
7. **Social Post Pack** — Twitter/Instagram/TikTok/LinkedIn posts
8. **Studio Workflow Checklist** — actionable steps for anime creators
9. **Tool Comparison Note** — objective comparison of tools discussed
10. **Prompt Template Pack** — image/video generation prompts

---

## Invocation

### Initial Crawl (run once)
```
POST /api/hana/research/noblegoose/latest
{ "limit": 25 }
```

### Extract Concepts from a Video
```
POST /api/hana/research/videos/:id/extract-concepts
```

### Get Channel Intelligence Summary
```
GET /api/hana/research/noblegoose/summary
```

### Via CLI (cron)
```
POST /api/hana/cron/run/hana.noblegoose.initial_crawl
```

---

## Cron Schedule

| Job | Schedule | Action |
|-----|----------|--------|
| `hana.noblegoose.initial_crawl` | Manual | Crawl latest 25 videos |
| `hana.noblegoose.daily_check` | Daily 8am UTC | Check for new videos |
| `hana.content.weekly_blog_batch` | Monday 10am UTC | Generate 3 draft blogs |
| `hana.tools.monthly_ai_model_map` | Monthly | Update AI tools map |

---

## Voice & Attribution

All generated content must:

✅ Say: *"Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide."*  
✅ Include source citation for internal tracking  
✅ Be rewritten in Hana's educational voice  
✅ Add AFROMATIONS-specific examples and perspective  

❌ Never say: *"Copied from Noble Goose"*  
❌ Never reproduce the creator's script verbatim  
❌ Never claim the original creator's ideas as AFROMATIONS's invention  

---

## Blog Categories

Generated blog posts are filed under:
- AI Anime Tools
- Anime Production Workflow  
- Prompt Engineering
- Character Consistency
- Fight Scene Generation
- AI Video Models
- AI Image Models
- Music + Anime
- Studio Builds
- Hana Lessons

---

## Memory Storage

Research results are stored in:
- `hana_research_sources` — channel source record
- `hana_video_research` — per-video metadata
- `hana_extracted_concepts` — structured concepts
- `hana_content_briefs` — content planning records
- `hana_generated_content` — generated assets
- `hana_memory_nodes` — knowledge graph nodes
