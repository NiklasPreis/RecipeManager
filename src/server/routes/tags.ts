import { Router } from 'express'
import { prisma } from '../db'

export const tagRouter = Router()

tagRouter.get('/', async (_req, res) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
    res.json(tags)
  } catch (e) {
    res.status(500).json({ error: 'Datenbankfehler' })
  }
})
