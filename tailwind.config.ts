import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-page': '#e7e7eb',
        'bg-card': '#ffffff',
        'bg-soft': '#f5f5f7',
        'ink': '#0a0a0a',
        'ink-2': '#1a1a1f',
        'muted': '#8a8a92',
        'line': '#ececef',
        'purple': '#5b3cff',
        'purple-2': '#4a2fdc',
        'deep-purple': '#3826c6',
        'pink': '#ff5ca8',
        'pink-soft': '#ffb3d1',
        'pink-deep': '#e63985',
        'pink-card': '#ff4f9c',
        'yellow': '#fbd838',
        'orange': '#ff6b35',
        'orange-soft': '#ff8a4d',
      },
      fontFamily: {
        outfit: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}

export default config
