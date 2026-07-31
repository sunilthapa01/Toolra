'use client';

import React from 'react';
import * as Icons from '@/components/Icons';

interface JSONSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  matchCase: boolean;
  onMatchCaseChange: (mc: boolean) => void;
  isRegex: boolean;
  onIsRegexChange: (reg: boolean) => void;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  matchCount?: number;
  currentMatchIndex?: number;
}

export default function JSONSearchBar({
  isOpen,
  onClose,
  query,
  onQueryChange,
  matchCase,
  onMatchCaseChange,
  isRegex,
  onIsRegexChange,
  onNextMatch,
  onPrevMatch,
  matchCount = 0,
  currentMatchIndex = 0
}: JSONSearchBarProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-3 right-3 z-30 flex items-center gap-2 p-2 bg-card border-2 border-border/90 rounded-2xl shadow-premium-md animate-in fade-in slide-in-from-top-2 duration-150 font-outfit">
      <div className="relative flex items-center">
        <Icons.Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (e.shiftKey) onPrevMatch();
              else onNextMatch();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onClose();
            }
          }}
          placeholder="Find in editor..."
          className="pl-8 pr-7 py-1 text-xs sm:text-sm font-semibold bg-secondary/30 border border-border/70 rounded-xl text-foreground focus:outline-none focus:border-primary w-[160px] sm:w-[200px]"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-2 text-muted-foreground hover:text-foreground"
          >
            <Icons.X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Match Case Toggle */}
      <button
        onClick={() => onMatchCaseChange(!matchCase)}
        title="Match Case (Aa)"
        className={`px-2 py-1 text-xs font-mono-calc font-extrabold rounded-lg border transition-all ${
          matchCase
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground'
        }`}
      >
        Aa
      </button>

      {/* Regex Toggle */}
      <button
        onClick={() => onIsRegexChange(!isRegex)}
        title="Use Regular Expression (.*)"
        className={`px-2 py-1 text-xs font-mono-calc font-extrabold rounded-lg border transition-all ${
          isRegex
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground'
        }`}
      >
        .*
      </button>

      {/* Match Counter */}
      {query && (
        <span className="text-xs font-mono-calc font-bold text-foreground px-1">
          {matchCount > 0 ? `${currentMatchIndex + 1}/${matchCount}` : 'No matches'}
        </span>
      )}

      {/* Next & Prev Steppers */}
      <div className="flex items-center gap-1 border-l border-border/80 pl-1">
        <button
          onClick={onPrevMatch}
          title="Previous Match (Shift+Enter)"
          className="p-1 hover:bg-secondary/60 rounded-lg text-foreground transition-all"
        >
          <Icons.ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNextMatch}
          title="Next Match (Enter)"
          className="p-1 hover:bg-secondary/60 rounded-lg text-foreground transition-all"
        >
          <Icons.ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1 hover:bg-secondary/60 rounded-lg text-foreground transition-all border-l border-border/80 ml-1 pl-1"
      >
        <Icons.X className="h-4 w-4" />
      </button>
    </div>
  );
}
