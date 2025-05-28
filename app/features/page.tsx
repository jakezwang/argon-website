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
            Argon brings Git-like branching, stateless compute, and S3-backed versioning to MongoDB,
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
            <FeatureCard icon="💨" title="Stateless Compute">
              MongoDB runs in lightweight Docker containers, completely decoupled from persistent storage.
              This means faster spin-up times and efficient resource utilization.
            </FeatureCard>
            <FeatureCard icon="💾" title="S3-Powered Storage">
              Durable, versioned snapshots of your data are stored efficiently and cost-effectively in your AWS S3 bucket.
              Benefit from S3's reliability and scalability.
            </FeatureCard>
            <FeatureCard icon="⏳" title="Time-Travel">
              Restore or create new branches from any historical snapshot. Effortlessly roll back to previous
              data states or inspect data from a specific point in time.
            </FeatureCard>
            <FeatureCard icon="⌨️" title="Powerful CLI">
              A comprehensive command-line interface to manage all aspects of Argon, from branch creation
              to time-travel operations. Automate and script your database workflows.
            </FeatureCard>
            <FeatureCard icon="🖥️" title="Web Dashboard">
              Visualize and manage branches through an intuitive web interface. Includes an optional
              auto-suspend feature for idle instances to further optimize costs.
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
              Argon cleverly combines Docker for containerization, AWS S3 for persistent, versioned storage,
              and a local metadata database to manage your branches.
            </p>
          </div>

          <div className="space-y-8 text-brand-text-darker">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">1. Branch Creation</h3>
              <p>When you create a branch, Argon can start from a base snapshot (e.g., a clean database or a production dump) stored in S3. It pulls this snapshot and launches a new, isolated MongoDB instance in a Docker container.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">2. Making Changes</h3>
              <p>You connect to this containerized MongoDB as usual and make your changes. Your work remains isolated to that specific branch.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">3. Suspending a Branch</h3>
              <p>When you suspend a branch, Argon takes a snapshot (dump) of the container's current data, uploads it to S3 (creating a new version), and then stops and removes the Docker container, freeing up local resources.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">4. Resuming a Branch</h3>
              <p>To resume, Argon pulls the latest (or a specified) snapshot for that branch from S3 and starts a fresh Docker container with that data, allowing you to pick up right where you left off.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">5. Time-Travel</h3>
              <p>You can create a new branch from any historical snapshot of an existing branch, effectively rolling back to or inspecting a previous data state in an isolated environment without affecting the original branch.</p>
            </div>
          </div>
          <p className="mt-8 text-lg leading-7 text-brand-text-darker">
            This architecture ensures that your MongoDB instances are <strong className="text-brand-primary">stateless</strong> (compute is separate from storage),
            <strong className="text-brand-primary"> cost-effective</strong> (only pay for S3 storage for suspended branches and compute when running),
            and <strong className="text-brand-primary">highly flexible</strong>.
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
