'use client';

import { useState, useEffect } from 'react';

interface ConsoleStep {
  id: string;
  title: string;
  description: string;
  ui: 'login' | 'dashboard' | 'integrations' | 'branches' | 'query' | 'team' | 'compare';
  metrics: {
    time: string;
    action: string;
  };
}

const consoleSteps: ConsoleStep[] = [
  {
    id: 'login',
    title: 'Sign in with Google OAuth',
    description: 'Access the cloud console with secure authentication',
    ui: 'login',
    metrics: { time: 'instant', action: 'OAuth flow' }
  },
  {
    id: 'dashboard',
    title: 'View Projects Dashboard',
    description: 'See all projects and recent activity in visual dashboard',
    ui: 'dashboard', 
    metrics: { time: '0.8s', action: 'Dashboard load' }
  },
  {
    id: 'integrations',
    title: 'Connect MongoDB Atlas',
    description: 'Add secure MongoDB Atlas integration with encrypted credentials',
    ui: 'integrations',
    metrics: { time: '1.2s', action: 'Atlas connection' }
  },
  {
    id: 'branches',
    title: 'Create Feature Branch',
    description: 'Use visual interface to create isolated development branch',
    ui: 'branches',
    metrics: { time: '0.9s', action: 'Branch creation' }
  },
  {
    id: 'query',
    title: 'Visual Query Editor',
    description: 'Execute MongoDB queries with syntax highlighting and results',
    ui: 'query',
    metrics: { time: '0.3s', action: 'Query execution' }
  },
  {
    id: 'team',
    title: 'Team Collaboration',
    description: 'Invite team members and manage permissions',
    ui: 'team',
    metrics: { time: '0.5s', action: 'Team management' }
  },
  {
    id: 'compare',
    title: 'Branch Comparison',
    description: 'Visual diff between branches showing document changes',
    ui: 'compare',
    metrics: { time: '0.7s', action: 'Branch diff' }
  }
];

interface ConsoleDemoProps {
  onStepChange?: (step: number, total: number) => void;
}

export default function ConsoleDemo({ onStepChange }: ConsoleDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const step = consoleSteps[currentStep];

  useEffect(() => {
    onStepChange?.(currentStep, consoleSteps.length);
  }, [currentStep, onStepChange]);

  const performAction = () => {
    setIsLoading(true);
    setShowContent(false);
    
    setTimeout(() => {
      setShowContent(true);
      setIsLoading(false);
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < consoleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowContent(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowContent(true);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setShowContent(true);
    setIsLoading(false);
  };

  const renderUI = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          <span className="ml-3 text-brand-text">Loading...</span>
        </div>
      );
    }

    switch (step.ui) {
      case 'login':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-dark to-brand-surface">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">Argon Console</div>
                <div className="text-gray-600">Sign in to your account</div>
              </div>
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600">
                <span>🔐</span>
                <span>Continue with Google</span>
              </button>
              <div className="text-xs text-gray-500 text-center mt-4">
                Secure OAuth 2.0 authentication
              </div>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="p-6 bg-brand-dark">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-brand-text">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-brand-text-darker">dev@company.com</span>
                <div className="w-8 h-8 bg-brand-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-brand-surface p-4 rounded-lg">
                <div className="text-brand-primary text-sm">Projects</div>
                <div className="text-2xl font-bold text-brand-text">5</div>
              </div>
              <div className="bg-brand-surface p-4 rounded-lg">
                <div className="text-brand-primary text-sm">Active Branches</div>
                <div className="text-2xl font-bold text-brand-text">12</div>
              </div>
              <div className="bg-brand-surface p-4 rounded-lg">
                <div className="text-brand-primary text-sm">Team Members</div>
                <div className="text-2xl font-bold text-brand-text">8</div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-lg p-4">
              <h2 className="text-lg font-semibold text-brand-text mb-4">Recent Projects</h2>
              <div className="space-y-3">
                {['E-commerce API', 'Analytics Dashboard', 'User Management'].map(project => (
                  <div key={project} className="flex items-center justify-between p-3 bg-brand-dark rounded">
                    <span className="text-brand-text">{project}</span>
                    <span className="text-sm text-brand-text-darker">2 branches</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="p-6 bg-brand-dark">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Integrations</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-surface p-6 rounded-lg border-2 border-brand-primary">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-text">MongoDB Atlas</h3>
                    <p className="text-sm text-brand-text-darker">Connected</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-darker">Cluster:</span>
                    <span className="text-brand-text">production-cluster-0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-darker">Databases:</span>
                    <span className="text-brand-text">3 detected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-darker">Status:</span>
                    <span className="text-green-400">✅ Connected</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-surface p-6 rounded-lg opacity-50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">S3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-text">AWS S3</h3>
                    <p className="text-sm text-brand-text-darker">Available</p>
                  </div>
                </div>
                <button className="text-brand-primary text-sm">+ Connect S3</button>
              </div>
            </div>
          </div>
        );

      case 'branches':
        return (
          <div className="p-6 bg-brand-dark">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-brand-text">Branches</h1>
              <button className="bg-brand-primary text-brand-dark px-4 py-2 rounded-lg">+ Create Branch</button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-brand-surface p-4 rounded-lg border-l-4 border-brand-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">main</h3>
                    <p className="text-sm text-brand-text-darker">Default branch • Last updated 2h ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Active</span>
                    <button className="text-brand-primary text-sm">Switch</button>
                  </div>
                </div>
              </div>

              <div className="bg-brand-surface p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">feature/new-products</h3>
                    <p className="text-sm text-brand-text-darker">From main • Created 1h ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Development</span>
                    <button className="text-brand-primary text-sm">Compare</button>
                  </div>
                </div>
              </div>

              <div className="bg-brand-surface p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">feature/api-v2</h3>
                    <p className="text-sm text-brand-text-darker">From main • Created 3h ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Ready</span>
                    <button className="text-brand-primary text-sm">Merge</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'query':
        return (
          <div className="p-6 bg-brand-dark">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Query Editor</h1>
            
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-gray-300 text-sm">Branch: feature/new-products</span>
                <button className="bg-brand-primary text-brand-dark px-3 py-1 rounded text-sm">▶ Execute</button>
              </div>
              
              <div className="p-4 font-mono text-sm">
                <div className="text-gray-300">
                  <span className="text-blue-400">db.products.find</span>
                  <span className="text-yellow-400">(</span>
                  <span className="text-green-400">{"{ category: 'electronics' }"}</span>
                  <span className="text-yellow-400">)</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 p-4 bg-gray-850">
                <div className="text-brand-primary text-sm mb-2">Results (247 documents)</div>
                <div className="space-y-2 text-xs text-gray-400">
                  <div>⚡ Execution time: 23ms</div>
                  <div>📊 Scanned: 1,250 documents</div>
                  <div>🎯 Returned: 247 documents</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="p-6 bg-brand-dark">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-brand-text">Team Management</h1>
              <button className="bg-brand-primary text-brand-dark px-4 py-2 rounded-lg">+ Invite Member</button>
            </div>
            
            <div className="bg-brand-surface rounded-lg p-4">
              <h2 className="text-lg font-semibold text-brand-text mb-4">Team Members</h2>
              <div className="space-y-3">
                {[
                  { name: 'John Doe', email: 'john@company.com', role: 'Owner', avatar: '🧑‍💻' },
                  { name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Admin', avatar: '👩‍💻' },
                  { name: 'Mike Chen', email: 'mike@company.com', role: 'Editor', avatar: '👨‍💻' },
                  { name: 'Lisa Garcia', email: 'lisa@company.com', role: 'Viewer', avatar: '👩‍🔬' }
                ].map(member => (
                  <div key={member.email} className="flex items-center justify-between p-3 bg-brand-dark rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{member.avatar}</span>
                      <div>
                        <div className="text-brand-text font-medium">{member.name}</div>
                        <div className="text-brand-text-darker text-sm">{member.email}</div>
                      </div>
                    </div>
                    <span className="bg-brand-primary text-brand-dark px-2 py-1 rounded text-sm">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'compare':
        return (
          <div className="p-6 bg-brand-dark">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Branch Comparison</h1>
            
            <div className="bg-brand-surface rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-brand-text">Comparing: <span className="text-brand-primary">main</span> vs <span className="text-brand-primary">feature/new-products</span></div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Merge Branch</button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-100 text-green-800 p-3 rounded">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm">Added</div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm">Modified</div>
                </div>
                <div className="bg-red-100 text-red-800 p-3 rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm">Conflicts</div>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface rounded-lg p-4">
              <h3 className="text-brand-text font-semibold mb-3">Changes by Collection</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-brand-dark rounded">
                  <span className="text-brand-text">products</span>
                  <span className="text-green-400">+15 documents</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-brand-dark rounded">
                  <span className="text-brand-text">categories</span>
                  <span className="text-yellow-400">~3 modified</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-brand-dark rounded">
                  <span className="text-brand-text">inventory</span>
                  <span className="text-gray-400">No changes</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lg:col-span-2">
      {/* Browser Window */}
      <div className="bg-gray-200 rounded-lg shadow-xl overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-300 px-4 py-2 flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white rounded px-3 py-1 text-sm text-gray-600">
              🔒 console.argonlabs.tech
            </div>
          </div>
        </div>

        {/* Browser Content */}
        <div className="h-80 overflow-y-auto">
          {showContent && renderUI()}
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
            onClick={performAction}
            disabled={isLoading}
            className="px-6 py-2 bg-brand-primary text-brand-dark rounded hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : '🖱️ ' + step.title}
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === consoleSteps.length - 1}
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

export { consoleSteps };