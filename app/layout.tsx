import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wollo — Maximize Your Social Media Presence',
  description: 'Wollo helps you maximize your social media presence with intelligent analytics, scheduling, and integrations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-page font-outfit">
        {children}
      </body>
    </html>
  )
}
