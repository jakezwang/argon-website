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
    command: 'argonctl init myapp',
    description: 'Initialize new Argon project',
    output: '✅ Initialized Argon project\n📊 Connected to MongoDB: myapp_main\n🔗 S3 bucket: myapp-argon-storage',
    metrics: { time: '247ms', operations: '1,200 ops/sec' }
  },
  {
    id: 'create_branch',
    command: 'argonctl branch create feature/user-auth',
    description: 'Create isolated development branch',
    output: '🌿 Created branch: feature/user-auth\n📋 Collections: feature_user_auth_users, feature_user_auth_sessions\n💾 Base data copied from main branch',
    metrics: { time: '312ms', operations: '8,500 ops/sec' }
  },
  {
    id: 'work_changes',
    command: 'mongosh --eval "db.users.insertOne({name: \'test\', role: \'admin\'})"',
    description: 'Make changes in isolated environment',
    output: '📝 Inserted document in feature_user_auth_users\n🔄 Change captured by stream\n⚡ Background worker queued compression',
    metrics: { time: '89ms', operations: '12,400 ops/sec' }
  },
  {
    id: 'create_test_branch',
    command: 'argonctl branch create test/integration --from feature/user-auth',
    description: 'Create test branch from current work',
    output: '🧪 Created branch: test/integration\n📊 Copied 1,247 documents\n🗜️ ZSTD compression: 156KB → 89KB (43% reduction)',
    metrics: { time: '198ms', operations: '9,800 ops/sec', compression: '43%' }
  },
  {
    id: 'switch_main',
    command: 'argonctl branch switch main',
    description: 'Switch back to main branch',
    output: '↩️ Switched to branch: main\n📋 Collections: main_users, main_sessions\n✨ Clean isolated environment',
    metrics: { time: '156ms', operations: '11,200 ops/sec' }
  }
];

const aiSteps: DemoStep[] = [
  {
    id: 'setup_dataset',
    command: 'argonctl init ml-training',
    description: 'Initialize ML project with dataset',
    output: '🤖 ML project initialized\n📊 Dataset: 2.3M training samples\n🔗 Collections: main_training_data, main_model_metadata',
    metrics: { time: '423ms', operations: '15,600 ops/sec' }
  },
  {
    id: 'experiment_branch',
    command: 'argonctl branch create experiment/feature-engineering-v2',
    description: 'Create branch for feature engineering experiment',
    output: '🔬 Created experiment branch\n📋 Isolated dataset copy: 2.3M samples\n💾 Ready for feature transformation',
    metrics: { time: '687ms', operations: '18,200 ops/sec' }
  },
  {
    id: 'transform_data',
    command: 'python transform_features.py --normalize --embed',
    description: 'Apply feature transformations',
    output: '⚙️ Processing 2.3M samples\n🔄 Applied normalization + embeddings\n📊 Feature dims: 512 → 768\n💾 Updated experiment_feature_engineering_v2_training_data',
    metrics: { time: '1,247ms', operations: '22,100 ops/sec', compression: '38%' }
  },
  {
    id: 'model_branch',
    command: 'argonctl branch create model/transformer-base --from experiment/feature-engineering-v2',
    description: 'Create model training branch from processed data',
    output: '🧠 Created model branch with processed features\n📊 Training data: 2.3M samples (768-dim)\n🎯 Ready for transformer training',
    metrics: { time: '445ms', operations: '19,800 ops/sec' }
  },
  {
    id: 'time_travel',
    command: 'argonctl branch create rollback/baseline --from main --timestamp "2h ago"',
    description: 'Time-travel to compare with baseline',
    output: '⏰ Created branch from 2h ago snapshot\n📊 Baseline data: 2.3M samples (512-dim)\n🔍 Ready for A/B comparison',
    metrics: { time: '234ms', operations: '16,400 ops/sec' }
  },
  {
    id: 'parallel_training',
    command: 'argonctl branch list --active',
    description: 'View parallel training environments',
    output: '🌳 Active branches:\n  • model/transformer-base (768-dim features)\n  • rollback/baseline (512-dim features)\n  • experiment/feature-engineering-v2 (dev)\n💡 Zero conflicts, parallel training',
    metrics: { time: '67ms', operations: '25,000 ops/sec' }
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