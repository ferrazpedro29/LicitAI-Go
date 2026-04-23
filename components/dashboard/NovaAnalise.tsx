'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X, ChevronDown, ChevronUp, Building2, HardHat, Package } from 'lucide-react'
import { TipoAnalise } from '@/lib/types'

const CHECKLIST_OBRAS = [
  'Qualificação técnica (atestados)',
  'Qualificação econômico-financeira',
  'Habilitação jurídica',
  'Regularidade fiscal e trabalhista',
  'Valor estimado e modalidade',
  'Prazo de execução',
  'Data e local da sessão',
  'Critérios de julgamento',
]

const CHECKLIST_PRODUTOS = [
  'Descrição e especificações dos itens',
  'Quantidades e unidades',
  'Valor estimado por item',
  'Prazo e local de entrega',
  'Validade da proposta',
  'Habilitação e regularidade fiscal',
  'Exigências de marca ou modelo',
  'Critérios de aceitabilidade',
]

type Props = {
  onAnalisar: (data: {
    file: File
    tipo: TipoAnalise
    empresa: string
    obs: string
  }) => void
  loading?: boolean
}

export default function NovaAnalise({ onAnalisar, loading }: Props) {
  const [tipo, setTipo] = useState<TipoAnalise>('obras')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [empresaOpen, setEmpresaOpen] = useState(false)
  const [empresa, setEmpresa] = useState('')
  const [obs, setObs] = useState('')
  const [checklist, setChecklist] = useState<boolean[]>(new Array(8).fill(true))
  const inputRef = useRef<HTMLInputElement>(null)

  const items = tipo === 'obras' ? CHECKLIST_OBRAS : CHECKLIST_PRODUTOS

  function handleFile(f: File) {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|docx|txt)$/i)) {
      alert('Formato não suportado. Use PDF, DOCX ou TXT.')
      return
    }
    if (f.size > 30 * 1024 * 1024) {
      alert('Arquivo muito grande. O limite é 30 MB.')
      return
    }
    setFile(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  function handleSubmit() {
    if (!file || loading) return
    onAnalisar({ file, tipo, empresa, obs })
  }

  function toggleCheck(i: number) {
    const next = [...checklist]
    next[i] = !next[i]
    setChecklist(next)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy mb-1">Nova análise</h2>
        <p className="text-gray-500 text-sm">
          Faça o upload do edital e receba uma análise completa em minutos.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="text-xs font-bold text-gray-400 tracking-widest mb-3">TIPO DE LICITAÇÃO</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setTipo('obras'); setChecklist(new Array(8).fill(true)) }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                tipo === 'obras'
                  ? 'border-primary bg-primary-50'
                  : 'border-border hover:border-primary/30 hover:bg-surface'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                tipo === 'obras' ? 'bg-primary text-white' : 'bg-surface text-gray-400'
              }`}>
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-sm font-bold ${tipo === 'obras' ? 'text-primary' : 'text-navy'}`}>
                  Obras / Serviços
                </div>
                <div className="text-xs text-gray-400">Engenharia e construção</div>
              </div>
            </button>

            <button
              onClick={() => { setTipo('produtos'); setChecklist(new Array(8).fill(true)) }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                tipo === 'produtos'
                  ? 'border-primary bg-primary-50'
                  : 'border-border hover:border-primary/30 hover:bg-surface'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                tipo === 'produtos' ? 'bg-primary text-white' : 'bg-surface text-gray-400'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-sm font-bold ${tipo === 'produtos' ? 'text-primary' : 'text-navy'}`}>
                  Produtos / Dispensa
                </div>
                <div className="text-xs text-gray-400">Fornecimento e dispensas</div>
              </div>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-xs font-bold text-gray-400 tracking-widest mb-3">EDITAL</div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl transition-all ${
              file
                ? 'border-action/40 bg-action-50 cursor-default'
                : dragging
                ? 'border-primary bg-primary-50 cursor-copy'
                : 'border-border hover:border-primary/50 hover:bg-surface cursor-pointer'
            } p-8 text-center`}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-action rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-navy truncate max-w-xs">{file.name}</div>
                    <div className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="p-1.5 rounded-lg hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-navy mb-1">
                  Arraste o edital aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-400">PDF, DOCX ou TXT · até 30 MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <button
            onClick={() => setEmpresaOpen(!empresaOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 tracking-widest">
                DADOS DA EMPRESA (opcional)
              </span>
            </div>
            {empresaOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {empresaOpen && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Nome e ramo de atuação
                </label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ex: Construtora ABC — obras civis e pavimentação"
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Capacidade técnica / atestados disponíveis
                </label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={3}
                  placeholder="Ex: Atestados de obras de até R$2M em pavimentação"
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="text-xs font-bold text-gray-400 tracking-widest mb-3">
            ESCOPO DA ANÁLISE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((item, i) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => toggleCheck(i)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checklist[i]
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-primary/50'
                  }`}
                >
                  {checklist[i] && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${checklist[i] ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="btn-primary w-full py-4 text-base"
        >
          {loading ? 'Analisando...' : 'Analisar edital'}
        </button>
      </div>
    </div>
  )
}
