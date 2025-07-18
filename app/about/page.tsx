import Link from 'next/link';
import Image from 'next/image'; // Added Image import

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8"> {/* Removed pt-16 */}

        {/* Team Introduction Section - Placeholder */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="text-center">
              <div className="relative w-[200px] h-[200px] rounded-full mx-auto mb-4 shadow-lg overflow-hidden">
                <Image
                  src="/jakewang.jpeg"
                  alt="Jake Wang"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-brand-text">
                <Link href="https://www.linkedin.com/in/wang1/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary-light hover:underline">
                  Jake Wang
                </Link>
              </h3>
              <p className="text-brand-primary">Founder</p>
              <p className="text-brand-text-darker mt-2">
                A U.S. Army soldier and seasoned Software Engineer, Jake was inspired by his work at MongoDB, LinkedIn, and Bloomberg to create Argon. He&apos;s passionate about building better developer tools to streamline workflows and boost productivity.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-[200px] h-[200px] rounded-full mx-auto mb-4 shadow-lg overflow-hidden">
                <Image
                  src="/nootnoot.jpg"
                  alt="Noot Noot"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-brand-text">
                <Link href="https://www.instagram.com/energetic_nootnoot" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary-light hover:underline">
                  Noot Noot
                </Link>
              </h3>
              <p className="text-brand-primary">Chief Emotional Support Officer</p>
              <p className="text-brand-text-darker mt-2">
                Noot Noot: Official team cat and purr-fessional morale booster. He keeps us smiling and the workplace pawsitive. His value? Beyond measure (and very fluffy)!
              </p>
            </div>
          </div>
        </section>

        {/* Why Argon? Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Why Argon? The AI Data Advantage</h2>
          <p className="text-lg text-brand-text-darker mb-3">
            Argon brings Git-like agility to MongoDB, accelerating AI development by enabling instant branching, serverless-inspired compute, and S3-backed storage. This makes Argon ideal for <strong className="text-brand-primary-light">managing complex AI datasets and model development pipelines.</strong>
          </p>
          <p className="text-lg text-brand-text-darker">
            Argon delivers <strong className="text-brand-accent">transformative benefits to NoSQL, focusing on AI use cases.</strong>
          </p>
        </section>

        {/* Project Status Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">Project Status: Production-Ready Platform</h2>
          <p className="text-lg mb-4 text-brand-text-darker">
            Argon is a <strong className="text-brand-accent">production-ready open-source platform</strong> delivering enterprise-grade database branching, time-travel, and real-time change capture for MongoDB. With proven performance metrics including sub-500ms operations and 10,000+ ops/sec throughput, these features power <strong className="text-brand-primary-light">scalable AI data management</strong> from experimentation to production deployment.
          </p>
          <p className="text-lg mb-4 text-brand-text-darker">
            The <code className="bg-brand-darker px-1 py-0.5 rounded text-sm">argonctl</code> CLI (available via npm and Homebrew) provides immediate access to our hybrid Go+Python architecture. We're focused on <strong className="text-brand-accent">expanding enterprise features and scaling adoption</strong> based on production use cases, especially for AI applications requiring reliable data versioning and collaboration.
          </p>
          <p className="text-lg text-brand-text-darker">
            We encourage community involvement: deploy Argon in production, report issues, suggest features, and contribute. Your real-world feedback drives our roadmap.
          </p>
          <div className="mt-6">
            <Link href="https://github.com/argon-lab/argon/projects" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-secondary font-semibold">
              View our project roadmap on GitHub &rarr;
            </Link>
          </div>
        </section>

        {/* License Section */}
        <section className="mb-12 bg-brand-surface p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-4 text-brand-primary">License</h2>
          <p className="text-lg text-brand-text-darker">
            Argon is licensed under the <Link href="https://github.com/argon-lab/argon/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-secondary">MIT License</Link>.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center py-10">
          <h2 className="text-3xl font-bold mb-6 text-brand-text">Get Involved!</h2>
          <p className="text-xl mb-8 text-brand-text-darker">
            Ready to take Argon for a spin or help shape its future?
          </p>
          <div className="space-x-4">
            <Link
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105"
            >
              Star us on GitHub
            </Link>
            <Link
              href="https://github.com/argon-lab/argon/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-surface text-brand-primary hover:bg-opacity-80 border border-brand-primary font-semibold px-8 py-3 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105"
            >
              Join the Discussion
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
