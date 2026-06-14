import { Link } from 'react-router-dom'
import { Recipe } from '../types'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer border border-gray-100">
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {recipe.categories.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {recipe.categories.slice(0, 2).map(({ category }) => (
                <span key={category.id} className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">{category.name}</span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-primary-700 transition-colors truncate">{recipe.title}</h3>
          {recipe.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{recipe.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {totalTime} Min
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {recipe.servings} Port.
              </span>
            )}
          </div>
          {recipe.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {recipe.tags.slice(0, 4).map(({ tag }) => (
                <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">#{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
