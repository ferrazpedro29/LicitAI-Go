export type Database = {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string
          user_id: string
          tipo: string
          objeto: string | null
          orgao: string | null
          arquivo_nome: string | null
          decisao: string | null
          resultado: ResultadoObras | ResultadoProdutos | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tipo: string
          objeto?: string | null
          orgao?: string | null
          arquivo_nome?: string | null
          decisao?: string | null
          resultado?: ResultadoObras | ResultadoProdutos | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tipo?: string
          objeto?: string | null
          orgao?: string | null
          arquivo_nome?: string | null
          decisao?: string | null
          resultado?: ResultadoObras | ResultadoProdutos | null
          created_at?: string
        }
      }
    }
  }
}

export type UserMetadata = {
  nome_completo: string
  empresa: string
  plano: 'basic' | 'pro' | 'enterprise'
  analises_usadas: number
}

export type Plano = 'basic' | 'pro' | 'enterprise'

export const LIMITES_PLANO: Record<Plano, number> = {
  basic: 3,
  pro: 20,
  enterprise: Infinity,
}

export type ItemProduto = {
  num: string
  descricao: string
  unidade: string
  quantidade: string
  valor_unitario_estimado: string
  especificacoes: string
  exigencia_marca: string
  observacoes: string
}

export type ResultadoObras = {
  tipo: 'OBRAS_SERVICOS'
  objeto: string
  orgao: string
  numero_edital: string
  modalidade: string
  valor_estimado: string
  data_sessao: string
  plataforma: string
  prazo_contrato: string
  status_atestado: 'APTO' | 'NAO_APTO' | 'RESSALVAS'
  exigencia_atestado: string
  atendimento_atestado: string
  forma_atendimento: 'SEM_SOMA' | 'COM_SOMA' | 'SOMA_NAO_PERMITIDA' | 'EDITAL_SILENTE'
  exigencias_criticas: string[]
  alertas_inabilitacao: string[]
  decisao: 'PARTICIPAR' | 'RESSALVAS' | 'NAO_PARTICIPAR'
  justificativa: string
}

export type ResultadoProdutos = {
  tipo: 'PRODUTOS_DISPENSA'
  objeto: string
  orgao: string
  numero_edital: string
  modalidade: string
  valor_estimado: string
  data_sessao: string
  plataforma: string
  prazo_entrega: string
  local_entrega: string
  validade_proposta: string
  itens: ItemProduto[]
  exigencias_criticas: string[]
  alertas_inabilitacao: string[]
  decisao: 'PARTICIPAR' | 'RESSALVAS' | 'NAO_PARTICIPAR'
  justificativa: string
}

export type AnaliseHistorico = {
  id: string
  tipo: string
  objeto: string | null
  orgao: string | null
  arquivo_nome: string | null
  decisao: string | null
  created_at: string
}

export type TipoAnalise = 'obras' | 'produtos'
export type ViewDashboard = 'nova-analise' | 'loading' | 'resultado' | 'historico'
