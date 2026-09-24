import { limits } from "../../product";
import cli from "../../cli-examples.json";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("mongodb-time-travel-vs-point-in-time-recovery")!;

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
    q: "Does MongoDB have built-in time travel?",
    a: "Not for querying or branching past states. MongoDB offers point-in-time recovery (via Atlas continuous backup, Ops Manager, or backup tools) to restore a whole deployment to an earlier moment, but no built-in way to read or fork a past state without changing the live database. Argon adds that.",
  },
  {
    q: "Is point-in-time recovery the same as time travel?",
    a: "No — they solve opposite problems. PITR restores the entire deployment to a past moment; it is disaster recovery, and it replaces live data. Time travel reads or branches a retained past state non-destructively, so the present keeps running untouched.",
  },
  {
    q: "Can I recover one dropped collection without restoring the whole database?",
    a: "Use your backup or PITR procedure for a dropped collection. Argon capture marks unsupported drop/rename operations incomplete and refuses unsafe restoration; it must not be presented as a guaranteed recovery path for those operations.",
  },
  {
    q: "Does time travel replace backups?",
    a: "No. Keep a real backup or PITR for genuine disaster recovery — hardware loss, region failure, ransomware. Time travel is for everything short of catastrophe: debugging, audits, and per-collection recovery. The two are complementary.",
  },
  {
    q: "How far back can Argon time-travel?",
    a: `${limits.retention} ${limits.undo}`,
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        MongoDB <strong>time travel</strong> and{" "}
        <strong>point-in-time recovery</strong> (PITR) both let you go back to
        an earlier state of your data — but they solve opposite problems. PITR
        is <em>disaster recovery</em>: it restores your whole database to a
        moment in the past to undo a catastrophe. Time travel is a{" "}
        <em>read and branch</em> operation: it lets you query or fork a retained
        past state while the present keeps running, untouched. This guide
        explains the difference, how each works under the hood, and when to
        reach for which.
      </p>

      <h2>The short version</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Point-in-time recovery (PITR)</th>
              <th>Time travel (Argon)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Purpose</td>
              <td>Disaster recovery</td>
              <td>Debugging, audit, recovery, experiments</td>
            </tr>
            <tr>
              <td>Granularity</td>
              <td>Whole cluster / deployment</td>
              <td>Per branch, supported retained history</td>
            </tr>
            <tr>
              <td>Effect on live data</td>
              <td>Restore to another or existing deployment</td>
              <td>Non-destructive — present untouched</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td>Minutes to hours</td>
              <td>Depends on history, query and checkout size</td>
            </tr>
            <tr>
              <td>Access pattern</td>
              <td>Restore, then use</td>
              <td>Query at a point, or branch from it</td>
            </tr>
            <tr>
              <td>Typical tools</td>
              <td>Atlas backup, Ops Manager, PBM, oplog + snapshots</td>
              <td>Argon</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What point-in-time recovery is</h2>
      <p>
        PITR is the backup-and-restore feature you turn to when something has
        gone catastrophically wrong — a bad migration, a dropped collection in
        production, ransomware. It rewinds an entire deployment to a chosen
        timestamp. Under the hood it takes periodic snapshots and continuously
        captures the oplog (the replica set’s operation log); to restore to time
        T, it loads the nearest snapshot before T and replays the oplog up to
        exactly T. MongoDB Atlas offers this as continuous cloud backup with
        PITR (restore to any second within a retention window); self-managed
        setups use Ops Manager, Percona Backup for MongoDB, or hand-rolled
        snapshot-plus-oplog replay.
      </p>
      <p>
        It is essential — and blunt. It operates on the whole database or
        cluster, it produces a restore (you typically spin up a new cluster or
        overwrite the current one), it can take minutes to hours, and the
        restored copy does not include writes after the chosen timestamp. It
        answers exactly one question: “get the entire deployment back to how it
        was at time T.”
      </p>

      <h2>What time travel is</h2>
      <p>
        Time travel treats history as something you can <em>read</em>, not just
        restore. Instead of rewinding the live database, you ask: “what did this
        data look like at time T?” — and get an answer without changing anything
        that’s running now. You can query a past state in place, or branch from
        it to get an isolated, writable copy rooted at that moment.
      </p>
      <p>
        Because it is non-destructive, you use it constantly rather than only in
        emergencies: reproduce a bug on last Tuesday’s data, audit what a record
        used to say, inspect retained document states, or compare past changes.
        Unsupported collection drops and renames mark capture incomplete; use
        your backup recovery procedure for those cases.
      </p>

      <h2>Under the hood: oplog replay vs a write-ahead log</h2>
      <p>
        PITR reconstructs a past state by replaying the oplog on top of a
        snapshot — work proportional to how much happened, materialized into a
        full restored copy. Argon’s time travel comes from modeling the database
        as a{" "}
        <a href="/blog/mongodb-database-branching-explained">write-ahead log</a>{" "}
        where supported captured operations carry log sequence numbers. A
        retained state is just “replay the log up to that position,” and a
        branch is a pointer into shared history plus later writes. Reading the
        past costs a query, not a full-cluster restore; its cost depends on the
        retained history. Branch metadata is lightweight, while checking it out
        copies the materialized dataset into MongoDB. History becomes a
        first-class, queryable dimension rather than a backup you have to
        rebuild.
      </p>

      <h2>They’re complementary — use both</h2>
      <p>
        This is not Argon versus Atlas. Keep PITR (or your backup of choice) for
        genuine disaster recovery — hardware loss, region failure, ransomware.
        That is what it is for, and <strong>time travel is not a backup</strong>
        . Reach for time travel for everything short of catastrophe: debugging
        on historical data, audits, per-collection recovery, safe experiments,
        and giving AI agents branchable databases. Most teams want both — a
        durable backup for recovery, and queryable retained history for daily
        work.
      </p>

      <h2>How to time-travel a MongoDB database with Argon</h2>
      <p>
        First complete the <a href="/quickstart">local setup</a> and use a
        project named <code>docs-review</code> with healthy capture and retained
        history. Before the experiment, save its current LSN with the first
        command. After the experiment, preview that state and fork a new branch
        without resetting the source:
      </p>
      <pre>
        <code data-cli-example="restore">{`# Save a baseline before the experiment (Python 3 is used to parse JSON)
${cli.baseline}

# After the experiment, preview and fork the retained baseline
${cli.restorePreview}
${cli.restoreBranch}

# Materialize recovered into MongoDB; this prints its connection string
${cli.checkoutRecovered}`}</code>
      </pre>
      <p>
        See the{" "}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">
          documentation
        </a>{" "}
        for selecting a retained point with <code>--lsn</code> or{" "}
        <code>--time</code>. Keep a separate{" "}
        <code>argon watch -p docs-review -b recovered</code>
        process running if you write to the recovered database. See the{" "}
        <a href="/features">features</a> overview for how time travel fits with
        branching and merge.
      </p>
    </ArticleLayout>
  );
}
