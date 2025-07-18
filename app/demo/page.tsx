import Link from 'next/link';
import InteractiveDemo from '../components/InteractiveDemo';

export default function DemoPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Argon in Action
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            Experience Argon's power through interactive demos. See real-world workflows for
            developers and ML engineers with live performance metrics.
          </p>
        </div>

        {/* Interactive Demo Section */}
        <section className="mb-16">
          <InteractiveDemo />
        </section>

        {/* Additional Resources */}
        <section className="bg-brand-surface p-6 sm:p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary">
            Ready to Try It Yourself?
          </h2>
          <p className="text-lg text-brand-text-darker mb-8">
            Get started with Argon in your own environment. Our comprehensive documentation
            guides you through installation and advanced use cases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://github.com/argon-lab/argon/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Get Started Guide &rarr;
            </Link>
            <Link
              href="https://github.com/argon-lab/argon/blob/master/docs/wiki/04_demo_scenario.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-surface border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Detailed Demo Scenario
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
