'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    priceMonthly: null,
    priceLabel: 'Grátis',
    period: 'para sempre',
    description: 'Para conhecer a plataforma.',
    features: [
      '3 análises no total',
      'Obras, serviços e produtos',
      'Decisão GO / NO GO',
      'Relatório em texto',
    ],
    cta: 'Criar conta grátis',
    href: '/login?tab=register',
    featured: false,
  },
  {
    name: 'Profissional',
    priceMonthly: 'R$\u00a099,90',
    priceAnnual: 'R$\u00a079,90',
    period: '/mês',
    description: 'Para equipes que licita todo dia.',
    features: [
      '20 análises por mês',
      'Obras, serviços e produtos',
      'Decisão GO / NO GO',
      'Exportação em PDF',
      'Histórico completo',
      'Suporte por e-mail',
    ],
    cta: 'Começar agora',
    href: '/login?tab=register&plano=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 'R$\u00a0199,90',
    priceAnnual: 'R$\u00a0179,90',
    period: '/mês',
    description: 'Para construtoras e times grandes.',
    features: [
      'Análises ilimitadas',
      'Obras, serviços e produtos',
      'Decisão GO / NO GO',
      'Exportação em PDF',
      'Histórico completo',
      'Suporte prioritário',
    ],
    cta: 'Falar com vendas',
    href: `mailto:pedrocferraz29@gmail.com?subject=LicitAI%20Go%20%E2%80%94%20Enterprise`,
    featured: false,
  },
]

export default function Plans() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="planos" className="py-20 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Planos para cada momento
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Comece grátis, evolua conforme precisar.
          </p>

          <div className="inline-flex items-center gap-1 bg-white border border-border rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                !annual ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
                annual ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Anual
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${annual ? 'bg-white/20' : 'bg-action/10 text-action'}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.featured
                  ? 'bg-primary border-primary shadow-xl shadow-primary/20 text-white'
                  : 'bg-white border-border'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-action text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    <Zap className="w-3 h-3" />
                    Mais popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className={`text-sm font-bold mb-1 ${plan.featured ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-navy'}`}>
                    {plan.priceMonthly
                      ? annual && plan.priceAnnual
                        ? plan.priceAnnual
                        : plan.priceMonthly
                      : plan.priceLabel}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1.5 ${plan.featured ? 'text-white/70' : 'text-gray-400'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.featured ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.featured ? 'text-action' : 'text-action'}`} />
                    <span className={plan.featured ? 'text-white/90' : 'text-gray-600'}>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
                  plan.featured
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-primary text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
