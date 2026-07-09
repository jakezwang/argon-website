import type { MetadataRoute } from 'next';
import { posts } from './blog/posts';

const base = 'https://argonlabs.tech';

const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/agents', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/demo', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/investors', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...postEntries];
}
