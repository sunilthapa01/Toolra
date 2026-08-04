'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from '@/hooks/useForm';
import * as Icons from '@/components/Icons';
import AnimatedIndianAmount from '@/components/AnimatedIndianAmount';
import { formatExactIndianCurrency } from '@/utils/currency';

interface HistoryItem {
  id: string;
  timestamp: number;
  mode: 'sip' | 'lumpsum';
  investment: number;
  rate: number;
  tenure: number;
  stepUp: number;
  investedAmount: number;
  futureValue: number;
}

interface GrowthYear {
  yearNumber: number;
  investedAmount: number;
  wealthGained: number;
  futureValue: number;
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

export default function SIPCalculator() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts');

  const { values, handleChange, handleInputChange, reset } = useForm({
    mode: 'sip' as 'sip' | 'lumpsum',
    investment: 10000, // Rs. 10,000 monthly or lumpsum
    rate: 12,          // 12%
    tenure: 10,        // 10 Years
    stepUp: 0,         // 0% step up
  });

  // Load history
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolora-sip-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const investment = typeof values.investment === 'number' ? values.investment : 0;
  const annualRate = typeof values.rate === 'number' ? values.rate : 0;
  const tenureYears = typeof values.tenure === 'number' ? values.tenure : 0;
  const stepUpRate = typeof values.stepUp === 'number' ? values.stepUp : 0;

  const monthlyRate = annualRate / 12 / 100;

  // Compute Year-by-Year Growth (including Step-up SIP or Lumpsum)
  const growthSchedule = useMemo(() => {
    const schedule: GrowthYear[] = [];
    if (investment <= 0 || annualRate <= 0 || tenureYears <= 0) return schedule;

    let balance = 0;
    let totalInvested = 0;
    let currentMonthly = investment;

    if (values.mode === 'lumpsum') {
      balance = investment;
      totalInvested = investment;
      for (let y = 1; y <= tenureYears; y++) {
        balance = balance * Math.pow(1 + annualRate / 100, 1);
        schedule.push({
          yearNumber: y,
          investedAmount: totalInvested,
          wealthGained: Math.max(0, balance - totalInvested),
          futureValue: balance,
        });
      }
    } else {
      // SIP with optional Step-up
      for (let y = 1; y <= tenureYears; y++) {
        // Compute 12 months for this year
        for (let m = 1; m <= 12; m++) {
          totalInvested += currentMonthly;
          balance = (balance + currentMonthly) * (1 + monthlyRate);
        }
        
        schedule.push({
          yearNumber: y,
          investedAmount: totalInvested,
          wealthGained: Math.max(0, balance - totalInvested),
          futureValue: balance,
        });

        // Apply Step-up at the end of the year for the next year
        if (stepUpRate > 0) {
          currentMonthly = currentMonthly * (1 + stepUpRate / 100);
        }
      }
    }

    return schedule;
  }, [values.mode, investment, annualRate, tenureYears, stepUpRate, monthlyRate]);

  const finalYear = growthSchedule[growthSchedule.length - 1] || { investedAmount: 0, wealthGained: 0, futureValue: 0 };
  const investedAmount = finalYear.investedAmount;
  const futureValue = finalYear.futureValue;
  const returns = finalYear.wealthGained;

  const animatedInvested = useCountUp(investedAmount);
  const animatedValue = useCountUp(futureValue);
  const animatedReturns = useCountUp(returns);

  const formatCurrency = (val: number) => {
    return formatExactIndianCurrency(val);
  };

  const saveToHistory = () => {
    if (investment <= 0) return;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      mode: values.mode,
      investment,
      rate: annualRate,
      tenure: tenureYears,
      stepUp: stepUpRate,
      investedAmount,
      futureValue,
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 9)];
      localStorage.setItem('toolora-sip-history', JSON.stringify(updated));
      return updated;
    });
  };

  const copyToClipboard = () => {
    const text = `${values.mode === 'sip' ? 'SIP' : 'Lumpsum'} Calculation Summary (Toolora)
--------------------------------------
Investment Mode: ${values.mode.toUpperCase()}
Amount: ${formatCurrency(investment)} ${values.mode === 'sip' ? '/ Month' : 'One-time'}
Expected Return: ${annualRate}% P.A.
Tenure: ${tenureYears} Years
${values.mode === 'sip' && stepUpRate > 0 ? `Annual Step Up: ${stepUpRate}%\n` : ''}--------------------------------------
Total Invested Capital: ${formatCurrency(investedAmount)}
Estimated Wealth Gained: ${formatCurrency(returns)}
Total Future Wealth: ${formatCurrency(futureValue)}
--------------------------------------
Calculated locally on Toolora.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    saveToHistory();
  };

  const shareCalculation = () => {
    const link = typeof window !== 'undefined'
      ? `${window.location.origin}/sip?mode=${values.mode}&amount=${investment}&rate=${annualRate}&tenure=${tenureYears}&step=${stepUpRate}`
      : '';
    navigator.clipboard.writeText(link);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const downloadCSV = () => {
    let csv = 'Year,Invested Capital,Wealth Gained,Future Value (Total Wealth)\r\n';
    growthSchedule.forEach((y) => {
      csv += `${y.yearNumber},${y.investedAmount.toFixed(2)},${y.wealthGained.toFixed(2)},${y.futureValue.toFixed(2)}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toolora-sip-wealth-${investment}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    saveToHistory();
  };

  const loadFromHistory = (item: HistoryItem) => {
    handleChange('mode', item.mode);
    handleChange('investment', item.investment);
    handleChange('rate', item.rate);
    handleChange('tenure', item.tenure);
    handleChange('stepUp', item.stepUp);
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolora-sip-history');
  };

  const handleReset = () => {
    reset();
  };

  // Donut values (Circumference 314.16)
  const investedPercentage = futureValue > 0 ? (investedAmount / futureValue) * 100 : 100;
  const returnsPercentage = futureValue > 0 ? (returns / futureValue) * 100 : 0;
  const strokeOffset = 314.16 - (314.16 * investedPercentage) / 100;

  // Max value in yearly schedule for SVG chart scaling
  const maxYearValue = useMemo(() => {
    if (growthSchedule.length === 0) return 1;
    return Math.max(...growthSchedule.map((y) => y.futureValue));
  }, [growthSchedule]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* Inputs (Left) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Toggle Mode: SIP vs Lumpsum */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">How do you want to invest?</span>
          <div className="flex bg-card border border-border p-1 rounded-2xl relative shadow-premium-sm">
            <button
              onClick={() => handleChange('mode', 'sip')}
              className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                values.mode === 'sip' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Monthly (SIP)
            </button>
            <button
              onClick={() => handleChange('mode', 'lumpsum')}
              className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                values.mode === 'lumpsum' ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              One-Time (Lumpsum)
            </button>
          </div>
        </div>

        {/* Investment Amount Input + Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">
              {values.mode === 'sip' ? 'Amount to Invest Every Month' : 'Amount to Invest Once'}
            </span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {formatCurrency(investment)}
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
            <input
              type="range"
              min="500"
              max="5000000"
              step="500"
              name="investment"
              value={investment}
              onChange={handleInputChange}
              className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                ₹
              </span>
              <input
                type="number"
                name="investment"
                value={values.investment}
                onChange={handleInputChange}
                className="block w-full pl-8 pr-4 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {[2500, 5000, 10000, 25000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleChange('investment', val)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all shrink-0 touch-target ${
                    investment === val ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-secondary/30 text-foreground hover:bg-secondary'
                  }`}
                >
                  ₹{(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              Enter the amount of cash you want to invest.
            </p>
          </div>
        </div>

        {/* Expected Annual Returns Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Expected Yearly Return Rate (%)</span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {annualRate}% P.A.
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-premium-sm">
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
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
                step="0.1"
                className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                %
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {[8, 10, 12, 15, 18].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleChange('rate', val)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all shrink-0 touch-target ${
                    annualRate === val ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-secondary/30 text-foreground hover:bg-secondary'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              The average growth rate you expect from your investment per year.
            </p>
          </div>
        </div>

        {/* Investment Period (Years) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Investment Period (Years)</span>
            <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
              {tenureYears} Years
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-premium-sm">
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              name="tenure"
              value={tenureYears}
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
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {[5, 10, 15, 20, 25, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleChange('tenure', val)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all shrink-0 touch-target ${
                    tenureYears === val ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-secondary/30 text-foreground hover:bg-secondary'
                  }`}
                >
                  {val} Yrs
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted/60 mt-1">
              How many years you want to keep your money invested.
            </p>
          </div>
        </div>

        {/* Collapsible Advanced Settings (SIP Mode Only) */}
        {values.mode === 'sip' && (
          <details className="group border border-border/60 rounded-2xl bg-card/30 transition-all overflow-hidden">
            <summary className="flex items-center justify-between px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-widest text-muted cursor-pointer hover:bg-secondary/30 select-none">
              <span>Advanced Settings</span>
              <Icons.ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 text-muted/70" />
            </summary>
            <div className="p-4 border-t border-border/50 bg-card/10 space-y-4">
              {/* Step Up SIP Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Annual Step-Up growth (%)</span>
                  <span className="text-xs font-mono-calc font-extrabold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border/80">
                    {stepUpRate}% Yearly Increase
                  </span>
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-premium-sm">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    name="stepUp"
                    value={stepUpRate}
                    onChange={handleInputChange}
                    className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      name="stepUp"
                      value={values.stepUp}
                      onChange={handleInputChange}
                      className="block w-full px-3.5 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-muted select-none">
                      %
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-muted/50 leading-relaxed">
                  Select this if you plan to increase your monthly investment amount by a certain percentage every year.
                </p>
              </div>
            </div>
          </details>
        )}

        {/* Global Controls */}
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

      {/* Outputs & Ledger (Right) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Dynamic Wealth Board */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-premium-lg space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/20">
                <Icons.Calculator className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Wealth projection ledger
              </span>
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest select-none">
              Client Computed
            </span>
          </div>

          <div className="py-2 space-y-1">
            <AnimatedIndianAmount
              value={futureValue}
              label="Total Estimated Future Wealth"
              sizeClass="text-2xl sm:text-3xl md:text-4xl font-extrabold"
              exactSizeClass="text-xs"
            />
            <p className="text-[11px] text-muted/80 leading-normal pt-1">
              <strong>Meaning:</strong> This is the total estimated value of your investment at the end of the period.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Total Cash Invested</span>
              <div className="text-base sm:text-lg font-extrabold text-foreground truncate">
                {formatCurrency(investedAmount)}
              </div>
              <p className="text-[10px] text-muted/70 italic leading-normal">
                This is the total cash you put in out of your pocket over the years.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Estimated Profit (Returns)</span>
              <div className="text-base sm:text-lg font-extrabold text-foreground truncate text-emerald-600 dark:text-emerald-400">
                {formatCurrency(returns)}
              </div>
              <p className="text-[10px] text-muted/70 italic leading-normal">
                This is the estimated wealth generated by your money (compound growth).
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
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Tab view: Growth SVG Charts vs Yearly table */}
        <div className="bg-card border border-border rounded-2xl shadow-premium-md overflow-hidden">
          <div className="flex border-b border-border bg-secondary/15 p-1.5">
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'charts' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Wealth Projection Charts
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'table' ? 'bg-card text-foreground border border-border shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Yearly Projections Table
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
                        className="stroke-primary/20 fill-none transition-all duration-500"
                        strokeWidth="12"
                        strokeDasharray="314.16"
                        strokeDashoffset={strokeOffset}
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="stroke-emerald-500 dark:stroke-emerald-400 fill-none transition-all duration-500"
                        strokeWidth="12"
                        strokeDasharray="314.16"
                        strokeDashoffset={314.16}
                        style={{
                          strokeDashoffset: 314.16 - (314.16 * returnsPercentage) / 100,
                          transformOrigin: 'center',
                          transform: `rotate(${(investedPercentage / 100) * 360}deg)`,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-muted uppercase tracking-wider">Returns</span>
                      <span className="text-xs font-bold font-mono-calc text-emerald-600 dark:text-emerald-400">
                        {returnsPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary/25" />
                      Invested: {investedPercentage.toFixed(0)}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Returns: {returnsPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* SVG Amortization Bar charts visual */}
                <div className="sm:col-span-7 space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted block mb-1">
                    Yearly Wealth Gained Projection
                  </span>
                  <div className="h-32 w-full flex items-end justify-between gap-1 border-b border-border/80 pb-1">
                    {growthSchedule.slice(0, 15).map((y) => {
                      const investedRatio = (y.investedAmount / maxYearValue) * 100;
                      const returnsRatio = (y.wealthGained / maxYearValue) * 100;
                      return (
                        <div key={y.yearNumber} className="flex-1 flex flex-col justify-end h-full relative group">
                          {/* Stacked Repayment Bar */}
                          <div className="w-full flex flex-col justify-end rounded-t overflow-hidden max-h-full">
                            <div
                              style={{ height: `${returnsRatio}%` }}
                              className="w-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-300"
                            />
                            <div
                              style={{ height: `${investedRatio}%` }}
                              className="w-full bg-primary/25 transition-all duration-300"
                            />
                          </div>
                          
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-card border border-border p-2 rounded-lg text-[8px] font-bold uppercase tracking-wider text-foreground z-20 whitespace-nowrap shadow-premium-md">
                            <div>Year {y.yearNumber}</div>
                            <div>Invested: {formatCurrency(y.investedAmount)}</div>
                            <div>Returns: {formatCurrency(y.wealthGained)}</div>
                            <div className="text-primary font-black">Total: {formatCurrency(y.futureValue)}</div>
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
                      <th className="px-4 py-2">Invested Capital</th>
                      <th className="px-4 py-2">Wealth Gained</th>
                      <th className="px-4 py-2">Future Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {growthSchedule.map((y) => (
                      <tr key={y.yearNumber} className="hover:bg-secondary/20">
                        <td className="px-4 py-2.5 text-center font-bold">{y.yearNumber}</td>
                        <td className="px-4 py-2.5 font-semibold font-mono-calc">{formatCurrency(y.investedAmount)}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 font-mono-calc">
                          {formatCurrency(y.wealthGained)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold font-mono-calc">{formatCurrency(y.futureValue)}</td>
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
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Recent SIPs History</span>
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
                      {item.mode === 'sip' ? 'SIP' : 'Lumpsum'}: {formatCurrency(item.investment)}
                    </div>
                    <div className="text-[8px] text-muted uppercase tracking-wider font-semibold">
                      {item.rate}% Rate • {item.tenure} Yrs {item.stepUp > 0 ? `• +${item.stepUp}% StepUp` : ''}
                    </div>
                  </div>
                  <div className="text-[9px] font-extrabold text-primary">
                    Value: {formatCurrency(item.futureValue)}
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
