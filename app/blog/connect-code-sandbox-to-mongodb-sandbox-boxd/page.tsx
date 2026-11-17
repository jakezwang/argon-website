import ArticleLayout from "../ArticleLayout";
import { getPost } from "../posts";

const post = getPost("connect-code-sandbox-to-mongodb-sandbox-boxd")!;

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

const example =
  "https://github.com/argon-lab/argon/tree/master/examples/boxd-sandbox";
const pullRequest = "https://github.com/argon-lab/argon/pull/101";

const faq = [
  {
    q: "How do I give sandboxed agent code access to MongoDB?",
    a: "Create a data sandbox for the run, create a MongoDB user that can read and write only that sandbox's database, and pass that user's connection string to the code sandbox over a private network. Drop the user when the run ends.",
  },
  {
    q: "Why not pass the agent the connection string Argon returns for the sandbox?",
    a: "It carries the engine's own MongoDB credentials with the sandbox's database name added. In the example's setup that user is root, so code holding it can read the main branch and every other database. A user made for the run, with readWrite on the sandbox database only, was refused when it tried.",
  },
  {
    q: "What can the agent's MongoDB user do?",
    a: "Read and write the sandbox's database, including dropping its collections. It cannot read or write the main branch or list other databases. If it drops a collection, Argon reports incomplete history, refuses to show a diff, and the sandbox has to be discarded.",
  },
  {
    q: "Does the example need a model or an LLM API key?",
    a: "No. agent.py is a fixed script that stands in for agent-written code. You need a boxd account and API key, MongoDB 7 or newer as a replica set, and Argon 2.3.1 or newer.",
  },
  {
    q: "Was this example run on boxd?",
    a: "By its author, Michiel Voortman of boxd, whose runs are recorded in the pull request. We ran the Argon and MongoDB half with a local container in place of the boxd machine, so our output is not evidence about boxd's isolation.",
  },
  {
    q: "Can I use another code sandbox instead of boxd?",
    a: "The half of host.py that talks to Argon and MongoDB uses Argon's REST API and PyMongo, and does not depend on boxd. The half that creates the machine, closes its network and runs the code uses boxd's SDK and would have to be rewritten. The code sandbox also has to reach your MongoDB deployment over a network you control.",
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        Agent-written code that runs in a code sandbox still needs a database,
        and the connection string you hand it decides what it can damage. An{" "}
        <a href="/blog/code-sandbox-vs-data-sandbox-for-ai-agents">
          earlier article
        </a>{" "}
        argued that such an agent needs two sandboxes: a{" "}
        <strong>code sandbox</strong> for what it runs, and a{" "}
        <strong>data sandbox</strong> for what it writes. It ended with the two
        points that decide whether the pair works, network reach and
        credentials, and it showed no code for either.
      </p>
      <p>
        Argon&apos;s repository now has <a href={example}>an example</a> that
        does both. Agent-written code runs on an isolated{" "}
        <a href="https://boxd.sh/">boxd</a> machine and writes to an Argon
        MongoDB sandbox through a database user that exists for one run. The
        host then prints what the code changed and discards the sandbox, or
        merges it when you ask. Michiel Voortman, a co-founder of boxd, wrote
        the example, and we reviewed and merged it in{" "}
        <a href={pullRequest}>pull request 101</a>.
      </p>
      <p>
        This article goes through the three decisions in it that are worth
        copying with any code sandbox: which database credential the
        agent&apos;s code gets, when its network closes, and what you review
        before anything reaches the main branch. It also shows what a run
        prints, what happens when a run fails, and what the example does not
        cover.
      </p>

      <h2>What we ran, and what we did not</h2>
      <p>
        Michiel ran the example on boxd machines with Argon 2.3.3 and MongoDB
        7.0. His runs, his inspection of a kept machine and the README&apos;s
        port check are recorded in the pull request.{" "}
        <strong>We have not run the example on boxd.</strong>
      </p>
      <p>
        On November 17, 2026 we ran its data half. We used <code>host.py</code>{" "}
        and <code>agent.py</code> from the repository unchanged, Argon 2.4.0
        installed from npm, and MongoDB 7.0.48 as a one-node replica set with a
        keyfile and authentication, started with the README&apos;s commands. A
        local container stood in for the boxd machine: a small replacement for
        the boxd SDK sent the commands that <code>host.py</code> issues to that
        container. Every transcript below is from that run.
      </p>
      <p>
        So the output below shows what Argon and MongoDB do. It is not evidence
        about boxd&apos;s isolation, private network or egress allowlist. For
        those we describe what boxd&apos;s documentation says, checked the same
        day, and what Michiel reports.
      </p>

      <h2>Two machines on one private network</h2>
      <pre>
        <code>{`data machine (host)                              agent machine (isolated)
  mongod with auth, argon console, host.py  ──▶   agent.py
  1. Argon sandbox + restricted user              2. writes through PyMongo
  3. diff, then discard (or --apply)          ◀── network: argon-example only`}</code>
      </pre>
      <p>
        MongoDB, the Argon console and <code>host.py</code> run on one boxd
        machine, the data machine. For each run, <code>host.py</code> creates a
        second machine for the agent&apos;s code and deletes it when the run
        ends.
      </p>
      <p>
        According to{" "}
        <a href="https://docs.boxd.sh/use-cases/sandboxes">
          boxd&apos;s documentation
        </a>
        , each machine is a microVM under KVM with a kernel, network stack and
        disk of its own. A machine created as <em>isolated</em> is kept out of
        the account&apos;s default network and can reach only non-isolated
        machines that are on a{" "}
        <a href="https://docs.boxd.sh/guides/vm-to-vm#networks">
          named network
        </a>{" "}
        with it. The example puts both machines on one network,{" "}
        <code>argon-example</code>. By that description, the agent machine
        reaches MongoDB at <code>&lt;data-machine&gt;.boxd:27017</code> and no
        other machine in the account.
      </p>
      <p>
        That takes care of network reach, the first of the two points: both
        sandboxes sit where they can reach each other privately. Whether
        anything else can reach MongoDB is something to check, not assume,
        because <code>docker run -p 27017:27017</code> listens on every
        interface of the data machine. The README has the check. It pings
        MongoDB from a machine on the network and from one outside it, and
        Michiel reports that on his machines only the first got an answer.
      </p>

      <h2>The credential: a MongoDB user made for one run</h2>
      <p>
        When Argon creates a sandbox it returns a connection string, and the
        obvious move is to pass that string to the agent. Here it is next to the
        engine&apos;s own, with the passwords removed:
      </p>
      <pre>
        <code>{`engine's MONGODB_URI:       mongodb://argon:<password>@localhost:27017/?replicaSet=rs0&authSource=admin
sandbox connection string:  mongodb://argon:<password>@localhost:27017/argon_br_6afc997c23961213ce8ef421?replicaSet=rs0&authSource=admin`}</code>
      </pre>
      <p>
        The sandbox connection string is the engine&apos;s credential with the
        sandbox&apos;s database name added. That is fine for a script you trust.
        For code you do not trust, it is the engine&apos;s access to the whole
        deployment. Argon&apos;s{" "}
        <a href="https://github.com/argon-lab/argon/blob/master/docs/OPERATIONS.md#exposure-and-credentials">
          operations guide
        </a>{" "}
        says to provision restricted users for agents that should not share it.
      </p>
      <p>
        We passed it to the example&apos;s <code>agent.py</code> anyway, to see
        what would happen. <code>agent.py</code> begins by trying to read the
        main branch&apos;s database, and it stops if the read succeeds:
      </p>
      <pre>
        <code>{`agent.py exited 1:
the sandbox user can read the main branch`}</code>
      </pre>
      <p>
        So <code>host.py</code> creates a MongoDB user for each run, with one
        role on one database (shortened):
      </p>
      <pre>
        <code>{`user, password = "argon-agent-" + run_id, secrets.token_urlsafe(24)
agent_uri = "mongodb://{}:{}@{}/{}?authSource=admin&directConnection=true".format(
    urllib.parse.quote_plus(user),
    urllib.parse.quote_plus(password),
    args.mongo_host,
    sandbox_db,
)
admin = MongoClient(os.environ["MONGODB_URI"])
# ...
admin.admin.command(
    "createUser",
    user,
    pwd=password,
    roles=[{"role": "readWrite", "db": sandbox_db}],
)`}</code>
      </pre>
      <p>
        We ran the same checks with both credentials, from the container that
        stood in for the agent machine:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Check</th>
              <th>Connection string from Argon</th>
              <th>User made for the run</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MongoDB role</td>
              <td>
                <code>root</code> on <code>admin</code>
              </td>
              <td>
                <code>readWrite</code> on the sandbox database
              </td>
            </tr>
            <tr>
              <td>Count tickets in the sandbox</td>
              <td>3</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Count tickets in the main branch</td>
              <td>3</td>
              <td>Refused: Unauthorized (code 13)</td>
            </tr>
            <tr>
              <td>Insert into or update the main branch</td>
              <td>Not attempted</td>
              <td>Refused: Unauthorized (code 13)</td>
            </tr>
            <tr>
              <td>List databases</td>
              <td>Every database, main and admin included</td>
              <td>The sandbox only</td>
            </tr>
            <tr>
              <td>
                Read <code>admin.system.users</code>
              </td>
              <td>Allowed</td>
              <td>Refused: Unauthorized (code 13)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The Argon column says <code>root</code> because the README starts
        MongoDB with a single admin user and Argon runs as that user. A narrower
        engine user would shrink that column. The engine still has to reach
        every branch database it manages, main included, so its credential
        always covers more than one sandbox.
      </p>
      <p>
        The new user&apos;s connection string is not put on a command line or in
        a file. <code>host.py</code> writes it to the standard input of the one
        command that starts <code>agent.py</code>, and the shell reads it into
        an environment variable for that process:
      </p>
      <pre>
        <code>{`command = [
    "bash",
    "-c",
    "read -r ARGON_SANDBOX_URI && export ARGON_SANDBOX_URI"
    f" && exec {AGENT_DIR}/bin/python {AGENT_DIR}/agent.py",
]
# ...
with boxd.machines.stream_exec(
    machine_id, command=command, env={"ARGON_MAIN_DB": main_db}
) as stream:
    stream.write(sandbox_uri + "\\n")
    stream.write_eof()`}</code>
      </pre>
      <p>
        When the run ends, <code>host.py</code> drops the user in a{" "}
        <code>finally</code> block, also when the agent failed. After that the
        same connection string no longer authenticates: in our run MongoDB
        answered <code>AuthenticationFailed</code> (code 18). After every run,{" "}
        <code>usersInfo</code> listed only the admin user.
      </p>

      <h2>The network closes before the credential arrives</h2>
      <p>
        This is how <code>host.py</code> prepares the machine (shortened):
      </p>
      <pre>
        <code>{`# Hosts the machine may reach while it installs PyMongo, before it gets a credential.
PACKAGE_HOSTS = ("pypi.org", "files.pythonhosted.org")
# ...
spec = (
    Machine.spec()
    .isolated()
    .network(args.network)
    .egress(*PACKAGE_HOSTS)
    .label("app", "argon-example")
)
machine = boxd.machines.create(
    args.name or "argon-agent-" + run_id, spec=spec, ssh=False
)
# ...
run_checked(
    boxd,
    machine.id,
    f"python3 -m venv {AGENT_DIR} && {AGENT_DIR}/bin/pip install -q pymongo",
    timeout=300,
)
# From here on the machine reaches the network it shares with MongoDB and nothing on the internet.
boxd.machines.set_egress_allow(machine.id, ["none"])
boxd.machines.files.upload(
    machine.id, f"{AGENT_DIR}/agent.py", (HERE / "agent.py").read_bytes()
)

# 4. The agent's code runs with the restricted connection string.
output = run_agent(boxd, machine.id, agent_uri, database_of(main_uri))`}</code>
      </pre>
      <p>
        The order matters more than any single line. While the machine installs
        PyMongo it may reach PyPI and nothing else on the internet, and at that
        moment it holds no credential and none of the agent&apos;s code. Then{" "}
        <code>host.py</code> sets the egress allowlist to <code>none</code>.
        boxd documents{" "}
        <a href="https://docs.boxd.sh/guides/egress-allowlist">that entry</a> as
        switching the allowlist on with no destinations in it, and says the
        allowlist cannot be changed from inside the machine. Only then does{" "}
        <code>host.py</code> upload <code>agent.py</code> and hand over the
        connection string.
      </p>
      <p>
        From that point the agent&apos;s code has a database connection and no
        outbound route to the internet. SSH is off as well, and{" "}
        <code>host.py</code> drives the machine through boxd&apos;s API. Michiel
        reports in the pull request that a kept machine could not resolve{" "}
        <code>pypi.org</code> while it could resolve the data machine, and that
        no file on it held the connection string.
      </p>

      <h2>What the agent&apos;s code does, and what the host sees</h2>
      <p>
        <code>agent.py</code> stands in for code an agent would write, so the
        example needs no model and no LLM account. After the check above, it
        closes a ticket that already has a resolution, escalates a high-priority
        ticket, and writes a note to a collection it creates:
      </p>
      <pre>
        <code>{`closed = db.tickets.update_many(
    {"status": "open", "resolution": {"$exists": True}},
    {"$set": {"status": "closed"}},
)
escalated = db.tickets.update_many(
    {"status": "open", "priority": "high"},
    {"$set": {"status": "escalated"}},
)
# A collection the agent creates itself. Argon 2.3.1 and newer capture
# it exactly without \`argon collections prepare\`.
db.triage_notes.insert_one(
    {
        "_id": "triage-1",
        "closed": closed.modified_count,
        "escalated": escalated.modified_count,
    }
)`}</code>
      </pre>
      <p>
        A default run of <code>host.py</code> prints the diff and discards the
        sandbox. This is our run, from the agent&apos;s own output onward:
      </p>
      <pre>
        <code>{`agent: {"database": "argon_br_6afc996423961213ce8ef3a1", "closed": 1, "escalated": 1}
change: {"collection": "tickets", "document_id": "T-1", "document": {"_id": "T-1", "priority": "low", "resolution": "duplicate", "status": "closed"}, "document_key": "T-1", "before": {"_id": "T-1", "priority": "low", "resolution": "duplicate", "status": "open"}}
change: {"collection": "tickets", "document_id": "T-2", "document": {"_id": "T-2", "priority": "high", "status": "escalated"}, "document_key": "T-2", "before": {"_id": "T-2", "priority": "high", "status": "open"}}
change: {"collection": "triage_notes", "document_id": "triage-1", "document": {"_id": "triage-1", "closed": 1, "escalated": 1}, "document_key": "triage-1"}
discarded the sandbox; run again with --apply to merge`}</code>
      </pre>
      <p>
        Each change carries the document as the agent left it and, for an
        update, the document before. The reviewer reads{" "}
        <code>&quot;status&quot;: &quot;open&quot;</code> becoming{" "}
        <code>&quot;status&quot;: &quot;closed&quot;</code> instead of trusting
        the agent&apos;s summary. The third change is a document in a collection
        the agent created. From Argon 2.3.1 such a collection is captured
        exactly, with no preparation step. After this run the main branch still
        held three open tickets and no <code>triage_notes</code> collection.
      </p>
      <p>
        With <code>--apply</code>, <code>host.py</code> saves a merge plan,
        stops if the plan has conflicts, and applies that plan:
      </p>
      <pre>
        <code>{`applying merge plan 6afc996923961213ce8ef3be`}</code>
      </pre>
      <p>
        Afterwards the main branch held T-1 closed, T-2 escalated, T-3 open and
        one triage note.
      </p>
      <p>
        <code>--apply</code> is a scripted merge: no person stands between the
        preview and the apply. Each run also starts a new project, machine and
        sandbox, so <code>--apply</code> merges the diff of its own run. This
        agent is deterministic, so that diff has the same three changes you read
        in the default run. A real agent can differ between runs. For one, keep
        the sandbox, save a merge plan, read it, and apply that plan by its ID.
        The{" "}
        <a href="/blog/mongodb-mcp-sandbox-reviewed-merge-tutorial">
          reviewed merge tutorial
        </a>{" "}
        does this through MCP, and the{" "}
        <a href="/features#merge">features page</a> shows the two CLI commands.
      </p>

      <h2>When a run goes wrong</h2>
      <p>
        We ran three failure cases. In each, by the time <code>host.py</code>{" "}
        stopped it had made the call that deletes the machine and had dropped
        the MongoDB user, and the main branch was unchanged.
      </p>

      <h3>The agent cannot reach MongoDB</h3>
      <p>
        We pointed <code>--mongo-host</code> at a name that does not resolve.{" "}
        <code>agent.py</code> gave up after its ten-second server selection
        timeout, and <code>host.py</code> exited with status 1 and the
        agent&apos;s traceback (shortened):
      </p>
      <pre>
        <code>{`RuntimeError: agent.py exited 1:
Traceback (most recent call last):
  ...
pymongo.errors.ServerSelectionTimeoutError: nowhere.invalid:27017: [Errno -2] Name or service not known (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 10.0s, ...`}</code>
      </pre>

      <h3>The agent&apos;s code writes nothing</h3>
      <p>
        We replaced <code>agent.py</code> with a script that counts the open
        tickets and writes nothing. Its output arrived, and then{" "}
        <code>host.py</code> stopped while printing the diff (shortened):
      </p>
      <pre>
        <code>{`agent: {"database": "argon_br_6afc997723961213ce8ef3e0", "open": 3, "written": 0}
Traceback (most recent call last):
  ...
    for change in diff["changes"]:
TypeError: 'NoneType' object is not iterable`}</code>
      </pre>
      <p>
        Argon&apos;s REST API answers <code>&quot;changes&quot;: null</code> for
        an empty diff, and <code>host.py</code> expects a list. That is a bug in
        the example, not a property of the design. It is open as{" "}
        <a href="https://github.com/argon-lab/argon/issues/105">issue 105</a>,
        which is a small first contribution if you want one.
      </p>

      <h3>The agent&apos;s code drops a collection</h3>
      <p>
        <code>readWrite</code> lets code drop collections in its own sandbox. We
        added <code>db.tickets.drop()</code> to <code>agent.py</code>. The
        review stopped:
      </p>
      <pre>
        <code>{`RuntimeError: GET /projects/boxd-triage-1e8f7eae/branches/agent/diff: {"error":"drop on tickets is not captured; branch history is incomplete"}`}</code>
      </pre>
      <p>
        Argon marked the sandbox&apos;s capture as degraded and gave the same
        answer to a merge preview. It does not offer a partial diff when part of
        the history is missing. The main branch still held its three open
        tickets. The way out is to discard the sandbox:
      </p>
      <pre>
        <code>{`argon sandbox discard -p boxd-triage-1e8f7eae -b agent`}</code>
      </pre>
      <pre>
        <code>{`Discarded; storage reclaimed.`}</code>
      </pre>
      <p>
        We found one rough edge on the way. Until that sandbox is discarded, the
        REST call that lists the project&apos;s sandboxes fails with the same
        error, so the console cannot list them. That is{" "}
        <a href="https://github.com/argon-lab/argon/issues/106">issue 106</a>.
      </p>

      <h3>What a failed run leaves behind</h3>
      <p>
        In all three cases <code>host.py</code> stopped before it could discard
        the Argon sandbox. Where the diff could still be read, Argon listed the
        leftover sandbox with an expiry one hour after its creation. A running
        console, API or MCP server removes a sandbox once it is past its TTL. We
        checked that in the same deployment with a sandbox given a one-minute
        TTL: it was still listed 80 seconds after creation and was gone, its
        database included, at the next check 20 seconds later. Nothing sweeps if
        no such process is running. You can also discard a leftover sandbox
        yourself with the command above.
      </p>

      <h2>Limits</h2>
      <ul>
        <li>
          <strong>The boxd half is not ours to vouch for.</strong> Its
          isolation, network partition and egress allowlist are described here
          from boxd&apos;s documentation and its author&apos;s runs. We have not
          tested them. The same documentation says an isolated machine keeps its
          public HTTPS domain. The example sets nothing for inbound requests to
          the agent machine, and we have not looked at what that exposes.
        </li>
        <li>
          <strong>A sandbox is a full copy.</strong> Creating one materializes a
          physical MongoDB database, so its time and storage grow with your
          data. Three tickets say nothing about that. The open{" "}
          <a href="https://github.com/argon-lab/benchmarks">benchmark suite</a>{" "}
          measures readiness as <code>sandbox_capture_ready_ms</code>.
        </li>
        <li>
          <strong>
            The user limits where the code writes, not what it does there.
          </strong>{" "}
          Inside its sandbox the code can delete every document or drop a
          collection, and a drop ends the review.
        </li>
        <li>
          <strong>A TTL schedules cleanup and stops nothing.</strong> It does
          not stop the agent&apos;s machine or revoke a MongoDB credential.{" "}
          <code>host.py</code> does both itself.
        </li>
        <li>
          <strong>
            <code>host.py</code>&apos;s checks are written for this agent.
          </strong>{" "}
          After <code>--apply</code> it asserts the three changes shown above,
          and it fails on an empty diff. Replace those checks when you replace{" "}
          <code>agent.py</code>.
        </li>
        <li>
          <strong>The data machine is trusted.</strong> The boxd API key and the
          engine&apos;s <code>MONGODB_URI</code> stay on it. Whoever controls
          that machine controls both sandboxes.
        </li>
        <li>
          <strong>boxd bills for the machines.</strong> Its private networks
          also do not cross regions, so <code>--region</code> has to be the data
          machine&apos;s region. The README ends with the clean-up commands.
        </li>
      </ul>

      <h2>Run it</h2>
      <p>
        The <a href={`${example}#readme`}>example&apos;s README</a> has every
        command: the two machines, MongoDB with authentication, the port check,
        both runs and the clean-up. You need a boxd account and its CLI, and
        Argon 2.3.1 or newer. boxd&apos;s documentation has{" "}
        <a href="https://docs.boxd.sh/use-cases/oss-integrations/argon">
          a shorter walkthrough
        </a>{" "}
        of the same example.
      </p>
      <p>
        If you use a different code sandbox, the half of <code>host.py</code>{" "}
        that talks to Argon and MongoDB carries over as it is: it uses
        Argon&apos;s REST API and PyMongo. The half that creates the machine,
        closes its network and runs the code is written against boxd&apos;s SDK,
        and we have not ported it. Whichever you use, the three decisions stay
        the same: a database user that exists for one run and one sandbox, a
        network that closes before the credential arrives, and a diff that a
        person reads before a merge.
      </p>
      <p>
        To try the data half alone first, the{" "}
        <a href="/quickstart">local quickstart</a> needs only MongoDB and the
        Argon CLI.
      </p>
    </ArticleLayout>
  );
}
