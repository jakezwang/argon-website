import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";
import LaterReleasesNote from "../../components/LaterReleasesNote";

const post = getPost("database-branching-tools-compared")!;

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
    q: "Is there a Neon-style branching workflow for MongoDB?",
    a: "Argon provides branching, retained-history reads, reviewed merge, and undo for MongoDB. It is a self-hosted engine, not a managed Postgres service. A lightweight branch must be checked out into a physical MongoDB database before native drivers can query it.",
  },
  {
    q: "What is the difference between Argon and DumboDB?",
    a: "Both version MongoDB-style documents. Argon keeps history beside a stock MongoDB replica set and copies a branch into a real database when you check it out. DumboDB is DoltHub's own document database: it speaks the MongoDB wire protocol, stores branches in shared storage, and its README describes it as pre-1.0. With Argon, MongoDB itself runs every query and each checked-out branch is a full copy. With DumboDB, branches share storage, so branch, diff, and merge work is tied to the size of the change, and queries run on DumboDB's engine.",
  },
  {
    q: "Does PlanetScale only support MySQL?",
    a: "No. PlanetScale offers both Vitess (MySQL-compatible) and Postgres. Their branch workflows differ: Vitess supports schema deploy requests; Postgres provides isolated deployments, including branches restored from backups. Neither of those offerings is MongoDB.",
  },
  {
    q: "Can AI agents use Neon as well as Argon?",
    a: "Yes. Neon provides an MCP server and agent integrations for Postgres. Argon provides MCP tools and a Python SDK for MongoDB sandbox, history, and review workflows. Choose for your database and operating requirements; MCP support alone is not an exclusive differentiator.",
  },
  {
    q: "Does database branching replace backups?",
    a: "No. Branches are useful for isolated work and review. Keep an independent backup and recovery strategy. Argon historical reads and undo require complete capture and retained history; physical checkout also consumes time and storage.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <h2>The short answer</h2>
      <p>
        Choose a branching tool by the data it operates on and the change you
        need to review. Neon branches Postgres; PlanetScale has separate Vitess
        and Postgres workflows; Dolt versions a SQL database; lakeFS versions
        objects in a data lake. For MongoDB-style documents there are two
        designs: Argon adds branch history and reviewed document changes to a
        MongoDB deployment you already run, and DumboDB is a separate document
        database with version control built into its storage. These products
        solve related, but different, problems.
      </p>
      <p>
        This comparison is written by the Argon maintainers. The linked primary
        documentation was checked on November 17, 2026, when DumboDB was added.
        It is a workflow comparison, not a performance benchmark or an
        exhaustive product ranking.
      </p>

      <h2>What each tool branches</h2>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            Database branching workflows and their review boundaries
          </caption>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Data model</th>
              <th scope="col">Branch workflow</th>
              <th scope="col">Review boundary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Neon</th>
              <td>Postgres</td>
              <td>Copy-on-write database branches</td>
              <td>
                Isolated development; evaluate schema migration separately
              </td>
            </tr>
            <tr>
              <th scope="row">PlanetScale Vitess</th>
              <td>MySQL-compatible</td>
              <td>Schema branches</td>
              <td>Schema deploy requests</td>
            </tr>
            <tr>
              <th scope="row">PlanetScale Postgres</th>
              <td>Postgres</td>
              <td>Isolated deployments, empty or restored from backup</td>
              <td>
                Apply schema changes separately; no automated schema merge
                between branches
              </td>
            </tr>
            <tr>
              <th scope="row">Dolt</th>
              <td>MySQL-compatible SQL</td>
              <td>Versioned tables and schema</td>
              <td>Git-style diff, commit, branch, and merge</td>
            </tr>
            <tr>
              <th scope="row">DumboDB</th>
              <td>MongoDB-compatible documents, in its own engine</td>
              <td>Commits and branches that share storage</td>
              <td>
                Document diff, commit, and merge with per-document conflict
                resolution
              </td>
            </tr>
            <tr>
              <th scope="row">lakeFS</th>
              <td>Object storage</td>
              <td>Versioned object collections</td>
              <td>Commits and merges at the object level</td>
            </tr>
            <tr>
              <th scope="row">Argon</th>
              <td>MongoDB documents</td>
              <td>Metadata branches with physical database checkout</td>
              <td>Document diff and explicitly applied merge plans</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Neon: Postgres branches and agent tooling</h2>
      <p>
        Neon uses copy-on-write branches for separate Postgres environments. It
        also provides an MCP server and agent integrations. AI tooling is
        therefore not unique to Argon: the database and review semantics matter.
        See{" "}
        <a href="https://neon.com/docs/introduction/branching">
          Neon branching
        </a>{" "}
        and{" "}
        <a href="https://neon.com/docs/ai/ai-rules-neon-toolkit">
          Neon agent integrations
        </a>
        .
      </p>

      <h2>PlanetScale: distinguish Vitess from Postgres</h2>
      <p>
        PlanetScale Vitess uses schema branches and deploy requests. PlanetScale
        Postgres provides isolated deployments that can start empty or be
        restored from a backup; schema changes are applied separately rather
        than automatically merged between branches. Calling all PlanetScale
        branches “MySQL schema branches” misses the Postgres offering. See{" "}
        <a href="https://planetscale.com/docs/vitess/schema-changes/branching">
          Vitess branching
        </a>{" "}
        and{" "}
        <a href="https://planetscale.com/docs/postgres/branching">
          Postgres branching
        </a>
        .
      </p>

      <h2>Dolt: a versioned SQL database</h2>
      <p>
        Dolt combines a MySQL-compatible database with Git-style operations on
        tables and schema. Choosing it means adopting a versioned SQL engine; it
        does not add versioning to an existing MongoDB deployment. See{" "}
        <a href="https://www.dolthub.com/docs/introduction/what-is-dolt/">
          What is Dolt?
        </a>
        .
      </p>

      <h2>DumboDB: a versioned document database</h2>
      <p>
        DumboDB is DoltHub&apos;s document database. It implements the MongoDB
        8.0 wire protocol in its own engine, on the storage engine Dolt uses, so
        branches and commits share storage instead of copying it. A connection
        selects a branch by database name, such as <code>mydb@feature</code>,
        and custom commands commit, diff, and merge, with conflicts resolved one
        document at a time.
      </p>
      <p>
        Choosing it means your queries run on DumboDB&apos;s engine rather than{" "}
        <code>mongod</code>: as the database itself, or as a non-voting member
        that replicates from a MongoDB replica set. Its README describes it as
        pre-1.0 and not yet ready for production, and lists what it does not
        support, including TTL indexes, capped collections, and Atlas Search.
        See{" "}
        <a href="https://github.com/dolthub/dumbodb#readme">
          the DumboDB README
        </a>
        . DoltHub published{" "}
        <a href="https://www.dolthub.com/blog/2026-11-10-argon-spotlight/">
          a comparison of DumboDB and Argon
        </a>{" "}
        with its own measurements, and we wrote{" "}
        <a href="/blog/argon-vs-dumbodb-response-to-dolthub">a response</a> with
        ours.
      </p>

      <h2>lakeFS: version control over objects</h2>
      <p>
        lakeFS organizes object storage into repositories, branches, and
        commits. This is useful for data-lake and pipeline workflows. Its unit
        of versioning is an object rather than an individual MongoDB document.
        See{" "}
        <a href="https://docs.lakefs.io/concepts/internals/">
          the lakeFS internals
        </a>
        .
      </p>

      <h2>Argon: review MongoDB document changes</h2>
      <p>
        Argon is an MIT-licensed, self-hosted engine. A branch records a
        position in captured history; checkout materializes a real MongoDB
        database for native drivers. Agents can work on separate branches,
        inspect differences, and propose a merge for explicit review and
        application.
      </p>
      <p>
        Checkout readiness and storage depend on the dataset. Undo and
        historical reads require complete images and retained history. Branches
        do not replace MongoDB access controls or backups. From Argon 2.7.0 a
        replica-set database can be imported while it is being written and
        followed, and from 2.8.0 a reviewed plan can be written back to it from
        the CLI. Both have been tested on MongoDB 7.0 replica sets only: not on
        Atlas, with access control, across multi-member elections or on sharded
        sources. The hosted demo is paused; native database connections belong
        in your local deployment. See the{" "}
        <a href="/features#capabilities">capability matrix</a> and{" "}
        <a href="/blog/two-ai-agents-one-mongodb-document">
          two-agent review walkthrough
        </a>
        .
      </p>

      <h2>A practical selection checklist</h2>
      <ol>
        <li>
          Start with your database: Postgres, MySQL-compatible SQL, objects, or
          MongoDB. For MongoDB, decide whether you can replace the database
          engine or need to keep the one you run.
        </li>
        <li>
          Identify what must be reviewed: schema, document changes, table
          changes, or objects.
        </li>
        <li>
          Measure time to a usable database, storage, cleanup, and recovery on
          your own workload.
        </li>
        <li>
          Check credentials, retained history, conflict handling, and backup
          requirements.
        </li>
        <li>
          Run one representative change and its rejection or recovery path
          before adopting the workflow.
        </li>
      </ol>
      <p>
        For MongoDB, begin with the{" "}
        <a href="/quickstart">local Argon quickstart</a>. For performance
        evidence, read the{" "}
        <a href="https://github.com/argon-lab/benchmarks">
          reproducible benchmark reports
        </a>{" "}
        and their workload limits. Metadata branch creation is not a measure of
        physical sandbox readiness.
      </p>
      <LaterReleasesNote />
    </ArticleLayout>
  );
}
