'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Chapter {
    id: string
    title: string
    content: string
}

interface ChapterEditorProps {
    chapters: Chapter[]
    onChange: (chapters: Chapter[]) => void
    locale: string
}

export default function ChapterEditor({ chapters, onChange, locale }: ChapterEditorProps) {
    const [activeChapterIndex, setActiveChapterIndex] = useState(0)

    const addChapter = () => {
        const newChapter = {
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            content: ''
        }
        const newChapters = [...chapters, newChapter]
        onChange(newChapters)
        setActiveChapterIndex(newChapters.length - 1)
    }

    const removeChapter = (index: number) => {
        if (chapters.length <= 1) return
        const newChapters = chapters.filter((_, i) => i !== index)
        onChange(newChapters)
        if (activeChapterIndex >= newChapters.length) {
            setActiveChapterIndex(newChapters.length - 1)
        }
    }

    const updateChapter = (index: number, field: 'title' | 'content', value: string) => {
        const newChapters = [...chapters]
        newChapters[index] = { ...newChapters[index], [field]: value }
        onChange(newChapters)
    }

    const activeChapter = chapters[activeChapterIndex]

    return (
        <div className="brutalist-border bg-paper p-6 relative">
            <div className="absolute top-0 right-0 p-2 text-xs font-mono text-ink-black/40 uppercase">
                {locale === 'de' ? 'Kapitel Editor' : locale === 'ru' ? 'Редактор глав' : 'Chapter Editor'}
            </div>

            <div className="flex mb-6 border-b border-ink-black/10 pb-4 overflow-x-auto custom-scrollbar">
                {chapters.map((chapter, index) => (
                    <button
                        key={chapter.id}
                        type="button"
                        onClick={() => setActiveChapterIndex(index)}
                        className={`
              flex items-center px-4 py-2 mr-2 text-sm font-sans transition-colors whitespace-nowrap
              ${index === activeChapterIndex
                                ? 'bg-ink-black text-paper font-bold'
                                : 'bg-ink-black/5 text-ink-black hover:bg-ink-black/10'}
            `}
                    >
                        <span>{index + 1}. {chapter.title || (locale === 'de' ? 'Unbenannt' : 'Untitled')}</span>
                        {chapters.length > 1 && (
                            <span
                                onClick={(e) => { e.stopPropagation(); removeChapter(index); }}
                                className="ml-2 opacity-50 hover:opacity-100 hover:text-blood-red"
                            >
                                ×
                            </span>
                        )}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={addChapter}
                    className="px-4 py-2 bg-blood-red/10 text-blood-red hover:bg-blood-red hover:text-paper transition-colors text-sm font-bold"
                >
                    +
                </button>
            </div>

            {activeChapter && (
                <motion.div
                    key={activeChapter.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                >
                    <div>
                        <input
                            type="text"
                            value={activeChapter.title}
                            onChange={(e) => updateChapter(activeChapterIndex, 'title', e.target.value)}
                            placeholder={locale === 'de' ? 'Kapitel Titel' : locale === 'ru' ? 'Название главы' : 'Chapter Title'}
                            className="w-full px-4 py-2 bg-transparent border-b border-ink-black/20 focus:border-blood-red outline-none font-serif text-xl"
                        />
                    </div>
                    <div>
                        <textarea
                            value={activeChapter.content}
                            onChange={(e) => updateChapter(activeChapterIndex, 'content', e.target.value)}
                            placeholder={locale === 'de' ? 'Kapitel Inhalt...' : locale === 'ru' ? 'Содержание главы...' : 'Chapter Content...'}
                            rows={12}
                            className="w-full px-4 py-3 bg-paper/50 brutalist-border focus:shadow-none outline-none transition-all font-serif text-ink-black resize-none"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    )
}
