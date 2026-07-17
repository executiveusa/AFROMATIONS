import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseQuery, supabaseInsert, supabaseUpsert } from '../lib/supabase'

export const hanaMangaReaderRoutes = new Hono()

// ============================================================
// GET /api/hana/manga/health
// ============================================================
hanaMangaReaderRoutes.get('/manga/health', (c) =>
  c.json({ status: 'ok', system: 'hana-manga-reader', ts: new Date().toISOString() })
)

// ============================================================
// GET /api/hana/manga/series — List all series
// ============================================================
hanaMangaReaderRoutes.get('/manga/series', async (c) => {
  try {
    const result = await supabaseQuery(c, 'hana_manga_series', {
      select: 'id,slug,title,subtitle,description,series_type,reading_direction,status,cover_image_url,created_at',
      order: 'created_at',
    })
    if (!Array.isArray(result)) return c.json({ error: 'Failed to fetch series' }, 500)
    return c.json({ series: result })
  } catch (err) {
    console.error('List series error:', err)
    return c.json({ error: 'Failed to fetch series' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/series — Create series
// ============================================================
const createSeriesSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  seriesType: z.enum(['manga', 'comic', 'lesson']).default('manga'),
  readingDirection: z.enum(['rtl', 'ltr']).default('rtl'),
  status: z.enum(['draft', 'published']).default('draft'),
  coverImageUrl: z.string().optional(),
})

hanaMangaReaderRoutes.post('/manga/series', zValidator('json', createSeriesSchema), async (c) => {
  try {
    const body = c.req.valid('json')
    const result = await supabaseInsert(c, 'hana_manga_series', {
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      series_type: body.seriesType,
      reading_direction: body.readingDirection,
      status: body.status,
      cover_image_url: body.coverImageUrl,
      created_by_agent: 'hana',
    })
    return c.json({ series: Array.isArray(result) ? result[0] : result }, 201)
  } catch (err) {
    console.error('Create series error:', err)
    return c.json({ error: 'Failed to create series' }, 500)
  }
})

// ============================================================
// GET /api/hana/manga/series/:seriesSlug
// ============================================================
hanaMangaReaderRoutes.get('/manga/series/:seriesSlug', async (c) => {
  try {
    const seriesSlug = c.req.param('seriesSlug')
    const result = await supabaseQuery(c, 'hana_manga_series', {
      select: '*',
      eq: { slug: seriesSlug },
      limit: 1,
    })
    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ error: 'Series not found' }, 404)
    }
    return c.json({ series: result[0] })
  } catch (err) {
    console.error('Get series error:', err)
    return c.json({ error: 'Failed to fetch series' }, 500)
  }
})

// ============================================================
// GET /api/hana/manga/series/:seriesSlug/chapters
// ============================================================
hanaMangaReaderRoutes.get('/manga/series/:seriesSlug/chapters', async (c) => {
  try {
    const seriesSlug = c.req.param('seriesSlug')

    const seriesResult = await supabaseQuery(c, 'hana_manga_series', {
      select: 'id',
      eq: { slug: seriesSlug },
      limit: 1,
    })
    if (!Array.isArray(seriesResult) || seriesResult.length === 0) {
      return c.json({ error: 'Series not found' }, 404)
    }
    const seriesId = seriesResult[0].id

    const chapters = await supabaseQuery(c, 'hana_manga_chapters', {
      select: 'id,slug,title,subtitle,chapter_number,summary,status,access_level,cover_image_url,published_at',
      eq: { series_id: seriesId },
      order: 'chapter_number',
    })
    if (!Array.isArray(chapters)) return c.json({ error: 'Failed to fetch chapters' }, 500)

    return c.json({ seriesId, chapters })
  } catch (err) {
    console.error('List chapters error:', err)
    return c.json({ error: 'Failed to fetch chapters' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/series/:seriesSlug/chapters
// ============================================================
const createChapterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  chapterNumber: z.number().optional(),
  summary: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  accessLevel: z.enum(['public', 'private', 'paid']).default('public'),
  readingDirection: z.enum(['rtl', 'ltr']).optional(),
  hasCover: z.boolean().default(true),
  pageTurnMode: z.enum(['single', 'spread']).default('single'),
  layoutMode: z.enum(['inline', 'browserFullscreen']).default('inline'),
  coverImageUrl: z.string().optional(),
})

hanaMangaReaderRoutes.post(
  '/manga/series/:seriesSlug/chapters',
  zValidator('json', createChapterSchema),
  async (c) => {
    try {
      const seriesSlug = c.req.param('seriesSlug')
      const body = c.req.valid('json')

      const seriesResult = await supabaseQuery(c, 'hana_manga_series', {
        select: 'id,reading_direction',
        eq: { slug: seriesSlug },
        limit: 1,
      })
      if (!Array.isArray(seriesResult) || seriesResult.length === 0) {
        return c.json({ error: 'Series not found' }, 404)
      }

      const result = await supabaseInsert(c, 'hana_manga_chapters', {
        series_id: seriesResult[0].id,
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle,
        chapter_number: body.chapterNumber,
        summary: body.summary,
        status: body.status,
        access_level: body.accessLevel,
        reading_direction: body.readingDirection ?? seriesResult[0].reading_direction,
        has_cover: body.hasCover,
        page_turn_mode: body.pageTurnMode,
        layout_mode: body.layoutMode,
        cover_image_url: body.coverImageUrl,
        published_at: body.status === 'published' ? new Date().toISOString() : null,
      })
      return c.json({ chapter: Array.isArray(result) ? result[0] : result }, 201)
    } catch (err) {
      console.error('Create chapter error:', err)
      return c.json({ error: 'Failed to create chapter' }, 500)
    }
  }
)

// ============================================================
// GET /api/hana/manga/series/:seriesSlug/chapters/:chapterSlug
// ============================================================
hanaMangaReaderRoutes.get('/manga/series/:seriesSlug/chapters/:chapterSlug', async (c) => {
  try {
    const { seriesSlug, chapterSlug } = c.req.param()

    const seriesResult = await supabaseQuery(c, 'hana_manga_series', {
      select: 'id,reading_direction,status',
      eq: { slug: seriesSlug },
      limit: 1,
    })
    if (!Array.isArray(seriesResult) || seriesResult.length === 0) {
      return c.json({ error: 'Series not found' }, 404)
    }

    const chapters = await supabaseQuery(c, 'hana_manga_chapters', {
      select: '*',
      eq: { series_id: seriesResult[0].id, slug: chapterSlug },
      limit: 1,
    })
    if (!Array.isArray(chapters) || chapters.length === 0) {
      return c.json({ error: 'Chapter not found' }, 404)
    }

    const chapter = chapters[0]
    if (chapter.access_level === 'private' || chapter.access_level === 'paid') {
      return c.json({ error: 'This chapter requires access. Check back soon.' }, 403)
    }

    return c.json({ chapter })
  } catch (err) {
    console.error('Get chapter error:', err)
    return c.json({ error: 'Failed to fetch chapter' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/chapters/:chapterId/pages — Batch add pages
// ============================================================
const addPagesSchema = z.object({
  pages: z.array(
    z.object({
      pageIndex: z.number(),
      pageId: z.string(),
      pageType: z.enum(['image', 'html']).default('image'),
      imageUrl: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      html: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      alt: z.string().optional(),
      label: z.string().optional(),
    })
  ),
})

hanaMangaReaderRoutes.post(
  '/manga/chapters/:chapterId/pages',
  zValidator('json', addPagesSchema),
  async (c) => {
    try {
      const chapterId = c.req.param('chapterId')
      const { pages } = c.req.valid('json')

      const inserted = await Promise.all(
        pages.map((p) =>
          supabaseInsert(c, 'hana_manga_pages', {
            chapter_id: chapterId,
            page_index: p.pageIndex,
            page_id: p.pageId,
            page_type: p.pageType,
            image_url: p.imageUrl,
            thumbnail_url: p.thumbnailUrl,
            html: p.html,
            width: p.width,
            height: p.height,
            alt: p.alt,
            label: p.label,
          })
        )
      )

      return c.json({ inserted: inserted.length }, 201)
    } catch (err) {
      console.error('Add pages error:', err)
      return c.json({ error: 'Failed to add pages' }, 500)
    }
  }
)

// ============================================================
// GET /api/hana/manga/chapters/:chapterId/manifest — Comimi manifest
// ============================================================
hanaMangaReaderRoutes.get('/manga/chapters/:chapterId/manifest', async (c) => {
  try {
    const chapterId = c.req.param('chapterId')

    const chapterResult = await supabaseQuery(c, 'hana_manga_chapters', {
      select: 'id,title,status,access_level,reading_direction,has_cover,page_turn_mode,layout_mode,series_id',
      eq: { id: chapterId },
      limit: 1,
    })
    if (!Array.isArray(chapterResult) || chapterResult.length === 0) {
      return c.json({ error: 'Chapter not found' }, 404)
    }

    const chapter = chapterResult[0]

    if (chapter.access_level === 'private' || chapter.access_level === 'paid') {
      return c.json({ error: 'Access denied' }, 403)
    }

    const pages = await supabaseQuery(c, 'hana_manga_pages', {
      select: 'page_index,page_id,page_type,image_url,thumbnail_url,html,alt,label',
      eq: { chapter_id: chapterId },
      order: 'page_index',
    })
    if (!Array.isArray(pages)) return c.json({ error: 'Failed to fetch pages' }, 500)

    const manifest = {
      manga: {
        id: chapterId,
        title: chapter.title,
        author: 'AFROMATIONS',
        pages: pages.map((p) => ({
          id: p.page_id,
          type: p.page_type,
          ...(p.page_type === 'image'
            ? { src: p.image_url, thumbnailSrc: p.thumbnail_url }
            : { html: p.html }),
          alt: p.alt,
          label: p.label,
        })),
      },
      settings: {
        layoutMode: chapter.layout_mode ?? 'inline',
        readingDirection: chapter.reading_direction ?? 'rtl',
        hasCover: chapter.has_cover ?? true,
        pageTurnMode: chapter.page_turn_mode ?? 'single',
        backgroundColor: 'black',
      },
      locale: 'en',
    }

    return c.json(manifest)
  } catch (err) {
    console.error('Manifest error:', err)
    return c.json({ error: 'Failed to generate manifest' }, 500)
  }
})

// ============================================================
// POST /api/hana/manga/chapters/:chapterId/generate-manifest
// ============================================================
hanaMangaReaderRoutes.post('/manga/chapters/:chapterId/generate-manifest', async (c) => {
  const chapterId = c.req.param('chapterId')
  return c.json({ chapterId, manifestUrl: `/api/hana/manga/chapters/${chapterId}/manifest`, ts: new Date().toISOString() })
})

// ============================================================
// POST /api/hana/manga/progress — Save reader progress
// ============================================================
const progressSchema = z.object({
  learnerId: z.string().uuid(),
  chapterId: z.string().uuid(),
  currentPageIndex: z.number().int().min(0),
  completed: z.boolean().default(false),
})

hanaMangaReaderRoutes.post('/manga/progress', zValidator('json', progressSchema), async (c) => {
  try {
    const body = c.req.valid('json')

    await supabaseUpsert(
      c,
      'hana_reader_progress',
      {
        learner_id: body.learnerId,
        chapter_id: body.chapterId,
        current_page_index: body.currentPageIndex,
        completed: body.completed,
        completed_at: body.completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      'learner_id,chapter_id'
    )

    return c.json({ saved: true })
  } catch (err) {
    console.error('Progress save error:', err)
    return c.json({ error: 'Failed to save progress' }, 500)
  }
})

// ============================================================
// GET /api/hana/manga/progress/:chapterId — Get progress
// ============================================================
hanaMangaReaderRoutes.get('/manga/progress/:chapterId', async (c) => {
  try {
    const chapterId = c.req.param('chapterId')
    const learnerId = c.req.query('learnerId')

    if (!learnerId) return c.json({ currentPageIndex: 0, completed: false })

    const result = await supabaseQuery(c, 'hana_reader_progress', {
      select: 'current_page_index,completed,completed_at,updated_at',
      eq: { learner_id: learnerId, chapter_id: chapterId },
      limit: 1,
    })

    if (!Array.isArray(result) || result.length === 0) {
      return c.json({ currentPageIndex: 0, completed: false })
    }

    return c.json({
      currentPageIndex: result[0].current_page_index,
      completed: result[0].completed,
      completedAt: result[0].completed_at,
      updatedAt: result[0].updated_at,
    })
  } catch (err) {
    console.error('Get progress error:', err)
    return c.json({ currentPageIndex: 0, completed: false })
  }
})

// ============================================================
// POST /api/hana/manga/chapters/:chapterId/generate-lesson
// ============================================================
hanaMangaReaderRoutes.post('/manga/chapters/:chapterId/generate-lesson', async (c) => {
  const chapterId = c.req.param('chapterId')
  return c.json({
    chapterId,
    message: 'Lesson generation queued. Hana will process this chapter into lesson notes.',
    status: 'queued',
    ts: new Date().toISOString(),
  })
})

// ============================================================
// POST /api/hana/manga/chapters/:chapterId/generate-blog-brief
// ============================================================
hanaMangaReaderRoutes.post('/manga/chapters/:chapterId/generate-blog-brief', async (c) => {
  const chapterId = c.req.param('chapterId')
  return c.json({
    chapterId,
    message: 'Blog brief generation queued.',
    status: 'queued',
    ts: new Date().toISOString(),
  })
})

// ============================================================
// POST /api/hana/manga/chapters/:chapterId/generate-social-pack
// ============================================================
hanaMangaReaderRoutes.post('/manga/chapters/:chapterId/generate-social-pack', async (c) => {
  const chapterId = c.req.param('chapterId')
  return c.json({
    chapterId,
    message: 'Social pack generation queued.',
    status: 'queued',
    ts: new Date().toISOString(),
  })
})
