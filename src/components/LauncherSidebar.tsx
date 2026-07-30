'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolCategory } from '@/tools/types';
import * as Icons from './Icons';
import { toolsRegistry } from '@/tools/registry';
import { ToolIcon } from './ToolIcon';
import { usePageTransition } from './TransitionProvider';

interface LauncherSidebarProps {
  selectedCategory: ToolCategory | 'all';
  onSelectCategory: (category: ToolCategory | 'all') => void;
  categoryCounts: Record<string, number>;
  isOpen?: boolean;
  currentSlug?: string;
}

export default function LauncherSidebar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  isOpen = true,
  currentSlug,
}: LauncherSidebarProps) {
  const { navigate } = usePageTransition();

  const categories: { id: ToolCategory | 'all'; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'all', label: 'All Tools', icon: Icons.Sparkles },
    { id: 'developer', label: 'Developer', icon: Icons.Code },
    { id: 'pdf', label: 'PDF', icon: Icons.FileText },
    { id: 'finance', label: 'Finance', icon: Icons.Calculator },
    { id: 'text', label: 'Text', icon: Icons.Type },
    { id: 'business', label: 'Business', icon: Icons.Briefcase },
  ];

  const currentTool = currentSlug ? toolsRegistry[currentSlug] : null;
  const isToolActive = Boolean(currentSlug);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 270, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className="shrink-0 border-r border-border bg-[var(--sidebar-bg)] select-none font-inter overflow-hidden z-20 transition-colors duration-200"
        >
          <div className="w-[270px] p-4 sm:p-5 space-y-5 overflow-y-auto max-h-screen scrollbar-thin">
            {/* OPEN TOOL SECTION */}
            {currentTool && (
              <div className="space-y-2.5 pb-4 border-b border-border/80">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary px-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open Tool
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active Session
                  </span>
                </div>

                <div className="p-3 rounded-2xl border border-primary/30 bg-primary/10 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-3">
                    <ToolIcon
                      slug={currentTool.slug}
                      category={currentTool.category}
                      className="h-9 w-9 rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold font-outfit text-foreground truncate leading-tight">
                        {currentTool.title}
                      </h4>
                      <span className="text-[10px] text-muted font-medium uppercase tracking-wider block mt-0.5">
                        {currentTool.categoryName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-card border border-border rounded-xl text-[11px] font-bold text-foreground hover:bg-secondary/40 transition-all"
                  >
                    <Icons.ChevronLeft className="h-3.5 w-3.5 text-primary" />
                    <span>Back to All Tools</span>
                  </button>
                </div>
              </div>
            )}

            {/* CATEGORIES SECTION (Disabled cleanly when inside an open tool) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted px-3 py-1 flex items-center justify-between">
                <span>Categories</span>
                {isToolActive && (
                  <span className="text-[9px] font-semibold text-muted/70 uppercase">Disabled</span>
                )}
              </div>

              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id && !isToolActive;
                const count =
                  cat.id === 'all'
                    ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                    : categoryCounts[cat.id] || 0;

                if (isToolActive) {
                  return (
                    <div
                      key={cat.id}
                      title="Category navigation is disabled while a tool is open"
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm opacity-40 cursor-not-allowed select-none bg-secondary/10 text-muted"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-muted/70" />
                        <span className="text-xs font-outfit tracking-wide">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/20 text-muted/70 flex items-center gap-1">
                        <Icons.Lock className="h-2.5 w-2.5" />
                        {count}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-150 text-sm ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                        : 'text-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-muted'}`} />
                      <span className="text-xs font-outfit tracking-wide">{cat.label}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card text-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
