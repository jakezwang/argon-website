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
            Argon brings production-ready branching, real-time change capture, and compressed versioning to MongoDB,
            empowering you to work more agilely, collaborate effectively, and innovate faster.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 sm:text-4xl text-brand-text">Key Features</h2>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <FeatureCard icon="🌿" title="Git-style Branching">
              Create, suspend, resume, and delete database branches with ease, just like managing code in Git.
              Isolate development tasks and experiment freely without impacting other environments.
            </FeatureCard>
            <FeatureCard icon="⚡" title="Real-Time Change Capture">
              MongoDB change streams capture data modifications in real-time with sub-500ms branching operations
              and 10,000+ ops/sec throughput for production workloads.
            </FeatureCard>
            <FeatureCard icon="💾" title="Compressed Storage">
              ZSTD compression achieves 42.40% storage reduction with S3 backend.
              Efficient delta storage and background worker processing ensure optimal performance.
            </FeatureCard>
            <FeatureCard icon="⏳" title="Time-Travel">
              Restore or create new branches from any historical snapshot. Effortlessly roll back to previous
              data states or inspect data from a specific point in time.
            </FeatureCard>
            <FeatureCard icon="⌨️" title="Powerful CLI">
              A comprehensive command-line interface to manage all aspects of Argon, from branch creation
              to time-travel operations. Automate and script your database workflows.
            </FeatureCard>
            <FeatureCard icon="🏗️" title="Production Architecture">
              Hybrid Go+Python system with collection-level data isolation using prefixes.
              Background worker pools and MongoDB-based job queues ensure enterprise reliability.
            </FeatureCard>
          </dl>
          <div className="text-center mt-10">
            <Link href="https://github.com/argon-lab/argon/blob/master/docs/wiki/02_features.md" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary underline text-lg">
              Explore all features in detail on our Wiki &rarr;
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mx-auto mt-20 max-w-4xl sm:mt-28 lg:mt-32 scroll-mt-20"> {/* Added id and scroll-margin */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-brand-text">How It Works</h2>
            <p className="mt-4 text-lg leading-8 text-brand-text-darker">
              Argon uses a hybrid Go+Python architecture with MongoDB change streams for real-time data capture,
              collection-level isolation for branching, and S3 with ZSTD compression for efficient storage.
            </p>
          </div>

          <div className="space-y-8 text-brand-text-darker">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">1. Collection-Level Isolation</h3>
              <p>Branches use collection prefixes (e.g., 'main_users' vs 'feature_users') to create completely isolated data environments within the same MongoDB instance, eliminating conflicts and enabling parallel work.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">2. Real-Time Change Capture</h3>
              <p>MongoDB change streams monitor data modifications in real-time. Background worker pools process these changes asynchronously through a MongoDB-based job queue for reliable operation.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">3. Efficient Storage & Compression</h3>
              <p>Data is compressed using ZSTD (achieving 42.40% reduction) and stored in S3. Delta storage techniques minimize bandwidth and storage costs while maintaining fast access to historical states.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">4. Branch Operations</h3>
              <p>Creating, switching, and deleting branches operates on collection metadata and prefixes, achieving sub-500ms response times with 10,000+ operations per second throughput.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">5. Hybrid Architecture</h3>
              <p>Go engine handles performance-critical operations like change stream processing, while Python API provides productivity and ease of integration with existing workflows and tools.</p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-7 text-brand-text-darker">
            This architecture ensures <strong className="text-brand-primary">production reliability</strong> with real-time processing,
            <strong className="text-brand-primary"> enterprise performance</strong> with sub-500ms operations and 10,000+ ops/sec throughput,
            and <strong className="text-brand-primary">zero-conflict collaboration</strong> through complete data isolation.
          </p>
          <div className="text-center mt-10">
            <Link href="https://github.com/argon-lab/argon/blob/master/docs/wiki/05_how_it_works.md" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary underline text-lg">
              Get the deep dive on architecture and state flows (Wiki) &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
