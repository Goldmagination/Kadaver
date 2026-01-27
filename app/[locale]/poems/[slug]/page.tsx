import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import { prisma } from '@/lib/db'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

interface PoemPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

async function getPoem(slug: string) {
  try {
    const poem = await prisma.poem.findUnique({
      where: { slug },
      include: {
        poet: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    return poem
  } catch (error) {
    console.error('Failed to fetch poem:', error)
    return null
  }
}

export default async function PoemPage({ params: { locale, slug } }: PoemPageProps) {
  const dictionary = await getDictionary(locale)
  const poem = await getPoem(slug)

  if (!poem || !poem.published) {
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

      {/* Poem Header */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 text-xs font-mono text-ink-black/60 uppercase mb-4 border border-ink-black/20">
            {poem.language}
          </span>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink-black mb-6">
            {poem.title}
          </h1>

          <div className="w-20 h-1 bg-blood-red mx-auto mb-6" />

          <p className="text-xl text-ink-black/70 font-sans">
            {dictionary.poems.by}{' '}
            <Link
              href={`/${locale}/poets/${poem.poet.slug}`}
              className="text-blood-red hover:text-ink-black transition-colors"
            >
              {poem.poet.name}
            </Link>
          </p>

          {poem.year && (
            <p className="text-sm text-ink-black/50 mt-2">{poem.year}</p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/5 font-serif text-8xl select-none hidden lg:block">
          {poem.title.substring(0, 10)}
        </div>
      </section>

      {/* Poem Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <article className="brutalist-border bg-paper p-8 md:p-12">
            <pre className="font-serif text-lg md:text-xl text-ink-black leading-relaxed whitespace-pre-wrap">
              {poem.content}
            </pre>
          </article>

          {/* Tags */}
          {poem.tags && poem.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              {poem.tags.map((t) => (
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
          {poem.audioUrl && (
            <div className="mt-12 brutalist-border p-6 bg-ink-black/5">
              <p className="text-sm text-ink-black/60 mb-4 font-sans">
                {dictionary.poems.listenTo}
                {poem.audioReader && ` • ${poem.audioReader}`}
              </p>
              <audio controls className="w-full">
                <source src={poem.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {/* Source */}
          {poem.source && (
            <p className="text-center text-sm text-ink-black/50 mt-8 italic">
              {poem.source}
            </p>
          )}

          {/* Back Link */}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/poems`}
              className="inline-block brutalist-border px-6 py-3 bg-ink-black text-paper hover:bg-blood-red transition-colors font-medium"
            >
              ← {dictionary.homepage.featured.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Poet Info */}
      {poem.poet.bio && (
        <section className="py-16 px-6 bg-ink-black/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-ink-black mb-4">
              {locale === 'de' && 'Über den Dichter'}
              {locale === 'en' && 'About the Poet'}
              {locale === 'ru' && 'О поэте'}
            </h2>
            <div className="brutalist-border bg-paper p-6">
              <h3 className="text-xl font-serif font-bold text-ink-black mb-2">
                {poem.poet.name}
                {poem.poet.nameOriginal && (
                  <span className="text-ink-black/60 ml-2">({poem.poet.nameOriginal})</span>
                )}
              </h3>
              {poem.poet.birthYear && (
                <p className="text-sm text-ink-black/60 mb-4">
                  {poem.poet.birthYear}{poem.poet.deathYear ? ` — ${poem.poet.deathYear}` : ''}
                </p>
              )}
              <p className="text-ink-black/80 font-sans">
                {locale === 'de' && poem.poet.bioDe ? poem.poet.bioDe :
                 locale === 'ru' && poem.poet.bioRu ? poem.poet.bioRu :
                 locale === 'en' && poem.poet.bioEn ? poem.poet.bioEn :
                 poem.poet.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer dictionary={dictionary} />
    </main>
  )
}
