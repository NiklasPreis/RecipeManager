import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { recipes: true } },
    },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const { name } = await request.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
  }

  const category = await prisma.category.upsert({
    where: { name: name.trim() },
    update: {},
    create: { name: name.trim() },
  })

  return NextResponse.json(category, { status: 201 })
}
