'use client'
import { useState } from 'react'
import { RelocationWizard, RelocationGuideCard } from '@/components/RelocationGuide'
import type { RelocationWizardAnswers, RelocationGuide } from '@/types'
import { MapPin, Star, ChevronDown, Loader2 } from 'lucide-react'

interface Destination {
  country_code: string
  country_name: string
  reason: string
  score: number
}

const SAMPLE_GUIDES: RelocationGuide[] = [
  {
    id: '1',
    country_code: 'GE',
    country_name: 'Geórgia',
    budget_tier: 'budget',
    monthly_budget_min_usd: 600,
    monthly_budget_max_usd: 1200,
    steps: [
      {
        order: 1,
        title: 'Pesquisa e decisão',
        description: 'Pesquise Tbilisi e Batumi. Junte-se a grupos de expats brasileiros na Geórgia. Assista vlogs de pessoas que já fizeram a mudança.',
        duration: '2-4 semanas',
        cost_usd: 0,
        documents: [],
        tips: ['Grupos no Telegram: "Brasileiros na Geórgia"', 'Subreddit: r/georgia'],
      },
      {
        order: 2,
        title: 'Documentação necessária',
        description: 'Brasileiros entram na Geórgia sem visto por até 365 dias. Você precisa apenas do passaporte válido.',
        duration: '1-2 semanas',
        cost_usd: 200,
        documents: ['Passaporte válido', 'Comprovante de renda (recomendado)', 'Seguro de viagem'],
        tips: ['Renove o passaporte se vencer em menos de 6 meses', 'Leve cópia digital de todos os documentos'],
      },
      {
        order: 3,
        title: 'Chegada e primeiros dias',
        description: 'Voo direto não existe: geralmente via Istanbul (Turkish Airlines) ou Dubai. Hospede-se inicialmente em Airbnb ou hostel enquanto encontra apartamento.',
        duration: '1-2 semanas',
        cost_usd: 800,
        documents: [],
        tips: ['Aluguéis mensais em Tbilisi: $300-600 para apartamento decente', 'Bairros recomendados: Vake, Saburtalo', 'SIM card local: $5-10'],
      },
      {
        order: 4,
        title: 'Conta bancária',
        description: 'Abra conta no Bank of Georgia ou TBC Bank. Processo simples com passaporte. Conta multi-moeda disponível.',
        duration: '1 dia',
        cost_usd: 50,
        documents: ['Passaporte', 'Endereço local (pode ser Airbnb)'],
        tips: ['Bank of Georgia tem app excelente', 'Solicite cartão de débito internacional', 'TBC Pay funciona bem para transferências'],
      },
      {
        order: 5,
        title: 'Regularização (residência)',
        description: 'Para ficar além de 365 dias ou obter residência, registre empresa (1% de imposto) ou aplique para residência por investimento/propriedade.',
        duration: '2-4 semanas',
        cost_usd: 1500,
        documents: ['Passaporte', 'Comprovante de renda', 'Contrato de aluguel'],
        tips: ['Agência recomendada: Expat Georgia', 'Regime Individual Entrepreneur: 1% de imposto sobre faturamento'],
      },
      {
        order: 6,
        title: 'Primeiros 30 dias no destino',
        description: 'Explore a cidade, conheça a comunidade expat, instale VPN, configure cartões internacionais, encontre seu bairro ideal.',
        duration: '30 dias',
        cost_usd: 800,
        documents: [],
        tips: ['Rustaveli Ave para vida noturna', 'Mercearia mais barata: Fresco', 'Clínica com médicos que falam inglês: Evex'],
      },
      {
        order: 7,
        title: 'Regularização fiscal',
        description: 'Dependendo do seu país de origem, pode precisar notificar a Receita Federal sobre residência no exterior. Consulte um contador especializado.',
        duration: '1-3 meses',
        cost_usd: 500,
        documents: ['Prova de residência na Geórgia', 'Declaração de saída do Brasil (se aplicável)'],
        tips: ['Declaração de saída definitiva do Brasil isenta de IRPF sobre ganhos futuros', 'Consulte: Expat Tax Professionals'],
      },
    ],
    visa_process: {
      type: 'Visa-free (365 dias)',
      duration: '365 dias',
      cost_usd: 0,
      requirements: ['Passaporte brasileiro válido'],
      renewal: 'Saia e re-entre no país',
    },
    banking_options: [
      {
        bank_name: 'Bank of Georgia',
        account_type: 'Conta corrente multi-moeda',
        requirements: ['Passaporte', 'Endereço local'],
        monthly_fee_usd: 2,
        online_banking: true,
      },
    ],
    healthcare_info: {
      public_available: false,
      quality_score: 6,
      monthly_cost_usd_min: 30,
      monthly_cost_usd_max: 80,
      notes: 'Seguro privado básico custa $30-80/mês. Clínicas privadas boas em Tbilisi.',
    },
    communities: [
      'Telegram: Brasileiros na Geórgia',
      'Facebook: Expats in Georgia',
      'Reddit: r/tbilisi',
    ],
    updated_at: new Date().toISOString(),
  },
]

export default function RelocationPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedGuide, setSelectedGuide] = useState<RelocationGuide | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'wizard' | 'results' | 'guide'>('wizard')

  async function handleWizardComplete(answers: RelocationWizardAnswers) {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'destinations', answers }),
      })
      const data = await res.json() as { destinations?: Destination[]; error?: string }
      if (data.destinations) {
        setDestinations(data.destinations)
        setStep('results')
      }
    } catch {
      // On error, show sample results
      setDestinations([
        { country_code: 'GE', country_name: 'Geórgia', reason: 'Custo baixo, alta liberdade, sem lockdowns, imposto de 1% para empreendedores.', score: 9.2 },
        { country_code: 'PY', country_name: 'Paraguai', reason: 'Imposto territorial, residência fácil, custo muito baixo para sul-americanos.', score: 8.5 },
        { country_code: 'MX', country_name: 'México', reason: 'Comunidade expat enorme, sem lockdowns forçados, proximidade cultural.', score: 7.8 },
      ])
      setStep('results')
    } finally {
      setLoading(false)
    }
  }

  function viewGuide(countryCode: string) {
    const guide = SAMPLE_GUIDES.find(g => g.country_code === countryCode)
    if (guide) {
      setSelectedGuide(guide)
      setStep('guide')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-mono font-bold text-[#00ff87]">GUIA DE RELOCAÇÃO</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Encontre seu próximo país com base no seu perfil — passo a passo completo
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setStep('wizard')}
          className={step === 'wizard' ? 'text-[#00ff87]' : 'text-gray-600 hover:text-gray-400'}
        >
          Questionário
        </button>
        <span className="text-gray-700">›</span>
        <span className={step === 'results' || step === 'guide' ? 'text-gray-400' : 'text-gray-700'}>
          Destinos recomendados
        </span>
        <span className="text-gray-700">›</span>
        <span className={step === 'guide' ? 'text-gray-400' : 'text-gray-700'}>
          Guia detalhado
        </span>
      </div>

      {step === 'wizard' && (
        <div className="max-w-lg">
          <RelocationWizard onComplete={handleWizardComplete} loading={loading} />
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-gray-300 font-bold">
            TOP 3 DESTINOS RECOMENDADOS PARA VOCÊ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {destinations.map((dest, i) => (
              <div
                key={dest.country_code}
                className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg p-4 hover:border-[#00ff87]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#00ff87] text-black text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </div>
                    <h3 className="font-mono font-bold text-white">{dest.country_name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#00ff87]" />
                    <span className="text-sm font-mono text-[#00ff87] font-bold">{dest.score.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed mb-3">{dest.reason}</p>
                <button
                  onClick={() => viewGuide(dest.country_code)}
                  className="w-full text-xs font-mono py-2 bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20 rounded hover:bg-[#00ff87]/20 transition-colors"
                >
                  Ver guia completo →
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep('wizard')}
            className="text-xs text-gray-600 font-mono hover:text-gray-400 transition-colors"
          >
            ← Refazer questionário
          </button>
        </div>
      )}

      {step === 'guide' && selectedGuide && (
        <div className="space-y-4">
          <button
            onClick={() => setStep('results')}
            className="text-xs text-gray-600 font-mono hover:text-gray-400 transition-colors"
          >
            ← Voltar aos destinos
          </button>
          <RelocationGuideCard guide={selectedGuide} />
        </div>
      )}

      {/* Quick guides always visible */}
      <div>
        <h2 className="text-sm font-mono text-gray-300 font-bold mb-3">GUIAS RÁPIDOS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { country: 'Geórgia', budget: '$600-1200/mês', highlight: 'Sem visto, imposto 1%', tag: 'MAIS POPULAR' },
            { country: 'Paraguai', budget: '$500-900/mês', highlight: 'Imposto territorial, residência rápida', tag: 'MAIS BARATO' },
            { country: 'Portugal', budget: '$1800-3000/mês', highlight: 'Golden Visa, cidadania EU, língua PT', tag: 'EUROPEU' },
            { country: 'México', budget: '$800-1500/mês', highlight: 'Sem lockdowns, comunidade enorme', tag: 'FÁCIL ADAPTAÇÃO' },
          ].map(({ country, budget, highlight, tag }) => (
            <div key={country} className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-3 flex items-center justify-between hover:border-[#00ff87]/30 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white">{country}</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20 rounded">
                    {tag}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">{budget} · {highlight}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 -rotate-90" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
