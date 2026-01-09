import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch all submissions
export async function GET() {
  try {
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
    const { submissionId, action } = await request.json()

    if (!submissionId || !['approve', 'reject'].includes(action)) {
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

    // Approve: Create a poet (if needed) and poem, then update submission

    // First, check if we need to create a poet or find existing
    let poet = await prisma.poet.findFirst({
      where: { name: submission.authorName }
    })

    if (!poet) {
      // Create a new poet
      const slug = submission.authorName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      poet = await prisma.poet.create({
        data: {
          name: submission.authorName,
          slug: `${slug}-${Date.now()}`,
          languages: [submission.language],
        }
      })
    }

    // Create the poem
    const poemSlug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const poem = await prisma.poem.create({
      data: {
        title: submission.title,
        content: submission.content,
        slug: `${poemSlug}-${Date.now()}`,
        language: submission.language,
        poetId: poet.id,
        published: true,
        publishedAt: new Date(),
      }
    })

    // Update the submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        approvedPoemId: poem.id
      }
    })

    console.log('Poem published:', poem.id)

    return NextResponse.json({
      success: true,
      message: 'Poem published successfully',
      poemId: poem.id
    })

  } catch (error) {
    console.error('Failed to process submission:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
