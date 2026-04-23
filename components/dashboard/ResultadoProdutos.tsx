'use client'

import {
  AlertCircle,
  Building2,
  Hash,
  CalendarDays,
  Monitor,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Timer,
  RefreshCw,
  Copy,
  Printer,
} from 'lucide-react'
import { ResultadoProdutos } from '@/lib/types'

type Props = {
  resultado: ResultadoProdutos
  onNova: () => void
  onExportPDF: () => void
  onCopiar: () => void
}

const DECISAO_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PARTICIPAR: { bg: 'bg-action', text: 'text-white', label: '✓ PARTICIPAR' },
  RESSALVAS: { bg: 'bg-amber-500', text: 'text-white', label: '⚠ COM RESSALVAS' },
  NAO_PARTICIPAR: { bg: 'bg-red-600', text: 'text-white', label: '✕ NÃO PARTICIPAR' },
}

export default function ResultadoProdutos({ resultado, onNova, onExportPDF, onCopiar }: Props) {
  const d = DECISAO_STYLE[resultado.decisao] ?? DECISAO_STYLE.RESSALVAS

  return (
    <div className="max-w-3xl mx-auto animate-slide-up print-full">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="text-2xl font-bold text-navy">Resultado da análise</h2>
          <p className="text-sm text-gray-400">Produtos / Dispensa Eletrônica</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCopiar} className="btn-ghost text-xs py-2 px-3 gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Copiar
          </button>
          <button onClick={onExportPDF} className="btn-ghost text-xs py-2 px-3 gap-1.5">
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={onNova} className="btn-primary text-xs py-2 px-3 gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Nova análise
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-primary/60 tracking-widest">01</span>
            <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Identificação</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, label: 'Objeto', value: resultado.objeto },
              { icon: Building2, label: 'Órgão', value: resultado.orgao },
              { icon: Hash, label: 'Número', value: resultado.numero_edital },
              { icon: Hash, label: 'Modalidade', value: resultado.modalidade },
              { icon: DollarSign, label: 'Valor estimado', value: resultado.valor_estimado },
              { icon: CalendarDays, label: 'Data da sessão', value: resultado.data_sessao },
              { icon: Monitor, label: 'Plataforma', value: resultado.plataforma },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
                <div className="text-sm text-navy font-medium">{value || 'Edital silente'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-primary/60 tracking-widest">02</span>
            <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Entrega e proposta</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: 'Prazo de entrega', value: resultado.prazo_entrega },
              { icon: MapPin, label: 'Local de entrega', value: resultado.local_entrega },
              { icon: Timer, label: 'Validade da proposta', value: resultado.validade_proposta },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
                <div className="text-sm text-navy font-medium">{value || 'Edital silente'}</div>
              </div>
            ))}
          </div>
        </div>

        {resultado.itens?.length > 0 && (
          <div className="card overflow-hidden p-0">
            <div className="flex items-center gap-2 p-6 pb-4">
              <span className="text-xs font-mono font-bold text-primary/60 tracking-widest">03</span>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Itens da licitação</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-surface text-xs font-bold text-gray-400 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left w-12">#</th>
                    <th className="px-4 py-3 text-left">Descrição</th>
                    <th className="px-4 py-3 text-left w-20">Unidade</th>
                    <th className="px-4 py-3 text-right w-24">Qtde</th>
                    <th className="px-4 py-3 text-right w-32">Valor unit. ref.</th>
                    <th className="px-4 py-3 text-left">Especificações</th>
                    <th className="px-4 py-3 text-left w-28">Marca</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.itens.map((item, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{item.num || i + 1}</td>
                      <td className="px-4 py-3 text-navy font-medium">{item.descricao}</td>
                      <td className="px-4 py-3 text-gray-600">{item.unidade}</td>
                      <td className="px-4 py-3 text-right text-gray-600 font-mono">{item.quantidade}</td>
                      <td className="px-4 py-3 text-right text-gray-600 font-mono text-xs">
                        {item.valor_unitario_estimado || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">
                        {item.especificacoes || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{item.exigencia_marca || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultado.exigencias_criticas?.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-primary/60 tracking-widest">04</span>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Exigências críticas</h3>
            </div>
            <ul className="space-y-2">
              {resultado.exigencias_criticas.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resultado.alertas_inabilitacao?.length > 0 && (
          <div className="card border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-amber-500 tracking-widest">05</span>
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Alertas de inabilitação
              </h3>
            </div>
            <ul className="space-y-2">
              {resultado.alertas_inabilitacao.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden border border-navy/20">
          <div className="bg-navy px-6 py-4">
            <div>
              <div className="text-xs font-bold text-white/50 tracking-widest mb-1">06 · DECISÃO GERENCIAL</div>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${d.bg} ${d.text}`}>
                {d.label}
              </span>
            </div>
          </div>
          <div className="bg-navy/5 px-6 py-5 border-t border-navy/10">
            <p className="font-mono text-sm text-navy/80 leading-relaxed whitespace-pre-wrap">
              {resultado.justificativa}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
