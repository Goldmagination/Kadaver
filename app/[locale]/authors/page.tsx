import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/db'
import AuthorList from '@/components/authors/AuthorList'
import type { Author } from '@/lib/generated/prisma'

async function getAuthors(): Promise<Author[]> {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return authors
  } catch (error) {
    console.error('Failed to fetch authors:', error)
    return []
  }
}

export default async function AuthorsPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  const authors = await getAuthors()

  const pageTitle = {
    de: 'Unsere Autoren',
    en: 'Our Authors',
    ru: 'Наши авторы'
  }

  const pageSubtitle = {
    de: 'Die Stimmen hinter den Werken',
    en: 'The voices behind the works',
    ru: 'Голоса за произведениями'
  }

  return (
    <main className="min-h-screen">
      <Navigation locale={locale} dictionary={dictionary} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-ink-black mb-6">
            {pageTitle[locale]}
          </h1>

          <div className="w-20 h-1 bg-blood-red mx-auto mb-8" />

          <p className="text-xl text-ink-black/70 font-sans">
            {pageSubtitle[locale]}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          AUTOREN
        </div>
        <div className="absolute bottom-10 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          АВТОРЫ
        </div>
      </section>

      {/* Authors List */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AuthorList authors={authors} locale={locale} />
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
