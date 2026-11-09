import type { Metadata } from "next";
import CodeBlock from "../../components/CodeBlock";
import { product } from "../../product";

import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("validate-mongodb-agent-catalog-changes")!;
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

export default function Page() {
  return (
    <ArticleLayout post={post}>
      <p>
        A MongoDB merge plan can have zero conflicts and still contain the wrong
        price. Conflict detection asks whether changes collide. Your application
        must also decide whether the proposed document satisfies its business
        rules.
      </p>
      <p>
        We tested that distinction with a synthetic catalog, Argon&apos;s public
        MCP server and real MongoDB writes. A correct discount was merged. Four
        invalid proposals were rejected before applying their plans, and the
        parent collection stayed unchanged. The validator is Python application
        code; it is not a built-in Argon policy or approval service.
      </p>

      <h2>Why catalog enrichment needs a separate check</h2>
      <p>
        MongoDB&apos;s{" "}
        <a href="https://www.mongodb.com/company/blog/innovation/enriching-product-catalogs-for-agentic-commerce-discovery">
          October 13 catalog enrichment article
        </a>{" "}
        describes richer product context and consistency across product feeds,
        APIs and product pages. That is useful engineering background for an
        agent that proposes catalog updates. It does not establish that
        generated values are correct, or that this example improves search
        traffic.
      </p>
      <p>
        Our earlier{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          MCP sandbox tutorial
        </a>{" "}
        demonstrates the create, preview, apply and discard sequence. Here we
        add a narrow acceptance contract and deliberately bad proposals. The new
        question is: what must a reviewer check even when the merge engine
        reports no conflict?
      </p>

      <h2>A contract small enough to inspect</h2>
      <p>
        The parent starts with one product: <code>shoe</code>, priced at 4,900
        integer cents in USD. The task may add a discount and its derived sale
        price. It may not change the original price or currency, add another
        product, delete the product or introduce another field.
      </p>
      <CodeBlock
        label="Synthetic parent document"
        language="json"
        code={'{ "_id": "shoe", "price_cents": 4900, "currency": "USD" }'}
      />
      <p>
        A discount of 1,000 basis points means ten percent. This fixture uses an
        explicit rounding-down policy:
      </p>
      <CodeBlock
        label="Fixture arithmetic"
        language="python"
        code={
          "sale_price_cents = price_cents * (10000 - discount_bps) // 10000\n# 4900 * 9000 // 10000 = 4410"
        }
      />
      <p>
        Real catalogs need their own currency, tax and rounding rules. This
        calculation is only the declared policy for the synthetic example.
      </p>

      <h2>Inspect the saved plan, not just its summary</h2>
      <p>
        The script creates its own project and sandbox, writes through PyMongo,
        and requests <code>argon_merge_preview</code>. The MCP response provides
        a plan ID and counts. It then reads that same saved plan with the public{" "}
        <code>argon merge list</code> CLI to inspect the before and proposed
        documents. It does not generate a second preview and accidentally review
        a different plan.
      </p>
      <ol>
        <li>
          Require a pending plan without conflicts and exactly one change.
        </li>
        <li>
          Require an update of <code>products/shoe</code>, with the expected
          before document and no deletion.
        </li>
        <li>
          Require exactly the five allowed fields and unchanged original values
          and types.
        </li>
        <li>
          Require an integer discount between 0 and 10,000 basis points, and an
          integer sale price matching the declared formula.
        </li>
        <li>
          Apply only when the rejection list is empty. Otherwise discard the
          sandbox.
        </li>
      </ol>
      <p>
        Missing keys and unexpected types fail closed. In particular, Python
        booleans are not accepted as integer prices or discounts. The checks use
        explicit conditionals rather than <code>assert</code>, so Python&apos;s{" "}
        <code>-O</code> mode cannot remove the acceptance rules.
      </p>
      <p>
        The script also reads the entire parent product collection before the
        decision and after cleanup. Checking only the intended product could
        miss an unwanted extra document.
      </p>

      <h2>Run the five cases locally</h2>
      <p>
        Use Python 3.12 or later, the Argon {product.version} CLI, and a
        disposable local MongoDB replica set. Follow the{" "}
        <a href="/quickstart#install">installation guide</a> and the{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          MCP tutorial&apos;s local replica-set setup
        </a>
        . The script refuses remote hosts and credentials. Do not point it at
        production.
      </p>
      <p>
        <a href="/examples/catalog_review.py" download>
          Download catalog_review.py
        </a>
        . It is self-contained, needs no model or API key, and writes protocol
        messages, the reviewed plan and a summary into a new directory for every
        run.
      </p>
      <CodeBlock
        label="Prepare Python"
        language="bash"
        code={`python3 -m venv .venv\n. .venv/bin/activate\npython -m pip install "pymongo>=4.6,<5"\nargon --version # expected: argon version ${product.version}`}
      />
      <CodeBlock
        label="Run all synthetic cases"
        language="bash"
        code={`export ARGON_TEST_MONGODB_URI="mongodb://localhost:27017/?replicaSet=rs0"
(
  for scenario in valid invalid-value unexpected-field extra-document delete-document; do
    python -O catalog_review.py --scenario "$scenario" --expected-version ${product.version} --output-dir "catalog-$scenario" || exit 1
  done
)`}
      />
      <p>
        The valid scenario automatically applies its plan to its own synthetic
        parent. Each invalid scenario must be rejected for the run to pass. A
        rejected proposal is an expected test outcome, not a script failure. A
        mismatch, protocol failure or cleanup failure exits unsuccessfully. Use
        fresh output paths for another run.
      </p>

      <h2>Observed results</h2>
      <p>
        These five cases were executed on November 3, 2026 with public Argon
        2.1.4, MongoDB 7.0.43, Python 3.12.14 and PyMongo 4.19.0 on macOS arm64,
        including Python optimization mode. These are scripted fixture results,
        not a model evaluation or a performance benchmark.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Conflicts</th>
              <th>Application decision</th>
              <th>Parent afterward</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sale price 4,410 cents</td>
              <td>0</td>
              <td>Apply</td>
              <td>One enriched product</td>
            </tr>
            <tr>
              <td>Sale price 4,400 cents</td>
              <td>0</td>
              <td>Reject: derived price</td>
              <td>Original product only</td>
            </tr>
            <tr>
              <td>Extra supplier-cost field</td>
              <td>0</td>
              <td>Reject: field set</td>
              <td>Original product only</td>
            </tr>
            <tr>
              <td>Extra product inserted</td>
              <td>0</td>
              <td>Reject: change count</td>
              <td>Original product only</td>
            </tr>
            <tr>
              <td>Original product deleted</td>
              <td>0</td>
              <td>Reject: operation</td>
              <td>Original product only</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Only the valid run sent <code>argon_merge_apply</code>. All five runs
        discarded their sandbox and removed their owned fixture databases.
        Removing a sandbox after a successful merge does not reverse the parent
        change; the script verifies that separately before removing its
        synthetic parent during final cleanup.
      </p>

      <h2>What this does not prove</h2>
      <p>
        The validator is intentionally specific to one task. It does not judge
        whether a product description is truthful, whether a proposed discount
        is commercially sensible, or whether an agent is authorized to make it.
        Anyone who can bypass this application and call the underlying write or
        merge tools can bypass its rules. Keep production credentials and apply
        permissions under an appropriate access-control design.
      </p>
      <p>
        The experiment also has no concurrent writers. Reading a plan and
        checking a parent is not an atomic authorization boundary, and this test
        makes no guarantee about changes arriving between validation and apply.
        Evaluate those races separately for your deployment. For competing
        edits, start with{" "}
        <a href="/blog/two-ai-agents-one-mongodb-document">
          the two-agent conflict walkthrough
        </a>
        ; for operational limits, read{" "}
        <a href="/features#capabilities">Argon&apos;s capability boundaries</a>.
      </p>
      <p>
        The useful separation is concrete: use branching to isolate the
        proposal, inspect the persisted plan to see its scope, and use explicit
        application rules to decide whether its data is acceptable. Zero
        conflicts answers only one of those questions.
      </p>
    </ArticleLayout>
  );
}
