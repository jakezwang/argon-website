import { pageMetadata } from "../metadata";
import { product } from "../product";
export const metadata = pageMetadata(
  "Investors",
  "Argon is the versioning layer for MongoDB, built for the agent era \u2014 the open-source engine for branching, time travel, and undoable databases.",
  "/investors",
);

export default function InvestorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Investors</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-brand-text">
        The versioning layer for MongoDB, built for the agent era
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Postgres has Neon. MySQL has PlanetScale. MongoDB — the default database
        of a generation of application developers — has no equivalent. Argon
        fills that gap, at the moment AI agents make disposable, auditable,
        undoable databases a necessity.
      </p>

      <section className="mt-14 grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-2">
        <div className="bg-brand-dark p-6">
          <h3 className="font-medium text-brand-text">Where it stands</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-text-darker">
            <li>
              Open-source engine (MIT), v{product.version} shipped: branching,
              time travel, data PRs, per-actor undo
            </li>
            <li>
              Agent surface live: MCP server, TTL sandboxes, dataset pins,
              Python SDK {product.sdkVersion} available from its Git release
            </li>
            <li>
              Public benchmark suite separates metadata costs from checkout,
              capture and end-to-end workflows
            </li>
            <li>
              Real-driver compatibility validated in CI (pymongo, mongoose)
            </li>
          </ul>
        </div>
        <div className="bg-brand-dark p-6">
          <h3 className="font-medium text-brand-text">Where it goes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-text-darker">
            <li>
              Model: open-source core, managed cloud on top — the path Neon
              validated
            </li>
            <li>
              Market: MongoDB users needing versioning; AI/ML teams needing
              sandboxes and reproducible evals
            </li>
            <li>
              Wedge: the undo button for AI agents — a safety primitive every
              agent deployment needs
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14 border-t border-brand-edge pt-10">
        <p className="leading-8 text-brand-text-darker">
          Seeking strategic investors to scale the engine into a managed
          service. For the deck and a conversation:
        </p>
        <div className="mt-6">
          <a href="mailto:jake.wang@argonlabs.tech" className="btn-solid">
            jake.wang@argonlabs.tech
          </a>
        </div>
      </section>
    </div>
  );
}
