import { install } from "../../product";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("mongodb-sandbox-indexes-scoped-credentials")!;

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
const transcript = `${reports}/2026-11-21-v2.11.1-sandbox-safety/transcript.txt`;
const walkthrough = `${reports}/2026-11-21-v2.11.1-sandbox-safety`;
const indexCost = `${reports}/2026-11-21-v2.10.0-v2.11.1-index-cost`;
const readiness = `${reports}/2026-11-20-v2.9.0-sandbox-ready`;
const ops = "https://github.com/argon-lab/argon/blob/v2.11.1/docs/OPERATIONS.md";
const changelog = "https://github.com/argon-lab/argon/blob/v2.11.1/CHANGELOG.md";
const credentialPR = "https://github.com/argon-lab/argon/pull/182";
const indexPR = "https://github.com/argon-lab/argon/pull/190";
const deploymentsPR = "https://github.com/argon-lab/argon/pull/185";

const faq = [
  {
    q: "Does an Argon sandbox have the same indexes as the source database?",
    a: "From Argon 2.11.0, yes for secondary indexes. The import records each collection's index definitions, following and resync keep them current, and every checkout builds them after copying the documents. A unique index therefore refuses a duplicate key inside the sandbox, as it would in production. A TTL index is built without its expiry, and an index the sandbox's data violates is skipped and reported. Validators and collection options are still not copied.",
  },
  {
    q: "Can each sandbox get its own MongoDB user?",
    a: "Yes, from Argon 2.10.0: argon sandbox create --credential returns a connection string for a user that can read and write only that sandbox's database. In our run that user was refused on another database, on the main branch's database and on Argon's metadata. The deployment must enforce authentication, and the engine needs userAdmin on the sandbox databases; otherwise Argon refuses to issue the credential.",
  },
  {
    q: "What happens to the credential when the sandbox is discarded?",
    a: "Argon drops the user before it drops the database. In our run a connection that was already open failed its next write with \"requires authentication\", and a new connection failed to authenticate. An expired sandbox's credential stays valid until a sweep runs; the REST and MCP servers sweep every minute.",
  },
  {
    q: "How much slower is a sandbox with indexes?",
    a: "At 100,000 documents spread over ten collections with 20 secondary indexes, a sandbox was ready in about 4.2 s on Argon 2.11.1 against 1.7 s on 2.10.0, which did not build them. With no secondary indexes the time did not change. Both releases were run alternately on the same shared host.",
  },
  {
    q: "Is this tested on Atlas?",
    a: "No. Since 2.10.0 the import, follow and write-back tests cover access control with least-privilege roles, TLS, primary elections on a three-member replica set, and MongoDB 6.0 and 8.0. Atlas itself and sharded sources are not tested.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        A sandbox is only a good place for an AI agent to work if it behaves
        like the database the change is meant for. Two things decide most of
        that. Does it refuse the writes production would refuse? And can the
        agent reach anything outside its sandbox?
      </p>
      <p>
        Until recently Argon got both wrong. A sandbox had the source&apos;s
        documents but only the <code>_id</code> index, so an insert that
        production would reject with a duplicate key error went through. The
        connection string carried the engine&apos;s own MongoDB credentials,
        so code holding it could read every database the engine could. Two
        releases changed that:
      </p>
      <ul>
        <li>
          <strong>Argon 2.10.0</strong> can give each sandbox its own MongoDB
          user, revoked when the sandbox goes.
        </li>
        <li>
          <strong>Argon 2.11.0</strong> builds each collection&apos;s
          secondary indexes in every sandbox.
        </li>
      </ul>
      <p>
        This post runs both on the published release and shows what is
        refused. It also covers what happens when the data breaks an index,
        what the indexes cost, and what is still not covered.
      </p>

      <h2>What we ran</h2>
      <ul>
        <li>
          <strong>Argon 2.11.1</strong>, installed from npm as{" "}
          <code>argonctl</code>.
        </li>
        <li>
          <strong>MongoDB 7.0.45</strong> as a one-member replica set with
          access control (<code>--auth --keyFile</code>), in a container. Argon
          connects as a root user.
        </li>
        <li>
          A source database <code>shop</code> with 1,000 orders and three
          secondary indexes: unique on <code>sku</code>, compound on{" "}
          <code>status, total</code>, and a 30-day TTL on{" "}
          <code>createdAt</code>. A second database, <code>billing</code>,
          stands for everything else on the deployment.
        </li>
      </ul>
      <p>
        Every command and its output is in{" "}
        <a href={transcript}>the transcript</a>, with passwords masked.{" "}
        <a href={walkthrough}>The report</a> has the script that produced it.
        Below, <code>$SANDBOX</code> is the connection string Argon returned;
        IDs and long output are shortened with …
      </p>

      <h2>The source&apos;s indexes, in the sandbox</h2>
      <pre>
        <code>{`$ mongosh "$ENGINE" --eval 'db.getSiblingDB("shop").orders.getIndexes().map(i => i.name)'
[ '_id_', 'sku_1', 'status_1_total_-1', 'createdAt_1' ]

$ argon import database --uri "$ENGINE" --database shop --project shop --source-quiesced --yes
$ argon sandbox create -p shop --name agent-run --ttl 1h --credential --output json
{
  "connection_string": "mongodb://sandbox_6b015c85…:•••@localhost:27017/argon_br_6b015c85…?authSource=argon_br_6b015c85…&replicaSet=rs0",
  "index_notes": [
    "index createdAt_1 on orders was built without its TTL expiry"
  ],
  "indexes": 3,
  …
}`}</code>
      </pre>
      <p>
        The import recorded the three definitions, and the checkout built them
        after copying the documents. Inside the sandbox:
      </p>
      <pre>
        <code>{`$ mongosh "$SANDBOX" --eval 'db.orders.getIndexes().map(…)'
[ '_id_', 'sku_1 unique', 'status_1_total_-1', 'createdAt_1' ]

$ mongosh "$SANDBOX" --eval 'db.orders.updateOne({_id: 7}, {$set: {status: "refunded"}})'
{ acknowledged: true, insertedId: null, matchedCount: 1, modifiedCount: 1, upsertedCount: 0 }

$ mongosh "$SANDBOX" --eval 'db.orders.insertOne({_id: 5000, sku: "sku-42"})'
E11000 duplicate key error collection: argon_br_6b015c85….orders index: sku_1 dup key: { sku: "sku-42" }`}</code>
      </pre>
      <p>
        The duplicate <code>sku</code> fails where the agent writes it, as it
        would in production. Before 2.11 the insert succeeded. The conflict
        surfaced only at <code>argon merge check</code>, after the agent&apos;s
        run, or when the write reached the real database. Queries in the
        sandbox now use the same indexes as on the source too.
      </p>
      <p>
        <code>createdAt_1</code> is there, but without its expiry. A copy of a
        database is often older than its newest documents&apos; TTL. With the
        expiry kept, MongoDB would start deleting the sandbox&apos;s documents
        on its own, and capture would record those deletions as the
        agent&apos;s changes.
      </p>
      <p>
        The definitions come from three places:
      </p>
      <ul>
        <li>the import, which reads the source&apos;s indexes;</li>
        <li>
          following, which records index builds and drops on the source as
          they happen;
        </li>
        <li>
          capture, which records index builds and drops made through a
          branch&apos;s own checkout. These apply to that branch and its
          descendants, not to its parent.
        </li>
      </ul>
      <p>
        Indexes are not versioned: a branch uses the latest definitions
        recorded for it. Details are in the{" "}
        <a href={`${ops}#indexes-in-checkouts`}>operations guide</a> and{" "}
        <a href={indexPR}>the pull request</a>.
      </p>

      <h2>A MongoDB user for each sandbox</h2>
      <p>
        <code>--credential</code> made the connection string above carry a
        user named after the sandbox&apos;s branch ID. It can read and write that one database,
        and that database is its <code>authSource</code>. Argon returns the
        password once and stores only the user name. Outside the sandbox:
      </p>
      <pre>
        <code>{`$ mongosh "$SANDBOX" --eval 'db.getSiblingDB("billing").invoices.findOne()'
not authorized on billing to execute command { find: "invoices", … }

$ mongosh "$SANDBOX" --eval 'db.getSiblingDB("argon_br_6b015c85…").orders.findOne()'   # main's database
not authorized on argon_br_6b015c85… to execute command { find: "orders", … }

$ mongosh "$SANDBOX" --eval 'db.getSiblingDB("argon_wal").wal_log.findOne()'
not authorized on argon_wal to execute command { find: "wal_log", … }`}</code>
      </pre>
      <p>
        Discarding the sandbox drops the user before the database. We kept a
        connection open across the discard, writing once before and once
        after:
      </p>
      <pre>
        <code>{`$ argon sandbox discard -p shop -b agent-run
Discarded; storage reclaimed.

# the connection opened before the discard
first write: ok
second write: Command update requires authentication

$ mongosh "$SANDBOX" --eval 'db.orders.findOne()'   # a new connection
MongoServerError: Authentication failed.`}</code>
      </pre>
      <p>Three conditions apply:</p>
      <ul>
        <li>
          <strong>The deployment must enforce authentication.</strong> On one
          that does not, a per-sandbox user would not be enforced, so Argon
          refuses the flag. The REST API answers 422 since 2.11.1.
        </li>
        <li>
          <strong>The engine needs <code>userAdmin</code></strong> on the
          sandbox databases, or <code>userAdminAnyDatabase</code>.
        </li>
        <li>
          <strong>Expiry alone revokes nothing.</strong> An expired
          sandbox&apos;s credential keeps working until a sweep runs. The REST
          and MCP servers sweep every minute; with the CLI alone, schedule{" "}
          <code>argon sandbox sweep</code>.
        </li>
      </ul>
      <p>
        Without the flag the connection string still uses the engine&apos;s
        credentials. The Python SDK takes the same option as{" "}
        <code>create_sandbox(..., credential=True)</code> from 0.3.0. See{" "}
        <a href={`${ops}#exposure-and-credentials`}>Exposure and credentials</a>{" "}
        and <a href={credentialPR}>the pull request</a>.
      </p>

      <h2>When the data breaks an index</h2>
      <p>
        An index can only be built over data that satisfies it. To see what
        happens otherwise, we made a branch, checked it out with capture
        running, dropped its unique index and inserted a duplicate. That is
        the kind of change an agent cleaning up data might make.
      </p>
      <pre>
        <code>{`$ mongosh "$CLEANUP" --eval 'db.orders.dropIndex("sku_1"); db.orders.insertOne({_id: 6000, sku: "sku-42"})'
{ acknowledged: true, insertedId: 6000 }

$ argon merge preview -p shop -b cleanup
Merging cleanup → main
  put    orders/~argon:bson:DAAAABBpAHAXAAAA
1 change(s), 0 conflict(s)

$ argon merge apply 6b015ca0d335a77244e5d98c   # main is checked out and has sku_1
Error: apply failed: write exception: write errors: [E11000 duplicate key error collection: argon_br_6b015c85….orders index: sku_1 dup key: { sku: "sku-42" }]`}</code>
      </pre>
      <p>
        <code>main</code> was checked out, so its database still had the
        unique index, and MongoDB refused the merge. Nothing changed:{" "}
        <code>main</code> stayed at LSN 1002.
      </p>
      <p>
        With <code>main</code> released, nothing enforced the index at merge
        time. A fresh preview applied, and the next sandbox reported what it
        could not build:
      </p>
      <pre>
        <code>{`$ argon release -p shop -b main
$ argon merge apply 6b015ca0d335a77244e5d98c
Error: apply failed: stale plan: branch state changed since preview; run preview again
$ argon merge preview -p shop -b cleanup     # saves plan 6b015ca01cdbacf2ac128b6b
$ argon merge apply 6b015ca01cdbacf2ac128b6b
Merged: 1 change(s) applied.

$ argon sandbox create -p shop --name next-run --ttl 1h
Sandbox "next-run" forked from main at LSN 1008.
Note: index sku_1 on orders was not built: (DuplicateKey) Index build failed: … E11000 duplicate key error … dup key: { sku: "sku-42" }
Note: index createdAt_1 on orders was built without its TTL expiry`}</code>
      </pre>
      <p>
        The checkout built the other indexes and named the one it skipped, in
        the CLI output and in <code>index_notes</code>. It did not fail the
        whole sandbox.
      </p>
      <p>
        The broader point: indexes are not versioned, and a merge does not
        carry index changes. Keep the branch you merge into checked out if you
        want MongoDB to enforce its unique indexes at merge time. Run{" "}
        <code>argon merge check</code> before writing a plan back to the
        source.
      </p>

      <h2>What it costs</h2>
      <p>
        Building indexes takes time, and a checkout now does it before the
        sandbox is handed over. We ran Argon 2.10.0 and 2.11.1 alternately,
        three rounds each with three sandboxes per round, at 100,000 documents
        of about 1 KB:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Fixture</th>
              <th scope="col">2.10.0, ready</th>
              <th scope="col">2.11.1, ready</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 collection, only the <code>_id</code> index</td>
              <td>1.98 s (1.67–2.32)</td>
              <td>2.04 s (1.73–2.35)</td>
            </tr>
            <tr>
              <td>10 collections, 20 secondary indexes</td>
              <td>1.70 s (1.61–2.55)</td>
              <td>4.21 s (4.05–4.27)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Medians of nine sandboxes, with the range in brackets. The first write
        afterwards took a few milliseconds in both releases.
      </p>
      <p>
        Without secondary indexes nothing changed. With 20, a sandbox of this
        size takes about 2.5 seconds longer. The host is shared and its load
        average was 11 to 13 throughout, so the absolute times are inflated;
        alternating the releases keeps the comparison fair. The figures are
        in <a href={indexCost}>the report</a>. For how readiness grows with
        size, see the <a href={readiness}>earlier measurement</a>: 0.2, 2.4
        and 16 seconds at 10,000, 100,000 and 1,000,000 documents, nearly all
        of it the physical copy.
      </p>

      <h2>Which deployments this is tested on</h2>
      <p>
        Since 2.10.0, importing, following and write-back are tested against
        sources with access control and TLS, using the least-privilege role
        for each command. They are also tested through primary elections on a
        three-member replica set, and with MongoDB 6.0 and 8.0 sources and an
        8.0 engine (<a href={deploymentsPR}>pull request</a>). The{" "}
        <a href={`${ops}#source-permissions`}>source permissions</a> table
        lists the roles. Grant <code>listIndexes</code> so that sandboxes get
        the source&apos;s indexes; without it the import still works and says
        which collections get only <code>_id</code>.
      </p>

      <h2>Limits</h2>
      <ul>
        <li>
          Indexes are not versioned. A branch uses its own or its nearest
          ancestor&apos;s latest definitions, and a merge does not carry index
          changes.
        </li>
        <li>
          Validators, collation defaults and other collection options are not
          copied.
        </li>
        <li>
          Atlas itself and sharded sources are not tested. Atlas Search
          indexes are not secondary indexes and are not built.
        </li>
        <li>
          A sandbox credential needs a deployment that enforces authentication.
          It stays valid after expiry until a sweep runs.
        </li>
        <li>
          Checkout copies the data, so readiness grows with the database. Index
          builds add to it.
        </li>
      </ul>
      <p>
        The full list for this release is in the{" "}
        <a href={changelog}>changelog</a>.
      </p>

      <h2>Try it</h2>
      <pre>
        <code>{`${install.cli}
export MONGODB_URI="mongodb://…"           # a replica set; with access control for --credential
argon import database --uri "$MONGODB_URI" --database shop --project shop --source-quiesced --yes
argon sandbox create -p shop --ttl 1h --credential --watch`}</code>
      </pre>
      <p>
        The sandbox&apos;s JSON output, or its notes on stdout, lists the
        indexes it built. Discard it with{" "}
        <code>argon sandbox discard -p shop -b &lt;name&gt;</code>.
      </p>
    </ArticleLayout>
  );
}
