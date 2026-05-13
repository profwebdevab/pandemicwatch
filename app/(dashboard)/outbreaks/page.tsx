'use client'
import { useOutbreaks } from '@/hooks/useOutbreaks'
import OutbreakCard from '@/components/OutbreakCard'
import { useState } from 'react'
import type { OutbreakStatus, PandemicPotential, PathogenType } from '@/types'
import { Filter, Activity } from 'lucide-react'

const STATUS_FILTERS: { value: OutbreakStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pandemic', label: 'Pandemia' },
  { value: 'epidemic', label: 'Epidemia' },
  { value: 'outbreak', label: 'Surto' },
  { value: 'monitoring', label: 'Monitoramento' },
]

const POTENTIAL_FILTERS: { value: PandemicPotential | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'critical', label: 'Crítico' },
  { value: 'high', label: 'Alto' },
  { value: 'medium', label: 'Médio' },
  { value: 'low', label: 'Baixo' },
]

export default function OutbreaksPage() {
  const { outbreaks, stats, loading } = useOutbreaks()
  const [statusFilter, setStatusFilter] = useState<OutbreakStatus | 'all'>('all')
  const [potentialFilter, setPotentialFilter] = useState<PandemicPotential | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = outbreaks.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (potentialFilter !== 'all' && o.pandemic_potential !== potentialFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!o.pathogen_name.toLowerCase().includes(q) && !o.country_name.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-mono font-bold text-[#00ff87]">SURTOS ATIVOS NO MUNDO</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          {stats?.active_outbreaks || 0} surtos ativos em {stats?.countries_affected || 0} países
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'PANDEMIA', count: outbreaks.filter(o => o.status === 'pandemic').length, color: 'text-red-500' },
          { label: 'EPIDEMIA', count: outbreaks.filter(o => o.status === 'epidemic').length, color: 'text-red-400' },
          { label: 'SURTO', count: outbreaks.filter(o => o.status === 'outbreak').length, color: 'text-orange-400' },
          { label: 'MONITORAMENTO', count: outbreaks.filter(o => o.status === 'monitoring').length, color: 'text-yellow-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-[#0d1117] border border-[#00ff87]/10 rounded p-3 text-center">
            <div className={`text-2xl font-mono font-bold ${color}`}>{count}</div>
            <div className="text-xs text-gray-500 font-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-400 font-mono">FILTROS</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Status</div>
            <div className="flex gap-1 flex-wrap">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    statusFilter === value
                      ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                      : 'border-[#1f2937] text-gray-500 hover:border-[#00ff87]/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-mono mb-1">Potencial Pandêmico</div>
            <div className="flex gap-1 flex-wrap">
              {POTENTIAL_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPotentialFilter(value)}
                  className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                    potentialFilter === value
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
        <input
          type="text"
          placeholder="Buscar por patógeno ou país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-[#1f2937] rounded px-3 py-2 text-sm font-mono text-gray-300 placeholder-gray-600 focus:border-[#00ff87]/50 focus:outline-none"
        />
      </div>

      {/* Results */}
      <div>
        <div className="text-xs text-gray-600 font-mono mb-3">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 bg-[#0d1117] rounded-lg animate-pulse border border-[#00ff87]/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 font-mono text-sm">Nenhum surto encontrado com esses filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((o) => <OutbreakCard key={o.id} outbreak={o} />)}
          </div>
        )}
      </div>

      {/* Data sources */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
        <h3 className="text-xs font-mono text-gray-400 mb-2 font-bold">FONTES DE DADOS</h3>
        <div className="flex flex-wrap gap-2">
          {['WHO Disease Outbreak News', 'ProMED Mail', 'ECDC', 'CDC', 'HealthMap', 'PAHO'].map(s => (
            <span key={s} className="text-xs font-mono text-gray-600 bg-[#111827] px-2 py-1 rounded border border-[#1f2937]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
