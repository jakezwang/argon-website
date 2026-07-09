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
    slug: 'mongodb-mcp-server-versioned-sandboxes',
    title: 'MCP + MongoDB: Versioned Sandboxes for Agent Tool-Calls',
    description:
      'Connecting an AI agent to MongoDB over MCP usually means handing it a live database. Argon’s MCP server gives each agent a versioned, branchable MongoDB instead — 13 tools to open a sandbox, diff, merge, time-travel, and undo.',
    date: '2026-07-08',
    tags: ['MCP', 'AI Agents', 'MongoDB'],
    readingMinutes: 7,
  },
  {
    slug: 'mongodb-time-travel-vs-point-in-time-recovery',
    title: 'MongoDB Time Travel vs Point-in-Time Recovery',
    description:
      'Time travel and point-in-time recovery (PITR) both go back in time in MongoDB, but they solve opposite problems: PITR restores a whole database for disaster recovery, while time travel queries or branches any past state without touching the present. How each works, and when to use which.',
    date: '2026-07-08',
    tags: ['MongoDB', 'Time Travel', 'Backup'],
    readingMinutes: 8,
  },
  {
    slug: 'mongodb-database-branching-explained',
    title: 'MongoDB Database Branching, Explained',
    description:
      'What database branching means for MongoDB, why MongoDB has no native equivalent of Neon or PlanetScale, how it works under the hood, and how to branch a MongoDB database today with Argon.',
    date: '2026-07-08',
    tags: ['MongoDB', 'Branching', 'Database'],
    readingMinutes: 8,
  },
  {
    slug: 'database-branching-tools-compared',
    title: 'Database Branching Tools Compared: Neon, PlanetScale, Dolt, lakeFS, and Argon',
    description:
      'A practical map of the database branching landscape — what Neon, PlanetScale, Dolt, lakeFS, and Argon each branch, how they compare on merge, time travel, and licensing, and which one fits MongoDB.',
    date: '2026-07-08',
    tags: ['Comparison', 'Branching', 'Database'],
    readingMinutes: 9,
  },
  {
    slug: 'disposable-mongodb-sandbox-for-ai-agents',
    title: 'A Disposable MongoDB Sandbox for Every AI Agent',
    description:
      'Why AI agents need their own database, how a branch-per-agent workflow keeps production safe, and how to wire it up with Argon’s MCP server, TTL sandboxes, and reproducible dataset pins.',
    date: '2026-07-08',
    tags: ['AI Agents', 'MCP', 'MongoDB'],
    readingMinutes: 7,
  },
];

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const sortedPosts = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));
