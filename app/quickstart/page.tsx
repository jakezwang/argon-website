import { product } from "../product";
export const metadata = {
  title: "Local quickstart",
  description:
    "Run Argon and a MongoDB replica set locally, then verify a two-agent order review with the Python SDK.",
  alternates: { canonical: "/quickstart" },
};
export default function Quickstart() {
  return (
    <div className="article mx-auto max-w-4xl px-6 py-16">
      <p className="kicker">From demo to your database</p>
      <h1 className="text-4xl font-semibold text-brand-text">
        Run the same review locally
      </h1>
      <p>
        Use a disposable local MongoDB 7 replica set. Docker, Go 1.26.6+ and
        Python 3.10+ are required for this source workflow. The browser demo
        never supplies native MongoDB credentials.
      </p>
      <h2>1 · Start the local engine</h2>
      <p>
        These commands create a new disposable local replica set using the
        current MongoDB 7 patch image. Use a supported, current patch version
        for production. If doctor reports no primary yet, wait for election and
        run doctor again. Keep the console process running: it manages capture
        and expiry for API-created sandboxes.
      </p>
      <pre>
        <code>{`git clone --branch v${product.version} https://github.com/argon-lab/argon.git
cd argon
(cd cli && go build -o ../bin/argon .)
docker run -d --name argon-mongo -p 127.0.0.1:27017:27017 mongo:7 --replSet rs0
docker exec argon-mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
export MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0'
./bin/argon doctor
./bin/argon console --no-browser`}</code>
      </pre>
      <p>
        <a href={product.guide}>Open the complete, tested setup commands →</a>
      </p>
      <h2>2 · Run the two-agent order review</h2>
      <p>
        In a second terminal, run the example against the console API. The
        console listens on port 1818 by default. For an authenticated
        deployment, set ARGON_API_TOKEN locally.
      </p>
      <pre>
        <code>{`git clone --branch v${product.sdkVersion} https://github.com/argon-lab/argon-agents.git
cd argon-agents
python3 -m venv .venv
. .venv/bin/activate
pip install -e .
ARGON_API_URL=http://127.0.0.1:1818 python examples/two_agent_review.py`}</code>
      </pre>
      <p>
        The example creates its own project, pins the $49 order, compares $44
        and $1 proposals, verifies a conflict, then checks the accepted and
        restored data. It uses native PyMongo writes with a separate actor per
        branch.
      </p>
      <h2>3 · Inspect the result</h2>
      <p>
        Open <a href="http://127.0.0.1:1818">your local console</a>, find the
        printed project, and inspect its branch history and merge plans. An LSN
        is a position in that history. HEAD is the latest recorded position;
        BASE is where a branch forked.
      </p>
      <p>
        Want CLI-only sandboxes? Keep <code>argon watch</code> running and
        schedule <code>argon sandbox sweep</code>. Historical queries and undo
        depend on retained data and complete capture images. See{" "}
        <a href="/features#capabilities">the capability matrix</a> before
        connecting a real workload.
      </p>
    </div>
  );
}
