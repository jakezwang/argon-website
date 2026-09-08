import type { Metadata } from "next";
import CodeBlock from "../../components/CodeBlock";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("two-ai-agents-one-mongodb-document")!;
const exampleUrl =
  "https://github.com/argon-lab/argon-agents/blob/v0.2.0/examples/two_agent_review.py";

export const metadata: Metadata = {
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
  },
};

function Excerpt({
  label,
  code,
  language = "python",
}: {
  label: string;
  code: string;
  language?: string;
}) {
  return (
    <CodeBlock
      label={label}
      code={code}
      language={language}
      className="my-6 [&_code]:rounded-none [&_p]:mt-0 [&_pre]:mt-0 [&_pre]:border-0"
    />
  );
}

function BranchFigure() {
  return (
    <figure
      aria-label="Two proposals from the same baseline"
      className="my-8 border border-brand-edge bg-brand-surface p-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4 border-b border-brand-edge pb-4">
        <span className="font-mono text-sm text-brand-muted">baseline</span>
        <span className="font-mono text-xl text-brand-text">49</span>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:gap-8">
        <div>
          <div
            aria-hidden="true"
            className="ml-3 h-6 border-l border-brand-edge"
          />
          <div className="border-l-2 border-brand-primary pl-3">
            <span className="block font-mono text-sm text-brand-primary">
              planner
            </span>
            <span className="mt-2 block font-mono text-3xl text-brand-text">
              44
            </span>
          </div>
          <div
            aria-hidden="true"
            className="ml-3 h-6 border-l border-brand-primary"
          />
          <div className="border-t border-brand-primary pt-3 text-sm leading-6">
            <span className="block text-brand-text">Merge into main</span>
            <span className="font-mono text-brand-primary">main: 44</span>
          </div>
        </div>
        <div>
          <div
            aria-hidden="true"
            className="ml-3 h-6 border-l border-brand-edge"
          />
          <div className="border-l-2 border-brand-muted pl-3">
            <span className="block font-mono text-sm text-brand-muted">
              executor
            </span>
            <span className="mt-2 block font-mono text-3xl text-brand-text">
              1
            </span>
          </div>
          <div
            aria-hidden="true"
            className="ml-3 h-6 border-l border-dashed border-brand-muted"
          />
          <div className="border-t border-brand-edge pt-3 text-sm leading-6">
            <span className="block text-brand-text">
              Preview after that merge
            </span>
            <span className="font-mono text-brand-muted">1 conflict</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-6 border-t border-brand-edge pt-4 text-sm leading-6 text-brand-muted">
        Both branches began at 49. By the time the executor asks to merge, main
        has changed to 44.
      </figcaption>
    </figure>
  );
}

export default function Page() {
  return (
    <ArticleLayout post={post} capabilityNotes={false}>
      <p>
        Two agents start with a $49 order. The planner writes $44. The executor
        writes $1. Both writes are valid MongoDB updates. The planner&apos;s
        change is merged first, so the executor&apos;s proposal must be checked
        against a main branch that now contains $44.
      </p>
      <p>
        This is the example we use to test Argon&apos;s review workflow. The
        agent actions are scripted, so you can reproduce it without a model or
        an API key. The database work is real: PyMongo writes to separate
        MongoDB databases, and Argon captures their history. The script issues
        the writes in sequence; it is not a concurrency benchmark.
      </p>
      <p>
        The <a href={exampleUrl}>complete Python example</a> includes setup,
        assertions, and cleanup. The excerpts below follow its execution order.
      </p>

      <h2>Start both runs from the same order</h2>
      <p>
        The script creates a project, inserts one document into a seed branch,
        and merges it into <code>main</code>:
      </p>
      <Excerpt
        label="The starting document"
        language="json"
        code={`{"_id": "order-1", "price": 49, "status": "pending"}`}
      />
      <p>
        It then pins that state as <code>baseline</code> and creates two
        sandboxes from it. A pin names a fixed point in the project&apos;s
        history. Both runs get the same input, even if main changes later.
      </p>
      <Excerpt
        label="Create the two sandboxes"
        code={`pin = argon.create_pin(
    project, "baseline",
    note="Identical input for both agent runs",
)
planner = argon.sandbox_from_pin(
    project, "baseline", name="planner", actor="agent:planner",
)
executor = argon.sandbox_from_pin(
    project, "baseline", name="executor", actor="agent:executor",
)`}
      />
      <p>
        Each sandbox checks out as a physical MongoDB database. Creating the
        branch metadata is a small operation; preparing a database that a driver
        can query also takes copying time and storage. That cost grows with the
        data being materialized.
      </p>
      <p>
        The two database handles below are ordinary PyMongo objects. Each update
        changes only its branch. After these calls, main still has 49.
      </p>
      <Excerpt
        label="Write a different price in each branch"
        code={`a = planner.pymongo_database()
b = executor.pymongo_database()

a.orders.update_one(
    {"_id": "order-1"}, {"$set": {"price": 44}},
)
b.orders.update_one(
    {"_id": "order-1"}, {"$set": {"price": 1}},
)`}
      />
      <BranchFigure />

      <h2>Accept the planner&apos;s change</h2>
      <p>
        We choose to accept 44 in this example. A merge preview produces a plan
        for bringing the planner&apos;s changes into main. Because main still
        matches the starting state, this plan has no conflicts.
      </p>
      <Excerpt
        label="Preview and apply the first proposal"
        code={`approved = argon.merge_preview(project, planner.branch)
assert not approved["conflicts"]
argon.merge_apply(approved["id"])`}
      />
      <p>
        Applying that plan changes main to 44. Argon checks that the source and
        target still match the state used for the preview. If either has changed
        in the meantime, the caller needs a fresh preview before applying the
        plan.
      </p>

      <h2>The executor still has 1</h2>
      <p>
        Merging the planner does not rewrite the executor&apos;s sandbox. Its
        document still says 1, based on the original 49. When it asks to merge,
        Argon now has three states to compare:
      </p>
      <table>
        <caption className="sr-only">
          Price at the executor merge preview
        </caption>
        <thead>
          <tr>
            <th scope="col">Common starting point</th>
            <th scope="col">Main now</th>
            <th scope="col">Executor proposal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>49</td>
            <td>44</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
      <p>
        Main and the executor have both changed the same document since that
        starting point. The preview reports one conflict.
      </p>
      <Excerpt
        label="Inspect the second proposal"
        code={`rejected = argon.merge_preview(project, executor.branch)
assert len(rejected["conflicts"]) == 1`}
      />
      <p>
        The script stops short of applying this plan. Main stays at 44. A
        reviewer could resolve the conflict, ask for another attempt, or discard
        the branch. Here, we use it to test undo.
      </p>
      <p>
        The conflict is about the competing edits. Argon has no pricing rule
        that rejects a $1 order. If main had stayed at 49, the executor&apos;s
        change would not conflict with it. An application still needs its own
        checks for acceptable prices before approving a merge.
      </p>

      <h2>Undo the attempt, then undo the accepted merge</h2>
      <p>
        First, we undo the executor&apos;s write inside its own branch. The
        captured entry has the actor label <code>agent:executor</code> and a log
        sequence number, or LSN. These identify the history to undo.
      </p>
      <Excerpt
        label="Undo the executor branch write"
        code={`executor_writes = [
    e["lsn"] for e in argon.entries(project, executor.branch)
    if e.get("actor") == "agent:executor"
    and e["operation"] == "put"
]
argon.undo(
    project, executor.branch,
    from_lsn=min(executor_writes),
    actor="agent:executor",
)
assert b.orders.find_one()["price"] == 49`}
      />
      <p>
        The executor is back at 49. Main remains at 44. The actor label belongs
        to this branch&apos;s run; MongoDB change streams do not tell Argon
        which individual application user made every write. Separate runs need
        separate branches if you want to review them independently.
      </p>
      <p>
        The script discards the executor branch and checks that a fresh sandbox
        from main reads 44. It then tests a different operation: undoing the
        accepted merge on main itself. That merge wrote its own history entries
        under <code>merge:planner</code>.
      </p>
      <Excerpt
        label="Undo the merge on main"
        code={`merge_writes = [
    e["lsn"] for e in argon.entries(project, "main")
    if e.get("actor") == "merge:planner"
    and e["operation"] == "put"
]
argon.undo(
    project, "main",
    from_lsn=min(merge_writes),
    to_lsn=max(merge_writes),
)`}
      />
      <p>
        A new sandbox from main now reads 49. These were two separate undo
        operations against two different histories. Reverting the executor did
        not cancel the planner&apos;s merge.
      </p>
      <p>
        Undo needs the complete, retained history and the document images for
        the selected writes. Missing images or conflicting later edits can
        prevent it from proceeding. In this example, those conditions are
        controlled and the script checks the data after each operation. For an
        existing deployment, the{" "}
        <a href="/features#capabilities">capture and retention requirements</a>{" "}
        are part of setting this up.
      </p>

      <h2>What changed in Argon 2.1</h2>
      <p>
        Branches, merge previews, and undo were already in Argon. The recent
        work tightened the behavior this example depends on: preserving BSON
        document identities, capturing exact before-and-after images, and
        applying merge and undo changes transactionally. Stale plans and
        incomplete undo histories must fail before they can partially change the
        data.
      </p>
      <p>
        Capture now has an explicit readiness check and reports degraded history
        when it cannot record an update correctly. Native-driver tests exercise
        PyMongo and Mongoose writes through capture and undo. The{" "}
        <a href="https://github.com/argon-lab/argon/blob/v2.1.1/docs/RELEASE_2_1.md">
          2.1 release notes
        </a>{" "}
        link each change to its regression coverage. Version 2.1.1 also fixes a
        monitor shutdown deadlock found during the release checks.
      </p>
      <p>
        We ran the full example with the published Argon 2.1.1 CLI, SDK 0.2.0,
        and a fresh MongoDB 7.0.25 replica set. It accepted 44, reported one
        conflict, and restored 49.
      </p>

      <h2>Run the same example</h2>
      <p>
        The <a href="/quickstart">local Quickstart</a> installs the CLI, starts
        a MongoDB replica set, and runs <code>argon doctor</code> to check
        capture readiness. Keep <code>argon console --no-browser</code> running
        while the example runs; that process manages capture for the API
        sandboxes. The guide also checks out SDK tag <code>v0.2.0</code> and
        installs it in a Python virtual environment.
      </p>
      <p>
        From that SDK checkout, with the virtual environment active and the
        local console listening on port 1818, run:
      </p>
      <Excerpt
        label="Run the complete example"
        language="bash"
        code={`export ARGON_API_URL='http://127.0.0.1:1818'
python examples/two_agent_review.py`}
      />
      <p>
        The output includes these fields. The generated project name and pin LSN
        vary between runs.
      </p>
      <Excerpt
        label="Selected output fields"
        language="json"
        code={`{
  "reviewed_price": 44,
  "conflicts": 1,
  "restored_price": 49
}`}
      />
      <p>
        The <a href={exampleUrl}>source</a> includes the assertions behind those
        numbers. You can also inspect proposals in the{" "}
        <a href="https://console.argonlabs.tech">live demo</a>, which uses
        temporary sample data. Use the local setup for this Python example; the
        anonymous demo does not issue native MongoDB credentials.
      </p>
    </ArticleLayout>
  );
}
