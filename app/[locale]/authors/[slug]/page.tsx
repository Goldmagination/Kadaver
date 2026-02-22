import { getDictionary } from '@/lib/dictionary'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface AuthorPageProps {
    params: { locale: Locale; slug: string }
}

async function getAuthor(slug: string) {
    return prisma.author.findUnique({
        where: { slug },
        include: {
            works: {
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    language: true,
                    type: true,
                    excerpt: true,
                    content: true,
                    tags: { include: { tag: true } },
                },
            },
        },
    })
}

export default async function AuthorPage({ params: { locale, slug } }: AuthorPageProps) {
    const [dictionary, author] = await Promise.all([
        getDictionary(locale),
        getAuthor(slug),
    ])

    if (!author) notFound()

    const bio =
        locale === 'de' ? author.bioDe :
            locale === 'ru' ? author.bioRu :
                author.bioEn ?? author.bio

    const yearsLabel = author.birthYear
        ? `${author.birthYear}${author.deathYear ? ` — ${author.deathYear}` : ' —'}`
        : null

    const typeLabel: Record<string, Record<string, string>> = {
        POEM: { en: 'Poem', de: 'Gedicht', ru: 'Стихотворение', uk: 'Вірш' },
        TALE: { en: 'Tale', de: 'Erzählung', ru: 'Рассказ', uk: 'Оповідь' },
        NOVEL: { en: 'Novel', de: 'Roman', ru: 'Роман', uk: 'Роман' },
    }

    return (
        <main className="min-h-screen">
            <Navigation locale={locale} dictionary={dictionary} />

            {/* Header */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <Link
                        href={`/${locale}/authors`}
                        className="inline-flex items-center text-sm font-mono text-ink-black/50 hover:text-blood-red transition-colors mb-8"
                    >
                        ← {locale === 'de' ? 'Alle Autoren' : locale === 'ru' ? 'Все авторы' : locale === 'uk' ? 'Усі автори' : 'All Authors'}
                    </Link>

                    <div className="flex items-start gap-8">
                        {/* Portrait placeholder / image */}
                        {author.portraitUrl ? (
                            <img
                                src={author.portraitUrl}
                                alt={author.name}
                                className="w-32 h-32 object-cover brutalist-border flex-shrink-0"
                            />
                        ) : (
                            <div className="w-32 h-32 brutalist-border bg-ink-black/5 flex items-center justify-center flex-shrink-0">
                                <span className="font-serif text-4xl font-bold text-ink-black/20">
                                    {author.name.charAt(0)}
                                </span>
                            </div>
                        )}

                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-ink-black mb-2">
                                {author.name}
                            </h1>
                            {author.nameOriginal && author.nameOriginal !== author.name && (
                                <p className="text-2xl font-serif text-ink-black/50 mb-2">{author.nameOriginal}</p>
                            )}
                            {yearsLabel && (
                                <p className="text-sm font-mono text-ink-black/40 mb-4">{yearsLabel}</p>
                            )}
                            {author.nationality && (
                                <p className="text-sm font-sans text-ink-black/50">{author.nationality}</p>
                            )}
                        </div>
                    </div>

                    {bio && (
                        <div className="mt-10 w-20 h-1 bg-blood-red mb-8" />
                    )}
                    {bio && (
                        <p className="text-lg font-sans text-ink-black/80 leading-relaxed max-w-2xl whitespace-pre-line">
                            {bio}
                        </p>
                    )}

                    {/* External links */}
                    {(author.wikipediaUrl || author.websiteUrl) && (
                        <div className="flex gap-4 mt-6">
                            {author.wikipediaUrl && (
                                <a
                                    href={author.wikipediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-mono text-ink-black/40 hover:text-blood-red transition-colors"
                                >
                                    Wikipedia →
                                </a>
                            )}
                            {author.websiteUrl && (
                                <a
                                    href={author.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-mono text-ink-black/40 hover:text-blood-red transition-colors"
                                >
                                    {locale === 'de' ? 'Webseite' : locale === 'ru' ? 'Сайт' : locale === 'uk' ? 'Сайт' : 'Website'} →
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Works */}
            {author.works.length > 0 && (
                <section className="py-16 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-serif font-bold text-ink-black mb-10">
                            {locale === 'de' ? 'Werke' : locale === 'ru' ? 'Произведения' : locale === 'uk' ? 'Твори' : 'Works'}
                        </h2>

                        <div className="space-y-6">
                            {author.works.map((work) => (
                                <Link key={work.id} href={`/${locale}/works/${work.slug}`}>
                                    <article className="group brutalist-border p-6 bg-paper hover:bg-gold-leaf/5 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-serif font-bold text-ink-black group-hover:text-blood-red transition-colors">
                                                {work.title}
                                            </h3>
                                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                                <span className="text-xs font-mono text-ink-black/40 uppercase">{work.language}</span>
                                                <span className="text-xs font-mono text-ink-black/30">
                                                    {typeLabel[work.type]?.[locale] ?? work.type}
                                                </span>
                                            </div>
                                        </div>

                                        {(work.excerpt || work.content) && (
                                            <p className="text-sm font-serif text-ink-black/60 leading-relaxed line-clamp-3">
                                                {(work.excerpt || work.content || '').substring(0, 180)}…
                                            </p>
                                        )}

                                        {work.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {work.tags.map((t) => (
                                                    <span key={t.tag.slug} className="text-xs font-mono text-ink-black/30">
                                                        #{t.tag.slug}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer dictionary={dictionary} />
        </main>
    )
}
