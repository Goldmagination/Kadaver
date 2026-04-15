import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ============================================
// In-memory rate limiter: 1 view per IP per slug per 24h
// Entries auto-expire to prevent memory leaks
// ============================================

const viewLog = new Map<string, number>() // key: "ip:slug" -> timestamp
const VIEW_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

// Clean up old entries every hour
let lastCleanup = Date.now()
function cleanupStaleEntries() {
  const now = Date.now()
  if (now - lastCleanup < 60 * 60 * 1000) return // only cleanup once per hour
  lastCleanup = now
  viewLog.forEach((timestamp, key) => {
    if (now - timestamp > VIEW_COOLDOWN_MS) {
      viewLog.delete(key)
    }
  })
}

// Common bot/crawler user-agent patterns
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /scraper/i,
  /fetch/i, /curl/i, /wget/i, /python/i, /java\//i,
  /headless/i, /phantom/i, /lighthouse/i, /pagespeed/i,
  /google/i, /bing/i, /yahoo/i, /baidu/i, /yandex/i,
  /duckduck/i, /semrush/i, /ahrefs/i, /mj12/i,
  /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /discordbot/i,
  /pingdom/i, /uptimerobot/i, /statuscake/i,
  /preview/i, /embed/i, /archive/i,
]

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true // No UA = suspicious
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent))
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return request.ip || 'unknown'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userAgent = request.headers.get('user-agent')

    // 1. Block bots/crawlers
    if (isBot(userAgent)) {
      // Still return the current count, just don't increment
      const work = await prisma.work.findUnique({
        where: { slug: params.slug },
        select: { viewCount: true },
      })
      return NextResponse.json({ viewCount: work?.viewCount ?? 0 })
    }

    // 2. Rate limit: 1 view per IP per slug per 24h
    cleanupStaleEntries()
    const ip = getClientIp(request)
    const key = `${ip}:${params.slug}`
    const lastView = viewLog.get(key)

    if (lastView && Date.now() - lastView < VIEW_COOLDOWN_MS) {
      // Already counted this visitor recently, return current count
      const work = await prisma.work.findUnique({
        where: { slug: params.slug },
        select: { viewCount: true },
      })
      return NextResponse.json({ viewCount: work?.viewCount ?? 0 })
    }

    // 3. Valid view — increment and record
    viewLog.set(key, Date.now())

    const work = await prisma.work.update({
      where: { slug: params.slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    })

    return NextResponse.json({ viewCount: work.viewCount })
  } catch (error) {
    console.error('Failed to increment view count:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
