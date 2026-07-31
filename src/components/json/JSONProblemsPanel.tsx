'use client';

import React from 'react';
import { ValidationError } from '@/utils/jsonValidator';
import * as Icons from '@/components/Icons';

interface JSONProblemsPanelProps {
  errors: ValidationError[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectError: (error: ValidationError) => void;
  onNextError: () => void;
  onPrevError: () => void;
  currentIndex?: number;
}

export default function JSONProblemsPanel({
  errors,
  isOpen,
  onToggle,
  onSelectError,
  onNextError,
  onPrevError,
  currentIndex = 0
}: JSONProblemsPanelProps) {
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  return (
    <div className="border-2 border-border rounded-2xl overflow-hidden bg-card shadow-premium-md transition-all duration-200">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-secondary/25 border-b border-border/80">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground hover:opacity-80 transition-opacity"
        >
          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
            errors.length === 0 
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
              : errorCount > 0 
              ? 'bg-destructive/20 text-destructive border border-destructive/30' 
              : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
          }`}>
            {errors.length}
          </span>
          <span className="font-outfit text-sm font-extrabold">Problems & Syntax Diagnostics</span>
          {errors.length > 0 && (
            <span className="text-xs text-muted-foreground font-semibold lowercase">
              ({errorCount} error{errorCount === 1 ? '' : 's'}, {warningCount} warning{warningCount === 1 ? '' : 's'})
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          {errors.length > 0 && (
            <div className="flex items-center gap-1.5 bg-secondary/40 px-2 py-1 rounded-xl border border-border/60">
              <button
                onClick={onPrevError}
                title="Previous Problem (Shift+F8 or Alt+Up)"
                className="p-1 hover:bg-secondary/60 rounded-lg text-foreground transition-all"
              >
                <Icons.ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono-calc font-bold text-foreground px-1">
                {currentIndex + 1} of {errors.length}
              </span>
              <button
                onClick={onNextError}
                title="Next Problem (F8 or Alt+Down)"
                className="p-1 hover:bg-secondary/60 rounded-lg text-foreground transition-all"
              >
                <Icons.ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-secondary/50 rounded-xl text-foreground transition-all flex items-center gap-1 text-xs font-bold"
          >
            <span>{isOpen ? 'Hide' : 'Show'}</span>
            <Icons.ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Body Content */}
      {isOpen && (
        <div className="max-h-[300px] overflow-y-auto divide-y divide-border/60 font-mono-calc p-3 bg-card">
          {errors.length === 0 ? (
            <div className="py-8 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 select-none flex items-center justify-center gap-2">
              <Icons.CheckCircle className="h-5 w-5" />
              <span>✓ Workspace clean. JSON syntax is 100% valid!</span>
            </div>
          ) : (
            errors.map((err, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectError(err)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-destructive/10 border-2 border-destructive/40 shadow-sm' 
                      : 'hover:bg-secondary/30 border border-transparent'
                  }`}
                >
                  {/* Top Bar: Title & Position */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-wider ${
                        err.severity === 'error' 
                          ? 'bg-destructive text-destructive-foreground' 
                          : 'bg-amber-500 text-amber-950 font-black'
                      }`}>
                        {err.severity === 'error' ? '❌ ERROR' : '⚠️ WARNING'}
                      </span>
                      <span className="text-sm font-bold text-foreground leading-snug">
                        {err.message}
                      </span>
                    </div>

                    {err.line && err.column && (
                      <span className="text-xs font-bold text-foreground bg-secondary/60 border border-border/80 px-2.5 py-1 rounded-lg shrink-0">
                        Line {err.line}, Column {err.column}
                      </span>
                    )}
                  </div>

                  {/* Expected vs Received Snippet */}
                  {(err.expected || err.received) && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-secondary/30 p-3 rounded-xl border border-border/70">
                      {err.expected && (
                        <div>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-0.5">
                            Expected:
                          </span>
                          <code className="text-xs font-mono-calc font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded block">
                            {err.expected}
                          </code>
                        </div>
                      )}
                      {err.received && (
                        <div>
                          <span className="text-xs font-extrabold text-destructive uppercase tracking-wider block mb-0.5">
                            Received:
                          </span>
                          <code className="text-xs font-mono-calc font-bold text-destructive bg-destructive/10 px-2 py-1 rounded block">
                            {err.received}
                          </code>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reason & Suggested Fix */}
                  <div className="mt-2.5 space-y-1.5 text-xs sm:text-sm">
                    {(err.reason || err.explanation) && (
                      <p className="text-foreground/90 leading-relaxed font-medium">
                        <span className="font-extrabold text-foreground">Reason:</span>{' '}
                        {err.reason || err.explanation}
                      </p>
                    )}
                    {err.suggestion && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <span className="font-extrabold text-foreground">Suggested Fix:</span>{' '}
                        {err.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
