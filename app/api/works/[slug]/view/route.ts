import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const work = await prisma.work.update({
      where: { slug: params.slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    })

    return NextResponse.json({ viewCount: work.viewCount })
  } catch (error) {
    console.error('Failed to increment view count:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
