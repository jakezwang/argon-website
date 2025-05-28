// filepath: /Users/jakewang/dev/argon-website/app/investors/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function InvestorsPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Invest in the Future of Database Management
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            Argon is revolutionizing how developers interact with MongoDB, offering significant improvements in agility, efficiency, and collaboration.
          </p>
        </div>

        {/* Problem Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">The Challenge with Modern Databases</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Traditional database workflows are often bottlenecks in the development lifecycle. Managing multiple environments, ensuring data consistency, and enabling rapid iteration can be complex, time-consuming, and costly. Developers need tools that match the speed and flexibility of modern DevOps practices.
          </p>
        </section>

        {/* Our Solution Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Argon: The Agile Solution for MongoDB</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon addresses these challenges head-on by bringing Git-like branching, stateless compute, and S3-backed versioning to MongoDB. This empowers development teams to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-brand-text-darker">
            <li>Instantly create isolated database branches for development, testing, and staging.</li>
            <li>Suspend and resume branches on-demand, optimizing resource usage and costs.</li>
            <li>Utilize S3 for durable, cost-effective, and versioned data storage.</li>
            <li>Implement 'time-travel' to effortlessly roll back or inspect previous data states.</li>
            <li>Enhance collaboration with parallel workflows free from data conflicts.</li>
          </ul>
          <p className="text-lg mt-4 text-brand-text-darker">
            The result is accelerated development cycles, reduced operational overhead, and a more innovative development environment.
          </p>
        </section>

        {/* Market Opportunity Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Market Opportunity</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            The demand for efficient database management tools is rapidly growing, driven by the expansion of cloud-native applications, microservices, and agile development methodologies. MongoDB is a leading NoSQL database with millions of users, and Argon targets this vast user base, from individual developers and startups to large enterprises seeking to optimize their MongoDB workflows.
          </p>
          <p className="text-lg text-brand-text-darker">
            The DevOps market, of which database tooling is a critical component, is projected to continue its significant growth. While precise market sizing for MongoDB-specific branching and versioning tools requires dedicated research, the widespread adoption of Git for code and the increasing complexity of data management indicate a substantial unaddressed need for Argon's capabilities. We aim to capture a significant portion of the MongoDB developer community looking for enhanced agility and cost-efficiency.
          </p>
        </section>

        {/* Business Model Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Business Model</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon plans to operate on a freemium model, making core branching and versioning features accessible through an open-source CLI. We believe this will drive adoption and community engagement. Revenue will be generated through premium offerings:
          </p>
          <ul className="list-disc list-inside space-y-3 text-lg text-brand-text-darker">
            <li>
              <strong className="text-brand-primary-light">Argon Cloud (SaaS):</strong> A managed service offering hosting for the Argon control plane, simplifying setup and maintenance. This tier would likely include:
              <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-md">
                <li>User-friendly web dashboard for team collaboration and branch management.</li>
                <li>Automated S3 bucket configuration and management.</li>
                <li>Usage-based pricing for active branches and storage, with a generous free tier.</li>
                <li>Advanced features like role-based access control (RBAC), audit logs, and team management.</li>
              </ul>
            </li>
            <li>
              <strong className="text-brand-primary-light">Argon Enterprise:</strong> For larger organizations with specific needs, offering:
              <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-md">
                <li>Self-hosted enterprise deployments or dedicated cloud instances.</li>
                <li>Priority support with SLAs.</li>
                <li>Custom integrations with existing enterprise systems (e.g., CI/CD, monitoring).</li>
                <li>Volume licensing and dedicated account management.</li>
              </ul>
            </li>
            <li>
              <strong className="text-brand-primary-light">Marketplace Add-ons (Future):</strong> Potential for integrations or specialized tools built on the Argon platform, offered via a marketplace.
            </li>
          </ul>
          <p className="text-lg mt-4 text-brand-text-darker">
            This multi-tiered approach allows us to cater to a wide range of users, from individual developers to large enterprises, ensuring sustainable growth.
          </p>
        </section>

        {/* Team Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Our Team</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon is led by a passionate founder with deep expertise in software engineering and developer tools, gained from experience at leading tech companies like MongoDB, LinkedIn, and Bloomberg.
            Learn more about our team <Link href="/about" className="text-brand-primary hover:text-brand-secondary underline">on our About Us page</Link>.
          </p>
        </section>

        {/* Traction & Roadmap Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Traction & Roadmap</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon is currently in its alpha development phase. Core CLI functionalities like branching, S3-backed snapshots, and time-travel are operational and being refined with early user feedback. Our immediate focus is on product stabilization and enhancing the developer experience.
          </p>
          <p className="text-lg mb-4 text-brand-text-darker">
            Our projected roadmap is as follows, though timelines and features are subject to adjustment based on development progress and community feedback:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-brand-text-darker">
            <li><strong className="text-brand-primary-light">Near-term (6-9 months):</strong> Public Beta of the Argon CLI, initial Web Dashboard (experimental), and early access to Argon Cloud (our planned SaaS offering).</li>
            <li><strong className="text-brand-primary-light">Mid-term (9-18 months):</strong> General Availability of Argon Cloud, and initial CI/CD integrations.</li>
            <li><strong className="text-brand-primary-light">Ongoing:</strong> Continuous iteration based on user feedback, exploration of advanced features, and active engagement with the open-source community.</li>
          </ul>
          <p className="text-lg mt-4 text-brand-text-darker">
            We are transparent about our development process and acknowledge that many specifics will evolve. User adoption and feedback during the beta phase will be crucial in shaping Argon&apos;s future.
          </p>
          <div className="mt-6">
            <Link href="https://github.com/argon-lab/argon/projects" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary font-semibold">
              View our public project board on GitHub &rarr;
            </Link>
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
