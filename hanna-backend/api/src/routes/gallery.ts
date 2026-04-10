import { Hono } from 'hono'

export const galleryRoutes = new Hono()

// List gallery assets
galleryRoutes.get('/', async (c) => {
  return c.json({
    assets: [],
    total: 0,
    message: 'Connect Supabase storage to list 3D assets and renders',
  })
})

// Get single asset
galleryRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  return c.json({
    id,
    message: 'Connect Supabase storage to retrieve asset',
  })
})
