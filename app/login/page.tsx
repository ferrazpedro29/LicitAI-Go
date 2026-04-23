'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, Loader2, AlertCircle, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Tab = 'login' | 'register'

/* ---------------------------------------------------------------
   Mapeia erros do Supabase para mensagens em português
--------------------------------------------------------------- */
function parseError(err: unknown, ctx: 'login' | 'register'): string {
  const raw = err instanceof Error ? err.message : String(err)
  const msg = raw.toLowerCase()

  if (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('err_name')
  ) {
    return 'Falha de conexão com o servidor. Verifique sua internet e tente novamente.'
  }

  if (ctx === 'login') {
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials'))
      return 'E-mail ou senha incorretos.'
    if (msg.includes('email not confirmed'))
      return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
    if (msg.includes('too many requests'))
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
    return `Erro ao entrar: ${raw}`
  }

  if (msg.includes('user already registered') || msg.includes('already registered'))
    return 'Este e-mail já está cadastrado. Use a aba "Entrar".'
  if (msg.includes('weak_password') || msg.includes('weak password'))
    return 'Senha muito fraca. Use pelo menos 8 caracteres com letras e números.'
  if (msg.includes('invalid email'))
    return 'E-mail inválido. Verifique o formato digitado.'
  if (msg.includes('signup_disabled'))
    return 'Cadastros desabilitados. Ative "Enable email signups" no Supabase → Authentication → Providers.'
  return `Erro ao criar conta: ${raw}`
}

/* ---------------------------------------------------------------
   Conteúdo interno (usa useSearchParams — precisa de Suspense)
--------------------------------------------------------------- */
function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()

  const [tab, setTab] = useState<Tab>(
    params.get('tab') === 'register' ? 'register' : 'login'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')

  useEffect(() => {
    setError('')
    setConfirmEmail('')
  }, [tab])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(parseError(err, 'login'))
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setConfirmEmail('')

    if (!nome.trim() || !empresa.trim()) {
      setError('Preencha nome e empresa.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nome.trim(),
            empresa: empresa.trim(),
            plano: 'basic',
            analises_usadas: 0,
          },
        },
      })

      if (error) throw error

      if (data.session) {
        // Confirmação de e-mail desabilitada — já está logado
        router.push('/dashboard')
        router.refresh()
      } else if (data.user) {
        // Confirmação de e-mail habilitada — aguarda confirmação
        setConfirmEmail(email)
      } else {
        setError('Resposta inesperada do servidor. Tente novamente.')
      }
    } catch (err) {
      setError(parseError(err, 'register'))
    } finally {
      setLoading(false)
    }
  }

  /* ---- Tela de confirmação de e-mail ---- */
  if (confirmEmail) {
    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <SidePanel />
        <div className="flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-action-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-action" />
            </div>
            <h1 className="text-2xl font-bold text-navy mb-3">Confirme seu e-mail</h1>
            <p className="text-gray-500 mb-2">Enviamos um link de confirmação para:</p>
            <p className="font-semibold text-navy mb-6">{confirmEmail}</p>
            <p className="text-sm text-gray-400 mb-8">
              Clique no link no e-mail para ativar sua conta e acessar o dashboard. Verifique também o spam.
            </p>
            <button onClick={() => setConfirmEmail('')} className="btn-ghost text-sm py-2.5">
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---- Formulário principal ---- */
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <SidePanel />

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="md:hidden flex items-center gap-2 text-navy font-bold text-xl mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            LicitAI Go
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-1">
              {tab === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h1>
            <p className="text-gray-500 text-sm">
              {tab === 'login'
                ? 'Entre para continuar suas análises.'
                : 'Grátis para começar, sem cartão de crédito.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface rounded-xl p-1 mb-8 border border-border">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {/* Banner de erro */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="whitespace-pre-line">{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />
              <PasswordField
                label="Senha" value={password} onChange={setPassword}
                show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                placeholder="••••••••"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Nome completo" type="text" value={nome} onChange={setNome} placeholder="João da Silva" required />
              <Field label="Empresa" type="text" value={empresa} onChange={setEmpresa} placeholder="Construtora XYZ Ltda." required />
              <Field label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" required />
              <PasswordField
                label="Senha" value={password} onChange={setPassword}
                show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                placeholder="Mínimo 6 caracteres" minLength={6}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Criando conta...' : 'Criar conta grátis'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Ao criar uma conta, você concorda com os termos de uso da plataforma.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            {tab === 'login' ? (
              <>
                Não tem conta?{' '}
                <button onClick={() => setTab('register')} className="font-semibold text-primary hover:underline">
                  Criar conta grátis
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button onClick={() => setTab('login')} className="font-semibold text-primary hover:underline">
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
   Página exportada — envolve tudo em Suspense (obrigatório para
   useSearchParams no Next.js 14 App Router)
--------------------------------------------------------------- */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}

/* ---------------------------------------------------------------
   Painel esquerdo (navy) — copy focada em resultado
--------------------------------------------------------------- */
const BENEFITS = [
  {
    icon: '🏆',
    title: 'Ganhe mais licitações',
    desc: 'Identifique em minutos quais editais valem o esforço — antes de gastar dias preparando uma proposta que não vai a lugar nenhum.',
  },
  {
    icon: '🛡️',
    title: 'Elimine o risco de inabilitação',
    desc: 'Nunca mais perca um contrato por não atender um requisito técnico escondido na página 47 do edital.',
  },
  {
    icon: '⚡',
    title: 'Decisão em minutos, não em dias',
    desc: 'GO ou NO GO com justificativa completa antes de qualquer concorrente terminar a primeira leitura.',
  },
]

function SidePanel() {
  return (
    <div className="hidden md:flex flex-col justify-between p-12 bg-navy">
      <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        LicitAI Go
      </Link>

      <div>
        <h2 className="text-3xl font-bold text-white leading-tight mb-4">
          Enquanto seus concorrentes ainda estão{' '}
          <span className="text-action">lendo o edital</span>, você já decidiu.
        </h2>
        <p className="text-white/60 leading-relaxed mb-10 max-w-sm">
          Cada hora perdida analisando edital manualmente é uma hora que sua equipe não está
          preparando proposta, negociando ou fechando o próximo contrato.
        </p>

        <div className="space-y-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-xl leading-none mt-0.5">{b.icon}</span>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{b.title}</div>
                <div className="text-white/50 text-xs leading-relaxed">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-white/30 text-sm">© {new Date().getFullYear()} LicitAI Go</p>
    </div>
  )
}

/* ---------------------------------------------------------------
   Sub-componentes de campo
--------------------------------------------------------------- */
function Field({
  label, type, value, onChange, placeholder, required,
}: {
  label: string; type: string; value: string
  onChange: (v: string) => void; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} required={required} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  )
}

function PasswordField({
  label, value, onChange, show, onToggle, placeholder, minLength,
}: {
  label: string; value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void; placeholder?: string; minLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'} required minLength={minLength} value={value}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors pr-12"
        />
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
