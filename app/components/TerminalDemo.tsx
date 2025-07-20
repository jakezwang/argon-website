'use client';

import { useState, useEffect } from 'react';

interface DemoStep {
  id: string;
  command: string;
  description: string;
  output: string;
  metrics?: {
    time: string;
    operations: string;
    compression?: string;
  };
}

interface TerminalDemoProps {
  steps: DemoStep[];
  onStepChange?: (step: number, total: number) => void;
}

export default function TerminalDemo({ steps, onStepChange }: TerminalDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const step = steps[currentStep];

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep, steps.length);
  }, [currentStep, steps.length, onStepChange]);

  // Typing animation
  useEffect(() => {
    if (isRunning && step) {
      setTypedCommand('');
      setShowOutput(false);
      let i = 0;
      const typeTimer = setInterval(() => {
        if (i < step.command.length) {
          setTypedCommand(step.command.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeTimer);
          setTimeout(() => setShowOutput(true), 500);
          setTimeout(() => setIsRunning(false), 1500);
        }
      }, 50);

      return () => clearInterval(typeTimer);
    }
  }, [isRunning, step]);

  const runStep = () => {
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTypedCommand('');
      setShowOutput(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTypedCommand('');
      setShowOutput(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setTypedCommand('');
    setShowOutput(false);
    setIsRunning(false);
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-gray-300 text-sm">argonctl-demo</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4 h-80 overflow-y-auto font-mono text-sm">
          <div className="text-green-400">
            $ {typedCommand}
            {isRunning && <span className="animate-pulse">|</span>}
          </div>
          
          {showOutput && (
            <div className="mt-2 text-gray-300 whitespace-pre-line">
              {step.output}
              
              {step.metrics && (
                <div className="mt-3 p-3 bg-gray-800 rounded border-l-4 border-brand-primary">
                  <div className="text-brand-primary font-semibold">⚡ Performance:</div>
                  <div className="text-sm mt-1">
                    <div>⏱️  Operation time: {step.metrics.time}</div>
                    <div>🚀 Throughput: {step.metrics.operations}</div>
                    {step.metrics.compression && (
                      <div>🗜️  Compression: {step.metrics.compression}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-brand-surface text-brand-text rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={runStep}
            disabled={isRunning}
            className="px-6 py-2 bg-brand-primary text-brand-dark rounded hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {isRunning ? 'Running...' : '▶ Run Command'}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || !showOutput}
            className="px-4 py-2 bg-brand-surface text-brand-text rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
          >
            Next →
          </button>
        </div>
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-brand-surface text-brand-text-darker rounded hover:bg-brand-dark transition-colors"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}