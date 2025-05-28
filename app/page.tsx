// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-brand-dark text-brand-text">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
            <Image
              src="/argon-logo.png"
              alt="Argon Logo"
              width={120}
              height={120}
              className="mx-auto mb-8 rounded-full shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block xl:inline">Welcome to</span>{' '}
              <span className="block text-brand-primary xl:inline">Argon</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-brand-text-darker mb-10">
              Revolutionizing MongoDB workflows with Git-like branching, stateless compute, and S3-backed versioning.
              Build, test, and deploy with unprecedented speed and flexibility.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
              <Link
                href="/features"
                className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-10 py-4 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
              >
                Discover Features
              </Link>
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-surface text-brand-primary hover:bg-opacity-80 border border-brand-primary font-semibold px-10 py-4 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
              >
                View on GitHub
              </a>
              <Link
                href="/investors" // Placeholder link, to be updated
                className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-10 py-4 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
              >
                For Investors
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 sm:py-24 bg-brand-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Why Choose Argon?
              </h2>
              <p className="mt-4 text-xl text-brand-text-darker max-w-3xl mx-auto">
                Argon empowers developers and data scientists to innovate faster by streamlining database management.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Agile Development</h3>
                <p className="text-brand-text-darker">
                  Instantly branch your MongoDB for development, testing, or staging without impacting production.
                  Merge changes or discard branches with ease.
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Cost Efficiency</h3>
                <p className="text-brand-text-darker">
                  Leverage stateless compute and S3 for storage. Suspend inactive branches to save on compute costs,
                  paying only for S3 storage.
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Enhanced Collaboration</h3>
                <p className="text-brand-text-darker">
                  Each team member or CI/CD pipeline can work on isolated database branches, eliminating conflicts
                  and enabling parallel workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Teaser Section */}
        <section className="py-16 sm:py-24 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Simplified Database Operations
              </h2>
              <p className="mt-4 text-xl text-brand-text-darker max-w-3xl mx-auto">
                Argon’s intuitive CLI and (upcoming) dashboard make complex database tasks straightforward.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-brand-surface p-8 rounded-xl shadow-2xl">
              {/* Placeholder for a simple diagram or key points */}
              <ul className="space-y-4 text-lg text-brand-text-darker">
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3 text-2xl">✓</span>
                  <span><strong className="text-brand-text">Branch:</strong> Create isolated database environments in seconds.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3 text-2xl">✓</span>
                  <span><strong className="text-brand-text">Snapshot:</strong> Automatically version data on S3 when suspending branches.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3 text-2xl">✓</span>
                  <span><strong className="text-brand-text">Restore:</strong> Time-travel to any previous data state effortlessly.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-3 text-2xl">✓</span>
                  <span><strong className="text-brand-text">Collaborate:</strong> Work in parallel without data conflicts.</span>
                </li>
              </ul>
              <div className="mt-8 text-center">
                <Link
                  href="/features#how-it-works"
                  className="text-brand-primary hover:text-brand-secondary font-semibold text-lg"
                >
                  Learn more about how Argon works &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-32 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-6 text-brand-dark">
              Ready to Transform Your MongoDB Experience?
            </h2>
            <p className="text-xl text-gray-800 mb-10">
              Contribute to the project on GitHub, or dive into our documentation.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-dark text-white hover:bg-opacity-90 font-bold px-10 py-4 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105"
              >
                Contribute on GitHub
              </a>
              <a
                href="https://github.com/argon-lab/argon/blob/master/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-brand-primary hover:bg-gray-100 font-bold px-10 py-4 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
