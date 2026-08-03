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
  const [showModal, setShowModal] = useState<boolean>(false);

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
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerNativePrompt = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
      setShowModal(false);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Header Button with Clear Value Proposition */}
      <button
        onClick={() => {
          if (deferredPrompt) {
            triggerNativePrompt();
          } else {
            setShowModal(true);
          }
        }}
        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 transition-all rounded-xl shadow-md border border-indigo-400/30 cursor-pointer select-none tracking-wide"
        title="Get Toolora Desktop App — Works 100% Offline"
      >
        <Icons.DownloadApp className="w-4 h-4 text-white" />
        <span className="text-white drop-shadow-xs font-outfit uppercase tracking-wider text-[11px] font-black">
          Get Desktop App
        </span>
      </button>

      {/* Feature & Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border-2 border-border p-6 rounded-3xl max-w-md w-full shadow-premium-lg relative space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-muted hover:text-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            {/* Header / Brand Icon */}
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-600/10 text-indigo-500 rounded-2xl border border-indigo-500/20 shadow-xs">
                <Icons.DownloadApp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground font-outfit tracking-tight">
                  Toolora Desktop App
                </h3>
                <p className="text-xs font-semibold text-muted">
                  Fast, private, and 100% offline developer workspace
                </p>
              </div>
            </div>

            {/* Value Proposition Highlights */}
            <div className="space-y-3 bg-secondary/30 p-4 rounded-2xl border border-border/80">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 mt-0.5">
                  <Icons.WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-foreground font-outfit">Works 100% Offline</h4>
                  <p className="text-[11px] text-muted font-medium">Use all developer tools without an internet connection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0 mt-0.5">
                  <Icons.Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-foreground font-outfit">Instant Desktop Launch</h4>
                  <p className="text-[11px] text-muted font-medium">Launch straight from your OS dock/taskbar with 0 latency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg shrink-0 mt-0.5">
                  <Icons.Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-foreground font-outfit">100% Local & Private</h4>
                  <p className="text-[11px] text-muted font-medium">Your data, JSON payloads, and notes never leave your device.</p>
                </div>
              </div>
            </div>

            {/* Browser Install Instructions (If native prompt pending) */}
            {!deferredPrompt && (
              <div className="text-xs text-muted bg-card p-3 rounded-xl border border-border space-y-1">
                <p className="font-bold text-foreground">How to install in 1-click:</p>
                <p className="text-[11px]">
                  Click the <strong>Install Icon (<span className="font-mono bg-secondary px-1 rounded text-foreground">⊕</span>)</strong> on the right end of your browser's address bar, or select <strong>Menu (⋮) → Save & Share → Install Toolora</strong>.
                </p>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex items-center gap-3 pt-1">
              {deferredPrompt ? (
                <button
                  onClick={triggerNativePrompt}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Icons.DownloadApp className="w-4 h-4" />
                  <span>Install App Now</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Got It
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-card border border-border text-muted hover:text-foreground font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
