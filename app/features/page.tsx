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

      {/* One idea, then the docs */}
      <div className="mt-16 max-w-3xl">
        <p className="text-lg leading-8">
          Everything is a view over one append-only log: branches are
          pointers into it, time-travel replays it (deterministically,
          property-tested), and checkout materializes it into a real
          MongoDB database. The deep dives:
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
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
