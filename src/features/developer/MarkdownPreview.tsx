'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import * as Icons from '@/components/Icons';
import MonacoEditor from '@/components/MonacoEditor';

// Modular Workspace Components
import MarkdownToolbar from '@/components/markdown/MarkdownToolbar';
import MarkdownSearch from '@/components/markdown/MarkdownSearch';
import MarkdownAnalyticsPanel from '@/components/markdown/MarkdownAnalyticsPanel';
import MarkdownShortcutModal from '@/components/markdown/MarkdownShortcutModal';
import MarkdownDiagnosticsBadge from '@/components/markdown/MarkdownDiagnosticsBadge';

// Utility Functions
import { calculateMarkdownStats, MarkdownStats } from '@/utils/markdownAnalytics';
import { analyzeMarkdownDiagnostics, DiagnosticIssue } from '@/utils/markdownDiagnostics';
import { renderMarkdownToHtml } from '@/utils/markdownParser';

const STORAGE_KEY = 'toolora_markdown_studio_content_v2';

const SAMPLE_MARKDOWN = `# 🚀 Toolora Markdown Studio v2

Welcome to the **Toolora Professional Markdown Workspace**! Inspired by VS Code, GitHub Markdown, and Obsidian.

---

## ⚡ Key Capabilities

- **Instant Live Preview:** Write on the left, rendered instantly on the right without flicker.
- **GFM Compliant:** Headings, bold, italic, strikethrough, blockquotes, lists, tables, checklists, footnotes, and inline HTML.
- **Syntax Highlighting:** Multi-language highlighting for JS, TS, Python, Rust, Go, SQL, C++, Java, and more!
- **Document Analytics:** Real-time character, word, heading, table, and reading-level metrics.
- **Scroll Sync:** Dual-panel synchronized scrolling.

---

## 📝 Text Formatting & Quotes

You can format text as **bold**, *italic*, <u>underlined</u>, or ~~strikethrough~~. You can also write inline code like \`const version = "2.0.0"\` or blockquotes:

> "Simplicity is prerequisite for reliability."
> — *Edgar W. Dijkstra*

---

## ✅ Task Checklists & Lists

### Documentation Checklist
- [x] GFM Markdown Parser integration
- [x] Multi-language Syntax Highlighting
- [x] Real-Time Scroll Synchronization
- [x] Auto-save & Local storage recovery
- [ ] Export directly to PDF & HTML

### Ordered Steps
1. Write or drop your \`.md\` file into the workspace.
2. Format text using the toolbar or keyboard shortcuts like \`Ctrl+B\`.
3. Export to Markdown, HTML, or PDF cleanly.

---

## 📊 GFM Table Support

| Feature | Level 1 Status | Performance |
| :--- | :---: | :---: |
| GitHub Markdown | Fully Supported | Instant |
| Scroll Sync | Active | Smooth |
| Syntax Highlighting | 20+ Languages | Fast |
| Security | Sanitized XSS | Secure |

---

## 💻 Syntax Highlighting Examples

### TypeScript & JavaScript
\`\`\`typescript
interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'developer';
}

function greetDeveloper(user: UserProfile): string {
  return \`Welcome back, \${user.username}! 🎉\`;
}
\`\`\`

### Python
\`\`\`python
def calculate_metrics(text: str) -> dict:
    words = len(text.split())
    chars = len(text)
    return {"words": words, "chars": chars}

print(calculate_metrics("Toolora Studio v2"))
\`\`\`

---

## 🔗 Links & Images

Check out the official [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/) to explore standard syntax.

![Developer Workspace](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80)
`;

export default function MarkdownPreview() {
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Core Document State
  const [inputMarkdown, setInputMarkdown] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isAutoSaved, setIsAutoSaved] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Layout & View Options
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // Modal State
  const [showShortcutModal, setShowShortcutModal] = useState(false);

  // Analytics & Diagnostics
  const [stats, setStats] = useState<MarkdownStats>({
    characters: 0,
    charactersNoSpace: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    headings: 0,
    links: 0,
    images: 0,
    tables: 0,
    lists: 0,
    codeBlocks: 0,
    readingTimeMinutes: 0,
    readingLevel: 'N/A'
  });
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([]);

  // Refs for Scroll Synchronization & Editor Instance
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<any>(null);
  const isScrollingSyncRef = useRef(false);

  // Initial Content Load & Auto Save Restores
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent && savedContent.trim().length > 0) {
      setInputMarkdown(savedContent);
      setHistory([savedContent]);
      setHistoryIndex(0);
    } else {
      setInputMarkdown(SAMPLE_MARKDOWN);
      setHistory([SAMPLE_MARKDOWN]);
      setHistoryIndex(0);
    }
  }, []);

  // Update HTML, Stats, Diagnostics & Auto Save synchronously on input Markdown change
  useEffect(() => {
    // 1. Calculate Analytics Stats & Diagnostics
    const newStats = calculateMarkdownStats(inputMarkdown);
    const newDiagnostics = analyzeMarkdownDiagnostics(inputMarkdown);
    setStats(newStats);
    setDiagnostics(newDiagnostics);

    // 2. Render Markdown to HTML with zero-latency GFM Compiler
    const cleanHtml = renderMarkdownToHtml(inputMarkdown || '', searchQuery, currentMatchIndex);
    setPreviewHtml(cleanHtml);

    // Count search matches
    if (searchQuery.trim().length > 0) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = (inputMarkdown.match(new RegExp(escapedQuery, 'gi')) || []).length;
      setTotalMatches(matches);
    } else {
      setTotalMatches(0);
    }

    // 3. Auto Save to localStorage
    if (inputMarkdown.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY, inputMarkdown);
      setIsAutoSaved(true);
      const timer = setTimeout(() => setIsAutoSaved(false), 2500);
      return () => clearTimeout(timer);
    }

    // 4. Record history stack for undo/redo if not triggered by undo/redo button
    if (!isUndoRedoAction.current) {
      setHistory(prev => {
        const sliced = prev.slice(0, historyIndex + 1);
        if (sliced[sliced.length - 1] !== inputMarkdown) {
          return [...sliced, inputMarkdown];
        }
        return prev;
      });
      setHistoryIndex(prev => prev + 1);
    } else {
      isUndoRedoAction.current = false;
    }
  }, [inputMarkdown, searchQuery, currentMatchIndex]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInputMarkdown(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setInputMarkdown(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Insert Syntax Helper into Editor at selection/cursor
  const handleInsertSyntax = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
    const editor = monacoEditorRef.current;
    if (editor) {
      const selection = editor.getSelection();
      const selectedText = editor.getModel().getValueInRange(selection);
      const insertText = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${defaultText}${suffix}`;

      editor.executeEdits('toolbar-insert', [
        {
          range: selection,
          text: insertText,
          forceMoveMarkers: true
        }
      ]);
      editor.focus();
    } else {
      setInputMarkdown(prev => `${prev}\n${prefix}${defaultText}${suffix}`);
    }
  }, []);

  // Global Keyboard Shortcuts Event Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key handler
      if (e.key === 'Escape') {
        if (showShortcutModal) {
          setShowShortcutModal(false);
          return;
        }
        if (showSearch) {
          setShowSearch(false);
          return;
        }
        if (isFullScreen) {
          setIsFullScreen(false);
          showToast('Exited full screen mode.');
          return;
        }
      }

      // Shortcut ? key for shortcuts modal
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShowShortcutModal(true);
        return;
      }

      // F11 Fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullScreen(prev => !prev);
        showToast(isFullScreen ? 'Exited full screen mode.' : 'Activated full screen mode.');
        return;
      }

      // Ctrl / Cmd key combinations
      if (e.ctrlKey || e.metaKey) {
        // Ctrl + F: Search
        if (e.key.toLowerCase() === 'f' && !e.shiftKey) {
          e.preventDefault();
          setShowSearch(true);
          return;
        }

        // Ctrl + G: Next search match
        if (e.key.toLowerCase() === 'g' && !e.shiftKey) {
          e.preventDefault();
          if (totalMatches > 0) {
            setCurrentMatchIndex(prev => (prev + 1) % totalMatches);
          }
          return;
        }

        // Shift + Ctrl + G: Previous search match
        if (e.key.toLowerCase() === 'g' && e.shiftKey) {
          e.preventDefault();
          if (totalMatches > 0) {
            setCurrentMatchIndex(prev => (prev - 1 + totalMatches) % totalMatches);
          }
          return;
        }

        // Ctrl + B: Bold
        if (e.key.toLowerCase() === 'b' && !e.shiftKey) {
          e.preventDefault();
          handleInsertSyntax('**', '**', 'bold text');
          return;
        }

        // Ctrl + I: Italic
        if (e.key.toLowerCase() === 'i' && !e.shiftKey) {
          e.preventDefault();
          handleInsertSyntax('*', '*', 'italic text');
          return;
        }

        // Shift Combinations (Ctrl + Shift + Key)
        if (e.shiftKey) {
          switch (e.key.toUpperCase()) {
            case 'K': // Code Block
              e.preventDefault();
              handleInsertSyntax('```javascript\n', '\n```', '// code');
              break;
            case 'H': // Heading
              e.preventDefault();
              handleInsertSyntax('## ', '', 'Heading');
              break;
            case 'L': // Link
              e.preventDefault();
              handleInsertSyntax('[', '](https://example.com)', 'Link text');
              break;
            case 'I': // Image
              e.preventDefault();
              handleInsertSyntax('![', '](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600)', 'Image alt');
              break;
            case 'T': // Table
              e.preventDefault();
              handleInsertSyntax('| Col 1 | Col 2 |\n| :--- | :---: |\n| Item 1 | Val 1 |\n', '', '');
              break;
            case 'C': // Copy HTML
              e.preventDefault();
              handleCopyHTML();
              break;
            case 'M': // Toggle Layout Mode
              e.preventDefault();
              setLayoutMode(prev => prev === 'split' ? 'editor' : prev === 'editor' ? 'preview' : 'split');
              break;
            case 'E': // Export MD
              e.preventDefault();
              handleExportMarkdown();
              break;
            case 'Z': // Redo
              e.preventDefault();
              handleRedo();
              break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, showSearch, showShortcutModal, totalMatches, handleInsertSyntax, handleRedo, showToast]);

  // Scroll Synchronization Engine (Editor -> Preview & Preview -> Editor)
  const handleEditorMount = (editor: any) => {
    monacoEditorRef.current = editor;

    // Scroll Sync: Monaco Editor scroll event updates Preview element scroll position
    editor.onDidScrollChange((e: any) => {
      if (isScrollingSyncRef.current || !previewScrollRef.current || layoutMode !== 'split') return;

      isScrollingSyncRef.current = true;
      const scrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;
      const scrollRatio = scrollHeight > 0 ? e.scrollTop / scrollHeight : 0;

      const previewEl = previewScrollRef.current;
      const targetScrollTop = scrollRatio * (previewEl.scrollHeight - previewEl.clientHeight);
      previewEl.scrollTop = targetScrollTop;

      setTimeout(() => {
        isScrollingSyncRef.current = false;
      }, 50);
    });
  };

  const handlePreviewScroll = () => {
    if (isScrollingSyncRef.current || !monacoEditorRef.current || layoutMode !== 'split') return;

    const previewEl = previewScrollRef.current;
    if (!previewEl) return;

    isScrollingSyncRef.current = true;
    const scrollHeight = previewEl.scrollHeight - previewEl.clientHeight;
    const scrollRatio = scrollHeight > 0 ? previewEl.scrollTop / scrollHeight : 0;

    const editor = monacoEditorRef.current;
    const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;
    editor.setScrollTop(scrollRatio * editorScrollHeight);

    setTimeout(() => {
      isScrollingSyncRef.current = false;
    }, 50);
  };

  // Drag & Drop File Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt') && !file.name.endsWith('.markdown')) {
      showToast('Unsupported file type. Please upload a .md or .txt document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputMarkdown(text);
      showToast(`Loaded "${file.name}" successfully.`);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt') && !file.name.endsWith('.markdown')) {
      showToast('Unsupported file type. Please upload a .md or .txt document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputMarkdown(text);
      showToast(`Uploaded "${file.name}" successfully.`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export Actions
  const handleExportMarkdown = () => {
    if (!inputMarkdown) {
      showToast('Nothing to export.');
      return;
    }
    const blob = new Blob([inputMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now().toString().slice(-4)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported Markdown file.');
  };

  const handleExportHTML = () => {
    if (!previewHtml) {
      showToast('No HTML content to export.');
      return;
    }
    const htmlBoilerplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document — Toolora Markdown Studio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
      max-width: 850px;
      margin: 40px auto;
      padding: 0 24px;
      font-size: 16px;
    }
    h1, h2, h3, h4, h5, h6 { font-weight: 700; margin-top: 28px; margin-bottom: 16px; line-height: 1.3; }
    h1 { font-size: 2.25em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
    h2 { font-size: 1.75em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote { border-left: 4px solid #0366d6; padding: 0.6em 1.2em; color: #555; background: #f6f8fa; border-radius: 6px; }
    code { font-family: monospace; font-size: 90%; background-color: rgba(27,31,35,.07); padding: .25em .5em; border-radius: 4px; }
    pre { background-color: #f6f8fa; border: 1px solid #dfe2e5; padding: 18px; border-radius: 8px; overflow-x: auto; font-size: 15px; }
    pre code { background: transparent; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px; }
    th, td { border: 1px solid #dfe2e5; padding: 10px 14px; }
    th { background-color: #f6f8fa; }
    img { max-width: 100%; border-radius: 6px; }
  </style>
</head>
<body>
  ${previewHtml}
</body>
</html>`;

    const blob = new Blob([htmlBoilerplate], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rendered-${Date.now().toString().slice(-4)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported HTML document.');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!inputMarkdown) return showToast('No content to copy.');
    navigator.clipboard.writeText(inputMarkdown);
    showToast('Markdown copied to clipboard!');
  };

  const handleCopyHTML = () => {
    if (!previewHtml) return showToast('No HTML content to copy.');
    navigator.clipboard.writeText(previewHtml);
    showToast('Rendered HTML copied to clipboard!');
  };

  const handleCopyPlainText = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = previewHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    navigator.clipboard.writeText(plainText);
    showToast('Plain text copied to clipboard!');
  };

  const handleClear = () => {
    setInputMarkdown('');
    setPreviewHtml('');
    showToast('Workspace cleared.');
  };

  const handleLoadSample = () => {
    setInputMarkdown(SAMPLE_MARKDOWN);
    showToast('Loaded sample Markdown template.');
  };

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-background flex flex-col p-5 md:p-6 overflow-hidden" : "space-y-4 w-full relative"}>
      {/* Full Screen Top Control Bar */}
      {isFullScreen && (
        <div className="flex items-center justify-between pb-3.5 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <Icons.Code className="h-6 w-6 text-primary" />
            <span className="font-outfit font-black text-base md:text-lg tracking-widest uppercase text-foreground">Toolora Markdown Studio — Distraction Free</span>
          </div>
          <div className="flex items-center gap-3">
            {isAutoSaved && (
              <span className="text-xs font-mono-calc font-bold text-emerald-500 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Icons.CheckCircle className="h-4 w-4" />
                Session Auto Saved
              </span>
            )}
            <button
              onClick={() => {
                setIsFullScreen(false);
                showToast('Exited full screen mode.');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/60 transition-all shadow-sm"
              title="Exit Full Screen (Esc)"
            >
              <Icons.X className="h-4.5 w-4.5" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar Options & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-secondary/20 border border-border/80 shadow-premium-sm">
        {/* Left Options Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* File Operations */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              title="Load Sample Template"
              className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Files className="h-4 w-4 text-primary" />
              <span>Sample</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload .md or .txt file"
              className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Upload className="h-4 w-4 text-primary" />
              <span>Upload</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".md,.txt,.markdown"
              className="hidden"
            />

            <button
              onClick={handleExportMarkdown}
              title="Download .md file (Ctrl+Shift+E)"
              className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Download className="h-4 w-4 text-primary" />
              <span>Save .md</span>
            </button>
          </div>

          <div className="hidden sm:block h-6 w-px bg-border/80" />

          {/* View Mode Segmented Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-muted tracking-wider hidden sm:inline">View:</span>
            <div className="inline-flex rounded-xl bg-card border border-border p-1 gap-1">
              {(['split', 'editor', 'preview'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-lg transition-all ${
                    layoutMode === mode
                      ? 'bg-primary text-primary-foreground font-black shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-secondary/20'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Operations Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Diagnostics Badge */}
          <MarkdownDiagnosticsBadge issues={diagnostics} />

          {/* Auto Save Status Badge */}
          {isAutoSaved && (
            <span className="hidden md:flex items-center gap-1.5 text-xs font-mono-calc font-bold text-emerald-500 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Icons.CheckCircle className="h-3.5 w-3.5" />
              Session Auto Saved
            </span>
          )}

          {/* Copy & Export Dropdowns/Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              title="Copy Markdown content"
              className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Copy className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Copy MD</span>
            </button>

            <button
              onClick={handleCopyHTML}
              title="Copy Rendered HTML payload (Ctrl+Shift+C)"
              className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Code className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Copy HTML</span>
            </button>

            <button
              onClick={handleCopyPlainText}
              title="Copy Plain Text without syntax"
              className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.FileText className="h-4 w-4 text-primary" />
              <span className="hidden md:inline">Plain Text</span>
            </button>

            <button
              onClick={handleExportHTML}
              title="Download HTML file"
              className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Download className="h-4 w-4 text-primary" />
              <span className="hidden lg:inline">Export HTML</span>
            </button>

            <button
              onClick={handlePrintPDF}
              title="Export as PDF / Print"
              className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs md:text-sm font-bold hover:bg-secondary/50 transition-all text-foreground shadow-sm"
            >
              <Icons.Printer className="h-4 w-4 text-primary" />
              <span className="hidden lg:inline">PDF</span>
            </button>

            {!isFullScreen && (
              <button
                onClick={() => setIsFullScreen(true)}
                title="Distraction Free Writing Mode (F11)"
                className="p-2 bg-card border border-border rounded-xl hover:bg-secondary/50 transition-all text-foreground shadow-sm"
              >
                <Icons.Maximize2 className="h-4 w-4 text-primary" />
              </button>
            )}

            <button
              onClick={handleClear}
              title="Clear Editor Buffer"
              className="p-2 border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl transition-all shadow-sm"
            >
              <Icons.Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <MarkdownToolbar
        onInsertSyntax={handleInsertSyntax}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenShortcuts={() => setShowShortcutModal(true)}
      />

      {/* Search Overlay Bar */}
      {showSearch && (
        <MarkdownSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentIndex={currentMatchIndex}
          totalMatches={totalMatches}
          onNext={() => setCurrentMatchIndex(prev => (prev + 1) % Math.max(1, totalMatches))}
          onPrev={() => setCurrentMatchIndex(prev => (prev - 1 + Math.max(1, totalMatches)) % Math.max(1, totalMatches))}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Side-by-Side Split Workspace Area */}
      <div className={`grid gap-5 ${isFullScreen ? 'flex-1 overflow-hidden' : ''} ${
        layoutMode === 'split'
          ? 'grid-cols-1 lg:grid-cols-2'
          : 'grid-cols-1'
      }`}>
        {/* LEFT PANEL: Markdown Editor */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropFile}
          className={`flex flex-col space-y-2.5 ${
            layoutMode === 'preview' ? 'hidden' : 'block'
          } ${isFullScreen ? 'h-full overflow-hidden' : ''}`}
        >
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-xs md:text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
              <Icons.FileText className="h-4.5 w-4.5 text-primary" />
              Markdown Editor
            </span>
            <div className="flex items-center gap-2 text-xs font-mono-calc text-muted uppercase tracking-wider font-bold">
              <span>Word Wrap:</span>
              <button
                onClick={() => setWrapLines(!wrapLines)}
                className="px-2 py-0.5 bg-card border border-border rounded-md hover:bg-secondary/60 hover:text-foreground underline font-extrabold text-foreground transition-all"
              >
                {wrapLines ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className={`relative border border-border/80 rounded-2xl overflow-hidden shadow-premium-md bg-card transition-all ${
            isDraggingFile ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
          } ${isFullScreen ? 'flex-1 h-full' : 'h-[640px]'}`}>
            {isDraggingFile && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm text-primary font-bold text-base gap-3">
                <Icons.Upload className="h-10 w-10 animate-bounce" />
                <span>Drop .md or .txt file to import</span>
              </div>
            )}

            <MonacoEditor
              value={inputMarkdown}
              onChange={setInputMarkdown}
              language="markdown"
              theme={theme}
              onEditorMount={handleEditorMount}
              options={{
                fontSize: 15,
                lineHeight: 24,
                wordWrap: wrapLines ? 'on' : 'off',
                lineNumbers: 'on',
                folding: true,
                minimap: { enabled: false },
                renderLineHighlight: 'all',
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Live Markdown Preview */}
        <div className={`flex flex-col space-y-2.5 ${
          layoutMode === 'editor' ? 'hidden' : 'block'
        } ${isFullScreen ? 'h-full overflow-hidden' : ''}`}>
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-xs md:text-sm font-black uppercase text-foreground tracking-widest flex items-center gap-2">
              <Icons.Zap className="h-4.5 w-4.5 text-primary" />
              Live Preview
            </span>
            <span className="text-xs font-mono-calc text-muted uppercase tracking-wider font-bold">
              GFM Compiler
            </span>
          </div>

          <div
            ref={previewScrollRef}
            onScroll={handlePreviewScroll}
            className={`border border-border/80 rounded-2xl overflow-y-auto shadow-premium-md bg-card p-6 md:p-8 transition-all ${
              isFullScreen ? 'flex-1 h-full' : 'h-[640px]'
            }`}
          >
            {!inputMarkdown.trim() ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted text-sm italic py-24 select-none gap-4">
                <Icons.Edit3 className="h-10 w-10 text-muted/40" />
                <span>Start writing Markdown...</span>
                <button
                  onClick={handleLoadSample}
                  className="px-4 py-2 bg-primary text-primary-foreground not-italic font-bold text-xs md:text-sm rounded-xl shadow-premium-sm hover:opacity-90 transition-all"
                >
                  Load Sample Document
                </button>
              </div>
            ) : (
              <div
                className="markdown-preview-prose"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM PANEL: Document Analytics */}
      <MarkdownAnalyticsPanel stats={stats} />

      {/* Keyboard Shortcuts Dialog */}
      <MarkdownShortcutModal
        isOpen={showShortcutModal}
        onClose={() => setShowShortcutModal(false)}
      />
    </div>
  );
}
