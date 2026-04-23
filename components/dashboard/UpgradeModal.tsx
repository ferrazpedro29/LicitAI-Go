'use client'

import { X, Check, Zap } from 'lucide-react'

type Props = {
  onClose: () => void
  reason?: 'limit' | 'pdf'
}

const PLANS = [
  {
    name: 'Basic',
    price: 'Grátis',
    features: ['3 análises no total', 'GO / NO GO', 'Relatório em texto'],
    current: true,
    cta: 'Plano atual',
    href: null,
  },
  {
    name: 'Profissional',
    price: 'R$ 99,90/mês',
    features: ['20 análises/mês', 'GO / NO GO', 'Exportação PDF', 'Histórico completo'],
    current: false,
    featured: true,
    cta: 'Fazer upgrade',
    href: `mailto:pedrocferraz29@gmail.com?subject=LicitAI%20Go%20%E2%80%94%20Upgrade%20Profissional`,
  },
  {
    name: 'Enterprise',
    price: 'R$ 199,90/mês',
    features: ['Ilimitado', 'GO / NO GO', 'Exportação PDF', 'Suporte prioritário'],
    current: false,
    cta: 'Falar com vendas',
    href: `mailto:pedrocferraz29@gmail.com?subject=LicitAI%20Go%20%E2%80%94%20Enterprise`,
  },
]

export default function UpgradeModal({ onClose, reason = 'limit' }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up">
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-navy">
              {reason === 'limit' ? 'Limite de análises atingido' : 'Exportação disponível no Profissional'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {reason === 'limit'
                ? 'Você usou todas as análises do plano Basic. Faça upgrade para continuar.'
                : 'Exporte relatórios em PDF com o plano Profissional ou Enterprise.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 flex flex-col ${
                  plan.featured
                    ? 'border-primary bg-primary text-white'
                    : plan.current
                    ? 'border-border bg-surface opacity-60'
                    : 'border-border bg-white'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-action text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      Recomendado
                    </div>
                  </div>
                )}
                <div className={`text-xs font-bold mb-1 ${plan.featured ? 'text-white/70' : 'text-gray-400'}`}>
                  {plan.name}
                </div>
                <div className={`text-lg font-bold mb-4 ${plan.featured ? 'text-white' : 'text-navy'}`}>
                  {plan.price}
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.featured ? 'text-action' : 'text-action'}`} />
                      <span className={plan.featured ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.href ? (
                  <a
                    href={plan.href}
                    className={`block text-center py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                      plan.featured
                        ? 'bg-white text-primary hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-primary-700'
                    }`}
                    onClick={onClose}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <div className={`text-center py-2 px-4 rounded-lg text-sm font-semibold ${
                    plan.current ? 'bg-white/60 text-gray-400' : 'bg-surface text-gray-400'
                  }`}>
                    {plan.cta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
