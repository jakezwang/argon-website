import { install, limits } from "../../product";
import cli from "../../cli-examples.json";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("disposable-mongodb-sandbox-for-ai-agents")!;

export const metadata = {
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: ["/og.png"],
  },
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: "article",
    siteName: "Argon",
    url: `https://argonlabs.tech/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    publishedTime: post.date,
    modifiedTime: post.updated,
  },
};

const faq = [
  {
    q: "Why can’t an AI agent just use the production database?",
    a: "Because the blast radius is your whole business. An agent that misreads an instruction can delete or corrupt live data, and you often cannot tell what it changed until later. A branch gives the agent a real database to work in while production stays untouched.",
  },
  {
    q: "How does an AI agent get its own database?",
    a: "With Argon, the agent (or your orchestration code) calls a single command or MCP tool to create a sandbox branch. It gets back an ordinary MongoDB connection string and reads and writes normally — no special SDK.",
  },
  {
    q: "What is an MCP server for MongoDB?",
    a: "Model Context Protocol (MCP) is a standard way to expose tools to AI agents. Argon ships 13 MCP tools for sandboxes, branch connections, diffs, merge plans, undo, snapshots, and pins. Document reads and writes use the returned MongoDB connection through a driver; retained-history queries use Argon’s CLI or REST API.",
  },
  {
    q: "How do I make agent evaluations reproducible?",
    a: "Use dataset pins: named references to captured document states. Fork each run from the same retained pin to control its starting document state. Matching input does not make agent outputs deterministic or guarantee identical physical database files.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        The fastest way to lose a database is to hand an AI agent a write
        connection to production. The agent is capable and confident, and it
        will occasionally do exactly the wrong thing at full speed. The fix is
        not to keep agents read-only forever — it is to give each one a{" "}
        <strong>separate database for experiments</strong>. The agent can modify
        that branch while you review which changes to apply to its parent.
        Physical copies use storage; scope credentials to the intended database.
      </p>
      <p>
        That is the branch-per-agent pattern, and{" "}
        <a href="https://github.com/argon-lab/argon">Argon</a> is built to make
        it a one-liner.
      </p>

      <h2>The branch-per-agent loop</h2>
      <ol>
        <li>
          <strong>Fork a branch.</strong> Create a sandbox off production (or
          off a pinned dataset), optionally with a time-to-live. REST/MCP manage
          expiry while running; standalone CLI use requires a scheduled sweep.
        </li>
        <li>
          <strong>Let the agent work.</strong> Hand it the branch’s connection
          string. It reads and writes with any MongoDB driver — no code changes,
          no awareness that it is in a branch.
        </li>
        <li>
          <strong>Review the diff.</strong> Compare the branch with its parent
          to find changed document keys, then inspect the proposed values in the
          stored merge plan before applying it.
        </li>
        <li>
          <strong>Merge or discard.</strong> Merge the good work back as a
          reviewed data PR — or throw the whole branch away. A merge is an
          explicit write to the parent; your application must decide who may
          approve it.
        </li>
      </ol>
      <p>
        Because a fully captured, retained write range can be reverted, you also
        get a safety net after the fact: if something slips through, you can{" "}
        <a href="/blog/mongodb-database-branching-explained">undo</a> one branch
        actor’s captured changes. Separate agents need separate branches; undo
        can refuse a range when required history or images are incomplete.
      </p>

      <h2>Wiring it up</h2>
      <p>
        Start with the <a href="/quickstart">local setup</a>. The MCP example
        also needs the project initialization on the{" "}
        <a href="/agents#mcp">agents page</a>. Argon exposes the loop through
        these interfaces:
      </p>

      <h3>Over MCP (Claude Code, Cursor, any MCP client)</h3>
      <pre>
        <code>{install.mcp}</code>
      </pre>
      <p>
        The agent gets 13 control tools over stdio, including sandbox creation,
        diff, merge, undo, snapshots, and pins. It uses a MongoDB driver with
        the returned connection for data reads and writes. See the{" "}
        <a href="/blog/mongodb-mcp-server-versioned-sandboxes">
          MCP tool boundaries
        </a>{" "}
        for the available interfaces.
      </p>

      <h3>From the CLI or CI</h3>
      <pre>
        <code>{`# Existing docs-review project; create a new agent-review sandbox
${cli.sandbox}
# Keep capture running before the agent writes
${cli.watchSandbox}
# In a scheduled job, clean up expired CLI sandboxes
${cli.sweep}`}</code>
      </pre>

      <h3>From Python (LangGraph, Mem0)</h3>
      <pre>
        <code>{install.langgraph}</code>
      </pre>
      <p>
        Install in a Python virtual environment; this uses the matching PyPI
        release. The package supplies a LangGraph checkpointer and a Mem0
        sandbox factory. Prepare exact images on new collections before updates.
      </p>

      <h2>Review MongoDB documents before merging</h2>
      <p>
        A reviewed merge here means reviewing changes to database documents. It
        is separate from a GitHub or GitLab code pull request. Give two agents
        separate branches from the same retained pin, compare their proposed
        changes, and inspect the merge plan before applying it. A conflicting
        edit needs a resolution decision; creating a sandbox does not approve
        its writes. Follow the{" "}
        <a href="/quickstart#review">two-agent review example</a> to inspect a
        conflict and the resulting document values. The{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          runnable MCP tutorial
        </a>{" "}
        retrieves a stored merge plan for content review and checks the parent
        after either applying or discarding the proposal.
      </p>

      <h2>Sandbox TTL versus MongoDB document TTL</h2>
      <p>
        MongoDB{" "}
        <a href="https://www.mongodb.com/docs/manual/core/index-ttl/">
          TTL indexes
        </a>{" "}
        delete expired documents from a collection in the background. They do
        not replace a job that discards an entire agent sandbox, and expiration
        does not guarantee immediate deletion.
      </p>
      <p>
        Argon sandbox TTL makes a branch eligible for cleanup. In Argon 2.1.3,
        the REST and MCP servers run a{" "}
        <a href="https://github.com/argon-lab/argon/blob/v2.1.3/pkg/walcli/services.go#L298-L329">
          sweep once per minute
        </a>{" "}
        while running. The first pass is after that interval, including after a
        restart. An expired sandbox can therefore remain present until a
        successful pass. These are cleanup timings, not an access deadline.
      </p>
      <p>
        With standalone CLI commands, schedule <code>argon sandbox sweep</code>{" "}
        for the project and inspect both <code>reaped</code> and{" "}
        <code>skipped</code> in its JSON output. A TTL value alone does not run
        the cleanup process. A branch with dependent children can be skipped;
        deletion errors can also delay cleanup. Finish any review or export
        before expiry, or remove the TTL with <code>argon sandbox keep</code>{" "}
        before the cleanup pass if you need to retain the branch.
      </p>

      <h3 id="ttl-experiment">Try expiry, shutdown, and restart locally</h3>
      <p>
        The <a href="/examples/mcp_ttl.py">TTL example</a> uses synthetic data,
        a three-second CLI TTL, and a six-second MCP TTL (
        <code>ttl_minutes: 0.1</code>). It waits for real elapsed time without
        changing the clock or expiry records. Download both Python files into
        the same directory, install Argon 2.1.3 and Python 3.12+ with PyMongo,
        and point the example at a disposable local MongoDB replica set. The{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          MCP tutorial prerequisites
        </a>{" "}
        cover that setup.
      </p>
      <pre>
        <code>{`curl -fSLO https://argonlabs.tech/examples/mcp_review.py
curl -fSLO https://argonlabs.tech/examples/mcp_ttl.py
export ARGON_TEST_MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0'
export ARGON_BIN=argon
python mcp_ttl.py --output-dir ttl-proof`}</code>
      </pre>
      <p>
        Allow about two and a half minutes and use a fresh output directory. The
        script starts and stops only its own MCP child process, keeps MongoDB
        running, and removes its fixture databases at exit. It checks:
      </p>
      <ol>
        <li>
          <strong>CLI only:</strong> the expired branch and its test document
          remain until an explicit sweep removes the branch and physical
          database.
        </li>
        <li>
          <strong>MCP running:</strong> the six-second TTL expires before the
          first periodic pass; that pass then removes the sandbox.
        </li>
        <li>
          <strong>MCP stopped and restarted:</strong> the test document remains
          after expiry while the process is stopped, and shortly after restart.
          The restarted process removes the old sandbox on its next periodic
          pass.
        </li>
      </ol>
      <p>
        The output directory contains real protocol messages, server logs, CLI
        results, and <code>verification.json</code> with measured timings. With
        the published Argon 2.1.3 binary and MongoDB 7.0.45, both managed
        removals were observed about 61 seconds after starting or restarting
        MCP. That observation is not a deletion deadline. This checks short TTL
        behavior; the one-hour example above is a configuration example, not a
        one-hour test result. Stop clients from writing before cleanup: TTL does
        not revoke their MongoDB credentials.
      </p>

      <h2>Reproducible evals with pins</h2>
      <p>
        Evaluations are only meaningful if every run starts from the same data.
        A <strong>dataset pin</strong> is an immutable, named state of the
        database; each eval run forks a fresh branch from the pin, so the input
        is identical for that retained pin. {limits.retention}
      </p>

      <h2>Why this matters now</h2>
      <p>
        Agents are moving from reading data to acting on it, and the database is
        where actions become permanent. Giving every agent its own branch turns
        an irreversible operation into a reviewable one — the same shift that
        pull requests brought to code. Production stops being the place agents
        experiment, and starts being the place their reviewed work lands when
        your application enforces that review decision.
      </p>
    </ArticleLayout>
  );
}
