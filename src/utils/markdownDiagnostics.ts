export interface DiagnosticIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
}

export function analyzeMarkdownDiagnostics(markdown: string): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  if (!markdown || !markdown.trim()) return issues;

  const lines = markdown.split('\n');

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;

    // 1. Check for empty link targets: [text]()
    if (/(?<!!)\[[^\]]+\]\(\s*\)/.test(lineText)) {
      issues.push({
        id: `empty-link-${lineNum}`,
        type: 'warning',
        message: `Missing link URL target on line ${lineNum}`,
        line: lineNum
      });
    }

    // 2. Check for empty image sources: ![alt]()
    if (/!\[[^\]]*\]\(\s*\)/.test(lineText)) {
      issues.push({
        id: `empty-image-${lineNum}`,
        type: 'warning',
        message: `Broken/missing image source URL on line ${lineNum}`,
        line: lineNum
      });
    }

    // 3. Check for unclosed single backticks (odd number of backticks on a non-fence line)
    if (!lineText.includes('```')) {
      const backtickCount = (lineText.match(/`/g) || []).length;
      if (backtickCount % 2 !== 0) {
        issues.push({
          id: `unclosed-backtick-${lineNum}`,
          type: 'info',
          message: `Unclosed inline code backtick on line ${lineNum}`,
          line: lineNum
        });
      }
    }

    // 4. Check for malformed table rows (e.g. starting with | but uneven pipe count or missing closing pipe)
    if (lineText.trim().startsWith('|') && !lineText.trim().endsWith('|')) {
      issues.push({
        id: `malformed-table-${lineNum}`,
        type: 'warning',
        message: `Malformed table row (missing closing '|') on line ${lineNum}`,
        line: lineNum
      });
    }
  });

  // 5. Check for unclosed fenced code blocks across whole document
  const fenceMatches = markdown.match(/^```|^~~~/gm);
  if (fenceMatches && fenceMatches.length % 2 !== 0) {
    issues.push({
      id: 'unclosed-code-block',
      type: 'warning',
      message: 'Unclosed fenced code block in document (odd number of ``` markers)'
    });
  }

  return issues;
}
