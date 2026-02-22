'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Tag {
    slug: string
    nameEn: string
    nameDe: string
    nameRu: string
}

interface TagInputProps {
    value: string          // comma-separated raw string stored in form state
    onChange: (value: string) => void
    locale: string
    placeholder?: string
}

export default function TagInput({ value, onChange, locale, placeholder }: TagInputProps) {
    const [allTags, setAllTags] = useState<Tag[]>([])
    const [inputText, setInputText] = useState('')
    const [suggestions, setSuggestions] = useState<Tag[]>([])
    const [open, setOpen] = useState(false)
    const [activeIdx, setActiveIdx] = useState(-1)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // The tags already committed (chips)
    const committed = value
        ? value.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    // Fetch all tags once on mount
    useEffect(() => {
        fetch('/api/tags')
            .then((r) => r.json())
            .then((d) => setAllTags(d.tags || []))
            .catch(() => { })
    }, [])

    // Recompute suggestions whenever input or committed tags change
    useEffect(() => {
        const q = inputText.trim().toLowerCase()
        if (!q) {
            setSuggestions([])
            setOpen(false)
            return
        }
        const filtered = allTags.filter((t) => {
            const alreadyAdded = committed.some(
                (c) => c.toLowerCase() === t.slug.toLowerCase() ||
                    c.toLowerCase() === t.nameEn.toLowerCase() ||
                    c.toLowerCase() === t.nameDe.toLowerCase() ||
                    c.toLowerCase() === t.nameRu.toLowerCase()
            )
            return !alreadyAdded && (
                t.slug.includes(q) ||
                t.nameEn.toLowerCase().includes(q) ||
                t.nameDe.toLowerCase().includes(q) ||
                t.nameRu.toLowerCase().includes(q)
            )
        })
        setSuggestions(filtered)
        setOpen(filtered.length > 0)
        setActiveIdx(-1)
    }, [inputText, value, allTags])

    // Close dropdown on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])

    const getTagLabel = useCallback((tag: Tag) => {
        if (locale === 'de') return tag.nameDe
        if (locale === 'ru') return tag.nameRu
        return tag.nameEn
    }, [locale])

    const commitTag = useCallback((raw: string) => {
        const trimmed = raw.trim().toLowerCase()
        if (!trimmed) return
        // Deduplicate — check existing committed tags
        const alreadyExists = committed.some((c) => c.toLowerCase() === trimmed)
        if (alreadyExists) {
            setInputText('')
            return
        }
        // Check if it matches a known tag slug; if so use the slug
        const match = allTags.find(
            (t) =>
                t.slug.toLowerCase() === trimmed ||
                t.nameEn.toLowerCase() === trimmed ||
                t.nameDe.toLowerCase() === trimmed ||
                t.nameRu.toLowerCase() === trimmed
        )
        const finalSlug = match ? match.slug : trimmed
        const newCommitted = [...committed, finalSlug]
        onChange(newCommitted.join(', '))
        setInputText('')
        setOpen(false)
    }, [committed, allTags, onChange])

    const removeTag = (tag: string) => {
        const newCommitted = committed.filter((c) => c !== tag)
        onChange(newCommitted.join(', '))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIdx((i) => Math.max(i - 1, -1))
        } else if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            if (activeIdx >= 0 && suggestions[activeIdx]) {
                commitTag(suggestions[activeIdx].slug)
            } else if (inputText.trim()) {
                commitTag(inputText)
            }
        } else if (e.key === 'Backspace' && !inputText && committed.length > 0) {
            removeTag(committed[committed.length - 1])
        } else if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    return (
        <div ref={wrapperRef} className="relative">
            {/* Chips + input row */}
            <div className="flex flex-wrap gap-2 min-h-[48px] px-3 py-2 border-b-2 border-ink-black/30 focus-within:border-blood-red transition-colors">
                {committed.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-ink-black text-paper text-xs font-mono"
                    >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-paper/60 hover:text-blood-red transition-colors leading-none"
                            aria-label={`Remove ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => inputText.trim() && setOpen(suggestions.length > 0)}
                    className="flex-1 min-w-[120px] bg-transparent outline-none font-sans text-ink-black text-sm placeholder:text-ink-black/30"
                    placeholder={committed.length === 0 ? (placeholder ?? 'love, nature, time') : ''}
                    aria-label="Add tag"
                    aria-autocomplete="list"
                    aria-expanded={open}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <ul className="absolute z-50 top-full left-0 right-0 bg-paper border border-ink-black/20 shadow-md max-h-48 overflow-y-auto">
                    {suggestions.map((tag, idx) => (
                        <li
                            key={tag.slug}
                            className={`px-4 py-2 cursor-pointer text-sm font-sans flex justify-between items-center transition-colors ${idx === activeIdx
                                    ? 'bg-ink-black text-paper'
                                    : 'hover:bg-ink-black/5 text-ink-black'
                                }`}
                            onMouseDown={(e) => {
                                e.preventDefault() // prevent blur before click
                                commitTag(tag.slug)
                            }}
                            onMouseEnter={() => setActiveIdx(idx)}
                        >
                            <span>#{tag.slug}</span>
                            <span className="text-ink-black/40 text-xs">{getTagLabel(tag)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Hidden real input so the form still has a "tags" field */}
            <input type="hidden" name="tags" value={value} />

            <p className="text-xs text-ink-black/30 mt-1 font-mono">
                {locale === 'de'
                    ? 'Enter oder Komma zum Bestätigen · ← zum Löschen'
                    : locale === 'ru'
                        ? 'Enter или запятая для добавления · ← для удаления'
                        : locale === 'uk'
                            ? 'Enter або кома для додавання · ← для видалення'
                            : 'Enter or comma to add · ← to remove'}
            </p>
        </div>
    )
}
