import { ToolContent, FAQItem } from '../types';

export const gstCalculatorFaqs: FAQItem[] = [
  {
    question: 'What is GST (Goods and Services Tax)?',
    answer: 'GST is a multi-stage, destination-based indirect tax levied on the supply of goods and services. It replaced multiple pre-existing indirect taxes (like excise duty, service tax, VAT, and luxury tax) to create a single, unified tax structure across the country.'
  },
  {
    question: 'What is the difference between GST Exclusive and GST Inclusive prices?',
    answer: 'A GST Exclusive price represents the cost of a product or service before taxes are added; tax is calculated as a percentage of this base amount and added to it. A GST Inclusive price represents the final retail price, which already includes the tax amount. To find the actual product cost, the tax must be mathematically extracted.'
  },
  {
    question: 'What are CGST, SGST, and IGST?',
    answer: 'These are the three sub-components of GST. CGST (Central GST) and SGST (State GST) are levied on intrastate sales (transactions within the same state) and are shared equally between the central and state governments. IGST (Integrated GST) is levied on interstate sales (transactions between different states) and is collected by the central government.'
  },
  {
    question: 'How do I calculate GST manually?',
    answer: 'For GST Exclusive: Multiply the base amount by the GST rate (e.g., Base × 0.18 for 18% GST). For GST Inclusive: Divide the total inclusive amount by (1 + GST rate/100) to find the base price, and subtract the base price from the total amount to get the tax portion.'
  },
  {
    question: 'What is the formula to extract GST from a total price?',
    answer: 'The formula is: GST Amount = Total Price − [Total Price / (1 + (GST Rate / 100))]. For example, extracting 18% GST from a total price of ₹1,180: ₹1,180 − [₹1,180 / 1.18] = ₹1,180 − ₹1,000 = ₹180.'
  },
  {
    question: 'What are the current GST tax slabs in India?',
    answer: 'The primary GST tax slabs in India are 5% (essential commodities), 12% (standard items), 18% (most services and manufactured goods), and 28% (luxury and demerit goods). Some items like gold are taxed at 3%, while essential foods and grains are at 0%.'
  },
  {
    question: 'When should I apply IGST instead of CGST/SGST?',
    answer: 'Apply IGST when the supplier and the recipient are located in different states (interstate transaction) or when importing/exporting goods or services. CGST and SGST must be applied when both parties are in the same state (intrastate transaction).'
  },
  {
    question: 'Can a business claim input tax credit (ITC) on all GST paid?',
    answer: 'A registered business can claim Input Tax Credit (ITC) for the GST paid on purchases made for business operations, such as raw materials, machinery, or utilities. However, ITC is blocked for certain items like personal vehicles, food and beverages, and employee membership fees under section 17(5) of the GST Act.'
  },
  {
    question: 'How do I calculate GST on services?',
    answer: 'GST on services is typically charged at 18%. The calculation follows the standard exclusive or inclusive formula based on whether the service fee is agreed upon before tax or as a lump-sum, all-inclusive package.'
  },
  {
    question: 'What is an HSN code under GST?',
    answer: 'HSN (Harmonized System of Nomenclature) is an internationally accepted 6-digit coding system used to classify goods systematically. Under GST, businesses use HSN codes in their invoices to apply the correct GST rate to goods.'
  },
  {
    question: 'What is a SAC code under GST?',
    answer: 'SAC (Services Accounting Code) is a specialized coding system introduced by the government to classify services and determine the applicable tax rate. Similar to HSN codes for goods, SAC codes are required on service invoices.'
  },
  {
    question: 'Who needs to register for GST?',
    answer: 'Businesses with an annual turnover exceeding ₹40 lakhs for goods (₹20 lakhs for hilly and northeastern states) or ₹20 lakhs for services (₹10 lakhs for special category states) must register for GST. Voluntary registration is also allowed and beneficial for claiming Input Tax Credit.'
  },
  {
    question: 'What happens if a business files GST late?',
    answer: 'Filing GST returns late attracts a daily late fee (usually ₹50 per day for normal returns, and ₹20 per day for nil returns) up to a maximum cap. Additionally, interest is charged at 18% per annum on the outstanding tax liability.'
  },
  {
    question: 'What is a Nil GST Return?',
    answer: 'A Nil GST Return is filed when a registered business has had no sales, purchases, or other transactions during a tax period. Filing is still mandatory, and failing to file a Nil return will result in late fees.'
  },
  {
    question: 'What is the difference between B2B and B2C GST invoices?',
    answer: 'A B2B (Business-to-Business) invoice contains the GSTIN (GST Identification Number) of both the seller and the buyer, allowing the buyer to claim Input Tax Credit. A B2C (Business-to-Consumer) invoice only lists the seller\'s GSTIN, as retail consumers cannot claim tax credits.'
  }
];

export const gstCalculatorContent: ToolContent = {
  whatIsThis: {
    overview: 'The Goods and Services Tax (GST) Calculator is an expert-engineered utility designed to compute tax components for commercial transactions. Built for speed and accuracy, this tool supports dual computation modes: GST Exclusive (adding tax to a base price) and GST Inclusive (extracting tax from a total price). It provides complete calculations with granular breakdowns of Central GST (CGST), State GST (SGST), and Integrated GST (IGST) to ensure complete compliance with local billing regulations.',
    whyExists: 'Manual tax calculation is susceptible to mathematical rounding errors and misinterpretations of interstate tax boundaries. This utility exists to streamline invoice preparation, general auditing, and pricing margin estimations. By handling complex back-calculations automatically, it provides instant clarity to business owners, accountants, and retail consumers alike, preventing costly compliance disputes and accounting discrepancies.',
    realWorldUseCases: [
      'Drafting B2B Commercial Invoices: Instantly split taxes into CGST and SGST for local transactions, or IGST for interstate clients.',
      'Retail Price Back-Calculation: Extract the base price of a consumer product from its retail, tax-inclusive price tag.',
      'Margin and Profit Analysis: Determine the net revenue of a service contract after accounting for the outgoing tax liabilities.',
      'Quarterly Tax Auditing: Reconcile purchase ledgers and verify that vendors charged the appropriate tax rates.',
      'Import-Export Costing: Compute the integrated tax portion of cross-border goods entering or leaving domestic ports.'
    ],
    whoShouldUse: [
      'SMEs and Micro-Entrepreneurs: To generate compliant bills and check supplier invoices.',
      'Freelancers and Consultants: To calculate the exact tax to add on top of hourly fees or fixed project rates.',
      'E-commerce Sellers: To set pricing sheets and isolate tax portions from consumer sales data.',
      'Tax Practitioners and Accounts Teams: To verify double-entry bookkeeping ledgers and tax returns.',
      'Daily Shoppers: To understand the hidden taxes included in standard retail products.'
    ],
    benefits: [
      '100% Client-Side Executions: All mathematical calculations are computed inside your browser; no business details or financial values are ever uploaded to a server.',
      'Granular Split Breakdown: Visually separates taxes into dual-state levies (CGST + SGST) and national levies (IGST) in a clear table.',
      'Compliance Ready: Implements standard mathematical rounding principles to match accounting ledgers.',
      'High-Speed Interface: Instant results load with every keystroke, allowing rapid comparison of different tax slabs.'
    ]
  },
  howToUseSteps: [
    'Choose the Calculation Type: Select "Add GST" (Exclusive) if you want to calculate tax on top of a base amount, or "Remove GST" (Inclusive) if you want to extract tax from a total price.',
    'Enter the Principal Amount: Input the monetary value in the primary amount field.',
    'Select the GST Rate: Choose one of the standard tax slabs (5%, 12%, 18%, 28%) or input a custom rate percentage.',
    'Review the Tax Breakdown: Instantly inspect the generated table displaying the Net Price, Total GST, CGST, SGST, IGST, and the Final Gross Price.',
    'Copy Results: Click the copy icon next to any value or the entire summary to paste it directly into your invoice sheet or accounting software.'
  ],
  workedExamples: [
    {
      title: 'Consulting Retainer (GST Exclusive)',
      scenario: 'A freelance developer charges a monthly retainer of ₹75,000 to a client in the same city. The tax rate is 18% (exclusive).',
      calculation: 'Base Amount = ₹75,000. Total GST = ₹75,000 × (18 / 100) = ₹13,500. Intrastate Split = ₹13,500 / 2 = ₹6,750 CGST and ₹6,750 SGST. Total Price = ₹75,000 + ₹13,500.',
      result: 'Net Cost: ₹75,000 | CGST: ₹6,750 | SGST: ₹6,750 | Total Billable: ₹88,500'
    },
    {
      title: 'Retail Electronic Purchase (GST Inclusive)',
      scenario: 'A consumer buys a smartphone for ₹28,000 from an online retailer. The price includes 18% GST. The retailer needs to extract the base cost.',
      calculation: 'Total Price = ₹28,000. Base Price = ₹28,000 / (1 + 18 / 100) = ₹28,000 / 1.18 = ₹23,728.81. GST Amount = ₹28,000 − ₹23,728.81 = ₹4,271.19.',
      result: 'Net Cost: ₹23,728.81 | Total GST Extracted: ₹4,271.19 | Total Price: ₹28,000'
    },
    {
      title: 'Interstate Office Equipment Sale (GST Exclusive)',
      scenario: 'A furniture manufacturer in Maharashtra sells office chairs to a corporate client in Gujarat for ₹1,20,000. The GST rate is 12% (exclusive).',
      calculation: 'Base Amount = ₹1,20,000. Integrated Tax (IGST) = ₹1,20,000 × (12 / 100) = ₹14,400. Being an interstate sale, no CGST/SGST split is applied.',
      result: 'Net Cost: ₹1,20,000 | IGST: ₹14,400 | Total Invoice: ₹1,34,400'
    },
    {
      title: 'Hotel Accommodation Invoice (GST Inclusive)',
      scenario: 'A guest receives an all-inclusive hotel bill of ₹8,960 for a room. The room tariff is taxed at 12% GST.',
      calculation: 'Total Price = ₹8,960. Base Tariff = ₹8,960 / (1 + 12 / 100) = ₹8,960 / 1.12 = ₹8,000. GST Amount = ₹8,960 − ₹8,000 = ₹960. Split = ₹480 CGST and ₹480 SGST.',
      result: 'Net Cost: ₹8,000 | CGST: ₹480 | SGST: ₹480 | Total Price: ₹8,960'
    },
    {
      title: 'Essential Groceries Contract (GST Exclusive)',
      scenario: 'A distributor buys essential grains for ₹45,000 under the 5% GST slab.',
      calculation: 'Base Amount = ₹45,000. Total GST = ₹45,000 × (5 / 100) = ₹2,250. Split = ₹1,125 CGST and ₹1,125 SGST.',
      result: 'Net Cost: ₹45,000 | CGST: ₹1,125 | SGST: ₹1,125 | Total Invoice: ₹47,250'
    }
  ],
  formulaDetails: {
    equation: `GST Exclusive:
GST Amount = Base Price × (GST Rate / 100)
Total Price = Base Price + GST Amount

GST Inclusive:
Base Price = Total Price / (1 + (GST Rate / 100))
GST Amount = Total Price − Base Price

Intrastate Breakdown:
CGST = SGST = GST Amount / 2

Interstate Breakdown:
IGST = GST Amount`,
    explanation: 'The mathematical logic isolates the tax multiplier. When adding tax (Exclusive), we find the tax fraction of the base value. When removing tax (Inclusive), dividing the total by (1 + rate) acts as a reverse scaling factor, leaving the original base amount, from which the tax is easily subtracted.',
    variables: [
      { name: 'Base Price', description: 'The cost of the item before adding tax.' },
      { name: 'Total Price', description: 'The final gross payment amount including tax.' },
      { name: 'GST Rate', description: 'The applicable tax percentage slab (e.g., 5%, 12%, 18%, 28%).' },
      { name: 'GST Amount', description: 'The raw tax value calculated or extracted.' },
      { name: 'CGST', description: 'Central Goods and Services Tax, representing half of the tax for local transactions.' },
      { name: 'SGST', description: 'State Goods and Services Tax, representing the other half of the local tax.' },
      { name: 'IGST', description: 'Integrated Goods and Services Tax, representing the full tax for interstate transactions.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Treating Inclusive Price as Base Price',
      mistake: 'Applying the tax percentage directly to a tax-inclusive retail price (e.g., calculating 18% of ₹1,180 as ₹212.40).',
      correction: 'An inclusive price already holds the tax. You must use the division extraction formula: ₹1,180 / 1.18 = ₹1,000 base cost, resulting in exactly ₹180 tax.'
    },
    {
      title: 'Misapplying Local Splits to Interstate Sales',
      mistake: 'Levying CGST and SGST on transactions occurring across state borders.',
      correction: 'Interstate sales require Integrated GST (IGST) instead of the local central and state split. Always verify the place of supply.'
    },
    {
      title: 'Incorrect Rounding off of Tax Slabs',
      mistake: 'Manually truncating decimal points instead of using standard commercial round-off (IEEE 754 standard).',
      correction: 'Round off numbers to the nearest two decimal places to prevent reconciliation failures when filing tax reports.'
    }
  ],
  tips: [
    'Always match the invoice tax slab with the official classification (HSN for goods and SAC for services).',
    'Display the SGST and CGST values on separate lines in your invoice templates to ensure compliance with local invoicing rules.',
    'Keep records of the place of supply to defend your choice of IGST vs. CGST/SGST in audits.',
    'For export transactions, evaluate if you qualify for zero-rated supply under a Letter of Undertaking (LUT) to avoid upfront GST payments.'
  ]
};
