'use client'
import { useState, useEffect } from 'react'
import { RefreshCw, Loader2, CheckCircle2, XCircle, Terminal,
         Newspaper, Shield, Scale, Brain, LogOut, Database,
         Cpu, Rss, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JobResult {
  ok?: boolean
  error?: string
  fetched?: number
  saved?: number
  updated?: number
  processed?: number
  summarized?: number
  [key: string]: unknown
}

interface Job { id: string; label: string; description: string; icon: React.ElementType; color: string }

const JOBS: Job[] = [
  { id: 'news',      label: 'Buscar Notícias',             description: 'RSS (WHO, CDC, ECDC, ProMED) + NewsAPI', icon: Newspaper, color: 'text-blue-400' },
  { id: 'summarize', label: 'Resumir com LLM',             description: 'Claude resume lote de 5 artigos em PT-BR', icon: Brain,     color: 'text-[#00ff87]' },
  { id: 'freedom',   label: 'Scores de Liberdade',         description: 'Recalcula e salva scores dos 20 países',  icon: Shield,    color: 'text-yellow-400' },
  { id: 'legislation',label: 'Buscar Legislação',          description: 'Coleta notícias categorizadas como lei',  icon: Scale,     color: 'text-purple-400' },
]

function fmt(data: JobResult): string {
  const parts: string[] = []
  if (data.fetched  !== undefined) parts.push(`${data.fetched} buscados`)
  if (data.saved    !== undefined) parts.push(`${data.saved} salvos`)
  if (data.updated  !== undefined) parts.push(`${data.updated} atualizados`)
  if (data.summarized !== undefined) parts.push(`${data.summarized} resumidos`)
  if (data.processed !== undefined) parts.push(`${data.processed} processados`)
  return parts.length ? parts.join(' · ') : 'OK'
}

interface DbStats { outbreaks: number; freedom: number; news: number; legislation: number }

export default function AdminPage() {
  const [results, setResults] = useState<Record<string, { status: 'idle'|'loading'|'ok'|'error'; data?: JobResult }>>({})
  const [log,     setLog]     = useState<string[]>([])
  const [stats,   setStats]   = useState<DbStats | null>(null)
  const [lastRun, setLastRun] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    fetchStats()
    const saved = localStorage.getItem('pw_admin_lastrun')
    if (saved) setLastRun(JSON.parse(saved) as Record<string, string>)
  }, [])

  async function fetchStats() {
    try {
      const r = await fetch('/api/admin-stats')
      if (r.ok) setStats(await r.json() as DbStats)
    } catch { /* ignore */ }
  }

  function addLog(msg: string) {
    setLog((prev) => [`[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`, ...prev].slice(0, 100))
  }

  async function runJob(id: string) {
    setResults((prev) => ({ ...prev, [id]: { status: 'loading' } }))
    addLog(`▶ Iniciando: ${id}`)
    try {
      const res  = await fetch(`/api/cron?type=${id}`)
      const data = await res.json() as JobResult
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      setResults((prev) => ({ ...prev, [id]: { status: 'ok', data } }))
      const ts = new Date().toLocaleTimeString('pt-BR')
      setLastRun((prev) => {
        const next = { ...prev, [id]: ts }
        localStorage.setItem('pw_admin_lastrun', JSON.stringify(next))
        return next
      })
      addLog(`✓ ${id}: ${fmt(data)}`)
      fetchStats()
    } catch (e) {
      setResults((prev) => ({ ...prev, [id]: { status: 'error', data: { error: String(e) } } }))
      addLog(`✗ ${id}: ${String(e)}`)
    }
  }

  async function runAll() {
    for (const job of JOBS) await runJob(job.id)
  }

  async function logout() {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const anyLoading = Object.values(results).some((r) => r.status === 'loading')

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-[#00ff87]">PAINEL ADMIN</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">Coleta, processamento e monitoramento do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runAll}
            disabled={anyLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ff87]/10 border border-[#00ff87]/30 text-[#00ff87] text-xs font-mono rounded hover:bg-[#00ff87]/20 transition-all disabled:opacity-50"
          >
            {anyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Executar Todos
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-mono rounded hover:bg-red-400/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </div>

      {/* System Status */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { icon: Rss,      label: 'Notícias',    value: stats.news,        color: 'text-blue-400' },
            { icon: Cpu,      label: 'Surtos',       value: stats.outbreaks,   color: 'text-red-400'  },
            { icon: Shield,   label: 'Scores',       value: stats.freedom,     color: 'text-yellow-400' },
            { icon: Database, label: 'Legislação',   value: stats.legislation, color: 'text-purple-400' },
          ] as const).map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-3 flex items-center gap-3">
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
              <div>
                <div className={`text-lg font-mono font-bold ${color}`}>{value}</div>
                <div className="text-[10px] text-gray-600 font-mono">{label.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JOBS.map((job) => {
          const result = results[job.id]
          const status = result?.status ?? 'idle'

          return (
            <div key={job.id} className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <job.icon className={`w-4 h-4 ${job.color}`} />
                  <h3 className="font-mono text-sm text-white font-bold">{job.label}</h3>
                </div>
                {status === 'ok'    && <CheckCircle2 className="w-4 h-4 text-[#00ff87]" />}
                {status === 'error' && <XCircle      className="w-4 h-4 text-red-400"   />}
              </div>

              <p className="text-xs text-gray-500 font-mono mb-1 leading-relaxed">{job.description}</p>

              {lastRun[job.id] && status === 'idle' && (
                <div className="flex items-center gap-1 text-[10px] text-gray-700 font-mono mb-2">
                  <Clock className="w-3 h-3" /> última execução: {lastRun[job.id]}
                </div>
              )}

              {result?.data && status !== 'loading' && (
                <div className="bg-[#111827] rounded p-2 mb-3 font-mono text-xs">
                  {status === 'ok'
                    ? <span className="text-[#00ff87]">{fmt(result.data)}</span>
                    : <span className="text-red-400">{result.data.error as string}</span>}
                </div>
              )}

              <button
                onClick={() => runJob(job.id)}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#111827] border border-[#1f2937] text-xs font-mono text-gray-300 rounded hover:border-[#00ff87]/30 hover:text-[#00ff87] transition-all disabled:opacity-50"
              >
                {status === 'loading'
                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Executando...</>
                  : <><RefreshCw className="w-3 h-3" /> Executar</>}
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
            <button onClick={() => setLog([])} className="ml-auto text-xs text-gray-600 font-mono hover:text-gray-400">
              limpar
            </button>
          )}
        </div>
        {log.length === 0
          ? <p className="text-xs text-gray-700 font-mono">Nenhuma atividade ainda. Execute um job acima.</p>
          : (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {log.map((line, i) => (
                <div key={i} className={`text-xs font-mono leading-relaxed ${line.includes('✓') ? 'text-[#00ff87]/70' : line.includes('✗') ? 'text-red-400/70' : 'text-gray-500'}`}>
                  {line}
                </div>
              ))}
            </div>
          )}
      </div>

    </div>
  )
}
