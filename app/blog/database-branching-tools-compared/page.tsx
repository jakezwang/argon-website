import ArticleLayout from '../ArticleLayout';
import { getPost } from '../posts';

const post = getPost('database-branching-tools-compared')!;

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
    q: 'Is there a Neon for MongoDB?',
    a: 'Argon is the closest equivalent. Neon brings branching and time travel to Postgres; Argon brings branching, time travel, and merge to MongoDB, as an open-source, self-hosted engine.',
  },
  {
    q: 'What is the difference between Dolt and Argon?',
    a: 'Dolt is a MySQL-compatible SQL database with Git-style versioning built in — you adopt Dolt as your database. Argon adds branching and versioning to MongoDB without replacing it: you keep MongoDB and connect any driver to a branch.',
  },
  {
    q: 'Does Neon or PlanetScale work with MongoDB?',
    a: 'No. Neon is Postgres and PlanetScale is MySQL. Neither supports MongoDB. For branching a MongoDB (document) database, Argon is the tool built for that data model.',
  },
  {
    q: 'Which database branching tools are open source?',
    a: 'Neon, Dolt, lakeFS, and Argon are open source; Argon is MIT-licensed and self-hosted. PlanetScale is a proprietary managed service. Always check each project’s current license, as they change over time.',
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        “Database branching” has quietly become a category. Postgres has{' '}
        <strong>Neon</strong>, MySQL has <strong>PlanetScale</strong>, the SQL
        world has <strong>Dolt</strong>, data lakes have <strong>lakeFS</strong>,
        and MongoDB has <a href="https://github.com/argon-lab/argon">Argon</a>.
        They all borrow the same idea from Git — cheap branches, a history you
        can rewind, and a review step before changes land — but they apply it to
        very different data. This guide maps how they compare and which one fits
        MongoDB.
      </p>

      <h2>The short version</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Data model</th>
              <th>Branch</th>
              <th>Merge</th>
              <th>Time travel</th>
              <th>Open source</th>
              <th>Agent-native</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Neon</td>
              <td>Postgres</td>
              <td>Yes (copy-on-write)</td>
              <td>No native branch merge</td>
              <td>History / point-in-time restore</td>
              <td>Yes (Apache 2.0)</td>
              <td>No</td>
            </tr>
            <tr>
              <td>PlanetScale</td>
              <td>MySQL (Vitess)</td>
              <td>Yes (schema branches)</td>
              <td>Deploy requests (schema)</td>
              <td>No</td>
              <td>No (proprietary)</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Dolt</td>
              <td>MySQL-compatible SQL</td>
              <td>Yes</td>
              <td>Yes</td>
              <td>Yes (as-of queries)</td>
              <td>Yes (Apache 2.0)</td>
              <td>No</td>
            </tr>
            <tr>
              <td>lakeFS</td>
              <td>Data lake / object store</td>
              <td>Yes</td>
              <td>Yes</td>
              <td>Yes (commits)</td>
              <td>Yes (Apache 2.0)</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Argon</td>
              <td>MongoDB (documents)</td>
              <td>Yes</td>
              <td>Yes (reviewable data PRs)</td>
              <td>Yes (query at any point)</td>
              <td>Yes (MIT)</td>
              <td>Yes (MCP, sandboxes, pins)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Capabilities move quickly, so treat this as a starting map rather than a
        spec sheet, and check each project for current details. What does not
        change is the axis that matters most: <strong>what each tool branches</strong>.
      </p>

      <h2>Neon — branching for Postgres</h2>
      <p>
        Neon separates storage from compute and makes a branch a copy-on-write
        fork of your Postgres data. Branches are near-instant and cheap, which is
        why teams use them for preview environments and per-pull-request
        databases. Neon focuses on the branch-and-throw-away workflow; it does
        not merge one branch’s data changes back into another the way you merge
        code. If you are on Postgres, Neon is the obvious choice.
      </p>

      <h2>PlanetScale — schema branches for MySQL</h2>
      <p>
        PlanetScale, built on Vitess, made its name with <em>schema</em>{' '}
        branching: you branch the database to make schema changes, then open a
        “deploy request” to merge those changes back to production without
        blocking writes. It is a strong fit for MySQL schema workflows at scale.
        Its branching is oriented around schema and deploys rather than
        general-purpose data branches, and it is a proprietary managed service.
      </p>

      <h2>Dolt — “Git for data”</h2>
      <p>
        Dolt is a SQL database that is versioned like a Git repository:{' '}
        <code>dolt branch</code>, <code>dolt merge</code>, <code>dolt diff</code>,
        and commit history are first-class. The catch is that Dolt <em>is</em>{' '}
        your database — you adopt a MySQL-compatible engine to get the
        versioning. That is exactly right for some workloads and a non-starter
        for teams already committed to another database.
      </p>

      <h2>lakeFS — version control for data lakes</h2>
      <p>
        lakeFS brings Git-like branches, commits, and merges to object storage
        (S3 and friends), so data engineers can branch a data lake, run a
        pipeline in isolation, and merge results atomically. It operates at the
        file/object level over a lake rather than at the record level inside an
        operational database — a different layer of the stack from the others
        here.
      </p>

      <h2>Argon — branching for MongoDB</h2>
      <p>
        Argon fills the MongoDB-shaped hole in this list. It models a MongoDB
        database as a write-ahead log, so a branch is a pointer into shared
        history rather than a copy of your documents: instant to create, cheap to
        keep, and rewindable to any earlier point. You can{' '}
        <a href="/blog/mongodb-database-branching-explained">diff two branches</a>,
        review the change as a data PR, and merge exactly-once, with conflicts
        reported rather than resolved silently.
      </p>
      <p>
        Two things set it apart. First, it does not replace MongoDB — checking
        out a branch hands you an ordinary connection string, so any driver,
        mongosh, or Compass just works. Second, it is <strong>agent-native</strong>:
        an <a href="/agents">MCP server</a>, TTL sandboxes, and reproducible
        dataset pins make it the natural place to give an AI agent its own
        database. It is open source under the MIT license and self-hosted.
      </p>

      <h2>Which should you pick?</h2>
      <ul>
        <li>
          <strong>On Postgres?</strong> Neon. <strong>On MySQL and want schema
          deploys?</strong> PlanetScale.
        </li>
        <li>
          <strong>Want the database itself to be versioned like Git?</strong>{' '}
          Dolt.
        </li>
        <li>
          <strong>Versioning a data lake?</strong> lakeFS.
        </li>
        <li>
          <strong>On MongoDB — or giving AI agents disposable databases?</strong>{' '}
          <a href="https://github.com/argon-lab/argon">Argon</a>.
        </li>
      </ul>
      <p>
        The category is converging on a simple expectation: your data should be
        as branchable as your code. Pick the tool that speaks your database.
      </p>
    </ArticleLayout>
  );
}
