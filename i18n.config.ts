export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'ru', 'uk'] as const,
} as const

export type Locale = (typeof i18n)['locales'][number]

export const languageNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
  uk: 'Українська',
}