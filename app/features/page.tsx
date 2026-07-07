import Link from 'next/link';

const FeatureCard = ({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-brand-dark p-6">
    <p className="font-mono text-xs text-brand-primary">{index}</p>
    <h3 className="mt-3 font-medium text-brand-text">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-brand-text-darker">{children}</p>
  </div>
);

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Features</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-brand-text">
        Version control for your MongoDB data
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Millisecond branching, time travel, and restore, built on a
        deterministic write-ahead log. Open source and self-hosted.
      </p>

      {/* Key features */}
      <div className="mt-16 grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard index="/01" title="Millisecond branching">
          Creating a branch writes metadata only — no database copies, no
          backup/restore cycles. Measured: 0.86 ms p50 / 1.93 ms p99 on a
          project with 50k-entry history, 479 bytes of storage per branch.
        </FeatureCard>
        <FeatureCard index="/02" title="Time-travel queries">
          Inspect your database as it was at any point in its history,
          addressed by log sequence number or timestamp, and restore from any
          of those states.
        </FeatureCard>
        <FeatureCard index="/03" title="Deterministic by design">
          Replay is a pure function, verified by property tests in CI: the
          same history produces the same state every time, across processes
          and instances.
        </FeatureCard>
        <FeatureCard index="/04" title="Agent &amp; eval workflows">
          TTL sandboxes with per-actor undo, dataset pins that GC and reset
          can never touch, and the argon-agents package: a LangGraph
          checkpointer with fork and rewind, plus a Mem0 factory.
        </FeatureCard>
        <FeatureCard index="/05" title="Four surfaces, one engine">
          A unified CLI for humans and CI, an MCP server for agents
          (thirteen tools), a REST control plane for language SDKs, and a
          wire proxy for stable per-branch connection strings.
        </FeatureCard>
        <FeatureCard index="/06" title="Honest engineering">
          Every performance number on this site comes from our public
          benchmark suite — pinned engine ref, recorded environment,
          reproducible with docker compose up. Numbers we can&apos;t back
          don&apos;t get published.
        </FeatureCard>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="mt-24 max-w-3xl scroll-mt-20">
        <p className="kicker mb-4">How it works</p>
        <h2 className="text-3xl font-semibold tracking-tight text-brand-text">
          Everything is a view over the log
        </h2>
        <p className="mt-4 text-lg leading-8">
          Every write is recorded in an append-only write-ahead log (WAL).
          Branches, time-travel, and restore are all views over that log.
        </p>

        <div className="mt-12 space-y-10">
          {[
            {
              n: '1',
              title: 'The WAL is the source of truth',
              body: 'Every write becomes an entry with a global LSN (log sequence number). "The database at LSN 5000" simply means replaying the log up to entry 5000 — that one idea powers everything else.',
            },
            {
              n: '2',
              title: 'Branches are pointers',
              body: 'A branch is metadata: which branch it forked from, at which LSN, and where its own head is. Creating one is a single metadata write — milliseconds, regardless of data size.',
            },
            {
              n: '3',
              title: 'Deterministic replay (new in M1)',
              body: 'Replay is a pure function over the log, so the same history always reconstructs the same state — property-tested across processes, instances, and thousands of replays. Time-travel and restore inherit this guarantee.',
            },
            {
              n: '4',
              title: 'Reproducible agent & eval workflows',
              body: 'argon sandbox gives an agent a disposable real database with a TTL; argon pin freezes a named dataset state so every eval run forks identical input. The argon-agents package brings the same engine to LangGraph and Mem0 through the REST control plane.',
            },
            {
              n: '5',
              title: 'Branches are real databases (M3)',
              body: 'argon checkout materializes a branch into a physical MongoDB database and prints its connection string — any driver connects, and indexes, aggregations, and transactions just work. Direct writes flow back into the WAL via change streams, and argon undo reverts a session with conflict detection.',
            },
            {
              n: '6',
              title: 'Data PRs & the agent surface (M4–M5)',
              body: 'argon diff and argon merge preview/apply turn adoption into a reviewed, exactly-once operation — conflicts are never resolved silently, and merges are undoable. argon sandbox adds TTL branches that clean up after themselves, argon pin freezes named dataset states that GC and reset can never touch, and argon mcp exposes the whole loop to agents as MCP tools.',
            },
          ].map((item) => (
            <div key={item.n} className="border-l border-brand-edge pl-6">
              <p className="font-mono text-sm text-brand-primary">{item.n}</p>
              <h3 className="mt-2 font-medium text-brand-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-6">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-lg leading-8">
          The result:{' '}
          <span className="text-brand-text">branching that costs metadata, not copies</span>,{' '}
          <span className="text-brand-text">reproducible time-travel</span> for MongoDB, and{' '}
          <span className="text-brand-text">a correctness-first core</span> locked down by
          property tests.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
          <a
            href="https://github.com/argon-lab/argon/blob/master/docs/CLI.md"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Full CLI reference →
          </a>
          <a
            href="https://github.com/argon-lab/argon/blob/master/docs/ARCHITECTURE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Architecture deep dive →
          </a>
          <a
            href="https://github.com/argon-lab/benchmarks"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Run the benchmarks →
          </a>
          <a
            href="https://github.com/argon-lab/argon/blob/master/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Changelog →
          </a>
        </div>
      </div>
    </div>
  );
}
