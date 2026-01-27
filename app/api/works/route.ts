import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const works = await prisma.work.findMany({
      where: {
        published: true,
        ...(featured && { featured: true })
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        author: {
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

    return NextResponse.json({ works })
  } catch (error) {
    console.error('Failed to fetch works:', error)
    return NextResponse.json({ works: [] })
  }
}
