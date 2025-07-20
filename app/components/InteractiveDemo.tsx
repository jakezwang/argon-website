'use client';

import { useState, useEffect } from 'react';
import TerminalDemo from './TerminalDemo';
import ConsoleDemo from './ConsoleDemo';
import IDEDemo from './IDEDemo';

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

const developerSteps: DemoStep[] = [
  {
    id: 'init',
    command: 'argon projects create my-app',
    description: 'Create project with time-travel enabled',
    output: '✅ Created project: my-app\n📊 MongoDB WAL initialized\n⏳ Time-travel enabled with millisecond precision\n🚀 Performance: 37,905+ ops/sec',
    metrics: { time: '1.16ms', operations: '37,905 ops/sec' }
  },
  {
    id: 'create_branch',
    command: 'argon branches create feature-x -p my-app',
    description: 'Instant branch creation (86x faster)',
    output: '⚡ Branch created in 1.16ms\n🌿 Zero-copy branching - no data duplication\n📋 WAL LSN pointer: 0x1A2B3C4D\n🎯 86x faster than industry standard',
    metrics: { time: '1.16ms', operations: '15,360 ops/sec' }
  },
  {
    id: 'work_changes',
    command: 'argon time-travel query -p my-app -b main --timestamp "5 minutes ago"',
    description: 'Query historical database state',
    output: '⏳ Time-travel to: 2025-07-20T10:15:00Z\n🔍 Reconstructing state from WAL\n📋 Found 2,847 documents at timestamp\n✅ Query completed in <50ms',
    metrics: { time: '<50ms', operations: '7,688 queries/sec' }
  },
  {
    id: 'create_test_branch',
    command: 'argon metrics',
    description: 'View real-time performance metrics',
    output: '📊 Performance Metrics:\n• Throughput: 37,905 ops/sec\n• Branch creation: 1.16ms avg\n• Time-travel queries: <50ms\n• Test coverage: 119 assertions (100%)',
    metrics: { time: 'real-time', operations: '37,905 ops/sec' }
  },
  {
    id: 'switch_main',
    command: 'argon status',
    description: 'Check system health and monitoring',
    output: '✅ System Status: Healthy\n📋 Active branches: 3\n🚀 Current throughput: 37,905 ops/sec\n🛡️ Production monitoring: Active',
    metrics: { time: 'instant', operations: '37,905 ops/sec' }
  }
];

const aiSteps: DemoStep[] = [
  {
    id: 'setup_dataset',
    command: '%argon branch create experiment-v2',
    description: 'Jupyter magic command for ML workflow',
    output: '🔮 Jupyter integration active\n🤖 Created ML experiment branch\n📊 MLflow tracking enabled\n🎯 Branch: experiment-v2 (1.16ms)',
    metrics: { time: '1.16ms', operations: '37,905 ops/sec' }
  },
  {
    id: 'experiment_branch',
    command: 'mlflow.start_run()',
    description: 'MLflow integration with Argon branches',
    output: '🎯 MLflow run started\n🌿 Auto-created Argon branch: mlflow-run-x7k9\n📋 Experiment tracking enabled\n✅ Automatic versioning active',
    metrics: { time: '1.16ms', operations: 'integrated' }
  },
  {
    id: 'transform_data',
    command: 'wandb.init(project="argon-ml")',
    description: 'Weights & Biases rich visualization',
    output: '🌊 W&B run initialized\n🔗 Linked to Argon branch\n📈 Real-time metrics streaming\n🎨 Rich experiment visualization',
    metrics: { time: 'real-time', operations: 'streaming' }
  },
  {
    id: 'model_branch',
    command: 'dvc add data/model_v2.pkl',
    description: 'DVC integration for data versioning',
    output: '💾 DVC tracking enabled\n🔄 Synced with Argon branch\n🌐 Remote storage configured\n✅ Version control complete',
    metrics: { time: 'instant', operations: 'synced' }
  },
  {
    id: 'time_travel',
    command: 'argon time-travel restore -p ml-project --timestamp "before bad experiment"',
    description: 'Safe restore from any point in time',
    output: '⏳ Time-travel to healthy state\n🔄 WAL reconstruction complete\n✅ Data restored successfully\n🛡️ Zero data loss guaranteed',
    metrics: { time: '<50ms', operations: 'instant' }
  },
  {
    id: 'parallel_training',
    command: 'argon metrics --ml',
    description: 'ML-specific performance metrics',
    output: '📊 ML Performance:\n  • Active experiments: 12\n  • Parallel branches: 8\n  • Zero conflicts: 100%\n  • Throughput: 37,905 ops/sec',
    metrics: { time: 'real-time', operations: '37,905 ops/sec' }
  }
];


export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'developer' | 'ai' | 'sdk'>('developer');
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  // Reset when switching tabs
  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  const handleStepChange = (step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  };

  const getCurrentSteps = () => {
    switch (activeTab) {
      case 'developer': return developerSteps;
      case 'ai': return aiSteps;
      case 'sdk': return []; // SDK uses IDEDemo component
      default: return developerSteps;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Selector */}
      <div className="flex justify-center mb-8 overflow-x-auto">
        <div className="bg-brand-surface rounded-lg p-1 flex flex-nowrap min-w-max">
          <button
            onClick={() => setActiveTab('developer')}
            className={`px-4 py-3 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'developer'
                ? 'bg-brand-primary text-brand-dark font-semibold'
                : 'text-brand-text-darker hover:text-brand-primary'
            }`}
          >
            👨‍💻 CLI Workflow
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-brand-primary text-brand-dark font-semibold'
                : 'text-brand-text-darker hover:text-brand-primary'
            }`}
          >
            🤖 ML/AI Workflow
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-3 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'sdk'
                ? 'bg-brand-primary text-brand-dark font-semibold'
                : 'text-brand-text-darker hover:text-brand-primary'
            }`}
          >
            ⚡ SDK Integration
          </button>
        </div>
      </div>

      {/* Demo Description */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-brand-primary mb-2">
          {activeTab === 'developer' && 'Git-Like Database Versioning'}
          {activeTab === 'ai' && 'ML Data Versioning & Experiment Tracking'}
          {activeTab === 'sdk' && 'Programmatic Integration with SDK'}
        </h3>
        <p className="text-brand-text-darker">
          {activeTab === 'developer' && 'See how developers use Git-like workflows for MongoDB branching and data versioning'}
          {activeTab === 'ai' && 'Watch ML engineers track experiments and version datasets with collection-level isolation'}
          {activeTab === 'sdk' && 'Learn how to integrate Argon\'s version control system programmatically into your applications'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Render appropriate demo interface based on active tab */}
        {(activeTab === 'developer' || activeTab === 'ai') && (
          <TerminalDemo steps={getCurrentSteps()} onStepChange={handleStepChange} />
        )}
        {activeTab === 'sdk' && (
          <IDEDemo onStepChange={handleStepChange} />
        )}

        {/* Step Information */}
        <div className="space-y-6">
          {/* Current Step */}
          <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-brand-primary mb-2">
              Step {currentStep + 1} of {totalSteps || 1}
            </h4>
            {(activeTab === 'developer' || activeTab === 'ai') && (
              <p className="text-brand-text mb-4">{getCurrentSteps()[currentStep]?.description}</p>
            )}
            {activeTab === 'sdk' && (
              <p className="text-brand-text mb-4">SDK integration demo - {currentStep + 1} of {totalSteps}</p>
            )}
            
            {/* Progress Bar */}
            <div className="w-full bg-brand-dark rounded-full h-2">
              <div 
                className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* All Steps Overview */}
          {(activeTab === 'developer' || activeTab === 'ai') && (
            <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold text-brand-primary mb-4">Demo Steps</h4>
              <div className="space-y-2">
                {getCurrentSteps().map((s, index) => (
                  <div
                    key={s.id}
                    className={`p-2 rounded text-sm transition-colors ${
                      index === currentStep
                        ? 'bg-brand-primary text-brand-dark'
                        : index < currentStep
                        ? 'bg-brand-dark text-brand-text-darker'
                        : 'text-brand-text-darker'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {index < currentStep ? '✅' : index === currentStep ? '▶️' : '⏳'}
                      </span>
                      <span className="text-xs">{s.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Benefits */}
          <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-brand-primary mb-4">
              {activeTab === 'developer' && 'Version Control Benefits'}
              {activeTab === 'ai' && 'ML/AI Benefits'}
              {activeTab === 'sdk' && 'SDK Benefits'}
            </h4>
            <ul className="space-y-2 text-sm text-brand-text-darker">
              {activeTab === 'developer' && (
                <>
                  <li>• Fast collection-level branching</li>
                  <li>• High-performance data operations</li>
                  <li>• MongoDB change stream tracking</li>
                  <li>• Complete MongoDB API compatibility</li>
                </>
              )}
              {activeTab === 'ai' && (
                <>
                  <li>• ML experiment tracking integration</li>
                  <li>• MLflow, W&B, DVC support</li>
                  <li>• Collection-level data isolation</li>
                  <li>• ZSTD compression for storage</li>
                </>
              )}
              {activeTab === 'sdk' && (
                <>
                  <li>• Python SDK with ML integrations</li>
                  <li>• Git-like version control API</li>
                  <li>• Production-ready v1.0.0</li>
                  <li>• Docker deployment support</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}