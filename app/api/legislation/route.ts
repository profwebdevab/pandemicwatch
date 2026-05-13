import { NextRequest, NextResponse } from 'next/server'
import { getLegislation } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const legislation = await getLegislation(limit)
    return NextResponse.json({ legislation })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
