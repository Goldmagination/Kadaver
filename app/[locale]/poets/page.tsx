import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/db'
import PoetList from '@/components/poets/PoetList'
import type { Poet } from '@/lib/generated/prisma'

async function getPoets(): Promise<Poet[]> {
  try {
    const poets = await prisma.poet.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return poets
  } catch (error) {
    console.error('Failed to fetch poets:', error)
    return []
  }
}

export default async function PoetsPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)
  const poets = await getPoets()

  const pageTitle = {
    de: 'Unsere Dichter',
    en: 'Our Poets',
    ru: 'Наши поэты'
  }

  const pageSubtitle = {
    de: 'Die Stimmen hinter den Versen',
    en: 'The voices behind the verses',
    ru: 'Голоса за строками'
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
          DICHTER
        </div>
        <div className="absolute bottom-10 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          ПОЭТЫ
        </div>
      </section>

      {/* Poets List */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <PoetList poets={poets} locale={locale} />
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
