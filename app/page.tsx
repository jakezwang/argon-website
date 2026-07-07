// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import QuickStartCommand from './components/QuickStartCommand';
import UseCases from './components/UseCases';
import GitComparison from './components/GitComparison';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-brand-dark text-brand-text">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
            {/* Logo and Title Group */}
            <div className="flex justify-center items-center mb-6">
              <Image
                src="/argon-logo.png"
                alt="Argon Logo"
                width={100} // Increased size from 80 to 100
                height={100} // Increased size from 80 to 100
                className="mr-4 rounded-full shadow-xl" // Added margin to the right of the logo
              />
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="block xl:inline">Welcome to</span>{' '}
                <span className="block text-brand-primary xl:inline">Argon</span>
              </h1>
            </div>

            {/* QuickStartCommand directly under logo-title */}
            <div className="mb-8 flex justify-center"> {/* Adjusted margin */}
              <QuickStartCommand />
            </div>

            <p className="max-w-2xl mx-auto text-lg text-brand-text-darker mb-8">
              <strong className="text-brand-primary-light">Git-like branching &amp; time travel for MongoDB</strong>.
              Branch your database in milliseconds, rewind any mistake, and give AI agents
              a safe sandbox — without touching production. Open source, MIT licensed.
            </p>

            <div className="max-w-2xl mx-auto mb-8 bg-brand-surface border border-brand-primary/40 rounded-lg px-4 py-3 text-sm text-brand-text-darker">
              ✅ <strong className="text-brand-primary">Milestone 1 shipped:</strong> deterministic replay engine —
              every branch and time-travel operation is now property-tested for byte-identical reproducibility.{' '}
              <Link href="/roadmap" className="text-brand-primary hover:text-brand-secondary underline">
                See the roadmap &rarr;
              </Link>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-4">
              <Link
                href="/features"
                className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Discover Features
              </Link>
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-surface text-brand-primary hover:bg-opacity-80 border border-brand-primary font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                View on GitHub
              </a>
              <Link
                href="/demo"
                className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Try Interactive Demo
              </Link>
            </div>
            {/* Removed QuickStartCommand from here */}
          </div>
        </section>

        {/* Git Comparison Section */}
        <GitComparison />

        {/* Use Cases Section */}
        <UseCases />

        {/* Trust & Reliability Section */}
        <section className="py-12 sm:py-16 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Built in the Open
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto">
                <strong className="text-brand-primary">Correctness first, honest claims</strong> — every
                performance number we publish will link to a reproducible benchmark.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Deterministic Core</h3>
                <p className="text-brand-text-darker">
                  Replay is property-tested in CI: the same history always
                  produces the same state, byte for byte.
                </p>
              </div>
              <div className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center">
                <div className="text-4xl mb-4">🎆</div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Open Source</h3>
                <p className="text-brand-text-darker">
                  MIT licensed. No vendor lock-in.
                  Audit the code, contribute, or fork it.
                </p>
              </div>
              <div className="bg-brand-surface p-8 rounded-xl shadow-2xl text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-brand-primary mb-3">Your Infrastructure</h3>
                <p className="text-brand-text-darker">
                  Self-hosted, works with your own MongoDB — local or Atlas.
                  Your data never leaves your environment.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Value Proposition Section - THIS IS THE "Why Choose Argon?" section */}
        <section className="py-12 sm:py-16 bg-brand-surface"> {/* Reduced py */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"> {/* Reduced mb-12 to mb-10 */}
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Never Break Production Again
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto"> {/* Reduced mt-4 to mt-3, text-xl to text-lg */}
                Stop being afraid of your database. <strong className="text-brand-accent">Experiment freely, deploy confidently, and sleep better at night.</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">"git checkout" for Databases</h3>
                <p className="text-brand-text-darker">
                  Jump to any point in your database history. Made a mistake? <strong className="text-brand-primary-light">Restore instantly</strong> without 
                  backups or downtime. Like <code className="bg-brand-surface px-1 rounded">git reset</code> but for your data.
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">"git branch" for Data</h3>
                <p className="text-brand-text-darker">
                  Create isolated database environments instantly. Test migrations, experiment with schemas, or 
                  <strong className="text-brand-primary-light">let multiple teams work in parallel</strong> without conflicts.
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">"git revert" for Data</h3>
                <p className="text-brand-text-darker">
                  Rewind bad writes with deterministic time-travel and restore —
                  <strong className="text-brand-accent"> roll back mistakes in place</strong>.
                  Merge workflows and data PRs are on the <Link href="/roadmap" className="underline hover:text-brand-secondary">v2 roadmap</Link>.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <p className="text-md text-brand-text-darker max-w-3xl mx-auto">
                <strong className="text-brand-primary-light">"If Git and MongoDB had a baby"</strong> - Finally, version control for your database that actually makes sense.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works Teaser Section */}
        <section className="py-12 sm:py-16 bg-brand-dark"> {/* Reduced py */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"> {/* Reduced mb-12 to mb-10 */}
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Advanced Database Operations Made Simple
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto"> {/* Reduced mt-4 to mt-3, text-xl to text-lg */}
                Argon gives you superpowers: branch your database, travel through time, and collaborate without conflicts. All with the simplicity of Git.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-brand-surface p-6 rounded-xl shadow-2xl"> {/* Reduced p-8 to p-6 */}
              {/* Placeholder for a simple diagram or key points */}
              <ul className="space-y-3 text-base text-brand-text-darker"> {/* Reduced space-y-4 to space-y-3, text-lg to text-base */}
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Branch:</strong> Create isolated test environments instantly.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Time-Travel:</strong> Undo mistakes by going back in time.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Restore:</strong> Fix problems without backups or downtime.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Integrate:</strong> CLI, Python SDK, and ML tooling (MLflow, DVC, W&amp;B) today — native driver drop-in coming in v2.</span>
                </li>
              </ul>
              <div className="mt-6 text-center"> {/* Reduced mt-8 to mt-6 */}
                <Link
                  href="/features#how-it-works"
                  className="text-brand-primary hover:text-brand-secondary font-semibold text-base" /* Reduced text-lg to text-base */
                >
                  Learn more about how Argon works &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-brand-primary to-brand-secondary text-white"> {/* Reduced py */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-brand-dark"> {/* Reduced mb-6 to mb-4 */}
              Ready to Git Your Database?
            </h2>
            <p className="text-lg text-gray-800 mb-8"> {/* Reduced text-xl to text-lg, mb-10 to mb-8 */}
              Join developers who stopped worrying about breaking production. Start branching your MongoDB like a pro.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-4">
              <a
                href="#quick-start"
                className="inline-block bg-brand-dark text-white hover:bg-opacity-90 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Get Started Free
              </a>
              <Link
                href="/demo"
                className="inline-block bg-white text-brand-primary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                See Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
