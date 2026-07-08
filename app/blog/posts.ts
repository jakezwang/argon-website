// Blog post registry. Each entry drives the /blog index, per-post metadata,
// the article header, and the sitemap. Keep newest first is handled by sort.
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (published)
  updated?: string; // ISO (last meaningful edit) — used for freshness signals
  tags: string[];
  readingMinutes: number;
};

export const posts: Post[] = [
  {
    slug: 'mongodb-database-branching-explained',
    title: 'MongoDB Database Branching, Explained',
    description:
      'What database branching means for MongoDB, why MongoDB has no native equivalent of Neon or PlanetScale, how it works under the hood, and how to branch a MongoDB database today with Argon.',
    date: '2026-07-08',
    tags: ['MongoDB', 'Branching', 'Database'],
    readingMinutes: 8,
  },
];

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const sortedPosts = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));
