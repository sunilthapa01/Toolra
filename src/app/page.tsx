'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LauncherSidebar from '@/components/LauncherSidebar';
import * as Icons from '@/components/Icons';
import { toolsRegistry } from '@/tools/registry';
import { ToolDefinition } from '@/tools/types';
import { ToolIcon } from '@/components/ToolIcon';

const WORKSPACES: { id: string; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'developer', label: 'Developer Workspace', icon: Icons.Code },
  { id: 'pdf', label: 'PDF Workspace', icon: Icons.FileText },
  { id: 'everyday', label: 'Everyday Workspace', icon: Icons.Home },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('developer');
  const [selectedToolSlug, setSelectedToolSlug] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedComingSoonTool, setSelectedComingSoonTool] = useState<ToolDefinition | null>(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toolsList = useMemo(() => Object.values(toolsRegistry), []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
    const toolParam = searchParams.get('tool');
    if (toolParam && toolsRegistry[toolParam]) {
      setSelectedToolSlug(toolParam);
    }
  }, [searchParams]);

  // Compute tool counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      developer: 0,
      pdf: 0,
      finance: 0,
      text: 0,
      business: 0,
      everyday: 0,
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

  // Filter tools based on search query & selected workspace
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return toolsList.filter((tool) => {
      const matchesQuery =
        query === '' ||
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
        (tool.capabilities && tool.capabilities.some((cap) => cap.toLowerCase().includes(query)));

      let matchesWorkspace = false;
      if (selectedCategory === 'developer') {
        matchesWorkspace = tool.category === 'developer';
      } else if (selectedCategory === 'pdf') {
        matchesWorkspace = tool.category === 'pdf';
      } else if (selectedCategory === 'everyday') {
        matchesWorkspace = ['finance', 'text', 'business', 'everyday'].includes(tool.category);
      } else {
        matchesWorkspace = tool.category === selectedCategory;
      }

      return matchesQuery && matchesWorkspace;
    });
  }, [toolsList, searchQuery, selectedCategory]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery, selectedCategory]);

  const handleSelectWorkspace = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedToolSlug(null);
    const params = new URLSearchParams(window.location.search);
    params.set('category', catId);
    params.delete('tool');
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history.pushState(null, '', newUrl);
  };

  const handleToolSelect = (tool: ToolDefinition) => {
    if (tool.comingSoon) {
      setSelectedComingSoonTool(tool);
      setEmail('');
      setSubscribed(false);
    } else {
      setSelectedToolSlug(tool.slug);
      const params = new URLSearchParams(window.location.search);
      params.set('category', tool.category);
      params.set('tool', tool.slug);
      const newUrl = `/?${params.toString()}`;
      window.history.pushState(null, '', newUrl);
    }
    setIsFocused(false);
  };

  const handleCloseTool = () => {
    setSelectedToolSlug(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('tool');
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history.pushState(null, '', newUrl);
  };

  const activeTool = selectedToolSlug ? toolsRegistry[selectedToolSlug] : null;
  const ActiveToolComponent = activeTool?.component;

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
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && selectedToolSlug) {
            // When user types a search query in Navbar while a tool is open, close tool so results show
            setSelectedToolSlug(null);
          }
        }}
      />

      <main className="flex-1 w-full flex flex-row min-h-[calc(100vh-4rem)]">
        
        {/* SIDEBAR NAVIGATION (Launcher Sidebar) */}
        <LauncherSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectWorkspace}
          categoryCounts={categoryCounts}
          isOpen={sidebarOpen}
          currentSlug={selectedToolSlug || undefined}
        />

        {/* MAIN LAUNCHER CONTENT */}
        <section className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 min-w-0 transition-all duration-200 overflow-y-auto">
          
          {/* ACTIVE INLINE TOOL WORKSPACE OR TOOLS GRID */}
          {activeTool && ActiveToolComponent ? (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Tool Title & Meta */}
              <div className="space-y-2 border-b border-border/60 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                      {activeTool.categoryName} Workspace
                    </span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs text-muted font-medium">Instant Local Engine</span>
                  </div>
                  <button
                    onClick={handleCloseTool}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold text-foreground transition-all cursor-pointer shrink-0"
                  >
                    <Icons.ChevronLeft className="h-4 w-4 text-primary" />
                    <span>Back to Tools Grid</span>
                  </button>
                </div>

                <h1 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  {activeTool.title}
                </h1>
                <p className="text-sm sm:text-base text-muted max-w-5xl leading-relaxed font-normal">
                  {activeTool.description}
                </p>
              </div>

              {/* Primary Active Tool Component Container */}
              <div className="w-full rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-sm min-h-[450px]">
                <ActiveToolComponent />
              </div>

              {/* Educational Articles & FAQs if present */}
              {(activeTool.content || (activeTool.faqs && activeTool.faqs.length > 0)) && (
                <div className="border-t border-border pt-8 space-y-8">
                  {activeTool.content?.whatIsThis && (
                    <section className="space-y-2">
                      <h2 className="text-lg sm:text-xl font-bold font-outfit text-foreground">
                        What is {activeTool.title}?
                      </h2>
                      <p className="text-sm text-muted leading-relaxed">
                        {activeTool.content.whatIsThis.overview}
                      </p>
                    </section>
                  )}

                  {activeTool.faqs && activeTool.faqs.length > 0 && (
                    <section className="space-y-3">
                      <h2 className="text-lg sm:text-xl font-bold font-outfit text-foreground flex items-center gap-2">
                        <Icons.Info className="h-4 w-4 text-primary" />
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-2.5">
                        {activeTool.faqs.map((faq, index) => {
                          const isOpen = openFaqIndex === index;
                          return (
                            <div key={index} className="rounded-xl border border-border bg-card overflow-hidden">
                              <button
                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                className="flex w-full items-center justify-between px-4 py-3 text-left text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary/30 transition-colors"
                              >
                                <span className="pr-4">{faq.question}</span>
                                <Icons.ChevronDown className={`h-4 w-4 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground' : ''}`} />
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="border-t border-border overflow-hidden bg-secondary/10"
                                  >
                                    <div className="px-4 py-3 text-xs text-muted leading-relaxed">
                                      {faq.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* TOOL GRID VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted">
                  {WORKSPACES.find((w) => w.id === selectedCategory || (w.id === 'everyday' && ['finance', 'text', 'business', 'everyday'].includes(selectedCategory)))?.label || 'Workspace Tools'}{' '}
                  ({filteredTools.length})
                </h2>
              </div>

              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool) => {
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          key={tool.slug}
                          onClick={() => handleToolSelect(tool)}
                          className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 hover:border-foreground/40 hover:shadow-md cursor-pointer select-none transition-all duration-200 space-y-5"
                        >
                          <div className="space-y-4">
                            {/* Card Header: Unique Icon + Category Badge */}
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
                      setSelectedCategory('developer');
                      setSelectedToolSlug(null);
                      window.history.replaceState(null, '', '/');
                    }}
                    className="text-xs font-bold text-primary hover:underline uppercase tracking-wider pt-2 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
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

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
