import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import * as Icons from '@/components/Icons';

export const metadata: Metadata = {
  title: 'About Toolora — Building Utilities People Actually Trust',
  description: 'Learn why Toolora exists, our privacy-first philosophy, core product principles, our modern technology stack, and our forward-looking roadmap.',
};

export default function AboutPage() {
  const principles = [
    {
      title: 'Accuracy First',
      description: 'Calculations you can stake your business on. All formulas follow official tax, interest, and math standards.',
      icon: <Icons.Calculator className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Privacy by Default',
      description: 'Your data never leaves your computer. Calculations run entirely on your browser, client-side, with zero tracker logs.',
      icon: <Icons.Lock className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Instant Performance',
      description: 'Optimized modules compute results in sub-100ms. No waiting for server responses or bloated loading screens.',
      icon: <Icons.Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Accessible Layouts',
      description: 'Built with clean semantic HTML. Easily readable, responsive across device sizes, and keyboard-friendly.',
      icon: <Icons.Code className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Reliability & Safety',
      description: 'Robust validation checks on every input field to handle edge cases, empty values, and infinite inputs gracefully.',
      icon: <Icons.AlertCircle className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Open Roadmap',
      description: 'We continuous improve based on user feedback. Check our roadmap below to see active, upcoming features.',
      icon: <Icons.Sparkles className="h-6 w-6 text-primary" />,
    },
  ];

  const comparisons = [
    { feature: 'Ads & Trackers', toolora: 'Zero. Completely ad-free.', traditional: 'Heavy banners, popups, and user-tracking pixels.' },
    { feature: 'Data Processing', toolora: '100% local, client-side.', traditional: 'Uploaded to external servers with unknown storage policies.' },
    { feature: 'UI Aesthetics', toolora: 'Modern, minimal, light & dark theme.', traditional: 'Cluttered, outdated, and difficult to navigate.' },
    { feature: 'Performance', toolora: 'Sub-100ms instant loading.', traditional: 'Slow, request-blocking backend calculations.' },
    { feature: 'Accessibility Shortcuts', toolora: 'Fully integrated keyboard shortcuts.', traditional: 'Rarely supported, requiring heavy mouse clicks.' },
    { feature: 'Mobile Usability', toolora: 'Responsive, slider-optimized views.', traditional: 'Broken grids and difficult input scrolling.' },
  ];

  const technologies = [
    { name: 'React', desc: 'Component architecture' },
    { name: 'Next.js 14', desc: 'Static page generation' },
    { name: 'TypeScript', desc: 'Type-safe precision coding' },
    { name: 'Tailwind CSS', desc: 'Premium responsive design' },
    { name: 'Vercel', desc: 'Fast global CDN hosting' },
    { name: 'Supabase', desc: 'Secure cloud syncing (Coming Soon)' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 w-full relative overflow-hidden">
        
        {/* Subtle mesh background grid details */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* 1. Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 text-xs font-bold uppercase tracking-wider mb-6">
            <Icons.Sparkles className="h-3 w-3" />
            <span>Introducing Toolora</span>
          </div>
          
          <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1] mb-6">
            Building Utilities <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              People Actually Trust.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10">
            Toolora is a privacy-first collection of premium online utilities designed for developers, students, businesses, creators, and professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider hover:opacity-95 transition-opacity shadow-premium-md"
            >
              Explore Tools
            </Link>
            <a
              href="#roadmap"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider hover:bg-secondary transition-colors shadow-premium-sm"
            >
              View Roadmap
            </a>
          </div>
        </section>

        {/* 2. Mission Section */}
        <section className="py-16 md:py-24 border-t border-border/40 bg-secondary/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                  Our Mission & Purpose
                </span>
                <h2 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  The internet deserves a better utility box.
                </h2>
                <div className="h-1 w-12 bg-primary rounded-full" />
              </div>

              <div className="lg:col-span-7 space-y-6 text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  Most online utility sites are relics of the early web: littered with intrusive popup ads, cookie tracking scripts, slow server round-trips, and confusing interfaces designed to capture clicks instead of solving problems.
                </p>
                <p className="font-semibold text-foreground">
                  Toolora is built differently. We believe that tools should load instantly, run completely on your client browser, protect your sensitive financial/technical inputs, and present results in a premium UI that makes work enjoyable.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-foreground font-bold text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl">
                    <Icons.Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Sub-100ms Fast processing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl">
                    <Icons.Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Client-side privacy</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl">
                    <Icons.Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>Premium UI design</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl">
                    <Icons.Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>100% mathematically accurate</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Core Principles */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
              Architectural Values
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built on uncompromising standards
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Every tool in our ecosystem is designed, engineered, and polished with six fundamental values in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {principles.map((pr, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-premium-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 space-y-4"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  {pr.icon}
                </div>
                <h3 className="font-outfit text-lg font-bold text-foreground">
                  {pr.title}
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">
                  {pr.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Comparison Section */}
        <section className="py-16 md:py-24 border-t border-border/40 bg-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                The Toolora Advantage
              </span>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Toolora vs Traditional Websites
              </h2>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-premium-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-border/60 bg-secondary/15">
                    <tr>
                      <th className="px-6 py-4">Capability</th>
                      <th className="px-6 py-4 text-primary">Toolora Platform</th>
                      <th className="px-6 py-4">Generic Online Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {comparisons.map((row, idx) => (
                      <tr key={idx} className="hover:bg-secondary/10">
                        <td className="px-6 py-4 font-bold text-foreground">{row.feature}</td>
                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="inline-flex items-center gap-1.5">
                            <Icons.Check className="h-4 w-4 shrink-0" />
                            {row.toolora}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted/80">
                          <span className="inline-flex items-center gap-1.5">
                            <Icons.X className="h-3.5 w-3.5 text-red-500/70 shrink-0" />
                            {row.traditional}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Technologies Used */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
              System Engineering
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Powered by modern technology
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              We leverage cutting-edge frameworks to maintain a fast global CDN delivery network.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 rounded-2xl text-center space-y-2 hover:border-primary/30 transition-colors"
              >
                <div className="font-outfit text-sm font-bold text-foreground">
                  {tech.name}
                </div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-wider">
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Roadmap */}
        <section id="roadmap" className="py-16 md:py-24 border-t border-border/40 bg-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                Continuous Improvement
              </span>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Development Roadmap
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Completed */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Completed
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <ul className="space-y-4 text-xs font-semibold text-muted">
                  <li className="flex items-start gap-3">
                    <Icons.Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Modern layout & dark mode support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>High-accuracy GST calculator & presets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Reverse GST & base extraction ledger</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>EMI repayment calculator with SVG amortization graphs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>SIP compounding wealth projections</span>
                  </li>
                </ul>
              </div>

              {/* In Progress */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    In Progress
                  </span>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <ul className="space-y-4 text-xs font-semibold text-muted">
                  <li className="flex items-start gap-3">
                    <Icons.Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Client-side PDF merging & splitting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>JSON structure formatter & syntax checking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icons.Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Base64, Word Count, and Case conversion utility suite</span>
                  </li>
                </ul>
              </div>

              {/* Coming Soon */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Coming Soon
                  </span>
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                </div>
                <ul className="space-y-4 text-xs font-semibold text-muted">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                    <span>Supabase authentication for synchronizing calculation histories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                    <span>Customizable dashboard collections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                    <span>AI-powered spreadsheet helper conversions</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* 7. Footer CTA */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 md:p-16 max-w-5xl mx-auto space-y-6 shadow-premium-lg">
            <h2 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
              Ready to experience modern utilities?
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
              Skip the trackers, signups, and popups. Start calculating and generating with our premium, client-side tools today.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-premium-md"
              >
                Explore All Tools
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
