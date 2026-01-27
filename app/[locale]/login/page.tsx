'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            if (res.ok) {
                router.push(`/${locale}/admin`)
            } else {
                setError('Invalid credentials')
            }
        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-paper px-6">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-serif font-bold text-ink-black mb-8 text-center">
                    Gatekeeper
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/30 focus:border-blood-red outline-none font-mono text-center"
                            placeholder="Enter passphrase"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-blood-red text-center text-sm font-sans">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-ink-black text-paper py-3 font-serif hover:bg-blood-red transition-colors"
                    >
                        Enter
                    </button>
                </form>
            </div>
        </main>
    )
}
