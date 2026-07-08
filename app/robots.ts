import type { MetadataRoute } from 'next';

// Canonical host is the apex domain (www 301s to it via next.config.js).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://argonlabs.tech/sitemap.xml',
    host: 'https://argonlabs.tech',
  };
}
