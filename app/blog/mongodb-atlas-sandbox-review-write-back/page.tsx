import { install } from "../../product";
import ArticleLayout from "../ArticleLayout";
import AtlasDiagram from "./AtlasDiagram";
import { getPost } from "../posts";

const post = getPost("mongodb-atlas-sandbox-review-write-back")!;

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

const reports = "https://github.com/argon-lab/benchmarks/tree/main/reports";
const walkthrough = `${reports}/2026-11-21-v2.12.0-atlas-source-walkthrough`;
const transcript = `${walkthrough}/transcript.txt`;
const ops =
  "https://github.com/argon-lab/argon/blob/v2.12.0/docs/OPERATIONS.md";
const atlasPR = "https://github.com/argon-lab/argon/pull/202";
const launcherPR = "https://github.com/argon-lab/argon/pull/208";
const atlasCI =
  "https://github.com/argon-lab/argon/blob/master/.github/workflows/atlas.yml";
const atlasTests =
  "https://github.com/argon-lab/argon/blob/v2.12.0/tests/wal/source_atlas_test.go";
const atlasRestore =
  "https://www.mongodb.com/docs/atlas/backup/cloud-backup/restore-overview/";
const atlasFreeBackup =
  "https://www.mongodb.com/docs/atlas/backup/cloud-backup/free-cluster-backup/";
const atlasTempCluster =
  "https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-temporary-cluster/";
const mongodump = "https://www.mongodb.com/docs/database-tools/mongodump/";
const mcpReadOnly =
  "https://www.mongodb.com/docs/mcp-server/local-mcp/security-best-practices/";

const faq = [
  {
    q: "Does Argon support MongoDB Atlas?",
    a: "Yes, from Argon 2.12.0, on the free M0 tier and on dedicated tiers such as M10; both are tested, including write-back. Argon imports an Atlas database while it is being written, follows its changes, gives AI agents sandboxes forked from it, and writes a reviewed plan back to Atlas in one transaction. The Argon engine and the sandboxes run on a MongoDB replica set you run; Atlas stays the source.",
  },
  {
    q: "Can an AI agent write to MongoDB Atlas safely?",
    a: "MongoDB's own advice for production is read-only access: its MCP server has a --readOnly mode and recommends a read-only database user. When an agent's writes are the point, Argon gives it a sandbox copy instead: the agent writes only to the sandbox, a person reviews every changed document, and the write-back to Atlas needs the plan's approval digest, a connection that verifies as the same cluster, and no change on Atlas to the reviewed documents since the review.",
  },
  {
    q: "Can I clone a MongoDB Atlas database for testing?",
    a: "Atlas can restore a backup to another cluster, from M10 up, and mongodump with mongorestore copies a database; neither keeps following Atlas or brings reviewed changes back. Argon imports the Atlas database once, keeps a copy that follows it, and forks as many sandboxes from it as you need, each a real MongoDB database you can discard.",
  },
  {
    q: "Do I need a paid Atlas tier?",
    a: "No. Argon's Atlas support is tested on the free M0 tier, and the run in this post used one. The Argon engine needs its own MongoDB replica set, which you run.",
  },
  {
    q: "Is there Neon-style database branching for MongoDB Atlas?",
    a: "Argon adds branching to MongoDB, Atlas included: a branch is a metadata write, and checking one out copies it into a real MongoDB database. Unlike Neon's copy-on-write branches, each checked-out sandbox is a full copy, so it takes longer to be ready as the database grows.",
  },
  {
    q: "How fast does Argon follow changes on Atlas?",
    a: "In this run on a free M0, status reported changes stored 84 to 96 ms after they happened while the application was writing, and with the application paused the newest write was stored 0.5 s after it was made. A change is stored once the next oplog entry shows its cluster time is complete; on an idle self-managed replica set that can take 10 to 20 seconds. One short run on one cluster is not a latency guarantee.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq} capabilityNotes={false}>
      <p>
        Argon gives AI agents sandbox copies of a MongoDB Atlas database, shows
        you what each agent changed, and writes the changes you approve back to
        Atlas. The Argon engine and the sandboxes run on a MongoDB replica set
        you run; Atlas stays the source.
      </p>
      <p>
        <strong>
          From Argon 2.12.0, this works on the free M0 tier and on dedicated
          clusters such as M10.
        </strong>{" "}
        Both are tested, including write-back. The run in this post is on a free
        M0; the M10 tests are in <a href={atlasPR}>the pull request</a> that
        added Atlas support. Self-managed replica sets work as before.
      </p>

      <h2>How does Argon work with MongoDB Atlas?</h2>
      <p>
        Atlas keeps your database, and your application keeps using it as usual.
        The Argon engine, on a replica set you run, holds everything Argon
        makes: a copy that tracks Atlas, the agents&apos; sandboxes and the
        merge plans.
      </p>
      <AtlasDiagram />
      <ol>
        <li>
          <strong>Import online.</strong> Argon copies the database from Atlas
          while it is being written, then replays Atlas&apos;s change stream
          until the copy is Atlas at one cluster time. That copy is the branch{" "}
          <code>main</code>.
        </li>
        <li>
          <strong>Follow.</strong> <code>argon source follow</code> keeps
          reading the change stream, so <code>main</code> stays current. It
          records which cluster the source is and checks it on every connection.
        </li>
        <li>
          <strong>Fork.</strong> Each agent run gets a sandbox: a real MongoDB
          database on the engine, forked from <code>main</code>, with its own
          connection string.
        </li>
        <li>
          <strong>Work.</strong> The agent reads and writes the sandbox with any
          driver. Argon records every write. Atlas is not touched.
        </li>
        <li>
          <strong>Preview.</strong> <code>argon merge preview</code> turns the
          agent&apos;s writes into a plan: each document before and after, and
          an approval digest over all of it.
        </li>
        <li>
          <strong>Write back.</strong> After you review the plan,{" "}
          <code>argon merge apply --write-back --approve &lt;digest&gt;</code>{" "}
          writes it to Atlas in one transaction. It refuses if the digest is
          wrong, if the connection is not the same Atlas cluster, or if any
          document in the plan changed on Atlas since the review.
        </li>
      </ol>
      <p>
        The tiers differ only in how Argon recognizes the cluster in steps 2 and
        6. A write-back must reach the database the plan was reviewed against,
        so the identity is recorded at import and checked on every later
        connection:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Atlas tier</th>
              <th>How Argon identifies the cluster</th>
              <th>Tested</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free M0, Flex</td>
              <td>
                These tiers refuse the command that reads the replica-set ID.
                Argon accepts instead a connection whose every host is under{" "}
                <code>mongodb.net</code>, with TLS verified against public
                certificate authorities. Only Atlas can hold those certificates,
                so a tunnel or another deployment cannot stand in for the
                cluster.
              </td>
              <td>M0</td>
            </tr>
            <tr>
              <td>Dedicated M10 and up</td>
              <td>The replica-set ID, as on a self-managed replica set</td>
              <td>M10</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What is it for?</h2>
      <p>
        Each of these runs the six steps above. The agent works on a fork of the
        Atlas data, and nothing reaches Atlas until someone has read the plan.
      </p>
      <ul>
        <li>
          <strong>Data cleanup and backfills by an agent.</strong> An agent
          fixes or fills in documents in a sandbox of your Atlas data. You
          review the plan, document by document, before it is written back, and
          a document that changed on Atlas in the meantime stops the write-back.
        </li>
        <li>
          <strong>Rehearsing a migration.</strong> Run a migration script in a
          sandbox forked from current Atlas data and read the diff: which
          documents it changed, inserted or deleted. Discard the sandbox and run
          it again after a fix; Atlas is not touched.
        </li>
        <li>
          <strong>Evaluating agents on real data.</strong> Give every evaluation
          run a fresh sandbox forked from the same point of <code>main</code>,
          compare what the runs changed, and throw the sandboxes away.
        </li>
        <li>
          <strong>Several agents at once.</strong> Each gets its own sandbox.
          When two change the same document, the later preview shows a conflict
          and a person decides which version wins. See{" "}
          <a href="/blog/two-ai-agents-one-mongodb-document">
            two AI agents, one MongoDB document
          </a>
          .
        </li>
      </ul>

      <h2>
        How is this different from restoring an Atlas backup or using mongodump?
      </h2>
      <p>
        The common ways to put an agent or a test near Atlas data, from
        MongoDB&apos;s own documentation, checked on November 21, 2026:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Approach</th>
              <th>What the agent gets</th>
              <th>Getting reviewed changes back to Atlas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href={atlasRestore}>Restore an Atlas backup</a> to another
                cluster
              </td>
              <td>
                A full cluster as of a snapshot. Cloud Backup is for M10 and up;
                on a free M0, daily snapshots are a{" "}
                <a href={atlasFreeBackup}>paid private preview</a>. The restore
                target must not receive client requests while it restores.
              </td>
              <td>
                No built-in path. You find and copy the changes yourself, and
                the copy does not follow later writes to Atlas.
              </td>
            </tr>
            <tr>
              <td>
                <a href={mongodump}>
                  <code>mongodump</code> and <code>mongorestore</code>
                </a>
              </td>
              <td>
                A copy of the documents, collection options and index
                definitions, consistent with writes during the dump when run
                with <code>--oplog</code>.
              </td>
              <td>
                No built-in path, and the dump does not follow Atlas after it
                ends.
              </td>
            </tr>
            <tr>
              <td>
                A <a href={atlasTempCluster}>temporary cluster</a> from the
                Atlas CLI
              </td>
              <td>
                A new, empty cluster for testing scripts, deleted afterwards.
                MongoDB&apos;s tutorial creates an M10, which is billed hourly
                until it is deleted.
              </td>
              <td>Not applicable: it holds none of your data.</td>
            </tr>
            <tr>
              <td>
                The{" "}
                <a href={mcpReadOnly}>MongoDB MCP server in read-only mode</a>{" "}
                with a read-only user
              </td>
              <td>
                The live data, read-only. MongoDB recommends this for
                production; read-only mode is not on by default.
              </td>
              <td>Nothing to bring back: the agent cannot write.</td>
            </tr>
            <tr>
              <td>A database user with write access to production</td>
              <td>The live data, limited by the user&apos;s roles.</td>
              <td>
                Every write the roles allow lands on Atlas at once, with no
                review before it.
              </td>
            </tr>
            <tr>
              <td>Argon</td>
              <td>
                A sandbox forked from a copy that follows Atlas, one per agent
                run. The engine runs on a replica set you run, and each sandbox
                is a full copy of the database.
              </td>
              <td>
                A plan with every document before and after, written back in one
                transaction after approval, refused if Atlas changed since the
                review.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read-only access is the right answer when the agent only needs to look.
        A restored cluster or a dump is simpler when nobody needs the
        agent&apos;s changes afterwards, or when the copy does not have to keep
        up with Atlas. Argon is for the case where an agent&apos;s work is meant
        to reach Atlas, and someone has to see it first. For branching tools
        beyond MongoDB, see{" "}
        <a href="/blog/database-branching-tools-compared">
          database branching tools compared
        </a>
        .
      </p>

      <h2>Can an AI agent write to Atlas safely this way?</h2>
      <p>
        The agent never needs Atlas credentials. It holds a connection string to
        its sandbox on the engine, and only{" "}
        <code>argon merge apply --write-back</code>, run by a person with the
        plan&apos;s digest, writes to Atlas.
      </p>
      <p>
        The sandbox connection string is not a security boundary on its own.
        Without <code>--credential</code> it carries the engine&apos;s MongoDB
        credentials, so code holding it can reach whatever the engine can. With{" "}
        <code>argon sandbox create --credential</code>, available since 2.10.0,
        each sandbox gets its own MongoDB user that can read and write only that
        sandbox and is revoked when the sandbox is discarded. That needs an
        engine deployment with access control, which you run; see{" "}
        <a href="/blog/mongodb-sandbox-indexes-scoped-credentials">
          sandboxes that refuse what production refuses
        </a>
        .
      </p>

      <h2>What happened on a free M0</h2>
      <p>
        We ran the whole path with the published release. The data is synthetic,
        and a second process wrote to Atlas the whole time, like an application
        would.
      </p>
      <ul>
        <li>
          <strong>Argon 2.12.0</strong>, installed from npm as{" "}
          <code>argonctl</code>.
        </li>
        <li>
          <strong>The source</strong>: a free MongoDB Atlas M0, MongoDB 8.0.39,
          AWS us-east-1. Its database <code>shop</code> starts with 2,000 orders
          and 200 customers.
        </li>
        <li>
          <strong>The engine</strong>: MongoDB 7.0.45 as a one-member replica
          set in a container.
        </li>
        <li>
          <strong>The application</strong>: a thread that inserts or updates an
          order on Atlas, then sleeps 50 ms, for the whole run.
        </li>
      </ul>
      <p>
        Every command and its output is in{" "}
        <a href={transcript}>the transcript</a>, and{" "}
        <a href={walkthrough}>the report</a> has the script. The cluster&apos;s
        host and replica-set name are masked as <code>&lt;id&gt;</code>, and the
        output below keeps only the lines discussed. The same steps on a
        self-managed source, with more on each, are in{" "}
        <a href="/blog/branch-live-mongodb-write-back">
          branch a live MongoDB database and write reviewed changes back
        </a>
        .
      </p>

      <h3>Import and follow, while Atlas is being written</h3>
      <pre>
        <code>{`$ export ARGON_SOURCE_URI="mongodb+srv://…@cluster1.<id>.mongodb.net/"
$ argon import database --database shop --project shop --online --yes
✅ Import Complete
   Documents Imported: 2.2K
   Consistent: LSN 2225 is the source at cluster time Timestamp(1795303135, 26)
   LSNs below 2225 are the copy in progress, not states the source was in.

$ argon source follow -p shop        # left running
$ argon source status -p shop
  Source:      mongodb+srv://cluster1.<id>.mongodb.net/shop (replica set atlas-<id>-shard-0)
  Identity:    replica-set name and TLS-verified MongoDB Atlas hosts
  Health:      healthy (exact)
  Last change: 2026-11-21T23:19:03Z (stored 96 ms after it happened)`}</code>
      </pre>
      <p>
        The application made 13 writes to Atlas while the import ran. With the
        application paused for a moment, following stored Atlas&apos;s newest
        write 0.5 s after it was made, and a sandbox forked from{" "}
        <code>main</code> held exactly what Atlas held:
      </p>
      <pre>
        <code>{`[orders: source 2077 documents, sandbox forked from main 2077 documents;
 exact BSON bytes IDENTICAL (sha256 8ebdf6cf33613739 / 8ebdf6cf33613739)]
[customers: source 200 documents, sandbox forked from main 200 documents;
 exact BSON bytes IDENTICAL (sha256 cbd620837406d59f / cbd620837406d59f)]`}</code>
      </pre>
      <p>
        The 0.5 s is one measurement on one M0. A change is stored once the next
        oplog entry shows its cluster time is complete; on an idle self-managed
        replica set that next entry is MongoDB&apos;s periodic no-op, so the
        last change of a burst can wait 10 to 20 seconds there.
      </p>

      <h3>An agent changes three documents, and four shortcuts are refused</h3>
      <p>
        Through its sandbox&apos;s connection string, an agent refunds one
        order, adds a refund record and deletes another order:
      </p>
      <pre>
        <code>{`$ argon diff -p shop -b agent-1
  delete orders/order-000017
  put    orders/order-000042
  put    orders/order-000042-refund
3 change(s), 0 conflict(s)`}</code>
      </pre>
      <p>
        <code>argon merge preview -o json</code> saved a plan with an{" "}
        <code>approval_digest</code> and the source it was reviewed for,{" "}
        <code>atlas-tls:atlas-&lt;id&gt;-shard-0</code>. Four attempts that
        should not reach Atlas:
      </p>
      <pre>
        <code>{`$ argon merge apply 6b0226e9… --write-back
Error: --write-back requires --approve with a 64-character lowercase hex digest; …

$ argon merge apply 6b0226e9… --write-back --approve 0000…0000
Error: approval digest does not match the saved plan; …

$ argon merge apply 6b0226e9… --write-back --approve 852c9aac… --uri mongodb://argon-atlaspost-meta:27017/?replicaSet=rs0
Error: write-back failed: this project identifies its source by a verified TLS connection
to MongoDB Atlas, and this connection is not one (…): …

$ argon merge apply 6b0226e9…
Error: apply failed: merge apply refused: branch main follows the external database "shop"
and only changes when that database does; …`}</code>
      </pre>
      <p>
        The third points the write-back at the engine&apos;s own deployment
        instead of Atlas. After all four, the three documents on Atlas were as
        they had been.
      </p>

      <h3>The approved write-back</h3>
      <pre>
        <code>{`$ argon merge apply 6b0226e9… --write-back --approve 852c9aac…
Written to the source database: 3 change(s) in one transaction.`}</code>
      </pre>
      <p>
        On Atlas, order 42 became <code>refunded</code> with a new{" "}
        <code>refund_cents</code> field, the refund record appeared and order 17
        was gone. Order 42 kept its field order, with the new field at the end.
        The command took 599 ms, and applying the same plan again was refused
        with <code>merge plan is applied, not pending</code>.
      </p>

      <h3>When Atlas changes after the review</h3>
      <p>
        A second agent cancelled orders 50 and 51 in its own sandbox, and the
        plan was reviewed. Then, before the write-back, someone shipped order 51
        directly on Atlas:
      </p>
      <pre>
        <code>{`$ argon merge apply 6b0226f0… --write-back --approve 323cd7b6…
Error: write-back failed: write-back aborted, nothing was written: document orders/order-000051
in the source database differs from the state this plan was reviewed against.
Let following catch up and run preview again

$ argon merge preview -p shop -b agent-2
  put    orders/order-000050
  CONFLICT orders/order-000051 (both sides changed since the fork)
1 change(s), 1 conflict(s)`}</code>
      </pre>
      <p>
        Order 50 was not cancelled either: a plan is written whole or not at
        all. From the new plan a person decides with <code>--strategy</code>:{" "}
        <code>ours</code> keeps the version on Atlas for a conflicting document,{" "}
        <code>theirs</code> takes the agent&apos;s. This run stopped at the
        preview.
      </p>
      <p>
        At the end the application had made 125 inserts and 123 updates, and
        Atlas held 2,125 orders: 2,000 seeded, 125 inserted by the application,
        one inserted and one deleted by the plan. A new sandbox forked from{" "}
        <code>main</code> held the same 2,125 documents, with identical BSON
        bytes.
      </p>

      <h2>Which Atlas roles does Argon need?</h2>
      <p>
        The run connected as a user with read and write on any database, for
        brevity. In production give each command only what it needs. Atlas
        custom roles spell the actions in capitals, and none of them needs a
        cluster action:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>Actions on the source database</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>import database --online</code>
              </td>
              <td>
                <code>FIND</code>, <code>CHANGE_STREAM</code>,{" "}
                <code>LIST_COLLECTIONS</code>; add <code>LIST_INDEXES</code> so
                sandboxes get the source&apos;s indexes
              </td>
            </tr>
            <tr>
              <td>
                <code>source follow</code>
              </td>
              <td>
                <code>FIND</code>, <code>CHANGE_STREAM</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>merge check</code>
              </td>
              <td>
                <code>FIND</code>, <code>LIST_INDEXES</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>merge apply --write-back</code>
              </td>
              <td>
                <code>FIND</code>, <code>LIST_COLLECTIONS</code>,{" "}
                <code>INSERT</code>, <code>UPDATE</code>, <code>REMOVE</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The table is from the{" "}
        <a href={`${ops}#mongodb-atlas-as-a-source`}>operations guide</a>, which
        was tested with these roles on an M0 and an M10. A follower without{" "}
        <code>CHANGE_STREAM</code> stops at once, and a write-back names the
        action it is missing.
      </p>

      <h2>How is Atlas support kept working?</h2>
      <p>
        <a href={atlasTests}>Argon&apos;s Atlas tests</a> import, follow, fork a
        sandbox, write back, and check that a weakened TLS connection is not
        accepted as the cluster. Since November 21,{" "}
        <a href={atlasCI}>a workflow</a> runs them against a free M0 once a day,
        when started by hand, and on pushes to master that change the code for
        importing, following and merging.
      </p>

      <h2>Limits</h2>
      <ul>
        <li>
          The engine and its sandboxes run on a MongoDB replica set you
          administer. Running the engine on Atlas is not tested.{" "}
          <code>argon sandbox create --credential</code> needs an engine
          deployment that allows <code>createUser</code>, which Atlas does not.
        </li>
        <li>Sharded clusters are not supported as sources.</li>
        <li>
          Behind a TLS-inspecting proxy, reading and following a shared-tier
          cluster work, but write-back is refused.
        </li>
        <li>
          Write-back is in the CLI only, not in the REST API, MCP server or
          console.
        </li>
        <li>
          A sandbox is a full copy of the database on the engine, so it takes
          longer to be ready as the database grows. Validators and collection
          options are not copied to sandboxes.
        </li>
        <li>
          A sandbox created from the CLI records the agent&apos;s writes while{" "}
          <code>--watch</code> or <code>argon watch</code> runs; sandboxes from
          the MCP server and the console are watched for you.
        </li>
        <li>
          In 2.12.0, stopping <code>argon source follow</code> by sending a
          signal to the npm-installed <code>argon</code> command leaves the
          follower running; Ctrl-C in a terminal is not affected.{" "}
          <a href={launcherPR}>The fix</a> is in the next release.
        </li>
      </ul>

      <h2>Try it</h2>
      <pre>
        <code>{`${install.cli}
export MONGODB_URI="mongodb://…"              # the engine: a replica set you run
export ARGON_SOURCE_URI="mongodb+srv://…"     # your Atlas cluster; read per command, never stored
argon import database --database shop --project shop --online --yes
argon source follow -p shop                   # leave running
argon sandbox create -p shop --ttl 1h --watch`}</code>
      </pre>
      <p>
        Review with <code>argon merge preview</code>, take the digest from{" "}
        <code>argon merge list -p shop --output json</code>, and write back with{" "}
        <code>
          argon merge apply &lt;plan&gt; --write-back --approve &lt;digest&gt;
        </code>
        . For a disposable sandbox without a live source, see{" "}
        <a href="/blog/disposable-mongodb-sandbox-for-ai-agents">
          disposable MongoDB sandboxes for AI agents
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
