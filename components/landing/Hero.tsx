import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary/20 rounded-full text-primary text-sm font-semibold mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Inteligência artificial para licitações públicas
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight tracking-tight mb-6">
            Elimine o risco de inabilitação{' '}
            <span className="text-primary">com análise em minutos.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            O LicitAI Go lê o edital completo, extrai o que importa e entrega uma decisão
            fundamentada — GO ou NO GO — antes que seu concorrente termine a primeira página.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/login?tab=register" className="btn-primary text-base py-3.5 px-8 w-full sm:w-auto">
              Criar conta gratuita
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#como-funciona" className="btn-ghost text-base py-3.5 px-8 w-full sm:w-auto">
              <Play className="w-4 h-4 text-primary" />
              Ver como funciona
            </a>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border border-border rounded-2xl overflow-hidden max-w-2xl mx-auto bg-surface">
            <div className="p-6 text-center">
              <div className="font-mono text-3xl font-bold text-primary mb-1">4h → 2min</div>
              <div className="text-sm text-gray-500 font-medium">Tempo de análise</div>
            </div>
            <div className="p-6 text-center">
              <div className="font-mono text-3xl font-bold text-action mb-1">100%</div>
              <div className="text-sm text-gray-500 font-medium">Baseado no edital</div>
            </div>
            <div className="p-6 text-center">
              <div className="font-mono text-3xl font-bold text-navy mb-1">GO/NO GO</div>
              <div className="text-sm text-gray-500 font-medium">Decisão fundamentada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
