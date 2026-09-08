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
function collectErrors(target) {
  target.on("pageerror", (error) => errors.push(error.message));
}
collectErrors(page);
page.on("request", (request) => {
  if (request.url().endsWith("/api/events"))
    events.push(request.postDataJSON());
});

async function assertNoOverflow(target, description) {
  assert.ok(
    await target.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    `${description}: no page-level horizontal overflow`,
  );
}

async function assertTouchTarget(locator, description) {
  const box = await locator.boundingBox();
  assert.ok(box && box.width >= 44 && box.height >= 44, description);
}

async function assertDocumentPrices(workflow, main, planner) {
  assert.equal(
    await workflow
      .getByRole("group", { name: "main document", exact: true })
      .locator("dd")
      .innerText(),
    main,
  );
  assert.equal(
    await workflow
      .getByRole("group", { name: "planner document", exact: true })
      .locator("dd")
      .innerText(),
    planner,
  );
}

async function verifyWorkflow() {
  await page.goto(origin);
  const workflow = page.getByRole("region", {
    name: "Illustrated agent workflow",
  });
  const steps = workflow.getByRole("group", { name: "Workflow steps" });
  const labels = ["Branch", "Test", "Time travel", "Review", "Merge"];
  assert.ok(
    await workflow
      .getByRole("button", { name: "Previous", exact: true })
      .isDisabled(),
  );
  for (const [index, label] of labels.entries()) {
    const step = steps.getByRole("button", { name: label, exact: true });
    await step.click();
    assert.equal(await step.getAttribute("aria-pressed"), "true");
    await assertDocumentPrices(
      workflow,
      index === 4 ? "44" : "49",
      index === 0 ? "49" : "44",
    );
    if (label === "Time travel") {
      await workflow
        .getByText("Historical read", { exact: true })
        .waitFor({ state: "visible" });
      await workflow
        .getByText("price: 49", { exact: true })
        .waitFor({ state: "visible" });
    }
  }
  assert.ok(
    await workflow
      .getByRole("button", { name: "Next", exact: true })
      .isDisabled(),
  );
  await workflow.getByRole("button", { name: "Previous", exact: true }).click();
  assert.equal(
    await steps
      .getByRole("button", { name: "Review", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await assertDocumentPrices(workflow, "49", "44");
  await workflow.getByRole("button", { name: "Next", exact: true }).click();
  await assertDocumentPrices(workflow, "44", "44");

  await steps.getByRole("button", { name: "Branch", exact: true }).focus();
  await page.keyboard.press("Space");
  await assertDocumentPrices(workflow, "49", "49");
  await page.keyboard.press("Tab");
  const testStep = steps.getByRole("button", { name: "Test", exact: true });
  assert.ok(
    await testStep.evaluate((element) => element === document.activeElement),
  );
  await page.keyboard.press("Enter");
  await assertDocumentPrices(workflow, "49", "44");

  const reduced = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  try {
    const reducedPage = await reduced.newPage();
    collectErrors(reducedPage);
    await reducedPage.goto(origin);
    const reducedWorkflow = reducedPage.getByRole("region", {
      name: "Illustrated agent workflow",
    });
    const reducedSteps = reducedWorkflow.getByRole("group", {
      name: "Workflow steps",
    });

    await steps.getByRole("button", { name: "Branch", exact: true }).click();
    await workflow
      .getByRole("button", { name: "Play workflow", exact: true })
      .click();
    await testStep
      .locator('xpath=self::*[@aria-pressed="true"]')
      .waitFor({ timeout: 7000 });
    await assertDocumentPrices(workflow, "49", "44");
    await steps
      .getByRole("button", { name: "Time travel", exact: true })
      .click();
    await workflow
      .getByRole("button", { name: "Play workflow", exact: true })
      .waitFor({ state: "visible" });
    assert.equal(
      await workflow
        .getByRole("button", { name: "Pause workflow", exact: true })
        .count(),
      0,
      "Manual selection pauses playback",
    );

    // The other page remained open through a complete playback interval.
    assert.equal(
      await reducedSteps
        .getByRole("button", { name: "Branch", exact: true })
        .getAttribute("aria-pressed"),
      "true",
      "Reduced motion does not auto-advance",
    );
    await assertDocumentPrices(reducedWorkflow, "49", "49");
    for (let index = 1; index < labels.length; index++) {
      const next = reducedWorkflow.getByRole("button", {
        name: "Next",
        exact: true,
      });
      await assertTouchTarget(
        next,
        "Workflow controls have 44px touch targets",
      );
      await next.focus();
      await reducedPage.keyboard.press("Enter");
      assert.equal(
        await reducedSteps
          .getByRole("button", { name: labels[index], exact: true })
          .getAttribute("aria-pressed"),
        "true",
        "Reduced motion supports manual traversal",
      );
      await assertDocumentPrices(
        reducedWorkflow,
        index === 4 ? "44" : "49",
        "44",
      );
    }
    await reducedWorkflow
      .getByRole("button", { name: "Previous", exact: true })
      .click();
    await assertDocumentPrices(reducedWorkflow, "49", "44");
    await assertNoOverflow(reducedPage, "Reduced-motion workflow on mobile");
  } finally {
    await reduced.close();
  }
}

async function verifyClipboard() {
  const copyContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await copyContext.addInitScript(() => {
    window.__copiedText = "";
    window.__clipboardDenied = false;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          if (window.__clipboardDenied) throw new Error("Clipboard denied");
          window.__copiedText = text;
        },
      },
    });
  });
  try {
    const copyPage = await copyContext.newPage();
    collectErrors(copyPage);
    await copyPage.goto(origin);
    const npmCopy = copyPage.getByRole("button", {
      name: "Copy Install the CLI with npm",
      exact: true,
    });
    await assertTouchTarget(npmCopy, "Copy control has a 44px touch target");
    await npmCopy.click();
    await copyPage.waitForFunction(() => window.__copiedText.length > 0);
    assert.equal(
      await copyPage.evaluate(() => window.__copiedText),
      `npm install -g argonctl@${release}`,
      "Copy receives the complete command without a shell prompt",
    );
    assert.equal(await npmCopy.innerText(), "Copied", "Visible copy success");

    const installMethods = copyPage.getByRole("group", {
      name: "Installation method",
    });
    await installMethods
      .getByRole("button", { name: "Homebrew", exact: true })
      .click();
    await copyPage
      .getByRole("button", {
        name: "Copy Install the CLI with Homebrew",
        exact: true,
      })
      .click();
    assert.equal(
      await copyPage.evaluate(() => window.__copiedText),
      "brew install argon-lab/tap/argonctl",
      "Changing install method also changes the copied command",
    );

    await installMethods
      .getByRole("button", { name: "Python SDK", exact: true })
      .click();
    const pythonCopy = copyPage.getByRole("button", {
      name: "Copy Install the Python SDK in a virtual environment",
      exact: true,
    });
    await copyPage.evaluate(() => {
      window.__clipboardDenied = true;
    });
    await pythonCopy.click();
    const fallback = copyPage.getByText(
      "Clipboard unavailable. Code selected; press ⌘C or Ctrl+C to copy.",
      { exact: true },
    );
    await fallback.waitFor({ state: "visible" });
    const selectedCode = await copyPage.evaluate(() =>
      window.getSelection()?.toString(),
    );
    assert.ok(selectedCode?.includes("python3 -m pip install"));
    assert.ok(selectedCode?.includes("@v0.2.0"));
    assert.ok(
      selectedCode?.includes("\n"),
      "Clipboard fallback selects every line",
    );
    await assertNoOverflow(copyPage, "Long Python install command on mobile");
    await copyPage.screenshot({
      path: `${out}/copy-fallback-mobile.png`,
      fullPage: true,
    });
  } finally {
    await copyContext.close();
  }
}

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
    await assertNoOverflow(page, `${route} desktop`);
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
  await page
    .getByRole("link", { name: "Try live demo", exact: true })
    .first()
    .waitFor({ state: "visible" });
  await page
    .getByRole("link", { name: "How it works", exact: true })
    .first()
    .waitFor({ state: "visible" });
  for (const link of await page
    .getByRole("link", { name: "Try live demo", exact: true })
    .all()) {
    assert.equal(
      await link.getAttribute("href"),
      "https://console.argonlabs.tech",
    );
  }
  for (const link of await page
    .getByRole("link", { name: "How it works", exact: true })
    .all()) {
    assert.equal(await link.getAttribute("href"), "/demo");
  }
  for (const anchor of ["mcp", "python", "rest"]) {
    const link = page.locator(`a[href="/agents#${anchor}"]`).first();
    await link.click();
    await page.waitForURL(`**/agents#${anchor}`);
    const target = page.locator(`#${anchor}`);
    await target.waitFor({ state: "visible" });
    assert.ok(
      await target.locator("h2,h3").first().innerText(),
      `${anchor} has a direct setup section`,
    );
    await page.goto(origin);
  }

  await page
    .getByRole("link", { name: "Start locally", exact: true })
    .first()
    .click();
  await page.waitForURL("**/quickstart");
  const quickstart = await page.locator("body").innerText();
  assert.ok(
    quickstart.includes(`npm install -g argonctl@${release}`),
    "Quickstart starts with the published CLI",
  );
  assert.ok(
    !quickstart.includes(`git clone --branch v${release}`),
    "Source build is not part of the default visible path",
  );
  const sourceDetails = page
    .locator("details")
    .filter({ hasText: `git clone --branch v${release}` });
  assert.equal(
    await sourceDetails.count(),
    1,
    "Source workflow remains available",
  );
  assert.equal(await sourceDetails.getAttribute("open"), null);
  await sourceDetails.locator("summary").click();
  assert.ok((await sourceDetails.getAttribute("open")) !== null);
  assert.ok(
    (await sourceDetails.innerText()).includes(
      `git clone --branch v${release}`,
    ),
  );
  assert.ok(
    (await page.locator("body").innerText()).includes(
      "git clone --branch v0.2.0",
    ),
  );
  assert.equal(
    await page
      .getByRole("link", { name: "complete setup guide", exact: true })
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
  await verifyWorkflow();
  await verifyClipboard();

  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/agents",
      "/features",
      "/demo",
      "/about",
      "/quickstart",
    ]) {
      await page.goto(origin + route);
      await assertNoOverflow(page, `${route} at ${width}px`);
      if (route === "/demo" && width <= 390) {
        for (const name of ["Agent & eval workflow", "MCP · REST · proxy"]) {
          const tab = page.getByRole("button", { name, exact: true });
          await tab.click();
          assert.equal(await tab.getAttribute("aria-pressed"), "true");
          await assertTouchTarget(tab, `${name}: mobile touch target`);
          await assertNoOverflow(page, `${name} at ${width}px`);
        }
        for (const name of [
          /^MCP server/,
          /^REST API/,
          /^Wire proxy/,
          /^argon-agents/,
        ]) {
          await page.getByRole("button", { name }).click();
          await assertNoOverflow(page, `${name} at ${width}px`);
        }
      }
      if (width === 390) {
        await page.screenshot({
          path: `${out}/${route.slice(1) || "home"}-mobile.png`,
          fullPage: true,
        });
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  const menuButton = page.getByRole("button", {
    name: "Open main menu",
    exact: true,
  });
  await assertTouchTarget(menuButton, "Mobile menu has a 44px touch target");
  await menuButton.focus();
  await page.keyboard.press("Enter");
  const firstMobileLink = page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Agents", exact: true });
  await page.keyboard.press("Tab");
  assert.ok(
    await firstMobileLink.evaluate(
      (element) => element === document.activeElement,
    ),
    "Keyboard reaches the first menu link",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator("#mobile-menu").count(),
    0,
    "Escape closes the mobile menu",
  );
  assert.ok(
    await menuButton.evaluate((element) => element === document.activeElement),
    "Escape restores focus to the menu button",
  );
  await page.keyboard.press("Enter");
  const quickstartLink = page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Quickstart", exact: true });
  await quickstartLink.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/quickstart");
  assert.equal(
    await page.locator("#mobile-menu").count(),
    0,
    "Choosing a route closes the mobile menu",
  );
  assert.equal(await menuButton.getAttribute("aria-expanded"), "false");

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
  collectErrors(dntPage);
  let dntEvents = 0;
  dntPage.on("request", (request) => {
    if (request.url().endsWith("/api/events")) dntEvents++;
  });
  await dntPage.goto(origin);
  await dntPage
    .getByRole("link", { name: "Start locally", exact: true })
    .first()
    .click();
  await dntPage.waitForURL("**/quickstart");
  assert.equal(dntEvents, 0);
  await dnt.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: routes, CTA destinations, integration anchors, CLI/source onboarding, isolated data/history/merge states, manual and reduced-motion workflow, clipboard fallback, responsive layouts, keyboard menu, no page errors, opt-in event schema, origin and DNT checks",
  );
} finally {
  await browser.close();
}
