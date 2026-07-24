'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import * as Icons from '@/components/Icons';
import { toolsRegistry } from '@/tools/registry';
import { ToolDefinition, ToolCategory } from '@/tools/types';

// Category Definitions with descriptions and custom icons
const CATEGORIES: { id: ToolCategory; label: string; desc: string; icon: React.ComponentType<any>; color: string; bg: string; border: string }[] = [
  {
    id: 'finance',
    label: 'Finance',
    desc: 'GST, EMI, and SIP calculators for quick computations',
    icon: Icons.Calculator,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-500/20'
  },
  {
    id: 'pdf',
    label: 'PDF Tools',
    desc: 'Merge, split, and organize PDF documents locally',
    icon: Icons.FileText,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-500/20'
  },
  {
    id: 'developer',
    label: 'Developer',
    desc: 'JSON formatters and Base64 encoders for coding tasks',
    icon: Icons.Code,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-500/20'
  },
  {
    id: 'text',
    label: 'Text Tools',
    desc: 'Case converters and word counters to polish copy',
    icon: Icons.Type,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-500/20'
  },
  {
    id: 'business',
    label: 'Business',
    desc: 'Professional invoice and receipt makers for billing',
    icon: Icons.Briefcase,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-500/20'
  }
];

const SEARCH_PLACEHOLDERS = [
  'Search GST Calculator...',
  'Search EMI Calculator...',
  'Search Merge PDFs...',
  'Search Count Words...',
  'Search Format JSON...',
  'Search SIP Calculator...',
  'Search Base64 Encoder...'
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedComingSoonTool, setSelectedComingSoonTool] = useState<ToolDefinition | null>(null);
  
  // Notification email signup state
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // General newsletter state
  const [generalEmail, setGeneralEmail] = useState('');
  const [generalSubscribing, setGeneralSubscribing] = useState(false);
  const [generalSubscribed, setGeneralSubscribed] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toolsList = useMemo(() => Object.values(toolsRegistry), []);

  // Placeholder rotating animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on query and selected category
  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return toolsList.filter((tool) => {
      const matchesQuery =
        query === '' ||
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [toolsList, searchQuery, selectedCategory]);

  // Adjust active index for keyboard navigation within filtered list
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
      router.push(`/tools/${tool.slug}`);
    }
    setFocused(false);
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
    }, 800);
  };

  const handleGeneralNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalEmail || !generalEmail.includes('@')) return;

    setGeneralSubscribing(true);
    setTimeout(() => {
      setGeneralSubscribing(false);
      setGeneralSubscribed(true);
      setGeneralEmail('');
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full pb-20">
        
        {/* HERO SECTION */}
        <section className="relative w-full py-16 md:py-24 overflow-hidden border-b border-border/40 bg-radial-gradient">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            
            {/* Title / Description */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-primary/5 text-primary border border-primary/10 shadow-premium-sm uppercase tracking-wider">
                💡 Every tool runs locally in your browser
              </span>
              <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-foreground">
                Online utilities, <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">simplified.</span>
              </h1>
              <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
                A premium, ad-free collection of essential tools for students, shop owners, freelancers, and offices. Your data never leaves your computer.
              </p>
            </div>

            {/* Core Search Experience */}
            <div className="w-full max-w-2xl mx-auto relative">
              <div 
                className={`bg-card border rounded-2xl p-2 transition-all duration-300 ${
                  focused 
                    ? 'border-primary/50 shadow-premium-xl ring-4 ring-primary/5' 
                    : 'border-border shadow-premium-md hover:border-border/80'
                }`}
                onKeyDown={handleKeyDown}
              >
                <div className="relative flex items-center bg-secondary/35 border border-border/60 rounded-xl p-1.5">
                  <Icons.Search className="h-5 w-5 text-muted ml-3 shrink-0" />
                  
                  <div className="flex-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setTimeout(() => setFocused(false), 250)}
                      placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                      className="w-full border-0 bg-transparent py-3 pl-3 pr-10 text-sm sm:text-base text-foreground placeholder:text-muted/40 focus:ring-0 outline-none font-medium"
                    />
                    
                    {/* Clear Button */}
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors"
                        aria-label="Clear search"
                      >
                        <Icons.X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-0.5 border border-border bg-card px-2 py-1 text-[9px] font-black text-muted rounded-lg shadow-premium-sm mr-2 select-none uppercase tracking-wide">
                    /
                  </span>
                </div>
              </div>

              {/* Autocomplete Dropdown Search Results Overlay */}
              <AnimatePresence>
                {focused && searchQuery.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-50 left-0 right-0 mt-2 border border-border bg-card rounded-2xl shadow-premium-xl overflow-hidden text-left"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted px-5 py-3 border-b border-border bg-secondary/30">
                      Search results ({filteredTools.length})
                    </div>
                    <div className="max-h-[300px] overflow-y-auto divide-y divide-border/30 scrollbar-thin">
                      {filteredTools.length > 0 ? (
                        filteredTools.map((tool, idx) => {
                          const isKeyActive = idx === activeIndex;
                          return (
                            <button
                              key={tool.slug}
                              onMouseDown={() => handleToolSelect(tool)}
                              className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                                isKeyActive ? 'bg-primary/5 text-foreground' : 'hover:bg-secondary/40 text-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary border border-border/60 text-foreground">
                                  {tool.category === 'finance' ? (
                                    <Icons.Calculator className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                                  ) : tool.category === 'pdf' ? (
                                    <Icons.FileText className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                                  ) : tool.category === 'developer' ? (
                                    <Icons.Code className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                                  ) : tool.category === 'text' ? (
                                    <Icons.Type className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
                                  ) : (
                                    <Icons.Briefcase className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-foreground">{tool.title}</div>
                                  <div className="text-xs text-muted max-w-[340px] truncate mt-0.5">{tool.description}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-border bg-secondary text-muted">
                                  {tool.categoryName}
                                </span>
                                {tool.comingSoon ? (
                                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-lg">
                                    Preview
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                                    Open
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

            {/* Quick Benefits Tags */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted/75 font-semibold uppercase tracking-wider pt-2">
              <span className="flex items-center gap-1.5">
                <Icons.Shield className="h-4 w-4 text-primary" />
                100% Private
              </span>
              <span className="flex items-center gap-1.5">
                <Icons.Lock className="h-4 w-4 text-primary" />
                No uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Icons.Zap className="h-4 w-4 text-primary" />
                Instant local results
              </span>
            </div>

          </div>
        </section>

        {/* EXPLORE SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
          
          {/* Category Selector Grid */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Browse categories
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                Click a category to filter or select 'All' to view everything we offer.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* 'All' Category Card */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left justify-between p-5 rounded-2xl border transition-all duration-300 shadow-premium-sm group ${
                  selectedCategory === 'all'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/45 hover:shadow-premium-md'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border/80 text-foreground group-hover:scale-105 transition-transform duration-300 mb-4">
                  <Icons.Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-sm sm:text-base text-foreground tracking-tight">
                    All Utilities
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted mt-1 font-medium">
                    Show all 13 local browser tools
                  </p>
                </div>
              </button>

              {/* 5 Specific Category Cards */}
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const IconComponent = cat.icon;
                const toolCount = toolsList.filter((t) => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center sm:items-start text-center sm:text-left justify-between p-5 rounded-2xl border transition-all duration-300 shadow-premium-sm group ${
                      isSelected
                        ? `border-primary bg-primary/5 ring-1 ring-primary/20`
                        : 'border-border bg-card hover:border-primary/45 hover:shadow-premium-md'
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${cat.bg} ${cat.border} ${cat.color} group-hover:scale-105 transition-transform duration-300 mb-4`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-extrabold text-sm sm:text-base text-foreground tracking-tight">
                        {cat.label}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted mt-1 leading-normal font-medium max-w-[120px] truncate sm:max-w-none">
                        {toolCount} tools available
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h3 className="font-outfit text-xl font-bold uppercase tracking-widest text-muted">
                {selectedCategory === 'all' ? 'All Utilities' : `${CATEGORIES.find(c => c.id === selectedCategory)?.label} Utilities`} ({filteredTools.length})
              </h3>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool) => {
                  const catMeta = CATEGORIES.find((c) => c.id === tool.category) || CATEGORIES[0];
                  const Icon = catMeta.icon;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={tool.slug}
                      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-premium-sm hover:border-primary/45 hover:shadow-premium-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div>
                        {/* Card Header (Icon & Category tag) */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${catMeta.bg} ${catMeta.border} ${catMeta.color} transition-colors duration-300`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${catMeta.bg} ${catMeta.color} ${catMeta.border}`}>
                            {tool.categoryName}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-lg font-bold text-foreground font-outfit mb-2 group-hover:text-primary transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium mb-6">
                          {tool.description}
                        </p>
                      </div>

                      {/* Launch Trigger */}
                      <button
                        onClick={() => handleToolSelect(tool)}
                        className={`w-full text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-premium-sm flex items-center justify-center gap-1.5 ${
                          tool.comingSoon
                            ? 'bg-secondary text-muted hover:bg-secondary/70 border border-border/80'
                            : 'bg-primary text-primary-foreground hover:bg-primary/95'
                        }`}
                      >
                        {tool.comingSoon ? (
                          <>
                            <span>Notify Me</span>
                            <Icons.ArrowRight className="h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Open Tool</span>
                            <Icons.ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

        </section>

        {/* TRUST / ACCESSIBILITY BENEFITS SECTION */}
        <section className="w-full bg-secondary/30 border-y border-border/50 py-16 mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Why use Toolora?
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Simple, secure, and private browser-based online tools with no catches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-premium-sm text-center md:text-left space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mx-auto md:mx-0">
                  <Icons.Shield className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base text-foreground tracking-tight">
                  100% Client-Side Privacy
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  We value security. All calculations and text processing happen locally inside your web browser. We never upload your text, data, or files to any server.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-premium-sm text-center md:text-left space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 mx-auto md:mx-0">
                  <Icons.Lock className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base text-foreground tracking-tight">
                  Completely Free & Clean
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  No subscription models, no hidden paywalls, and absolutely no annoying banner ads or popup spam. Just clean utility pages ready to help you finish your tasks.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-premium-sm text-center md:text-left space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 mx-auto md:mx-0">
                  <Icons.Zap className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-outfit font-extrabold text-base text-foreground tracking-tight">
                  Lightning Fast Processing
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  Because everything is running locally using your browser's computational power, calculations and page rendering happen instantly. No lag, no latency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER SIGNUP SECTION */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-premium-md relative overflow-hidden">
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-outfit text-2xl font-extrabold tracking-tight text-foreground">
                Get updates on new tools
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                We regularly release new free online tools. Leave your email to receive a notification whenever we publish a new utility module.
              </p>
            </div>

            {generalSubscribed ? (
              <div className="max-w-md mx-auto border border-emerald-500 bg-emerald-500/5 p-4 rounded-xl flex items-center justify-center gap-3 text-emerald-600">
                <Icons.Check className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  You've successfully subscribed to tool updates!
                </span>
              </div>
            ) : (
              <form onSubmit={handleGeneralNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={generalEmail}
                  onChange={(e) => setGeneralEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 border border-border bg-background px-4 py-3 rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={generalSubscribing}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-sm"
                >
                  {generalSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* POPUP MODAL FOR UPCOMING TOOLS */}
      <AnimatePresence>
        {selectedComingSoonTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComingSoonTool(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 rounded-2xl shadow-premium-xl space-y-6"
            >
              <button
                onClick={() => setSelectedComingSoonTool(null)}
                className="absolute right-4 top-4 p-1 text-muted hover:text-foreground transition-colors"
                aria-label="Close details"
              >
                <Icons.X className="h-4.5 w-4.5" />
              </button>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-widest shadow-premium-sm">
                  Coming Soon
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight pt-2">
                  Get notified when {selectedComingSoonTool.title} is ready
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
                  {selectedComingSoonTool.description} Like all our tools, this will run 100% locally in your browser. Leave your email below to get notified as soon as it launches.
                </p>
              </div>

              {subscribed ? (
                <div className="border border-emerald-500 bg-emerald-500/5 p-4 rounded-xl flex items-center gap-3 text-emerald-600">
                  <Icons.Check className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Thank you! We've registered your email.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleComingSoonSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 border border-border bg-background px-4 py-3 rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-sm"
                  >
                    {subscribing ? 'Submitting...' : 'Register'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
