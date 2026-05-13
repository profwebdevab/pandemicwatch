'use client'
import { useState } from 'react'
import { Brain, RefreshCw, Loader2 } from 'lucide-react'

interface Props {
  type: 'outbreak-summary' | 'legislation' | 'destinations'
  payload?: Record<string, unknown>
  title?: string
}

export default function AIInsights({ type, payload, title = 'Análise por LLM' }: Props) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchInsights() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...payload }),
      })
      const data = await res.json() as { summary?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed')
      setContent(data.summary || JSON.stringify(data, null, 2))
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#00ff87]" />
          <span className="font-mono text-sm text-[#00ff87] font-bold">{title}</span>
          <span className="text-xs text-gray-500 font-mono bg-[#00ff87]/10 px-1.5 py-0.5 rounded">
            Claude LLM
          </span>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-[#00ff87] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          {loading ? 'Analisando...' : content ? 'Atualizar' : 'Gerar análise'}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-400 font-mono bg-red-400/10 p-2 rounded">
          Erro: {error}
        </div>
      )}

      {!content && !loading && !error && (
        <div className="text-center py-6">
          <Brain className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-mono">
            Clique em &quot;Gerar análise&quot; para obter insights do Claude LLM
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-6 justify-center">
          <Loader2 className="w-4 h-4 text-[#00ff87] animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Consultando Claude API...</span>
        </div>
      )}

      {content && !loading && (
        <div className="prose prose-invert prose-sm max-w-none">
          <div className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap border-l-2 border-[#00ff87]/30 pl-3">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}
