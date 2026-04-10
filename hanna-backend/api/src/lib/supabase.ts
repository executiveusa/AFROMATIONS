import type { Context } from 'hono'

interface SupabaseConfig {
  url: string
  serviceKey: string
}

function getConfig(c: Context): SupabaseConfig {
  return {
    url: (c.env as Record<string, string>).SUPABASE_URL ?? 'http://31.220.58.212:8001',
    serviceKey: (c.env as Record<string, string>).SUPABASE_SERVICE_KEY ?? '',
  }
}

/** Thin fetch wrapper — no SDK dep, runs on Workers */
export async function supabaseQuery(
  c: Context,
  table: string,
  params?: { select?: string; limit?: number; order?: string; eq?: Record<string, string> }
) {
  const { url, serviceKey } = getConfig(c)
  const searchParams = new URLSearchParams()

  if (params?.select) searchParams.set('select', params.select)
  if (params?.limit) searchParams.set('limit', String(params.limit))
  if (params?.order) searchParams.set('order', params.order)
  if (params?.eq) {
    for (const [k, v] of Object.entries(params.eq)) {
      searchParams.set(k, `eq.${v}`)
    }
  }

  const res = await fetch(`${url}/rest/v1/${table}?${searchParams}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Supabase ${table}: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function supabaseInsert(
  c: Context,
  table: string,
  data: Record<string, unknown>
) {
  const { url, serviceKey } = getConfig(c)

  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Supabase insert ${table}: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
