'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toolsRegistry } from '@/tools/registry';
import { ToolDefinition, ToolCategory } from '@/tools/types';
import * as Icons from './Icons';

export default function SearchHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  // Preview tool subscription state
  const [subscribeTool, setSubscribeTool] = useState<ToolDefinition | null>(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleSlash);
    return () => window.removeEventListener('keydown', handleSlash);
  }, []);

  const toolsList = useMemo(() => Object.values(toolsRegistry), []);

  // Category map metadata for visual styling
  const categoryMetadata: Record<string, { label: string; text: string; bg: string; border: string }> = {
    all: { label: 'All', text: 'text-foreground', bg: 'bg-secondary', border: 'border-border' },
    finance: { label: 'Finance', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-500/20' },
    developer: { label: 'Developer', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-500/20' },
    pdf: { label: 'PDF Tools', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-500/20' },
    text: { label: 'Text Tools', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-500/20' },
    business: { label: 'Business', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-500/20' },
  };

  // Mock metadata for tools to match premium feel
  const toolStats: Record<string, { saved: string; runs: string }> = {
    'gst-calculator': { saved: 'Saves 3m', runs: '14.8k runs' },
    'gst-invoice-generator': { saved: 'Saves 8m', runs: '2.5k runs' },
    'gst-split-calculator': { saved: 'Saves 4m', runs: '890 runs' },
    'reverse-gst-calculator': { saved: 'Saves 2m', runs: '4.2k runs' },
    'emi-calculator': { saved: 'Saves 5m', runs: '6.7k runs' },
    'invoice-generator': { saved: 'Saves 6m', runs: '5.1k runs' },
    'json-formatter': { saved: 'Saves 1m', runs: '19.2k runs' },
    'pdf-merge-combine': { saved: 'Saves 3m', runs: '11.3k runs' },
    'pdf-split': { saved: 'Saves 4m', runs: '8.4k runs' },
  };

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

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery, selectedCategory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (subscribeTool) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSubscribeTool(null);
        setSubscribed(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[activeIndex]) {
        selectTool(filteredTools[activeIndex]);
      }
    }
  };

  const selectTool = (tool: ToolDefinition) => {
    if (tool.comingSoon) {
      setSubscribeTool(tool);
      setEmail('');
      setSubscribed(false);
    } else {
      router.push(`/tools/${tool.slug}`);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribeTool(null);
        setSearchQuery('');
        inputRef.current?.focus();
      }, 1800);
    }, 800);
  };

  return (
    <div 
      className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-0"
      onKeyDown={handleKeyDown}
    >
      {!subscribeTool ? (
        <div className="space-y-6">
          {/* Memo Headline */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-foreground tracking-tight leading-none">
              How can we help you today?
            </h2>
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Search and launch premium, local browser utility applications instantly.
            </p>
          </div>

          {/* Floating Command Center Search Box */}
          <div className="bg-card border border-border rounded-2xl shadow-premium-lg p-3.5 space-y-3 transition-all duration-200 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/60">
            
            {/* Search Input bar */}
            <div className="relative flex items-center bg-secondary/40 border border-border/80 rounded-xl p-2 transition-all">
              <Icons.Search className="h-5 w-5 text-muted ml-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. GST Calculator, JSON Formatter)..."
                className="w-full border-0 bg-transparent py-2.5 pl-3 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted/40 focus:ring-0 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-muted hover:text-foreground mr-2"
                  aria-label="Clear Search"
                >
                  <Icons.X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Category Quick Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pt-1">
              {(Object.keys(categoryMetadata) as Array<ToolCategory | 'all'>).map((cat) => {
                const isSelected = selectedCategory === cat;
                const meta = categoryMetadata[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 uppercase tracking-wider ${
                      isSelected
                        ? `${meta.bg} ${meta.text} border-primary/50 shadow-premium-sm ring-1 ring-primary/20`
                        : 'border-border bg-card text-muted hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggestions List Box */}
          <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-premium-md">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted px-5 py-3.5 border-b border-border bg-secondary/25">
              {searchQuery === '' && selectedCategory === 'all' 
                ? 'Popular Applications' 
                : `Search results (${filteredTools.length})`}
            </div>

            <div className="divide-y divide-border/40">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, idx) => {
                  const isActive = idx === activeIndex;
                  const meta = categoryMetadata[tool.category] || categoryMetadata.all;
                  const stats = toolStats[tool.slug] || { saved: 'Saves 2m', runs: '1k runs' };

                  return (
                    <button
                      key={tool.slug}
                      onClick={() => selectTool(tool)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${
                        isActive 
                          ? 'bg-secondary/40 text-foreground' 
                          : 'hover:bg-secondary/15 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border/80 text-foreground`}>
                          {tool.category === 'finance' ? (
                            <Icons.Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : tool.category === 'developer' ? (
                            <Icons.Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : tool.category === 'pdf' ? (
                            <Icons.FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                          ) : tool.category === 'text' ? (
                            <Icons.Type className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Icons.Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm sm:text-base font-outfit tracking-tight">
                              {tool.title}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${meta.bg} ${meta.text} ${meta.border}`}>
                              {tool.categoryName}
                            </span>
                          </div>
                          <div className="text-xs text-muted max-w-[280px] sm:max-w-[340px] truncate mt-0.5">
                            {tool.description}
                          </div>
                        </div>
                      </div>

                      {/* Right Tag deck */}
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex flex-col items-end text-[10px] font-semibold text-muted/65 uppercase tracking-wider shrink-0">
                          <span>{stats.saved}</span>
                          <span>{stats.runs}</span>
                        </div>

                        {tool.comingSoon ? (
                          <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary shrink-0 ml-2 shadow-premium-sm">
                            Preview
                          </span>
                        ) : (
                          <span className="text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-xl shrink-0 ml-2 hover:bg-primary/95 transition-colors shadow-premium-sm">
                            Open Tool
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 text-xs font-bold text-muted uppercase tracking-wider">
                  No matching tools found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Friendly Waitlist Signup Card */
        <div className="border border-border bg-card p-6 md:p-8 rounded-2xl shadow-premium-lg space-y-6">
          <button
            onClick={() => {
              setSubscribeTool(null);
              setSubscribed(false);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
          >
            <Icons.X className="h-4 w-4 rotate-90" />
            <span>Back to search</span>
          </button>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-extrabold bg-primary text-primary-foreground uppercase tracking-widest shadow-premium-sm">
              Upcoming Utility
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight pt-2">
              Notify me when {subscribeTool.title} launches
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {subscribeTool.description} We calculate client-side inside secure browser memory. Leave your email to receive updates.
            </p>
          </div>

          {subscribed ? (
            <div className="border border-emerald-500 bg-emerald-500/5 p-4 rounded-xl flex items-center gap-3 text-emerald-600">
              <Icons.Check className="h-5 w-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Thank you! We've registered your interest.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 border border-border bg-background px-4 py-3 rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 transition-all shadow-premium-sm"
              >
                {subscribing ? 'Submitting...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
