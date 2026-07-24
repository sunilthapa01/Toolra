import React from 'react';
import Link from 'next/link';
import * as Icons from './Icons';

export interface BreadcrumbStep {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  steps: BreadcrumbStep[];
}

export default function Breadcrumb({ steps }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-muted mb-6" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <Icons.Sparkles className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={index}>
            <Icons.ChevronRight className="h-3 w-3 shrink-0 text-muted/60" />
            {isLast || !step.href ? (
              <span className="font-medium text-foreground truncate max-w-[160px] sm:max-w-none">
                {step.name}
              </span>
            ) : (
              <Link
                href={step.href}
                className="hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {step.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
