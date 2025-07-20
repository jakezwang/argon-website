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
            Argon brings Git-like branching and version control to MongoDB with v1.0.0 production release,
            featuring Python SDK, ML framework integrations, and Docker deployment.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12 sm:text-4xl text-brand-text">Key Features</h2>
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <FeatureCard icon="🌿" title="Git-style Branching">
              Create and manage MongoDB branches using collection-level isolation.
              Work on isolated environments for ML experiments and development tasks.
            </FeatureCard>
            <FeatureCard icon="⚡" title="MongoDB Integration">
              Built on MongoDB change streams for data capture with collection prefixing.
              Hybrid Go+Python architecture optimized for performance and reliability.
            </FeatureCard>
            <FeatureCard icon="💾" title="Efficient Storage">
              ZSTD compression for 40%+ storage reduction with S3 backend support.
              Background workers handle compression and storage operations asynchronously.
            </FeatureCard>
            <FeatureCard icon="🤖" title="ML Framework Integration">
              Native support for MLflow, Weights & Biases, and DVC workflows.
              Track experiments and version datasets alongside your ML pipeline.
            </FeatureCard>
            <FeatureCard icon="🐍" title="Python SDK">
              Production-ready Python SDK for programmatic access to all features.
              Jupyter notebook support with example workflows for data scientists.
            </FeatureCard>
            <FeatureCard icon="🐳" title="Docker Deployment">
              Complete Docker Compose setup with 5 microservices ready to deploy.
              MongoDB, Redis, Go Engine, Python API, and Next.js dashboard included.
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
              Argon v1.0.0 uses a microservices architecture with MongoDB for data versioning,
              perfect for ML teams needing experiment tracking and dataset management.
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
              <p>Data is compressed using ZSTD (achieving 40%+ reduction) and stored in S3. Background workers handle compression asynchronously to maintain performance.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">4. ML Workflow Support</h3>
              <p>Integration with MLflow, Weights & Biases, and DVC enables seamless experiment tracking. Python SDK provides programmatic access for automated ML pipelines.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">5. Hybrid Architecture</h3>
              <p>Go engine handles performance-critical operations like change stream processing, while Python API provides productivity and ease of integration with existing workflows and tools.</p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-7 text-brand-text-darker">
            This architecture ensures <strong className="text-brand-primary">production reliability</strong> with v1.0.0 release,
            <strong className="text-brand-primary"> ML-ready workflows</strong> with framework integrations,
            and <strong className="text-brand-primary">easy deployment</strong> through Docker Compose.
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
