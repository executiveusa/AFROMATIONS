# Hana Noble Goose Research Pipeline

**Source:** Noble Goose Anime (YouTube)  
**URL:** https://www.youtube.com/@noblegooseanime  
**Purpose:** AI anime production research for AFROMATIONS educational content

---

## Pipeline Overview

```
Noble Goose Anime Channel
         │
         ▼
   YouTube Crawler
   (public metadata only)
         │
         ▼
  hana_video_research
  (stored per video)
         │
         ▼
  Concept Extractor
  (Gemini analysis)
         │
         ▼
  hana_extracted_concepts
  (structured concepts)
         │
         ▼
  Content Brief Generator
         │
         ▼
  hana_content_briefs
         │
         ▼
  Content Generator
  (blog / script / social)
         │
         ▼
  Ralphy QA
  (originality + compliance)
         │
         ▼
  Approval Gate ←── Human Review
         │
         ▼
  Publishing Queue (Postiz)
         │
         ▼
  Published Content
```

---

## Crawl Phases

### Phase 1: Initial Crawl (Manual)
- Crawl latest 25 videos from channel
- Store metadata for all 25
- Begin concept extraction

**Command:** `POST /api/hana/research/noblegoose/latest` with `limit: 25`

### Phase 2: Daily Check
- Check for videos published since last crawl
- Store new video metadata
- Extract concepts from new videos

**Cron:** `hana.noblegoose.daily_check` — 0 8 * * *

### Phase 3: Weekly Summary
- Regenerate channel intelligence summary
- Update AI tools map
- Recommend content directions

**Cron:** `hana.content.weekly_blog_batch` — 0 10 * * 1

### Phase 4: Monthly Update
- Full AI anime tools capability map refresh
- Cross-reference with other research sources
- Update docs/HANA_ANIME_HARNESS.md tool registry

**Cron:** `hana.tools.monthly_ai_model_map` — 0 10 1 * *

---

## Data Flow

### Input (Public Metadata)
```
video_id       → "dQw4w9WgXcQ"
title          → "How I Made This AI Anime Fight Scene"
url            → "https://youtube.com/watch?v=dQw4w9WgXcQ"
description    → First 1000 chars
hashtags       → ["#AIAnime", "#animationtutorial"]
published_at   → "2025-01-15T14:00:00Z"
transcript     → Public excerpt if available via Firecrawl
```

### Extracted Concepts
```json
{
  "conceptType": "workflow",
  "title": "AI Fight Scene Production Pipeline",
  "summary": "Hana's analysis of a multi-stage AI anime fight scene workflow...",
  "tools": ["Kling AI", "ComfyUI", "Runway"],
  "workflowSteps": ["Generate base frames", "Add motion", "Composite"],
  "confidence": 0.85
}
```

### Generated Blog Draft
```
Title: "How to Build AI Anime Fight Scenes: Hana's AFROMATIONS Guide"
Category: Fight Scene Generation
Source Note: "Agent Hana studied public AI anime workflows..."
Status: draft (requires approval to publish)
```

---

## Compliance Checkpoints

| Step | Check |
|------|-------|
| Crawl | Public URLs only, no video downloads |
| Storage | Raw metadata ≠ copyrighted content |
| Extraction | Concepts, not verbatim script |
| Generation | Ralphy QA originality score ≥ 60 |
| Publishing | Human approval required |

---

## Status Tracking

Videos move through these states:
```
new → concepts_extracted → briefs_generated → content_generated → published
                                                                ↗
                                              approved (human) →
```
