import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    const { password } = await request.json()

    // In a real app, this should be an ENV var.
    // Hardcoded for 'specific person' request as 'kafka1924' (death year)
    // User should be advised to change this.
    const SECRET_PASS = process.env.ADMIN_PASSWORD || 'kafka1924'

    if (password === SECRET_PASS) {
        // Set cookie
        cookies().set('admin_token', 'authorized', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
