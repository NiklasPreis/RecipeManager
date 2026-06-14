import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Recipe, Category } from '../types'
import RecipeCard from '../components/RecipeCard'
import CategoryManager from '../components/CategoryManager'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const category = searchParams.get('category') ?? ''
  const tag = searchParams.get('tag') ?? ''

  const loadCategories = () =>
    fetch('/api/categories').then(r => r.json()).then(setCategories)

  useEffect(() => { loadCategories() }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!)
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    fetch(`/api/recipes?${params}`).then(r => r.json()).then(data => {
      setRecipes(data)
      setLoading(false)
    })
  }, [searchParams])

  const handleSearch = (val: string) => {
    setSearch(val)
    const next = new URLSearchParams(searchParams)
    if (val.trim()) next.set('search', val.trim())
    else next.delete('search')
    setSearchParams(next)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <CategoryManager categories={categories} onUpdate={loadCategories} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" value={search} onChange={e => handleSearch(e.target.value)} placeholder="Rezepte suchen..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <Link to="/recipes/new" className="hidden sm:flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Neu
          </Link>
        </div>

        {tag && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">#{tag}</span>
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('tag'); setSearchParams(n) }} className="text-sm text-gray-400 hover:text-gray-600">× Entfernen</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">{search || category || tag ? 'Keine Rezepte gefunden' : 'Noch keine Rezepte'}</h3>
            {!search && !category && !tag && (
              <Link to="/recipes/new" className="mt-4 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700">
                Erstes Rezept hinzufügen
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
