'use client'
import { useLegislation } from '@/hooks/useLegislation'
import LegislationTracker from '@/components/LegislationTracker'
import AIInsights from '@/components/AIInsights'
import { useState } from 'react'
import type { LegislationDirection, LegislationCategory, ImpactLevel } from '@/types'
import { Scale, Filter, Bell } from 'lucide-react'

export default function LegislationPage() {
  const { legislation, loading } = useLegislation(50)
  const [dirFilter, setDirFilter] = useState<LegislationDirection | 'all'>('all')
  const [catFilter, setCatFilter] = useState<LegislationCategory | 'all'>('all')
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = legislation.filter((l) => {
    if (dirFilter !== 'all' && l.direction !== dirFilter) return false
    if (catFilter !== 'all' && l.category !== catFilter) return false
    if (impactFilter !== 'all' && l.impact_level !== impactFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.title.toLowerCase().includes(q) && !l.country_name.toLowerCase().includes(q)) return false
    }
    return true
  })

  const restrictive = legislation.filter(l => l.direction === 'restrictive').length
  const libertarian = legislation.filter(l => l.direction === 'libertarian').length
  const critical = legislation.filter(l => l.impact_level === 'critical' || l.impact_level === 'high').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-mono font-bold text-[#00ff87]">MONITORAMENTO LEGISLATIVO</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Mudanças em leis de saúde, viagem, vigilância e liberdades civis em todo o mundo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0d1117] border border-red-400/20 rounded p-3 text-center">
          <div className="text-2xl font-mono font-bold text-red-400">{restrictive}</div>
          <div className="text-xs text-gray-500 font-mono">RESTRITIVAS</div>
        </div>
        <div className="bg-[#0d1117] border border-green-400/20 rounded p-3 text-center">
          <div className="text-2xl font-mono font-bold text-green-400">{libertarian}</div>
          <div className="text-xs text-gray-500 font-mono">LIBERTÁRIAS</div>
        </div>
        <div className="bg-[#0d1117] border border-orange-400/20 rounded p-3 text-center">
          <div className="text-2xl font-mono font-bold text-orange-400">{critical}</div>
          <div className="text-xs text-gray-500 font-mono">ALTO IMPACTO</div>
        </div>
      </div>

      {/* AI Analysis */}
      <AIInsights type="outbreak-summary" title="Análise Legislativa Global por LLM" />

      {/* Filters */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-400 font-mono">FILTROS</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Direção</div>
            <div className="flex gap-1">
              {(['all', 'restrictive', 'libertarian', 'neutral'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setDirFilter(v)}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    dirFilter === v
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {v === 'all' ? 'Todos' : v === 'restrictive' ? 'Restritiva' : v === 'libertarian' ? 'Libertária' : 'Neutra'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Categoria</div>
            <div className="flex gap-1 flex-wrap">
              {([
                { v: 'all', l: 'Todas' },
                { v: 'health_mandate', l: 'Saúde' },
                { v: 'travel', l: 'Viagem' },
                { v: 'surveillance', l: 'Vigilância' },
                { v: 'speech', l: 'Expressão' },
                { v: 'economic', l: 'Econômico' },
              ] as const).map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setCatFilter(v as LegislationCategory | 'all')}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    catFilter === v
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Impacto</div>
            <div className="flex gap-1">
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setImpactFilter(v as ImpactLevel | 'all')}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    impactFilter === v
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {v === 'all' ? 'Todos' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar por título ou país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded px-3 py-2 text-sm font-mono text-gray-300 placeholder-gray-600 focus:border-[#00ff87]/50 focus:outline-none"
        />
      </div>

      {/* Alert subscription hint */}
      <div className="flex items-center gap-2 bg-[#0d1117] border border-blue-400/20 rounded p-3">
        <Bell className="w-4 h-4 text-blue-400 shrink-0" />
        <p className="text-xs text-gray-400 font-mono">
          Ative alertas push no seu navegador para receber notificações de novas leis restritivas em tempo real.
        </p>
      </div>

      {/* List */}
      <div>
        <div className="text-xs text-gray-600 font-mono mb-3">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-28 bg-[#0d1117] rounded-lg animate-pulse border border-[#00ff87]/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Scale className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 font-mono text-sm">Nenhuma legislação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => <LegislationTracker key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}
