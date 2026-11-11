import { pageMetadata } from "../metadata";
import { product } from "../product";
export const metadata = pageMetadata(
  "Investors",
  "Argon is the versioning layer for MongoDB, built for the agent era \u2014 the open-source engine for branching, time travel, and undoable databases.",
  "/investors",
);

export default function InvestorsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-14 sm:pt-20">
      <h1 className="page-title">
        The versioning layer for MongoDB, built for the agent era
      </h1>
      <p className="lede mt-6 max-w-2xl">
        Postgres has Neon. MySQL has PlanetScale. MongoDB — the default database
        of a generation of application developers — has no equivalent. Argon
        fills that gap, at the moment AI agents make disposable, auditable,
        undoable databases a necessity.
      </p>

      <section className="mt-16 grid gap-5 sm:grid-cols-2">
        <div className="panel p-8">
          <h2 className="text-xl font-semibold text-brand-text [font-stretch:100%]">
            Where it stands
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-6 text-brand-text-darker marker:text-brand-edge-strong">
            <li>
              Open-source engine (MIT), v{product.version} shipped: branching,
              time travel, data PRs, per-actor undo
            </li>
            <li>
              Agent surface live: MCP server, TTL sandboxes, dataset pins,
              Python SDK {product.sdkVersion} on PyPI
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
        <div className="panel p-8">
          <h2 className="text-xl font-semibold text-brand-text [font-stretch:100%]">
            Where it goes
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-6 text-brand-text-darker marker:text-brand-edge-strong">
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

      <section className="mt-16 border-t border-brand-edge pt-10">
        <p className="lede max-w-2xl">
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
