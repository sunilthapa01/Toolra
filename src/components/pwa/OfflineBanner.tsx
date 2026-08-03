'use client';

import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import * as Icons from '@/components/Icons';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-md select-none animate-fadeIn tracking-wide border-b border-amber-400/30">
      <Icons.WifiOff className="w-4 h-4 shrink-0 text-white animate-pulse" />
      <span className="text-white drop-shadow-xs">
        Working Offline — All Toolora features remain 100% operational locally
      </span>
    </div>
  );
}
