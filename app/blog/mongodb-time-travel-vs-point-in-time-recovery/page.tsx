import ArticleLayout from '../ArticleLayout';
import { getPost } from '../posts';

const post = getPost('mongodb-time-travel-vs-point-in-time-recovery')!;

export const metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: 'article',
    siteName: 'Argon',
    url: `https://argonlabs.tech/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    publishedTime: post.date,
  },
};

const faq = [
  {
    q: 'Does MongoDB have built-in time travel?',
    a: 'Not for querying or branching past states. MongoDB offers point-in-time recovery (via Atlas continuous backup, Ops Manager, or backup tools) to restore a whole deployment to an earlier moment, but no built-in way to read or fork a past state without changing the live database. Argon adds that.',
  },
  {
    q: 'Is point-in-time recovery the same as time travel?',
    a: 'No — they solve opposite problems. PITR restores the entire deployment to a past moment; it is disaster recovery, and it replaces live data. Time travel reads or branches any past state non-destructively, so the present keeps running untouched.',
  },
  {
    q: 'Can I recover one dropped collection without restoring the whole database?',
    a: 'With PITR you typically restore the entire deployment (often to a separate cluster) and copy the collection back. With Argon time travel you branch from just before the drop and copy back only what you need — no full-cluster restore.',
  },
  {
    q: 'Does time travel replace backups?',
    a: 'No. Keep a real backup or PITR for genuine disaster recovery — hardware loss, region failure, ransomware. Time travel is for everything short of catastrophe: debugging, audits, and per-collection recovery. The two are complementary.',
  },
  {
    q: 'How far back can Argon time-travel?',
    a: 'To any point retained in the branch’s history. Argon keeps an ordered log of every operation, so any earlier state is available to query or branch from, bounded only by your retention configuration.',
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        MongoDB <strong>time travel</strong> and <strong>point-in-time recovery</strong>{' '}
        (PITR) both let you go back to an earlier state of your data — but they
        solve opposite problems. PITR is <em>disaster recovery</em>: it restores
        your whole database to a moment in the past to undo a catastrophe. Time
        travel is a <em>read and branch</em> operation: it lets you query or fork
        any past state while the present keeps running, untouched. This guide
        explains the difference, how each works under the hood, and when to reach
        for which.
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
              <td>Per branch, any point in history</td>
            </tr>
            <tr>
              <td>Effect on live data</td>
              <td>Restores / overwrites (destructive)</td>
              <td>Non-destructive — present untouched</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td>Minutes to hours</td>
              <td>Milliseconds</td>
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
        PITR is the backup-and-restore feature you turn to when something has gone
        catastrophically wrong — a bad migration, a dropped collection in
        production, ransomware. It rewinds an entire deployment to a chosen
        timestamp. Under the hood it takes periodic snapshots and continuously
        captures the oplog (the replica set’s operation log); to restore to time
        T, it loads the nearest snapshot before T and replays the oplog up to
        exactly T. MongoDB Atlas offers this as continuous cloud backup with PITR
        (restore to any second within a retention window); self-managed setups use
        Ops Manager, Percona Backup for MongoDB, or hand-rolled snapshot-plus-oplog
        replay.
      </p>
      <p>
        It is essential — and blunt. It operates on the whole database or cluster,
        it produces a restore (you typically spin up a new cluster or overwrite the
        current one), it can take minutes to hours, and everything written after
        your chosen timestamp is gone. It answers exactly one question: “get the
        entire deployment back to how it was at time T.”
      </p>

      <h2>What time travel is</h2>
      <p>
        Time travel treats history as something you can <em>read</em>, not just
        restore. Instead of rewinding the live database, you ask: “what did this
        data look like at time T?” — and get an answer without changing anything
        that’s running now. You can query a past state in place, or branch from it
        to get an isolated, writable copy rooted at that moment.
      </p>
      <p>
        Because it is non-destructive, you use it constantly rather than only in
        emergencies: reproduce a bug on last Tuesday’s data, audit what a record
        used to say, recover one accidentally-deleted collection by branching from
        just before the delete, or diff two points in time. Production keeps
        serving traffic the whole time.
      </p>

      <h2>Under the hood: oplog replay vs a write-ahead log</h2>
      <p>
        PITR reconstructs a past state by replaying the oplog on top of a snapshot
        — work proportional to how much happened, materialized into a full restored
        copy. Argon’s time travel comes from modeling the database as a{' '}
        <a href="/blog/mongodb-database-branching-explained">write-ahead log</a>{' '}
        where every operation carries a log sequence number. Any past state is just
        “replay the log up to that position,” and a branch is a pointer into shared
        history plus later writes. Reading the past costs a query, not a restore,
        and branching from a past point writes a few hundred bytes of metadata
        instead of copying gigabytes. History becomes a first-class, queryable
        dimension rather than a backup you have to rebuild.
      </p>

      <h2>They’re complementary — use both</h2>
      <p>
        This is not Argon versus Atlas. Keep PITR (or your backup of choice) for
        genuine disaster recovery — hardware loss, region failure, ransomware. That
        is what it is for, and <strong>time travel is not a backup</strong>. Reach
        for time travel for everything short of catastrophe: debugging on
        historical data, audits, per-collection recovery, safe experiments, and
        giving AI agents branchable databases. Most teams want both — a durable
        backup for the worst day, and cheap, instant history for every other day.
      </p>

      <h2>How to time-travel a MongoDB database with Argon</h2>
      <p>
        Argon keeps full history, so you can branch a database as it existed at an
        earlier point, or run recovery-style operations without a coarse
        full-cluster restore:
      </p>
      <pre>
        <code>{`# preview what restoring to an earlier point would change — non-destructive
argon restore preview main

# fork an isolated branch rooted at a past point (great for debugging or recovery)
argon restore branch main -o recovered
# ...prints a MongoDB connection string. Point any driver at it.

# reset a branch to a past point when you really mean to rewind it
argon restore reset main`}</code>
      </pre>
      <p>
        See the{' '}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">
          documentation
        </a>{' '}
        for selecting the exact point by timestamp or history position, and the{' '}
        <a href="/features">features</a> overview for how time travel fits with
        branching and merge.
      </p>
    </ArticleLayout>
  );
}
