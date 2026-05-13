import { NextRequest, NextResponse } from 'next/server'
import { summarizeOutbreakNews, analyzeLegislation, generateRelocationGuide, getTopRelocationDestinations } from '@/lib/claude'
import { getNews } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      type: 'outbreak-summary' | 'legislation' | 'relocation-guide' | 'destinations'
      text?: string
      country?: string
      budget?: string
      answers?: Record<string, unknown>
    }
    const { type } = body

    if (type === 'outbreak-summary') {
      const articles = await getNews(10, 'outbreak')
      const summary = await summarizeOutbreakNews(articles)
      return NextResponse.json({ summary })
    }

    if (type === 'legislation') {
      const { text, country } = body
      if (!text || !country) return NextResponse.json({ error: 'Missing text or country' }, { status: 400 })
      const analysis = await analyzeLegislation(text, country)
      return NextResponse.json({ analysis })
    }

    if (type === 'relocation-guide') {
      const { country, budget } = body
      if (!country || !budget) return NextResponse.json({ error: 'Missing country or budget' }, { status: 400 })
      const guide = await generateRelocationGuide(country, budget)
      return NextResponse.json({ guide })
    }

    if (type === 'destinations') {
      const { answers } = body
      if (!answers) return NextResponse.json({ error: 'Missing answers' }, { status: 400 })
      const destinations = await getTopRelocationDestinations(answers)
      return NextResponse.json({ destinations })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
