'use client'
import { useState, useEffect } from 'react'
import type { FreedomScore } from '@/types'
import FreedomScoreCard from '@/components/FreedomScore'
import { Wifi, DollarSign, Filter } from 'lucide-react'

export default function FreedomIndexPage() {
  const [scores, setScores] = useState<FreedomScore[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'excellent' | 'good' | 'fair' | 'poor'>('all')
  const [nomadOnly, setNomadOnly] = useState(false)
  const [maxBudget, setMaxBudget] = useState(10000)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'overall' | 'economic' | 'personal' | 'cost'>('overall')

  useEffect(() => {
    import('@/lib/supabase').then(({ getFreedomScores }) =>
      getFreedomScores()
        .then(setScores)
        .catch(() => {})
        .finally(() => setLoading(false))
    )
  }, [])

  const filtered = scores
    .filter((s) => {
      if (filter !== 'all' && s.flag_theory_suitability !== filter) return false
      if (nomadOnly && !s.digital_nomad_visa) return false
      if (s.cost_of_living_usd && s.cost_of_living_usd > maxBudget) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.country_name.toLowerCase().includes(q)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'overall') return (b.overall_score || 0) - (a.overall_score || 0)
      if (sortBy === 'economic') return (b.economic_freedom || 0) - (a.economic_freedom || 0)
      if (sortBy === 'personal') return (b.personal_freedom || 0) - (a.personal_freedom || 0)
      if (sortBy === 'cost') return (a.cost_of_living_usd || 9999) - (b.cost_of_living_usd || 9999)
      return 0
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-mono font-bold text-[#00ff87]">ÍNDICE DE LIBERDADE MUNDIAL</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Ranking baseado em histórico COVID-19, liberdades civis e políticas atuais
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'EXCELENTE', count: scores.filter(s => s.flag_theory_suitability === 'excellent').length, color: 'text-[#00ff87]' },
          { label: 'BOM', count: scores.filter(s => s.flag_theory_suitability === 'good').length, color: 'text-green-400' },
          { label: 'RAZOÁVEL', count: scores.filter(s => s.flag_theory_suitability === 'fair').length, color: 'text-yellow-400' },
          { label: 'RUIM', count: scores.filter(s => s.flag_theory_suitability === 'poor').length, color: 'text-red-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-[#0d1117] border border-[#00ff87]/10 rounded p-3 text-center">
            <div className={`text-2xl font-mono font-bold ${color}`}>{count}</div>
            <div className="text-xs text-gray-500 font-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-400 font-mono">FILTROS</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Flag Theory</div>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'excellent', 'good', 'fair', 'poor'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    filter === v
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {v === 'all' ? 'Todos' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Ordenar por</div>
            <div className="flex gap-1 flex-wrap">
              {[
                { value: 'overall', label: 'Score Geral' },
                { value: 'economic', label: 'Econômico' },
                { value: 'personal', label: 'Pessoal' },
                { value: 'cost', label: 'Custo' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    sortBy === value
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar país..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#111827] border border-[#1f2937] rounded px-3 py-2 text-sm font-mono text-gray-300 placeholder-gray-600 focus:border-[#00ff87]/50 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
              Até ${maxBudget.toLocaleString('en-US')}/mês
            </span>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-24 accent-[#00ff87]"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={nomadOnly}
              onChange={(e) => setNomadOnly(e.target.checked)}
              className="accent-[#00ff87]"
            />
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-gray-400 font-mono whitespace-nowrap">Nômade Digital</span>
          </label>
        </div>
      </div>

      {/* Country Cards */}
      <div className="text-xs text-gray-600 font-mono">{filtered.length} países</div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-[#0d1117] rounded-lg animate-pulse border border-[#00ff87]/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s, i) => (
            <div key={s.country_code} className="relative">
              {i < 3 && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#00ff87] text-black text-xs font-mono font-bold rounded-full flex items-center justify-center z-10">
                  {i + 1}
                </div>
              )}
              <FreedomScoreCard score={s} />
            </div>
          ))}
        </div>
      )}

      {/* Methodology note */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
        <h3 className="text-xs font-mono text-gray-400 mb-2 font-bold">METODOLOGIA</h3>
        <p className="text-xs text-gray-600 font-mono leading-relaxed">
          O score de liberdade é calculado com base em: histórico de lockdowns COVID-19 (peso 30%),
          mandatos de vacinas (peso 20%), passaportes sanitários (peso 15%),
          liberdade econômica — Fraser Institute (peso 15%), liberdade pessoal (peso 10%),
          liberdade de imprensa — RSF (peso 10%). Dados atualizados mensalmente via Claude API.
        </p>
      </div>
    </div>
  )
}
