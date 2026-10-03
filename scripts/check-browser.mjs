// Optional regression checks. Use an existing Playwright installation; no runtime dependency.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { products } from "../src/data.mjs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE
    ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
    : "playwright"
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE
    ? { executablePath: process.env.BROWSER_EXECUTABLE }
    : {}),
});
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const out = "audit/screenshots/refinement";
await mkdir(out, { recursive: true });
const errors = [],
  failures = [],
  checks = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
async function check(name, action) {
  try {
    await action();
    checks.push(name);
    console.log("PASS", name);
  } catch (error) {
    failures.push({ name, error: error.message });
    console.log("FAIL", name, error.message.slice(0, 600));
  }
}
async function go(route = "/") {
  await page.goto(base + route);
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow() {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return {
      width,
      total: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width &&
            (r.right > width + 1 || r.left < -1) &&
            !el.closest('.filters,.sr-only,[aria-hidden="true"],template') &&
            getComputedStyle(el).visibility !== "hidden"
          );
        })
        .slice(0, 6)
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          text: el.textContent.slice(0, 80),
        })),
    };
  });
}
await check("Viewport and route matrix", async () => {
  const routes = [
    "/",
    "/about/",
    "/products/",
    "/manufacturing/",
    "/public-information/",
    "/news/",
    "/gallery/",
    "/contact/",
    ...products.map((p) => `/products/${p.slug}/`),
    "/404.html",
  ];
  const overflows = [];
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    for (const route of routes) {
      await go(route);
      const overflow = await noOverflow();
      if (overflow.total > overflow.width + 1)
        overflows.push({ route, ...overflow });
      assert.equal(await page.locator("h1").count(), 1, route);
      assert.equal(await page.locator("main").count(), 1, route);
    }
  }
  assert.deepEqual(overflows, []);
});
await check(
  "Single-row filters, category query and accessible legend",
  async () => {
    await page.setViewportSize({ width: 320, height: 844 });
    for (const route of ["/", "/products/"]) {
      await go(route + "?category=utility");
      const buttons = page.locator("[data-filter]");
      const rows = await buttons.evaluateAll((items) =>
        items.map((el) => ({ top: el.offsetTop, height: el.offsetHeight })),
      );
      assert.equal(new Set(rows.map((r) => r.top)).size, 1);
      assert.ok(rows.every((r) => r.height >= 44));
      assert.equal(
        await page
          .locator('[data-filter="utility"]')
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page.locator(".product-card:not([hidden])").count(),
        route === "/" ? 1 : 3,
      );
      await buttons.first().click();
      await page.locator('[data-filter="goods"]').click();
      assert.equal(
        await page.locator(".product-card:not([hidden])").count(),
        route === "/" ? 1 : 4,
      );
      const chosen = await page.locator('[data-filter="goods"]').boundingBox();
      assert.ok(chosen.x >= 0 && chosen.x + chosen.width <= 320);
      await page.locator(".spec-legend summary").click();
      assert.match(
        await page.locator(".spec-legend").innerText(),
        /not payload/,
      );
      assert.equal(
        await page.locator(".product-specs dt.sr-only").count(),
        route === "/" ? 6 : 18,
      );
    }
  },
);
await check("Mobile menu, grouping, Escape and focus restoration", async () => {
  await go();
  await page.locator(".menu-toggle").click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Home",
  );
  await page
    .locator(".nav-dropdown summary")
    .filter({ hasText: "Public information" })
    .click();
  assert.ok(
    await page
      .getByRole("link", { name: "Downloads", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  assert.ok(
    await page
      .locator(".menu-toggle")
      .evaluate((el) => el === document.activeElement),
  );
  await page.locator(".menu-toggle").click();
  await page
    .locator("#primary-nav > a")
    .filter({ hasText: "Our vehicles" })
    .click();
  assert.ok(page.url().endsWith("/products/"));
});
await check("Search, empty result, Escape and focus restoration", async () => {
  await page.locator(".search-open").click();
  await page.locator("#site-search").fill("Neem");
  assert.equal(await page.locator(".search-results a").count(), 1);
  assert.match(
    await page.locator(".search-results a").getAttribute("href"),
    /kerala-neem-g/,
  );
  await page.locator("#site-search").fill("no-such-vehicle");
  assert.match(
    await page.locator(".search-status").textContent(),
    /No results/,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      !document.querySelector(".search-dialog").open &&
      document.activeElement.matches(".search-open"),
  );
  assert.ok(
    await page
      .locator(".search-open")
      .evaluate((el) => el === document.activeElement),
  );
});
await check("Gallery enlargement and dismissal", async () => {
  await go("/gallery/");
  await page.locator("[data-gallery-image]").first().click();
  assert.ok(await page.locator(".gallery-dialog").evaluate((el) => el.open));
  assert.ok(
    await page
      .locator(".gallery-dialog img")
      .evaluate((el) => el.naturalWidth > 0),
  );
  await page.keyboard.press("Escape");
  assert.ok(
    await page
      .locator("[data-gallery-image]")
      .first()
      .evaluate((el) => el === document.activeElement),
  );
});
await check(
  "Enquiry preselection, validation and local draft only",
  async () => {
    await go("/contact/?vehicle=Kerala%20Neem%20G#enquiry");
    assert.equal(
      await page.locator('[name="vehicle"]').inputValue(),
      "Kerala Neem G",
    );
    await page.locator('[name="name"]').fill("Demo Visitor");
    await page.locator('[name="email"]').fill("invalid");
    assert.equal(
      await page.locator('[name="email"]').evaluate((el) => el.validity.valid),
      false,
    );
    await page.locator('[name="email"]').fill("visitor@example.com");
    await page.locator('[name="phone"]').fill("9999999999");
    await page
      .locator('[name="message"]')
      .fill("Please share the current passenger vehicle specification.");
    let submissions = 0;
    page.on("request", (req) => {
      if (req.method() === "POST") submissions++;
    });
    await page
      .getByRole("button", { name: "Prepare enquiry", exact: true })
      .click();
    assert.ok(await page.locator(".enquiry-preview").isVisible());
    assert.match(
      await page.locator(".form-status").textContent(),
      /Nothing has been sent/,
    );
    assert.ok(
      await page
        .locator("[data-email-draft]")
        .getAttribute("href")
        .then((href) => href.startsWith("mailto:")),
    );
    assert.equal(submissions, 0);
  },
);
await check("200% text across all routes at 320 and 1440", async () => {
  const overflows = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/about/",
      "/products/",
      "/manufacturing/",
      "/public-information/",
      "/news/",
      "/gallery/",
      "/contact/",
      ...products.map((p) => `/products/${p.slug}/`),
    ]) {
      await go(route);
      await page.locator("[data-text-size]").click();
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).fontSize,
        ),
        "32px",
      );
      const result = await noOverflow();
      if (result.total > result.width + 1) overflows.push({ route, ...result });
    }
  }
  assert.deepEqual(overflows, []);
});
await check("Hero slide geometry, controls and image framing", async () => {
  for (const [width, height] of [
    [320, 844],
    [375, 844],
    [390, 844],
    [768, 900],
    [1024, 900],
    [1440, 900],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await go();
    const initial = await page.locator(".hero-carousel").boundingBox();
    for (let i = 0; i < 3; i++) {
      await page.locator(`[data-carousel-position="${i}"]`).click();
      await page.waitForFunction(
        (index) =>
          document
            .querySelector(`[data-slide="${index}"]`)
            .hasAttribute("data-active"),
        i,
      );
      assert.equal(
        await page
          .locator(".hero-carousel")
          .boundingBox()
          .then((r) => r.height),
        initial.height,
      );
      assert.equal(
        await page
          .locator('[data-slide][aria-hidden="true"]')
          .evaluateAll((slides) => slides.every((el) => el.inert)),
        true,
      );
      assert.ok(
        await page
          .locator("[data-slide][data-active] img")
          .evaluate((el) => el.naturalWidth > 0),
      );
      const controls = await page.locator(".hero-controls").boundingBox();
      const actions = await page
        .locator("[data-active] .hero-actions")
        .boundingBox();
      assert.ok(
        actions.y + actions.height <= controls.y + 1,
        `${width}: actions overlap controls`,
      );
    }
  }
});
await check(
  "Autoplay, hover, persistent focus/manual pause, swipe and explicit resume",
  async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await go();
    await page.clock.install();
    await page.mouse.move(0, 0);
    await page.clock.runFor(7100);
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
    assert.equal(
      await page.locator("[data-carousel-status]").textContent(),
      "",
    );
    await page.mouse.move(700, 500);
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "1",
    );
    await page.mouse.move(0, 0);
    await page.locator(".hero-carousel").focus();
    await page.locator(".search-open").focus();
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "1",
    );
    await page.locator(".hero-carousel").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="2"]').hasAttribute("data-active"),
    );
    assert.match(
      await page.locator("[data-carousel-status]").textContent(),
      /3 of 3/,
    );
    await page.locator(".hero-carousel").dispatchEvent("pointerdown", {
      pointerId: 9,
      pointerType: "touch",
      clientX: 250,
      clientY: 220,
    });
    await page.locator(".hero-carousel").dispatchEvent("pointerup", {
      pointerId: 9,
      pointerType: "touch",
      clientX: 100,
      clientY: 230,
    });
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="0"]').hasAttribute("data-active"),
    );
    await page.locator(".search-open").focus();
    await page.clock.runFor(15000);
    assert.equal(
      await page.locator("[data-active]").getAttribute("data-slide"),
      "0",
    );
    await page.locator("[data-carousel-pause]").click();
    await page.mouse.move(0, 0);
    await page.clock.runFor(7100);
    await page.waitForFunction(() =>
      document.querySelector('[data-slide="1"]').hasAttribute("data-active"),
    );
  },
);
await check(
  "Trust rotation, stable slots, unique items, offscreen pause and user pause",
  async () => {
    await go();
    await page.mouse.move(0, 0);
    await page.locator(".trust-strip").scrollIntoViewIfNeeded();
    const initial = await page.locator(".trust-strip").boundingBox();
    const start = await page.locator(".trust-content strong").allTextContents();
    await page.clock.runFor(6400);
    const changed = await page
      .locator(".trust-content strong")
      .allTextContents();
    assert.notDeepEqual(changed, start);
    assert.equal(new Set(changed).size, 3);
    assert.equal(
      await page
        .locator(".trust-strip")
        .boundingBox()
        .then((r) => r.height),
      initial.height,
    );
    await page.locator("[data-trust-pause]").click();
    await page.mouse.move(0, 0);
    await page.clock.runFor(15000);
    assert.deepEqual(
      await page.locator(".trust-content strong").allTextContents(),
      changed,
    );
    await page.locator("[data-trust-pause]").click();
    await page.mouse.move(0, 0);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.clock.runFor(15000);
    assert.deepEqual(
      await page.locator(".trust-content strong").allTextContents(),
      changed,
    );
  },
);
await check("Offscreen hero and simulated hidden-tab pause", async () => {
  await go();
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
    scrollTo(0, document.body.scrollHeight);
  });
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.locator(".trust-strip").scrollIntoViewIfNeeded();
  const start = await page.locator(".trust-content strong").allTextContents();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(15000);
  assert.deepEqual(
    await page.locator(".trust-content strong").allTextContents(),
    start,
  );
});
await check("Reduced motion disables both rotations", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await go();
  assert.ok(await page.locator("[data-carousel-pause]").isDisabled());
  assert.ok(await page.locator("[data-trust-pause]").isDisabled());
  await page.clock.runFor(15000);
  assert.equal(
    await page.locator("[data-active]").getAttribute("data-slide"),
    "0",
  );
  await page.locator(".trust-strip").scrollIntoViewIfNeeded();
  await page.clock.runFor(15000);
  assert.deepEqual(
    await page.locator(".trust-content strong").allTextContents(),
    ["Since 1978", "All-electric mobility", "Precision manufacturing"],
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
});
await check("Official notice and nine detail specifications", async () => {
  await go("/news/");
  assert.match(
    await page.locator(".closed-badge").textContent(),
    /Applications closed/,
  );
  assert.match(
    await page
      .getByRole("link", { name: "Read official notification" })
      .getAttribute("href"),
    /NOTIFICATION_1789034956\.pdf/,
  );
  for (const product of products) {
    await go(`/products/${product.slug}/`);
    assert.equal((await page.locator("h1").textContent()).trim(), product.name);
    assert.match(
      await page.locator(".detail-specs").textContent(),
      new RegExp(product.length),
    );
    assert.match(
      await page.locator(".detail-specs").textContent(),
      new RegExp(product.weight),
    );
  }
});
await check("Static first slide without JavaScript", async () => {
  const staticPage = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await staticPage.goto(base);
  assert.equal(await staticPage.locator(".hero-slide:visible").count(), 1);
  assert.ok(
    await staticPage
      .getByRole("link", { name: "Discover our vehicles", exact: true })
      .isVisible(),
  );
  assert.equal(await staticPage.locator(".product-card").count(), 3);
  await staticPage.screenshot({ path: out + "/no-js-mobile.png" });
  await staticPage.close();
});
await check("Representative screenshots", async () => {
  const shots = await browser.newPage();
  for (const [name, width, height, route] of [
    ["home-desktop", 1440, 900, "/"],
    ["home-mobile", 390, 844, "/"],
    ["home-320", 320, 844, "/"],
    ["home-tablet", 768, 900, "/"],
    ["home-1024", 1024, 900, "/"],
    ["home-full", 1440, 900, "/"],
    ["catalog-desktop", 1440, 900, "/products/"],
    ["catalog-mobile", 375, 844, "/products/"],
    ["about-desktop", 1440, 900, "/about/"],
    ["news-desktop", 1440, 900, "/news/"],
    ["news-mobile", 390, 844, "/news/"],
    ["landscape", 844, 390, "/"],
  ]) {
    await shots.setViewportSize({ width, height });
    await shots.goto(base + route);
    await shots.evaluate(async () => {
      await document.fonts.ready;
      // Load lazy photographs for full-page captures; deferred carousel slides stay deferred.
      await Promise.all(
        [...document.querySelectorAll("img[src]")].map((img) => {
          img.loading = "eager";
          return img.decode().catch(() => {});
        }),
      );
    });
    assert.ok(
      await shots
        .locator("img[src]")
        .evaluateAll((images) => images.every((img) => img.naturalWidth > 0)),
      name + ": missing photograph",
    );
    await shots.screenshot({
      path: `${out}/${name}.png`,
      fullPage:
        name === "home-full" ||
        (!name.startsWith("home") && name !== "landscape"),
    });
  }
  await shots.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await shots.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await shots.goto(base);
    for (const index of [1, 2]) {
      await shots.locator(`[data-carousel-position="${index}"]`).click();
      await shots.waitForFunction(
        (i) =>
          document
            .querySelector(`[data-slide="${i}"]`)
            .hasAttribute("data-active"),
        index,
      );
      await shots.evaluate(() => scrollTo(0, 0));
      await shots.screenshot({ path: `${out}/hero-${index}-${width}.png` });
    }
  }
  await shots.goto(base);
  await shots.locator("[data-text-size]").click();
  await shots.screenshot({ path: `${out}/text-200-desktop.png` });
  await shots.close();
});
await browser.close();
await writeFile(
  "audit/browser-results.json",
  JSON.stringify({ date: "2026-10-03", checks, failures, errors }, null, 2),
);
console.log(
  `${checks.length} checks passed; ${failures.length} failures; ${errors.length} browser errors.`,
);
if (failures.length || errors.length) process.exitCode = 1;
