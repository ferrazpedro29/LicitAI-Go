import { ShieldCheck, Zap, Layers } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Precisão técnica',
    description:
      'O modelo extrai apenas as informações presentes no edital. Sem inventar, sem alucinações. Campo ausente = edital silente.',
    color: 'text-primary',
    bg: 'bg-primary-50',
  },
  {
    icon: Zap,
    title: 'Velocidade',
    description:
      'O que levava 4 a 12 horas de leitura e tabulação manual agora é entregue em menos de 2 minutos, com formatação profissional.',
    color: 'text-action',
    bg: 'bg-action-50',
  },
  {
    icon: Layers,
    title: 'Cobertura completa',
    description:
      'Analisa obras, serviços de engenharia, fornecimento de produtos e dispensas eletrônicas. Um produto, todos os tipos.',
    color: 'text-navy',
    bg: 'bg-navy-50',
  },
]

export default function Features() {
  return (
    <>
      <section className="py-6 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              'Zero subjetividade — apenas o que está no edital',
              'Obras, serviços de engenharia e produtos',
              'Dispensas eletrônicas e pregões incluídos',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-8 py-4 text-white/90 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-action flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Construído para quem lida com licitação todo dia
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Ferramentas que eliminam risco, ganham tempo e entregam clareza na hora da decisão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-navy mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
