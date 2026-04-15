'use client'

import { useEffect, useRef, useState } from 'react'

interface ViewCounterProps {
    slug: string
    initialCount: number
}

export default function ViewCounter({ slug, initialCount }: ViewCounterProps) {
    const [count, setCount] = useState(initialCount)
    const fired = useRef(false)

    useEffect(() => {
        if (fired.current) return
        fired.current = true

        // Client-side dedup: don't re-count views within the same session
        const storageKey = `kadaver_viewed_${slug}`
        try {
            if (sessionStorage.getItem(storageKey)) return
        } catch { /* sessionStorage may be unavailable */ }

        fetch(`/api/works/${slug}/view`, { method: 'PATCH' })
            .then((res) => res.json())
            .then((data) => {
                if (typeof data.viewCount === 'number') {
                    setCount(data.viewCount)
                }
                try { sessionStorage.setItem(storageKey, '1') } catch {}
            })
            .catch(() => {/* silently fail */ })
    }, [slug])

    return (
        <span
            className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-black/30 select-none tracking-widest"
            title="views"
            aria-label={`${count} views`}
        >
            {/* Minimal eye SVG */}
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            {count.toLocaleString()}
        </span>
    )
}
