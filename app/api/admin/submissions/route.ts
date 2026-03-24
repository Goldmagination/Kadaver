import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

// Helper to securely check if the request is authorized
function isAuthorized(request: NextRequest): boolean {
  // 1. Check if the user is authenticated via admin_token cookie
  const adminToken = cookies().get('admin_token')
  const isAuthed = adminToken?.value === 'authorized'

  // 2. Check if the request comes from localhost
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
  const cleanIp = ip.split(',')[0].trim().replace(/^::ffff:/, '')
  
  // Empty IP in some Next.js local dev setups can happen, but we ensure it matches local patterns
  const isLocalIp = cleanIp === '::1' || cleanIp === '127.0.0.1' || cleanIp === 'localhost' || cleanIp === ''

  return isAuthed && isLocalIp
}

// GET - Fetch all submissions
export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Access denied: Unauthorized or not localhost' }, { status: 403 })
    }

    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        submitter: {
          select: { email: true, name: true }
        }
      }
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST - Approve or reject a submission
export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Access denied: Unauthorized or not localhost' }, { status: 403 })
    }

    const { submissionId, action, renderingConfig } = await request.json()

    if (!submissionId || !['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Get the submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (submission.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Submission already processed' },
        { status: 400 }
      )
    }

    if (action === 'reject') {
      // Just update the status to rejected
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date()
        }
      })

      return NextResponse.json({ success: true, message: 'Submission rejected' })
    }

    if (action === 'delete') {
      // Delete the submission
      await prisma.submission.delete({
        where: { id: submissionId }
      })

      return NextResponse.json({ success: true, message: 'Submission deleted' })
    }

    // Approve: Create an author (if needed) and work, then update submission

    // First, check if we need to create an author or find existing
    let author = await prisma.author.findFirst({
      where: { name: submission.authorName }
    })

    if (!author) {
      // Create a new author
      const slug = submission.authorName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      author = await prisma.author.create({
        data: {
          name: submission.authorName,
          slug: `${slug}-${Date.now()}`,
          languages: [submission.language],
        }
      })
    }

    // Create the work
    const workSlug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Prepare content for Work record
    let finalContent: string | null = submission.content
    let excerpt = undefined

    const subChapters = (submission as any).chapters
    if (submission.type === 'NOVEL' && subChapters && Array.isArray(subChapters) && subChapters.length > 0) {
      // For novels, we don't want the placeholder in the main content.
      // We can either leave it empty or put the first chapter's content.
      // Let's set the main content to null (as per schema comment) and use first chapter for excerpt.
      finalContent = null

      // Generate excerpt from first chapter
      const firstChapter = subChapters[0]
      if (firstChapter && firstChapter.content) {
        excerpt = firstChapter.content.substring(0, 300) + '...'
      }
    } else {
      // For poems/tales, generate excerpt from content
      if (submission.content) {
        excerpt = submission.content.substring(0, 300) + '...'
      }
    }

    const work = await prisma.work.create({
      data: {
        title: submission.title,
        content: finalContent,
        excerpt: excerpt,
        slug: `${workSlug}-${Date.now()}`,
        language: submission.language,
        authorId: author.id,
        published: true,
        publishedAt: new Date(),
        type: submission.type || 'POEM',
        renderingConfig: renderingConfig || undefined,
      }
    })

    // Create chapters if they exist
    if (subChapters && Array.isArray(subChapters) && subChapters.length > 0) {
      const chaptersData = subChapters.map((chapter: any, index: number) => ({
        workId: work.id,
        order: index + 1,
        title: chapter.title || `Chapter ${index + 1}`,
        content: chapter.content || '',
      }))

      await prisma.chapter.createMany({
        data: chaptersData
      })
    }

    // Update the submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        approvedWorkId: work.id
      }
    })

    console.log('Work published:', work.id)

    return NextResponse.json({
      success: true,
      message: 'Work published successfully',
      workId: work.id
    })

  } catch (error) {
    console.error('Failed to process submission:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
