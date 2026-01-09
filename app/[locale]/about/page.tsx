'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'

interface AboutPageProps {
  params: { locale: Locale }
}

const content = {
  de: {
    title: 'Über Kadaver',
    subtitle: 'Eine Gesellschaft der Dichter',
    intro: 'Kadaver ist mehr als eine Website – es ist ein lebendiges Archiv der Poesie, ein Ort, an dem Worte atmen und Verse unsterblich werden.',
    sections: [
      {
        title: 'Unsere Mission',
        content: 'Wir glauben, dass Poesie keine Grenzen kennt. In einer Welt, die immer schneller wird, schaffen wir einen Raum der Stille, in dem jedes Wort zählt. Kadaver vereint Gedichte in Deutsch, Russisch und Englisch – drei Sprachen, drei Kulturen, eine universelle Sprache der Seele.'
      },
      {
        title: 'Der Name',
        content: 'Kadaver – ein provokanter Name für ein poetisches Projekt. Wie der Exquisite Corpse der Surrealisten entsteht hier Kunst aus dem Unerwarteten. Jedes Gedicht ist ein Fragment eines größeren Ganzen, jeder Dichter trägt zum kollektiven Körper der Literatur bei.'
      },
      {
        title: 'Für Dichter',
        content: 'Kadaver ist offen für alle, die ihre Stimme teilen möchten. Ob etablierter Autor oder aufstrebender Poet – hier finden Ihre Worte ein Zuhause. Reichen Sie Ihre Gedichte ein und werden Sie Teil unserer wachsenden Gemeinschaft.'
      }
    ],
    quote: 'Die Poesie ist die Muttersprache des menschlichen Geschlechts.',
    quoteAuthor: '— Johann Georg Hamann'
  },
  en: {
    title: 'About Kadaver',
    subtitle: 'A Society of Poets',
    intro: 'Kadaver is more than a website – it is a living archive of poetry, a place where words breathe and verses become immortal.',
    sections: [
      {
        title: 'Our Mission',
        content: 'We believe that poetry knows no borders. In a world that moves ever faster, we create a space of stillness where every word matters. Kadaver unites poems in German, Russian, and English – three languages, three cultures, one universal language of the soul.'
      },
      {
        title: 'The Name',
        content: 'Kadaver – a provocative name for a poetic project. Like the Exquisite Corpse of the Surrealists, art emerges here from the unexpected. Each poem is a fragment of a greater whole, each poet contributes to the collective body of literature.'
      },
      {
        title: 'For Poets',
        content: 'Kadaver is open to all who wish to share their voice. Whether established author or emerging poet – your words find a home here. Submit your poems and become part of our growing community.'
      }
    ],
    quote: 'Poetry is the mother tongue of the human race.',
    quoteAuthor: '— Johann Georg Hamann'
  },
  ru: {
    title: 'О Кадавере',
    subtitle: 'Общество поэтов',
    intro: 'Кадавер — это больше, чем веб-сайт — это живой архив поэзии, место, где слова дышат, а стихи становятся бессмертными.',
    sections: [
      {
        title: 'Наша миссия',
        content: 'Мы верим, что поэзия не знает границ. В мире, который движется всё быстрее, мы создаём пространство тишины, где важно каждое слово. Кадавер объединяет стихи на немецком, русском и английском — три языка, три культуры, один универсальный язык души.'
      },
      {
        title: 'Название',
        content: 'Кадавер — провокационное название для поэтического проекта. Как «Изысканный труп» сюрреалистов, здесь искусство рождается из неожиданного. Каждое стихотворение — фрагмент большего целого, каждый поэт вносит вклад в коллективное тело литературы.'
      },
      {
        title: 'Для поэтов',
        content: 'Кадавер открыт для всех, кто хочет поделиться своим голосом. Признанный автор или начинающий поэт — ваши слова найдут здесь дом. Присылайте свои стихи и станьте частью нашего растущего сообщества.'
      }
    ],
    quote: 'Поэзия — родной язык человеческого рода.',
    quoteAuthor: '— Иоганн Георг Гаман'
  }
}

export default function AboutPage({ params: { locale } }: AboutPageProps) {
  const [dictionary, setDictionary] = useState<any>(null)
  const pageContent = content[locale]

  useEffect(() => {
    import(`@/lib/translations/${locale}.json`).then((mod) => {
      setDictionary(mod.default)
    })
  }, [locale])

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

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-ink-black mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
          >
            {pageContent.title}
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
            {pageContent.subtitle}
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          ABOUT
        </div>
        <div className="absolute bottom-10 right-10 text-vertical-rl text-ink-black/10 font-serif text-6xl select-none hidden lg:block">
          О НАС
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-2xl font-serif text-ink-black leading-relaxed text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {pageContent.intro}
          </motion.p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-6 bg-ink-black/5">
        <div className="max-w-4xl mx-auto space-y-16">
          {pageContent.sections.map((section, index) => (
            <motion.div
              key={section.title}
              className="brutalist-border bg-paper p-8 md:p-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h2 className="text-3xl font-serif font-bold text-ink-black mb-6">
                {section.title}
              </h2>
              <p className="text-lg text-ink-black/80 font-sans leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="absolute -top-8 left-0 text-8xl text-blood-red/20 font-serif">"</span>
            <p className="text-3xl md:text-4xl font-serif italic text-ink-black mb-6 relative z-10">
              {pageContent.quote}
            </p>
            <cite className="text-lg text-ink-black/60 font-sans not-italic">
              {pageContent.quoteAuthor}
            </cite>
          </motion.blockquote>
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
