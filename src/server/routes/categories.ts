import { Router } from 'express'
import { prisma } from '../db'

export const categoryRouter = Router()

categoryRouter.get('/', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { recipes: true } } },
      orderBy: { name: 'asc' },
    })
    res.json(categories)
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

categoryRouter.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Name ist erforderlich' })
    const category = await prisma.category.upsert({
      where: { name: name.trim() },
      update: {},
      create: { name: name.trim() },
    })
    res.status(201).json(category)
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})

categoryRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})
