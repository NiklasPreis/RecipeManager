import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import RecipeCard from '@/components/RecipeCard'
import CategoryManager from '@/components/CategoryManager'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

interface PageProps {
  searchParams: { search?: string; category?: string; tag?: string }
}

async function RecipeGrid({ searchParams }: PageProps) {
  const { search = '', category, tag } = searchParams

  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        } : {},
        category ? { categories: { some: { categoryId: Number(category) } } } : {},
        tag ? { tags: { some: { tag: { name: tag } } } } : {},
      ],
    },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-400 mb-2">
          {search || category || tag ? 'Keine Rezepte gefunden' : 'Noch keine Rezepte'}
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          {search || category || tag
            ? 'Versuche andere Suchbegriffe oder Filter.'
            : 'Füge dein erstes Rezept hinzu!'}
        </p>
        {!search && !category && !tag && (
          <Link
            href="/recipes/new"
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Erstes Rezept hinzufügen
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            ...recipe,
            createdAt: recipe.createdAt.toISOString(),
          }}
        />
      ))}
    </div>
  )
}

export default async function HomePage({ searchParams }: PageProps) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { recipes: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <CategoryManager
        categories={categories}
        selectedCategory={searchParams.category ?? null}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <Suspense>
            <SearchBar />
          </Suspense>
          <Link
            href="/recipes/new"
            className="hidden sm:flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neu
          </Link>
        </div>

        {searchParams.tag && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{searchParams.tag}
            </span>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">× Entfernen</Link>
          </div>
        )}

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }>
          <RecipeGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
