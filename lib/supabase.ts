import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Outbreak, NewsArticle, FreedomScore, LegislationChange, RelocationGuide } from '@/types'

function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient(url, key)
}

function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url) throw new Error('Supabase env vars not set')
  return createClient(url, serviceKey || anonKey || '')
}

export const supabase = {
  get channel() { return getClient().channel.bind(getClient()) },
  get from() { return getClient().from.bind(getClient()) },
}

export const supabaseAdmin = {
  get from() { return getAdminClient().from.bind(getAdminClient()) },
}

// Outbreaks
export async function getOutbreaks(): Promise<Outbreak[]> {
  const { data, error } = await getClient()
    .from('outbreaks')
    .select('*')
    .order('last_updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getActiveOutbreaks(): Promise<Outbreak[]> {
  const { data, error } = await getClient()
    .from('outbreaks')
    .select('*')
    .neq('status', 'monitoring')
    .order('confirmed_cases', { ascending: false })
  if (error) throw error
  return data || []
}

export async function upsertOutbreak(outbreak: Partial<Outbreak>) {
  const { data, error } = await getAdminClient()
    .from('outbreaks')
    .upsert(outbreak, { onConflict: 'pathogen_name,country_code' })
    .select()
  if (error) throw error
  return data
}

// News
export async function getNews(limit = 20, category?: string): Promise<NewsArticle[]> {
  let query = getClient()
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function upsertNewsArticle(article: Partial<NewsArticle>) {
  const { data, error } = await getAdminClient()
    .from('news_articles')
    .upsert(article, { onConflict: 'url' })
    .select()
  if (error) throw error
  return data
}

// Freedom Scores
export async function getFreedomScores(): Promise<FreedomScore[]> {
  const { data, error } = await getClient()
    .from('freedom_scores')
    .select('*')
    .order('overall_score', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getFreedomScore(countryCode: string): Promise<FreedomScore | null> {
  const { data, error } = await getClient()
    .from('freedom_scores')
    .select('*')
    .eq('country_code', countryCode)
    .single()
  if (error) return null
  return data
}

export async function upsertFreedomScore(score: Partial<FreedomScore>) {
  const { data, error } = await getAdminClient()
    .from('freedom_scores')
    .upsert(score, { onConflict: 'country_code' })
    .select()
  if (error) throw error
  return data
}

// Legislation
export async function getLegislation(limit = 20): Promise<LegislationChange[]> {
  const { data, error } = await getClient()
    .from('legislation_changes')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function insertLegislation(item: Partial<LegislationChange>) {
  const { data, error } = await getAdminClient()
    .from('legislation_changes')
    .insert(item)
    .select()
  if (error) throw error
  return data
}

// Relocation Guides
export async function getRelocationGuides(): Promise<RelocationGuide[]> {
  const { data, error } = await getClient()
    .from('relocation_guides')
    .select('*')
    .order('country_name')
  if (error) throw error
  return data || []
}

export async function getRelocationGuide(countryCode: string): Promise<RelocationGuide | null> {
  const { data, error } = await getClient()
    .from('relocation_guides')
    .select('*')
    .eq('country_code', countryCode)
    .single()
  if (error) return null
  return data
}

// Global stats
export async function getGlobalStats() {
  const { data, error } = await getClient()
    .from('outbreaks')
    .select('suspected_cases, confirmed_cases, deaths, status, country_code')

  if (error) throw error

  const stats = (data || []).reduce(
    (acc, row) => ({
      total_suspected: acc.total_suspected + (row.suspected_cases || 0),
      total_confirmed: acc.total_confirmed + (row.confirmed_cases || 0),
      total_deaths: acc.total_deaths + (row.deaths || 0),
      active_outbreaks: acc.active_outbreaks + (row.status !== 'monitoring' ? 1 : 0),
      countries: new Set([...Array.from(acc.countries), row.country_code]),
    }),
    { total_suspected: 0, total_confirmed: 0, total_deaths: 0, active_outbreaks: 0, countries: new Set<string>() }
  )

  return {
    total_suspected: stats.total_suspected,
    total_confirmed: stats.total_confirmed,
    total_deaths: stats.total_deaths,
    active_outbreaks: stats.active_outbreaks,
    countries_affected: stats.countries.size,
    last_updated: new Date().toISOString(),
  }
}

// Supabase realtime helper for client components
export function createRealtimeClient() {
  return getClient()
}
