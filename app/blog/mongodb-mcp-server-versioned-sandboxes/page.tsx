import { install, limits, product } from "../../product";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("mongodb-mcp-server-versioned-sandboxes")!;

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
    q: "What is an MCP server for MongoDB?",
    a: "An MCP (Model Context Protocol) server exposes tools an AI agent can call. Argon’s 13 MCP tools manage sandboxes, branch connections, diffs, merge plans, undo, snapshots, and pins. Data reads and writes use the returned MongoDB connection; retained-history queries are available through Argon’s CLI and REST API.",
  },
  {
    q: "How is Argon’s MCP server different from a standard MongoDB MCP server?",
    a: "MongoDB’s MCP server provides database tools and supports read-only configuration against the deployment you choose. Argon adds a branch-and-review workflow: create a separate sandbox, use its MongoDB connection for data operations, then inspect a diff and explicitly apply a merge plan. Capture, retained history, and scoped credentials are still required.",
  },
  {
    q: "How do I add Argon to Claude Code or Cursor?",
    a: "Install the CLI, configure a MongoDB replica set and create a project using the local quickstart. Then use the Claude Code or Cursor configuration on the agents page, including the MONGODB_URI environment variable.",
  },
  {
    q: "Is it safe to let an AI agent write to MongoDB over MCP?",
    a: `${limits.isolation} ${limits.undo} ${limits.attribution}`,
  },
  {
    q: "How do I make agent runs reproducible?",
    a: "Use dataset pins — named references to captured document states that each run branches from. A retained pin gives runs the same starting document state; it does not make agent outputs deterministic or guarantee identical physical database files.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        The Model Context Protocol (MCP) lets an AI agent call tools — and
        increasingly, one of those tools is your database. The deployment,
        credentials, and enabled tools determine what the agent can change.{" "}
        <a href="https://github.com/argon-lab/argon">Argon</a> adds a separate
        branch database for experiments, with 13 MCP tools to manage sandboxes,
        connections, document diffs, merge plans, undo, snapshots, and pins.
      </p>

      <h2>A 30-second MCP refresher</h2>
      <p>
        MCP is an open standard for connecting AI agents to tools and data. An
        MCP server exposes a set of tools — functions the model can call — over
        a simple protocol, usually stdio. Clients like Claude Code, Cursor, or
        any MCP-compatible app connect to the server and let the model invoke
        those tools mid-conversation. Point an agent at a MongoDB MCP server and
        it can query — and often mutate — your database as it works.
      </p>

      <h2>The problem with a live MongoDB over MCP</h2>
      <p>
        A MongoDB MCP server can expose query and mutation tools against the
        database you configure. The{" "}
        <a href="https://github.com/mongodb-js/mongodb-mcp-server#manual-setup">
          official MongoDB MCP setup
        </a>{" "}
        includes a read-only option and can use a local or Atlas deployment. If
        you enable writes against production with broad credentials, an
        incorrect tool call can change production data. For experiments that
        need writes, choose a separate database and define how changes will be
        reviewed before adoption.
      </p>

      <h2>Argon’s MCP server: a sandbox per agent</h2>
      <p>
        Argon exposes MongoDB over MCP too, but every agent works inside its own{" "}
        <a href="/blog/mongodb-database-branching-explained">branch</a> — a
        real, isolated MongoDB rooted at your data. The agent reads and writes
        through the sandbox connection; scope its credentials to that database.
        When the agent is done, inspect its MongoDB document changes and
        conflicts in a merge preview. Explicitly applying that plan changes the
        target branch&apos;s database; discarding the sandbox rejects its work.
        The MCP control tools and the MongoDB connection support this loop:
      </p>
      <ul>
        <li>Open a TTL sandbox off production (or off a pinned dataset).</li>
        <li>Read and write through a MongoDB driver using the sandbox URI.</li>
        <li>Diff a branch against its parent to see exactly what changed.</li>
        <li>
          Preview and apply a merge — conflicts are reported, never silent.
        </li>
        <li>Create a snapshot at the branch head.</li>
        <li>
          Undo: revert a captured branch/run actor’s range when required images
          and history are complete.
        </li>
        <li>
          Pins: name a retained captured document state as the starting point
          for later sandbox runs.
        </li>
      </ul>
      <p>
        The{" "}
        <a
          href={`https://github.com/argon-lab/argon/blob/v${product.version}/pkg/mcpserver/tools.go`}
        >
          released MCP tool definitions
        </a>{" "}
        do not include a general document-query or time-travel-query tool. Use a
        driver for document operations and the CLI or REST API for
        retained-history queries.
      </p>
      <p>
        {limits.lifecycle} {limits.attribution}
      </p>

      <h2>Connect a local deployment</h2>
      <p>
        Argon’s MCP server is a subcommand of the CLI, and it’s listed in the
        official <strong>MCP Registry</strong> as{" "}
        <code>io.github.argon-lab/argon</code>, so MCP-aware clients can
        discover it. Complete the <a href="/quickstart">local MongoDB setup</a>
        and <a href="/agents#mcp">project initialization</a> first, then
        register the local process in Claude Code:
      </p>
      <pre>
        <code>{install.mcp}</code>
      </pre>
      <p>The agent now has Argon’s tools over stdio.</p>

      <h2>What an agent loop looks like</h2>
      <ol>
        <li>
          <strong>sandbox create</strong> — the agent opens a branch off prod
          with a one-hour TTL.
        </li>
        <li>
          It reads and writes to the branch’s connection string to do its task.
        </li>
        <li>
          <strong>diff</strong> — it (or you) inspects exactly what changed.
        </li>
        <li>
          <strong>merge</strong> — explicitly apply the reviewed plan to its
          target branch, or discard the sandbox.
        </li>
      </ol>
      <p>
        With complete images and retained history, <strong>undo</strong> can
        revert a supported captured range on the agent’s branch. Pins give runs
        the same starting document state; agent outputs can still vary. See the{" "}
        <a href="/agents">agents page</a> for the full picture, or the{" "}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">docs</a>{" "}
        for every tool.
      </p>
    </ArticleLayout>
  );
}
