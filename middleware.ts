import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n.config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const locales = [...i18n.locales]

  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    const locale = matchLocale(languages, locales, i18n.defaultLocale)
    return locale
  } catch {
    return i18n.defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/textures') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return
  }

  // Admin Protection
  if (pathname.includes('/admin')) {
    const adminToken = request.cookies.get('admin_token')

    // In production, check for a secure token. 
    // Ideally this token matches an ENV var.
    // For now, we redirect to a login page if not present.
    if (!adminToken) {
      // Redirect to login if trying to access admin
      // Using 307 to preserve method if needed, but here simple redirect is fine
      const url = request.nextUrl.clone()
      url.pathname = `/${getLocale(request)}/login`
      return NextResponse.redirect(url)
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}