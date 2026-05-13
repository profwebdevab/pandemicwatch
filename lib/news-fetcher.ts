import Parser from 'rss-parser'
import type { NewsArticle } from '@/types'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PandemicWatch/1.0' },
})

const RSS_FEEDS = [
  {
    url: 'https://www.who.int/rss-feeds/news-releases-en.xml',
    source: 'WHO',
    category: 'outbreak' as const,
  },
  {
    url: 'https://promedmail.org/feed/',
    source: 'ProMED',
    category: 'outbreak' as const,
  },
  {
    url: 'https://www.ecdc.europa.eu/en/rss.xml',
    source: 'ECDC',
    category: 'outbreak' as const,
  },
  {
    url: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    source: 'CDC',
    category: 'outbreak' as const,
  },
  {
    url: 'http://www.healthmap.org/rss/allAlerts.rss',
    source: 'HealthMap',
    category: 'outbreak' as const,
  },
]

const PATHOGEN_KEYWORDS = [
  'hantavirus', 'h5n1', 'mpox', 'monkeypox', 'ebola', 'marburg', 'nipah',
  'sars', 'mers', 'coronavirus', 'influenza', 'avian flu', 'swine flu',
  'cholera', 'plague', 'anthrax', 'smallpox', 'dengue', 'zika', 'west nile',
  'yellow fever', 'rabies', 'lassa', 'rift valley',
]

function detectPathogens(text: string): string[] {
  const lower = text.toLowerCase()
  return PATHOGEN_KEYWORDS.filter((p) => lower.includes(p))
}

function detectSentiment(text: string): NewsArticle['sentiment'] {
  const lower = text.toLowerCase()
  const restrictiveWords = ['lockdown', 'mandate', 'restriction', 'ban', 'quarantine', 'forced', 'compulsory', 'required vaccination']
  const libertyWords = ['freedom', 'rights', 'liberty', 'voluntary', 'choice', 'repeal', 'lifted', 'ended restrictions']

  const restrictiveCount = restrictiveWords.filter((w) => lower.includes(w)).length
  const libertyCount = libertyWords.filter((w) => lower.includes(w)).length

  if (restrictiveCount > libertyCount) return 'restrictive'
  if (libertyCount > restrictiveCount) return 'libertarian'
  return 'neutral'
}

export async function fetchRSSFeeds(): Promise<Partial<NewsArticle>[]> {
  const articles: Partial<NewsArticle>[] = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      for (const item of parsed.items.slice(0, 20)) {
        const text = `${item.title || ''} ${item.contentSnippet || item.content || ''}`
        articles.push({
          title: item.title || 'Untitled',
          summary: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500),
          url: item.link || item.guid || '',
          source: feed.source,
          language: 'en',
          pathogen_mentioned: detectPathogens(text),
          category: feed.category,
          sentiment: detectSentiment(text),
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        })
      }
    } catch {
      console.warn(`Failed to fetch RSS from ${feed.source}`)
    }
  }

  return articles.filter((a) => a.url)
}

export async function fetchNewsAPI(queries: string[]): Promise<Partial<NewsArticle>[]> {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) return []

  const articles: Partial<NewsArticle>[] = []

  for (const query of queries.slice(0, 5)) {
    try {
      const url = new URL('https://newsapi.org/v2/everything')
      url.searchParams.set('q', query)
      url.searchParams.set('language', 'en')
      url.searchParams.set('sortBy', 'publishedAt')
      url.searchParams.set('pageSize', '10')
      url.searchParams.set('apiKey', apiKey)

      const res = await fetch(url.toString())
      if (!res.ok) continue

      const data = await res.json() as { articles?: Array<{ title: string; description: string; url: string; source: { name: string }; publishedAt: string }> }
      for (const item of data.articles || []) {
        const text = `${item.title} ${item.description || ''}`
        articles.push({
          title: item.title,
          summary: item.description?.slice(0, 500),
          url: item.url,
          source: item.source?.name,
          language: 'en',
          pathogen_mentioned: detectPathogens(text),
          category: detectCategory(text),
          sentiment: detectSentiment(text),
          published_at: item.publishedAt,
        })
      }
    } catch {
      console.warn(`NewsAPI failed for query: ${query}`)
    }
  }

  return articles.filter((a) => a.url)
}

function detectCategory(text: string): NewsArticle['category'] {
  const lower = text.toLowerCase()
  if (lower.match(/outbreak|epidemic|pandemic|cases|deaths|pathogen|virus|bacteria/)) return 'outbreak'
  if (lower.match(/law|legislation|bill|mandate|regulation|policy/)) return 'legislation'
  if (lower.match(/freedom|liberty|rights|lockdown|restriction/)) return 'freedom'
  if (lower.match(/relocation|emigration|migration|expat|visa/)) return 'relocation'
  return 'outbreak'
}

export const NEWS_QUERIES = [
  'hantavirus outbreak',
  'H5N1 bird flu humans',
  'mpox monkeypox outbreak',
  'pandemic epidemic outbreak',
  'vaccine mandate freedom',
  'lockdown restrictions liberty',
  'epidemic alert WHO',
]
