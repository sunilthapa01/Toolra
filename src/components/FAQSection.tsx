'use client';

import React, { useState } from 'react';
import * as Icons from './Icons';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  description = 'Answers to common questions about our calculations and terms.',
}: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Structured Data (JSON-LD) for Q&A Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <section className="w-full py-12 border-t border-border bg-background transition-colors duration-300">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-muted">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-250"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-foreground hover:bg-secondary/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-base sm:text-lg font-outfit pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-secondary text-foreground' : ''
                    }`}
                  >
                    <Icons.ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] border-t border-border opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="px-6 py-4 text-sm sm:text-base text-muted leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
