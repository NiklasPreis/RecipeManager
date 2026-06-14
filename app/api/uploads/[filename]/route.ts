import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { getUploadDir } from '@/lib/upload'

interface Params {
  params: { filename: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  const filename = path.basename(params.filename)
  const filepath = path.join(getUploadDir(), filename)

  try {
    const buffer = await fs.readFile(filepath)
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg'
    const contentType =
      ext === 'png' ? 'image/png' :
      ext === 'webp' ? 'image/webp' :
      ext === 'gif' ? 'image/gif' :
      'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Bild nicht gefunden' }, { status: 404 })
  }
}
