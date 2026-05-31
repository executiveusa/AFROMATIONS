import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { supabaseInsert } from '../lib/supabase'

const artistApplicationSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  age21Confirmed: z.literal(true, { errorMap: () => ({ message: 'Must confirm 21+ age requirement' }) }),
  artistType: z.array(z.string()).min(1),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  hasOriginalCharacters: z.enum(['yes', 'in_progress', 'no']),
  wantHanaToHelp: z.string().max(2000).optional(),
  interests: z.array(z.string()).optional(),
  interestedInDemo: z.boolean().optional(),
  openToBuildInPublic: z.boolean().optional(),
  budgetRange: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Must agree to terms' }) }),
})

const waitlistSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200).optional(),
  interest: z.string().optional(),
})

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

export const artistApplicationRoutes = new Hono<{ Bindings: Bindings }>()

artistApplicationRoutes.post(
  '/artist-application',
  zValidator('json', artistApplicationSchema),
  async (c) => {
    const data = c.req.valid('json')
    const record = {
      ...data,
      artistType: data.artistType.join(','),
      interests: (data.interests ?? []).join(','),
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    }
    await supabaseInsert(c, 'artist_applications', record)
    return c.json({ ok: true, message: 'Application received. We review applications manually and will reach out by email.' }, 201)
  }
)

artistApplicationRoutes.post(
  '/waitlist',
  zValidator('json', waitlistSchema),
  async (c) => {
    const data = c.req.valid('json')
    await supabaseInsert(c, 'waitlist', {
      ...data,
      joinedAt: new Date().toISOString(),
    })
    return c.json({ ok: true, message: "You're on the waitlist. We'll reach out when spots open." }, 201)
  }
)
