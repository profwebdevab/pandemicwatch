import type { LegislationChange } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Scale, TrendingDown, TrendingUp, Minus, ExternalLink, Brain } from 'lucide-react'

const DIRECTION_CONFIG = {
  restrictive: { label: 'RESTRITIVA', color: 'text-red-400 border-red-400/30 bg-red-400/10', Icon: TrendingDown },
  libertarian: { label: 'LIBERTÁRIA', color: 'text-green-400 border-green-400/30 bg-green-400/10', Icon: TrendingUp },
  neutral: { label: 'NEUTRA', color: 'text-gray-400 border-gray-400/30 bg-gray-400/10', Icon: Minus },
}

const CATEGORY_LABELS: Record<string, string> = {
  health_mandate: 'SAÚDE',
  travel: 'VIAGEM',
  surveillance: 'VIGILÂNCIA',
  speech: 'EXPRESSÃO',
  economic: 'ECONÔMICO',
}

const IMPACT_CONFIG = {
  low: { label: 'BAIXO', color: 'text-gray-400' },
  medium: { label: 'MÉDIO', color: 'text-yellow-400' },
  high: { label: 'ALTO', color: 'text-orange-400' },
  critical: { label: 'CRÍTICO', color: 'text-red-500 animate-pulse' },
}

const TYPE_CONFIG = {
  proposed: { label: 'PROPOSTA', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  passed: { label: 'APROVADA', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  repealed: { label: 'REVOGADA', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
}

interface Props {
  item: LegislationChange
}

export default function LegislationTracker({ item }: Props) {
  const direction = DIRECTION_CONFIG[item.direction]
  const impact = IMPACT_CONFIG[item.impact_level]
  const type = TYPE_CONFIG[item.type]
  const { Icon } = direction

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 hover:border-[#00ff87]/30 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2">
          <Scale className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-sm text-white group-hover:text-[#00ff87] transition-colors leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 font-mono">{item.country_name}</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-500 font-mono">{CATEGORY_LABELS[item.category] || item.category}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${type.color}`}>{type.label}</span>
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${direction.color}`}>
            <Icon className="w-3 h-3 inline mr-0.5" />
            {direction.label}
          </span>
        </div>
      </div>

      {item.description && (
        <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">{item.description}</p>
      )}

      {item.ai_analysis && (
        <div className="bg-[#111827] rounded p-2 mb-2 border border-[#00ff87]/10">
          <div className="flex items-center gap-1 mb-1">
            <Brain className="w-3 h-3 text-[#00ff87]" />
            <span className="text-xs text-[#00ff87] font-mono">ANÁLISE LLM</span>
          </div>
          <p className="text-xs text-gray-300 line-clamp-3">{item.ai_analysis}</p>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-mono font-bold ${impact.color}`}>
          IMPACTO: {impact.label}
        </span>
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#00ff87] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <div className="ml-auto text-xs text-gray-600 font-mono">
          {formatDistanceToNow(new Date(item.published_at), { addSuffix: true, locale: ptBR })}
        </div>
      </div>
    </div>
  )
}
