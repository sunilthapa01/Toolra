'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Icons from '@/components/Icons';
import AnimatedIndianAmount from '@/components/AnimatedIndianAmount';
import { formatExactIndianCurrency } from '@/utils/currency';
import { incomeTaxCalculatorArticles, Article } from '@/tools/content/income-tax-calculator-india';

// Import local JSON configs
import slabs2024_25 from './tax-slabs/2024-25.json';
import slabs2025_26 from './tax-slabs/2025-26.json';
import slabs2026_27 from './tax-slabs/2026-27.json';

// Custom standard inline SVG icons
const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PrinterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const yearConfigs: Record<string, any> = {
  '2024-25': slabs2024_25,
  '2025-26': slabs2025_26,
  '2026-27': slabs2026_27,
};

function useCountUp(target: number, duration: number = 300) {
  const [count, setCount] = useState(target);
  useEffect(() => {
    const start = count;
    const end = target;
    if (start === end) return;
    const range = end - start;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(start + range * progress);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target]);
  return count;
}

export default function IncomeTaxCalculator() {
  // Persistent State keys
  const [financialYear, setFinancialYear] = useState<string>('2025-26');
  const [taxRegime, setTaxRegime] = useState<'compare' | 'old' | 'new'>('compare');
  const [ageGroup, setAgeGroup] = useState<'standard' | 'senior' | 'superSenior'>('standard');
  const [isSalaried, setIsSalaried] = useState<boolean>(true);

  // Income Inputs
  const [salary, setSalary] = useState<number>(1200000);
  const [bonus, setBonus] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [businessIncome, setBusinessIncome] = useState<number>(0);
  const [capitalGains, setCapitalGains] = useState<number>(0);

  // Deductions Inputs (Old Regime)
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [deduction80D, setDeduction80D] = useState<number>(25000);
  const [deduction80CCD, setDeduction80CCD] = useState<number>(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [ltaExemption, setLTAExemption] = useState<number>(0);
  const [professionalTax, setProfessionalTax] = useState<number>(2500);
  const [educationLoanInterest, setEducationLoanInterest] = useState<number>(0);
  const [donations80G, setDonations80G] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // HRA Exemption Helper State
  const [isHraHelperOpen, setIsHraHelperOpen] = useState(false);
  const [hraHelperBasic, setHraHelperBasic] = useState<number>(500000);
  const [hraHelperReceived, setHraHelperReceived] = useState<number>(200000);
  const [hraHelperRent, setHraHelperRent] = useState<number>(180000);
  const [hraHelperMetro, setHraHelperMetro] = useState<boolean>(false);

  // Article Reader State
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('what-is-income-tax');

  // UI state
  const [activeTab, setActiveTab] = useState<'calc' | 'deductions' | 'visuals' | 'guide'>('calc');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('toolora_income_tax_inputs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.financialYear) setFinancialYear(parsed.financialYear);
          if (parsed.taxRegime) setTaxRegime(parsed.taxRegime);
          if (parsed.ageGroup) setAgeGroup(parsed.ageGroup);
          if (parsed.isSalaried !== undefined) setIsSalaried(parsed.isSalaried);
          if (parsed.salary !== undefined) setSalary(parsed.salary);
          if (parsed.bonus !== undefined) setBonus(parsed.bonus);
          if (parsed.otherIncome !== undefined) setOtherIncome(parsed.otherIncome);
          if (parsed.businessIncome !== undefined) setBusinessIncome(parsed.businessIncome);
          if (parsed.capitalGains !== undefined) setCapitalGains(parsed.capitalGains);
          if (parsed.deduction80C !== undefined) setDeduction80C(parsed.deduction80C);
          if (parsed.deduction80D !== undefined) setDeduction80D(parsed.deduction80D);
          if (parsed.deduction80CCD !== undefined) setDeduction80CCD(parsed.deduction80CCD);
          if (parsed.homeLoanInterest !== undefined) setHomeLoanInterest(parsed.homeLoanInterest);
          if (parsed.hraExemption !== undefined) setHraExemption(parsed.hraExemption);
          if (parsed.ltaExemption !== undefined) setLTAExemption(parsed.ltaExemption);
          if (parsed.professionalTax !== undefined) setProfessionalTax(parsed.professionalTax);
          if (parsed.educationLoanInterest !== undefined) setEducationLoanInterest(parsed.educationLoanInterest);
          if (parsed.donations80G !== undefined) setDonations80G(parsed.donations80G);
          if (parsed.otherDeductions !== undefined) setOtherDeductions(parsed.otherDeductions);
        }
      } catch (e) {
        console.error('Failed to load local storage inputs', e);
      }
    }
  }, []);

  // Save to LocalStorage on input change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const inputs = {
        financialYear,
        taxRegime,
        ageGroup,
        isSalaried,
        salary,
        bonus,
        otherIncome,
        businessIncome,
        capitalGains,
        deduction80C,
        deduction80D,
        deduction80CCD,
        homeLoanInterest,
        hraExemption,
        ltaExemption,
        professionalTax,
        educationLoanInterest,
        donations80G,
        otherDeductions,
      };
      localStorage.setItem('toolora_income_tax_inputs', JSON.stringify(inputs));
    }
  }, [
    financialYear,
    taxRegime,
    ageGroup,
    isSalaried,
    salary,
    bonus,
    otherIncome,
    businessIncome,
    capitalGains,
    deduction80C,
    deduction80D,
    deduction80CCD,
    homeLoanInterest,
    hraExemption,
    ltaExemption,
    professionalTax,
    educationLoanInterest,
    donations80G,
    otherDeductions,
  ]);

  // Load URL Params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSalary = params.get('salary');
      if (urlSalary) setSalary(Math.max(0, parseFloat(urlSalary) || 0));
      const urlFY = params.get('fy');
      if (urlFY && yearConfigs[urlFY]) setFinancialYear(urlFY);
      const urlRegime = params.get('regime');
      if (urlRegime && ['compare', 'old', 'new'].includes(urlRegime)) {
        setTaxRegime(urlRegime as any);
      }
    }
  }, []);

  // ----------------------------------------
  // Calculation Logic
  // ----------------------------------------
  const config = yearConfigs[financialYear] || slabs2025_26;

  // Gross Income
  const grossIncome = salary + bonus + otherIncome + businessIncome + capitalGains;

  // Cap functions in accordance with Indian Law
  const cap80C = Math.min(150000, Math.max(0, deduction80C));
  const cap80D = Math.min(100000, Math.max(0, deduction80D)); // Maximum possible deduction with senior parents is 100k
  const cap80CCD = Math.min(50000, Math.max(0, deduction80CCD)); // NPS Tier 1
  const capHomeLoanInterest = Math.min(200000, Math.max(0, homeLoanInterest));

  // Deductions Summary
  const standardDeductionOld = isSalaried ? config.oldRegime.standardDeduction : 0;
  const standardDeductionNew = isSalaried ? config.newRegime.standardDeduction : 0;

  const totalDeductionsOld =
    standardDeductionOld +
    cap80C +
    cap80D +
    cap80CCD +
    capHomeLoanInterest +
    Math.max(0, hraExemption) +
    Math.max(0, ltaExemption) +
    Math.max(0, professionalTax) +
    Math.max(0, educationLoanInterest) +
    Math.max(0, donations80G) +
    Math.max(0, otherDeductions);

  const taxableIncomeOld = Math.max(0, grossIncome - totalDeductionsOld);
  const taxableIncomeNew = Math.max(0, grossIncome - standardDeductionNew);

  // Slabs retrieval for Old regime (based on age group)
  const oldRegimeSlabsList =
    config.oldRegime.slabs[ageGroup] || config.oldRegime.slabs.standard;

  // Calculate Tax details helper
  const calculateDetailedTax = (
    taxableIncome: number,
    slabs: any[],
    rebateLimit: number,
    maxRebate: number,
    surchargesConfig: any[],
    isNewRegime: boolean
  ) => {
    // 1. progressive slab taxes
    let slabTax = 0;
    const slabBreakdowns: Array<{ min: number; max: number | null; rate: number; taxAmount: number; taxableInSlab: number }> = [];

    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const slabMax = slab.max === null ? Infinity : slab.max;
        const taxableInSlab = Math.min(taxableIncome, slabMax) - slab.min;
        const taxAmount = taxableInSlab * slab.rate;
        slabTax += taxAmount;
        slabBreakdowns.push({
          min: slab.min,
          max: slab.max,
          rate: slab.rate,
          taxAmount,
          taxableInSlab,
        });
      } else {
        slabBreakdowns.push({
          min: slab.min,
          max: slab.max,
          rate: slab.rate,
          taxAmount: 0,
          taxableInSlab: 0,
        });
      }
    }

    // 2. Section 87A rebate
    let rebate = 0;
    let hasMarginalRebate = false;

    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(slabTax, maxRebate);
    } else if (isNewRegime) {
      // New Regime Section 87A Marginal Rebate (Budget 24/25 provision)
      // If income exceeds limit, tax is capped at excess income over limit.
      const excessIncome = taxableIncome - rebateLimit;
      if (slabTax > excessIncome) {
        rebate = slabTax - excessIncome;
        hasMarginalRebate = true;
      }
    }

    const taxAfterRebate = Math.max(0, slabTax - rebate);

    // 3. Surcharges & Surcharge Marginal Relief
    let surchargeAmount = 0;
    let activeSurchargeRate = 0;
    let activeThreshold = 0;
    let surchargeRelief = 0;

    for (let i = surchargesConfig.length - 1; i >= 0; i--) {
      if (taxableIncome > surchargesConfig[i].threshold) {
        activeSurchargeRate = surchargesConfig[i].rate;
        activeThreshold = surchargesConfig[i].threshold;
        break;
      }
    }

    if (activeSurchargeRate > 0) {
      surchargeAmount = taxAfterRebate * activeSurchargeRate;

      // Surcharge Marginal Relief logic:
      // Tax at the threshold limit:
      const taxAtLimitResult = calculateDetailedTaxRaw(
        activeThreshold,
        slabs,
        rebateLimit,
        maxRebate,
        surchargesConfig,
        isNewRegime
      );

      const excessIncomeOverThreshold = taxableIncome - activeThreshold;
      const maxAllowedTaxAndSurcharge = taxAtLimitResult.taxAfterRebate + taxAtLimitResult.surchargeAmount + excessIncomeOverThreshold;
      const currentTaxAndSurcharge = taxAfterRebate + surchargeAmount;

      if (currentTaxAndSurcharge > maxAllowedTaxAndSurcharge) {
        surchargeRelief = currentTaxAndSurcharge - maxAllowedTaxAndSurcharge;
        surchargeAmount = Math.max(0, surchargeAmount - surchargeRelief);
      }
    }

    const taxBeforeCess = taxAfterRebate + surchargeAmount;
    const cess = taxBeforeCess * config.cessRate;
    const totalTax = taxBeforeCess + cess;

    return {
      slabTax,
      rebate,
      hasMarginalRebate,
      taxAfterRebate,
      surchargeRate: activeSurchargeRate,
      surchargeAmount,
      surchargeRelief,
      cess,
      totalTax,
      slabBreakdowns,
    };
  };

  // Raw calculator to prevent infinite recursion in relief feedback
  const calculateDetailedTaxRaw = (
    taxableIncome: number,
    slabs: any[],
    rebateLimit: number,
    maxRebate: number,
    surchargesConfig: any[],
    isNewRegime: boolean
  ) => {
    let slabTax = 0;
    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const slabMax = slab.max === null ? Infinity : slab.max;
        slabTax += (Math.min(taxableIncome, slabMax) - slab.min) * slab.rate;
      }
    }
    let rebate = 0;
    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(slabTax, maxRebate);
    } else if (isNewRegime) {
      const excessIncome = taxableIncome - rebateLimit;
      if (slabTax > excessIncome) {
        rebate = slabTax - excessIncome;
      }
    }
    const taxAfterRebate = Math.max(0, slabTax - rebate);

    let surchargeAmount = 0;
    let activeSurchargeRate = 0;
    for (let i = surchargesConfig.length - 1; i >= 0; i--) {
      if (taxableIncome > surchargesConfig[i].threshold) {
        activeSurchargeRate = surchargesConfig[i].rate;
        break;
      }
    }
    if (activeSurchargeRate > 0) {
      surchargeAmount = taxAfterRebate * activeSurchargeRate;
    }

    return { taxAfterRebate, surchargeAmount };
  };

  const oldRegimeResults = calculateDetailedTax(
    taxableIncomeOld,
    oldRegimeSlabsList,
    config.oldRegime.rebateLimit,
    config.oldRegime.maxRebate,
    config.oldRegime.surcharges,
    false
  );

  const newRegimeResults = calculateDetailedTax(
    taxableIncomeNew,
    config.newRegime.slabs,
    config.newRegime.rebateLimit,
    config.newRegime.maxRebate,
    config.newRegime.surcharges,
    true
  );

  // Determine Optimal Regime
  const isNewBetter = newRegimeResults.totalTax < oldRegimeResults.totalTax;
  const taxSavings = Math.abs(oldRegimeResults.totalTax - newRegimeResults.totalTax);
  const recommendedRegimeName = isNewBetter ? 'New Tax Regime' : 'Old Tax Regime';
  const optimalTax = isNewBetter ? newRegimeResults.totalTax : oldRegimeResults.totalTax;

  // Active regime parameters based on selection tab
  const activeRegimeKey = taxRegime === 'compare' ? (isNewBetter ? 'new' : 'old') : taxRegime;
  const activeRegimeResults = activeRegimeKey === 'new' ? newRegimeResults : oldRegimeResults;
  const activeTaxableIncome = activeRegimeKey === 'new' ? taxableIncomeNew : taxableIncomeOld;

  // CountUp animations for results
  const animatedGross = useCountUp(grossIncome);
  const animatedTaxable = useCountUp(activeTaxableIncome);
  const animatedSlabTax = useCountUp(activeRegimeResults.slabTax);
  const animatedRebate = useCountUp(activeRegimeResults.rebate);
  const animatedSurcharge = useCountUp(activeRegimeResults.surchargeAmount);
  const animatedCess = useCountUp(activeRegimeResults.cess);
  const animatedTotalTax = useCountUp(activeRegimeResults.totalTax);
  const animatedNetIncome = useCountUp(Math.max(0, grossIncome - activeRegimeResults.totalTax));

  // HRA Exemption Modal actions
  const applyHraExemption = () => {
    // 3 HRA criteria minimum:
    // 1. Actual HRA
    // 2. Rent Paid - 10% of Basic
    // 3. 50% basic (metro) / 40% (non-metro)
    const crit1 = hraHelperReceived;
    const crit2 = Math.max(0, hraHelperRent - 0.1 * hraHelperBasic);
    const crit3 = hraHelperBasic * (hraHelperMetro ? 0.5 : 0.4);
    const calculatedExemption = Math.min(crit1, crit2, crit3);

    setHraExemption(Math.round(calculatedExemption));
    setIsHraHelperOpen(false);
  };

  // Preset Incomes
  const presetIncomes = [500000, 1000000, 1500000, 2500000, 5000000];

  const copyToClipboard = () => {
    const summaryText = `Toolora Income Tax Calculation Summary (India)
Financial Year: FY ${financialYear} | Category: ${ageGroup === 'standard' ? 'Under 60' : ageGroup === 'senior' ? 'Senior (60-80)' : 'Super Senior (80+)'}
Gross Annual Income: ${formatExactIndianCurrency(grossIncome)}
--------------------------------------------------
OLD TAX REGIME:
- Total Deductions claimed: ${formatExactIndianCurrency(totalDeductionsOld)}
- Net Taxable Income: ${formatExactIndianCurrency(taxableIncomeOld)}
- Estimated Tax Payable: ${formatExactIndianCurrency(oldRegimeResults.totalTax)}

NEW TAX REGIME:
- Standard Deduction: ${formatExactIndianCurrency(standardDeductionNew)}
- Net Taxable Income: ${formatExactIndianCurrency(taxableIncomeNew)}
- Estimated Tax Payable: ${formatExactIndianCurrency(newRegimeResults.totalTax)}
--------------------------------------------------
RECOMMENDED REGIME: ${recommendedRegimeName}
Estimated Net Savings: ${formatExactIndianCurrency(taxSavings)}
Calculated securely at: Toolora.com`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResult = () => {
    const shareLink = typeof window !== 'undefined'
      ? `${window.location.origin}/income-tax?salary=${salary}&fy=${financialYear}&regime=${taxRegime}`
      : '';
    navigator.clipboard.writeText(shareLink);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const triggerPrint = () => {
    window.print();
  };

  // Export CSV
  const downloadCSV = () => {
    const rows = [
      ['Tax Item', 'Old Tax Regime (₹)', 'New Tax Regime (₹)'],
      ['Gross Income', grossIncome, grossIncome],
      ['Standard Deduction', standardDeductionOld, standardDeductionNew],
      ['Investments (80C)', cap80C, 0],
      ['Medical Premium (80D)', cap80D, 0],
      ['NPS Contribution (80CCD)', cap80CCD, 0],
      ['Home Loan Interest (24b)', capHomeLoanInterest, 0],
      ['HRA Exemption', hraExemption, 0],
      ['Other Exemptions/Deductions', totalDeductionsOld - standardDeductionOld - cap80C - cap80D - cap80CCD - capHomeLoanInterest - hraExemption, 0],
      ['Net Taxable Income', taxableIncomeOld, taxableIncomeNew],
      ['Slab-calculated Tax', oldRegimeResults.slabTax, newRegimeResults.slabTax],
      ['Section 87A Rebate', oldRegimeResults.rebate, newRegimeResults.rebate],
      ['Surcharges', oldRegimeResults.surchargeAmount, newRegimeResults.surchargeAmount],
      ['Health & Education Cess (4%)', oldRegimeResults.cess, newRegimeResults.cess],
      ['Total Tax Payable', oldRegimeResults.totalTax, newRegimeResults.totalTax],
      ['Net Take-Home Income', grossIncome - oldRegimeResults.totalTax, grossIncome - newRegimeResults.totalTax],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Toolora_IncomeTax_${financialYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find active article
  const activeArticle = incomeTaxCalculatorArticles.find(a => a.slug === selectedArticleSlug) || incomeTaxCalculatorArticles[0];

  return (
    <div className="space-y-8 relative">
      
      {/* Segmented Sub-Navigation for Tabs */}
      <div className="flex border-b border-border/80 overflow-x-auto pb-px scrollbar-none print:hidden">
        <button
          onClick={() => setActiveTab('calc')}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'calc' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Icons.Calculator className="h-4.5 w-4.5" />
          <span>Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('deductions')}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'deductions' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <BookmarkIcon className="h-4.5 w-4.5" />
          <span>Old Regime Deductions</span>
        </button>
        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'visuals' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <TrendingUpIcon className="h-4.5 w-4.5" />
          <span>Slab Visualizer</span>
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'guide' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <BookOpenIcon className="h-4.5 w-4.5" />
          <span>Tax Guide Book</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COMPONENT: Input Panels */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          {/* Main Calculator Form */}
          {activeTab === 'calc' && (
            <div className="space-y-6">
              
              {/* Preset Salary templates */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Quick Gross Salary Presets</span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {presetIncomes.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSalary(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-outfit border whitespace-nowrap transition-all ${
                        salary === preset
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                          : 'border-border bg-card text-foreground hover:bg-secondary/40'
                      }`}
                    >
                      {formatExactIndianCurrency(preset).split('.')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Financial Year Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Financial Year (FY)</span>
                <div className="grid grid-cols-3 gap-2 bg-card border border-border p-1 rounded-2xl shadow-premium-sm">
                  {Object.keys(yearConfigs).map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setFinancialYear(yr)}
                      className={`py-2 text-[11px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                        financialYear === yr ? 'text-primary-foreground bg-primary' : 'text-muted hover:text-foreground'
                      }`}
                    >
                      FY {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regime Mode Switcher */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Tax Regime Preference</span>
                <div className="grid grid-cols-3 gap-1 bg-card border border-border p-1 rounded-2xl shadow-premium-sm">
                  <button
                    onClick={() => setTaxRegime('compare')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      taxRegime === 'compare' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Compare Both
                  </button>
                  <button
                    onClick={() => setTaxRegime('old')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      taxRegime === 'old' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Old Regime
                  </button>
                  <button
                    onClick={() => setTaxRegime('new')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      taxRegime === 'new' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    New Regime
                  </button>
                </div>
              </div>

              {/* Age Group Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Taxpayer Age Group (Old Regime Slabs)</span>
                <div className="grid grid-cols-3 gap-1 bg-card border border-border p-1 rounded-2xl shadow-premium-sm">
                  <button
                    onClick={() => setAgeGroup('standard')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      ageGroup === 'standard' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    &lt; 60 Years
                  </button>
                  <button
                    onClick={() => setAgeGroup('senior')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      ageGroup === 'senior' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    60–80 Years
                  </button>
                  <button
                    onClick={() => setAgeGroup('superSenior')}
                    className={`py-2 text-[10px] font-black uppercase tracking-wider text-center transition-all rounded-xl ${
                      ageGroup === 'superSenior' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    80+ Years
                  </button>
                </div>
              </div>

              {/* Employment Toggle */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-premium-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">Salaried Employee?</span>
                  <p className="text-[10px] text-muted/70">Applies standard deduction ({formatExactIndianCurrency(standardDeductionNew).split('.')[0]} New / {formatExactIndianCurrency(standardDeductionOld).split('.')[0]} Old)</p>
                </div>
                <button
                  onClick={() => setIsSalaried(!isSalaried)}
                  className={`w-11 h-6 rounded-full p-1 transition-all ${isSalaried ? 'bg-emerald-500' : 'bg-muted'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${isSalaried ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Income Sliders & Inputs */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Annual Base Salary</span>
                    <span className="text-sm font-bold font-mono-calc text-emerald-600 dark:text-emerald-400">
                      {formatExactIndianCurrency(salary)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={salary}
                    onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                    className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex items-center mt-3 border-t border-border/40 pt-3">
                    <span className="text-muted text-xs mr-2 font-bold select-none">₹</span>
                    <input
                      type="number"
                      value={salary === 0 ? '' : salary}
                      onChange={(e) => setSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="block w-full border-0 bg-transparent p-0 text-sm font-semibold text-foreground focus:ring-0 outline-none"
                      placeholder="Enter base salary"
                    />
                  </div>
                </div>

                {/* Additional Income Fields */}
                <div className="bg-card border border-border rounded-3xl p-5 space-y-4 shadow-premium-md">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block border-b border-border/40 pb-2">Other Income Streams</span>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Bonus & Commissions</label>
                      <div className="flex items-center bg-secondary/30 border border-border rounded-xl px-3 py-2">
                        <span className="text-xs text-muted mr-1">₹</span>
                        <input
                          type="number"
                          value={bonus === 0 ? '' : bonus}
                          onChange={(e) => setBonus(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full border-0 bg-transparent p-0 text-xs font-semibold focus:ring-0 outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Business Profits</label>
                      <div className="flex items-center bg-secondary/30 border border-border rounded-xl px-3 py-2">
                        <span className="text-xs text-muted mr-1">₹</span>
                        <input
                          type="number"
                          value={businessIncome === 0 ? '' : businessIncome}
                          onChange={(e) => setBusinessIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full border-0 bg-transparent p-0 text-xs font-semibold focus:ring-0 outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Rental/FD Interest</label>
                      <div className="flex items-center bg-secondary/30 border border-border rounded-xl px-3 py-2">
                        <span className="text-xs text-muted mr-1">₹</span>
                        <input
                          type="number"
                          value={otherIncome === 0 ? '' : otherIncome}
                          onChange={(e) => setOtherIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full border-0 bg-transparent p-0 text-xs font-semibold focus:ring-0 outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Capital Gains (Eq/Gold)</label>
                      <div className="flex items-center bg-secondary/30 border border-border rounded-xl px-3 py-2">
                        <span className="text-xs text-muted mr-1">₹</span>
                        <input
                          type="number"
                          value={capitalGains === 0 ? '' : capitalGains}
                          onChange={(e) => setCapitalGains(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full border-0 bg-transparent p-0 text-xs font-semibold focus:ring-0 outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Old Regime Deductions Panel */}
          {activeTab === 'deductions' && (
            <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-premium-lg">
              
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted block">Investments & Deductions</span>
                <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded">Old Regime Only</span>
              </div>

              {/* 80C Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">Section 80C (PPF/ELSS/EPF)</span>
                  <span className={deduction80C > 150000 ? 'text-amber-500 font-mono-calc' : 'text-foreground font-mono-calc'}>
                    {formatExactIndianCurrency(cap80C)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={deduction80C}
                  onChange={(e) => setDeduction80C(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                {deduction80C > 150000 && (
                  <p className="text-[9px] text-amber-600 font-semibold">Capped at legal limit of ₹1,50,000.</p>
                )}
              </div>

              {/* 80D Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">Section 80D (Health Insurance)</span>
                  <span className="text-foreground font-mono-calc">{formatExactIndianCurrency(cap80D)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={deduction80D}
                  onChange={(e) => setDeduction80D(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* 80CCD NPS Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">Section 80CCD(1B) (Voluntary NPS)</span>
                  <span className="text-foreground font-mono-calc">{formatExactIndianCurrency(cap80CCD)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={deduction80CCD}
                  onChange={(e) => setDeduction80CCD(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                {deduction80CCD > 50000 && (
                  <p className="text-[9px] text-amber-600 font-semibold">Capped at legal limit of ₹50,000.</p>
                )}
              </div>

              {/* Home Loan Interest Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">Section 24(b) (Home Loan Interest)</span>
                  <span className="text-foreground font-mono-calc">{formatExactIndianCurrency(capHomeLoanInterest)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="10000"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                {homeLoanInterest > 200000 && (
                  <p className="text-[9px] text-amber-600 font-semibold">Capped at ₹2,00,000 for self-occupied property.</p>
                )}
              </div>

              {/* HRA Exemption Exemption with helper */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">HRA Exemption (Section 10)</span>
                  <span className="text-foreground font-mono-calc">{formatExactIndianCurrency(hraExemption)}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={hraExemption === 0 ? '' : hraExemption}
                    onChange={(e) => setHraExemption(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                    placeholder="Enter HRA exemption"
                  />
                  <button
                    onClick={() => setIsHraHelperOpen(true)}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 whitespace-nowrap"
                  >
                    HRA Helper
                  </button>
                </div>
              </div>

              {/* Other Deductions Block */}
              <div className="border-t border-border/40 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Professional Tax</label>
                  <input
                    type="number"
                    value={professionalTax === 0 ? '' : professionalTax}
                    onChange={(e) => setProfessionalTax(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">LTA Exemption</label>
                  <input
                    type="number"
                    value={ltaExemption === 0 ? '' : ltaExemption}
                    onChange={(e) => setLTAExemption(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Education Loan Interest</label>
                  <input
                    type="number"
                    value={educationLoanInterest === 0 ? '' : educationLoanInterest}
                    onChange={(e) => setEducationLoanInterest(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">80G Donations</label>
                  <input
                    type="number"
                    value={donations80G === 0 ? '' : donations80G}
                    onChange={(e) => setDonations80G(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Slab Visualizer info header */}
          {activeTab === 'visuals' && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Slab Visualizer Mode</span>
              <p className="text-xs text-muted leading-relaxed">
                The right panel displays a graphical breakdown of how your taxable income maps into progressive slabs. Slabs differ greatly between the Old and New regime configurations.
              </p>
            </div>
          )}

          {/* Guide Selector Panel */}
          {activeTab === 'guide' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-premium-lg space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block border-b border-border/40 pb-2">Articles Directory</span>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {incomeTaxCalculatorArticles.map((article) => {
                  const isSelected = selectedArticleSlug === article.slug;
                  return (
                    <button
                      key={article.slug}
                      onClick={() => setSelectedArticleSlug(article.slug)}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-transparent text-foreground hover:bg-secondary/40'
                      }`}
                    >
                      <div className="text-xs font-bold mb-0.5">{article.title}</div>
                      <div className="flex justify-between items-center text-[9px] text-muted">
                        <span>{article.summary}</span>
                        <span className="font-semibold whitespace-nowrap ml-2">{article.readTime}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COMPONENT: Calculation Receipt & Comparison */}
        <div className="lg:col-span-7 space-y-6">

          {/* Optimal Recommendation Banner */}
          {taxRegime === 'compare' && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 text-white rounded-3xl p-6 shadow-premium-lg flex items-center justify-between print:bg-none print:bg-white print:text-foreground print:border print:border-border">
              <div className="space-y-1">
                <span className="text-[9px] font-black bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit print:border print:border-border print:text-black">
                  Recommended Choice
                </span>
                <h4 className="text-lg font-black font-outfit">
                  {taxSavings === 0 ? "Both regimes yield equal tax" : `Use the ${recommendedRegimeName}`}
                </h4>
                <p className="text-xs text-emerald-50/90 leading-relaxed print:text-muted">
                  {taxSavings === 0 
                    ? "Your tax liability is exactly the same under both the Old and New tax regimes."
                    : `Based on your profile, the ${recommendedRegimeName} reduces your tax liability by ${formatExactIndianCurrency(taxSavings)} annually.`
                  }
                </p>
              </div>
              {taxSavings > 0 && (
                <div className="text-right whitespace-nowrap pl-4 hidden sm:block">
                  <div className="text-[10px] uppercase font-bold opacity-80">Annual Savings</div>
                  <div className="text-2xl font-black font-mono-calc">
                    {formatExactIndianCurrency(taxSavings).split('.')[0]}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Tab Panels */}
          {activeTab !== 'guide' ? (
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-premium-lg relative overflow-hidden print:shadow-none print:border-0 print:p-0">
              
              {/* Printable Header */}
              <div className="hidden print:flex items-center justify-between border-b border-border/80 pb-6 mb-6">
                <div>
                  <h1 className="text-2xl font-black">Toolora Financial Ledger</h1>
                  <p className="text-xs text-muted">Income Tax Computation Sheet (India) — FY {financialYear}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold">Recommended Regime: {recommendedRegimeName}</div>
                  <div className="text-xs text-muted">Savings: {formatExactIndianCurrency(taxSavings)}</div>
                </div>
              </div>

              {/* Header metadata */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4 print:hidden">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded uppercase tracking-wider">
                    {activeRegimeKey === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} Summary
                  </span>
                  <div className="text-[10px] text-muted font-bold uppercase tracking-wider pt-1">
                    Computed for {ageGroup === 'standard' ? 'Individual < 60 yrs' : ageGroup === 'senior' ? 'Senior Citizen' : 'Super Senior Citizen'}
                  </div>
                </div>
                <Icons.Calculator className="h-5 w-5 text-primary" />
              </div>

              {/* Main Total Tax Display */}
              <div className="space-y-1">
                <AnimatedIndianAmount
                  value={animatedTotalTax}
                  label="Estimated Annual Tax Payable"
                  sizeClass="text-3xl sm:text-4xl md:text-5xl font-extrabold"
                  exactSizeClass="text-xs"
                />
                <p className="text-[11px] text-muted/80 leading-normal pt-1">
                  <strong>Explanation:</strong> Based on a gross income of {formatExactIndianCurrency(grossIncome).split('.')[0]}, your estimated annual income tax is {formatExactIndianCurrency(activeRegimeResults.totalTax).split('.')[0]} under the {activeRegimeKey === 'new' ? 'New Regime' : 'Old Regime'}.
                  {activeRegimeResults.hasMarginalRebate && " (Includes Section 87A Marginal Rebate relief)"}
                </p>
              </div>

              {/* Visual Split Bar (Tax vs Take-home) */}
              <div className="space-y-2 pt-2 print:hidden">
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${grossIncome > 0 ? (Math.max(0, grossIncome - activeRegimeResults.totalTax) / grossIncome) * 100 : 100}%` }}
                    className="h-full bg-foreground/20 dark:bg-foreground/10 transition-all duration-300"
                  />
                  <div
                    style={{ width: `${grossIncome > 0 ? (activeRegimeResults.totalTax / grossIncome) * 100 : 0}%` }}
                    className="h-full bg-primary transition-all duration-300"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
                  <span>Net Take-home: {grossIncome > 0 ? ((Math.max(0, grossIncome - activeRegimeResults.totalTax) / grossIncome) * 100).toFixed(1) : 100}%</span>
                  <span>Tax & Cess: {grossIncome > 0 ? ((activeRegimeResults.totalTax / grossIncome) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>

              {/* Dashed line spacer */}
              <div className="border-t border-dashed border-border my-4" />

              {/* Slab Visualizer chart (rendered inline if visuals active) */}
              {activeTab === 'visuals' && (
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Progressive Tax Slabs Utilized</span>
                  <div className="space-y-3">
                    {activeRegimeResults.slabBreakdowns.map((bk, i) => {
                      const rangeName = bk.max === null ? `Above ₹${bk.min / 100000} Lakh` : `₹${bk.min / 100000}L to ₹${bk.max / 100000}L`;
                      const slabUtilizationPercentage = bk.max === null 
                        ? (bk.taxableInSlab > 0 ? 100 : 0)
                        : (bk.taxableInSlab / (bk.max - bk.min)) * 100;
                      
                      return (
                        <div key={i} className="space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-muted">
                            <span>{rangeName} ({bk.rate * 100}%)</span>
                            <span>Tax: {formatExactIndianCurrency(bk.taxAmount).split('.')[0]}</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              style={{ width: `${slabUtilizationPercentage}%` }}
                              className={`h-full transition-all duration-500 ${bk.rate === 0 ? 'bg-muted' : 'bg-primary'}`}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-muted/60">
                            <span>Slab width: {bk.max === null ? 'No Limit' : formatExactIndianCurrency(bk.max - bk.min).split('.')[0]}</span>
                            <span>Taxable portion: {formatExactIndianCurrency(bk.taxableInSlab).split('.')[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Side-by-Side Comparison Matrix */}
              {taxRegime === 'compare' && activeTab === 'calc' && (
                <div className="grid grid-cols-2 gap-6 pt-2">
                  
                  {/* Old Regime Card */}
                  <div className="bg-secondary/20 border border-border rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-muted">Old Regime</span>
                      {!isNewBetter && taxSavings > 0 && <span className="text-[8px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">Best</span>}
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-muted">Total Tax</div>
                      <div className="text-xl font-extrabold font-mono-calc">
                        {formatExactIndianCurrency(oldRegimeResults.totalTax).split('.')[0]}
                      </div>
                      <div className="text-[10px] text-muted pt-1">Net Take-Home</div>
                      <div className="text-sm font-semibold font-mono-calc">
                        {formatExactIndianCurrency(Math.max(0, grossIncome - oldRegimeResults.totalTax)).split('.')[0]}
                      </div>
                    </div>
                  </div>

                  {/* New Regime Card */}
                  <div className="bg-secondary/20 border border-border rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center border-b border-border/40 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-muted">New Regime</span>
                      {isNewBetter && taxSavings > 0 && <span className="text-[8px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">Best</span>}
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-muted">Total Tax</div>
                      <div className="text-xl font-extrabold font-mono-calc">
                        {formatExactIndianCurrency(newRegimeResults.totalTax).split('.')[0]}
                      </div>
                      <div className="text-[10px] text-muted pt-1">Net Take-Home</div>
                      <div className="text-sm font-semibold font-mono-calc">
                        {formatExactIndianCurrency(Math.max(0, grossIncome - newRegimeResults.totalTax)).split('.')[0]}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Detailed Financial Ledger Lines */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block border-b border-border/40 pb-2">Computation Ledger</span>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-bold uppercase tracking-wider">Gross Total Annual Income</span>
                    <span className="font-extrabold font-mono-calc">{formatExactIndianCurrency(animatedGross)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted font-bold uppercase tracking-wider">Total Claims &amp; Deductions</span>
                    <span className="font-bold font-mono-calc text-emerald-600 dark:text-emerald-400">
                      -{formatExactIndianCurrency(activeRegimeKey === 'new' ? standardDeductionNew : totalDeductionsOld)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-border/40 pt-2">
                    <span className="text-muted font-black uppercase tracking-widest">Net Taxable Income</span>
                    <span className="font-extrabold font-mono-calc text-base">{formatExactIndianCurrency(animatedTaxable)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted font-bold uppercase tracking-wider">Slab-calculated Tax</span>
                    <span className="font-semibold font-mono-calc">{formatExactIndianCurrency(animatedSlabTax)}</span>
                  </div>

                  {activeRegimeResults.rebate > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                      <span className="font-bold uppercase tracking-wider">Section 87A Tax Rebate</span>
                      <span className="font-bold font-mono-calc">-{formatExactIndianCurrency(animatedRebate)}</span>
                    </div>
                  )}

                  {activeRegimeResults.surchargeAmount > 0 && (
                    <div className="flex justify-between items-center text-red-500">
                      <span className="font-bold uppercase tracking-wider">Surcharges ({activeRegimeResults.surchargeRate * 100}%)</span>
                      <span className="font-bold font-mono-calc">+{formatExactIndianCurrency(animatedSurcharge)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted font-bold uppercase tracking-wider">Health &amp; Education Cess (4%)</span>
                    <span className="font-semibold font-mono-calc">+{formatExactIndianCurrency(animatedCess)}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-border/40 pt-3">
                    <span className="text-xs font-black uppercase tracking-widest text-muted">Net Take-Home (After Tax)</span>
                    <span className="font-black font-mono-calc text-lg text-emerald-600 dark:text-emerald-400">{formatExactIndianCurrency(animatedNetIncome)}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Tab 4: Guide Book Reader */
            <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-premium-lg">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-muted">Article Viewer</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{activeArticle.readTime}</span>
              </div>
              <h2 className="text-xl font-black font-outfit text-foreground">{activeArticle.title}</h2>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-xs text-muted leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: activeArticle.content
                    .replace(/## (.*)/g, '<h3 class="text-sm font-black uppercase tracking-wider text-foreground pt-4">$1</h3>')
                    .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
                    .replace(/\* (.*)/g, '<li class="ml-4 list-disc">$1</li>')
                    .replace(/\| (.*) \|/g, '<div class="grid grid-cols-3 gap-2 py-1">$1</div>')
                }}
              />
            </div>
          )}

          {/* Export Toolbar (Copy, PDF/Print, CSV, Share) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 bg-foreground text-background py-3.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-premium-sm active:scale-[0.98]"
            >
              {copied ? <Icons.Check className="h-4 w-4" /> : <Icons.Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={triggerPrint}
              className="flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-premium-sm active:scale-[0.98]"
            >
              <PrinterIcon className="h-4 w-4" />
              <span>Print Ledger</span>
            </button>

            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-premium-sm active:scale-[0.98]"
            >
              <Icons.Download className="h-4 w-4" />
              <span>CSV Ledger</span>
            </button>

            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3.5 rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-premium-sm active:scale-[0.98]"
            >
              {shared ? <Icons.Check className="h-4 w-4" /> : <Icons.Share2 className="h-4 w-4" />}
              <span>{shared ? 'Shared' : 'Share'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ----------------------------------------
          HRA EXEMPTION HELPER MODAL
          ---------------------------------------- */}
      {isHraHelperOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-premium-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-xs font-black uppercase tracking-widest text-muted">HRA Exemption Helper</span>
              <button
                onClick={() => setIsHraHelperOpen(false)}
                className="text-muted hover:text-foreground p-1 rounded"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[10px] text-muted leading-relaxed">
              Section 10(13A) HRA exemption is evaluated as the lowest of: actual HRA, rent minus 10% of basic, and metro/non-metro limits.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Annual Basic Salary (+ DA)</label>
                <input
                  type="number"
                  value={hraHelperBasic}
                  onChange={(e) => setHraHelperBasic(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Annual HRA Received</label>
                <input
                  type="number"
                  value={hraHelperReceived}
                  onChange={(e) => setHraHelperReceived(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Annual Rent Paid</label>
                <input
                  type="number"
                  value={hraHelperRent}
                  onChange={(e) => setHraHelperRent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-muted">Do you live in a Metro City?</span>
                <button
                  onClick={() => setHraHelperMetro(!hraHelperMetro)}
                  className={`w-11 h-6 rounded-full p-1 transition-all ${hraHelperMetro ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all transform ${hraHelperMetro ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border/40">
              <button
                onClick={() => setIsHraHelperOpen(false)}
                className="flex-1 border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={applyHraExemption}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
              >
                Apply Exemption
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
