import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  params: { id: string }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const id = Number(params.id)
  await prisma.category.delete({ where: { id } }).catch(() => {})
  return NextResponse.json({ success: true })
}
