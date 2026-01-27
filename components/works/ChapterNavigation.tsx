'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Chapter {
    id: string
    order: number
    title: string | null
}

interface ChapterNavigationProps {
    chapters: Chapter[]
    activeChapterIndex: number
    onChapterSelect: (index: number) => void
    locale: string
}

export default function ChapterNavigation({
    chapters,
    activeChapterIndex,
    onChapterSelect,
    locale
}: ChapterNavigationProps) {
    const [isOpen, setIsOpen] = useState(false)
    const activeChapter = chapters[activeChapterIndex]

    if (!chapters || chapters.length === 0) return null

    return (
        <div className="mb-12 sticky top-24 z-30">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-paper border-2 border-ink-black/10 hover:border-blood-red/50 transition-colors p-4 flex items-center justify-between group"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-mono text-ink-black/40 uppercase mb-1">
                            {locale === 'de' ? 'Kapitel' : locale === 'ru' ? 'Глава' : 'Chapter'} {activeChapter?.order}
                        </span>
                        <span className="font-serif font-bold text-xl text-ink-black group-hover:text-blood-red transition-colors">
                            {activeChapter?.title || `Chapter ${activeChapter?.order}`}
                        </span>
                    </div>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="text-ink-black/40"
                    >
                        ▼
                    </motion.span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-paper border border-ink-black/10 shadow-xl overflow-hidden"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {chapters.map((chapter, index) => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => {
                                            onChapterSelect(index)
                                            setIsOpen(false)
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                        className={cn(
                                            "w-full text-left p-4 hover:bg-gold-leaf/10 transition-colors border-b border-ink-black/5 last:border-0 flex items-baseline",
                                            index === activeChapterIndex ? "bg-ink-black text-paper hover:bg-ink-black" : "text-ink-black"
                                        )}
                                    >
                                        <span className={cn(
                                            "font-mono text-xs mr-3",
                                            index === activeChapterIndex ? "text-paper/50" : "text-ink-black/40"
                                        )}>
                                            {chapter.order.toString().padStart(2, '0')}
                                        </span>
                                        <span className="font-serif font-medium">
                                            {chapter.title || `Chapter ${chapter.order}`}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => {
                        onChapterSelect(activeChapterIndex - 1)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={activeChapterIndex === 0}
                    className="text-sm font-mono text-ink-black/50 hover:text-blood-red disabled:opacity-20 disabled:hover:text-ink-black/50 transition-colors"
                >
                    ← {locale === 'de' ? 'Vorheriges' : locale === 'ru' ? 'Назад' : 'Previous'}
                </button>
                <button
                    onClick={() => {
                        onChapterSelect(activeChapterIndex + 1)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={activeChapterIndex === chapters.length - 1}
                    className="text-sm font-mono text-ink-black/50 hover:text-blood-red disabled:opacity-20 disabled:hover:text-ink-black/50 transition-colors"
                >
                    {locale === 'de' ? 'Nächstes' : locale === 'ru' ? 'Далее' : 'Next'} →
                </button>
            </div>
        </div>
    )
}
