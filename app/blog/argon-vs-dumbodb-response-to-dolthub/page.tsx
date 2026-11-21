import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("argon-vs-dumbodb-response-to-dolthub")!;

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

const theirArticle = "https://www.dolthub.com/blog/2026-11-10-argon-spotlight/";
const dumbodb = "https://github.com/dolthub/dumbodb";
const report =
  "https://github.com/argon-lab/benchmarks/tree/main/reports/2026-11-18-v2.4.0-cli-scale";
const issue = "https://github.com/argon-lab/argon/issues/112";
const discussions = "https://github.com/argon-lab/argon/discussions";
const followUp = "/blog/argon-2-5-diff-merge-before-after";
const reportAfter =
  "https://github.com/argon-lab/benchmarks/tree/main/reports/2026-11-18-v2.5.0-cli-scale";

const faq = [
  {
    q: "What is the difference between Argon and DumboDB?",
    a: "Argon keeps branch history beside a stock MongoDB replica set and copies a branch into a real database when you check it out, so MongoDB itself runs every query. DumboDB is DoltHub's own document database that speaks the MongoDB wire protocol and stores branches in shared storage, so a new branch, a diff and a merge do work in proportion to what changed.",
  },
  {
    q: "Is DumboDB faster than Argon?",
    a: "For getting a new branch ready on a large collection, yes, by a wide margin: Argon copies the data and DumboDB does not. For diff and merge, DoltHub measured a wide margin on the Argon of that time; Argon 2.5.0 changed both to follow the size of the change, and nobody has yet measured the two on one machine. For ordinary reads and writes on a checked-out branch, DoltHub's numbers have Argon ahead, because those are MongoDB's own.",
  },
  {
    q: "Does Argon copy the data for every sandbox?",
    a: "Yes. Creating a branch is a metadata write, but a sandbox includes a checkout, which writes a full physical MongoDB database. Its time and storage grow with the data.",
  },
  {
    q: "Does the time of an Argon diff depend on how many documents changed?",
    a: "From Argon 2.5.0, yes: a diff or merge preview is built from the documents the branch changed, and in our measurement took about as long at a million documents as at ten thousand. Up to 2.4.1 it did not: both rebuilt the fork point, the branch and its parent in full and compared every document. The figures in this article are for 2.4.0.",
  },
  {
    q: "Is DumboDB compatible with MongoDB?",
    a: "It implements the MongoDB 8.0 wire protocol in its own engine and works with standard drivers and mongosh. Its README, read on November 17, 2026, describes it as pre-1.0 and not yet ready for production, and lists features it does not support, including TTL indexes, capped collections and Atlas Search.",
  },
  {
    q: "Do Argon and DumboDB work together?",
    a: "Not today. They are separate projects with no integration. We have invited DoltHub to agree on a shared benchmark method, to explore an example that uses both, and to measure Argon again after its diff and merge preview change. Those are invitations, not announcements.",
  },
  {
    q: "Did Argon benchmark DumboDB?",
    a: "No. We measured Argon only. Every DumboDB number we refer to is DoltHub's own, from their article.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        On November 10, Neil Macneale of DoltHub published{" "}
        <a href={theirArticle}>Version Control Database Spotlight: Argon</a>.
        DoltHub is building <a href={dumbodb}>DumboDB</a>, a MongoDB-compatible
        database with version control in its storage engine, and the article
        compares it with Argon: how Argon works, a side-by-side table, and
        benchmarks at ten thousand, a hundred thousand and a million documents.
      </p>
      <p>
        Thank you to Neil and to DoltHub. They read our code and documentation
        closely enough to describe Argon correctly, they were generous about
        what it does well, and they published numbers. This is our response. The
        short version:
      </p>
      <ul>
        <li>
          <strong>Their description of Argon is accurate.</strong> We go through
          their table row by row below.
        </li>
        <li>
          <strong>The pattern in their benchmark is real.</strong> We ran the
          same steps on Argon 2.4.0. A new sandbox, a diff and a merge preview
          each take time in proportion to the number of documents in the
          database, not the number that changed.
        </li>
        <li>
          <strong>The gap comes from a design decision on each side.</strong>{" "}
          Argon has a real <code>mongod</code> execute every query. DumboDB is
          its own engine. Each side gives up what the other is good at.
        </li>
        <li>
          <strong>
            Part of the gap did not have to exist, and is now closed.
          </strong>{" "}
          Diff and merge preview compare only the documents that changed from
          Argon 2.5.0. <a href={followUp}>The before and after</a> is a separate
          post.
        </li>
      </ul>

      <h2>What Argon is</h2>
      <p>
        For readers arriving from their article: Argon gives AI agents MongoDB
        sandboxes. A sandbox is a real MongoDB database, forked from your data
        or from a pinned state, that an agent reads and writes with ordinary
        drivers. When the run ends you read the diff, then merge it, undo it or
        throw the sandbox away. Branches, captured history and merge are how
        that works underneath. Argon runs beside a MongoDB deployment you
        already have. It does not replace the database.
      </p>

      <h2>What they got right</h2>
      <p>
        Their side-by-side table has nine rows. Here is each statement about
        Argon, in our words, and whether it holds for Argon 2.4.0.
      </p>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            DoltHub&apos;s statements about Argon and whether each is accurate
          </caption>
          <thead>
            <tr>
              <th scope="col">Their statement about Argon</th>
              <th scope="col">Accurate?</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                Queries run on stock <code>mongod</code>, version 6 or newer, as
                a replica set
              </th>
              <td>Yes</td>
              <td>
                This is the design, and the reason for most of the rows below.
              </td>
            </tr>
            <tr>
              <th scope="row">
                History is a numbered sequence of captured writes, with no
                commits
              </th>
              <td>Yes</td>
              <td>
                A pin names a state you want to keep. The reviewed unit is a
                branch&apos;s diff against its parent.
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon gc</code> removes history older than the retention
                window, seven days by default, unless a pin protects it
              </th>
              <td>Yes</td>
              <td>
                It runs when you run or schedule it, and it removes only entries
                that a snapshot already covers.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Using a branch means checking it out, which copies it into a new
                database
              </th>
              <td>Yes</td>
              <td>
                Creating the branch is a metadata write. The checkout is the
                copy.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Reading the past is rebuilt in memory, without indexes or
                aggregation
              </th>
              <td>Yes</td>
              <td>
                That is <code>argon time-travel query</code>. To run aggregation
                on an old state you fork it with{" "}
                <code>argon restore branch</code> and check that out, which is
                another full copy.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Merge goes from a branch into its parent, compares whole
                documents, and takes one resolution for the whole merge
              </th>
              <td>Yes</td>
              <td>
                Two branches that change different fields of one document
                conflict. <code>argon merge apply</code> resolves every conflict
                in a plan the same way, <code>theirs</code> or <code>ours</code>
                .
              </td>
            </tr>
            <tr>
              <th scope="row">
                Documents are versioned; indexes, validators and collection
                options are not
              </th>
              <td>Yes</td>
              <td>
                A checked-out branch has the <code>_id</code> index and no
                others until you create them.
              </td>
            </tr>
            <tr>
              <th scope="row">
                History lags the write, and capture can fall behind or have gaps
              </th>
              <td>Yes</td>
              <td>
                Capture reads MongoDB&apos;s change stream after the write is
                acknowledged. When it cannot record a change exactly, Argon
                marks the branch&apos;s history incomplete and refuses to diff
                it.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Every checked-out branch is a full copy in <code>mongod</code>
              </th>
              <td>Yes</td>
              <td>Branches do not share storage once checked out.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We have nothing to correct. Their account of how a diff and a merge are
        computed is also right: Argon rebuilds the state at the fork point, the
        branch and its parent from its log, then compares them one document at a
        time.
      </p>
      <p>
        The merge row deserves an example, because it is the one most likely to
        surprise you. We gave two sandboxes the same product. One changed its
        price and was merged. The other changed its quantity, and its preview
        reported a conflict, although the two never touched the same field:
      </p>
      <pre>
        <code>{`$ argon merge preview -p shop -b agent-b
Merging agent-b → main
  CONFLICT products/~argon:bson:DAAAABBpAAEAAAAA (both sides changed since the fork)
0 change(s), 1 conflict(s)

Plan 6afd0ed9e11370547863c59a saved (pending).
Apply with: argon merge apply 6afd0ed9e11370547863c59a --strategy theirs|ours`}</code>
      </pre>
      <p>
        The long identifier is how the CLI prints an <code>_id</code> that is
        not a string, here the integer 1. Applied without a strategy, the plan
        is refused. Applied with <code>theirs</code>, it goes through:
      </p>
      <pre>
        <code>{`$ argon merge apply 6afd0ed9e11370547863c59a --strategy theirs
Merged: 1 change(s) applied, 1 conflict(s) resolved via --strategy theirs.`}</code>
      </pre>
      <p>
        Afterwards the main branch held the second sandbox&apos;s quantity and
        the original price. The first sandbox&apos;s price change was gone,
        because <code>theirs</code> takes the whole document. Argon never
        resolves a conflict silently, but resolving this one well means reading
        both versions yourself.
      </p>

      <h2>Where we agree</h2>
      <p>
        A response to a comparison tends to read as a list of differences. The
        two projects agree on more than they differ on, and we reached the same
        conclusions from opposite directions: DoltHub started from a
        version-controlled storage engine and built toward MongoDB, and we
        started from MongoDB and built toward version control.
      </p>
      <ul>
        <li>
          <strong>A branch you cannot merge is a copy.</strong> Their article
          says a database should not claim branches unless it can merge them,
          and cites Wikipedia&apos;s definition of branching to make the point.
          We hold the same view. It is why Argon has a merge at all, and why
          their remark that ours goes only so far is fair.
        </li>
        <li>
          <strong>A change to data should be readable before it lands.</strong>{" "}
          Both tools put a diff in front of a merge. DumboDB has commands to
          diff two states and to resolve conflicts one document at a time. Argon
          saves a merge plan that someone reads and then applies. For writes
          made by an AI agent, we think that review step is the point.
        </li>
        <li>
          <strong>Version-controlled databases are here.</strong> That is their
          first takeaway, and we share it. A second team working on the same
          problem for MongoDB makes the case stronger for both.
        </li>
      </ul>
      <p>
        There is also one thing DumboDB does that we think is plainly the right
        design. By its README it can join an existing MongoDB replica set as a
        non-voting member, and their article lists branching directly off
        production among its strengths. That means the data you branch is the
        data your application is writing now. Argon 2.4.0 cannot do this:{" "}
        <code>argon import database</code> is a one-time copy that needs the
        source&apos;s writers paused. Argon 2.6.0 carries an experimental
        version of following a database that is in use, from{" "}
        <a href="https://github.com/argon-lab/argon/pull/113">
          pull request 113
        </a>
        . It is switched off by default and has known issues, so we do not count
        it as something Argon does today. We have not run DumboDB as a
        replica-set member, so this is praise for the approach, not a test
        result.
      </p>
      <p>
        <em>
          Update, 19 November 2026: this has changed since. See the update under
          &quot;What we are changing&quot; below.
        </em>
      </p>

      <h2>What we measured</h2>
      <p>
        Their article does not say what machine, document shape or method
        produced its numbers, so we could not repeat their run. We ran our own
        on the evening of November 17, 2026, US Eastern time, and published the
        script, the environment and every sample.
      </p>
      <ul>
        <li>
          <strong>Argon 2.4.0</strong>, the binary that{" "}
          <code>npm install -g argonctl</code> installs, and{" "}
          <strong>MongoDB 7.0.45</strong> as a one-node replica set. Both ran in
          containers on one Apple M6 laptop under Docker Desktop.
        </li>
        <li>
          One collection of ten thousand, a hundred thousand and a million
          documents of about 236 bytes each, with the <code>_id</code> index
          only.
        </li>
        <li>
          The steps in their tables: initial import, a new branch to its first
          read, a new sandbox to its first read, 100 and 10,000 updates through
          the driver, diff, merge, and point reads by <code>_id</code>.
        </li>
        <li>
          Five runs of each step at each size. Each timing covers a whole CLI
          command, as you would wait for it in a terminal.
        </li>
      </ul>
      <p>
        We measured Argon only.{" "}
        <strong>
          We did not run DumboDB, and its numbers are DoltHub&apos;s.
        </strong>{" "}
        Every figure below comes from <a href={report}>the benchmark report</a>,
        which has the raw samples, the spread of each step and the conditions of
        the run. These are medians, and they are for Argon 2.4.0. The diff and
        merge preview rows changed in 2.5.0; see{" "}
        <a href={followUp}>the before and after</a>.
      </p>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            Argon 2.4.0, median of whole CLI commands by number of documents
          </caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">10,000 documents</th>
              <th scope="col">100,000 documents</th>
              <th scope="col">1,000,000 documents</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">New branch to first read</th>
              <td>96 ms</td>
              <td>584 ms</td>
              <td>8,472 ms</td>
            </tr>
            <tr>
              <th scope="row">New sandbox to first read</th>
              <td>114 ms</td>
              <td>852 ms</td>
              <td>7,776 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon diff</code>, 100 documents changed
              </th>
              <td>101 ms</td>
              <td>348 ms</td>
              <td>7,088 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon diff</code>, 10,000 documents changed
              </th>
              <td>179 ms</td>
              <td>617 ms</td>
              <td>8,491 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon merge preview</code>, 100 changed
              </th>
              <td>99 ms</td>
              <td>351 ms</td>
              <td>6,045 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon merge apply</code>, 100 changes
              </th>
              <td>42 ms</td>
              <td>39 ms</td>
              <td>112 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon merge apply</code>, 10,000 changes
              </th>
              <td>1,952 ms</td>
              <td>2,164 ms</td>
              <td>6,421 ms</td>
            </tr>
            <tr>
              <th scope="row">Bulk update of 100 documents</th>
              <td>3.0 ms</td>
              <td>3.3 ms</td>
              <td>7.2 ms</td>
            </tr>
            <tr>
              <th scope="row">Bulk update of 10,000 documents</th>
              <td>151 ms</td>
              <td>168 ms</td>
              <td>820 ms</td>
            </tr>
            <tr>
              <th scope="row">
                Point read by <code>_id</code>
              </th>
              <td>78 µs</td>
              <td>81 µs</td>
              <td>129 µs</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon import database</code>
              </th>
              <td>0.2 s</td>
              <td>1.9 s</td>
              <td>28.4 s</td>
            </tr>
            <tr>
              <th scope="row">
                Peak memory of one <code>argon diff</code>
              </th>
              <td>112 MiB</td>
              <td>541 MiB</td>
              <td>5,016 MiB</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read the last column with care. The million-document tier ran once,
        while unrelated containers were running on the same machine, and its
        samples are spread widely: the diff of 100 changed documents ranged from
        4.8 to 14.9 seconds. The two smaller tiers were run twice, with similar
        results.
      </p>
      <p>
        Here are the three operations their article leads with, at ten thousand,
        a hundred thousand and a million documents, beside the figures they
        published. Ours is a diff with 100 documents changed, and a merge
        preview plus its apply. Theirs come with no description of the method,
        so the columns are not a controlled comparison.
      </p>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            New branch, diff and merge: our Argon figures beside DoltHub&apos;s
            published figures
          </caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Argon, our run</th>
              <th scope="col">Argon, DoltHub&apos;s figures</th>
              <th scope="col">DumboDB, DoltHub&apos;s figures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">New branch to first read</th>
              <td>96 / 584 / 8,472 ms</td>
              <td>500 / 4,000 / 47,200 ms</td>
              <td>3 / 3 / 4 ms</td>
            </tr>
            <tr>
              <th scope="row">Diff</th>
              <td>101 / 348 / 7,088 ms</td>
              <td>500 / 2,200 / 23,700 ms</td>
              <td>4 / 4 / 5 ms</td>
            </tr>
            <tr>
              <th scope="row">Merge</th>
              <td>142 / 393 / 6,134 ms</td>
              <td>500 / 2,300 / 24,100 ms</td>
              <td>3 / 4 / 4 ms</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>What the numbers show:</p>
      <ul>
        <li>
          <strong>
            A new sandbox, a diff and a merge preview grow with the database.
          </strong>{" "}
          Each takes longer with every tenfold step in document count, and at a
          million documents each takes seconds. Creating the branch takes
          milliseconds at every size. The time is in the checkout.
        </li>
        <li>
          <strong>The size of the change barely matters to a diff.</strong> With
          a million documents in the database, a diff of 100 changed documents
          and a diff of 10,000 took about the same time.
        </li>
        <li>
          <strong>Applying a merge follows the size of the change.</strong>{" "}
          <code>argon merge apply</code> writes a saved plan, so 100 changes
          apply quickly at every size. Some applies took longer and used far
          more memory, in a pattern that fits Argon&apos;s automatic snapshots
          of the target branch; we did not trace it further.
        </li>
        <li>
          <strong>Diff and merge preview hold three states in memory.</strong>{" "}
          At a million of these small documents, a single diff process peaked at
          several gigabytes of resident memory. Their article did not measure
          memory, and you should know this before pointing Argon at a large
          collection.
        </li>
        <li>
          <strong>Reads and writes are MongoDB&apos;s.</strong> Point reads and
          bulk updates on a checked-out branch go to <code>mongod</code>{" "}
          directly. Argon records a write in its history after MongoDB has
          acknowledged it, a fraction of a second later in our runs.
        </li>
        <li>
          <strong>
            Our absolute times are lower than the ones they published for Argon
          </strong>
          , by a factor of roughly three to seven for those three operations. We
          read nothing into that: it is a different machine and a different
          document, and we do not know their method. It does not change the
          conclusion. At a million documents these three operations take seconds
          in Argon, and DoltHub reports a few milliseconds for DumboDB.
        </li>
      </ul>

      <h2>Why the two behave this way</h2>
      <p>Both designs follow from one question: what executes the query?</p>
      <h3>Argon: MongoDB executes it</h3>
      <p>
        On a checked-out Argon branch every read and write goes to{" "}
        <code>mongod</code>: the query planner, index types, aggregation stages,
        transactions and driver behavior are MongoDB&apos;s, because it is
        MongoDB. Argon keeps history beside it, by reading the change stream
        into its own log.
      </p>
      <p>
        The price is the one their article measured. <code>mongod</code> can
        only serve a branch that exists as a database, so a sandbox is a copy.
        And MongoDB&apos;s storage does not know which documents differ between
        two branches, so Argon works that out from its log. Compatibility also
        stops at the engine: a sandbox does not carry your indexes or
        validators.
      </p>
      <h3>DumboDB: its own engine executes it</h3>
      <p>
        DumboDB implements the MongoDB 8.0 wire protocol itself, on the storage
        engine DoltHub built for Dolt. That storage shares structure between
        versions. A new branch is a new pointer into data that is already there,
        and a diff or merge only has to visit what differs. This is why their
        numbers barely move as the collection grows, and it is a real advantage.
      </p>
      <p>
        The price is that every MongoDB behavior has to be built again.
        DumboDB&apos;s <a href={`${dumbodb}#readme`}>README</a> is candid about
        where that stands. On November 17, 2026 it described DumboDB as
        &ldquo;pre-1.0 software and not yet ready for production use&rdquo; and
        listed, among others, these differences from MongoDB:
      </p>
      <ul>
        <li>
          TTL expiry (<code>expireAfterSeconds</code>) is rejected, and support
          is not planned.
        </li>
        <li>Capped collections are rejected, and support is not planned.</li>
        <li>
          Atlas features such as Search indexes are not supported, and support
          is not planned.
        </li>
        <li>
          Documents are stored with their keys sorted, so a legacy geo point
          stored as an embedded document is not treated as a point.
        </li>
        <li>
          An encoded key, an <code>_id</code> or an index entry, can be at most
          1024 bytes. MongoDB accepts much larger keys.
        </li>
        <li>
          It can join a MongoDB replica set as a non-voting member. General
          replica-set operation and sharding are out of scope.
        </li>
      </ul>
      <p>
        Its roadmap lists query parity with MongoDB among the things to finish
        before a beta. None of this is a criticism. It is what the early life of
        a database engine looks like, and DoltHub has been through it before:
        Dolt has been a version-controlled SQL database since 2019, years before
        Argon existed. If none of those gaps touches your application, they cost
        you nothing.
      </p>

      <h2>Which one to choose</h2>
      <p>Look at DumboDB first when:</p>
      <ul>
        <li>
          Version control is the main thing you do with the data: many branches,
          and frequent diffs and merges on large collections.
        </li>
        <li>
          You want what their article lists for it: every commit kept, merges
          between any two branches, and conflicts resolved one document at a
          time.
        </li>
        <li>
          You can run a pre-1.0 engine, as the database or as a non-voting
          member of your MongoDB replica set, and its listed gaps do not touch
          your application.
        </li>
      </ul>
      <p>Look at Argon first when:</p>
      <ul>
        <li>
          The data already lives in MongoDB, and the engine that answers queries
          has to stay <code>mongod</code>.
        </li>
        <li>
          The work is agent runs: a sandbox per run, a diff a person reads, then
          a merge or a discard, with undo by actor, TTL cleanup and an MCP
          server.
        </li>
        <li>
          A full copy per sandbox is affordable at your data size. Measure that
          before you decide; the script below does it.
        </li>
      </ul>
      <p>
        Their article ends on the same split: an application that diffs and
        merges constantly is DumboDB&apos;s case, and one that branches and
        merges rarely may be better served by Argon. We agree with that, and we
        would add the engine question above to it.
      </p>

      <h2>What we are changing</h2>
      <p>
        One part of the gap was not required by the design. Argon&apos;s log
        already records which documents a branch wrote after its fork point, so
        a diff or a merge preview does not need to rebuild and compare every
        document to find them. That was <a href={issue}>issue 112</a>, and it
        shipped in Argon 2.5.0: both now do work in proportion to what the
        branch changed. <a href={followUp}>The follow-up post</a> has the
        measurements before and after and the cases that still read a whole
        collection, and <a href={reportAfter}>the 2.5.0 report</a> has the
        samples. Argon 2.6.0 then removed the extra seconds the first diff on a
        branch still took.
      </p>
      <p>
        <em>
          Update, 19 November 2026: importing a replica-set database while it is
          being written and following it shipped in Argon 2.7.0, and writing a
          reviewed plan back to that database shipped in 2.8.0, with a
          field-order fix in 2.8.1. They have been tested on MongoDB 7.0 replica
          sets only: not on Atlas, with access control, across multi-member
          elections or on sharded sources.{" "}
          <a href="/blog/branch-live-mongodb-write-back">The walkthrough</a> has
          a full run and the limits.
        </em>
      </p>
      <p>These gaps are known, and not scheduled:</p>
      <ul>
        <li>
          <strong>Sandbox readiness.</strong> A sandbox is a full physical copy,
          so it takes longer and uses more storage as data grows.
        </li>
        <li>
          <strong>Per-document conflict resolution.</strong> A merge plan takes
          one strategy for all of its conflicts.
        </li>
        <li>
          <strong>Indexes and validators in sandboxes.</strong> A sandbox starts
          with the <code>_id</code> index only.
        </li>
      </ul>
      <p>
        If one of these blocks you, say so in{" "}
        <a href="https://github.com/argon-lab/argon/issues">
          the issue tracker
        </a>
        . It changes what gets built first.
      </p>

      <h2>Run the measurement yourself</h2>
      <p>
        The script needs Docker and Python 3 on the host. It starts MongoDB and
        a container with Argon from npm, publishes no ports, and removes both
        when it finishes.
      </p>
      <pre>
        <code>{`git clone https://github.com/argon-lab/benchmarks
cd benchmarks
scripts/cli_scale_docker.sh 2.4.0 results/cli-scale --sizes 10000,100000,1000000`}</code>
      </pre>
      <p>
        The million-document tier needs about 10 GB of memory free in Docker,
        and the whole run took a little over ten minutes on our laptop. The run
        stops with an error unless every diff and every merge plan lists exactly
        the documents that were updated, and every merge is found in the main
        branch. This is the last merge of the million-document tier in our run:
      </p>
      <pre>
        <code>{`$ argon merge apply 6afd0d1334d33284724663e9 --output json
{
  "applied": 10000,
  "conflicts_resolved": 0,
  "plan_id": "6afd0d1334d33284724663e9"
}`}</code>
      </pre>

      <h2>Limits of our measurement</h2>
      <ul>
        <li>
          One laptop, with MongoDB and the CLI in containers. Other hardware
          will give other numbers.
        </li>
        <li>
          One collection, small documents, the <code>_id</code> index only, a
          one-node replica set and no other clients on the database.
        </li>
        <li>
          Five runs per step. That shows how a step grows. It does not establish
          tail latency.
        </li>
        <li>
          The million-document tier ran once, while unrelated containers were
          running on the same machine. The two smaller tiers were run twice,
          with similar results. The report says which samples were affected.
        </li>
        <li>
          We do not know DoltHub&apos;s method, so the two sets of Argon numbers
          are not a controlled comparison.
        </li>
        <li>We did not run DumboDB.</li>
      </ul>

      <h2>What we would like to do together</h2>
      <p>Three invitations to DoltHub, each one specific:</p>
      <ol>
        <li>
          <strong>Agree on a benchmark method and publish it.</strong> Their
          numbers and ours cannot be compared as published, because neither side
          ran the other&apos;s method. A shared one for version-controlled
          document databases would fix that: the document shape, how many
          documents change, and where each timing starts and stops. Ours is in{" "}
          <a href="https://github.com/argon-lab/benchmarks">
            argon-lab/benchmarks
          </a>
          , and they are welcome to change it or to propose their own.
        </li>
        <li>
          <strong>Explore an example that uses both.</strong> The two tools are
          strong in different places. One idea is Argon in front, giving each
          agent run a sandbox and a reviewed merge, with DumboDB behind it
          keeping the history. Nobody has built this, and we do not know whether
          it works. We would like to find out with them.
        </li>
        <li>
          <strong>Measure Argon 2.5.0.</strong> The change in issue 112 is
          released, and <a href={followUp}>our own before and after</a> is
          published. We would welcome DoltHub running their benchmark on it too,
          and we will link what they find from here, whatever it shows.
        </li>
      </ol>
      <p>
        The way to reach us is in the open:{" "}
        <a href={discussions}>GitHub Discussions</a> on the Argon repository, or{" "}
        the issue tracker there. The same invitation stands for anyone else
        building version control for documents.
      </p>

      <p>
        Thanks again to Neil and DoltHub for the review. To try Argon, start
        with the <a href="/quickstart">local quickstart</a>. To see how the
        other branching tools differ, read{" "}
        <a href="/blog/database-branching-tools-compared">
          database branching tools compared
        </a>
        .
      </p>
      <p>
        <em>
          Update, November 21, 2026. Argon 2.11.0 builds each collection&apos;s
          secondary indexes in checkouts and sandboxes, from definitions
          recorded at import, while following and through capture. A sandbox
          now enforces the source&apos;s unique constraints. Indexes are still
          not versioned, and validators and collection options are still not
          copied. The rows above describe the release this post compared.
        </em>
      </p>
    </ArticleLayout>
  );
}
