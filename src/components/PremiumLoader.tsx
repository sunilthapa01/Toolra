'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#11100F] text-[#F5F4F0] overflow-hidden select-none">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 blueprint-grid blueprint-grid-sub opacity-35" />
      
      {/* Blueprint main axes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-[1px] bg-primary/10 border-t border-dashed border-primary/20"
        />
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full w-[1px] bg-primary/10 border-l border-dashed border-primary/20"
        />
      </div>

      {/* Circular technical coordinates */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <motion.svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className="text-primary/10"
        >
          <motion.circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="40 10"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </motion.svg>
      </div>

      {/* Assembly Container */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        
        {/* Animated logo box */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          
          {/* Subtle gradient radial background glow */}
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse" />

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
              strokeOpacity="0.25"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
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
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Inside drawing lines representing measuring tools */}
            <motion.line
              x1="22"
              y1="22"
              x2="74"
              y2="74"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.line
              x1="74"
              y1="22"
              x2="22"
              y2="74"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />

            {/* Bold Letter T Assembly */}
            {/* Horizontal Bar */}
            <motion.path
              d="M26 30 H70"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            />
            {/* Vertical Stem */}
            <motion.path
              d="M48 30 V66"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
            />

            {/* Drafting ticks (compass points) */}
            <motion.circle
              cx="48"
              cy="66"
              r="2"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, duration: 0.2 }}
            />
            <motion.circle
              cx="26"
              cy="30"
              r="2"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.2 }}
            />
            <motion.circle
              cx="70"
              cy="30"
              r="2"
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.2 }}
            />
          </svg>
        </div>

        {/* Text and intelligent status sequence */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xs font-black uppercase tracking-[0.25em] text-[#F5F4F0]/90 font-outfit"
          >
            Toolora
          </motion.div>
          
          <div className="h-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.15, 0.85, 1],
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="text-[9px] font-bold text-muted uppercase tracking-widest"
            >
              Assembling private environment...
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Blueprint Corner Marks */}
      <div className="absolute top-6 left-6 text-primary/30 font-mono text-[9px] select-none pointer-events-none">
        SYS.LOC_01 // SECURE_MODE
      </div>
      <div className="absolute bottom-6 right-6 text-primary/30 font-mono text-[9px] select-none pointer-events-none">
        © TOOLORA.COM // REV_2026
      </div>
    </div>
  );
}
