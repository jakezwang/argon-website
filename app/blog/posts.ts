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
    slug: "two-ai-agents-one-mongodb-document",
    title: "What Happens When Two AI Agents Change the Same MongoDB Document?",
    description:
      "A Python walkthrough of database branches, merge conflicts, and undo, using one order and two competing price changes.",
    date: "2026-09-08",
    updated: "2026-09-24",
    tags: ["AI Agents", "MongoDB", "Data Review"],
    readingMinutes: 7,
  },
  {
    slug: "mongodb-mcp-server-versioned-sandboxes",
    title: "MCP + MongoDB: Versioned Sandboxes for Agent Tool-Calls",
    description:
      "Use Argon’s MongoDB MCP server for agent sandboxes, reviewed merges, undo, and pins. Learn which tools manage branches and how drivers access the data.",
    date: "2026-07-08",
    updated: "2026-09-27",
    tags: ["MCP", "AI Agents", "MongoDB"],
    readingMinutes: 7,
  },
  {
    slug: "mongodb-time-travel-vs-point-in-time-recovery",
    title: "MongoDB Time Travel vs Point-in-Time Recovery",
    description:
      "Compare MongoDB point-in-time recovery with Argon historical reads and branches: recovery scope, retained history, and when to use each workflow.",
    date: "2026-07-08",
    updated: "2026-09-27",
    tags: ["MongoDB", "Time Travel", "Backup"],
    readingMinutes: 8,
  },
  {
    slug: "mongodb-database-branching-explained",
    title: "MongoDB Database Branching, Explained",
    description:
      "Learn how MongoDB branching works with Argon: lightweight branch metadata, physical checkout, document diffs, and an explicit merge review workflow.",
    date: "2026-07-08",
    updated: "2026-09-27",
    tags: ["MongoDB", "Branching", "Database"],
    readingMinutes: 8,
  },
  {
    slug: "database-branching-tools-compared",
    title:
      "Database Branching Tools Compared: Neon, PlanetScale, Dolt, lakeFS, and Argon",
    description:
      "Compare Neon, PlanetScale Vitess and Postgres, Dolt, lakeFS, and Argon by data model, branch workflow, and review boundaries. Sources checked September 2026.",
    date: "2026-07-08",
    updated: "2026-09-26",
    tags: ["Comparison", "Branching", "Database"],
    readingMinutes: 9,
  },
  {
    slug: "disposable-mongodb-sandbox-for-ai-agents",
    title: "A Disposable MongoDB Sandbox for Every AI Agent",
    description:
      "Give each AI agent a MongoDB sandbox with Argon. Learn branch-per-agent isolation, dataset pins, TTL cleanup, and the capture requirements for undo.",
    date: "2026-07-08",
    updated: "2026-10-04",
    tags: ["AI Agents", "MCP", "MongoDB"],
    readingMinutes: 7,
  },
];

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const sortedPosts = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));
