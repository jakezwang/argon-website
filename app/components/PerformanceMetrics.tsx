'use client';

import { useState, useEffect } from 'react';

interface Metric {
  label: string;
  value: string;
  unit: string;
  description: string;
  icon: string;
}

const metrics: Metric[] = [
  {
    label: 'Branch Creation',
    value: '1.16',
    unit: 'ms',
    description: '86x faster than industry standard (100ms+)',
    icon: '⚡'
  },
  {
    label: 'Throughput',
    value: '37,905',
    unit: 'ops/sec',
    description: 'Verified performance with production monitoring',
    icon: '🚀'
  },
  {
    label: 'Time-Travel',
    value: '<50',
    unit: 'ms',
    description: 'Query any historical database state instantly',
    icon: '⏳'
  },
  {
    label: 'Test Coverage',
    value: '119+',
    unit: 'assertions',
    description: '100% pass rate with comprehensive testing',
    icon: '✅'
  }
];

export default function PerformanceMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<string[]>(metrics.map(() => '0'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('performance-metrics');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      metrics.forEach((metric, index) => {
        let startValue = 0;
        const targetValue = parseFloat(metric.value.replace(/[^\d.]/g, ''));
        const increment = targetValue / 100;
        const timer = setInterval(() => {
          startValue += increment;
          if (startValue >= targetValue) {
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = metric.value;
              return newValues;
            });
            clearInterval(timer);
          } else {
            setAnimatedValues(prev => {
              const newValues = [...prev];
              if (metric.value.includes('+')) {
                newValues[index] = Math.floor(startValue).toLocaleString() + '+';
              } else if (metric.value.includes('<')) {
                newValues[index] = '<' + Math.floor(startValue);
              } else {
                newValues[index] = startValue.toFixed(2);
              }
              return newValues;
            });
          }
        }, 20);

        return () => clearInterval(timer);
      });
    }
  }, [isVisible]);

  return (
    <section id="performance-metrics" className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-brand-text">
            Verified Performance Metrics
          </h2>
          <p className="mt-4 text-lg text-brand-text-darker max-w-3xl mx-auto">
            Revolutionary WAL architecture delivers <strong className="text-brand-primary">86x faster branching</strong> and 
            industry-first MongoDB time-travel with production monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="bg-brand-dark p-8 rounded-xl shadow-2xl text-center hover:shadow-brand-primary/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{metric.icon}</div>
              <div className="text-3xl font-bold text-brand-primary mb-2">
                {animatedValues[index]}
                <span className="text-lg text-brand-text-darker ml-1">{metric.unit}</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">
                {metric.label}
              </h3>
              <p className="text-sm text-brand-text-darker">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Performance Details */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-brand-dark p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">🎆 WAL Architecture Innovation</h3>
            <ul className="space-y-3 text-brand-text-darker">
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Pure WAL System:</strong> Unified architecture with LSN (Log Sequence Number) pointers</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Time-Travel Engine:</strong> First MongoDB implementation with millisecond precision</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Zero-Copy Branching:</strong> Instant branches without data duplication</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Production Monitoring:</strong> Health checks, metrics, and alerting built-in</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-dark p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">🤖 ML-Native Features</h3>
            <ul className="space-y-3 text-brand-text-darker">
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Jupyter Magic:</strong> %argon branch create for notebook workflows</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>MLflow Integration:</strong> Automatic experiment tracking with branches</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>W&B + DVC:</strong> Rich visualization and data version control sync</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Python & Go SDKs:</strong> Clean interfaces for programmatic access</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-brand-text-darker mb-6">
            Ready to experience these performance benefits in your own environment?
          </p>
          <div className="space-x-4">
            <a
              href="#quick-start"
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Get Started Now
            </a>
            <a
              href="/demo"
              className="inline-block bg-brand-surface border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Try Interactive Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}