'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

// Sample text for the paste sample option
const SAMPLE_TEXT = `Toolora Cryptographic Hash Workspace
------------------------------------
Generate digests and verify checksums across multiple algorithms.`;

// Supported algorithms
type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
const ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export default function HashGenerator() {
  const { showToast } = useToast();

  // Fullscreen State & Hydration
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Core Editor States
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [activeHash, setActiveHash] = useState('');
  const [allHashes, setAllHashes] = useState<Record<HashAlgorithm, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': ''
  });

  // File States
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Configuration States
  const [liveUpdate, setLiveUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync scroll references
  const leftTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const leftGutterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input size state
  const byteLength = new TextEncoder().encode(inputText).length;
  const isLargeInput = byteLength > 100000; // > 100KB (triggers debounce warning or manual update option)
  const isHugeInput = byteLength > 1048576; // > 1MB

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

  // Safe file reader
  const handleFile = (selectedFile: File) => {
    // Check for massive files (> 200MB) to warn about memory limits
    if (selectedFile.size > 200 * 1024 * 1024) {
      showToast('Files larger than 200MB may slow down or crash your browser. Proceeding with caution.');
    }

    setFile(selectedFile);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        setFileData(uint8Array);
        trackEvent('Upload', { size: selectedFile.size, type: selectedFile.type });
        showToast(`Loaded "${selectedFile.name}" successfully.`);
      } catch (err: any) {
        showToast(`Error reading file: ${err.message || err}`);
        setFile(null);
        setFileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      showToast('Failed to read file.');
      setFile(null);
      setFileData(null);
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
    e.target.value = ''; // Reset file input
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  // Internal hash computation helper
  const computeHash = async (algo: HashAlgorithm, data: Uint8Array): Promise<string> => {
    if (algo === 'MD5') {
      const { md5 } = await import('@/utils/md5');
      return md5(data);
    }

    // Web Crypto API
    try {
      const hashBuffer = await crypto.subtle.digest(algo, data as any);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err: any) {
      throw new Error(`Failed to compute ${algo}: ${err.message || err}`);
    }
  };

  // Primary hashing executor
  const executeHash = useCallback(async (
    rawData: string | null = inputText,
    rawFileData: Uint8Array | null = fileData,
    currentMode: 'text' | 'file' = inputMode
  ) => {
    let dataToHash: Uint8Array;

    if (currentMode === 'text') {
      if (!rawData) {
        setAllHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
        setActiveHash('');
        return;
      }
      dataToHash = new TextEncoder().encode(rawData);
    } else {
      if (!rawFileData) {
        setAllHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
        setActiveHash('');
        return;
      }
      dataToHash = rawFileData;
    }

    setIsLoading(true);
    try {
      const results: Record<HashAlgorithm, string> = {
        'MD5': '',
        'SHA-1': '',
        'SHA-256': '',
        'SHA-384': '',
        'SHA-512': ''
      };

      // Compute all hashes in parallel for comparative views
      await Promise.all(
        ALGORITHMS.map(async (algo) => {
          results[algo] = await computeHash(algo, dataToHash);
        })
      );

      setAllHashes(results);
      setActiveHash(results[selectedAlgorithm]);
      trackEvent('Generate', { algorithm: selectedAlgorithm, mode: currentMode });
    } catch (err: any) {
      showToast(`Calculation error: ${err.message || err}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, fileData, inputMode, selectedAlgorithm, trackEvent, showToast]);

  // Handle manual generation trigger
  const handleGenerateClick = () => {
    executeHash();
    showToast('Hashes updated.');
  };

  // Sync output when selected algorithm changes
  useEffect(() => {
    setActiveHash(allHashes[selectedAlgorithm] || '');
  }, [selectedAlgorithm, allHashes]);

  // Live Hashing Effect
  useEffect(() => {
    if (!liveUpdate) return;

    if (inputMode === 'text') {
      if (!inputText.trim()) {
        setAllHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
        setActiveHash('');
        return;
      }

      if (isLargeInput) {
        // Debounce larger inputs to avoid lag while typing
        const timer = setTimeout(() => {
          executeHash(inputText, null, 'text');
        }, 800);
        return () => clearTimeout(timer);
      } else {
        // Instant update for smaller texts
        executeHash(inputText, null, 'text');
      }
    } else {
      // File Hashing runs once loaded
      if (fileData) {
        executeHash(null, fileData, 'file');
      }
    }
  }, [inputText, fileData, inputMode, liveUpdate, isLargeInput, executeHash]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (!text) {
      showToast(`No hash value for ${label} to copy.`);
      return;
    }

    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} hash to clipboard.`);
    trackEvent('Copy', { algorithm: label });

    setCopiedStates((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [label]: false }));
    }, 1500);
  };

  // Download checksum file helper
  const handleDownload = () => {
    if (!activeHash) {
      showToast('Nothing to download.');
      return;
    }

    const filename = `${file ? file.name : 'hash'}-${selectedAlgorithm.toLowerCase()}.txt`;
    const labelText = file ? `File: ${file.name}\n` : 'Input: Plain Text\n';
    const content = `${labelText}Algorithm: ${selectedAlgorithm}\nChecksum: ${activeHash}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename}`);
    trackEvent('Download', { algorithm: selectedAlgorithm });
  };

  // Reset/Clear workspace
  const handleClear = () => {
    setInputText('');
    setFile(null);
    setFileData(null);
    setActiveHash('');
    setAllHashes({
      'MD5': '',
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': ''
    });
    showToast('Workspace cleared.');
    trackEvent('Clear');
  };

  // Load sample text
  const handleLoadSample = () => {
    setInputMode('text');
    setInputText(SAMPLE_TEXT);
    setFile(null);
    setFileData(null);
    showToast('Loaded sample text.');
    trackEvent('Sample Loaded');
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl + Enter to process manually
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        executeHash();
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

      // Ctrl + K to clear
      if (isCtrlOrCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, fileData, inputMode, executeHash, isFullscreen]);

  // Autofocus on mount
  useEffect(() => {
    leftTextAreaRef.current?.focus();
    trackEvent('Average Input Size', { initial: 0 });
  }, []);

  const inputLines = inputText.split('\n');

  // Format Helper: Size Formatter
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
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
      {/* Mobile 1-Row Action Bar (< 640px) */}
      <div className="flex sm:hidden items-center justify-between gap-2 p-2 bg-card border-2 border-border/80 rounded-2xl shadow-premium-sm">
        <button
          onClick={handleGenerateClick}
          className="flex-1 py-2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <Icons.Zap className="h-3.5 w-3.5" />
          Generate Hash
        </button>

        <div className="flex items-center gap-1 rounded-xl bg-secondary/30 p-0.5 border border-border/70 overflow-x-auto max-w-[150px] no-scrollbar">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo}
              onClick={() => setSelectedAlgorithm(algo)}
              className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all shrink-0 ${
                selectedAlgorithm === algo
                  ? 'bg-primary text-primary-foreground font-black'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary/30 border border-border/60 text-foreground hover:bg-secondary transition-all shrink-0"
          title="More Actions"
        >
          <Icons.MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop Header Area (>= 640px) */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <h3 className="text-sm font-bold font-outfit text-foreground uppercase tracking-widest flex items-center gap-2">
            <Icons.Shield className="h-4.5 w-4.5 text-primary animate-pulse" />
            Cryptographic Hash Workspace
          </h3>
          <p className="text-[11px] text-muted">
            Fast cryptographic hashing engine supporting MD5, SHA-1, SHA-256, SHA-384, and SHA-512.
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-card border border-border p-1">
            <button
              onClick={() => {
                setInputMode('text');
                trackEvent('Tab Switch', { mode: 'text' });
                setTimeout(() => leftTextAreaRef.current?.focus(), 50);
              }}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                inputMode === 'text'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icons.FileText className="h-3.5 w-3.5" />
              Text Input
            </button>
            <button
              onClick={() => {
                setInputMode('file');
                trackEvent('Tab Switch', { mode: 'file' });
              }}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 ${
                inputMode === 'file'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icons.Download className="h-3.5 w-3.5 rotate-180" />
              File Hash
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Toolbar (>= 640px) */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/25 border border-border/80">
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Hashing Toggle */}
          <button
            onClick={() => {
              setLiveUpdate(!liveUpdate);
              trackEvent('Live Toggle', { state: !liveUpdate });
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-bold uppercase transition-all ${
              liveUpdate
                ? 'border-primary bg-primary/5 text-primary font-black'
                : 'border-border bg-card text-muted hover:text-foreground'
            }`}
            title="Update checksum instantly as you type"
          >
            <Icons.Zap className="h-3.5 w-3.5" />
            Live: {liveUpdate ? 'ON' : 'OFF'}
          </button>

          {/* Active Algorithm Tabs Selector */}
          <div className="flex items-center gap-1 rounded-xl bg-card border border-border p-0.5 overflow-x-auto no-scrollbar max-w-full">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                onClick={() => {
                  setSelectedAlgorithm(algo);
                  trackEvent('Algorithm Used', { algorithm: algo });
                }}
                className={`px-2.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all shrink-0 touch-target ${
                  selectedAlgorithm === algo
                    ? 'bg-secondary text-foreground font-black shadow-sm border border-border/40'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload File to Hash"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm"
          >
            <Icons.Download className="h-4.5 w-4.5 rotate-180" />
          </button>

          <button
            onClick={handleDownload}
            disabled={!activeHash}
            title="Download active checksum file"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icons.Download className="h-4.5 w-4.5" />
          </button>

          <div className="h-5 w-px bg-border/80 mx-1" />

          <button
            onClick={() => handleCopy(activeHash, selectedAlgorithm)}
            disabled={!activeHash}
            title={`Copy ${selectedAlgorithm} Hash`}
            className="inline-flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-muted hover:text-foreground hover:bg-secondary transition-all shadow-premium-sm text-[10px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copiedStates[selectedAlgorithm] ? (
              <>
                <Icons.Check className="h-4 w-4 text-emerald-500 animate-scale-up" />
                Copied!
              </>
            ) : (
              <>
                <Icons.Copy className="h-4 w-4" />
                Copy Hash
              </>
            )}
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
      {isHugeInput && inputMode === 'text' && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <Icons.AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>
              <strong>Huge string detected ({formatSize(byteLength)}).</strong> Live-updating is throttled to save performance. Click 'Generate Hash' to compute digests manually.
            </span>
          </div>
          <button
            onClick={handleGenerateClick}
            className="bg-amber-500 text-white font-bold px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] hover:bg-amber-600 transition"
          >
            Process Manually
          </button>
        </div>
      )}

      {/* 3. Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel: Input Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">
              {inputMode === 'text' ? 'Text Input Source' : 'File Input Source'}
            </span>
            <div className="flex items-center gap-2">
              {inputMode === 'text' ? (
                <>
                  <button
                    onClick={handleLoadSample}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    Paste Sample
                  </button>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted font-mono font-semibold">
                    {inputText.length.toLocaleString()} Chars ({formatSize(byteLength)})
                  </span>
                </>
              ) : (
                file && (
                  <span className="text-[10px] text-muted font-mono font-semibold">
                    Size: {formatSize(file.size)}
                  </span>
                )
              )}
            </div>
          </div>

          {inputMode === 'text' ? (
            /* Text input area with line numbers gutter */
            <div className="relative border border-border bg-card hover:border-primary/20 focus-within:border-primary/55 rounded-2xl overflow-hidden flex h-[calc(100vh-190px)] sm:h-[380px] shadow-premium-sm transition-all">
              <div
                ref={leftGutterRef}
                className="w-12 bg-secondary/15 border-r border-border select-none overflow-hidden flex flex-col font-mono text-xs text-right pr-2 pt-4"
                style={{ height: '100%' }}
              >
                {inputLines.map((_, idx) => (
                  <div key={idx} className="h-6 leading-6 text-muted/30">
                    {idx + 1}
                  </div>
                ))}
              </div>

              <div className="flex-1 relative h-full">
                <textarea
                  ref={leftTextAreaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onScroll={handleLeftScroll}
                  placeholder="Type or paste plain text here to compute hash digests..."
                  spellCheck={false}
                  className="w-full h-full bg-transparent border-0 outline-none text-foreground font-mono text-xs leading-6 p-4 resize-none overflow-y-auto whitespace-pre-wrap break-all"
                />
              </div>
            </div>
          ) : (
            /* File upload & drag zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl h-[calc(100vh-190px)] sm:h-[380px] flex flex-col items-center justify-center p-6 text-center transition-all ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : file
                  ? 'border-border bg-card'
                  : 'border-border hover:border-primary/20 hover:bg-secondary/10 bg-card'
              }`}
            >
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 w-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-muted">Reading file bytes locally...</p>
                </div>
              ) : file ? (
                <div className="space-y-6 max-w-md">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-premium-sm">
                    <Icons.FileText className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-foreground break-all">{file.name}</h4>
                    <p className="text-xs text-muted">
                      Type: {file.type || 'Unknown Format'} | Size: {formatSize(file.size)}
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-border bg-card rounded-xl text-xs font-bold text-foreground hover:bg-secondary transition"
                    >
                      Choose Different File
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setFileData(null);
                        setAllHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
                        setActiveHash('');
                      }}
                      className="px-4 py-2 border border-red-500/20 text-red-500 bg-red-500/5 rounded-xl text-xs font-bold hover:bg-red-500/10 transition"
                    >
                      Remove File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="h-14 w-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto text-muted group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <Icons.Download className="h-7 w-7 rotate-180 text-muted/60" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Drag & Drop Your File Here
                    </p>
                    <p className="text-[11px] text-muted max-w-xs leading-relaxed">
                      Or click to browse from your device. Supported up to 200MB. Processed offline instantly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Output & Digest display */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest flex items-center gap-2">
              {selectedAlgorithm} Hash Output
              {isLoading && (
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              )}
            </span>
            {activeHash && (
              <button
                onClick={() => handleCopy(activeHash, selectedAlgorithm)}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                <Icons.Copy className="h-3 w-3" />
                Quick Copy
              </button>
            )}
          </div>

          <div className="relative border border-border bg-card rounded-2xl p-5 flex flex-col justify-between h-[calc(100vh-190px)] sm:h-[380px] shadow-premium-sm">
            {/* Hash content container */}
            <div className="flex-1 flex flex-col justify-center">
              {activeHash ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="bg-secondary/40 border border-border/80 rounded-2xl p-5 break-all font-mono text-xs sm:text-sm text-foreground select-all leading-relaxed shadow-premium-inner text-center font-bold tracking-wide">
                      {activeHash}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted text-center flex items-center justify-center gap-1.5">
                    <Icons.Lock className="h-3.5 w-3.5 text-primary" />
                    Secure client-side digest generated locally
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 text-muted">
                  <Icons.Shield className="h-10 w-10 mx-auto text-muted/40" />
                  <p className="text-xs">
                    {inputMode === 'text'
                      ? 'Type some text to view generated hash digest...'
                      : 'Load a file to calculate cryptographic checksums...'}
                  </p>
                </div>
              )}
            </div>

            {/* Micro-table showing all calculated digests for comparison */}
            {Object.values(allHashes).some(Boolean) && (
              <div className="border-t border-border/60 pt-4 mt-4 space-y-2">
                <span className="text-[9px] font-black text-muted uppercase tracking-wider block">
                  All Computed Digests (Comparative List)
                </span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {ALGORITHMS.map((algo) => {
                    const hashVal = allHashes[algo];
                    return (
                      <div
                        key={algo}
                        className={`flex items-center justify-between gap-4 p-2 rounded-xl text-xs transition border ${
                          selectedAlgorithm === algo
                            ? 'border-primary/20 bg-primary/[0.02]'
                            : 'border-transparent bg-secondary/15 hover:bg-secondary/25'
                        }`}
                      >
                        <span className="font-bold font-outfit text-[10px] text-foreground/80 shrink-0 w-14">
                          {algo}
                        </span>
                        <span className="font-mono text-[10px] truncate break-all select-all text-muted flex-1 text-right">
                          {hashVal ? `${hashVal.slice(0, 12)}...${hashVal.slice(-12)}` : '—'}
                        </span>
                        <button
                          onClick={() => handleCopy(hashVal, algo)}
                          disabled={!hashVal}
                          className="shrink-0 p-1 hover:text-primary transition-all disabled:opacity-30"
                          title={`Copy ${algo} hash`}
                        >
                          {copiedStates[algo] ? (
                            <Icons.Check className="h-3.5 w-3.5 text-emerald-500 animate-scale-up" />
                          ) : (
                            <Icons.Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border/80 rounded-2xl bg-secondary/10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateClick}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-md flex items-center gap-2"
          >
            <Icons.Zap className="h-4 w-4" />
            Generate Hash
          </button>

          {inputMode === 'text' && (
            <button
              onClick={handleLoadSample}
              className="border border-border bg-card hover:bg-secondary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground transition-all shadow-premium-sm flex items-center gap-2"
            >
              <Icons.FileText className="h-4 w-4 text-primary" />
              Paste Sample
            </button>
          )}
        </div>

        {/* Keyboard shortcut display */}
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
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">K</kbd>
            <span className="text-muted/50 ml-1">Clear</span>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Up Actions Bottom Sheet */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] sm:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] bg-card border-t-2 border-border/80 rounded-t-3xl p-5 space-y-4 shadow-2xl sm:hidden font-outfit"
            >
              <div className="w-12 h-1.5 bg-border/80 rounded-full mx-auto" />
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Icons.Shield className="h-4 w-4 text-primary" />
                  Hash Workspace Utilities
                </h4>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <Icons.X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                <button
                  onClick={() => {
                    setInputMode(inputMode === 'text' ? 'file' : 'text');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground"
                >
                  <Icons.FileText className="h-4 w-4 text-primary" />
                  Mode: {inputMode === 'text' ? 'Text' : 'File'}
                </button>

                <button
                  onClick={() => {
                    handleLoadSample();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground"
                >
                  <Icons.FileText className="h-4 w-4 text-primary" />
                  Paste Sample
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground"
                >
                  <Icons.Download className="h-4 w-4 text-primary rotate-180" />
                  Upload File
                </button>

                <button
                  onClick={() => {
                    handleDownload();
                    setIsMobileDrawerOpen(false);
                  }}
                  disabled={!activeHash}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground disabled:opacity-40"
                >
                  <Icons.Download className="h-4 w-4 text-emerald-500" />
                  Download Checksum
                </button>

                <button
                  onClick={() => {
                    handleCopy(activeHash, selectedAlgorithm);
                    setIsMobileDrawerOpen(false);
                  }}
                  disabled={!activeHash}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground disabled:opacity-40"
                >
                  <Icons.Copy className="h-4 w-4 text-amber-500" />
                  Copy Hash
                </button>

                <button
                  onClick={() => {
                    setLiveUpdate(!liveUpdate);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground"
                >
                  <Icons.Zap className="h-4 w-4 text-primary" />
                  Live: {liveUpdate ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl border border-border/60 text-foreground"
                >
                  <Icons.Maximize2 className="h-4 w-4 text-primary" />
                  Fullscreen
                </button>

                <button
                  onClick={() => {
                    handleClear();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20"
                >
                  <Icons.X className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  if (isFullscreen && isMounted && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}
