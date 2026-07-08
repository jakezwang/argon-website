import '../styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import Navbar from './components/Navbar';
import PeriodicTile from './components/PeriodicTile';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  metadataBase: new URL('https://argonlabs.tech'),
  title: {
    default: 'Argon — Git for MongoDB, Built for AI Agents',
    template: '%s — Argon',
  },
  description:
    'Open-source branching and merge for MongoDB. Give every AI agent its own branch — a real MongoDB database — review what it wrote, and merge what works.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://argonlabs.tech',
    siteName: 'Argon',
    title: 'Argon — Git for MongoDB, Built for AI Agents',
    description:
      'Git-like branching and merge for MongoDB. A real database branch per AI agent — review the diff, merge what works, discard the rest.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Argon — a database branch for every AI agent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Argon — Git for MongoDB, Built for AI Agents',
    description:
      'Git-like branching and merge for MongoDB. A real database branch per AI agent — review the diff, merge what works, discard the rest.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/argon-logo.png',
    apple: '/argon-logo.png',
  },
};

// Structured data (JSON-LD) — helps Google rich results and lets AI engines
// (ChatGPT, Perplexity, Claude, AI Overviews) extract accurate facts about Argon.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://argonlabs.tech/#organization',
      name: 'Argon Labs',
      url: 'https://argonlabs.tech',
      logo: 'https://argonlabs.tech/argon-logo.png',
      sameAs: ['https://github.com/argon-lab/argon'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://argonlabs.tech/#website',
      url: 'https://argonlabs.tech',
      name: 'Argon',
      publisher: { '@id': 'https://argonlabs.tech/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://argonlabs.tech/#software',
      name: 'Argon',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux, Windows',
      description:
        'Open-source engine that brings Git-style branching, time travel, and merge to MongoDB — a real, isolated database branch for every developer and AI agent.',
      url: 'https://argonlabs.tech',
      downloadUrl: 'https://github.com/argon-lab/argon',
      softwareVersion: '2.0.0',
      license: 'https://opensource.org/licenses/MIT',
      author: { '@id': 'https://argonlabs.tech/#organization' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
    <h3 className="kicker mb-4">{title}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
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
  <footer className="border-t border-brand-edge">
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <PeriodicTile size="sm" />
            <span className="font-mono text-lg text-brand-text">argon</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-brand-muted">
            Git-like branching and time travel for MongoDB. Named after the
            noble gas: inert by design — it never reacts with your production
            data.
          </p>
        </div>
        <FooterColumn
          title="Project"
          links={[
            { label: 'Agents', href: '/agents' },
            { label: 'Features', href: '/features' },
            { label: 'Demo', href: '/demo' },
            { label: 'Blog', href: '/blog' },
            { label: 'Benchmarks', href: 'https://github.com/argon-lab/benchmarks', external: true },
          ]}
        />
        <FooterColumn
          title="Source"
          links={[
            { label: 'GitHub', href: 'https://github.com/argon-lab/argon', external: true },
            { label: 'Documentation', href: 'https://github.com/argon-lab/argon/tree/master/docs', external: true },
            { label: 'Discussions', href: 'https://github.com/argon-lab/argon/discussions', external: true },
            { label: 'Issues', href: 'https://github.com/argon-lab/argon/issues', external: true },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { label: 'About', href: '/about' },
            { label: 'Investors', href: '/investors' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
          ]}
        />
      </div>
      <div className="mt-12 flex flex-col gap-2 border-t border-brand-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-brand-muted">
          MIT licensed · open source · self-hosted
        </p>
        <p className="font-mono text-xs text-brand-muted">
          © {new Date().getFullYear()} Argon Labs
        </p>
      </div>
    </div>
  </footer>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-brand-dark font-sans text-brand-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
