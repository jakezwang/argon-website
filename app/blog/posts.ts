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
    slug: "argon-vs-dumbodb-response-to-dolthub",
    title: "Argon vs DumboDB: What DoltHub’s Comparison Got Right",
    description:
      "DoltHub compared Argon with DumboDB and measured both. Their account of Argon is accurate. Our own measurements, the trade-off, and what we are changing.",
    date: "2026-11-17",
    tags: ["Comparison", "MongoDB", "Branching"],
    readingMinutes: 11,
  },
  {
    slug: "connect-code-sandbox-to-mongodb-sandbox-boxd",
    title:
      "Connect a Code Sandbox to a MongoDB Sandbox: A Runnable Example with boxd",
    description:
      "Run agent-written code on an isolated boxd machine against an Argon MongoDB sandbox, using a database user made for one run. Output, failure paths and limits.",
    date: "2026-11-17",
    tags: ["AI Agents", "MongoDB", "Sandbox"],
    readingMinutes: 11,
  },
  {
    slug: "code-sandbox-vs-data-sandbox-for-ai-agents",
    title:
      "Code Sandboxes Isolate What Agents Run. What Isolates What They Write?",
    description:
      "A code sandbox contains agent-written code, not its database writes. See what a MongoDB data sandbox adds, with a runnable example and its limits.",
    date: "2026-11-11",
    updated: "2026-11-12",
    tags: ["AI Agents", "MongoDB", "Sandbox"],
    readingMinutes: 8,
  },
  {
    slug: "validate-mongodb-agent-catalog-changes",
    title:
      "Zero Conflicts, Wrong Price: Validate MongoDB Agent Catalog Changes",
    description:
      "Run five synthetic MongoDB MCP cases to validate catalog proposals before merging: derived prices, unexpected fields, extra documents and deletes.",
    date: "2026-11-03",
    tags: ["MongoDB", "AI Agents", "Data Review"],
    readingMinutes: 8,
  },
  {
    slug: "mongodb-mcp-sandbox-reviewed-merge-tutorial",
    title:
      "A Reproducible MongoDB MCP Tutorial: From Sandbox to Reviewed Merge",
    description:
      "Run a local MongoDB MCP example: create a sandbox, write with PyMongo, inspect the saved merge plan, then explicitly merge or discard the changes.",
    date: "2026-10-20",
    updated: "2026-11-12",
    tags: ["MCP", "AI Agents", "MongoDB"],
    readingMinutes: 9,
  },
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
      "Use Argon’s MCP server to create MongoDB sandboxes, review merges, undo changes, and pin a starting state. Learn which tools manage branches and how drivers access the data.",
    date: "2026-07-08",
    updated: "2026-11-11",
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
    updated: "2026-11-12",
    tags: ["MongoDB", "Branching", "Database"],
    readingMinutes: 8,
  },
  {
    slug: "database-branching-tools-compared",
    title:
      "Database Branching Tools Compared: Neon, PlanetScale, Dolt, lakeFS, and Argon",
    description:
      "Compare Neon, PlanetScale, Dolt, DumboDB, lakeFS, and Argon by data model, branch workflow, and review boundaries. Sources checked November 2026.",
    date: "2026-07-08",
    updated: "2026-11-17",
    tags: ["Comparison", "Branching", "Database"],
    readingMinutes: 9,
  },
  {
    slug: "disposable-mongodb-sandbox-for-ai-agents",
    title: "A Disposable MongoDB Sandbox for Every AI Agent",
    description:
      "Give each AI agent a MongoDB sandbox with Argon. Learn branch-per-agent isolation, dataset pins, TTL cleanup, and the capture requirements for undo.",
    date: "2026-07-08",
    updated: "2026-11-12",
    tags: ["AI Agents", "MCP", "MongoDB"],
    readingMinutes: 9,
  },
];

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export const sortedPosts = (): Post[] =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date));
