import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("argon-2-5-diff-merge-before-after")!;

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
const response = "/blog/argon-vs-dumbodb-response-to-dolthub";
const before =
  "https://github.com/argon-lab/benchmarks/tree/main/reports/2026-11-18-v2.4.0-cli-scale";
const after =
  "https://github.com/argon-lab/benchmarks/tree/main/reports/2026-11-18-v2.5.0-cli-scale";
const pullRequest = "https://github.com/argon-lab/argon/pull/117";
const architecture =
  "https://github.com/argon-lab/argon/blob/master/docs/ARCHITECTURE.md#diff-and-merge";

const faq = [
  {
    q: "What changed in Argon 2.5.0?",
    a: "argon diff and argon merge preview build their plan from the documents a branch changed since its fork, instead of rebuilding the fork point, the branch and its parent in full and comparing every document. The plans are the same. Nothing about the data format changed.",
  },
  {
    q: "How much faster is argon diff in 2.5.0?",
    a: "In our measurement with a million documents and 100 changed, the median diff went from 7,088 ms in 2.4.0 to 30 ms in 2.5.0, and peak memory from about 5 GiB to about 120 MiB. The first diff on a branch was slower, a median of 1,874 ms, because it also caught up capture on a checked-out parent.",
  },
  {
    q: "Does the time of an Argon diff depend on how many documents changed?",
    a: "From 2.5.0, yes. With 100 documents changed a diff took a few tens of milliseconds at ten thousand, a hundred thousand and a million documents; with 10,000 changed it took about 400 ms at each. Up to 2.4.1 it depended on the size of the database instead.",
  },
  {
    q: "Is anything slower in 2.5.0?",
    a: "Yes. When a branch changed every document in a collection, reading each document's history costs more than reading the collection once. With 10,000 of 10,000 documents changed, a diff went from 179 ms to 393 ms.",
  },
  {
    q: "When does 2.5.0 still read a whole collection?",
    a: "After argon gc has deleted the parent's entries, a changed document's state is read from the parent's snapshot, which is loaded once per collection and side. And the previous algorithm is used when gc deleted entries of the branch itself, when the history holds entries written before 2.1, or when the branch holds more than 200,000 entries of its own.",
  },
  {
    q: "Is creating a sandbox faster in 2.5.0?",
    a: "No. A sandbox is still a full physical copy of the data, and its time and storage grow with the database. 2.5.0 changed diff and merge preview only.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        Argon gives AI agents MongoDB sandboxes: an agent works in a copy of
        your data, and you read the diff before anything is merged. Until this
        week, reading that diff cost as much as the whole database. A branch
        that changed 100 documents out of a million took seconds to diff and
        several gigabytes of memory, because Argon rebuilt every document to
        find the hundred.
      </p>
      <p>
        DoltHub pointed this out in{" "}
        <a href={theirArticle}>their comparison of Argon and DumboDB</a>, we
        confirmed it in <a href={response}>our response</a>, and{" "}
        <strong>Argon 2.5.0 fixes it</strong>. A diff and a merge preview now do
        work in proportion to what the branch changed. This post has the
        measurements before and after, what did not change, and the cases where
        2.5.0 still reads a whole collection.
      </p>

      <h2>What changed</h2>
      <p>
        A merge plan is a three-way comparison for each document: its state at
        the fork point, on the parent now, and on the branch now. Up to 2.4.1,{" "}
        <code>argon diff</code> and <code>argon merge preview</code> rebuilt
        those three states in full and compared every document in every
        collection.
      </p>
      <p>
        Only a document the branch wrote after its fork can be part of a plan,
        and Argon&apos;s log already records those writes. In 2.5.0 the plan is
        built from the documents named by the branch&apos;s own entries. For
        each one, the branch&apos;s state is its newest entry, and the fork
        point and the parent are read from that document&apos;s own history
        through an index. The plans are identical: the engine&apos;s tests hold
        the new path to the old one on randomized histories. The change is{" "}
        <a href={pullRequest}>pull request 117</a>, and the design is written up
        in <a href={architecture}>the architecture notes</a>.
      </p>

      <h2>Before and after</h2>
      <p>
        We ran the same script on both versions, at ten thousand, a hundred
        thousand and a million documents of about 236 bytes, with 100 and with
        10,000 documents changed on the branch. These are medians of whole CLI
        commands, 2.4.0 then 2.5.0. Every figure is from the{" "}
        <a href={before}>2.4.0 report</a> and the{" "}
        <a href={after}>2.5.0 report</a>, which have the raw samples.
      </p>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            Argon diff and merge preview, median, 2.4.0 then 2.5.0
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
              <th scope="row">
                <code>argon diff</code>, 100 documents changed
              </th>
              <td>101 ms → 35 ms</td>
              <td>348 ms → 44 ms</td>
              <td>7,088 ms → 30 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon diff</code>, 10,000 documents changed
              </th>
              <td>179 ms → 393 ms</td>
              <td>617 ms → 450 ms</td>
              <td>8,491 ms → 412 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon merge preview</code>, 100 changed
              </th>
              <td>99 ms → 27 ms</td>
              <td>351 ms → 39 ms</td>
              <td>6,045 ms → 26 ms</td>
            </tr>
            <tr>
              <th scope="row">
                <code>argon merge preview</code>, 10,000 changed
              </th>
              <td>225 ms → 386 ms</td>
              <td>516 ms → 415 ms</td>
              <td>6,180 ms → 385 ms</td>
            </tr>
            <tr>
              <th scope="row">
                Peak memory of one <code>argon diff</code>
              </th>
              <td>112 MiB → 123 MiB</td>
              <td>541 MiB → 115 MiB</td>
              <td>5,016 MiB → 118 MiB</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read across a row and the 2.5.0 figure barely moves: about 30 ms for a
        hundred changed documents and about 400 ms for ten thousand, whether the
        database holds ten thousand documents or a million. Memory is flat too.
        A diff no longer holds the database.
      </p>

      <h2>Two things the medians hide</h2>
      <h3>The first diff on a branch</h3>
      <p>
        Each run diffed a branch three times, and the first of the three was
        much slower than the other two. For a workflow that diffs once, the
        first is the one that counts.
      </p>
      <div className="overflow-x-auto">
        <table>
          <caption className="sr-only">
            Argon diff with 100 documents changed, median of first diffs and
            median of later diffs
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <code>argon diff</code>, 100 changed
              </th>
              <th scope="col">10,000 documents</th>
              <th scope="col">100,000 documents</th>
              <th scope="col">1,000,000 documents</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">2.4.0, first diff</th>
              <td>146 ms</td>
              <td>584 ms</td>
              <td>8,269 ms</td>
            </tr>
            <tr>
              <th scope="row">2.5.0, first diff</th>
              <td>68 ms</td>
              <td>233 ms</td>
              <td>1,874 ms</td>
            </tr>
            <tr>
              <th scope="row">2.4.0, later diffs</th>
              <td>96 ms</td>
              <td>342 ms</td>
              <td>5,764 ms</td>
            </tr>
            <tr>
              <th scope="row">2.5.0, later diffs</th>
              <td>30 ms</td>
              <td>32 ms</td>
              <td>28 ms</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The extra time is not spent on the plan. In our run the main branch was
        checked out and nothing was running <code>argon watch</code> on it, so a
        diff first brought the main branch&apos;s capture up to date. MongoDB
        answers that by reading the oplog written since capture last stopped,
        and at that point the oplog held the new branch&apos;s whole checkout.
        MongoDB&apos;s log shows one such read of about two seconds for each
        first diff at a million documents. In a separate run where the main
        branch was not checked out, the first diff at a million documents took
        29 ms.
      </p>
      <p>
        So with a checked-out, unwatched parent, a first diff still pays for the
        size of the checkout before it. We have not measured whether keeping{" "}
        <code>argon watch</code> running on the parent, or letting{" "}
        <code>argon console</code> or <code>argon mcp</code> manage capture,
        removes that cost.
      </p>
      <h3>A branch that changed everything</h3>
      <p>
        In the ten-thousand-document column, 10,000 changed documents means the
        branch rewrote the whole collection. There 2.5.0 is slower: 179 ms
        became 393 ms. Reading each document&apos;s history costs more per
        document than reading the collection once. By a hundred thousand
        documents with 10,000 changed, 2.5.0 is ahead again.
      </p>

      <h2>What did not change</h2>
      <ul>
        <li>
          <strong>A sandbox is still a full copy.</strong> A new branch to its
          first read took a median of 7.5 seconds at a million documents in
          2.5.0 and 8.5 seconds in 2.4.0, which is the same within the noise of
          a shared machine. 2.5.0 did not touch checkout.
        </li>
        <li>
          <strong>Applying a merge is the same.</strong>{" "}
          <code>argon merge apply</code> writes each change of a saved plan, and
          every so often triggers an automatic snapshot of the target branch,
          which reads the whole branch.
        </li>
        <li>
          <strong>Merge semantics are the same.</strong> A merge still goes from
          a branch into its parent, compares whole documents, and takes one
          strategy for all conflicts in a plan.
        </li>
      </ul>

      <h2>When 2.5.0 still reads a whole collection</h2>
      <h3>After garbage collection, measured</h3>
      <p>
        <code>argon gc</code> deletes log entries that a snapshot already
        covers. Once it has deleted the parent&apos;s entries, a changed
        document&apos;s state at the fork point and on the parent has to come
        from the parent&apos;s snapshot. A snapshot cannot be read one document
        at a time, so it is loaded once per collection and side.
      </p>
      <p>
        We measured it: after a gc that removed every entry of the main branch,
        a diff of 100 changed documents at a million documents took about 1.1
        seconds and 1.5 to 1.8 GiB of memory, against about 20 ms before the gc
        in the same run. That is slower than the common case, and still several
        times faster than 2.4.0 with about a third of its memory.
      </p>
      <h3>Three cases that use the previous algorithm, not measured</h3>
      <p>
        In these the plan is computed the way 2.4 computed it. We describe them
        from the architecture notes and did not measure them:
      </p>
      <ul>
        <li>
          Garbage collection has deleted entries of the branch being merged, so
          its log no longer names every document it changed.
        </li>
        <li>
          The history holds entries written before Argon 2.1, which do not
          identify their document reliably.
        </li>
        <li>The branch holds more than 200,000 entries of its own.</li>
      </ul>

      <h2>How this was measured</h2>
      <ul>
        <li>
          Argon 2.5.0 and 2.4.0 as <code>npm install -g argonctl</code> installs
          them, MongoDB 7.0.45 as a one-node replica set, both in containers on
          one Apple M6 laptop. One collection with the <code>_id</code> index
          only. Five branch workflows per cell, three diffs in each.
        </li>
        <li>
          The run stops with an error unless every diff and merge plan lists
          exactly the documents that were updated and every merge is found in
          the main branch. Both versions passed at every size.
        </li>
        <li>
          The laptop was shared with unrelated work during every run, and each
          million-document tier ran once per version. We also ran 2.4.0 again
          straight after 2.5.0, under heavier load, and it came out slower than
          the 2.4.0 figures above. The tables use the earlier, lower 2.4.0
          figures, so the improvement shown is the smaller of the two.
        </li>
        <li>We measured Argon only.</li>
      </ul>
      <p>To run it yourself, with Docker and Python 3 on the host:</p>
      <pre>
        <code>{`git clone https://github.com/argon-lab/benchmarks
cd benchmarks
scripts/cli_scale_docker.sh 2.5.0 results/cli-scale-2.5.0
scripts/gc_case_docker.sh 2.5.0 100000,1000000 results/gc-case.txt`}</code>
      </pre>

      <h2>Upgrading</h2>
      <p>
        There are no data format changes between 2.4.1 and 2.5.0. Install the
        new version over the old one:
      </p>
      <pre>
        <code>{`npm install -g argonctl@2.5.0 --allow-scripts=argonctl`}</code>
      </pre>
      <p>
        Thanks to Neil Macneale and DoltHub for measuring Argon in public. Their
        numbers are the reason this release exists. The comparison, and what we
        would like to do with them next, is in{" "}
        <a href={response}>our response</a>. If you run the script on your own
        data and see something different, tell us in{" "}
        <a href="https://github.com/argon-lab/argon/discussions">
          GitHub Discussions
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
