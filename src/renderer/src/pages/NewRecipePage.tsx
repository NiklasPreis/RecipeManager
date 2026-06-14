import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Category } from '../types'
import RecipeForm from '../components/RecipeForm'

export default function NewRecipePage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="mb-4"><Link to="/" className="text-sm text-primary-600 hover:text-primary-800">← Alle Rezepte</Link></nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neues Rezept</h1>
      <RecipeForm categories={categories} />
    </div>
  )
}
