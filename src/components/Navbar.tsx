'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useContact } from './ContactProvider';
import * as Icons from './Icons';
import CommandPalette from './CommandPalette';
import { usePageTransition } from './TransitionProvider';
import { AnimatedNavLink } from './AnimationAtoms';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { openContactModal } = useContact();
  const { navigate } = usePageTransition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Calculators', href: '/#explore' },
    { name: 'Business Suite', href: '/#explore' },
    { name: 'About', href: '/about' },
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
    <header className="w-full border-b border-border bg-card shadow-premium-sm transition-colors duration-150 relative z-40">
      <CommandPalette />

      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Royal Blue accent */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2.5 group cursor-pointer select-none"
          >
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm select-none shadow-premium-sm hover:scale-105 active:scale-95 transition-all duration-200">
              T
            </div>
            <span className="font-outfit text-lg font-black tracking-tight text-foreground uppercase">
              Toolora
            </span>
          </a>
        </div>

        {/* Clear Search Field Bar - premium rounded border */}
        <div className="flex-1 max-w-xs sm:max-w-sm mx-4 hidden md:block">
          <button
            onClick={triggerSearch}
            className="w-full flex items-center justify-between bg-secondary hover:bg-secondary/80 px-4 py-2 text-xs text-muted transition-all cursor-pointer outline-none border border-border rounded-xl shadow-premium-sm hover:border-primary/45"
          >
            <div className="flex items-center gap-2">
              <Icons.Search className="h-3.5 w-3.5 text-muted/80" />
              <span className="font-medium">Search utilities...</span>
            </div>
            <span className="inline-flex items-center gap-0.5 border border-border bg-card px-1.5 py-0.5 text-[9px] font-bold text-muted rounded shadow-premium-sm">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Navigation Action list */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-6 mr-2">
            {categories.map((cat) => {
              if (cat.name === 'Contact') {
                return (
                  <button
                    key={cat.name}
                    onClick={openContactModal}
                    className="text-xs font-bold text-muted hover:text-primary transition-colors uppercase tracking-wider outline-none cursor-pointer nav-link-underline"
                  >
                    {cat.name}
                  </button>
                );
              }
              return (
                <AnimatedNavLink
                  key={cat.name}
                  href={cat.href}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  {cat.name}
                </AnimatedNavLink>
              );
            })}
          </nav>

          {/* Search Trigger for Mobile */}
          <button
            onClick={triggerSearch}
            className="flex h-9.5 w-9.5 items-center justify-center border border-border bg-card text-foreground md:hidden hover:bg-secondary transition-colors rounded-xl shadow-premium-sm"
            aria-label="Search Palette"
          >
            <Icons.Search className="h-4.5 w-4.5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-9.5 w-9.5 items-center justify-center border border-border bg-card text-foreground hover:bg-secondary active:scale-90 transition-all rounded-xl shadow-premium-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Icons.Sun className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
            ) : (
              <Icons.Moon className="h-4.5 w-4.5 text-primary" />
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9.5 w-9.5 items-center justify-center border border-border bg-card text-foreground sm:hidden hover:bg-secondary transition-colors rounded-xl shadow-premium-sm"
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
