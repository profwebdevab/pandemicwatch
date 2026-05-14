'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Activity, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') || '/admin'

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin-auth?from=${encodeURIComponent(from)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        redirect: 'follow',
      })
      if (res.ok || res.redirected) {
        router.push(from)
        router.refresh()
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Erro ao autenticar')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="w-6 h-6 text-[#00ff87]" />
          <span className="text-lg font-mono font-bold text-[#00ff87] tracking-widest">
            PANDEMIC<span className="text-white">WATCH</span>
          </span>
        </div>

        <div className="bg-[#0d1117] border border-[#00ff87]/20 rounded-lg p-6 glow-green">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#00ff87]" />
            <h1 className="font-mono text-sm font-bold text-[#00ff87]">ACESSO RESTRITO — ADMIN</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">SENHA</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full bg-[#111827] border border-[#1f2937] text-gray-200 font-mono text-sm rounded px-3 py-2 focus:outline-none focus:border-[#00ff87]/50 transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00ff87]/10 border border-[#00ff87]/30 text-[#00ff87] text-xs font-mono rounded hover:bg-[#00ff87]/20 transition-all disabled:opacity-50"
            >
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verificando...</> : <>Entrar</>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 font-mono mt-4">
          Acesso exclusivo para administradores do sistema.
        </p>
      </div>
    </div>
  )
}
