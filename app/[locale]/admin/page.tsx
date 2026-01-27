'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import Navigation from '@/components/navigation/Navigation'
import Footer from '@/components/layout/Footer'
import { RenderingConfig, defaultConfig, poemDefaultConfig } from '@/lib/types/rendering'
import { cn } from '@/lib/utils'

// Only allow access on localhost
function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

interface Submission {
  id: string
  title: string
  content: string
  authorName: string
  language: string
  status: string
  type: string
  createdAt: string
  submitter: {
    email: string
  }
}

interface AdminPageProps {
  params: { locale: Locale }
}

export default function AdminPage({ params: { locale } }: AdminPageProps) {
  const [dictionary, setDictionary] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isAllowed, setIsAllowed] = useState(false)

  // Store rendering config for each submission being reviewed
  const [configs, setConfigs] = useState<Record<string, RenderingConfig>>({})

  useEffect(() => {
    // Check if running locally
    setIsAllowed(isLocalhost())

    import(`@/lib/translations/${locale}.json`).then((mod) => {
      setDictionary(mod.default)
    })

    if (isLocalhost()) {
      fetchSubmissions()
    } else {
      setLoading(false)
    }
  }, [locale])

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions')
      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (submissionId: string, action: 'approve' | 'reject') => {
    setActionLoading(submissionId)
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          action,
          // If action is approve, send the config
          renderingConfig: action === 'approve' ? (configs[submissionId] || undefined) : undefined
        }),
      })

      if (res.ok) {
        fetchSubmissions()
      } else {
        const data = await res.json()
        alert(data.error || 'Action failed')
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (!dictionary) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-ink-black/50 font-serif text-xl">Loading...</div>
      </main>
    )
  }

  if (!isAllowed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-blood-red mb-4">Access Denied</h1>
          <p className="text-ink-black/70">Admin panel is only available on localhost.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation locale={locale} dictionary={dictionary} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper/90" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold text-ink-black mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
          >
            Admin Panel
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
            Review and publish work submissions
          </motion.p>
        </div>
      </section>

      {/* Submissions Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-ink-black mb-8">
            Pending Submissions ({submissions.filter(s => s.status === 'PENDING').length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-ink-black/50 font-serif text-xl">Loading submissions...</div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 brutalist-border bg-paper p-8">
              <p className="text-ink-black/60 font-serif text-xl italic">
                No submissions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {submissions.map((submission) => (
                <motion.article
                  key={submission.id}
                  className="brutalist-border bg-paper p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-ink-black">
                        {submission.title}
                      </h3>
                      <p className="text-sm text-ink-black/60 mt-1">
                        by {submission.authorName} • {submission.language.toUpperCase()} • {submission.submitter?.email} <span className="ml-2 font-mono text-blood-red">[{submission.type}]</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-mono uppercase ${submission.status === 'PENDING' ? 'bg-gold-leaf/20 text-ink-black' :
                      submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-blood-red/20 text-blood-red'
                      }`}>
                      {submission.status}
                    </span>
                  </div>

                  <pre className="font-serif text-ink-black/80 whitespace-pre-wrap mb-6 p-4 bg-ink-black/5 rounded">
                    {submission.content || '[Content rendering pending]'}
                  </pre>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-black/50">
                      Submitted: {new Date(submission.createdAt).toLocaleString()}
                    </span>

                    {submission.status === 'PENDING' && (
                      <div className="mt-6 border-t border-ink-black/10 pt-4">
                        <details className="group/details mb-4">
                          <summary className="cursor-pointer text-sm font-bold text-ink-black/70 hover:text-blood-red transition-colors flex items-center select-none">
                            <span className="mr-2">Typesetter Settings</span>
                            <span className="text-xs text-ink-black/40 group-open/details:rotate-180 transition-transform">▼</span>
                          </summary>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 p-4 bg-paper border border-ink-black/10">
                            {/* Font Family */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-ink-black/50 uppercase">Font</label>
                              <select
                                className="w-full bg-transparent border-b border-ink-black/20 text-sm font-sans focus:border-blood-red outline-none"
                                value={configs[submission.id]?.fontFamily || defaultConfig.fontFamily}
                                onChange={(e) => setConfigs({
                                  ...configs,
                                  [submission.id]: { ...(configs[submission.id] || (submission.type === 'POEM' ? poemDefaultConfig : defaultConfig)), fontFamily: e.target.value as any }
                                })}
                              >
                                <option value="playfair">Playfair Display</option>
                                <option value="inter">Inter (Sans)</option>
                                <option value="jetbrains">JetBrains (Mono)</option>
                              </select>
                            </div>

                            {/* Text Align */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-ink-black/50 uppercase">Align</label>
                              <select
                                className="w-full bg-transparent border-b border-ink-black/20 text-sm font-sans focus:border-blood-red outline-none"
                                value={configs[submission.id]?.textAlign || (submission.type === 'POEM' ? 'center' : 'left')}
                                onChange={(e) => setConfigs({
                                  ...configs,
                                  [submission.id]: { ...(configs[submission.id] || (submission.type === 'POEM' ? poemDefaultConfig : defaultConfig)), textAlign: e.target.value as any }
                                })}
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="justify">Justify</option>
                                <option value="right">Right</option>
                              </select>
                            </div>

                            {/* Font Size */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-ink-black/50 uppercase">Size</label>
                              <select
                                className="w-full bg-transparent border-b border-ink-black/20 text-sm font-sans focus:border-blood-red outline-none"
                                value={configs[submission.id]?.fontSize || defaultConfig.fontSize}
                                onChange={(e) => setConfigs({
                                  ...configs,
                                  [submission.id]: { ...(configs[submission.id] || (submission.type === 'POEM' ? poemDefaultConfig : defaultConfig)), fontSize: e.target.value as any }
                                })}
                              >
                                <option value="sm">Small</option>
                                <option value="base">Base</option>
                                <option value="lg">Large</option>
                                <option value="xl">Extra Large</option>
                              </select>
                            </div>

                            {/* Line Height */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono text-ink-black/50 uppercase">Leading</label>
                              <select
                                className="w-full bg-transparent border-b border-ink-black/20 text-sm font-sans focus:border-blood-red outline-none"
                                value={configs[submission.id]?.lineHeight || defaultConfig.lineHeight}
                                onChange={(e) => setConfigs({
                                  ...configs,
                                  [submission.id]: { ...(configs[submission.id] || (submission.type === 'POEM' ? poemDefaultConfig : defaultConfig)), lineHeight: e.target.value as any }
                                })}
                              >
                                <option value="tight">Tight</option>
                                <option value="normal">Normal</option>
                                <option value="relaxed">Relaxed</option>
                                <option value="loose">Loose</option>
                              </select>
                            </div>
                          </div>
                        </details>

                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => handleAction(submission.id, 'reject')}
                            disabled={actionLoading === submission.id}
                            className="px-4 py-2 border-2 border-blood-red text-blood-red hover:bg-blood-red hover:text-paper transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAction(submission.id, 'approve')}
                            disabled={actionLoading === submission.id}
                            className="px-4 py-2 bg-ink-black text-paper hover:bg-green-700 transition-colors disabled:opacity-50 font-bold"
                          >
                            {actionLoading === submission.id ? 'Publishing...' : 'Approve & Publish'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer dictionary={dictionary} />
    </main>
  )
}
