import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Argon in Action
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            See how Argon can revolutionize your MongoDB workflows. Follow our step-by-step guide
            to create, branch, modify, and time-travel your first Argon-powered MongoDB.
          </p>
        </div>

        <section className="bg-brand-surface p-6 sm:p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary">
            Explore the Demo Scenario
          </h2>
          <p className="text-lg text-brand-text-darker mb-8">
            Our comprehensive demo scenario on the GitHub Wiki walks you through a practical use-case,
            showcasing the power and simplicity of Argon.
          </p>
          <Link
            href="https://github.com/argon-lab/argon/blob/master/docs/wiki/04_demo_scenario.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
          >
            View Demo on GitHub Wiki &rarr;
          </Link>
        </section>

      </div>
    </div>
  );
}
