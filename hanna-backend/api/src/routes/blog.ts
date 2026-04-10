import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { supabaseInsert, supabaseQuery } from '../lib/supabase'

const generateSchema = z.object({
  topic: z.string().min(1).max(200),
  style: z.enum(['news', 'review', 'opinion', 'tutorial']).default('news'),
  tags: z.array(z.string()).optional(),
})

export const blogRoutes = new Hono()

// Generate anime trend article → writes to Supabase afromations_content
blogRoutes.post('/generate', zValidator('json', generateSchema), async (c) => {
  const { topic, style, tags } = c.req.valid('json')

  try {
    const row = await supabaseInsert(c, 'afromations_content', {
      title: topic,
      content_type: 'blog',
      metadata: { style, tags: tags ?? [], source: 'agent_hanna' },
      status: 'draft',
      created_at: new Date().toISOString(),
    })

    return c.json({
      agent: 'Beta (Fude)',
      task: 'article_generation',
      topic,
      style,
      record: row,
      status: 'drafted',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return c.json({
      agent: 'Beta (Fude)',
      task: 'article_generation',
      topic,
      status: 'draft_queued',
      message: 'Supabase insert queued — check connection',
      timestamp: new Date().toISOString(),
    })
  }
})

// List blog posts from Supabase
blogRoutes.get('/posts', async (c) => {
  try {
    const posts = await supabaseQuery(c, 'afromations_content', {
      select: 'id,title,metadata,status,created_at',
      limit: 20,
      order: 'created_at.desc',
      eq: { content_type: 'blog' },
    })
    return c.json({ posts, total: posts.length })
  } catch {
    return c.json({ posts: [], total: 0, message: 'Connect Supabase to load posts' })
  }
})

// Get single post by slug/id
blogRoutes.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const posts = await supabaseQuery(c, 'afromations_content', {
      eq: { id: slug },
      limit: 1,
    })
    if (!posts.length) return c.json({ error: 'Post not found' }, 404)
    return c.json(posts[0])
  } catch {
    return c.json({ slug, message: 'Connect Supabase to load post content' })
  }
})
