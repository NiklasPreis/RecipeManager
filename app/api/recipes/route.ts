import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Ingredient } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('category')
  const tag = searchParams.get('tag')

  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {},
        categoryId ? { categories: { some: { categoryId: Number(categoryId) } } } : {},
        tag ? { tags: { some: { tag: { name: tag } } } } : {},
      ],
    },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(recipes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, description, image, servings, prepTime, cookTime, ingredients, instructions, categoryIds, tagNames } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Titel ist erforderlich' }, { status: 400 })
  }

  const resolvedTags = await Promise.all(
    (tagNames as string[]).map((name: string) =>
      prisma.tag.upsert({
        where: { name: name.trim() },
        update: {},
        create: { name: name.trim() },
      })
    )
  )

  const recipe = await prisma.recipe.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      image: image || null,
      servings: servings ? Number(servings) : null,
      prepTime: prepTime ? Number(prepTime) : null,
      cookTime: cookTime ? Number(cookTime) : null,
      ingredients: JSON.stringify(ingredients as Ingredient[]),
      instructions: JSON.stringify(instructions as string[]),
      categories: {
        create: (categoryIds as number[]).map((id) => ({ categoryId: id })),
      },
      tags: {
        create: resolvedTags.map((t) => ({ tagId: t.id })),
      },
    },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  })

  return NextResponse.json(recipe, { status: 201 })
}
