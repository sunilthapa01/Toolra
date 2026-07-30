'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useTheme } from '@/components/ThemeProvider';
import * as Icons from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@/components/MonacoEditor';

const SAMPLE_MARKDOWN = `# 🚀 Premium Markdown Editor

Welcome to **Toolora's Markdown Preview Editor**! Write Markdown on the left and see it instantly rendered on the right.

---

## Key Features

- **Live Preview:** See your changes rendered instantly as you type.
- **Local & Secure:** All compilation runs inside your browser sandbox. No server uploads.
- **Code Highlighting:** Clean formatting for code blocks.
- **Rich Exports:** Copy as Markdown, copy as HTML, or download documents directly.

---

## Text Formatting Demo

You can easily format text as **bold**, *italic*, or even ~~strikethrough~~. You can write inline code like \`const version = '1.0.0'\` and blockquotes:

> "The details are not the details. They make the design."
> — *Charles Eames*

---

## Checklists & Lists

### Todo Checklist
- [x] Integrate Monaco Editor interface
- [x] Configure browser script loading for parser
- [x] Implement Full Screen writing mode
- [ ] Add PDF export option

### Ordered List
1. Write or upload your markdown file.
2. Review design hierarchy in the preview panel.
3. Export to HTML or download the \`.md\` document.

---

## Tables Support

| Feature | Support Status | Speed |
| :--- | :---: | :---: |
| GFM Markdown | Fully Supported | Instant |
| Local Files Import | Supported | Fast |
| Sanitized Outputs | Secure (XSS Protected) | Safe |

---

## Code Highlight Block

\`\`\`javascript
// Simple helper to calculate reading time
function getReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
console.log(\`Estimated time: \${getReadingTime("Hello world!")} min\`);
\`\`\`

---

## External Links & Images

Check out the [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/) to master standard syntax.

![Toolora Design Logo](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80)
`;

export default function MarkdownPreview() {
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Core Editor States
  const [inputMarkdown, setInputMarkdown] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Layout & View States
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);

  // Stats
  const [stats, setStats] = useState({ words: 0, characters: 0, lines: 1 });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Parser Scripts dynamically from CDN (XSS-safe and builds without dependencies)
  useEffect(() => {
    let active = true;

    const loadScripts = async () => {
      try {
        if (!(window as any).marked) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.1/marked.min.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (!(window as any).DOMPurify) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.9/purify.min.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (active) {
          // Configure marked options
          if ((window as any).marked) {
            (window as any).marked.setOptions({
              gfm: true,
              breaks: true,
            });
          }
          setScriptsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load markdown dependencies:', err);
        showToast('Error loading Markdown parser. Please refresh the page.');
      }
    };

    loadScripts();
    return () => {
      active = false;
    };
  }, []);

  // Sync Input changes and recalculate stats & HTML
  useEffect(() => {
    // Initial Load sample if empty
    if (!inputMarkdown && scriptsLoaded) {
      setInputMarkdown(SAMPLE_MARKDOWN);
      return;
    }

    if (!scriptsLoaded) return;

    // Calculate word/char/line count stats
    const charCount = inputMarkdown.length;
    const lineCount = inputMarkdown.split('\n').length;
    const wordCount = inputMarkdown.trim() === '' ? 0 : inputMarkdown.trim().split(/\s+/).filter(Boolean).length;
    setStats({ words: wordCount, characters: charCount, lines: lineCount });

    // Render HTML and sanitize
    try {
      const rawHtml = (window as any).marked.parse(inputMarkdown || '');
      const cleanHtml = (window as any).DOMPurify.sanitize(rawHtml);
      setPreviewHtml(cleanHtml);
    } catch (err) {
      console.error('Markdown compilation error:', err);
    }
  }, [inputMarkdown, scriptsLoaded]);

  // Global escape key listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        e.preventDefault();
        setIsFullScreen(false);
        showToast('Exited full screen mode.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  // Copy raw Markdown to clipboard
  const handleCopyMarkdown = () => {
    if (!inputMarkdown) {
      showToast('No content to copy.');
      return;
    }
    navigator.clipboard.writeText(inputMarkdown);
    showToast('Markdown content copied to clipboard.');
  };

  // Copy Rendered HTML payload to clipboard
  const handleCopyHTML = () => {
    if (!previewHtml) {
      showToast('No rendered HTML to copy.');
      return;
    }
    navigator.clipboard.writeText(previewHtml);
    showToast('Rendered HTML copied to clipboard.');
  };

  // Download Markdown file locally
  const handleDownloadMarkdown = () => {
    if (!inputMarkdown) {
      showToast('Nothing to download.');
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
    showToast('Markdown file downloaded.');
  };

  // Download HTML file locally (with boilerplate and styles)
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
  <title>Exported Document — Toolora</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #24292e;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; padding-bottom: .3em; border-bottom: 1px solid #eaecef; }
    h2 { font-size: 1.5em; padding-bottom: .3em; border-bottom: 1px solid #eaecef; }
    h3 { font-size: 1.25em; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { font-weight: 600; }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding: 0 1em;
      color: #6a737d;
      margin: 0 0 16px 0;
      background-color: #f6f8fa;
      border-radius: 4px;
    }
    code {
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
      background-color: rgba(27,31,35,.05);
      padding: .2em .4em;
      border-radius: 3px;
    }
    pre {
      background-color: #f6f8fa;
      border: 1px solid #dfe2e5;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
    pre code { background-color: transparent; padding: 0; font-size: 100%; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th, td { border: 1px solid #dfe2e5; padding: 6px 13px; text-align: left; }
    th { background-color: #f6f8fa; }
    tr:nth-child(even) { background-color: #f6f8fa; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    input[type="checkbox"] { margin-right: 0.5em; }
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
    showToast('HTML document exported successfully.');
  };

  // Upload local Markdown file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputMarkdown(text);
      showToast(`Uploaded "${file.name}" successfully.`);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input element
  };

  // Clear Editor workspace
  const handleClear = () => {
    setInputMarkdown('');
    setPreviewHtml('');
    showToast('Editor workspace cleared.');
  };

  // Reset to default sample
  const handleLoadSample = () => {
    setInputMarkdown(SAMPLE_MARKDOWN);
    showToast('Loaded sample Markdown template.');
  };

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-background flex flex-col p-4 md:p-6 overflow-hidden" : "space-y-6 w-full relative"}>
      {/* 1. Header Row (Full Screen Mode only) */}
      {isFullScreen && (
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2">
            <Icons.Code className="h-5 w-5 text-primary" />
            <span className="font-outfit font-bold text-sm tracking-widest uppercase">Markdown Workspace</span>
          </div>
          <button
            onClick={() => {
              setIsFullScreen(false);
              showToast('Exited full screen mode.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/40 border border-border rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all"
            title="Exit Full Screen (Esc)"
          >
            <Icons.X className="h-4 w-4" />
            <span>Close Fullscreen</span>
          </button>
        </div>
      )}

      {/* 2. Structured Grouped Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-secondary/15 border border-border/80 shadow-premium-sm">
        {/* Left: Input Operations group */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Group 1: Files */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">File:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLoadSample}
                title="Load Sample Markdown Template"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Files className="h-3.5 w-3.5 text-primary" />
                <span>Sample</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload .md or .txt file"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Download className="h-3.5 w-3.5 rotate-180 text-primary" />
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
                onClick={handleDownloadMarkdown}
                title="Download current Markdown buffer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Download className="h-3.5 w-3.5 text-primary" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-border/80" />

          {/* Group 2: Layout & Views */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">View:</span>
            <div className="inline-flex rounded-xl bg-card border border-border p-1 gap-0.5">
              {(['split', 'editor', 'preview'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                    layoutMode === mode
                      ? 'bg-primary text-primary-foreground font-black'
                      : 'text-muted hover:text-foreground hover:bg-secondary/20'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Output Actions group */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block h-6 w-px bg-border/80" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Export:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyMarkdown}
                title="Copy raw Markdown buffer to clipboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Copy className="h-3.5 w-3.5 text-primary" />
                <span>Copy MD</span>
              </button>
              <button
                onClick={handleCopyHTML}
                title="Copy rendered HTML markup payload to clipboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.Code className="h-3.5 w-3.5 text-primary" />
                <span>Copy HTML</span>
              </button>
              <button
                onClick={handleExportHTML}
                title="Download formatted HTML document file"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-secondary/40 transition-all text-foreground"
              >
                <Icons.FileText className="h-3.5 w-3.5 text-primary" />
                <span>Export HTML</span>
              </button>
              <button
                onClick={handleClear}
                title="Clear current editor content"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl text-xs font-semibold transition-all"
              >
                <Icons.X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Settings & Stats row */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs p-1 bg-secondary/5 rounded-xl">
        <div className="flex flex-wrap items-center gap-5">
          {/* Line Wrap Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted tracking-wider">Line Wrap:</span>
            <button
              onClick={() => setWrapLines(!wrapLines)}
              className={`px-2.5 py-1 border rounded-xl text-[10px] font-bold uppercase transition-all ${
                wrapLines
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted hover:text-foreground'
              }`}
            >
              {wrapLines ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Fullscreen Button */}
          {!isFullScreen && (
            <button
              onClick={() => {
                setIsFullScreen(true);
                showToast('Fullscreen editor activated. Press Esc to exit.');
              }}
              className="flex items-center gap-1 px-3 py-1 border border-border bg-card hover:bg-secondary/20 rounded-xl text-[10px] font-bold uppercase transition-all"
              title="DISTRACTION FREE WRITING WORKSPACE"
            >
              <Icons.Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span>Full Screen</span>
            </button>
          )}
        </div>

        {/* Quick Document Statistics */}
        <div className="flex items-center gap-4 text-[10px] font-semibold text-muted uppercase tracking-wider">
          <span>{stats.words} words</span>
          <span className="h-3 w-px bg-border" />
          <span>{stats.characters} chars</span>
          <span className="h-3 w-px bg-border" />
          <span>{stats.lines} lines</span>
        </div>
      </div>

      {/* 4. Side-by-Side Editor & Preview Area */}
      <div className={`grid gap-4 ${isFullScreen ? 'flex-1 overflow-hidden' : ''} ${
        layoutMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        {/* Left Side: Markdown Editor */}
        <div className={`flex flex-col space-y-1.5 ${
          layoutMode === 'preview' ? 'hidden' : 'block'
        } ${isFullScreen ? 'h-full overflow-hidden' : ''}`}>
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest flex items-center gap-1.5">
              <Icons.FileText className="h-3 w-3 text-primary" />
              Markdown Input
            </span>
            <span className="text-[9px] font-mono-calc text-muted/65 uppercase tracking-wide">
              MD format
            </span>
          </div>

          <div className={`relative border border-border/80 rounded-2xl overflow-hidden shadow-premium-sm bg-card ${
            isFullScreen ? 'flex-1 h-full' : 'h-[500px]'
          }`}>
            <MonacoEditor
              value={inputMarkdown}
              onChange={setInputMarkdown}
              language="markdown"
              theme={theme}
              options={{ 
                wordWrap: wrapLines ? 'on' : 'off',
                lineNumbers: 'on',
                folding: true,
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                }
              }}
            />
          </div>
        </div>

        {/* Right Side: Live HTML Rendered Preview */}
        <div className={`flex flex-col space-y-1.5 ${
          layoutMode === 'editor' ? 'hidden' : 'block'
        } ${isFullScreen ? 'h-full overflow-hidden' : ''}`}>
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-[10px] font-black uppercase text-muted tracking-widest flex items-center gap-1.5">
              <Icons.Zap className="h-3 w-3 text-primary" />
              Live Preview
            </span>
            <span className="text-[9px] font-mono-calc text-muted/65 uppercase tracking-wide">
              GFM parser
            </span>
          </div>

          <div className={`border border-border/80 rounded-2xl overflow-y-auto shadow-premium-sm bg-card p-5 md:p-6 ${
            isFullScreen ? 'flex-1 h-full' : 'h-[500px]'
          }`}>
            {!scriptsLoaded ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted text-xs gap-3 py-20">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Loading Parser Scripts...</span>
              </div>
            ) : !inputMarkdown.trim() ? (
              <div className="w-full h-full flex items-center justify-center text-muted text-xs italic py-20 select-none">
                Start writing markdown to see the live rendering here.
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
    </div>
  );
}
