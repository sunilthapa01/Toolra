'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from './Icons';

interface LauncherSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  isOpen?: boolean;
}

export default function LauncherSidebar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  isOpen = true,
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
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 270, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          className="shrink-0 border-r border-border bg-[var(--sidebar-bg)] select-none font-inter overflow-hidden z-20 transition-colors duration-200"
        >
          <div className="w-[270px] p-4 sm:p-5 space-y-5 overflow-y-auto max-h-screen scrollbar-thin">
            {/* WORKSPACES SECTION */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted px-3 py-1">
                <span>Workspaces</span>
              </div>

              {workspaces.map((ws) => {
                const Icon = ws.icon;
                const selected = isWorkspaceSelected(ws.id);
                const count = getWorkspaceCount(ws.id);

                return (
                  <button
                    key={ws.id}
                    onClick={() => onSelectCategory(ws.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-150 text-sm cursor-pointer ${
                      selected
                        ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                        : 'text-foreground hover:bg-card hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted'}`} />
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
      )}
    </AnimatePresence>
  );
}
