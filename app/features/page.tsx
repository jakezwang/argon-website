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

export const metadata = {
  title: 'Branching, Time Travel & Data PRs for MongoDB',
  description:
    'Git-style branching, point-in-time time travel, reviewable data PRs (diff + merge), and per-actor undo for MongoDB. Open-source, MIT-licensed, and self-hosted.',
  alternates: { canonical: '/features' },
};

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
          One metadata write — no copies at any size. Measured: 0.86 ms
          p50, 479 bytes per branch.
        </FeatureCard>
        <FeatureCard index="/02" title="Time-travel queries">
          Inspect or restore any historical state, addressed by LSN or
          timestamp.
        </FeatureCard>
        <FeatureCard index="/03" title="Deterministic by design">
          Same history, same state — byte for byte, property-tested in CI.
        </FeatureCard>
        <FeatureCard index="/04" title="Agent &amp; eval workflows">
          TTL sandboxes, per-actor undo, GC-proof dataset pins, and a
          LangGraph checkpointer (argon-agents).
        </FeatureCard>
        <FeatureCard index="/05" title="Four surfaces, one engine">
          CLI for humans · MCP for agents (13 tools) · REST for SDKs ·
          wire proxy for stable URIs.
        </FeatureCard>
        <FeatureCard index="/06" title="Honest engineering">
          Every number links to a benchmark you can run with docker compose
          up. What we can&apos;t back, we don&apos;t publish.
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
