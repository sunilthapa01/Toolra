import dynamic from 'next/dynamic';
import React from 'react';
import { ToolDefinition } from './types';

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
    faqs: [
      {
        question: 'What is GST (Goods and Services Tax)?',
        answer: 'GST is an indirect tax levied on the supply of goods and services. It is a single, comprehensive tax that subsumes several other indirect taxes like VAT, Service Tax, and Excise Duty, creating a unified domestic market.'
      },
      {
        question: 'What is the difference between GST Exclusive and GST Inclusive?',
        answer: 'GST Exclusive means the price of the product does not include the tax; GST will be added on top of this amount. GST Inclusive means the tax amount is already included in the retail price of the product and needs to be extracted.'
      },
      {
        question: 'What are CGST, SGST, and IGST?',
        answer: 'CGST (Central GST) and SGST (State GST) are levied on transactions occurring within a single state (intrastate). IGST (Integrated GST) is levied on transactions between different states (interstate).'
      },
      {
        question: 'How do I calculate GST Inclusive amount manually?',
        answer: 'To calculate the GST Inclusive base price manually, divide the total price by (1 + GST Rate/100). For example, if a product is Rs. 118 inclusive of 18% GST, the base price is 118 / 1.18 = Rs. 100, and the GST amount is Rs. 18.'
      }
    ],
    seoContent: React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement('h2', { className: 'text-2xl font-bold font-outfit text-foreground' }, 'Understanding the Goods and Services Tax (GST) Calculations'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'GST calculation can sometimes feel complicated due to different tax structures and rates. Toolora\'s premium GST Calculator is designed to make tax computation fast, accurate, and completely transparent.'
      ),
      React.createElement('h3', { className: 'text-lg font-semibold font-outfit text-foreground' }, 'How GST Exclusive Works'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'Under GST Exclusive, the tax is computed directly on the base amount and then added to get the final payable amount. The formulas used are:'
      ),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside text-muted pl-4 space-y-2' },
        React.createElement('li', null, 'GST Amount = Base Amount × (GST Rate / 100)'),
        React.createElement('li', null, 'Total Price = Base Amount + GST Amount'),
        React.createElement('li', null, 'CGST = SGST = GST Amount / 2 (For Intrastate supply)'),
        React.createElement('li', null, 'IGST = GST Amount (For Interstate supply)')
      ),
      React.createElement('h3', { className: 'text-lg font-semibold font-outfit text-foreground' }, 'How GST Inclusive Works'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'When a price already includes GST, we must back-calculate to find the original value and extract the tax component. The formulas used are:'
      ),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside text-muted pl-4 space-y-2' },
        React.createElement('li', null, 'Base Price (Net Amount) = Total Price / (1 + GST Rate / 100)'),
        React.createElement('li', null, 'GST Amount = Total Price − Base Price'),
        React.createElement('li', null, 'CGST = SGST = GST Amount / 2 (For Intrastate supply)'),
        React.createElement('li', null, 'IGST = GST Amount (For Interstate supply)')
      ),
      React.createElement('h3', { className: 'text-lg font-semibold font-outfit text-foreground' }, 'Why Use Toolora\'s GST Calculator?'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'Unlike other generic online calculators, Toolora provides a clean interface that displays state-wise breakdowns (CGST + SGST) alongside interstate breakdowns (IGST) in a structured format. You can instantly copy individual parameters or the entire transaction summary with a single click, saving valuable business time.'
      )
    ),
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
    faqs: [
      {
        question: 'What is a Reverse GST Calculator?',
        answer: 'A Reverse GST Calculator is a tool designed to back-calculate the original (exclusive) cost of an item or service from a total price that already includes the Goods and Services Tax (GST).'
      },
      {
        question: 'How is Reverse GST calculated mathematically?',
        answer: 'To extract the original base value, use the formula: Base Price = Total Inclusive Price / (1 + GST Rate / 100). The GST Tax amount is then the difference between the Total Price and the Base Price.'
      }
    ],
    seoContent: React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement('h2', { className: 'text-2xl font-bold font-outfit text-foreground' }, 'Understanding Reverse GST Calculations'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'Extracting GST from an inclusive amount is crucial for accountants, businesses, and billing teams to ensure correct ledger entries. The formulas used for extraction are mathematically precise and comply with standard tax filing rules.'
      )
    ),
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
    faqs: [
      {
        question: 'What is an EMI?',
        answer: 'Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month.'
      },
      {
        question: 'How is Loan EMI calculated?',
        answer: 'EMI is calculated using the formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1], where P is the principal loan amount, r is the monthly interest rate, and n is the tenure in months.'
      }
    ],
    seoContent: React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement('h2', { className: 'text-2xl font-bold font-outfit text-foreground' }, 'Loan Repayment & Amortization Projections'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'By utilizing standard reducing-balance math, you can accurately plan home loans, car loans, and business financing. The amortization schedule details how each payment is split between reducing principal and interest costs.'
      )
    ),
    component: dynamic(() => import('@/features/calculators/EMICalculator'), {
      loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center text-muted' }, 'Loading EMI Calculator...'),
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
    faqs: [
      {
        question: 'What is a Systematic Investment Plan (SIP)?',
        answer: 'An SIP is an investment route offered by mutual funds where one can invest a fixed amount regularly (monthly/quarterly) rather than making a large lumpsum investment.'
      },
      {
        question: 'What is a Step-Up SIP?',
        answer: 'A Step-Up SIP allows you to increase your monthly investment amount by a fixed percentage or amount every year automatically, accelerating your wealth accumulation.'
      }
    ],
    seoContent: React.createElement(
      'div',
      { className: 'space-y-6' },
      React.createElement('h2', { className: 'text-2xl font-bold font-outfit text-foreground' }, 'Systematic Investing & Compound Wealth'),
      React.createElement(
        'p',
        { className: 'text-muted leading-relaxed' },
        'Regular investments take advantage of compounding and rupee cost averaging. A Step-Up option is a powerful way to align your investment growth with salary increments over time.'
      )
    ),
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
  'pdf-merge': {
    slug: 'pdf-merge',
    title: 'PDF Merge & Combine',
    description: 'Combine multiple PDF files into a single document entirely in your browser. No files are uploaded to any server.',
    category: 'pdf',
    categoryName: 'PDF',
    keywords: ['merge pdf', 'combine documents', 'join pdfs', 'pdf joiner'],
    faqs: [],
    comingSoon: true
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
