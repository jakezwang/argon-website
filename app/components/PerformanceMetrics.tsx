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
    label: 'Branch Operations',
    value: '<500',
    unit: 'ms',
    description: 'Lightning-fast branch creation, switching, and deletion',
    icon: '⚡'
  },
  {
    label: 'Throughput',
    value: '10,000+',
    unit: 'ops/sec',
    description: 'High-performance data operations with real-time processing',
    icon: '🚀'
  },
  {
    label: 'Storage Compression',
    value: '42.40',
    unit: '% reduction',
    description: 'ZSTD compression minimizes storage costs',
    icon: '🗜️'
  },
  {
    label: 'Data Isolation',
    value: '100',
    unit: '% conflict-free',
    description: 'Complete separation using collection-level prefixes',
    icon: '🛡️'
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
            Enterprise-Grade Performance
          </h2>
          <p className="mt-4 text-lg text-brand-text-darker max-w-3xl mx-auto">
            Production-ready metrics that power real-world applications with 
            <strong className="text-brand-primary"> reliability, speed, and efficiency</strong>.
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
            <h3 className="text-xl font-semibold text-brand-primary mb-4">🏗️ Architecture Highlights</h3>
            <ul className="space-y-3 text-brand-text-darker">
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Hybrid Go+Python:</strong> Performance-critical operations in Go, productivity APIs in Python</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>MongoDB Change Streams:</strong> Real-time data capture with enterprise reliability</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Background Workers:</strong> Asynchronous processing with MongoDB-based job queues</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Collection Prefixes:</strong> True data isolation without infrastructure overhead</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-dark p-8 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-brand-primary mb-4">📊 Scalability Metrics</h3>
            <ul className="space-y-3 text-brand-text-darker">
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Worker Pools:</strong> 1-20 configurable workers for optimal resource usage</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Compression Ratio:</strong> ZSTD achieves consistent 40%+ storage reduction</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Branch Switching:</strong> Instant environment changes with metadata operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-primary mr-2">•</span>
                <span><strong>Zero Downtime:</strong> Collection-level isolation eliminates service interruptions</span>
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