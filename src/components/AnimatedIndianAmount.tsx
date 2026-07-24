'use client';

import React, { useEffect, useState, useRef } from 'react';
import { formatCompactIndianCurrency, formatExactIndianCurrency } from '@/utils/currency';

interface AnimatedIndianAmountProps {
  value: number;
  label?: string;
  showExactSub?: boolean;
  className?: string;
  sizeClass?: string;
  exactSizeClass?: string;
}

export default function AnimatedIndianAmount({
  value,
  label,
  showExactSub = true,
  className = '',
  sizeClass = 'text-2xl sm:text-3xl font-extrabold',
  exactSizeClass = 'text-[11px]',
}: AnimatedIndianAmountProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  // Smooth number count-up transition using requestAnimationFrame
  useEffect(() => {
    const start = displayValue;
    const end = value;
    if (start === end) return;

    const range = end - start;
    const duration = 250; // ms transition duration
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + range * progress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
      }
    };

    const animId = window.requestAnimationFrame(step);
    prevValueRef.current = value;

    return () => window.cancelAnimationFrame(animId);
  }, [value]);

  // Determine if compact mode is active based on the target value (>= ₹1,00,000)
  const isCompactActive = Math.abs(value) >= 100000;

  const compact = formatCompactIndianCurrency(displayValue);
  const exact = formatExactIndianCurrency(value); // Always show exact target value for precision

  return (
    <div className={`flex flex-col space-y-0.5 max-w-full ${className}`}>
      {label && (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block mb-1">
          {label}
        </span>
      )}

      {/* Tooltip Hover Wrapper */}
      <div className={`relative group inline-block max-w-full ${isCompactActive ? 'cursor-help' : ''}`}>
        
        {/* Hero Number (Never wraps, never overflows) */}
        <div className={`font-mono-calc text-foreground tracking-tight select-all whitespace-nowrap overflow-hidden text-ellipsis ${sizeClass}`}>
          {compact}
        </div>

        {/* Hover Tooltip Popup (Only shown when compact mode is active) */}
        {isCompactActive && (
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-foreground text-background px-3 py-1.5 rounded-xl shadow-premium-lg z-30 flex flex-col items-center">
            <span className="text-[8px] font-black tracking-widest text-muted-foreground/80 uppercase">Exact Amount</span>
            <span className="font-mono-calc font-bold text-xs">{exact}</span>
            {/* Subtle triangle indicator */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
          </div>
        )}

      </div>

      {/* Exact sub-label (Only shown when compact mode is active and showExactSub is enabled) */}
      {isCompactActive && showExactSub && (
        <div className={`text-muted font-medium flex items-center gap-1 whitespace-nowrap ${exactSizeClass}`}>
          <span className="text-[9px] font-black uppercase text-muted/65">Exact</span>
          <span className="font-mono-calc text-foreground/75">{exact}</span>
        </div>
      )}
    </div>
  );
}
