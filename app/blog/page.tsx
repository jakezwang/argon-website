import Link from 'next/link';
import { sortedPosts } from './posts';

export const metadata = {
  title: 'Blog',
  description:
    'Guides on MongoDB branching, time travel, data versioning, and giving AI agents safe, disposable databases.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Blog</p>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
        Notes on branching your data
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-brand-text-darker">
        Guides on MongoDB branching, time travel, and giving AI agents databases
        they can’t destroy.
      </p>

      <ul className="mt-12 divide-y divide-brand-edge border-y border-brand-edge">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block py-6">
              <p className="font-mono text-xs text-brand-muted">
                {new Date(p.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}{' '}
                · {p.readingMinutes} min read
              </p>
              <h2 className="mt-2 text-lg font-medium text-brand-text transition-colors group-hover:text-brand-primary">
                {p.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-brand-text-darker">
                {p.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
