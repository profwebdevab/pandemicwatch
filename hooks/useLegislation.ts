'use client'
import { useEffect, useState } from 'react'
import { createRealtimeClient } from '@/lib/supabase'
import type { LegislationChange } from '@/types'

export function useLegislation(limit = 20) {
  const [legislation, setLegislation] = useState<LegislationChange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createRealtimeClient()

    async function load() {
      try {
        const { data } = await client
          .from('legislation_changes')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(limit)
        setLegislation(data || [])
      } finally {
        setLoading(false)
      }
    }
    load()

    const sub = client
      .channel('legislation-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'legislation_changes' }, (payload) => {
        setLegislation((prev) => [payload.new as LegislationChange, ...prev].slice(0, limit))
      })
      .subscribe()

    return () => { sub.unsubscribe() }
  }, [limit])

  return { legislation, loading }
}
