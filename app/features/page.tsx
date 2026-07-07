import Image from 'next/image';
import Link from 'next/link';

// Helper component for individual features
const FeatureCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="bg-brand-surface p-6 rounded-lg shadow-xl hover:shadow-brand-primary/30 transition-shadow duration-300">
    <dt>
      <p className="text-2xl font-semibold leading-6 text-brand-primary">{icon} {title}</p>
    </dt>
    <dd className="mt-2 text-base text-brand-text-darker">{children}</dd>
  </div>
);

export default function FeaturesPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h1 className="text-base font-semibold leading-7 text-brand-primary">Discover Argon</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Supercharge Your MongoDB Workflows
          </p>
          <p className="mt-6 text-lg leading-8 text-brand-text-darker">
            Argon brings Git-like version control to MongoDB: millisecond branching, time-travel,
            and restore, built on a deterministic write-ahead log. Open source and self-hosted.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 sm:text-4xl text-brand-text">Key Features</h2>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <FeatureCard icon="⚡" title="Millisecond Branching">
              Creating a branch writes metadata only — no database copies, no backup/restore
              cycles. Branches share history through LSN pointers into the write-ahead log.
            </FeatureCard>
            <FeatureCard icon="⏳" title="Time-Travel Queries">
              Inspect your database as it was at any point in its history, addressed by
              log sequence number or timestamp, and restore from any of those states.
            </FeatureCard>
            <FeatureCard icon="🔬" title="Deterministic by Design">
              Replay is a pure function, verified by property tests in CI: the same history
              produces the same state every time, across processes and instances.
            </FeatureCard>
            <FeatureCard icon="🤖" title="ML Framework Integration">
              Native support for MLflow, Weights & Biases, and DVC workflows.
              Track experiments and version datasets alongside your ML pipeline.
            </FeatureCard>
            <FeatureCard icon="🐍" title="Multiple SDKs">
              Python SDK via pip, Go SDK, and unified CLI interface.
              Install via Homebrew, NPM, or pip for cross-platform support.
            </FeatureCard>
            <FeatureCard icon="🧭" title="Honest Engineering">
              Every performance number we publish will link to a reproducible benchmark
              (coming with Milestone 2). Until then, we&apos;d rather show you the tests than the adjectives.
            </FeatureCard>
          </dl>
          <div className="text-center mt-10">
            <Link href="https://github.com/argon-lab/argon/blob/master/docs/FEATURES.md" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary underline text-lg">
              Explore all features in detail &rarr;
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mx-auto mt-20 max-w-4xl sm:mt-28 lg:mt-32 scroll-mt-20"> {/* Added id and scroll-margin */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-brand-text">How It Works</h2>
            <p className="mt-4 text-lg leading-8 text-brand-text-darker">
              Every write is recorded in an append-only write-ahead log (WAL).
              Branches, time-travel, and restore are all views over that log.
            </p>
          </div>

          <div className="space-y-8 text-brand-text-darker">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">1. The WAL Is the Source of Truth</h3>
              <p>Every write becomes an entry with a global LSN (Log Sequence Number). "The database at LSN 5000" simply means replaying the log up to entry 5000 — that one idea powers everything else.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">2. Branches Are Pointers</h3>
              <p>A branch is metadata: which branch it forked from, at which LSN, and where its own head is. Creating one is a single metadata write — milliseconds, regardless of data size.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">3. Deterministic Replay (New in M1)</h3>
              <p>Replay is a pure function over the log, so the same history always reconstructs the same state — property-tested across processes, instances, and thousands of replays. Time-travel and restore inherit this guarantee.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">4. ML Workflow Support</h3>
              <p>Integration with MLflow, Weights & Biases, and DVC enables seamless experiment tracking. Python SDK provides programmatic access for automated ML pipelines.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">5. What's Next: v2</h3>
              <p>Snapshots for bounded replay and public benchmarks (M2), one physical MongoDB database per branch so pymongo and mongoose work unchanged (M3), then merge, diff, and data PRs (M4). See the roadmap for details.</p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-7 text-brand-text-darker">
            The result: <strong className="text-brand-primary">branching that costs metadata, not copies</strong>,
            <strong className="text-brand-primary"> reproducible time-travel</strong> for MongoDB,
            and <strong className="text-brand-primary">a correctness-first core</strong> locked down by property tests.
          </p>
          <div className="text-center mt-10">
            <Link href="https://github.com/argon-lab/argon/blob/master/docs/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary underline text-lg">
              Get the deep dive on architecture &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
