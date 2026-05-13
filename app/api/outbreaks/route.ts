import { NextResponse } from 'next/server'
import { getOutbreaks, getGlobalStats } from '@/lib/supabase'

export async function GET() {
  try {
    const [outbreaks, stats] = await Promise.all([getOutbreaks(), getGlobalStats()])
    return NextResponse.json({ outbreaks, stats })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
