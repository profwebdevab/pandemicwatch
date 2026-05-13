import type { NewsArticle } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ExternalLink, Brain, Tag } from 'lucide-react'

const SENTIMENT_CONFIG = {
  restrictive: { label: 'RESTRITIVO', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
  neutral: { label: 'NEUTRO', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
  libertarian: { label: 'LIBERTÁRIO', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
}

const CATEGORY_CONFIG = {
  outbreak: { label: 'SURTO', color: 'text-orange-400' },
  legislation: { label: 'LEGISLAÇÃO', color: 'text-blue-400' },
  freedom: { label: 'LIBERDADE', color: 'text-green-400' },
  relocation: { label: 'RELOCAÇÃO', color: 'text-purple-400' },
}

interface Props {
  article: NewsArticle
  compact?: boolean
}

export default function NewsCard({ article, compact = false }: Props) {
  const sentiment = article.sentiment ? SENTIMENT_CONFIG[article.sentiment] : null
  const category = article.category ? CATEGORY_CONFIG[article.category] : null

  return (
    <div className="bg-[#0d1117] border border-[#00ff87]/10 rounded-lg p-4 hover:border-[#00ff87]/30 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono text-sm text-white group-hover:text-[#00ff87] transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-gray-600 hover:text-[#00ff87] transition-colors mt-0.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {!compact && article.ai_summary && (
        <div className="bg-[#111827] rounded p-2 mb-2 border border-[#00ff87]/10">
          <div className="flex items-center gap-1 mb-1">
            <Brain className="w-3 h-3 text-[#00ff87]" />
            <span className="text-xs text-[#00ff87] font-mono">ANÁLISE LLM</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{article.ai_summary}</p>
        </div>
      )}

      {!compact && article.summary && !article.ai_summary && (
        <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-3">{article.summary}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {sentiment && (
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${sentiment.color}`}>
            {sentiment.label}
          </span>
        )}
        {category && (
          <span className={`text-xs font-mono ${category.color}`}>
            <Tag className="w-3 h-3 inline mr-0.5" />
            {category.label}
          </span>
        )}
        {article.pathogen_mentioned && article.pathogen_mentioned.length > 0 && (
          <span className="text-xs text-orange-400/70 font-mono">
            {article.pathogen_mentioned.slice(0, 2).join(', ')}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {article.source && (
            <span className="text-xs text-gray-600 font-mono">{article.source}</span>
          )}
          {article.published_at && (
            <span className="text-xs text-gray-600 font-mono">
              {formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: ptBR })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
