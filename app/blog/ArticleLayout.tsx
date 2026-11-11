import Link from "next/link";
import ArticleToc from "./ArticleToc";
import { posts, type Post } from "./posts";

type Faq = { q: string; a: string };

// Reusable article shell: brand-consistent header + body typography, plus
// Article / BreadcrumbList / FAQPage JSON-LD. The FAQ is rendered from the same
// array that feeds the schema, so the visible content always matches the markup
// (Google requires FAQ schema to match on-page content).
export default function ArticleLayout({
  post,
  faq,
  capabilityNotes = true,
  children,
}: {
  post: Post;
  faq?: Faq[];
  capabilityNotes?: boolean;
  children: React.ReactNode;
}) {
  const url = `https://argonlabs.tech/blog/${post.slug}`;
  const related = posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, 3);
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  const dateDisplay = formatDate(post.date);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Organization",
      "@id": "https://argonlabs.tech/#organization",
      name: "Argon Labs",
      url: "https://argonlabs.tech/about",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://argonlabs.tech/#organization",
      name: "Argon Labs",
      logo: {
        "@type": "ImageObject",
        url: "https://argonlabs.tech/argon-logo.png",
      },
    },
    image: "https://argonlabs.tech/og.png",
    mainEntityOfPage: url,
    url,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: "https://argonlabs.tech/blog",
      },
      { "@type": "ListItem", position: 2, name: post.title, item: url },
    ],
  };

  const faqLd =
    faq && faq.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-10 sm:pt-14 xl:grid xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
      <article className="mx-auto min-w-0 max-w-[44rem] xl:mx-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}

        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex min-w-0 items-center gap-2 text-sm text-brand-muted"
        >
          <Link
            href="/blog"
            className="shrink-0 font-medium text-brand-text-darker hover:text-brand-primary"
          >
            Blog
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate">{post.title}</span>
        </nav>

        <h1 className="text-[2rem] font-semibold leading-[1.08] text-brand-text sm:text-[2.75rem]">
          {post.title}
        </h1>
        <p className="lede mt-5">{post.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-brand-muted">
          <span>
            By{" "}
            <Link className="prose-link" href="/about">
              Argon Labs
            </Link>
          </span>
          <time dateTime={post.date}>{dateDisplay}</time>
          <span>{post.readingMinutes} min read</span>
          {post.updated && (
            <span>
              Updated{" "}
              <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-brand-edge px-3 py-0.5 text-xs text-brand-text-darker"
            >
              {t}
            </span>
          ))}
        </div>

        <hr className="my-10 border-brand-edge" />

        {capabilityNotes && (
          <p className="mb-8 rounded-(--radius-panel) border border-brand-edge bg-brand-surface p-5 text-sm leading-6">
            Current capability notes: checkout materializes a physical database;
            native actor attribution is per branch/run; undo needs complete
            images and retained history. CLI sandboxes require watch and
            scheduled sweep.{" "}
            <Link className="prose-link" href="/features#capabilities">
              Read the capability matrix
            </Link>
            .
          </p>
        )}
        <div className="article">{children}</div>

        {faq && faq.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[1.625rem] font-semibold leading-tight text-brand-text">
              Frequently asked questions
            </h2>
            <dl className="mt-6 border-t border-brand-edge">
              {faq.map((f) => (
                <div key={f.q} className="border-b border-brand-edge py-6">
                  <dt className="text-lg font-semibold text-brand-text">
                    {f.q}
                  </dt>
                  <dd className="mt-2 leading-7 text-brand-text-darker">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-16 border-t border-brand-edge-strong pt-10">
          <h2 className="text-[1.625rem] font-semibold leading-tight text-brand-text">
            Continue reading
          </h2>
          <ul className="my-6 border-t border-brand-edge">
            {related.map(({ post: item }) => (
              <li key={item.slug} className="border-b border-brand-edge">
                <Link
                  className="flex min-h-14 items-center py-3 text-lg font-medium leading-snug text-brand-text transition-colors hover:text-brand-primary"
                  href={`/blog/${item.slug}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-brand-text-darker">
            Argon is open source and MIT-licensed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/quickstart" className="btn-solid">
              Start with MongoDB locally
            </Link>
            <a
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quiet"
            >
              Star on GitHub
            </a>
            <Link href="/features" className="btn-quiet">
              See all features
            </Link>
          </div>
        </div>
      </article>
      <aside className="hidden xl:block">
        <ArticleToc />
      </aside>
    </div>
  );
}
