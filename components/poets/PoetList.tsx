'use client'

import { motion } from 'framer-motion'
import type { Poet } from '@/lib/generated/prisma'
import Link from 'next/link'

interface PoetListProps {
  poets: Poet[]
  locale: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export default function PoetList({ poets, locale }: PoetListProps) {
  if (poets.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-black/60 font-serif text-xl italic">
          {locale === 'de' && 'Noch keine Dichter hinzugefugt.'}
          {locale === 'en' && 'No poets added yet.'}
          {locale === 'ru' && 'Поэты еще не добавлены.'}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {poets.map((poet) => (
        <motion.div key={poet.id} variants={itemVariants}>
          <Link href={`/${locale}/poets/${poet.slug}`}>
            <motion.article
              className="group brutalist-border p-8 bg-paper hover:bg-gold-leaf/5 transition-all duration-300 h-full"
              whileHover={{ y: -5, boxShadow: '8px 8px 0 var(--ink-black)' }}
            >
              <h2 className="text-2xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors mb-2">
                {poet.name}
              </h2>
              <p className="text-sm text-ink-black/60 font-mono">
                {poet.birthYear}{poet.deathYear ? ` — ${poet.deathYear}` : ' —'}
              </p>
              <div className="mt-4 flex items-center text-blood-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>
                  {locale === 'de' && 'Gedichte ansehen'}
                  {locale === 'en' && 'View poems'}
                  {locale === 'ru' && 'Смотреть стихи'}
                </span>
                <span className="ml-2">→</span>
              </div>
            </motion.article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
