import { createClient } from '@supabase/supabase-js'

let _client = null

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    _client = createClient(url, key)
  }
  return _client
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    const client = getSupabase()
    if (!client) return () => ({ data: null, error: new Error('Supabase not configured') })
    const val = client[prop]
    return typeof val === 'function' ? val.bind(client) : val
  },
})