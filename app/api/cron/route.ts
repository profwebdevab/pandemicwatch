import { NextRequest, NextResponse } from 'next/server'
import { fetchRSSFeeds, fetchNewsAPI, NEWS_QUERIES } from '@/lib/news-fetcher'
import { upsertNewsArticle, upsertFreedomScore, getNews } from '@/lib/supabase'
import { BASE_FREEDOM_DATA } from '@/lib/freedom-scorer'
import Anthropic from '@anthropic-ai/sdk'

function authCheck(request: NextRequest): boolean {
  const envSecret = process.env.CRON_SECRET
  if (!envSecret) return true // dev local sem secret configurado

  // Accept cron secret via header or query param (Vercel cron calls)
  const provided =
    request.headers.get('x-cron-secret') ||
    new URL(request.url).searchParams.get('secret')
  if (provided === envSecret) return true

  // Also accept requests from authenticated admin users
  const adminToken  = request.cookies.get('pw_admin')?.value
  const adminSecret = process.env.ADMIN_TOKEN
  if (adminSecret && adminToken === adminSecret) return true

  return false
}

async function summarizeArticles(articles: Awaited<ReturnType<typeof getNews>>) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicKey || articles.length === 0) return

  const client = new Anthropic({ apiKey: anthropicKey })

  // Processa em lotes de 5 para não estourar tokens
  const batch = articles.filter((a) => !a.ai_summary).slice(0, 5)
  if (batch.length === 0) return

  for (const article of batch) {
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `Resuma em 2 frases em português, de forma direta e factual, esta notícia sobre saúde/epidemiologia/liberdades civis. Seja objetivo, sem alarmismo.\n\nTítulo: ${article.title}\n\nTexto: ${article.summary || '(sem texto)'}`,
        }],
      })
      const summary = (msg.content[0] as { type: string; text: string }).text.trim()
      await upsertNewsArticle({ ...article, ai_summary: summary })
    } catch {
      // Continua no próximo artigo se um falhar
    }
  }
}

export async function GET(request: NextRequest) {
  if (!authCheck(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const type = new URL(request.url).searchParams.get('type') ?? 'news'

  try {
    // ── NOTÍCIAS + SURTOS ──────────────────────────────────────────────
    if (type === 'news' || type === 'outbreaks') {
      const [rssArticles, newsApiArticles] = await Promise.all([
        fetchRSSFeeds(),
        fetchNewsAPI(NEWS_QUERIES),
      ])

      const all = [...rssArticles, ...newsApiArticles]
      let saved = 0
      const errors: string[] = []

      for (const article of all) {
        if (!article.url || !article.title) continue
        try {
          await upsertNewsArticle(article)
          saved++
        } catch (e) {
          errors.push(String(e).slice(0, 80))
        }
      }

      // Após salvar, resumir os mais recentes sem resumo ainda
      const recent = await getNews(20).catch(() => [])
      await summarizeArticles(recent)

      return NextResponse.json({
        ok: true,
        type,
        fetched: all.length,
        saved,
        summarized: recent.filter((a) => !a.ai_summary).slice(0, 5).length,
        errors: errors.slice(0, 3),
      })
    }

    // ── SCORES DE LIBERDADE ────────────────────────────────────────────
    if (type === 'freedom') {
      let updated = 0
      for (const score of BASE_FREEDOM_DATA) {
        try {
          await upsertFreedomScore({ ...score, updated_at: new Date().toISOString() })
          updated++
        } catch { /* skip */ }
      }
      return NextResponse.json({ ok: true, type: 'freedom', updated })
    }

    // ── LEGISLAÇÃO ────────────────────────────────────────────────────
    if (type === 'legislation') {
      const articles = await fetchRSSFeeds()
      const legArticles = articles.filter((a) => a.category === 'legislation')
      let saved = 0
      for (const a of legArticles) {
        if (!a.url || !a.title) continue
        try { await upsertNewsArticle(a); saved++ } catch { /* skip */ }
      }
      return NextResponse.json({ ok: true, type: 'legislation', saved })
    }

    // ── RESUMIR artigos existentes sem ai_summary ─────────────────────
    if (type === 'summarize') {
      const articles = await getNews(20)
      await summarizeArticles(articles)
      const done = articles.filter((a) => !a.ai_summary).slice(0, 5).length
      return NextResponse.json({ ok: true, type: 'summarize', processed: done })
    }

    return NextResponse.json({ ok: true, message: 'type não reconhecido. Use: news, freedom, legislation, summarize' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
