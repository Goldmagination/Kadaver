import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kadaver - Society of Poets',
  description: 'A digital sanctuary for poetry in German, Russian, and English. Explore the raw beauty of words.',
  keywords: ['poetry', 'poems', 'Kadaver', 'literature', 'German poetry', 'Russian poetry', 'English poetry'],
  authors: [{ name: 'Kadaver Society' }],
  openGraph: {
    title: 'Kadaver - Society of Poets',
    description: 'A digital sanctuary for poetry',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth-custom">
      <body className="min-h-screen relative">
        <div className="noise-overlay" />
        <div className="paper-texture min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}