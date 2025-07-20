'use client';

export default function GitComparison() {
  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-brand-text">
            You Already Know How This Works
          </h2>
          <p className="mt-4 text-lg text-brand-text-darker max-w-3xl mx-auto">
            If you can use Git, you can use Argon. Same familiar workflow, 
            <strong className="text-brand-primary"> now for your MongoDB database</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Git Side */}
          <div className="bg-brand-surface p-8 rounded-xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">🌟</div>
              <h3 className="text-xl font-semibold text-brand-text">Git (for code)</h3>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-green-400">$</span> <span className="text-brand-text">git branch feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Create isolated workspace</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-green-400">$</span> <span className="text-brand-text">git checkout feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Switch to branch</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-green-400">$</span> <span className="text-brand-text">git commit -m "Add feature"</span>
                <div className="text-brand-text-darker text-xs mt-1">Save changes</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-green-400">$</span> <span className="text-brand-text">git merge feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Integrate back to main</div>
              </div>
            </div>
          </div>

          {/* Argon Side */}
          <div className="bg-brand-surface p-8 rounded-xl shadow-xl">
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">🗄️</div>
              <h3 className="text-xl font-semibold text-brand-text">Argon (for data)</h3>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-blue-400">$</span> <span className="text-brand-text">argon branches create feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Create isolated database</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-blue-400">$</span> <span className="text-brand-text">mongosh feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Connect to branch</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-blue-400">$</span> <span className="text-brand-text">db.users.insertOne(&#123;...&#125;)</span>
                <div className="text-brand-text-darker text-xs mt-1">Make changes safely</div>
              </div>
              <div className="bg-brand-dark p-3 rounded">
                <span className="text-blue-400">$</span> <span className="text-brand-text">argon branches merge feature-x</span>
                <div className="text-brand-text-darker text-xs mt-1">Apply to production</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold text-brand-text mb-2">100% Safe</h4>
              <p className="text-brand-text-darker text-sm">Your production data is never touched during experiments</p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-brand-text mb-2">Instant</h4>
              <p className="text-brand-text-darker text-sm">Create branches in milliseconds, not minutes</p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-semibold text-brand-text mb-2">Team-Friendly</h4>
              <p className="text-brand-text-darker text-sm">Multiple developers, zero conflicts</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-lg text-brand-text-darker mb-6">
            Stop being afraid of your database. Start using it like Git.
          </p>
          <div className="space-x-4">
            <a
              href="#quick-start" 
              className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              Try Argon Now
            </a>
            <a
              href="/demo"
              className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-transform duration-150 hover:scale-105"
            >
              See It Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}