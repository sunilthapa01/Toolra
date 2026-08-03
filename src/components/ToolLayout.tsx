'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import * as Icons from './Icons';
import LauncherSidebar from './LauncherSidebar';
import { toolsRegistry } from '@/tools/registry';
import { FAQItem, ToolContent, ToolCategory } from '@/tools/types';
import { usePageTransition } from './TransitionProvider';
import SkeletonLoader from './SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { navigate } = usePageTransition();


  const breadcrumbSteps = [
    { name: categoryName, href: `/#${category}` },
    { name: title },
  ];

  const categoryCounts = useMemo(() => {
    return Object.values(toolsRegistry).reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Filtered compact TOC items only
  const activeSections = useMemo(() => {
    return [
      { id: 'hero', label: 'Calculator' },
      ...(content?.whatIsThis ? [{ id: 'what-is-this', label: 'What is this?' }] : []),
      ...(content?.howToUseSteps && content.howToUseSteps.length > 0 ? [{ id: 'how-to-use', label: 'How to Use' }] : []),
      ...(content?.workedExamples && content.workedExamples.length > 0 ? [{ id: 'examples', label: 'Worked Examples' }] : []),
      ...(content?.formulaDetails ? [{ id: 'formula', label: 'Formula & Logic' }] : []),
      ...(faqs && faqs.length > 0 ? [{ id: 'faq', label: 'FAQ' }] : []),
    ];
  }, [content, faqs]);

  // ScrollSpy for TOC active link tracking
  useEffect(() => {
    if (activeSections.length <= 1) return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 140;
      let current = 'hero';
      for (const section of activeSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [activeSections]);

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

  const appSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${title} — Toolora`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      url: `https://toolora.com/${toolsRegistry[slug]?.shortUrl || slug}`,
      description: description,
    };
  }, [title, slug, description]);

  const hasEducationalContent = Boolean(
    content?.whatIsThis || (content?.howToUseSteps && content.howToUseSteps.length > 0) || (content?.workedExamples && content.workedExamples.length > 0) || content?.formulaDetails || (faqs && faqs.length > 0)
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

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

      <div className="flex flex-1 w-full min-h-0">
        {/* Persistent Sidebar Across ALL Tool Pages */}
        <LauncherSidebar
          selectedCategory={category as ToolCategory}
          onSelectCategory={(catId) => {
            if (catId === 'all') {
              navigate('/');
            } else {
              navigate(`/#${catId}`);
            }
          }}
          categoryCounts={categoryCounts}
          isOpen={sidebarOpen}
        />

        {/* Fluid 80-90% Viewport Workspace Container */}
        <main className="flex-1 w-full min-w-0 py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto space-y-8">
            {/* Header: Breadcrumb, Title & Short Description */}
            <div className="space-y-2">
              <Breadcrumb steps={breadcrumbSteps} />
              <h1 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-5xl leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Primary Hero Workspace (Tool / Calculator / Editor) */}
            <div id="hero" className="w-full rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-sm transition-all min-h-[450px]">
              {children}
            </div>


            {/* Educational Content & Compact TOC Layout (If available) */}
            {hasEducationalContent && (
              <div className="border-t border-border pt-10 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Educational Articles Column */}
                  <div className={`${activeSections.length > 2 ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} space-y-10`}>
                    {/* What is this? */}
                    {content?.whatIsThis && (
                      <section id="what-is-this" className="scroll-mt-24 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">
                          What is {title}?
                        </h2>
                        <p className="text-sm sm:text-base text-muted leading-relaxed">
                          {content.whatIsThis.overview}
                        </p>
                        {content.whatIsThis.whyExists && (
                          <div className="p-4 rounded-xl border border-border bg-secondary/20 text-xs sm:text-sm text-muted leading-relaxed">
                            <strong className="text-foreground font-semibold">Why it exists: </strong>
                            {content.whatIsThis.whyExists}
                          </div>
                        )}
                      </section>
                    )}

                    {/* How to Use */}
                    {content?.howToUseSteps && content.howToUseSteps.length > 0 && (
                      <section id="how-to-use" className="scroll-mt-24 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">
                          How to Use
                        </h2>
                        <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-muted leading-relaxed">
                          {content.howToUseSteps.map((step, i) => (
                            <li key={i} className="pl-1">
                              <span className="text-foreground font-medium">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </section>
                    )}

                    {/* Worked Examples */}
                    {content?.workedExamples && content.workedExamples.length > 0 && (
                      <section id="examples" className="scroll-mt-24 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">
                          Worked Examples
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {content.workedExamples.map((ex, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-2">
                              <h3 className="text-sm font-bold text-foreground font-outfit">{ex.title}</h3>
                              <p className="text-xs text-muted leading-relaxed">{ex.scenario}</p>
                              {ex.result && (
                                <div className="text-xs font-mono-calc text-primary font-semibold pt-1">
                                  Result: {ex.result}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Formula & Logic */}
                    {content?.formulaDetails && (
                      <section id="formula" className="scroll-mt-24 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight">
                          Formula & Logic
                        </h2>
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                          <p className="text-sm text-muted leading-relaxed">{content.formulaDetails.explanation}</p>
                          {content.formulaDetails.equation && (
                            <div className="p-3 rounded-lg bg-secondary/40 font-mono-calc text-xs text-foreground font-bold">
                              {content.formulaDetails.equation}
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* FAQ Accordion */}
                    {faqs && faqs.length > 0 && (
                      <section id="faq" className="scroll-mt-24 space-y-3">
                        <h2 className="text-xl sm:text-2xl font-bold font-outfit text-foreground tracking-tight flex items-center gap-2">
                          <Icons.Info className="h-5 w-5 text-primary" />
                          Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                          {faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                              <div key={index} className="rounded-xl border border-border bg-card overflow-hidden">
                                <button
                                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                  className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm sm:text-base font-semibold text-foreground hover:bg-secondary/30 transition-colors"
                                >
                                  <span className="pr-4">{faq.question}</span>
                                  <Icons.ChevronDown className={`h-4 w-4 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                                      className="border-t border-border overflow-hidden bg-secondary/10"
                                    >
                                      <div className="px-5 py-4 text-xs sm:text-sm text-muted leading-relaxed">
                                        {faq.answer}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Compact Sticky Table of Contents Sidebar */}
                  {activeSections.length > 2 && (
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                      <aside className="sticky top-24 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                          <h3 className="font-outfit text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Icons.Menu className="h-4 w-4 text-primary" />
                            Table of Contents
                          </h3>
                          <nav className="space-y-1">
                            {activeSections.map((section) => (
                              <a
                                key={section.id}
                                href={`#${section.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`#${section.id}`);
                                }}
                                className={`block text-xs py-1.5 px-3 rounded-lg font-medium transition-all border-l-2 ${
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
                      </aside>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
