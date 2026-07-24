'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toolsRegistry } from '@/tools/registry';
import { ToolDefinition, ToolCategory } from '@/tools/types';
import * as Icons from './Icons';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Upcoming tool subscription state
  const [subscribeTool, setSubscribeTool] = useState<ToolDefinition | null>(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global listener for Ctrl+K, Cmd+K, and Slash (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSubscribeTool(null);
        setSubscribed(false);
      }
      
      if (e.key === '/' && !isOpen) {
        const activeEl = document.activeElement;
        const isInput = activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' || 
          (activeEl as HTMLElement).isContentEditable
        );
        if (!isInput) {
          e.preventDefault();
          setIsOpen(true);
          setSubscribeTool(null);
          setSubscribed(false);
        }
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  const toolsList = useMemo(() => Object.values(toolsRegistry), []);

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') {
      return toolsList.slice(0, 5);
    }

    return toolsList.filter((tool) => {
      return (
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    });
  }, [toolsList, searchQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

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
      setIsOpen(false);
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
        setIsOpen(false);
      }, 1800);
    }, 800);
  };

  const categoryMetadata: Record<string, { label: string; text: string; bg: string }> = {
    finance: { label: 'Finance', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    developer: { label: 'Developer', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    pdf: { label: 'PDF Tools', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20' },
    text: { label: 'Text Tools', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    business: { label: 'Business', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-xs transition-opacity duration-150"
        onClick={() => setIsOpen(false)}
      />

      <div 
        className="relative w-full max-w-lg border border-border bg-card shadow-premium-xl transition-all duration-150 flex flex-col max-h-[460px] rounded-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {!subscribeTool ? (
          <>
            {/* Input Header */}
            <div className="flex items-center border-b border-border px-4 py-3 bg-secondary/35">
              <Icons.Search className="h-5 w-5 text-muted shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search command palette..."
                className="w-full border-0 bg-transparent py-2 text-sm sm:text-base text-foreground focus:ring-0 outline-none placeholder:text-muted/40"
              />
              <span className="hidden sm:inline-flex items-center gap-0.5 border border-border bg-card px-1.5 py-0.5 text-[9px] font-bold text-muted rounded shadow-premium-sm shrink-0 select-none">
                esc
              </span>
            </div>

            {/* Suggestions list */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin divide-y divide-border/20"
            >
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-muted px-3 py-1.5">
                {searchQuery === '' ? 'Common tools' : `Matching utilities (${filteredTools.length})`}
              </div>

              {filteredTools.length > 0 ? (
                filteredTools.map((tool, idx) => {
                  const isActive = idx === activeIndex;
                  const meta = categoryMetadata[tool.category] || { label: 'General', text: 'text-foreground', bg: 'bg-secondary' };
                  const Icon = tool.category === 'finance' ? Icons.Calculator :
                               tool.category === 'pdf' ? Icons.FileText :
                               tool.category === 'developer' ? Icons.Code :
                               tool.category === 'text' ? Icons.Type :
                               Icons.Briefcase;

                  return (
                    <button
                      key={tool.slug}
                      onClick={() => selectTool(tool)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-left transition-all rounded-xl ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary/40 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-secondary text-foreground border border-border/40'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm font-outfit tracking-tight">
                              {tool.title}
                            </span>
                            <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded-full border ${
                              isActive ? 'bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20' : `${meta.bg} ${meta.text} border-border`
                            }`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className={`text-xs max-w-[280px] sm:max-w-[320px] truncate ${isActive ? 'opacity-85' : 'text-muted'}`}>
                            {tool.description}
                          </div>
                        </div>
                      </div>

                      {tool.comingSoon ? (
                        <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 scale-90 ${
                          isActive ? 'text-primary-foreground border-primary-foreground/45' : 'text-primary border-primary/45'
                        }`}>
                          Preview
                        </span>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg shrink-0 ml-2 shadow-premium-sm ${
                          isActive ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                        }`}>
                          Open
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs font-bold text-muted uppercase tracking-wider">
                  No matching tools.
                </div>
              )}
            </div>

            {/* Bottom Keyboard Guide */}
            <div className="border-t border-border px-4 py-3 bg-secondary/35 flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="border border-border bg-card px-1.5 py-0.5 font-bold shadow-premium-sm">↓↑</span>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="border border-border bg-card px-1.5 py-0.5 font-bold shadow-premium-sm">↵</span>
                  <span>Select</span>
                </span>
              </div>
              <div>
                Press <span className="border border-border bg-card px-1.5 py-0.5 font-bold shadow-premium-sm">Esc</span>
              </div>
            </div>
          </>
        ) : (
          /* Coming Soon Waitlist block */
          <div className="p-6 md:p-8 space-y-5">
            <button
              onClick={() => {
                setSubscribeTool(null);
                setSubscribed(false);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
            >
              <Icons.X className="h-3.5 w-3.5 rotate-90" />
              <span>Go Back</span>
            </button>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-extrabold bg-primary text-primary-foreground uppercase tracking-widest shadow-premium-sm">
                Coming Soon
              </span>
              <h3 className="text-xl font-bold font-outfit text-foreground tracking-tight pt-2">
                Get notified when {subscribeTool.title} is ready
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {subscribeTool.description} We run all tools locally in your browser to keep your data private. Leave your email to get notified when this tool becomes available.
              </p>
            </div>

            {subscribed ? (
              <div className="border border-emerald-500 bg-emerald-500/5 p-4 rounded-xl flex items-center gap-3 text-emerald-600">
                <Icons.Check className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  You have successfully subscribed for updates on {subscribeTool.title}.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 border border-border bg-background px-3 py-2.5 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-sm"
                >
                  {subscribing ? 'Registering...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
