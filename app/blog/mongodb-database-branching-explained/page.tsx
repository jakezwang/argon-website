import { limits } from "../../product";
import cli from "../../cli-examples.json";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("mongodb-database-branching-explained")!;

export const metadata = {
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: ["/og.png"],
  },
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: "article",
    siteName: "Argon",
    url: `https://argonlabs.tech/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    publishedTime: post.date,
    modifiedTime: post.updated,
  },
};

const faq = [
  {
    q: "Does MongoDB support branching natively?",
    a: "No. MongoDB has no built-in branching, time travel, or merge. You can approximate isolation with mongodump/mongorestore or by cloning a cluster, but those copy all of your data, are slow, and cannot merge changes back. Argon adds true branching as an open-source layer on top of MongoDB.",
  },
  {
    q: "How is branching different from mongodump and mongorestore?",
    a: `A dump is a standalone copy without Argon branch history or reviewed merge. ${limits.branching} ${limits.retention}`,
  },
  {
    q: "How fast is it to create a MongoDB branch?",
    a: limits.branching,
  },
  {
    q: "Can I use my existing MongoDB driver with a branch?",
    a: "Yes. Checking out a branch gives you an ordinary MongoDB connection string. Any MongoDB driver, mongosh, or Compass connects to it — no SDK and no code changes.",
  },
  {
    q: "Is Argon free and open source?",
    a: "Yes. Argon is MIT-licensed and self-hosted. You can run the entire engine yourself.",
  },
  {
    q: "Why is database branching useful for AI agents?",
    a: `${limits.isolation} ${limits.undo}`,
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        <strong>MongoDB database branching</strong> is the ability to create a
        separate workspace for database changes — a <em>branch</em> — that
        shares history with its parent but can be written to, reviewed, merged,
        or thrown away on its own. It is the idea Git brought to source code,
        applied to your data: shared branch history, retained past states, and a
        review step before changes reach production.
      </p>
      <p>
        MongoDB has no native branching. This guide explains what branching
        means for a document database, why it matters now (especially for AI
        agents), how it works under the hood, and how to do it today with{" "}
        <a href="https://github.com/argon-lab/argon">Argon</a>, an open-source
        engine that adds branching, time travel, and merge to MongoDB.
      </p>

      <h2>Why MongoDB has no branching (and Postgres sort of does)</h2>
      <p>
        Postgres developers reach for Neon; MySQL developers reach for
        PlanetScale. Both give you database branches: a lightweight,
        copy-on-write fork of your data you can spin up per pull request, per
        preview environment, or per experiment. MongoDB — the default database
        for a generation of application developers — has never had an
        equivalent.
      </p>
      <p>
        The usual workarounds are blunt. You <code>mongodump</code> and{" "}
        <code>mongorestore</code> a whole database, or you clone a cluster. Both
        copy every byte, take minutes to hours, cost real storage, and leave you
        with a dead snapshot: no shared history, no way to merge changes back.
        That is a backup, not a branch.
      </p>

      <h2>What database branching actually gives you</h2>
      <ul>
        <li>
          <strong>Isolation.</strong> Every branch is a real, separate MongoDB
          database after checkout. Use its connection string for experiment
          writes, and restrict credentials and network access to the intended
          database.
        </li>
        <li>
          <strong>Metadata creation.</strong> {limits.branching}
        </li>
        <li>
          <strong>Time travel.</strong> {limits.retention}
        </li>
        <li>
          <strong>Review and merge.</strong> Diff two branches, review the
          change as a “data PR,” and merge reviewed. Conflicts are reported,
          never resolved silently.
        </li>
        <li>
          <strong>Undo.</strong> {limits.undo} {limits.attribution}
        </li>
      </ul>

      <h2>How branching works under the hood</h2>
      <p>
        Argon models a MongoDB database as a <strong>write-ahead log</strong>:
        an ordered record of every operation, each stamped with a log sequence
        number. A branch is not a copy of your documents — it is a pointer into
        that shared log plus the writes made after the branch point. Reading a
        branch replays the log deterministically up to the position you ask for.
      </p>
      <p>
        This is why branches are cheap and time travel is effectively free: the
        data already exists as history. Creating a branch writes a few hundred
        bytes of metadata, not gigabytes of documents, and asking for the state
        at an earlier position just replays fewer entries. When you{" "}
        <code>checkout</code> a branch, Argon materializes it into a physical
        MongoDB database and hands you a connection string, so your application
        and tools talk to ordinary MongoDB.
      </p>

      <h2>Branching for AI agents</h2>
      <p>
        Branching stopped being a nice-to-have the moment AI agents started
        writing to databases. An agent let loose on production is a liability;
        an agent given its own branch is safe by construction. The pattern is
        simple: fork a branch (optionally with a time-to-live), let the agent
        read and write freely, then review the diff and either merge what it did
        or discard the branch entirely.
      </p>
      <p>
        Argon exposes this to agents directly through an{" "}
        <a href="/agents">MCP server</a>, TTL sandboxes, and reproducible
        dataset pins so runs can start from the same retained input. Each agent
        works in a separate branch database with explicitly scoped access.
      </p>

      <h2>How to branch a MongoDB database with Argon</h2>
      <p>
        Complete the <a href="/quickstart">local MongoDB setup</a> first. With
        an existing project named <code>docs-review</code>, fork its main branch
        into a new sandbox named <code>agent-review</code>:
      </p>
      <pre>
        <code data-cli-example="branch">{`# Terminal A: create a sandbox, then keep capture running
${cli.sandbox}
${cli.watchSandbox}

# Terminal B: after writes through the printed sandbox URI
${cli.diff}
${cli.mergePreview}

# Schedule this sweep while using CLI-managed TTL sandboxes
${cli.sweep}`}</code>
      </pre>
      <p>
        Prepare exact images on new collections before updates with{" "}
        <code>
          argon collections prepare orders -p docs-review -b agent-review
        </code>
        . The preview prints a plan ID; inspect that plan before explicitly
        applying it. Stop sandbox writers and capture before discarding or
        letting expiry cleanup run. For the full command set, see the{" "}
        <a href="/features">features</a> overview or the{" "}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">
          documentation
        </a>
        . Every published performance number links to a run of the open{" "}
        <a href="https://github.com/argon-lab/benchmarks">benchmark suite</a>.
      </p>
    </ArticleLayout>
  );
}
