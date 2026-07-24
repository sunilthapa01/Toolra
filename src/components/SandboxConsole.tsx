'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from './Icons';

export default function SandboxConsole() {
  const [calcCount, setCalcCount] = useState(1482);

  useEffect(() => {
    const calcInterval = setInterval(() => {
      setCalcCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);

    return () => {
      clearInterval(calcInterval);
    };
  }, []);

  const trustBadges = [
    {
      title: 'Local Sandboxed Engine',
      desc: 'All algorithms process values purely in your local browser memory. No network connections are opened.',
      icon: <Icons.Shield className="h-4.5 w-4.5 text-emerald-600" />,
    },
    {
      title: 'No Tracker Policy',
      desc: 'We do not load third-party analytics cookies or marketing trackers. Your business logs remain private.',
      icon: <Icons.Lock className="h-4.5 w-4.5 text-blue-600" />,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-6 space-y-6">
      
      {/* Privacy Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block">
            Calculations Run
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-calc text-foreground tracking-tight">
            {calcCount.toLocaleString()}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block">
            Security Status
          </span>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-2.5 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Offline</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        {trustBadges.map((badge, idx) => (
          <div key={idx} className="flex gap-3.5 items-start">
            <div className="p-1.5 rounded-xl bg-secondary border border-border/60 shrink-0">
              {badge.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-tight">
                {badge.title}
              </div>
              <div className="text-[11px] text-muted leading-relaxed mt-0.5">
                {badge.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
