import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Ingredient } from '@/lib/types'
import { deleteUploadedFile } from '@/lib/upload'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  const id = Number(params.id)
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!recipe) {
    return NextResponse.json({ error: 'Rezept nicht gefunden' }, { status: 404 })
  }

  return NextResponse.json({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    instructions: JSON.parse(recipe.instructions),
  })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const id = Number(params.id)
  const body = await request.json()
  const { title, description, image, servings, prepTime, cookTime, ingredients, instructions, categoryIds, tagNames } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Titel ist erforderlich' }, { status: 400 })
  }

  const existing = await prisma.recipe.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Rezept nicht gefunden' }, { status: 404 })
  }

  if (existing.image && image !== existing.image) {
    const oldFilename = existing.image.split('/').pop()
    if (oldFilename) await deleteUploadedFile(oldFilename)
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

  await prisma.categoryOnRecipe.deleteMany({ where: { recipeId: id } })
  await prisma.tagOnRecipe.deleteMany({ where: { recipeId: id } })

  const recipe = await prisma.recipe.update({
    where: { id },
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

  return NextResponse.json({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    instructions: JSON.parse(recipe.instructions),
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const id = Number(params.id)
  const existing = await prisma.recipe.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: 'Rezept nicht gefunden' }, { status: 404 })
  }

  if (existing.image) {
    const filename = existing.image.split('/').pop()
    if (filename) await deleteUploadedFile(filename)
  }

  await prisma.recipe.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
