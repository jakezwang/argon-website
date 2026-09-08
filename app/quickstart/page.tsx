import type { ReactNode } from "react";
import CodeBlock from "../components/CodeBlock";
import QuickStartCommand from "../components/QuickStartCommand";
import { product } from "../product";

export const metadata = {
  title: "Local quickstart",
  description:
    "Install the Argon CLI, start local MongoDB, then run two agent proposals through a real branch, review, merge and undo workflow.",
  alternates: { canonical: "/quickstart" },
};

function Step({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-brand-edge py-10 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10"
    >
      <h2 className="mb-6 text-xl font-medium leading-7 text-brand-text sm:mb-0">
        <span className="mb-2 block font-mono text-xs text-brand-muted">
          {number}
        </span>
        {title}
      </h2>
      <div className="min-w-0 space-y-5 text-sm leading-7">{children}</div>
    </section>
  );
}

export default function Quickstart() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="kicker mb-4">Local quickstart</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-brand-text sm:text-5xl">
        Run your first agent review
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Start with a $49 order. Let two agents try different prices in separate
        branches, review the changes, then verify a merge and undo. The example
        uses real MongoDB writes and needs no model API key.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted">
        You need Docker, npm or Homebrew, and Python 3.10+. The commands below
        use a macOS or Linux shell and a disposable local database.
      </p>
      <nav
        aria-label="Quickstart steps"
        className="my-8 flex flex-wrap gap-x-6"
      >
        {[
          ["#install", "Install"],
          ["#mongodb", "MongoDB"],
          ["#console", "Console"],
          ["#review", "Run the example"],
        ].map(([href, label]) => (
          <a
            key={href}
            className="prose-link inline-flex min-h-11 items-center text-sm"
            href={href}
          >
            {label}
          </a>
        ))}
      </nav>

      <Step id="install" number="01" title="Install the CLI">
        <p>
          Already installed Argon? Check the version below and continue to
          MongoDB.
        </p>
        <QuickStartCommand showSdk={false} />
        <CodeBlock
          label="Check the installed CLI"
          language="bash"
          code="argon --version"
        />
        <p>
          <span className="text-brand-text">Expected:</span> version{" "}
          {product.version}. The package is named <code>argonctl</code>; the
          command you run is <code>argon</code>.
        </p>
        <details id="source" className="border-t border-brand-edge pt-4">
          <summary className="min-h-11 cursor-pointer py-2 text-brand-primary">
            Build from source instead
          </summary>
          <p className="mb-4 mt-2">
            For contributors. Requires Git and Go 1.26.6+. This puts the built
            CLI on PATH for the commands below.
          </p>
          <CodeBlock
            label="Optional source build"
            language="bash"
            code={`git clone --branch v${product.version} https://github.com/argon-lab/argon.git
cd argon
(cd cli && go build -o ../bin/argon .)
export PATH="$PWD/bin:$PATH"`}
          />
        </details>
      </Step>

      <Step id="mongodb" number="02" title="Start MongoDB">
        <p>
          In terminal A, start a local MongoDB 7 replica set. Docker must be
          running; port 27017 must be available.
        </p>
        <CodeBlock
          label="Terminal A · Start MongoDB"
          language="bash"
          code={`docker run -d --name argon-mongo \\
  -p 127.0.0.1:27017:27017 \\
  mongo:7 --replSet rs0`}
        />
        <p>Initialize the replica set once the container is running.</p>
        <CodeBlock
          label="Terminal A · Initialize the replica set"
          language="bash"
          code={`docker exec argon-mongo mongosh --quiet --eval \\
  'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'`}
        />
        <p>
          <span className="text-brand-text">Expected:</span> the response
          includes <code>ok: 1</code>. If MongoDB is still starting and refuses
          the connection, wait a few seconds and retry.
        </p>
        <details className="border-t border-brand-edge pt-4">
          <summary className="min-h-11 cursor-pointer py-2 text-brand-primary">
            Already have this local container?
          </summary>
          <p className="mt-2">
            Use <code>docker start argon-mongo</code> to restart it. An already
            initialized replica set does not need <code>rs.initiate</code>{" "}
            again. These commands are for the tutorial database; use your own
            connection settings for an existing deployment.
          </p>
        </details>
      </Step>

      <Step id="console" number="03" title="Open the console">
        <p>
          Still in terminal A, point Argon at the replica set and check that it
          can capture document changes.
        </p>
        <CodeBlock
          label="Terminal A · Check MongoDB readiness"
          language="bash"
          code={`export MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0'
argon doctor`}
        />
        <p>
          <span className="text-brand-text">Expected:</span> all checks show{" "}
          <code>PASS</code>. If the replica set has no primary yet, wait for its
          election and run <code>argon doctor</code> again.
        </p>
        <CodeBlock
          label="Terminal A · Keep the console running"
          language="bash"
          code="argon console --no-browser"
        />
        <p>
          Open{" "}
          <a className="prose-link" href="http://127.0.0.1:1818">
            your local console on port 1818
          </a>
          . Keep this terminal running while agents work: the process manages
          capture and sandbox expiry.
        </p>
      </Step>

      <Step id="review" number="04" title="Run the example">
        <p>
          Open terminal B. Download the matching Python SDK release and its
          example, then install it in a virtual environment. Git is required for
          this step.
        </p>
        <CodeBlock
          label="Terminal B · Get the example"
          language="bash"
          code={`git clone --branch v${product.sdkVersion} https://github.com/argon-lab/argon-agents.git
cd argon-agents`}
        />
        <CodeBlock
          label="Terminal B · Install the Python SDK"
          language="bash"
          code={`python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -e .`}
        />
        <CodeBlock
          label="Terminal B · Run the two-agent review"
          language="bash"
          code={`ARGON_API_URL=http://127.0.0.1:1818 \\
  python examples/two_agent_review.py`}
        />
        <div className="border-l-2 border-brand-primary pl-4">
          <p className="font-medium text-brand-text">
            A successful run prints:
          </p>
          <dl className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 font-mono text-sm">
            <dt className="text-brand-muted">reviewed_price</dt>
            <dd>44</dd>
            <dt className="text-brand-muted">conflicts</dt>
            <dd>1</dd>
            <dt className="text-brand-muted">restored_price</dt>
            <dd>49</dd>
          </dl>
        </div>
        <p>
          The assertions verify identical pinned input, an accepted $44
          proposal, a competing $1 conflict, and the restored $49 order. Find
          the printed project in the local console to inspect its history.
        </p>
        <p>
          If the API connection is refused, check that terminal A is still
          running. An authenticated server also needs{" "}
          <code>ARGON_API_TOKEN</code> set in terminal B.
        </p>
        <a
          className="prose-link inline-flex min-h-11 items-center"
          href={product.example}
        >
          Read the complete example
        </a>
      </Step>

      <section className="border-t border-brand-edge pt-10">
        <h2 className="text-2xl font-medium">Connect your own agent</h2>
        <p className="mt-3 max-w-2xl leading-7">
          Your local server is ready. Choose the interface your agent already
          uses.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/agents#mcp" className="btn-quiet min-h-11">
            Claude / Cursor
          </a>
          <a href="/agents#python" className="btn-quiet min-h-11">
            Python / LangGraph
          </a>
          <a href="/agents#rest" className="btn-quiet min-h-11">
            REST API
          </a>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-brand-muted">
          History needs healthy capture and retained data. CLI-only workflows
          also need a running watch process and scheduled cleanup. Read the{" "}
          <a className="prose-link" href="/features#capabilities">
            operating limits
          </a>{" "}
          or the{" "}
          <a className="prose-link" href={product.guide}>
            complete setup guide
          </a>{" "}
          before connecting a real workload.
        </p>
      </section>
    </div>
  );
}
