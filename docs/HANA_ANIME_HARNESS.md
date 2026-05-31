# HANA ANIME HARNESS

**System:** AFROMATIONS Studios — AI Anime Media Engine  
**Version:** 1.0.0  
**Status:** Production-ready (approval mode enabled by default)

---

## Overview

The Hana Anime Harness is a durable, observable AI workflow system that powers Agent Hana's role as an anime studio educator, researcher, publisher, and social distribution agent.

Every time Hana researches, creates, posts, or learns — the system stores reusable knowledge and improves the studio's content engine.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  HANA PUBLIC LAYER                                             │
│  Chat · Teaching · Content Strategy · Approval Workflow        │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│  RESEARCH LAYER                                                 │
│  Bright Data MCP · Firecrawl · YouTube Crawler                 │
│  Transcript Analyzer · Source Registry · Concept Extractor     │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│  KNOWLEDGE LAYER                                                │
│  hana_research_sources · hana_video_research                   │
│  hana_extracted_concepts · hana_memory_nodes/edges             │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│  CREATION LAYER                                                 │
│  Blog Generator · YouTube Script · Shorts Script               │
│  Social Post Generator · Lesson Generator · Model Router       │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│  PUBLISHING LAYER                                               │
│  Postiz · Approval Mode · Dry-Run Mode · Cron Jobs             │
└─────────────────────────┬──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│  QA LAYER (RALPHY)                                              │
│  Originality Check · Compliance Gate · Publishing Policy       │
└────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Research
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/hana/research/sources` | Register a research source |
| GET | `/api/hana/research/sources` | List sources |
| POST | `/api/hana/research/crawl-youtube-channel` | Crawl any YouTube channel |
| GET | `/api/hana/research/videos` | List researched videos |
| POST | `/api/hana/research/videos/:id/extract-concepts` | Extract AI concepts |
| POST | `/api/hana/research/noblegoose/latest` | Crawl Noble Goose Anime |
| GET | `/api/hana/research/noblegoose/summary` | Channel intelligence summary |

### Content
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/hana/content/briefs` | Create content brief |
| GET | `/api/hana/content/briefs` | List briefs |
| POST | `/api/hana/content/generate-blog` | Generate blog post |
| POST | `/api/hana/content/generate-youtube-script` | Generate YouTube script |
| POST | `/api/hana/content/generate-shorts-pack` | Generate Shorts script |
| POST | `/api/hana/content/generate-social-pack` | Generate social post pack |
| GET | `/api/hana/content/generated` | List generated content |
| POST | `/api/hana/content/:id/originality-check` | Run originality check |

### Publishing
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/hana/publishing/postiz/connect-test` | Test Postiz connection |
| POST | `/api/hana/publishing/social-queue` | Queue a social post |
| GET | `/api/hana/publishing/social-queue` | View queue |
| POST | `/api/hana/publishing/social-queue/:id/approve` | Approve post |
| POST | `/api/hana/publishing/social-queue/:id/reject` | Reject post |
| POST | `/api/hana/publishing/social-queue/:id/publish` | Publish single post |
| POST | `/api/hana/publishing/social-queue/publish-approved` | Bulk publish approved |

### System
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/hana/harness/health` | Full integration health |
| GET | `/api/hana/cron` | List cron jobs |
| POST | `/api/hana/cron/run/:jobKey` | Run job now |
| POST | `/api/hana/wallet/ledger` | View wallet |
| POST | `/api/hana/wallet/record` | Record revenue |
| POST | `/api/hana/wallet/request-payout` | Request payout (pending approval) |

---

## Environment Variables

```bash
# Required
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
GEMINI_API_KEY=...

# Recommended
FIRECRAWL_API_KEY=...          # Web scraping (Bright Data fallback)
YOUTUBE_DATA_API_KEY=...       # YouTube Data API v3

# Optional
BRIGHT_DATA_MCP_URL=...        # Primary scraper
BRIGHT_DATA_API_KEY=...
HUGGINGFACE_API_KEY=...        # AI model fallback
POSTIZ_API_URL=...             # Social publishing
POSTIZ_API_KEY=...
AGENTMAIL_API_URL=...          # Email outreach
AGENTMAIL_API_KEY=...

# Policy flags (safe defaults)
HANA_PUBLISHING_APPROVAL_MODE=true
HANA_DRY_RUN_PUBLISHING=true
HANA_AUTOPUBLISH_ENABLED=false
```

---

## AI Model Registry

| Variable | Default | Purpose |
|----------|---------|---------|
| `HANA_TEXT_MODEL` | `mistralai/Mistral-7B-Instruct-v0.2` | Text generation (HuggingFace fallback) |
| `HANA_IMAGE_MODEL` | `black-forest-labs/FLUX.1-schnell` | Image generation |
| `HANA_AUDIO_MODEL` | _(unset)_ | Audio/music generation |
| `HANA_VIDEO_MODEL` | _(unset)_ | Video prompt generation |

Primary model: **Gemini 2.0 Flash** (via `GEMINI_API_KEY`)

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `hana_research_sources` | YouTube channels and research sources |
| `hana_video_research` | Per-video metadata and crawl records |
| `hana_extracted_concepts` | AI concepts from video research |
| `hana_content_briefs` | Content planning briefs |
| `hana_generated_content` | Blog, scripts, social posts |
| `hana_social_queue` | Social publishing queue |
| `hana_cron_jobs` | Scheduled job registry |
| `hana_wallet_ledger` | Revenue/payout tracking |
| `hana_memory_nodes` | Knowledge graph nodes |
| `hana_memory_edges` | Knowledge graph relationships |
| `hana_mail_drafts` | Outreach email drafts |
