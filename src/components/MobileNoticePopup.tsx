'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from '@/components/Icons';

export default function MobileNoticePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkMobileViewport = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const isMobile = width < 765;

      if (!isMobile) {
        // Reset dismissal state when user scales back up to desktop
        setIsDismissed(false);
        setIsOpen(false);
      } else {
        // On mobile width < 765px, show unless explicitly closed in this active view
        if (!isDismissed) {
          setIsOpen(true);
        }
      }
    };

    // Check on initial client mount
    checkMobileViewport();

    // Listen for window resize & orientation change
    window.addEventListener('resize', checkMobileViewport);
    window.addEventListener('orientationchange', checkMobileViewport);
    return () => {
      window.removeEventListener('resize', checkMobileViewport);
      window.removeEventListener('orientationchange', checkMobileViewport);
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsOpen(false);
    try {
      sessionStorage.removeItem('toolora-mobile-notice-dismissed');
    } catch (e) {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-sm sm:max-w-md bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Icon */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-premium-sm">
                  <Icons.Smartphone className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Work In Progress
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-outfit text-foreground mt-1">
                    Mobile Layout Optimization
                  </h3>
                </div>
              </div>

              {/* Close Icon */}
              <button
                onClick={handleDismiss}
                className="h-8 w-8 rounded-full border border-border bg-secondary/30 flex items-center justify-center text-muted hover:text-foreground hover:bg-secondary transition"
                aria-label="Close message"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-muted leading-relaxed">
              We are actively refining and polishing the mobile user interface for screens under <strong className="text-foreground font-semibold">765px</strong>. Full mobile responsiveness will be completed very soon!
            </p>

            {/* Action Footer */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleDismiss}
                className="w-full py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-md flex items-center justify-center gap-2"
              >
                <span>Got it, Continue</span>
                <Icons.ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
