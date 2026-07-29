'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  options?: {
    wordWrap?: 'on' | 'off';
    [key: string]: any;
  };
  onEditorMount?: (editor: any, monaco: any) => void;
  onCursorChange?: (line: number, column: number) => void;
}

let monacoLoadingPromise: Promise<any> | null = null;

function loadMonaco(): Promise<any> {
  if (monacoLoadingPromise) return monacoLoadingPromise;

  monacoLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Monaco can only be loaded in the browser'));
      return;
    }

    if ((window as any).monaco) {
      resolve((window as any).monaco);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/vs/loader.min.js';
    script.async = true;
    script.onload = () => {
      try {
        (window as any).require.config({
          paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.48.0/min/vs' }
        });
        (window as any).require(['vs/editor/editor.main'], () => {
          resolve((window as any).monaco);
        }, (err: any) => reject(err));
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

  return monacoLoadingPromise;
}

export default function MonacoEditor({
  value,
  onChange,
  language = 'json',
  theme = 'light',
  readOnly = false,
  options = {},
  onEditorMount,
  onCursorChange
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    let active = true;
    loadMonaco().then((monaco) => {
      if (!active || !containerRef.current) return;
      monacoRef.current = monaco;

      // Define themes that integrate nicely with Toolora's palette
      monaco.editor.defineTheme('toolora-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'string.key.json', foreground: 'F472B6', fontStyle: 'bold' }, // Pink/Rose keys
          { token: 'string.value.json', foreground: '34D399' }, // Emerald values
          { token: 'number', foreground: 'F59E0B' }, // Amber numbers
          { token: 'keyword.json', foreground: '60A5FA', fontStyle: 'bold' }, // Blue booleans/null
        ],
        colors: {
          'editor.background': '#2D2A27', // Card dark background
          'editor.foreground': '#F7F2EA', // Foreground light color
          'editor.lineHighlightBackground': '#3A3734', // Secondary dark background
          'editorLineNumber.foreground': '#7A746E',
          'editorLineNumber.activeForeground': '#F7F2EA',
          'editor.selectionBackground': '#C0392B40',
        }
      });

      monaco.editor.defineTheme('toolora-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'string.key.json', foreground: 'DC2626', fontStyle: 'bold' }, // Red keys
          { token: 'string.value.json', foreground: '059669' }, // Emerald values
          { token: 'number', foreground: 'D97706' }, // Amber numbers
          { token: 'keyword.json', foreground: '2563EB', fontStyle: 'bold' }, // Blue booleans/null
        ],
        colors: {
          'editor.background': '#EFE8DC', // Card light background
          'editor.foreground': '#1C1917', // Foreground dark color
          'editor.lineHighlightBackground': '#E5DAC8', // Secondary light background
          'editorLineNumber.foreground': '#7A746E',
          'editorLineNumber.activeForeground': '#1C1917',
          'editor.selectionBackground': '#C0392B25',
        }
      });

      const editor = monaco.editor.create(containerRef.current, {
        value: value,
        language: language,
        theme: theme === 'dark' ? 'toolora-dark' : 'toolora-light',
        readOnly: readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 12,
        fontFamily: "'IBM Plex Mono', monospace",
        lineHeight: 20,
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        wordWrap: options.wordWrap || 'off',
        folding: true,
        bracketPairColorization: { enabled: true },
        ...options
      });

      editorRef.current = editor;
      setIsLoaded(true);

      if (onEditorMount) {
        onEditorMount(editor, monaco);
      }

      // Handle value changes from the editor
      editor.onDidChangeModelContent(() => {
        if (isUpdatingRef.current) return;
        const newValue = editor.getValue();
        if (onChange) {
          onChange(newValue);
        }
      });

      // Handle cursor position changes
      if (onCursorChange) {
        // Initial cursor update
        onCursorChange(1, 1);
        
        editor.onDidChangeCursorPosition((e: any) => {
          onCursorChange(e.position.lineNumber, e.position.column);
        });
      }
    }).catch(err => {
      console.error('Failed to load Monaco Editor from CDN:', err);
    });

    return () => {
      active = false;
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Sync value changes from parent
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.getValue() !== value) {
      isUpdatingRef.current = true;
      editorRef.current.setValue(value || '');
      isUpdatingRef.current = false;
    }
  }, [value]);

  // Sync theme changes
  useEffect(() => {
    if (!monacoRef.current) return;
    monacoRef.current.editor.setTheme(theme === 'dark' ? 'toolora-dark' : 'toolora-light');
  }, [theme, isLoaded]);

  // Sync options changes
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.updateOptions({
      wordWrap: options.wordWrap || 'off',
      readOnly: readOnly
    });
  }, [options.wordWrap, readOnly]);

  return (
    <div className="w-full h-full relative bg-card">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card text-muted text-xs gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading Monaco Editor...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
