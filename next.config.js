/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Removed pages — the site focuses on the open-source project.
      { source: '/roadmap', destination: '/about', permanent: true },
      { source: '/pricing', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
