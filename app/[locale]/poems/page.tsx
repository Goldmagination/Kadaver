'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'

interface PoemsPageProps {
  params: { locale: Locale }
}

const samplePoems = [
  {
    id: '1',
    slug: 'der-panther',
    title: 'Der Panther',
    author: 'Rainer Maria Rilke',
    language: 'de',
    excerpt: 'Sein Blick ist vom Vorübergehn der Stäbe\nso müd geworden, dass er nichts mehr hält.\nIhm ist, als ob es tausend Stäbe gäbe\nund hinter tausend Stäben keine Welt.',
    tags: ['nature', 'freedom', 'silence'],
  },
  {
    id: '2',
    slug: 'the-road-not-taken',
    title: 'The Road Not Taken',
    author: 'Robert Frost',
    language: 'en',
    excerpt: 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could',
    tags: ['choice', 'journey', 'time'],
  },
  {
    id: '3',
    slug: 'ya-vas-lyubil',
    title: 'Я вас любил',
    author: 'Александр Пушкин',
    language: 'ru',
    excerpt: 'Я вас любил: любовь еще, быть может,\nВ душе моей угасла не совсем;\nНо пусть она вас больше не тревожит;\nЯ не хочу печалить вас ничем.',
    tags: ['love', 'memory', 'time'],
  },
  {
    id: '4',
    slug: 'erlkoenig',
    title: 'Erlkönig',
    author: 'Johann Wolfgang von Goethe',
    language: 'de',
    excerpt: 'Wer reitet so spät durch Nacht und Wind?\nEs ist der Vater mit seinem Kind;\nEr hat den Knaben wohl in dem Arm,\nEr fasst ihn sicher, er hält ihn warm.',
    tags: ['death', 'nature', 'fear'],
  },
  {
    id: '5',
    slug: 'the-raven',
    title: 'The Raven',
    author: 'Edgar Allan Poe',
    language: 'en',
    excerpt: 'Once upon a midnight dreary, while I pondered, weak and weary,\nOver many a quaint and curious volume of forgotten lore—\nWhile I nodded, nearly napping, suddenly there came a tapping,\nAs of some one gently rapping, rapping at my chamber door.',
    tags: ['death', 'memory', 'dream'],
  },
  {
    id: '6',
    slug: 'zimneye-utro',
    title: 'Зимнее утро',
    author: 'Александр Пушкин',
    language: 'ru',
    excerpt: 'Мороз и солнце; день чудесный!\nЕще ты дремлешь, друг прелестный —\nПора, красавица, проснись:\nОткрой сомкнуты негой взоры',
    tags: ['nature', 'love', 'time'],
  },
]

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

export default function PoemsPage({ params: { locale } }: PoemsPageProps) {
  const [dictionary, setDictionary] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'de' | 'en' | 'ru'>('all')

  useEffect(() => {
    import(`@/lib/translations/${locale}.json`).then((mod) => {
      setDictionary(mod.default)
    })
  }, [locale])

  const filteredPoems = filter === 'all'
    ? samplePoems
    : samplePoems.filter(poem => poem.language === filter)

  const pageTitle = {
    de: 'Alle Gedichte',
    en: 'All Poems',
    ru: 'Все стихи'
  }

  const pageSubtitle = {
    de: 'Eine Sammlung von Versen in drei Sprachen',
    en: 'A collection of verses in three tongues',
    ru: 'Коллекция стихов на трех языках'
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
          GEDICHTE
        </div>
        <div className="absolute bottom-10 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          СТИХИ
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-6 border-b border-ink-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'all', label: dictionary.poems.filters.all },
              { key: 'de', label: 'Deutsch' },
              { key: 'en', label: 'English' },
              { key: 'ru', label: 'Русский' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`px-6 py-2 font-sans text-sm transition-all duration-300 ${
                  filter === item.key
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

      {/* Poems Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={filter}
          >
            {filteredPoems.map((poem) => (
              <motion.article
                key={poem.id}
                variants={itemVariants}
                className="group"
              >
                <Link href={`/${locale}/poems/${poem.slug}`}>
                  <motion.div
                    className="brutalist-border p-8 bg-paper hover:bg-gold-leaf/5 transition-all duration-300 h-full"
                    whileHover={{ y: -5, boxShadow: '8px 8px 0 var(--ink-black)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors">
                        {poem.title}
                      </h3>
                      <span className="text-xs font-mono text-ink-black/50 uppercase">
                        {poem.language}
                      </span>
                    </div>

                    <p className="text-sm text-ink-black/70 mb-4">
                      {dictionary.poems.by} {poem.author}
                    </p>

                    <pre className="font-serif text-ink-black/90 mb-6 whitespace-pre-wrap text-sm leading-relaxed">
                      {poem.excerpt}
                    </pre>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {poem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-sans bg-ink-black/10 text-ink-black"
                        >
                          #{dictionary.poems.tags[tag] || tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-block text-sm font-medium text-blood-red group-hover:text-ink-black transition-colors">
                      {dictionary.poems.readMore} →
                    </span>
                  </motion.div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
