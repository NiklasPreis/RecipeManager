import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { Ingredient } from '@/lib/types'
import DeleteButton from './DeleteButton'

interface Params {
  params: { id: string }
}

export async function generateMetadata({ params }: Params) {
  const recipe = await prisma.recipe.findUnique({ where: { id: Number(params.id) } })
  return { title: recipe ? `${recipe.title} – RecipeManager` : 'Rezept nicht gefunden' }
}

export default async function RecipeDetailPage({ params }: Params) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: Number(params.id) },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!recipe) notFound()

  const ingredients: Ingredient[] = JSON.parse(recipe.ingredients)
  const instructions: string[] = JSON.parse(recipe.instructions)
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link href="/" className="text-sm text-primary-600 hover:text-primary-800">← Alle Rezepte</Link>
      </nav>

      {/* Hero */}
      {recipe.image && (
        <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recipe.categories.map(({ category }) => (
                <Link key={category.id} href={`/?category=${category.id}`}
                  className="bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium hover:bg-primary-200 transition-colors">
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          {recipe.description && (
            <p className="mt-2 text-gray-500 text-base leading-relaxed">{recipe.description}</p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </Link>
          <DeleteButton id={recipe.id} />
        </div>
      </div>

      {/* Metadaten */}
      {(totalTime > 0 || recipe.servings) && (
        <div className="flex flex-wrap gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          {recipe.prepTime ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Vorbereitung</p>
              <p className="text-lg font-semibold text-gray-800">{recipe.prepTime} Min</p>
            </div>
          ) : null}
          {recipe.cookTime ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Kochzeit</p>
              <p className="text-lg font-semibold text-gray-800">{recipe.cookTime} Min</p>
            </div>
          ) : null}
          {totalTime > 0 && recipe.prepTime && recipe.cookTime ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Gesamt</p>
              <p className="text-lg font-semibold text-gray-800">{totalTime} Min</p>
            </div>
          ) : null}
          {recipe.servings ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Portionen</p>
              <p className="text-lg font-semibold text-gray-800">{recipe.servings}</p>
            </div>
          ) : null}
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Zutaten */}
        {ingredients.length > 0 && (
          <section className="md:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Zutaten</h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium text-gray-800 min-w-[3rem] text-right">
                    {ing.amount} {ing.unit}
                  </span>
                  <span className="text-gray-600">{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Zubereitung */}
        {instructions.length > 0 && (
          <section className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${ingredients.length > 0 ? 'md:col-span-3' : 'md:col-span-5'}`}>
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Zubereitung</h2>
            <ol className="space-y-4">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {recipe.tags.map(({ tag }) => (
            <Link key={tag.id} href={`/?tag=${encodeURIComponent(tag.name)}`}
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm px-3 py-1 rounded-full transition-colors">
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
