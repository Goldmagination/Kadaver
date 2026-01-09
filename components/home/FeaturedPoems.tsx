'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import Link from 'next/link'

interface FeaturedPoemsProps {
  locale: Locale
  dictionary: any
}

const samplePoems = [
  {
    id: 1,
    title: 'Der Panther',
    author: 'Rainer Maria Rilke',
    language: 'de',
    excerpt: 'Sein Blick ist vom Vorübergehn der Stäbe\nso müd geworden, dass er nichts mehr hält.\nIhm ist, als ob es tausend Stäbe gäbe\nund hinter tausend Stäben keine Welt.',
    tags: ['nature', 'freedom', 'silence'],
  },
  {
    id: 2,
    title: 'The Road Not Taken',
    author: 'Robert Frost',
    language: 'en',
    excerpt: 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could',
    tags: ['choice', 'journey', 'time'],
  },
  {
    id: 3,
    title: 'Я вас любил',
    author: 'Александр Пушкин',
    language: 'ru',
    excerpt: 'Я вас любил: любовь еще, быть может,\nВ душе моей угасла не совсем;\nНо пусть она вас больше не тревожит;\nЯ не хочу печалить вас ничем.',
    tags: ['love', 'memory', 'time'],
  },
]

export default function FeaturedPoems({ locale, dictionary }: FeaturedPoemsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <section ref={containerRef} className="py-20 px-6 bg-paper relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-ink-black mb-4">
            {dictionary.homepage.featured.title}
          </h2>
          <div className="w-20 h-1 bg-blood-red mx-auto" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {samplePoems.map((poem) => (
            <motion.article
              key={poem.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="brutalist-border p-8 bg-paper hover:bg-gold-leaf/5 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors">
                    {poem.title}
                  </h3>
                  <span className="text-xs font-mono text-ink-black/50 uppercase">
                    {poem.language}
                  </span>
                </div>
                
                <p className="text-sm text-ink-black/70 mb-4">{dictionary.poems.by} {poem.author}</p>
                
                <pre className="font-serif text-ink-black/90 mb-6 whitespace-pre-wrap">
                  {poem.excerpt}
                </pre>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {poem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-sans bg-ink-black/10 text-ink-black hover:bg-blood-red hover:text-paper transition-colors cursor-pointer"
                    >
                      #{dictionary.poems.tags[tag] || tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/${locale}/poems/${poem.id}`}
                  className="inline-block text-sm font-medium text-blood-red hover:text-ink-black transition-colors"
                >
                  {dictionary.poems.readMore} →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            href={`/${locale}/poems`}
            className="inline-block brutalist-border px-6 py-3 bg-ink-black text-paper hover:bg-blood-red transition-colors font-medium"
          >
            {dictionary.homepage.featured.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}