import { Router } from 'express'
import { prisma } from '../db'

export const recipeRouter = Router()

recipeRouter.get('/', async (req, res) => {
  try {
    const { search = '', category, tag } = req.query as Record<string, string>
    const recipes = await prisma.recipe.findMany({
      where: {
        AND: [
          search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {},
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
    res.json(recipes.map(r => ({
      ...r,
      ingredients: JSON.parse(r.ingredients),
      instructions: JSON.parse(r.instructions),
    })))
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

recipeRouter.get('/:id', async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })
    if (!recipe) return res.status(404).json({ error: 'Rezept nicht gefunden' })
    res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
    })
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

recipeRouter.post('/', async (req, res) => {
  try {
    const { title, description, image, servings, prepTime, cookTime, ingredients, instructions, categoryIds, tagNames } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Titel ist erforderlich' })

    const resolvedTags = await Promise.all(
      (tagNames as string[]).map(name =>
        prisma.tag.upsert({ where: { name: name.trim() }, update: {}, create: { name: name.trim() } })
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
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        categories: { create: (categoryIds as number[]).map(id => ({ categoryId: id })) },
        tags: { create: resolvedTags.map(t => ({ tagId: t.id })) },
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })
    res.status(201).json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
    })
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

recipeRouter.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { title, description, image, servings, prepTime, cookTime, ingredients, instructions, categoryIds, tagNames } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Titel ist erforderlich' })

    const existing = await prisma.recipe.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Rezept nicht gefunden' })

    const resolvedTags = await Promise.all(
      (tagNames as string[]).map(name =>
        prisma.tag.upsert({ where: { name: name.trim() }, update: {}, create: { name: name.trim() } })
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
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        categories: { create: (categoryIds as number[]).map(id => ({ categoryId: id })) },
        tags: { create: resolvedTags.map(t => ({ tagId: t.id })) },
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })
    res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
    })
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

recipeRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.recipe.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})
