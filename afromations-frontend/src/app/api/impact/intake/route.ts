import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for demonstration
// In production, this would use Supabase
const intakeSubmissions: Array<{
  id: string
  intake_type: string
  name: string
  email: string
  phone?: string
  organization?: string
  neighborhood?: string
  project_type?: string
  budget_range?: string
  timeline?: string
  message: string
  consent: boolean
  source_route?: string
  status: string
  created_at: string
  updated_at: string
}> = []

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message || !body.intake_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create submission record
    const submission = {
      id: generateId(),
      intake_type: body.intake_type,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone || null,
      organization: body.organization || null,
      neighborhood: body.neighborhood || null,
      project_type: body.project_type || null,
      budget_range: body.budget_range || null,
      timeline: body.timeline || null,
      message: body.message.trim(),
      consent: body.consent || false,
      source_route: request.headers.get('referer') || null,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store in memory (in production would use Supabase)
    intakeSubmissions.push(submission)

    // Log to console for debugging
    console.log('[v0] Impact intake submission received:', submission)

    // In production, would send confirmation email here
    // For now, just acknowledge receipt
    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        message: 'Thank you for your submission. We will review it and be in touch soon.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Impact intake error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'ok',
    submissions_count: intakeSubmissions.length,
  })
}
