'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PremiumLoader from './PremiumLoader';
import gsap from 'gsap';

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
  const [state, setState] = useState<TransitionState>('idle');
  const [currentPath, setCurrentPath] = useState(pathname);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const targetScrollY = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Check reduced motion setting
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Custom momentum scroll using GSAP
  useEffect(() => {
    if (shouldReduceMotion) return;

    targetScrollY.current = window.scrollY;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if loader is open
      if (state === 'loading' || state === 'exiting') return;
      
      // Check if user is scrolling inside an element that should prevent smooth scroll
      let target = e.target as HTMLElement | null;
      let preventScroll = false;
      while (target) {
        if (
          target.hasAttribute?.('data-prevent-smooth-scroll') || 
          target.tagName === 'TEXTAREA' || 
          (target.scrollHeight > target.clientHeight && 
           window.getComputedStyle(target).overflowY === 'auto')
        ) {
          preventScroll = true;
          break;
        }
        target = target.parentElement;
      }
      if (preventScroll) return;

      e.preventDefault();

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Natural momentum mapping
      targetScrollY.current = Math.max(0, Math.min(maxScroll, targetScrollY.current + e.deltaY));

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const scrollObj = { y: window.scrollY };
      
      tweenRef.current = gsap.to(scrollObj, {
        y: targetScrollY.current,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        }
      });
    };

    const handleScrollSync = () => {
      // Sync target scroll position if user scrolls using browser scrollbar, space, arrow keys, etc.
      if (!tweenRef.current || !tweenRef.current.isActive()) {
        targetScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScrollSync, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScrollSync);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [shouldReduceMotion, state]);

  // Handle back/forward buttons or direct path modifications
  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
      setState('entering');
      const timer = setTimeout(() => {
        setState('idle');
      }, 250);
      
      // Reset scroll position instantly on new page render
      window.scrollTo(0, 0);
      targetScrollY.current = 0;
      
      return () => clearTimeout(timer);
    }
  }, [pathname, currentPath]);

  // Navigate function that intercepts default routing
  const navigate = (href: string, showLoader = true) => {
    // If it is an anchor, let standard scrolling handle it or use smooth scroll
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.split('#')[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        if (shouldReduceMotion) {
          window.scrollTo({ top, behavior: 'auto' });
        } else {
          targetScrollY.current = top;
          if (tweenRef.current) tweenRef.current.kill();
          
          const scrollObj = { y: window.scrollY };
          tweenRef.current = gsap.to(scrollObj, {
            y: top,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => window.scrollTo(0, scrollObj.y)
          });
        }
      }
      return;
    }

    if (href === pathname) {
      if (shouldReduceMotion) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        targetScrollY.current = 0;
        if (tweenRef.current) tweenRef.current.kill();
        const scrollObj = { y: window.scrollY };
        tweenRef.current = gsap.to(scrollObj, {
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: () => window.scrollTo(0, scrollObj.y)
        });
      }
      return;
    }

    if (shouldReduceMotion) {
      setState('exiting');
      setTimeout(() => {
        router.push(href);
      }, 100);
      return;
    }

    // Trigger smooth blur loader transition
    setState('loading');
    setTimeout(() => {
      router.push(href);
    }, 500);
  };

  // Lock scroll when loader is active
  useEffect(() => {
    if (state === 'loading' || state === 'exiting') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [state]);

  return (
    <TransitionContext.Provider value={{ state, navigate, shouldReduceMotion }}>
      <AnimatePresence mode="wait">
        {(state === 'loading' || state === 'exiting') && <PremiumLoader key="loader" />}
      </AnimatePresence>
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
