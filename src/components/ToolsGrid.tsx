'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { toolsRegistry } from '@/tools/registry';
import { ToolCategory } from '@/tools/types';
import * as Icons from './Icons';

interface CategoryTab {
  id: 'all' | ToolCategory;
  name: string;
  icon: React.ComponentType<any>;
}

export default function ToolsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ToolCategory>('all');

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

  return (
    <section id="explore" className="w-full py-16 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Container */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="relative rounded-2xl border border-border bg-card p-2 shadow-md flex items-center transition-all focus-within:ring-2 focus-within:ring-accent focus-within:border-accent">
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
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl border text-sm font-semibold font-outfit transition-all duration-200 ${
                  isActive
                    ? 'border-accent bg-accent/5 text-accent shadow-sm'
                    : 'border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                <CatIcon className="h-4.5 w-4.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tools Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
              >
                <div>
                  {(() => {
                    const Icon = tool.category === 'finance' ? Icons.Calculator :
                                 tool.category === 'pdf' ? Icons.FileText :
                                 tool.category === 'developer' ? Icons.Code :
                                 tool.category === 'text' ? Icons.Type :
                                 Icons.Briefcase;
                    return (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:bg-accent group-hover:text-white transition-colors duration-300 mb-5">
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })()}
                  
                  {/* Category tag */}
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 block">
                    {tool.categoryName}
                  </span>

                  <h3 className="text-xl font-bold text-foreground font-outfit mb-2 group-hover:text-accent transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-bold text-accent group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <Icons.ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card max-w-xl mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted mb-4">
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
              className="text-sm font-semibold text-accent hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
