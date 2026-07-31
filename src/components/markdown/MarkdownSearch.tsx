'use client';

import React from 'react';
import * as Icons from '@/components/Icons';

interface MarkdownSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentIndex: number;
  totalMatches: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export default function MarkdownSearch({
  searchQuery,
  setSearchQuery,
  currentIndex,
  totalMatches,
  onNext,
  onPrev,
  onClose
}: MarkdownSearchProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 px-3 bg-card border border-border/80 rounded-2xl shadow-premium-md text-xs z-20">
      <Icons.Search className="h-3.5 w-3.5 text-primary shrink-0" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search document (Ctrl+F)..."
        className="bg-transparent border-none outline-none text-foreground placeholder:text-muted w-36 sm:w-56 text-xs font-medium"
        autoFocus
      />

      {/* Match count badge */}
      {searchQuery && (
        <span className="text-[10px] font-mono-calc text-muted px-1.5 py-0.5 bg-secondary/60 rounded-md shrink-0">
          {totalMatches > 0 ? `${currentIndex + 1} of ${totalMatches}` : '0 matches'}
        </span>
      )}

      {/* Prev / Next controls */}
      <div className="flex items-center gap-0.5 border-l border-border/60 pl-1 shrink-0">
        <button
          onClick={onPrev}
          disabled={totalMatches === 0}
          title="Previous Match (Shift+Ctrl+G)"
          className="p-1 hover:bg-secondary/60 disabled:opacity-30 rounded-lg text-muted hover:text-foreground transition-all"
        >
          <Icons.ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onNext}
          disabled={totalMatches === 0}
          title="Next Match (Ctrl+G)"
          className="p-1 hover:bg-secondary/60 disabled:opacity-30 rounded-lg text-muted hover:text-foreground transition-all"
        >
          <Icons.ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onClose}
          title="Close Search (Esc)"
          className="p-1 hover:bg-destructive/10 text-muted hover:text-destructive rounded-lg transition-all"
        >
          <Icons.X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
