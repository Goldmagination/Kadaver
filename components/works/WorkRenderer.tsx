'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RenderingConfig, defaultConfig } from '@/lib/types/rendering'
import { cn } from '@/lib/utils'

interface WorkRendererProps {
    content: string | null
    config?: RenderingConfig | null
    type?: 'POEM' | 'TALE' | 'NOVEL'
    className?: string
}

export default function WorkRenderer({
    content,
    config,
    type = 'POEM',
    className
}: WorkRendererProps) {
    if (!content) return null

    // Merge default config with provided config
    // Note: We need to handle the case where config comes from Prisma Json, which might be any
    const settings: RenderingConfig = {
        ...defaultConfig,
        ...(config as RenderingConfig || {})
    }

    // Resolving CSS classes based on settings
    const fontClass = {
        'playfair': 'font-serif',
        'inter': 'font-sans',
        'jetbrains': 'font-mono',
        'fraktur': 'font-fraktur', // Assuming we might add this custom font later
    }[settings.fontFamily || 'playfair']

    const alignClass = {
        'left': 'text-left',
        'center': 'text-center',
        'justify': 'text-justify',
        'right': 'text-right',
    }[settings.textAlign || 'left']

    const sizeClass = {
        'sm': 'text-base',
        'base': 'text-lg',
        'lg': 'text-xl md:text-2xl',
        'xl': 'text-2xl md:text-3xl',
    }[settings.fontSize || 'lg']

    const leadingClass = {
        'tight': 'leading-tight',
        'normal': 'leading-normal',
        'relaxed': 'leading-relaxed',
        'loose': 'leading-loose',
    }[settings.lineHeight || 'relaxed']

    const trackingClass = {
        'tight': 'tracking-tight',
        'normal': 'tracking-normal',
        'relaxed': 'tracking-wide',
        'loose': 'tracking-widest',
    }[settings.letterSpacing || 'normal']

    const paragraphSpacingClass = {
        'tight': 'mb-2',
        'normal': 'mb-4',
        'relaxed': 'mb-6',
        'loose': 'mb-8',
    }[settings.paragraphSpacing || 'normal']

    // Content parsing:
    // For Poems: Preserve line breaks.
    // For Prose (Tale/Novel): Treat double newlines as paragraphs.
    const isPoem = type === 'POEM'

    const renderContent = () => {
        if (isPoem) {
            return (
                <pre className={cn(
                    "whitespace-pre-wrap overflow-x-auto",
                    fontClass,
                    alignClass,
                    sizeClass,
                    leadingClass,
                    trackingClass
                )}>
                    {content}
                </pre>
            )
        }

        // Prose processing
        const paragraphs = content.split(/\n\s*\n/).filter(Boolean)

        return (
            <div className={cn(
                fontClass,
                alignClass,
                sizeClass,
                leadingClass,
                trackingClass
            )}>
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className={cn(paragraphSpacingClass, "whitespace-pre-line", {
                        'first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left': settings.dropCap && index === 0
                    })}>
                        {paragraph.trim()}
                    </p>
                ))}
            </div>
        )
    }

    return (
        <div className={cn("w-full max-w-none text-ink-black", className)}>
            {renderContent()}
        </div>
    )
}
