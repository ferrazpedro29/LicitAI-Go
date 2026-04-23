'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/dashboard/Sidebar'
import NovaAnalise from '@/components/dashboard/NovaAnalise'
import LoadingView from '@/components/dashboard/LoadingView'
import ResultadoObras from '@/components/dashboard/ResultadoObras'
import ResultadoProdutos from '@/components/dashboard/ResultadoProdutos'
import Historico from '@/components/dashboard/Historico'
import UpgradeModal from '@/components/dashboard/UpgradeModal'
import {
  UserMetadata,
  ResultadoObras as TResultadoObras,
  ResultadoProdutos as TResultadoProdutos,
  TipoAnalise,
  LIMITES_PLANO,
  Plano,
} from '@/lib/types'
import { AlertCircle } from 'lucide-react'

type SidebarView = 'nova-analise' | 'historico'
type ContentView = SidebarView | 'loading' | 'resultado'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatResultadoText(r: TResultadoObras | TResultadoProdutos): string {
  if (r.tipo === 'OBRAS_SERVICOS') {
    return [
      `LICITAI GO — ANÁLISE DE EDITAL`,
      `Tipo: Obras / Serviços de Engenharia`,
      ``,
      `IDENTIFICAÇÃO`,
      `Objeto: ${r.objeto}`,
      `Órgão: ${r.orgao}`,
      `Edital: ${r.numero_edital}`,
      `Modalidade: ${r.modalidade}`,
      `Valor estimado: ${r.valor_estimado}`,
      `Data da sessão: ${r.data_sessao}`,
      `Plataforma: ${r.plataforma}`,
      `Prazo do contrato: ${r.prazo_contrato}`,
      ``,
      `QUALIFICAÇÃO TÉCNICA`,
      `Status: ${r.status_atestado}`,
      `Exigência: ${r.exigencia_atestado}`,
      `Como atender: ${r.atendimento_atestado}`,
      `Forma de atendimento: ${r.forma_atendimento}`,
      ``,
      `EXIGÊNCIAS CRÍTICAS`,
      ...(r.exigencias_criticas?.map((x) => `• ${x}`) ?? []),
      ``,
      `ALERTAS DE INABILITAÇÃO`,
      ...(r.alertas_inabilitacao?.map((x) => `• ${x}`) ?? []),
      ``,
      `DECISÃO: ${r.decisao}`,
      `Justificativa: ${r.justificativa}`,
    ].join('\n')
  } else {
    return [
      `LICITAI GO — ANÁLISE DE EDITAL`,
      `Tipo: Produtos / Dispensa Eletrônica`,
      ``,
      `IDENTIFICAÇÃO`,
      `Objeto: ${r.objeto}`,
      `Órgão: ${r.orgao}`,
      `Edital: ${r.numero_edital}`,
      `Modalidade: ${r.modalidade}`,
      `Valor estimado: ${r.valor_estimado}`,
      `Data da sessão: ${r.data_sessao}`,
      `Plataforma: ${r.plataforma}`,
      `Prazo de entrega: ${r.prazo_entrega}`,
      `Local de entrega: ${r.local_entrega}`,
      `Validade da proposta: ${r.validade_proposta}`,
      ``,
      `ITENS`,
      ...(r.itens?.map(
        (item) =>
          `• Item ${item.num}: ${item.descricao} | ${item.quantidade} ${item.unidade} | Ref: ${item.valor_unitario_estimado}`
      ) ?? []),
      ``,
      `EXIGÊNCIAS CRÍTICAS`,
      ...(r.exigencias_criticas?.map((x) => `• ${x}`) ?? []),
      ``,
      `ALERTAS DE INABILITAÇÃO`,
      ...(r.alertas_inabilitacao?.map((x) => `• ${x}`) ?? []),
      ``,
      `DECISÃO: ${r.decisao}`,
      `Justificativa: ${r.justificativa}`,
    ].join('\n')
  }
}

const VIEW_TITLE: Record<string, string> = {
  'nova-analise': 'Nova análise',
  loading: 'Analisando...',
  resultado: 'Resultado',
  historico: 'Histórico',
}

export default function DashboardPage() {
  const router = useRouter()

  const [userData, setUserData] = useState<{ email: string; metadata: UserMetadata; id: string } | null>(null)
  const [view, setView] = useState<ContentView>('nova-analise')
  const [sidebarView, setSidebarView] = useState<SidebarView>('nova-analise')
  const [resultado, setResultado] = useState<TResultadoObras | TResultadoProdutos | null>(null)
  const [tipoAtual, setTipoAtual] = useState<TipoAnalise>('obras')
  const [error, setError] = useState('')
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; reason: 'limit' | 'pdf' }>({
    open: false,
    reason: 'limit',
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserData({
        id: user.id,
        email: user.email ?? '',
        metadata: (user.user_metadata ?? {}) as UserMetadata,
      })
    }
    loadUser()
  }, [])

  const handleSidebarView = useCallback((v: SidebarView) => {
    setSidebarView(v)
    setView(v)
    setError('')
  }, [])

  async function handleAnalisar({
    file,
    tipo,
    empresa,
    obs,
  }: {
    file: File
    tipo: TipoAnalise
    empresa: string
    obs: string
  }) {
    if (!userData) return

    const plano: Plano = (userData.metadata?.plano as Plano) ?? 'basic'
    const usadas = userData.metadata?.analises_usadas ?? 0
    const limite = LIMITES_PLANO[plano]

    if (usadas >= limite) {
      setUpgradeModal({ open: true, reason: 'limit' })
      return
    }

    setError('')
    setTipoAtual(tipo)
    setView('loading')

    try {
      const base64 = await fileToBase64(file)
      const mediaType = file.type || 'application/pdf'

      const res = await fetch('/api/analisar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          tipo,
          empresa,
          obs,
          mediaType,
          fileName: file.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro na análise')
      }

      const r = data.resultado as TResultadoObras | TResultadoProdutos

      await supabase.from('analyses').insert({
        user_id: userData.id,
        tipo: r.tipo,
        objeto: r.objeto,
        orgao: r.orgao,
        arquivo_nome: file.name,
        decisao: r.decisao,
        resultado: r,
      })

      const newUsadas = usadas + 1
      await supabase.auth.updateUser({
        data: { ...userData.metadata, analises_usadas: newUsadas },
      })

      setUserData((prev) =>
        prev ? { ...prev, metadata: { ...prev.metadata, analises_usadas: newUsadas } } : prev
      )

      setResultado(r)
      setView('resultado')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado'
      setError(msg)
      setView('nova-analise')
    }
  }

  function handleCopiar() {
    if (!resultado) return
    const text = formatResultadoText(resultado)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleExportPDF() {
    const plano: Plano = (userData?.metadata?.plano as Plano) ?? 'basic'
    if (plano === 'basic') {
      setUpgradeModal({ open: true, reason: 'pdf' })
      return
    }
    window.print()
  }

  function handleNova() {
    setResultado(null)
    setError('')
    setSidebarView('nova-analise')
    setView('nova-analise')
  }

  const sidebarUserView = sidebarView === 'historico' ? 'historico' : 'nova-analise'

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        view={sidebarUserView}
        onView={handleSidebarView}
        user={userData}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-8 no-print">
          <h1 className="font-bold text-navy">{VIEW_TITLE[view] ?? 'Dashboard'}</h1>
          <div className="flex items-center gap-3">
            {userData?.metadata?.plano && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  userData.metadata.plano === 'enterprise'
                    ? 'bg-action-50 text-action-700'
                    : userData.metadata.plano === 'pro'
                    ? 'bg-primary-50 text-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {userData.metadata.plano === 'enterprise'
                  ? 'Enterprise'
                  : userData.metadata.plano === 'pro'
                  ? 'Profissional'
                  : 'Basic'}
              </span>
            )}
            {copied && (
              <span className="text-xs text-action font-semibold">Copiado!</span>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold mb-0.5">Erro na análise</div>
                  {error}
                </div>
              </div>
            </div>
          )}

          {view === 'nova-analise' && (
            <NovaAnalise onAnalisar={handleAnalisar} />
          )}

          {view === 'loading' && <LoadingView />}

          {view === 'resultado' && resultado && (
            resultado.tipo === 'OBRAS_SERVICOS' ? (
              <ResultadoObras
                resultado={resultado as TResultadoObras}
                onNova={handleNova}
                onExportPDF={handleExportPDF}
                onCopiar={handleCopiar}
              />
            ) : (
              <ResultadoProdutos
                resultado={resultado as TResultadoProdutos}
                onNova={handleNova}
                onExportPDF={handleExportPDF}
                onCopiar={handleCopiar}
              />
            )
          )}

          {view === 'historico' && <Historico />}
        </main>
      </div>

      {upgradeModal.open && (
        <UpgradeModal
          reason={upgradeModal.reason}
          onClose={() => setUpgradeModal({ open: false, reason: 'limit' })}
        />
      )}
    </div>
  )
}
