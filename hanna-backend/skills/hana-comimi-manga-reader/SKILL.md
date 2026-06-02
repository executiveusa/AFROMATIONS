# SKILL: hana-comimi-manga-reader

**Agent:** Hana (花)  
**Version:** 1.0.0  
**Status:** Active  

## What This Skill Does

This skill enables Hana to manage AFROMATIONS manga and comic content using `@yui540/comimi` as the reader engine.

Comimi is a TypeScript/JavaScript comic reader library. It is the viewer layer — not a generator.
Hana owns the creation workflow. Comimi owns the display.

## Trigger Phrases

- "Create a manga chapter from these images"
- "Turn this lesson into a manga chapter"
- "Publish DUAL Chapter [N]"
- "Create a Hana Japanese lesson as manga"
- "Add pages to [series] [chapter]"
- "Generate the manifest for [chapter]"
- "What chapters are in [series]?"

## Step-by-Step Procedures

### Create Chapter From Images
```
1. Ask: Do you own rights to all images? (confirm)
2. GET /api/hana/manga/series — check if series exists
3. If not: POST /api/hana/manga/series
4. POST /api/hana/manga/series/:slug/chapters
5. POST /api/hana/manga/chapters/:id/pages  (batch all pages)
6. GET /api/hana/manga/chapters/:id/manifest — confirm manifest valid
7. Return: /manga/[series]/[chapter]
```

### Create Lesson Manga Chapter
```
1. Break lesson content into page beats (cover, vocab, dialogue, cultural-note, quiz)
2. For each beat: create HTML page string
3. POST chapter with layout_mode: inline, reading_direction: ltr
4. POST pages (all type: html)
5. POST /api/hana/manga/chapters/:id/generate-lesson
6. Return reader link + lesson notes
```

### Publish Chapter
```
1. GET /api/hana/manga/series/:slug/chapters/:slug — verify all fields set
2. GET /api/hana/manga/chapters/:id/manifest — verify pages > 0
3. PATCH chapter status to published (via supabase direct or admin route)
4. POST generate-blog-brief
5. POST generate-social-pack
6. Confirm: "Chapter published at /manga/[series]/[chapter]"
```

## Copyright Safety Rule

Before creating any chapter with third-party imagery:
- Ask the user to confirm they own or have licensed the assets
- Do NOT proceed without confirmation
- Fan art references for personal study: OK
- Publishing fan art as original AFROMATIONS content: NOT OK
- Public domain art: OK with attribution

## Series Reference

| Slug | Title | Direction | Status |
|------|-------|-----------|--------|
| dual | DUAL | RTL | Published |
| hana-warriors-of-light | Hana: Warriors of Light | RTL | Draft |
| owpil | O.W.P.I.L | LTR | Draft |
| hana-academy | Hana Academy | LTR | Draft |
