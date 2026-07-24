import { MetadataRoute } from 'next';
import { toolsRegistry } from '@/tools/registry';

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

  const toolRoutes = Object.keys(toolsRegistry).map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...toolRoutes];
}
