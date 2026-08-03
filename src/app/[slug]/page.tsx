import { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { toolsRegistry, getToolBySlugOrAlias, getToolCanonicalPath } from '@/tools/registry';
import { HomeContent } from '@/app/page';
import React, { Suspense } from 'react';

interface Props {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateStaticParams() {
  const paramsSet = new Set<string>();
  Object.values(toolsRegistry).forEach((tool) => {
    paramsSet.add(tool.slug);
    if (tool.shortUrl) paramsSet.add(tool.shortUrl);
    if (tool.aliases) {
      tool.aliases.forEach((alias) => paramsSet.add(alias));
    }
  });
  return Array.from(paramsSet).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlugOrAlias(params.slug);
  if (!tool) return {};

  const baseUrl = 'https://toolora.com';
  const canonicalPath = getToolCanonicalPath(tool);
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

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

export default function DynamicToolPage({ params, searchParams }: Props) {
  const tool = getToolBySlugOrAlias(params.slug);

  if (!tool) {
    notFound();
  }

  // If accessed slug is an alias or legacy slug, 301 redirect to primary canonical short URL
  const canonicalShortUrl = tool.shortUrl || tool.slug;
  if (params.slug !== canonicalShortUrl) {
    const queryString = searchParams && Object.keys(searchParams).length > 0
      ? '?' + new URLSearchParams(searchParams as Record<string, string>).toString()
      : '';
    redirect(`/${canonicalShortUrl}${queryString}`, RedirectType.replace);
  }

  return (
    <Suspense fallback={null}>
      <HomeContent initialToolSlug={tool.slug} />
    </Suspense>
  );
}
