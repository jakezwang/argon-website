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
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Market Focus & Business Model: Capitalizing on the AI Data Boom</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon primarily targets the rapidly expanding field of <strong className="text-brand-primary-light">Artificial Intelligence development</strong>. Modern AI, including Large Language Models (LLMs) and autonomous agents, demands <strong className="text-brand-accent">unprecedented data agility, versioning, and cost-effective scalability</strong>—capabilities at the core of Argon's design. We draw inspiration from the success of platforms like Neon, which have validated the market need for serverless, branchable databases in the relational sphere. Argon aims to be the <strong className="text-brand-accent">leading solution for these critical needs in the NoSQL and AI-specific data landscape.</strong>
          </p>
          <p className="text-lg mt-4 mb-4 text-brand-text-darker">
            Our <strong className="text-brand-accent">production-ready open-source platform</strong> is strategically designed to drive adoption and community engagement, particularly within the AI research and development space. Revenue will be generated through <strong className="text-brand-primary-light">premium offerings</strong> designed to support scalable AI operations and enterprise needs:
          </p>
          <ul className="list-disc list-inside space-y-3 text-lg text-brand-text-darker">
            <li>
              <strong className="text-brand-primary-light">Argon Cloud (SaaS):</strong> A managed service providing a robust control plane for AI data versioning, featuring a web dashboard, automated S3/blob storage management, usage-based pricing, RBAC, and audit logs tailored for AI/ML pipelines.
            </li>
            <li>
              <strong className="text-brand-primary-light">Argon Enterprise:</strong> For organizations with extensive AI initiatives, offering self-hosted or dedicated cloud deployments, priority support, custom integrations with MLOps platforms, and volume licensing.
            </li>
            <li>
              <strong className="text-brand-primary-light">Marketplace Add-ons (Future):</strong> Potential for specialized tools, connectors for AI frameworks, and pre-built data recipes for common AI tasks.
            </li>
          </ul>
          <p className="text-lg mt-4 text-brand-text-darker">
            This approach allows us to support users from experimental PoC stages to full-scale AI deployment, ensuring <strong className="text-brand-accent">sustainable growth</strong> and relevance in the evolving AI landscape, much like Neon has catered to evolving developer needs.
          </p>
        </section>

        {/* Traction & Future Vision Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Traction & Future Vision: Building the Neon for AI Data</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon is currently a <strong className="text-brand-accent">production-ready open-source platform</strong> with proven performance metrics: sub-500ms branching operations, 10,000+ ops/sec throughput, and 42.40% storage compression. These capabilities make it ideal for <strong className="text-brand-primary-light">AI applications requiring enterprise-grade data management</strong>. The <code className="bg-brand-darker px-1 py-0.5 rounded text-sm">argonctl</code> CLI is available via npm, Homebrew, and direct download. Our immediate focus is <strong className="text-brand-accent">expanding enterprise features</strong> and <strong className="text-brand-accent">scaling adoption</strong> within production environments, mirroring the growth trajectory of successful platforms like Neon.
          </p>
          <p className="text-xl mt-6 mb-3 font-semibold text-brand-primary">Future Vision: An AI-Ready Data Platform Inspired by Market Leaders</p>
          <p className="text-lg mb-4 text-brand-text-darker">
            Building upon the current production platform, our long-term vision is to expand our <strong className="text-brand-accent">managed cloud offerings</strong>. This platform will be engineered to provide enhanced support for AI and machine learning applications by offering (similar to Neon's value proposition but tailored for AI/NoSQL):
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-brand-text-darker">
            <li><strong className="text-brand-primary-light">Advanced Data Versioning:</strong> Git-like branching and time-travel capabilities tailored for large-scale datasets.
            </li>
            <li><strong className="text-brand-primary-light">Decoupled Compute & Storage:</strong> For <strong className="text-brand-accent">unparalleled flexibility & cost-efficiency</strong> in managing data for AI model training and inference.
            </li>
            <li><strong className="text-brand-primary-light">Broad NoSQL & Storage Support:</strong> Expanding beyond MongoDB and S3 to offer <strong className="text-brand-accent">more choices</strong> for diverse AI data needs.
            </li>
            <li><strong className="text-brand-primary-light">Intelligent Auto-Scaling:</strong> Ensuring <strong className="text-brand-accent">optimal performance</strong> and resource management for dynamic AI workloads.
            </li>
            <li><strong className="text-brand-primary-light">Seamless AI Ecosystem Integration:</strong> Providing the data agility necessary for <strong className="text-brand-accent">next-generation AI/ML development and deployment</strong>.
            </li>
          </ul>
          <p className="text-lg mt-4 text-brand-text-darker">
            Our goal is to empower developers and AI agents to build and scale the next generation of data-intensive applications with unprecedented ease and efficiency.
          </p>
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
