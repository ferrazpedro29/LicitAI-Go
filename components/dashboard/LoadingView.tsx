'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

const ETAPAS = [
  'Lendo o documento...',
  'Identificando informações do edital...',
  'Analisando qualificação técnica...',
  'Verificando exigências e alertas...',
  'Elaborando decisão gerencial...',
]

export default function LoadingView() {
  const [progress, setProgress] = useState(0)
  const [etapa, setEtapa] = useState(0)

  useEffect(() => {
    const intervals = [800, 2200, 4500, 7000, 10000]
    const timers = intervals.map((delay, i) =>
      setTimeout(() => {
        setEtapa(i + 1)
        setProgress(Math.round(((i + 1) / ETAPAS.length) * 92))
      }, delay)
    )
    const ticker = setInterval(() => {
      setProgress((p) => Math.min(p + 0.3, 95))
    }, 300)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(ticker)
    }
  }, [])

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-primary-50 border-4 border-primary/20 flex items-center justify-center">
          <Loader2 className="w-9 h-9 text-primary animate-spin" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-navy mb-2 text-center">
        Analisando o edital
      </h2>
      <p className="text-sm text-gray-400 mb-8 text-center">
        O modelo está lendo e extraindo as informações. Isso leva alguns segundos.
      </p>

      <div className="w-full mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full border border-border overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full space-y-3">
        {ETAPAS.map((step, i) => {
          const done = i < etapa
          const running = i === etapa
          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                done ? 'text-action' : running ? 'text-primary font-medium' : 'text-gray-300'
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : running ? (
                <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
              ) : (
                <Circle className="w-4 h-4 flex-shrink-0" />
              )}
              {step}
            </div>
          )
        })}
      </div>
    </div>
  )
}
