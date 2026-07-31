'use client';

import React, { useState } from 'react';
import * as Icons from '@/components/Icons';
import { EMOJI_MAP } from '@/utils/emojiMap';

interface MarkdownToolbarProps {
  onInsertSyntax: (prefix: string, suffix?: string, defaultText?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenShortcuts: () => void;
}

export default function MarkdownToolbar({
  onInsertSyntax,
  onUndo,
  onRedo,
  onOpenShortcuts
}: MarkdownToolbarProps) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);

  const popularEmojis = Object.entries(EMOJI_MAP).slice(0, 24);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-card border border-border/80 shadow-premium-sm text-foreground select-none">
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/60">
          <button
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground transition-all"
          >
            <Icons.RotateCcw className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={onRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground transition-all"
          >
            <Icons.RotateCw className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Headings Dropdown */}
        <div className="relative pr-2 border-r border-border/60">
          <button
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            title="Headings (Ctrl+Shift+H)"
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-secondary/60 rounded-xl text-xs md:text-sm font-bold text-muted hover:text-foreground transition-all"
          >
            <span className="font-outfit text-sm font-extrabold text-foreground">H</span>
            <Icons.ChevronDown className="h-3.5 w-3.5" />
          </button>

          {showHeadingMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-30 w-44 py-1.5 bg-card border border-border rounded-xl shadow-premium-lg flex flex-col text-xs md:text-sm"
              onMouseLeave={() => setShowHeadingMenu(false)}
            >
              {[1, 2, 3, 4, 5, 6].map(level => (
                <button
                  key={level}
                  onClick={() => {
                    onInsertSyntax('#'.repeat(level) + ' ', '', `Heading ${level}`);
                    setShowHeadingMenu(false);
                  }}
                  className="px-3.5 py-2 text-left font-bold hover:bg-secondary/60 flex items-center justify-between"
                >
                  <span>H{level} Heading</span>
                  <span className="text-xs font-mono-calc text-muted">{'#'.repeat(level)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inline Formatting: Bold, Italic, Underline, Strike */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/60">
          <button
            onClick={() => onInsertSyntax('**', '**', 'bold text')}
            title="Bold (Ctrl+B)"
            className="p-2 hover:bg-secondary/60 rounded-xl font-black text-xs md:text-sm min-w-[32px] text-center"
          >
            B
          </button>
          <button
            onClick={() => onInsertSyntax('*', '*', 'italic text')}
            title="Italic (Ctrl+I)"
            className="p-2 hover:bg-secondary/60 rounded-xl italic font-serif text-xs md:text-sm min-w-[32px] text-center"
          >
            I
          </button>
          <button
            onClick={() => onInsertSyntax('<u>', '</u>', 'underlined text')}
            title="Underline"
            className="p-2 hover:bg-secondary/60 rounded-xl underline text-xs md:text-sm min-w-[32px] text-center"
          >
            U
          </button>
          <button
            onClick={() => onInsertSyntax('~~', '~~', 'strikethrough text')}
            title="Strikethrough"
            className="p-2 hover:bg-secondary/60 rounded-xl line-through text-xs md:text-sm min-w-[32px] text-center"
          >
            S
          </button>
        </div>

        {/* Code & Quotes */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/60">
          <button
            onClick={() => onInsertSyntax('`', '`', 'code')}
            title="Inline Code"
            className="p-2 hover:bg-secondary/60 rounded-xl text-xs md:text-sm font-mono font-bold"
          >
            {'</>'}
          </button>
          <button
            onClick={() => onInsertSyntax('```javascript\n', '\n```', '// Your code here')}
            title="Code Block (Ctrl+Shift+K)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-xs md:text-sm font-mono font-extrabold"
          >
            {'{ }'}
          </button>
          <button
            onClick={() => onInsertSyntax('> ', '', 'Quote text')}
            title="Blockquote"
            className="p-2 hover:bg-secondary/60 rounded-xl font-serif text-xs md:text-sm font-bold"
          >
            &quot;
          </button>
        </div>

        {/* Lists & Table */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/60">
          <button
            onClick={() => onInsertSyntax('- ', '', 'List item')}
            title="Bullet List"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground"
          >
            <Icons.List className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onInsertSyntax('1. ', '', 'Numbered item')}
            title="Numbered List"
            className="p-2 hover:bg-secondary/60 rounded-xl font-mono-calc text-xs md:text-sm font-bold text-muted hover:text-foreground"
          >
            1.
          </button>
          <button
            onClick={() => onInsertSyntax('- [ ] ', '', 'Task item')}
            title="Checklist"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground"
          >
            <Icons.CheckSquare className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onInsertSyntax(
              '| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item 1 | Detail A | $100 |\n| Item 2 | Detail B | $200 |\n',
              '',
              ''
            )}
            title="Insert Table (Ctrl+Shift+T)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground"
          >
            <Icons.Table className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Links & Media & HR */}
        <div className="flex items-center gap-1 pr-2 border-r border-border/60">
          <button
            onClick={() => onInsertSyntax('[', '](https://example.com)', 'Link Title')}
            title="Insert Link (Ctrl+Shift+L)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground"
          >
            <Icons.Link className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onInsertSyntax('![', '](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600)', 'Image Description')}
            title="Insert Image (Ctrl+Shift+I)"
            className="p-2 hover:bg-secondary/60 rounded-xl text-muted hover:text-foreground"
          >
            <Icons.Image className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onInsertSyntax('\n---\n', '', '')}
            title="Horizontal Rule"
            className="px-2 py-1.5 hover:bg-secondary/60 rounded-xl text-xs md:text-sm font-bold text-muted hover:text-foreground"
          >
            —
          </button>
        </div>

        {/* Emoji Selector */}
        <div className="relative pr-1">
          <button
            onClick={() => setShowEmojiMenu(!showEmojiMenu)}
            title="Insert Emoji"
            className="p-2 hover:bg-secondary/60 rounded-xl text-base"
          >
            😊
          </button>

          {showEmojiMenu && (
            <div
              className="absolute top-full left-0 mt-1 z-30 w-56 p-2 bg-card border border-border rounded-2xl shadow-premium-lg grid grid-cols-6 gap-1.5"
              onMouseLeave={() => setShowEmojiMenu(false)}
            >
              {popularEmojis.map(([name, char]) => (
                <button
                  key={name}
                  onClick={() => {
                    onInsertSyntax(char, '', '');
                    setShowEmojiMenu(false);
                  }}
                  title={`:${name}:`}
                  className="p-1.5 hover:bg-secondary/60 rounded-xl text-center text-base"
                >
                  {char}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcut Modal Button */}
      <div className="flex items-center gap-1">
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary/30 hover:bg-secondary/60 border border-border/80 rounded-xl text-xs md:text-sm font-bold text-muted hover:text-foreground transition-all shadow-sm"
        >
          <Icons.HelpCircle className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Shortcuts</span>
          <kbd className="px-1.5 py-0.5 bg-card border border-border text-[10px] font-mono-calc rounded-md text-muted">?</kbd>
        </button>
      </div>
    </div>
  );
}
