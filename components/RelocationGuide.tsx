'use client'
import { useState } from 'react'
import type { RelocationGuide, RelocationWizardAnswers } from '@/types'
import { DollarSign, FileText, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'

interface WizardProps {
  onComplete: (answers: RelocationWizardAnswers) => void
  loading?: boolean
}

const BUDGET_OPTIONS = [
  { value: 'under500', label: 'Menos de $500/mês', desc: 'Destinos de baixíssimo custo' },
  { value: '500-1000', label: '$500 – $1.000/mês', desc: 'América Latina, Geórgia, Sudeste Asiático' },
  { value: '1000-2000', label: '$1.000 – $2.000/mês', desc: 'Portugal, México, Colômbia' },
  { value: '2000-5000', label: '$2.000 – $5.000/mês', desc: 'Europa Ocidental, EAU, Tailândia' },
  { value: 'over5000', label: 'Acima de $5.000/mês', desc: 'Sem restrição de destino' },
]

const PRIORITY_OPTIONS = [
  'Liberdades civis',
  'Custo de vida baixo',
  'Facilidade de visto',
  'Qualidade de vida',
  'Acesso a serviços de saúde',
  'Comunidade expat',
  'Estabilidade política',
  'Clima agradável',
  'Internet rápida',
  'Segurança pessoal',
]

export function RelocationWizard({ onComplete, loading }: WizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<RelocationWizardAnswers>>({
    priorities: [],
    languages: [],
    region_preference: [],
  })

  function update(key: keyof RelocationWizardAnswers, value: unknown) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function toggleArray(key: 'priorities' | 'languages' | 'region_preference', value: string) {
    setAnswers((prev) => {
      const arr = (prev[key] || []) as string[]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  function finish() {
    if (answers.budget && answers.profession && answers.family_size) {
      onComplete(answers as RelocationWizardAnswers)
    }
  }

  const steps = [
    {
      title: 'Qual é seu orçamento mensal?',
      content: (
        <div className="space-y-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { update('budget', opt.value); setStep(1) }}
              className={`w-full text-left p-3 rounded border transition-all font-mono ${
                answers.budget === opt.value
                  ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                  : 'border-[#1f2937] text-gray-300 hover:border-[#00ff87]/50'
              }`}
            >
              <div className="text-sm font-bold">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Qual é sua situação profissional?',
      content: (
        <div className="space-y-2">
          {[
            { value: 'remote_worker', label: 'Trabalhador Remoto', desc: 'Freelancer, emprego remoto' },
            { value: 'entrepreneur', label: 'Empreendedor', desc: 'Dono de negócio, investidor' },
            { value: 'retired', label: 'Aposentado', desc: 'Renda passiva ou pensão' },
            { value: 'student', label: 'Estudante', desc: 'Intercâmbio ou estudo no exterior' },
            { value: 'other', label: 'Outro', desc: 'Outra situação' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { update('profession', opt.value); setStep(2) }}
              className={`w-full text-left p-3 rounded border transition-all font-mono ${
                answers.profession === opt.value
                  ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                  : 'border-[#1f2937] text-gray-300 hover:border-[#00ff87]/50'
              }`}
            >
              <div className="text-sm font-bold">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.desc}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Quantas pessoas vão se mudar?',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: '1', label: 'Só eu', icon: '👤' },
            { value: '2', label: 'Eu + cônjuge', icon: '👫' },
            { value: '3-4', label: 'Família pequena', icon: '👨‍👩‍👦' },
            { value: '5+', label: 'Família grande', icon: '👨‍👩‍👧‍👦' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { update('family_size', opt.value); setStep(3) }}
              className={`p-4 rounded border transition-all font-mono text-center ${
                answers.family_size === opt.value
                  ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                  : 'border-[#1f2937] text-gray-300 hover:border-[#00ff87]/50'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-xs">{opt.label}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'O que é mais importante para você?',
      content: (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => toggleArray('priorities', p)}
                className={`text-xs font-mono px-2 py-1 rounded border transition-all ${
                  (answers.priorities || []).includes(p)
                    ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]'
                    : 'border-[#1f2937] text-gray-400 hover:border-[#00ff87]/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={finish}
            disabled={loading || (answers.priorities || []).length === 0}
            className="w-full flex items-center justify-center gap-2 bg-[#00ff87] text-black font-mono font-bold py-3 rounded hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            {loading ? 'Consultando LLM...' : 'Encontrar meus destinos'}
          </button>
        </div>
      ),
    },
  ]

  const currentStep = steps[step]

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= step ? 'bg-[#00ff87]' : 'bg-[#1f2937]'
            }`}
          />
        ))}
      </div>
      <h3 className="text-sm font-mono text-[#00ff87] mb-4 font-bold">{currentStep.title}</h3>
      {currentStep.content}
      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mt-3 text-xs text-gray-600 font-mono hover:text-gray-400 transition-colors"
        >
          ← Voltar
        </button>
      )}
    </div>
  )
}

interface GuideProps {
  guide: RelocationGuide
}

export function RelocationGuideCard({ guide }: GuideProps) {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#00ff87]/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono font-bold text-[#00ff87] text-lg">{guide.country_name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                <DollarSign className="w-3 h-3" />
                ${guide.monthly_budget_min_usd}–${guide.monthly_budget_max_usd}/mês
              </span>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-1 bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20 rounded">
            {guide.budget_tier.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#1f2937]">
        {(guide.steps || []).map((step, i) => (
          <div key={i}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left p-4 flex items-center gap-3 hover:bg-[#111827] transition-colors"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                expanded === i ? 'bg-[#00ff87] text-black' : 'bg-[#1f2937] text-gray-400'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-mono text-white">{step.title}</div>
                <div className="text-xs text-gray-500 font-mono">{step.duration}</div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 ml-9">
                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{step.description}</p>
                {step.documents && step.documents.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400 font-mono">DOCUMENTOS</span>
                    </div>
                    <ul className="space-y-1">
                      {step.documents.map((doc, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-gray-400 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-gray-600 shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.tips && step.tips.length > 0 && (
                  <div>
                    <div className="text-xs text-yellow-400 font-mono mb-1">💡 DICAS</div>
                    <ul className="space-y-1">
                      {step.tips.map((tip, j) => (
                        <li key={j} className="text-xs text-gray-400 font-mono">→ {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.cost_usd && (
                  <div className="mt-2 text-xs text-green-400 font-mono">
                    Custo estimado: ~${step.cost_usd.toLocaleString('en-US')} USD
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
