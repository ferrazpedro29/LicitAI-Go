import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_OBRAS = `Você é analista sênior de licitações públicas brasileiras especializado em obras e serviços de engenharia.
Sua tarefa é analisar o edital fornecido e retornar as informações extraídas em formato JSON.
Regras obrigatórias:
1. Extraia APENAS informações que estejam explicitamente no documento.
2. NUNCA invente, suponha ou infira dados não presentes no texto.
3. Se um campo não for encontrado no edital, use exatamente: "Edital silente"
4. Para arrays vazios (exigencias_criticas, alertas_inabilitacao), use []
5. Retorne SOMENTE o JSON válido, sem markdown, sem explicações, sem texto antes ou depois.
6. Para decisao: use "PARTICIPAR" se qualificação técnica for atendida e sem alertas críticos; "RESSALVAS" se houver pontos de atenção; "NAO_PARTICIPAR" se houver inabilitação técnica certa.`

const SYSTEM_PRODUTOS = `Você é analista sênior de licitações públicas brasileiras especializado em compras, fornecimento de produtos e dispensas eletrônicas.
Sua tarefa é analisar o edital/aviso de dispensa fornecido e retornar as informações extraídas em formato JSON.
Regras obrigatórias:
1. Extraia APENAS informações que estejam explicitamente no documento.
2. NUNCA invente, suponha ou infira dados não presentes no texto.
3. Se um campo não for encontrado, use exatamente: "Edital silente"
4. Para arrays vazios, use []
5. Para a tabela de itens, extraia todos os itens listados no edital.
6. Retorne SOMENTE o JSON válido, sem markdown, sem explicações, sem texto antes ou depois.
7. Para decisao: use "PARTICIPAR" se viável; "RESSALVAS" se houver pontos de atenção; "NAO_PARTICIPAR" se inviável.`

const PROMPT_OBRAS = (empresa: string, obs: string) => `Analise este edital de licitação de obras/serviços de engenharia e retorne o seguinte JSON:

{
  "tipo": "OBRAS_SERVICOS",
  "objeto": "descrição do objeto da licitação",
  "orgao": "nome do órgão licitante",
  "numero_edital": "número/identificação do edital",
  "modalidade": "modalidade (Concorrência, Tomada de Preços, Convite, Pregão, RDC, etc.)",
  "valor_estimado": "valor estimado ou máximo",
  "data_sessao": "data e hora da sessão de abertura",
  "plataforma": "plataforma ou local de realização",
  "prazo_contrato": "prazo de execução/duração do contrato",
  "status_atestado": "APTO ou NAO_APTO ou RESSALVAS — baseado na qualificação técnica exigida",
  "exigencia_atestado": "o que o edital exige como atestado de capacidade técnica",
  "atendimento_atestado": "como a exigência pode ser atendida pela empresa",
  "forma_atendimento": "SEM_SOMA ou COM_SOMA ou SOMA_NAO_PERMITIDA ou EDITAL_SILENTE — sobre somatório de atestados",
  "exigencias_criticas": ["lista de exigências técnicas e documentais críticas"],
  "alertas_inabilitacao": ["lista de riscos de inabilitação identificados"],
  "decisao": "PARTICIPAR ou RESSALVAS ou NAO_PARTICIPAR",
  "justificativa": "justificativa detalhada para a decisão, baseada no edital"
}

${empresa ? `Dados da empresa para análise de viabilidade:\n${empresa}` : ''}
${obs ? `Observações adicionais: ${obs}` : ''}`

const PROMPT_PRODUTOS = (empresa: string, obs: string) => `Analise este edital/aviso de dispensa de compra de produtos e retorne o seguinte JSON:

{
  "tipo": "PRODUTOS_DISPENSA",
  "objeto": "descrição do objeto da licitação",
  "orgao": "nome do órgão licitante",
  "numero_edital": "número/identificação do edital ou aviso",
  "modalidade": "modalidade (Dispensa Eletrônica, Pregão Eletrônico, etc.)",
  "valor_estimado": "valor total estimado",
  "data_sessao": "data e hora da sessão ou encerramento",
  "plataforma": "plataforma de realização",
  "prazo_entrega": "prazo para entrega dos produtos",
  "local_entrega": "local de entrega",
  "validade_proposta": "validade da proposta",
  "itens": [
    {
      "num": "número do item",
      "descricao": "descrição completa do item",
      "unidade": "unidade de medida",
      "quantidade": "quantidade",
      "valor_unitario_estimado": "valor unitário estimado ou referência",
      "especificacoes": "especificações técnicas exigidas",
      "exigencia_marca": "marca exigida ou permitida ou proibida",
      "observacoes": "observações específicas do item"
    }
  ],
  "exigencias_criticas": ["lista de exigências críticas de habilitação"],
  "alertas_inabilitacao": ["lista de riscos de inabilitação identificados"],
  "decisao": "PARTICIPAR ou RESSALVAS ou NAO_PARTICIPAR",
  "justificativa": "justificativa detalhada para a decisão"
}

${empresa ? `Dados da empresa para análise de viabilidade:\n${empresa}` : ''}
${obs ? `Observações adicionais: ${obs}` : ''}`

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    file_missing: 'Nenhum arquivo foi enviado para análise.',
    file_too_large: 'O arquivo excede o tamanho máximo de 30 MB.',
    invalid_type: 'Tipo de análise inválido. Selecione Obras/Serviços ou Produtos/Dispensa.',
    invalid_media: 'Formato de arquivo não suportado. Envie PDF, DOCX ou TXT.',
    config_error: 'Erro de configuração do servidor. Entre em contato com o suporte.',
    unreadable: 'Não foi possível ler o arquivo. Verifique se o PDF não está protegido por senha.',
    ai_error: 'Serviço de IA temporariamente indisponível. Tente novamente em alguns minutos.',
    parse_error: 'Não foi possível processar a resposta da IA. Tente novamente.',
    generic: 'Ocorreu um erro inesperado. Tente novamente.',
  }
  return map[code] ?? map.generic
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_KEY) {
    return NextResponse.json(
      { error: friendlyError('config_error') },
      { status: 500 }
    )
  }

  let body: { base64?: string; tipo?: string; empresa?: string; obs?: string; mediaType?: string; fileName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: friendlyError('generic') }, { status: 400 })
  }

  const { base64, tipo, empresa = '', obs = '', mediaType = 'application/pdf', fileName = '' } = body

  if (!base64) {
    return NextResponse.json({ error: friendlyError('file_missing') }, { status: 400 })
  }
  if (tipo !== 'obras' && tipo !== 'produtos') {
    return NextResponse.json({ error: friendlyError('invalid_type') }, { status: 400 })
  }

  const sizeBytes = Math.ceil((base64.length * 3) / 4)
  if (sizeBytes > 30 * 1024 * 1024) {
    return NextResponse.json({ error: friendlyError('file_too_large') }, { status: 413 })
  }

  const allowedMedia = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedMedia.includes(mediaType)) {
    return NextResponse.json({ error: friendlyError('invalid_media') }, { status: 400 })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY })
  const isObras = tipo === 'obras'

  try {
    let textContent: string | null = null

    if (mediaType === 'text/plain') {
      try {
        textContent = Buffer.from(base64, 'base64').toString('utf-8')
      } catch {
        return NextResponse.json({ error: friendlyError('unreadable') }, { status: 422 })
      }
    } else if (mediaType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const mammoth = await import('mammoth')
        const buffer = Buffer.from(base64, 'base64')
        const result = await mammoth.extractRawText({ buffer })
        textContent = result.value
      } catch {
        return NextResponse.json({ error: friendlyError('unreadable') }, { status: 422 })
      }
    }

    const userContent: Anthropic.MessageParam['content'] = []

    if (textContent !== null) {
      userContent.push({
        type: 'text',
        text: `CONTEÚDO DO EDITAL:\n\n${textContent}\n\n---\n\n${isObras ? PROMPT_OBRAS(empresa, obs) : PROMPT_PRODUTOS(empresa, obs)}`,
      })
    } else {
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: base64,
        },
      } as Anthropic.DocumentBlockParam)
      userContent.push({
        type: 'text',
        text: isObras ? PROMPT_OBRAS(empresa, obs) : PROMPT_PRODUTOS(empresa, obs),
      })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: isObras ? SYSTEM_OBRAS : SYSTEM_PRODUTOS,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('')

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let resultado: unknown
    try {
      resultado = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: friendlyError('parse_error') }, { status: 502 })
    }

    return NextResponse.json({ resultado, fileName }, { status: 200 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('overloaded') || msg.includes('rate_limit') || msg.includes('timeout')) {
      return NextResponse.json({ error: friendlyError('ai_error') }, { status: 503 })
    }
    if (msg.includes('invalid_request') || msg.includes('Could not process')) {
      return NextResponse.json({ error: friendlyError('unreadable') }, { status: 422 })
    }
    return NextResponse.json({ error: friendlyError('generic') }, { status: 500 })
  }
}
