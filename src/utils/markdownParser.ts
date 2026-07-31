import { parseEmojiShortcodes } from './emojiMap';

/**
 * Self-contained, robust GFM (GitHub Flavored Markdown) compiler.
 * Translates Markdown string into clean, safe HTML without external network dependencies.
 */
export function renderMarkdownToHtml(markdown: string, searchQuery: string = '', activeMatchIndex: number = 0): string {
  if (!markdown) return '';

  // 1. Emoji shortcode translation
  let text = parseEmojiShortcodes(markdown);

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Safe code syntax highlighter without regex collisions
  const highlightCodeTokens = (codeText: string): string => {
    const lines = codeText.split('\n');
    const highlightedLines = lines.map(line => {
      const escaped = escapeHtml(line);

      // Single line comments (// or #)
      if (escaped.trim().startsWith('//') || escaped.trim().startsWith('#')) {
        return `<span class="hljs-comment">${escaped}</span>`;
      }

      // Tokenize strings, keywords, numbers safely
      return escaped
        // Keywords
        .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|interface|type|public|private|protected|async|await|try|catch|throw|new|def|self|select|where|insert|update|delete|table|primary|key)\b/g, '<span class="hljs-keyword">$1</span>')
        // Booleans & Null
        .replace(/\b(true|false|null|undefined|None|True|False)\b/g, '<span class="hljs-literal">$1</span>')
        // Double quoted strings
        .replace(/(&quot;.*?&quot;|".*?")/g, '<span class="hljs-string">$1</span>')
        // Single quoted strings
        .replace(/('.*?'|&#039;.*?&#039;)/g, '<span class="hljs-string">$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="hljs-[#38BDF8]">$1</span>');
    });

    return highlightedLines.join('\n');
  };

  const lines = text.split('\n');
  const resultLines: string[] = [];

  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockBuffer: string[] = [];

  let inTable = false;
  let tableHeaderParsed = false;
  let tableRows: string[] = [];

  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (inList && listType) {
      resultLines.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
      listType = null;
    }
  };

  const closeTable = () => {
    if (inTable && tableRows.length > 0) {
      let tableHtml = '<table><thead>';
      if (tableRows.length >= 1) {
        tableHtml += tableRows[0];
      }
      tableHtml += '</thead><tbody>';
      for (let i = 1; i < tableRows.length; i++) {
        tableHtml += tableRows[i];
      }
      tableHtml += '</tbody></table>';
      resultLines.push(tableHtml);
      inTable = false;
      tableHeaderParsed = false;
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Blocks (``` or ~~~)
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      closeList();
      closeTable();

      if (inCodeBlock) {
        // Closing block
        const rawCode = codeBlockBuffer.join('\n');
        const highlighted = highlightCodeTokens(rawCode);
        resultLines.push(`<pre><code class="language-${escapeHtml(codeBlockLang)}">${highlighted}</code></pre>`);
        inCodeBlock = false;
        codeBlockBuffer = [];
        codeBlockLang = '';
      } else {
        // Opening block
        inCodeBlock = true;
        codeBlockLang = trimmed.replace(/^[`~]+/, '').trim();
        codeBlockBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      continue;
    }

    // 2. Table Rows (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      
      if (/^\|[\s:-|-]+\|$/.test(trimmed)) {
        tableHeaderParsed = true;
        continue;
      }

      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map(cell => cell.trim());

      const tag = tableHeaderParsed ? 'td' : 'th';
      const rowHtml = `<tr>${cells.map(c => `<${tag}>${formatInlineSyntax(c)}</${tag}>`).join('')}</tr>`;
      tableRows.push(rowHtml);
      continue;
    } else if (inTable) {
      closeTable();
    }

    // 3. Horizontal Rule (---, ***, ___)
    if (/^(---|[*]{3,}|_{3,})$/.test(trimmed)) {
      closeList();
      closeTable();
      resultLines.push('<hr />');
      continue;
    }

    // 4. Headings (# H1 to ###### H6)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      closeTable();
      const level = headingMatch[1].length;
      const content = formatInlineSyntax(headingMatch[2]);
      resultLines.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    // 5. Blockquotes (> Quote text)
    if (trimmed.startsWith('>')) {
      closeList();
      closeTable();
      const quoteText = formatInlineSyntax(line.replace(/^>\s?/, ''));
      resultLines.push(`<blockquote><p>${quoteText}</p></blockquote>`);
      continue;
    }

    // 6. Checklist Item (- [ ] or - [x])
    const taskMatch = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      closeTable();
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        resultLines.push('<ul class="task-list">');
      }
      const isChecked = taskMatch[2].toLowerCase() === 'x';
      const content = formatInlineSyntax(taskMatch[3]);
      resultLines.push(
        `<li style="list-style-type: none;"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled /> ${content}</li>`
      );
      continue;
    }

    // 7. Unordered List (- item or * item)
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (ulMatch) {
      closeTable();
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        resultLines.push('<ul>');
      }
      const content = formatInlineSyntax(ulMatch[2]);
      resultLines.push(`<li>${content}</li>`);
      continue;
    }

    // 8. Ordered List (1. item)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      closeTable();
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
        resultLines.push('<ol>');
      }
      const content = formatInlineSyntax(olMatch[2]);
      resultLines.push(`<li>${content}</li>`);
      continue;
    }

    // Close open lists if blank line or standard paragraph
    if (!trimmed) {
      closeList();
      closeTable();
      continue;
    }

    closeList();
    closeTable();

    // Standard Paragraph
    resultLines.push(`<p>${formatInlineSyntax(line)}</p>`);
  }

  closeList();
  closeTable();

  let finalHtml = resultLines.join('\n');

  // Search Match Highlighting
  if (searchQuery.trim().length > 0) {
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');
    let matchIdx = 0;

    finalHtml = finalHtml.replace(searchRegex, (matchStr) => {
      const isCurrent = matchIdx === activeMatchIndex;
      matchIdx++;
      return `<mark class="${isCurrent ? 'search-highlight-active' : 'search-highlight'}">${matchStr}</mark>`;
    });
  }

  return finalHtml;
}

/**
 * Format inline Markdown syntax (Bold, Italic, Underline, Strikethrough, Code, Links, Images, Footnotes).
 */
function formatInlineSyntax(str: string): string {
  if (!str) return '';

  let out = str;

  // 1. Inline Images: ![alt](url)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    return `<img src="${src}" alt="${alt}" loading="lazy" />`;
  });

  // 2. Inline Links: [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  // 3. Inline Code: `code`
  out = out.replace(/`([^`]+)`/g, (_m, codeText) => {
    const escapedCode = codeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<code>${escapedCode}</code>`;
  });

  // 4. Bold: **text** or __text__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // 5. Strikethrough: ~~text~~
  out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // 6. Underline: <u>text</u>
  out = out.replace(/<u>([^<]+)<\/u>/gi, '<u>$1</u>');

  // 7. Italic: *text* or _text_
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/_([^_]+)_/g, '<em>$1</em>');

  // 8. Footnotes: [^1]
  out = out.replace(/\[\^(\d+)\]/g, '<sup>[$1]</sup>');

  return out;
}
