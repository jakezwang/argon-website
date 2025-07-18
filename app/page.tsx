// app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import QuickStartCommand from './components/QuickStartCommand'; // Import the new component

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
              Production-ready MongoDB branching and versioning platform. Create isolated database environments in seconds, 
              <strong className="text-brand-primary-light"> time-travel through data states</strong>, and collaborate without conflicts using our hybrid Go+Python architecture.
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
                href="/investors"
                className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Investor Relations
              </Link>
            </div>
            {/* Removed QuickStartCommand from here */}
          </div>
        </section>

        {/* Value Proposition Section - THIS IS THE "Why Choose Argon?" section */}
        <section className="py-12 sm:py-16 bg-brand-surface"> {/* Reduced py */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"> {/* Reduced mb-12 to mb-10 */}
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Why Choose Argon for Your AI & Development Needs?
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto"> {/* Reduced mt-4 to mt-3, text-xl to text-lg */}
                Argon empowers developers and data scientists to innovate faster by streamlining database management, <strong className="text-brand-accent">especially for AI-driven projects.</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Real-Time Performance</h3>
                <p className="text-brand-text-darker">
                  Sub-500ms branching operations with 10,000+ ops/sec throughput. MongoDB change streams capture data in real-time
                  with ZSTD compression achieving 42.40% storage reduction.
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Production Architecture</h3>
                <p className="text-brand-text-darker">
                  Hybrid Go+Python system with collection-level data isolation. Background worker pools process changes asynchronously
                  while maintaining <strong className="text-brand-primary-light">enterprise-grade reliability and scalability.</strong>
                </p>
              </div>
              <div className="bg-brand-dark p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-semibold text-brand-primary mb-3">Zero-Conflict Collaboration</h3>
                <p className="text-brand-text-darker">
                  Complete data isolation using collection prefixes. Multiple teams work simultaneously without interference,
                  enabling <strong className="text-brand-accent">parallel development and safe experimentation.</strong>
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <p className="text-md text-brand-text-darker max-w-3xl mx-auto">
                Like Neon revolutionized PostgreSQL with branching, Argon brings <strong className="text-brand-primary-light">production-ready branching and versioning</strong> to MongoDB with real-time performance and enterprise reliability.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works Teaser Section */}
        <section className="py-12 sm:py-16 bg-brand-dark"> {/* Reduced py */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"> {/* Reduced mb-12 to mb-10 */}
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Simplified Database Operations
              </h2>
              <p className="mt-3 text-lg text-brand-text-darker max-w-3xl mx-auto"> {/* Reduced mt-4 to mt-3, text-xl to text-lg */}
                Argon’s intuitive CLI and (upcoming) dashboard make complex database tasks straightforward.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-brand-surface p-6 rounded-xl shadow-2xl"> {/* Reduced p-8 to p-6 */}
              {/* Placeholder for a simple diagram or key points */}
              <ul className="space-y-3 text-base text-brand-text-darker"> {/* Reduced space-y-4 to space-y-3, text-lg to text-base */}
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Branch:</strong> Create isolated database environments in seconds.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Snapshot:</strong> Automatically version data on S3 when suspending branches.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Restore:</strong> Time-travel to any previous data state effortlessly.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-primary mr-2 text-xl">✓</span> {/* Reduced mr-3 to mr-2, text-2xl to text-xl */}
                  <span><strong className="text-brand-text">Collaborate:</strong> Work in parallel without data conflicts.</span>
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
              Ready to Transform Your MongoDB Experience?
            </h2>
            <p className="text-lg text-gray-800 mb-8"> {/* Reduced text-xl to text-lg, mb-10 to mb-8 */}
              Contribute to the project on GitHub, or dive into our documentation.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-4">
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand-dark text-white hover:bg-opacity-90 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
              >
                Contribute on GitHub
              </a>
              <a
                href="https://github.com/argon-lab/argon/blob/master/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-brand-primary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-xl transform transition-transform duration-150 hover:scale-105 w-full sm:w-auto"
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
