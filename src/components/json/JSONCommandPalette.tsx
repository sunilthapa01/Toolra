'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from '@/components/Icons';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Format' | 'Edit' | 'View' | 'Action' | 'File';
  shortcut?: string;
  description: string;
  icon: keyof typeof Icons;
  action: () => void;
}

interface JSONCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export default function JSONCommandPalette({
  isOpen,
  onClose,
  commands
}: JSONCommandPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className="relative z-10 w-full max-w-2xl border-2 border-border bg-card shadow-2xl transition-all duration-150 flex flex-col max-h-[520px] rounded-2xl overflow-hidden font-outfit"
        onKeyDown={handleKeyDown}
      >
        {/* Header Search Input */}
        <div className="flex items-center border-b border-border/80 px-5 py-4 bg-secondary/30">
          <Icons.Search className="h-5 w-5 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or action (e.g. Format, Minify, Tree Explorer)..."
            className="w-full border-0 bg-transparent py-1 text-base text-foreground focus:ring-0 outline-none placeholder:text-muted-foreground/60 font-semibold"
          />
          <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 border border-border bg-secondary text-xs font-mono-calc font-bold text-foreground rounded-lg shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin divide-y divide-border/30"
        >
          <div className="text-xs font-black uppercase tracking-wider text-muted-foreground px-3 py-1.5">
            {query === '' ? 'Available Actions' : `Matching Commands (${filteredCommands.length})`}
          </div>

          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const isActive = idx === activeIndex;
              const IconComponent = Icons[cmd.icon] || Icons.Code;

              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-xl ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-premium-sm'
                      : 'hover:bg-secondary/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-secondary text-foreground border border-border/60'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm">
                          {cmd.title}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isActive
                              ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/40'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      <div
                        className={`text-xs mt-0.5 max-w-[380px] truncate ${
                          isActive ? 'text-primary-foreground/90 font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {cmd.description}
                      </div>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <kbd
                      className={`text-xs font-mono-calc font-extrabold px-2.5 py-1 rounded-lg border shrink-0 ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/40'
                          : 'bg-secondary text-foreground border-border/80'
                      }`}
                    >
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 text-sm font-bold text-muted-foreground">
              No matching JSON commands found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-border/80 px-5 py-2.5 bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground font-mono-calc font-semibold">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Toolora Command Palette</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
