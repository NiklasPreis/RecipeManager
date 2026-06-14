export interface Ingredient {
  amount: string
  unit: string
  name: string
}

export interface RecipeFormData {
  title: string
  description: string
  servings: number | ''
  prepTime: number | ''
  cookTime: number | ''
  ingredients: Ingredient[]
  instructions: string[]
  categoryIds: number[]
  tagNames: string[]
}

export interface RecipeSummary {
  id: number
  title: string
  description: string | null
  image: string | null
  servings: number | null
  prepTime: number | null
  cookTime: number | null
  categories: { category: { id: number; name: string } }[]
  tags: { tag: { id: number; name: string } }[]
  createdAt: string
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: Ingredient[]
  instructions: string[]
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  _count?: { recipes: number }
}

export interface Tag {
  id: number
  name: string
}
