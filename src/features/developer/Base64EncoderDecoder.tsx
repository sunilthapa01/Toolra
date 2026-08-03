'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { validateBase64 } from '@/utils/base64Validator';
import { ValidationError } from '@/utils/jsonValidator';

// Sample plain text loaded instantly
const SAMPLE_TEXT = `Hello World! 🚀
Welcome to Toolora.
Base64 Encoder & Decoder utility.`;

// Stack-safe, Unicode-safe Base64 Encoding
const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  const len = bytes.length;
  // Convert in chunks to avoid call stack limits on huge strings
  const chunk = 8192;
  if (len < chunk) {
    for (let i = 0; i < len; i++) {
      binString += String.fromCharCode(bytes[i]);
    }
  } else {
    for (let i = 0; i < len; i += chunk) {
      const sub = bytes.subarray(i, i + chunk);
      binString += String.fromCharCode.apply(null, Array.from(sub));
    }
  }
  return btoa(binString);
};

// Stack-safe, Unicode-safe Base64 Decoding
const base64ToUtf8 = (base64: string): string => {
  // Strip whitespace before decoding
  const cleanBase64 = base64.replace(/\s/g, '');
  const binString = atob(cleanBase64);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

// Helper to check if a string is a potential Base64 string
const isLikelyBase64 = (str: string): boolean => {
  const trimmed = str.trim().replace(/\s/g, '');
  if (!trimmed) return false;
  // Check alphabet and format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(trimmed)) return false;
  // Base64 lengths are typically multiples of 4 (unpadded can be mod 4 = 2 or 3)
  if (trimmed.length % 4 === 1) return false;
  // Try to decode to check if it's garbage or valid UTF-8
  try {
    const decoded = base64ToUtf8(trimmed);
    // If it decodes to containing mostly printable characters, it's highly likely Base64
    return decoded.length > 0 && !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(decoded.slice(0, 100));
  } catch {
    return false;
  }
};

export default function Base64EncoderDecoder() {
  const { showToast } = useToast();

  // Fullscreen State & Hydration
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Core Editor States
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [autoDetect, setAutoDetect] = useState(true);
  const [liveConversion, setLiveConversion] = useState(true);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  // Sync scroll references
  const leftTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const leftGutterRef = useRef<HTMLDivElement>(null);
  const rightTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const rightGutterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input Size state for warnings
  const byteLength = new TextEncoder().encode(inputText).length;
  const isLargeInput = byteLength > 100000; // > 100KB (debounce)
  const isHugeInput = byteLength > 1048576; // > 1MB (manual only)

  // Analytics Helper
  const trackEvent = useCallback((eventName: string, metadata: any = {}) => {
    console.log(`[Analytics] ${eventName}`, {
      ...metadata,
      timestamp: new Date().toISOString(),
      platform: 'Browser'
    });
  }, []);

  // Synchronize gutters scroll
  const handleLeftScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (leftGutterRef.current) {
      leftGutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleRightScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (rightGutterRef.current) {
      rightGutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Main conversion handler
  const handleConvert = useCallback((rawText = inputText, currentMode = mode) => {
    const trimmed = rawText.trim();
    if (!trimmed) {
      setOutputText('');
      setErrors([]);
      setIsValidated(false);
      return;
    }

    if (currentMode === 'decode') {
      // Validate Base64 formatting first
      const validationErrors = validateBase64(rawText);
      const hasErrors = validationErrors.some(err => err.severity === 'error');

      setErrors(validationErrors);
      setIsValidated(true);

      if (hasErrors) {
        setOutputText('');
        trackEvent('Errors', { type: 'invalid_base64', count: validationErrors.length });
        return;
      }

      try {
        const decoded = base64ToUtf8(rawText);
        setOutputText(decoded);
        setIsSuccessAnimated(true);
        setTimeout(() => setIsSuccessAnimated(false), 1500);

        trackEvent('Successful Conversion', { mode: 'decode', size: byteLength });
      } catch (e: any) {
        setErrors([
          {
            line: 1,
            column: 1,
            message: `Decoder error: ${e.message || 'Malformed base64 block.'}`,
            severity: 'error'
          }
        ]);
        setOutputText('');
        trackEvent('Errors', { type: 'decoder_exception', message: e.message });
      }
    } else {
      // Encode Mode
      try {
        const encoded = utf8ToBase64(rawText);
        setOutputText(encoded);
        setErrors([]);
        setIsValidated(true);
        setIsSuccessAnimated(true);
        setTimeout(() => setIsSuccessAnimated(false), 1500);

        trackEvent('Successful Conversion', { mode: 'encode', size: byteLength });
      } catch (e: any) {
        setErrors([
          {
            line: 1,
            column: 1,
            message: `Encoder error: ${e.message || 'Cannot encode string.'}`,
            severity: 'error'
          }
        ]);
        setOutputText('');
        trackEvent('Errors', { type: 'encoder_exception', message: e.message });
      }
    }
  }, [inputText, mode, byteLength, trackEvent]);

  // Handle mode toggles manually
  const toggleMode = (newMode: 'encode' | 'decode') => {
    if (newMode === mode) return;
    setMode(newMode);
    setInputText('');
    setOutputText('');
    setErrors([]);
    setIsValidated(false);
    if (newMode === 'encode') {
      trackEvent('Encode Click');
    } else {
      trackEvent('Decode Click');
    }
    // Set focus on input
    setTimeout(() => leftTextAreaRef.current?.focus(), 50);
  };

  // Perform Swap Action
  const handleSwap = () => {
    if (!outputText) {
      showToast('Nothing to swap.');
      return;
    }
    const oldInput = inputText;
    const oldOutput = outputText;
    const nextMode = mode === 'encode' ? 'decode' : 'encode';

    setMode(nextMode);
    setInputText(oldOutput);
    setOutputText(oldInput);
    setErrors([]);
    setIsValidated(false);
    showToast('Swapped input and output.');
    trackEvent('Swap', { fromMode: mode, toMode: nextMode });

    // Rerun conversion on swapped content
    setTimeout(() => handleConvert(oldOutput, nextMode), 50);
  };

  // Copy to Clipboard
  const handleCopy = (text: string, label: string) => {
    if (!text) {
      showToast(`No ${label} to copy.`);
      return;
    }
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard.`);
    trackEvent('Copy', { target: label });
  };

  // Download converted result
  const handleDownload = () => {
    const content = outputText;
    if (!content) {
      showToast('Nothing to download.');
      return;
    }

    const filename = mode === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename} successfully.`);
    trackEvent('Download', { mode });
  };

  // Upload file text content
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setErrors([]);
      setIsValidated(false);
      showToast(`Uploaded "${file.name}" successfully.`);
      trackEvent('Upload', { filename: file.name, size: file.size });

      // Run auto-detect if enabled
      let activeMode = mode;
      if (autoDetect) {
        const isB64 = isLikelyBase64(text);
        if (isB64 && mode !== 'decode') {
          activeMode = 'decode';
          setMode('decode');
          showToast('Detected Base64 input, switched to Decode mode.');
        } else if (!isB64 && mode !== 'encode') {
          activeMode = 'encode';
          setMode('encode');
          showToast('Detected plain text input, switched to Encode mode.');
        }
      }

      if (liveConversion && file.size <= 1048576) {
        handleConvert(text, activeMode);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset so the same file can be uploaded again
  };

  // Clear workspace
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setErrors([]);
    setIsValidated(false);
    showToast('Workspace cleared.');
    trackEvent('Clear');
  };

  // Load sample text
  const handleLoadSample = () => {
    const sample = mode === 'encode' ? SAMPLE_TEXT : utf8ToBase64(SAMPLE_TEXT);
    setInputText(sample);
    setErrors([]);
    setIsValidated(false);
    handleConvert(sample, mode);
    showToast('Loaded sample text.');
    trackEvent('Successful Conversion', { mode, size: sample.length, isSample: true });
  };

  // Debounce/Live Conversion effect on Input Changes
  useEffect(() => {
    if (!liveConversion || !inputText.trim() || isHugeInput) {
      if (!inputText.trim()) {
        setOutputText('');
        setErrors([]);
        setIsValidated(false);
      }
      return;
    }

    if (isLargeInput) {
      // Debounce for large strings to prevent lag
      const timer = setTimeout(() => {
        handleConvert(inputText, mode);
      }, 3500); // 3.5 seconds throttle
      return () => clearTimeout(timer);
    } else {
      // Instant conversion for small strings
      handleConvert(inputText, mode);
    }
  }, [inputText, mode, liveConversion, isLargeInput, isHugeInput, handleConvert]);

  // Auto-detect effect on paste/input
  const handleInputChange = (val: string) => {
    setInputText(val);

    if (autoDetect && val.trim().length > 5 && !isHugeInput) {
      const isB64 = isLikelyBase64(val);
      if (isB64 && mode === 'encode') {
        setMode('decode');
        showToast('Auto-detected Base64 string. Switched to Decode.');
        trackEvent('Auto Detect', { detected: 'decode' });
      } else if (!isB64 && mode === 'decode') {
        // Only switch back to encode if it's definitely not base64 and has invalid characters
        const cleanVal = val.replace(/\s/g, '');
        const hasInvalidChars = !/^[A-Za-z0-9+/]*={0,2}$/.test(cleanVal);
        if (hasInvalidChars) {
          setMode('encode');
          showToast('Auto-detected plain text. Switched to Encode.');
          trackEvent('Auto Detect', { detected: 'encode' });
        }
      }
    }
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Manual Run: Ctrl + Enter
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        handleConvert();
      }

      // Swap: Ctrl + Shift + S
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSwap();
      }

      // Toggle Fullscreen: Ctrl + Shift + Z
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }

      // Exit Fullscreen: Esc
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }

      // Clear: Ctrl + K
      if (isCtrlOrCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, mode, handleConvert, isFullscreen]);

  // Autofocus text input on mount
  useEffect(() => {
    leftTextAreaRef.current?.focus();
    // Track Average Input Size periodically
    trackEvent('Average Input Size', { size: byteLength });
  }, []);

  // Jump to specific error line
  const jumpToLine = (lineNum: number) => {
    const textarea = leftTextAreaRef.current;
    if (!textarea) return;

    const lines = inputText.split('\n');
    let offset = 0;
    for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      offset += lines[i].length + 1; // +1 for newline
    }

    textarea.focus();
    textarea.setSelectionRange(offset, offset + (lines[lineNum - 1]?.length || 0));

    // Scroll to position
    const lineHeight = 24; // text-xs leading-6 -> 24px
    textarea.scrollTop = Math.max(0, (lineNum - 5) * lineHeight);
  };

  const inputLines = inputText.split('\n');
  const outputLines = outputText.split('\n');

  // Format Helper: Size Formatter
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const content = (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isFullscreen
          ? 'fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-background p-4 sm:p-6 overflow-y-auto flex flex-col justify-between h-screen w-full font-outfit'
          : 'relative min-h-screen pb-12'
      }`}
    >
      {/* 1. Header with primary mode toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <h3 className="text-sm font-bold font-outfit text-foreground uppercase tracking-widest flex items-center gap-2">
            <Icons.Code className="h-4 w-4 text-primary" />
            Base64 Workspace
          </h3>
          <p className="text-[11px] text-muted">
            Encode plain text strings or decode Base64 data.
          </p>
        </div>

        {/* Encode/Decode toggle switch */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-card border border-border p-1">
            <button
              onClick={() => toggleMode('encode')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                mode === 'encode'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Encode Plain Text
            </button>
            <button
              onClick={() => toggleMode('decode')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                mode === 'decode'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Decode Base64
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/25 border border-border/80">
        {/* Toggle options */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Live conversion switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiveConversion(!liveConversion)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold uppercase transition-all ${
                liveConversion
                  ? 'border-primary bg-primary/5 text-primary font-black'
                  : 'border-border bg-card text-muted hover:text-foreground'
              }`}
              title="Convert text instantly as you type"
            >
              <Icons.Zap className="h-3 w-3" />
              Live: {liveConversion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Auto detect switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoDetect(!autoDetect)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold uppercase transition-all ${
                autoDetect
                  ? 'border-primary bg-primary/5 text-primary font-black'
                  : 'border-border bg-card text-muted hover:text-foreground'
              }`}
              title="Automatically switch modes based on pasted string characteristics"
            >
              <Icons.Shield className="h-3 w-3" />
              Auto Detect: {autoDetect ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.base64,.json,.xml,.csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Text File"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm"
          >
            <Icons.Download className="h-4.5 w-4.5 rotate-180" />
          </button>

          <button
            onClick={handleDownload}
            title="Download Converted File"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm"
          >
            <Icons.Download className="h-4.5 w-4.5" />
          </button>

          <button
            onClick={handleSwap}
            title="Swap Input and Output (Ctrl+Shift+S)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm"
          >
            <Icons.ArrowLeftRight className="h-4.5 w-4.5" />
          </button>

          <div className="h-5 w-px bg-border/80 mx-1" />

          <button
            onClick={() => handleCopy(outputText, 'output')}
            title="Copy Result"
            className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm text-[10px] font-bold uppercase tracking-wider"
          >
            <Icons.Copy className="h-4 w-4" />
            Copy Result
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Workspace (Ctrl+Shift+Z)'}
            className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm text-[10px] font-bold uppercase tracking-wider"
          >
            {isFullscreen ? (
              <>
                <Icons.Minimize2 className="h-4 w-4 text-primary" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Icons.Maximize2 className="h-4 w-4 text-primary" />
                Fullscreen
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            title="Clear Workspace"
            className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-red-500 hover:bg-red-500/5 hover:border-red-500/20 transition-all shadow-premium-sm text-[10px] font-bold uppercase tracking-wider"
          >
            <Icons.X className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Large Input Warning banner */}
      {isHugeInput && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <Icons.AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>
              <strong>Huge input size ({formatSize(byteLength)}).</strong> Live translation is suspended to preserve system response speed. Click the 'Process' button below to convert.
            </span>
          </div>
          <button
            onClick={() => handleConvert()}
            className="bg-amber-500 text-white font-bold px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] hover:bg-amber-600 transition"
          >
            Process Manually
          </button>
        </div>
      )}

      {/* 3. Dual Panels Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Input Editor */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">
              {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadSample}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
              >
                Load Sample
              </button>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted font-mono-calc font-semibold">
                {inputText.length.toLocaleString()} Chars ({formatSize(byteLength)})
              </span>
            </div>
          </div>

          <div className="relative border border-border bg-card hover:border-primary/20 focus-within:border-primary/55 rounded-2xl overflow-hidden flex h-[380px] shadow-premium-sm transition-all">
            {/* Gutter Line Numbers */}
            <div
              ref={leftGutterRef}
              className="w-12 bg-secondary/15 border-r border-border select-none overflow-hidden flex flex-col font-mono-calc text-xs text-right pr-2 pt-4 select-none"
              style={{ height: '100%' }}
            >
              {inputLines.map((_, idx) => {
                const lineNum = idx + 1;
                const hasError = errors.some(err => err.line === lineNum && err.severity === 'error');
                const hasWarning = errors.some(err => err.line === lineNum && err.severity === 'warning');

                return (
                  <div
                    key={idx}
                    onClick={() => hasError && jumpToLine(lineNum)}
                    className={`h-6 leading-6 pr-1 transition-colors flex items-center justify-end gap-1 ${
                      hasError
                        ? 'text-red-500 bg-red-500/10 font-bold cursor-pointer'
                        : hasWarning
                        ? 'text-amber-500 bg-amber-500/10 font-bold'
                        : 'text-muted/40'
                    }`}
                  >
                    {(hasError || hasWarning) && (
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${hasError ? 'bg-red-500' : 'bg-amber-500'}`} />
                    )}
                    <span>{lineNum}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Textarea */}
            <div className="flex-1 relative h-full">
              <textarea
                ref={leftTextAreaRef}
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                onScroll={handleLeftScroll}
                placeholder={
                  mode === 'encode'
                    ? 'Type or paste plain text here to encode...'
                    : 'Paste Base64 string here to decode...'
                }
                spellCheck={false}
                className="w-full h-full bg-transparent border-0 outline-none text-foreground font-mono-calc text-xs leading-6 p-4 resize-none overflow-y-auto whitespace-pre-wrap break-all"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Output Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest flex items-center gap-2">
              {mode === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
              {isSuccessAnimated && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase flex items-center gap-1.5"
                >
                  <Icons.Check className="h-3 w-3" />
                  Translated
                </motion.span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted font-mono-calc font-semibold">
                {outputText.length.toLocaleString()} Chars ({formatSize(new TextEncoder().encode(outputText).length)})
              </span>
            </div>
          </div>

          <div className="relative border border-border bg-card rounded-2xl overflow-hidden flex h-[380px] shadow-premium-sm transition-all">
            {/* Gutter Line Numbers */}
            <div
              ref={rightGutterRef}
              className="w-12 bg-secondary/15 border-r border-border select-none overflow-hidden flex flex-col font-mono-calc text-xs text-right pr-2 pt-4 select-none"
              style={{ height: '100%' }}
            >
              {outputText ? (
                outputLines.map((_, idx) => (
                  <div key={idx} className="h-6 leading-6 text-muted/30">
                    {idx + 1}
                  </div>
                ))
              ) : (
                <div className="h-6 leading-6 text-muted/30 pr-1">1</div>
              )}
            </div>

            {/* Read-Only Output Textarea */}
            <div className="flex-1 relative h-full">
              <textarea
                ref={rightTextAreaRef}
                value={outputText}
                readOnly
                onScroll={handleRightScroll}
                placeholder="Conversion output will display here..."
                spellCheck={false}
                className="w-full h-full bg-transparent border-0 outline-none text-foreground font-mono-calc text-xs leading-6 p-4 resize-none overflow-y-auto whitespace-pre-wrap break-all cursor-text select-text"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Command Center */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border/80 rounded-2xl bg-secondary/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleConvert()}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-md flex items-center gap-2"
          >
            <Icons.Zap className="h-4 w-4" />
            {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
          </button>

          <button
            onClick={handleSwap}
            className="border border-border bg-card hover:bg-secondary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground transition-all shadow-premium-sm flex items-center gap-2"
          >
            <Icons.ArrowLeftRight className="h-4 w-4 text-primary" />
            Swap Panels
          </button>
        </div>

        {/* Keyboard shortcuts helper */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-muted/75 font-semibold">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Ctrl</kbd>
            <span>+</span>
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Enter</kbd>
            <span className="text-muted/50 ml-1">Run</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Ctrl</kbd>
            <span>+</span>
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Shift</kbd>
            <span>+</span>
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">S</kbd>
            <span className="text-muted/50 ml-1">Swap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Ctrl</kbd>
            <span>+</span>
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">K</kbd>
            <span className="text-muted/50 ml-1">Clear</span>
          </div>
        </div>
      </div>

      {/* 5. Validation status panel */}
      <AnimatePresence>
        {isValidated && mode === 'decode' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`border rounded-2xl overflow-hidden shadow-premium-sm ${
              errors.length === 0
                ? 'border-emerald-500/25 bg-emerald-500/5'
                : errors.some(e => e.severity === 'error')
                ? 'border-red-500/25 bg-red-500/5'
                : 'border-amber-500/25 bg-amber-500/5'
            }`}
          >
            {/* Header */}
            <div
              className={`px-5 py-3 border-b flex items-center justify-between ${
                errors.length === 0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : errors.some(e => e.severity === 'error')
                  ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider font-outfit">
                {errors.length === 0 ? (
                  <>
                    <Icons.Shield className="h-4.5 w-4.5" />
                    Validation Status: Base64 is Valid
                  </>
                ) : errors.some(e => e.severity === 'error') ? (
                  <>
                    <Icons.AlertCircle className="h-4.5 w-4.5" />
                    Validation Status: Syntax Errors Detected ({errors.filter(e => e.severity === 'error').length})
                  </>
                ) : (
                  <>
                    <Icons.Info className="h-4.5 w-4.5" />
                    Validation Status: Warnings Detected ({errors.filter(e => e.severity === 'warning').length})
                  </>
                )}
              </div>
              <span className="text-[9px] font-bold opacity-60">LOCAL VERIFICATION</span>
            </div>

            {/* List */}
            <div className="p-5 divide-y divide-border/40">
              {errors.length === 0 ? (
                <div className="text-xs text-muted leading-relaxed">
                  No issues found! The pasted string is a syntactically correct Base64 encoded byte sequence.
                </div>
              ) : (
                errors.map((err, i) => (
                  <div
                    key={i}
                    onClick={() => err.line && err.severity === 'error' && jumpToLine(err.line)}
                    className={`py-3 first:pt-0 last:pb-0 flex items-start gap-4 ${
                      err.severity === 'error' ? 'cursor-pointer hover:bg-secondary/20 rounded-xl p-2.5 transition-colors' : ''
                    }`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase mt-0.5 tracking-wider shrink-0 select-none ${
                        err.severity === 'error'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/10'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                      }`}
                    >
                      {err.severity === 'error' ? `Line ${err.line || 1}` : 'Warning'}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground leading-normal">
                        {err.message}
                      </p>
                      {err.line && err.column && err.severity === 'error' && (
                        <p className="text-[10px] text-muted font-mono-calc">
                          At Line {err.line}, Column {err.column} (Click to select & focus)
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isFullscreen && isMounted && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}
