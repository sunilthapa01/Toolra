'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/tools/types';
import * as Icons from './Icons';

interface ComingSoonProps {
  tool: ToolDefinition;
}

export default function ComingSoonToolPage({ tool }: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
    }, 800);
  };

  const checklistItems = [
    { label: 'Design and usability review', done: true },
    { label: 'Core calculation logic implemented', done: true },
    { label: 'Browser storage optimization', done: false },
    { label: 'Privacy and data safety testing', done: false },
  ];

  const categoryMetadata: Record<string, { label: string; text: string; bg: string; border: string }> = {
    finance: { label: 'Finance', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-500/20' },
    developer: { label: 'Developer', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-500/20' },
    pdf: { label: 'PDF Tools', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-500/20' },
    text: { label: 'Text Tools', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-500/20' },
    business: { label: 'Business Tools', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-500/20' },
  };

  const meta = categoryMetadata[tool.category] || { label: 'General', text: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-8">
      {/* Title Header */}
      <div className="space-y-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${meta.bg} ${meta.text} ${meta.border} shadow-premium-sm`}>
          Coming Soon
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground tracking-tight pt-2">
          {tool.title} is coming soon
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed font-medium">
          {tool.description} We run all our tools locally in your browser to keep your data private. Register below to be notified as soon as this tool is ready.
        </p>
      </div>

      {/* Subscription Form card */}
      <div className="p-6 bg-card border border-border rounded-2xl space-y-4 shadow-premium-md">
        {subscribed ? (
          <div className="border border-emerald-500 bg-emerald-500/5 p-4 rounded-xl flex items-center gap-3 text-emerald-600">
            <Icons.Check className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Successfully registered for updates on {tool.title}.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 border border-border bg-background px-4 py-3 rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-sm"
            >
              {subscribing ? 'Submitting...' : 'Register'}
            </button>
          </form>
        )}
        <p className="text-[10px] text-muted/60 leading-normal">
          We respect your privacy and will only email you regarding updates for this tool.
        </p>
      </div>

      {/* Development Checklist Visual */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted font-outfit">
          Development Progress
        </h4>
        <ul className="space-y-3">
          {checklistItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-xs text-muted font-semibold uppercase tracking-tight">
              {item.done ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-emerald-500 text-white rounded-lg font-bold text-[10px] shadow-premium-sm">
                  ✓
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary text-muted rounded-lg text-[10px]">
                  •
                </span>
              )}
              <span className={item.done ? 'line-through opacity-45' : ''}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
