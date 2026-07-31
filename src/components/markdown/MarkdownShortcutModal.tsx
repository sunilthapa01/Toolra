'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from '@/components/Icons';

interface MarkdownShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarkdownShortcutModal({ isOpen, onClose }: MarkdownShortcutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const shortcutGroups = [
    {
      title: 'Formatting & Insertion',
      shortcuts: [
        { keys: ['Ctrl', 'B'], desc: 'Bold text' },
        { keys: ['Ctrl', 'I'], desc: 'Italic text' },
        { keys: ['Ctrl', 'Shift', 'H'], desc: 'Heading syntax' },
        { keys: ['Ctrl', 'Shift', 'K'], desc: 'Code Block' },
        { keys: ['Ctrl', 'Shift', 'L'], desc: 'Insert Link' },
        { keys: ['Ctrl', 'Shift', 'I'], desc: 'Insert Image' },
        { keys: ['Ctrl', 'Shift', 'T'], desc: 'Insert Table' }
      ]
    },
    {
      title: 'Editing & Search',
      shortcuts: [
        { keys: ['Ctrl', 'Z'], desc: 'Undo edit' },
        { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo edit' },
        { keys: ['Ctrl', 'F'], desc: 'Search document' },
        { keys: ['Ctrl', 'G'], desc: 'Next search match' },
        { keys: ['Shift', 'Ctrl', 'G'], desc: 'Previous match' }
      ]
    },
    {
      title: 'Navigation & View',
      shortcuts: [
        { keys: ['F11'], desc: 'Toggle Full Screen Mode' },
        { keys: ['Esc'], desc: 'Exit Full Screen / Close Dialog' },
        { keys: ['Ctrl', 'Shift', 'M'], desc: 'Toggle Preview Layout' },
        { keys: ['?'], desc: 'Open Keyboard Shortcuts' }
      ]
    },
    {
      title: 'Export & Clipboard',
      shortcuts: [
        { keys: ['Ctrl', 'Shift', 'C'], desc: 'Copy Rendered HTML' },
        { keys: ['Ctrl', 'Shift', 'E'], desc: 'Export Document' }
      ]
    }
  ];

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[85vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Icons.Command className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-lg text-foreground leading-none">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-muted font-medium mt-1">Toolora Markdown Studio Productivity Map</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/80 rounded-xl text-muted hover:text-foreground transition-all"
            title="Close (Esc)"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Shortcut Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1">
          {shortcutGroups.map(group => (
            <div key={group.title} className="space-y-2.5 bg-secondary/20 p-4 rounded-2xl border border-border/60">
              <h3 className="text-[10px] font-black uppercase text-muted tracking-wider">{group.title}</h3>
              <div className="space-y-2 text-xs">
                {group.shortcuts.map(sc => (
                  <div key={sc.desc} className="flex items-center justify-between gap-2">
                    <span className="text-foreground font-medium text-xs">{sc.desc}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-0.5 bg-card border border-border text-[10px] font-mono-calc font-bold rounded-lg shadow-sm text-foreground"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/80 shrink-0">
          <span className="text-[10px] font-mono-calc text-muted">Press Esc or click anywhere outside to close</span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
