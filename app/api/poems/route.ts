import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const poems = await prisma.poem.findMany({
      where: {
        published: true,
        ...(featured && { featured: true })
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        poet: {
          select: { name: true, slug: true }
        },
        tags: {
          include: {
            tag: {
              select: { slug: true, nameEn: true, nameDe: true, nameRu: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ poems })
  } catch (error) {
    console.error('Failed to fetch poems:', error)
    return NextResponse.json({ poems: [] })
  }
}
