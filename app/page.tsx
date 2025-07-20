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
              Git-like versioning and branching for MongoDB. Create instant database branches for ML workflows, 
              <strong className="text-brand-primary-light"> experiment tracking</strong>, and data versioning. 
              Production-ready v1.0.0 with Python SDK and Docker deployment.
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
                    <span>Production-ready v1.0.0 with Git-like workflows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>High-performance MongoDB branching system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Install via Docker or build from source</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Python SDK with ML framework integrations</span>
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
                <h3 className="text-2xl font-semibold text-brand-primary mb-4">ML & Data Science Focus</h3>
                <ul className="space-y-3 text-brand-text-darker mb-6">
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>MLflow, Weights & Biases, DVC integrations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Jupyter notebook support with examples</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>Experiment tracking and dataset versioning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-primary mr-2">•</span>
                    <span>MongoDB-based storage system</span>
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
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">High-Performance Architecture</h3>
                <p className="text-brand-text-darker">
                  Hybrid Go+Python microservices with MongoDB change streams. Fast branch operations with collection-level isolation
                  while maintaining <strong className="text-brand-primary-light">full MongoDB API compatibility.</strong>
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Data Versioning & Tracking</h3>
                <p className="text-brand-text-darker">
                  Version control for MongoDB with experiment tracking capabilities. Branch-based data isolation
                  with <strong className="text-brand-primary-light">ML framework integrations and automated compression.</strong>
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Production-Ready Deployment</h3>
                <p className="text-brand-text-darker">
                  Docker deployment with microservices architecture. MongoDB change streams and Redis job queues
                  for <strong className="text-brand-accent">reliable production workloads and ML pipelines.</strong>
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <p className="text-md text-brand-text-darker max-w-3xl mx-auto">
                Git-like version control for MongoDB enabling <strong className="text-brand-primary-light">database branching and ML experiment tracking</strong> with production-ready performance and reliability.
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
                Argon provides Git-like branching, data versioning, and experiment tracking for MongoDB through CLI and Python SDK interfaces.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-brand-surface p-6 rounded-xl shadow-2xl"> {/* Reduced p-8 to p-6 */}
              {/* Placeholder for a simple diagram or key points */}
              <ul className="space-y-3 text-base text-brand-text-darker"> {/* Reduced space-y-4 to space-y-3, text-lg to text-base */}
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Branch:</strong> Fast database branches with collection-level isolation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Version:</strong> Track data changes with MongoDB change streams.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Experiment:</strong> ML workflow tracking with framework integrations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Integrate:</strong> Python SDK with MLflow, W&B, and DVC support.</span>
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
