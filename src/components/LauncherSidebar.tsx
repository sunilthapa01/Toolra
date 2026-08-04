'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';

interface LauncherSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  isOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function LauncherSidebar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  isOpen = true,
  onCloseMobile,
}: LauncherSidebarProps) {
  const workspaces = [
    { id: 'developer', label: 'Developer Workspace', icon: Icons.Code },
    { id: 'pdf', label: 'PDF Workspace', icon: Icons.FileText },
    { id: 'everyday', label: 'Everyday Workspace', icon: Icons.Home },
  ];

  const getWorkspaceCount = (id: string) => {
    if (id === 'developer') return categoryCounts['developer'] || 0;
    if (id === 'pdf') return categoryCounts['pdf'] || 0;
    if (id === 'everyday') {
      return (
        (categoryCounts['finance'] || 0) +
        (categoryCounts['text'] || 0) +
        (categoryCounts['business'] || 0) +
        (categoryCounts['everyday'] || 0)
      );
    }
    return 0;
  };

  const isWorkspaceSelected = (id: string) => {
    if (selectedCategory === id) return true;
    if (id === 'everyday' && ['finance', 'text', 'business', 'everyday'].includes(selectedCategory)) {
      return true;
    }
    return false;
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="md:hidden fixed inset-0 z-40 bg-background/70 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed md:relative top-16 md:top-0 left-0 bottom-0 z-50 md:z-20 w-[270px] shrink-0 border-r border-border bg-[var(--sidebar-bg)] select-none font-inter overflow-hidden transition-colors duration-200 shadow-xl md:shadow-none"
          >
            <div className="w-[270px] p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-thin">
              {/* WORKSPACES SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                    Workspaces
                  </span>
                  {onCloseMobile && (
                    <button
                      onClick={onCloseMobile}
                      className="md:hidden p-1.5 text-muted hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                      aria-label="Close sidebar"
                      title="Close sidebar"
                    >
                      <Icons.X className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {workspaces.map((ws) => {
                  const Icon = ws.icon;
                  const selected = isWorkspaceSelected(ws.id);
                  const count = getWorkspaceCount(ws.id);

                  return (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectCategory(ws.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold transition-all duration-150 text-sm cursor-pointer touch-target ${
                        selected
                          ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                          : 'text-foreground hover:bg-card hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4.5 w-4.5 shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted'}`} />
                        <span className="text-xs font-outfit tracking-wide">{ws.label}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          selected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-card text-muted'
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
        </>
      )}
    </AnimatePresence>
  );
}
