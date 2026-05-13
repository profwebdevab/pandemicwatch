import type { FreedomScore } from '@/types'
import { Shield, TrendingUp, TrendingDown, Wifi, Globe, Briefcase } from 'lucide-react'

const SUITABILITY_CONFIG = {
  excellent: { label: 'EXCELENTE', color: 'text-[#00ff87] bg-[#00ff87]/10 border-[#00ff87]/30' },
  good: { label: 'BOM', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  fair: { label: 'RAZOÁVEL', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  poor: { label: 'RUIM', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
}

const MANDATE_CONFIG = {
  none: { label: 'NENHUM', color: 'text-green-400' },
  soft: { label: 'BRANDO', color: 'text-yellow-400' },
  hard: { label: 'RÍGIDO', color: 'text-orange-400' },
  forced: { label: 'FORÇADO', color: 'text-red-500' },
}

function ScoreBar({ value, max = 10, color = '#00ff87' }: { value: number; max?: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="w-full bg-[#1f2937] rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

interface Props {
  score: FreedomScore
  compact?: boolean
}

export default function FreedomScoreCard({ score, compact = false }: Props) {
  const suitability = SUITABILITY_CONFIG[score.flag_theory_suitability]
  const mandate = MANDATE_CONFIG[score.vaccine_mandate_level]

  const scoreColor =
    score.overall_score >= 7.5 ? '#00ff87' :
    score.overall_score >= 6.0 ? '#ffb347' :
    score.overall_score >= 4.5 ? '#ff6b35' : '#ff3b3b'

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 hover:border-[#00ff87]/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono font-bold text-white group-hover:text-[#00ff87] transition-colors">
              {score.country_name}
            </h3>
            <span className="text-xs text-gray-500 font-mono bg-[#1f2937] px-1.5 py-0.5 rounded">
              {score.country_code}
            </span>
          </div>
          {score.digital_nomad_visa && (
            <div className="flex items-center gap-1 mt-0.5">
              <Wifi className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 font-mono">VISTO NÔMADE DIGITAL</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold" style={{ color: scoreColor }}>
            {score.overall_score.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 font-mono">/ 10</div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="space-y-2 mb-3">
            {[
              { label: 'Resposta COVID', value: score.pandemic_response_score },
              { label: 'Liberdade Econômica', value: score.economic_freedom },
              { label: 'Liberdade Pessoal', value: score.personal_freedom },
              { label: 'Liberdade de Imprensa', value: score.press_freedom },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-gray-400 font-mono">{label}</span>
                  <span className="text-xs font-mono" style={{ color: scoreColor }}>{value?.toFixed(1)}</span>
                </div>
                <ScoreBar value={value || 0} color={scoreColor} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-[#111827] rounded p-2">
              <div className="text-xs text-gray-500 font-mono mb-1">LOCKDOWN</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-2 rounded-sm"
                    style={{ backgroundColor: i < (score.lockdown_severity || 0) ? '#ff3b3b' : '#1f2937' }}
                  />
                ))}
              </div>
            </div>
            <div className="bg-[#111827] rounded p-2">
              <div className="text-xs text-gray-500 font-mono mb-1">MANDATO VAC.</div>
              <span className={`text-xs font-mono font-bold ${mandate.color}`}>{mandate.label}</span>
            </div>
          </div>

          {score.flag_theory_tags && score.flag_theory_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {score.flag_theory_tags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-1.5 py-0.5 bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${suitability.color}`}>
          FLAG THEORY: {suitability.label}
        </span>
        {score.cost_of_living_usd && (
          <span className="text-xs text-gray-400 font-mono">
            ~${score.cost_of_living_usd.toLocaleString('pt-BR')}/mês
          </span>
        )}
      </div>
    </div>
  )
}
