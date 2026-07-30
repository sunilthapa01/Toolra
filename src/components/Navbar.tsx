'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useContact } from './ContactProvider';
import * as Icons from './Icons';
import CommandPalette from './CommandPalette';
import { usePageTransition } from './TransitionProvider';
import { AnimatedNavLink } from './AnimationAtoms';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { openContactModal } = useContact();
  const { navigate } = usePageTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Contact', href: '#' },
  ];

  const triggerSearch = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 w-full border-b border-border bg-card/90 backdrop-blur-md transition-colors duration-150 z-50">
      <CommandPalette />

      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Sidebar Toggle */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-secondary active:scale-95 transition-all mr-1 cursor-pointer"
              aria-label="Toggle Sidebar"
              title="Toggle Sidebar"
            >
              <Icons.Menu className="h-4.5 w-4.5" />
            </button>
          )}

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2.5 group cursor-pointer select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center select-none hover:scale-105 active:scale-95 transition-all duration-200 shrink-0">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal crossbar of the T */}
                <rect x="3" y="5" width="18" height="4.5" rx="2.25" fill="var(--primary)" />
                
                {/* Vertical stem of the T */}
                <rect x="10" y="9.5" width="4" height="10.5" rx="2" fill="var(--foreground)" />
                
                {/* Ruler ticks cutouts */}
                <rect x="12" y="11.5" width="2" height="1" fill="var(--card)" />
                <rect x="12" y="14.5" width="2" height="1" fill="var(--card)" />
                <rect x="12" y="17.5" width="2" height="1" fill="var(--card)" />
                
                {/* Accent dot */}
                <circle cx="18" cy="14.5" r="1.5" fill="var(--muted)" />
              </svg>
            </div>
            <span className="font-outfit text-lg font-black tracking-tight text-foreground uppercase">
              Toolora
            </span>
          </a>
        </div>

        {/* Clear Search Field Bar */}
        <div className="flex-1 max-w-xs sm:max-w-sm mx-4 hidden md:block">
          <button
            onClick={triggerSearch}
            className="w-full flex items-center justify-between bg-secondary hover:bg-secondary/80 px-4 py-2 text-xs text-muted transition-all cursor-pointer outline-none border border-border rounded-xl hover:border-foreground/40"
          >
            <div className="flex items-center gap-2">
              <Icons.Search className="h-3.5 w-3.5 text-muted" />
              <span className="font-medium">Search utilities...</span>
            </div>
            <span className="inline-flex items-center gap-0.5 border border-border bg-card px-1.5 py-0.5 text-[9px] font-bold text-foreground rounded">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Navigation Action list */}
        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-6 mr-1">
            {categories.map((cat) => {
              if (cat.name === 'Contact') {
                return (
                  <button
                    key={cat.name}
                    onClick={openContactModal}
                    className="text-xs font-bold text-foreground hover:text-muted transition-colors uppercase tracking-wider outline-none cursor-pointer"
                  >
                    {cat.name}
                  </button>
                );
              }
              return (
                <AnimatedNavLink
                  key={cat.name}
                  href={cat.href}
                  className="text-xs font-bold uppercase tracking-wider text-foreground hover:text-muted"
                >
                  {cat.name}
                </AnimatedNavLink>
              );
            })}
          </nav>

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center border border-border bg-card text-foreground hover:bg-secondary active:scale-90 transition-all rounded-xl cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Icons.Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Icons.Moon className="h-4.5 w-4.5 text-foreground" />
            )}
          </button>

          {/* Search Trigger for Mobile */}
          <button
            onClick={triggerSearch}
            className="flex h-9 w-9 items-center justify-center border border-border bg-card text-foreground md:hidden hover:bg-secondary transition-colors rounded-xl"
            aria-label="Search Palette"
          >
            <Icons.Search className="h-4.5 w-4.5" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center border border-border bg-card text-foreground sm:hidden hover:bg-secondary transition-colors rounded-xl"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <Icons.X className="h-4.5 w-4.5" />
            ) : (
              <Icons.Menu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sitemap directory */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 py-4 space-y-3 shadow-premium-md">
          {categories.map((cat) => {
            if (cat.name === 'Contact') {
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openContactModal();
                  }}
                  className="block w-full text-left py-2.5 text-xs font-bold tracking-wider uppercase text-muted hover:text-primary border-b border-border/40 last:border-b-0 outline-none"
                >
                  {cat.name}
                </button>
              );
            }
            return (
              <a
                key={cat.name}
                href={cat.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  navigate(cat.href);
                }}
                className="block py-2.5 text-xs font-bold tracking-wider uppercase text-muted hover:text-primary border-b border-border/40 last:border-b-0 cursor-pointer"
              >
                {cat.name}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
