import { prisma } from '@/lib/db'
import RecipeForm from '@/components/RecipeForm'

export const dynamic = 'force-dynamic'

export default async function NewRecipePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neues Rezept</h1>
      <RecipeForm categories={categories} />
    </div>
  )
}
