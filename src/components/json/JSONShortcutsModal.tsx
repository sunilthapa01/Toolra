'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from '@/components/Icons';

interface JSONShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JSONShortcutsModal({ isOpen, onClose }: JSONShortcutsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and add ESC key listener when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const shortcutsList = [
    {
      category: 'Formatting & Actions',
      items: [
        { key: 'Ctrl + Enter', description: 'Beautify / Format JSON with current spacing' },
        { key: 'Ctrl + Shift + M', description: 'Minify JSON string to single line' },
        { key: 'Ctrl + Shift + F', description: 'Auto-Fix common syntax errors (unquoted keys, single quotes)' },
        { key: 'Ctrl + Shift + C', description: 'Copy formatted JSON output to clipboard' },
      ],
    },
    {
      category: 'Navigation & Views',
      items: [
        { key: 'Ctrl + Shift + P', description: 'Open VS Code-style Command Palette' },
        { key: 'Ctrl + Shift + E', description: 'Toggle between Formatted Code View & Tree Explorer' },
        { key: 'F8 / Alt + Down', description: 'Jump to Next problem / syntax error' },
        { key: 'Shift + F8 / Alt + Up', description: 'Jump to Previous problem / syntax error' },
        { key: 'Ctrl + F', description: 'Toggle Monaco Editor Find & Search overlay' },
        { key: '?', description: 'Open this Keyboard Shortcuts Cheatsheet' },
      ],
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Box (Centered in Viewport) */}
      <div className="relative z-10 w-full max-w-xl border-2 border-border bg-card shadow-2xl rounded-2xl overflow-hidden font-outfit animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-secondary/30 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-3">
            <Icons.Code className="h-5 w-5 text-primary" />
            <h3 className="font-extrabold text-base text-foreground uppercase tracking-wider">
              Keyboard Shortcuts Cheatsheet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary/60 rounded-xl text-foreground transition-all"
            title="Close (ESC)"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 overflow-y-auto font-mono-calc scrollbar-thin">
          {shortcutsList.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1 font-outfit">
                {group.category}
              </h4>
              <div className="space-y-2">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-secondary/25 rounded-xl border border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-foreground font-outfit">
                      {item.description}
                    </span>
                    <kbd className="px-2.5 py-1 bg-card border border-border/80 rounded-lg text-xs font-mono-calc font-extrabold text-foreground shrink-0 shadow-xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-secondary/30 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground font-semibold shrink-0">
          <span>Press <kbd className="px-1.5 py-0.5 border rounded bg-card text-foreground font-mono-calc">ESC</kbd> or click backdrop to close</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
