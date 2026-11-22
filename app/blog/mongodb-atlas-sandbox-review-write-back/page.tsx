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
const ops = "https://github.com/argon-lab/argon/blob/v2.12.0/docs/OPERATIONS.md";
const atlasPR = "https://github.com/argon-lab/argon/pull/202";
const atlasCI =
  "https://github.com/argon-lab/argon/blob/master/.github/workflows/atlas.yml";
const atlasTests =
  "https://github.com/argon-lab/argon/blob/v2.12.0/tests/wal/source_atlas_test.go";

const faq = [
  {
    q: "Can Argon use MongoDB Atlas as the source database?",
    a: "Yes, from Argon 2.12.0, on the free M0 tier and on dedicated tiers such as M10; both are tested, including write-back. Argon imports an Atlas database while it is being written, follows its changes, gives agents sandboxes forked from it, and writes a reviewed plan back to Atlas in one transaction. The engine and the sandboxes run on a MongoDB replica set you administer; Atlas holds only the source.",
  },
  {
    q: "Does it work on the free M0 tier?",
    a: "Yes. The run in this post used a free M0 cluster on MongoDB 8.0.39. The shared tiers refuse replSetGetConfig, so Argon cannot record the replica-set ID there. It identifies the cluster instead by a connection whose every host is under mongodb.net and verifies TLS against public certificate authorities, and it requires the same of every later command.",
  },
  {
    q: "What stops an agent's change from reaching Atlas without review?",
    a: "The agent writes only to its sandbox. Writing to Atlas takes argon merge apply with --write-back and the plan's approval digest, from a connection that verifies as the same Atlas cluster. In the run, a missing digest, a wrong digest, the wrong deployment and a plain apply were all refused, and a document changed on Atlas after the review made the write-back stop with nothing written.",
  },
  {
    q: "How fast does main follow Atlas?",
    a: "In this run, with the application paused, following stored Atlas's newest write 0.5 s after it was made, and status reported changes stored about 0.1 to 0.6 s after they happened. A change is stored once the next oplog entry shows its cluster time is complete; on an idle self-managed replica set that can take 10 to 20 seconds. One short run on one M0 is not a latency guarantee.",
  },
  {
    q: "What is not supported on Atlas?",
    a: "Running the engine itself on Atlas is not tested, and argon sandbox create --credential needs an engine deployment that allows createUser, which Atlas does not. Sharded clusters are not supported as sources. Write-back to a shared-tier cluster is refused behind a TLS-inspecting proxy, though reading and following still work.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        <strong>
          Argon now supports MongoDB Atlas as a source, from the free M0 tier
          to dedicated clusters such as M10.
        </strong>{" "}
        From <a href={atlasPR}>Argon 2.12.0</a>, an Atlas database can be
        imported while your application keeps writing to it, followed, forked
        into sandboxes for AI agents, and written back to after you review
        what the agent changed.
      </p>
      <ul>
        <li>
          <strong>Free M0</strong>: tested, including write-back. This post
          runs the whole path on one.
        </li>
        <li>
          <strong>Dedicated M10 and up</strong>: tested, including write-back.
        </li>
        <li>
          <strong>Your own replica set</strong>: as before. Atlas joins it as
          a supported source; it does not replace it.
        </li>
      </ul>
      <p>
        Until 2.12.0 our tests ran against self-managed replica sets only, and
        Atlas&apos;s free tier hides the identifier Argon used to make sure a
        write-back reaches the database that was reviewed. Below is how it
        works now, then a full run on a free M0 with the published release.
      </p>

      <h2>How it works</h2>
      <p>
        Argon splits the work across two places. Atlas keeps your database,
        and your application keeps using it as usual. The Argon engine runs on
        a MongoDB replica set you run, and holds everything Argon makes: a
        copy of the database that tracks Atlas, the agents&apos; sandboxes and
        the merge plans.
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
          reading the change stream, so <code>main</code> stays current with
          Atlas. It records who the source is and checks it on every
          connection.
        </li>
        <li>
          <strong>Fork.</strong> Each agent run gets a sandbox: a real MongoDB
          database on the engine, forked from <code>main</code>, with its own
          connection string.
        </li>
        <li>
          <strong>Work.</strong> The agent reads and writes the sandbox with
          any driver. Argon records every write. Atlas is not touched.
        </li>
        <li>
          <strong>Preview.</strong> <code>argon merge preview</code> turns
          the agent&apos;s writes into a plan: each document before and after,
          and an approval digest over all of it.
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
        The tiers differ only in how Argon recognizes the cluster in steps 2
        and 6:
      </p>
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
              Every host under <code>mongodb.net</code>, over TLS verified
              against public certificate authorities. These tiers refuse the
              command that reads the replica-set ID.
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

      <h2>What we ran</h2>
      <ul>
        <li>
          <strong>Argon 2.12.0</strong>, installed from npm as{" "}
          <code>argonctl</code>.
        </li>
        <li>
          <strong>The source</strong>: a free MongoDB Atlas M0 cluster, MongoDB
          8.0.39, AWS us-east-1. Its database <code>shop</code> starts with
          2,000 orders and 200 customers.
        </li>
        <li>
          <strong>The engine</strong>: MongoDB 7.0.45 as a one-member replica
          set in a container. Argon keeps its metadata and the sandboxes
          there.
        </li>
        <li>
          <strong>The application</strong>: a thread that inserts or updates
          an order on Atlas, then sleeps 50 ms, for the whole run. It never
          touches orders 1 to 99, which the agents use.
        </li>
      </ul>
      <p>
        Every command and its output is in{" "}
        <a href={transcript}>the transcript</a>; <a href={walkthrough}>the report</a>{" "}
        has the script. The cluster&apos;s host and replica-set name are masked
        as <code>&lt;id&gt;</code>. Long output is shortened with …
      </p>

      <h2>Import while Atlas is being written</h2>
      <pre>
        <code>{`$ export ARGON_SOURCE_URI="mongodb+srv://…@cluster1.<id>.mongodb.net/"
$ argon import database --database shop --project shop --online --yes
✅ Import Complete
   Documents Imported: 2.2K
   Collections: 2
   Duration: 887.464125ms
   LSN Range: 2 - 2225
   Consistent: LSN 2225 is the source at cluster time Timestamp(1795303135, 26)
   LSNs below 2225 are the copy in progress, not states the source was in.
   main follows database 'shop'; keep it current with: argon source follow -p <project>`}</code>
      </pre>
      <p>
        The application made 13 writes to Atlas while the command ran. The
        import takes Atlas&apos;s cluster time, copies the collections, then
        replays the change stream from that time until it has passed
        everything the copy read. What it publishes is Atlas at one cluster time, and it says
        which one.
      </p>

      <h2>Follow it</h2>
      <pre>
        <code>{`$ argon source follow -p shop        # left running

$ argon source status -p shop
Project shop: main follows database "shop"
  Source:      mongodb+srv://cluster1.<id>.mongodb.net/shop (replica set atlas-<id>-shard-0)
  Identity:    replica-set name and TLS-verified MongoDB Atlas hosts
  State:       running (last report 2026-11-21T23:18:56Z)
  Health:      healthy (exact)
  Head:        LSN 2333
  Consistent:  LSN 2333 is the source at Timestamp(1795303143, 87)
  Last change: 2026-11-21T23:19:03Z (stored 96 ms after it happened)
  …`}</code>
      </pre>
      <p>
        The <code>Identity</code> line shows the M0 path from the table
        above. A write-back must reach the database the plan was reviewed
        against, so Argon records who the source is at import and checks it
        on every later connection. On a self-managed replica set or a
        dedicated Atlas tier it records the replica-set ID. Atlas&apos;s
        shared tiers (M0 and Flex) refuse the command that reads it.
      </p>
      <p>
        In its place Argon accepts a connection that can only be Atlas:
      </p>
      <ul>
        <li>
          every seed host and every member the cluster reports is under{" "}
          <code>mongodb.net</code>;
        </li>
        <li>
          TLS is on, with certificate and host name checks and no custom
          certificate authority;
        </li>
        <li>
          the certificates verify against the public root program Argon ships,
          not only against the machine&apos;s trust store.
        </li>
      </ul>
      <p>
        Only Atlas can get a public certificate for those hosts, so a tunnel
        or another deployment cannot stand in for the cluster. The last
        condition rules out a private root the machine happens to trust, such
        as a corporate one. A dedicated tier that allows the command records
        the replica-set ID as before.
      </p>

      <h2>Is main the same as Atlas?</h2>
      <p>
        With the application paused for a moment, following stored
        Atlas&apos;s newest write 0.5 s after it was made. A sandbox forked
        from <code>main</code> then held exactly what Atlas held:
      </p>
      <pre>
        <code>{`[orders: source 2077 documents, sandbox forked from main 2077 documents;
 values IDENTICAL (sha256 8a6077029cd073c3 / 8a6077029cd073c3);
 exact BSON bytes IDENTICAL (sha256 8ebdf6cf33613739 / 8ebdf6cf33613739)]
[customers: source 200 documents, sandbox forked from main 200 documents;
 values IDENTICAL (sha256 4596f17c23748169 / 4596f17c23748169);
 exact BSON bytes IDENTICAL (sha256 cbd620837406d59f / cbd620837406d59f)]`}</code>
      </pre>
      <p>
        The hashes run over every document&apos;s BSON bytes in{" "}
        <code>_id</code> order, so field order and types match too, not just
        values.
      </p>
      <p>
        The 0.5 s is one measurement on one M0, not a guarantee. A change is
        stored once the next oplog entry shows its cluster time is complete.
        On an idle self-managed replica set that next entry is MongoDB&apos;s
        periodic no-op, so the last change of a burst can wait 10 to 20
        seconds there. Any other write to the deployment ends the wait at
        once.
      </p>

      <h2>An agent works in a sandbox</h2>
      <p>
        The agent gets a connection string to a sandbox on the engine, forked
        from <code>main</code>. It refunds one order, adds a refund record and
        deletes another order, using an ordinary driver:
      </p>
      <pre>
        <code>{`$ argon sandbox create -p shop --name agent-1 --watch --actor agent-1
Sandbox "agent-1" forked from main at LSN 2334.
Connection string:
  mongodb://argon-atlaspost-meta:27017/argon_br_6b0226e93663898f81659960?replicaSet=rs0

$ argon diff -p shop -b agent-1
Merging agent-1 → main
  delete orders/order-000017
  put    orders/order-000042
  put    orders/order-000042-refund
3 change(s), 0 conflict(s)`}</code>
      </pre>
      <p>
        Atlas has not changed. Meanwhile the application keeps writing to it,
        and following keeps <code>main</code> current.
      </p>

      <h2>Review, and what is refused</h2>
      <p>
        <code>argon merge preview -p shop -b agent-1 -o json</code> saves a
        plan with each document before and after, and an{" "}
        <code>approval_digest</code> over all of it. The plan also records
        which source it was reviewed for:
      </p>
      <pre>
        <code>{`    "followed_database": "shop",
    "followed_replica_set_id": "atlas-tls:atlas-<id>-shard-0",
    …
    "approval_digest": "852c9aacbdf9f9409789da45f4f12be730dd2a0b0d27079ba0a63279fe5940b5"`}</code>
      </pre>
      <p>Four attempts that should not reach Atlas:</p>
      <pre>
        <code>{`$ argon merge apply 6b0226e9… --write-back
Error: --write-back requires --approve with a 64-character lowercase hex digest; …

$ argon merge apply 6b0226e9… --write-back --approve 0000…0000
Error: approval digest does not match the saved plan; …

$ argon merge apply 6b0226e9… --write-back --approve 852c9aac… --uri mongodb://argon-atlaspost-meta:27017/?replicaSet=rs0
Error: write-back failed: this project identifies its source by a verified TLS connection
to MongoDB Atlas, and this connection is not one (mongodb+srv://cluster1.<id>.mongodb.net/shop): …

$ argon merge apply 6b0226e9…
Error: apply failed: merge apply refused: branch main follows the external database "shop"
and only changes when that database does; …`}</code>
      </pre>
      <p>
        The third points the write-back at the engine&apos;s own deployment
        instead of Atlas, and the identity check refuses it. After all four,
        the three documents on Atlas were as they had been.
      </p>

      <h2>Write back</h2>
      <pre>
        <code>{`$ argon merge apply 6b0226e9… --write-back --approve 852c9aac…
Written to the source database: 3 change(s) in one transaction.
main shows them once following has read them from the source (argon source status).`}</code>
      </pre>
      <p>On Atlas afterwards:</p>
      <pre>
        <code>{`order-000042:        {"_id": "order-000042", "status": "refunded", …, "refund_cents": 2054}
order-000042-refund: {"_id": "order-000042-refund", "status": "refund", "customer": "cust-042",
                      "total_cents": -2054, "refunds": "order-000042"}
order-000017:        null`}</code>
      </pre>
      <p>
        The command took 599 ms. The same plan cannot be applied twice: a repeat returned{" "}
        <code>merge plan is applied, not pending</code>. <code>main</code>{" "}
        shows the change once following reads it back from Atlas, like any
        other write.
      </p>

      <h2>When Atlas changes after the review</h2>
      <p>
        A second agent cancels orders 50 and 51 in its own sandbox, and the
        plan is reviewed. Then, before the write-back, someone ships order 51
        directly on Atlas:
      </p>
      <pre>
        <code>{`$ argon merge apply 6b0226f0… --write-back --approve 323cd7b6…
Error: write-back failed: write-back aborted, nothing was written: document orders/order-000051
in the source database differs from the state this plan was reviewed against.
Let following catch up and run preview again`}</code>
      </pre>
      <p>
        Order 50 was not cancelled either: the plan is written whole or not
        at all. After following stored the edit, a new preview showed it as a
        conflict:
      </p>
      <pre>
        <code>{`$ argon merge preview -p shop -b agent-2
Merging agent-2 → main
  put    orders/order-000050
  CONFLICT orders/order-000051 (both sides changed since the fork)
1 change(s), 1 conflict(s)`}</code>
      </pre>
      <p>
        From there a person decides: <code>--strategy ours</code> keeps the
        shipment and cancels only order 50, <code>--strategy theirs</code>{" "}
        takes the agent&apos;s version of both.
      </p>

      <h2>At the end</h2>
      <p>
        The application made 125 inserts and 123 updates during the run.
        Atlas held 2,125 orders: 2,000 seeded, 125 inserted by the
        application, one inserted and one deleted by the plan. A new sandbox
        forked from <code>main</code> held the same 2,125 documents, with
        identical BSON bytes.
      </p>

      <h2>Roles</h2>
      <p>
        The run connected as a user with read and write on any database, for
        brevity. In production give each command only what it needs. Atlas
        custom roles spell the actions in capitals, and none of them needs a
        cluster action:
      </p>
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
      <p>
        The table is from the{" "}
        <a href={`${ops}#mongodb-atlas-as-a-source`}>operations guide</a>,
        which was tested with these roles on an M0 and an M10. A follower
        without <code>CHANGE_STREAM</code> stops at once, and a write-back
        names the action it is missing.
      </p>

      <h2>Kept working</h2>
      <p>
        <a href={atlasTests}>Argon&apos;s Atlas tests</a> import, follow, fork a
        sandbox, write back and check that a weakened TLS connection is not
        accepted as the cluster. Since November 21{" "}
        <a href={atlasCI}>a workflow</a> runs them against a free M0 every
        day and on every change to the source code on master, so a change
        that breaks Atlas shows up as a failed run.
      </p>

      <h2>Limits</h2>
      <ul>
        <li>
          The engine and its sandboxes run on a MongoDB replica set you
          administer. Running the engine on Atlas is not tested.{" "}
          <code>argon sandbox create --credential</code> needs an engine
          deployment that allows <code>createUser</code>, which Atlas does
          not.
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
          longer to be ready as the database grows.
        </li>
        <li>
          Validators and collection options are not copied to sandboxes.
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
        <code>argon merge list -p shop --output json</code>, and write back
        with <code>argon merge apply &lt;plan&gt; --write-back --approve
        &lt;digest&gt;</code>.
      </p>
    </ArticleLayout>
  );
}
