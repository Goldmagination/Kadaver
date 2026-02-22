'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import type { Locale } from '@/i18n.config'
import Link from 'next/link'
import ChapterEditor from '@/components/works/ChapterEditor'
import TagInput from '@/components/ui/TagInput'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'

interface SubmitPageProps {
  params: { locale: Locale }
}

const languages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]

export default function SubmitPage({ params: { locale } }: SubmitPageProps) {
  const [dictionary, setDictionary] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    language: locale,
    content: '',
    tags: '',
    email: '',
    type: 'POEM',
    chapters: [] as any[], // Add chapters array
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import(`@/lib/translations/${locale}.json`).then((mod) => {
      setDictionary(mod.default)
    })
  }, [locale])

  useEffect(() => {
    if (headerRef.current) {
      const title = headerRef.current.querySelector('h1')
      if (title) {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        )
      }
    }
  }, [dictionary])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitStatus('success')
      setFormData({
        title: '',
        author: '',
        language: locale,
        content: '',
        tags: '',
        email: '',
        type: 'POEM',
        chapters: [],
      })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!dictionary) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-ink-black/50 font-serif text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation locale={locale} dictionary={dictionary} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div ref={headerRef} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-ink-black mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {dictionary.submit.title}
          </motion.h1>

          <motion.div
            className="w-20 h-1 bg-blood-red mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          <motion.p
            className="text-xl text-ink-black/70 max-w-2xl mx-auto font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {locale === 'de' && 'Teilen Sie Ihre Worte mit der Welt. Jedes Gedicht erzählt eine Geschichte.'}
            {locale === 'en' && 'Share your words with the world. Every poem tells a story.'}
            {locale === 'ru' && 'Поделитесь своими словами с миром. Каждое стихотворение рассказывает историю.'}
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          POETRY
        </div>
        <div className="absolute bottom-20 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          SUBMIT
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 px-6 bg-ink-black/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="brutalist-border bg-paper p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif font-bold text-ink-black mb-6">
              {dictionary.submit.guidelines}
            </h2>

            <ul className="space-y-4 text-ink-black/80 font-sans">
              <li className="flex items-start">
                <span className="text-blood-red mr-3 text-xl">&#10033;</span>
                <span>
                  {locale === 'de' && 'Original-Werke werden bevorzugt. Übersetzungen nur mit Genehmigung.'}
                  {locale === 'en' && 'Original works are preferred. Translations only with permission.'}
                  {locale === 'ru' && 'Предпочтение отдается оригинальным произведениям. Переводы только с разрешения.'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blood-red mr-3 text-xl">&#10033;</span>
                <span>
                  {locale === 'de' && 'Gedichte in Deutsch, Englisch oder Russisch.'}
                  {locale === 'en' && 'Poems in German, English, or Russian.'}
                  {locale === 'ru' && 'Стихи на немецком, английском или русском языке.'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blood-red mr-3 text-xl">&#10033;</span>
                <span>
                  {locale === 'de' && 'Bitte formatieren Sie Ihr Gedicht sorgfältig mit Zeilenumbrüchen.'}
                  {locale === 'en' && 'Please format your poem carefully with line breaks.'}
                  {locale === 'ru' && 'Пожалуйста, тщательно форматируйте стихотворение с переносами строк.'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blood-red mr-3 text-xl">&#10033;</span>
                <span>
                  {locale === 'de' && 'Wir werden Sie innerhalb von 7 Tagen kontaktieren.'}
                  {locale === 'en' && 'We will contact you within 7 days.'}
                  {locale === 'ru' && 'Мы свяжемся с вами в течение 7 дней.'}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            {/* Title */}
            <div className="group">
              <label
                htmlFor="title"
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {dictionary.submit.form.title}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/30 focus:border-blood-red outline-none transition-colors font-sans text-ink-black"
                placeholder={locale === 'de' ? 'Der Titel Ihres Gedichts' : locale === 'ru' ? 'Название вашего стихотворения' : 'The title of your poem'}
              />
            </div>

            {/* Author */}
            <div className="group">
              <label
                htmlFor="author"
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {dictionary.submit.form.author}
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/30 focus:border-blood-red outline-none transition-colors font-sans text-ink-black"
                placeholder={locale === 'de' ? 'Ihr Name oder Pseudonym' : locale === 'ru' ? 'Ваше имя или псевдоним' : 'Your name or pseudonym'}
              />
            </div>

            {/* Work Type */}
            <div className="group">
              <label
                htmlFor="type"
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {/* Fallback label if translation missing */}
                {locale === 'de' ? 'Art des Werkes' : locale === 'ru' ? 'Тип произведения' : 'Type of Work'}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || 'POEM'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-4 py-3 bg-paper border-b-2 border-ink-black/30 focus:border-blood-red outline-none transition-colors font-sans text-ink-black cursor-pointer"
              >
                <option value="POEM">{locale === 'de' ? 'Gedicht' : locale === 'ru' ? 'Стихотворение' : 'Poem'}</option>
                <option value="TALE">{locale === 'de' ? 'Erzählung' : locale === 'ru' ? 'Рассказ' : 'Tale'}</option>
                <option value="NOVEL">{locale === 'de' ? 'Roman' : locale === 'ru' ? 'Роман' : 'Novel'}</option>
              </select>
            </div>

            {/* Language */}
            <div className="group">
              <label
                htmlFor="language"
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {dictionary.submit.form.language}
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-paper border-b-2 border-ink-black/30 focus:border-blood-red outline-none transition-colors font-sans text-ink-black cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content or Chapter Editor */}
            {formData.type === 'NOVEL' ? (
              <div className="group">
                <label className="block text-lg font-serif font-bold text-ink-black mb-2">
                  {dictionary.submit.form.content}
                </label>
                <ChapterEditor
                  chapters={formData.chapters || [{ id: '1', title: '', content: '' }]}
                  onChange={(newChapters) => setFormData(prev => ({ ...prev, chapters: newChapters }))}
                  locale={locale}
                />
              </div>
            ) : (
              <div className="group">
                <label
                  htmlFor="content"
                  className="block text-lg font-serif font-bold text-ink-black mb-2"
                >
                  {dictionary.submit.form.content}
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required={formData.type !== 'NOVEL'}
                  rows={12}
                  className="w-full px-4 py-3 bg-paper brutalist-border focus:shadow-none outline-none transition-all font-serif text-ink-black resize-none"
                  placeholder={locale === 'de'
                    ? 'Schreiben Sie hier Ihr Gedicht...\n\nBehalten Sie die Formatierung bei,\nwie Sie sie wünschen.'
                    : locale === 'ru'
                      ? 'Напишите здесь свое стихотворение...\n\nСохраняйте форматирование,\nкак вам нужно.'
                      : 'Write your poem here...\n\nPreserve formatting\nas you wish.'}
                />
              </div>
            )}

            {/* Tags */}
            <div className="group">
              <label
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {dictionary.submit.form.tags}
              </label>
              <TagInput
                value={formData.tags}
                onChange={(val) => setFormData((prev) => ({ ...prev, tags: val }))}
                locale={locale}
                placeholder={
                  locale === 'de' ? 'liebe, natur, zeit' :
                    locale === 'ru' ? 'любовь, природа, время' :
                      locale === 'uk' ? 'кохання, природа, час' :
                        'love, nature, time'
                }
              />
            </div>

            {/* Email */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-lg font-serif font-bold text-ink-black mb-2"
              >
                {dictionary.submit.form.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/30 focus:border-blood-red outline-none transition-colors font-sans text-ink-black"
                placeholder={locale === 'de' ? 'ihre@email.de' : locale === 'ru' ? 'ваш@email.ru' : 'your@email.com'}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full brutalist-border bg-ink-black text-paper py-4 font-serif font-bold text-xl hover:bg-blood-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-paper" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {dictionary.common.loading}
                    </span>
                  ) : (
                    dictionary.submit.form.submit
                  )}
                </span>
              </motion.button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                className="p-4 bg-green-900/10 border-l-4 border-green-700 text-green-800 font-sans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {dictionary.submit.form.success}
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                className="p-4 bg-blood-red/10 border-l-4 border-blood-red text-blood-red font-sans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {dictionary.submit.form.error}
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
