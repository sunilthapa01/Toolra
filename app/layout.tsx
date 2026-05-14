import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prologue — Don\'t Read It. Touch It.',
  description: 'Prologue is an interactive visual learning platform. Type any concept and get a live, manipulable visual that makes it click.',
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
