/** @type {import('next').NextConfig} */
// Scripts and styles are served from this origin; Next.js and the JSON-LD
// blocks need inline scripts. Vercel Analytics loads from /_vercel on the
// same origin, so no third-party host is allowed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  async headers() {
    // The development server needs eval and a websocket for hot reload.
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Removed pages — the site focuses on the open-source project.
      { source: "/roadmap", destination: "/about", permanent: true },
      { source: "/pricing", destination: "/", permanent: true },
      // Canonical host: 301 www → apex so search/AI engines index one domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.argonlabs.tech" }],
        destination: "https://argonlabs.tech/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
