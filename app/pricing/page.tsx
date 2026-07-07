import Link from 'next/link';

const PricingCard = ({
  title,
  price,
  priceSuffix,
  description,
  features,
  buttonText,
  buttonHref,
  isPopular = false,
  buttonTarget = '_self',
}: {
  title: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
  buttonTarget?: string;
}) => (
  <div className={`relative bg-brand-surface p-8 rounded-2xl shadow-xl ${isPopular ? 'ring-2 ring-brand-primary' : ''}`}>
    {isPopular && (
      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-brand-primary px-3 py-1 text-sm font-medium text-brand-dark text-center">
        Available Now
      </div>
    )}
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-brand-text">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-5xl font-bold tracking-tight text-brand-text">{price}</span>
        {priceSuffix && <span className="ml-2 text-xl font-semibold text-brand-muted">{priceSuffix}</span>}
      </div>
      <p className="mt-4 text-brand-text-darker">{description}</p>
    </div>
    <ul className="mb-8 space-y-4 text-brand-text-darker">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <svg className="h-6 w-6 text-brand-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="ml-3">{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      href={buttonHref}
      target={buttonTarget}
      rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
      className={`block w-full text-center py-3 px-4 rounded-md font-semibold transition-colors ${
        isPopular
          ? 'bg-brand-primary text-brand-dark hover:bg-brand-secondary'
          : 'bg-brand-dark text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-brand-dark'
      }`}
    >
      {buttonText}
    </Link>
  </div>
);

export default function PricingPage() {
  return (
    <div className="bg-brand-dark py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-brand-primary">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">
            Free and Open Source Today
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-text-darker">
            Self-host Argon on your own infrastructure right now. A managed cloud service
            is on our <Link href="/roadmap" className="text-brand-primary underline hover:text-brand-secondary">roadmap</Link> —
            join the waitlist and we&apos;ll email you when it opens.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          <PricingCard
            title="Open Source"
            price="$0"
            priceSuffix="forever"
            description="Self-host Argon on your own infrastructure with full control"
            features={[
              'Unlimited branches',
              'All core features',
              'Community support',
              'MIT licensed',
              'Deploy anywhere',
              'Complete data ownership',
            ]}
            buttonText="View on GitHub"
            buttonHref="https://github.com/argon-lab/argon"
            buttonTarget="_blank"
            isPopular={true}
          />

          <PricingCard
            title="Argon Cloud"
            price="Coming"
            description="A managed service planned for after the v2 engine ships — zero maintenance, usage-based pricing"
            features={[
              'Fully managed infrastructure (planned)',
              'Web dashboard included (planned)',
              'TTL sandboxes for AI agents (planned)',
              'Usage-based pricing — pay for what you branch (planned)',
              'Built on the same open-source core',
            ]}
            buttonText="Join the Waitlist"
            buttonHref="mailto:jake.wang@argonlabs.tech?subject=Argon%20Cloud%20waitlist"
          />
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center text-brand-text sm:text-4xl mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                Is Argon really free?
              </h3>
              <p className="text-brand-text-darker">
                Yes. Argon is MIT licensed and self-hosted — unlimited branches, all core features,
                your infrastructure, your data. That doesn&apos;t change when the cloud service launches.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                When is Argon Cloud coming?
              </h3>
              <p className="text-brand-text-darker">
                After the v2 engine milestones ship — see the{' '}
                <Link href="/roadmap" className="text-brand-primary underline hover:text-brand-secondary">roadmap</Link>.
                We&apos;d rather launch a managed service on the rebuilt, benchmarked engine than rush one out.
                Waitlist members hear first.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                What MongoDB versions are supported?
              </h3>
              <p className="text-brand-text-darker">
                Argon works with MongoDB 4.0+, self-hosted or Atlas. Some upcoming v2 features
                (change-stream write capture, planned for M3) will require a replica set or Atlas.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Ready to branch your MongoDB?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-brand-text-darker">
            Start with the open source version today, and follow the roadmap
            as the v2 engine lands milestone by milestone.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-brand-primary px-6 py-3 text-base font-semibold text-brand-dark shadow-sm hover:bg-brand-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Get Started on GitHub
            </Link>
            <Link
              href="/roadmap"
              className="text-base font-semibold leading-6 text-brand-primary hover:text-brand-secondary"
            >
              View the Roadmap <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
