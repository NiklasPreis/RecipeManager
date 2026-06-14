'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary-100 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            RecipeManager
          </Link>

          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-primary-800 text-white' : 'text-primary-100 hover:bg-primary-600'
              }`}
            >
              Rezepte
            </Link>
            <Link
              href="/recipes/new"
              className="flex items-center gap-1 bg-white text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neues Rezept
            </Link>
          </nav>

          <button
            className="sm:hidden p-2 rounded-md text-primary-100 hover:bg-primary-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:bg-primary-600"
              onClick={() => setMenuOpen(false)}>
              Rezepte
            </Link>
            <Link href="/recipes/new" className="block px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:bg-primary-600"
              onClick={() => setMenuOpen(false)}>
              + Neues Rezept
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
