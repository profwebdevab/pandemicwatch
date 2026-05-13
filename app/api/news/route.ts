import { NextRequest, NextResponse } from 'next/server'
import { getNews } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category') || undefined
    const articles = await getNews(limit, category)
    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
