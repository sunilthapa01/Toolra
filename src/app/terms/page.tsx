'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import * as Icons from '@/components/Icons';

interface AccordionItem {
  title: string;
  content: string;
}

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((i) => i !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  const sections = [
    { id: 'acceptance', name: 'Terms Acceptance' },
    { id: 'usage', name: 'Acceptable Usage' },
    { id: 'disclaimers', name: 'Accuracy & Disclaimers' },
    { id: 'copyright', name: 'Intellectual Property' },
    { id: 'liability', name: 'Limitations of Liability' },
    { id: 'availability', name: 'Availability & SLA' },
    { id: 'modifications', name: 'Updates & Termination' },
    { id: 'legal-clauses', name: 'Detailed Legal Clauses' },
    { id: 'contact', name: 'Contact Information' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const usageRules = [
    {
      num: '01',
      title: 'Personal & Professional Use',
      description: 'You are granted a non-exclusive, non-transferable, revocable license to access Toolora for normal calculation and conversion tasks.',
    },
    {
      num: '02',
      title: 'No Automated Crawling',
      description: 'You must not scrape, extract, automate, or systematically crawl Toolora tools using bots, scripts, or API requests.',
    },
    {
      num: '03',
      title: 'No System Overloading',
      description: 'You must not attempt to disrupt services, introduce malicious code, bypass request rate limits, or perform DDoS activities.',
    },
  ];

  const accuracyClaims = [
    {
      title: 'Financial Calculators',
      description: 'GST, Reverse GST, EMI, and SIP modules are built with standard reduction formulas. These provide estimates, not binding tax or legal advisories. Double-check all variables with qualified accountants.',
      icon: <Icons.Calculator className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: 'PDF File Processing',
      description: 'PDF merging and splitting operations occur in client-side WebAssembly environments. Resulting files depend entirely on the compatibility and security formatting of the imported source files.',
      icon: <Icons.FileText className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Developer Encoders',
      description: 'JSON formatters, validators, and Base64 encoders perform raw string conversions. Toolora is not responsible for parsing corrupted inputs or lost key strings.',
      icon: <Icons.Code className="h-5 w-5 text-blue-500" />,
    },
  ];

  const legalItems: AccordionItem[] = [
    {
      title: 'Governing Law & Jurisdiction',
      content: 'These Terms of Service and any operating rules established by Toolora shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any dispute arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.'
    },
    {
      title: 'Severability of Clauses',
      content: 'If any provision of these Terms is deemed unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable from these Terms and shall not affect the validity and enforceability of any remaining provisions.'
    },
    {
      title: 'Entire Agreement Waiver',
      content: 'Our failure to exercise or enforce any right or provision of these Terms of Service shall not operate as a waiver of such right or provision. These Terms constitute the entire agreement between you and Toolora.'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Page Header */}
        <header className="mb-12 border-b border-border/40 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <Icons.Briefcase className="h-3.5 w-3.5" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-muted">
            Last Updated: July 25, 2026 • Clear, Fair, Transparent.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sticky Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">
              Agreement Index
            </span>
            <nav className="flex flex-col space-y-2 border-l border-border/80">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`pl-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border-l-2 -ml-[1.5px] ${
                    activeSection === sec.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`}
                >
                  {sec.name}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* 1. Acceptance */}
            <section id="acceptance" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Terms Acceptance</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                By accessing or using Toolora, you agree to comply with and be bound by these Terms of Service. If you do not agree to these rules, please discontinue use of our calculations and converting tools immediately.
              </p>
            </section>

            {/* 2. Acceptable Usage */}
            <section id="usage" className="space-y-6 scroll-mt-24">
              <div className="space-y-2">
                <h2 className="font-outfit text-2xl font-bold text-foreground">Acceptable Usage Policy</h2>
                <p className="text-muted leading-relaxed text-sm">
                  We expect users to interact with our platform in a constructive, safe manner:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {usageRules.map((rule, idx) => (
                  <div key={idx} className="bg-card border border-border/80 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="absolute top-4 right-4 text-3xl font-black text-muted/15 select-none font-outfit">
                      {rule.num}
                    </div>
                    <h3 className="font-outfit text-sm font-bold text-foreground pr-8">{rule.title}</h3>
                    <p className="text-muted text-xs leading-relaxed">{rule.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Disclaimers & Accuracy */}
            <section id="disclaimers" className="space-y-6 scroll-mt-24">
              <div className="space-y-2">
                <h2 className="font-outfit text-2xl font-bold text-foreground">Tool Accuracy Disclaimer</h2>
                <p className="text-muted leading-relaxed text-sm">
                  Toolora does not guarantee the mathematical infallibility of calculation outputs:
                </p>
              </div>
              
              <div className="space-y-4">
                {accuracyClaims.map((claim, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-card border border-border/60 rounded-2xl">
                    <div className="h-9 w-9 rounded-lg bg-secondary/35 flex items-center justify-center border border-border/50 shrink-0 mt-0.5">
                      {claim.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-outfit text-sm font-bold text-foreground">{claim.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{claim.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Intellectual Property */}
            <section id="copyright" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Intellectual Property & Copyright</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                All software, components, interactive SVG charts, visual redos, layouts, logo assets, CSS stylesheets, and brand identities displayed on Toolora are the exclusive copyright of Toolora. You may not copy, replicate, resell, or distribute our product architectures without prior written permission.
              </p>
            </section>

            {/* 5. Limitations of Liability */}
            <section id="liability" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Limitations of Liability</h2>
              <p className="text-muted leading-relaxed text-xs sm:text-sm bg-secondary/25 p-5 rounded-2xl border border-border/40 font-semibold">
                Toolora and its creators shall in no event be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including, without limitation, loss of business profits, data corruption, or operational interruptions) arising out of the use or inability to use our financial calculators or document processors, even if notified of such possibilities.
              </p>
            </section>

            {/* 6. Availability & SLA */}
            <section id="availability" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Availability & Service Level Agreement</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                Toolora is provided on an "as is" and "as available" basis without any express guarantees. While we host files on high-availability global CDN networks to ensure 99.9% uptime, we do not commit to specific SLAs and reserve the right to temporarily suspend, restrict, or modify access for platform upgrades.
              </p>
            </section>

            {/* 7. Updates & Termination */}
            <section id="modifications" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Agreement Updates & Termination</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                We reserve the right to revise or update these terms at our sole discretion. All revisions will take effect immediately upon updating the Last Updated timestamp at the top of this document. We also reserve the right to restrict access to our tools if we identify activities violating our acceptable usage policy.
              </p>
            </section>

            {/* 8. Accordions */}
            <section id="legal-clauses" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Detailed Legal Clauses</h2>
              <p className="text-muted leading-relaxed text-sm">
                Click headers to expand specific compliance agreements:
              </p>
              
              <div className="border border-border/80 rounded-2xl overflow-hidden divide-y divide-border/80">
                {legalItems.map((item, idx) => {
                  const isOpen = openAccordions.includes(idx);
                  return (
                    <div key={idx} className="bg-card">
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/20 transition-colors"
                      >
                        <span className="uppercase tracking-wide">{item.title}</span>
                        <Icons.ChevronDown className={`h-4.5 w-4.5 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-border/20 bg-secondary/5">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 9. Contact */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Contact Information</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                If you have questions regarding acceptable usage guidelines, disclaimers, or copyright licensing permissions, please contact our support team:
              </p>
              
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-outfit text-sm font-bold text-foreground">Operations Representative</h3>
                  <p className="text-xs text-muted">Legal and compliance emails are processed within 3 business days.</p>
                </div>
                <a
                  href="mailto:npsofoact@gmail.com"
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider hover:opacity-95 transition-opacity"
                >
                  <Icons.Share2 className="h-4 w-4" />
                  <span>npsofoact@gmail.com</span>
                </a>
              </div>
            </section>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
