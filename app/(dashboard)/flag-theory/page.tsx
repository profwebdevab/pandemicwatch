'use client'
import { useState, useEffect } from 'react'
import type { FreedomScore } from '@/types'
import { Flag, Building2, Briefcase, Globe, Heart, CreditCard, CheckCircle2, XCircle, Info } from 'lucide-react'

const FLAG_CATEGORIES = [
  {
    id: 'residence',
    title: '1ª Bandeira — Residência Fiscal',
    icon: Globe,
    description: 'Onde você paga impostos. Idealmente um país com imposto territorial (só tributa renda gerada localmente) ou sem imposto de renda.',
    color: '#00ff87',
    countries: [
      { code: 'PY', name: 'Paraguai', reason: 'Imposto territorial, sem imposto sobre ganhos de capital, residência simples por $5.500', pros: ['Imposto territorial', 'Sem imposto sobre ganhos de capital', 'Residência rápida por investimento', 'Custo muito baixo'], cons: ['Infraestrutura limitada', 'Idioma espanhol', 'Clima quente'], cost: 700, difficulty: 'easy' as const, covid_score: 8 },
      { code: 'PA', name: 'Panamá', reason: 'Imposto territorial, hub financeiro, visto Friendly Nations disponível para brasileiros', pros: ['Imposto territorial', 'Dolarizado', 'Banking robusto', 'Visto Friendly Nations'], cons: ['Custo médio-alto', 'Burocracia'], cost: 1500, difficulty: 'easy' as const, covid_score: 7 },
      { code: 'AE', name: 'Emirados Árabes', reason: 'Zero imposto de renda pessoal, hub global de negócios', pros: ['Sem imposto de renda', 'Infraestrutura world class', 'Hub global'], cons: ['Custo alto', 'Temperatura extrema', 'Restrições culturais'], cost: 3500, difficulty: 'medium' as const, covid_score: 6 },
      { code: 'GE', name: 'Geórgia', reason: 'Imposto territorial, 1% de imposto para pequenas empresas, maior liberdade pós-COVID', pros: ['Imposto territorial', 'Regime fiscal 1%', 'Alta liberdade', 'Baixo custo'], cons: ['Região geopoliticamente instável', 'Idioma georgiano'], cost: 800, difficulty: 'easy' as const, covid_score: 9 },
    ],
  },
  {
    id: 'passport',
    title: '2ª Bandeira — Segundo Passaporte',
    icon: Flag,
    description: 'Backup de cidadania que abre portas quando seu passaporte de origem se torna problemático ou é restringido.',
    color: '#4da6ff',
    countries: [
      { code: 'PT', name: 'Portugal', reason: 'Cidadania por investimento (Golden Visa), acesso à UE, fácil para brasileiros pela língua', pros: ['Cidadania EU', 'Língua portuguesa', 'Golden Visa disponível', 'NHR fiscal'], cons: ['Golden Visa mais restrito agora', 'Custo de vida subindo', 'Resposta COVID ruim'], cost: 2000, difficulty: 'medium' as const, covid_score: 6 },
      { code: 'DM', name: 'Dominica', reason: 'Passaporte por investimento mais barato do mundo ($100k), acesso a 140+ países', pros: ['Programa de cidadania mais barato', 'Processo rápido (3-6 meses)', 'Acesso amplo sem visto'], cons: ['País pequeno', 'Pouca utilidade prática'], cost: 1200, difficulty: 'easy' as const, covid_score: 7 },
      { code: 'VU', name: 'Vanuatu', reason: 'Passaporte por investimento, cidadania em 60 dias, acesso ao Reino Unido', pros: ['Processo mais rápido do mundo', 'Sem visita obrigatória', 'Acesso ao UK'], cons: ['Localização remota', 'Passaporte fraco na UE'], cost: 2000, difficulty: 'easy' as const, covid_score: 8 },
    ],
  },
  {
    id: 'banking',
    title: '3ª Bandeira — Banking Offshore',
    icon: CreditCard,
    description: 'Onde você guarda e movimenta dinheiro. Diversificação bancária protege contra confisco, controle de capitais e instabilidade.',
    color: '#ffb347',
    countries: [
      { code: 'GE', name: 'Geórgia', reason: 'Conta aberta sem visita, Bank of Georgia e TBC Bank, sem FATCA', pros: ['Abertura remota possível', 'Sem FATCA para não-residentes', 'Proteção de depósitos', 'Multi-moeda'], cons: ['Bancos menores', 'Geopolítica incerta'], cost: 800, difficulty: 'easy' as const, covid_score: 9 },
      { code: 'AE', name: 'EAU (Dubai)', reason: 'Hub bancário global, sem FATCA, acesso a bancos internacionais', pros: ['Hub financeiro global', 'Proteção patrimonial robusta', 'Multi-moeda'], cons: ['Requer presença física', 'Custo alto'], cost: 3500, difficulty: 'medium' as const, covid_score: 6 },
      { code: 'SG', name: 'Singapura', reason: 'Talvez o sistema bancário mais robusto do mundo, mas requer visita', pros: ['Solidez absoluta', 'Sistema jurídico confiável', 'Multi-jurisdicional'], cons: ['Requer visita + alto patrimônio', 'Custo altíssimo'], cost: 4000, difficulty: 'hard' as const, covid_score: 6 },
    ],
  },
  {
    id: 'business',
    title: '4ª Bandeira — Base de Negócios',
    icon: Briefcase,
    description: 'Onde sua empresa está registrada. País com tributação baixa, proteção jurídica e reputação internacional.',
    color: '#c084fc',
    countries: [
      { code: 'EE', name: 'Estônia (e-Residency)', reason: '0% de imposto sobre lucros retidos, e-Residency disponível online, dentro da UE', pros: ['e-Residency 100% digital', '0% sobre lucros retidos', 'Acesso ao mercado EU', 'Infraestrutura digital'], cons: ['20% quando distribuído', 'Requer contabilidade EU'], cost: 2000, difficulty: 'easy' as const, covid_score: 7 },
      { code: 'HK', name: 'Hong Kong', reason: 'Imposto territorial, 16.5% flat, sistema jurídico common law', pros: ['Imposto territorial', 'Common law', 'Hub Ásia-Pacífico'], cons: ['Situação política com China', 'Custo alto'], cost: 5000, difficulty: 'medium' as const, covid_score: 5 },
      { code: 'AE', name: 'Free Zones UAE', reason: '0% imposto corporativo em Free Zones, 100% propriedade estrangeira', pros: ['0% corporate tax em FZ', '100% propriedade estrangeira', 'Hub global'], cons: ['Setup caro ($3k-$10k)', 'Precisa renovar anualmente'], cost: 3500, difficulty: 'medium' as const, covid_score: 6 },
    ],
  },
  {
    id: 'lifestyle',
    title: '5ª Bandeira — Estilo de Vida',
    icon: Heart,
    description: 'Onde você vive de fato. Qualidade de vida, comunidade, clima, custo, liberdade social.',
    color: '#f472b6',
    countries: [
      { code: 'GE', name: 'Geórgia (Tbilisi)', reason: 'Cidade vibrante, custo baixíssimo, ótima gastronomia, alta liberdade pós-COVID', pros: ['Custo baixíssimo', 'Comunidade nômade ativa', 'Alta liberdade', 'Gastronomia excelente'], cons: ['Geopolítica', 'Trânsito caótico'], cost: 800, difficulty: 'easy' as const, covid_score: 9 },
      { code: 'MX', name: 'México (CDMX/Oaxaca)', reason: 'Cultura rica, comunidade expat enorme, custo moderado, sem lockdowns forçados', pros: ['Comunidade expat grande', 'Cultura e gastronomia', 'Custo razoável', 'Voos para EUA'], cons: ['Segurança variada por região', 'Burocracia'], cost: 1000, difficulty: 'easy' as const, covid_score: 8 },
      { code: 'TH', name: 'Tailândia (Chiang Mai)', reason: 'LTR Visa para nômades, custo acessível, infraestrutura digital excelente', pros: ['LTR Visa disponível', 'Infraestrutura nômade', 'Custo moderado', 'Clima tropical'], cons: ['Calor intenso', 'Vistos complexos', 'Barreira cultural'], cost: 1200, difficulty: 'medium' as const, covid_score: 6 },
      { code: 'CO', name: 'Colômbia (Medellín)', reason: 'Cidade de eterna primavera, Digital Nomad Visa, custo acessível', pros: ['Clima perfeito', 'Digital Nomad Visa', 'Custo baixo', 'Comunidade expat'], cons: ['Segurança melhorou mas ainda preocupa', 'Burocracia'], cost: 900, difficulty: 'easy' as const, covid_score: 7 },
    ],
  },
]

const DIFFICULTY_CONFIG = {
  easy: { label: 'FÁCIL', color: 'text-green-400' },
  medium: { label: 'MÉDIO', color: 'text-yellow-400' },
  hard: { label: 'DIFÍCIL', color: 'text-red-400' },
}

export default function FlagTheoryPage() {
  const [activeFlag, setActiveFlag] = useState('residence')

  const activeCategory = FLAG_CATEGORIES.find(c => c.id === activeFlag)!

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-mono font-bold text-[#00ff87]">FLAG THEORY — 5 BANDEIRAS</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Diversificação jurisdicional para maximizar liberdade e minimizar riscos
        </p>
      </div>

      {/* Intro */}
      <div className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#00ff87] shrink-0 mt-0.5" />
          <div className="text-xs text-gray-400 font-mono leading-relaxed">
            <span className="text-[#00ff87] font-bold">Flag Theory</span> é a estratégia de distribuir sua vida por múltiplas jurisdições:
            viver onde quiser, pagar impostos onde for mais vantajoso, guardar dinheiro onde for mais seguro e ter documentos
            de países que abram mais portas. O objetivo é reduzir dependência de um único Estado.
          </div>
        </div>
      </div>

      {/* Flag Selector */}
      <div className="flex gap-2 flex-wrap">
        {FLAG_CATEGORIES.map(({ id, title, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveFlag(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all font-mono text-xs ${
              activeFlag === id
                ? 'border-opacity-100 bg-opacity-10 font-bold'
                : 'border-[#1f2937] text-gray-500 hover:border-opacity-50'
            }`}
            style={activeFlag === id ? {
              borderColor: color,
              backgroundColor: color + '15',
              color,
            } : {}}
          >
            <Icon className="w-3.5 h-3.5" />
            {title.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* Active Category */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <activeCategory.icon className="w-5 h-5" style={{ color: activeCategory.color }} />
          <div>
            <h2 className="font-mono font-bold text-white">{activeCategory.title}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{activeCategory.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory.countries.map((country) => {
            const diff = DIFFICULTY_CONFIG[country.difficulty]
            return (
              <div
                key={country.code}
                className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 hover:border-[#00ff87]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-mono font-bold text-white">{country.name}</h3>
                    <span className={`text-xs font-mono ${diff.color}`}>{diff.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono">COVID SCORE</div>
                    <div
                      className="text-lg font-mono font-bold"
                      style={{ color: country.covid_score >= 8 ? '#00ff87' : country.covid_score >= 6 ? '#ffb347' : '#ff6b35' }}
                    >
                      {country.covid_score}/10
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-mono mb-3 leading-relaxed">{country.reason}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-xs text-green-400 font-mono mb-1">✓ PRÓS</div>
                    <ul className="space-y-0.5">
                      {country.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-1 text-xs text-gray-400 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-red-400 font-mono mb-1">✗ CONS</div>
                    <ul className="space-y-0.5">
                      {country.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-1 text-xs text-gray-400 font-mono">
                          <XCircle className="w-3 h-3 text-red-700 shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1f2937]">
                  <span className="text-xs text-gray-500 font-mono">
                    ~${country.cost.toLocaleString('en-US')}/mês
                  </span>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded border"
                    style={{ color: activeCategory.color, borderColor: activeCategory.color + '40', backgroundColor: activeCategory.color + '10' }}
                  >
                    {country.code}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#0d1117] border border-yellow-400/10 rounded-lg p-4">
        <p className="text-xs text-gray-600 font-mono leading-relaxed">
          ⚠️ As informações aqui são educacionais. Leis fiscais mudam constantemente.
          Consulte sempre um advogado especializado em planejamento tributário internacional antes de tomar decisões.
          Dados de COVID Score baseados no histórico 2020-2023 conforme análise do Claude AI.
        </p>
      </div>
    </div>
  )
}
