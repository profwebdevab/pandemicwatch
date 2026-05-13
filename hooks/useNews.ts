'use client'
import { useEffect, useState } from 'react'
import { createRealtimeClient } from '@/lib/supabase'
import type { NewsArticle } from '@/types'

export function useNews(limit = 20, category?: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createRealtimeClient()

    async function load() {
      try {
        let query = client
          .from('news_articles')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(limit)

        if (category) query = query.eq('category', category)

        const { data } = await query
        setArticles(data || [])
      } finally {
        setLoading(false)
      }
    }
    load()

    const sub = client
      .channel('news-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'news_articles' }, (payload) => {
        setArticles((prev) => [payload.new as NewsArticle, ...prev].slice(0, limit))
      })
      .subscribe()

    return () => { sub.unsubscribe() }
  }, [limit, category])

  return { articles, loading }
}
