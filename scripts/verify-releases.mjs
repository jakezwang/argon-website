import assert from "node:assert/strict";
import release from "../app/release.json" with { type: "json" };

async function read(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.ok(response.ok, `${url}: ${response.status}`);
  return response;
}
const [npm, engineGuide, engineCLI, sdkMetadata, example] = await Promise.all([
  read(`https://registry.npmjs.org/argonctl/${release.version}`).then((r) =>
    r.json(),
  ),
  read(
    `https://raw.githubusercontent.com/argon-lab/argon/v${release.version}/docs/QUICK_START.md`,
  ).then((r) => r.text()),
  read(
    `https://raw.githubusercontent.com/argon-lab/argon/v${release.version}/docs/CLI.md`,
  ).then((r) => r.text()),
  read(
    `https://raw.githubusercontent.com/argon-lab/argon-agents/v${release.sdkVersion}/pyproject.toml`,
  ).then((r) => r.text()),
  read(
    `https://raw.githubusercontent.com/argon-lab/argon-agents/v${release.sdkVersion}/examples/two_agent_review.py`,
  ).then((r) => r.text()),
]);
assert.equal(npm.version, release.version);
assert.ok(engineGuide.includes("argon"));
assert.ok(engineCLI.includes("--source-quiesced"));
assert.ok(engineCLI.includes("argon import cleanup"));
assert.ok(sdkMetadata.includes(`version = "${release.sdkVersion}"`));
assert.ok(
  example.includes("reviewed_price") && example.includes("restored_price"),
);
console.log(
  `PASS: npm CLI ${release.version}, engine guide/import contract, SDK Git ${release.sdkVersion}, and matching review example are public`,
);
