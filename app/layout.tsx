import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LicitAI Go — Analisa aí. Decide na hora.',
  description:
    'Análise de editais de licitação pública por IA. Reduza de horas para minutos com precisão e segurança.',
  keywords: 'licitação, edital, análise, inteligência artificial, licitação pública, Brasil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
