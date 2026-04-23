'use client'

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Building2,
  Hash,
  CalendarDays,
  Monitor,
  Clock,
  DollarSign,
  FileText,
  RefreshCw,
  Copy,
  Printer,
} from 'lucide-react'
import { ResultadoObras } from '@/lib/types'

type Props = {
  resultado: ResultadoObras
  onNova: () => void
  onExportPDF: () => void
  onCopiar: () => void
}

const FORMA_LABEL: Record<string, string> = {
  SEM_SOMA: 'Atestado único — sem somatório',
  COM_SOMA: 'Permite somatório de atestados',
  SOMA_NAO_PERMITIDA: 'Somatório expressamente proibido',
  EDITAL_SILENTE: 'Edital silente sobre somatório',
}

const ATESTADO_COLOR: Record<string, string> = {
  APTO: 'badge-green',
  NAO_APTO: 'badge-red',
  RESSALVAS: 'badge-amber',
}

const ATESTADO_ICON: Record<string, React.ReactNode> = {
  APTO: <CheckCircle2 className="w-4 h-4" />,
  NAO_APTO: <XCircle className="w-4 h-4" />,
  RESSALVAS: <AlertTriangle className="w-4 h-4" />,
}

const DECISAO_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PARTICIPAR: { bg: 'bg-action', text: 'text-white', label: '✓ PARTICIPAR' },
  RESSALVAS: { bg: 'bg-amber-500', text: 'text-white', label: '⚠ COM RESSALVAS' },
  NAO_PARTICIPAR: { bg: 'bg-red-600', text: 'text-white', label: '✕ NÃO PARTICIPAR' },
}

export default function ResultadoObras({ resultado, onNova, onExportPDF, onCopiar }: Props) {
  const d = DECISAO_STYLE[resultado.decisao] ?? DECISAO_STYLE.RESSALVAS

  return (
    <div className="max-w-3xl mx-auto animate-slide-up print-full">
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="text-2xl font-bold text-navy">Resultado da análise</h2>
          <p className="text-sm text-gray-400">Obras / Serviços de Engenharia</p>
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
              { icon: Hash, label: 'Edital', value: resultado.numero_edital },
              { icon: ShieldAlert, label: 'Modalidade', value: resultado.modalidade },
              { icon: DollarSign, label: 'Valor estimado', value: resultado.valor_estimado },
              { icon: CalendarDays, label: 'Data da sessão', value: resultado.data_sessao },
              { icon: Monitor, label: 'Plataforma', value: resultado.plataforma },
              { icon: Clock, label: 'Prazo do contrato', value: resultado.prazo_contrato },
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
            <h3 className="text-sm font-bold text-navy uppercase tracking-wide">Qualificação técnica</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className={ATESTADO_COLOR[resultado.status_atestado] ?? 'badge-amber'}>
              {ATESTADO_ICON[resultado.status_atestado]}
              {resultado.status_atestado?.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-400 bg-surface px-2.5 py-1 rounded-full border border-border">
              {FORMA_LABEL[resultado.forma_atendimento] ?? resultado.forma_atendimento}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Exigência do edital</div>
              <div className="text-sm text-gray-700">{resultado.exigencia_atestado || 'Edital silente'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-1">Como atender</div>
              <div className="text-sm text-gray-700">{resultado.atendimento_atestado || 'Edital silente'}</div>
            </div>
          </div>
        </div>

        {resultado.exigencias_criticas?.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-primary/60 tracking-widest">03</span>
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
              <span className="text-xs font-mono font-bold text-amber-500 tracking-widest">04</span>
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white/50 tracking-widest mb-1">05 · DECISÃO GERENCIAL</div>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${d.bg} ${d.text}`}>
                  {d.label}
                </span>
              </div>
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
