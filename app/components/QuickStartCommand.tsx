'use client';

import { useState } from 'react';

const installMethods = [
  { label: 'brew', command: 'brew install argon-lab/tap/argonctl' },
  { label: 'npm', command: 'npm install -g argonctl' },
  { label: 'pip', command: 'pip install argon-mongodb' },
];

export default function QuickStartCommand() {
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState(0);

  const current = installMethods[selected];

  const handleCopy = () => {
    navigator.clipboard
      .writeText(current.command)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {});
  };

  return (
    <div className="w-full max-w-xl border border-brand-edge bg-brand-surface font-mono text-sm">
      <div className="flex border-b border-brand-edge">
        {installMethods.map((method, index) => (
          <button
            key={method.label}
            onClick={() => {
              setSelected(index);
              setCopied(false);
            }}
            className={`px-4 py-2 text-xs transition-colors ${
              selected === index
                ? 'bg-brand-dark text-brand-primary'
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <pre className="overflow-x-auto">
          <code className="select-all">
            <span className="text-brand-muted">$ </span>
            <span className="text-brand-text">{current.command}</span>
          </code>
        </pre>
        <button
          title="Copy to clipboard"
          onClick={handleCopy}
          className="shrink-0 border border-brand-edge px-2 py-1 text-xs text-brand-muted transition-colors hover:border-brand-muted hover:text-brand-text"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </div>
  );
}
