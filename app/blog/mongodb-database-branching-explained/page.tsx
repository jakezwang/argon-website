import ArticleLayout from '../ArticleLayout';
import { getPost } from '../posts';

const post = getPost('mongodb-database-branching-explained')!;

export const metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: 'article',
    siteName: 'Argon',
    url: `https://argonlabs.tech/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    publishedTime: post.date,
  },
};

const faq = [
  {
    q: 'Does MongoDB support branching natively?',
    a: 'No. MongoDB has no built-in branching, time travel, or merge. You can approximate isolation with mongodump/mongorestore or by cloning a cluster, but those copy all of your data, are slow, and cannot merge changes back. Argon adds true branching as an open-source layer on top of MongoDB.',
  },
  {
    q: 'How is branching different from mongodump and mongorestore?',
    a: 'mongodump and mongorestore produce a full, standalone copy with no shared history and no way to merge changes back — that is a backup. A branch shares history with its parent, is created in milliseconds, supports time travel to any earlier point, and can be diffed and merged back like a pull request.',
  },
  {
    q: 'How fast is it to create a MongoDB branch?',
    a: 'Milliseconds. A branch stores a small amount of metadata rather than copying documents, so creation time stays roughly constant regardless of database size. Reproducible numbers live in the open Argon benchmark suite.',
  },
  {
    q: 'Can I use my existing MongoDB driver with a branch?',
    a: 'Yes. Checking out a branch gives you an ordinary MongoDB connection string. Any MongoDB driver, mongosh, or Compass connects to it — no SDK and no code changes.',
  },
  {
    q: 'Is Argon free and open source?',
    a: 'Yes. Argon is MIT-licensed and self-hosted. You can run the entire engine yourself.',
  },
  {
    q: 'Why is database branching useful for AI agents?',
    a: 'It gives each agent its own isolated, disposable database. The agent writes freely in a branch; you review the diff and merge what works or discard the rest. Per-actor undo means any change an agent made is reversible without a full restore.',
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        <strong>MongoDB database branching</strong> is the ability to create an
        instant, isolated copy of a database — a <em>branch</em> — that shares
        history with its parent but can be written to, reviewed, merged, or
        thrown away on its own. It is the idea Git brought to source code,
        applied to your data: cheap branches, a full history you can rewind, and
        a review step before changes reach production.
      </p>
      <p>
        MongoDB has no native branching. This guide explains what branching
        means for a document database, why it matters now (especially for AI
        agents), how it works under the hood, and how to do it today with{' '}
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
        The usual workarounds are blunt. You <code>mongodump</code> and{' '}
        <code>mongorestore</code> a whole database, or you clone a cluster. Both
        copy every byte, take minutes to hours, cost real storage, and leave you
        with a dead snapshot: no shared history, no way to merge changes back.
        That is a backup, not a branch.
      </p>

      <h2>What database branching actually gives you</h2>
      <ul>
        <li>
          <strong>Isolation.</strong> Every branch is a real, separate MongoDB
          database with its own connection string. Point any driver at it and
          nothing you do touches production.
        </li>
        <li>
          <strong>Instant creation.</strong> A branch shares history with its
          parent instead of copying data, so it is created in milliseconds
          rather than minutes.
        </li>
        <li>
          <strong>Time travel.</strong> Because the full history is retained,
          you can query a branch as it existed at any earlier point, or restore
          to it.
        </li>
        <li>
          <strong>Review and merge.</strong> Diff two branches, review the
          change as a “data PR,” and merge exactly-once. Conflicts are reported,
          never resolved silently.
        </li>
        <li>
          <strong>Undo.</strong> Every write is a revertible range, so a bad
          change — or one specific actor’s changes — can be undone without a
          full restore.
        </li>
      </ul>

      <h2>How branching works under the hood</h2>
      <p>
        Argon models a MongoDB database as a <strong>write-ahead log</strong>: an
        ordered record of every operation, each stamped with a log sequence
        number. A branch is not a copy of your documents — it is a pointer into
        that shared log plus the writes made after the branch point. Reading a
        branch replays the log deterministically up to the position you ask for.
      </p>
      <p>
        This is why branches are cheap and time travel is effectively free: the
        data already exists as history. Creating a branch writes a few hundred
        bytes of metadata, not gigabytes of documents, and asking for the state
        at an earlier position just replays fewer entries. When you{' '}
        <code>checkout</code> a branch, Argon materializes it into a physical
        MongoDB database and hands you a connection string, so your application
        and tools talk to ordinary MongoDB.
      </p>

      <h2>Branching for AI agents</h2>
      <p>
        Branching stopped being a nice-to-have the moment AI agents started
        writing to databases. An agent let loose on production is a liability; an
        agent given its own branch is safe by construction. The pattern is
        simple: fork a branch (optionally with a time-to-live), let the agent
        read and write freely, then review the diff and either merge what it did
        or discard the branch entirely.
      </p>
      <p>
        Argon exposes this to agents directly through an{' '}
        <a href="/agents">MCP server</a>, TTL sandboxes, and reproducible dataset
        pins so every evaluation run starts from identical data. Each agent gets
        a disposable MongoDB it cannot destroy.
      </p>

      <h2>How to branch a MongoDB database with Argon</h2>
      <p>Argon is open source (MIT) and self-hosted. Install the CLI and create a branch:</p>
      <pre>
        <code>{`# install the CLI
brew install argon-lab/tap/argonctl

# create a time-boxed sandbox branch off prod
argon sandbox create -p prod --ttl 1h
# ...prints a real MongoDB connection string.
# point any driver, mongosh, or Compass at it.

# review what changed, then merge or discard
argon diff main my-branch
argon merge preview main my-branch`}</code>
      </pre>
      <p>
        For the full command set, see the <a href="/features">features</a>{' '}
        overview or the{' '}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">
          documentation
        </a>
        . Every published performance number links to a run of the open{' '}
        <a href="https://github.com/argon-lab/benchmarks">benchmark suite</a>.
      </p>
    </ArticleLayout>
  );
}
