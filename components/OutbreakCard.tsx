import type { Outbreak } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, Activity, Skull, ExternalLink } from 'lucide-react'

const STATUS_CONFIG = {
  monitoring: { label: 'MONITORAMENTO', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  outbreak: { label: 'SURTO', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' },
  epidemic: { label: 'EPIDEMIA', color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  pandemic: { label: 'PANDEMIA', color: 'text-red-600 border-red-600/30 bg-red-600/10 animate-pulse' },
}

const POTENTIAL_CONFIG = {
  low: { label: 'BAIXO', color: 'text-green-400' },
  medium: { label: 'MÉDIO', color: 'text-yellow-400' },
  high: { label: 'ALTO', color: 'text-orange-400' },
  critical: { label: 'CRÍTICO', color: 'text-red-500 animate-pulse' },
}

interface Props {
  outbreak: Outbreak
}

export default function OutbreakCard({ outbreak }: Props) {
  const status = STATUS_CONFIG[outbreak.status]
  const potential = POTENTIAL_CONFIG[outbreak.pandemic_potential]

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 hover:border-[#00ff87]/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-mono font-bold text-white group-hover:text-[#00ff87] transition-colors">
            {outbreak.pathogen_name}
          </h3>
          <p className="text-sm text-gray-400 font-mono">
            {outbreak.country_name} {outbreak.region ? `· ${outbreak.region}` : ''}
          </p>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#111827] rounded p-2 text-center">
          <Activity className="w-3 h-3 text-yellow-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400 font-mono">SUSPEITOS</div>
          <div className="text-sm font-mono text-yellow-400 font-bold">
            {outbreak.suspected_cases.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-[#111827] rounded p-2 text-center">
          <AlertTriangle className="w-3 h-3 text-orange-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400 font-mono">CONFIRMADOS</div>
          <div className="text-sm font-mono text-orange-400 font-bold">
            {outbreak.confirmed_cases.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-[#111827] rounded p-2 text-center">
          <Skull className="w-3 h-3 text-red-400 mx-auto mb-1" />
          <div className="text-xs text-gray-400 font-mono">ÓBITOS</div>
          <div className="text-sm font-mono text-red-400 font-bold">
            {outbreak.deaths.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono">POTENCIAL:</span>
          <span className={`text-xs font-mono font-bold ${potential.color}`}>{potential.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {outbreak.source_url && (
            <a
              href={outbreak.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#00ff87] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <span className="text-xs text-gray-600 font-mono">
            {outbreak.last_updated_at
              ? formatDistanceToNow(new Date(outbreak.last_updated_at), { addSuffix: true, locale: ptBR })
              : '—'}
          </span>
        </div>
      </div>

      {outbreak.source_name && (
        <div className="mt-2 pt-2 border-t border-[#1f2937]">
          <span className="text-xs text-gray-600 font-mono">FONTE: {outbreak.source_name}</span>
        </div>
      )}
    </div>
  )
}
