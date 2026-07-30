'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import * as Icons from '@/components/Icons';

interface AccordionItem {
  title: string;
  content: string;
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((i) => i !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  const sections = [
    { id: 'overview', name: 'Privacy Overview' },
    { id: 'local-processing', name: 'Local Computing' },
    { id: 'collection', name: 'Information Collection' },
    { id: 'analytics', name: 'Cookies & Analytics' },
    { id: 'sharing', name: 'Data Selling Guarantee' },
    { id: 'future-auth', name: 'Future Auth Policy' },
    { id: 'accordions', name: 'Detailed Legal Disclosures' },
    { id: 'contact', name: 'Privacy Contact' },
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

  const localTools = [
    {
      title: 'PDF Merge & Split',
      description: 'Your PDFs are processed entirely in the browser using WebAssembly. Files are never uploaded to any server.',
      icon: <Icons.FileText className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'GST Calculators',
      description: 'Tax and bill split inputs remain in local React component state, vanishing instantly upon reload.',
      icon: <Icons.Calculator className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: 'JSON Formatter',
      description: 'Data parsing and syntax validation are performed locally. Your code blocks never transit the internet.',
      icon: <Icons.Code className="h-5 w-5 text-blue-500" />,
    },
  ];

  const legalItems: AccordionItem[] = [
    {
      title: 'GDPR compliance & Data Subject Rights',
      content: 'Under the General Data Protection Regulation (GDPR), users residing in the European Economic Area (EEA) have the right to access, rectify, delete, restrict, or object to any metadata processing. Since Toolora does not host or store your input parameters, exercising these rights is automatic—your data resides exclusively on your local device.'
    },
    {
      title: 'CCPA / CPRA California Privacy Rights',
      content: 'Under the California Consumer Privacy Act, California residents are entitled to receive details about what information we gather and request deletion. Toolora collects zero personal identifier profiles, does not maintain user databases, and operates entirely on a zero-tracking model for actual tool utility calculations.'
    },
    {
      title: 'Children\'s Privacy Protection',
      content: 'Toolora is not designed for, nor does it target, children under the age of 13. We do not knowingly collect, compile, or request personal data from individuals under 13. If you believe a child has submitted personal details, contact us immediately so we can inspect and wipe the logs.'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Page Header */}
        <header className="mb-12 border-b border-border/40 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <Icons.Lock className="h-3.5 w-3.5" />
            <span>Data Protection Standards</span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted">
            Last Updated: July 25, 2026 • Private, Secure, Local.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sticky Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">
              On This Page
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
            
            {/* Overview */}
            <section id="overview" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Privacy Overview</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                Toolora was founded on the belief that utility tools should help you solve problems, not gather your data. We design every page to run as close to your local computer as possible, minimizing server interaction and maintaining extreme transparency about what metadata is tracked.
              </p>
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex gap-4 items-start">
                <Icons.Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
                    Zero-Exposure Computation Guarantee
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-400/80 text-xs sm:text-sm leading-relaxed font-semibold">
                    We never host, store, or inspect the numbers, files, or strings you insert into our calculators. All translations and conversions happen locally.
                  </p>
                </div>
              </div>
            </section>

            {/* Local Computing Details */}
            <section id="local-processing" className="space-y-6 scroll-mt-24">
              <div className="space-y-2">
                <h2 className="font-outfit text-2xl font-bold text-foreground">Local Client-Side Processing</h2>
                <p className="text-muted leading-relaxed text-sm">
                  Here is how individual tool modules handle inputs inside your browser sandbox:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {localTools.map((tool, idx) => (
                  <div key={idx} className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary/35 flex items-center justify-center border border-border/50">
                      {tool.icon}
                    </div>
                    <h3 className="font-outfit text-sm font-bold text-foreground">{tool.title}</h3>
                    <p className="text-muted text-xs leading-relaxed">{tool.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Information Collection */}
            <section id="collection" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Information Collection</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                We collect minimal metadata to keep the service operational. This includes:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted list-disc list-inside pl-2">
                <li><span className="font-bold text-foreground">Local Settings:</span> We save your preferred theme mode (Light/Dark) in your browser's local storage.</li>
                <li><span className="font-bold text-foreground">Calculation Histories:</span> Calculation history logs are saved locally to speed up workspace workflow. These never transmit outside your device.</li>
              </ul>
            </section>

            {/* Cookies & Analytics */}
            <section id="analytics" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Cookies & Analytics</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                We use Google Analytics to analyze platform traffic patterns and usage metrics.
              </p>
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="font-outfit text-sm font-bold text-foreground flex items-center gap-2">
                  <Icons.Search className="h-4.5 w-4.5 text-primary" />
                  Google Analytics Usage
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Analytics cookies collect completely anonymous information, such as page views, button clicks, and visit duration. This aggregate data helps us determine which tools are trending and optimize performance. You can disable cookies at any time via your browser settings.
                </p>
              </div>
            </section>

            {/* No Selling Data */}
            <section id="sharing" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">No Selling User Data</h2>
              <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 space-y-2">
                <h3 className="font-outfit text-sm font-bold text-primary flex items-center gap-2">
                  <Icons.Sparkles className="h-4 w-4" />
                  100% Ads & Tracker Protection
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  We will <span className="font-bold text-foreground">never rent, share, or sell</span> your information or calculations to marketing brokers, data aggregators, or advertising systems. Toolora is sustained through premium product quality, not user data mining.
                </p>
              </div>
            </section>

            {/* Future Auth Policy */}
            <section id="future-auth" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Future Authentication Policy</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                We plan to introduce optional user accounts in future updates. Under this forthcoming framework:
              </p>
              <p className="text-xs sm:text-sm text-muted leading-relaxed bg-secondary/25 p-4 rounded-xl border border-border/40">
                Authentication will be entirely opt-in. If you choose to sync calculation history lists across multiple devices, records will be encrypted and synced using secure database schemas. Guest profiles will still continue running entirely client-side without registration.
              </p>
            </section>

            {/* Accordions */}
            <section id="accordions" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Detailed Legal Disclosures</h2>
              <p className="text-muted leading-relaxed text-sm">
                Click headers to expand specific compliance disclosures:
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

            {/* Contact Information */}
            <section id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="font-outfit text-2xl font-bold text-foreground">Privacy Concerns & Contact</h2>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                For questions regarding cookies, local computation sandbox configurations, or data deletion queries, feel free to get in touch:
              </p>
              
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-outfit text-sm font-bold text-foreground">Data Protection Representative</h3>
                  <p className="text-xs text-muted">We respond to all privacy-related tickets within 48 business hours.</p>
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
