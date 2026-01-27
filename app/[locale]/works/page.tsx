'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'

interface WorksPageProps {
  params: { locale: Locale }
}

interface Work {
  id: string
  slug: string
  title: string
  content: string | null
  excerpt: string | null
  language: string
  author: {
    name: string
  }
  tags: Array<{
    tag: {
      slug: string
      nameEn: string
      nameDe: string
      nameRu: string
    }
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function WorksPage({ params: { locale } }: WorksPageProps) {
  const [dictionary, setDictionary] = useState<any>(null)
  const [works, setWorks] = useState<Work[]>([])
  const [filter, setFilter] = useState<'all' | 'de' | 'en' | 'ru'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import(`@/lib/translations/${locale}.json`).then((mod) => {
      setDictionary(mod.default)
    })

    // Fetch works from API
    fetch('/api/works')
      .then(res => res.json())
      .then(data => {
        setWorks(data.works || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [locale])

  const filteredWorks = filter === 'all'
    ? works
    : works.filter(work => work.language === filter)

  const pageTitle = {
    de: 'Alle Werke',
    en: 'All Works',
    ru: 'Все произведения'
  }

  const pageSubtitle = {
    de: 'Eine Sammlung von literarischen Werken in drei Sprachen',
    en: 'A collection of literary works in three tongues',
    ru: 'Коллекция литературных произведений на трех языках'
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
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-ink-black mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
          >
            {pageTitle[locale]}
          </motion.h1>

          <motion.div
            className="w-20 h-1 bg-blood-red mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />

          <motion.p
            className="text-xl text-ink-black/70 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {pageSubtitle[locale]}
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          WERKE
        </div>
        <div className="absolute bottom-10 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          РАБОТЫ
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-6 border-b border-ink-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'all', label: dictionary.works.filters.all },
              { key: 'de', label: 'Deutsch' },
              { key: 'en', label: 'English' },
              { key: 'ru', label: 'Русский' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`px-6 py-2 font-sans text-sm transition-all duration-300 ${filter === item.key
                    ? 'bg-ink-black text-paper'
                    : 'bg-transparent text-ink-black border border-ink-black/30 hover:border-ink-black'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-ink-black/50 font-serif text-xl">Loading works...</div>
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-black/60 font-serif text-xl italic mb-4">
                {locale === 'de' && 'Noch keine Werke veröffentlicht.'}
                {locale === 'en' && 'No works published yet.'}
                {locale === 'ru' && 'Произведения пока не опубликованы.'}
              </p>
              <p className="text-ink-black/40 font-sans">
                {locale === 'de' && 'Reichen Sie Ihr Werk ein!'}
                {locale === 'en' && 'Submit your work!'}
                {locale === 'ru' && 'Присылайте свои работы!'}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={filter}
            >
              {filteredWorks.map((work) => (
                <motion.article
                  key={work.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/${locale}/works/${work.slug}`}>
                    <motion.div
                      className="brutalist-border p-8 bg-paper hover:bg-gold-leaf/5 transition-all duration-300 h-full"
                      whileHover={{ y: -5, boxShadow: '8px 8px 0 var(--ink-black)' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors">
                          {work.title}
                        </h3>
                        <span className="text-xs font-mono text-ink-black/50 uppercase">
                          {work.language}
                        </span>
                      </div>

                      <p className="text-sm text-ink-black/70 mb-4">
                        {dictionary.works.by} {work.author.name}
                      </p>

                      <pre className="font-serif text-ink-black/90 mb-6 whitespace-pre-wrap text-sm leading-relaxed">
                        {(work.excerpt || work.content || '').substring(0, 200)}
                        {(work.excerpt || work.content || '').length > 200 ? '...' : ''}
                      </pre>

                      {work.tags && work.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {work.tags.map((t) => (
                            <span
                              key={t.tag.slug}
                              className="px-2 py-1 text-xs font-sans bg-ink-black/10 text-ink-black"
                            >
                              #{locale === 'de' ? t.tag.nameDe : locale === 'ru' ? t.tag.nameRu : t.tag.nameEn}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="inline-block text-sm font-medium text-blood-red group-hover:text-ink-black transition-colors">
                        {dictionary.works.readMore} →
                      </span>
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
