'use client';

import { useState, useEffect } from 'react';

interface SDKStep {
  id: string;
  filename: string;
  code: string;
  description: string;
  output: string;
  language: 'javascript' | 'typescript' | 'bash';
}

const sdkSteps: SDKStep[] = [
  {
    id: 'install',
    filename: 'terminal',
    code: 'npm install @argonlabs/sdk',
    description: 'Install Argon SDK for Node.js',
    output: '+ @argonlabs/sdk@1.0.0\n✅ Installation complete\n📚 Types included\n🔧 Ready for development',
    language: 'bash'
  },
  {
    id: 'initialize',
    filename: 'app.js',
    code: `import { ArgonClient } from '@argonlabs/sdk';

const argon = new ArgonClient({
  apiKey: process.env.ARGON_API_KEY,
  endpoint: 'https://api.argonlabs.tech'
});

console.log('🔑 SDK initialized');`,
    description: 'Initialize SDK with API credentials',
    output: '🔑 API key validated\n🌐 Connected to Argon Cloud\n📊 User: dev@company.com\n✅ SDK ready',
    language: 'javascript'
  },
  {
    id: 'create_project',
    filename: 'create-project.js',
    code: `// Create a new project with sample data
const project = await argon.projects.create('my-app', {
  description: 'My awesome application',
  sampleData: true,
  template: 'ecommerce'
});

console.log('Project created:', project.id);`,
    description: 'Create project programmatically with sample data',
    output: '🎉 Project "my-app" created\n📦 Sample data populated\n🆔 Project ID: proj_abc123\n🌿 Main branch ready',
    language: 'javascript'
  },
  {
    id: 'branch_operations',
    filename: 'branch-workflow.js',
    code: `// Create a new feature branch
const branch = await project.branches.create('feature/api-v2', {
  from: 'main',
  copyData: true
});

// Switch to the new branch
await branch.activate();

console.log('Branch ready for development');`,
    description: 'Create and manage branches via SDK',
    output: '🌿 Branch "feature/api-v2" created\n📋 Collections isolated\n🔗 Branch ID: br_def456\n💾 Ready for development',
    language: 'javascript'
  },
  {
    id: 'query_data',
    filename: 'queries.js',
    code: `// Query users with admin role
const adminUsers = await branch.collections.users.find({
  role: 'admin'
});

// Run aggregation pipeline
const stats = await branch.collections.orders.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

console.log('Found', adminUsers.length, 'admin users');`,
    description: 'Execute queries programmatically',
    output: '🔍 Query executed\n📊 Found 12 admin users\n⚡ Response time: 28ms\n📈 Usage tracked',
    language: 'javascript'
  },
  {
    id: 'data_operations',
    filename: 'crud-operations.js',
    code: `// Insert new user
const newUser = await branch.collections.users.insertOne({
  name: 'Alice Johnson',
  email: 'alice@company.com',
  role: 'admin',
  createdAt: new Date()
});

// Update user permissions
await branch.collections.users.updateOne(
  { _id: newUser.insertedId },
  { $set: { permissions: ['read', 'write', 'admin'] } }
);`,
    description: 'Perform CRUD operations through SDK',
    output: '📝 Document inserted\n🆔 ID: 507f1f77bcf86cd799439011\n🔄 Change stream captured\n💾 Automatically backed up',
    language: 'javascript'
  },
  {
    id: 'deployment',
    filename: 'deploy.js',
    code: `// Deploy to staging environment
const deployment = await project.deploy({
  branch: 'feature/api-v2',
  environment: 'staging',
  config: {
    instances: 2,
    healthCheck: '/api/health'
  }
});

// Monitor deployment status
console.log('Deployment status:', deployment.status);`,
    description: 'Deploy branch to staging environment',
    output: '🚀 Deployment initiated\n🌐 Staging URL: https://staging-my-app.argon.dev\n✅ Health checks passed\n📱 Team notified',
    language: 'javascript'
  }
];

interface IDEDemoProps {
  onStepChange?: (step: number, total: number) => void;
}

export default function IDEDemo({ onStepChange }: IDEDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const step = sdkSteps[currentStep];

  useEffect(() => {
    onStepChange?.(currentStep, sdkSteps.length);
  }, [currentStep, onStepChange]);

  const runCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    
    // Simulate code execution
    setTimeout(() => {
      setShowOutput(true);
      setIsRunning(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < sdkSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowOutput(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowOutput(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setShowOutput(false);
    setIsRunning(false);
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'javascript': return '🟨';
      case 'typescript': return '🔷';
      case 'bash': return '💻';
      default: return '📄';
    }
  };

  return (
    <div className="lg:col-span-2">
      {step.language === 'bash' ? (
        // Terminal interface for bash commands
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-gray-300 text-sm">Terminal</span>
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto font-mono text-sm">
            <div className="text-green-400">
              $ {step.code}
            </div>
            {showOutput && (
              <div className="mt-2 text-gray-300 whitespace-pre-line">
                {step.output}
              </div>
            )}
          </div>
        </div>
      ) : (
        // IDE interface for code
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {/* IDE Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getLanguageIcon(step.language)}</span>
                <span className="text-gray-300 text-sm">{step.filename}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Argon SDK</span>
            </div>
          </div>

          {/* File Tabs */}
          <div className="bg-gray-750 border-b border-gray-600">
            <div className="flex">
              <div className="px-4 py-2 bg-gray-700 text-gray-300 text-sm border-r border-gray-600 flex items-center space-x-2">
                <span>{getLanguageIcon(step.language)}</span>
                <span>{step.filename}</span>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
              <pre className="text-gray-300">
                <code className="language-javascript">
                  {step.code}
                </code>
              </pre>
            </div>
            
            {/* Line numbers */}
            <div className="absolute left-0 top-0 p-4 text-gray-500 text-sm font-mono pointer-events-none">
              {step.code.split('\n').map((_, index) => (
                <div key={index} className="leading-5">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Output Panel */}
          {showOutput && (
            <div className="border-t border-gray-600">
              <div className="bg-gray-800 px-4 py-2">
                <span className="text-gray-300 text-sm">Output</span>
              </div>
              <div className="p-4 bg-gray-850 font-mono text-sm text-gray-300 whitespace-pre-line">
                {step.output}
              </div>
            </div>
          )}
        </div>
      )}

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
            onClick={runCode}
            disabled={isRunning}
            className="px-6 py-2 bg-brand-primary text-brand-dark rounded hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {isRunning ? 'Running...' : step.language === 'bash' ? '▶ Run Command' : '▶ Run Code'}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === sdkSteps.length - 1 || !showOutput}
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

export { sdkSteps };