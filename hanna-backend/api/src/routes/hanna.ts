import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.string().optional(),
})

const avatarSchema = z.object({
  character_name: z.string().min(1).max(100),
  style: z.enum(['anime', 'chibi', 'semi-realistic']).default('anime'),
  hair_color: z.string().default('accent4'),
  pose: z.string().default('standing'),
  description: z.string().optional(),
})

export const hannaRoutes = new Hono()

// Chat with Hanna
hannaRoutes.post('/chat', zValidator('json', chatSchema), async (c) => {
  const { message, context } = c.req.valid('json')

  return c.json({
    agent: 'Hanna',
    response: `Received: "${message}". Hanna is processing your request.`,
    status: 'queued',
    timestamp: new Date().toISOString(),
  })
})

// Generate anime avatar
hannaRoutes.post('/avatar', zValidator('json', avatarSchema), async (c) => {
  const body = c.req.valid('json')

  return c.json({
    agent: 'Hanna',
    task: 'avatar_generation',
    character: body.character_name,
    style: body.style,
    status: 'queued',
    message: `Avatar "${body.character_name}" queued for generation in ${body.style} style.`,
    timestamp: new Date().toISOString(),
  })
})

// Render scene
hannaRoutes.post('/render', async (c) => {
  return c.json({
    agent: 'Hanna',
    task: 'render',
    status: 'queued',
    message: 'Render job queued. Alpha agent will process.',
    timestamp: new Date().toISOString(),
  })
})

// Export GLB
hannaRoutes.post('/export', async (c) => {
  return c.json({
    agent: 'Hanna',
    task: 'export',
    status: 'queued',
    formats: ['glb', 'fbx', 'png'],
    timestamp: new Date().toISOString(),
  })
})
