'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@/hooks/useForm';
import * as Icons from '@/components/Icons';
import AnimatedIndianAmount from '@/components/AnimatedIndianAmount';
import { formatExactIndianCurrency } from '@/utils/currency';

interface HistoryItem {
  id: string;
  timestamp: number;
  principal: number;
  rate: number;
  tenure: number;
  isYears: boolean;
  emi: number;
  totalInterest: number;
}

interface AmortizationYear {
  yearNumber: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

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
      const currentVal = start + range * progress;
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target]);

  return count;
}

export default function EMICalculator() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts');

  const { values, handleChange, handleInputChange, reset } = useForm({
    amount: 2500000, // Rs. 25 Lakhs
    rate: 8.5,      // 8.5%
    tenure: 20,     // 20 Years
    isYears: true,
  });

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolora-emi-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const principal = typeof values.amount === 'number' ? values.amount : 0;
  const annualRate = typeof values.rate === 'number' ? values.rate : 0;
  const rawTenure = typeof values.tenure === 'number' ? values.tenure : 0;

  // Monthly conversions
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = values.isYears ? rawTenure * 12 : rawTenure;

  // EMI Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = useMemo(() => {
    if (principal <= 0 || annualRate <= 0 || totalMonths <= 0) return 0;
    if (monthlyRate === 0) return principal / totalMonths;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }, [principal, monthlyRate, totalMonths]);

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const animatedEMI = useCountUp(emi);
  const animatedInterest = useCountUp(totalInterest);
  const animatedTotalPayment = useCountUp(totalPayment);

  // Amortization Schedule (Yearly Consolidation)
  const schedule = useMemo(() => {
    const yearsList: AmortizationYear[] = [];
    if (emi <= 0 || totalMonths <= 0) return yearsList;

    let balance = principal;
    let yearPrincipal = 0;
    let yearInterest = 0;
    let monthCount = 0;
    let currentYear = 1;
    let opening = principal;

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, emi - interestForMonth);
      balance -= principalForMonth;

      yearPrincipal += principalForMonth;
      yearInterest += interestForMonth;
      monthCount++;

      if (monthCount === 12 || m === totalMonths) {
        yearsList.push({
          yearNumber: currentYear,
          openingBalance: opening,
          principalPaid: yearPrincipal,
          interestPaid: yearInterest,
          totalPaid: yearPrincipal + yearInterest,
          closingBalance: Math.max(0, balance),
        });
        opening = balance;
        yearPrincipal = 0;
        yearInterest = 0;
        monthCount = 0;
        currentYear++;
      }
    }

    return yearsList;
  }, [principal, emi, totalMonths, monthlyRate]);

  const formatCurrency = (val: number) => {
    return formatExactIndianCurrency(val);
  };

  const saveToHistory = () => {
    if (principal <= 0) return;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      principal,
      rate: annualRate,
      tenure: rawTenure,
      isYears: values.isYears,
      emi,
      totalInterest,
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 9)];
      localStorage.setItem('toolora-emi-history', JSON.stringify(updated));
      return updated;
    });
  };

  const copyToClipboard = () => {
    const text = `Loan EMI Calculation Summary (Toolora)
--------------------------------------
Loan Principal: ${formatCurrency(principal)}
Interest Rate: ${annualRate}%
Tenure: ${rawTenure} ${values.isYears ? 'Years' : 'Months'}
--------------------------------------
Monthly EMI: ${formatCurrency(emi)}
Total Interest Payable: ${formatCurrency(totalInterest)}
Total Cumulative Repayment: ${formatCurrency(totalPayment)}
--------------------------------------
Calculated locally on Toolora.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    saveToHistory();
  };

  const shareCalculation = () => {
    const link = typeof window !== 'undefined'
      ? `${window.location.origin}/tools/emi-calculator?amount=${principal}&rate=${annualRate}&tenure=${rawTenure}&years=${values.isYears}`
      : '';
    navigator.clipboard.writeText(link);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const downloadCSV = () => {
    let csv = 'Year,Opening Balance,Principal Paid,Interest Paid,Total Yearly Repayment,Closing Balance\r\n';
    schedule.forEach((y) => {
      csv += `${y.yearNumber},${y.openingBalance.toFixed(2)},${y.principalPaid.toFixed(2)},${y.interestPaid.toFixed(2)},${y.totalPaid.toFixed(2)},${y.closingBalance.toFixed(2)}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toolora-emi-schedule-${principal}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    saveToHistory();
  };

  const loadFromHistory = (item: HistoryItem) => {
    handleChange('amount', item.principal);
    handleChange('rate', item.rate);
    handleChange('tenure', item.tenure);
    handleChange('isYears', item.isYears);
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolora-emi-history');
  };

  const handleReset = () => {
    reset();
  };

  // Donut values (Circumference 314.16 for radius 50)
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = totalPayment > 0 ? (principal / totalPayment) * 100 : 100;
  const strokeOffset = 314.16 - (314.16 * principalPercentage) / 100;

  // Render Bar Charts calculations
  const maxYearPayment = useMemo(() => {
    if (schedule.length === 0) return 1;
    return Math.max(...schedule.map((y) => y.totalPaid));
  }, [schedule]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* OS Dashboard Sliders (Left) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Loan Amount Input + Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Amount to Borrow (Loan Amount)</span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {formatCurrency(principal)}
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
            <input
              type="range"
              min="10000"
              max="100000000"
              step="10000"
              name="amount"
              value={principal}
              onChange={handleInputChange}
              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleInputChange}
                className="block w-full pl-8 pr-4 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              The total sum of money you want to borrow from the bank or lender.
            </p>
          </div>
        </div>

        {/* Interest Rate Input + Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Yearly Interest Rate (%)</span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {annualRate}% P.A.
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              name="rate"
              value={annualRate}
              onChange={handleInputChange}
              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="relative">
              <input
                type="number"
                name="rate"
                value={values.rate}
                onChange={handleInputChange}
                step="0.01"
                className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="0.00"
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                %
              </span>
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              The yearly interest percentage charged by the bank on this loan.
            </p>
          </div>
        </div>

        {/* Loan Tenure Box */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Repayment Period (Time to pay back)</span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {rawTenure} {values.isYears ? 'Years' : 'Months'}
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
            <input
              type="range"
              min="1"
              max={values.isYears ? 30 : 360}
              step="1"
              name="tenure"
              value={rawTenure}
              onChange={handleInputChange}
              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="relative">
              <input
                type="number"
                name="tenure"
                value={values.tenure}
                onChange={handleInputChange}
                className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              How many years you have to completely pay back this loan.
            </p>
          </div>
        </div>

        {/* Collapsible Advanced Settings */}
        <details className="group border border-border/60 rounded-2xl bg-card/30 transition-all overflow-hidden">
          <summary className="flex items-center justify-between px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-muted cursor-pointer hover:bg-secondary/30 select-none">
            <span>Advanced Settings</span>
            <Icons.ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 text-muted/70" />
          </summary>
          <div className="p-4 border-t border-border/50 bg-card/10 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Repayment Period Unit</span>
            <div className="flex gap-2 bg-card p-1 border border-border rounded-xl">
              <button
                onClick={() => handleChange('isYears', true)}
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  values.isYears ? 'bg-secondary text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
                }`}
              >
                Years
              </button>
              <button
                onClick={() => handleChange('isYears', false)}
                className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  !values.isYears ? 'bg-secondary text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
                }`}
              >
                Months
              </button>
            </div>
            <p className="text-[9px] text-muted/50 leading-relaxed">
              By default, we assume the repayment period is in Years. Switch here to enter the period in Months instead.
            </p>
          </div>
        </details>

        {/* Action controllers */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-border bg-card text-foreground py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-all shadow-premium-sm"
          >
            <Icons.RotateCcw className="h-4 w-4" />
            <span>Reset Inputs</span>
          </button>
        </div>

      </div>

      {/* Output screen ledger & table tabs (Right) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Dynamic monthly EMI board */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-premium-lg space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/20">
                <Icons.Calculator className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                EMI breakdown ledger
              </span>
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest select-none">
              Client Computed
            </span>
          </div>

          <div className="py-2 space-y-1">
            <AnimatedIndianAmount
              value={emi}
              label="Monthly Payment (EMI)"
              sizeClass="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              exactSizeClass="text-xs"
            />
            <p className="text-[11px] text-muted/80 leading-normal pt-1">
              <strong>Meaning:</strong> You will need to pay this fixed amount every month to completely clear the loan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Total Interest Cost</span>
              <div className="text-base sm:text-lg font-extrabold text-foreground truncate">
                {formatCurrency(totalInterest)}
              </div>
              <p className="text-[10px] text-muted/70 italic leading-normal">
                This is the extra fee you pay to the lender for borrowing the money.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Total Cost of Loan</span>
              <div className="text-base sm:text-lg font-extrabold text-foreground truncate">
                {formatCurrency(totalPayment)}
              </div>
              <p className="text-[10px] text-muted/70 italic leading-normal">
                This is the total amount (borrowed amount + interest) you will pay back.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/40">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-1.5 border border-border bg-card px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
            >
              {copied ? <Icons.Check className="h-4 w-4 text-emerald-500" /> : <Icons.Copy className="h-4 w-4 text-muted" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={shareCalculation}
              className="flex items-center justify-center gap-1.5 border border-border bg-card px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
            >
              {shared ? <Icons.Check className="h-4 w-4 text-emerald-500" /> : <Icons.Share2 className="h-4 w-4 text-muted" />}
              <span>{shared ? 'Shared' : 'Share'}</span>
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-1.5 border border-border bg-card px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
            >
              <Icons.Download className="h-4 w-4 text-muted" />
              <span>Schedule</span>
            </button>
          </div>
        </div>

        {/* Tab view: Amortization SVG Charts vs Yearly table */}
        <div className="bg-card border border-border rounded-2xl shadow-premium-md overflow-hidden">
          <div className="flex border-b border-border bg-secondary/15 p-1.5">
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'charts' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Interactive Charts
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'table' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Amortization Table
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'charts' ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* SVG Donut Visual */}
                <div className="sm:col-span-5 flex flex-col items-center">
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
                        className="stroke-primary/25 fill-none transition-all duration-500"
                        strokeWidth="12"
                        strokeDasharray="314.16"
                        strokeDashoffset={strokeOffset}
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="stroke-primary fill-none transition-all duration-500"
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
                      <span className="text-[10px] font-black text-muted uppercase tracking-wider">Interest</span>
                      <span className="text-xs font-bold font-mono-calc">{interestPercentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary/20" />
                      Principal: {principalPercentage.toFixed(0)}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Interest: {interestPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* SVG Amortization Bar charts visual */}
                <div className="sm:col-span-7 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block mb-1">
                    Yearly Schedule Ratio Projection
                  </span>
                  <div className="h-32 w-full flex items-end justify-between gap-1 border-b border-border/80 pb-1">
                    {schedule.slice(0, 15).map((y) => {
                      const principalRatio = (y.principalPaid / maxYearPayment) * 100;
                      const interestRatio = (y.interestPaid / maxYearPayment) * 100;
                      return (
                        <div key={y.yearNumber} className="flex-1 flex flex-col justify-end h-full relative group">
                          {/* Stacked Repayment Bar */}
                          <div className="w-full flex flex-col justify-end rounded-t overflow-hidden max-h-full">
                            <div
                              style={{ height: `${interestRatio}%` }}
                              className="w-full bg-primary transition-all duration-300"
                            />
                            <div
                              style={{ height: `${principalRatio}%` }}
                              className="w-full bg-primary/25 transition-all duration-300"
                            />
                          </div>
                          
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border p-2 rounded-lg text-[8px] font-bold uppercase tracking-wider text-foreground z-20 whitespace-nowrap shadow-premium-md">
                            <div>Year {y.yearNumber}</div>
                            <div>P: {formatCurrency(y.principalPaid)}</div>
                            <div>I: {formatCurrency(y.interestPaid)}</div>
                          </div>
                          
                          <span className="text-[7px] font-black text-muted text-center mt-1">Yr {y.yearNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="overflow-x-auto max-h-[220px] scrollbar-thin">
                <table className="w-full text-left text-xs">
                  <thead className="text-[9px] font-black uppercase tracking-widest text-muted border-b border-border/50 bg-secondary/15">
                    <tr>
                      <th className="px-4 py-2 text-center">Year</th>
                      <th className="px-4 py-2">Opening Balance</th>
                      <th className="px-4 py-2">Principal Paid</th>
                      <th className="px-4 py-2">Interest Paid</th>
                      <th className="px-4 py-2">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {schedule.map((y) => (
                      <tr key={y.yearNumber} className="hover:bg-secondary/20">
                        <td className="px-4 py-2.5 text-center font-bold">{y.yearNumber}</td>
                        <td className="px-4 py-2.5 font-semibold font-mono-calc">{formatCurrency(y.openingBalance)}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 font-mono-calc">
                          {formatCurrency(y.principalPaid)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-red-500 font-mono-calc">
                          {formatCurrency(y.interestPaid)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold font-mono-calc">{formatCurrency(y.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* History log block */}
        {history.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Recent Loans History</span>
              <button
                onClick={clearAllHistory}
                className="text-[10px] font-bold text-red-500 uppercase hover:text-red-600 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="flex items-start justify-between p-3 border border-border/60 rounded-xl bg-card hover:bg-secondary/40 text-left transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-foreground">
                      Principal: {formatCurrency(item.principal)}
                    </div>
                    <div className="text-[8px] text-muted uppercase tracking-wider font-semibold">
                      {item.rate}% Rate • {item.tenure} {item.isYears ? 'Yrs' : 'Mos'}
                    </div>
                  </div>
                  <div className="text-[9px] font-extrabold text-primary">
                    EMI: {formatCurrency(item.emi)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
