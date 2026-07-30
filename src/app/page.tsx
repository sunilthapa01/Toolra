'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LauncherSidebar from '@/components/LauncherSidebar';
import * as Icons from '@/components/Icons';
import { toolsRegistry } from '@/tools/registry';
import { ToolDefinition, ToolCategory } from '@/tools/types';
import { usePageTransition } from '@/components/TransitionProvider';
import { ToolIcon } from '@/components/ToolIcon';

const CATEGORIES: { id: ToolCategory | 'all'; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'all', label: 'All', icon: Icons.Sparkles },
  { id: 'developer', label: 'Developer', icon: Icons.Code },
  { id: 'pdf', label: 'PDF', icon: Icons.FileText },
  { id: 'finance', label: 'Finance', icon: Icons.Calculator },
  { id: 'text', label: 'Text', icon: Icons.Type },
  { id: 'business', label: 'Business', icon: Icons.Briefcase },
];

export default function HomePage() {
  const { navigate } = usePageTransition();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedComingSoonTool, setSelectedComingSoonTool] = useState<ToolDefinition | null>(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [clickedSlug, setClickedSlug] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toolsList = useMemo(() => Object.values(toolsRegistry), []);

  // Compute tool counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      developer: 0,
      pdf: 0,
      finance: 0,
      text: 0,
      business: 0,
    };
    toolsList.forEach((tool) => {
      if (counts[tool.category] !== undefined) {
        counts[tool.category] += 1;
      }
    });
    return counts;
  }, [toolsList]);

  // Focus search bar on keyboard shortcut (Ctrl+K, Cmd+K, or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsFocused(true);
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
          setIsFocused(true);
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          setIsFocused(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search query & selected category
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return toolsList.filter((tool) => {
      const matchesQuery =
        query === '' ||
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
        (tool.capabilities && tool.capabilities.some((cap) => cap.toLowerCase().includes(query)));

      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [toolsList, searchQuery, selectedCategory]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery, selectedCategory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredTools.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentTool = filteredTools[activeIndex];
      if (currentTool) {
        handleToolSelect(currentTool);
      }
    }
  };

  const handleToolSelect = (tool: ToolDefinition) => {
    if (tool.comingSoon) {
      setSelectedComingSoonTool(tool);
      setEmail('');
      setSubscribed(false);
    } else {
      setClickedSlug(tool.slug);
      setTimeout(() => {
        navigate(`/tools/${tool.slug}`, true);
        setClickedSlug(null);
      }, 150);
    }
    setIsFocused(false);
  };

  const handleComingSoonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setTimeout(() => {
        setSelectedComingSoonTool(null);
      }, 1500);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <main className="flex-1 w-full flex flex-row min-h-[calc(100vh-4rem)]">
        
        {/* SIDEBAR NAVIGATION (Launcher Sidebar) */}
        <LauncherSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
          isOpen={sidebarOpen}
        />

        {/* MAIN LAUNCHER CONTENT */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 min-w-0 transition-all duration-200">
          
          {/* LARGE HERO SEARCH BAR */}
          <div className="w-full max-w-4xl mx-auto relative z-30 pt-2 sm:pt-4">
            <div
              className={`bg-card border rounded-2xl p-2 transition-all duration-200 ${
                isFocused
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : 'border-border hover:border-foreground/40'
              }`}
              onKeyDown={handleKeyDown}
            >
              <div className="relative flex items-center bg-secondary rounded-xl px-4 py-3">
                <Icons.Search className="h-6 w-6 text-muted shrink-0 mr-3" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="Type a tool name, command or keyword..."
                  className="w-full border-0 bg-transparent py-1 text-base sm:text-lg text-foreground placeholder:text-muted focus:ring-0 outline-none font-medium font-inter"
                />

                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card shrink-0 mr-2"
                    aria-label="Clear search"
                  >
                    <Icons.X className="h-4 w-4" />
                  </button>
                ) : null}

                <div className="hidden sm:flex items-center gap-1 border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground rounded-lg shrink-0 select-none">
                  <span className="text-xs">Ctrl</span>
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Quick search dropdown overlay when actively typing */}
            <AnimatePresence>
              {isFocused && searchQuery.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 left-0 right-0 mt-2 border border-border bg-card rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted px-4 py-2.5 border-b border-border bg-secondary flex items-center justify-between">
                    <span>Quick launcher results ({filteredTools.length})</span>
                    <span className="text-[9px] font-normal text-muted">Use ↑↓ keys to navigate, Enter to select</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-border scrollbar-thin">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool, idx) => {
                        const isKeyActive = idx === activeIndex;
                        return (
                          <button
                            key={tool.slug}
                            onMouseDown={() => handleToolSelect(tool)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors group ${
                              isKeyActive ? 'bg-secondary text-foreground' : 'hover:bg-secondary/60 text-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <ToolIcon slug={tool.slug} category={tool.category} />
                              <div>
                                <div className="font-bold text-sm text-foreground font-outfit">{tool.title}</div>
                                <div className="text-xs text-muted max-w-[320px] truncate">{tool.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border bg-secondary text-muted">
                                {tool.categoryName}
                              </span>
                              {tool.comingSoon ? (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted border border-border bg-secondary px-2 py-0.5 rounded-lg">
                                  Preview
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-primary-foreground bg-primary px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  Open <Icons.ArrowRight className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-xs font-bold text-muted uppercase tracking-wider">
                        No matching tools found
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CATEGORY FILTER CHIPS */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted mr-2 select-none">
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-outfit transition-all duration-150 border ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                      : 'border-border bg-card text-foreground hover:border-foreground/50 hover:bg-secondary'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-primary-foreground' : 'text-muted'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* TOOL GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                {selectedCategory === 'all' ? 'All Tools' : `${CATEGORIES.find((c) => c.id === selectedCategory)?.label} Tools`}{' '}
                ({filteredTools.length})
              </h2>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredTools.map((tool) => {
                    const isClicked = clickedSlug === tool.slug;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={isClicked ? { scale: 0.96, opacity: 0.8 } : { opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        key={tool.slug}
                        onClick={() => handleToolSelect(tool)}
                        className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 hover:border-foreground/40 hover:shadow-md cursor-pointer select-none transition-all duration-200 space-y-5"
                      >
                        <div className="space-y-4">
                          {/* Card Header: Unique 40px Icon + Category Badge */}
                          <div className="flex items-center justify-between">
                            <ToolIcon slug={tool.slug} category={tool.category} />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-border bg-secondary text-muted">
                              {tool.categoryName}
                            </span>
                          </div>

                          {/* Tool Name & Description */}
                          <div>
                            <h3 className="text-lg font-bold font-outfit text-foreground transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal mt-1.5 line-clamp-2">
                              {tool.description}
                            </p>
                          </div>

                          {/* 2-3 Quick Capabilities */}
                          {tool.capabilities && tool.capabilities.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {tool.capabilities.slice(0, 3).map((cap, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-semibold text-muted bg-secondary border border-border px-2.5 py-1 rounded-md"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Action Trigger */}
                        <div className="pt-3 border-t border-border flex items-center justify-between text-xs sm:text-sm font-bold">
                          {tool.comingSoon ? (
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1">
                              Notify Me <Icons.ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm font-bold text-foreground group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Open Tool <Icons.ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50 max-w-md mx-auto space-y-3">
                <Icons.AlertCircle className="h-8 w-8 text-muted mx-auto" />
                <h3 className="text-sm font-bold font-outfit text-foreground">No tools found</h3>
                <p className="text-xs text-muted">
                  No tools matched "{searchQuery}". Reset filters to see all available tools.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs font-bold text-primary hover:underline uppercase tracking-wider pt-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL FOR UPCOMING TOOLS */}
      <AnimatePresence>
        {selectedComingSoonTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComingSoonTool(null)}
              className="fixed inset-0 bg-background/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md border border-border bg-card p-6 rounded-2xl shadow-2xl space-y-5"
            >
              <button
                onClick={() => setSelectedComingSoonTool(null)}
                className="absolute right-4 top-4 p-1 text-muted hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <Icons.X className="h-4 w-4" />
              </button>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-widest">
                  Preview Tool
                </span>
                <h3 className="text-lg font-bold font-outfit text-foreground tracking-tight pt-1">
                  Get notified when {selectedComingSoonTool.title} launches
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {selectedComingSoonTool.description} All Toolora utilities run 100% locally inside your browser.
                </p>
              </div>

              {subscribed ? (
                <div className="border border-emerald-500/40 bg-emerald-500/10 p-3.5 rounded-xl flex items-center gap-2.5 text-emerald-400">
                  <Icons.Check className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-semibold">Registered! We will notify you upon release.</span>
                </div>
              ) : (
                <form onSubmit={handleComingSoonSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 border border-border bg-background px-3 py-2 rounded-xl text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    {subscribing ? 'Registering...' : 'Notify Me'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
