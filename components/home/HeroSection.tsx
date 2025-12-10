'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  dictionary: any
}

export default function HeroSection({ dictionary }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current
      const subtitle = subtitleRef.current

      if (title) {
        const chars = title.textContent?.split('') || []
        title.innerHTML = ''
        chars.forEach(char => {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00A0' : char
          span.className = 'inline-block'
          title.appendChild(span)
        })

        gsap.fromTo(
          title.children,
          {
            y: 100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.03,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2,
          }
        )
      }

      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 1, ease: 'power2.out' }
        )
      }

      gsap.fromTo(
        '.hero-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 1.3, ease: 'power2.out' }
      )

      gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y, scale }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />
      
      <motion.div 
        className="absolute inset-0 opacity-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-[url('/textures/paper.png')] bg-repeat" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div style={{ opacity }}>
          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-ink-black mb-6 tracking-tight perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {dictionary.homepage.hero.title}
          </h1>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-ink-black/80 mb-12 font-sans font-light"
          >
            {dictionary.homepage.hero.subtitle}
          </p>

          <motion.button
            className="hero-cta brutalist-border bg-paper px-8 py-4 text-ink-black font-medium hover:bg-ink-black hover:text-paper transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{dictionary.homepage.hero.cta}</span>
            <motion.span
              className="absolute inset-0 bg-blood-red"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.button>

          <div className="absolute left-1/2 bottom-10 -translate-x-1/2">
            <motion.div
              className="scroll-indicator flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <span className="text-sm text-ink-black/50 mb-2">
                {dictionary.homepage.hero.scroll}
              </span>
              <svg
                className="w-6 h-6 text-ink-black/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-20 left-10 text-vertical-rl text-ink-black/20 font-serif text-6xl select-none">
        KADAVER
      </div>
      <div className="absolute bottom-20 right-10 text-vertical-rl text-ink-black/20 font-serif text-6xl select-none">
        POESIE
      </div>
    </motion.section>
  )
}