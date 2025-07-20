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

// Cloud Console workflow steps
const consoleSteps: DemoStep[] = [
  {
    id: 'login',
    command: 'Open console.argonlabs.tech → Sign in with Google',
    description: 'Access the cloud console with secure authentication',
    output: '✅ Signed in successfully\n👤 Welcome back!\n🏢 Teams: Personal, Work Team\n📊 Dashboard loaded',
    metrics: { time: 'instant', operations: 'OAuth flow' }
  },
  {
    id: 'create_project',
    command: 'Create Project → "E-commerce API" → Add Sample Data',
    description: 'Create new project with sample e-commerce data',
    output: '🎉 Project "E-commerce API" created\n📦 Sample data: 1,000 products, 500 customers\n🌿 Default branch: main\n💾 MongoDB Atlas connected',
    metrics: { time: '2.1s', operations: 'Visual UI' }
  },
  {
    id: 'atlas_integration',
    command: 'Integrations → Add MongoDB Atlas → Test Connection',
    description: 'Connect securely to your MongoDB Atlas cluster',
    output: '🔐 Atlas credentials encrypted (AES-256-GCM)\n✅ Connection test passed\n📊 Cluster: production-cluster-0\n🗄️ Databases: 3 detected',
    metrics: { time: '850ms', operations: 'Secure storage' }
  },
  {
    id: 'visual_branch',
    command: 'Branches → Create → "feature/new-products" from main',
    description: 'Create branch using visual interface',
    output: '🌿 Branch "feature/new-products" created\n📋 Collections copied: products, categories, inventory\n👥 Shared with: Development Team\n🔄 Activity logged',
    metrics: { time: '1.2s', operations: 'Visual branching' }
  },
  {
    id: 'query_editor',
    command: 'Query Editor → db.products.find({category: "electronics"})',
    description: 'Use visual query editor with syntax highlighting',
    output: '🔍 Query executed successfully\n📊 Results: 247 documents\n⚡ Execution time: 23ms\n📈 Performance metrics captured',
    metrics: { time: '23ms', operations: 'MongoDB query' }
  },
  {
    id: 'team_collaboration',
    command: 'Share Project → Add team members → Set permissions',
    description: 'Collaborate with team using role-based access',
    output: '👥 Invited 3 team members\n🔐 Permissions: 2 editors, 1 viewer\n📧 Email invitations sent\n📱 Activity feed updated',
    metrics: { time: '500ms', operations: 'Team management' }
  },
  {
    id: 'branch_compare',
    command: 'Compare Branches → main vs feature/new-products',
    description: 'Visual diff showing changes between branches',
    output: '🔍 Comparison complete\n📊 Changes detected:\n  • 15 new products added\n  • 3 categories modified\n  • 0 conflicts\n✅ Safe to merge',
    metrics: { time: '340ms', operations: 'Visual diff' }
  }
];

// SDK workflow steps  
const sdkSteps: DemoStep[] = [
  {
    id: 'install',
    command: 'npm install @argonlabs/sdk',
    description: 'Install Argon SDK for Node.js',
    output: '+ @argonlabs/sdk@1.0.0\n✅ Installation complete\n📚 Types included\n🔧 Ready for development',
    metrics: { time: '3.2s', operations: 'Package install' }
  },
  {
    id: 'initialize',
    command: 'const argon = new ArgonClient({ apiKey: process.env.ARGON_API_KEY })',
    description: 'Initialize SDK with API credentials',
    output: '🔑 API key validated\n🌐 Connected to Argon Cloud\n📊 User: dev@company.com\n✅ SDK ready',
    metrics: { time: '120ms', operations: 'Authentication' }
  },
  {
    id: 'create_project_sdk',
    command: 'const project = await argon.projects.create("my-app", { sampleData: true })',
    description: 'Create project programmatically with sample data',
    output: '🎉 Project "my-app" created\n📦 Sample data populated\n🆔 Project ID: proj_abc123\n🌿 Main branch ready',
    metrics: { time: '1.8s', operations: 'API call' }
  },
  {
    id: 'branch_operations',
    command: 'const branch = await project.branches.create("feature/api-v2")',
    description: 'Create and manage branches via SDK',
    output: '🌿 Branch "feature/api-v2" created\n📋 Collections isolated\n🔗 Branch ID: br_def456\n💾 Ready for development',
    metrics: { time: '450ms', operations: 'Branch creation' }
  },
  {
    id: 'query_sdk',
    command: 'const users = await branch.query("users", { role: "admin" })',
    description: 'Execute queries programmatically',
    output: '🔍 Query executed\n📊 Found 12 admin users\n⚡ Response time: 28ms\n📈 Usage tracked',
    metrics: { time: '28ms', operations: 'SDK query' }
  },
  {
    id: 'data_operations',
    command: 'await branch.collections.users.insertOne({ name: "Alice", role: "admin" })',
    description: 'Perform CRUD operations through SDK',
    output: '📝 Document inserted\n🆔 ID: 507f1f77bcf86cd799439011\n🔄 Change stream captured\n💾 Automatically backed up',
    metrics: { time: '45ms', operations: 'Insert operation' }
  },
  {
    id: 'deployment',
    command: 'await project.deploy({ branch: "feature/api-v2", target: "staging" })',
    description: 'Deploy branch to staging environment',
    output: '🚀 Deployment initiated\n🌐 Staging URL: https://staging-my-app.argon.dev\n✅ Health checks passed\n📱 Team notified',
    metrics: { time: '2.1s', operations: 'Deployment' }
  }
];

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'developer' | 'ai' | 'console' | 'sdk'>('developer');
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const getCurrentSteps = () => {
    switch (activeTab) {
      case 'developer': return developerSteps;
      case 'ai': return aiSteps;
      case 'console': return consoleSteps;
      case 'sdk': return sdkSteps;
      default: return developerSteps;
    }
  };

  const currentSteps = getCurrentSteps();
  const step = currentSteps[currentStep];

  // Reset when switching tabs
  useEffect(() => {
    setCurrentStep(0);
    setTypedCommand('');
    setShowOutput(false);
  }, [activeTab]);

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
    if (currentStep < currentSteps.length - 1) {
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
            onClick={() => setActiveTab('console')}
            className={`px-4 py-3 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-brand-primary text-brand-dark font-semibold'
                : 'text-brand-text-darker hover:text-brand-primary'
            }`}
          >
            🖥️ Cloud Console
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
          {activeTab === 'developer' && 'CLI-Based Database Branching'}
          {activeTab === 'ai' && 'ML Data Versioning & Experimentation'}
          {activeTab === 'console' && 'Visual Cloud Console Workflow'}
          {activeTab === 'sdk' && 'Programmatic Integration with SDK'}
        </h3>
        <p className="text-brand-text-darker">
          {activeTab === 'developer' && 'See how developers create isolated environments using command-line tools'}
          {activeTab === 'ai' && 'Watch ML engineers version datasets and run parallel experiments'}
          {activeTab === 'console' && 'Experience the full-featured web interface with team collaboration and visual tools'}
          {activeTab === 'sdk' && 'Learn how to integrate Argon programmatically into your applications'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Window */}
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
                disabled={currentStep === currentSteps.length - 1 || !showOutput}
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

        {/* Step Information */}
        <div className="space-y-6">
          {/* Current Step */}
          <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-brand-primary mb-2">
              Step {currentStep + 1} of {currentSteps.length}
            </h4>
            <p className="text-brand-text mb-4">{step?.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-brand-dark rounded-full h-2">
              <div 
                className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / currentSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* All Steps Overview */}
          <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-brand-primary mb-4">Demo Steps</h4>
            <div className="space-y-2">
              {currentSteps.map((s, index) => (
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

          {/* Key Benefits */}
          <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-brand-primary mb-4">
              {activeTab === 'developer' && 'CLI Benefits'}
              {activeTab === 'ai' && 'ML/AI Benefits'}
              {activeTab === 'console' && 'Console Benefits'}
              {activeTab === 'sdk' && 'SDK Benefits'}
            </h4>
            <ul className="space-y-2 text-sm text-brand-text-darker">
              {activeTab === 'developer' && (
                <>
                  <li>• Zero-conflict parallel development</li>
                  <li>• Sub-500ms branch operations</li>
                  <li>• Complete data isolation</li>
                  <li>• Git-like workflow familiarity</li>
                </>
              )}
              {activeTab === 'ai' && (
                <>
                  <li>• Dataset versioning & experiments</li>
                  <li>• Time-travel through model states</li>
                  <li>• Parallel training environments</li>
                  <li>• 42% storage compression</li>
                </>
              )}
              {activeTab === 'console' && (
                <>
                  <li>• Visual interface & team collaboration</li>
                  <li>• MongoDB Atlas integration</li>
                  <li>• Role-based access control</li>
                  <li>• Real-time activity tracking</li>
                </>
              )}
              {activeTab === 'sdk' && (
                <>
                  <li>• Programmatic API access</li>
                  <li>• TypeScript support included</li>
                  <li>• Automated deployment workflows</li>
                  <li>• Custom integration flexibility</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}