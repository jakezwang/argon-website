// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import QuickStartCommand from './components/QuickStartCommand';
import PerformanceMetrics from './components/PerformanceMetrics';

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
              Git-like versioning and branching for MongoDB. Create instant database branches, 
              <strong className="text-brand-primary-light"> time-travel through data states</strong>, and achieve 37,000+ ops/sec performance. 
              Version control for your database with millisecond-precision tracking.
            </p>

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

        {/* Performance Metrics Section */}
        <PerformanceMetrics />

        {/* Deployment Options Section */}
        <section className="py-12 sm:py-16 bg-brand-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Deploy Your Way
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto">
                Argon brings Git-like version control to MongoDB. Deploy on your infrastructure with full MongoDB API compatibility.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-brand-surface p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-4">Self-Hosted Open Source</h3>
                <ul className="space-y-3 text-brand-text-darker mb-6">
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Production-ready Git-like versioning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>37,009 operations/second performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Install via Docker, source, or Homebrew</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Go, Python, JavaScript SDK support</span>
                  </li>
                </ul>
                <a
                  href="https://github.com/argon-lab/argon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started with Open Source
                </a>
              </div>
              <div className="bg-brand-surface p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-4">Enterprise Deployment</h3>
                <ul className="space-y-3 text-brand-text-darker mb-6">
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Docker containers and Kubernetes-ready</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Terraform modules for AWS, GCP, Azure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Prometheus and Grafana integration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Production deployment guides available</span>
                  </li>
                </ul>
                <a
                  href="https://github.com/argon-lab/argon/blob/master/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section - THIS IS THE "Why Choose Argon?" section */}
        <section className="py-12 sm:py-16 bg-brand-surface"> {/* Reduced py */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"> {/* Reduced mb-12 to mb-10 */}
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Why Choose Argon for Database Versioning?
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto"> {/* Reduced mt-4 to mt-3, text-xl to text-lg */}
                Argon brings familiar Git workflows to MongoDB, enabling <strong className="text-brand-accent">instant branching, time-travel, and enterprise-grade performance.</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Lightning-Fast Performance</h3>
                <p className="text-brand-text-darker">
                  37,009 operations/second with 1.16ms branch creation. Zero-copy branching technology eliminates storage overhead
                  while maintaining <strong className="text-brand-primary-light">full MongoDB API compatibility.</strong>
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Time-Travel Technology</h3>
                <p className="text-brand-text-darker">
                  Query database states at any historical point with millisecond precision. 7,688 concurrent time-travel queries/sec
                  with <strong className="text-brand-primary-light">intelligent reconstruction and safe restore previews.</strong>
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Enterprise-Ready Deployment</h3>
                <p className="text-brand-text-darker">
                  Docker and Kubernetes support with Terraform modules for major cloud providers. Prometheus and Grafana integration
                  for <strong className="text-brand-accent">production monitoring and enterprise deployment.</strong>
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <p className="text-md text-brand-text-darker max-w-3xl mx-auto">
                Git-like version control for MongoDB enabling <strong className="text-brand-primary-light">instant zero-copy branching and time-travel</strong> with enterprise performance and reliability.
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
                Argon provides Git-like branching, time-travel, and restore capabilities for MongoDB through intuitive CLI and SDK interfaces.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-brand-surface p-6 rounded-xl shadow-2xl"> {/* Reduced p-8 to p-6 */}
              {/* Placeholder for a simple diagram or key points */}
              <ul className="space-y-3 text-base text-brand-text-darker"> {/* Reduced space-y-4 to space-y-3, text-lg to text-base */}
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Branch:</strong> Instant zero-copy branches in 1.16ms with no storage overhead.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Time-Travel:</strong> Query any historical state with millisecond precision tracking.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Restore:</strong> Safe restore operations with preview and automatic safety checks.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Integrate:</strong> Go, Python, JavaScript SDKs with full MongoDB API compatibility.</span>
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
              Ready to Experience MongoDB Time-Travel?
            </h2>
            <p className="text-lg text-gray-800 mb-8"> {/* Reduced text-xl to text-lg, mb-10 to mb-8 */}
              Join the open-source community and experience instant branching and time-travel for MongoDB.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-4">
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-dark text-white hover:bg-opacity-90 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Star on GitHub
              </a>
              <Link
                href="/demo"
                className="inline-block bg-white text-brand-primary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Try Interactive Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
