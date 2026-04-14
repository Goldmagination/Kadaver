import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Fetch in-progress novels for a given email
// Used by the submit form to let users continue existing novels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ works: [] })
    }

    // Find all approved submissions by this user that are linked to
    // works with IN_PROGRESS status
    const approvedSubmissions = await prisma.submission.findMany({
      where: {
        submitterId: user.id,
        status: 'APPROVED',
        approvedWorkId: { not: null },
      },
      select: {
        approvedWorkId: true,
      }
    })

    const workIds = approvedSubmissions
      .map(s => s.approvedWorkId)
      .filter((id): id is string => id !== null)

    if (workIds.length === 0) {
      return NextResponse.json({ works: [] })
    }

    // Get the actual works that are IN_PROGRESS novels
    const works = await prisma.work.findMany({
      where: {
        id: { in: workIds },
        type: 'NOVEL',
        status: 'IN_PROGRESS',
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { chapters: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ works })
  } catch (error) {
    console.error('Failed to fetch in-progress works:', error)
    return NextResponse.json(
      { error: 'Failed to fetch in-progress works' },
      { status: 500 }
    )
  }
}
