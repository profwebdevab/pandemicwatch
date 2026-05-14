import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export async function GET() {
  try {
    const sb = getAdmin()
    const [n, o, f, l] = await Promise.all([
      sb.from('news_articles').select('id', { count: 'exact', head: true }),
      sb.from('outbreaks').select('id', { count: 'exact', head: true }),
      sb.from('freedom_scores').select('id', { count: 'exact', head: true }),
      sb.from('legislation_changes').select('id', { count: 'exact', head: true }),
    ])
    return NextResponse.json({ news: n.count ?? 0, outbreaks: o.count ?? 0, freedom: f.count ?? 0, legislation: l.count ?? 0 })
  } catch {
    return NextResponse.json({ news: 0, outbreaks: 0, freedom: 0, legislation: 0 })
  }
}
