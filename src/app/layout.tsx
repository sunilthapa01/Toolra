import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ContactProvider } from '@/components/ContactProvider';
import { ToastProvider } from '@/components/ToastProvider';
import ScrollToTop from '@/components/ScrollToTop';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'Toolora — Premium Online Tools',
    template: '%s | Toolora',
  },
  description: 'The internet\'s premium toolbox containing high-performance, private-by-default tools for everyone.',
  metadataBase: new URL('https://toolora.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Simple non-blocking inline script to enforce saved theme instantly during early loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('toolora-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-outfit antialiased selection:bg-accent selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <ContactProvider>
            <ToastProvider>
              <ScrollToTop />
              {children}
            </ToastProvider>
          </ContactProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' &&
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics
              gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            />
          )}
   <Analytics />
      </body>
    </html>
  );
}
