import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
}

export interface User {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    async function getUser() {
      if (!supabase) return
      try {
        setLoading(true)
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) {
          console.warn('[v0] Not authenticated:', authError.message)
          setUser(null)
          return
        }

        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email,
            user_metadata: authUser.user_metadata,
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user'
        setError(errorMessage)
        console.error('[v0] useUser error:', err)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
