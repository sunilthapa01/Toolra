'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

// Global types for loaded window libraries
declare global {
  interface Window {
    PDFLib: any;
    pdfjsLib: any;
  }
}

interface PageItem {
  id: string;
  originalIndex: number; // 0-based
  rotation: number;      // 0, 90, 180, 270
  isDeleted: boolean;
}

interface PDFFile {
  id: string;
  name: string;
  size: number;
  file: File | null; // null for blank pages
  pageCount: number;
  pages: PageItem[];
  password?: string;
  isLocked: boolean;
  isParsing: boolean;
  error?: string;
  pageRange: string; // 'all' or custom range like '1-3, 5'
  thumbnailUrl?: string; // thumbnail of page 1
  pagePreviews: string[]; // data URLs of page thumbnails
  showPagePreviews: boolean;
}

interface MergeHistoryItem {
  id: string;
  timestamp: number;
  name: string;
  pageCount: number;
  size: number;
}

export default function PDFMergeCombine() {
  const { showToast } = useToast();
  
  // Library load states
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [libsLoadingError, setLibsLoadingError] = useState(false);

  // Files & processing states
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // Settings & Result states
  const [includePageNumbers, setIncludePageNumbers] = useState(false);
  const [orderMode, setOrderMode] = useState<'uploaded' | 'reverse'>('uploaded');
  const [mergedResult, setMergedResult] = useState<{
    blob: Blob;
    url: string;
    size: number;
    pageCount: number;
    name: string;
  } | null>(null);
  const [history, setHistory] = useState<MergeHistoryItem[]>([]);

  // Drag and Drop ordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Expanded Fullscreen Preview Modal
  const [fullscreenPreview, setFullscreenPreview] = useState<{
    fileId: string;
    pageIndex: number;
    url: string;
    rotation: number;
  } | null>(null);

  // HTML Input references
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Dynamic CDN Loading of pdf-lib and pdfjs-dist
  useEffect(() => {
    let active = true;

    async function loadLibraries() {
      try {
        if (window.PDFLib && window.pdfjsLib) {
          if (active) setLibsLoaded(true);
          return;
        }

        // Helper to inject script
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
          // Configure PDFJS worker path
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        if (active) {
          setLibsLoaded(true);
          // Trigger mock analytics event
          trackEvent('PDFEngineInitialized', { status: 'success' });
        }
      } catch (err) {
        console.error('Error loading libraries:', err);
        if (active) setLibsLoadingError(true);
      }
    }

    loadLibraries();
    
    // Load merge history
    try {
      const stored = localStorage.getItem('toolora-pdf-merge-history');
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

  // 2. Paste Files event listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!libsLoaded) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pdfFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type === 'application/pdf') {
          const file = items[i].getAsFile();
          if (file) pdfFiles.push(file);
        }
      }

      if (pdfFiles.length > 0) {
        showToast(`Pasted ${pdfFiles.length} file(s) from clipboard.`);
        handleFilesAdded(pdfFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [libsLoaded, files]);

  // Analytics helper
  const trackEvent = (eventName: string, metadata: any = {}) => {
    console.log(`[Analytics] ${eventName}`, {
      ...metadata,
      timestamp: new Date().toISOString(),
      platform: 'Browser'
    });
  };

  // Helper to format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 3. Document File Handler
  const handleFilesAdded = async (fileList: FileList | File[]) => {
    const addedFiles = Array.from(fileList);
    const validPDFs = addedFiles.filter(file => {
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPDF) {
        showToast(`Rejected "${file.name}": Only PDF files are supported.`);
      }
      return isPDF;
    });

    if (validPDFs.length === 0) return;
    trackEvent('UploadStarted', { count: validPDFs.length });

    // Auto-detect duplicate files
    let duplicateFound = false;
    const newFilesList = [...files];

    for (const file of validPDFs) {
      const isDuplicate = files.some(
        f => f.name === file.name && f.size === file.size
      );

      if (isDuplicate) {
        duplicateFound = true;
        setDuplicateWarning(`Warning: "${file.name}" has already been added.`);
        setTimeout(() => setDuplicateWarning(null), 5000);
      }

      const id = Math.random().toString(36).substring(2, 9);
      const newFileObj: PDFFile = {
        id,
        name: file.name,
        size: file.size,
        file,
        pageCount: 0,
        pages: [],
        isLocked: false,
        isParsing: true,
        pageRange: 'all',
        pagePreviews: [],
        showPagePreviews: false
      };

      // Add temporarily to list with loader state
      newFilesList.push(newFileObj);
      setFiles([...newFilesList]);

      // Parse asynchronous in client-side background
      parseAndGeneratePreviews(file, id, undefined);
    }
  };

  // 4. Parser & Previewer (unlocked parsing)
  const parseAndGeneratePreviews = async (file: File, id: string, password?: string) => {
    try {
      const buffer = await file.arrayBuffer();
      let pdfDoc;

      // 4a. Decrypt PDF locally if password provided
      try {
        pdfDoc = await window.PDFLib.PDFDocument.load(buffer, password ? { password } : undefined);
      } catch (err: any) {
        // Check password protection
        const isLocked = 
          err.message.includes('password') || 
          err.message.includes('Password') || 
          err.message.includes('encrypted') || 
          err.message.includes('decrypt');

        if (isLocked) {
          setFiles(prev => prev.map(f => {
            if (f.id === id) {
              return { 
                ...f, 
                isLocked: true, 
                isParsing: false, 
                error: 'Password protected. Enter password to unlock.' 
              };
            }
            return f;
          }));
          trackEvent('UploadError', { reason: 'PasswordProtected', filename: file.name });
          return;
        }
        throw err;
      }

      const pageCount = pdfDoc.getPageCount();
      const initialPages: PageItem[] = Array.from({ length: pageCount }, (_, i) => ({
        id: `${id}-p-${i}`,
        originalIndex: i,
        rotation: 0,
        isDeleted: false
      }));

      // Update state with page count
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            pageCount,
            pages: initialPages,
            isLocked: false,
            isParsing: false,
            password,
            error: undefined
          };
        }
        return f;
      }));

      trackEvent('UploadCompleted', { filename: file.name, pages: pageCount });

      // 4b. Render Thumbnails inside Canvas asynchronously
      renderThumbnails(buffer, id, pageCount, password);

    } catch (err: any) {
      console.error(err);
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            isParsing: false,
            error: 'Corrupted or broken PDF file.'
          };
        }
        return f;
      }));
      trackEvent('UploadError', { reason: 'Corrupted', filename: file.name });
    }
  };

  const renderThumbnails = async (buffer: ArrayBuffer, id: string, pageCount: number, password?: string) => {
    try {
      const pdfjs = window.pdfjsLib;
      const loadingTask = pdfjs.getDocument({ 
        data: new Uint8Array(buffer),
        password
      });
      const pdf = await loadingTask.promise;

      // Extract thumbnails for first few pages (lazy rendering)
      const maxPreviews = Math.min(pageCount, 12); // limit to 12 previews initially for speed
      const previews: string[] = [];

      for (let i = 1; i <= maxPreviews; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          previews.push(canvas.toDataURL());
        }
      }

      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          return {
            ...f,
            thumbnailUrl: previews[0],
            pagePreviews: previews
          };
        }
        return f;
      }));

    } catch (err) {
      console.error('Failed to render previews', err);
    }
  };

  // 5. Password Unlocking Handler
  const handleUnlockFile = (id: string, password: string) => {
    const target = files.find(f => f.id === id);
    if (!target || !target.file) return;

    setFiles(prev => prev.map(f => {
      if (f.id === id) return { ...f, isParsing: true, error: undefined };
      return f;
    }));

    parseAndGeneratePreviews(target.file, id, password);
  };

  // 6. Blank Page Insertion
  const handleAddBlankPage = () => {
    const id = Math.random().toString(36).substring(2, 9);
    const blankPageObj: PDFFile = {
      id,
      name: 'Blank Page (Spacer)',
      size: 0,
      file: null,
      pageCount: 1,
      pages: [{
        id: `${id}-p-0`,
        originalIndex: 0,
        rotation: 0,
        isDeleted: false
      }],
      isLocked: false,
      isParsing: false,
      pageRange: 'all',
      pagePreviews: [],
      showPagePreviews: false
    };

    setFiles(prev => [...prev, blankPageObj]);
    trackEvent('BlankPageAdded');
  };

  // 7. Page Range Selection Parsing
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

    // De-duplicate page indices
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  // 8. Reordering (Drag and drop list handling)
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const listCopy = [...files];
    const draggedItem = listCopy[draggedIndex];
    listCopy.splice(draggedIndex, 1);
    listCopy.splice(index, 0, draggedItem);

    setFiles(listCopy);
    setDraggedIndex(null);
    setDragOverIndex(null);
    trackEvent('ReorderedFiles', { method: 'drag' });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= files.length) return;

    const listCopy = [...files];
    const item = listCopy[index];
    listCopy.splice(index, 1);
    listCopy.splice(nextIndex, 0, item);

    setFiles(listCopy);
    trackEvent('ReorderedFiles', { method: 'button', direction });
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    trackEvent('FileRemoved', { id });
  };

  // 9. Page-level Actions
  const togglePageDeleted = (fileId: string, pageId: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          pages: f.pages.map(p => p.id === pageId ? { ...p, isDeleted: !p.isDeleted } : p)
        };
      }
      return f;
    }));
  };

  const rotatePage = (fileId: string, pageId: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          pages: f.pages.map(p => p.id === pageId ? { ...p, rotation: (p.rotation + 90) % 360 } : p)
        };
      }
      return f;
    }));
  };

  const duplicatePage = (fileId: string, pageIndex: number) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const copyPages = [...f.pages];
        const sourcePage = copyPages[pageIndex];
        const newPage: PageItem = {
          id: `${f.id}-p-dup-${Math.random().toString(36).substring(2, 5)}`,
          originalIndex: sourcePage.originalIndex,
          rotation: sourcePage.rotation,
          isDeleted: false
        };
        copyPages.splice(pageIndex + 1, 0, newPage);
        
        // Also clone preview URL if present
        const copyPreviews = [...f.pagePreviews];
        if (copyPreviews[pageIndex]) {
          copyPreviews.splice(pageIndex + 1, 0, copyPreviews[pageIndex]);
        }

        return {
          ...f,
          pageCount: f.pageCount + 1,
          pages: copyPages,
          pagePreviews: copyPreviews
        };
      }
      return f;
    }));
    trackEvent('PageDuplicated');
  };

  // 10. PDF Client-side Compile Engine
  const mergePDFs = async () => {
    if (files.length === 0) return;
    
    // Check if any files are locked or still parsing
    const hasUnresolved = files.some(f => f.isLocked || f.isParsing);
    if (hasUnresolved) {
      showToast('Please unlock all password-protected files and wait for parsing to complete.');
      return;
    }

    setIsMerging(true);
    setMergeProgress(10);
    trackEvent('MergeStarted', { filesCount: files.length });

    try {
      const PDFLib = window.PDFLib;
      const mergedPdf = await PDFLib.PDFDocument.create();
      
      // Order list based on selection
      const compileList = orderMode === 'reverse' ? [...files].reverse() : [...files];
      let pageNumberIndex = 1;

      // Extract total pages for page numbering
      let totalPagesToMerge = 0;
      const filePagesMap: { pdfDoc: any; pagesToCopy: number[]; rotationMap: Record<number, number> }[] = [];

      // Step 1: Parse Page Trees and configure page mapping
      for (let i = 0; i < compileList.length; i++) {
        setMergeProgress(10 + Math.floor((i / compileList.length) * 30));
        const fileObj = compileList[i];

        if (fileObj.file === null) {
          // Virtual Blank Page
          filePagesMap.push({
            pdfDoc: null,
            pagesToCopy: [0],
            rotationMap: { 0: 0 }
          });
          totalPagesToMerge += 1;
        } else {
          const fileBuffer = await fileObj.file.arrayBuffer();
          const sourcePdf = await PDFLib.PDFDocument.load(fileBuffer, fileObj.password ? { password: fileObj.password } : undefined);
          
          // Filter page indices based on page range
          const filteredIndices = parsePageRange(fileObj.pageRange, sourcePdf.getPageCount());
          
          // Map filtered indices to actual page items and filter deleted ones
          const finalIndices: number[] = [];
          const rotationMap: Record<number, number> = {};

          filteredIndices.forEach(idx => {
            const pageItem = fileObj.pages.find(p => p.originalIndex === idx);
            // If the specific page was duplicated or deleted in page editor
            const matchingPages = fileObj.pages.filter(p => p.originalIndex === idx && !p.isDeleted);
            
            matchingPages.forEach(p => {
              finalIndices.push(p.originalIndex);
              rotationMap[finalIndices.length - 1] = p.rotation;
            });
          });

          filePagesMap.push({
            pdfDoc: sourcePdf,
            pagesToCopy: finalIndices,
            rotationMap
          });
          
          totalPagesToMerge += finalIndices.length;
        }
      }

      setMergeProgress(50);

      // Helvetica font for numbering
      const helveticaFont = await mergedPdf.embedFont(PDFLib.StandardFonts.Helvetica);

      // Step 2: Page Copying pipeline
      for (let i = 0; i < filePagesMap.length; i++) {
        setMergeProgress(50 + Math.floor((i / filePagesMap.length) * 40));
        const { pdfDoc, pagesToCopy, rotationMap } = filePagesMap[i];

        if (pdfDoc === null) {
          // Insert a virtual blank page (Letter size standard)
          const newPage = mergedPdf.addPage([612, 792]);
          
          if (includePageNumbers) {
            newPage.drawText(`Page ${pageNumberIndex} of ${totalPagesToMerge}`, {
              x: 500,
              y: 30,
              size: 9,
              font: helveticaFont,
              color: PDFLib.rgb(0.5, 0.5, 0.5)
            });
          }
          pageNumberIndex++;
        } else {
          // Copy selected pages
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pagesToCopy);
          
          copiedPages.forEach((page: any, idx: number) => {
            // Apply rotations
            const userRotation = rotationMap[idx] || 0;
            if (userRotation > 0) {
              const currentRot = page.getRotation().angle;
              page.setRotation(PDFLib.degrees((currentRot + userRotation) % 360));
            }

            // Draw Page Numbering if enabled
            if (includePageNumbers) {
              const { width } = page.getSize();
              page.drawText(`Page ${pageNumberIndex} of ${totalPagesToMerge}`, {
                x: width - 90,
                y: 35,
                size: 9,
                font: helveticaFont,
                color: PDFLib.rgb(0.5, 0.5, 0.5)
              });
            }

            mergedPdf.addPage(page);
            pageNumberIndex++;
          });
        }
      }

      setMergeProgress(90);

      // Step 3: Save final PDF in memory
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const mergedUrl = URL.createObjectURL(mergedBlob);
      
      const resultName = `toolora-merged-${Date.now().toString().slice(-4)}.pdf`;

      setMergedResult({
        blob: mergedBlob,
        url: mergedUrl,
        size: mergedPdfBytes.length,
        pageCount: totalPagesToMerge,
        name: resultName
      });

      // Save to merge history
      const historyItem: MergeHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        name: resultName,
        pageCount: totalPagesToMerge,
        size: mergedPdfBytes.length
      };

      setHistory(prev => {
        const updated = [historyItem, ...prev.slice(0, 9)];
        localStorage.setItem('toolora-pdf-merge-history', JSON.stringify(updated));
        return updated;
      });

      setMergeProgress(100);
      setIsMerging(false);
      showToast('PDF compilation completed successfully!');
      trackEvent('MergeCompleted', { pagesMerged: totalPagesToMerge, finalSize: mergedPdfBytes.length });

    } catch (err: any) {
      console.error(err);
      setIsMerging(false);
      setMergeProgress(0);
      showToast(`Merge failed: ${err.message || 'Unknown processing error'}`);
      trackEvent('MergeError', { message: err.message });
    }
  };

  const handlePrint = () => {
    if (!mergedResult) return;
    const printWindow = window.open(mergedResult.url);
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const startOver = () => {
    setFiles([]);
    setMergedResult(null);
    setMergeProgress(0);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolora-pdf-merge-history');
    showToast('Local history logs cleared.');
  };

  return (
    <div className="space-y-12">
      {/* 1. Dynamic Script CDN Load Guard */}
      {!libsLoaded && !libsLoadingError && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <Icons.FileText className="absolute h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold font-outfit text-foreground uppercase tracking-widest">Initializing Secure PDF Engine</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">Loading client-side manipulation libraries dynamically in browser...</p>
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
          
          {/* Main workspace (split/grid if files uploaded, otherwise upload zone) */}
          {files.length === 0 && !mergedResult ? (
            
            // Upload zone: Big interactive Box
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
                  handleFilesAdded(e.dataTransfer.files);
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
                  Drag & Drop PDF files here
                </h3>
                <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                  or click to browse. Supports pasting PDFs directly from your clipboard.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files) handleFilesAdded(e.target.files);
                }}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-colors shadow-premium-sm mt-2"
              >
                Browse Files
              </button>

              <div className="text-[10px] text-muted/65 uppercase tracking-wider font-semibold mt-4 flex items-center gap-3">
                <span>🔒 CLIENT-SIDE</span>
                <span>•</span>
                <span>⚡ INSTANT</span>
                <span>•</span>
                <span>💻 OFFLINE OK</span>
              </div>
            </div>
            
          ) : mergedResult ? (

            // Success & Download Result Box
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary/10 border border-border/80 rounded-3xl p-6 sm:p-10 text-center space-y-6"
            >
              <div className="flex flex-col items-center space-y-3">
                {/* animated success badge */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-premium-md relative">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/50 animate-ping opacity-25" />
                  <Icons.Check className="h-8 w-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">PDF Merged Successfully!</h2>
                <p className="text-xs text-muted max-w-md">Your documents were combined locally inside temporary memory and never touched a server.</p>
              </div>

              {/* Summary Stats Table */}
              <div className="bg-card border border-border rounded-2xl p-5 max-w-md mx-auto grid grid-cols-2 gap-4 divide-x divide-border/60">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Total Pages</span>
                  <span className="text-lg font-mono-calc font-extrabold text-foreground">{mergedResult.pageCount}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">File Size</span>
                  <span className="text-lg font-mono-calc font-extrabold text-foreground">{formatBytes(mergedResult.size)}</span>
                </div>
              </div>

              {/* Action Buttons deck */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
                <a
                  href={mergedResult.url}
                  download={mergedResult.name}
                  onClick={() => trackEvent('DownloadClicked')}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-md"
                >
                  <Icons.Download className="h-4.5 w-4.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground transition-all shadow-premium-sm"
                >
                  <span>Print</span>
                </button>
                <a
                  href={mergedResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground transition-all shadow-premium-sm"
                >
                  <span>Open in Browser</span>
                </a>
              </div>

              <div className="pt-4 border-t border-border/40 max-w-md mx-auto flex items-center justify-between">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = mergedResult.url;
                    link.download = mergedResult.name;
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

          ) : (

            // Active merge workspace
            <div className="space-y-6">
              
              {/* Top controls / info header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted">Uploaded Documents ({files.length})</h3>
                  <p className="text-[10px] text-muted/80 mt-0.5 font-semibold">Rearrange pages, rotate, or select page ranges before compiling.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddBlankPage}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border border-border bg-card px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-all shadow-premium-sm"
                  >
                    <span>+ Blank Page</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all shadow-premium-sm"
                  >
                    <span>+ Add PDFs</span>
                  </button>
                </div>
              </div>

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="border border-amber-500/20 bg-amber-500/5 px-4 py-3 rounded-xl flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <Icons.AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Document items list */}
              <div className="space-y-4">
                {files.map((fileObj, index) => {
                  const isBlank = fileObj.file === null;
                  const isParsing = fileObj.isParsing;
                  const isLocked = fileObj.isLocked;

                  return (
                    <div
                      key={fileObj.id}
                      draggable={!isParsing && !isLocked}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`bg-card border rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all ${
                        dragOverIndex === index
                          ? 'border-primary ring-2 ring-primary/10'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      {/* Top main details row */}
                      <div className="flex items-start gap-4">
                        {/* Drag Handle */}
                        <div 
                          className="hidden sm:flex flex-col items-center justify-center text-muted/30 cursor-grab active:cursor-grabbing self-center h-8 w-6 shrink-0"
                          title="Drag to reorder"
                        >
                          <span className="block w-4 h-0.5 bg-current rounded-full my-0.5" />
                          <span className="block w-4 h-0.5 bg-current rounded-full my-0.5" />
                          <span className="block w-4 h-0.5 bg-current rounded-full my-0.5" />
                        </div>

                        {/* Thumbnail preview */}
                        <div className="h-14 w-11 sm:h-16 sm:w-12 bg-secondary/40 border border-border/60 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative shadow-premium-sm select-none">
                          {isParsing ? (
                            <div className="h-5 w-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                          ) : isLocked ? (
                            <Icons.Lock className="h-5 w-5 text-muted" />
                          ) : isBlank ? (
                            <div className="text-[9px] font-black uppercase text-muted tracking-wide text-center px-1">Blank</div>
                          ) : fileObj.thumbnailUrl ? (
                            <img src={fileObj.thumbnailUrl} alt="Thumbnail" className="object-cover w-full h-full" />
                          ) : (
                            <Icons.FileText className="h-5 w-5 text-muted" />
                          )}
                        </div>

                        {/* Name, page count, and page ranges details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base font-outfit text-foreground truncate max-w-[200px] sm:max-w-md">
                              {fileObj.name}
                            </h4>
                            {isBlank && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/10 bg-primary/5 text-primary">
                                Spacer
                              </span>
                            )}
                          </div>
                          
                          {/* File metadata */}
                          <div className="flex items-center gap-3 text-[10px] text-muted font-bold uppercase tracking-wider mt-1.5">
                            <span>Pages: {isParsing ? '...' : fileObj.pageCount}</span>
                            {!isBlank && <span>•</span>}
                            {!isBlank && <span>{formatBytes(fileObj.size)}</span>}
                          </div>

                          {/* Error block */}
                          {fileObj.error && (
                            <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">
                              <Icons.AlertCircle className="h-3 w-3 shrink-0" />
                              <span>{fileObj.error}</span>
                            </p>
                          )}

                          {/* Password field if locked */}
                          {isLocked && (
                            <div className="flex items-center gap-2 mt-3 max-w-xs">
                              <input
                                type="password"
                                placeholder="Enter password to unlock..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUnlockFile(fileObj.id, e.currentTarget.value);
                                  }
                                }}
                                className="w-full border border-border bg-background px-3 py-1.5 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              />
                              <button
                                onClick={(e) => {
                                  const siblingInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (siblingInput) handleUnlockFile(fileObj.id, siblingInput.value);
                                }}
                                className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-colors shadow-premium-sm"
                              >
                                Unlock
                              </button>
                            </div>
                          )}

                          {/* Page Range selector if unlocked & parsed */}
                          {!isParsing && !isLocked && !isBlank && (
                            <div className="flex items-center gap-2 mt-3 max-w-sm">
                              <span className="text-[10px] font-extrabold uppercase text-muted tracking-wider">Page Range:</span>
                              <input
                                type="text"
                                value={fileObj.pageRange}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, pageRange: val } : f));
                                }}
                                placeholder="e.g. 1-3, 5 (or 'all')"
                                className="flex-1 max-w-[160px] border border-border bg-background px-2.5 py-1 rounded-lg text-xs font-mono text-foreground focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                              />
                            </div>
                          )}
                        </div>

                        {/* Top Right action deck */}
                        <div className="flex items-center gap-1.5 self-center shrink-0">
                          {/* Move up / down buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => moveItem(index, 'up')}
                              className="p-1 text-muted hover:text-foreground disabled:opacity-20 transition-all rounded-md hover:bg-secondary"
                              title="Move Document Up"
                            >
                              <Icons.ChevronDown className="h-4.5 w-4.5 rotate-180" />
                            </button>
                            <button
                              disabled={index === files.length - 1}
                              onClick={() => moveItem(index, 'down')}
                              className="p-1 text-muted hover:text-foreground disabled:opacity-20 transition-all rounded-md hover:bg-secondary"
                              title="Move Document Down"
                            >
                              <Icons.ChevronDown className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          {/* Preview toggle */}
                          {!isParsing && !isLocked && !isBlank && (
                            <button
                              onClick={() => {
                                setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, showPagePreviews: !f.showPagePreviews } : f));
                              }}
                              className={`p-2 rounded-xl transition-all border ${
                                fileObj.showPagePreviews 
                                  ? 'border-primary/20 bg-primary/5 text-primary' 
                                  : 'border-border/60 bg-card text-muted hover:text-foreground hover:bg-secondary'
                              }`}
                              title="Inspect/Edit Pages"
                            >
                              <Icons.Sparkles className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete Document */}
                          <button
                            onClick={() => deleteFile(fileObj.id)}
                            className="p-2 text-muted hover:text-red-500 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-colors"
                            title="Delete File"
                          >
                            <Icons.X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* page editor thumbnails grid */}
                      {!isParsing && !isLocked && !isBlank && fileObj.showPagePreviews && (
                        <div className="border-t border-border/40 pt-4 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Page Editor (Page Level Control)</span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {fileObj.pages.map((pageItem, pIdx) => {
                              const previewUrl = fileObj.pagePreviews[pageItem.originalIndex];

                              return (
                                <div
                                  key={pageItem.id}
                                  className={`border rounded-xl p-2 flex flex-col justify-between items-center gap-2 bg-secondary/15 hover:border-primary/30 transition-all ${
                                    pageItem.isDeleted ? 'opacity-30 border-dashed border-red-500/20' : 'border-border/80'
                                  }`}
                                >
                                  {/* page display thumbnail */}
                                  <div className="h-20 w-16 bg-card border border-border/40 rounded-lg flex items-center justify-center overflow-hidden relative shadow-premium-sm group cursor-pointer"
                                    onClick={() => {
                                      if (previewUrl) {
                                        setFullscreenPreview({
                                          fileId: fileObj.id,
                                          pageIndex: pIdx,
                                          url: previewUrl,
                                          rotation: pageItem.rotation
                                        });
                                      }
                                    }}
                                    title="Click to Zoom"
                                  >
                                    {previewUrl ? (
                                      <img
                                        src={previewUrl}
                                        alt={`Page ${pageItem.originalIndex + 1}`}
                                        style={{ transform: `rotate(${pageItem.rotation}deg)` }}
                                        className="object-cover w-full h-full transition-transform duration-200"
                                      />
                                    ) : (
                                      <span className="text-xs font-bold text-muted font-mono-calc">P.{pageItem.originalIndex + 1}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Zoom</span>
                                    </div>
                                  </div>

                                  {/* number tag */}
                                  <span className="text-[9px] font-extrabold text-muted">
                                    Page {pIdx + 1}
                                  </span>

                                  {/* page buttons deck */}
                                  <div className="flex items-center gap-1.5">
                                    {/* Rotate */}
                                    <button
                                      onClick={() => rotatePage(fileObj.id, pageItem.id)}
                                      className="p-1 hover:bg-secondary text-muted hover:text-foreground rounded transition-colors"
                                      title="Rotate 90° Clockwise"
                                    >
                                      <Icons.RotateCcw className="h-3 w-3 rotate-90" />
                                    </button>

                                    {/* Duplicate */}
                                    <button
                                      onClick={() => duplicatePage(fileObj.id, pIdx)}
                                      className="p-1 hover:bg-secondary text-muted hover:text-foreground rounded transition-colors"
                                      title="Duplicate Page"
                                    >
                                      <Icons.Copy className="h-3 w-3" />
                                    </button>

                                    {/* Delete Toggle */}
                                    <button
                                      onClick={() => togglePageDeleted(fileObj.id, pageItem.id)}
                                      className={`p-1 rounded transition-colors ${
                                        pageItem.isDeleted 
                                          ? 'bg-red-500/10 text-red-500' 
                                          : 'hover:bg-secondary text-muted hover:text-red-500'
                                      }`}
                                      title={pageItem.isDeleted ? 'Restore Page' : 'Delete Page'}
                                    >
                                      {pageItem.isDeleted ? (
                                        <Icons.Check className="h-3 w-3" />
                                      ) : (
                                        <Icons.X className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Control Panel / Options */}
              <div className="bg-secondary/15 border border-border/80 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Options column (Left) */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Merge settings</span>
                  
                  {/* Order Mode selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted block">Document compilation order</label>
                    <div className="flex bg-card border border-border p-1 rounded-2xl relative shadow-premium-sm">
                      <button
                        onClick={() => {
                          setOrderMode('uploaded');
                          trackEvent('OrderModeChanged', { mode: 'uploaded' });
                        }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                          orderMode === 'uploaded' 
                            ? 'text-primary-foreground bg-primary shadow-premium-sm' 
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        Uploaded Order
                      </button>
                      <button
                        onClick={() => {
                          setOrderMode('reverse');
                          trackEvent('OrderModeChanged', { mode: 'reverse' });
                        }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                          orderMode === 'reverse' 
                            ? 'text-primary-foreground bg-primary shadow-premium-sm' 
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        Reverse Order
                      </button>
                    </div>
                  </div>

                  {/* Add Blank numbering option */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="numbering-toggle"
                      checked={includePageNumbers}
                      onChange={(e) => setIncludePageNumbers(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-border bg-background text-primary focus:ring-primary/20 cursor-pointer outline-none"
                    />
                    <label htmlFor="numbering-toggle" className="text-xs font-bold text-foreground cursor-pointer select-none leading-none">
                      Enable Page Numbering (bottom-right)
                    </label>
                  </div>
                </div>

                {/* Compilation action panel (Right) */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-4 shadow-premium-md self-center">
                  <div className="flex items-center justify-between text-xs text-muted font-bold uppercase tracking-wider">
                    <span>Active Documents:</span>
                    <span className="font-mono-calc text-foreground">{files.length}</span>
                  </div>

                  {/* Merge button with progress */}
                  <button
                    disabled={isMerging || files.length === 0}
                    onClick={mergePDFs}
                    className="w-full relative overflow-hidden bg-primary text-primary-foreground py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/95 disabled:opacity-50 transition-all shadow-premium-md flex items-center justify-center gap-2"
                  >
                    {isMerging && (
                      <div
                        style={{ width: `${mergeProgress}%` }}
                        className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all duration-300 pointer-events-none"
                      />
                    )}
                    <Icons.Sparkles className="h-4.5 w-4.5 shrink-0" />
                    <span>{isMerging ? `Merging (${mergeProgress}%)` : 'Merge PDF'}</span>
                  </button>

                  <button
                    onClick={startOver}
                    className="w-full border border-border bg-card text-muted hover:text-foreground py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Clear Workspace
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Fullscreen Preview Modal */}
          <AnimatePresence>
            {fullscreenPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setFullscreenPreview(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="bg-card border border-border rounded-2xl p-4 max-w-xl w-full relative flex flex-col items-center gap-4 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close header */}
                  <div className="w-full flex items-center justify-between border-b border-border/40 pb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Page Preview Zoom</span>
                    <button
                      onClick={() => setFullscreenPreview(null)}
                      className="p-1 hover:bg-secondary text-muted hover:text-foreground rounded-lg"
                    >
                      <Icons.X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Zoom Image wrapper */}
                  <div className="h-[400px] w-full bg-secondary/10 rounded-xl overflow-hidden flex items-center justify-center border border-border/40 relative">
                    <img
                      src={fullscreenPreview.url}
                      alt="Zoom view"
                      style={{ transform: `rotate(${fullscreenPreview.rotation}deg)` }}
                      className="max-h-full max-w-full object-contain transition-transform"
                    />
                  </div>

                  {/* Actions inside modal */}
                  <div className="w-full flex items-center justify-between pt-1 text-[10px] text-muted font-bold uppercase tracking-wider">
                    <span>Page index: {fullscreenPreview.pageIndex + 1}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const fileId = fullscreenPreview.fileId;
                          setFiles(prev => prev.map(f => {
                            if (f.id === fileId) {
                              return {
                                ...f,
                                pages: f.pages.map((p, idx) => 
                                  idx === fullscreenPreview.pageIndex 
                                    ? { ...p, rotation: (p.rotation + 90) % 360 } 
                                    : p
                                )
                              };
                            }
                            return f;
                          }));
                          // Update modal preview rotation
                          setFullscreenPreview(prev => prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg bg-card hover:bg-secondary text-foreground text-[10px] uppercase font-bold"
                      >
                        <Icons.RotateCcw className="h-3 w-3 rotate-90" />
                        <span>Rotate</span>
                      </button>
                      <button
                        onClick={() => {
                          const fileId = fullscreenPreview.fileId;
                          const targetFile = files.find(f => f.id === fileId);
                          if (targetFile) {
                            const pageItem = targetFile.pages[fullscreenPreview.pageIndex];
                            togglePageDeleted(fileId, pageItem.id);
                            setFullscreenPreview(null);
                            showToast(`Page ${fullscreenPreview.pageIndex + 1} deleted/toggled.`);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-500/20 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] uppercase font-bold"
                      >
                        <Icons.X className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Merge History Log */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Local Merged History (History Log)</span>
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
                      <div className="text-[10px] font-black text-foreground truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-[8px] text-muted uppercase tracking-wider font-semibold">
                        Merged on: {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-[9px] font-extrabold text-primary shrink-0 text-right">
                      {item.pageCount} Pages • {formatBytes(item.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. PDF Learning Hub (10 detailed internal supporting articles) */}
      <section className="border-t border-border/60 pt-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">PDF Learning Hub</h2>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">Expert guides, technical insights, and secure best practices for managing your PDF documents.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2.5">Supporting Resource Guides</h3>
            
            <div className="space-y-4">
              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">1. What is PDF Merging?</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>PDF merging is the mathematical consolidation of two or more independent PDF files into a single, cohesive file stream. The process does not simply append files like plain text; instead, it merges the document catalog tree, maps references to fonts, vectors, and embedded images, and reconciles metadata blocks.</p>
                  <p>In standard business practice, this is essential for grouping project proposals, monthly reports, financial ledgers, and invoice registries. When performed client-side as in Toolora, it prevents document contents from being leaked, ensuring corporate secrecy.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">2. How to Merge PDF Files</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Merging PDF files involves a few simple steps. Using Toolora, the process is streamlined to run instantly:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 mt-2">
                    <li><strong>Upload:</strong> Drop files into the dashboard or click browse.</li>
                    <li><strong>Sort:</strong> Drag files to arrange their order, or click the up/down arrows next to each document.</li>
                    <li><strong>Refine:</strong> Optionally enter page range configurations (like "1-3, 5") to select specific pages. Toggle the page editor to rotate, delete, or duplicate individual pages.</li>
                    <li><strong>Compile:</strong> Hit the "Merge PDF" button. The combined file will download locally in a fraction of a second.</li>
                  </ol>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">3. Merge vs Combine PDFs</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>While often used interchangeably, "Merging" and "Combining" can refer to distinct operations in advanced document processing workflows:</p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li><strong>PDF Merging:</strong> Joining entire files in a sequential stack (e.g. File A + File B + File C) in their complete state.</li>
                    <li><strong>PDF Combining:</strong> A more surgical process involving extracting selected pages from File A, injecting a blank spacer, adding page 3 of File B, rotating pages in File C, and arranging them to form a brand new custom page flow.</li>
                  </ul>
                  <p>Toolora’s workspace handles both paradigms seamlessly inside the same client-side environment.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">4. Best Free PDF Merger</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>The "best" free PDF merger is one that respects user privacy, delivers high processing speed, and places no restrictive limits. While services like Adobe Acrobat, iLovePDF, and Smallpdf offer tools, they often push subscriptions, limit file sizes, require email sign-ups, or upload your sensitive documents to their servers.</p>
                  <p>Toolora stands out by delivering a truly premium, 100% free experience. Everything runs directly on your CPU, so there are no queue wait times, no ads, and no file uploads. It is the ultimate private alternative.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">5. How to Rearrange PDF Pages</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Rearranging PDF pages is critical when dealing with unsorted scans or out-of-order templates. To rearrange pages in our tool:</p>
                  <p className="mt-2">First, upload your PDF. Toggle the page editor on the document card to view page-level thumbnails. You can click on page actions like "Duplicate" to repeat pages or "Delete" to exclude them. To alter the document assembly order, simply drag cards or use the up/down arrows to shift entire files. Set custom page ranges to pick and choose precise sequences.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">6. How PDF Files Work</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>A PDF (Portable Document Format) is essentially a structured binary file containing a catalog of cross-referenced objects. Unlike HTML documents, which reflow text dynamically, a PDF acts like a physical blueprint. It defines exact coordinates for vector paths, text characters, fonts, and raster images on a canvas layout.</p>
                  <p>When compiling multiple PDFs, a tool must copy these reference objects, map them into a new target catalog, and rebuild the trailer table. Doing this in JS memory (with `pdf-lib`) is highly efficient because it copies object references without inflating file size.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">7. Common PDF Problems</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Users frequently run into several technical hurdles when managing PDFs:</p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li><strong>Corruption:</strong> Incomplete downloads or broken saves result in unreadable cross-reference tables.</li>
                    <li><strong>Missing Previews:</strong> Encrypted or high-resolution pages fail to render fast. Toolora bypasses this by lazy-rendering thumbnails.</li>
                    <li><strong>Bloated File Size:</strong> Image-heavy scans merge into giant, slow-to-send files. You can resolve this using compression tools after combining them.</li>
                  </ul>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">8. How to Merge Password Protected PDFs</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>To merge password-protected PDFs, the files must first be decrypted using their corresponding passwords. Standard tools fail or crash on locked files. Toolora handles this elegantly. When you add a locked PDF, our script flags it as locked and shows an inline password prompt. Typing the password decrypts the document within your browser's temporary memory space. Once unlocked, the pages can be rearranged, previewed, and compiled without exposing the password or the file content to the outside world.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">9. PDF Privacy Guide</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Data privacy is the single most critical factor when handling business contracts, medical files, or tax returns. Online PDF conversion services pose significant risks:</p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>Files are uploaded to remote cloud networks where they may reside in temporary cache folders.</li>
                    <li>Security breaches or misconfigured database storage could expose sensitive data.</li>
                  </ul>
                  <p>To protect your privacy, compile documents using local client-side engines. By executing the merge code locally on your processor, your files never traverse the internet, rendering interception impossible.</p>
                </div>
              </details>

              <details className="group border border-border bg-card rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground hover:bg-secondary/20 transition-all">
                  <h4 className="font-bold text-sm sm:text-base font-outfit">10. How to Compress PDFs After Merging</h4>
                  <span className="shrink-0 rounded-lg border border-border bg-secondary p-1 text-muted transition duration-300 group-open:-rotate-180">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-5 py-4 border-t border-border/40 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
                  <p>Merging multiple large PDFs—especially those containing scanned images—can result in a combined file that is too large to email or upload. To compress the resulting PDF:</p>
                  <p className="mt-2">Use an image downsampler or PDF compressor tool (such as the upcoming Toolora PDF Compressor). These tools extract embedded images, downsample high DPI resolutions, convert colors, and remove redundant metadata structures. This often reduces the final file size by up to 70% while keeping text elements perfectly crisp.</p>
                </div>
              </details>
            </div>

          </div>

          {/* Quick links & Privacy Info (Right) */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2.5">Private Sandbox Guarantee</h3>
            
            <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-5 space-y-4 shadow-premium-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-premium-sm">
                <Icons.Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-outfit text-sm font-bold text-foreground">100% Serverless Execution</h4>
                <p className="text-xs text-muted leading-relaxed mt-1">Toolora uses standard Web APIs and client-side JavaScript. This page operates fully offline. Your document contents are never stored, logged, or analyzed by third parties.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 space-y-4 shadow-premium-sm">
              <h4 className="font-outfit text-xs font-black text-foreground uppercase tracking-wider">Internal Links</h4>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-muted">
                <li>
                  <a href="/tools/pdf-split" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>PDF Splitter</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/10 bg-primary/5 text-primary ml-auto">Soon</span>
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
                <li>
                  <a href="/tools/pdf-to-jpg" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>PDF to JPG</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/10 bg-primary/5 text-primary ml-auto">Soon</span>
                  </a>
                </li>
                <li>
                  <a href="/tools/jpg-to-pdf" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>JPG to PDF</span>
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
