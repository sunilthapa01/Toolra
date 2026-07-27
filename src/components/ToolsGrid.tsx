'use client';

import React, { useState, useMemo } from 'react';
import { toolsRegistry } from '@/tools/registry';
import { ToolCategory } from '@/tools/types';
import * as Icons from './Icons';
import { usePageTransition } from './TransitionProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryTab {
  id: 'all' | ToolCategory;
  name: string;
  icon: React.ComponentType<any>;
}

export default function ToolsGrid() {
  const { navigate } = usePageTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ToolCategory>('all');
  const [clickedSlug, setClickedSlug] = useState<string | null>(null);

  const categories: CategoryTab[] = [
    { id: 'all', name: 'All Tools', icon: Icons.Sparkles },
    { id: 'finance', name: 'Finance', icon: Icons.Calculator },
    { id: 'pdf', name: 'PDF Tools', icon: Icons.FileText },
    { id: 'developer', name: 'Developer', icon: Icons.Code },
    { id: 'text', name: 'Text Tools', icon: Icons.Type },
    { id: 'business', name: 'Business', icon: Icons.Briefcase },
  ];

  // Convert registry to array
  const tools = useMemo(() => Object.values(toolsRegistry), []);

  // Filter tools based on query and category
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [tools, activeCategory, searchQuery]);

  const handleToolSelect = (slug: string) => {
    setClickedSlug(slug);
    setTimeout(() => {
      navigate(`/tools/${slug}`, true);
      setClickedSlug(null);
    }, 200);
  };

  return (
    <section id="explore" className="w-full py-16 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Container */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="relative rounded-2xl border border-border bg-card p-2 shadow-premium-sm flex items-center transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary premium-hover-border">
            <Icons.Search className="h-5 w-5 text-muted ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hundreds of premium tools (e.g. GST Calculator)..."
              className="w-full border-0 bg-transparent py-2.5 pl-3 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted/60 focus:ring-0 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-muted hover:bg-secondary transition-colors mr-1"
                aria-label="Clear Search"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl border text-sm font-semibold font-outfit transition-all duration-200 shadow-premium-sm ${
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/45'
                }`}
              >
                <CatIcon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-muted'}`} />
                <span>{cat.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Tools Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => {
                const isClicked = clickedSlug === tool.slug;
                const Icon = tool.category === 'finance' ? Icons.Calculator :
                             tool.category === 'pdf' ? Icons.FileText :
                             tool.category === 'developer' ? Icons.Code :
                             tool.category === 'text' ? Icons.Type :
                             Icons.Briefcase;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isClicked ? { scale: 0.93, y: 3, opacity: 0.8 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={isClicked ? {} : { y: -4, scale: 1.015 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    key={tool.slug}
                    onClick={() => handleToolSelect(tool.slug)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-premium-sm hover:bg-gradient-to-br hover:from-card hover:to-primary/[0.012] premium-hover-border cursor-pointer select-none transition-all duration-300"
                  >
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-border/80 text-foreground group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 mb-5">
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      {/* Category tag */}
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                        {tool.categoryName}
                      </span>

                      <h3 className="text-xl font-bold text-foreground font-outfit mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-sm text-muted leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                      <span>Open Tool</span>
                      <Icons.ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card max-w-xl mx-auto shadow-premium-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted mb-4 border border-border">
              <Icons.AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-outfit mb-1">No tools found</h3>
            <p className="text-sm text-muted mb-4 px-6">
              We couldn't find any tools matching "{searchQuery}". Try adjusting your keywords or browse other categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
