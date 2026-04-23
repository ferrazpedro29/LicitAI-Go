import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <>
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para analisar seu próximo edital?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Crie uma conta grátis e faça sua primeira análise agora mesmo. Sem cartão de crédito.
          </p>
          <Link
            href="/login?tab=register"
            className="inline-flex items-center gap-2 bg-action text-white font-bold text-base py-4 px-8 rounded-xl hover:bg-action-700 transition-colors"
          >
            Começar grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-10 px-4 bg-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              LicitAI Go
            </div>

            <div className="flex items-center gap-6 text-sm text-white/50">
              <span>© {new Date().getFullYear()} LicitAI Go</span>
              <Link href="/login" className="hover:text-white/80 transition-colors">
                Entrar
              </Link>
              <a
                href="mailto:pedrocferraz29@gmail.com"
                className="hover:text-white/80 transition-colors"
              >
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
