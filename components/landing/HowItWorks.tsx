const steps = [
  {
    num: '001',
    title: 'Upload do edital',
    description:
      'Faça o upload do PDF, DOCX ou TXT do edital diretamente na plataforma. Até 30 MB, sem instalações.',
  },
  {
    num: '002',
    title: 'Análise por IA',
    description:
      'O modelo Claude lê o documento completo e extrai todas as informações técnicas relevantes em segundos.',
  },
  {
    num: '003',
    title: 'GO / NO GO',
    description:
      'Receba uma decisão clara — Participar, Ressalvas ou Não Participar — com justificativa fundamentada no edital.',
  },
  {
    num: '004',
    title: 'Histórico e exportação',
    description:
      'Todas as análises ficam salvas no seu histórico. Exporte relatórios em PDF ou copie para seu sistema.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Como funciona</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Do upload à decisão em 4 etapas simples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative card hover:shadow-md transition-shadow"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-border z-10" />
              )}
              <div className="font-mono text-xs font-bold text-primary/60 mb-4 tracking-widest">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
