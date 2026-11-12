import { limits } from "../../product";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("code-sandbox-vs-data-sandbox-for-ai-agents")!;

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
    q: "Does a code sandbox protect my database from an AI agent?",
    a: "It protects the machine the code runs on. If the code inside the sandbox is given a connection string to a real database, its writes go to that database. Containing those writes takes a separate, isolated copy of the data.",
  },
  {
    q: "What is a data sandbox?",
    a: "An isolated, disposable copy of a database for one agent run. A useful one starts from your real data, records what the run changed, and lets a person review the changes before merging or discarding them.",
  },
  {
    q: "Is a Docker container with an empty MongoDB a data sandbox?",
    a: "It isolates writes, but the agent starts from nothing and there is no way back: you cannot see the run as a diff against your data or merge the good parts. It works for tests that create their own fixtures.",
  },
  {
    q: "Do I need both a code sandbox and a data sandbox?",
    a: "If an agent runs code it wrote itself and that code touches a database, yes. They contain different things. An agent that only calls fixed tools against a database may need only the data sandbox.",
  },
  {
    q: "Is an Argon sandbox a security boundary between agents?",
    a: "No. A sandbox connection string is a MongoDB credential for a separate database, not an access-control system. Use restricted MongoDB users and network rules for agents that should not trust each other.",
  },
  {
    q: "How long does an Argon sandbox take to create?",
    a: "A sandbox is a full physical copy of the branch with capture ready, so the time grows with the data. The open benchmark suite measures it as sandbox_capture_ready_ms; we do not quote a number here.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        When an AI agent writes and runs its own code, the standard advice is to
        put that code in a sandbox. That advice is right, and it covers less
        than people assume. A <strong>code sandbox</strong> contains what the
        agent <em>runs</em>. It does not contain what the agent{" "}
        <em>writes to your database</em>. That takes a{" "}
        <strong>data sandbox</strong>, and the two solve different problems.
      </p>
      <p>
        This article explains the difference, shows the gap with a small MongoDB
        example you can run, and lists what a data sandbox does not do. We build{" "}
        <a href="https://github.com/argon-lab/argon">Argon</a>, an open-source
        data sandbox for MongoDB, so read the comparison with that in mind.
        Product descriptions below were checked against each vendor&apos;s
        documentation on November 11, 2026.
      </p>

      <h2>What a code sandbox contains</h2>
      <p>
        Code sandboxes give an agent a place to execute code that you did not
        write and have not read. The vendors describe them in similar terms:
      </p>
      <ul>
        <li>
          <a href="https://docs.e2b.dev/">E2B</a> describes its sandbox as a
          Linux VM created on demand for an agent.
        </li>
        <li>
          <a href="https://modal.com/docs/guide/sandboxes">Modal</a> describes
          Sandboxes as secure containers for executing untrusted code, isolated
          with gVisor or a VM runtime.
        </li>
        <li>
          <a href="https://www.daytona.io/docs/">Daytona</a> describes its
          sandboxes as isolated machines with their own kernel, filesystem and
          network stack, built for running AI-generated code.
        </li>
      </ul>
      <p>
        The boundary in each case is the machine: the filesystem, the processes,
        the kernel, and whatever network rules you set. If the agent&apos;s code
        deletes every file it can reach, it deletes files inside the sandbox.
        That is the problem these products were built to solve, and they solve
        it.
      </p>

      <h2>What gets through the wall</h2>
      <p>
        Most useful agents do not only compute. They read and change state that
        lives somewhere else, and a database is the usual place. To let
        sandboxed code do that, you hand it a connection string. From that
        moment the sandbox wall is beside the point for that data: a write sent
        over the connection lands in the database it points at.
      </p>
      <p>
        So the question is which database the connection string points at. There
        are three common answers, and each has a cost:
      </p>
      <ul>
        <li>
          <strong>The real database.</strong> The agent sees real data, and
          every mistake is a production incident. A wrong filter on an update is
          not contained by anything.
        </li>
        <li>
          <strong>An empty throwaway database.</strong> Writes are contained,
          but the agent works on fixtures instead of your data, and nothing it
          produces can come back.
        </li>
        <li>
          <strong>A copy you made by hand.</strong> A dump and restore gives the
          agent real data in isolation. You then own the copying, the cleanup,
          and the question of what changed, which a plain copy cannot answer.
        </li>
      </ul>

      <h2>What a data sandbox has to do</h2>
      <p>
        A data sandbox is the third answer made routine. To be worth using for
        agents it needs five properties:
      </p>
      <ol>
        <li>
          <strong>It starts from your data.</strong> The agent works on a fork
          of a real state, or of a pinned dataset when runs must be comparable.
        </li>
        <li>
          <strong>It is a real database.</strong> The agent&apos;s code uses the
          ordinary driver and query language, with nothing to learn.
        </li>
        <li>
          <strong>It expires.</strong> A run that is abandoned should not leave
          a copy behind forever.
        </li>
        <li>
          <strong>It records what the run changed.</strong> Without that, the
          only review is reading the agent&apos;s own summary.
        </li>
        <li>
          <strong>It has a way back.</strong> A person can adopt the changes
          they want and throw the rest away.
        </li>
      </ol>
      <p>
        The last two are what separate a data sandbox from a scratch database.
        Isolation alone protects your data. Review and merge are what let the
        agent&apos;s work become useful.
      </p>

      <h2>A worked example</h2>
      <p>
        The run below uses the published Argon 2.2.0 CLI installed from npm and
        MongoDB 7.0.48 as a one-node replica set on a laptop, on November 11,
        2026. The data is synthetic: three products in a <code>shop</code>{" "}
        database. A short script stands in for agent-written code. We did not
        run it inside a code sandbox, because where the script runs does not
        change where its writes go.
      </p>
      <p>
        Bring the existing database under Argon once, then create a sandbox with
        a one-hour TTL:
      </p>
      <pre>
        <code>{`argon import database --uri "$MONGODB_URI" --database shop --project shop --source-quiesced
argon sandbox create -p shop --name agent-run-1 --ttl 1h`}</code>
      </pre>
      <pre>
        <code>{`Sandbox "agent-run-1" forked from main at LSN 5.
Expires: 2026-11-11T22:43:06-05:00
Connection string:
  mongodb://localhost:27817/argon_br_6af527ba1c8ca8fc9851a748?replicaSet=rs0
Capture its writes with: argon watch -p shop -b agent-run-1`}</code>
      </pre>
      <p>
        Start capture under a label for this run, and leave it running in its
        own terminal:
      </p>
      <pre>
        <code>{`argon watch -p shop -b agent-run-1 --actor agent:run-1`}</code>
      </pre>
      <p>
        Now the agent&apos;s code. It was asked to apply a 10% discount. It also
        decides, on its own, that the cheapest product is not worth keeping:
      </p>
      <pre>
        <code>{`// connected to the sandbox connection string
db.products.updateMany({}, [
  { $set: { price: { $round: [{ $multiply: ["$price", 0.9] }, 0] } } },
]);
db.products.deleteOne({ _id: "p3" });`}</code>
      </pre>
      <p>
        MongoDB reports three documents modified and one deleted. The source
        database has not changed:
      </p>
      <pre>
        <code>{`[
  { _id: 'p1', name: 'Desk lamp', price: 49 },
  { _id: 'p2', name: 'Monitor arm', price: 89 },
  { _id: 'p3', name: 'Cable tray', price: 19 }
]`}</code>
      </pre>
      <p>Ask what the run changed:</p>
      <pre>
        <code>{`argon diff -p shop -b agent-run-1`}</code>
      </pre>
      <pre>
        <code>{`Merging agent-run-1 → main
  put    products/p1
  put    products/p2
  delete products/p3
3 change(s), 0 conflict(s)`}</code>
      </pre>
      <p>
        The delete is on the list. With <code>--output json</code> each change
        carries the document before and after, so the reviewer sees{" "}
        <code>price: 49</code> become <code>price: 44</code> instead of trusting
        a summary. Here the reviewer does not want the delete, so the run is
        discarded:
      </p>
      <pre>
        <code>{`argon sandbox discard -p shop -b agent-run-1`}</code>
      </pre>
      <pre>
        <code>{`Discarded; storage reclaimed.`}</code>
      </pre>
      <p>
        The source still holds three products at their original prices. Had the
        changes been acceptable, <code>argon merge preview</code> would save a
        plan and <code>argon merge apply</code> would apply exactly that plan.
        The <a href="/quickstart">quickstart</a> runs a full review with two
        competing agents, and the{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          MCP tutorial
        </a>{" "}
        does the same through an MCP client, where capture and expiry are
        managed for you.
      </p>

      <h2>What a data sandbox does not do</h2>
      <p>
        The same run also showed a limit worth knowing before you rely on this.
        In a second sandbox the script created a new collection, inserted a
        document and updated it straight away. Review then failed:
      </p>
      <pre>
        <code>{`Error: exact post-image unavailable for update on audit_log; history is incomplete; enable changeStreamPreAndPostImages before writing`}</code>
      </pre>
      <p>
        Collections that come from the parent are ready for exact capture. A
        collection the agent creates is not, until you run{" "}
        <code>argon collections prepare</code> for it or create it with pre- and
        post-images enabled. Agents create collections freely, so decide up
        front which ones a run may create and prepare them. Other limits:
      </p>
      <ul>
        <li>
          <strong>It is not a security boundary.</strong> {limits.isolation}
        </li>
        <li>
          <strong>It is a full copy.</strong> A sandbox materializes a physical
          MongoDB database, so its creation time and storage grow with the data.
          The open{" "}
          <a href="https://github.com/argon-lab/benchmarks">benchmark suite</a>{" "}
          measures readiness as <code>sandbox_capture_ready_ms</code>.
        </li>
        <li>
          <strong>History has edges.</strong> {limits.undo}
        </li>
        <li>
          <strong>It does not contain code.</strong> A data sandbox does nothing
          about the files, processes or network of the machine the agent&apos;s
          code runs on. That is the code sandbox&apos;s job.
        </li>
      </ul>

      <h2>Using both together</h2>
      <p>
        The two fit together without special integration. The host creates a
        data sandbox and gets a connection string, starts a code sandbox, and
        passes the connection string in. When the run ends, the host reviews the
        diff and merges or discards. Two practical points decide whether this
        works:
      </p>
      <ul>
        <li>
          <strong>Network reach.</strong> A hosted code sandbox has to be able
          to reach your MongoDB deployment. A database on your laptop is not
          reachable from someone else&apos;s cloud without a tunnel or a
          deployment both sides can see.
        </li>
        <li>
          <strong>Credentials.</strong> Give the code sandbox a MongoDB user
          that can reach only the sandbox database. The connection string
          selects a database; it does not stop a user with wider rights from
          naming another one.
        </li>
      </ul>
      <p>
        If your agent only calls a fixed set of tools and never runs code it
        wrote, you may not need a code sandbox at all. If it touches a database
        you care about, you need somewhere safe for those writes to land either
        way. Start with the <a href="/quickstart">local quickstart</a>, or read
        how{" "}
        <a href="/blog/disposable-mongodb-sandbox-for-ai-agents">
          one sandbox per agent
        </a>{" "}
        works in more detail.
      </p>
    </ArticleLayout>
  );
}
