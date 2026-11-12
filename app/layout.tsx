import { product } from "./product";
import FunnelChoice from "./components/Funnel";
import "../styles/globals.css";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Navbar from "./components/Navbar";
import PeriodicTile from "./components/PeriodicTile";
import WebsiteAnalytics from "./components/WebsiteAnalytics";

// One sans family: its width axis separates headlines from text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-argon-sans",
  display: "swap",
});
// Mono is for commands, code and document data only.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-argon-mono",
  display: "swap",
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f17" },
  ],
};

// Applies a saved theme before first paint. Without a saved choice the
// stylesheet follows the system setting.
const themeScript = `(function(){try{var t=localStorage.getItem("argon.theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

export const metadata = {
  metadataBase: new URL("https://argonlabs.tech"),
  title: {
    default: "Argon — MongoDB Sandboxes for AI Agents",
    template: "%s — Argon",
  },
  description:
    "Open-source MongoDB sandboxes for AI agents. Give every agent run its own real MongoDB database, forked from your data. Review what it wrote and merge what works.",
  openGraph: {
    type: "website",
    url: "https://argonlabs.tech",
    siteName: "Argon",
    title: "Argon — MongoDB Sandboxes for AI Agents",
    description:
      "Disposable MongoDB sandboxes for AI agents. Each run gets a real database forked from your data — review the diff, merge what works, discard the rest.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Argon — MongoDB sandboxes for AI agents",
      },
    ],
  },
  alternates: {
    canonical: "/",
    types: { "application/atom+xml": "/feed.xml" },
  },
  twitter: {
    card: "summary_large_image",
    title: "Argon — MongoDB Sandboxes for AI Agents",
    description:
      "Disposable MongoDB sandboxes for AI agents. Each run gets a real database forked from your data — review the diff, merge what works, discard the rest.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon-64.png",
    apple: "/apple-touch-icon.png",
  },
};

// Structured data (JSON-LD) — helps Google rich results and lets AI engines
// (ChatGPT, Perplexity, Claude, AI Overviews) extract accurate facts about Argon.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://argonlabs.tech/#organization",
      name: "Argon Labs",
      url: "https://argonlabs.tech",
      logo: "https://argonlabs.tech/argon-logo.png",
      sameAs: [
        "https://github.com/argon-lab",
        "https://github.com/argon-lab/argon",
        "https://www.npmjs.com/package/argonctl",
        "https://pypi.org/project/argon-agents/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://argonlabs.tech/#website",
      url: "https://argonlabs.tech",
      name: "Argon",
      publisher: { "@id": "https://argonlabs.tech/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://argonlabs.tech/#software",
      name: "Argon",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Linux, Windows",
      description:
        "Open-source MongoDB sandboxes for AI agents: a real, isolated database for every agent run, with Git-style branching, time travel, and reviewed merge underneath.",
      url: "https://argonlabs.tech",
      downloadUrl: "https://github.com/argon-lab/argon",
      softwareVersion: product.version,
      license: "https://opensource.org/licenses/MIT",
      author: { "@id": "https://argonlabs.tech/#organization" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) => (
  <div>
    <h3 className="mb-4 text-sm font-semibold text-brand-text">{title}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-sm text-brand-text-darker transition-colors hover:text-brand-text"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="mt-24 border-t border-brand-edge">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <PeriodicTile size="sm" />
            <span className="text-lg font-semibold tracking-tight text-brand-text [font-stretch:112%]">
              argon
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-brand-muted">
            MongoDB sandboxes for AI agents, with Git-style branching and time
            travel underneath. Named after the noble gas: experiments stay on
            branches until you explicitly merge them.
          </p>
        </div>
        <FooterColumn
          title="Project"
          links={[
            { label: "Agents", href: "/agents" },
            { label: "Features", href: "/features" },
            { label: "How it works", href: "/demo" },
            { label: "Start locally", href: "/quickstart" },
            { label: "CLI reference", href: "/cli" },
            { label: "Blog", href: "/blog" },
            { label: "FAQ", href: "/faq" },
            {
              label: "Benchmarks",
              href: "https://github.com/argon-lab/benchmarks",
              external: true,
            },
          ]}
        />
        <FooterColumn
          title="Source"
          links={[
            {
              label: "GitHub",
              href: "https://github.com/argon-lab/argon",
              external: true,
            },
            {
              label: "Documentation",
              href: "https://github.com/argon-lab/argon/tree/master/docs",
              external: true,
            },
            {
              label: "Discussions",
              href: "https://github.com/argon-lab/argon/discussions",
              external: true,
            },
            { label: "Contributors", href: "/about#contributors" },
            {
              label: "Security",
              href: "https://github.com/argon-lab/argon/security/policy",
              external: true,
            },
            {
              label: "Issues",
              href: "https://github.com/argon-lab/argon/issues",
              external: true,
            },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { label: "About", href: "/about" },
            { label: "Investors", href: "/investors" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ]}
        />
      </div>
      <FunnelChoice />
      <div className="mt-12 flex flex-col gap-2 border-t border-brand-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-muted">
          Open source under the MIT license. Self-hosted.
        </p>
        <p className="text-xs text-brand-muted">
          © {new Date().getFullYear()} Argon Labs
        </p>
      </div>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-brand-bg font-sans text-brand-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="grow">
          {children}
        </main>
        <Footer />
        <WebsiteAnalytics />
      </body>
    </html>
  );
}
