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
    subtitle: 'Eine literarische Gesellschaft',
    intro: 'Kadaver ist ein lebendiges Archiv der Literatur — ein Ort, an dem Worte zur Ruhe gebettet werden.',
    sections: [
      {
        title: 'Unsere Mission',
        content: 'Ideen sind leblose Überreste. Worte sind der Sarg. In einer Welt, in der das Originelle nur entsteht, um vergessen zu werden, muss es einen Ort geben, an dem Ideen zur Ruhe kommen. Unsere Mission ist es, ein freies, zugängliches, vielsprachiges Archiv für alle bereitzustellen, die das Schreiben lieben. Hinterlasse deine Werke bei uns und kehre jederzeit zurück, um sie zu besuchen. Entdecke die Werke anderer Schaffender — talentiert und weniger talentiert. Spielt das am Ende eine Rolle? Es ist alles nur ein Experiment.'
      },
      {
        title: 'Der Name',
        content: 'Kadaver ist die deutsche Schreibweise des Wortes für eine Leiche — insbesondere eine, die zur Sektion bestimmt ist. Die Idee entstand in Hamburg als Antwort auf eine erschüternde Tatsache: Die meisten Dichter, Verleger, Literaturzeitschriften und Gesellschaften sind tot. Wir leben in einer Welt, in der tiefe Gedanken, unbequeme Ideen und experimentelle Ansätze von der Kultur des Massenkonsums begraben werden. Ja, wir wissen es. Dennoch muss es jemanden geben, der Gräber ausgräbt, die niemand besucht, Homilien hält, denen niemand beiwohnt, und armselige Leichenschmäuse ausrichtet, bei denen der Verstorbene nicht einmal erwähnt wird.'
      },
      {
        title: 'Für Autoren',
        content: 'Kadaver steht allen offen, die ihre Werke teilen möchten. Keine vorgegebenen Themen, keine Algorithmen und keine Zensur — wir versuchen, das rohste Leseerlebnis zu bieten, das es gibt. Du kannst ein etablierter Schriftsteller sein, ein aufstrebendes Talent oder ein kompletter Versager — was kümmert uns das? Wir haben nur eine (schwindende) Hoffnung: Wenn sich genug Autoren in einer stechenden und brodelnden Suppe aus Worten und Ideen zusammenfinden, gibt es vielleicht — nur vielleicht — genug Material, das wir drucken und veröffentlichen können.'
      }
    ],
    quote: 'block block block ich bin Schriftsteller Blok.',
    quoteAuthor: '— Dmitry Korolyov'
  },
  en: {
    title: 'About Kadaver',
    subtitle: 'A Literary Society',
    intro: 'Kadaver is a living archive of literature, a place where words are put to rest.',
    sections: [
      {
        title: 'Our Mission',
        content: 'Ideas are lifeless remains. Words are the casket. In a world where originality is born only to be forgotten, there must be a place where ideas come to rest. Our mission is to provide a free, accessible, all-language archive for those who love writing. Leave your works with us and return whenever you wish to visit them. Discover the works of other creators — talented and not so talented alike. Does it matter, in the end? It is all just an experiment.'
      },
      {
        title: 'The Name',
        content: 'Kadaver is the German spelling of the word cadaver — a dead body, especially one intended for dissection. The idea was born in Hamburg, Germany, as a response to an appalling fact: most poets, publishers, literary magazines and societies are dead. We live in a world where deep thoughts, uncomfortable ideas and experimental approaches are buried by the culture of mass consumerism. Hell, we get it. Still, there must be someone to dig up the graves that no one visits, to deliver homilies that no one attends, and to organise poor repasts where no one will even mention the deceased.'
      },
      {
        title: 'For Authors',
        content: 'Kadaver is open to all who wish to share their works. No preselected topics, no algorithms and no censorship — we try to provide the rawest reading experience there is. You can be an established writer, an emerging talent, or a complete failure — what do we care? We have but one (dwindling) hope: if enough authors come together in a pungent and bubbling soup of words and ideas, maybe — just maybe — there will be enough material to print and publish.'
      }
    ],
    quote: 'block block block I am writer Blok.',
    quoteAuthor: '— Dmitry Korolyov'
  },
  ru: {
    title: 'О Кадавере',
    subtitle: 'Литературное общество',
    intro: 'Кадавер — это живой архив литературы, место, где слова обретают вечный покой.',
    sections: [
      {
        title: 'Наша миссия',
        content: 'Идеи — это безжизненные останки. Слова — это гроб. В мире, где оригинальное рождается лишь для того, чтобы быть забытым, должно существовать место, где идеи могут упокоиться. Наша миссия — предоставить свободный, доступный, многоязычный архив для всех, кто любит писать. Оставьте свои работы у нас и возвращайтесь в любое время, чтобы навестить их. Открывайте произведения других авторов — талантливых и не очень. Имеет ли это значение в конце концов? Всё это лишь эксперимент.'
      },
      {
        title: 'Название',
        content: 'Кадавер — немецкое написание слова «кадавр», труп, особенно предназначенный для вскрытия. Идея родилась в Гамбурге как ответ на удручающий факт: большинство поэтов, издателей, литературных журналов и обществ мертвы. Мы живём в мире, где глубокие мысли, неудобные идеи и экспериментальные подходы погребаются под культурой массового потребления. Что ж, мы это понимаем. Тем не менее должен найтись тот, кто раскопает могилы, которые никто не навещает, произносит надгробные речи, которые никто не придёт услышать, и устроит скромные поминки, где усопшего никто даже не вспомнит.'
      },
      {
        title: 'Для авторов',
        content: 'Кадавер открыт для всех, кто хочет поделиться своими работами. Никаких заранее заданных тем, никаких алгоритмов и никакой цензуры — мы стараемся дать самый нефильтрованный читательский опыт из возможных. Вы можете быть состоявшимся писателем, восходящим талантом или полным неудачником — нам всё равно. У нас есть лишь одна (угасающая) надежда: если достаточно авторов соберётся в едкий и булькающий бульон из слов и идей, возможно — только возможно — материала хватит, чтобы напечатать и издать.'
      }
    ],
    quote: 'Блок-блок-блок-блок-блок. Я писатель Блок.',
    quoteAuthor: '— Дмитрий Королёв'
  },
  uk: {
    title: 'Про Кадавер',
    subtitle: 'Літературне товариство',
    intro: 'Кадавер — це живий архів літератури, місце, де слова знаходять вічний спокій.',
    sections: [
      {
        title: 'Наша місія',
        content: 'Ідеї — це безжиттєві останки. Слова — це домовина. У світі, де оригінальне народжується лише для того, щоб бути забутим, повинно існувати місце, де ідеї можуть упокоїтися. Наша місія — надати вільний, доступний, багатомовний архів для всіх, хто любить писати. Залишайте свої твори у нас і повертайтеся будь-коли, щоб їх відвідати. Відкривайте твори інших авторів — талановитих і не дуже. Чи має це значення зрештою? Все це лише експеримент.'
      },
      {
        title: 'Назва',
        content: 'Кадавер — це німецьке написання слова «кадавр», мрець, особливо той, що призначений для розтину. Ідея народилася в Гамбурзі як відповідь на жахливий факт: більшість поетів, видавців, літературних журналів і товариств мертві. Ми живемо у світі, де глибокі думки, незручні ідеї та експериментальні підходи поховані культурою масового споживання. Що ж, ми це розуміємо. Проте мусить знайтися хтось, хто розкопує могили, яких ніхто не відвідує, виголошує надгробні промови, яких ніхто не чує, і влаштовує скромні поминки, де небіжчика навіть не згадають.'
      },
      {
        title: 'Для авторів',
        content: 'Кадавер відкритий для всіх, хто бажає поділитися своїми творами. Жодних наперед заданих тем, жодних алгоритмів і жодної цензури — ми прагнемо забезпечити найбільш неопосередкований читацький досвід з усіх можливих. Ви можете бути визнаним письменником, талантом-початківцем чи повним невдахою — нам байдуже. У нас є лише одна (зменшувана) надія: якщо достатньо авторів зібреться в їдкому і киплячому бульйоні зі слів та ідей, можливо — тільки можливо — матеріалу вистачить, щоб його надрукувати та видати.'
      }
    ],
    quote: 'Блок-блок-блок-блок-блок. Я письменник Блок.',
    quoteAuthor: '— Дмитро Корольов'
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
