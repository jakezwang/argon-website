/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Removed pages — the site focuses on the open-source project.
      { source: '/roadmap', destination: '/about', permanent: true },
      { source: '/pricing', destination: '/', permanent: true },
      // Canonical host: 301 www → apex so search/AI engines index one domain.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.argonlabs.tech' }],
        destination: 'https://argonlabs.tech/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
