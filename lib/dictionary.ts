import 'server-only'
import type { Locale } from '@/i18n.config'

const dictionaries = {
  en: () => import('./translations/en.json').then((module) => module.default),
  de: () => import('./translations/de.json').then((module) => module.default),
  ru: () => import('./translations/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en()
}