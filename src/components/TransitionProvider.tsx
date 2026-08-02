'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type TransitionState = 'idle' | 'exiting' | 'loading' | 'entering';

interface TransitionContextType {
  state: TransitionState;
  navigate: (href: string, showLoader?: boolean) => void;
  shouldReduceMotion: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Check reduced motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Direct instant route dispatch & native smooth scrolling
  const navigate = (href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.split('#')[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
      return;
    }

    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      return;
    }

    // Direct unblocked navigation
    router.push(href);
  };

  return (
    <TransitionContext.Provider value={{ state: 'idle', navigate, shouldReduceMotion }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a TransitionProvider');
  }
  return context;
}

