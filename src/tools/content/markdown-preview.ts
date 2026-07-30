import { ToolContent, FAQItem } from '../types';

export const markdownPreviewFaqs: FAQItem[] = [
  {
    question: "What is Markdown?",
    answer: "Markdown is a lightweight markup language with plain text formatting syntax. It is designed so that it can be converted to HTML and many other formats using a tool, while still being extremely easy to read and write in its raw form."
  },
  {
    question: "Why use a Markdown previewer?",
    answer: "Writing raw Markdown is fast, but it can be hard to visualize the final layout of tables, check-lists, links, and code blocks. A previewer parses the syntax and displays it in real time side-by-side, helping you catch structural errors, formatting issues, or broken links before publishing."
  },
  {
    question: "Is my document uploaded to a server?",
    answer: "No. Security and privacy are core to Toolora. All parsing, rendering, and downloading are computed entirely inside your browser sandbox. Your private documents, notes, or APIs never leave your computer and are never shared over the web."
  },
  {
    question: "Can I export my Markdown to HTML?",
    answer: "Yes, you can copy the raw HTML compilation using the 'Copy HTML' button, or download a fully structured and ready-to-run `.html` file using the 'Export HTML' button. The exported file contains the rendered markup and base layout."
  },
  {
    question: "How does Full Screen mode work?",
    answer: "Full Screen mode hides the header, footer, and category panels of Toolora. This gives you a distraction-free environment that utilizes 100% of your screen height for writing and previewing documents."
  },
  {
    question: "What elements are supported in the preview pane?",
    answer: "The parser fully supports standard Markdown specifications (CommonMark / GFM) including: multi-level headings, lists, tables with alignment, blockquotes, inline/fenced code blocks, hyperlinked images, normal anchor links, bold/italic text, and task checklists."
  }
];

export const markdownPreviewContent: ToolContent = {
  whatIsThis: {
    overview: "The Markdown Preview Editor is a premium, browser-based, privacy-first editing environment for writing Markdown documents. With real-time preview side-by-side, syntax highlighting, and multiple view modes (split, editor-only, preview-only), it allows developers, technical writers, and content creators to craft documents, README files, or text assets quickly and securely.",
    whyExists: "Many online Markdown previewers transmit your typed contents to backend servers for analysis, which compromises the confidentiality of private product specifications, logs, or corporate README drafts. This utility runs entirely offline in client-side memory, providing a premium sandbox with files operations (upload/download/copy) that never leave your device.",
    realWorldUseCases: [
      "README Composition: Draft, review, and format GitHub repository README files with tables and checklists.",
      "Static Blog Drafting: Write posts in Markdown, visualize lists/code-snippets, and copy the clean HTML for your static site generator.",
      "Document Conversion: Upload `.md` text documents and export them directly to ready-to-use HTML payloads.",
      "Distraction-Free Writing: Use Full Screen mode to take local notes or draft document models without interface clutter."
    ],
    whoShouldUse: [
      "Software Engineers: For writing repository docs, api specs, and developer wikis.",
      "Technical Writers: For drafting tutorials, user manuals, and structured references.",
      "Content Creators: For formatting blog articles or documentation payloads.",
      "Students & Researchers: For taking notes or organizing research papers using clean formatting."
    ],
    benefits: [
      "Zero Server Processing: Absolute privacy; 100% client-side compilation and file handling.",
      "Interactive Layout Controls: Easily switch between side-by-side Split View, Editor Only, or Preview Only.",
      "Multiple Export Channels: Copy Markdown raw, copy parsed HTML string, or download a full `.html` file.",
      "Drag-and-Drop Import: Import existing `.md` or `.txt` files directly into the editor space."
    ]
  },
  howToUseSteps: [
    "Load sample or type markdown text into the Left Editor panel.",
    "Observe the rendered result in the Right Preview panel in real time.",
    "Use the view controls to switch layouts or toggle Full Screen mode.",
    "Click 'Copy HTML' or 'Export HTML' to retrieve output, or download the markdown as a `.md` file."
  ],
  workedExamples: [
    {
      title: "Drafting a Structured Repository Readme",
      scenario: "A developer wants to draft a README featuring a heading, a list of requirements, a config code block, and a checklist.",
      calculation: "Input Markdown:\n# Project Name\n- [x] Initial commit\n- [ ] Release v1.0.0\n\n```js\nconst config = { dev: true };\n```",
      result: "The preview panel immediately structures a bold title, lists showing a checked item and an empty box, and a syntax-highlighted code block."
    },
    {
      title: "Creating a Pricing Comparison Table",
      scenario: "A technical marketer wants to draft a comparison table with aligned columns to paste into a web portal.",
      calculation: "Input Markdown:\n| Tier | Price | Features |\n| :--- | :---: | :--- |\n| Free | $0 | Basic access |\n| Pro | $19 | Complete toolset |",
      result: "Generates a fully aligned HTML table with bordered cells, bold headers, and left/center column alignment."
    }
  ],
  formulaDetails: {
    equation: "Markdown to HTML Compilation Rules:\n1. '#' defines headers H1 to H6 based on symbol count.\n2. '>', '>>' creates single or nested blockquote sections.\n3. '-' or '*' creates bullet lists. '1.' creates ordered lists.\n4. '- [ ]' and '- [x]' represent interactive task checklist items.\n5. '```[lang]' wraps multi-line code blocks, enabling syntax highlight classes.\n6. '|' grid blocks compile to HTML <table>, <thead>, <tbody>, <th>, and <td> structures.",
    explanation: "Markdown parsers process plain text using regular expressions and tokenizer loops to produce structured HTML trees, which are then sanitized to remove dangerous elements (like <script> or iframe onerror attributes).",
    variables: [
      { name: "Tokens", description: "Identified markdown structures like headings or list elements." },
      { name: "Sanitization", description: "Dynamic filtering of HTML code blocks to ensure no malicious code can execute (XSS protection)." }
    ]
  },
  commonMistakes: [
    {
      title: "Missing Newline Before Lists or Code Blocks",
      mistake: "Writing a paragraph and immediately starting list items on the next line without an empty line.",
      correction: "Add a blank line between the paragraph and the list to allow the parser to recognize the block transition."
    },
    {
      title: "Incorrect Checklist Formatting",
      mistake: "Writing '-[] item' or '- [x]item' without standard spacing.",
      correction: "Write exactly '- [ ] item' (a space inside brackets) or '- [x] item' (x inside brackets, followed by a space)."
    }
  ],
  tips: [
    "Switch to Full Screen mode to remove the browser and website wrappers, making it look like a standalone writing app.",
    "Use the 'Export HTML' button to save your formatted work as a self-contained local website file.",
    "Drag-and-drop any local `.md` file into the editor area for instant rendering and modification."
  ]
};
