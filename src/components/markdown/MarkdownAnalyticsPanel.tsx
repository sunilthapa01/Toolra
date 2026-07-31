'use client';

import React from 'react';
import { MarkdownStats } from '@/utils/markdownAnalytics';
import * as Icons from '@/components/Icons';

interface MarkdownAnalyticsPanelProps {
  stats: MarkdownStats;
}

export default function MarkdownAnalyticsPanel({ stats }: MarkdownAnalyticsPanelProps) {
  return (
    <div className="w-full p-4 rounded-2xl bg-secondary/20 border border-border/80 shadow-premium-sm text-foreground select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-border/60">
        <span className="text-xs md:text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
          <Icons.BarChart2 className="h-4.5 w-4.5 text-primary" />
          Document Analytics
        </span>

        {/* Reading Time & Level Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/25 rounded-xl shadow-xs">
            <Icons.Clock className="h-4 w-4 text-primary" />
            <span className="text-muted font-medium">Reading Time:</span>
            <strong className="text-foreground font-extrabold">{stats.readingTimeMinutes} min</strong>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl shadow-xs">
            <Icons.BookOpen className="h-4 w-4 text-emerald-500" />
            <span className="text-muted font-medium">Reading Level:</span>
            <strong className="text-foreground font-extrabold">{stats.readingLevel}</strong>
          </div>
        </div>
      </div>

      {/* Grid of 10 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 text-center">
        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Chars</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.characters}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Words</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.words}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Lines</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.lines}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Paragraphs</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.paragraphs}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Headings</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.headings}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Links</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.links}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Images</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.images}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Tables</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.tables}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Lists</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.lists}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-all">
          <div className="text-xs text-muted uppercase font-bold tracking-wider mb-0.5">Code Blocks</div>
          <div className="font-mono-calc font-black text-base md:text-lg text-foreground">{stats.codeBlocks}</div>
        </div>
      </div>
    </div>
  );
}
