'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light mode to match PrologueLearn
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage
    const savedTheme = localStorage.getItem('toolora-theme') as Theme;
    const activeTheme = savedTheme || 'light';

    setTheme(activeTheme);
    document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('toolora-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Avoid hydration mismatch by rendering a fallback/invisible state until mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
