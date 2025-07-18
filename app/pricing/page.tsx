'use client';

import Link from 'next/link';
import { useState } from 'react';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonHref, 
  isPopular = false,
  buttonTarget = '_self'
}: {
  title: string;
  price: string;
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
        Most Popular
      </div>
    )}
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-brand-text">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-5xl font-bold tracking-tight text-brand-text">{price}</span>
        {price !== '$0' && <span className="ml-1 text-xl font-semibold text-brand-muted">/month</span>}
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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  return (
    <div className="bg-brand-dark py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-brand-primary">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-brand-text sm:text-5xl">
            Choose Your Deployment Option
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-text-darker">
            Run Argon for free on your own infrastructure or let us handle everything with our managed cloud service
          </p>
        </div>

        {/* Open Source vs Cloud Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="bg-brand-surface p-1 rounded-lg inline-flex">
            <span className="px-4 py-2 text-sm font-medium text-brand-text">
              Open Source Self-Hosted
            </span>
            <span className="px-4 py-2 text-sm font-medium text-brand-primary">
              •
            </span>
            <span className="px-4 py-2 text-sm font-medium text-brand-text">
              Managed Cloud Service
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3">
          {/* Open Source */}
          <PricingCard
            title="Open Source"
            price="$0"
            description="Self-host Argon on your own infrastructure with full control"
            features={[
              'Unlimited branches',
              'All core features',
              'Community support',
              'MIT licensed',
              'Deploy anywhere',
              'Complete data ownership'
            ]}
            buttonText="View on GitHub"
            buttonHref="https://github.com/argon-lab/argon"
            buttonTarget="_blank"
          />

          {/* Cloud Starter */}
          <PricingCard
            title="Cloud Starter"
            price="$0"
            description="Get started with our managed cloud service"
            features={[
              'Up to 3 projects',
              'Basic branching',
              'Community support',
              '1GB storage',
              'Shared infrastructure',
              'Standard performance'
            ]}
            buttonText="Start Free"
            buttonHref="https://console.argonlabs.tech"
            buttonTarget="_blank"
          />

          {/* Cloud Pro */}
          <PricingCard
            title="Cloud Pro"
            price="$30"
            description="Scale your development with advanced features"
            features={[
              'Unlimited projects',
              'Advanced branching',
              'Priority support',
              '100GB storage',
              'Dedicated resources',
              'High performance'
            ]}
            buttonText="Upgrade to Pro"
            buttonHref="https://console.argonlabs.tech/pricing"
            buttonTarget="_blank"
            isPopular={true}
          />
        </div>

        {/* Feature Comparison */}
        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-center text-brand-text sm:text-4xl">
            Detailed Comparison
          </h2>
          
          <div className="mt-12 overflow-hidden shadow ring-1 ring-brand-muted ring-opacity-20 rounded-lg">
            <table className="min-w-full divide-y divide-brand-muted divide-opacity-20">
              <thead className="bg-brand-surface">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-brand-text">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-brand-text">
                    Open Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-brand-text">
                    Cloud Starter
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-sm font-semibold text-brand-text">
                    Cloud Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-muted divide-opacity-20 bg-brand-dark">
                {[
                  ['Git-style branching', '✓', '✓', '✓'],
                  ['Real-time change capture', '✓', '✓', '✓'],
                  ['Time-travel capabilities', '✓', '✓', '✓'],
                  ['CLI access', '✓', 'Limited', '✓'],
                  ['Web dashboard', 'Self-build', '✓', '✓'],
                  ['Project limit', 'Unlimited', '3', 'Unlimited'],
                  ['Storage', 'Self-managed', '1GB', '100GB'],
                  ['Support', 'Community', 'Community', 'Priority'],
                  ['SLA', 'None', 'None', '99.9%'],
                  ['Custom domains', '✓', '-', '✓'],
                ].map(([feature, ...values]) => (
                  <tr key={feature}>
                    <td className="px-6 py-4 text-sm text-brand-text-darker">{feature}</td>
                    {values.map((value, index) => (
                      <td key={index} className="px-6 py-4 text-sm text-center">
                        {value === '✓' ? (
                          <span className="text-brand-primary">✓</span>
                        ) : value === '-' ? (
                          <span className="text-brand-muted">-</span>
                        ) : (
                          <span className="text-brand-text-darker">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-center text-brand-text sm:text-4xl mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                Should I use open source or cloud?
              </h3>
              <p className="text-brand-text-darker">
                Use open source if you need full control, have specific compliance requirements, or want to customize Argon. 
                Choose cloud if you want a managed solution with zero maintenance overhead.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                Can I migrate from open source to cloud?
              </h3>
              <p className="text-brand-text-darker">
                Yes! We provide migration tools to help you move your data from self-hosted Argon to our cloud service.
                Contact support for assistance with migration.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">
                What MongoDB versions are supported?
              </h3>
              <p className="text-brand-text-darker">
                Argon supports MongoDB 4.0+ with change streams enabled. Cloud service runs on MongoDB 6.0 for optimal performance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Ready to transform your MongoDB workflow?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-brand-text-darker">
            Start with our open source version or jump straight into the cloud. 
            Either way, you'll have branching superpowers in minutes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-brand-primary px-6 py-3 text-base font-semibold text-brand-dark shadow-sm hover:bg-brand-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Get Open Source
            </Link>
            <Link
              href="https://console.argonlabs.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold leading-6 text-brand-primary hover:text-brand-secondary"
            >
              Try Cloud Free <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}