'use client';

import { useState, useEffect } from 'react';

interface UseCase {
  title: string;
  scenario: string;
  solution: string;
  benefit: string;
  icon: string;
}

const useCases: UseCase[] = [
  {
    title: 'Safe Database Experiments',
    scenario: 'Test risky migrations or schema changes',
    solution: 'Create instant branch, test changes, delete if failed',
    benefit: 'Zero risk to production data',
    icon: '🧪'
  },
  {
    title: 'Debug Production Issues',
    scenario: 'Customer reports data was correct yesterday',
    solution: 'Time-travel to any point, query historical state',
    benefit: 'Find and fix issues in minutes, not hours',
    icon: '🔍'
  },
  {
    title: 'ML Model Training',
    scenario: 'Train models on different dataset versions',
    solution: 'Branch data, version experiments, track results',
    benefit: 'Reproduce any experiment perfectly',
    icon: '🤖'
  },
  {
    title: 'Parallel Development',
    scenario: 'Multiple teams working on same database',
    solution: 'Each team gets isolated branch, merge when ready',
    benefit: 'No conflicts, no waiting, no downtime',
    icon: '👥'
  }
];

export default function UseCases() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('use-cases');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="use-cases" className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-brand-text">
            What Can You Do With Argon?
          </h2>
          <p className="mt-4 text-lg text-brand-text-darker max-w-3xl mx-auto">
            Real-world scenarios where Argon's MongoDB branching and time-travel 
            <strong className="text-brand-primary"> solve actual problems</strong> developers face every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={useCase.title}
              className={`bg-brand-dark p-8 rounded-xl shadow-2xl hover:shadow-brand-primary/20 transition-all duration-300 transform hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4 text-center">{useCase.icon}</div>
              <h3 className="text-lg font-semibold text-brand-primary mb-3">
                {useCase.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="text-brand-text-darker">
                  <span className="font-semibold text-brand-text">Scenario:</span> {useCase.scenario}
                </div>
                <div className="text-brand-text-darker">
                  <span className="font-semibold text-brand-text">Solution:</span> {useCase.solution}
                </div>
                <div className="text-brand-primary-light font-semibold">
                  ✓ {useCase.benefit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works in Practice */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-brand-dark p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">🚀 Start Using in 30 Seconds</h3>
            <div className="space-y-3 text-brand-text-darker">
              <div className="flex items-start">
                <span className="text-brand-primary mr-2 font-bold">1.</span>
                <span><code className="bg-brand-surface px-2 py-1 rounded text-sm">brew install argon-lab/tap/argonctl</code></span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-primary mr-2 font-bold">2.</span>
                <span><code className="bg-brand-surface px-2 py-1 rounded text-sm">argon projects create my-app</code></span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-primary mr-2 font-bold">3.</span>
                <span><code className="bg-brand-surface px-2 py-1 rounded text-sm">argon branches create feature-x</code></span>
              </div>
              <div className="flex items-start">
                <span className="text-brand-primary mr-2 font-bold">4.</span>
                <span>Start experimenting with zero risk!</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-dark p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">🛠️ Built for Your Stack</h3>
            <div className="grid grid-cols-2 gap-4 text-brand-text-darker">
              <div>
                <h4 className="font-semibold text-brand-text mb-2">Languages</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Python SDK</li>
                  <li>• Go SDK</li>
                  <li>• Node.js (NPM)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-brand-text mb-2">Integrations</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Jupyter Notebooks</li>
                  <li>• MLflow</li>
                  <li>• Weights & Biases</li>
                  <li>• DVC</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-sm text-brand-primary-light">
              Works with your existing MongoDB - no migration needed!
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-brand-text-darker mb-6">
            Join thousands of developers who never worry about breaking production data again
          </p>
          <div className="space-x-4">
            <a
              href="#quick-start"
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Start Free
            </a>
            <a
              href="/demo"
              className="inline-block bg-brand-surface border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              See Live Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}