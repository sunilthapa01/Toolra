'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import * as Icons from '@/components/Icons';
import { validateJSON, autoFixJSON, ValidationError } from '@/utils/jsonValidator';
import MonacoEditor from '@/components/MonacoEditor';
import JSONTreeExplorer from '@/components/json/JSONTreeExplorer';
import JSONProblemsPanel from '@/components/json/JSONProblemsPanel';
import JSONCommandPalette, { CommandItem } from '@/components/json/JSONCommandPalette';
import JSONShortcutsModal from '@/components/json/JSONShortcutsModal';
import JSONStatsCard from '@/components/json/JSONStatsCard';
import JSONSearchBar from '@/components/json/JSONSearchBar';
import { getDraft, saveDraft } from '@/lib/storage/indexedDB';


// Default Sample JSON
const SAMPLE_JSON = `{
  "project": "Toolora JSON Formatter & Validator",
  "version": "2.0.0",
  "description": "Fast, professional, IDE-grade developer JSON workspace.",
  "features": [
    "Monaco Code Editor with real-time diagnostics",
    "Interactive collapsible JSON Tree Explorer",
    "VS Code style Command Palette (Ctrl+Shift+P)",
    "Top-docked Problems panel with error stepping (F8)",
    "Live structural statistics and auto-save session"
  ],
  "performance": {
    "largeFileThresholdMB": 2,
    "instantParserMs": 0.42,
    "rating": 5
  }
}`;

export default function JSONFormatter() {
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Client mounting state for React Portal
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Core Editor States
  const [inputJSON, setInputJSON] = useState('');
  const [outputJSON, setOutputJSON] = useState('');
  const [indentSize, setIndentSize] = useState<2 | 4 | 'tab'>(2);
  const [wrapLines, setWrapLines] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  // UI View States
  const [activeRightTab, setActiveRightTab] = useState<'output' | 'tree'>('output');
  const [mobileTab, setMobileTab] = useState<'input' | 'output' | 'tree'>('input');
  const [isProblemsExpanded, setIsProblemsExpanded] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Clipboard Detection & Auto-Paste Suggestion States
  const [suggestedClipboardJSON, setSuggestedClipboardJSON] = useState<string | null>(null);
  const [isSuggestionDismissed, setIsSuggestionDismissed] = useState(false);

  // Search Bar Overlay States
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatchCase, setSearchMatchCase] = useState(false);
  const [searchIsRegex, setSearchIsRegex] = useState(false);

  // Drag & Drop & Large File States
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLargeFile, setIsLargeFile] = useState(false);

  // Monaco and Cursor instances
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [inputEditor, setInputEditor] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync refs to avoid stale closures
  const handleFormatRef = useRef<any>(null);
  const handleMinifyRef = useRef<any>(null);
  const handleAutoFixRef = useRef<any>(null);
  const handlePasteAndFormatRef = useRef<any>(null);

  // Analytics Tracker
  const trackEvent = (eventName: string, metadata: any = {}) => {
    console.log(`[Analytics] ${eventName}`, {
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  };

  // Restore Session on Mount
  useEffect(() => {
    getDraft('json-formatter').then((idbSaved) => {
      try {
        const savedInput = idbSaved || localStorage.getItem('toolora_json_input');
        const savedIndent = localStorage.getItem('toolora_json_indent');
        const savedWrap = localStorage.getItem('toolora_json_wrap');
        const savedTab = localStorage.getItem('toolora_json_tab');

        if (savedInput !== null && savedInput !== undefined) {
          setInputJSON(savedInput);
          if (savedInput.trim()) {
            const valRes = validateJSON(savedInput);
            setErrors(valRes);
            setIsValidated(true);
            if (valRes.some(e => e.severity === 'error')) {
              setIsProblemsExpanded(true);
            }
            if (!valRes.some(e => e.severity === 'error')) {
              try {
                const parsed = JSON.parse(savedInput);
                setOutputJSON(JSON.stringify(parsed, null, 2));
              } catch {}
            }
          }
        } else {
          setInputJSON(SAMPLE_JSON);
          handleFormat(SAMPLE_JSON);
        }

        if (savedIndent) setIndentSize(JSON.parse(savedIndent));
        if (savedWrap) setWrapLines(JSON.parse(savedWrap));
        if (savedTab) setActiveRightTab(JSON.parse(savedTab));
      } catch {
        setInputJSON(SAMPLE_JSON);
        handleFormat(SAMPLE_JSON);
      }
    });
  }, []);

  // Save Session on State Change
  useEffect(() => {
    try {
      localStorage.setItem('toolora_json_input', inputJSON);
      localStorage.setItem('toolora_json_indent', JSON.stringify(indentSize));
      localStorage.setItem('toolora_json_wrap', JSON.stringify(wrapLines));
      localStorage.setItem('toolora_json_tab', JSON.stringify(activeRightTab));
      saveDraft('json-formatter', inputJSON);
    } catch {}

    const byteSize = new Blob([inputJSON]).size;
    setIsLargeFile(byteSize > 2 * 1024 * 1024);
  }, [inputJSON, indentSize, wrapLines, activeRightTab]);


  // Check Clipboard for Valid JSON Suggestion
  const checkClipboardForJSON = async () => {
    if (isSuggestionDismissed) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        const trimmed = (clipText || '').trim();
        if (trimmed && trimmed.length > 0 && trimmed.length < 500000) {
          const valRes = validateJSON(trimmed);
          const hasError = valRes.some(e => e.severity === 'error');
          if (!hasError && trimmed !== inputJSON.trim()) {
            setSuggestedClipboardJSON(trimmed);
            return;
          }
        }
      }
      setSuggestedClipboardJSON(null);
    } catch {
      setSuggestedClipboardJSON(null);
    }
  };

  // Run Clipboard Check on Mount and Window Focus
  useEffect(() => {
    checkClipboardForJSON();
    const handleFocus = () => checkClipboardForJSON();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [inputJSON, isSuggestionDismissed]);

  // One-Click Paste & Format from Clipboard
  const handlePasteAndFormat = async (clipTextOverride?: string) => {
    try {
      let rawText = clipTextOverride;
      if (!rawText) {
        if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
          showToast('Clipboard access unavailable. Press Ctrl+V inside the editor to paste manually.');
          return;
        }
        rawText = await navigator.clipboard.readText();
      }

      const trimmed = (rawText || '').trim();
      if (!trimmed) {
        showToast('Clipboard is empty.');
        return;
      }

      setInputJSON(trimmed);
      setSuggestedClipboardJSON(null);
      setIsSuggestionDismissed(true);

      const valRes = validateJSON(trimmed);
      const hasErrors = valRes.some(err => err.severity === 'error');
      setErrors(valRes);
      setIsValidated(true);

      if (hasErrors) {
        setOutputJSON('');
        setIsProblemsExpanded(true);
        showToast('Pasted JSON from clipboard, but syntax errors were detected. Inspect Problems panel.');
        trackEvent('PasteAndFormat', { status: 'failure', errorsCount: valRes.length });
      } else {
        const parsed = JSON.parse(trimmed);
        const spacer = indentSize === 'tab' ? '\t' : indentSize;
        const formatted = JSON.stringify(parsed, null, spacer);
        setOutputJSON(formatted);
        setIsSuccessAnimated(true);
        trackEvent('PasteAndFormat', { status: 'success' });
      }
    } catch {
      showToast('Clipboard access denied. Press Ctrl+V inside the editor to paste.');
    }
  };
  // Clear workspace
  const handleClear = () => {
    setInputJSON('');
    setOutputJSON('');
    setErrors([]);
    setIsValidated(false);
    showToast('Workspace cleared.');
  };

  // Load Sample
  const handleLoadSample = () => {
    setInputJSON(SAMPLE_JSON);
    handleFormat(SAMPLE_JSON);
    showToast('Sample JSON loaded.');
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (!text.trim()) {
      showToast('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard.`);
  };

  // Download Output JSON
  const handleDownload = () => {
    const content = outputJSON || inputJSON;
    if (!content.trim()) {
      showToast('Nothing to download.');
      return;
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolora-json-${Date.now().toString().slice(-4)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Downloaded JSON file.');
  };

  // Perform Beautify / Formatting
  const handleFormat = (rawText = inputJSON) => {
    const trimmed = rawText.trim();
    if (!trimmed) {
      setOutputJSON('');
      setErrors([]);
      setIsValidated(false);
      return;
    }

    const validationResult = validateJSON(rawText);
    const hasErrors = validationResult.some(err => err.severity === 'error');

    setErrors(validationResult);
    setIsValidated(true);

    if (hasErrors) {
      setOutputJSON('');
      showToast('JSON has syntax errors. Diagnostics displayed in Problems panel above.');
      setIsProblemsExpanded(true);
      trackEvent('Format', { status: 'failure', errorsCount: validationResult.length });
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const spacer = indentSize === 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(parsed, null, spacer);
      setOutputJSON(formatted);
      setMobileTab('output');

      setIsSuccessAnimated(true);
      setTimeout(() => setIsSuccessAnimated(false), 1500);

      showToast('JSON formatted successfully.');
      trackEvent('Format', { status: 'success', indent: indentSize });
    } catch (e: any) {
      setOutputJSON('');
      setErrors([{
        line: 1,
        column: 1,
        message: e.message || 'Syntax error during JSON format.',
        severity: 'error',
        explanation: 'Built-in parser failed to structure raw JSON.',
        suggestion: 'Verify quotes and closing brackets.'
      }]);
      setIsProblemsExpanded(true);
    }
  };

  // Perform Validation Only
  const handleValidate = () => {
    const valRes = validateJSON(inputJSON);
    setErrors(valRes);
    setIsValidated(true);

    const hasErrors = valRes.some(err => err.severity === 'error');
    if (hasErrors) {
      showToast(`Validation failed: ${valRes.filter(e => e.severity === 'error').length} error(s) detected.`);
      setIsProblemsExpanded(true);
    } else {
      showToast('Validation passed! JSON is valid syntax.');
    }
    trackEvent('Validate', { hasErrors, count: valRes.length });
  };

  // Perform Minification
  const handleMinify = () => {
    const trimmed = inputJSON.trim();
    if (!trimmed) {
      showToast('Input JSON is empty.');
      return;
    }

    const valRes = validateJSON(inputJSON);
    if (valRes.some(e => e.severity === 'error')) {
      setErrors(valRes);
      setIsValidated(true);
      setIsProblemsExpanded(true);
      showToast('Validation failed. Fix errors in Problems panel before minifying.');
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const minified = JSON.stringify(parsed);
      setOutputJSON(minified);

      setIsSuccessAnimated(true);
      setTimeout(() => setIsSuccessAnimated(false), 1500);

      showToast('JSON minified to single line.');
      trackEvent('Minify', { status: 'success' });
    } catch {
      showToast('Parser error during minification.');
    }
  };

  // Perform Auto Fix
  const handleAutoFix = () => {
    const trimmed = inputJSON.trim();
    if (!trimmed) {
      showToast('Input JSON is empty.');
      return;
    }

    const res = autoFixJSON(inputJSON);
    setInputJSON(res.fixed);
    if (res.success) {
      handleFormat(res.fixed);
      showToast('JSON auto-fixed and formatted!');
      trackEvent('AutoFix', { status: 'success' });
    } else {
      const valRes = validateJSON(res.fixed);
      setErrors(valRes);
      setIsValidated(true);
      setIsProblemsExpanded(true);
      showToast('JSON partially fixed. Check remaining issues in Problems panel.');
      trackEvent('AutoFix', { status: 'partial' });
    }
  };

  // Sync refs
  useEffect(() => {
    handleFormatRef.current = handleFormat;
    handleMinifyRef.current = handleMinify;
    handleAutoFixRef.current = handleAutoFix;
    handlePasteAndFormatRef.current = handlePasteAndFormat;
  });

  // Jump to specific error line inside Monaco Editor
  const jumpToProblem = (err: ValidationError) => {
    if (!inputEditor || !err.line) return;
    inputEditor.revealPositionInCenter({ lineNumber: err.line, column: err.column || 1 });
    inputEditor.setPosition({ lineNumber: err.line, column: err.column || 1 });
    inputEditor.focus();
  };

  // Cycle next / prev problem
  const handleNextProblem = () => {
    if (errors.length === 0) return;
    const nextIdx = (currentProblemIndex + 1) % errors.length;
    setCurrentProblemIndex(nextIdx);
    jumpToProblem(errors[nextIdx]);
  };

  const handlePrevProblem = () => {
    if (errors.length === 0) return;
    const prevIdx = (currentProblemIndex - 1 + errors.length) % errors.length;
    setCurrentProblemIndex(prevIdx);
    jumpToProblem(errors[prevIdx]);
  };

  // Sync validation error markers in Monaco
  useEffect(() => {
    if (!inputEditor || !monacoInstance) return;
    const model = inputEditor.getModel();
    if (!model) return;

    const markers = errors.map(err => {
      const len = err.endIdx && err.startIdx ? Math.max(1, err.endIdx - err.startIdx) : 1;
      return {
        startLineNumber: err.line || 1,
        startColumn: err.column || 1,
        endLineNumber: err.line || 1,
        endColumn: (err.column || 1) + len,
        message: `${err.message}\n\nReason: ${err.reason || err.explanation || ''}\nSuggested Fix: ${err.suggestion || ''}`,
        severity: err.severity === 'error' ? monacoInstance.MarkerSeverity.Error : monacoInstance.MarkerSeverity.Warning
      };
    });

    monacoInstance.editor.setModelMarkers(model, 'json-validation', markers);
  }, [errors, inputEditor, monacoInstance]);

  // Search Matches State & Logic
  const [searchMatches, setSearchMatches] = useState<any[]>([]);
  const [searchMatchIndex, setSearchMatchIndex] = useState(0);
  const searchDecorationsRef = useRef<string[]>([]);

  // Sync Search Matches with Monaco Model
  useEffect(() => {
    if (!inputEditor || !monacoInstance) {
      setSearchMatches([]);
      setSearchMatchIndex(0);
      return;
    }

    const model = inputEditor.getModel();
    if (!model || !searchQuery) {
      setSearchMatches([]);
      setSearchMatchIndex(0);
      if (searchDecorationsRef.current.length > 0) {
        searchDecorationsRef.current = inputEditor.deltaDecorations(searchDecorationsRef.current, []);
      }
      return;
    }

    try {
      const rawMatches = model.findMatches(
        searchQuery,
        false,
        searchIsRegex,
        searchMatchCase,
        null,
        true
      );
      const matchesList = rawMatches.map((m: any) => m.range);
      setSearchMatches(matchesList);

      if (matchesList.length > 0) {
        const validIdx = searchMatchIndex >= matchesList.length ? 0 : searchMatchIndex;
        if (validIdx !== searchMatchIndex) setSearchMatchIndex(validIdx);

        const newDecorations = matchesList.map((range: any, idx: number) => ({
          range: range,
          options: {
            isWholeLine: false,
            className: idx === validIdx ? 'bg-amber-400/60 dark:bg-amber-500/60 font-black border border-amber-500 rounded-sm' : 'bg-yellow-200/40 dark:bg-yellow-500/25 border border-yellow-400/50 rounded-sm',
          }
        }));
        searchDecorationsRef.current = inputEditor.deltaDecorations(searchDecorationsRef.current, newDecorations);
      } else {
        setSearchMatchIndex(0);
        searchDecorationsRef.current = inputEditor.deltaDecorations(searchDecorationsRef.current, []);
      }
    } catch {
      setSearchMatches([]);
      setSearchMatchIndex(0);
    }
  }, [searchQuery, searchMatchCase, searchIsRegex, inputJSON, inputEditor, monacoInstance, searchMatchIndex]);

  const handleNextSearchMatch = () => {
    if (searchMatches.length === 0 || !inputEditor) return;
    const nextIdx = (searchMatchIndex + 1) % searchMatches.length;
    setSearchMatchIndex(nextIdx);
    const range = searchMatches[nextIdx];
    inputEditor.revealRangeInCenter(range);
    inputEditor.setSelection(range);
    inputEditor.focus();
  };

  const handlePrevSearchMatch = () => {
    if (searchMatches.length === 0 || !inputEditor) return;
    const prevIdx = (searchMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setSearchMatchIndex(prevIdx);
    const range = searchMatches[prevIdx];
    inputEditor.revealRangeInCenter(range);
    inputEditor.setSelection(range);
    inputEditor.focus();
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElem = document.activeElement as HTMLElement | null;
      const isEditingInput = ['INPUT', 'TEXTAREA'].includes(activeElem?.tagName || '') || Boolean(activeElem?.closest('.monaco-editor'));
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteAndFormat();
      }

      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteAndFormat();
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy(outputJSON || inputJSON, 'Output');
      }

      if ((e.altKey && e.key.toLowerCase() === 'c') || (isCtrlOrCmd && e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        handleClear();
      }

      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }

      if (isCtrlOrCmd && !e.shiftKey && e.key.toLowerCase() === 'f' && !isEditingInput) {
        e.preventDefault();
        setIsSearchBarOpen(prev => !prev);
      }

      if (e.key === '?' && !isEditingInput) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }

      if (e.key === 'F8') {
        e.preventDefault();
        if (e.shiftKey) handlePrevProblem();
        else handleNextProblem();
      }

      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextProblem();
      }
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevProblem();
      }

      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleMinify();
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleAutoFix();
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setActiveRightTab(prev => (prev === 'output' ? 'tree' : 'output'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errors, currentProblemIndex, inputJSON, outputJSON, isFullscreen]);

  // Setup Monaco Commands on mount
  const handleInputEditorMount = (editor: any, monaco: any) => {
    setInputEditor(editor);
    setMonacoInstance(monaco);

    editor.addAction({
      id: 'toolora-format-json',
      label: 'Format JSON',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleFormatRef.current?.(),
    });

    editor.addAction({
      id: 'toolora-minify-json',
      label: 'Minify JSON',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
      run: () => handleMinifyRef.current?.(),
    });

    editor.addAction({
      id: 'toolora-autofix-json',
      label: 'Auto-Fix JSON',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      run: () => handleAutoFixRef.current?.(),
    });
  };

  // Safe File Processing Handler (Upload & Drag-and-Drop Validation)
  const processFile = (file: File) => {
    const fileName = file.name || 'document';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['json', 'txt'];

    if (!allowedExts.includes(ext)) {
      showToast(`Cannot open "${fileName}". Only .json and .txt files are supported (rejected .${ext}).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      if (/\u0000/.test(text)) {
        showToast(`Cannot open "${fileName}". File contains binary data and cannot be opened as text.`);
        return;
      }
      setInputJSON(text);
      handleFormat(text);
      showToast(`Loaded file "${fileName}".`);
    };
    reader.onerror = () => {
      showToast(`Error reading file "${fileName}".`);
    };
    reader.readAsText(file);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };
  const commandItems: CommandItem[] = useMemo(() => [
    { id: 'paste_format', title: 'Paste & Format from Clipboard', category: 'Action', shortcut: 'Ctrl+Shift+V', description: 'Read clipboard, validate, and format JSON in 1 click', icon: 'Clipboard', action: () => handlePasteAndFormat() },
    { id: 'find', title: 'Find & Search in Editor', category: 'Edit', shortcut: 'Ctrl+F', description: 'Open search overlay to find text matches in editor', icon: 'Search', action: () => setIsSearchBarOpen(true) },
    { id: 'format', title: 'Format / Beautify JSON', category: 'Format', shortcut: 'Ctrl+Enter', description: 'Beautify JSON payload with custom indentation', icon: 'Zap', action: () => handleFormat() },
    { id: 'validate', title: 'Validate Syntax Diagnostics', category: 'Action', description: 'Run deep syntax validation & check for errors', icon: 'Shield', action: handleValidate },
    { id: 'minify', title: 'Minify to Single Line', category: 'Format', shortcut: 'Ctrl+Shift+M', description: 'Remove all whitespace and minify JSON into single line', icon: 'Terminal', action: handleMinify },
    { id: 'autofix', title: 'Auto-Fix Syntax Errors', category: 'Action', shortcut: 'Ctrl+Shift+F', description: 'Automatically fix unquoted keys, single quotes, & trailing commas', icon: 'Sparkles', action: handleAutoFix },
    { id: 'fullscreen', title: 'Toggle Fullscreen Mode', category: 'View', shortcut: 'Ctrl+Shift+Z', description: 'Expand whole JSON Formatter workspace to full screen', icon: 'Maximize2', action: () => setIsFullscreen(prev => !prev) },
    { id: 'tree_view', title: 'Switch to JSON Tree Explorer', category: 'View', shortcut: 'Ctrl+Shift+E', description: 'View interactive collapsible JSON node tree', icon: 'Layers', action: () => setActiveRightTab('tree') },
    { id: 'output_view', title: 'Switch to Formatted Code View', category: 'View', description: 'View formatted JSON code in Monaco Editor', icon: 'Code', action: () => setActiveRightTab('output') },
    { id: 'stats', title: 'Toggle Structural Analytics', category: 'View', description: 'Show live count of Objects, Arrays, Keys, & Types', icon: 'BarChart2', action: () => setIsStatsOpen(!isStatsOpen) },
    { id: 'problems', title: 'Toggle Problems Panel', category: 'View', description: 'Toggle top error diagnostics panel', icon: 'AlertCircle', action: () => setIsProblemsExpanded(!isProblemsExpanded) },
    { id: 'copy', title: 'Copy Formatted Output', category: 'Action', shortcut: 'Ctrl+Shift+C', description: 'Copy output JSON string to clipboard', icon: 'Copy', action: () => handleCopy(outputJSON || inputJSON, 'Output') },
    { id: 'download', title: 'Download JSON File', category: 'Action', description: 'Download output as a .json file', icon: 'Download', action: handleDownload },
    { id: 'sample', title: 'Load Sample JSON Payload', category: 'Action', description: 'Load a default sample JSON string', icon: 'Files', action: handleLoadSample },
    { id: 'clear', title: 'Clear Workspace Editor', category: 'Action', shortcut: 'Alt+C', description: 'Reset input & output editors', icon: 'X', action: handleClear },
    { id: 'shortcuts', title: 'Keyboard Shortcuts Cheatsheet', category: 'View', shortcut: '?', description: 'View full list of keyboard shortcuts', icon: 'Code', action: () => setIsShortcutsOpen(true) },
  ], [inputJSON, outputJSON, isStatsOpen, isProblemsExpanded, isFullscreen]);

  const content = (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-4 transition-all duration-300 ${
        isFullscreen
          ? 'fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-background p-4 sm:p-6 overflow-y-auto flex flex-col justify-between h-screen w-full font-outfit'
          : 'relative min-h-screen pb-12'
      }`}
    >
      {/* Visual Drag & Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-md border-4 border-dashed border-primary flex flex-col items-center justify-center gap-3 animate-fade-in">
          <Icons.Download className="h-14 w-14 text-primary rotate-180 animate-bounce" />
          <h3 className="text-2xl font-black font-outfit text-foreground">Drop JSON File Here</h3>
          <p className="text-sm font-semibold text-foreground">Supports .json and .txt files for instant formatting</p>
        </div>
      )}

      {/* 1. Main Action Toolbar */}
      {/* Mobile Primary Action Bar (< sm) */}
      <div className="sm:hidden p-1.5 rounded-2xl bg-secondary/30 border border-border shadow-xs flex items-center justify-between gap-1.5 font-outfit">
        <button
          onClick={() => handlePasteAndFormat()}
          title="Paste & Format from Clipboard"
          className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-xl text-xs font-black hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 shadow-premium-sm active:scale-95 shrink-0"
        >
          <Icons.Clipboard className="h-4 w-4" />
          <span>Paste & Format</span>
        </button>

        <button
          onClick={() => handleFormat()}
          title="Format editor content"
          className="py-2 px-3 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/60 transition-all text-foreground flex items-center justify-center gap-1 shrink-0"
        >
          <Icons.Zap className="h-3.5 w-3.5 text-primary" />
          <span>Format</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          title="More Actions & Tools"
          className="p-2 bg-card border border-border rounded-xl text-foreground hover:bg-secondary/60 transition-all shrink-0 active:scale-95"
        >
          <Icons.MoreHorizontal className="h-4 w-4 text-primary" />
        </button>
      </div>

      {/* Desktop Main Action Toolbar (>= sm) */}
      <div className="hidden sm:block p-3.5 rounded-2xl bg-secondary/20 border-2 border-border shadow-premium-sm space-y-2 font-outfit">
        {/* Row 1: Primary Actions (Always accessible) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => handlePasteAndFormat()}
            title="Paste JSON from Clipboard & Format Instantly (Ctrl+Shift+V)"
            className="px-3.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-extrabold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-premium-sm active:scale-95 shrink-0"
          >
            <Icons.Clipboard className="h-4 w-4" />
            <span>Paste & Format</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-primary-foreground/20 rounded font-mono-calc font-extrabold text-primary-foreground hidden sm:inline">Ctrl+Shift+V</kbd>
          </button>

          <button
            onClick={() => handleFormat()}
            title="Format current editor content (Ctrl+Enter)"
            className="px-3 py-2 bg-card border-2 border-border rounded-xl text-xs sm:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Icons.Zap className="h-4 w-4 text-primary" />
            <span>Format</span>
          </button>

          <button
            onClick={handleMinify}
            className="px-3 py-2 bg-card border-2 border-border rounded-xl text-xs sm:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
            title="Minify JSON (Ctrl+Shift+M)"
          >
            <Icons.Terminal className="h-4 w-4 text-primary" />
            <span>Minify</span>
          </button>

          <button
            onClick={handleClear}
            className="p-2 border-2 border-destructive/30 text-destructive hover:bg-destructive/15 rounded-xl transition-all font-bold shrink-0"
            title="Clear Workspace (Alt+C)"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Row 2: Secondary Tools & Utilities (Horizontally Scrollable on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-border/40 py-0.5">
          <button
            onClick={handleLoadSample}
            className="px-2.5 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
            title="Load sample JSON payload"
          >
            <Icons.Files className="h-3.5 w-3.5 text-primary" />
            <span>Sample JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
            title="Upload file (.json, .txt)"
          >
            <Icons.Download className="h-3.5 w-3.5 rotate-180 text-primary" />
            <span>Upload File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.txt"
            className="hidden"
          />

          <button
            onClick={handleValidate}
            className="px-2.5 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
            title="Run syntax diagnostics validation"
          >
            <Icons.Shield className="h-3.5 w-3.5 text-primary" />
            <span>Validate</span>
          </button>

          <button
            onClick={handleAutoFix}
            className="px-2.5 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shadow-xs shrink-0"
            title="Auto-Fix common syntax errors (Ctrl+Shift+F)"
          >
            <Icons.Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Auto Fix</span>
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Open Command Palette (Ctrl+Shift+P)"
            className="px-2.5 py-1.5 bg-primary/10 border border-primary/30 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all text-primary flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Icons.Search className="h-3.5 w-3.5" />
            <span>Commands</span>
          </button>

          <button
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts Cheatsheet (?)"
            className="px-2.5 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/50 transition-all text-foreground flex items-center gap-1.5 shrink-0"
          >
            <Icons.Code className="h-3.5 w-3.5 text-primary" />
            <span>Shortcuts</span>
          </button>

          <button
            onClick={() => handleCopy(outputJSON || inputJSON, 'Output')}
            disabled={!outputJSON && !inputJSON}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
              outputJSON || inputJSON
                ? 'bg-card border-border hover:bg-secondary/50 text-foreground shadow-xs'
                : 'bg-secondary/20 border-border/40 text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
            title="Copy Output (Ctrl+Shift+C)"
          >
            <Icons.Copy className="h-3.5 w-3.5 text-primary" />
            <span>Copy</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputJSON && !inputJSON}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 ${
              outputJSON || inputJSON
                ? 'bg-card border-border hover:bg-secondary/50 text-foreground shadow-xs'
                : 'bg-secondary/20 border-border/40 text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
            title="Download JSON file"
          >
            <Icons.Download className="h-3.5 w-3.5 text-primary" />
            <span>Download</span>
          </button>

          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            title={isFullscreen ? 'Exit Fullscreen Mode (Esc)' : 'Expand JSON Formatter to Full Screen (Ctrl+Shift+Z)'}
            className={`px-2.5 py-1.5 border rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
              isFullscreen
                ? 'bg-primary text-primary-foreground border-primary shadow-premium-sm'
                : 'bg-card border-border hover:bg-secondary/50 text-foreground'
            }`}
          >
            {isFullscreen ? (
              <Icons.Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Icons.Maximize2 className="h-3.5 w-3.5 text-primary" />
            )}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Non-Intrusive Auto-Paste Suggestion Banner */}
      {suggestedClipboardJSON && !isSuggestionDismissed && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-primary/10 border-2 border-primary/40 text-foreground animate-fade-in shadow-premium-sm font-outfit">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary shrink-0">
              <Icons.Sparkles className="h-4 w-4 animate-pulse text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-foreground">
                Valid JSON detected in your clipboard!
              </p>
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Would you like to paste, validate, and format it in 1 click?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handlePasteAndFormat(suggestedClipboardJSON)}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:bg-primary/95 transition-all flex items-center gap-1 shadow-xs"
            >
              <Icons.Zap className="h-3.5 w-3.5" />
              <span>Paste & Format</span>
            </button>
            <button
              onClick={() => setIsSuggestionDismissed(true)}
              className="p-1 hover:bg-secondary/60 rounded-xl text-muted-foreground hover:text-foreground transition-all"
              title="Dismiss suggestion"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Structural Analytics Card (toggled via status bar or commands) */}
      {isStatsOpen && (
        <JSONStatsCard
          jsonText={inputJSON}
          isOpen={isStatsOpen}
          onToggle={() => setIsStatsOpen(!isStatsOpen)}
        />
      )}

      {/* 3. Auto-Expanding Problems & Diagnostics Panel */}
      <JSONProblemsPanel
        errors={errors}
        isOpen={isProblemsExpanded}
        onToggle={() => setIsProblemsExpanded(!isProblemsExpanded)}
        onSelectError={jumpToProblem}
        onNextError={handleNextProblem}
        onPrevError={handlePrevProblem}
        currentIndex={currentProblemIndex}
      />

      {/* 4. Mobile Segmented Tab Switcher (< lg) */}
      <div className="lg:hidden flex items-center justify-between p-1 bg-secondary/30 rounded-xl border border-border/80 my-2">
        <button
          onClick={() => setMobileTab('input')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 touch-target ${
            mobileTab === 'input'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-foreground/80 hover:text-foreground'
          }`}
        >
          <Icons.Code className="h-3.5 w-3.5" />
          <span>Input</span>
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 touch-target ${
            mobileTab === 'output'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-foreground/80 hover:text-foreground'
          }`}
        >
          <Icons.Zap className="h-3.5 w-3.5" />
          <span>Formatted</span>
        </button>
        <button
          onClick={() => setMobileTab('tree')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 touch-target ${
            mobileTab === 'tree'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-foreground/80 hover:text-foreground'
          }`}
        >
          <Icons.Layers className="h-3.5 w-3.5" />
          <span>Tree</span>
        </button>
      </div>

      {/* 5. Main Split Workspace Editors */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${isFullscreen ? 'flex-1 my-1' : ''}`}>
        {/* Left Side: Input Monaco Editor */}
        <div className={`flex flex-col space-y-2 relative ${mobileTab === 'input' ? 'block' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase text-foreground tracking-wider sm:tracking-widest">
                JSON Input Editor
              </span>
              {errors.length > 0 && (
                <span className="text-destructive font-black bg-destructive/10 px-1.5 py-0.5 rounded-lg border border-destructive/20 text-[10px] sm:text-[11px]">
                  {errors.length} {errors.length === 1 ? 'Issue' : 'Issues'}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
              className="text-[10px] sm:text-xs font-bold text-foreground/80 hover:text-primary transition-all flex items-center gap-1 bg-secondary/30 hover:bg-secondary/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-border/60"
              title="Find in editor (Ctrl+F)"
            >
              <Icons.Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Find <span className="hidden sm:inline">(Ctrl+F)</span></span>
            </button>
          </div>

          <div
            className={`relative border-2 border-border rounded-2xl overflow-hidden shadow-premium-sm bg-card transition-all ${
              isFullscreen ? 'h-[calc(100vh-280px)] min-h-[350px]' : 'h-[calc(100vh-190px)] sm:h-[480px] lg:h-[580px]'
            }`}
          >
            <JSONSearchBar
              isOpen={isSearchBarOpen}
              onClose={() => setIsSearchBarOpen(false)}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              matchCase={searchMatchCase}
              onMatchCaseChange={setSearchMatchCase}
              isRegex={searchIsRegex}
              onIsRegexChange={setSearchIsRegex}
              onNextMatch={handleNextSearchMatch}
              onPrevMatch={handlePrevSearchMatch}
              matchCount={searchMatches.length}
              currentMatchIndex={searchMatchIndex}
            />
            <MonacoEditor
              value={inputJSON}
              onChange={(val) => {
                setInputJSON(val);
                if (isValidated) setErrors(validateJSON(val));
              }}
              language="json"
              theme={theme}
              options={{ wordWrap: wrapLines ? 'on' : 'off' }}
              onEditorMount={handleInputEditorMount}
              onCursorChange={(line, col) => setCursorPos({ line, column: col })}
            />
          </div>
        </div>

        {/* Right Side: Formatted Output / JSON Tree Explorer */}
        <div className={`flex flex-col space-y-2 relative ${mobileTab === 'output' || mobileTab === 'tree' ? 'block' : 'hidden lg:flex'}`}>
          <div className="flex items-center justify-between px-1 gap-1">
            {/* View Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-secondary/30 p-0.5 sm:p-1 rounded-xl border border-border/70">
              <button
                onClick={() => {
                  setActiveRightTab('output');
                  setMobileTab('output');
                }}
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase transition-all flex items-center gap-1 sm:gap-1.5 ${
                  (activeRightTab === 'output' && mobileTab !== 'tree')
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                <Icons.Code className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">Formatted Code</span>
                <span className="sm:hidden">Formatted</span>
              </button>
              <button
                onClick={() => {
                  setActiveRightTab('tree');
                  setMobileTab('tree');
                }}
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase transition-all flex items-center gap-1 sm:gap-1.5 ${
                  (activeRightTab === 'tree' || mobileTab === 'tree')
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                <Icons.Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">Tree Explorer</span>
                <span className="sm:hidden">Tree</span>
              </button>
            </div>

            {(activeRightTab === 'output' && mobileTab !== 'tree') && (
              <button
                onClick={() => handleCopy(outputJSON, 'Output')}
                disabled={!outputJSON}
                className={`text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border ${
                  outputJSON
                    ? 'bg-secondary/30 hover:bg-secondary/60 text-foreground border-border/60'
                    : 'bg-secondary/20 text-muted-foreground border-border/40 opacity-50 cursor-not-allowed'
                }`}
                title="Copy formatted JSON output (Ctrl+Shift+C)"
              >
                <Icons.Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">Copy Output</span>
                <span className="sm:hidden">Copy</span>
              </button>
            )}
          </div>

          <div
            className={`relative border-2 border-border rounded-2xl overflow-hidden shadow-premium-sm bg-card transition-all ${
              isFullscreen ? 'h-[calc(100vh-280px)] min-h-[350px]' : 'h-[calc(100vh-190px)] sm:h-[480px] lg:h-[580px]'
            }`}
          >
            {(activeRightTab === 'output' && mobileTab !== 'tree') ? (
              outputJSON ? (
                <MonacoEditor
                  value={outputJSON}
                  readOnly={true}
                  language="json"
                  theme={theme}
                  options={{ wordWrap: wrapLines ? 'on' : 'off' }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground font-semibold space-y-3 bg-secondary/10 font-outfit">
                  <Icons.AlertCircle className="h-10 w-10 text-amber-500/80 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-foreground">
                      No Formatted Output Available
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                      {errors.some(e => e.severity === 'error')
                        ? 'Formatting failed due to syntax errors. Inspect and resolve issues in the Problems panel above.'
                        : 'Enter a valid JSON payload and click Format to generate formatted code.'}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <JSONTreeExplorer
                jsonString={inputJSON}
                onSelectNodePath={(path, line) => {
                  if (inputEditor) {
                    inputEditor.revealPositionInCenter({ lineNumber: line, column: 1 });
                    inputEditor.setPosition({ lineNumber: line, column: 1 });
                    inputEditor.focus();
                  }
                  setMobileTab('input');
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 5. IDE Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 bg-card border-2 border-border/80 rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono-calc font-bold text-foreground shadow-premium-sm">
        {/* Left Side: Status & Diagnostics Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsProblemsExpanded(!isProblemsExpanded)}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity cursor-pointer text-[10px] sm:text-xs"
            title="Toggle Diagnostics Panel (F8)"
          >
            {!inputJSON.trim() ? (
              <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-muted-foreground/40" />
                <span>Empty Workspace</span>
              </span>
            ) : errors.length === 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>✓ Valid JSON</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-destructive font-black bg-destructive/10 px-1.5 py-0.5 rounded-lg border border-destructive/20">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-destructive animate-pulse" />
                <span>❌ {errors.filter(e => e.severity === 'error').length} Errors</span>
              </span>
            )}
          </button>

          {isLargeFile && (
            <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-md font-black text-[10px] flex items-center gap-1">
              <Icons.AlertCircle className="h-3 w-3" />
              <span>&gt;2MB</span>
            </span>
          )}
        </div>

        {/* Right Side: Cursor, Stats, Indent & Wrap Interactive Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-bold text-foreground">
          <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
          <span className="h-3 w-px bg-border/80 hidden sm:inline" />
          <span className="hidden sm:inline">{inputJSON.split('\n').length} lines</span>
          <span className="h-3 w-px bg-border/80" />

          {/* Indent Selector Button */}
          <button
            onClick={() => setIndentSize(prev => (prev === 2 ? 4 : prev === 4 ? 'tab' : 2))}
            className="hover:text-primary transition-colors flex items-center gap-1 bg-secondary/30 hover:bg-secondary/60 px-1.5 py-0.5 rounded border border-border/60 text-[10px] sm:text-xs"
            title="Click to cycle Indentation (2 spaces / 4 spaces / Tab)"
          >
            <span>Spaces: {indentSize === 'tab' ? 'Tab' : indentSize}</span>
          </button>

          {/* Line Wrap Toggle */}
          <button
            onClick={() => setWrapLines(!wrapLines)}
            className={`hidden sm:flex transition-colors items-center gap-1 px-2 py-0.5 rounded border text-[10px] sm:text-xs ${
              wrapLines
                ? 'bg-primary/15 text-primary border-primary/40 font-extrabold'
                : 'bg-secondary/30 text-foreground/70 hover:text-foreground border-border/60'
            }`}
            title="Toggle Line Wrap"
          >
            <span>Wrap: {wrapLines ? 'On' : 'Off'}</span>
          </button>

          {/* Analytics Toggle */}
          <button
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className={`hidden sm:flex transition-colors items-center gap-1 px-2 py-0.5 rounded border text-[10px] sm:text-xs ${
              isStatsOpen
                ? 'bg-primary/15 text-primary border-primary/40 font-extrabold'
                : 'bg-secondary/30 text-foreground/70 hover:text-foreground border-border/60'
            }`}
            title="Toggle Structural Analytics"
          >
            <Icons.BarChart2 className="h-3 w-3" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Command Palette & Shortcuts Modals */}
      <JSONCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commandItems}
      />

      <JSONShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Mobile Floating Bottom Bar for 1-Tap Copy & Quick View Switching (< sm) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-card/90 backdrop-blur-md border-2 border-border/80 shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2 font-outfit">
        <button
          onClick={() => handleCopy(outputJSON || inputJSON, 'Output')}
          disabled={!outputJSON && !inputJSON}
          className="flex-1 py-2 px-3 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-premium-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Icons.Copy className="h-4 w-4" />
          <span>Copy</span>
        </button>

        <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setMobileTab('input')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
              mobileTab === 'input' ? 'bg-primary text-primary-foreground' : 'text-foreground/80'
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setMobileTab('output')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
              mobileTab === 'output' ? 'bg-primary text-primary-foreground' : 'text-foreground/80'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setMobileTab('tree')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
              mobileTab === 'tree' ? 'bg-primary text-primary-foreground' : 'text-foreground/80'
            }`}
          >
            Tree
          </button>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="p-2 bg-secondary/60 border border-border rounded-xl text-foreground font-bold active:scale-95 transition-all shrink-0"
          title="More Tools & Actions"
        >
          <Icons.MoreHorizontal className="h-4 w-4 text-primary" />
        </button>
      </div>

      {/* Mobile Actions Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-50 bg-card border-t-2 border-border rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-outfit"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Icons.Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-extrabold text-base text-foreground">Developer Actions & Tools</h3>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <Icons.X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => { handleLoadSample(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Files className="h-4 w-4 text-primary shrink-0" />
                  <span>Sample JSON</span>
                </button>

                <button
                  onClick={() => { fileInputRef.current?.click(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Download className="h-4 w-4 rotate-180 text-primary shrink-0" />
                  <span>Upload File</span>
                </button>

                <button
                  onClick={() => { handleMinify(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Terminal className="h-4 w-4 text-primary shrink-0" />
                  <span>Minify JSON</span>
                </button>

                <button
                  onClick={() => { handleValidate(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Shield className="h-4 w-4 text-primary shrink-0" />
                  <span>Validate Syntax</span>
                </button>

                <button
                  onClick={() => { handleAutoFix(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>Auto-Fix Syntax</span>
                </button>

                <button
                  onClick={() => { setIsStatsOpen(prev => !prev); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.BarChart2 className="h-4 w-4 text-primary shrink-0" />
                  <span>JSON Statistics</span>
                </button>

                <button
                  onClick={() => { setIsCommandPaletteOpen(true); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Search className="h-4 w-4 text-primary shrink-0" />
                  <span>Command Palette</span>
                </button>

                <button
                  onClick={() => { setIsShortcutsOpen(true); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Code className="h-4 w-4 text-primary shrink-0" />
                  <span>Shortcuts</span>
                </button>

                <button
                  onClick={() => { handleDownload(); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Download className="h-4 w-4 text-primary shrink-0" />
                  <span>Download .json</span>
                </button>

                <button
                  onClick={() => { setIsFullscreen(prev => !prev); setIsMobileDrawerOpen(false); }}
                  className="p-3 bg-secondary/30 hover:bg-secondary border border-border rounded-xl flex items-center gap-2.5 text-xs font-bold text-foreground text-left"
                >
                  <Icons.Maximize2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Fullscreen</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { handleClear(); setIsMobileDrawerOpen(false); }}
                  className="w-full p-3 border border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Icons.X className="h-4 w-4" />
                  <span>Clear Workspace</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isFullscreen && isMounted && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}
