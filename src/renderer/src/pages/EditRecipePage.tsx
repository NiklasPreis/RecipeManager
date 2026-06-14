import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Recipe, Category } from '../types'
import RecipeForm from '../components/RecipeForm'

export default function EditRecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/recipes/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([r, c]) => {
      if (r.error) navigate('/')
      else { setRecipe(r); setCategories(c) }
    })
  }, [id])

  if (!recipe) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="mb-4"><Link to={`/recipes/${id}`} className="text-sm text-primary-600 hover:text-primary-800">← Zurück zum Rezept</Link></nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rezept bearbeiten</h1>
      <RecipeForm initialData={recipe} categories={categories} />
    </div>
  )
}
