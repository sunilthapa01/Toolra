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


export const toolsRegistry: Record<string, ToolDefinition> = {
  'gst-calculator': {
    slug: 'gst-calculator',
    title: 'GST Calculator',
    description: 'Calculate Goods and Services Tax (GST) for transactions. Supports GST Exclusive and Inclusive calculations with complete CGST, SGST, and IGST breakdowns.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'Reverse GST Calculator',
    description: 'Extract the base tax amount and original price from a GST inclusive total price quickly and accurately.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'EMI Calculator',
    description: 'Calculate monthly home, car, or personal loan repayments with full amortization charts and interest breakdowns.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedule instantly with our free online calculator. Compare loans or simulate extra prepayments.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'Income Tax Calculator India',
    description: 'Calculate and compare your income tax liability under both the Old and New Tax Regimes for the latest Financial Year (FY 2024-25, FY 2025-26, and FY 2026-27). Estimate deductions, calculate HRA exemptions, and export your summary.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'SIP Calculator',
    description: 'Calculate the future value of your monthly Systemic Investment Plan (SIP) or one-time Lumpsum mutual funds.',
    category: 'finance',
    categoryName: 'Finance',
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
    title: 'GST Split Calculator',
    description: 'Split bills and shared transaction invoices between partners, isolating tax portions and raw pricing splits.',
    category: 'finance',
    categoryName: 'Finance',
    keywords: ['split bill', 'gst split', 'shared expense calculator', 'invoice split'],
    faqs: [],
    comingSoon: true
  },
  'pdf-merge-combine': {
    slug: 'pdf-merge-combine',
    title: 'PDF Merge & Combine',
    description: 'Merge multiple PDF files into one document online for free. Fast, secure, privacy-first PDF merger that works entirely in your browser.',
    category: 'pdf',
    categoryName: 'PDF',
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
    title: 'PDF Page Splitter',
    description: 'Extract specific pages or split pages of a PDF document into separate files instantly in your browser.',
    category: 'pdf',
    categoryName: 'PDF',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages'],
    faqs: [],
    comingSoon: true
  },
  'json-formatter': {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Prettify, parse, validate, and minify your JSON data locally. Clean syntax highlighting with auto-formatting.',
    category: 'developer',
    categoryName: 'Developer',
    keywords: ['json parser', 'json format', 'validate json', 'json lint'],
    faqs: [],
    comingSoon: true
  },
  'base64-converter': {
    slug: 'base64-converter',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode text strings into Base64 format or decode Base64 back into readable text locally and securely.',
    category: 'developer',
    categoryName: 'Developer',
    keywords: ['base64 encoder', 'base64 decoder', 'encode text', 'decode base64'],
    faqs: [],
    comingSoon: true
  },
  'word-counter': {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and reading times for any text input instantly.',
    category: 'text',
    categoryName: 'Text',
    keywords: ['word counter', 'character count', 'text counter', 'reading time'],
    faqs: [],
    comingSoon: true
  },
  'case-converter': {
    slug: 'case-converter',
    title: 'Case Converter Suite',
    description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, titleCase, and sentence case easily.',
    category: 'text',
    categoryName: 'Text',
    keywords: ['case converter', 'camelcase', 'snakecase', 'uppercase lowercase'],
    faqs: [],
    comingSoon: true
  },
  'gst-invoice-generator': {
    slug: 'gst-invoice-generator',
    title: 'GST Invoice Maker',
    description: 'Create standard, GST-compliant PDF invoice receipts for clients and downloads them directly.',
    category: 'business',
    categoryName: 'Business',
    keywords: ['gst invoice', 'invoice generator', 'gst bill maker', 'pdf invoice'],
    faqs: [],
    comingSoon: true
  },
  'invoice-generator': {
    slug: 'invoice-generator',
    title: 'Standard Invoice Generator',
    description: 'Generate professional business invoices and simple receipts for general clients and billing records.',
    category: 'business',
    categoryName: 'Business',
    keywords: ['receipt maker', 'client invoice', 'commercial receipt'],
    faqs: [],
    comingSoon: true
  }
};
