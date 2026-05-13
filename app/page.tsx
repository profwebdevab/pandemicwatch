'use client'
import dynamic from 'next/dynamic'
import { useOutbreaks } from '@/hooks/useOutbreaks'
import { useNews } from '@/hooks/useNews'
import { useLegislation } from '@/hooks/useLegislation'
import OutbreakCard from '@/components/OutbreakCard'
import NewsCard from '@/components/NewsCard'
import LegislationTracker from '@/components/LegislationTracker'
import AIInsights from '@/components/AIInsights'
import { useState, useEffect } from 'react'
import type { FreedomScore } from '@/types'
import { Activity, AlertTriangle, Skull, Globe, TrendingUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false })

function StatCounter({ value, label, color, icon: Icon }: {
  value: number
  label: string
  color: string
  icon: React.ElementType
}) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const step = Math.ceil(value / 40)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, value)
      setDisplayed(current)
      if (current >= value) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 glow-green">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs text-gray-500 font-mono">{label}</span>
      </div>
      <div className="text-2xl font-mono font-bold" style={{ color }}>
        {displayed.toLocaleString('pt-BR')}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { outbreaks, stats, loading: loadingOutbreaks } = useOutbreaks()
  const { articles, loading: loadingNews } = useNews(6)
  const { legislation, loading: loadingLeg } = useLegislation(4)
  const [freedomScores, setFreedomScores] = useState<FreedomScore[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/outbreaks')
      .then((r) => r.json())
      .then(() => {})
      .catch(() => {})

    // Load freedom scores for map
    import('@/lib/supabase').then(({ getFreedomScores }) =>
      getFreedomScores().then(setFreedomScores).catch(() => {})
    )
  }, [])

  const criticalOutbreaks = outbreaks.filter((o) => o.status === 'epidemic' || o.status === 'pandemic')
  const topFreeCountries = freedomScores.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-[#00ff87] cursor-blink">
            VIGILÂNCIA MUNDIAL
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Monitorando {stats?.countries_affected || 0} países · {stats?.active_outbreaks || 0} surtos ativos
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#00ff87] transition-colors font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCounter
          value={stats?.total_confirmed || 0}
          label="CONFIRMADOS"
          color="#ff6b35"
          icon={AlertTriangle}
        />
        <StatCounter
          value={stats?.total_suspected || 0}
          label="SUSPEITOS"
          color="#ffb347"
          icon={Activity}
        />
        <StatCounter
          value={stats?.total_deaths || 0}
          label="ÓBITOS"
          color="#ff3b3b"
          icon={Skull}
        />
        <StatCounter
          value={stats?.active_outbreaks || 0}
          label="SURTOS ATIVOS"
          color="#00ff87"
          icon={Globe}
        />
      </div>

      {/* World Map */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono text-gray-300 font-bold">MAPA DE ALERTA MUNDIAL</h2>
          {selectedCountry && (
            <span className="text-xs font-mono text-[#00ff87]">
              País selecionado: {selectedCountry}
            </span>
          )}
        </div>
        <WorldMap
          freedomScores={freedomScores}
          outbreaks={outbreaks}
          onCountryClick={setSelectedCountry}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Critical Outbreaks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-gray-300 font-bold">
              SURTOS CRÍTICOS
              {criticalOutbreaks.length > 0 && (
                <span className="ml-2 text-xs font-mono text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20 animate-pulse">
                  {criticalOutbreaks.length} ATIVOS
                </span>
              )}
            </h2>
            <Link href="/outbreaks" className="text-xs text-gray-500 font-mono hover:text-[#00ff87] transition-colors">
              Ver todos →
            </Link>
          </div>

          {loadingOutbreaks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-[#0d1117] rounded-lg animate-pulse border border-[#00ff87]/5" />
              ))}
            </div>
          ) : outbreaks.length === 0 ? (
            <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-8 text-center">
              <Activity className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-mono">Nenhum surto registrado</p>
              <p className="text-xs text-gray-700 font-mono mt-1">Execute o cron job para popular dados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outbreaks.slice(0, 4).map((o) => (
                <OutbreakCard key={o.id} outbreak={o} />
              ))}
            </div>
          )}

          {/* AI Summary */}
          <AIInsights type="outbreak-summary" title="Resumo Epidemiológico por LLM" />
        </div>

        {/* Right: Top Free Countries + News */}
        <div className="space-y-4">
          {/* Top 5 Free Countries */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono text-gray-300 font-bold">
                <TrendingUp className="w-4 h-4 inline mr-1 text-[#00ff87]" />
                TOP 5 MAIS LIVRES
              </h2>
              <Link href="/freedom-index" className="text-xs text-gray-500 font-mono hover:text-[#00ff87] transition-colors">
                Rankings →
              </Link>
            </div>
            <div className="space-y-2">
              {topFreeCountries.map((fs, i) => (
                <div
                  key={fs.country_code}
                  className="flex items-center gap-3 bg-[#0d1117] border border-[#00ff87]/10 rounded p-2.5 hover:border-[#00ff87]/30 transition-all"
                >
                  <span className="text-xs font-mono text-gray-600 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-white truncate">{fs.country_name}</div>
                    <div className="text-xs text-gray-600 font-mono">{fs.flag_theory_suitability.toUpperCase()}</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-[#00ff87]">
                    {fs.overall_score.toFixed(1)}
                  </div>
                </div>
              ))}
              {topFreeCountries.length === 0 && (
                <div className="text-xs text-gray-600 font-mono text-center py-4">
                  Carregando scores...
                </div>
              )}
            </div>
          </div>

          {/* Latest Legislation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono text-gray-300 font-bold">LEGISLAÇÃO RECENTE</h2>
              <Link href="/legislation" className="text-xs text-gray-500 font-mono hover:text-[#00ff87] transition-colors">
                Ver mais →
              </Link>
            </div>
            <div className="space-y-2">
              {loadingLeg ? (
                <div className="h-20 bg-[#0d1117] rounded animate-pulse" />
              ) : (
                legislation.slice(0, 2).map((item) => (
                  <LegislationTracker key={item.id} item={item} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono text-gray-300 font-bold">ÚLTIMAS NOTÍCIAS</h2>
          <span className="text-xs text-[#00ff87] font-mono bg-[#00ff87]/10 px-2 py-0.5 rounded animate-pulse">
            LIVE
          </span>
        </div>
        {loadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-[#0d1117] rounded-lg animate-pulse border border-[#00ff87]/5" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 font-mono">Nenhuma notícia ainda. Execute o cron de notícias.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
