'use client';

import React from 'react';

interface ToolIconProps {
  slug: string;
  category?: string;
  className?: string;
}

export function ToolIcon({ slug, className = '' }: ToolIconProps) {
  const getIconSvg = () => {
    switch (slug) {
      // DEVELOPER TOOLS
      case 'json-formatter':
        // Braces
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M8 3H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h1" />
            <path d="M16 3h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-1" />
          </svg>
        );

      case 'base64-encoder-decoder':
        // FileCode
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="m10 13-2 2 2 2" />
            <path d="m14 13 2 2-2 2" />
          </svg>
        );

      case 'hash-generator':
        // Fingerprint
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M14 13.12c0 2.38 0 4.38-1 5.88" />
            <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10c0 4.5-.5 7-1.5 9" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 12 0c0 3.5.5 6.5 1 8" />
            <path d="M12 15a1 1 0 0 0-1 1c0 1.5.05 3 .26 4.5" />
          </svg>
        );

      case 'markdown-preview':
        // NotebookText / FileText
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M9.5 8h5" />
            <path d="M9.5 12h5" />
            <path d="M9.5 16h3" />
          </svg>
        );

      // PDF TOOLS
      case 'pdf-merge-combine':
        // Files
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
            <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l5 5v9a2 2 0 0 1-2 2Z" />
            <path d="M3 12v8a2 2 0 0 0 2 2h11" />
          </svg>
        );

      case 'pdf-split':
        // Scissors
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" x2="8.12" y1="4" y2="15.88" />
            <line x1="14.47" x2="20" y1="14.48" y2="20" />
            <line x1="8.12" x2="12" y1="8.12" y2="12" />
          </svg>
        );

      // FINANCE TOOLS
      case 'gst-calculator':
        // Receipt
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 6v12" />
          </svg>
        );

      case 'reverse-gst-calculator':
        // ReceiptText
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
            <path d="M8 15h6" />
          </svg>
        );

      case 'emi-calculator':
        // WalletCards
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect width="18" height="12" x="3" y="6" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h.01" />
            <path d="M11 15h2" />
          </svg>
        );

      case 'loan-calculator':
        // Banknote
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01" />
            <path d="M18 12h.01" />
          </svg>
        );

      case 'income-tax-calculator-india':
        // BadgeIndianRupee
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.75Z" />
            <path d="M8 8h8" />
            <path d="M8 11h6" />
            <path d="M11 11a3 3 0 0 1 0 6H8" />
            <path d="m13 17-3.5-3" />
          </svg>
        );

      case 'sip-calculator':
        // TrendingUp
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        );

      case 'gst-split-calculator':
        // Divide
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="6" r="1.5" />
            <line x1="5" x2="19" y1="12" y2="12" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        );

      // TEXT TOOLS
      case 'word-counter':
        // TextCursor
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" />
            <path d="M7 22h1a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H7" />
            <line x1="7" x2="17" y1="12" y2="12" />
          </svg>
        );

      case 'case-converter':
        // CaseSensitive
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="m3 15 4-8 4 8" />
            <path d="M4 13h6" />
            <circle cx="18" cy="12" r="3" />
            <path d="M21 9v6" />
          </svg>
        );

      // BUSINESS TOOLS
      case 'gst-invoice-generator':
        // FileSpreadsheet
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <path d="M12 13v8" />
          </svg>
        );

      case 'invoice-generator':
        // ReceiptText
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
            <path d="M8 15h6" />
          </svg>
        );

      default:
        // Default generic tool fallback
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`h-[40px] w-[40px] shrink-0 rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-200 ${className}`}
    >
      {getIconSvg()}
    </div>
  );
}
