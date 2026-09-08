import CodeBlock from "../components/CodeBlock";
import { ActionLink } from "../components/Funnel";
import { product } from "../product";

export const metadata = {
  title: "Connect Your AI Agent to Argon",
  description:
    "Connect Claude or Cursor through MCP, use the Python and LangGraph adapter, or create MongoDB sandboxes through the REST API.",
  alternates: { canonical: "/agents" },
};

const integrations = [
  {
    href: "#mcp",
    title: "Claude / Cursor",
    detail: "Give your coding agent Argon tools through MCP.",
  },
  {
    href: "#python",
    title: "Python / LangGraph",
    detail: "Add a branch to your agent run or checkpoint store.",
  },
  {
    href: "#rest",
    title: "REST API",
    detail: "Create sandboxes from any language or HTTP client.",
  },
];

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="kicker mb-4">For AI agents</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Connect your agent. Give each run a branch.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Use Argon to set up a sandbox and review its changes. Your agent reads
        and writes the data with an ordinary MongoDB driver.
      </p>
      <nav
        aria-label="Choose an agent integration"
        className="mt-8 divide-y divide-brand-edge border-y border-brand-edge"
      >
        {integrations.map(({ href, title, detail }) => (
          <a
            key={href}
            href={href}
            className="group grid min-h-20 items-center gap-2 py-5 sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:gap-6"
          >
            <span className="font-medium text-brand-primary group-hover:text-brand-text">
              {title}
            </span>
            <span className="text-sm leading-6 text-brand-muted">{detail}</span>
            <span
              aria-hidden="true"
              className="hidden font-mono text-brand-muted sm:block"
            >
              ↓
            </span>
          </a>
        ))}
      </nav>
      <p className="mt-5 max-w-3xl text-sm leading-7">
        These examples connect to your own local deployment. First{" "}
        <ActionLink
          href={product.quickstart}
          event="quickstart_opened"
          className="prose-link"
        >
          Start locally
        </ActionLink>{" "}
        with MongoDB and the Argon CLI. To explore the review workflow with
        sample data,{" "}
        <ActionLink
          href={product.demo}
          event="demo_opened"
          className="prose-link"
        >
          Try live demo
        </ActionLink>
        .
      </p>

      <section id="mcp" className="border-b border-brand-edge py-12">
        <div className="mb-7 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-10">
          <p className="font-mono text-sm text-brand-primary">MCP</p>
          <div>
            <h2 className="mt-3 text-2xl font-medium sm:mt-0">
              Claude and Cursor
            </h2>
            <p className="mt-3 max-w-2xl leading-7">
              The client starts <code>argon mcp</code> as a local process. It
              manages capture and sandbox expiry while it runs; a separate
              console process is optional.
            </p>
          </div>
        </div>
        <div className="space-y-5 text-sm leading-7 sm:ml-[15.5rem]">
          <p>
            After the{" "}
            <a className="prose-link" href="/quickstart#mongodb">
              local MongoDB setup
            </a>
            , create a project once from a terminal:
          </p>
          <CodeBlock
            label="Create the MCP example project"
            language="bash"
            code={`export MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0'
argon projects create agent-lab`}
          />
          <h3 className="pt-2 text-lg font-medium">Claude Code</h3>
          <CodeBlock
            label="Register Argon in Claude Code"
            language="bash"
            code={`claude mcp add --transport stdio \\
  --env MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0' \\
  argon -- argon mcp`}
          />
          <p>
            Run <code>/mcp</code> in Claude Code to check the connection.{" "}
            <a
              className="prose-link"
              href="https://code.claude.com/docs/en/mcp"
            >
              Claude Code setup reference
            </a>
          </p>
          <h3 className="pt-2 text-lg font-medium">Cursor</h3>
          <p>
            Add this server to <code>.cursor/mcp.json</code> in your project.
            Merge the <code>argon</code> entry into any existing{" "}
            <code>mcpServers</code> object.
          </p>
          <CodeBlock
            label="Cursor · .cursor/mcp.json"
            language="json"
            code={`{
  "mcpServers": {
    "argon": {
      "type": "stdio",
      "command": "argon",
      "args": ["mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/?replicaSet=rs0"
      }
    }
  }
}`}
          />
          <p>
            Enable the server in Cursor&apos;s MCP settings. If the app cannot
            find <code>argon</code>, use the full executable path printed by{" "}
            <code>command -v argon</code>.{" "}
            <a className="prose-link" href="https://cursor.com/docs/mcp">
              Cursor setup reference
            </a>
          </p>
          <div className="border-l-2 border-brand-primary pl-4">
            <p className="font-medium text-brand-text">Check the connection</p>
            <p className="mt-2">
              Ask: &ldquo;List the branches in the agent-lab project, then
              create a 30-minute sandbox. Show me its branch name.&rdquo; You
              should see <code>main</code> and a new sandbox. The tools include{" "}
              <code>argon_sandbox_create</code>, <code>argon_diff</code> and{" "}
              <code>argon_merge_preview</code>.
            </p>
          </div>
          <p>
            Give the agent the sandbox connection for data writes. Keep applying
            a merge as an explicit review step in your workflow.
          </p>
        </div>
      </section>

      <section id="python" className="border-b border-brand-edge py-12">
        <div className="mb-7 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-10">
          <p className="font-mono text-sm text-brand-primary">Python</p>
          <div>
            <h2 className="mt-3 text-2xl font-medium sm:mt-0">
              A sandbox for your agent run
            </h2>
            <p className="mt-3 max-w-2xl leading-7">
              The Python client calls your local API on port 1818. Keep{" "}
              <a className="prose-link" href="/quickstart#console">
                the console running
              </a>{" "}
              before trying this example.
            </p>
          </div>
        </div>
        <div className="space-y-5 text-sm leading-7 sm:ml-[15.5rem]">
          <p>
            Use Python 3.10+ and Git. This installs SDK {product.sdkVersion}{" "}
            from its release tag.
          </p>
          <CodeBlock
            label="Create a Python environment"
            language="bash"
            code={`python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install \\
  "argon-agents @ git+https://github.com/argon-lab/argon-agents.git@v${product.sdkVersion}"`}
          />
          <p>
            Save this as <code>agent_run.py</code> and run{" "}
            <code>python agent_run.py</code>. Each run creates a fresh sandbox.
          </p>
          <CodeBlock
            label="agent_run.py"
            language="python"
            code={`import json
from argon_agents import ArgonClient

argon = ArgonClient("http://127.0.0.1:1818")
argon.get_or_create_project("agent-lab")
run = argon.create_sandbox("agent-lab", ttl_minutes=30)
db = run.pymongo_database()
db.create_collection(
    "orders", changeStreamPreAndPostImages={"enabled": True}
)
db.orders.insert_one({"_id": "order-1", "price": 49})
db.orders.update_one({"_id": "order-1"}, {"$set": {"price": 44}})

print("Branch:", run.branch)
print(json.dumps(run.diff(), indent=2))
plan = argon.merge_preview("agent-lab", run.branch)
print("Review this plan:", plan["id"])
# Inspect the plan in the console before applying it.`}
          />
          <p>
            <span className="text-brand-text">Expected:</span> a branch name, an{" "}
            <code>orders</code> diff containing price 44, and a merge plan ID.
            The proposal stays on its branch until you apply a reviewed merge.
            The sandbox expires after 30 minutes while the server runs.
          </p>
          <details className="border-y border-brand-edge py-3">
            <summary className="min-h-11 cursor-pointer py-2 text-lg font-medium text-brand-primary">
              Use it with LangGraph
            </summary>
            <div className="mt-3 space-y-5 pb-2">
              <p>Add the LangGraph extra to the same virtual environment:</p>
              <CodeBlock
                label="Install the LangGraph adapter"
                language="bash"
                code={`python3 -m pip install \\
  "argon-agents[langgraph] @ git+https://github.com/argon-lab/argon-agents.git@v${product.sdkVersion}"`}
              />
              <p>
                In an existing LangGraph application, replace its checkpointer
                when you compile the graph:
              </p>
              <CodeBlock
                label="Connect your existing LangGraph builder"
                language="python"
                code={`from argon_agents import ArgonClient, ArgonCheckpointSaver

argon = ArgonClient("http://127.0.0.1:1818")
argon.get_or_create_project("agent-memory")
saver = ArgonCheckpointSaver.from_sandbox(
    argon, "agent-memory", ttl_minutes=30
)
graph = builder.compile(checkpointer=saver)
# Invoke your graph with a configurable thread_id as usual.`}
              />
              <p>
                The graph&apos;s checkpoints now live on that sandbox. LangGraph
                rewinds steps within a thread; Argon can fork the whole
                checkpoint store for another run.{" "}
                <a
                  className="prose-link"
                  href={`https://github.com/argon-lab/argon-agents/tree/v${product.sdkVersion}#langgraph`}
                >
                  Read the adapter reference
                </a>
              </p>
            </div>
          </details>
          <a
            className="prose-link inline-flex min-h-11 items-center"
            href="/quickstart#review"
          >
            Run the complete two-agent review and undo example
          </a>
        </div>
      </section>

      <section id="rest" className="border-b border-brand-edge py-12">
        <div className="mb-7 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-10">
          <p className="font-mono text-sm text-brand-primary">REST API</p>
          <div>
            <h2 className="mt-3 text-2xl font-medium sm:mt-0">
              Use your own language
            </h2>
            <p className="mt-3 max-w-2xl leading-7">
              HTTP manages projects and sandboxes; the returned MongoDB
              connection handles data reads and writes. Start{" "}
              <a className="prose-link" href="/quickstart#console">
                the local console
              </a>{" "}
              first.
            </p>
          </div>
        </div>
        <div className="space-y-5 text-sm leading-7 sm:ml-[15.5rem]">
          <p>Create this example project once:</p>
          <CodeBlock
            label="Create a project over REST"
            language="bash"
            code={`curl --fail-with-body -sS http://127.0.0.1:1818/api/v1/projects \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"rest-agent"}'`}
          />
          <p>Then create a sandbox for a run:</p>
          <CodeBlock
            label="Create a sandbox over REST"
            language="bash"
            code={`curl --fail-with-body -sS \\
  http://127.0.0.1:1818/api/v1/projects/rest-agent/sandboxes \\
  -H 'Content-Type: application/json' \\
  -d '{"ttl_minutes":30,"actor":"agent:rest-example"}'`}
          />
          <p>
            <span className="text-brand-text">Expected:</span> JSON with{" "}
            <code>branch</code>, <code>connection_string</code> and{" "}
            <code>expires_at</code>. Pass that connection string to your MongoDB
            driver. If the project already exists, skip the first request.
          </p>
          <p>
            For a protected deployment, add{" "}
            <code>-H "Authorization: Bearer $ARGON_API_TOKEN"</code> to your
            requests. The public demo does not return native database
            connections.
          </p>
          <a
            className="prose-link inline-flex min-h-11 items-center"
            href={`https://github.com/argon-lab/argon/blob/v${product.version}/docs/AGENTS.md#rest-control-plane`}
          >
            REST reference: diff, merge, history and pins
          </a>
        </div>
      </section>

      <p className="mt-8 max-w-3xl text-sm leading-7 text-brand-muted">
        Use a separate branch per agent run. New collections need exact change
        images enabled before updates, as in the Python example. Historical
        queries depend on retained data; pins keep named starting states. See{" "}
        <a className="prose-link" href="/features#capabilities">
          the operating limits
        </a>{" "}
        for capture, retention and access controls.
      </p>
    </div>
  );
}
