import { ToolContent, FAQItem } from '../types';

export interface Article {
  slug: string;
  title: string;
  readTime: string;
  summary: string;
  content: string;
}

export const incomeTaxCalculatorFaqs: FAQItem[] = [
  {
    question: 'How is income tax calculated in India?',
    answer: 'Income tax is calculated based on your total gross income minus applicable deductions and exemptions. The remaining net taxable income is taxed under progressive slabs. The final tax liability includes the slab-calculated tax, less any Section 87A rebate, plus 4% Health and Education Cess, and applicable surcharges for high incomes.'
  },
  {
    question: 'Which tax regime is better: Old or New?',
    answer: 'It depends on your investments and deductions. If you pay rent (HRA), have a home loan, invest in PPF/ELSS, and buy health insurance, the Old Regime might save you more. If you prefer not to lock funds in tax-saving instruments and have an income up to ₹12.75 lakh, the New Regime is generally better due to lower rates and a high rebate.'
  },
  {
    question: 'Can I change my tax regime every year?',
    answer: 'Yes, if you are a salaried individual or have no business income, you can switch between the Old and New tax regimes every year at the time of filing your ITR. However, if you have business or professional income, you can only switch back to the Old Regime once in a lifetime after opting for the New Regime.'
  },
  {
    question: 'What is taxable income?',
    answer: 'Taxable income is the net amount on which income tax is levied. It is calculated by subtracting eligible exemptions (like HRA, LTA) and deductions (under Section 80C, 80D, etc.) from your Gross Total Income.'
  },
  {
    question: 'How does HRA exemption work?',
    answer: 'HRA exemption is calculated under Section 10(13A) as the minimum of three values: 1) Actual HRA received from your employer, 2) Rent paid minus 10% of Basic Salary + DA, or 3) 50% of Basic Salary (in metro cities) or 40% (in non-metro cities). You can only claim this if you live in a rented house and pay rent.'
  },
  {
    question: 'What is the Standard Deduction?',
    answer: 'Standard Deduction is a flat deduction allowed from your gross salary income without requiring any investment proof or expense receipts. For FY 2024-25 and FY 2025-26, it is ₹75,000 under the New Tax Regime and ₹50,000 under the Old Tax Regime.'
  },
  {
    question: 'What is the Health & Education Cess?',
    answer: 'Cess is an additional tax levied on top of your calculated income tax to fund health and education initiatives of the government. In India, it is currently 4% of your total income tax liability (before adding cess, but after applying rebates).'
  },
  {
    question: 'How accurate is this Income Tax Calculator?',
    answer: 'Our calculator is highly accurate and implements the exact mathematical tax slabs and rebate rules outlined by the Income Tax Department of India. However, it does not constitute formal tax advice. You should verify your results against the official e-filing portal before submitting returns.'
  },
  {
    question: 'Does this calculator support freelancers and business owners?',
    answer: 'Yes. You can enter your income under the "Business/Professional Income" field. Note that business owners do not qualify for the standard deduction (which is only for salaried individuals) unless they also draw a salary.'
  },
  {
    question: 'Can I download a PDF tax report?',
    answer: 'Yes. Our calculator includes a "Download PDF" button that generates a professionally formatted tax ledger. This report is clean and optimized for print, listing your income, deductions, slab rates, and final tax under both regimes.'
  },
  {
    question: 'Does this calculator use the latest slabs for FY 2025-26?',
    answer: 'Yes, this calculator is fully updated with the latest tax slabs introduced in the Union Budget 2025 (affecting FY 2025-26 / AY 2026-27), including the new ₹4L-₹8L-₹12L slabs under the New Regime.'
  },
  {
    question: 'What is Section 87A rebate?',
    answer: 'Section 87A rebate is a tax relief for taxpayers with income below certain thresholds. Under the New Regime (FY 2025-26), individuals with taxable income up to ₹12 lakh pay zero tax due to a rebate of up to ₹60,000. Under the Old Regime, the rebate applies to incomes up to ₹5 lakh (up to ₹12,500 rebate).'
  },
  {
    question: 'What happens if my income exceeds the rebate limit by ₹1,000?',
    answer: 'If your income exceeds the Section 87A rebate threshold (e.g., ₹12,01,000 under the New Regime), the rebate becomes zero under the strict rules, and you are taxed on the entire income according to the slabs. This is called the "cliff effect," although marginal relief rules apply in some scenarios.'
  },
  {
    question: 'What is the difference between Financial Year (FY) and Assessment Year (AY)?',
    answer: 'Financial Year (FY) is the year in which you earn your income (e.g., April 1, 2025, to March 31, 2026). Assessment Year (AY) is the following year in which your income is evaluated, and you file your tax returns (e.g., April 1, 2026, to March 31, 2027).'
  },
  {
    question: 'What is the maximum limit for Section 80C deductions?',
    answer: 'The maximum limit under Section 80C is ₹1,50,000 per financial year. This cap applies to all eligible investments combined, including PPF, EPF, ELSS, National Savings Certificates (NSC), school tuition fees, and home loan principal repayments.'
  },
  {
    question: 'What deductions are allowed under Section 80D?',
    answer: 'Section 80D allows deductions for health insurance premiums. You can claim up to ₹25,000 for self, spouse, and children, plus an additional ₹25,000 for parents under 60. If parents are senior citizens (60+), the limit for parents rises to ₹50,000 (making a maximum possible deduction of ₹75,000 or ₹1,00,000 if self is also senior).'
  },
  {
    question: 'How do I claim tax benefit on Home Loan Interest?',
    answer: 'Under the Old Tax Regime, you can deduct up to ₹2,00,000 per year from your taxable income for interest paid on a home loan for a self-occupied property, under Section 24(b). If the property is let out, there is no upper limit on the interest deduction, but net loss under house property is capped at ₹2,00,000.'
  },
  {
    question: 'What is Section 80CCD(1B) for NPS?',
    answer: 'Section 80CCD(1B) offers an additional deduction of up to ₹50,000 for voluntary contributions to the National Pension Scheme (NPS) Tier-I account. This is over and above the ₹1,50,000 limit of Section 80C, and is only available under the Old Tax Regime.'
  },
  {
    question: 'Are capital gains taxable under both regimes?',
    answer: 'Yes, capital gains (short-term and long-term) are taxed at special rates (e.g., 12.5% for LTCG on equities as per latest budget) under both regimes. Basic slab exemptions do not apply to capital gains, which are computed separately.'
  },
  {
    question: 'What is Professional Tax?',
    answer: 'Professional Tax is a state-level tax levied on salaried employees. Employers deduct it monthly and remit it to the state government. Under the Old Regime, you can claim the full amount paid (usually up to ₹2,500) as a deduction under Section 16(iii).'
  },
  {
    question: 'Can I claim LTA (Leave Travel Allowance) in the New Regime?',
    answer: 'No. LTA exemption, which covers travel expenses for domestic holidays with family, is only available under the Old Tax Regime under Section 10(5). It is completely blocked in the New Tax Regime.'
  },
  {
    question: 'What is the surcharge rate for high earners?',
    answer: 'Surcharge is an additional tax on high incomes. Under the New Regime: 10% on tax if income is ₹50L-₹1Cr, 15% if ₹1Cr-₹2Cr, and 25% if above ₹2Cr. Under the Old Regime, the surcharge rates are: 10% for ₹50L-₹1Cr, 15% for ₹1Cr-₹2Cr, 25% for ₹2Cr-₹5Cr, and 37% for above ₹5Cr.'
  },
  {
    question: 'Can I deduct education loan interest?',
    answer: 'Yes. Under Section 80E, you can deduct the entire interest paid on an education loan taken for higher studies for yourself, your spouse, or your children. There is no upper limit on the deduction, and it is available for up to 8 years.'
  },
  {
    question: 'What happens if I do not file my ITR on time?',
    answer: 'Filing ITR after the deadline (typically July 31st) attracts late fees under Section 234F (up to ₹5,000, or ₹1,000 if income is below ₹5 lakh). You will also owe interest on unpaid taxes and cannot carry forward capital losses.'
  },
  {
    question: 'How is rental income taxed?',
    answer: 'Rental income is taxed under "Income from House Property." You deduct municipal taxes paid, claim a standard 30% statutory deduction on net annual value for maintenance, and deduct home loan interest under Section 24(b). The net rental income is then added to your taxable income.'
  },
  {
    question: 'What is Section 80G?',
    answer: 'Section 80G allows you to claim tax deductions for donations made to charitable organizations, government relief funds, and scientific research institutions. Deductions are either 50% or 100% of the donated amount, depending on the charity status.'
  },
  {
    question: 'Is interest earned on savings accounts taxable?',
    answer: 'Yes. Under the Old Regime, you can claim a deduction up to ₹10,000 for interest earned on savings accounts under Section 80TTA. For senior citizens, Section 80TTB allows deductions up to ₹50,000 covering savings and fixed deposit interest.'
  },
  {
    question: 'What is form 16?',
    answer: 'Form 16 is a certificate issued by your employer detailing the salary paid, tax deducted at source (TDS), and exemptions claimed during the financial year. It is the primary document used to file your salary tax returns.'
  },
  {
    question: 'Can I save tax under the New Tax Regime?',
    answer: 'The New Regime relies on low slab rates rather than deductions. Apart from the ₹75,000 Standard Deduction and Employer NPS contribution (Section 80CCD(2)), no other investments or deductions can be used to save tax. This makes it simple and eliminates paperwork.'
  },
  {
    question: 'How does this calculator remember my previous entries?',
    answer: 'This calculator saves your inputs locally in your browser\'s local storage. This is completely secure, and your financial data never leaves your device. When you revisit the page, your previously entered salary, deductions, and financial year are restored automatically.'
  }
];


export const incomeTaxCalculatorArticles: Article[] = [
  {
    slug: 'what-is-income-tax',
    title: 'What is Income Tax?',
    readTime: '4 min read',
    summary: 'An introduction to income tax in India, its purposes, collection methods, and how it is governed.',
    content: `## What is Income Tax?

**Income Tax** is a direct tax levied by the government on the annual earnings of individuals, Hindu Undivided Families (HUFs), businesses, firms, and other legal entities. In India, the collection and administration of income tax are governed by the **Income Tax Act of 1961**.

### Why Does the Government Collect Income Tax?

Direct taxes are the primary source of revenue for the state. The funds collected are utilized to:
*   Fund public infrastructure projects (roads, railways, airports).
*   Maintain defense forces and national security.
*   Provide public health, subsidize education, and sponsor social welfare schemes.
*   Run the administrative machinery of the country.

### Who is Liable to Pay Income Tax?

Under the tax laws, anyone who earns an income in India is classified as a **"Person"** and may be liable to pay tax. This includes:
1.  **Individuals**: Salaried employees, freelancers, professionals, and sole proprietors.
2.  **Hindu Undivided Families (HUFs)**.
3.  **Companies & Firms**: Private and public corporations.
4.  **Association of Persons (AOPs) & Body of Individuals (BOIs)**.

### How is Tax Collected?

The Income Tax Department collects revenue through three primary channels:
*   **Tax Deducted at Source (TDS)**: Tax deducted directly from your salary, interest, or professional fees by the payer before disbursal.
*   **Advance Tax**: Quarterly tax payments paid by individuals and businesses whose annual tax liability exceeds ₹10,000.
*   **Self-Assessment Tax**: Tax paid by the taxpayer directly to the government before filing the Income Tax Return (ITR).`
  },
  {
    slug: 'income-tax-slabs-explained',
    title: 'Income Tax Slabs Explained',
    readTime: '4 min read',
    summary: 'Learn how India\'s progressive tax slab system works and how your income is divided and taxed across different brackets.',
    content: `## Income Tax Slabs Explained

India uses a **progressive tax system**, meaning your tax rate increases as your income increases. Rather than taxing your entire income at a single rate, the government divides your income into brackets called **tax slabs**, and each bracket is taxed at its specific rate.

### Progressive Taxation in Action

To understand how slabs work, imagine a taxpayer who has a taxable income of ₹10,00,000 under a hypothetical tax system:
*   Slab 1: Up to ₹3,00,000 - 0% (Nil)
*   Slab 2: ₹3,00,001 to ₹7,00,000 - 5%
*   Slab 3: ₹7,00,001 to ₹10,00,000 - 10%

Many people mistakenly assume that because their income is ₹10,00,000, they will pay 10% on the entire ₹10,00,000 (i.e. ₹1,00,000). This is incorrect. The tax is calculated progressively:
1.  **First Bracket**: You pay ₹0 on the first ₹3,00,000.
2.  **Second Bracket**: You pay 5% on the next ₹4,00,000 (from ₹3,00,001 to ₹7,00,000) = ₹20,000.
3.  **Third Bracket**: You pay 10% on the remaining ₹3,00,000 (from ₹7,00,001 to ₹10,00,000) = ₹30,000.
4.  **Total Tax**: ₹0 + ₹20,000 + ₹30,000 = ₹50,000.

### Slab Adjustments

The government reviews tax slabs annually during the Union Budget. Slabs vary depending on:
*   **Tax Regime Selected**: The Old Tax Regime and the New Tax Regime have completely different slab structures.
*   **Age Groups (Old Regime only)**: Under the Old Regime, slabs are relaxed for senior citizens (ages 60-80) and super senior citizens (ages 80+). under the New Regime, slabs are identical for all age groups.`
  },
  {
    slug: 'old-vs-new-tax-regime',
    title: 'Old vs. New Tax Regime',
    readTime: '5 min read',
    summary: 'A critical comparison of the Old and New tax regimes in India. Learn the pros and cons of both to make the right choice.',
    content: `## Old vs. New Tax Regime

Since 2020, Indian taxpayers have had to choose between two parallel income tax systems: the **Old Tax Regime** and the **New Tax Regime**. The New Tax Regime was made the default tax regime in Budget 2023, featuring lower tax rates but blocking almost all deductions.

### The Old Tax Regime

The Old Regime is designed for savers. It charges higher tax rates but allows you to claim a wide range of deductions and exemptions to reduce your taxable income.

*   **Pros**:
    *   Encourages disciplined saving and investment in long-term instruments like PPF, NPS, and insurance.
    *   Highly beneficial if you pay home loan interest or high house rent (HRA).
*   **Cons**:
    *   Complicated tax filing with heavy documentation requirements.
    *   Requires locking up money in investments to save tax, which can strain short-term liquidity.

### The New Tax Regime

The New Regime is designed for simplicity. It charges lower tax rates and offers wider slabs, but blocks almost all deductions.

*   **Pros**:
    *   Significantly lower tax rates across middle-income ranges.
    *   No tax liability for incomes up to ₹12 Lakh (FY 2025-26) due to high Section 87A rebates.
    *   Simple filing with zero paperwork or investment proof required.
    *   Increases disposable take-home income by eliminating mandatory lock-in savings.
*   **Cons**:
    *   Does not offer tax benefits for investing in PPF, ELSS, or buying health insurance.
    *   Unfavorable for individuals with high rent payouts or active home loans.

### Comparison Table (FY 2025-26)

| Feature | Old Regime | New Regime |
| :--- | :--- | :--- |
| **Default Option** | No | Yes |
| **Max Standard Deduction** | ₹50,000 | ₹75,000 |
| **Section 80C (PPF/ELSS)** | Allowed (up to ₹1.5L) | Blocked |
| **Section 24(b) (Home Loan)** | Allowed (up to ₹2L) | Blocked |
| **HRA Exemption** | Allowed | Blocked |
| **87A Rebate Threshold** | ₹5,00,000 | ₹12,00,000 |`
  },
  {
    slug: 'latest-tax-slabs',
    title: 'Latest Income Tax Slabs',
    readTime: '4 min read',
    summary: 'A detailed look at the latest income tax slabs for the current and upcoming financial years under both regimes.',
    content: `## Latest Income Tax Slabs

This guide presents the official income tax slabs applicable under the Indian tax laws for the Financial Years **2024-25** and **2025-26**.

### 1. New Tax Regime Slabs (FY 2025-26)
Following the updates in the Union Budget 2025, the slabs under the default New Regime are:

*   Up to ₹4,00,000: **Nil**
*   ₹4,00,001 to ₹8,00,000: **5%**
*   ₹8,00,001 to ₹12,00,000: **10%**
*   ₹12,00,001 to ₹16,00,000: **15%**
*   ₹16,00,001 to ₹20,00,000: **20%**
*   ₹20,00,001 to ₹24,00,000: **25%**
*   Above ₹24,00,000: **30%**

*Note: In addition, salaried individuals get a standard deduction of ₹75,000. Under Section 87A, if taxable income is <= ₹12,00,000, you receive a full tax rebate.*

### 2. Old Tax Regime Slabs (All Years)
The Old Regime slabs differ based on the age of the individual.

#### Category A: Individuals under 60 years of age
*   Up to ₹2,50,000: **Nil**
*   ₹2,50,001 to ₹5,00,000: **5%**
*   ₹5,00,001 to ₹10,00,000: **20%**
*   Above ₹10,00,000: **30%**

#### Category B: Senior Citizens (60 to 80 years of age)
*   Up to ₹3,00,000: **Nil**
*   ₹3,00,001 to ₹5,00,000: **5%**
*   ₹5,00,001 to ₹10,00,000: **20%**
*   Above ₹10,00,000: **30%**

#### Category C: Super Senior Citizens (Above 80 years of age)
*   Up to ₹5,00,000: **Nil**
*   ₹5,00,001 to ₹10,00,000: **20%**
*   Above ₹10,00,000: **30%**`
  },
  {
    slug: 'how-income-tax-is-calculated',
    title: 'How Income Tax is Calculated',
    readTime: '5 min read',
    summary: 'A step-by-step breakdown of how your tax liability is calculated from gross salary to the final payable amount.',
    content: `## How Income Tax is Calculated: Step-by-Step

Calculating your income tax liability involves a structured mathematical flow. Here is how you can compute your taxes step-by-step.

### Step 1: Calculate Gross Total Income
Aggregate your earnings from all five heads of income:
1.  **Income from Salary**: Basic pay, allowances, bonuses.
2.  **Income from House Property**: Rental income (minus municipal taxes and standard 30% deduction).
3.  **Profits & Gains of Business or Profession**: Net profits from business or freelancing.
4.  **Capital Gains**: Profits from sale of shares, mutual funds, or gold.
5.  **Income from Other Sources**: Bank savings interest, fixed deposits, dividends.

$$\\text{Gross Total Income} = \\text{Salary} + \\text{House Property} + \\text{Business} + \\text{Capital Gains} + \\text{Other Sources}$$

### Step 2: Deduct Exemptions and Deductions
*   **Exemptions**: Deduct allowances like HRA, LTA, and Professional Tax from your gross salary.
*   **Deductions (Old Regime)**: Subtract eligible savings under Section 80C (PPF, ELSS), Section 80D (health insurance), Section 24(b) (home loan interest), etc.
*   **Standard Deduction**: Deduct ₹75,000 (New Regime) or ₹50,000 (Old Regime) if you are a salaried individual.

$$\\text{Net Taxable Income} = \\text{Gross Total Income} - \\text{Exemptions} - \\text{Deductions}$$

### Step 3: Apply Slab Rates
Apply progressive slab rates to your Net Taxable Income. For example, if taxable income is ₹15,00,000, calculate tax incrementally across the respective slabs.

### Step 4: Apply Rebate (Section 87A)
If your taxable income is below the threshold:
*   Old Regime: Up to ₹5,00,000 (rebate up to ₹12,500).
*   New Regime (FY 2025-26): Up to ₹12,00,000 (rebate up to ₹60,000).
If eligible, your tax liability becomes ₹0.

### Step 5: Add Surcharge and Cess
*   **Surcharge**: If taxable income exceeds ₹50 Lakh, add the applicable surcharge (10% to 37%).
*   **Cess**: Add a flat 4% Health and Education Cess on your net tax (Tax + Surcharge - Rebates).

$$\\text{Final Payable Tax} = (\\text{Slab Tax} + \\text{Surcharge} - \\text{Rebate}) \\times 1.04$$`
  },
  {
    slug: 'standard-deduction-guide',
    title: 'Standard Deduction Guide',
    readTime: '4 min read',
    summary: 'Learn what the standard deduction is, who qualifies, and how it applies under both tax regimes.',
    content: `## Standard Deduction Guide

The **Standard Deduction** is a flat deduction allowed from your gross salary income to reduce your taxable income. It does not require you to submit any investment proofs, rent agreements, or expense receipts to your employer.

### Who is Eligible?

Standard deduction is available to:
*   **Salaried Employees**: Anyone receiving a salary from an employer.
*   **Pensioners**: Senior citizens drawing pensions from previous employers or family pension.

*Note: Self-employed individuals, business owners, and freelancers do not qualify for the standard deduction.*

### Deduction Limits by Regime

*   **New Tax Regime (FY 2024-25 & FY 2025-26)**: The standard deduction is **₹75,000**.
*   **Old Tax Regime**: The standard deduction remains **₹50,000**.

### How is it Applied?

Your employer automatically applies the standard deduction when calculating TDS on your salary. For example, if your gross salary is ₹10,00,000:
*   Under the New Regime, your taxable salary drops to ₹9,25,000.
*   Under the Old Regime, your taxable salary drops to ₹9,50,000.`
  },
  {
    slug: '80c-explained',
    title: 'Section 80C Explained',
    readTime: '5 min read',
    summary: 'A deep dive into Section 80C, its investment options (PPF, ELSS, EPF), and the maximum tax deduction limits.',
    content: `## Section 80C Explained

**Section 80C** of the Income Tax Act is the most popular tax-saving provision in India. It allows taxpayers to reduce their taxable income by investing in specific savings instruments or spending on specific expenses under the Old Tax Regime.

### Maximum Deduction Limit

The maximum cumulative deduction you can claim under Section 80C (along with sub-sections 80CCC and 80CCD(1)) is **₹1,50,000** per financial year. Any investment made beyond this cap does not yield additional tax benefits.

### Key Tax-Saving Options under 80C

Section 80C covers a variety of investment and expense options:

#### 1. Investment Options
*   **Public Provident Fund (PPF)**: A government-backed scheme with a 15-year lock-in. Interest and maturity proceeds are tax-free (EEE status).
*   **Equity Linked Savings Schemes (ELSS)**: Mutual funds that invest in equities, featuring the shortest lock-in period of 3 years.
*   **Employee Provident Fund (EPF)**: Contributions made automatically from your salary.
*   **National Savings Certificates (NSC)**: Fixed-income post office savings certificates with a 5-year lock-in.
*   **Tax Saver Fixed Deposits**: Bank deposits with a 5-year lock-in.
*   **Sukanya Samriddhi Yojana (SSY)**: Savings scheme for the girl child.

#### 2. Eligible Expenses
*   **Home Loan Principal Repayment**: The principal portion of your monthly home loan EMI.
*   **Tuition Fees**: School tuition fees paid for up to two children.
*   **Life Insurance Premium**: Premium paid for self, spouse, or children.

### Key Takeaway

Section 80C deductions are only available under the Old Tax Regime. If you select the New Tax Regime, these deductions are completely blocked.`
  },
  {
    slug: '80d-explained',
    title: 'Section 80D: Health Insurance Deductions',
    readTime: '4 min read',
    summary: 'Understand Section 80D tax deductions for health insurance premiums for self, family, and parents.',
    content: `## Section 80D: Health Insurance Deductions

**Section 80D** allows you to claim tax deductions on the premium paid for health insurance policies for yourself, your spouse, dependent children, and parents. This deduction is only available under the Old Tax Regime.

### Deduction Limits

The amount you can deduct depends on the age of the insured members:

| Insured Group | Age under 60 years | Age 60 years or above (Senior) |
| :--- | :--- | :--- |
| **Self, Spouse, and Children** | Up to ₹25,000 | Up to ₹50,000 |
| **Parents** | Up to ₹25,000 | Up to ₹50,000 |

### Maximum Possible Deductions

*   **Self & Parents under 60**: ₹25,000 + ₹25,000 = **₹50,000**
*   **Self under 60 & Parents senior**: ₹25,000 + ₹50,000 = **₹75,000**
*   **Self senior & Parents senior**: ₹50,000 + ₹50,000 = **₹100,000**

### Other Covered Expenses under Section 80D

*   **Preventive Health Check-up**: You can claim up to ₹5,000 per year for health check-ups within the overall limits.
*   **Medical Expenses for Senior Citizens**: If your parents are senior citizens and do not have health insurance, you can claim deductions up to ₹50,000 for actual medical expenses incurred on their care.`
  },
  {
    slug: 'nps-tax-benefits',
    title: 'NPS (National Pension Scheme) Tax Benefits',
    readTime: '4 min read',
    summary: 'Learn how to claim additional tax benefits up to ₹50,000 under Section 80CCD(1B) by investing in the NPS.',
    content: `## National Pension Scheme (NPS) Tax Benefits

The **National Pension Scheme (NPS)** is a voluntary retirement savings program designed to provide pension security. It offers attractive tax benefits to encourage long-term retirement planning.

### Section-wise NPS Benefits (Old Regime)

You can claim tax deductions for NPS contributions under three separate sections of the Income Tax Act:

#### 1. Section 80CCD(1) - Part of 80C
Your contributions (up to 10% of salary for salaried, or 20% of gross income for self-employed) are tax-deductible. This falls within the overall ₹1,50,000 cap of Section 80C.

#### 2. Section 80CCD(1B) - Additional ₹50,000
You can claim an **additional deduction of up to ₹50,000** for contributions made to your NPS Tier-I account. This deduction is over and above the ₹1,50,000 limit of Section 80C, allowing for a total investment deduction of ₹2,00,000.

#### 3. Section 80CCD(2) - Employer\'s Contribution
Contributions made by your employer to your NPS account (up to 10% of your Basic + DA) are tax-deductible. **Importantly, this deduction is available under both the Old and New tax regimes.**

### Key Takeaway

To maximize tax savings under the Old Regime, consider investing ₹50,000 in NPS under Section 80CCD(1B) after fully exhausting your ₹1.5L Section 80C limit.`
  },
  {
    slug: 'home-loan-tax-benefits',
    title: 'Home Loan Tax Benefits',
    readTime: '5 min read',
    summary: 'A guide to saving tax using home loan interest (Section 24b) and principal repayments (Section 80C).',
    content: `## How to Save Tax Using a Home Loan

Taking a home loan provides substantial tax relief under the Old Tax Regime. You can claim tax benefits for both the **interest** and **principal** components of your monthly EMI.

### 1. Interest Repayment (Section 24b)

You can deduct up to **₹2,00,000** per year from your taxable income for interest paid on a home loan taken for a self-occupied house.
*   **Let-out Property**: If the property is rented, the entire interest paid is deductible. However, any net loss under the head "Income from House Property" that you offset against other income is capped at ₹2,00,000 per year.
*   **Construction Period**: Interest paid during the pre-construction period can be claimed in 5 equal installments starting from the year construction is completed.

### 2. Principal Repayment (Section 80C)

The principal component of your home loan EMI is tax-deductible up to **₹1,50,000** per year.
*   **Condition**: You must not sell the house within 5 years of purchasing it. Doing so will reverse all claimed principal deductions, adding them back to your income in the year of sale.

### 3. Stamp Duty and Registration Charges (Section 80C)

Expenses incurred on stamp duty and registration fees when buying a house can also be claimed as deductions under Section 80C in the year the property is registered.`
  },
  {
    slug: 'hra-exemption-guide',
    title: 'HRA (House Rent Allowance) Exemption Guide',
    readTime: '5 min read',
    summary: 'A detailed look at Section 10(13A) rules and how to calculate your HRA tax exemption accurately.',
    content: `## HRA Exemption Guide: Section 10(13A)

If you are a salaried employee living in a rented house and receive a **House Rent Allowance (HRA)**, you can claim a tax exemption to reduce your taxable income under the Old Tax Regime.

### How is HRA Exemption Calculated?

Under Section 10(13A), your tax exemption is calculated as the **minimum** of the following three values:

1.  **Actual HRA** received from your employer.
2.  **Rent Paid minus 10% of Basic Salary** (+ Dearness Allowance, if applicable).
3.  **50% of Basic Salary** if you live in a metro city (Delhi, Mumbai, Kolkata, Chennai) or **40% of Basic Salary** in non-metro cities.

### Step-by-Step Calculation Example

An employee living in a rented apartment in Bangalore pays ₹15,000 monthly rent.
*   Basic Salary: ₹50,000 per month (₹6,00,000 annual)
*   HRA Received: ₹20,000 per month (₹2,40,000 annual)
*   Rent Paid: ₹15,000 per month (₹1,80,000 annual)

Let\'s calculate the annual exemption:
1.  **Actual HRA**: ₹2,40,000
2.  **Rent Paid - 10% of Basic**: ₹1,80,000 - ₹60,000 = ₹1,20,000
3.  **40% of Basic (Non-Metro)**: ₹2,40,000

The minimum of these values is **₹1,20,000**. Therefore, ₹1,20,000 is tax-exempt, and the remaining ₹1,20,000 of HRA is added to taxable salary.

### Important Conditions to Claim HRA

*   You must actually pay rent and live in the rented property.
*   If your annual rent exceeds ₹1,00,000, you must submit the landlord\'s PAN to your employer to secure the exemption.
*   You cannot claim HRA exemption if you live in a house owned by yourself.`
  },
  {
    slug: 'lta-explained',
    title: 'LTA (Leave Travel Allowance) Explained',
    readTime: '4 min read',
    summary: 'Learn how to claim tax exemption for domestic travel expenses under Section 10(5).',
    content: `## LTA (Leave Travel Allowance) Explained

**Leave Travel Allowance (LTA)** is an exemption provided by employers to cover domestic travel expenses for employees and their families when they are on leave. This exemption is only available under the Old Tax Regime under Section 10(5).

### What Expenses are Exempt?

LTA covers only **actual travel costs** (rail fare, airfare, or bus fare).
*   **Exclusions**: It does not cover hotel stays, meals, sightseeing, or shopping.
*   **Air Travel**: Restricted to economy class airfare of the national carrier via the shortest route.
*   **Rail Travel**: Restricted to AC first-class fare via the shortest route.

### Block Year Rules

You cannot claim LTA every year. The government defines 4-year blocks, and you can claim LTA exemption for **two journeys within a block of four calendar years**.
*   The current active block is **2022 to 2025**.
*   If you do not claim LTA during a block, you can carry forward one journey to the first year of the next block.

### Key Takeaway

LTA exemptions are only valid under the Old Regime. Salaried employees under the New Regime cannot claim LTA tax benefits.`
  },
  {
    slug: 'how-to-save-income-tax-legally',
    title: 'How to Save Income Tax Legally',
    readTime: '5 min read',
    summary: 'A roadmap to tax planning in India. Learn the key investment paths to reduce your tax bill legally.',
    content: `## How to Save Income Tax Legally in India

Reducing your income tax liability requires structured tax planning. By utilizing government-approved deductions and exemptions, you can save tax while building a strong investment portfolio.

### 1. Maximize Section 80C Deductions (up to ₹1.5 Lakh)
Exhaust your Section 80C limit by choosing investments that match your risk appetite:
*   **Risk-Averse**: Invest in PPF (Public Provident Fund) or National Savings Certificates (NSC).
*   **Market-Linked**: Invest in ELSS (Equity Linked Savings Scheme) mutual funds for higher long-term returns.
*   **Protective**: Buy a Life Insurance policy for your family.

### 2. Invest in NPS (additional ₹50,000)
Secure an extra ₹50,000 deduction under Section 80CCD(1B) by contributing to the National Pension Scheme Tier-I. This reduces taxable income beyond Section 80C limits.

### 3. Buy Health Insurance (Section 80D)
Protect your family\'s health while saving tax. Claim up to ₹25,000 for health insurance premiums for self/family, and up to ₹50,000 for senior citizen parents.

### 4. Claim House Rent Allowances (HRA)
If you pay rent, submit your rent agreements and landlord PAN to claim exemptions under Section 10(13A). If you don\'t receive HRA but pay rent, claim deduction under Section 80GG.

### 5. Review the New Tax Regime
Sometimes, the best way to save tax is to stop investing solely for tax purposes. Under the New Tax Regime (FY 2025-26), individuals earning up to ₹12.75 Lakh (including standard deduction) pay zero tax without locking up any funds.`
  },
  {
    slug: 'common-tax-filing-mistakes',
    title: 'Common Tax Filing Mistakes to Avoid',
    readTime: '4 min read',
    summary: 'Avoid interest penalties and defective return notices by steering clear of these common ITR filing mistakes.',
    content: `## Common ITR Filing Mistakes to Avoid

Filing your Income Tax Return (ITR) is an annual compliance requirement. Small errors can trigger tax notices, fee penalties, or delay refunds. Here are the most common mistakes to avoid.

### 1. Choosing the Wrong ITR Form
Using the wrong form (e.g. filing ITR-1 instead of ITR-2 when you hold capital gains) makes your return "defective" and liable for rejection.
*   **ITR-1 (Sahaj)**: For salaried individuals with income up to ₹50 Lakh and single house property.
*   **ITR-2**: For individuals with capital gains, foreign assets, or multiple house properties.
*   **ITR-3 / ITR-4**: For business and professional income.

### 2. Mismatch with Form 26AS and AIS
The Income Tax Department tracks your transactions using the **Annual Information Statement (AIS)** and **Form 26AS** (TDS ledger). Ensure your reported salary, bank interest, and stock trades match these official records exactly.

### 3. Failing to Report Interest Income
Many taxpayers assume that interest earned on savings accounts or fixed deposits is tax-free. You must report all interest income under "Income from Other Sources." Under the Old Regime, you can claim deductions up to ₹10,000 under Section 80TTA.

### 4. Forgetting to Verify the Return
Filing your ITR online is only the first step. You must **e-verify your return within 30 days** of filing (using Aadhaar OTP, net banking, or EVC). If you fail to verify, your return is treated as invalid.

### 5. Missing the Deadline
The filing deadline for individuals is typically **July 31st**. Filing after the deadline attracts late fees under Section 234F (up to ₹5,000) and interest charges under Section 234A on any unpaid taxes.`
  },
  {
    slug: 'tax-planning-tips',
    title: 'Essential Tax Planning Tips',
    readTime: '4 min read',
    summary: 'Discover smart tax planning strategies to optimize your financial structures throughout the year.',
    content: `## Essential Tax Planning Tips

Effective tax planning is a year-round process, not a last-minute scramble in March. Here are tips to optimize your tax liability and build wealth.

### 1. Declare Investments to HR Early
Submit your tax declarations (regime choice, planned investments) to your employer in April. This distributes your TDS deductions evenly over 12 months, avoiding a massive salary cut in January and February.

### 2. Match Investments to Financial Goals
Do not invest in life insurance policies or fixed deposits solely to save tax.
*   If you need capital growth: Choose **ELSS** mutual funds.
*   If you need retirement funds: Choose **NPS** or **PPF**.
*   If you need family safety: Buy a pure **Term Insurance** plan.

### 3. Keep Proper Documentation
Maintain a folder with all tax-saving proofs, including:
*   Rent receipts and landlord PAN card.
*   Home loan interest certificates.
*   Medical insurance receipts.
*   Donation certificates under Section 80G.

### 4. Monitor Capital Gains Tax-Harvesting
If you invest in stocks or mutual funds, you can harvest up to ₹1,25,000 (limit updated in recent budget) in long-term capital gains (LTCG) tax-free every financial year by selling and reinvesting.`
  },
  {
    slug: 'income-tax-return-guide',
    title: 'Income Tax Return Guide',
    readTime: '5 min read',
    summary: 'A step-by-step introduction to filing your Income Tax Return online using the e-filing portal.',
    content: `## A Complete Guide to Filing Your ITR

Filing your Income Tax Return (ITR) is the process of declaring your annual income, deductions, and tax payments to the government. Here is a guide on how to file your ITR.

### Step 1: Gather Your Documents
Collect your Form 16, Form 26AS, AIS (Annual Information Statement), bank interest certificates, and investment receipts.

### Step 2: Register on the E-filing Portal
Go to the official Income Tax e-filing portal (\`incometax.gov.in\`) and register using your PAN, which serves as your User ID.

### Step 3: Choose Online Filing
1.  Log in and go to **e-File > Income Tax Return > File Income Tax Return**.
2.  Select the relevant **Assessment Year** (e.g. AY 2026-27 for income earned in FY 2025-26).
3.  Select filing mode as **Online** and filing status as **Individual**.

### Step 4: Pre-fill and Verify Data
The portal will pre-fill your salary, TDS, and bank details from Form 16 and 26AS. Review each section carefully, add any missing income (such as freelance earnings or interest), and verify your deductions.

### Step 5: Pay Outstanding Tax
If your calculated tax liability exceeds the TDS already deducted, pay the remaining "Self-Assessment Tax" online before submitting your return.

### Step 6: Submit and E-Verify
Submit your return and e-verify it immediately using Aadhaar OTP to complete the filing process.`
  },
  {
    slug: 'documents-required-for-itr',
    title: 'Documents Required for ITR',
    readTime: '4 min read',
    summary: 'A checklist of all essential documents you need to keep ready before filing your tax return.',
    content: `## Checklist: Documents Required to File Your ITR

Having the correct documents on hand before starting your tax filing prevents errors and speeds up the process. Here is a comprehensive checklist.

### 1. General Documents
*   **PAN Card**: Your Permanent Account Number is mandatory for filing.
*   **Aadhaar Card**: Must be linked to your PAN.
*   **Bank Account Details**: Active bank accounts and IFSC codes (required to receive tax refunds).

### 2. Salary-Related Documents
*   **Form 16**: Issued by your employer, detailing salary paid and TDS deducted.
*   **Salary Slips**: Useful to verify monthly allowances.

### 3. Investment and Deduction Proofs (Old Regime)
*   **Section 80C Proofs**: PPF passbooks, ELSS statement, life insurance receipts, school fee receipts.
*   **Section 80D Proof**: Health insurance premium receipts.
*   **Home Loan Certificate**: Interest and principal repayment breakup issued by the bank.
*   **Rent Receipts**: Required to claim HRA exemptions.

### 4. Official Tax Statements
*   **AIS (Annual Information Statement)**: Comprehensive ledger of your financial transactions, savings interest, and share sales.
*   **Form 26AS**: Summary of tax deducted at source (TDS) and tax collected at source (TCS) linked to your PAN.`
  },
  {
    slug: 'who-should-file-itr',
    title: 'Who Should File an ITR?',
    readTime: '4 min read',
    summary: 'Find out if you are legally required to file an income tax return in India, even if you owe no tax.',
    content: `## Who is Legally Required to File ITR?

Filing an Income Tax Return (ITR) is mandatory for individuals who meet specific criteria set by the tax laws. Here is a guide on who must file an ITR.

### 1. Income Exceeds the Basic Exemption Limit
You must file an ITR if your gross total income (before claiming deductions under Section 80C, HRA, etc.) exceeds the basic exemption limit:
*   Under the Old Regime: **₹2,50,000** (for individuals under 60).
*   Under the New Regime: **₹3,00,000** (for FY 2024-25) or **₹4,00,000** (for FY 2025-26).

### 2. High Value Financial Transactions
Even if your income is below the exemption limit, you must file an ITR if you meet any of the following conditions:
*   Paid electricity bills exceeding **₹1,00,000** during the year.
*   Spent more than **₹2,00,000** on foreign travel for yourself or anyone else.
*   Deposited more than **₹1 Crore** in one or more current bank accounts.
*   Business turnover exceeds **₹60 Lakh** or professional receipts exceed **₹10 Lakh**.

### 3. Benefits of Filing ITR (Even with Zero Income)
Filing a Nil ITR (showing income below the taxable limit) is highly recommended because:
*   It serves as official proof of income required for **Visa Applications** and **Home Loan Approvals**.
*   It allows you to claim refunds for any tax deducted at source (TDS) on bank interest.
*   It lets you carry forward capital losses to offset future gains.`
  },
  {
    slug: 'difference-between-fy-and-ay',
    title: 'Difference Between FY and AY',
    readTime: '3 min read',
    summary: 'Clear up the common confusion between Financial Year (FY) and Assessment Year (AY) in Indian taxation.',
    content: `## FY vs. AY: Clearing the Confusion

One of the most common points of confusion for taxpayers is the difference between **Financial Year (FY)** and **Assessment Year (AY)**. Both start on April 1st and end on March 31st, but they serve different roles in the tax cycle.

### Financial Year (FY)
The Financial Year is the year in which you **earn your income**. It is the period of active earnings and investment planning.

*   *Example*: If you earn a salary between April 1, 2025, and March 31, 2026, this period is **FY 2025-26**.

### Assessment Year (AY)
The Assessment Year is the year in which the income earned during the Financial Year is **evaluated, assessed, and taxed**. It is the year in which you file your income tax return (ITR).

*   *Example*: The income earned during FY 2025-26 is assessed and reported in the following year, which is **AY 2026-27**.

### Quick Comparison Table

| Scenario | Financial Year (FY) | Assessment Year (AY) |
| :--- | :--- | :--- |
| **Active Income Earning** | FY 2024-25 | AY 2025-26 |
| **ITR Filing Period** | FY 2025-26 | AY 2026-27 |
| **Tax Slab Selection** | FY 2026-27 | AY 2027-28 |`
  },
  {
    slug: 'salary-components-explained',
    title: 'Salary Components Explained',
    readTime: '4 min read',
    summary: 'Understand the components of your salary structure (Basic, HRA, allowances) and their tax implications.',
    content: `## Deconstructing Your Salary Slip

Your salary slip is divided into multiple components, each carrying different tax rules. Understanding these components helps you negotiate salaries and plan deductions under the Old Tax Regime.

### 1. Basic Salary
Basic salary is the core component of your pay, typically making up 40% to 50% of your Total Cost to Company (CTC).
*   **Tax Rule**: 100% taxable. It also forms the basis for calculating other exemptions like HRA and EPF contributions.

### 2. House Rent Allowance (HRA)
HRA is paid to cover rental housing costs.
*   **Tax Rule**: Tax-exempt up to the limits calculated under Section 10(13A). If you do not live in rented housing, HRA is 100% taxable.

### 3. Special Allowance
A buffer allowance used by employers to cover the remainder of your CTC.
*   **Tax Rule**: 100% taxable.

### 4. Leave Travel Allowance (LTA)
LTA covers domestic travel costs when you are on leave.
*   **Tax Rule**: Exempt under Section 10(5) for two journeys in a block of four years (travel costs only).

### 5. Employee Provident Fund (EPF)
A retirement savings contribution, where 12% of your Basic is deducted monthly.
*   **Tax Rule**: Your contribution qualifies for tax deduction under Section 80C.`
  },
  {
    slug: 'tax-saving-investments',
    title: 'Top Tax-Saving Investments',
    readTime: '5 min read',
    summary: 'Compare the best tax-saving investments in India, evaluating their lock-in periods, returns, and tax status.',
    content: `## Best Tax-Saving Investments in India

To save tax under the Old Tax Regime, you must invest in government-approved tax-saving instruments. Here is a comparison of the top choices.

### 1. Equity Linked Savings Scheme (ELSS)
*   **Lock-in**: 3 Years (Shortest).
*   **Returns**: Market-linked equity returns (historically 12-15%).
*   **Tax Status**: Dividends and capital gains above ₹1.25 Lakh are taxed at 12.5% (LTCG).

### 2. Public Provident Fund (PPF)
*   **Lock-in**: 15 Years (Longest).
*   **Returns**: Government-declared interest (currently ~7.1%).
*   **Tax Status**: Exempt-Exempt-Exempt (EEE). Interest and maturity are 100% tax-free.

### 3. National Pension Scheme (NPS)
*   **Lock-in**: Up to age 60.
*   **Returns**: Market-linked (mix of debt and equity, historically 9-12%).
*   **Tax Status**: Up to 60% of the corpus can be withdrawn tax-free at age 60; the rest must buy an annuity.

### 4. Sukanya Samriddhi Yojana (SSY)
*   **Lock-in**: Until the girl child turns 21 or gets married (after age 18).
*   **Returns**: High government-declared interest (currently ~8.2%).
*   **Tax Status**: Exempt-Exempt-Exempt (EEE).`
  },
  {
    slug: 'section-wise-deduction-guide',
    title: 'Section-wise Deduction Guide',
    readTime: '5 min read',
    summary: 'A reference sheet of all major tax deduction sections of the Income Tax Act under the Old Regime.',
    content: `## Reference Sheet: Income Tax Deductions

This reference guide summarizes the primary deduction sections available to individual taxpayers under the **Old Tax Regime** in India.

### 1. Section 80C (Savings and Expenses)
*   **Limit**: ₹1,50,000
*   **Covers**: PPF, EPF, ELSS, Life Insurance premium, NSC, Principal repayment of home loan, School tuition fees.

### 2. Section 80D (Health Insurance Premium)
*   **Limit**: ₹25,000 (self/family) + ₹25,000/₹50,000 (parents).
*   **Covers**: Health insurance premiums, preventive health check-up (up to ₹5,000).

### 3. Section 80CCD(1B) (Additional NPS)
*   **Limit**: ₹50,000
*   **Covers**: Voluntary contributions to the National Pension Scheme Tier-I account.

### 4. Section 24b (Home Loan Interest)
*   **Limit**: ₹2,00,000
*   **Covers**: Interest paid on home loans for self-occupied property.

### 5. Section 80E (Education Loan Interest)
*   **Limit**: No upper limit (valid for 8 years).
*   **Covers**: Interest paid on loans taken for higher education.

### 6. Section 80G (Charitable Donations)
*   **Limit**: 50% or 100% of donation depending on charity type.
*   **Covers**: Contributions to National Relief Funds, approved NGOs.`
  }
];

export const incomeTaxCalculatorContent: ToolContent = {
  whatIsThis: {
    overview: 'The Income Tax Calculator (India) is an advanced financial engine designed to estimate annual tax liabilities under both the Old and New tax regimes. It incorporates the latest slabs (including Union Budget updates), standard deductions, Section 87A rebates, and high-earner surcharges. It compares both systems side-by-side to recommend the optimal regime for your profile.',
    whyExists: 'Filing taxes in India is complicated by the coexistence of two distinct regimes. The Old Regime offers exemptions (HRA, LTA) and deductions (80C, 80D, Home Loan interest), while the New Regime offers lower tax rates but restricts deductions. This calculator eliminates the guesswork, helping you identify exactly which regime maximizes your take-home pay.',
    realWorldUseCases: [
      'Regime Comparison: Model whether switching to the New Regime saves more money than maintaining investments under the Old Regime.',
      'Deduction Optimization: Run simulations on how investing in PPF, NPS, or medical insurance changes your Old Regime tax burden.',
      'Salary Structuring: Evaluate how changes in Basic, HRA, or special allowances modify tax liabilities.',
      'Refinancing or Home Loan Assessment: See how claiming Section 24(b) home loan interest benefits your tax savings.'
    ],
    whoShouldUse: [
      'Salaried Employees: To compare monthly take-home salaries and submit tax declarations to HR.',
      'Self-Employed Professionals: To compute quarterly advance taxes and check business deductions.',
      'Senior Citizens: To estimate taxes using senior-specific slab advantages under the Old Regime.',
      'Tax Consultants: To quickly model client scenarios and export clean PDF summaries.'
    ],
    benefits: [
      'Instant Comparison: Clear indicators highlighting which regime is cheaper and by how much.',
      'HRA Helper: In-built calculator to automatically compute HRA exemptions using Section 10(13A) rules.',
      '100% Client-Side: Calculations are computed locally in your browser for absolute privacy.',
      'PDF Export: Download clean, professional billing-style reports of your calculations.'
    ]
  },
  howToUseSteps: [
    'Select Financial Year: Choose the target year (e.g. FY 2025-26) to load the appropriate tax slabs.',
    'Enter Income Details: Input your Annual Salary, Bonus, Business Income, and other sources of income.',
    'Salaried Toggle: Indicate whether you are salaried to automatically apply standard deductions (₹75k New / ₹50k Old).',
    'Input Deductions (For Old Regime): Enter your investments under 80C, 80D, NPS, and Home Loan interest.',
    'Analyze Results: Inspect the side-by-side comparison, optimal regime banner, and progressive slab visualizer.',
    'Export and Print: Copy results to clipboard, create shareable links, or print your tax report.'
  ],
  workedExamples: [
    {
      title: 'Salaried Professional (Gross ₹15 Lakh) - FY 2025-26',
      scenario: 'A salaried employee has a gross salary of ₹15,00,000, claims ₹1.5L under 80C, and ₹50k under 80D.',
      calculation: 'New Regime: Taxable Income = 15,00,000 - 75,000 (Standard Deduction) = 14,25,000. Tax is calculated across slabs: 4L @ 0%, 4L @ 5% (20k), 4L @ 10% (40k), 2.25L @ 15% (33,750). Total tax before cess = 93,750. Cess (4%) = 3,750. Net tax = ₹97,500. \nOld Regime: Taxable Income = 15,00,000 - 50,000 (Std Ded) - 1,50,000 (80C) - 50,000 (80D) = 12,50,000. Tax is: 2.5L @ 0%, 2.5L @ 5% (12.5k), 5L @ 20% (100k), 2.5L @ 30% (75k). Total tax before cess = 187,500. Cess = 7,500. Net tax = ₹1,95,000.',
      result: 'Optimal: New Regime | Savings: ₹97,500 | New Regime Tax: ₹97,500 | Old Regime Tax: ₹1,95,000'
    },
    {
      title: 'High Saver (Gross ₹12 Lakh) - FY 2025-26',
      scenario: 'An individual has ₹12,00,000 income, and claims ₹1.5L (80C), ₹50k (80D), ₹50k (NPS), and ₹1.5L (HRA + Home Loan Interest).',
      calculation: 'New Regime: Taxable Income = 12,00,000 - 75,000 = 11,25,000. Since taxable income is <= ₹12,00,000, Section 87A rebate applies, reducing tax to ₹0. \nOld Regime: Taxable Income = 12,00,000 - 50,000 - 1,50,000 - 50,000 - 50,000 - 1,50,000 = 6,50,000. Tax is: 2.5L @ 0%, 2.5L @ 5% (12.5k), 1.5L @ 20% (30k). Total tax before cess = 42,500. Cess = 1,700. Net tax = ₹44,200.',
      result: 'Optimal: New Regime | Savings: ₹44,200 | New Regime Tax: ₹0 | Old Regime Tax: ₹44,200'
    }
  ],
  formulaDetails: {
    equation: `Taxable Income (New) = Gross Salary + Other Income - Standard Deduction (New)
Taxable Income (Old) = Gross Salary + Other Income - Standard Deduction (Old) - Exemptions (HRA/LTA) - Deductions (80C/80D/etc.)

Tax before Cess = Sum of Slab Taxes (computed progressively)
Final Tax = (Tax before Cess - Section 87A Rebate + Surcharge) * 1.04`,
    explanation: 'Income tax is progressive. Income is split into brackets (slabs) and each bracket is taxed at its specific rate. Once the total slab tax is determined, rebates are applied to middle-class incomes, surcharges are added for high earners, and a flat 4% Health and Education Cess is added to the net amount.',
    variables: [
      { name: 'Gross Income', description: 'The sum of all income earned from Salary, Business, House Property, Capital Gains, and Interest.' },
      { name: 'Exemptions & Deductions', description: 'Tax relief provisions (such as Section 80C, 80D, and HRA) that lower the taxable income baseline (primarily under the Old Regime).' },
      { name: 'Section 87A Rebate', description: 'Tax refund that eliminates income tax liability for residents whose net taxable income falls below defined limits.' },
      { name: 'Cess', description: 'A mandatory 4% surtax levied on the payable tax to support primary health and educational programs.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Failing to Account for Standard Deduction',
      mistake: 'Many taxpayers forget to add the standard deduction to their calculation, resulting in an overestimation of their taxable income.',
      correction: 'Salaried individuals automatically receive a standard deduction of ₹75,000 under the New Regime and ₹50,000 under the Old Regime. Self-employed individuals do not qualify.'
    },
    {
      title: 'Assuming 80C applies to the New Regime',
      mistake: 'Locked investments like PPF, NSC, or ELSS are assumed to reduce tax in the New Regime.',
      correction: 'Deductions under Section 80C are completely blocked under the New Regime. If you opt for the New Regime, investments do not reduce tax.'
    },
    {
      title: 'Incorrect HRA Exemption Claims',
      mistake: 'Claiming the entire rent paid as HRA exemption, ignoring the fact that it is subject to statutory limits under Section 10(13A).',
      correction: 'HRA exemption is subject to basic salary percentages and rent thresholds. Use our in-built HRA helper to calculate the exact legal exemption.'
    }
  ],
  tips: [
    'Save Tax Early: If opting for the Old Regime, start tax-saving investments in April. Avoid making hurried investment mistakes in March.',
    'Utilize NPS benefits: Contribute ₹50,000 to NPS under Section 80CCD(1B) for additional tax savings under the Old Regime.',
    'Keep Rent Receipts: Ensure you hold valid rent receipts and rent agreements, along with the landlord\'s PAN if annual rent exceeds ₹1,00,000, to claim HRA exemptions securely.'
  ]
};
