'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const detectType = (msg: string, explicitType?: ToastType): ToastType => {
    if (explicitType) return explicitType;
    const lower = msg.toLowerCase();
    if (lower.includes('fail') || lower.includes('error') || lower.includes('invalid') || lower.includes('unexpected')) {
      return 'error';
    }
    if (
      lower.includes('success') ||
      lower.includes('copied') ||
      lower.includes('formatted') ||
      lower.includes('minified') ||
      lower.includes('downloaded') ||
      lower.includes('cleared') ||
      lower.includes('uploaded') ||
      lower.includes('fixed') ||
      lower.includes('loaded')
    ) {
      return 'success';
    }
    return 'info';
  };

  const showToast = useCallback((message: string, type?: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    const resolvedType = detectType(message, type);
    setToasts((prev) => [...prev, { id, message, type: resolvedType }]);
    
    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full sm:w-auto">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isError = toast.type === 'error';
            const isSuccess = toast.type === 'success';

            const badgeBg = isError
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              : isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-sky-500/20 text-sky-400 border-sky-500/30';

            const accentBg = isError
              ? 'bg-rose-500'
              : isSuccess
              ? 'bg-emerald-500'
              : 'bg-sky-500';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                layout
                className="relative pointer-events-auto flex items-center gap-3 pl-5 pr-3 py-3.5 bg-zinc-950/95 dark:bg-zinc-900/95 text-zinc-100 border border-zinc-800/80 rounded-2xl shadow-premium-xl select-none"
              >
                {/* Left Accent Bar */}
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${accentBg}`} />
                
                {/* High Contrast Icon Badge */}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border shadow-premium-sm ${badgeBg}`}>
                  {isError ? (
                    <Icons.AlertCircle className="h-4 w-4" />
                  ) : isSuccess ? (
                    <Icons.Check className="h-4 w-4" />
                  ) : (
                    <Icons.Info className="h-4 w-4" />
                  )}
                </div>

                {/* Message */}
                <p className="text-xs sm:text-sm font-semibold tracking-tight text-zinc-100 leading-normal pr-2">
                  {toast.message}
                </p>

                {/* Close Button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors ml-auto"
                  aria-label="Dismiss toast"
                >
                  <Icons.X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
