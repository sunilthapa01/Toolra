'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 dark:bg-background/85 backdrop-blur-md text-foreground overflow-hidden select-none"
    >
      {/* Background subtle blueprint grid */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />
      
      {/* Ambient glowing radial light matching theme primary */}
      <div className="absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse pointer-events-none" />

      {/* Assembly Container */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        
        {/* Animated logo box */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          
          {/* Subtle gradient radial background glow */}
          <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-xl animate-pulse" />

          {/* SVG Canvas for drawing the logo */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary"
          >
            {/* Blueprint outer box drafting line */}
            <motion.rect
              x="6"
              y="6"
              width="84"
              height="84"
              rx="18"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Finished solid rounded-xl outline */}
            <motion.rect
              x="8"
              y="8"
              width="80"
              height="80"
              rx="16"
              stroke="currentColor"
              strokeWidth="2.5"
              initial={{ pathLength: 0, strokeDasharray: "280", strokeDashoffset: "280" }}
              animate={{ pathLength: 1, strokeDashoffset: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Inside drawing lines representing measuring tools */}
            <motion.line
              x1="22"
              y1="22"
              x2="74"
              y2="74"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
            />
            <motion.line
              x1="74"
              y1="22"
              x2="22"
              y2="74"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
            />

            {/* Bold Letter T Assembly */}
            <motion.path
              d="M26 30 H70"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
            />
            <motion.path
              d="M48 30 V66"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25, duration: 0.25, ease: "easeOut" }}
            />

            {/* Ticks */}
            <motion.circle
              cx="48"
              cy="66"
              r="2.5"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45, duration: 0.15 }}
            />
            <motion.circle
              cx="26"
              cy="30"
              r="2.5"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, duration: 0.15 }}
            />
            <motion.circle
              cx="70"
              cy="30"
              r="2.5"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, duration: 0.15 }}
            />
          </svg>
        </div>

        {/* Text and status sequence */}
        <div className="flex flex-col items-center gap-1 text-center">
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="text-xs font-black uppercase tracking-[0.25em] text-foreground font-outfit"
          >
            Toolora
          </motion.span>
          
          <div className="h-5 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 1.8, 
                times: [0, 0.2, 0.8, 1],
                repeat: Infinity,
              }}
              className="text-[10px] font-bold text-muted uppercase tracking-widest"
            >
              Loading workspace...
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
