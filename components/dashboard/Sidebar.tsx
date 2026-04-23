'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap,
  FilePlus2,
  History,
  LogOut,
  TrendingUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { UserMetadata, LIMITES_PLANO, Plano } from '@/lib/types'

type Props = {
  view: 'nova-analise' | 'historico'
  onView: (v: 'nova-analise' | 'historico') => void
  user: { email: string; metadata: UserMetadata } | null
}

const PLANO_LABEL: Record<Plano, string> = {
  basic: 'Basic',
  pro: 'Profissional',
  enterprise: 'Enterprise',
}

const PLANO_COLOR: Record<Plano, string> = {
  basic: 'bg-gray-100 text-gray-600',
  pro: 'bg-primary-50 text-primary',
  enterprise: 'bg-action-50 text-action-700',
}

export default function Sidebar({ view, onView, user }: Props) {
  const router = useRouter()
  const plano: Plano = (user?.metadata?.plano as Plano) ?? 'basic'
  const usadas = user?.metadata?.analises_usadas ?? 0
  const limite = LIMITES_PLANO[plano]
  const percentual = limite === Infinity ? 0 : Math.min((usadas / limite) * 100, 100)
  const isEnterprise = plano === 'enterprise'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-navy flex flex-col no-print">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          LicitAI <span className="text-primary-100">Go</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => onView('nova-analise')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            view === 'nova-analise'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FilePlus2 className="w-4 h-4" />
          Nova análise
        </button>

        <button
          onClick={() => onView('historico')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            view === 'historico'
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          Histórico
        </button>
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.metadata?.nome_completo?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">
                {user?.metadata?.nome_completo ?? 'Usuário'}
              </div>
              <div className="text-white/50 text-xs truncate">
                {user?.metadata?.empresa ?? ''}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLANO_COLOR[plano]}`}>
                {PLANO_LABEL[plano]}
              </span>
              <span className="text-xs text-white/50">
                {isEnterprise ? 'Ilimitado' : `${usadas} / ${limite}`}
              </span>
            </div>
            {!isEnterprise && (
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    percentual >= 90 ? 'bg-red-400' : percentual >= 70 ? 'bg-amber-400' : 'bg-action'
                  }`}
                  style={{ width: `${percentual}%` }}
                />
              </div>
            )}
          </div>

          {plano !== 'enterprise' && (
            <a
              href={`mailto:pedrocferraz29@gmail.com?subject=LicitAI%20Go%20%E2%80%94%20Upgrade%20de%20Plano`}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-action/20 text-action rounded-lg hover:bg-action/30 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Fazer upgrade
            </a>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
