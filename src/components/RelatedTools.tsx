'use client';

import React from 'react';
import Link from 'next/link';
import * as Icons from './Icons';
import { toolsRegistry } from '@/tools/registry';

interface RelatedToolsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
  // Find other tools matching the same category, up to 3 items
  const related = Object.values(toolsRegistry)
    .filter((t) => t.category === category && t.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  const categoryColors: Record<string, string> = {
    finance: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    developer: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-500/20',
    pdf: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-500/20',
    text: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-500/20',
    business: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
  };

  return (
    <section className="w-full py-12 border-t border-border bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-outfit mb-6 uppercase">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((tool) => {
            const colorClass = categoryColors[tool.category] || 'bg-secondary text-foreground border-border/80';
            const Icon = tool.category === 'finance' ? Icons.Calculator :
                         tool.category === 'pdf' ? Icons.FileText :
                         tool.category === 'developer' ? Icons.Code :
                         tool.category === 'text' ? Icons.Type :
                         Icons.Briefcase;

            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-premium-sm hover:border-primary/45 hover:shadow-premium-md transition-all duration-300"
              >
                <div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorClass} transition-colors duration-300 mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-outfit mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Try Tool</span>
                  <Icons.ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
