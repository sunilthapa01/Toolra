import { MetadataRoute } from 'next';
import { toolsRegistry, getToolCanonicalPath } from '@/tools/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolora.com';

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  const toolRoutes = Object.values(toolsRegistry).map((tool) => ({
    url: `${baseUrl}${getToolCanonicalPath(tool)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...toolRoutes];
}
