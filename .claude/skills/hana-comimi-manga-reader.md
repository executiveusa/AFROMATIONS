# Skill: hana-comimi-manga-reader

**Version:** 1.0.0  
**Agent:** Hana  
**Status:** Active

## Purpose

Hana can create, manage, publish, and teach through manga-style chapters using Comimi as the reader engine.

## Capabilities

- Build manga chapter manifests for the Comimi viewer
- Convert image lists into Comimi `pages` arrays
- Support image pages and HTML pages
- Support Japanese right-to-left (RTL) manga reading
- Support English left-to-right (LTR) comics
- Create interactive lesson chapters with HTML teaching pages
- Create DUAL story chapters
- Create OWPIL documentary comic chapters
- Track reader progress via backend API
- Generate social/blog promo copy for each chapter
- Generate lesson notes from each chapter
- Use signed/authenticated page URLs when needed
- Protect private/paid chapters (return 403)
- Enforce copyright safety

## Architecture

```
Agent Hana
  ↓
Manga Skill
  ↓
Chapter Manifest Generator
  ↓
AFROMATIONS Manga API (/api/hana/manga/...)
  ↓
Comimi Reader Component (ComimiReader.tsx)
  ↓
Reader UI — /manga/[series]/[chapter]
```

## Backend Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | /api/hana/manga/health | Health check |
| GET | /api/hana/manga/series | List all series |
| POST | /api/hana/manga/series | Create series |
| GET | /api/hana/manga/series/:slug | Get series |
| GET | /api/hana/manga/series/:slug/chapters | List chapters |
| POST | /api/hana/manga/series/:slug/chapters | Create chapter |
| GET | /api/hana/manga/series/:slug/chapters/:slug | Get chapter |
| POST | /api/hana/manga/chapters/:id/pages | Add pages |
| GET | /api/hana/manga/chapters/:id/manifest | Get Comimi manifest |
| POST | /api/hana/manga/progress | Save reader progress |
| GET | /api/hana/manga/progress/:chapterId | Get progress |
| POST | /api/hana/manga/chapters/:id/generate-lesson | Queue lesson generation |
| POST | /api/hana/manga/chapters/:id/generate-blog-brief | Queue blog brief |
| POST | /api/hana/manga/chapters/:id/generate-social-pack | Queue social pack |

## Frontend Routes

| Route | Purpose |
|-------|---------|
| /manga | Manga landing — series grid + Hana Chronicles |
| /manga/[seriesSlug] | Series page with chapter list |
| /manga/[seriesSlug]/[chapterSlug] | Comimi reader page |
| /learn/manga-lessons | Manga lessons landing |
| /learn/manga-lessons/[chapterSlug] | Lesson reader (invite-only) |

## Comimi Config Defaults

**Japanese manga:**
```json
{ "readingDirection": "rtl", "pageTurnMode": "single", "layoutMode": "inline", "hasCover": true, "backgroundColor": "black" }
```

**Western comic:**
```json
{ "readingDirection": "ltr", "pageTurnMode": "single", "layoutMode": "inline", "hasCover": true, "backgroundColor": "black" }
```

## Guardrails

- NEVER publish manga panels the studio does not own or have rights to
- NEVER scrape and republish copyrighted manga
- Only use original AFROMATIONS assets, licensed assets, public-domain assets, or user-provided authorized assets
- Fan references may be used for study, not publication
- Paid/private chapters require access checks and return 403 if unauthorized
- External publishing requires approval mode

## Workflows

**"Create a manga chapter from these 12 images"**
1. Validate ownership/rights
2. Upload/store images
3. Create series if missing
4. Create chapter via POST /api/hana/manga/series/:slug/chapters
5. Create pages via POST /api/hana/manga/chapters/:id/pages
6. Fetch manifest from GET /api/hana/manga/chapters/:id/manifest
7. Return reader link: /manga/[series]/[chapter]

**"Turn this lesson into a manga lesson"**
1. Break lesson into page beats
2. Generate HTML pages (type: html)
3. Create chapter with layout_mode: inline
4. Add lesson metadata via generate-lesson endpoint
5. Return reader link

**"Publish DUAL Chapter 1"**
1. Verify all pages exist
2. Check metadata completeness
3. Update status to published
4. POST /api/hana/manga/chapters/:id/generate-blog-brief
5. POST /api/hana/manga/chapters/:id/generate-social-pack

## Database Tables

- `hana_manga_series` — Series metadata
- `hana_manga_chapters` — Chapter metadata and settings
- `hana_manga_pages` — Page content (image or HTML)
- `hana_reader_progress` — Reader progress tracking
- `hana_manga_chapter_lessons` — Lesson metadata and quiz content
