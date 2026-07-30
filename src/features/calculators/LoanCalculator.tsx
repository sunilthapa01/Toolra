'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from '@/components/Icons';
import { formatCurrency } from '@/utils/currency';
import { loanCalculatorFaqs, loanCalculatorArticles } from '@/tools/content/loan-calculator';

interface AmortizationRow {
  monthNumber: number;
  monthLabel: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'compare' | 'refinance' | 'simulator' | 'articles'>('calculator');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // --- TAB 1: STANDARD CALCULATOR STATES ---
  const [loanType, setLoanType] = useState<'personal' | 'home' | 'car' | 'education' | 'business'>('home');
  const [currency, setCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<number>(250000);
  const [rate, setRate] = useState<number>(6.5);
  const [tenure, setTenure] = useState<number>(30);
  const [isYears, setIsYears] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('2026-07');
  const [compoundFrequency, setCompoundFrequency] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('monthly');
  const [processingFeeType, setProcessingFeeType] = useState<'flat' | 'percentage'>('percentage');
  const [processingFeeValue, setProcessingFeeValue] = useState<number>(1.0);
  const [extraPayment, setExtraPayment] = useState<number>(0);

  // Amortization Table states
  const [tablePageIndex, setTablePageIndex] = useState<number>(0);
  const [tablePageSize, setTablePageSize] = useState<number>(12);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableViewMode, setTableViewMode] = useState<'monthly' | 'yearly'>('yearly');

  // --- TAB 2: COMPARE LOANS STATES ---
  const [compareAmountA, setCompareAmountA] = useState<number>(200000);
  const [compareRateA, setCompareRateA] = useState<number>(6.0);
  const [compareTenureA, setCompareTenureA] = useState<number>(30);
  const [compareIsYearsA, setCompareIsYearsA] = useState<boolean>(true);
  const [compareFeeTypeA, setCompareFeeTypeA] = useState<'flat' | 'percentage'>('percentage');
  const [compareFeeValA, setCompareFeeValA] = useState<number>(1.0);

  const [compareAmountB, setCompareAmountB] = useState<number>(200000);
  const [compareRateB, setCompareRateB] = useState<number>(5.5);
  const [compareTenureB, setCompareTenureB] = useState<number>(30);
  const [compareIsYearsB, setCompareIsYearsB] = useState<boolean>(true);
  const [compareFeeTypeB, setCompareFeeTypeB] = useState<'flat' | 'percentage'>('percentage');
  const [compareFeeValB, setCompareFeeValB] = useState<number>(2.0);

  // --- TAB 3: EXTRA PAYMENT SIMULATOR STATES ---
  const [simMonthlyExtra, setSimMonthlyExtra] = useState<number>(200);
  const [simAnnualExtra, setSimAnnualExtra] = useState<number>(1000);
  const [simAnnualMonth, setSimAnnualMonth] = useState<number>(12); // Apply in December
  const [simLumpSum, setSimLumpSum] = useState<number>(5000);
  const [simLumpSumMonth, setSimLumpSumMonth] = useState<number>(24); // Month 24

  // --- TAB 4: REFINANCING STATES ---
  const [refCurrentBalance, setRefCurrentBalance] = useState<number>(180000);
  const [refCurrentRate, setRefCurrentRate] = useState<number>(7.2);
  const [refRemainingTenure, setRefRemainingTenure] = useState<number>(25);
  const [refIsYearsCurrent, setRefIsYearsCurrent] = useState<boolean>(true);
  
  const [refNewRate, setRefNewRate] = useState<number>(5.8);
  const [refNewTenure, setRefNewTenure] = useState<number>(25);
  const [refIsYearsNew, setRefIsYearsNew] = useState<boolean>(true);
  const [refCosts, setRefCosts] = useState<number>(3000);

  // --- TAB 5: ARTICLES STATES ---
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>(loanCalculatorArticles[0].slug);

  // --- LOAD & SAVE USER VALUE STATES ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('toolora-loan-inputs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.amount) setAmount(parsed.amount);
        if (parsed.rate) setRate(parsed.rate);
        if (parsed.tenure) setTenure(parsed.tenure);
        if (parsed.isYears !== undefined) setIsYears(parsed.isYears);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.loanType) setLoanType(parsed.loanType);
        if (parsed.compoundFrequency) setCompoundFrequency(parsed.compoundFrequency);
      }
    } catch (e) {
      console.error('Failed to load local storage values', e);
    }
  }, []);

  const saveInputs = (updatedFields: Record<string, any>) => {
    try {
      const current = { amount, rate, tenure, isYears, currency, loanType, compoundFrequency, ...updatedFields };
      localStorage.setItem('toolora-loan-inputs', JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
  };

  // --- PARSE URL SEARCH PARAMS ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlAmount = params.get('amount');
      const urlRate = params.get('rate');
      const urlTenure = params.get('tenure');
      const urlCurrency = params.get('currency');
      const urlType = params.get('type');

      if (urlAmount) setAmount(parseFloat(urlAmount));
      if (urlRate) setRate(parseFloat(urlRate));
      if (urlTenure) setTenure(parseFloat(urlTenure));
      if (urlCurrency) setCurrency(urlCurrency);
      if (urlType) setLoanType(urlType as any);
    }
  }, []);

  // --- LOAN TYPE CHANGE DEFAULTS ---
  const handleLoanTypeChange = (type: 'personal' | 'home' | 'car' | 'education' | 'business') => {
    setLoanType(type);
    let defaultAmount = 250000;
    let defaultRate = 6.5;
    let defaultTenure = 30;
    let defaultIsYears = true;

    if (type === 'personal') {
      defaultAmount = 15000;
      defaultRate = 10.5;
      defaultTenure = 3;
    } else if (type === 'car') {
      defaultAmount = 35000;
      defaultRate = 4.8;
      defaultTenure = 5;
    } else if (type === 'education') {
      defaultAmount = 45000;
      defaultRate = 7.5;
      defaultTenure = 10;
    } else if (type === 'business') {
      defaultAmount = 100000;
      defaultRate = 8.2;
      defaultTenure = 7;
    }

    setAmount(defaultAmount);
    setRate(defaultRate);
    setTenure(defaultTenure);
    setIsYears(defaultIsYears);
    saveInputs({ loanType: type, amount: defaultAmount, rate: defaultRate, tenure: defaultTenure, isYears: defaultIsYears });
  };

  // Helper root-finder for APR
  const calculateAPR = (principal: number, fee: number, emi: number, months: number): number => {
    const netDisbursed = principal - fee;
    if (netDisbursed <= 0 || emi <= 0 || months <= 0) return 0;
    
    let low = 0;
    let high = 1.0;
    let mid = 0;
    const tolerance = 1e-7;
    const maxIterations = 100;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      mid = (low + high) / 2;
      let pv = 0;
      if (mid === 0) {
        pv = emi * months;
      } else {
        pv = emi * (1 - Math.pow(1 + mid, -months)) / mid;
      }
      
      if (Math.abs(pv - netDisbursed) < tolerance) {
        break;
      }
      
      if (pv > netDisbursed) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return mid * 12 * 100;
  };

  // --- CORE MATHEMATICAL CALCULATIONS (STANDARD CALCULATOR) ---
  const calculations = useMemo(() => {
    const principal = amount;
    const annualRate = rate;
    const totalMonths = isYears ? tenure * 12 : tenure;
    const R = annualRate / 100;

    let k = 12; // Compounding frequency
    if (compoundFrequency === 'quarterly') k = 4;
    else if (compoundFrequency === 'half-yearly') k = 2;
    else if (compoundFrequency === 'yearly') k = 1;

    // Monthly interest rate adjusted for compounding frequency
    const r_m = R === 0 ? 0 : Math.pow(1 + R / k, k / 12) - 1;

    // Base EMI
    let baseEmi = 0;
    if (totalMonths > 0) {
      if (r_m === 0) {
        baseEmi = principal / totalMonths;
      } else {
        baseEmi = (principal * r_m * Math.pow(1 + r_m, totalMonths)) / (Math.pow(1 + r_m, totalMonths) - 1);
      }
    }

    // Amortization Schedule (Standard & With Extra Payments)
    const baselineSchedule: AmortizationRow[] = [];
    const actualSchedule: AmortizationRow[] = [];
    
    let baseBal = principal;
    let actualBal = principal;
    let baseTotalInterest = 0;
    let actualTotalInterest = 0;

    let baseDate = new Date(startDate + '-01');
    if (isNaN(baseDate.getTime())) baseDate = new Date();
    
    let actualDate = new Date(startDate + '-01');
    if (isNaN(actualDate.getTime())) actualDate = new Date();

    // 1. Generate Baseline Schedule
    for (let m = 1; m <= totalMonths; m++) {
      const interest = baseBal * r_m;
      const principalPaid = Math.min(baseBal, baseEmi - interest);
      baseBal -= principalPaid;
      baseTotalInterest += interest;

      const label = baseDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      baselineSchedule.push({
        monthNumber: m,
        monthLabel: label,
        payment: interest + principalPaid,
        principal: principalPaid,
        interest: interest,
        balance: Math.max(0, baseBal)
      });
      baseDate.setMonth(baseDate.getMonth() + 1);
    }

    // 2. Generate Actual Schedule with extra payments
    let actualMonthIdx = 0;
    while (actualBal > 0.01 && actualMonthIdx < 1200) {
      actualMonthIdx++;
      const interest = actualBal * r_m;
      const standardPrincipal = Math.min(actualBal, baseEmi - interest);
      const extraPrincipal = Math.min(actualBal - standardPrincipal, extraPayment);
      const principalPaid = standardPrincipal + extraPrincipal;
      actualBal -= principalPaid;
      actualTotalInterest += interest;

      const label = actualDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      actualSchedule.push({
        monthNumber: actualMonthIdx,
        monthLabel: label,
        payment: interest + principalPaid,
        principal: principalPaid,
        interest: interest,
        balance: Math.max(0, actualBal)
      });
      actualDate.setMonth(actualDate.getMonth() + 1);
    }

    const processingFee = processingFeeType === 'percentage' 
      ? (principal * processingFeeValue) / 100 
      : processingFeeValue;

    const apr = calculateAPR(principal, processingFee, baseEmi, totalMonths);

    // Compute Year-by-Year consolidation for schedule display
    const yearlySchedule: { yearNumber: number; principalPaid: number; interestPaid: number; totalPaid: number; balance: number }[] = [];
    let yearInterest = 0;
    let yearPrincipal = 0;
    let yearTotal = 0;
    let currentYear = 1;

    // Use actualSchedule for table view
    actualSchedule.forEach((row, idx) => {
      yearInterest += row.interest;
      yearPrincipal += row.principal;
      yearTotal += row.payment;

      if ((idx + 1) % 12 === 0 || idx === actualSchedule.length - 1) {
        yearlySchedule.push({
          yearNumber: currentYear,
          principalPaid: yearPrincipal,
          interestPaid: yearInterest,
          totalPaid: yearTotal,
          balance: row.balance
        });
        yearInterest = 0;
        yearPrincipal = 0;
        yearTotal = 0;
        currentYear++;
      }
    });

    return {
      emi: baseEmi,
      totalPaymentBaseline: baseEmi * totalMonths,
      totalInterestBaseline: baseTotalInterest,
      totalPaymentActual: actualSchedule.reduce((acc, row) => acc + row.payment, 0),
      totalInterestActual: actualTotalInterest,
      processingFee,
      apr,
      actualSchedule,
      baselineSchedule,
      yearlySchedule,
      monthsSaved: Math.max(0, totalMonths - actualSchedule.length),
      interestSaved: Math.max(0, baseTotalInterest - actualTotalInterest)
    };
  }, [amount, rate, tenure, isYears, compoundFrequency, startDate, processingFeeType, processingFeeValue, extraPayment]);

  // --- TAB 2: COMPARE LOANS CALCULATIONS ---
  const compareCalculations = useMemo(() => {
    const solveLoan = (p: number, r: number, tenure: number, isY: boolean, feeType: 'flat' | 'percentage', feeVal: number) => {
      const totalMonths = isY ? tenure * 12 : tenure;
      const R = r / 100;
      const r_m = R / 12;
      const emi = (p * r_m * Math.pow(1 + r_m, totalMonths)) / (Math.pow(1 + r_m, totalMonths) - 1);
      const totalPayment = emi * totalMonths;
      const totalInterest = totalPayment - p;
      const fee = feeType === 'percentage' ? (p * feeVal) / 100 : feeVal;
      const apr = calculateAPR(p, fee, emi, totalMonths);

      return { emi, totalInterest, fee, totalPayment, apr };
    };

    const loanA = solveLoan(compareAmountA, compareRateA, compareTenureA, compareIsYearsA, compareFeeTypeA, compareFeeValA);
    const loanB = solveLoan(compareAmountB, compareRateB, compareTenureB, compareIsYearsB, compareFeeTypeB, compareFeeValB);

    return { loanA, loanB };
  }, [compareAmountA, compareRateA, compareTenureA, compareIsYearsA, compareFeeTypeA, compareFeeValA, compareAmountB, compareRateB, compareTenureB, compareIsYearsB, compareFeeTypeB, compareFeeValB]);

  // --- TAB 3: EXTRA PAYMENT SIMULATOR DETAILS ---
  const simulatorCalculations = useMemo(() => {
    const principal = amount;
    const annualRate = rate;
    const totalMonths = isYears ? tenure * 12 : tenure;
    const R = annualRate / 100;
    const r_m = R / 12;

    const baseEmi = R === 0 ? principal / totalMonths : (principal * r_m * Math.pow(1 + r_m, totalMonths)) / (Math.pow(1 + r_m, totalMonths) - 1);

    // Baseline Schedule
    const baseline: number[] = [];
    let baseBal = principal;
    for (let m = 1; m <= totalMonths; m++) {
      const interest = baseBal * r_m;
      const principalPaid = Math.min(baseBal, baseEmi - interest);
      baseBal -= principalPaid;
      baseline.push(Math.max(0, baseBal));
    }

    // Simulated Schedule
    const simulated: number[] = [];
    let simBal = principal;
    let monthIdx = 0;
    let simTotalInterest = 0;

    while (simBal > 0.01 && monthIdx < 1200) {
      monthIdx++;
      const interest = simBal * r_m;
      const standardPrincipal = Math.min(simBal, baseEmi - interest);

      // Collect active prepayments
      let extra = simMonthlyExtra;
      
      const isAnnual = (monthIdx - simAnnualMonth) % 12 === 0;
      if (simAnnualExtra > 0 && isAnnual) {
        extra += simAnnualExtra;
      }
      if (simLumpSum > 0 && monthIdx === simLumpSumMonth) {
        extra += simLumpSum;
      }

      const principalPaid = Math.min(simBal, standardPrincipal + extra);
      simBal -= principalPaid;
      simTotalInterest += interest;
      simulated.push(Math.max(0, simBal));
    }

    const baselineTotalInterest = calculations.totalInterestBaseline;
    const interestSaved = Math.max(0, baselineTotalInterest - simTotalInterest);
    const monthsSaved = Math.max(0, totalMonths - simulated.length);

    return {
      baseline,
      simulated,
      interestSaved,
      monthsSaved,
      simPayoffMonths: simulated.length,
      simTotalInterest
    };
  }, [amount, rate, tenure, isYears, simMonthlyExtra, simAnnualExtra, simAnnualMonth, simLumpSum, simLumpSumMonth, calculations.totalInterestBaseline]);

  // --- TAB 4: REFINANCING COMPARISON ---
  const refinanceCalculations = useMemo(() => {
    const curMonths = refIsYearsCurrent ? refRemainingTenure * 12 : refRemainingTenure;
    const newMonths = refIsYearsNew ? refNewTenure * 12 : refNewTenure;

    const curR_m = refCurrentRate / 100 / 12;
    const newR_m = refNewRate / 100 / 12;

    const curEmi = curR_m === 0 ? refCurrentBalance / curMonths : (refCurrentBalance * curR_m * Math.pow(1 + curR_m, curMonths)) / (Math.pow(1 + curR_m, curMonths) - 1);
    const newEmi = newR_m === 0 ? refCurrentBalance / newMonths : (refCurrentBalance * newR_m * Math.pow(1 + newR_m, newMonths)) / (Math.pow(1 + newR_m, newMonths) - 1);

    const curTotalInterest = curEmi * curMonths - refCurrentBalance;
    const newTotalInterest = newEmi * newMonths - refCurrentBalance;

    const interestSaved = Math.max(0, curTotalInterest - newTotalInterest);
    const netSavings = interestSaved - refCosts;
    const emiDifference = curEmi - newEmi;

    const breakEvenMonths = emiDifference > 0 ? refCosts / emiDifference : 0;

    return {
      currentEmi: curEmi,
      newEmi: newEmi,
      currentTotalInterest: curTotalInterest,
      newTotalInterest: newTotalInterest,
      interestSaved,
      netSavings,
      emiDifference,
      breakEvenMonths
    };
  }, [refCurrentBalance, refCurrentRate, refRemainingTenure, refIsYearsCurrent, refNewRate, refNewTenure, refIsYearsNew, refCosts]);

  // --- UTILITIES FOR ACTIONS ---
  const copyResults = () => {
    const text = `Loan Amortization Calculation (Toolora)
--------------------------------------
Loan Amount: ${formatCurrency(amount, currency)}
Interest Rate: ${rate}% (${compoundFrequency} Compounding)
Tenure: ${tenure} ${isYears ? 'Years' : 'Months'}
--------------------------------------
Monthly Payment (EMI): ${formatCurrency(calculations.emi, currency)}
Annual Percentage Rate (APR): ${calculations.apr.toFixed(2)}%
Upfront Processing Fee: ${formatCurrency(calculations.processingFee, currency)}
--------------------------------------
Total Payments Made: ${formatCurrency(calculations.totalPaymentActual, currency)}
Total Interest Cost: ${formatCurrency(calculations.totalInterestActual, currency)}
${extraPayment > 0 ? `Extra Monthly Payment: ${formatCurrency(extraPayment, currency)}\nTerm Shortened By: ${calculations.monthsSaved} Months\nTotal Interest Saved: ${formatCurrency(calculations.interestSaved, currency)}` : ''}
--------------------------------------
Calculated locally on Toolora.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCalculation = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/tools/loan-calculator?amount=${amount}&rate=${rate}&tenure=${tenure}&currency=${currency}&type=${loanType}`;
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const exportCSV = () => {
    const sched = calculations.actualSchedule;
    let csvContent = 'Month,Month/Year,Payment,Principal,Interest,Remaining Balance\r\n';
    sched.forEach((row) => {
      csvContent += `${row.monthNumber},"${row.monthLabel}",${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toolora_amortization_schedule_${amount}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- DONUT CHART CALCS ---
  const interestPercentage = calculations.totalPaymentBaseline > 0 
    ? (calculations.totalInterestActual / calculations.totalPaymentActual) * 100 
    : 0;
  const principalPercentage = 100 - interestPercentage;
  const strokeOffset = 314.16 - (314.16 * principalPercentage) / 100;

  // --- FILTERED SCHEDULE ROWS ---
  const filteredScheduleRows = useMemo(() => {
    const list = tableViewMode === 'yearly' ? calculations.yearlySchedule : calculations.actualSchedule;
    const query = tableSearch.toLowerCase().trim();
    if (!query) return list;

    if (tableViewMode === 'yearly') {
      return (list as any[]).filter(row => `year ${row.yearNumber}`.toLowerCase().includes(query));
    } else {
      return (list as any[]).filter(row => row.monthLabel.toLowerCase().includes(query) || `month ${row.monthNumber}`.toLowerCase().includes(query));
    }
  }, [tableViewMode, calculations.yearlySchedule, calculations.actualSchedule, tableSearch]);

  const paginatedRows = useMemo(() => {
    if (tablePageSize === -1) return filteredScheduleRows;
    const start = tablePageIndex * tablePageSize;
    return filteredScheduleRows.slice(start, start + tablePageSize);
  }, [filteredScheduleRows, tablePageIndex, tablePageSize]);

  const totalPages = Math.ceil(filteredScheduleRows.length / (tablePageSize === -1 ? 1 : tablePageSize));

  return (
    <div className="space-y-10">
      {/* Printable Report Header */}
      <div className="hidden print:block space-y-6 mb-10 border-b border-border/80 pb-6">
        <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-foreground">Loan Amortization Report</h1>
        <p className="text-xs text-muted">Generated by Toolora Loan Amortization Suite</p>
        <div className="grid grid-cols-3 gap-6 p-4 rounded-xl border border-border bg-card">
          <div>
            <span className="text-[10px] font-black uppercase text-muted tracking-widest block">Loan Principal</span>
            <span className="text-sm font-extrabold font-mono-calc">{formatCurrency(amount, currency)}</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-muted tracking-widest block">Interest Rate</span>
            <span className="text-sm font-extrabold font-mono-calc">{rate}% ({compoundFrequency})</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-muted tracking-widest block">Scheduled Term</span>
            <span className="text-sm font-extrabold font-mono-calc">{tenure} {isYears ? 'Years' : 'Months'}</span>
          </div>
        </div>
      </div>

      {/* Segmented Dashboard Tabs */}
      <div className="flex border-b border-border bg-secondary/15 p-1.5 rounded-2xl w-full overflow-x-auto scrollbar-none no-print">
        <div className="flex gap-1.5 w-full min-w-[580px]">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icons.Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'simulator' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icons.Zap className="h-4 w-4" />
            <span>Extra Payments</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'compare' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icons.Files className="h-4 w-4" />
            <span>Compare Loans</span>
          </button>
          <button
            onClick={() => setActiveTab('refinance')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'refinance' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icons.RefreshCw className="h-4 w-4" />
            <span>Refinancing</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'articles' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Icons.FileText className="h-4 w-4" />
            <span>Loan Guide</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: CORE CALCULATOR --- */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Sliders and Input Controls */}
          <div className="lg:col-span-5 space-y-6 no-print">
            {/* Quick Loan Type Badges */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Select Loan Category</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'home', label: 'Home Mortgage', icon: '🏠' },
                  { id: 'car', label: 'Auto Loan', icon: '🚗' },
                  { id: 'personal', label: 'Personal Debt', icon: '💳' },
                  { id: 'education', label: 'Student Loan', icon: '🎓' },
                  { id: 'business', label: 'Commercial', icon: '💼' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleLoanTypeChange(type.id as any)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                      loanType === type.id
                        ? 'bg-primary/5 text-primary border-primary/40 shadow-premium-sm font-black'
                        : 'border-border/80 hover:bg-secondary/40 text-muted'
                    }`}
                  >
                    <span className="mr-1.5">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Currency Preference</span>
              <div className="grid grid-cols-6 gap-1 bg-secondary/35 border border-border/80 rounded-xl p-1">
                {['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => { setCurrency(curr); saveInputs({ currency: curr }); }}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                      currency === curr 
                        ? 'bg-card border border-border shadow-premium-sm text-foreground' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Principal Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Amount to Borrow (Loan Principal)</span>
                <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  step="1000"
                  value={amount}
                  onChange={(e) => { const v = parseFloat(e.target.value); setAmount(v); saveInputs({ amount: v }); }}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                    {currency}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { const v = e.target.value === '' ? 0 : parseFloat(e.target.value); setAmount(v); saveInputs({ amount: v }); }}
                    className="block w-full pl-12 pr-4 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Interest Rate Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Interest Rate Percentage</span>
                <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
                  {rate}% P.A.
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.05"
                  value={rate}
                  onChange={(e) => { const v = parseFloat(e.target.value); setRate(v); saveInputs({ rate: v }); }}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="relative">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => { const v = e.target.value === '' ? 0 : parseFloat(e.target.value); setRate(v); saveInputs({ rate: v }); }}
                    step="0.05"
                    className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="0.00"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Loan Tenure Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Repayment Duration</span>
                <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
                  {tenure} {isYears ? 'Years' : 'Months'}
                </span>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
                <input
                  type="range"
                  min="1"
                  max={isYears ? 40 : 480}
                  step="1"
                  value={tenure}
                  onChange={(e) => { const v = parseFloat(e.target.value); setTenure(v); saveInputs({ tenure: v }); }}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => { const v = e.target.value === '' ? 0 : parseFloat(e.target.value); setTenure(v); saveInputs({ tenure: v }); }}
                    className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <div className="flex gap-1 bg-secondary/35 border border-border/80 p-0.5 rounded-xl shrink-0">
                    <button
                      onClick={() => { setIsYears(true); saveInputs({ isYears: true }); }}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${isYears ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                    >
                      Years
                    </button>
                    <button
                      onClick={() => { setIsYears(false); saveInputs({ isYears: false }); }}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${!isYears ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                    >
                      Months
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced & Hidden Fields */}
            <details className="group border border-border/60 rounded-2xl bg-card/30 transition-all overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-muted cursor-pointer hover:bg-secondary/30 select-none">
                <span>Advanced Calculation Rules</span>
                <Icons.ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 text-muted/70" />
              </summary>
              <div className="p-4 border-t border-border/50 bg-card/10 space-y-4">
                {/* Compound Frequency */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Compounding Intervals</span>
                  <select
                    value={compoundFrequency}
                    onChange={(e) => { setCompoundFrequency(e.target.value as any); saveInputs({ compoundFrequency: e.target.value }); }}
                    className="block w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  >
                    <option value="monthly">Compounded Monthly (Standard)</option>
                    <option value="quarterly">Compounded Quarterly</option>
                    <option value="half-yearly">Compounded Semi-Annually</option>
                    <option value="yearly">Compounded Annually</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Start Repayment Date</span>
                  <input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-2 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>

                {/* Processing Fee */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Upfront Processing Fee</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={processingFeeValue}
                      onChange={(e) => setProcessingFeeValue(parseFloat(e.target.value) || 0)}
                      className="block w-full px-3 py-2 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                    />
                    <div className="flex gap-1 bg-secondary/35 border border-border/80 p-0.5 rounded-xl shrink-0">
                      <button
                        onClick={() => setProcessingFeeType('percentage')}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${processingFeeType === 'percentage' ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                      >
                        %
                      </button>
                      <button
                        onClick={() => setProcessingFeeType('flat')}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${processingFeeType === 'flat' ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                      >
                        Flat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Extra Monthly Payment */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Add Monthly Extra Payment</span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={extraPayment || ''}
                      onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="block w-full pl-12 pr-4 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                    />
                  </div>
                  <p className="text-[9px] text-muted/60 mt-1">Accelerates principal payoff and lowers total interest.</p>
                </div>
              </div>
            </details>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-6">
            {/* Monthly Payment Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-premium-lg space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Estimated Payment Ledger</span>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest">
                  Compounded Locally
                </span>
              </div>

              <div className="py-2 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Monthly Payment (EMI)</span>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground font-mono-calc">
                  {formatCurrency(calculations.emi, currency)}
                </div>
                {extraPayment > 0 && (
                  <div className="text-xs text-primary font-bold pt-1">
                    Paying {formatCurrency(calculations.emi + extraPayment, currency)} total each month (EMI + Extra)
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/30 pt-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Principal</span>
                  <div className="text-xs sm:text-sm font-bold text-foreground font-mono-calc truncate">
                    {formatCurrency(amount, currency)}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Total Interest</span>
                  <div className="text-xs sm:text-sm font-bold text-foreground font-mono-calc truncate">
                    {formatCurrency(calculations.totalInterestActual, currency)}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Total Payment</span>
                  <div className="text-xs sm:text-sm font-bold text-foreground font-mono-calc truncate">
                    {formatCurrency(calculations.totalPaymentActual, currency)}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Effective APR</span>
                  <div className="text-xs sm:text-sm font-bold text-foreground font-mono-calc truncate">
                    {calculations.apr.toFixed(2)}%
                  </div>
                </div>
              </div>

              {extraPayment > 0 && calculations.monthsSaved > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                  <Icons.Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-primary">Prepayment Impact</h5>
                    <p className="text-xs text-muted leading-relaxed mt-1">
                      By adding {formatCurrency(extraPayment, currency)} monthly, you will save{' '}
                      <strong className="text-foreground">{formatCurrency(calculations.interestSaved, currency)}</strong> in total interest and pay off your loan{' '}
                      <strong className="text-foreground">{Math.floor(calculations.monthsSaved / 12)} years and {calculations.monthsSaved % 12} months</strong> earlier!
                    </p>
                  </div>
                </div>
              )}

              {/* Share & Download Toolbar */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border/40 no-print">
                <button
                  onClick={copyResults}
                  className="flex items-center justify-center gap-1.5 border border-border bg-card px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
                >
                  {copied ? <Icons.Check className="h-3.5 w-3.5 text-emerald-500" /> : <Icons.Copy className="h-3.5 w-3.5 text-muted" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={shareCalculation}
                  className="flex items-center justify-center gap-1.5 border border-border bg-card px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
                >
                  {shared ? <Icons.Check className="h-3.5 w-3.5 text-emerald-500" /> : <Icons.Share2 className="h-3.5 w-3.5 text-muted" />}
                  <span>{shared ? 'Shared' : 'Share'}</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center justify-center gap-1.5 border border-border bg-card px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
                >
                  <Icons.Download className="h-3.5 w-3.5 text-muted" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 border border-border bg-card px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
                >
                  <Icons.FileText className="h-3.5 w-3.5 text-muted" />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {/* SVG Charts */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md space-y-6 no-print">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Amortization Visualizers</h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* SVG Donut */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full rotate-270" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="stroke-secondary fill-none"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="stroke-primary/20 fill-none transition-all duration-500"
                        strokeWidth="12"
                        strokeDasharray="314.16"
                        strokeDashoffset={314.16 - (314.16 * principalPercentage) / 100}
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="stroke-red-500 fill-none transition-all duration-500"
                        strokeWidth="12"
                        strokeDasharray="314.16"
                        strokeDashoffset={314.16}
                        style={{
                          strokeDashoffset: 314.16 - (314.16 * interestPercentage) / 100,
                          transformOrigin: 'center',
                          transform: `rotate(${(principalPercentage / 100) * 360}deg)`,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-black text-muted uppercase tracking-wider">Interest</span>
                      <span className="text-sm font-bold font-mono-calc">{interestPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary/20" />
                      Principal: {principalPercentage.toFixed(0)}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Interest: {interestPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Stacked Vertical Bar Schedule (15 Years maximum display) */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block">
                    Yearly Schedule Amortization Ratio
                  </span>
                  <div className="h-32 w-full flex items-end justify-between gap-1 border-b border-border/80 pb-1">
                    {calculations.yearlySchedule.slice(0, 15).map((y) => {
                      const maxYearTotal = Math.max(...calculations.yearlySchedule.map(row => row.totalPaid), 1);
                      const principalRatio = (y.principalPaid / maxYearTotal) * 100;
                      const interestRatio = (y.interestPaid / maxYearTotal) * 100;
                      return (
                        <div key={y.yearNumber} className="flex-1 flex flex-col justify-end h-full relative group">
                          {/* Stacked Bar */}
                          <div className="w-full flex flex-col justify-end rounded-t overflow-hidden max-h-full">
                            <div
                              style={{ height: `${interestRatio}%` }}
                              className="w-full bg-red-500 transition-all duration-300"
                            />
                            <div
                              style={{ height: `${principalRatio}%` }}
                              className="w-full bg-primary/20 transition-all duration-300"
                            />
                          </div>
                          
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-card border border-border p-2 rounded-lg text-[8px] font-bold uppercase tracking-wider text-foreground z-20 whitespace-nowrap shadow-premium-md">
                            <div>Year {y.yearNumber}</div>
                            <div>P: {formatCurrency(y.principalPaid, currency, true)}</div>
                            <div>I: {formatCurrency(y.interestPaid, currency, true)}</div>
                          </div>
                          
                          <span className="text-[7px] font-black text-muted text-center mt-1">Yr {y.yearNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Table Section */}
          <div className="lg:col-span-12 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-border/60 pt-8 no-print">
              <div>
                <h3 className="font-outfit text-lg font-bold text-foreground">Detailed Amortization Schedule</h3>
                <p className="text-xs text-muted">Scroll or search through the exact payment breakdowns below.</p>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search year or month..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setTablePageIndex(0); }}
                  className="px-3 py-1.5 text-xs font-bold border border-border bg-card rounded-xl outline-none flex-1 sm:w-48"
                />
                
                <div className="flex gap-1 bg-secondary/35 border border-border/80 p-0.5 rounded-xl shrink-0">
                  <button
                    onClick={() => { setTableViewMode('yearly'); setTablePageIndex(0); }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${tableViewMode === 'yearly' ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                  >
                    Yearly View
                  </button>
                  <button
                    onClick={() => { setTableViewMode('monthly'); setTablePageIndex(0); }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${tableViewMode === 'monthly' ? 'bg-card border border-border text-foreground shadow-premium-sm' : 'text-muted'}`}
                  >
                    Monthly View
                  </button>
                </div>
              </div>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-premium-sm">
              <table className="w-full text-left text-xs">
                <thead className="text-[9px] font-black uppercase tracking-widest text-muted border-b border-border/50 bg-secondary/15">
                  <tr>
                    <th className="px-4 py-3 text-center">{tableViewMode === 'yearly' ? 'Year' : 'Month'}</th>
                    <th className="px-4 py-3">Scheduled Payment</th>
                    <th className="px-4 py-3">Principal Applied</th>
                    <th className="px-4 py-3">Interest Charged</th>
                    <th className="px-4 py-3">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row: any, idx) => (
                      <tr key={idx} className="hover:bg-secondary/20 font-medium">
                        <td className="px-4 py-3 text-center font-bold font-mono-calc">
                          {tableViewMode === 'yearly' ? `Yr ${row.yearNumber}` : `#${row.monthNumber} (${row.monthLabel})`}
                        </td>
                        <td className="px-4 py-3 font-semibold font-mono-calc text-foreground">
                          {formatCurrency(tableViewMode === 'yearly' ? row.totalPaid : row.payment, currency)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400 font-mono-calc">
                          {formatCurrency(row.principalPaid || row.principal, currency)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-500 font-mono-calc">
                          {formatCurrency(row.interestPaid || row.interest, currency)}
                        </td>
                        <td className="px-4 py-3 font-semibold font-mono-calc text-foreground">
                          {formatCurrency(row.balance, currency)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs font-bold text-muted uppercase tracking-wider">
                        No rows matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 no-print">
                <span className="text-[10px] font-black uppercase text-muted tracking-wider">
                  Page {tablePageIndex + 1} of {totalPages}
                </span>
                
                <div className="flex gap-2">
                  <button
                    disabled={tablePageIndex === 0}
                    onClick={() => setTablePageIndex(prev => prev - 1)}
                    className="p-2 border border-border bg-card rounded-xl hover:bg-secondary disabled:opacity-40 transition-colors"
                  >
                    <Icons.ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={tablePageIndex >= totalPages - 1}
                    onClick={() => setTablePageIndex(prev => prev + 1)}
                    className="p-2 border border-border bg-card rounded-xl hover:bg-secondary disabled:opacity-40 transition-colors"
                  >
                    <Icons.ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: COMPARE TWO LOANS --- */}
      {activeTab === 'compare' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Loan A Form */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-premium-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Loan Scenario A</h4>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Loan Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-muted font-bold">{currency}</span>
                  <input
                    type="number"
                    value={compareAmountA}
                    onChange={(e) => setCompareAmountA(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Interest Rate (%)</label>
                <input
                  type="number"
                  value={compareRateA}
                  onChange={(e) => setCompareRateA(parseFloat(e.target.value) || 0)}
                  step="0.05"
                  className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Loan Term</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={compareTenureA}
                    onChange={(e) => setCompareTenureA(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setCompareIsYearsA(!compareIsYearsA)}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl"
                  >
                    {compareIsYearsA ? 'Years' : 'Months'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Processing Fee</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={compareFeeValA}
                    onChange={(e) => setCompareFeeValA(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setCompareFeeTypeA(compareFeeTypeA === 'percentage' ? 'flat' : 'percentage')}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl shrink-0"
                  >
                    {compareFeeTypeA === 'percentage' ? '%' : 'Flat'}
                  </button>
                </div>
              </div>
            </div>

            {/* Loan B Form */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-premium-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">Loan Scenario B</h4>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Loan Amount</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-muted font-bold">{currency}</span>
                  <input
                    type="number"
                    value={compareAmountB}
                    onChange={(e) => setCompareAmountB(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Interest Rate (%)</label>
                <input
                  type="number"
                  value={compareRateB}
                  onChange={(e) => setCompareRateB(parseFloat(e.target.value) || 0)}
                  step="0.05"
                  className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Loan Term</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={compareTenureB}
                    onChange={(e) => setCompareTenureB(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setCompareIsYearsB(!compareIsYearsB)}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl"
                  >
                    {compareIsYearsB ? 'Years' : 'Months'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Processing Fee</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={compareFeeValB}
                    onChange={(e) => setCompareFeeValB(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setCompareFeeTypeB(compareFeeTypeB === 'percentage' ? 'flat' : 'percentage')}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl shrink-0"
                  >
                    {compareFeeTypeB === 'percentage' ? '%' : 'Flat'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Matrix */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Comparison Ledger</h4>
            
            <div className="grid grid-cols-3 gap-4 text-xs font-bold border-b border-border/40 pb-4">
              <span className="text-muted">Metrics</span>
              <span className="text-primary font-extrabold text-right">Scenario A</span>
              <span className="text-emerald-500 font-extrabold text-right">Scenario B</span>
            </div>

            {[
              { label: 'Monthly Payment (EMI)', valA: compareCalculations.loanA.emi, valB: compareCalculations.loanB.emi, format: true },
              { label: 'Processing Fee', valA: compareCalculations.loanA.fee, valB: compareCalculations.loanB.fee, format: true },
              { label: 'Total Interest Payable', valA: compareCalculations.loanA.totalInterest, valB: compareCalculations.loanB.totalInterest, format: true },
              { label: 'Total Repayment Cost', valA: compareCalculations.loanA.totalPayment, valB: compareCalculations.loanB.totalPayment, format: true },
              { label: 'Effective APR', valA: compareCalculations.loanA.apr, valB: compareCalculations.loanB.apr, format: false, suffix: '%' }
            ].map((metric, idx) => {
              const diff = Math.abs(metric.valA - metric.valB);
              const cheaperA = metric.valA < metric.valB;
              return (
                <div key={idx} className="grid grid-cols-3 gap-4 text-xs py-2 border-b border-border/20 items-center">
                  <span className="text-muted leading-tight">{metric.label}</span>
                  <span className={`text-right font-mono-calc font-extrabold ${cheaperA ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                    {metric.format ? formatCurrency(metric.valA, currency) : `${metric.valA.toFixed(2)}${metric.suffix || ''}`}
                  </span>
                  <span className={`text-right font-mono-calc font-extrabold ${!cheaperA ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                    {metric.format ? formatCurrency(metric.valB, currency) : `${metric.valB.toFixed(2)}${metric.suffix || ''}`}
                  </span>
                </div>
              );
            })}

            {/* Savings Highlight */}
            {Math.abs(compareCalculations.loanA.totalPayment - compareCalculations.loanB.totalPayment) > 0.01 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <Icons.Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-emerald-500">Savings Analysis</h5>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    {compareCalculations.loanA.totalPayment < compareCalculations.loanB.totalPayment ? (
                      <>
                        <strong>Scenario A</strong> is cheaper overall. It saves you{' '}
                        <strong className="text-foreground">
                          {formatCurrency(compareCalculations.loanB.totalPayment - compareCalculations.loanA.totalPayment, currency)}
                        </strong>{' '}
                        in total payments compared to Scenario B.
                      </>
                    ) : (
                      <>
                        <strong>Scenario B</strong> is cheaper overall. It saves you{' '}
                        <strong className="text-foreground">
                          {formatCurrency(compareCalculations.loanA.totalPayment - compareCalculations.loanB.totalPayment, currency)}
                        </strong>{' '}
                        in total payments compared to Scenario A.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: EXTRA PAYMENTS SIMULATOR --- */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-premium-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Prepayment Parameters</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-muted">Monthly Extra Payment</span>
                  <span className="text-xs font-bold text-foreground font-mono-calc">{formatCurrency(simMonthlyExtra, currency)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={simMonthlyExtra}
                  onChange={(e) => setSimMonthlyExtra(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-muted">Annual Extra Payment</span>
                  <span className="text-xs font-bold text-foreground font-mono-calc">{formatCurrency(simAnnualExtra, currency)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25000"
                  step="250"
                  value={simAnnualExtra}
                  onChange={(e) => setSimAnnualExtra(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-black uppercase text-muted">Month to Apply Annual Payment</span>
                  <select
                    value={simAnnualMonth}
                    onChange={(e) => setSimAnnualMonth(parseInt(e.target.value) || 12)}
                    className="block w-full px-3 py-1.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>Month {m} (e.g. {new Date(startDate + '-01').toLocaleString('default', { month: 'long' })})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-muted">One-time Lump Sum Payment</span>
                  <span className="text-xs font-bold text-foreground font-mono-calc">{formatCurrency(simLumpSum, currency)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={simLumpSum}
                  onChange={(e) => setSimLumpSum(parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-black uppercase text-muted">Month to Apply One-time Payment</span>
                  <input
                    type="number"
                    min="1"
                    max={isYears ? tenure * 12 : tenure}
                    value={simLumpSumMonth}
                    onChange={(e) => setSimLumpSumMonth(parseInt(e.target.value) || 1)}
                    className="block w-full px-3 py-1.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Comparison and Graph */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Simulation Output</h4>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-border bg-secondary/10">
                  <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Total Interest Saved</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-calc">
                    {formatCurrency(simulatorCalculations.interestSaved, currency)}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-secondary/10">
                  <span className="text-[9px] font-black uppercase text-muted tracking-wider block">Time Shortened By</span>
                  <span className="text-2xl font-extrabold text-primary font-mono-calc">
                    {Math.floor(simulatorCalculations.monthsSaved / 12)} Yrs {simulatorCalculations.monthsSaved % 12} Mos
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-border/30 pt-4 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-muted">Original Amortization Term</span>
                  <span className="font-mono-calc">{isYears ? tenure : Math.floor(tenure / 12)} Years ({isYears ? tenure * 12 : tenure} Months)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Simulated Payoff Term</span>
                  <span className="font-mono-calc text-emerald-600 dark:text-emerald-400">
                    {Math.floor(simulatorCalculations.simPayoffMonths / 12)} Years ({simulatorCalculations.simPayoffMonths} Months)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Simulated Total Interest Paid</span>
                  <span className="font-mono-calc">{formatCurrency(simulatorCalculations.simTotalInterest, currency)}</span>
                </div>
              </div>

              {/* Line Chart comparing remaining balance curves */}
              {simulatorCalculations.baseline.length > 0 && (
                <div className="space-y-3 border-t border-border/30 pt-4">
                  <span className="text-[9px] font-black uppercase text-muted block">Remaining Principal Curve Comparison</span>
                  
                  {/* SVG Chart Wrapper */}
                  <div className="h-40 border border-border bg-secondary/5 rounded-xl p-2 relative overflow-hidden">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="400" y2="30" className="stroke-border/40" strokeWidth="1" />
                      <line x1="0" y1="60" x2="400" y2="60" className="stroke-border/40" strokeWidth="1" />
                      <line x1="0" y1="90" x2="400" y2="90" className="stroke-border/40" strokeWidth="1" />
                      
                      {/* Baseline Path */}
                      <path
                        d={(() => {
                          const baseList = simulatorCalculations.baseline;
                          const maxM = Math.max(baseList.length, simulatorCalculations.simulated.length, 1);
                          let path = `M 0 0`;
                          baseList.forEach((bal, idx) => {
                            const x = (idx / maxM) * 400;
                            const y = 120 - (bal / amount) * 120;
                            path += ` L ${x} ${y}`;
                          });
                          return path;
                        })()}
                        fill="none"
                        className="stroke-muted/40"
                        strokeWidth="2.5"
                      />

                      {/* Simulated Path */}
                      <path
                        d={(() => {
                          const simList = simulatorCalculations.simulated;
                          const maxM = Math.max(simulatorCalculations.baseline.length, simList.length, 1);
                          let path = `M 0 0`;
                          simList.forEach((bal, idx) => {
                            const x = (idx / maxM) * 400;
                            const y = 120 - (bal / amount) * 120;
                            path += ` L ${x} ${y}`;
                          });
                          return path;
                        })()}
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="3.5"
                      />
                    </svg>
                    
                    {/* Floating Legend */}
                    <div className="absolute top-2 right-2 flex gap-3 text-[8px] font-black uppercase tracking-wider text-muted">
                      <span className="flex items-center gap-1">
                        <span className="h-1 w-3 bg-muted/40 rounded" />
                        Original Schedule
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1 w-3 bg-primary rounded" />
                        Simulated Schedule
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: REFINANCING COMPARISON --- */}
      {activeTab === 'refinance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Current Loan Card */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-premium-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-red-500">Current Outstanding Loan</h4>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Remaining Principal Balance</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-muted font-bold">{currency}</span>
                  <input
                    type="number"
                    value={refCurrentBalance}
                    onChange={(e) => setRefCurrentBalance(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Current Interest Rate (%)</label>
                <input
                  type="number"
                  value={refCurrentRate}
                  onChange={(e) => setRefCurrentRate(parseFloat(e.target.value) || 0)}
                  step="0.05"
                  className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Remaining Tenure</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={refRemainingTenure}
                    onChange={(e) => setRefRemainingTenure(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setRefIsYearsCurrent(!refIsYearsCurrent)}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl"
                  >
                    {refIsYearsCurrent ? 'Years' : 'Months'}
                  </button>
                </div>
              </div>
            </div>

            {/* New Loan Card */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-premium-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">Proposed Refinancing Loan</h4>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">New Interest Rate (%)</label>
                <input
                  type="number"
                  value={refNewRate}
                  onChange={(e) => setRefNewRate(parseFloat(e.target.value) || 0)}
                  step="0.05"
                  className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">New Tenure</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={refNewTenure}
                    onChange={(e) => setRefNewTenure(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setRefIsYearsNew(!refIsYearsNew)}
                    className="px-3 border border-border bg-secondary/35 text-[10px] font-bold rounded-xl"
                  >
                    {refIsYearsNew ? 'Years' : 'Months'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted block">Refinancing Fees & Penalties</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-muted font-bold">{currency}</span>
                  <input
                    type="number"
                    value={refCosts}
                    onChange={(e) => setRefCosts(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-bold border border-border bg-card rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Refinance Analysis Report */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Refinancing Ledger</h4>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold border-b border-border/40 pb-4">
              <span className="text-muted">Metrics</span>
              <span className="text-foreground text-right">Calculation Summary</span>
            </div>

            {[
              { label: 'Current Monthly EMI', value: refinanceCalculations.currentEmi, format: true },
              { label: 'Proposed Refinanced EMI', value: refinanceCalculations.newEmi, format: true },
              { label: 'Monthly Payment Difference', value: refinanceCalculations.emiDifference, format: true },
              { label: 'Lifetime Interest Saved', value: refinanceCalculations.interestSaved, format: true },
              { label: 'Refinancing Upfront Fees', value: refCosts, format: true },
              { label: 'Net Lifetime Savings', value: refinanceCalculations.netSavings, format: true }
            ].map((metric, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 text-xs py-2 border-b border-border/20 items-center">
                <span className="text-muted">{metric.label}</span>
                <span className={`text-right font-mono-calc font-extrabold ${metric.label === 'Net Lifetime Savings' && refinanceCalculations.netSavings > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                  {formatCurrency(metric.value, currency)}
                </span>
              </div>
            ))}

            {refinanceCalculations.netSavings > 0 ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <Icons.Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-emerald-500">Refinancing Approved</h5>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Refinancing your loan is mathematically recommended! It saves you{' '}
                    <strong className="text-foreground">{formatCurrency(refinanceCalculations.interestSaved, currency)}</strong> in interest. After paying upfront refinancing fees of {formatCurrency(refCosts, currency)}, your net savings will be{' '}
                    <strong className="text-foreground">{formatCurrency(refinanceCalculations.netSavings, currency)}</strong>.
                    {refinanceCalculations.emiDifference > 0 && (
                      <span> The break-even period will occur in month <strong className="text-foreground">{refinanceCalculations.breakEvenMonths.toFixed(1)}</strong>.</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <Icons.AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-red-500">Refinancing Warning</h5>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Refinancing is not recommended. The upfront refinancing costs of{' '}
                    <strong className="text-foreground">{formatCurrency(refCosts, currency)}</strong> exceed your lifetime interest savings of{' '}
                    <strong className="text-foreground">{formatCurrency(refinanceCalculations.interestSaved, currency)}</strong>, resulting in a net loss of{' '}
                    <strong className="text-foreground">{formatCurrency(Math.abs(refinanceCalculations.netSavings), currency)}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: EDUCATIONAL GUIDE / KNOWLEDGE BASE --- */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Article Selector List */}
          <div className="md:col-span-4 space-y-2 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Topic Guide Library</span>
            {loanCalculatorArticles.map((art) => (
              <button
                key={art.slug}
                onClick={() => setSelectedArticleSlug(art.slug)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                  selectedArticleSlug === art.slug
                    ? 'bg-primary/5 border-primary/45 shadow-premium-sm text-foreground'
                    : 'border-border bg-card hover:bg-secondary/40 text-muted'
                }`}
              >
                <span className="text-xs font-bold text-foreground font-outfit">{art.title}</span>
                <span className="text-[9px] font-bold text-muted uppercase tracking-wider">{art.readTime}</span>
              </button>
            ))}
          </div>

          {/* Article Viewer Pane */}
          <div className="md:col-span-8 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-premium-md min-h-[400px]">
            {(() => {
              const art = loanCalculatorArticles.find(a => a.slug === selectedArticleSlug);
              if (!art) return null;
              return (
                <div className="space-y-6">
                  <header className="border-b border-border/40 pb-4 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{art.readTime}</span>
                    <h2 className="font-outfit text-2xl font-bold text-foreground leading-tight">{art.title}</h2>
                    <p className="text-xs sm:text-sm text-muted italic leading-relaxed">{art.summary}</p>
                  </header>
                  
                  {/* Article content renderer */}
                  <div className="text-xs sm:text-sm text-muted leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                    {art.content}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
