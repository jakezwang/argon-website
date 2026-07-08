import Link from 'next/link';
import type { Post } from './posts';

type Faq = { q: string; a: string };

// Reusable article shell: brand-consistent header + body typography, plus
// Article / BreadcrumbList / FAQPage JSON-LD. The FAQ is rendered from the same
// array that feeds the schema, so the visible content always matches the markup
// (Google requires FAQ schema to match on-page content).
export default function ArticleLayout({
  post,
  faq,
  children,
}: {
  post: Post;
  faq?: Faq[];
  children: React.ReactNode;
}) {
  const url = `https://argonlabs.tech/blog/${post.slug}`;
  const dateDisplay = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Organization', name: 'Argon Labs', url: 'https://argonlabs.tech' },
    publisher: {
      '@type': 'Organization',
      name: 'Argon Labs',
      logo: { '@type': 'ImageObject', url: 'https://argonlabs.tech/argon-logo.png' },
    },
    image: 'https://argonlabs.tech/og.png',
    mainEntityOfPage: url,
    url,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://argonlabs.tech/blog' },
      { '@type': 'ListItem', position: 2, name: post.title, item: url },
    ],
  };

  const faqLd =
    faq && faq.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <nav className="mb-8 font-mono text-xs text-brand-muted">
        <Link href="/blog" className="hover:text-brand-text">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text-darker">{post.title}</span>
      </nav>

      <p className="kicker mb-4">
        {dateDisplay} · {post.readingMinutes} min read
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-brand-text-darker">{post.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="border border-brand-edge px-2 py-0.5 font-mono text-[11px] text-brand-muted"
          >
            {t}
          </span>
        ))}
      </div>

      <hr className="my-10 border-brand-edge" />

      <div className="article">{children}</div>

      {faq && faq.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight text-brand-text">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-brand-text">{f.q}</dt>
                <dd className="mt-2 leading-7 text-brand-text-darker">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-16 border-t border-brand-edge pt-10">
        <p className="text-brand-text-darker">Argon is open source and MIT-licensed.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Star on GitHub
          </a>
          <Link href="/features" className="btn-quiet">
            See all features
          </Link>
        </div>
      </div>
    </article>
  );
}
