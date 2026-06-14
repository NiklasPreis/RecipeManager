import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import RecipeForm from '@/components/RecipeForm'
import { Ingredient } from '@/lib/types'

interface Params {
  params: { id: string }
}

export default async function EditRecipePage({ params }: Params) {
  const [recipe, categories] = await Promise.all([
    prisma.recipe.findUnique({
      where: { id: Number(params.id) },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!recipe) notFound()

  const recipeData = {
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients) as Ingredient[],
    instructions: JSON.parse(recipe.instructions) as string[],
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  }

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="mb-4">
        <Link href={`/recipes/${recipe.id}`} className="text-sm text-primary-600 hover:text-primary-800">
          ← Zurück zum Rezept
        </Link>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rezept bearbeiten</h1>
      <RecipeForm initialData={recipeData} categories={categories} />
    </div>
  )
}
