// filepath: /Users/jakewang/dev/argon-website/app/investors/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function InvestorsPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Invest in the Future of AI Data Management
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            Argon is revolutionizing how developers and AI engineers interact with MongoDB, offering significant improvements in agility, efficiency, and collaboration—<strong className="text-brand-primary-light">key enablers for the next wave of AI innovation.</strong>
          </p>
        </div>

        {/* Market Focus & Business Model Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-brand-text mb-4">🎯 Target Market</h3>
              <ul className="space-y-2 text-brand-text-darker">
                <li>• AI/ML Development Teams</li>
                <li>• Data Science Organizations</li>
                <li>• MongoDB Users needing versioning</li>
                <li>• MLOps Platform Builders</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-text mb-4">💰 Revenue Model</h3>
              <ul className="space-y-2 text-brand-text-darker">
                <li>• <strong>Open Source:</strong> Community adoption</li>
                <li>• <strong>Cloud SaaS:</strong> Managed service</li>
                <li>• <strong>Enterprise:</strong> Self-hosted + support</li>
                <li>• <strong>Marketplace:</strong> ML integrations</li>
              </ul>
            </div>
          </div>
          <div className="bg-brand-dark p-6 rounded-lg">
            <p className="text-center text-brand-text-darker">
              <strong className="text-brand-primary-light">Inspired by Neon's success</strong> in PostgreSQL branching, 
              we're building the NoSQL equivalent for the <strong className="text-brand-accent">AI data boom</strong>
            </p>
          </div>
        </section>

        {/* Traction & Future Vision Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary">Current Status & Vision</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-brand-text mb-4">🚀 Today (v1.0.0)</h3>
              <ul className="space-y-2 text-brand-text-darker mb-6">
                <li>• Production-ready open source</li>
                <li>• Python SDK with ML integrations</li>
                <li>• Docker deployment available</li>
                <li>• Active community adoption</li>
              </ul>
              <div className="bg-brand-dark p-4 rounded">
                <p className="text-sm text-brand-text-darker text-center">
                  <strong className="text-brand-primary">Focus:</strong> Enterprise features & scaling adoption
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-brand-text mb-4">🎆 Future Vision</h3>
              <ul className="space-y-2 text-brand-text-darker mb-6">
                <li>• Managed cloud service (SaaS)</li>
                <li>• Advanced AI data versioning</li>
                <li>• Decoupled compute & storage</li>
                <li>• Multi-database support</li>
                <li>• Auto-scaling for AI workloads</li>
              </ul>
              <div className="bg-brand-dark p-4 rounded">
                <p className="text-sm text-brand-text-darker text-center">
                  <strong className="text-brand-primary">Goal:</strong> The Neon for NoSQL/AI data
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-10">
          <h2 className="text-3xl font-bold mb-6 text-brand-text">Partner with Argon</h2>
          <p className="text-xl mb-8 text-brand-text-darker">
            We are seeking strategic investors to help us scale Argon, expand our feature set, and reach a wider market. If you share our vision for transforming database development, we&apos;d love to talk.
          </p>
          <div className="space-x-4">
            <a
              href="mailto:jake.wang@argonlabs.tech"
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105"
            >
              Contact Us for Deck & Discussion
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
