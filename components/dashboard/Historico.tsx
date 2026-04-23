'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AnaliseHistorico } from '@/lib/types'
import { FileText, Loader2, InboxIcon } from 'lucide-react'

const DECISAO_DOT: Record<string, string> = {
  PARTICIPAR: 'bg-action',
  RESSALVAS: 'bg-amber-400',
  NAO_PARTICIPAR: 'bg-red-500',
}

const DECISAO_LABEL: Record<string, string> = {
  PARTICIPAR: 'Participar',
  RESSALVAS: 'Ressalvas',
  NAO_PARTICIPAR: 'Não participar',
}

const DECISAO_TEXT: Record<string, string> = {
  PARTICIPAR: 'text-action',
  RESSALVAS: 'text-amber-600',
  NAO_PARTICIPAR: 'text-red-600',
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function Historico() {
  const [items, setItems] = useState<AnaliseHistorico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data, error } = await supabase
          .from('analyses')
          .select('id, tipo, objeto, orgao, arquivo_nome, decisao, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
        if (error) throw error
        setItems(data ?? [])
      } catch {
        setError('Não foi possível carregar o histórico.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy mb-1">Histórico</h2>
        <p className="text-sm text-gray-400">Todas as suas análises anteriores.</p>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-100 text-red-700 text-sm mb-4">{error}</div>
      )}

      {items.length === 0 && !error ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 bg-surface rounded-2xl border border-border flex items-center justify-center mb-4">
            <InboxIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-navy font-semibold mb-1">Nenhuma análise ainda</p>
          <p className="text-sm text-gray-400">
            Suas análises aparecerão aqui assim que você analisar um edital.
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors">
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    DECISAO_DOT[item.decisao ?? ''] ?? 'bg-gray-300'
                  }`}
                />

                <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-navy truncate">
                    {item.objeto ?? 'Objeto não identificado'}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 truncate">
                      {item.orgao ?? '—'}
                    </span>
                    {item.arquivo_nome && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 truncate max-w-32">
                          {item.arquivo_nome}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${DECISAO_TEXT[item.decisao ?? ''] ?? 'text-gray-400'}`}>
                    {DECISAO_LABEL[item.decisao ?? ''] ?? item.decisao}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {formatDate(item.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
