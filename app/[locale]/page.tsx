import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import HeroSection from '@/components/home/HeroSection'
import Navigation from '@/components/navigation/Navigation'
import FeaturedWorks from '@/components/home/FeaturedWorks'
import Footer from '@/components/layout/Footer'

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  const dictionary = await getDictionary(locale)

  return (
    <main className="min-h-screen">
      <Navigation locale={locale} dictionary={dictionary} />
      <HeroSection dictionary={dictionary} />
      <FeaturedWorks locale={locale} dictionary={dictionary} />
      <Footer dictionary={dictionary} />
    </main>
  )
}