'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-navy">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>LicitAI <span className="text-primary">Go</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Como funciona
            </a>
            <a href="#planos" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Planos
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors px-4 py-2"
            >
              Entrar
            </Link>
            <Link
              href="/login?tab=register"
              className="btn-primary text-sm py-2 px-5"
            >
              Começar grátis
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-border space-y-3">
            <a
              href="#como-funciona"
              className="block text-sm font-medium text-gray-600 py-2"
              onClick={() => setOpen(false)}
            >
              Como funciona
            </a>
            <a
              href="#planos"
              className="block text-sm font-medium text-gray-600 py-2"
              onClick={() => setOpen(false)}
            >
              Planos
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" className="btn-ghost text-sm py-2.5">
                Entrar
              </Link>
              <Link href="/login?tab=register" className="btn-primary text-sm py-2.5">
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
