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
            Argon brings Git-like version control to MongoDB with instant branching, time-travel capabilities,
            and production-ready WAL architecture. The first solution enabling database versioning workflows.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 sm:text-4xl text-brand-text">Key Features</h2>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <FeatureCard icon="⚡" title="Instant Branching (1.16ms)">
              Instant branches without waiting for database copies or backups. Zero-copy architecture
              means no data duplication - branch creation completes in milliseconds, not minutes.
            </FeatureCard>
            <FeatureCard icon="⏳" title="Time-Travel Queries">
              Industry-first MongoDB time-travel. Query any historical database state
              in less than 50ms with millisecond precision tracking.
            </FeatureCard>
            <FeatureCard icon="🚀" title="37,905+ ops/sec">
              Verified production performance with comprehensive monitoring.
              15,360 concurrent operations per second with WAL architecture.
            </FeatureCard>
            <FeatureCard icon="🤖" title="ML Framework Integration">
              Native support for MLflow, Weights & Biases, and DVC workflows.
              Track experiments and version datasets alongside your ML pipeline.
            </FeatureCard>
            <FeatureCard icon="🐍" title="Multiple SDKs">
              Python SDK via pip, Go SDK, and unified CLI interface.
              Install via Homebrew, NPM, or pip for cross-platform support.
            </FeatureCard>
            <FeatureCard icon="✅" title="Production Ready">
              119+ test assertions with 100% pass rate. Production monitoring,
              health checks, and alerting built into the unified WAL system.
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
              Argon's pure WAL (Write-Ahead Log) architecture enables instant branching,
              time-travel queries, and safe restore operations - all production-tested.
            </p>
          </div>

          <div className="space-y-8 text-brand-text-darker">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">1. Pure WAL Architecture</h3>
              <p>Revolutionary Write-Ahead Log system with LSN (Log Sequence Number) pointers enables instant branching and time-travel. First MongoDB implementation with millisecond-precision historical queries.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">2. Zero-Copy Branching</h3>
              <p>Create branches in 1.16ms - eliminating the lengthy backup/restore cycles traditionally required for database versioning. No data duplication - branches share base data through intelligent LSN pointer management.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">3. Time-Travel Engine</h3>
              <p>Query any historical database state in less than 50ms. Safe restore operations with production monitoring. Complete audit trail with millisecond precision.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">4. ML Workflow Support</h3>
              <p>Integration with MLflow, Weights & Biases, and DVC enables seamless experiment tracking. Python SDK provides programmatic access for automated ML pipelines.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">5. Unified CLI Interface</h3>
              <p>Clean commands: `argon projects create`, `argon branches create`, `argon time-travel`. No confusing prefixes - just intuitive operations with production monitoring.</p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-7 text-brand-text-darker">
            This architecture delivers <strong className="text-brand-primary">instant branching</strong> compared to traditional backup/restore methods,
            <strong className="text-brand-primary"> industry-first time-travel</strong> for MongoDB,
            and <strong className="text-brand-primary">production-ready reliability</strong> with comprehensive testing.
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
