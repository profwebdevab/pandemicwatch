'use client'
import { useState } from 'react'
import { RefreshCw, Loader2, CheckCircle2, XCircle, Terminal, Newspaper, Shield, Scale, Brain } from 'lucide-react'

interface JobResult {
  ok?: boolean
  error?: string
  fetched?: number
  saved?: number
  updated?: number
  processed?: number
  [key: string]: unknown
}

interface Job {
  id: string
  label: string
  description: string
  icon: React.ElementType
  color: string
}

const JOBS: Job[] = [
  {
    id: 'news',
    label: 'Buscar Notícias',
    description: 'Coleta RSS (WHO, CDC, ECDC, ProMED) + NewsAPI e salva no banco',
    icon: Newspaper,
    color: 'text-blue-400',
  },
  {
    id: 'summarize',
    label: 'Resumir com LLM',
    description: 'Usa Claude API para resumir artigos sem resumo (lote de 5)',
    icon: Brain,
    color: 'text-[#00ff87]',
  },
  {
    id: 'freedom',
    label: 'Atualizar Scores de Liberdade',
    description: 'Recalcula e salva os scores de liberdade dos países',
    icon: Shield,
    color: 'text-yellow-400',
  },
  {
    id: 'legislation',
    label: 'Buscar Legislação',
    description: 'Coleta notícias categorizadas como legislação',
    icon: Scale,
    color: 'text-purple-400',
  },
]

export default function AdminPage() {
  const [results, setResults] = useState<Record<string, { status: 'idle' | 'loading' | 'ok' | 'error'; data?: JobResult }>>({})
  const [log, setLog] = useState<string[]>([])

  function addLog(msg: string) {
    setLog((prev) => [`[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`, ...prev].slice(0, 50))
  }

  async function runJob(id: string) {
    setResults((prev) => ({ ...prev, [id]: { status: 'loading' } }))
    addLog(`Iniciando job: ${id}...`)
    try {
      const res = await fetch(`/api/cron?type=${id}`)
      const data = await res.json() as JobResult
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      setResults((prev) => ({ ...prev, [id]: { status: 'ok', data } }))
      addLog(`✓ ${id}: ${JSON.stringify(data)}`)
    } catch (e) {
      setResults((prev) => ({ ...prev, [id]: { status: 'error', data: { error: String(e) } } }))
      addLog(`✗ ${id}: ${String(e)}`)
    }
  }

  async function runAll() {
    for (const job of JOBS) {
      await runJob(job.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-[#00ff87]">PAINEL ADMIN</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Dispare os jobs de coleta e processamento de dados manualmente
          </p>
        </div>
        <button
          onClick={runAll}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff87]/10 border border-[#00ff87]/30 text-[#00ff87] text-xs font-mono rounded hover:bg-[#00ff87]/20 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Executar Todos
        </button>
      </div>

      {/* Pré-requisitos */}
      <div className="bg-[#0d1117] border border-yellow-400/20 rounded-lg p-4">
        <h2 className="text-xs font-mono text-yellow-400 font-bold mb-2">PRÉ-REQUISITOS</h2>
        <ul className="space-y-1">
          {[
            { key: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase URL' },
            { key: 'SUPABASE_SERVICE_ROLE_KEY', label: 'Supabase Service Key' },
            { key: 'ANTHROPIC_API_KEY', label: 'Anthropic API Key (para resumos LLM)' },
            { key: 'NEWSAPI_KEY', label: 'NewsAPI Key (para notícias extras, opcional)' },
          ].map(({ label }) => (
            <li key={label} className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-600 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 font-mono mt-2">
          Configure em <span className="text-[#00ff87]">.env.local</span> e reinicie o servidor.
        </p>
      </div>

      {/* Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JOBS.map((job) => {
          const result = results[job.id]
          const status = result?.status ?? 'idle'

          return (
            <div key={job.id} className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <job.icon className={`w-4 h-4 ${job.color}`} />
                  <h3 className="font-mono text-sm text-white font-bold">{job.label}</h3>
                </div>
                {status === 'ok' && <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />}
                {status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
              </div>

              <p className="text-xs text-gray-500 font-mono mb-3 leading-relaxed">{job.description}</p>

              {result?.data && status !== 'loading' && (
                <div className="bg-[#111827] rounded p-2 mb-3 font-mono text-xs">
                  {status === 'ok' ? (
                    <span className="text-[#00ff87]">{JSON.stringify(result.data)}</span>
                  ) : (
                    <span className="text-red-400">{result.data.error as string}</span>
                  )}
                </div>
              )}

              <button
                onClick={() => runJob(job.id)}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#111827] border border-[#1f2937] text-xs font-mono text-gray-300 rounded hover:border-[#00ff87]/30 hover:text-[#00ff87] transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Executando...</>
                ) : (
                  <><RefreshCw className="w-3 h-3" /> Executar</>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Log */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-[#00ff87]" />
          <span className="text-xs font-mono text-[#00ff87] font-bold">LOG</span>
          {log.length > 0 && (
            <button
              onClick={() => setLog([])}
              className="ml-auto text-xs text-gray-600 font-mono hover:text-gray-400"
            >
              limpar
            </button>
          )}
        </div>
        {log.length === 0 ? (
          <p className="text-xs text-gray-700 font-mono">Nenhuma atividade ainda. Execute um job acima.</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i} className="text-xs font-mono text-gray-400 leading-relaxed">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guia rápido */}
      <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
        <h2 className="text-xs font-mono text-gray-400 font-bold mb-3">SEQUÊNCIA RECOMENDADA (PRIMEIRA VEZ)</h2>
        <ol className="space-y-2">
          {[
            'Crie conta no Supabase → execute supabase/migrations/001_initial.sql',
            'Crie conta no Anthropic → copie a API key',
            'Crie conta no NewsAPI → copie a API key (opcional, grátis)',
            'Copie .env.local.example → .env.local → preencha as chaves',
            'Reinicie o servidor: npm run dev',
            'Clique "Buscar Notícias" → aguarde coleta dos RSS feeds',
            'Clique "Resumir com LLM" → Claude resume os artigos em PT-BR',
            'Clique "Atualizar Scores de Liberdade" → scores dos 20 países',
            'Volte ao Dashboard → dados reais aparecem em tempo real',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-mono text-gray-400">
              <span className="text-[#00ff87] shrink-0 font-bold">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
