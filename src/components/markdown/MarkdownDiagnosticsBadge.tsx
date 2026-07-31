'use client';

import React, { useState } from 'react';
import { DiagnosticIssue } from '@/utils/markdownDiagnostics';
import * as Icons from '@/components/Icons';

interface MarkdownDiagnosticsBadgeProps {
  issues: DiagnosticIssue[];
}

export default function MarkdownDiagnosticsBadge({ issues }: MarkdownDiagnosticsBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (issues.length === 0) return null;

  const errorsCount = issues.filter(i => i.type === 'error').length;
  const warningsCount = issues.filter(i => i.type === 'warning').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all"
        title="View Document Diagnostics"
      >
        <Icons.AlertTriangle className="h-3.5 w-3.5" />
        <span>{issues.length} {issues.length === 1 ? 'Notice' : 'Notices'}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-40 w-72 sm:w-80 p-3 bg-card border border-border rounded-2xl shadow-premium-xl space-y-2 text-xs"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Icons.ShieldAlert className="h-4 w-4 text-amber-500" />
              Document Diagnostics
            </span>
            <span className="text-[10px] font-mono-calc text-muted">
              {warningsCount} warning{warningsCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-2 rounded-xl bg-secondary/30 border border-border/40 flex items-start gap-2 text-muted-foreground"
              >
                <Icons.AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-foreground">{issue.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
