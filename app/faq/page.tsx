import Link from 'next/link';

export const metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about Argon: MongoDB branching, time travel, merge, agent sandboxes, requirements, and how it compares to mongodump and PITR.',
  alternates: { canonical: '/faq' },
};

// One array drives both the visible FAQ and the FAQPage JSON-LD, so the
// schema always matches on-page content (a Google requirement).
const faq: { q: string; a: React.ReactNode; aText: string }[] = [
  {
    q: 'What is Argon?',
    aText:
      'Argon is an open-source (MIT) versioning layer for MongoDB. It adds Git-style branching, time travel, reviewable merges, and per-actor undo on top of real MongoDB — without replacing it.',
    a: (
      <>
        Argon is an open-source (MIT) versioning layer for MongoDB. It adds
        Git-style branching, time travel, reviewable merges, and per-actor undo
        on top of real MongoDB — without replacing it. See{' '}
        <Link href="/features" className="prose-link">
          features
        </Link>{' '}
        for the full list.
      </>
    ),
  },
  {
    q: 'Does MongoDB support branching natively?',
    aText:
      'No. MongoDB has no built-in branching, time travel, or merge. Postgres has Neon and MySQL has PlanetScale; Argon fills that gap for MongoDB as a self-hosted, open-source engine.',
    a: (
      <>
        No. MongoDB has no built-in branching, time travel, or merge. Postgres
        has Neon and MySQL has PlanetScale; Argon fills that gap for MongoDB as
        a self-hosted, open-source engine. Background:{' '}
        <Link href="/blog/mongodb-database-branching-explained" className="prose-link">
          MongoDB database branching, explained
        </Link>
        .
      </>
    ),
  },
  {
    q: 'How is a branch different from mongodump/mongorestore?',
    aText:
      'A dump is a full copy with no shared history and no way to merge back. An Argon branch is a pointer into shared history — created in milliseconds at any data size, a few hundred bytes of metadata — and it stays a live, queryable database you can diff, merge, or discard.',
    a: (
      <>
        A dump is a full copy with no shared history and no way to merge back.
        An Argon branch is a pointer into shared history — created in
        milliseconds at any data size, a few hundred bytes of metadata — and it
        stays a live, queryable database you can diff, merge, or discard.
      </>
    ),
  },
  {
    q: 'Do I need to change my application code or drivers?',
    aText:
      'No. argon checkout materializes a branch into a real MongoDB database and prints an ordinary connection string. Any driver, mongosh, or Compass connects to it — no SDK, no code changes.',
    a: (
      <>
        No. <code>argon checkout</code> materializes a branch into a real
        MongoDB database and prints an ordinary connection string. Any driver,
        mongosh, or Compass connects to it — no SDK, no code changes.
      </>
    ),
  },
  {
    q: 'What are the requirements?',
    aText:
      'MongoDB running as a replica set (a one-node replica set is fine) or Atlas — change-stream capture does not work on a standalone mongod. The engine is a single Go binary, installed via Homebrew or npm, and is fully self-hosted.',
    a: (
      <>
        MongoDB running as a replica set (a one-node replica set is fine) or
        Atlas — change-stream capture does not work on a standalone{' '}
        <code>mongod</code>. The engine is a single Go binary, installed via
        Homebrew or npm, and is fully self-hosted.
      </>
    ),
  },
  {
    q: 'Is Argon free and open source?',
    aText:
      'Yes. Argon is MIT-licensed and self-hosted. The open-source engine is the product; the hosted console is a demo.',
    a: (
      <>
        Yes. Argon is MIT-licensed and self-hosted — the{' '}
        <a
          href="https://github.com/argon-lab/argon"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link"
        >
          open-source engine
        </a>{' '}
        is the product; the hosted console is a demo.
      </>
    ),
  },
  {
    q: 'How do AI agents use Argon?',
    aText:
      'Each agent gets its own TTL sandbox branch — a real MongoDB it can write to freely. You review the diff and merge what works, or discard the branch. Argon ships an MCP server (13 tools, listed in the official MCP Registry as io.github.argon-lab/argon) plus a LangGraph checkpointer and Mem0 factory via the argon-agents Python package.',
    a: (
      <>
        Each agent gets its own TTL sandbox branch — a real MongoDB it can
        write to freely. You review the diff and merge what works, or discard
        the branch. Argon ships an MCP server (13 tools, listed in the official
        MCP Registry as <code>io.github.argon-lab/argon</code>) plus a
        LangGraph checkpointer and Mem0 factory via the{' '}
        <code>argon-agents</code> Python package. Details:{' '}
        <Link href="/agents" className="prose-link">
          Argon for agents
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Is time travel a replacement for backups?',
    aText:
      'No. Keep real backups or point-in-time recovery for disaster recovery. Time travel is for everything short of catastrophe: debugging on historical data, audits, and recovering a collection by branching from just before the mistake — all without touching the live database.',
    a: (
      <>
        No. Keep real backups or point-in-time recovery for disaster recovery.
        Time travel is for everything short of catastrophe: debugging on
        historical data, audits, and recovering a collection by branching from
        just before the mistake — all without touching the live database. More:{' '}
        <Link
          href="/blog/mongodb-time-travel-vs-point-in-time-recovery"
          className="prose-link"
        >
          time travel vs PITR
        </Link>
        .
      </>
    ),
  },
  {
    q: 'How fast is creating a branch?',
    aText:
      'Milliseconds, independent of database size — a branch is a metadata write, not a copy. Every published number comes from the open benchmark suite you can run yourself with docker compose up.',
    a: (
      <>
        Milliseconds, independent of database size — a branch is a metadata
        write, not a copy. Every published number comes from the open{' '}
        <a
          href="https://github.com/argon-lab/benchmarks"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link"
        >
          benchmark suite
        </a>{' '}
        you can run yourself with <code>docker compose up</code>.
      </>
    ),
  },
  {
    q: 'How do I install Argon?',
    aText:
      'brew install argon-lab/tap/argonctl on macOS, or npm install -g argonctl cross-platform. For agent frameworks: pip install argon-agents[langgraph].',
    a: (
      <>
        <code>brew install argon-lab/tap/argonctl</code> on macOS, or{' '}
        <code>npm install -g argonctl</code> cross-platform. For agent
        frameworks: <code>pip install &quot;argon-agents[langgraph]&quot;</code>. Then
        step through the{' '}
        <Link href="/demo" className="prose-link">
          interactive demo
        </Link>
        .
      </>
    ),
  },
];

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.aText },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <p className="kicker mb-4">FAQ</p>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-brand-text-darker">
        Short answers about branching, time travel, merge, and running agents
        against MongoDB. Something missing?{' '}
        <a
          href="https://github.com/argon-lab/argon/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link"
        >
          Ask in Discussions
        </a>
        .
      </p>

      <dl className="mt-12 divide-y divide-brand-edge border-y border-brand-edge">
        {faq.map((f, i) => (
          <div key={f.q} className="py-6">
            <dt className="flex gap-4">
              <span className="font-mono text-xs leading-6 text-brand-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium text-brand-text">{f.q}</span>
            </dt>
            <dd className="mt-2 pl-10 text-sm leading-6 text-brand-text-darker">
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
