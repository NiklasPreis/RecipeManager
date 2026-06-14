import path from 'path'
import fs from 'fs/promises'

export function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'public', 'uploads')
}

export function imageUrlFromFilename(filename: string): string {
  return `/api/uploads/${filename}`
}

export async function ensureUploadDir(): Promise<void> {
  const dir = getUploadDir()
  await fs.mkdir(dir, { recursive: true })
}

export async function saveUploadedFile(file: File): Promise<string> {
  await ensureUploadDir()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(getUploadDir(), filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)
  return filename
}

export async function deleteUploadedFile(filename: string): Promise<void> {
  const filepath = path.join(getUploadDir(), filename)
  await fs.unlink(filepath).catch(() => {})
}
