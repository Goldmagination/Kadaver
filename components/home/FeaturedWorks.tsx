'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import Link from 'next/link'

interface FeaturedWorksProps {
  locale: Locale
  dictionary: any
}

interface Work {
  id: string
  slug: string
  title: string
  content: string | null
  excerpt: string | null
  language: string
  author: { name: string }
  tags: Array<{ tag: { slug: string; nameEn: string; nameDe: string; nameRu: string } }>
}

export default function FeaturedWorks({ locale, dictionary }: FeaturedWorksProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // First try to get featured works, then fall back to latest
    fetch('/api/works?featured=true&limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.works && data.works.length > 0) {
          setWorks(data.works)
        } else {
          // No featured works, get latest instead
          return fetch('/api/works?limit=3')
            .then(res => res.json())
            .then(data => setWorks(data.works || []))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

        {loading ? (
          <div className="text-center py-12">
            <div className="text-ink-black/50 font-serif text-xl">Loading...</div>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ink-black/60 font-serif text-xl italic">
              {locale === 'de' && 'Noch keine Werke veröffentlicht.'}
              {locale === 'en' && 'No works published yet. Be the first to submit!'}
              {locale === 'ru' && 'Произведения пока не опубликованы.'}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {works.map((work) => (
              <motion.article
                key={work.id}
                variants={itemVariants}
                className="group relative"
              >
                <div className="brutalist-border p-8 bg-paper hover:bg-gold-leaf/5 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors">
                      {work.title}
                    </h3>
                    <span className="text-xs font-mono text-ink-black/50 uppercase">
                      {work.language}
                    </span>
                  </div>

                  <p className="text-sm text-ink-black/70 mb-4">{dictionary.works.by} {work.author.name}</p>

                  <pre className="font-serif text-ink-black/90 mb-6 whitespace-pre-wrap">
                    {(work.excerpt || work.content || '').substring(0, 200)}
                    {(work.excerpt || work.content || '').length > 200 ? '...' : ''}
                  </pre>

                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.tags.map((t) => (
                        <span
                          key={t.tag.slug}
                          className="px-2 py-1 text-xs font-sans bg-ink-black/10 text-ink-black hover:bg-blood-red hover:text-paper transition-colors cursor-pointer"
                        >
                          #{locale === 'de' ? t.tag.nameDe : locale === 'ru' ? t.tag.nameRu : t.tag.nameEn}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/${locale}/works/${work.slug}`}
                    className="inline-block text-sm font-medium text-blood-red hover:text-ink-black transition-colors"
                  >
                    {dictionary.works.readMore} →
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            href={`/${locale}/works`}
            className="inline-block brutalist-border px-6 py-3 bg-ink-black text-paper hover:bg-blood-red transition-colors font-medium"
          >
            {dictionary.homepage.featured.viewAll}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}