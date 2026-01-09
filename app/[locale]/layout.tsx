import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dictionary = await getDictionary(locale)
  
  return {
    title: `${dictionary.common.title} - ${dictionary.common.subtitle}`,
    description: dictionary.homepage.hero.subtitle,
    keywords: ['poetry', 'poems', 'Kadaver', 'literature', 'German poetry', 'Russian poetry', 'English poetry'],
    authors: [{ name: 'Kadaver Society' }],
    openGraph: {
      title: `${dictionary.common.title} - ${dictionary.common.subtitle}`,
      description: dictionary.homepage.hero.subtitle,
      type: 'website',
      locale: locale,
    },
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return <>{children}</>
}