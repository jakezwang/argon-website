'use client';

import { useState } from 'react';

export default function QuickStartCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'pip install argonctl';

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="max-w-md bg-brand-surface p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <pre className="text-left text-brand-text overflow-x-auto">
          <code className="text-base select-all">$ {command}</code>
        </pre>
        <button
          title="Copy to clipboard"
          className="p-1.5 text-brand-text-darker hover:text-brand-primary focus:outline-none relative"
          onClick={handleCopy}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 2a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 2h6v10H7V4zm5 10a1 1 0 11-2 0 1 1 0 012 0z" />
              <path d="M3 6a2 2 0 012-2h6v2H5a2 2 0 00-2 2v10a2 2 0 002 2h6v-2H5V6z" />
            </svg>
          )}
        </button>
      </div>
      {copied && <span className="text-xs text-green-500 absolute -mt-4 ml-28">Copied!</span>}
    </div>
  );
}
