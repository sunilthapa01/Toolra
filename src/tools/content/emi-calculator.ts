import { ToolContent, FAQItem } from '../types';

export const emiCalculatorFaqs: FAQItem[] = [
  {
    question: 'What is an EMI?',
    answer: 'Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are structured to pay off both the interest and the principal balance over the loan tenure.'
  },
  {
    question: 'How is EMI calculated mathematically?',
    answer: 'EMI is calculated using the formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1], where P is the Principal loan amount, r is the monthly interest rate (annual interest rate / 12 / 100), and n is the loan tenure in months.'
  },
  {
    question: 'What is the difference between Flat Interest Rate and Reducing Balance Interest Rate?',
    answer: 'Under a flat rate, interest is calculated on the full initial loan amount throughout the tenure, making it much more expensive. Under a reducing balance rate (standard for most banks), interest is calculated only on the remaining unpaid principal balance each month, meaning your interest portion drops as you pay off the principal.'
  },
  {
    question: 'What is an amortization schedule?',
    answer: 'An amortization schedule is a detailed table showing each monthly payment for a loan, detailing how much of each payment goes toward the principal balance and how much is paid toward interest, along with the outstanding balance after each payment.'
  },
  {
    question: 'How does loan tenure affect my monthly EMI?',
    answer: 'A longer loan tenure spreads the principal repayments over more months, which reduces your monthly EMI amount. However, a longer tenure also means you will pay interest for a longer period, significantly increasing the total interest cost of the loan.'
  },
  {
    question: 'How does the interest rate affect my monthly EMI?',
    answer: 'A higher interest rate increases the monthly interest cost, which directly raises the monthly EMI amount and increases the overall cost of borrowing. A lower rate reduces both the EMI and the total interest paid.'
  },
  {
    question: 'Can I pay off my loan early (prepayment)?',
    answer: 'Yes, most banks allow you to make prepayments (paying extra principal) to reduce your outstanding loan balance. Prepayments help reduce either your future monthly EMI amount or shorten your loan tenure, saving you money on total interest.'
  },
  {
    question: 'Are there charges for prepayment or foreclosure of a loan?',
    answer: 'For floating interest rate loans (like home loans), RBI regulations prohibit banks from charging prepayment or foreclosure fees to individual borrowers. For fixed-rate loans or personal/car loans, banks may charge a prepayment fee (usually 2% to 5% of the prepaid principal).'
  },
  {
    question: 'What is the difference between a Fixed and a Floating interest rate loan?',
    answer: 'A fixed rate remains constant throughout the loan tenure, providing predictable monthly payments. A floating rate changes over time based on market benchmark rates (like Repo Rate or MCLR), meaning your EMI or tenure will fluctuate when rates change.'
  },
  {
    question: 'Does the EMI payment split change over time?',
    answer: 'Yes. In the early months of a loan, most of your EMI goes toward paying off the interest, because the outstanding principal is high. As the principal is gradually paid off, the monthly interest portion drops, and a larger share of the EMI is applied to reducing the principal.'
  },
  {
    question: 'How do I reduce the total interest paid on my loan?',
    answer: 'You can reduce the total interest by: (1) making a larger down payment to borrow less, (2) choosing a shorter loan tenure, (3) making periodic principal prepayments, or (4) transferring your loan to a lender offering a lower interest rate.'
  },
  {
    question: 'What happens if I miss an EMI payment?',
    answer: 'Missing an EMI payment will result in: (1) a late payment fee, (2) interest charged on the overdue amount, (3) a drop in your credit score (CIBIL), and (4) the bank listing the loan as overdue or non-performing if missed repeatedly.'
  },
  {
    question: 'What is a home loan balance transfer?',
    answer: 'A balance transfer is a process where you transfer your outstanding loan balance from your current bank to a new bank that offers a lower interest rate or better terms, helping you reduce your future EMIs and interest costs.'
  },
  {
    question: 'Does our EMI Calculator support home, car, and personal loans?',
    answer: 'Yes. Our EMI Calculator uses standard reducing balance calculations which are applicable to all major retail loans, including home loans, car loans, personal loans, and education loans.'
  },
  {
    question: 'What is the credit score required to get a loan with a low interest rate?',
    answer: 'Lenders generally prefer a credit score (like CIBIL score) of 750 or above. A high score shows that you are a creditworthy borrower, which helps you secure loans quickly and negotiate lower interest rates.'
  }
];

export const emiCalculatorContent: ToolContent = {
  whatIsThis: {
    overview: 'The EMI (Equated Monthly Installment) Calculator is an advanced financial tool designed to compute monthly loan repayment liabilities. It utilizes reducing-balance mathematics to calculate the precise monthly payments for home loans, car loans, and personal loans. Along with the monthly installment, it calculates the total interest payable and provides a complete amortization breakdown to help borrowers budget their debts.',
    whyExists: 'Borrowing is a long-term financial commitment, and understanding the total cost of a loan is crucial for planning. Lenders often highlight low EMI numbers while hiding the cumulative interest charges over long tenures. This utility exists to give borrowers complete transparency, enabling them to compare loan offers and see how changing their tenure or interest rate affects their debt.',
    realWorldUseCases: [
      'Home Purchase Planning: Calculate monthly mortgages and evaluate whether a 15-year or a 30-year tenure fits your cash flow.',
      'Auto Loan Financing: Determine the EMI for a new car and see if a higher down payment is needed to reduce monthly expenses.',
      'Personal Debt Budgeting: Calculate payments for high-interest personal loans or debt consolidation.',
      'Comparing Bank Loan Offers: Input different interest rates and processing fees from multiple banks to find the cheapest option.',
      'Debt Prepayment Strategy: Calculate how making extra principal payments can shorten your loan term and save on interest.'
    ],
    whoShouldUse: [
      'Home Buyers: To calculate mortgage payments and evaluate interest costs.',
      'Car Buyers: To check monthly automobile installments and plan loan tenures.',
      'Salaried Professionals: To plan personal loans and ensure monthly EMIs do not exceed 40% of their net take-home salary.',
      'Financial Planners: To help clients structure debt and choose correct repayment schedules.',
      'Students and Families: To evaluate education loans and payment obligations post-graduation.'
    ],
    benefits: [
      '100% Client-Side Processing: Your loan details (principal, salary estimations) are calculated locally in your browser and never sent to a server.',
      'Amortization Chart: Visually displays the monthly split between interest and principal reduction over the entire loan term.',
      'Instant Calculations: Update any slider (Principal, Interest, or Tenure) and watch the results recalculate immediately.',
      'Total Interest Cost Visualization: Helps you clearly see how much of your total repayment goes to the bank in interest charges.'
    ]
  },
  howToUseSteps: [
    'Input the Loan Principal: Use the slider or type the total amount you want to borrow in the Principal field.',
    'Set the Annual Interest Rate: Enter the annual interest rate offered by the lender (reducing balance rate).',
    'Choose the Loan Tenure: Enter the duration of the loan in years or months.',
    'Analyze the Summary Card: Review your monthly EMI, the total interest payable, and the total payment amount (Principal + Interest).',
    'Examine the Amortization Table: Scroll down to view the year-by-year or month-by-month repayment schedule to see how your loan reduces.'
  ],
  workedExamples: [
    {
      title: 'Personal Loan for Home Renovation',
      scenario: 'A homeowner borrows ₹5,00,000 for a home renovation project at a fixed reducing interest rate of 12% for 3 years.',
      calculation: 'P = ₹5,00,000. Monthly rate r = 12 / 12 / 100 = 0.01. Tenure n = 36 months. EMI = [5,00,000 × 0.01 × (1.01)^36] / [(1.01)^36 − 1] = ₹16,607.15. Total interest = (16,607.15 × 36) − 5,00,000 = ₹97,857.44.',
      result: 'Monthly EMI: ₹16,607 | Total Interest: ₹97,857 | Total Repayment: ₹5,97,857'
    },
    {
      title: 'Car Loan Financing',
      scenario: 'A buyer takes a car loan of ₹8,00,000 at a reducing interest rate of 9% for 5 years.',
      calculation: 'P = ₹8,00,000. Monthly rate r = 9 / 12 / 100 = 0.0075. Tenure n = 60 months. EMI = [8,00,000 × 0.0075 × (1.0075)^60] / [(1.0075)^60 − 1] = ₹16,607.84. Total interest = (16,607.84 × 60) − 8,00,000 = ₹1,96,470.40.',
      result: 'Monthly EMI: ₹16,608 | Total Interest: ₹1,96,470 | Total Repayment: ₹9,96,470'
    },
    {
      title: 'Affordable Home Loan (30 Years)',
      scenario: 'A family purchases a flat, taking a home loan of ₹50,000 at a floating rate of 8.5% for 30 years.',
      calculation: 'P = ₹50,000. Monthly rate r = 8.5 / 12 / 100 = 0.007083. Tenure n = 360 months. EMI = [50,000 × 0.007083 × (1.007083)^360] / [(1.007083)^360 − 1] = ₹384.46. Total interest = (384.46 × 360) − 50,000 = ₹88,405.60.',
      result: 'Monthly EMI: ₹384 | Total Interest: ₹88,406 | Total Repayment: ₹1,38,406'
    },
    {
      title: 'Shorter Home Loan (15 Years)',
      scenario: 'Using the same loan details (₹50,000 at 8.5% interest) but reducing the tenure to 15 years.',
      calculation: 'P = ₹50,000. Monthly rate r = 0.007083. Tenure n = 180 months. EMI = ₹492.42. Total interest = (492.42 × 180) − 50,000 = ₹38,635.60.',
      result: 'Monthly EMI: ₹492 | Total Interest: ₹38,636 | Total Repayment: ₹88,636 (Saves ₹49,770 in interest!)'
    },
    {
      title: 'Education Loan for Higher Studies',
      scenario: 'A student takes an education loan of ₹15,00,000 at 10.5% interest for a 10-year term.',
      calculation: 'P = ₹15,00,000. Monthly rate r = 10.5 / 12 / 100 = 0.00875. Tenure n = 120 months. EMI = [15,00,000 × 0.00875 × (1.00875)^120] / [(1.00875)^120 − 1] = ₹20,229.44. Total interest = (20,229.44 × 120) − 15,00,000 = ₹9,27,532.80.',
      result: 'Monthly EMI: ₹20,229 | Total Interest: ₹9,27,533 | Total Repayment: ₹24,27,533'
    }
  ],
  formulaDetails: {
    equation: `EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]

Where:
P = Principal Loan Amount
r = Monthly Interest Rate = (Annual Rate / 12 / 100)
n = Loan Tenure in Months`,
    explanation: 'The EMI formula calculates the fixed monthly payment needed to amortize a loan over a set term. It accounts for compounding interest each month. The interest portion of the payment decreases as the outstanding principal decreases over time.',
    variables: [
      { name: 'P (Principal)', description: 'The total amount of money borrowed from the lender.' },
      { name: 'r (Monthly Interest Rate)', description: 'The annual interest rate divided by 12 months and divided by 100 to convert to a decimal.' },
      { name: 'n (Tenure in Months)', description: 'The total number of months over which the loan must be repaid.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Comparing Loans by EMI alone',
      mistake: 'Choosing a loan with a lower monthly EMI without checking the tenure, which can lead to paying much more in interest over time.',
      correction: 'Always check the total interest payable and the overall repayment amount. A lower EMI on a longer tenure is often more expensive than a higher EMI on a shorter tenure.'
    },
    {
      title: 'Mixing up Annual and Monthly Interest Rates',
      mistake: 'Using the annual interest rate directly in the formula without dividing by 12.',
      correction: 'Interest is charged monthly. You must divide the annual rate by 12 and by 100 to find the correct monthly interest rate.'
    },
    {
      title: 'Ignoring Prepayment Penalties',
      mistake: 'Assuming that prepayments can be made without any charges on all loans.',
      correction: 'While home loans have zero prepayment charges, personal and car loans often carry fees. Check the lender\'s terms before paying extra principal.'
    }
  ],
  tips: [
    'Aim to keep your total monthly debt payments (including the new EMI) under 35-40% of your net monthly income.',
    'Choose the shortest loan tenure you can afford. This will increase your monthly EMI but significantly reduce your total interest cost.',
    'Use any annual bonuses or windfalls to make prepayments towards your principal balance, which will help you pay off your loan faster.'
  ]
};
