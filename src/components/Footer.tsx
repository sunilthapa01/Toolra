'use client';

import React from 'react';
import Link from 'next/link';
import { useContact } from './ContactProvider';
import { useToast } from './ToastProvider';
import { FOOTER_SECTIONS, NavigationItem } from '@/config/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { openContactModal } = useContact();
  const { showToast } = useToast();

  const handleLinkClick = (e: React.MouseEvent, item: NavigationItem) => {
    if (!item.implemented) {
      e.preventDefault();
      showToast("Coming soon! We're working on this page and it'll be available shortly.");
    } else if (item.isAction === 'contact') {
      e.preventDefault();
      openContactModal();
    }
  };

  return (
    <footer className="w-full border-t border-border bg-card transition-colors duration-150 py-12 md:py-16 shadow-premium-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="flex h-9 w-9 items-center justify-center select-none shrink-0">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Horizontal crossbar of the T: Crimson Red */}
                  <rect x="3" y="5" width="18" height="4.5" rx="2.25" fill="#EF4444" />
                  
                  {/* Vertical stem of the T: currentColor */}
                  <rect x="10" y="9.5" width="4" height="10.5" rx="2" fill="currentColor" />
                  
                  {/* Ruler ticks: filled with var(--card) to act as cutouts */}
                  <rect x="12" y="11.5" width="2" height="1" fill="var(--card)" />
                  <rect x="12" y="14.5" width="2" height="1" fill="var(--card)" />
                  <rect x="12" y="17.5" width="2" height="1" fill="var(--card)" />
                  
                  {/* Gold Accent dot */}
                  <circle cx="18" cy="14.5" r="1.5" fill="#FACC15" />
                </svg>
              </div>
              <span className="font-outfit text-lg font-black tracking-tight text-foreground uppercase">
                Toolora
              </span>
            </Link>
            <p className="text-xs text-muted max-w-sm leading-relaxed font-medium">
              Toolora is a premium collection of free, high-performance online tools that run entirely in your web browser. No ads. No file uploads.
            </p>
          </div>

          {/* Map Section Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="text-xs font-semibold text-muted hover:text-primary transition-colors uppercase tracking-tight"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-wider text-muted">
          <p>&copy; {currentYear} Toolora. All calculations run privately in your browser.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-border bg-secondary text-foreground font-bold rounded-lg shadow-premium-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% PRIVATE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
