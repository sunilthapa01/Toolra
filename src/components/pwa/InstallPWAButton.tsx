'use client';

import React, { useState, useEffect } from 'react';
import * as Icons from '@/components/Icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone display mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: show interactive PWA install modal with instructions
      setShowGuideModal(true);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 transition-all rounded-xl shadow-md border border-indigo-400/30 cursor-pointer select-none tracking-wide"
        title="Install Toolora as a native Desktop / Mobile App"
      >
        <Icons.DownloadApp className="w-4 h-4 text-white" />
        <span className="text-white drop-shadow-xs">Install App</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border-2 border-border p-6 rounded-2xl max-w-md w-full shadow-premium-lg relative space-y-4">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1 text-muted hover:text-foreground rounded-lg transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600/10 text-indigo-500 rounded-xl border border-indigo-500/20">
                <Icons.DownloadApp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground font-outfit">Install Toolora App</h3>
                <p className="text-xs font-semibold text-muted">Offline-first desktop developer suite</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-foreground bg-secondary/30 p-3.5 rounded-xl border border-border">
              <p className="font-bold text-foreground">To install Toolora on your device:</p>
              <ul className="space-y-2 text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-black text-indigo-500 shrink-0">1.</span>
                  <span><strong>Chrome / Edge:</strong> Click the <strong>Install</strong> icon (<span className="font-mono bg-secondary px-1 py-0.5 rounded text-foreground">⊕</span> or computer icon) on the right end of your browser address bar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-indigo-500 shrink-0">2.</span>
                  <span><strong>Safari (iOS / macOS):</strong> Tap the <strong>Share</strong> button and select <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-indigo-500 shrink-0">3.</span>
                  <span><strong>Other Browsers:</strong> Click browser menu (⋮) → <strong>Save & Share</strong> → <strong>Install Page as App</strong>.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer"
            >
              Got it, Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
