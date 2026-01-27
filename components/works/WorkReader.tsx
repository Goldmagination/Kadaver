'use client'

import { useState } from 'react'
import WorkRenderer from './WorkRenderer'
import ChapterNavigation from './ChapterNavigation'
import type { RenderingConfig } from '@/lib/types/rendering'

interface Chapter {
    id: string
    order: number
    title: string | null
    content: string
}

interface WorkReaderProps {
    work: {
        id: string
        title: string
        content: string | null
        type: 'POEM' | 'TALE' | 'NOVEL'
        renderingConfig: RenderingConfig | unknown
        chapters: Chapter[]
    }
    locale: string
}

export default function WorkReader({ work, locale }: WorkReaderProps) {
    const [activeChapterIndex, setActiveChapterIndex] = useState(0)

    // If it's a novel with chapters, use chapter content
    const isNovel = work.type === 'NOVEL' && work.chapters.length > 0

    const contentToRender = isNovel
        ? work.chapters[activeChapterIndex].content
        : work.content

    return (
        <div className="max-w-3xl mx-auto">
            {isNovel && (
                <ChapterNavigation
                    chapters={work.chapters}
                    activeChapterIndex={activeChapterIndex}
                    onChapterSelect={setActiveChapterIndex}
                    locale={locale}
                />
            )}

            <article className="brutalist-border bg-paper p-8 md:p-12 relative min-h-[50vh]">
                <div className="absolute top-0 left-0 w-full h-1 bg-ink-black/5" />

                {isNovel && (
                    <div className="mb-8 text-center">
                        <h2 className="font-serif text-2xl font-bold text-ink-black">
                            {work.chapters[activeChapterIndex].title || `Chapter ${work.chapters[activeChapterIndex].order}`}
                        </h2>
                        <div className="w-10 h-0.5 bg-blood-red mx-auto mt-4" />
                    </div>
                )}

                <WorkRenderer
                    content={contentToRender}
                    config={work.renderingConfig as any}
                    type={work.type}
                />

                {(!contentToRender) && (
                    <span className="italic text-ink-black/50 block text-center">
                        {locale === 'de' ? 'Inhalt wird geladen...' :
                            locale === 'ru' ? 'Контент загружается...' :
                                'Content loading...'}
                    </span>
                )}

                {isNovel && (
                    <div className="mt-12 pt-8 border-t border-ink-black/10 flex justify-between items-center text-sm font-mono text-ink-black/40">
                        <span>{activeChapterIndex + 1} / {work.chapters.length}</span>
                        {activeChapterIndex < work.chapters.length - 1 && (
                            <button
                                onClick={() => {
                                    setActiveChapterIndex(activeChapterIndex + 1)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className="hover:text-blood-red transition-colors"
                            >
                                {locale === 'de' ? 'Nächstes Kapitel' : 'Next Chapter'} →
                            </button>
                        )}
                    </div>
                )}
            </article>
        </div>
    )
}
