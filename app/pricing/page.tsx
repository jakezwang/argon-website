import Link from 'next/link';

const Plan = ({
  title,
  price,
  priceSuffix,
  tag,
  description,
  features,
  buttonText,
  buttonHref,
  buttonSolid = false,
  buttonTarget = '_self',
}: {
  title: string;
  price: string;
  priceSuffix?: string;
  tag?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  buttonSolid?: boolean;
  buttonTarget?: string;
}) => (
  <div className="flex flex-col border border-brand-edge bg-brand-surface p-8">
    <div className="flex items-baseline justify-between">
      <h3 className="font-mono text-lg text-brand-text">{title}</h3>
      {tag && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-brand-primary">
          {tag}
        </span>
      )}
    </div>
    <div className="mt-5 flex items-baseline gap-2">
      <span className="text-4xl font-semibold tracking-tight text-brand-text">{price}</span>
      {priceSuffix && <span className="font-mono text-sm text-brand-muted">{priceSuffix}</span>}
    </div>
    <p className="mt-4 text-sm leading-6">{description}</p>
    <ul className="mt-6 flex-1 space-y-2.5">
      {features.map((feature, index) => (
        <li key={index} className="flex gap-3 text-sm leading-6 text-brand-text-darker">
          <span className="select-none font-mono text-brand-primary">·</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      href={buttonHref}
      target={buttonTarget}
      rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
      className={`${buttonSolid ? 'btn-solid' : 'btn-quiet'} mt-8 justify-center`}
    >
      {buttonText}
    </Link>
  </div>
);

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Pricing</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-brand-text">
        Free and open source today
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Self-host Argon on your own infrastructure right now. A managed cloud
        service is on our{' '}
        <Link href="/roadmap" className="prose-link">
          roadmap
        </Link>{' '}
        — join the waitlist and we&apos;ll email you when it opens.
      </p>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        <Plan
          title="Open Source"
          price="$0"
          priceSuffix="forever"
          tag="available now"
          description="Self-host Argon on your own infrastructure with full control."
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
          buttonSolid
        />
        <Plan
          title="Argon Cloud"
          price="Coming"
          tag="waitlist"
          description="A managed service on the rebuilt engine — zero maintenance, usage-based pricing."
          features={[
            'Fully managed infrastructure (planned)',
            'Web dashboard included (planned)',
            'TTL sandboxes for AI agents (planned)',
            'Usage-based pricing — pay for what you branch (planned)',
            'Built on the same open-source core',
          ]}
          buttonText="Join the waitlist"
          buttonHref="mailto:jake.wang@argonlabs.tech?subject=Argon%20Cloud%20waitlist"
        />
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-24 max-w-3xl">
        <p className="kicker mb-8">Frequently asked questions</p>
        <div className="divide-y divide-brand-edge border-y border-brand-edge">
          {[
            {
              q: 'Is Argon really free?',
              a: "Yes. Argon is MIT licensed and self-hosted — unlimited branches, all core features, your infrastructure, your data. That doesn't change when the cloud service launches.",
            },
            {
              q: 'When is Argon Cloud coming?',
              a: "The engine rebuild has shipped through M4 plus the agent surface (sandboxes, MCP) — the cloud is what comes next on the roadmap. We'd rather launch a managed service on the rebuilt, benchmarked engine than rush one out. Waitlist members hear first.",
            },
            {
              q: 'What MongoDB versions are supported?',
              a: 'Argon works with MongoDB 4.0+, self-hosted or Atlas. Change-stream write capture on live branches requires a replica set or Atlas (standalone mongod does not support change streams).',
            },
          ].map((item) => (
            <div key={item.q} className="py-6">
              <h3 className="font-medium text-brand-text">{item.q}</h3>
              <p className="mt-2 text-sm leading-7">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-24 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-brand-text">
          Ready to branch your MongoDB?
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-8">
          Start with the open source version today, and follow the roadmap as
          the v2 engine lands milestone by milestone.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Get started on GitHub
          </Link>
          <Link href="/roadmap" className="btn-quiet">
            View the roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
