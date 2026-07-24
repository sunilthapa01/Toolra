'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@/hooks/useForm';
import * as Icons from '@/components/Icons';
import AnimatedIndianAmount from '@/components/AnimatedIndianAmount';
import { formatExactIndianCurrency } from '@/utils/currency';

function useCountUp(target: number, duration: number = 300) {
  const [count, setCount] = useState(target);
  const prevTargetRef = useRef(target);

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
    prevTargetRef.current = target;
  }, [target]);

  return count;
}

export default function GSTCalculator() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const { values, handleChange, handleInputChange } = useForm({
    amount: 1000,
    gstRate: 18,
    isInclusive: false,
    isInterstate: false,
    customRate: '',
  });

  const amount = typeof values.amount === 'number' ? values.amount : 0;
  const gstRate = values.customRate !== '' ? parseFloat(values.customRate) || 0 : values.gstRate;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (values.isInclusive) {
    baseAmount = amount / (1 + gstRate / 100);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    baseAmount = amount;
    gstAmount = amount * (gstRate / 100);
    totalAmount = amount + gstAmount;
  }

  const cgst = values.isInterstate ? 0 : gstAmount / 2;
  const sgst = values.isInterstate ? 0 : gstAmount / 2;
  const igst = values.isInterstate ? gstAmount : 0;

  const animatedTotal = useCountUp(totalAmount);
  const animatedBase = useCountUp(baseAmount);
  const animatedTax = useCountUp(gstAmount);

  const formatCurrency = (val: number) => {
    return formatExactIndianCurrency(val);
  };

  const copyToClipboard = () => {
    const text = `GST Calculation Summary (Toolora)
--------------------------------------
Calculation Mode: GST ${values.isInclusive ? 'Inclusive' : 'Exclusive'}
Transaction Type: ${values.isInterstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}
GST Rate: ${gstRate}%
--------------------------------------
Net Amount (Base): ${formatCurrency(baseAmount)}
GST Amount (Tax): ${formatCurrency(gstAmount)}
${values.isInterstate ? `IGST: ${formatCurrency(igst)}` : `CGST: ${formatCurrency(cgst)}\nSGST: ${formatCurrency(sgst)}`}
--------------------------------------
Total Amount (Gross): ${formatCurrency(totalAmount)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCalculation = () => {
    const link = typeof window !== 'undefined'
      ? `${window.location.origin}/tools/gst-calculator?amount=${amount}&rate=${gstRate}&inc=${values.isInclusive}&inter=${values.isInterstate}`
      : '';
    navigator.clipboard.writeText(link);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'x' || key === 'e') {
        e.preventDefault();
        handleChange('isInclusive', !values.isInclusive);
      } else if (key === 's' || key === 't') {
        e.preventDefault();
        handleChange('isInterstate', !values.isInterstate);
      } else if (key === '1') {
        e.preventDefault();
        handleChange('customRate', '');
        handleChange('gstRate', 5);
      } else if (key === '2') {
        e.preventDefault();
        handleChange('customRate', '');
        handleChange('gstRate', 12);
      } else if (key === '3') {
        e.preventDefault();
        handleChange('customRate', '');
        handleChange('gstRate', 18);
      } else if (key === '4') {
        e.preventDefault();
        handleChange('customRate', '');
        handleChange('gstRate', 28);
      } else if (key === 'c') {
        e.preventDefault();
        copyToClipboard();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [values, handleChange]);

  const basePercentage = totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 100;
  const taxPercentage = totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0;

  const standardRates = [5, 12, 18, 28];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* Input panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Toggle Calculation Mode - Segmented Tab Slider */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">GST Calculation Mode</span>
          <div className="flex bg-card border border-border p-1 rounded-2xl relative shadow-premium-sm">
            <button
              onClick={() => handleChange('isInclusive', false)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                !values.isInclusive ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Add GST to Price
            </button>
            <button
              onClick={() => handleChange('isInclusive', true)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                values.isInclusive ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Price Already Includes GST
            </button>
          </div>
        </div>

        {/* Input amount block - high affordance box */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">
            {values.isInclusive ? "Total Price (Already Includes GST)" : "Original Amount (Before GST)"}
          </span>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-premium-md focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/60 transition-all">
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
              {values.isInclusive 
                ? "Enter the total amount paid by the customer to see the original price." 
                : "Enter the product price before tax is added."}
            </div>
          </div>
        </div>

        {/* Tax rates preset board - recognizable rounded buttons */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">GST Tax Rate preset</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-secondary px-2 py-0.5 rounded-md">
              {gstRate}%
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {standardRates.map((rate) => {
              const isSelected = values.customRate === '' && values.gstRate === rate;
              return (
                <button
                  key={rate}
                  onClick={() => {
                    handleChange('customRate', '');
                    handleChange('gstRate', rate);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold font-outfit border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-premium-sm ring-1 ring-emerald-500/30'
                      : 'border-border bg-card text-foreground hover:bg-secondary/40'
                  }`}
                >
                  {rate}%
                </button>
              );
            })}
            <div className="relative border border-border bg-card focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 rounded-xl shadow-premium-sm transition-all duration-200">
              <input
                type="number"
                name="customRate"
                value={values.customRate}
                onChange={handleInputChange}
                className="block w-full border-0 bg-transparent px-1 py-2 text-xs text-foreground focus:ring-0 outline-none text-center placeholder:text-muted/40 font-bold"
                placeholder="Custom"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted/60 leading-normal">
            GST is a value-added tax applied to goods and services. Common rates are 5%, 12%, 18%, or 28%.
          </p>
        </div>

        {/* Supply scope - Segmented switcher */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Customer Location</span>
          <div className="flex bg-card border border-border p-1 rounded-2xl relative shadow-premium-sm">
            <button
              onClick={() => handleChange('isInterstate', false)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                !values.isInterstate ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Same State (Local Sale)
            </button>
            <button
              onClick={() => handleChange('isInterstate', true)}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-all rounded-xl relative z-10 ${
                values.isInterstate ? 'text-primary-foreground bg-primary shadow-premium-sm' : 'text-muted hover:text-foreground'
              }`}
            >
              Different State (Out of State)
            </button>
          </div>
          <p className="text-[10px] text-muted/60 leading-normal">
            {values.isInterstate 
              ? "Applies a single tax (IGST) for interstate transactions." 
              : "Splits the tax equally between Central (CGST) and State (SGST) governments."}
          </p>
        </div>

      </div>

      {/* Invoice Cash Receipt Layout (High Trustworthiness & Recognition) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Receipt Container */}
        <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-premium-lg relative overflow-hidden">
          
          {/* Header invoice stamp */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                GST Calculation Receipt
              </span>
              <div className="text-[10px] text-muted font-bold uppercase tracking-wider pt-1.5">
                Computed locally in your browser
              </div>
            </div>
            <Icons.Calculator className="h-5 w-5 text-emerald-600" />
          </div>

          {/* Main Giant Amount Box */}
          <div className="pt-2 space-y-1">
            <AnimatedIndianAmount
              value={totalAmount}
              label="Final Price (Total Amount)"
              sizeClass="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              exactSizeClass="text-xs"
            />
            <p className="text-[11px] text-muted/80 leading-normal pt-1">
              <strong>Meaning:</strong> This is the total amount (original price + tax) that the customer will pay.
            </p>
          </div>

          {/* Proportional Split Bar Visual - Emerald theme */}
          <div className="space-y-2 pt-2">
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
              <div
                style={{ width: `${basePercentage}%` }}
                className="h-full bg-foreground/20 dark:bg-foreground/10 transition-all duration-300"
                title={`Original Amount: ${basePercentage.toFixed(1)}%`}
              />
              <div
                style={{ width: `${taxPercentage}%` }}
                className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-300"
                title={`GST Tax: ${taxPercentage.toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
              <span>Original Price: {basePercentage.toFixed(0)}%</span>
              <span>Tax ({gstRate}%): {taxPercentage.toFixed(0)}%</span>
            </div>
          </div>

          {/* Dashed line separation - cash receipt affordance */}
          <div className="border-t border-dashed border-border my-4" />

          {/* Invoice Ledger Lines */}
          <div className="space-y-5 text-sm">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted text-xs font-bold uppercase tracking-wider">Original Amount (Before GST)</span>
                <AnimatedIndianAmount
                  value={baseAmount}
                  showExactSub={false}
                  sizeClass="text-base sm:text-lg font-extrabold"
                />
              </div>
              <p className="text-[10px] text-muted/70 italic">
                This is the base price of the item/service before any tax is added.
              </p>
            </div>

            {!values.isInterstate ? (
              <div className="space-y-3 pl-3 border-l-2 border-emerald-500/40 text-xs">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted font-bold uppercase tracking-wider">Central Tax (CGST - {gstRate / 2}%)</span>
                  <AnimatedIndianAmount
                    value={gstAmount / 2}
                    showExactSub={false}
                    sizeClass="text-sm font-semibold"
                  />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted font-bold uppercase tracking-wider">State Tax (SGST - {gstRate / 2}%)</span>
                  <AnimatedIndianAmount
                    value={gstAmount / 2}
                    showExactSub={false}
                    sizeClass="text-sm font-semibold"
                  />
                </div>
                <p className="text-[10px] text-muted/70 italic pt-1">
                  Central and State taxes collected for local (same-state) transactions.
                </p>
              </div>
            ) : (
              <div className="space-y-2 pl-3 border-l-2 border-emerald-500/40 text-xs">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted font-bold uppercase tracking-wider">Integrated Tax (IGST - {gstRate}%)</span>
                  <AnimatedIndianAmount
                    value={gstAmount}
                    showExactSub={false}
                    sizeClass="text-sm font-semibold"
                  />
                </div>
                <p className="text-[10px] text-muted/70 italic pt-1">
                  Single tax collected for transactions with customers in other states.
                </p>
              </div>
            )}

            <div className="border-t border-border/40 pt-4 flex flex-col space-y-1">
              <div className="flex justify-between items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-muted">Total GST Tax</span>
                <AnimatedIndianAmount
                  value={gstAmount}
                  showExactSub={false}
                  sizeClass="text-lg font-black text-emerald-600"
                />
              </div>
              <p className="text-[10px] text-muted/70 italic">
                This is the total tax amount you collect from the customer.
              </p>
            </div>
          </div>

        </div>

        {/* Action buttons deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 bg-foreground text-background py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-premium-sm active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Icons.Check className="h-4.5 w-4.5" />
                <span>Saved to Clipboard</span>
              </>
            ) : (
              <>
                <Icons.Copy className="h-4.5 w-4.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={shareCalculation}
            className="flex items-center justify-center gap-2 border border-border bg-card text-foreground py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-premium-sm active:scale-[0.98]"
          >
            {shared ? (
              <>
                <Icons.Check className="h-4.5 w-4.5" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Icons.Share2 className="h-4.5 w-4.5" />
                <span>Share Calculation</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
