import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress: data || [] })
  } catch (error) {
    console.error('[v0] Get progress error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      lessonSlug,
      lessonTitle,
      module,
      quizScore,
      completed,
      timeSpentSeconds,
    } = body

    // Validate required fields
    if (!userId || !lessonSlug || !lessonTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, lessonSlug, lessonTitle' },
        { status: 400 }
      )
    }

    // Upsert progress record (update if exists, insert if not)
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: userId,
          lesson_slug: lessonSlug,
          lesson_title: lessonTitle,
          module_number: module,
          quiz_score: quizScore || null,
          completed: completed || false,
          time_spent_seconds: timeSpentSeconds || 0,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,lesson_slug',
        }
      )
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    console.log('[v0] Lesson progress saved:', { userId, lessonSlug, completed })

    return NextResponse.json({ success: true, progress: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Save progress error:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
