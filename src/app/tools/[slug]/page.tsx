import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toolsRegistry } from '@/tools/registry';
import ToolLayout from '@/components/ToolLayout';
import ComingSoonToolPage from '@/components/ComingSoonToolPage';

interface Props {
  params: { slug: string };
}

// Generate SEO Metadata dynamically for each registered tool
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = toolsRegistry[params.slug];
  if (!tool) return {};

  const baseUrl = 'https://toolora.com';
  const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: tool.seoTitle || `${tool.title} — Premium Online Tool | Toolora`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seoTitle || `${tool.title} — Toolora`,
      description: tool.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Toolora',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seoTitle || `${tool.title} — Toolora`,
      description: tool.description,
    },
  };
}

// Pre-render static pages for registered tools at build time
export async function generateStaticParams() {
  return Object.keys(toolsRegistry).map((slug) => ({
    slug,
  }));
}

export default function ToolPage({ params }: Props) {
  const tool = toolsRegistry[params.slug];
  
  if (!tool) {
    notFound();
  }

  // Handle coming-soon preview tools gracefully
  if (!tool.component) {
    return (
      <ToolLayout
        slug={tool.slug}
        title={tool.title}
        description={tool.description}
        category={tool.category}
        categoryName={tool.categoryName}
        faqs={tool.faqs}
        seoContent={tool.seoContent}
        content={tool.content}
      >
        <ComingSoonToolPage tool={tool} />
      </ToolLayout>
    );
  }

  const ToolComponent = tool.component;

  return (
    <ToolLayout
      slug={tool.slug}
      title={tool.title}
      description={tool.description}
      category={tool.category}
      categoryName={tool.categoryName}
      faqs={tool.faqs}
      seoContent={tool.seoContent}
      content={tool.content}
    >
      <ToolComponent />
    </ToolLayout>
  );
}
