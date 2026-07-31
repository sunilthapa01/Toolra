export interface MarkdownStats {
  characters: number;
  charactersNoSpace: number;
  words: number;
  lines: number;
  paragraphs: number;
  headings: number;
  links: number;
  images: number;
  tables: number;
  lists: number;
  codeBlocks: number;
  readingTimeMinutes: number;
  readingLevel: string;
}

export function calculateMarkdownStats(markdown: string): MarkdownStats {
  if (!markdown || !markdown.trim()) {
    return {
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
    };
  }

  const rawText = markdown;
  const characters = rawText.length;
  const charactersNoSpace = rawText.replace(/\s/g, '').length;
  
  const lineArray = rawText.split('\n');
  const lines = lineArray.length;

  // Words count
  const wordsArray = rawText
    .replace(/[#*`_~>[\]()|!+=\-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0);
  const words = wordsArray.length;

  // Paragraphs count (blocks separated by empty lines)
  const paragraphBlocks = rawText
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0);
  const paragraphs = paragraphBlocks.length;

  // Headings count (^#{1,6}\s)
  const headingMatches = rawText.match(/^#{1,6}\s+/gm);
  const headings = headingMatches ? headingMatches.length : 0;

  // Images count (![alt](url) or <img ...>)
  const imageMatches = rawText.match(/!\[.*?\]\(.*?\)|<img\s+[^>]*>/gi);
  const images = imageMatches ? imageMatches.length : 0;

  // Links count ([text](url) - excluding images, or <http...>)
  const linkMatches = rawText.match(/(?<!Starts_With_Bang)\[.*?\]\(.*?\)|<https?:\/\/[^>]+>/gi);
  // Refined regex for markdown links excluding image bang !
  const mdLinkMatches = rawText.match(/(?:^|[^!])\[[^\]]+\]\([^)]+\)/g);
  const links = (mdLinkMatches ? mdLinkMatches.length : 0);

  // Code Blocks count (``` or ~~~ fenced blocks)
  const codeBlockMatches = rawText.match(/```[\s\S]*?```|~~~[\s\S]*?~~~/g);
  const codeBlocks = codeBlockMatches ? codeBlockMatches.length : 0;

  // Tables count (lines with pipe '|' formatting table rows, grouped)
  const tableRowLines = lineArray.filter(line => /^\s*\|.*\|\s*$/.test(line));
  // Estimate tables count as divider rows (|---|)
  const tableDividerMatches = rawText.match(/^\s*\|?\s*:?-+:?\s*\|/gm);
  const tables = tableDividerMatches ? tableDividerMatches.length : (tableRowLines.length > 0 ? 1 : 0);

  // Lists count (lines starting with -, *, +, 1., etc.)
  const listMatches = rawText.match(/^\s*([-*+]|\d+\.)\s+/gm);
  const lists = listMatches ? listMatches.length : 0;

  // Estimated Reading Time (200 words per minute average)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Flesch-Kincaid Reading Level Estimation
  let readingLevel = 'Easy';
  if (words > 0) {
    const sentences = (rawText.match(/[.!?]+(\s|$)/g) || []).length || 1;
    // Syllable approximation (simple heuristic based on vowel sequences)
    let syllables = 0;
    wordsArray.forEach(w => {
      const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length <= 3) {
        syllables += 1;
      } else {
        const matches = cleanWord.match(/[aeiouy]{1,2}/g);
        syllables += matches ? matches.length : 1;
      }
    });

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    if (score >= 90) readingLevel = '5th Grade (Very Easy)';
    else if (score >= 80) readingLevel = '6th Grade (Easy)';
    else if (score >= 70) readingLevel = '7th Grade (Fairly Easy)';
    else if (score >= 60) readingLevel = '8th-9th Grade (Plain English)';
    else if (score >= 50) readingLevel = '10th-12th Grade (Fairly Hard)';
    else if (score >= 30) readingLevel = 'College Level';
    else readingLevel = 'Professional / Technical';
  }

  return {
    characters,
    charactersNoSpace,
    words,
    lines,
    paragraphs,
    headings,
    links,
    images,
    tables,
    lists,
    codeBlocks,
    readingTimeMinutes,
    readingLevel
  };
}
