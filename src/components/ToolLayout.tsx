import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import FAQSection, { FAQItem } from './FAQSection';
import RelatedTools from './RelatedTools';

interface ToolLayoutProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  faqs: FAQItem[];
  seoContent?: React.ReactNode;
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
  children,
}: ToolLayoutProps) {
  const breadcrumbSteps = [
    { name: categoryName, href: `/#${category}` },
    { name: title },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb steps={breadcrumbSteps} />

          {/* Page Header */}
          <header className="mb-8 md:mb-12 max-w-3xl">
            <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              {description}
            </p>
          </header>

          {/* Actual Tool Render Container */}
          <div className="mb-16 py-4">
            {children}
          </div>

          {/* Extra SEO Content Section (if provided) */}
          {seoContent && (
            <article className="prose dark:prose-invert max-w-4xl mx-auto mb-16 py-8 border-t border-border/60">
              {seoContent}
            </article>
          )}
        </div>

        {/* Related Tools Cross-linking */}
        <RelatedTools currentSlug={slug} category={category} />

        {/* FAQ Section */}
        {faqs && faqs.length > 0 && (
          <FAQSection faqs={faqs} />
        )}
      </main>

      <Footer />
    </div>
  );
}
