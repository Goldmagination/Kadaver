'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import { languageNames } from '@/i18n.config'

interface NavigationProps {
  locale: Locale
  dictionary: any
}

export default function Navigation({ locale, dictionary }: NavigationProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: `/${locale}`, label: dictionary.navigation.home },
    { href: `/${locale}/poems`, label: dictionary.navigation.poems },
    { href: `/${locale}/poets`, label: dictionary.navigation.poets },
    { href: `/${locale}/about`, label: dictionary.navigation.about },
    { href: `/${locale}/submit`, label: dictionary.navigation.submit },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-paper/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href={`/${locale}`}>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h1 className="text-2xl font-serif font-bold text-ink-black">
                  {dictionary.common.title}
                </h1>
                <span className="text-blood-red text-xl">|</span>
                <span className="text-sm text-ink-black/70 font-sans">
                  {dictionary.common.subtitle}
                </span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-blood-red ${
                      pathname === item.href ? 'text-blood-red' : 'text-ink-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="relative">
                <select
                  value={locale}
                  onChange={(e) => {
                    const newLocale = e.target.value
                    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
                    window.location.href = newPath
                  }}
                  className="appearance-none bg-transparent border border-ink-black/20 rounded px-3 py-1 text-sm pr-8 focus:outline-none focus:border-blood-red cursor-pointer"
                >
                  {Object.entries(languageNames).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-6 h-6 flex flex-col justify-center space-y-1"
            >
              <motion.span
                className="block w-6 h-0.5 bg-ink-black"
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ink-black"
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ink-black"
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-blood-red z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-paper z-40 md:hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-serif hover:text-blood-red transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}