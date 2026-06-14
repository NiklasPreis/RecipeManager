import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFile, imageUrlFromFilename } from '@/lib/upload'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 10

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei erhalten' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Nur JPEG, PNG, WebP und GIF erlaubt' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Maximale Dateigröße: ${MAX_SIZE_MB} MB` }, { status: 400 })
  }

  const filename = await saveUploadedFile(file)
  return NextResponse.json({ url: imageUrlFromFilename(filename) })
}
