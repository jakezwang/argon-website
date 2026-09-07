import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const release = "2.1.1";
const origin = process.env.SITE_URL || "http://127.0.0.1:13000";
const out = process.env.ARTIFACT_DIR || "/tmp/argon-website-checks";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
const events = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (r.url().endsWith("/api/events")) events.push(r.postDataJSON());
});
try {
  for (const route of [
    "/",
    "/agents",
    "/features",
    "/demo",
    "/about",
    "/quickstart",
    "/privacy",
    "/faq",
    "/blog",
  ]) {
    const response = await page.goto(origin + route);
    assert.equal(response.status(), 200, route);
    assert.ok(
      await page.locator("h1").innerText(),
      `${route} meaningful heading`,
    );
    assert.equal(
      await page.locator("[data-nextjs-dialog],vite-error-overlay").count(),
      0,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${route} desktop overflow`,
    );
  }
  await page.goto(origin);
  const home = await page.locator("body").innerText();
  assert.ok(home.includes(`Published release: v${release}`));
  assert.ok(home.includes(`npm install -g argonctl@${release}`));
  const structured = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  assert.ok(
    structured.some((text) => text.includes(`"softwareVersion":"${release}"`)),
  );
  assert.equal(
    await page
      .getByRole("link", { name: "Open demo", exact: true })
      .first()
      .getAttribute("href"),
    "https://console.argonlabs.tech",
  );
  await page
    .getByRole("link", { name: "Start locally", exact: true })
    .first()
    .click();
  await page.waitForURL("**/quickstart");
  const quickstart = await page.locator("body").innerText();
  assert.ok(quickstart.includes(`git clone --branch v${release}`));
  assert.ok(quickstart.includes("git clone --branch v0.2.0"));
  assert.equal(
    await page
      .getByRole("link", { name: "Open the complete, tested setup commands →" })
      .getAttribute("href"),
    `https://github.com/argon-lab/argon/blob/v${release}/docs/QUICK_START.md`,
  );
  assert.equal(events.length, 0, "opt-out sends nothing");
  await page.goto(origin);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("link", { name: "Start locally", exact: true })
    .first()
    .click();
  await page.waitForURL("**/quickstart");
  assert.deepEqual(events, [{ event: "quickstart_opened" }]);
  await page.goto(origin);
  await page.screenshot({ path: `${out}/home-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/agents",
    "/features",
    "/demo",
    "/about",
    "/quickstart",
  ]) {
    await page.goto(origin + route);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${route} mobile overflow`,
    );
    await page.screenshot({
      path: `${out}/${route.slice(1) || "home"}-mobile.png`,
      fullPage: true,
    });
  }
  await page.goto(origin);
  await page.getByRole("button", { name: "Open main menu" }).click();
  await page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Quickstart", exact: true })
    .click();
  await page.waitForURL("**/quickstart");
  for (const [data, status] of [
    [{ event: "demo_opened" }, 204],
    [{ event: "demo_opened", project: "secret" }, 400],
    [{ event: "secret" }, 400],
  ]) {
    const response = await context.request.post(origin + "/api/events", {
      data,
    });
    assert.equal(response.status(), status);
  }
  assert.equal(
    (
      await context.request.post(origin + "/api/events", {
        data: "x".repeat(200),
      })
    ).status(),
    413,
  );
  assert.equal(
    (
      await context.request.post(origin + "/api/events", {
        data: { event: "demo_opened" },
        headers: { origin: "https://other.example" },
      })
    ).status(),
    403,
  );
  const dnt = await browser.newContext();
  await dnt.addInitScript(() => {
    Object.defineProperty(navigator, "doNotTrack", { value: "1" });
    localStorage.setItem("argon.analytics", "yes");
  });
  const dntPage = await dnt.newPage();
  let dntEvents = 0;
  dntPage.on("request", (r) => {
    if (r.url().endsWith("/api/events")) dntEvents++;
  });
  await dntPage.goto(origin);
  await dntPage
    .getByRole("link", { name: "Start locally", exact: true })
    .first()
    .click();
  await dntPage.waitForURL("**/quickstart");
  assert.equal(dntEvents, 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop/mobile routes, CTA navigation, no overflow/errors, opt-in event schema, origin and DNT checks",
  );
} finally {
  await browser.close();
}
