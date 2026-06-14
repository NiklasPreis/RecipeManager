export interface Ingredient {
  amount: string
  unit: string
  name: string
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

export interface Recipe {
  id: number
  title: string
  description: string | null
  image: string | null
  servings: number | null
  prepTime: number | null
  cookTime: number | null
  ingredients: Ingredient[]
  instructions: string[]
  categories: { category: Category }[]
  tags: { tag: Tag }[]
  createdAt: string
  updatedAt: string
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
