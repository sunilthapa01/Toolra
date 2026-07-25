import { ToolContent, FAQItem } from '../types';

export const reverseGstCalculatorFaqs: FAQItem[] = [
  {
    question: 'What is a Reverse GST Calculator?',
    answer: 'A Reverse GST Calculator (or GST Extraction Calculator) is a tool designed to back-calculate the original cost of a product or service from a final bill amount that already includes GST. It splits the total price into the original net price and the exact tax amount.'
  },
  {
    question: 'How is reverse GST calculated?',
    answer: 'It is calculated by dividing the total inclusive price by (1 + GST rate/100). This isolates the base price. The tax component is then found by subtracting this base price from the total inclusive price.'
  },
  {
    question: 'Why do businesses need to calculate GST in reverse?',
    answer: 'Businesses need this to perform tax reconciliation, split vendor bills in purchase ledgers, verify that supplier invoices are correct, and determine raw profit margins on retail-priced items.'
  },
  {
    question: 'What is the mathematical formula for reverse GST?',
    answer: 'The formula is: Base Price = Total Price / (1 + R/100), where R is the GST rate percentage. The GST Amount is equal to: Total Price − Base Price.'
  },
  {
    question: 'If a bill is ₹1,180 with 18% GST, what is the base amount?',
    answer: 'The base amount is ₹1,000. Calculation: ₹1,180 / (1 + 18/100) = ₹1,180 / 1.18 = ₹1,000. The GST amount is ₹180.'
  },
  {
    question: 'Can I reverse-calculate CGST and SGST?',
    answer: 'Yes. Once the total GST amount is extracted using the reverse GST formula, you divide that tax amount by 2 to get the CGST and SGST values (for intrastate transactions).'
  },
  {
    question: 'How do I extract GST from a 5% tax-inclusive amount?',
    answer: 'Divide the total amount by 1.05. For example, if the total is ₹1,050, the base price is ₹1,050 / 1.05 = ₹1,000, and the GST amount is ₹50.'
  },
  {
    question: 'How do I extract GST from a 12% tax-inclusive amount?',
    answer: 'Divide the total amount by 1.12. For example, a total of ₹5,600 results in a base price of ₹5,600 / 1.12 = ₹5,000, and the GST amount is ₹600.'
  },
  {
    question: 'How do I extract GST from a 28% tax-inclusive amount?',
    answer: 'Divide the total amount by 1.28. For example, a total of ₹12,800 results in a base price of ₹12,800 / 1.28 = ₹10,000, and the GST amount is ₹2,800.'
  },
  {
    question: 'Is the reverse GST formula identical for goods and services?',
    answer: 'Yes, the mathematical formula is identical. It depends solely on the tax percentage slab, regardless of whether it is applied to a physical item (HSN code) or a service (SAC code).'
  },
  {
    question: 'What is the difference between GST inclusive and GST exclusive rates?',
    answer: 'An inclusive rate means the tax is built-in (e.g. consumer price tags). An exclusive rate means the tax will be added on top (e.g. B2B service contracts). Reverse calculation converts an inclusive price back to the exclusive equivalent.'
  },
  {
    question: 'How does tax-inclusive pricing benefit B2C businesses?',
    answer: 'In B2C transactions, consumers prefer knowing the exact final amount they have to pay without adding hidden charges at checkout. Reverse GST calculation helps B2C businesses find their raw revenue from these transactions.'
  },
  {
    question: 'Can I reverse-calculate custom tax rates?',
    answer: 'Yes. Our tool allows you to input a custom percentage rate (e.g. 3% for gold, or custom international VAT rates) to extract the base amount.'
  },
  {
    question: 'What happens if I round off the base price too early in reverse GST?',
    answer: 'Rounding off intermediate figures too early leads to penny discrepancies in tax filings and general ledgers, causing invoices to not match bank statements. Always round only the final calculated values.'
  },
  {
    question: 'How do I record a reverse GST transaction in my accounting ledger?',
    answer: 'Debit the base cost of the purchase to the Expense account, debit the extracted GST portion to the Input Tax Credit (ITC) asset account, and credit the total payment to the Cash or Accounts Payable liability account.'
  }
];

export const reverseGstCalculatorContent: ToolContent = {
  whatIsThis: {
    overview: 'The Reverse GST Calculator is a dedicated accounting utility engineered to perform tax extraction and backward pricing analysis. It allows users to feed in a final gross, tax-inclusive price and separate it into the original net base cost and the exact GST components. The utility instantly computes both local state splits (CGST + SGST) and national levies (IGST) to ensure complete audit compliance.',
    whyExists: 'In retail and B2C commercial activities, prices are traditionally listed as "all-inclusive" to avoid customer confusion. However, for internal corporate bookkeeping, filing tax returns, and auditing vendor accounts, businesses must record base prices and tax liabilities separately. This tool automates the reverse math, preventing rounding errors and saving teams from manual, formulaic computations.',
    realWorldUseCases: [
      'Vendor Invoice Reconciliation: Extract the pre-tax base cost of raw supplies from an all-inclusive receipt for accounting entry.',
      'Checking Supplier Accuracy: Verify that a contractor did not miscalculate the tax portion they included in their invoice.',
      'Retail Inventory Costing: Calculate the base manufacturing cost of a store item that retails at a set customer price.',
      'Claiming Input Tax Credit: Isolate the exact tax paid on business expenses to claim refunds from tax authorities.',
      'Filing Business Income Taxes: Separate raw revenues from collected taxes for calculating corporate tax brackets.'
    ],
    whoShouldUse: [
      'Accountants and Bookkeepers: To split retail bills and enter base prices into tax ledgers.',
      'B2C Business Owners: To determine their actual profit margins after deducting government taxes from sales.',
      'Procurement Teams: To evaluate supplier rates and compare B2B exclusive proposals with inclusive bids.',
      'Auditors: To check the accuracy of transactions and find discrepancies in company balance sheets.',
      'Everyday Consumers: To find out how much tax they are paying on their daily purchases.'
    ],
    benefits: [
      'Browser-Isolated Computation: All financial numbers are processed client-side. No invoice details are transmitted to external servers.',
      'Precision Extraction Math: Employs double-precision arithmetic to ensure that base pricing matches official tax filings.',
      'Flexible Slab Support: Handles all standard Indian slabs (5%, 12%, 18%, 28%) and custom tax rates instantly.',
      'Granular Breakdown: Clear visual division of CGST, SGST, and IGST for state and interstate billing entries.'
    ]
  },
  howToUseSteps: [
    'Enter the Total Invoice Amount: Input the final, tax-inclusive billing price that you wish to split.',
    'Select the GST Rate: Click on the standard tax percentage slab or type in a custom rate.',
    'Review the Results Table: Instantly view the extracted Net Base Price, total GST amount, CGST, SGST, and IGST.',
    'Use for Bookkeeping: Click the copy icon next to any parameter to transfer the values into your accounting software.'
  ],
  workedExamples: [
    {
      title: 'Restaurant Bill Split (12% Inclusive GST)',
      scenario: 'A dining invoice total is ₹3,360, which includes 12% GST. The customer wants to know the pre-tax cost.',
      calculation: 'Total = ₹3,360. Base = ₹3,360 / (1 + 12 / 100) = ₹3,360 / 1.12 = ₹3,000. GST = ₹3,360 − ₹3,000 = ₹360. Split = ₹180 CGST and ₹180 SGST.',
      result: 'Net Price: ₹3,000 | CGST: ₹180 | SGST: ₹180 | Total: ₹3,360'
    },
    {
      title: 'Buying a Laptop (18% Inclusive GST)',
      scenario: 'A company buys a laptop for ₹59,000 inclusive of 18% GST to claim input tax credits.',
      calculation: 'Total = ₹59,000. Base = ₹59,000 / 1.18 = ₹50,000. GST = ₹59,000 − ₹50,000 = ₹9,000.',
      result: 'Base Price: ₹50,000 | ITC Claimable GST: ₹9,000 | Total: ₹59,000'
    },
    {
      title: 'Luxury Watch Purchase (28% Inclusive GST)',
      scenario: 'A collector purchases a premium watch for ₹1,28,000 inclusive of 28% luxury GST.',
      calculation: 'Total = ₹1,28,000. Base = ₹1,28,000 / 1.28 = ₹1,00,000. GST = ₹1,28,000 − ₹1,00,000 = ₹28,000.',
      result: 'Base Price: ₹1,00,000 | GST Paid: ₹28,000 | Total: ₹1,28,000'
    },
    {
      title: 'Consulting Contract from Out of State (18% Inclusive GST)',
      scenario: 'An agency receives an all-inclusive project payment of ₹1,77,000 from an interstate client.',
      calculation: 'Total = ₹1,77,000. Base = ₹1,77,000 / 1.18 = ₹1,50,000. Integrated Tax (IGST) = ₹1,77,000 − ₹1,50,000 = ₹27,000.',
      result: 'Base revenue: ₹1,50,000 | IGST liability: ₹27,000 | Total: ₹1,77,000'
    },
    {
      title: 'Basic Machinery Purchase (5% Inclusive GST)',
      scenario: 'A workshop buys small tools for ₹10,500 inclusive of 5% GST.',
      calculation: 'Total = ₹10,500. Base = ₹10,500 / 1.05 = ₹10,000. GST = ₹10,500 − ₹10,000 = ₹500.',
      result: 'Base Price: ₹10,000 | GST Paid: ₹500 | Total: ₹10,500'
    }
  ],
  formulaDetails: {
    equation: `Base Price = Total Price / (1 + (GST Rate / 100))
GST Amount = Total Price − Base Price

Intrastate Transaction Split:
CGST = SGST = GST Amount / 2

Interstate Transaction:
IGST = GST Amount`,
    explanation: 'Reverse GST calculation mathematically scales down the gross invoice. Since the gross price is equal to Base × (1 + Rate), dividing the gross by (1 + Rate) yields the exact original Base. Subtracting this from the gross isolates the tax portion.',
    variables: [
      { name: 'Total Price', description: 'The gross amount paid or billed (inclusive of taxes).' },
      { name: 'Base Price', description: 'The net cost of the item before tax was applied.' },
      { name: 'GST Rate', description: 'The percentage rate applied to the goods or services.' },
      { name: 'GST Amount', description: 'The extracted tax value.' },
      { name: 'CGST / SGST', description: 'Central and State taxes, representing a 50/50 split of the extracted local tax.' },
      { name: 'IGST', description: 'Integrated tax, representing the full tax portion for interstate sales.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Subtracting Rate directly from Total',
      mistake: 'Multiplying the total price by the tax rate and subtracting it (e.g., calculating 18% of ₹118 as ₹21.24, and stating the base is ₹96.76).',
      correction: 'This is mathematically incorrect. The base is ₹118 / 1.18 = ₹100, and the actual tax is ₹18.'
    },
    {
      title: 'Rounding individual entries early',
      mistake: 'Rounding off intermediate values which leads to final totals that do not match the invoice cash values.',
      correction: 'Keep double-precision decimals throughout the calculation and round only the final displayed results.'
    }
  ],
  tips: [
    'Always use the reverse calculation when logging business expenses to ensure your expense ledger only records pre-tax costs.',
    'Isolate the GST portion in a separate account in your bookkeeping system to make it easy to claim Input Tax Credit.',
    'Double-check that the vendor did not apply different rates to different items on the same invoice before performing bulk calculations.'
  ]
};
