import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("branch-live-mongodb-write-back")!;

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

const report =
  "https://github.com/argon-lab/benchmarks/tree/main/reports/2026-11-19-v2.8.0-live-source-walkthrough";
const transcript =
  "https://github.com/argon-lab/benchmarks/blob/main/reports/2026-11-19-v2.8.0-live-source-walkthrough/transcript.txt";
const operations =
  "https://github.com/argon-lab/argon/blob/v2.8.0/docs/OPERATIONS.md#following-a-source-database";
const writeBackDocs =
  "https://github.com/argon-lab/argon/blob/v2.8.0/docs/OPERATIONS.md#writing-a-plan-back-to-the-source";
const changelog = "https://github.com/argon-lab/argon/blob/v2.8.0/CHANGELOG.md";
const embedded =
  "https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/";

const faq = [
  {
    q: "Can Argon branch a MongoDB database that is in use?",
    a: "Yes, from Argon 2.7.0. argon import database --online imports a replica-set database while applications keep writing to it, and argon source follow keeps Argon's main branch current from the source's change stream. Sandboxes are forked from that branch. The source has to be a replica set; a sharded cluster behind mongos is refused and a standalone has no change stream.",
  },
  {
    q: "Does the application have to stop writing during the import?",
    a: "No. The import copies the collections and then replays the source's change stream until it has passed everything the copy read, and reports the cluster time at which the result equals the source. In our run an application thread made 144 writes during the import.",
  },
  {
    q: "How does Argon write a reviewed change back to the source database?",
    a: "From Argon 2.8.0, argon merge apply <plan> --write-back --approve <digest> writes a saved plan to the source in one transaction. Every replacement and delete is compared byte for byte with the before-image saved at review, every insert requires an absent key, and each written document is read back before commit. One mismatch aborts the whole batch.",
  },
  {
    q: "What happens if someone changes a document after the plan was reviewed?",
    a: "The write-back aborts and writes nothing. In our run a plan covered two orders, one of them was edited on the source after the review, and neither was written. A fresh preview after following caught up showed one change and one conflict.",
  },
  {
    q: "Does Argon write anything else to the source database?",
    a: "No. Importing and following only read. The only writes Argon makes to a source are write-back transactions and, if you ask for it by name, the experimental --enable-source-images option.",
  },
  {
    q: "What are the limits of write-back in Argon 2.8.0?",
    a: "It has been tested on MongoDB 7.0 replica sets only, not on Atlas, deployments with access control, multi-member elections or sharded sources. A document replaced by a write-back gets the field order it had in the sandbox, which can differ from the order it had on the source. Plans saved by 2.7.0 need a fresh preview. The REST API, the console and the MCP server do not offer write-back.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        Argon gives AI agents and developers MongoDB sandboxes: a copy of your
        data to work in, a diff to read, and a merge you approve. Until now the
        copy started from an import that needed your writers paused, and the
        approved merge landed in Argon, not in your database.
      </p>
      <p>
        Two releases changed that. From <strong>Argon 2.7.0</strong> you can
        import a MongoDB database while it is being written and keep following
        it. From <strong>Argon 2.8.0</strong> you can write a reviewed change
        back to that database. This post runs the whole path on a database that
        never stops taking writes, shows what is refused, and lists the limits.
        It is for teams that already run MongoDB and want a safe place for an
        agent or a developer to try a change against current data.
      </p>
      <pre>
        <code>{`running MongoDB ──online import──▶ main ──fork──▶ sandbox ──▶ diff ──▶ reviewed plan
       ▲              (follows the source)                                    │
       └──────────────── write-back, one transaction, with approval ──────────┘`}</code>
      </pre>

      <h2>What we ran</h2>
      <ul>
        <li>
          <strong>Argon 2.8.0</strong>, the binary that{" "}
          <code>npm install -g argonctl@2.8.0</code> installs.
        </li>
        <li>
          Two <strong>MongoDB 7.0.45</strong> deployments, each a one-member
          replica set without access control, in containers on one laptop. One
          holds the source database <code>shop</code>. The other holds
          Argon&apos;s metadata and its sandboxes.
        </li>
        <li>
          The source has 50,000 orders and 200 customers. A thread plays the
          application for the whole run: it inserts a new order or updates an
          existing one, sleeps 5 ms, and repeats. It made 2,498 writes in all.
          We paused it twice, only to compare the source with a sandbox while
          the source stood still.
        </li>
      </ul>
      <p>
        This is a walkthrough with a transcript, not a benchmark. The few
        timings below are single observations. Every command and its output is
        in <a href={transcript}>the transcript</a>, and{" "}
        <a href={report}>the report</a> has the script that produced it.
      </p>

      <h2>Step 1: import while the application writes</h2>
      <pre>
        <code>{`export ARGON_SOURCE_URI="mongodb://…"      # used per command, never stored
argon import database --database shop --project shop --online --yes`}</code>
      </pre>
      <pre>
        <code>{`   Documents Imported: 50.3K
   Duration: 868.050209ms
   Consistent: LSN 50348 is the source at cluster time Timestamp(1795093601, 130)
   LSNs below 50348 are the copy in progress, not states the source was in.
   main follows database 'shop'; keep it current with: argon source follow -p <project>`}</code>
      </pre>
      <p>
        The application made 144 writes while that command ran. A cursor reads
        different documents at different moments, so a plain copy of a database
        that is being written is not a state the database was ever in. The
        online import takes the source&apos;s cluster time, copies the
        collections, then replays the source&apos;s change stream until it has
        passed everything the copy read. What it publishes is the source at one
        cluster time, and it tells you which.
      </p>
      <p>
        The source has to be a replica set. A sharded cluster behind mongos is
        refused. Indexes, validators and collection options are not copied.
      </p>

      <h2>Step 2: follow</h2>
      <pre>
        <code>{`argon source follow -p shop
argon source status -p shop`}</code>
      </pre>
      <pre>
        <code>{`Project shop: main follows database "shop"
  Source:      mongodb://argon-wbpost-source:27017/shop (replica set src0)
  Identity:    replica-set ID
  Health:      healthy (exact)
  Checkpoint:  The branch head is a verified exact source checkpoint.
  Consistent:  LSN 51545 is the source at Timestamp(1795093610, 45)
  Last change: 2026-11-19T13:06:50Z (stored 8 ms after it happened)`}</code>
      </pre>
      <p>
        <code>argon source follow</code> is a process you keep running. It reads
        the source&apos;s change stream and applies it to <code>main</code>, a
        whole cluster time at a time, so a transaction is never half visible. If
        it stops, it resumes from its saved position. It reads the source and
        writes nothing to it.
      </p>
      <p>
        With the application writing, the last change was stored 8 ms after it
        happened. On an idle source it is slower: when we paused the
        application, its newest write was stored 12.6 seconds later. The last
        change waits for the next entry in MongoDB&apos;s oplog, and an idle
        MongoDB writes one every ten seconds. The{" "}
        <a href={operations}>operations guide</a> gives that wait as ten to
        twenty seconds.
      </p>

      <h2>Step 3: a sandbox from current data</h2>
      <pre>
        <code>{`argon sandbox create -p shop --name agent-1 --watch --actor agent-1`}</code>
      </pre>
      <pre>
        <code>{`Sandbox "agent-1" forked from main at LSN 51550.
Expires: 2026-11-19T14:07:04Z
Connection string:
  mongodb://argon-wbpost-meta:27017/argon_br_6afef4784065642e523e46b5?replicaSet=rs0
Capturing writes (Ctrl-C to stop)...`}</code>
      </pre>
      <p>
        A sandbox is a real MongoDB database on Argon&apos;s deployment, not on
        the source. The agent gets its connection string and nothing else. It is
        a full physical copy, so it takes longer and uses more storage as the
        data grows.
      </p>
      <p>
        We checked that a sandbox holds what the source holds. With the
        application paused, a sandbox forked from <code>main</code> had the same
        50,608 orders and 200 customers as the source, with the same values in
        every document.
      </p>
      <p>
        <strong>The bytes were not the same.</strong> In 50,547 of the 50,608
        orders the fields were in a different order in the sandbox than on the
        source. This matters in step 5.
      </p>

      <h2>Step 4: the agent works, and you read the diff</h2>
      <p>
        Through the sandbox&apos;s connection string, our stand-in agent marked
        one order as refunded, inserted a refund order and deleted another
        order.
      </p>
      <pre>
        <code>{`$ argon diff -p shop -b agent-1
Merging agent-1 → main
  delete orders/order-000017
  put    orders/order-000042
  put    orders/order-000042-refund
3 change(s), 0 conflict(s)`}</code>
      </pre>
      <p>
        <code>argon merge preview -p shop -b agent-1 -o json</code> saves that
        as a plan and prints it in full: for each change the document as it will
        be written, the document as it was at review, and at the end a digest of
        the whole plan.
      </p>
      <pre>
        <code>{`    "id": "6afef478f3411167fd812ec4",
    "followed_database": "shop",
    "approval_digest": "3bcc31356109437f4a4f02ad1826aa05882e087f8ce2afe3accaf2f4294a3da8"`}</code>
      </pre>
      <p>
        The digest is bound to the plan&apos;s contents. It appears only in the
        CLI&apos;s JSON output, next to the images it covers, so the way to get
        it is to open the thing you are approving.
      </p>

      <h2>Step 5: write it back</h2>
      <pre>
        <code>{`$ argon merge apply 6afef478f3411167fd812ec4 --write-back --approve 3bcc31356109437f4a4f02ad1826aa05882e087f8ce2afe3accaf2f4294a3da8
Written to the source database: 3 change(s) in one transaction.
main shows them once following has read them from the source (argon source status).`}</code>
      </pre>
      <p>Inside that one transaction on the source, Argon:</p>
      <ul>
        <li>
          compares each document it is about to replace or delete, byte for
          byte, with the before-image saved in the plan;
        </li>
        <li>requires that each key it is about to insert is absent;</li>
        <li>
          after all writes and before commit, reads every document back and
          compares it byte for byte with the approved image, or confirms the
          deletion.
        </li>
      </ul>
      <p>
        One mismatch rolls back the batch. <code>main</code> is not written by
        the write-back. It receives the change the way it receives every other
        change to the source, through following.
      </p>
      <p>
        On the source afterwards, the order was refunded, the refund order
        existed and the deleted order was gone. At the end of the run the source
        held 51,060 orders: the 50,000 it started with, 1,060 the application
        inserted, one the plan inserted, less one the plan deleted. A new
        sandbox forked from <code>main</code> again had the same values as the
        source.
      </p>
      <p>
        <strong>The replaced order came back with its fields reordered.</strong>{" "}
        Write-back writes the document as the sandbox held it, and step 3 showed
        that a sandbox does not keep the source&apos;s field order.
      </p>
      <pre>
        <code>{`[field order of order-000042 on the source before: _id, status, customer, total_cents, items, placed_at, touches]
[field order of order-000042 on the source after: _id, touches, customer, items, placed_at, status, total_cents, refund_cents]`}</code>
      </pre>
      <p>
        The values are what was approved, and the approved image in the plan
        shows this order, so it is visible at review. It reached inside the{" "}
        <code>items</code> array too. Most applications never notice field
        order. Some do: MongoDB&apos;s{" "}
        <a href={embedded}>equality match on a whole embedded document</a>{" "}
        depends on it. Only documents a plan replaces are affected. We count
        this as a defect, and a fix is in progress.
      </p>

      <h2>What is refused</h2>
      <p>
        We tried five things that should not work. The first four came before
        the write-back above, and after them the three documents on the source
        were as they had been.
      </p>
      <p>Write-back without an approval:</p>
      <pre>
        <code>{`$ argon merge apply 6afef478f3411167fd812ec4 --write-back
Error: --write-back requires --approve with a 64-character lowercase hex digest; run argon merge list -p <project> --output json and pass that plan's approval_digest with --approve. For an older plan, preview again with this version`}</code>
      </pre>
      <p>A digest that is not this plan&apos;s:</p>
      <pre>
        <code>{`Error: approval digest does not match the saved plan; run argon merge list -p <project> --output json and pass that plan's approval_digest with --approve. For an older plan, preview again with this version`}</code>
      </pre>
      <p>The right digest, pointed at a different deployment:</p>
      <pre>
        <code>{`Error: write-back failed: the connection leads to a different deployment than the one this project follows (mongodb://argon-wbpost-source:27017/shop)`}</code>
      </pre>
      <p>
        An ordinary merge into <code>main</code>, which would leave it holding
        documents its source does not:
      </p>
      <pre>
        <code>{`Error: apply failed: merge apply refused: branch main follows the external database "shop" and only changes when that database does; write to a sandbox forked from it, inspect the lossless images with \`argon merge list -p <project> --output json\` and write the plan to the source with \`argon merge apply <plan> --write-back --approve <digest>\`, or stop following with \`argon source detach\``}</code>
      </pre>
      <p>The same plan a second time:</p>
      <pre>
        <code>{`Error: merge plan is applied, not pending`}</code>
      </pre>

      <h2>When someone else changed the document first</h2>
      <p>
        A review takes time, and production does not wait. In a second sandbox
        the agent cancelled two orders, and we previewed the plan. Then,
        directly on the source, we marked one of the two as shipped. Then we
        applied the plan with its correct digest.
      </p>
      <pre>
        <code>{`Error: write-back failed: write-back aborted, nothing was written: document orders/order-000051 in the source database differs from the state this plan was reviewed against. Let following catch up and run preview again`}</code>
      </pre>
      <p>
        Neither order was written. The one nobody else had touched still said{" "}
        <code>paid</code> on the source, and the plan stayed pending. Once
        following had stored the concurrent edit, a fresh preview said what a
        reviewer needs to know:
      </p>
      <pre>
        <code>{`$ argon merge preview -p shop -b agent-2
Merging agent-2 → main
  put    orders/order-000050
  CONFLICT orders/order-000051 (both sides changed since the fork)
1 change(s), 1 conflict(s)`}</code>
      </pre>

      <h2>What it took to switch write-back on</h2>
      <p>
        Write-back first shipped switched off, behind an experimental flag, and
        was switched on in 2.8.0 after its checks were tightened.{" "}
        <a href={changelog}>The 2.8.0 changelog</a> lists what changed. Two
        examples of what the byte-for-byte rule caught:
      </p>
      <ul>
        <li>
          <strong>A timestamp MongoDB rewrites.</strong> MongoDB replaces a
          top-level BSON timestamp of zero with the current time when a document
          is inserted or replaced. A document carrying one can never read back
          as approved, so such a plan is refused before anything is claimed.
        </li>
        <li>
          <strong>
            A document whose <code>_id</code> is not first.
          </strong>{" "}
          MongoDB stores <code>_id</code> as the first field whatever order it
          was sent in. Plans now save their images with <code>_id</code> first,
          and an older plan with a field ahead of it has to be previewed again.
        </li>
      </ul>

      <h2>What Argon does to your source</h2>
      <p>
        Importing, following and resync read the source. The only writes Argon
        makes to it are write-back transactions and, if you ask for it by name,{" "}
        <code>--enable-source-images</code>. Argon stores which deployment and
        database a project follows, not how to log in: every command that
        reaches the source takes the connection string again and checks it
        against the replica-set ID recorded at import.
      </p>
      <p>
        Reading and following need <code>find</code> and{" "}
        <code>changeStream</code> on the database. Write-back also needs{" "}
        <code>readWrite</code>, and the import has to be made by a user allowed
        to run <code>replSetGetConfig</code>, so that the replica-set ID is
        recorded.
      </p>

      <h2>Limits</h2>
      <ul>
        <li>
          <strong>Tested on MongoDB 7.0 replica sets only.</strong> Write-back
          has not been tested on Atlas, on deployments with access control,
          through an election in a multi-member set, on sharded sources, or on
          other MongoDB versions. Our run used one-member replica sets without
          access control.
        </li>
        <li>
          <strong>Field order.</strong> A document replaced by a write-back gets
          the field order it had in the sandbox, as shown above.
        </li>
        <li>
          <strong>Two options are still experimental.</strong>{" "}
          <code>--auto-resync</code> and <code>--enable-source-images</code> are
          off by default and need <code>ARGON_EXPERIMENTAL_SOURCE=1</code>.
        </li>
        <li>
          <strong>Plans saved by 2.7.0 need a fresh preview</strong> before they
          can be written back.
        </li>
        <li>
          <strong>The CLI only.</strong> The REST API, the console and the MCP
          server do not offer write-back.
        </li>
        <li>
          <strong>One plan, one 16 MiB document.</strong> A larger change has to
          be split into smaller plans.
        </li>
        <li>
          <strong>A sandbox is a full copy</strong>, and a new sandbox starts
          from where following has got to, which on an idle source can be ten to
          twenty seconds behind.
        </li>
        <li>
          <strong>Undo is another write-back.</strong> <code>argon undo</code>{" "}
          does not apply to a branch that follows a source.
        </li>
        <li>
          <strong>A known limitation in 2.8.0.</strong> If a collection on a
          followed branch used the deprecated BSON binary subtype 2 for both an
          empty <code>_id</code> and one of four zero bytes, a read at an old
          position can omit a row after history written by 2.7.0 has been
          garbage-collected. The changelog has the repair.
        </li>
      </ul>
      <p>
        The <a href={writeBackDocs}>operations guide</a> has the full contract,
        including what happens when the outcome of a commit is unknown.
      </p>

      <h2>Try it</h2>
      <pre>
        <code>{`npm install -g argonctl@2.8.0
export MONGODB_URI="mongodb://…"           # Argon's own replica set
export ARGON_SOURCE_URI="mongodb://…"      # used per command, never stored
argon import preview  --database myapp --online
argon import database --database myapp --project myapp --online --yes
argon source follow -p myapp               # keep main current from here on
argon sandbox create -p myapp --watch
argon merge preview -p myapp -b <sandbox> --output json
argon merge apply <plan-id> --write-back --approve <approval_digest>`}</code>
      </pre>
      <p>
        Start with a copy of production, or a staging database, and read the
        limits first. To repeat our run on your machine, the script is in{" "}
        <a href={report}>the report</a>.
      </p>
    </ArticleLayout>
  );
}
