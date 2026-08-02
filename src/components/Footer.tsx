'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
              <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
                <Image
                  src="/toolora_refined_logo_no_bg.png"
                  alt="Toolora Logo"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                />
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
