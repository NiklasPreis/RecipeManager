import express from 'express'
import path from 'path'
import fs from 'fs'
import { PORT, DATA_DIR } from './config'
import { recipeRouter } from './routes/recipes'
import { categoryRouter } from './routes/categories'
import { tagRouter } from './routes/tags'
import { uploadRouter } from './routes/uploads'

const app = express()

fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true })

app.use(express.json())
app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')))

app.use('/api/recipes', recipeRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/tags', tagRouter)
app.use('/api', uploadRouter)

const distPath = path.join(__dirname, '..', 'renderer')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`RecipeManager läuft auf http://localhost:${PORT}`)
})
