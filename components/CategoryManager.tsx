'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  selectedCategory: string | null
}

export default function CategoryManager({ categories, selectedCategory }: Props) {
  const router = useRouter()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    setShowInput(false)
    setAdding(false)
    router.refresh()
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Kategorie löschen?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const selectCategory = (id: number | null) => {
    const params = new URLSearchParams(window.location.search)
    if (id === null) {
      params.delete('category')
    } else {
      params.set('category', String(id))
    }
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800 text-sm">Kategorien</h2>
          <button
            onClick={() => setShowInput(!showInput)}
            className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center transition-colors"
            title="Neue Kategorie"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {showInput && (
          <form onSubmit={handleAdd} className="mb-3">
            <div className="flex gap-1">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Name..."
              />
              <button
                type="submit"
                disabled={adding}
                className="px-2 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
              >
                ✓
              </button>
            </div>
          </form>
        )}

        <nav className="space-y-0.5">
          <button
            onClick={() => selectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Alle Rezepte
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center group">
              <button
                onClick={() => selectCategory(cat.id)}
                className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === String(cat.id)
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {cat._count && (
                  <span className="ml-1 text-gray-400 text-xs">({cat._count.recipes})</span>
                )}
              </button>
              <button
                onClick={(e) => handleDelete(cat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 mr-1 text-gray-300 hover:text-red-500 rounded transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
