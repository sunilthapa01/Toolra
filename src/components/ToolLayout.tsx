'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import * as Icons from './Icons';
import { toolsRegistry } from '@/tools/registry';
import { FAQItem, ToolContent } from '@/tools/types';

interface ToolLayoutProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  faqs: FAQItem[];
  seoContent?: React.ReactNode;
  content?: ToolContent;
  children: React.ReactNode;
}

export default function ToolLayout({
  slug,
  title,
  description,
  category,
  categoryName,
  faqs,
  seoContent,
  content,
  children,
}: ToolLayoutProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const breadcrumbSteps = [
    { name: categoryName, href: `/#${category}` },
    { name: title },
  ];

  // Define active sections dynamically based on content availability
  const activeSections = useMemo(() => {
    return [
      { id: 'hero', label: 'Calculator' },
      ...(content ? [
        { id: 'what-is-this', label: 'What is this?' },
        { id: 'how-to-use', label: 'How to Use' },
        { id: 'examples', label: 'Worked Examples' },
        { id: 'formula', label: 'Formula & Logic' },
        { id: 'common-mistakes', label: 'Common Mistakes' },
        { id: 'tips', label: 'Professional Tips' },
      ] : []),
      ...(faqs && faqs.length > 0 ? [{ id: 'faq', label: 'FAQ' }] : []),
      { id: 'related-tools', label: 'Related Tools' },
      { id: 'recent-articles', label: 'Recent Articles' },
    ];
  }, [content, faqs]);

  // Setup ScrollSpy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-15% 0px -65% 0px', // Trigger in the upper-middle of viewport
      }
    );

    activeSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      activeSections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [activeSections]);

  // Category specific trust badge & color tokens
  const categoryThemes: Record<string, { badge: string; text: string; bg: string }> = {
    finance: {
      badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      text: 'text-emerald-500',
      bg: 'from-emerald-500/5 to-transparent',
    },
    developer: {
      badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      text: 'text-blue-500',
      bg: 'from-blue-500/5 to-transparent',
    },
    pdf: {
      badge: 'bg-red-500/10 text-red-500 border-red-500/20',
      text: 'text-red-500',
      bg: 'from-red-500/5 to-transparent',
    },
    text: {
      badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      text: 'text-purple-500',
      bg: 'from-purple-500/5 to-transparent',
    },
    business: {
      badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      text: 'text-amber-500',
      bg: 'from-amber-500/5 to-transparent',
    },
  };

  const theme = categoryThemes[category] || {
    badge: 'bg-primary/10 text-primary border-primary/20',
    text: 'text-primary',
    bg: 'from-primary/5 to-transparent',
  };

  // Find related tools (same category, different slug)
  const relatedTools = useMemo(() => {
    return Object.values(toolsRegistry)
      .filter((t) => t.category === category && t.slug !== slug)
      .slice(0, 3);
  }, [category, slug]);

  // Mock Recent Articles tailored to the tool category
  const recentArticles = useMemo(() => {
    const articlesMap: Record<string, { title: string; desc: string; readTime: string; date: string }[]> = {
      finance: [
        {
          title: '5 Smart Tax Planning Strategies for Small Businesses',
          desc: 'Learn how to legally reduce your business tax liabilities and optimize input credit claims with these expert tips.',
          readTime: '6 min read',
          date: 'July 24, 2026',
        },
        {
          title: 'Should You Prepay Your Home Loan or Invest in Mutual Funds?',
          desc: 'A complete mathematical breakdown evaluating reducing interest rates against systematic compound yields.',
          readTime: '8 min read',
          date: 'July 18, 2026',
        },
        {
          title: 'A Complete Beginner Guide to Indian GST Return Filing Slabs',
          desc: 'Demystifying the process of GSTR filing, state-wise CGST + SGST splits, and interstate IGST guidelines.',
          readTime: '5 min read',
          date: 'July 12, 2026',
        },
      ],
      pdf: [
        {
          title: 'Why Client-Side Web Utilities Are Safer for Corporate Documents',
          desc: 'Avoid data leaks by executing conversions inside the browser environment without database uploads.',
          readTime: '4 min read',
          date: 'July 20, 2026',
        },
        {
          title: 'How to Correctly Format and Redact PDFs Before Sharing Them',
          desc: 'Best practices for securing sensitive financial reports, including data masking and page separation.',
          readTime: '5 min read',
          date: 'July 15, 2026',
        },
      ],
      developer: [
        {
          title: '10 Vital JSON Best Practices for Enterprise Backend Architecture',
          desc: 'Understand schema validation, standard serialization limits, and clean formatting formats.',
          readTime: '7 min read',
          date: 'July 22, 2026',
        },
        {
          title: 'Client-Side Encoding Formats: Base64, Hex, and URL Encodings',
          desc: 'Deep dive into local encoding practices to secure tokens and payloads before API transit.',
          readTime: '6 min read',
          date: 'July 10, 2026',
        },
      ],
    };

    return articlesMap[category] || [
      {
        title: 'Building a Private-by-Default Online Utilities Platform',
        desc: 'How client-side computing preserves user confidentiality and improves page rendering times.',
        readTime: '5 min read',
        date: 'July 25, 2026',
      },
      {
        title: 'Maximizing Productivity with Micro-Calculators and Converters',
        desc: 'How using modular, lightweight tools improves daily administrative and development speeds.',
        readTime: '4 min read',
        date: 'July 19, 2026',
      },
    ];
  }, [category]);

  // Schema data for JSON-LD Q&A (SEO best practice)
  const faqSchema = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }, [faqs]);

  // Schema data for WebApplication / Calculator (SEO best practice)
  const appSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${title} - Toolora`,
      url: `https://toolora.com/tools/${slug}`,
      description: description,
      applicationCategory: 'Utility',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
    };
  }, [title, slug, description]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* JSON-LD Schemas */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* Main Content Layout */}
      <main className="flex-1 w-full py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb steps={breadcrumbSteps} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
            
            {/* Left Column: Content Resource */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-16">
              
              {/* Section 1: Hero & Calculator */}
              <section id="hero" className="scroll-mt-24 space-y-8">
                <header className="max-w-3xl space-y-4">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                    {categoryName}
                  </span>
                  <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    {title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted leading-relaxed">
                    {description}
                  </p>
                </header>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-card shadow-premium-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                      <Icons.Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-outfit text-foreground uppercase tracking-wider">100% Client-Side</h4>
                      <p className="text-[10px] text-muted">Zero Server Uploads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                      <Icons.Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-outfit text-foreground uppercase tracking-wider">Secure & Compliant</h4>
                      <p className="text-[10px] text-muted">GDPR Protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                      <Icons.Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-outfit text-foreground uppercase tracking-wider">No Sign-up</h4>
                      <p className="text-[10px] text-muted">Instant Access</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                      <Icons.Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-outfit text-foreground uppercase tracking-wider">Real-Time</h4>
                      <p className="text-[10px] text-muted">Instant Computing</p>
                    </div>
                  </div>
                </div>

                {/* Calculator Component Wrapper */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-premium-md relative overflow-hidden">
                  <div className={`absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl ${theme.bg} rounded-full blur-3xl -z-10`} />
                  {children}
                </div>
              </section>

              {/* Section 2: What is this Tool? */}
              {content?.whatIsThis && (
                <section id="what-is-this" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                      What is the {title}?
                    </h2>
                    <p className="text-base text-muted leading-relaxed">
                      {content.whatIsThis.overview}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                      <h3 className="text-lg font-bold font-outfit text-foreground flex items-center gap-2">
                        <Icons.Info className="h-5 w-5 text-primary" />
                        Why it Exists
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {content.whatIsThis.whyExists}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                      <h3 className="text-lg font-bold font-outfit text-foreground flex items-center gap-2">
                        <Icons.Sparkles className="h-5 w-5 text-primary" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-2">
                        {content.whatIsThis.benefits.map((benefit, i) => (
                          <li key={i} className="text-xs sm:text-sm text-muted flex items-start gap-2">
                            <span className="text-primary mt-1">✔</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                      <h3 className="text-lg font-bold font-outfit text-foreground">
                        Real-World Use Cases
                      </h3>
                      <ul className="space-y-3">
                        {content.whatIsThis.realWorldUseCases.map((useCase, i) => (
                          <li key={i} className="text-xs sm:text-sm text-muted flex items-start gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                      <h3 className="text-lg font-bold font-outfit text-foreground">
                        Who Should Use It?
                      </h3>
                      <ul className="space-y-3">
                        {content.whatIsThis.whoShouldUse.map((userType, i) => (
                          <li key={i} className="text-xs sm:text-sm text-muted flex items-center gap-2.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{userType}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* Section 3: How to Use */}
              {content?.howToUseSteps && (
                <section id="how-to-use" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Step-by-Step: How to Use
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.howToUseSteps.map((step, i) => (
                      <div key={i} className="relative rounded-2xl border border-border bg-card p-6 flex items-start gap-4 hover:border-primary/20 transition-all duration-300">
                        <span className="font-outfit text-4xl font-extrabold text-primary/10 select-none">
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <p className="text-sm sm:text-base text-muted leading-relaxed pt-1.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 4: Worked Examples */}
              {content?.workedExamples && (
                <section id="examples" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Practical Worked Examples
                  </h2>
                  <div className="space-y-5">
                    {content.workedExamples.map((example, i) => (
                      <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-bold font-outfit text-foreground">
                            {example.title}
                          </h3>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Example {i + 1}
                          </span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                          <strong className="text-foreground">Scenario:</strong> {example.scenario}
                        </p>
                        <div className="bg-secondary/40 border border-border rounded-xl p-4 font-mono text-xs sm:text-sm text-foreground overflow-x-auto space-y-1">
                          <div className="text-muted">// Calculation Step</div>
                          <div>{example.calculation}</div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted font-outfit">
                          <strong className="text-foreground">Calculated Result:</strong> {example.result}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 5: Formula & Logic */}
              {content?.formulaDetails && (
                <section id="formula" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Mathematical Formula & Calculation Logic
                  </h2>
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
                    <pre className="bg-secondary/60 border border-border/80 rounded-xl p-5 font-mono text-sm text-foreground overflow-x-auto">
                      {content.formulaDetails.equation}
                    </pre>

                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {content.formulaDetails.explanation}
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border border-t border-border/60">
                        <thead>
                          <tr className="text-left font-outfit text-xs font-bold text-foreground uppercase tracking-wider">
                            <th className="py-3 pr-4">Variable</th>
                            <th className="py-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-xs sm:text-sm text-muted leading-relaxed">
                          {content.formulaDetails.variables.map((variable, i) => (
                            <tr key={i}>
                              <td className="py-3 pr-4 font-mono font-bold text-foreground">{variable.name}</td>
                              <td className="py-3">{variable.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Section 6: Common Mistakes */}
              {content?.commonMistakes && (
                <section id="common-mistakes" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Common Mistakes to Avoid
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.commonMistakes.map((item, i) => (
                      <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="bg-red-500/10 border-b border-border/60 px-5 py-3 flex items-center gap-2">
                          <Icons.AlertCircle className="h-4 w-4 text-red-500" />
                          <h3 className="text-xs sm:text-sm font-bold font-outfit text-red-500 uppercase tracking-wide">
                            {item.title}
                          </h3>
                        </div>
                        <div className="p-5 space-y-3 text-xs sm:text-sm text-muted leading-relaxed">
                          <p>
                            <span className="font-bold text-foreground">Mistake:</span> {item.mistake}
                          </p>
                          <p className="border-t border-border/40 pt-3">
                            <span className="font-bold text-primary">Correct Approach:</span> {item.correction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Section 7: Professional Tips */}
              {content?.tips && (
                <section id="tips" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Professional Tips
                  </h2>
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {content.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-primary text-base select-none mt-0.5">★</span>
                        <p className="text-sm sm:text-base text-muted leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Fallback Legacy SEO Content */}
              {seoContent && !content && (
                <section className="prose dark:prose-invert max-w-none border-t border-border/60 pt-12">
                  {seoContent}
                </section>
              )}

              {/* Section 8: FAQ Section */}
              {faqs && faqs.length > 0 && (
                <section id="faq" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-sm text-muted">
                      Clear answers to common questions about our calculations and industry definitions.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left text-foreground hover:bg-secondary/30 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span className="font-medium text-sm sm:text-base font-outfit pr-4">
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
                            <div className="px-5 py-4 text-xs sm:text-sm text-muted leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Section 9: Related Tools */}
              {relatedTools.length > 0 && (
                <section id="related-tools" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-outfit uppercase">
                    Related Tools
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {relatedTools.map((tool) => {
                      const toolTheme = categoryThemes[tool.category] || theme;
                      const Icon = tool.category === 'finance' ? Icons.Calculator :
                                   tool.category === 'pdf' ? Icons.FileText :
                                   tool.category === 'developer' ? Icons.Code :
                                   tool.category === 'text' ? Icons.Type :
                                   Icons.Briefcase;

                      return (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-premium-sm hover:border-primary/45 hover:shadow-premium-md transition-all duration-300"
                        >
                          <div>
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${toolTheme.badge} transition-colors duration-300 mb-4`}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="text-base font-bold text-foreground font-outfit mb-1.5 group-hover:text-primary transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-muted leading-relaxed mb-4">
                              {tool.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            <span>Open Tool</span>
                            <Icons.ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Section 10: Recent Articles */}
              <section id="recent-articles" className="scroll-mt-24 border-t border-border/60 pt-12 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-outfit">
                    Recent Articles
                  </h2>
                  <p className="text-sm text-muted">
                    Learn core industry fundamentals and mathematical practices from our resource library.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentArticles.map((article, i) => (
                    <article key={i} className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-premium-sm transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase">
                          <span>{categoryName} Education</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold font-outfit text-foreground group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed">
                          {article.desc}
                        </p>
                      </div>
                      <div className="border-t border-border/40 mt-4 pt-3 flex items-center justify-between text-[10px] text-muted">
                        <span>{article.date}</span>
                        <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Read Post <Icons.ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column: Sticky Navigation Sidebar */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <aside className="sticky top-24 space-y-6">
                
                {/* Table of Contents Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-premium-sm">
                  <h3 className="font-outfit text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Icons.Menu className="h-4.5 w-4.5 text-primary" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {activeSections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`block text-xs py-2 px-3 rounded-lg font-medium transition-all duration-200 border-l-2 ${
                          activeSection === section.id
                            ? 'text-primary bg-primary/5 border-primary font-bold'
                            : 'text-muted border-transparent hover:text-foreground hover:bg-secondary/30'
                        }`}
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Privacy Guarantee Card */}
                <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/35 p-5 shadow-premium-sm space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icons.Lock className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-outfit text-sm font-bold text-foreground">
                    Private-by-Design
                  </h4>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Toolora computes all operations directly on your CPU. We never store, log, or upload your sensitive details, calculations, or files.
                  </p>
                </div>

              </aside>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
