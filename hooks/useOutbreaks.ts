'use client'
import { useEffect, useState } from 'react'
import { createRealtimeClient } from '@/lib/supabase'
import type { Outbreak, GlobalStats } from '@/types'

export function useOutbreaks() {
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([])
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createRealtimeClient()

    async function load() {
      try {
        const { data } = await client
          .from('outbreaks')
          .select('*')
          .order('last_updated_at', { ascending: false })
        setOutbreaks(data || [])

        const totals = (data || []).reduce(
          (acc, o) => ({
            total_suspected: acc.total_suspected + (o.suspected_cases || 0),
            total_confirmed: acc.total_confirmed + (o.confirmed_cases || 0),
            total_deaths: acc.total_deaths + (o.deaths || 0),
            active_outbreaks: acc.active_outbreaks + (o.status !== 'monitoring' ? 1 : 0),
            countries: new Set([...Array.from(acc.countries), o.country_code]),
          }),
          { total_suspected: 0, total_confirmed: 0, total_deaths: 0, active_outbreaks: 0, countries: new Set<string>() }
        )
        setStats({
          total_suspected: totals.total_suspected,
          total_confirmed: totals.total_confirmed,
          total_deaths: totals.total_deaths,
          active_outbreaks: totals.active_outbreaks,
          countries_affected: totals.countries.size,
          last_updated: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }
    load()

    const sub = client
      .channel('outbreaks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'outbreaks' }, () => load())
      .subscribe()

    return () => { sub.unsubscribe() }
  }, [])

  return { outbreaks, stats, loading }
}
