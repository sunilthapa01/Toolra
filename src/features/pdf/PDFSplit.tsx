'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    PDFLib: any;
    pdfjsLib: any;
    JSZip: any;
  }
}

interface SplitPageItem {
  index: number; // 0-based
  isSelected: boolean;
}

interface PDFFile {
  name: string;
  size: number;
  file: File;
  pageCount: number;
  pages: SplitPageItem[];
  password?: string;
  isLocked: boolean;
  isParsing: boolean;
  error?: string;
  thumbnailUrl?: string;
  pagePreviews: string[];
}

interface SplitHistoryItem {
  id: string;
  timestamp: number;
  originalName: string;
  splitMode: string;
  filesCount: number;
  size: number;
}

export default function PDFSplit() {
  const { showToast } = useToast();
  
  // Library load states
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [libsLoadingError, setLibsLoadingError] = useState(false);

  // Files & processing states
  const [fileObj, setFileObj] = useState<PDFFile | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitProgress, setSplitProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  // Settings & modes
  const [splitMode, setSplitMode] = useState<'extract' | 'points' | 'intervals'>('extract');
  const [extractRange, setExtractRange] = useState<string>('all');
  const [extractType, setExtractType] = useState<'single' | 'individual'>('single');
  const [intervalsSize, setIntervalsSize] = useState<number>(2);
  const [splitPoints, setSplitPoints] = useState<Set<number>>(new Set());

  // Result state
  const [splitResult, setSplitResult] = useState<{
    blob: Blob;
    url: string;
    size: number;
    filesCount: number;
    name: string;
    isZip: boolean;
  } | null>(null);
  const [history, setHistory] = useState<SplitHistoryItem[]>([]);

  // HTML Input references
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Dynamic CDN Loading of pdf-lib, pdfjs-dist, and jszip
  useEffect(() => {
    let active = true;

    async function loadLibraries() {
      try {
        if (window.PDFLib && window.pdfjsLib && window.JSZip) {
          if (active) setLibsLoaded(true);
          return;
        }

        const loadScript = (src: string) => {
          return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(script);
          });
        };

        // Load pdf-lib
        if (!window.PDFLib) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');
        }

        // Load pdfjs-dist
        if (!window.pdfjsLib) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        // Load jszip
        if (!window.JSZip) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        }

        if (active) {
          setLibsLoaded(true);
          trackEvent('PDFSplitEngineInitialized', { status: 'success' });
        }
      } catch (err) {
        console.error('Error loading libraries:', err);
        if (active) setLibsLoadingError(true);
      }
    }

    loadLibraries();
    
    // Load merge/split history
    try {
      const stored = localStorage.getItem('toolora-pdf-split-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }

    return () => {
      active = false;
    };
  }, []);

  const trackEvent = (eventName: string, metadata: any = {}) => {
    console.log(`[Analytics] ${eventName}`, {
      ...metadata,
      timestamp: new Date().toISOString(),
      platform: 'Browser'
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 2. Document file uploader
  const handleFileAdded = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    
    const targetFile = files[0]; // Splitter processes one file at a time
    const isPDF = targetFile.type === 'application/pdf' || targetFile.name.toLowerCase().endsWith('.pdf');
    
    if (!isPDF) {
      showToast(`Rejected "${targetFile.name}": Only PDF files are supported.`);
      return;
    }

    trackEvent('SplitUploadStarted', { filename: targetFile.name, size: targetFile.size });
    
    setSplitPoints(new Set());
    setSplitResult(null);

    const initialFileState: PDFFile = {
      name: targetFile.name,
      size: targetFile.size,
      file: targetFile,
      pageCount: 0,
      pages: [],
      isLocked: false,
      isParsing: true,
      pagePreviews: []
    };

    setFileObj(initialFileState);
    parseAndGeneratePreviews(targetFile, undefined);
  };

  // 3. Parser & Previews
  const parseAndGeneratePreviews = async (file: File, password?: string) => {
    try {
      const buffer = await file.arrayBuffer();
      let pdfDoc;

      try {
        pdfDoc = await window.PDFLib.PDFDocument.load(buffer, password ? { password } : undefined);
      } catch (err: any) {
        const isLocked = 
          err.message.includes('password') || 
          err.message.includes('Password') || 
          err.message.includes('encrypted') || 
          err.message.includes('decrypt');

        if (isLocked) {
          setFileObj(prev => prev ? { 
            ...prev, 
            isLocked: true, 
            isParsing: false, 
            error: 'Password protected. Enter password to unlock.' 
          } : null);
          trackEvent('SplitUploadError', { reason: 'PasswordProtected', filename: file.name });
          return;
        }
        throw err;
      }

      const pageCount = pdfDoc.getPageCount();
      const initialPages = Array.from({ length: pageCount }, (_, i) => ({
        index: i,
        isSelected: true
      }));

      setFileObj(prev => prev ? {
        ...prev,
        pageCount,
        pages: initialPages,
        isLocked: false,
        isParsing: false,
        password,
        error: undefined
      } : null);

      trackEvent('SplitUploadCompleted', { filename: file.name, pages: pageCount });
      renderThumbnails(buffer, pageCount, password);

    } catch (err: any) {
      console.error(err);
      setFileObj(prev => prev ? {
        ...prev,
        isParsing: false,
        error: 'Corrupted or broken PDF file.'
      } : null);
      trackEvent('SplitUploadError', { reason: 'Corrupted', filename: file.name });
    }
  };

  const renderThumbnails = async (buffer: ArrayBuffer, pageCount: number, password?: string) => {
    try {
      const pdfjs = window.pdfjsLib;
      const loadingTask = pdfjs.getDocument({ 
        data: new Uint8Array(buffer),
        password
      });
      const pdf = await loadingTask.promise;

      // Extract thumbnails for pages (up to 30 pages to prevent memory leaks)
      const maxPreviews = Math.min(pageCount, 30);
      const previews: string[] = [];

      for (let i = 1; i <= maxPreviews; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.22 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          previews.push(canvas.toDataURL());
        }
      }

      setFileObj(prev => prev ? {
        ...prev,
        thumbnailUrl: previews[0],
        pagePreviews: previews
      } : null);

    } catch (err) {
      console.error('Failed to render previews', err);
    }
  };

  const handleUnlockFile = (password: string) => {
    if (!fileObj) return;
    setFileObj(prev => prev ? { ...prev, isParsing: true, error: undefined } : null);
    parseAndGeneratePreviews(fileObj.file, password);
  };

  // 4. Page selections
  const togglePageSelection = (index: number) => {
    if (!fileObj) return;
    setFileObj(prev => {
      if (!prev) return null;
      const updatedPages = prev.pages.map(p => 
        p.index === index ? { ...p, isSelected: !p.isSelected } : p
      );
      return {
        ...prev,
        pages: updatedPages
      };
    });
  };

  const selectAllPages = (select: boolean) => {
    if (!fileObj) return;
    setFileObj(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pages: prev.pages.map(p => ({ ...p, isSelected: select }))
      };
    });
  };

  // 5. Visual Split Points dividers
  const toggleSplitPoint = (index: number) => {
    setSplitPoints(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Helper to parse page range input text
  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const trimmed = rangeStr.replace(/\s+/g, '').toLowerCase();
    if (!trimmed || trimmed === 'all') {
      return Array.from({ length: maxPages }, (_, i) => i);
    }

    const pages: number[] = [];
    const parts = trimmed.split(',');

    for (let part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(maxPages, Math.max(start, end));
          for (let i = min; i <= max; i++) {
            pages.push(i - 1);
          }
        }
      } else {
        const val = parseInt(part, 10);
        if (!isNaN(val) && val >= 1 && val <= maxPages) {
          pages.push(val - 1);
        }
      }
    }

    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  // 6. Split Processor engine
  const executeSplit = async () => {
    if (!fileObj) return;
    setIsSplitting(true);
    setSplitProgress(10);
    trackEvent('SplitStarted', { mode: splitMode });

    try {
      const PDFLib = window.PDFLib;
      const fileBuffer = await fileObj.file.arrayBuffer();
      const sourcePdf = await PDFLib.PDFDocument.load(fileBuffer, fileObj.password ? { password: fileObj.password } : undefined);
      const totalPages = sourcePdf.getPageCount();

      // Configure the split groups: Array of page index arrays
      let splitGroups: number[][] = [];

      if (splitMode === 'extract') {
        // Mode 1: Extract pages based on selection or manual range
        let selectedIndices: number[] = [];
        if (extractRange === 'all') {
          selectedIndices = fileObj.pages
            .filter(p => p.isSelected)
            .map(p => p.index);
        } else {
          selectedIndices = parsePageRange(extractRange, totalPages);
        }

        if (selectedIndices.length === 0) {
          showToast('No pages selected for extraction.');
          setIsSplitting(false);
          return;
        }

        if (extractType === 'single') {
          // compile selected pages into one PDF
          splitGroups = [selectedIndices];
        } else {
          // compile selected pages into individual PDFs
          splitGroups = selectedIndices.map(idx => [idx]);
        }

      } else if (splitMode === 'intervals') {
        // Mode 2: Split by intervals (N pages each)
        if (intervalsSize < 1 || isNaN(intervalsSize)) {
          showToast('Please enter a valid interval count.');
          setIsSplitting(false);
          return;
        }
        
        let currentGroup: number[] = [];
        for (let i = 0; i < totalPages; i++) {
          currentGroup.push(i);
          if (currentGroup.length === intervalsSize || i === totalPages - 1) {
            splitGroups.push(currentGroup);
            currentGroup = [];
          }
        }

      } else if (splitMode === 'points') {
        // Mode 3: Custom visual split points dividers
        let currentGroup: number[] = [];
        for (let i = 0; i < totalPages; i++) {
          currentGroup.push(i);
          if (splitPoints.has(i) || i === totalPages - 1) {
            splitGroups.push(currentGroup);
            currentGroup = [];
          }
        }
      }

      if (splitGroups.length === 0) {
        showToast('No split ranges configured.');
        setIsSplitting(false);
        return;
      }

      setSplitProgress(40);

      // Create new PDFs in-memory
      const generatedFiles: { name: string; bytes: any }[] = [];
      const baseName = fileObj.name.replace(/\.pdf$/i, '');

      for (let k = 0; k < splitGroups.length; k++) {
        setSplitProgress(40 + Math.floor((k / splitGroups.length) * 40));
        const indices = splitGroups[k];

        const newPdf = await PDFLib.PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, indices);
        copiedPages.forEach((page: any) => newPdf.addPage(page));

        const bytes = await newPdf.save();
        
        // Generate document name
        let name = `${baseName}-part-${k + 1}.pdf`;
        if (splitMode === 'extract' && extractType === 'individual') {
          name = `${baseName}-page-${indices[0] + 1}.pdf`;
        }

        generatedFiles.push({ name, bytes });
      }

      setSplitProgress(85);

      // 7. Zip packing if multiple output files are created
      let finalBlob: Blob;
      let finalUrl: string;
      let isZip = false;
      let finalName: string;

      if (generatedFiles.length === 1) {
        finalBlob = new Blob([generatedFiles[0].bytes], { type: 'application/pdf' });
        finalUrl = URL.createObjectURL(finalBlob);
        finalName = generatedFiles[0].name;
      } else {
        const zip = new window.JSZip();
        generatedFiles.forEach(f => {
          zip.file(f.name, f.bytes);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        finalBlob = zipBlob;
        finalUrl = URL.createObjectURL(zipBlob);
        finalName = `${baseName}-split-package.zip`;
        isZip = true;
      }

      setSplitResult({
        blob: finalBlob,
        url: finalUrl,
        size: finalBlob.size,
        filesCount: generatedFiles.length,
        name: finalName,
        isZip
      });

      // Save to local history
      const historyItem: SplitHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        originalName: fileObj.name,
        splitMode: splitMode === 'extract' ? 'Page Extraction' : splitMode === 'intervals' ? 'Interval Splits' : 'Custom Split Points',
        filesCount: generatedFiles.length,
        size: finalBlob.size
      };

      setHistory(prev => {
        const updated = [historyItem, ...prev.slice(0, 9)];
        localStorage.setItem('toolora-pdf-split-history', JSON.stringify(updated));
        return updated;
      });

      setSplitProgress(100);
      setIsSplitting(false);
      showToast('PDF extraction/split completed!');
      trackEvent('SplitCompleted', { filesCount: generatedFiles.length, isZip });

    } catch (err: any) {
      console.error(err);
      setIsSplitting(false);
      setSplitProgress(0);
      showToast(`Split failed: ${err.message || 'Processing error'}`);
      trackEvent('SplitError', { message: err.message });
    }
  };

  const startOver = () => {
    setFileObj(null);
    setSplitResult(null);
    setSplitProgress(0);
    setSplitPoints(new Set());
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolora-pdf-split-history');
    showToast('Local history logs cleared.');
  };

  return (
    <div className="space-y-12">
      {/* Dynamic CDN load state */}
      {!libsLoaded && !libsLoadingError && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <Icons.FileText className="absolute h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold font-outfit text-foreground uppercase tracking-widest">Initializing Secure PDF Engine</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">Loading split and zip libraries dynamically in browser...</p>
          </div>
        </div>
      )}

      {libsLoadingError && (
        <div className="border border-red-500/30 bg-red-500/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <Icons.AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Failed to Initialize PDF Engine</h3>
            <p className="text-xs text-muted mt-1">We couldn't load the required script files. Please check your internet connection and refresh the page.</p>
          </div>
        </div>
      )}

      {libsLoaded && (
        <div className="space-y-8">
          
          {/* Main workspace */}
          {!fileObj && !splitResult ? (
            
            // Upload zone: Big interactive box
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files) {
                  handleFileAdded(e.dataTransfer.files);
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-10 md:p-16 text-center transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center gap-4 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-[0.99]' 
                  : 'border-border bg-secondary/15 hover:border-primary/30'
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/80 text-primary shadow-premium-md transition-transform group-hover:scale-105">
                <Icons.Download className="h-7 w-7 rotate-180" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold font-outfit text-foreground">
                  Drag & Drop PDF file here
                </h3>
                <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                  or click to browse. Processing is executed entirely on your CPU.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files) handleFileAdded(e.target.files);
                }}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-colors shadow-premium-sm mt-2"
              >
                Browse File
              </button>

              <div className="text-[10px] text-muted/65 uppercase tracking-wider font-semibold mt-4 flex items-center gap-3">
                <span>🔒 CLIENT-SIDE</span>
                <span>•</span>
                <span>⚡ SECURE</span>
                <span>•</span>
                <span>💻 WORKS OFFLINE</span>
              </div>
            </div>
            
          ) : splitResult ? (

            // Success ZIP / PDF Download Box
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary/10 border border-border/80 rounded-3xl p-6 sm:p-10 text-center space-y-6"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-premium-md relative">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-25" />
                  <Icons.Check className="h-8 w-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">PDF Split Successful!</h2>
                <p className="text-xs text-muted max-w-md">Your files were generated and compiled locally inside temporary memory.</p>
              </div>

              {/* Summary Stats Table */}
              <div className="bg-card border border-border rounded-2xl p-5 max-w-md mx-auto grid grid-cols-2 gap-4 divide-x divide-border/60">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Files Generated</span>
                  <span className="text-lg font-mono-calc font-extrabold text-foreground">{splitResult.filesCount}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Package Size</span>
                  <span className="text-lg font-mono-calc font-extrabold text-foreground">{formatBytes(splitResult.size)}</span>
                </div>
              </div>

              {/* Action Buttons deck */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
                <a
                  href={splitResult.url}
                  download={splitResult.name}
                  onClick={() => trackEvent('SplitDownloadClicked')}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-md"
                >
                  <Icons.Download className="h-4.5 w-4.5" />
                  <span>Download {splitResult.isZip ? 'ZIP Package' : 'PDF File'}</span>
                </a>
                {!splitResult.isZip && (
                  <a
                    href={splitResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground transition-all shadow-premium-sm"
                  >
                    <span>Open in Browser</span>
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-border/40 max-w-md mx-auto flex items-center justify-between">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = splitResult.url;
                    link.download = splitResult.name;
                    link.click();
                  }}
                  className="text-xs font-bold text-muted hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  Download Again
                </button>
                <button
                  onClick={startOver}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Start Over
                </button>
              </div>
            </motion.div>

          ) : fileObj ? (

            // Active split workspace
            <div className="space-y-6">
              
              {/* File Detail header card */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-9 bg-secondary/40 border border-border/60 rounded flex items-center justify-center shrink-0">
                    {fileObj.isParsing ? (
                      <div className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Icons.FileText className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm sm:text-base font-outfit text-foreground truncate max-w-[200px] sm:max-w-md">
                      {fileObj.name}
                    </h4>
                    <div className="flex items-center gap-2.5 text-[10px] text-muted font-bold uppercase tracking-wider mt-1">
                      <span>Pages: {fileObj.isParsing ? '...' : fileObj.pageCount}</span>
                      <span>•</span>
                      <span>{formatBytes(fileObj.size)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startOver}
                  className="text-xs font-bold text-muted hover:text-foreground transition-colors uppercase tracking-wider border border-border px-3 py-1.5 rounded-xl bg-secondary/10"
                >
                  Change File
                </button>
              </div>

              {/* Password protected PDF box */}
              {fileObj.isLocked && (
                <div className="border border-border/80 bg-card p-6 rounded-2xl max-w-md mx-auto text-center space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mx-auto">
                    <Icons.Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Unlocked Password Required</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">This PDF is secure. Decrypt locally to load thumbnails and split page files.</p>
                  </div>
                  <div className="flex items-center gap-2 max-w-sm mx-auto">
                    <input
                      type="password"
                      placeholder="Type file password..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUnlockFile(e.currentTarget.value);
                      }}
                      className="w-full border border-border bg-background px-3 py-2 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <button
                      onClick={(e) => {
                        const siblingInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (siblingInput) handleUnlockFile(siblingInput.value);
                      }}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-colors shadow-premium-sm shrink-0"
                    >
                      Unlock
                    </button>
                  </div>
                </div>
              )}

              {/* Parsing files loader */}
              {fileObj.isParsing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs text-muted uppercase tracking-wider font-semibold">Reading document catalog metadata...</p>
                </div>
              )}

              {/* Main settings and workspace grid */}
              {!fileObj.isParsing && !fileObj.isLocked && (
                <div className="space-y-6">
                  
                  {/* Split mode switches */}
                  <div className="flex bg-secondary/15 border border-border/80 p-1.5 rounded-2xl relative shadow-premium-sm overflow-x-auto gap-1">
                    <button
                      onClick={() => setSplitMode('extract')}
                      className={`flex-1 min-w-[120px] py-2 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                        splitMode === 'extract' 
                          ? 'text-primary-foreground bg-primary shadow-premium-sm' 
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Extract Pages
                    </button>
                    <button
                      onClick={() => setSplitMode('points')}
                      className={`flex-1 min-w-[120px] py-2 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                        splitMode === 'points' 
                          ? 'text-primary-foreground bg-primary shadow-premium-sm' 
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Split Points
                    </button>
                    <button
                      onClick={() => setSplitMode('intervals')}
                      className={`flex-1 min-w-[120px] py-2 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                        splitMode === 'intervals' 
                          ? 'text-primary-foreground bg-primary shadow-premium-sm' 
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      Split Intervals
                    </button>
                  </div>

                  {/* Mode-specific settings panels */}
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    {splitMode === 'extract' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted block uppercase tracking-wider">Manual Page Range</label>
                          <input
                            type="text"
                            value={extractRange}
                            onChange={(e) => setExtractRange(e.target.value)}
                            placeholder="e.g. 1-3, 5, 8-10 (or 'all')"
                            className="w-full max-w-sm border border-border bg-background px-3 py-2 rounded-xl text-xs font-mono text-foreground focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                          />
                          <p className="text-[10px] text-muted">Use standard comma ranges. Uncheck/check thumbnails below to customize selection.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted block uppercase tracking-wider">Output File Scheme</label>
                          <div className="flex bg-secondary/20 p-1 border border-border rounded-xl max-w-xs">
                            <button
                              onClick={() => setExtractType('single')}
                              className={`flex-1 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                                extractType === 'single' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted'
                              }`}
                            >
                              One PDF
                            </button>
                            <button
                              onClick={() => setExtractType('individual')}
                              className={`flex-1 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                                extractType === 'individual' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted'
                              }`}
                            >
                              Multi PDFs (ZIP)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {splitMode === 'intervals' && (
                      <div className="space-y-2 max-w-xs">
                        <label className="text-xs font-bold text-muted block uppercase tracking-wider">Split interval (pages)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={fileObj.pageCount}
                            value={intervalsSize}
                            onChange={(e) => setIntervalsSize(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 border border-border bg-background px-3 py-2 rounded-xl text-xs font-mono text-foreground focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                          />
                          <span className="text-xs text-muted">pages per split PDF document.</span>
                        </div>
                        <p className="text-[10px] text-muted mt-1">
                          Creates separate PDFs with a maximum of {intervalsSize} pages each.
                        </p>
                      </div>
                    )}

                    {splitMode === 'points' && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-muted block uppercase tracking-wider">Custom Split Point Dividers</span>
                        <p className="text-[10px] text-muted">
                          Scroll through page thumbnails below. Hover and click on the vertical scissor lines between pages to set split points.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Page Previews thumbnail grid workspace */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted pb-1.5 border-b border-border/40">
                      <span>Document Page Layout View</span>
                      {splitMode === 'extract' && extractRange === 'all' && (
                        <div className="flex gap-3">
                          <button onClick={() => selectAllPages(true)} className="text-primary hover:text-primary/80">Select All</button>
                          <span>•</span>
                          <button onClick={() => selectAllPages(false)} className="text-primary hover:text-primary/80">Deselect All</button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-6 gap-x-3 pt-2">
                      {fileObj.pages.map((page, idx) => {
                        const previewUrl = fileObj.pagePreviews[idx];
                        const isSelected = page.isSelected;
                        const isCutPoint = splitPoints.has(idx);

                        return (
                          <React.Fragment key={idx}>
                            {/* Page Card wrapper */}
                            <div
                              onClick={() => {
                                if (splitMode === 'extract') togglePageSelection(idx);
                              }}
                              className={`border rounded-xl p-3 flex flex-col items-center gap-2 transition-all relative ${
                                splitMode === 'extract'
                                  ? isSelected
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 cursor-pointer'
                                    : 'border-border/60 bg-secondary/5 opacity-40 cursor-pointer hover:opacity-75'
                                  : 'border-border/80 bg-secondary/10'
                              }`}
                            >
                              {/* Selection overlay indicator */}
                              {splitMode === 'extract' && (
                                <div className={`absolute top-2 right-2 h-4 w-4 rounded border flex items-center justify-center text-[9px] ${
                                  isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card'
                                }`}>
                                  {isSelected && <Icons.Check className="h-3 w-3" />}
                                </div>
                              )}

                              {/* Thumbnail preview */}
                              <div className="h-24 w-18 bg-card border border-border/40 rounded-lg flex items-center justify-center overflow-hidden shadow-premium-sm shrink-0">
                                {previewUrl ? (
                                  <img src={previewUrl} alt={`Page ${idx + 1}`} className="object-cover w-full h-full" />
                                ) : (
                                  <span className="text-xs font-bold text-muted font-mono">P.{idx + 1}</span>
                                )}
                              </div>

                              <span className="text-[10px] font-extrabold text-muted">Page {idx + 1}</span>
                            </div>

                            {/* Split point divider indicator between cards (Not after the last page card) */}
                            {splitMode === 'points' && idx < fileObj.pageCount - 1 && (
                              <div className="col-span-1 self-center flex items-center justify-center">
                                <button
                                  onClick={() => toggleSplitPoint(idx)}
                                  className={`flex items-center justify-center h-10 w-10 rounded-full border transition-all ${
                                    isCutPoint
                                      ? 'border-red-500 bg-red-500/10 text-red-500 scale-105'
                                      : 'border-border/80 bg-card text-muted/50 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5'
                                  }`}
                                  title={isCutPoint ? 'Remove Cut Marker' : 'Cut PDF Here'}
                                >
                                  <Icons.Sparkles className={`h-4.5 w-4.5 ${isCutPoint ? 'animate-pulse' : ''}`} />
                                </button>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compile Action buttons footer */}
                  <div className="bg-secondary/15 border border-border/80 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-muted font-semibold">
                      {splitMode === 'extract' && (
                        <span>Compiling {fileObj.pages.filter(p => p.isSelected).length} selected pages into {extractType === 'single' ? '1 PDF file' : 'multiple PDF files'}.</span>
                      )}
                      {splitMode === 'intervals' && (
                        <span>Dividing document every {intervalsSize} pages (approx. {Math.ceil(fileObj.pageCount / intervalsSize)} split files).</span>
                      )}
                      {splitMode === 'points' && (
                        <span>Splitting document at {splitPoints.size} custom markers (into {splitPoints.size + 1} PDF files).</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                      <button
                        onClick={startOver}
                        className="flex-1 sm:flex-none border border-border bg-card text-muted hover:text-foreground px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        disabled={isSplitting}
                        onClick={executeSplit}
                        className="flex-1 sm:flex-none relative overflow-hidden bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-md flex items-center justify-center gap-2"
                      >
                        {isSplitting && (
                          <div
                            style={{ width: `${splitProgress}%` }}
                            className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all duration-300 pointer-events-none"
                          />
                        )}
                        <Icons.Sparkles className="h-4.5 w-4.5 shrink-0" />
                        <span>{isSplitting ? `Splitting (${splitProgress}%)` : 'Split PDF'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          ) : null}

          {/* History log */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Local Split History</span>
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-bold text-red-500 uppercase hover:text-red-600 transition-colors"
                >
                  Clear History
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 border border-border/60 rounded-xl bg-secondary/10"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-[10px] font-black text-foreground truncate" title={item.originalName}>
                        {item.originalName}
                      </div>
                      <div className="text-[8px] text-muted uppercase tracking-wider font-semibold">
                        Split on: {new Date(item.timestamp).toLocaleString()} • {item.splitMode}
                      </div>
                    </div>
                    <div className="text-[9px] font-extrabold text-primary shrink-0 text-right">
                      {item.filesCount} splits • {formatBytes(item.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* PDF Learning Hub containing the 10 split-related articles */}
      <section className="border-t border-border/60 pt-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">PDF Splitter Learning Hub</h2>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">Expert guides, security practices, and workflow integrations for PDF page splitting.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2.5">Supporting Resource Guides</h3>
            
            <div className="space-y-4">
              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">1. What is PDF Splitting?</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>PDF splitting is the task of extracting specific pages or groups of pages from a single, larger PDF file to form new, separate PDF files. Unlike text documents, where a simple copy-paste works, a PDF consists of a complex tree catalog structure with mappings to fonts, raster images, and vector paths.</p>
                  <p>Splitting must safely copy these dependencies for each extracted page, build a new cross-reference trailer table, and output a valid file stream. Executed locally inside the browser memory as done by Toolora, it guarantees that confidential document objects are never leaked online.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">2. How to Split PDF Pages</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Splitting pages using the Toolora Page Splitter is straightforward:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 mt-2">
                    <li><strong>Upload:</strong> Drop your file into the workspace. If locked, type its decryption key.</li>
                    <li><strong>Configure Mode:</strong> Pick "Extract Pages", "Split Points", or "Split Intervals".</li>
                    <li><strong>Set Cut Marks:</strong> Manually click page cards, toggle scissor divider buttons, or set interval ranges (e.g. split every 3 pages).</li>
                    <li><strong>Process:</strong> Click the "Split PDF" button to trigger the in-memory compiler.</li>
                    <li><strong>Save:</strong> Download your single PDF or the generated ZIP archive containing all divided pages.</li>
                  </ol>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">3. Extract vs Split PDF</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>While often used in the same context, "Extracting" and "Splitting" are slightly different workflows:</p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li><strong>PDF Extraction:</strong> Isolating specific pages (e.g. pages 2, 5, and 9) to compile them into a new file, discarding the other pages of the original document.</li>
                    <li><strong>PDF Splitting:</strong> Slicing the entire document into multiple separate files (e.g. splitting a 30-page file into three separate 10-page documents) so that all pages are kept across the output files.</li>
                  </ul>
                  <p>Our tool supports both extraction and full document splitting workflows within the same interface.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">4. Why Split PDF?</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Splitting files is essential for various organizational reasons:</p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li><strong>Email Attachment Limits:</strong> Large documents with high-res scans exceed typical 25MB email attachment caps. Splitting the document into smaller parts resolves this.</li>
                    <li><strong>Confidentiality:</strong> Send only the relevant contract sections or billing sheets to clients, avoiding sharing unrelated pages.</li>
                    <li><strong>Workflow Automation:</strong> Separate combined scan files containing multiple separate receipts or invoices to archive them in separate folders.</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">5. How to Extract Specific Pages from a PDF</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>To extract specific pages, select the "Extract Pages" mode in the toolbar. The page previews will load as thumbnail cards. Simply click on the thumbnail cards to toggle selection. A checked card means the page will be included in the output. You can also enter a range like "1, 3, 5-8" in the manual range input field to quickly select those pages. Finally, select "One PDF" to combine all selected pages into a single file, or "Multi PDFs" to save each selected page as an individual file.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">6. How to Split PDF by Page Range</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Splitting by range is ideal when you want to divide a document into unequal sections (e.g. Chapter 1 is pages 1-10, Chapter 2 is pages 11-25). In our tool, you can achieve this by choosing the "Split Points" mode. Scroll through the page thumbnails and click on the vertical scissor icons located between the page cards. A red line will indicate where the document will be cut. If you place a cut marker after page 10 and another after page 25, the tool will automatically output three separate files containing pages 1-10, 11-25, and 26-end respectively.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">7. Splitting Password Protected PDFs</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>When a password-protected PDF is uploaded, the web browser cannot inspect its structure or pages. To split it, you must type its decryption key in the password entry dialog. The page parses the document in temporary memory, allowing you to select and split pages. The resulting split documents are saved as standard unlocked PDFs, meaning you do not need to enter a password to open the split files in the future.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">8. Zip Packaging in PDF Tools</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>When a user splits a 50-page PDF into 50 separate single-page files, triggering 50 individual file downloads would be a terrible user experience. Modern web browsers would flag this behavior as a spam attack, blocking all subsequent files after the first download.</p>
                  <p>Toolora solves this by loading `JSZip` dynamically. JSZip compiles all generated PDF files into a single compressed ZIP file in-memory. The user downloads this ZIP file with a single click, which they can extract easily on their system.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">9. Client-Side PDF Splitting Security</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>For sensitive materials like medical files, financial reports, or legal records, security is paramount. Standard online splitter tools require uploading documents to remote cloud servers. This exposes your documents to third-party databases, cookies, and network tracking.</p>
                  <p>Toolora’s client-side model provides absolute security. The application acts like a local offline program. Your documents stay within your browser's private memory space and are never uploaded or analyzed, ensuring total data privacy.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">10. How to Combine Split PDF Pages</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>If you have split a PDF file and later decide you want to combine certain pages in a different order, you can use our PDF Merge & Combine tool. Simply navigate to the Merger, upload the split files, rearrange the document order by dragging or clicking reorder buttons, apply rotations, and hit Merge to build a new unified PDF file.</p>
                </div>
              </details>
            </div>

          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2.5">Private Sandbox Guarantee</h3>
            
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-5 space-y-4 shadow-premium-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-premium-sm">
                <Icons.Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-outfit text-sm font-bold text-foreground">Zero-Upload Privacy</h4>
                <p className="text-xs text-muted leading-relaxed mt-1">We do not store or process files on remote servers. All calculations and compiles execute locally inside your browser tab.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 space-y-4 shadow-premium-sm">
              <h4 className="font-outfit text-xs font-black text-foreground uppercase tracking-wider">Internal Links</h4>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-muted">
                <li>
                  <a href="/tools/pdf-merge-combine" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>PDF Merge & Combine</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-emerald-500/10 bg-emerald-500/5 text-emerald-500 ml-auto">Active</span>
                  </a>
                </li>
                <li>
                  <a href="/tools/pdf-compress" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>PDF Compressor</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/10 bg-primary/5 text-primary ml-auto">Soon</span>
                  </a>
                </li>
                <li>
                  <a href="/tools/pdf-rotate" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>PDF Rotator</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/10 bg-primary/5 text-primary ml-auto">Soon</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
