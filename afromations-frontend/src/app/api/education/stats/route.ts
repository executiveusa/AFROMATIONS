import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('module_number, completed')
      .eq('user_id', userId)
      .eq('completed', true)

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }

    const completedLessons = (data || []).length
    const moduleStats: Record<number, number> = {}

    for (const progress of data || []) {
      if (progress.module_number) {
        moduleStats[progress.module_number] = (moduleStats[progress.module_number] || 0) + 1
      }
    }

    return NextResponse.json({
      userId,
      totalCompletedLessons: completedLessons,
      moduleStats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Get stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
