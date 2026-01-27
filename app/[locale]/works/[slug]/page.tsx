import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import WorkReader from '@/components/works/WorkReader'

interface WorkPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

async function getWork(slug: string) {
  try {
    const work = await prisma.work.findUnique({
      where: { slug },
      include: {
        author: true,
        chapters: {
          orderBy: { order: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    return work
  } catch (error) {
    console.error('Failed to fetch work:', error)
    return null
  }
}

export default async function WorkPage({ params: { locale, slug } }: WorkPageProps) {
  const dictionary = await getDictionary(locale)
  const work = await getWork(slug)

  if (!work || !work.published) {
    notFound()
  }

  const getTagName = (tag: { nameEn: string; nameDe: string; nameRu: string }) => {
    if (locale === 'de') return tag.nameDe
    if (locale === 'ru') return tag.nameRu
    return tag.nameEn
  }

  return (
    <main className="min-h-screen">
      <Navigation locale={locale} dictionary={dictionary} />

      {/* Work Header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 text-xs font-mono text-ink-black/60 uppercase mb-4 border border-ink-black/20">
            {work.language}
          </span>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink-black mb-6">
            {work.title}
          </h1>

          <div className="w-20 h-1 bg-blood-red mx-auto mb-6" />

          <p className="text-xl text-ink-black/70 font-sans">
            {dictionary.works.by}{' '}
            <Link
              href={`/${locale}/authors/${work.author.slug}`}
              className="text-blood-red hover:text-ink-black transition-colors"
            >
              {work.author.name}
            </Link>
          </p>

          {work.year && (
            <p className="text-sm text-ink-black/50 mt-2">{work.year}</p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/5 font-serif text-8xl select-none hidden lg:block">
          {work.title.substring(0, 10)}
        </div>
      </section>

      {/* Work Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <WorkReader work={work} locale={locale} />

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              {work.tags.map((t) => (
                <span
                  key={t.tag.slug}
                  className="px-4 py-2 text-sm font-sans bg-ink-black/10 text-ink-black hover:bg-blood-red hover:text-paper transition-colors cursor-pointer"
                >
                  #{getTagName(t.tag)}
                </span>
              ))}
            </div>
          )}

          {/* Audio Player */}
          {work.audioUrl && (
            <div className="mt-12 brutalist-border p-6 bg-ink-black/5">
              <p className="text-sm text-ink-black/60 mb-4 font-sans">
                {dictionary.works.listenTo}
                {work.audioReader && ` • ${work.audioReader}`}
              </p>
              <audio controls className="w-full">
                <source src={work.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {/* Source */}
          {work.source && (
            <p className="text-center text-sm text-ink-black/50 mt-8 italic">
              {work.source}
            </p>
          )}

          {/* Back Link */}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/works`}
              className="inline-block brutalist-border px-6 py-3 bg-ink-black text-paper hover:bg-blood-red transition-colors font-medium"
            >
              ← {dictionary.homepage.featured.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Author Info */}
      {work.author.bio && (
        <section className="py-16 px-6 bg-ink-black/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-ink-black mb-4">
              {locale === 'de' && 'Über den Autor'}
              {locale === 'en' && 'About the Author'}
              {locale === 'ru' && 'Об авторе'}
            </h2>
            <div className="brutalist-border bg-paper p-6">
              <h3 className="text-xl font-serif font-bold text-ink-black mb-2">
                {work.author.name}
                {work.author.nameOriginal && (
                  <span className="text-ink-black/60 ml-2">({work.author.nameOriginal})</span>
                )}
              </h3>
              {work.author.birthYear && (
                <p className="text-sm text-ink-black/60 mb-4">
                  {work.author.birthYear}{work.author.deathYear ? ` — ${work.author.deathYear}` : ''}
                </p>
              )}
              <p className="text-ink-black/80 font-sans">
                {locale === 'de' && work.author.bioDe ? work.author.bioDe :
                  locale === 'ru' && work.author.bioRu ? work.author.bioRu :
                    locale === 'en' && work.author.bioEn ? work.author.bioEn :
                      work.author.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer dictionary={dictionary} />
    </main>
  )
}
