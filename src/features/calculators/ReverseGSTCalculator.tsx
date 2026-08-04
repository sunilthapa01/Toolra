'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@/hooks/useForm';
import * as Icons from '@/components/Icons';
import AnimatedIndianAmount from '@/components/AnimatedIndianAmount';
import { formatExactIndianCurrency } from '@/utils/currency';

interface HistoryItem {
  id: string;
  timestamp: number;
  totalAmount: number;
  gstRate: number;
  baseAmount: number;
  gstAmount: number;
  isInterstate: boolean;
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

export default function ReverseGSTCalculator() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { values, handleChange, handleInputChange, reset } = useForm({
    amount: 1180,
    gstRate: 18,
    isInterstate: false,
    customRate: '',
  });

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('toolora-reverse-gst-history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalAmount = typeof values.amount === 'number' ? values.amount : 0;
  const gstRate = values.customRate !== '' ? parseFloat(values.customRate) || 0 : values.gstRate;

  // Reverse GST Formulas:
  // Base Price = Total / (1 + Rate/100)
  // GST Amount = Total - Base Price
  const baseAmount = totalAmount / (1 + gstRate / 100);
  const gstAmount = totalAmount - baseAmount;

  const cgst = values.isInterstate ? 0 : gstAmount / 2;
  const sgst = values.isInterstate ? 0 : gstAmount / 2;
  const igst = values.isInterstate ? gstAmount : 0;

  const animatedTotal = useCountUp(totalAmount);
  const animatedBase = useCountUp(baseAmount);
  const animatedTax = useCountUp(gstAmount);

  const formatCurrency = (val: number) => {
    return formatExactIndianCurrency(val);
  };

  // Add calculation to history log (debounced or on trigger)
  const saveToHistory = () => {
    if (totalAmount <= 0) return;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      totalAmount,
      gstRate,
      baseAmount,
      gstAmount,
      isInterstate: values.isInterstate,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 9)]; // Keep last 10 entries
      localStorage.setItem('toolora-reverse-gst-history', JSON.stringify(updated));
      return updated;
    });
  };

  const copyToClipboard = () => {
    const text = `Reverse GST Extract Summary (Toolora)
--------------------------------------
Calculation Mode: Reverse GST Extraction (Inclusive)
Transaction Type: ${values.isInterstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}
GST Rate Applied: ${gstRate}%
--------------------------------------
Gross Bill Amount: ${formatCurrency(totalAmount)}
Extracted Base Price: ${formatCurrency(baseAmount)}
Extracted Tax Amount: ${formatCurrency(gstAmount)}
${values.isInterstate ? `IGST: ${formatCurrency(igst)}` : `CGST: ${formatCurrency(cgst)}\nSGST: ${formatCurrency(sgst)}`}
--------------------------------------
Calculated locally on Toolora.com`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    saveToHistory();
  };

  const shareCalculation = () => {
    const link = typeof window !== 'undefined'
      ? `${window.location.origin}/reverse-gst?amount=${totalAmount}&rate=${gstRate}&inter=${values.isInterstate}`
      : '';
    navigator.clipboard.writeText(link);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const downloadTextInvoice = () => {
    const text = `======================================
         TOOLORA RECEIPTS
======================================
Date: ${new Date().toLocaleString()}
Mode: Reverse GST (Inclusive Extraction)
GST Rate: ${gstRate}%
Transaction: ${values.isInterstate ? 'Interstate' : 'Intrastate'}

--------------------------------------
Gross Value:          ${formatCurrency(totalAmount)}
Base Price:           ${formatCurrency(baseAmount)}
GST Component:        ${formatCurrency(gstAmount)}

${
  values.isInterstate
    ? `IGST (100%):         ${formatCurrency(igst)}`
    : `CGST (50%):          ${formatCurrency(cgst)}\nSGST (50%):          ${formatCurrency(sgst)}`
}
--------------------------------------
🔒 Computations executed client-side.
Your calculations remain completely private.
======================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toolora-reverse-gst-${totalAmount}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    saveToHistory();
  };

  const loadFromHistory = (item: HistoryItem) => {
    handleChange('amount', item.totalAmount);
    handleChange('isInterstate', item.isInterstate);
    if ([5, 12, 18, 28].includes(item.gstRate)) {
      handleChange('gstRate', item.gstRate);
      handleChange('customRate', '');
    } else {
      handleChange('customRate', item.gstRate.toString());
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolora-reverse-gst-history');
  };

  const handleReset = () => {
    reset();
  };

  const basePercentage = totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 100;
  const taxPercentage = totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0;

  const standardRates = [5, 12, 18, 28];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* Input panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Inclusive Amount Box */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Total Price (Already Includes GST)</span>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/60 transition-all">
            <div className="flex items-center">
              <span className="text-3xl font-semibold text-muted select-none mr-2">₹</span>
              <input
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleInputChange}
                className="block w-full border-0 bg-transparent p-0 text-3xl font-mono-calc font-extrabold text-foreground focus:ring-0 outline-none placeholder:text-muted/20"
                placeholder="0.00"
              />
            </div>
            <div className="text-[10px] text-muted/60 mt-2.5 font-semibold uppercase">
              Enter the final price paid or charged to separate the original price and tax.
            </div>
          </div>
        </div>

        {/* GST Rate Panel */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Choose the GST Tax Rate Preset to extract</span>
            <span className="text-[10px] font-bold text-primary uppercase bg-secondary px-2 py-0.5 rounded-md">
              {gstRate}%
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {standardRates.map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  handleChange('customRate', '');
                  handleChange('gstRate', rate);
                }}
                className={`py-3 rounded-xl border text-xs font-bold transition-all shadow-premium-sm ${
                  values.customRate === '' && values.gstRate === rate
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:bg-secondary text-foreground'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-muted uppercase">
              Custom Rate
            </div>
            <input
              type="number"
              name="customRate"
              value={values.customRate}
              onChange={handleInputChange}
              placeholder="Enter custom rate..."
              className="block w-full pl-28 pr-4 py-3 text-xs font-bold border border-border bg-card rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-muted/40"
            />
          </div>
          <p className="text-[10px] text-muted/60 leading-normal">
            GST is a value-added tax. We will extract this percentage from your total price to find the original price.
          </p>
        </div>

        {/* Region State Scope */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Customer Location</span>
          <div className="flex bg-card border border-border p-1 rounded-2xl relative shadow-premium-sm">
            <button
              onClick={() => handleChange('isInterstate', false)}
              className={`flex-1 py-2 sm:py-2.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                !values.isInterstate ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Same State (Local)
            </button>
            <button
              onClick={() => handleChange('isInterstate', true)}
              className={`flex-1 py-2 sm:py-2.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                values.isInterstate ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Out of State (IGST)
            </button>
          </div>
          <p className="text-[10px] text-muted/60 leading-normal">
            {values.isInterstate
              ? "Applies a single tax (IGST) for interstate transactions."
              : "Splits the tax equally between Central (CGST) and State (SGST) governments."}
          </p>
        </div>

        {/* Global form controls */}
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

      {/* Output Panel (Right) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-premium-lg flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Header Deck */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/20">
                <Icons.Calculator className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Extraction Ledger
              </span>
            </div>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest select-none">
              Client Computed
            </span>
          </div>

          {/* Large Hero Gross Amount */}
          <div className="py-6 border-b border-border/40 space-y-1">
            <AnimatedIndianAmount
              value={totalAmount}
              label="Final Price (Includes GST)"
              sizeClass="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              exactSizeClass="text-xs"
            />
            <p className="text-[11px] text-muted/80 leading-normal pt-1">
              <strong>Meaning:</strong> This is the total price paid by the customer, which already includes the tax.
            </p>
          </div>

          {/* Proportional Split Bar Visual */}
          <div className="space-y-2 pt-4">
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
              <div
                style={{ width: `${basePercentage}%` }}
                className="h-full bg-primary/25 transition-all duration-300"
                title={`Original Amount: ${basePercentage.toFixed(1)}%`}
              />
              <div
                style={{ width: `${taxPercentage}%` }}
                className="h-full bg-primary transition-all duration-300"
                title={`Extracted GST Tax: ${taxPercentage.toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
              <span>Original Price: {basePercentage.toFixed(0)}%</span>
              <span>GST Tax ({gstRate}%): {taxPercentage.toFixed(0)}%</span>
            </div>
          </div>

          {/* Separation line */}
          <div className="border-t border-dashed border-border my-6" />

          {/* Ledger detail rows */}
          <div className="space-y-5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Original Amount (Before GST)</span>
                <AnimatedIndianAmount value={baseAmount} sizeClass="text-base sm:text-lg font-extrabold text-foreground" />
              </div>
              <p className="text-[10px] text-muted/70 italic">
                This is the original price of the goods or services before the tax was added.
              </p>
            </div>

            {values.isInterstate ? (
              <div className="space-y-2 border-t border-border/30 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Integrated Tax (IGST - {gstRate}%)</span>
                  <AnimatedIndianAmount value={igst} sizeClass="text-base sm:text-lg font-extrabold text-foreground" />
                </div>
                <p className="text-[10px] text-muted/70 italic pt-1">
                  Single tax portion extracted for sales to another state.
                </p>
              </div>
            ) : (
              <div className="space-y-3 border-t border-border/30 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Central Tax (CGST - {gstRate / 2}%)</span>
                  <AnimatedIndianAmount value={cgst} sizeClass="text-base sm:text-lg font-extrabold text-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">State Tax (SGST - {gstRate / 2}%)</span>
                  <AnimatedIndianAmount value={sgst} sizeClass="text-base sm:text-lg font-extrabold text-foreground" />
                </div>
                <p className="text-[10px] text-muted/70 italic pt-1">
                  Central and State tax portions extracted for local (same-state) transactions.
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-1 border-t border-border/30 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">GST Tax Portion (Extracted)</span>
                <AnimatedIndianAmount value={gstAmount} sizeClass="text-base sm:text-lg font-extrabold text-foreground" />
              </div>
              <p className="text-[10px] text-muted/70 italic">
                This is the total tax amount that was hidden inside the total price.
              </p>
            </div>
          </div>

          {/* Quick Ledger Action Bar */}
          <div className="grid grid-cols-3 gap-3 pt-8 border-t border-border/40 mt-6">
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
              onClick={downloadTextInvoice}
              className="flex items-center justify-center gap-1.5 border border-border bg-card px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all shadow-premium-sm"
            >
              <Icons.Download className="h-4 w-4 text-muted" />
              <span>Receipt</span>
            </button>
          </div>
        </div>

        {/* History Log Card */}
        {history.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-premium-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Recent Calculations History</span>
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
                      Total: {formatCurrency(item.totalAmount)}
                    </div>
                    <div className="text-[8px] text-muted uppercase tracking-wider font-semibold">
                      GST {item.gstRate}% • {item.isInterstate ? 'IGST' : 'CGST/SGST'}
                    </div>
                  </div>
                  <div className="text-[9px] font-extrabold text-primary">
                    Base: {formatCurrency(item.baseAmount)}
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
