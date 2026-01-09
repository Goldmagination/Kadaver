import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function getOrCreateAnonymousUser(email: string) {
  // Try to find existing user by email
  let user = await prisma.user.findUnique({
    where: { email }
  })

  // If not found, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: 'POET',
      }
    })
  }

  return user
}

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

    try {
      // Get or create user by email
      const user = await getOrCreateAnonymousUser(email)

      // Create the submission
      const submission = await prisma.submission.create({
        data: {
          title,
          authorName: author,
          language: language.toLowerCase() as 'de' | 'en' | 'ru',
          content,
          submitterId: user.id,
          status: 'PENDING',
        },
      })

      console.log('Submission created:', submission.id)

      return NextResponse.json(
        {
          success: true,
          message: 'Poem submitted successfully',
          id: submission.id
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save submission to database' },
        { status: 500 }
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
