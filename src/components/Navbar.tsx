'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useContact } from './ContactProvider';
import * as Icons from './Icons';
import CommandPalette from './CommandPalette';
import { usePageTransition } from './TransitionProvider';
import { AnimatedNavLink } from './AnimationAtoms';

interface NavbarProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

function NavbarContent({ onToggleSidebar, searchQuery, onSearchChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { openContactModal } = useContact();
  const { navigate } = usePageTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localQuery, setLocalQuery] = useState(searchQuery || searchParams.get('q') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalQuery(searchQuery);
    } else {
      const q = searchParams.get('q');
      if (q !== null) setLocalQuery(q);
    }
  }, [searchQuery, searchParams]);

  // Global hotkey listeners for Ctrl+K, Cmd+K, and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQueryChange = (val: string) => {
    setLocalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
    if (pathname === '/') {
      const params = new URLSearchParams(window.location.search);
      if (val.trim()) {
        params.set('q', val);
      } else {
        params.delete('q');
      }
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      window.history.replaceState(null, '', newUrl);
    } else {
      if (val.trim()) {
        router.push(`/?q=${encodeURIComponent(val)}`);
      }
    }
  };

  const categories = [
    { name: 'Contact', href: '#' },
  ];

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
            <div className="relative h-9 w-9 shrink-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200">
              <Image
                src="/toolora_refined_logo_no_bg.png"
                alt="Toolora Logo"
                width={36}
                height={36}
                className="object-contain w-full h-full drop-shadow-xs"
                priority
              />
            </div>
            <span className="font-outfit text-lg font-black tracking-tight text-foreground uppercase">
              Toolora
            </span>
          </a>
        </div>

        {/* Persistent Centralized Navbar Search Input */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-4 hidden md:block">
          <div className="relative flex items-center bg-secondary border border-border rounded-xl px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Icons.Search className="h-4 w-4 text-muted shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={localQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search tools, commands or keywords..."
              className="w-full border-0 bg-transparent py-1 text-xs sm:text-sm text-foreground placeholder:text-muted focus:ring-0 outline-none font-medium font-inter"
            />
            {localQuery ? (
              <button
                onClick={() => handleQueryChange('')}
                className="p-1 text-muted hover:text-foreground shrink-0 mr-1"
                aria-label="Clear search"
              >
                <Icons.X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <span className="inline-flex items-center gap-0.5 border border-border bg-card px-1.5 py-0.5 text-[9px] font-bold text-foreground rounded shrink-0 select-none">
              Ctrl K
            </span>
          </div>
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

      {/* Mobile search & sitemap directory */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 py-4 space-y-3 shadow-premium-md">
          <div className="relative flex items-center bg-secondary border border-border rounded-xl px-3 py-2">
            <Icons.Search className="h-4 w-4 text-muted shrink-0 mr-2" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search tools..."
              className="w-full border-0 bg-transparent py-0.5 text-xs text-foreground placeholder:text-muted focus:ring-0 outline-none font-medium font-inter"
            />
          </div>
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

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={null}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
