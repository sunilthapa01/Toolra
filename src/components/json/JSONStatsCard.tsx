'use client';

import React from 'react';
import { calculateJSONStats, JSONStats } from '@/utils/jsonTreeUtils';
import * as Icons from '@/components/Icons';

interface JSONStatsCardProps {
  jsonText: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function JSONStatsCard({ jsonText, isOpen, onToggle }: JSONStatsCardProps) {
  const stats: JSONStats = calculateJSONStats(jsonText);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statItems = [
    { label: 'Objects', value: stats.objectsCount, icon: Icons.Layers, color: 'text-sky-500' },
    { label: 'Arrays', value: stats.arraysCount, icon: Icons.Grid, color: 'text-indigo-500' },
    { label: 'Total Keys', value: stats.keysCount, icon: Icons.Key, color: 'text-emerald-500' },
    { label: 'Max Depth', value: stats.maxDepth, icon: Icons.Code, color: 'text-purple-500' },
    { label: 'Numbers', value: stats.numbersCount, icon: Icons.Hash, color: 'text-amber-500' },
    { label: 'Strings', value: stats.stringsCount, icon: Icons.FileText, color: 'text-teal-500' },
    { label: 'Booleans', value: stats.booleansCount, icon: Icons.CheckCircle, color: 'text-blue-500' },
    { label: 'Nulls', value: stats.nullsCount, icon: Icons.XCircle, color: 'text-rose-500' },
  ];

  return (
    <div className="border-2 border-border/80 rounded-2xl overflow-hidden bg-card shadow-premium-sm transition-all">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/30 border-b border-border/60 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Icons.BarChart2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider font-outfit text-foreground">
            Structural Analytics
          </span>
          <span className="text-xs font-semibold text-muted-foreground font-mono-calc bg-secondary/50 px-2.5 py-0.5 rounded-lg border border-border/60">
            {stats.linesCount} lines • {stats.charsCount} chars • {formatBytes(stats.fileSizeBytes)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <span>{isOpen ? 'Hide' : 'Show'}</span>
          <Icons.ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="bg-card">
          {!stats.isValid && (
            <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
              <Icons.AlertCircle className="h-4 w-4 shrink-0 animate-pulse" />
              <span>Structure metrics unavailable until JSON becomes valid.</span>
            </div>
          )}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono-calc">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border-2 border-border/60 bg-secondary/15 flex flex-col items-center justify-center text-center space-y-1 hover:border-primary/50 transition-colors ${
                    !stats.isValid ? 'opacity-40 select-none' : ''
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-lg font-black text-foreground leading-tight">
                    {stats.isValid ? item.value.toLocaleString() : '—'}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

