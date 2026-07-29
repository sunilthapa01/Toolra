'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { validateJSON, autoFixJSON, ValidationError } from '@/utils/jsonValidator';
import MonacoEditor from '@/components/MonacoEditor';

// Sample JSON loaded instantly
const SAMPLE_JSON = `{
  "project": "Toolora JSON Formatter & Validator",
  "version": "1.0.0",
  "description": "Fast, premium, and 100% offline JSON utility.",
  "privacy": {
    "serverUploads": false,
    "localProcessing": true,
    "secure": true
  },
  "features": [
    "Beautify with customizable spacing",
    "Deep validation with line-specific errors",
    "Duplicate keys auditing",
    "Instant minification",
    "Keyboard shortcuts support",
    "File upload and download"
  ],
  "stats": {
    "speedMs": 0.85,
    "rating": 5,
    "activeUsers": 25000
  }
}`;

export default function JSONFormatter() {
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Core Editor States
  const [inputJSON, setInputJSON] = useState('');
  const [outputJSON, setOutputJSON] = useState('');
  const [indentSize, setIndentSize] = useState<2 | 4 | 'tab'>(2);
  const [wrapLines, setWrapLines] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  // Status Bar states
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [isProblemsExpanded, setIsProblemsExpanded] = useState(false);

  // Monaco and Editor instances
  const [inputEditor, setInputEditor] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync scroll references and actions inside refs to avoid stale closures in Monaco commands
  const handleFormatRef = useRef<any>(null);
  const handleMinifyRef = useRef<any>(null);

  // Analytics Helper
  const trackEvent = (eventName: string, metadata: any = {}) => {
    console.log(`[Analytics] ${eventName}`, {
      ...metadata,
      timestamp: new Date().toISOString(),
      platform: 'Browser'
    });
  };

  // Perform Beautify/Formatting
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
      showToast('JSON validation failed. Fix errors shown in Problems panel.');
      setIsProblemsExpanded(true);
      trackEvent('ValidateButton', { status: 'failure', errorsCount: validationResult.length });
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const spacer = indentSize === 'tab' ? '\t' : indentSize;
      const formatted = JSON.stringify(parsed, null, spacer);
      setOutputJSON(formatted);

      // Trigger formatting success animations
      setIsSuccessAnimated(true);
      setTimeout(() => setIsSuccessAnimated(false), 1500);

      showToast('JSON formatted successfully.');
      trackEvent('FormatButton', { status: 'success', indent: indentSize });
    } catch (e: any) {
      setErrors([{
        line: 1,
        column: 1,
        message: e.message || 'Invalid JSON syntax.',
        severity: 'error',
        explanation: 'The built-in parser failed to parse the JSON string.',
        suggestion: 'Check the syntax for stray characters or unclosed elements.'
      }]);
      showToast('Unexpected parser error.');
      setIsProblemsExpanded(true);
    }
  };

  // Perform Validation only
  const handleValidate = () => {
    const validationResult = validateJSON(inputJSON);
    setErrors(validationResult);
    setIsValidated(true);

    const hasErrors = validationResult.some(err => err.severity === 'error');
    if (hasErrors) {
      showToast(`Validation failed: ${validationResult.filter(e => e.severity === 'error').length} error(s) found.`);
      setIsProblemsExpanded(true);
      trackEvent('ValidateButton', { status: 'failure', errorsCount: validationResult.length });
    } else {
      showToast('Validation successful! JSON is valid.');
      trackEvent('ValidateButton', { status: 'success' });
    }
  };

  // Perform Minification
  const handleMinify = () => {
    const trimmed = inputJSON.trim();
    if (!trimmed) {
      showToast('Input JSON is empty.');
      return;
    }

    const validationResult = validateJSON(inputJSON);
    const hasErrors = validationResult.some(err => err.severity === 'error');

    setErrors(validationResult);
    setIsValidated(true);

    if (hasErrors) {
      showToast('Validation failed. Fix errors before minifying.');
      setIsProblemsExpanded(true);
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const minified = JSON.stringify(parsed);
      setOutputJSON(minified);

      setIsSuccessAnimated(true);
      setTimeout(() => setIsSuccessAnimated(false), 1500);

      showToast('JSON minified successfully.');
      trackEvent('MinifyButton', { status: 'success' });
    } catch (e: any) {
      showToast('Unexpected minification parser error.');
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
    if (res.success) {
      setInputJSON(res.fixed);
      handleFormat(res.fixed);
      showToast('JSON successfully auto-fixed and formatted!');
      trackEvent('AutoFixButton', { status: 'success' });
    } else {
      setInputJSON(res.fixed);
      const validationResult = validateJSON(res.fixed);
      setErrors(validationResult);
      setIsValidated(true);
      setIsProblemsExpanded(true);
      showToast('JSON partially fixed. Some issues require manual resolution.');
      trackEvent('AutoFixButton', { status: 'partial', error: res.error });
    }
  };

  // Update refs for Monaco commands
  useEffect(() => {
    handleFormatRef.current = handleFormat;
    handleMinifyRef.current = handleMinify;
  });

  // Setup sample JSON initially
  useEffect(() => {
    setInputJSON(SAMPLE_JSON);
    handleFormat(SAMPLE_JSON);
  }, []);

  // Sync validation markers in Monaco Editor when errors change
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
        message: `${err.message}\n\nExplanation: ${err.explanation || ''}\nSuggestion: ${err.suggestion || ''}`,
        severity: err.severity === 'error' ? monacoInstance.MarkerSeverity.Error : monacoInstance.MarkerSeverity.Warning
      };
    });

    monacoInstance.editor.setModelMarkers(model, 'json-validation', markers);
  }, [errors, inputEditor, monacoInstance]);

  // Handle live typing/change
  const handleInputChange = (newValue: string) => {
    setInputJSON(newValue);
    if (isValidated) {
      setErrors(validateJSON(newValue));
    }
  };

  // Copy to Clipboard helper
  const handleCopy = (text: string, source: 'input' | 'output') => {
    if (!text) {
      showToast('No JSON to copy.');
      return;
    }
    navigator.clipboard.writeText(text);
    showToast(`Copied ${source} JSON to clipboard.`);
    trackEvent('CopyButton', { source });
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
    a.download = `toolora-formatted-${Date.now().toString().slice(-4)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('JSON file downloaded successfully.');
    trackEvent('Download');
  };

  // Upload JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputJSON(text);
      setErrors([]);
      setIsValidated(false);
      setOutputJSON('');
      showToast(`Uploaded "${file.name}" successfully.`);
      trackEvent('Upload', { filename: file.name, size: file.size });
      
      // Autoformat newly uploaded JSON
      handleFormat(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear Editor
  const handleClear = () => {
    setInputJSON('');
    setOutputJSON('');
    setErrors([]);
    setIsValidated(false);
    showToast('Editor cleared.');
    trackEvent('ClearEditor');
  };

  // Load sample JSON
  const handleLoadSample = () => {
    setInputJSON(SAMPLE_JSON);
    setErrors([]);
    setIsValidated(false);
    handleFormat(SAMPLE_JSON);
    showToast('Sample JSON loaded.');
    trackEvent('SampleJSONLoaded');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      // Format: Ctrl/Cmd + Enter
      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }

      // Minify: Ctrl/Cmd + Shift + M
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleMinify();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputJSON, indentSize]);

  // Jump to specific error line inside Monaco Editor
  const jumpToProblem = (lineNum: number, columnNum: number) => {
    if (!inputEditor) return;
    inputEditor.revealPositionInCenter({ lineNumber: lineNum, column: columnNum });
    inputEditor.setPosition({ lineNumber: lineNum, column: columnNum });
    inputEditor.focus();
  };

  // Setup Monaco Commands on mount
  const handleInputEditorMount = (editor: any, monaco: any) => {
    setInputEditor(editor);
    setMonacoInstance(monaco);

    // Register shortcuts in Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (handleFormatRef.current) handleFormatRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM, () => {
      if (handleMinifyRef.current) handleMinifyRef.current();
    });
  };

  // File size formatter
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 1. Section Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="space-y-1">
          <h3 className="text-sm font-bold font-outfit text-foreground uppercase tracking-widest flex items-center gap-2">
            <Icons.Code className="h-4 w-4 text-primary" />
            JSON Workspace
          </h3>
          <p className="text-[11px] text-muted">
            Format, validate, and minify your JSON payloads locally with a VS Code-grade editor.
          </p>
        </div>
      </div>

      {/* 2. Structured Grouped Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-secondary/15 border border-border/80 shadow-premium-sm">
        {/* Left: Input & Processing groups */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Group 1: Input */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Input:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLoadSample}
                title="Load Sample JSON"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Files className="h-3.5 w-3.5 text-primary" />
                <span>Sample</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload JSON File"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Download className="h-3.5 w-3.5 rotate-180 text-primary" />
                <span>Upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,.txt"
                className="hidden"
              />
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-border/80" />

          {/* Group 2: Processing */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Process:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleFormat()}
                title="Format/Beautify JSON (Ctrl+Enter)"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/95 transition-all shadow-premium-sm"
              >
                <Icons.Zap className="h-3.5 w-3.5" />
                <span>Format</span>
              </button>
              <button
                onClick={handleValidate}
                title="Validate JSON Syntax"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Shield className="h-3.5 w-3.5 text-primary" />
                <span>Validate</span>
              </button>
              <button
                onClick={handleMinify}
                title="Minify JSON to single line (Ctrl+Shift+M)"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Minify</span>
              </button>
              <button
                onClick={handleAutoFix}
                title="Auto-repair single quotes, unquoted keys, trailing commas, missing closing brackets"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Auto Fix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Output group */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block h-6 w-px bg-border/80" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Output:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy(outputJSON || inputJSON, outputJSON ? 'output' : 'input')}
                title="Copy output to Clipboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Copy className="h-3.5 w-3.5 text-primary" />
                <span>Copy</span>
              </button>
              <button
                onClick={handleDownload}
                title="Download formatted file"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Download className="h-3.5 w-3.5 text-primary" />
                <span>Download</span>
              </button>
              <button
                onClick={handleClear}
                title="Reset Editors"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl text-xs font-semibold transition-all"
              >
                <Icons.X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Settings & Shortcuts row */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs p-1 bg-secondary/5 rounded-xl">
        <div className="flex flex-wrap items-center gap-5">
          {/* Indentation Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Spacing:</span>
            <div className="inline-flex rounded-xl bg-card border border-border p-1 gap-0.5">
              {([2, 4, 'tab'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setIndentSize(size);
                    trackEvent('IndentSizeChange', { size });
                  }}
                  className={`px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-lg transition-all ${
                    indentSize === size
                      ? 'bg-primary text-primary-foreground font-black'
                      : 'text-muted hover:text-foreground hover:bg-secondary/20'
                  }`}
                >
                  {size === 'tab' ? 'Tab' : `${size} Space`}
                </button>
              ))}
            </div>
          </div>

          {/* Word Wrap Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Line Wrap:</span>
            <button
              onClick={() => {
                setWrapLines(!wrapLines);
                trackEvent('LineWrapToggle', { wrap: !wrapLines });
              }}
              className={`px-2.5 py-1 border rounded-xl text-[10px] font-bold uppercase transition-all ${
                wrapLines
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted hover:text-foreground'
              }`}
            >
              {wrapLines ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Quick shortcuts info */}
        <div className="hidden md:flex items-center gap-4 text-[10px] text-muted/80 font-medium">
          <span className="flex items-center gap-1">
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Ctrl</kbd>+
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Enter</kbd>
            <span className="text-muted/65 ml-1">Format</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Ctrl</kbd>+
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">Shift</kbd>+
            <kbd className="bg-card border border-border px-1.5 py-0.5 rounded shadow-sm text-foreground">M</kbd>
            <span className="text-muted/65 ml-1">Minify</span>
          </span>
        </div>
      </div>

      {/* 4. Side-by-Side or Stacked Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Input Editor */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">JSON Input</span>
            <button
              onClick={handleValidate}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <Icons.Shield className="h-3 w-3" />
              Validate Only
            </button>
          </div>
          <div className="h-[550px] relative border border-border/80 rounded-2xl overflow-hidden shadow-premium-sm">
            <MonacoEditor
              value={inputJSON}
              onChange={handleInputChange}
              language="json"
              theme={theme}
              options={{ wordWrap: wrapLines ? 'on' : 'off' }}
              onEditorMount={handleInputEditorMount}
              onCursorChange={(line, col) => setCursorPos({ line, column: col })}
            />
          </div>
        </div>

        {/* Right Side: Formatted Output */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest flex items-center gap-2">
              Formatted Output
              {isSuccessAnimated && (
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase animate-fade-in-out">
                  Formatted
                </span>
              )}
            </span>
            <button
              onClick={() => handleCopy(outputJSON, 'output')}
              disabled={!outputJSON}
              className="text-[10px] font-bold text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              <Icons.Copy className="h-3 w-3" />
              Copy Output
            </button>
          </div>
          <div className="h-[550px] relative border border-border/80 rounded-2xl overflow-hidden shadow-premium-sm">
            <MonacoEditor
              value={outputJSON}
              readOnly={true}
              language="json"
              theme={theme}
              options={{ wordWrap: wrapLines ? 'on' : 'off' }}
            />
          </div>
        </div>
      </div>

      {/* 5. VS Code Status Bar */}
      <div className="flex flex-wrap items-center justify-between bg-card border border-border/80 rounded-2xl px-4 py-2 text-[11px] font-mono-calc text-muted shadow-premium-sm">
        {/* Left side: Validity status */}
        <div className="flex items-center gap-2">
          {!inputJSON.trim() ? (
            <span className="flex items-center gap-1.5 text-muted-foreground/60">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span>JSON: Empty</span>
            </span>
          ) : errors.length === 0 ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>JSON: Valid</span>
            </span>
          ) : errors.some(e => e.severity === 'error') ? (
            <span className="flex items-center gap-1.5 text-destructive font-bold">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span>JSON: Invalid ({errors.filter(e => e.severity === 'error').length} errors)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>JSON: Warnings ({errors.filter(e => e.severity === 'warning').length} warnings)</span>
            </span>
          )}
        </div>

        {/* Right side: cursor, lines, size, spacing */}
        <div className="flex items-center gap-4">
          <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
          <span className="h-3.5 w-px bg-border" />
          <span>{inputJSON.split('\n').length} lines</span>
          <span className="h-3.5 w-px bg-border" />
          <span>{formatFileSize(new Blob([inputJSON]).size)}</span>
          <span className="h-3.5 w-px bg-border" />
          <span>Spaces: {indentSize === 'tab' ? 'Tab' : indentSize}</span>
        </div>
      </div>

      {/* 6. Collapsible Problems Panel */}
      <div className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-premium-sm transition-all duration-300">
        {/* Panel Header */}
        <button
          onClick={() => setIsProblemsExpanded(!isProblemsExpanded)}
          className="w-full flex items-center justify-between px-5 py-3 border-b border-border/60 hover:bg-secondary/20 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              errors.length === 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : errors.some(e => e.severity === 'error')
                ? 'bg-destructive/10 text-destructive'
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {errors.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider font-outfit text-foreground flex items-center gap-1.5">
              Problems
              {errors.length > 0 && (
                <span className="text-[10px] text-muted font-normal lowercase">
                  ({errors.filter(e => e.severity === 'error').length} errors, {errors.filter(e => e.severity === 'warning').length} warnings)
                </span>
              )}
            </span>
          </div>
          <Icons.ChevronDown className={`h-4 w-4 text-muted transition-transform duration-300 ${isProblemsExpanded ? '' : 'rotate-180'}`} />
        </button>

        {/* Panel Content (Errors List) */}
        <AnimatePresence initial={false}>
          {isProblemsExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 divide-y divide-border/40 max-h-[250px] overflow-y-auto font-mono-calc">
                {errors.length === 0 ? (
                  <div className="p-4 text-xs text-muted text-center italic select-none">
                    No problems have been detected in the workspace.
                  </div>
                ) : (
                  errors.map((err, i) => (
                    <div
                      key={i}
                      onClick={() => err.line && jumpToProblem(err.line, err.column)}
                      className="py-3 px-2 first:pt-1 last:pb-1 flex items-start gap-3.5 cursor-pointer hover:bg-secondary/35 rounded-xl transition-all"
                    >
                      {/* Indicator Badge */}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mt-0.5 shrink-0 ${
                          err.severity === 'error'
                            ? 'bg-destructive/10 text-destructive border border-destructive/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}
                      >
                        {err.severity}
                      </span>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-xs font-semibold text-foreground leading-normal break-words">
                            {err.message}
                          </p>
                          {err.line && err.column && (
                            <span className="text-[10px] text-muted shrink-0">
                              Line {err.line}, Col {err.column}
                            </span>
                          )}
                        </div>
                        
                        {err.explanation && (
                          <p className="text-[11px] text-muted leading-relaxed">
                            <span className="font-bold text-foreground/75">Why:</span> {err.explanation}
                          </p>
                        )}
                        {err.suggestion && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-relaxed font-semibold">
                            <span className="font-bold text-foreground/75">Fix:</span> {err.suggestion}
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
    </div>
  );
}
