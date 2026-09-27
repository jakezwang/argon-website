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
    a: "MongoDB supports recent snapshot reads: from MongoDB 5.0, certain reads outside transactions can use read concern snapshot with atClusterTime, within the retained snapshot-history window. Backup/PITR can restore older states when covered by backups. Argon provides a separate captured-history workflow with named branches, diffs, and reviewed merges.",
  },
  {
    q: "Is point-in-time recovery the same as time travel?",
    a: "PITR reconstructs backed-up data at a selected time into a restore target, which can be separate from the source. Scope and overwrite behavior depend on the backup product and restore mode. Argon reads or branches supported states from its retained captured history. Both can preserve the current source when used with a separate target.",
  },
  {
    q: "Can I recover one dropped collection without restoring the whole database?",
    a: "Use your backup or PITR procedure for a dropped collection. Argon capture marks unsupported drop/rename operations incomplete and refuses unsafe restoration; it must not be presented as a guaranteed recovery path for those operations.",
  },
  {
    q: "Does time travel replace backups?",
    a: "No. Keep independent backups and a tested recovery procedure for data loss, including hardware failure and ransomware. Argon can inspect or branch supported captured document states while the required history remains available. It does not cover every operation or replace backup recovery.",
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
        an earlier state of your data through different workflows. PITR
        reconstructs backed-up data at a selected time into a restore target.
        Argon time travel is a <em>read and branch</em> operation: it lets you
        query or fork a retained past state while the present keeps running,
        untouched. This guide explains the difference, how each works under the
        hood, and when to reach for which.
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
              <td>
                Cluster or selected databases/collections, where supported
              </td>
              <td>Per branch, supported retained history</td>
            </tr>
            <tr>
              <td>Effect on live data</td>
              <td>Depends on restore target and overwrite mode</td>
              <td>Non-destructive — present untouched</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td>Depends on backup, data volume and restore mode</td>
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
        production, ransomware. It reconstructs backed-up data at a chosen
        timestamp. A common approach takes periodic snapshots and continuously
        captures the oplog (the replica set’s operation log); to restore to time
        T, it loads the nearest snapshot before T and replays the oplog up to T.
        MongoDB Atlas offers{" "}
        <a href="https://www.mongodb.com/docs/atlas/backup/cloud-backup/restore-from-continuous/">
          Continuous Cloud Backup restores
        </a>{" "}
        on eligible dedicated clusters; self-managed setups use Ops Manager,
        Percona Backup for MongoDB, or hand-rolled snapshot-plus-oplog replay.
      </p>
      <p>
        Restoring to a separate target can leave the source running. A
        cluster-level Atlas restore replaces data on its target. Atlas also
        supports{" "}
        <a href="https://www.mongodb.com/docs/atlas/backup/cloud-backup/restore-from-db-coll/">
          selected database and collection restores
        </a>{" "}
        from supported backups, with create-as-new or overwrite behavior.
        Restrictions apply, including no individual time-series collection
        restores and no collection-level restores on NVMe clusters. Selective
        restoration is not a guarantee of a shorter recovery time.
      </p>

      <h2>What time travel is</h2>
      <p>
        MongoDB itself supports{" "}
        <a href="https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/">
          snapshot reads with <code>atClusterTime</code>
        </a>
        . From MongoDB 5.0, supported reads such as <code>find</code> and{" "}
        <code>aggregate</code> can use this outside transactions. The requested
        timestamp must remain in the storage engine&apos;s snapshot-history
        window. This is useful for recent consistent reads; it does not create a
        writable branch or keep an arbitrary old state indefinitely.
      </p>
      <p>
        Argon treats captured history as something you can <em>read</em> and
        branch. Instead of rewinding the live database, you ask: “what did this
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
        snapshot, producing restored data in the selected target. Argon’s time
        travel comes from modeling the database as a{" "}
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
        Keep independent backups or PITR and a tested recovery procedure for
        data loss. <strong>Time travel is not a backup.</strong> Use Argon to
        inspect or branch supported captured document states for debugging,
        audits, or experiments while the required history remains available.
        Recovery through undo also requires complete images and a supported
        write range; it can refuse incomplete or conflicting history. Use your
        backup recovery procedure for unsupported operations such as collection
        drops or renames.
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
