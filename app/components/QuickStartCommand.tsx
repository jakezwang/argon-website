"use client";

import { useId, useState } from "react";
import { product } from "../product";
import CodeBlock from "./CodeBlock";

const installMethods = [
  {
    label: "npm",
    command: `npm install -g argonctl@${product.version}`,
    description: "Installs the argon CLI. Requires Node.js 18 or newer.",
    codeLabel: "Install the CLI with npm",
  },
  {
    label: "Homebrew",
    command: "brew install argon-lab/tap/argonctl",
    description: "Installs the argon CLI on macOS with Homebrew.",
    codeLabel: "Install the CLI with Homebrew",
  },
  {
    label: "Python SDK",
    command: `python3 -m pip install \\\n  "argon-agents[langgraph] @ git+https://github.com/argon-lab/argon-agents.git@v${product.sdkVersion}"`,
    description:
      "Installs the Python adapter from its release tag. Requires Python 3.10+, Git and a running Argon server.",
    codeLabel: "Install the Python SDK in a virtual environment",
  },
];

export default function QuickStartCommand({
  showSdk = true,
}: {
  showSdk?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const methods = showSdk ? installMethods : installMethods.slice(0, 2);
  const current = methods[selected] ?? methods[0];

  return (
    <div className="w-full min-w-0 max-w-xl">
      <div
        className="flex flex-wrap border border-b-0 border-brand-edge bg-brand-surface"
        role="group"
        aria-label="Installation method"
      >
        {methods.map((method, index) => (
          <button
            type="button"
            key={method.label}
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            aria-controls={id}
            className={`min-h-11 px-4 py-2 font-mono text-xs transition-colors ${
              selected === index
                ? "bg-brand-dark text-brand-primary shadow-[inset_0_-2px_0_0_currentColor]"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>
      <div id={id}>
        <CodeBlock
          key={current.label}
          code={current.command}
          label={current.codeLabel}
          language="bash"
        />
        <p className="mt-3 max-w-lg text-xs leading-5 text-brand-muted">
          {current.description}{" "}
          {selected === 2 && (
            <a className="prose-link" href="/agents#python">
              Python setup
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
