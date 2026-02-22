import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { slug: 'asc' },
            select: {
                slug: true,
                nameEn: true,
                nameDe: true,
                nameRu: true,
            },
        })
        return NextResponse.json({ tags })
    } catch (error) {
        console.error('Failed to fetch tags:', error)
        return NextResponse.json({ tags: [] })
    }
}
