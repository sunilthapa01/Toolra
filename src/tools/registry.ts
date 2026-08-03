import dynamic from 'next/dynamic';
import React from 'react';
import { ToolDefinition } from './types';
import { gstCalculatorContent, gstCalculatorFaqs } from './content/gst-calculator';
import { reverseGstCalculatorContent, reverseGstCalculatorFaqs } from './content/reverse-gst-calculator';
import { emiCalculatorContent, emiCalculatorFaqs } from './content/emi-calculator';
import { sipCalculatorContent, sipCalculatorFaqs } from './content/sip-calculator';
import { loanCalculatorContent, loanCalculatorFaqs } from './content/loan-calculator';
import { incomeTaxCalculatorContent, incomeTaxCalculatorFaqs } from './content/income-tax-calculator-india';
import { pdfMergeCombineContent, pdfMergeCombineFaqs } from './content/pdf-merge-combine';
import { pdfSplitContent, pdfSplitFaqs } from './content/pdf-split';
import { jsonFormatterContent, jsonFormatterFaqs } from './content/json-formatter';
import { base64EncoderDecoderContent, base64EncoderDecoderFaqs } from './content/base64-encoder-decoder';
import { hashGeneratorContent, hashGeneratorFaqs } from './content/hash-generator';
import { markdownPreviewContent, markdownPreviewFaqs } from './content/markdown-preview';

export const toolsRegistry: Record<string, ToolDefinition> = {
  'json-formatter': {
    slug: 'json-formatter',
    shortUrl: 'json',
    aliases: ['json-formatter', 'json-parser', 'json-validator'],
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, and debug JSON data locally with instant syntax diagnostics.',
    category: 'developer',
    categoryName: 'Developer',
    capabilities: ['Prettify & Parse', 'Minify JSON', 'Syntax Check'],
    keywords: ['json parser', 'json format', 'validate json', 'json lint', 'json beautify', 'json minify'],
    faqs: jsonFormatterFaqs,
    content: jsonFormatterContent,
    component: dynamic(() => import('@/features/developer/JSONFormatter'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading JSON Formatter...'),
      ssr: false
    })
  },
  'gst-calculator': {
    slug: 'gst-calculator',
    shortUrl: 'gst',
    aliases: ['gst-calculator'],
    title: 'GST Calculator',
    description: 'Calculate tax amounts and verify invoice totals with instant CGST, SGST, and IGST breakdowns.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Inclusive / Exclusive', 'CGST & SGST Split', 'Tax Summary'],
    keywords: [
      'gst calculator',
      'exclusive gst',
      'inclusive gst',
      'cgst sgst calculator',
      'igst calculator',
      'india tax calculator',
      'tax breakdown'
    ],
    faqs: gstCalculatorFaqs,
    content: gstCalculatorContent,
    component: dynamic(() => import('@/features/calculators/GSTCalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading GST Calculator...'),
      ssr: false
    })
  },
  'reverse-gst-calculator': {
    slug: 'reverse-gst-calculator',
    shortUrl: 'reverse-gst',
    aliases: ['reverse-gst-calculator'],
    title: 'Reverse GST Calculator',
    description: 'Extract base prices and isolate tax amounts from inclusive invoice totals for accurate financial reconciliation.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Extract Base Price', 'Tax Portion', 'Instant Calc'],
    keywords: ['reverse tax', 'gst extraction', 'backwards gst', 'inclusive tax'],
    faqs: reverseGstCalculatorFaqs,
    content: reverseGstCalculatorContent,
    component: dynamic(() => import('@/features/calculators/ReverseGSTCalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Reverse GST Calculator...'),
      ssr: false
    })
  },
  'emi-calculator': {
    slug: 'emi-calculator',
    shortUrl: 'emi',
    aliases: ['emi-calculator'],
    title: 'EMI Calculator',
    description: 'Calculate monthly loan repayments and inspect interactive amortization schedules to plan long-term financing.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Monthly Repayment', 'Amortization Chart', 'Interest Split'],
    keywords: ['loan emi', 'repayment calculator', 'mortgage calculator', 'amortization', 'loan interest'],
    faqs: emiCalculatorFaqs,
    content: emiCalculatorContent,
    component: dynamic(() => import('@/features/calculators/EMICalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading EMI Calculator...'),
      ssr: false
    })
  },
  'loan-calculator': {
    slug: 'loan-calculator',
    shortUrl: 'loan',
    aliases: ['loan-calculator'],
    title: 'Loan Calculator',
    description: 'Simulate prepayments and analyze loan repayment terms to minimize total borrowing costs.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Prepayment Sim', 'Amortization', 'Interest Breakdown'],
    keywords: [
      'loan calculator',
      'monthly payment calculator',
      'loan payment calculator',
      'emi calculator',
      'interest calculator',
      'mortgage calculator',
      'personal loan calculator',
      'home loan calculator',
      'car loan calculator',
      'business loan calculator',
      'student loan calculator',
      'repayment calculator',
      'loan amortization calculator'
    ],
    faqs: loanCalculatorFaqs,
    content: loanCalculatorContent,
    component: dynamic(() => import('@/features/calculators/LoanCalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Loan Calculator...'),
      ssr: false
    })
  },
  'income-tax-calculator-india': {
    slug: 'income-tax-calculator-india',
    shortUrl: 'income-tax',
    aliases: ['income-tax-calculator-india', 'tax'],
    title: 'Income Tax Calculator India',
    description: 'Compare Old and New Tax Regime liabilities side by side to optimize annual salary deductions.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Old vs New Regime', 'FY 25-26 Slabs', 'Deduction Calc'],
    keywords: [
      'income tax calculator',
      'income tax calculator india',
      'tax calculator india',
      'old tax regime calculator',
      'new tax regime calculator',
      'salary tax calculator',
      'income tax calculator fy',
      'tax slab calculator',
      'annual income tax',
      'income tax estimate',
      'tax comparison calculator'
    ],
    faqs: incomeTaxCalculatorFaqs,
    content: incomeTaxCalculatorContent,
    component: dynamic(() => import('@/features/calculators/IncomeTaxCalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Income Tax Calculator...'),
      ssr: false
    })
  },
  'sip-calculator': {
    slug: 'sip-calculator',
    shortUrl: 'sip',
    aliases: ['sip-calculator'],
    title: 'SIP Calculator',
    description: 'Project investment returns and compound wealth growth across monthly SIPs and lumpsum contributions.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['SIP & Lumpsum', 'Wealth Growth', 'Returns Projection'],
    keywords: ['sip calculator', 'lumpsum calculator', 'mutual fund projection', 'wealth calculator', 'step up sip'],
    faqs: sipCalculatorFaqs,
    content: sipCalculatorContent,
    component: dynamic(() => import('@/features/calculators/SIPCalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading SIP Calculator...'),
      ssr: false
    })
  },
  'gst-split-calculator': {
    slug: 'gst-split-calculator',
    shortUrl: 'gst-split',
    aliases: ['gst-split-calculator'],
    title: 'GST Split Calculator',
    description: 'Split shared invoice expenses and allocate precise tax portions between partners or project clients.',
    category: 'finance',
    categoryName: 'Finance',
    capabilities: ['Bill Splitting', 'Tax Isolator', 'Partner Split'],
    keywords: ['split bill', 'gst split', 'shared expense calculator', 'invoice split'],
    faqs: [],
    comingSoon: true
  },
  'pdf-merge-combine': {
    slug: 'pdf-merge-combine',
    shortUrl: 'pdf-merge',
    aliases: ['pdf-merge-combine', 'merge-pdf', 'combine-pdf'],
    title: 'PDF Merge & Combine',
    description: 'Combine multiple PDF documents into a single organized file locally without server uploads.',
    category: 'pdf',
    categoryName: 'PDF',
    capabilities: ['Combine PDFs', 'Page Reordering', '100% Local'],
    keywords: [
      'merge pdf',
      'combine pdf',
      'pdf merger',
      'merge pdf online',
      'combine pdf online',
      'merge multiple pdfs',
      'join pdf',
      'merge pdf free',
      'merge pdf browser',
      'online pdf merger',
      'pdf combine tool'
    ],
    faqs: pdfMergeCombineFaqs,
    content: pdfMergeCombineContent,
    component: dynamic(() => import('@/features/pdf/PDFMergeCombine'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading PDF Merge & Combine...'),
      ssr: false
    })
  },
  'pdf-split': {
    slug: 'pdf-split',
    shortUrl: 'pdf-split',
    aliases: ['split-pdf'],
    title: 'PDF Page Splitter',
    description: 'Extract specific page ranges and separate PDF documents locally for clean file organization.',
    category: 'pdf',
    categoryName: 'PDF',
    capabilities: ['Extract Pages', 'Range Split', 'Zero Uploads'],
    keywords: [
      'split pdf',
      'extract pdf pages',
      'separate pdf pages',
      'extract pages from pdf',
      'pdf page splitter',
      'split pdf document'
    ],
    faqs: pdfSplitFaqs,
    content: pdfSplitContent,
    component: dynamic(() => import('@/features/pdf/PDFSplit'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading PDF Page Splitter...'),
      ssr: false
    })
  },
  'base64-encoder-decoder': {
    slug: 'base64-encoder-decoder',
    shortUrl: 'base64',
    aliases: ['base64-encoder-decoder', 'base64-encode', 'base64-decode'],
    title: 'Base64 Encoder & Decoder',
    description: 'Encode strings or decode Base64 payloads locally for data transmission and authentication debugging.',
    category: 'developer',
    categoryName: 'Developer',
    capabilities: ['Encode String', 'Decode Base64', 'UTF-8 Support'],
    keywords: [
      'base64 encoder',
      'base64 decoder',
      'encode text',
      'decode base64',
      'base64 url',
      'convert base64',
      'text to base64',
      'binary to text'
    ],
    faqs: base64EncoderDecoderFaqs,
    content: base64EncoderDecoderContent,
    component: dynamic(() => import('@/features/developer/Base64EncoderDecoder'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Base64 Encoder & Decoder...'),
      ssr: false
    })
  },
  'hash-generator': {
    slug: 'hash-generator',
    shortUrl: 'hash',
    aliases: ['hash-generator', 'md5', 'sha256'],
    title: 'Hash Generator',
    seoTitle: 'Hash Generator – Generate MD5, SHA-256, SHA-512 Hash Online | Toolora',
    description: 'Generate cryptographic checksums including MD5, SHA-256, and SHA-512 locally to verify data integrity.',
    category: 'developer',
    categoryName: 'Developer',
    capabilities: ['MD5 / SHA-256', 'SHA-512 Hash', 'Checksum'],
    keywords: [
      'hash generator',
      'md5 generator',
      'sha256 generator',
      'sha512 generator',
      'sha1 generator',
      'cryptographic hash',
      'checksum generator',
      'online hash generator',
      'file hash'
    ],
    faqs: hashGeneratorFaqs,
    content: hashGeneratorContent,
    component: dynamic(() => import('@/features/developer/HashGenerator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Hash Generator...'),
      ssr: false
    })
  },
  'markdown-preview': {
    slug: 'markdown-preview',
    shortUrl: 'markdown',
    aliases: ['markdown-preview', 'md'],
    title: 'Markdown Preview',
    seoTitle: 'Markdown Preview Editor Online | Toolora',
    description: 'Write and preview Markdown with live HTML rendering and instant document export.',
    category: 'developer',
    categoryName: 'Developer',
    capabilities: ['Live Preview', 'HTML Export', 'Monaco Editor'],
    keywords: [
      'markdown preview',
      'markdown editor',
      'md viewer',
      'markdown to html',
      'online markdown editor',
      'github markdown preview',
      'render markdown',
      'live preview markdown'
    ],
    faqs: markdownPreviewFaqs,
    content: markdownPreviewContent,
    component: dynamic(() => import('@/features/developer/MarkdownPreview'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading Markdown Preview...'),
      ssr: false
    })
  },
  'word-counter': {
    slug: 'word-counter',
    shortUrl: 'word-counter',
    aliases: [],
    title: 'Word Counter',
    description: 'Analyze text metrics including word counts, character counts, and estimated reading times.',
    category: 'text',
    categoryName: 'Text',
    capabilities: ['Word Count', 'Reading Time', 'Sentence Count'],
    keywords: ['word counter', 'character count', 'text counter', 'reading time'],
    faqs: [],
    comingSoon: true
  },
  'case-converter': {
    slug: 'case-converter',
    shortUrl: 'case-converter',
    aliases: [],
    title: 'Case Converter Suite',
    description: 'Convert text formats between camelCase, snake_case, UPPERCASE, and title case for software development.',
    category: 'text',
    categoryName: 'Text',
    capabilities: ['UPPER / lowercase', 'camelCase', 'snake_case'],
    keywords: ['case converter', 'camelcase', 'snakecase', 'uppercase lowercase'],
    faqs: [],
    comingSoon: true
  },
  'gst-invoice-generator': {
    slug: 'gst-invoice-generator',
    shortUrl: 'gst-invoice',
    aliases: ['gst-invoice-generator'],
    title: 'GST Invoice Maker',
    description: 'Generate tax-compliant GST invoices with itemized rate breakdowns and instant PDF export.',
    category: 'business',
    categoryName: 'Business',
    capabilities: ['GST Compliant', 'PDF Invoice', 'Receipt Maker'],
    keywords: ['gst invoice', 'invoice generator', 'gst bill maker', 'pdf invoice'],
    faqs: [],
    comingSoon: true
  },
  'invoice-generator': {
    slug: 'invoice-generator',
    shortUrl: 'invoice',
    aliases: ['invoice-generator'],
    title: 'Standard Invoice Generator',
    description: 'Build professional billing invoices and downloadable client receipts with customized payment terms.',
    category: 'business',
    categoryName: 'Business',
    capabilities: ['Client Billing', 'Simple Receipt', 'Instant PDF'],
    keywords: ['receipt maker', 'client invoice', 'commercial receipt'],
    faqs: [],
    comingSoon: true
  }
};

// Fast lookup map from any shortUrl, slug, or alias -> tool key in toolsRegistry
export const aliasToSlugMap: Record<string, string> = {};

Object.values(toolsRegistry).forEach((tool) => {
  aliasToSlugMap[tool.slug] = tool.slug;
  if (tool.shortUrl) {
    aliasToSlugMap[tool.shortUrl] = tool.slug;
  }
  if (tool.aliases) {
    tool.aliases.forEach((alias) => {
      aliasToSlugMap[alias] = tool.slug;
    });
  }
});

export function getToolBySlugOrAlias(param: string): ToolDefinition | undefined {
  const slug = aliasToSlugMap[param];
  return slug ? toolsRegistry[slug] : undefined;
}

export function getToolCanonicalPath(tool: ToolDefinition): string {
  return `/${tool.shortUrl || tool.slug}`;
}
