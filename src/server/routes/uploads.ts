import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { DATA_DIR } from '../config'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(DATA_DIR, 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype))
  },
})

export const uploadRouter = Router()

uploadRouter.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei erhalten' })
  res.json({ url: `/uploads/${req.file.filename}` })
})
