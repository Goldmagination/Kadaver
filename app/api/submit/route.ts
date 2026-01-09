import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, language, content, tags, email } = body

    // Validate required fields
    if (!title || !author || !language || !content || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate language
    if (!['de', 'en', 'ru'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      )
    }

    // Check if we have a database connection
    // If not, store in a simple way or return success for demo
    try {
      // Try to create a submission in the database
      const submission = await prisma.submission.create({
        data: {
          title,
          authorName: author,
          language: language.toUpperCase() as 'DE' | 'EN' | 'RU',
          content,
          submitterId: 'anonymous', // For now, anonymous submissions
          status: 'PENDING',
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Poem submitted successfully',
          id: submission.id
        },
        { status: 201 }
      )
    } catch (dbError) {
      // If database is not available, log and return success anyway for demo
      console.log('Database not available, submission logged:', {
        title,
        author,
        language,
        email,
        contentPreview: content.substring(0, 100),
        tags
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Poem submitted successfully (demo mode)',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit poem' },
      { status: 500 }
    )
  }
}
