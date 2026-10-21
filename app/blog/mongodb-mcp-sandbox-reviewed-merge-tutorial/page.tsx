import type { Metadata } from "next";
import CodeBlock from "../../components/CodeBlock";
import { install, product } from "../../product";
import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";
import trace from "./trace.json";

const post = getPost("mongodb-mcp-sandbox-reviewed-merge-tutorial")!;
const path = `/blog/${post.slug}`;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: path },
  openGraph: {
    type: "article",
    siteName: "Argon",
    url: `https://argonlabs.tech${path}`,
    title: post.title,
    description: post.description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    publishedTime: post.date,
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: ["/og.png"],
  },
};

function Excerpt({
  label,
  code,
  language = "bash",
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
      className="my-6 [&_code]:rounded-none [&_code]:bg-transparent [&_pre]:border-0"
    />
  );
}

export default function Page() {
  return (
    <ArticleLayout post={post}>
      <p>
        An agent proposes changing a product price from $49 to $44. Before
        adopting that write, you want to see the proposed document, check the
        merge plan and confirm that the parent database still contains $49. This
        walkthrough performs that sequence through Argon&apos;s real MCP server
        and a local MongoDB replica set.
      </p>
      <p>
        The agent actions are scripted Python, so the example needs no model,
        API key or MCP desktop app. It sends real MCP requests over stdio and
        writes through PyMongo. It checks the data before and after the
        decision; it is not an agent benchmark or an approval service.
      </p>

      <figure className="not-prose my-8 border border-brand-edge bg-brand-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-l-2 border-brand-muted pl-4">
            <p className="font-mono text-xs text-brand-muted">main</p>
            <p className="mt-2 font-mono text-3xl text-brand-text">$49</p>
            <p className="mt-2 text-sm text-brand-muted">
              Stays at $49 during the sandbox write and preview.
            </p>
          </div>
          <div className="border-l-2 border-brand-primary pl-4">
            <p className="font-mono text-xs text-brand-primary">
              review sandbox
            </p>
            <p className="mt-2 font-mono text-3xl text-brand-text">$44</p>
            <p className="mt-2 text-sm text-brand-muted">
              A proposal to inspect before explicitly applying its plan.
            </p>
          </div>
        </div>
        <figcaption className="mt-5 border-t border-brand-edge pt-4 text-sm text-brand-muted">
          Discard leaves main at $49. Apply changes main to $44. Removing the
          sandbox afterward does not undo the merge.
        </figcaption>
      </figure>

      <h2 id="setup">1. Prepare a disposable local deployment</h2>
      <p>
        Follow the <a href="/quickstart">local quickstart</a> for MongoDB 7+
        configured as a replica set, then use Python 3.12+ and npm 11.16+ with a
        supported Node.js version. This example uses local synthetic data; its
        account needs permission to create and remove its own fixture databases.
        It accepts only local MongoDB hosts without credentials; the generated
        transcript includes the local connection URI.
      </p>
      <Excerpt
        label="Install the CLI and download the example"
        code={`${install.cli}
argon --version
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install "pymongo>=4.6,<5"
curl --fail --location https://argonlabs.tech/examples/mcp_review.py -o mcp_review.py`}
      />
      <p>
        <a href="/examples/mcp_review.py" download="mcp_review.py">
          Download the complete Python example
        </a>
        . The script checks the CLI version, creates a unique project and
        metadata database, prepares a collection for capture, and seeds
        <code> products/shoe </code> at $49. CLI setup is necessary because
        Argon&apos;s MCP tools do not create projects or collections.
      </p>
      <Excerpt
        label="Run the default discard path"
        code={`python3 mcp_review.py \
  --mongo-uri 'mongodb://127.0.0.1:27017/?replicaSet=rs0' \
  --binary argon --expected-version ${product.version} \
  --output-dir review-discard`}
      />
      <p>
        Use a fresh output directory for each run. The script writes its
        request/response transcript, server stderr and result summary there. It
        removes only its own fixture databases after the assertions; inspect the
        saved files for the results rather than expecting the example project to
        remain available afterward.
      </p>

      <h2>2. Start MCP, then write through the sandbox connection</h2>
      <p>
        The client launches <code>argon mcp</code> with the same MongoDB URI and
        isolated metadata database as the setup commands. It sends
        <code> initialize</code>, waits for the response, sends
        <code> notifications/initialized</code>, then lists the tools. The
        published server negotiates protocol <code>2024-11-05</code>. Protocol
        and server-information versions are separate from the CLI release
        checked by <code>argon --version</code>.
      </p>
      <p>
        These are excerpts from an actual local run; project names, request IDs
        and plan IDs vary. The complete transcript is generated by the script.
        MCP uses newline-delimited JSON-RPC over
        <a href="https://modelcontextprotocol.io/specification/2024-11-05/basic/transports">
          {" "}
          stdio
        </a>
        ; server logs go to stderr.
      </p>
      <Excerpt
        label="Captured sandbox request and response"
        language="json"
        code={JSON.stringify(trace.sandbox, null, 2)}
      />
      <p>
        The returned MongoDB connection points to the sandbox&apos;s physical
        database. PyMongo updates its product from $49 to $44. Document reads
        and writes use the driver, not an Argon MCP query tool. The script keeps
        the MCP process running for capture and verifies both documents: main is
        still $49 and the sandbox is $44.
      </p>

      <h2 id="review">3. Inspect the documents and the saved plan</h2>
      <p>
        After writes finish, <code>argon_diff</code> reports changed keys and
        conflict counts. <code>argon_merge_preview</code> saves a plan and
        returns its ID and counts. Neither text response contains the full
        before/after document payload. A count of one change is not enough
        information to approve its contents.
      </p>
      <Excerpt
        label="Captured preview request and response"
        language="json"
        code={JSON.stringify(trace.preview, null, 2)}
      />
      <p>
        The script uses <code>argon merge list -p PROJECT --output json</code>
        with that same metadata configuration to retrieve the saved plan. It
        selects the exact ID returned by MCP and checks the full change: the
        intended product, its previous price of $49, proposed price of $44, no
        delete and no conflicts. Running another CLI preview would create a
        different plan, so it is not a way to retrieve this one.
      </p>
      <Excerpt
        label="Captured change from the saved plan"
        language="json"
        code={JSON.stringify(trace.changes, null, 2)}
      />
      <p>
        In a real application, inspect every proposed field and conflict, define
        who can approve, and control who can invoke apply. This example checks a
        known synthetic change. A preview is neither a database lock nor an
        identity-based approval policy; changed branch state can invalidate the
        plan and require a fresh review.
      </p>

      <h2>4. Choose discard or explicitly apply</h2>
      <p>
        The default run calls <code>argon_sandbox_discard</code> and asserts
        that main remains $49. To exercise the merge path, start a second
        independent run with <code>--apply</code>:
      </p>
      <Excerpt
        label="Run the explicit apply path"
        code={`python3 mcp_review.py \
  --mongo-uri 'mongodb://127.0.0.1:27017/?replicaSet=rs0' \
  --binary argon --expected-version ${product.version} \
  --output-dir review-apply --apply`}
      />
      <p>
        Here, the flag is the script operator&apos;s explicit choice to apply
        the checked plan. There is no model deciding whether to approve it. MCP
        receives the saved plan ID:
      </p>
      <Excerpt
        label="Captured apply request and response"
        language="json"
        code={JSON.stringify(trace.apply, null, 2)}
      />
      <p>
        The script asserts main is now $44, discards the source sandbox, and
        checks main again. Merge does not automatically delete the sandbox;
        discard does not revert changes already merged into the parent. Fixture
        cleanup runs after these checks.
      </p>

      <h2>What this example proves</h2>
      <p>
        The same released CLI can create a sandbox over MCP, capture a driver
        write, save and inspect a merge plan, and either discard the proposal or
        explicitly apply it. The downloadable script and its assertions run in
        CI against the published release. This walkthrough was first validated
        with Argon 2.1.3 and MongoDB 7.0.45, on local synthetic data.
      </p>
      <p>
        It does not establish a production SLA, model quality or a concurrency
        benchmark. Database credentials and network controls still provide
        access isolation. Prepare new collections before their first writes,
        keep capture healthy, and stop writers before review and cleanup. If
        capture or plan validation fails, resolve that condition rather than
        treating an earlier preview as current.
      </p>
      <p>
        For expiry and stopped-service behavior, see the
        <a href="/blog/disposable-mongodb-sandbox-for-ai-agents#ttl-experiment">
          {" "}
          TTL lifecycle experiment
        </a>
        . For competing proposals and conflict handling, continue with the
        <a href="/blog/two-ai-agents-one-mongodb-document">
          {" "}
          two-agent Python example
        </a>
        . This tutorial uses only public interfaces and synthetic data.
      </p>
    </ArticleLayout>
  );
}
