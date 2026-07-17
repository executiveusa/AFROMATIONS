# Hana Comimi Manga Reader

**Status:** Active  
**Package:** `@yui540/comimi`  
**MIT Licensed**

---

## What Comimi Is

`@yui540/comimi` is an open-source TypeScript/JavaScript comic reader library. It lets you embed a manga viewer into a website and works standalone without React or other UI frameworks.

It exposes `createMangaViewer(container, config)` and supports:
- Image pages and HTML pages
- Right-to-left (RTL) manga reading
- Left-to-right (LTR) western comics
- Page turn modes: single, spread
- Layout modes: inline, browser fullscreen
- Auto page turn
- Zoom, keyboard shortcuts, gestures
- IndexedDB progress saving
- i18n (English, Japanese, more)
- Authenticated/DRM-style page loading via `resolvePageSrc`

## What Comimi Is NOT

- Not an AI manga generator
- Not a manga marketplace
- Not a content management system
- Not a scraper or distribution platform

## How Hana Uses Comimi

```
Comimi   = viewer UI (display layer)
Hana     = manga/lesson creator (workflow layer)
Supabase = series/chapter/page database
Storage  = page assets (images, HTML)
Postiz   = chapter promo distribution
Ralphy   = QA before publish
```

Hana creates chapters. Comimi displays them.

---

## Architecture

```
Agent Hana
  ↓
Manga Skill (hana-comimi-manga-reader)
  ↓
Chapter Manifest Generator
  ↓
AFROMATIONS Backend API (Hono/Cloudflare Workers)
  ↓
Supabase (hana_manga_series / chapters / pages / progress)
  ↓
Comimi Reader Component (ComimiReader.tsx)
  ↓
/manga/[seriesSlug]/[chapterSlug]
```

---

## Data Model

### hana_manga_series
Stores series-level metadata: slug, title, reading direction, status, cover image.

### hana_manga_chapters
Stores chapter metadata: which series, slug, title, access level (public/private/paid), Comimi settings, status.

### hana_manga_pages
Stores individual pages: index, type (image or html), image URL or HTML string, alt text, label.

### hana_reader_progress
Tracks learner reading progress per chapter: current page index, completed flag.

### hana_manga_chapter_lessons
Stores lesson metadata generated from chapters: objectives, vocabulary, cultural notes, quiz.

---

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
| POST | /api/hana/manga/chapters/:id/pages | Add pages (batch) |
| GET | /api/hana/manga/chapters/:id/manifest | Comimi manifest |
| POST | /api/hana/manga/chapters/:id/generate-manifest | Queue manifest regen |
| POST | /api/hana/manga/progress | Save reader progress |
| GET | /api/hana/manga/progress/:chapterId | Get reader progress |
| POST | /api/hana/manga/chapters/:id/generate-lesson | Queue lesson gen |
| POST | /api/hana/manga/chapters/:id/generate-blog-brief | Queue blog brief |
| POST | /api/hana/manga/chapters/:id/generate-social-pack | Queue social pack |

---

## Frontend Components

### ComimiReader.tsx
`afromations-frontend/src/components/manga/ComimiReader.tsx`

- Client component (dynamic import, no SSR crash)
- Accepts manifest prop or manifestUrl
- Mounts Comimi viewer into container ref
- Destroys viewer on unmount
- Saves page progress via POST /api/hana/manga/progress
- Handles loading and error states

### MangaChapterReader.tsx
`afromations-frontend/src/components/manga/MangaChapterReader.tsx`

- Fetches chapter metadata from backend
- Fetches manifest from backend
- Renders ComimiReader with loaded manifest
- Shows graceful error/placeholder when chapter is in production

---

## Frontend Routes

| Route | Purpose |
|-------|---------|
| /manga | Landing — series grid + Hana Chronicles issues |
| /manga/[seriesSlug] | Series detail with chapter list |
| /manga/[seriesSlug]/[chapterSlug] | Comimi reader page |
| /learn/manga-lessons | Manga lessons landing (Hana Academy) |
| /learn/manga-lessons/[chapterSlug] | Lesson reader (invite-only) |

---

## Copyright Rules

- NEVER publish panels the studio does not own or have rights to
- NEVER scrape and republish copyrighted manga
- Only use: original AFROMATIONS assets, licensed assets, public-domain assets, user-authorized assets
- Fan references: study only, not publication
- Private/paid chapters: require access checks
- External publishing: requires human approval

---

## Future Monetization

1. **Free preview chapters** — first N pages public
2. **Paid member chapters** — access_level: paid, require auth + subscription
3. **Token/credit unlocks** — pay-per-chapter for one-time reads
4. **Teacher-reviewed manga lessons** — certified Japanese/culture lessons
5. **PDF export** — downloadable chapter PDFs for members
6. **Print-on-demand** — physical manga via partner printer

---

## Launch Checklist

- [x] @yui540/comimi installed in afromations-frontend
- [x] Migration 003 written (hana_manga_series, chapters, pages, progress, lessons)
- [x] Backend routes: hana-manga-reader.ts (15 routes)
- [x] Routes registered in index.ts
- [x] Frontend types: lib/manga/types.ts
- [x] ComimiReader component (client, no SSR crash)
- [x] MangaChapterReader component
- [x] /manga page updated with series grid
- [x] /manga/[seriesSlug] route
- [x] /manga/[seriesSlug]/[chapterSlug] route
- [x] /learn/manga-lessons route
- [x] /learn/manga-lessons/[chapterSlug] route
- [x] Skill files created
- [x] Seed data: 4 series, 3 chapters, 4 placeholder pages for DUAL Ch.1
- [ ] Apply migration to Supabase (run 003_hana_manga_reader.sql)
- [ ] Add nav/footer links for /manga
- [ ] Real asset images uploaded for DUAL Ch.1
- [ ] Auth integration for paid/private chapters
- [ ] resolvePageSrc for signed URLs
