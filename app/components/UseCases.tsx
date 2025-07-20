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
    title: 'Stop Breaking Production',
    scenario: 'Need to test a risky database migration',
    solution: 'Branch → Test → Merge (or delete if it fails)',
    benefit: 'Production stays safe, always',
    icon: '🛡️'
  },
  {
    title: '"Oh Shit" Moments',
    scenario: 'Accidentally deleted important data',
    solution: 'Time-travel back to 5 minutes ago',
    benefit: 'Instant recovery, zero data loss',
    icon: '⏰'
  },
  {
    title: 'Team Collaboration',
    scenario: 'Multiple developers need the same dataset',
    solution: 'Everyone gets their own isolated branch',
    benefit: 'No stepping on each other\'s toes',
    icon: '🤝'
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
            Real Problems, Simple Solutions
          </h2>
          <p className="mt-4 text-lg text-brand-text-darker max-w-3xl mx-auto">
            Every MongoDB developer has been here. Now there's 
            <strong className="text-brand-primary"> finally a better way</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

        {/* Getting Started */}
        <div className="mt-16 bg-brand-dark p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-brand-primary mb-4">🚀 Ready to Stop Worrying About Your Database?</h3>
            <p className="text-brand-text-darker">Get started in under 30 seconds. Works with your existing MongoDB setup.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">🍺</div>
              <code className="bg-brand-surface px-3 py-2 rounded text-sm text-brand-primary">brew install argon-lab/tap/argonctl</code>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🎆</div>
              <code className="bg-brand-surface px-3 py-2 rounded text-sm text-brand-primary">argon projects create demo</code>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">✨</div>
              <span className="text-brand-text">Start experimenting safely!</span>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-brand-text-darker">
            • No migration required • Works with existing MongoDB • 100% open source •
          </div>
        </div>

      </div>
    </section>
  );
}